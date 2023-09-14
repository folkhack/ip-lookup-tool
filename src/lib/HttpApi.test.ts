import { HttpApi } from './HttpApi';
import supertest from 'supertest';
import { Socket } from 'net';

import { IpUtilsLookupInterface, IpUtilsValidationResult, IpAddrInfoResult } from './IpAddrInfoTypes';

// Use a full recreated mock interface with internals to help us test what was called and when
const MockIpAddrUtils = class implements IpUtilsLookupInterface {

    prepped_validate:IpUtilsValidationResult;
    prepped_info:IpAddrInfoResult;

    throw_exception_on_lookup:boolean;
    return_exception_on_lookup:boolean;

    last_fields:string[];

    constructor() {

        this.prepped_validate = {
            success : true,
            errors  : [],
        };

        this.prepped_info = {
            success        : true,
            status_code    : 200,
            query_start_at : new Date,
            query_stop_at  : new Date,
            query_ms       : 50,
            errors         : [],
            exception      : undefined,
            stack_trace    : undefined,

            response: { status : 'success' },

            data: { queried_ip_addr : '' },
        };

        this.throw_exception_on_lookup = false;
        this.return_exception_on_lookup = false;

        this.last_fields = [];
    }

    validate_ip_addr():IpUtilsValidationResult { return this.prepped_validate; }

    get_ip_info( ip_addr:string, fields:string[] ):Promise<IpAddrInfoResult> {

        this.last_fields = fields;

        if( this.throw_exception_on_lookup ) throw new Error( 'Manual thrown error!' );

        if( this.return_exception_on_lookup ) {

            this.prepped_info.exception = new Error( 'Manual thrown error!' );
            return Promise.resolve( this.prepped_info );
        }

        if( this.prepped_info.data ) this.prepped_info.data.queried_ip_addr = ip_addr;
        return Promise.resolve( this.prepped_info );
    }
};

describe( 'HttpApi', () => {

    let api: HttpApi;
    let request: supertest.SuperTest<supertest.Test>;
    let MockIpAddrUtilsLocal = new MockIpAddrUtils;

    beforeEach( () => {

        // Create a new instance before each test
        api = new HttpApi;

        // Setup a new supertest for testing requests
        request = supertest( api.app );

        // Setup the mocked IpAddrUtils for server
        MockIpAddrUtilsLocal = new MockIpAddrUtils;
        api.IpAddrUtils      = MockIpAddrUtilsLocal;
    } );

    it( 'Should start/stop express server', async() => {

        await api.start();

        const socket_client = new Socket;

        await new Promise<void>( ( resolve, reject ) => {

            socket_client.connect( api.port, '127.0.0.1', () => {

                socket_client.end();
                resolve();
            } );

            socket_client.on( 'error', ( error ) => {

                reject( error );
            } );
        } );

        await api.stop();
    } );

    it( 'Should throw error when stopped twice', async() => {

        await api.start();
        await api.stop();

        await expect( api.stop() )
            .rejects
            .toThrow();
    } );

    it( 'Healthcheck success', async() => {

        const response = await request.get( '/' );

        expect( response.status ).toBe( 200 );
        expect( response.body ).toEqual( { success : true } );
    } );

    it( 'should return IP info', async() => {

        const response = await request.get( '/lookup-ip/8.8.8.8' );

        expect( response.status ).toBe( 200 );
        expect( response.body ).toEqual( expect.objectContaining( { success : true } ) );
    } );

    it( 'should specify fields when asked for them', async() => {

        await request.get( '/lookup-ip/8.8.8.8?fields=country,lat,lon' );
        expect( MockIpAddrUtilsLocal.last_fields ).toEqual( [ 'country', 'lat', 'lon' ] );
    } );

    it( 'returns 400 response on own validation error', async() => {

        MockIpAddrUtilsLocal.prepped_validate = {
            success : false,
            errors  : [ 'Test 1', 'Test 2' ],
        };

        const response = await request.get( '/lookup-ip/8.8.8.x' );

        expect( response.status ).toBe( 400 );
        expect( response.body ).toEqual( expect.objectContaining( MockIpAddrUtilsLocal.prepped_validate ) );
    } );

    it( 'returns 400 response on downstream validation error - invalid query', async() => {

        MockIpAddrUtilsLocal.prepped_info.success = false;
        if( MockIpAddrUtilsLocal.prepped_info.response ) MockIpAddrUtilsLocal.prepped_info.response.message = 'invalid query';

        const response = await request.get( '/lookup-ip/8.8.8.x' );

        expect( response.status ).toBe( 400 );
        expect( response.body.success ).toBe( false );
    } );

    it( 'returns 400 response on downstream validation error - private range', async() => {

        MockIpAddrUtilsLocal.prepped_info.success = false;
        if( MockIpAddrUtilsLocal.prepped_info.response ) MockIpAddrUtilsLocal.prepped_info.response.message = 'private range';

        const response = await request.get( '/lookup-ip/8.8.8.x' );

        expect( response.status ).toBe( 400 );
        expect( response.body.success ).toBe( false );
    } );

    it( 'returns 500 response on exception (thrown)', async() => {

        MockIpAddrUtilsLocal.throw_exception_on_lookup = true;

        const response = await request.get( '/lookup-ip/8.8.8.8' );

        expect( response.status ).toBe( 500 );
        expect( response.body.success ).toBe( false );
        expect( response.body.errors ).toEqual( [ 'Unexpected exception occured! Check console/log output for more details' ] );
    } );

    it( 'returns 500 response on exception (returned)', async() => {

        MockIpAddrUtilsLocal.return_exception_on_lookup = true;

        const response = await request.get( '/lookup-ip/8.8.8.8' );

        expect( response.status ).toBe( 500 );
        expect( response.body.success ).toBe( false );
        expect( response.body.errors ).toEqual( [ 'Unexpected exception occured! Check console/log output for more details' ] );
    } );

} );
