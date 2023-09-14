// eslint-disable-next-line n/no-extraneous-import
import { jest } from '@jest/globals';

import { IpApiClient } from './IpApiClient';
import { IpAddrInfoResponse } from './IpAddrInfoTypes';
const Client = new IpApiClient;

let arbitrary_throw = false;

const mocked_fetch_body_template:IpAddrInfoResponse = {
    status        : 'success',
    message       : undefined,
    continent     : 'North America',
    continentCode : 'NA',
    country       : 'United States',
    countryCode   : 'US',
    region        : 'VA',
    regionName    : 'Virginia',
    city          : 'Ashburn',
    district      : '',
    zip           : '20149',
    lat           : 39.03,
    lon           : -77.5,
    timezone      : 'America/New_York',
    offset        : -14400,
    isp           : 'Google LLC',
    org           : 'Google Public DNS',
    as            : 'AS15169 Google LLC',
    asname        : 'GOOGLE',
    reverse       : 'dns.google',
    mobile        : false,
    proxy         : false,
    hosting       : true,
    query         : '8.8.8.8',
};

let mocked_fetch_body  = { ...mocked_fetch_body_template };
let mocked_status_code = 200;

// Mocking the global fetch function
( global.fetch as jest.Mock ) = jest.fn( ( url ) => {

    if( url && typeof url === 'string' && url.includes( 'timeout' ) ) {

        return Promise.reject( new Error( 'Request timed out [mocked]' ) );
    }

    if( arbitrary_throw ) {

        throw new Error( 'Arbitrary throw!' );
    }

    return Promise.resolve( {
        url,
        status : mocked_status_code,
        json   : () => {
            return Promise.resolve( mocked_fetch_body );
        },
    } );
} );

// Clear the mocks/throw flag before tests
beforeEach( () => {

    ( fetch as jest.Mock ).mockClear();

    // Reset manual mock values
    arbitrary_throw    = false;
    mocked_fetch_body  = { ...mocked_fetch_body_template };
    mocked_status_code = 200;
} );

describe( 'IpApiClient', () => {

    it( 'Successfully handles lookup - single field', async() => {

        const response = await Client.lookup_ip( '8.8.8.8', [ 'country' ] );

        expect( response.success ).toBe( true );
        expect( response.status_code ).toBe( 200 );
        expect( response.url ).toBe( 'http://ip-api.com/json/8.8.8.8?fields=status%2Cmessage%2Ccountry' );
    } );

    it( 'Successfully handles lookup - many fields', async() => {

        const response = await Client.lookup_ip( '8.8.8.8', [ 'country', 'lat', 'lon' ] );

        expect( response.success ).toBe( true );
        expect( response.status_code ).toBe( 200 );
        expect( response.url ).toBe( 'http://ip-api.com/json/8.8.8.8?fields=status%2Cmessage%2Ccountry%2Clat%2Clon' );
    } );

    it( 'Gracefully handles throw on test IP "10.255.255.2"', async() => {

        const response = await Client.lookup_ip( '10.255.255.2', [ 'country' ] );

        expect( response.success ).toBe( false );
        expect( response.errors ).toEqual( [ 'Exception encountered "Error: Throwing test exception"' ] );
        expect( response.status_code ).toBeUndefined();
        expect( response.url ).toBeUndefined();
    } );

    it( 'Gracefully handles 400 on test IP "10.255.255.3"', async() => {

        const response = await Client.lookup_ip( '10.255.255.3', [ 'country' ] );

        expect( response.success ).toBe( false );
        expect( response.status_code ).toBe( 400 );
        expect( response.errors ).toEqual( [ 'Non-200 status code returned from API call - is 400' ] );
    } );

    it( 'Handles "status" field failure from downstream API', async() => {

        mocked_fetch_body.status = 'junk-status';
        mocked_status_code       = 500;

        const response = await Client.lookup_ip( '8.8.8.8', [ 'country' ] );

        expect( response.success ).toBe( false );
        expect( response.status_code ).toBe( 500 );
        expect( response.errors ).toEqual( [
            'Non-200 status code returned from API call - is 500',
            'API response status "junk-status" != "success"',
        ] );
    } );

    it( 'Handles "message" field failure from downstream API', async() => {

        mocked_fetch_body.message = 'Test message';
        mocked_status_code        = 500;

        const response = await Client.lookup_ip( '8.8.8.8', [ 'country' ] );
        console.log( response );

        expect( response.success ).toBe( false );
        expect( response.status_code ).toBe( 500 );
        expect( response.errors ).toEqual( [
            'Non-200 status code returned from API call - is 500',
            'API error message "Test message"',
        ] );
    } );

} );
