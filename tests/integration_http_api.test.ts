import dotenv from 'dotenv';
import { HttpResponse } from '../src/lib/FetchHttpClient';
import { HttpApiClient } from '../src/lib/HttpApiClient';
import { HttpApi } from '../src/lib/HttpApi';
import { IpAddrInfoResult } from '../src/lib/IpAddrInfoTypes';

import { ALL_FIELDS } from '../src/constants';
import { just_lat_lng, delay_ms } from './integration_test_constants';

dotenv.config();

const Server = new HttpApi;
const Client = new HttpApiClient;

// Start/stop HTTP API before/after testing
beforeAll( async() => {

    await Server.start();
} );

afterAll( async() => {

    await Server.stop();
} );

let first_ran = false;

// Sleep for configured delay between each test
beforeEach( ( done ) => {

    if( ! first_ran ) {

        first_ran = true;
        return done();
    }

    setTimeout( done, delay_ms );
} );

describe( 'HTTP API Integration', () => {

    test( 'Healthcheck passes', async() => {

        const response = await Client.check_health();
        expect( response ).toBe( true );
    } );

    test( 'Bad healthcheck returns false', async() => {

        // Set the client port to something garbage
        const SussyClient = new HttpApiClient;
        SussyClient.port = 1;

        const response = await SussyClient.check_health();
        expect( response ).toBe( false );
    } );

    test( 'Successful IP lookup 8.8.8.8 - query all fields', async() => {

        const response = await Client.lookup_ip( '8.8.8.8', ALL_FIELDS ) as HttpResponse;
        response.response_data as IpAddrInfoResult;

        expect( response.response_data.success ).toBe( true );
        expect( response.response_data.query_start_at ).toBeInstanceOf( Date );
        expect( response.response_data.query_stop_at ).toBeInstanceOf( Date );

        expect( typeof response.response_data.query_ms ).toBe( 'number' );
        expect( response.response_data.query_ms ).toBeGreaterThan( 0 );

        // Check no errors
        expect( Array.isArray( response.response_data.errors ) ).toBe( true );
        expect( response.response_data.errors.length ).toBe( 0 );

        // Check nested 'data' properties
        expect( response.response_data.data?.queried_ip_addr ).toBe( '8.8.8.8' );
        expect( response.response_data.data?.query_status ).toBe( 'success' );
        expect( response.response_data.data?.query_message ).toBeUndefined();
        expect( response.response_data.data?.country ).toBe( 'United States' );
        expect( response.response_data.data?.country_code ).toBe( 'US' );
        expect( response.response_data.data?.continent ).toBe( 'North America' );
        expect( response.response_data.data?.continent_code ).toBe( 'NA' );
        expect( response.response_data.data?.region ).toBe( 'VA' );
        expect( response.response_data.data?.region_name ).toBe( 'Virginia' );
        expect( response.response_data.data?.city ).toBe( 'Ashburn' );
        expect( response.response_data.data?.district ).toBe( '' );
        expect( response.response_data.data?.zip ).toBe( '20149' );
        expect( response.response_data.data?.lat ).toBe( 39.03 );
        expect( response.response_data.data?.lon ).toBe( -77.5 );
        expect( response.response_data.data?.timezone ).toBe( 'America/New_York' );
        expect( response.response_data.data?.offset ).toBe( -14400 );
        expect( response.response_data.data?.isp ).toBe( 'Google LLC' );
        expect( response.response_data.data?.org ).toBe( 'Google Public DNS' );
        expect( response.response_data.data?.as ).toBe( 'AS15169 Google LLC' );
        expect( response.response_data.data?.as_name ).toBe( 'GOOGLE' );
        expect( response.response_data.data?.is_mobile ).toBe( false );
        expect( response.response_data.data?.is_proxy ).toBe( false );
        expect( response.response_data.data?.is_hosting ).toBe( true );
        expect( response.response_data.data?.reverse ).toBe( 'dns.google' );
    } );

    test( 'Successful IP lookup 8.8.8.8 - query some fields', async() => {

        const response = await Client.lookup_ip( '8.8.8.8', just_lat_lng ) as HttpResponse;
        response.response_data as IpAddrInfoResult;

        expect( response.response_data.success ).toBe( true );
        expect( response.response_data.query_start_at ).toBeInstanceOf( Date );
        expect( response.response_data.query_stop_at ).toBeInstanceOf( Date );

        expect( typeof response.response_data.query_ms ).toBe( 'number' );
        expect( response.response_data.query_ms ).toBeGreaterThan( 0 );

        // Check no errors
        expect( Array.isArray( response.response_data.errors ) ).toBe( true );
        expect( response.response_data.errors.length ).toBe( 0 );

        // Check nested 'data' properties
        expect( response.response_data.data?.query_status ).toBe( 'success' );
        expect( response.response_data.data?.lat ).toBe( 39.03 );
        expect( response.response_data.data?.lon ).toBe( -77.5 );
        expect( response.response_data.data?.queried_ip_addr ).toBe( '8.8.8.8' );
        expect( response.response_data.data?.query_message ).toBeUndefined();
        expect( response.response_data.data?.country ).toBeUndefined();
        expect( response.response_data.data?.country_code ).toBeUndefined();
        expect( response.response_data.data?.continent ).toBeUndefined();
        expect( response.response_data.data?.continent_code ).toBeUndefined();
        expect( response.response_data.data?.region ).toBeUndefined();
        expect( response.response_data.data?.region_name ).toBeUndefined();
        expect( response.response_data.data?.city ).toBeUndefined();
        expect( response.response_data.data?.district ).toBeUndefined();
        expect( response.response_data.data?.zip ).toBeUndefined();
        expect( response.response_data.data?.timezone ).toBeUndefined();
        expect( response.response_data.data?.offset ).toBeUndefined();
        expect( response.response_data.data?.isp ).toBeUndefined();
        expect( response.response_data.data?.org ).toBeUndefined();
        expect( response.response_data.data?.as ).toBeUndefined();
        expect( response.response_data.data?.as_name ).toBeUndefined();
        expect( response.response_data.data?.is_mobile ).toBeUndefined();
        expect( response.response_data.data?.is_proxy ).toBeUndefined();
        expect( response.response_data.data?.is_hosting ).toBeUndefined();
        expect( response.response_data.data?.reverse ).toBeUndefined();
    } );

    test( 'Failed IP lookup 8.8.8.X - invalid IP address', async() => {

        const response = await Client.lookup_ip( '8.8.8.X', [ 'isp' ] ) as HttpResponse;
        response.response_data as IpAddrInfoResult;

        console.log( response );

        expect( response.response_data.success ).toBe( false );
        expect( response.response_data.query_start_at ).toBeUndefined();
        expect( response.response_data.query_stop_at ).toBeUndefined();

        expect( response.response_data.query_ms ).toBeUndefined();

        expect( Array.isArray( response.response_data.errors ) ).toBe( true );
        expect( response.response_data.errors.length ).toBe( 1 );

        expect( response.response_data.errors ).toContain( 'IP address format invalid' );
        expect( response.response_data.data ).toBeUndefined();
    } );

    test( 'Failed IP lookup "" - empty IP address', async() => {

        const response = await Client.lookup_ip( '', [ 'isp' ] ) as HttpResponse;
        response.response_data as IpAddrInfoResult;

        expect( response.response_data.success ).toBe( false );
        expect( response.response_data.query_start_at ).toBeUndefined();
        expect( response.response_data.query_stop_at ).toBeUndefined();

        expect( response.response_data.query_ms ).toBeUndefined();

        expect( Array.isArray( response.response_data.errors ) ).toBe( true );
        expect( response.response_data.errors.length ).toBe( 2 );

        expect( response.response_data.errors ).toContain( 'IP address format invalid' );
        expect( response.response_data.errors ).toContain( 'IP address cannot be empty' );
        expect( response.response_data.data ).toBeUndefined();
    } );

    test( 'Failed IP lookup 10.255.255.1 - not routable/private range', async() => {

        const response = await Client.lookup_ip( '10.255.255.1', [ 'isp' ] ) as HttpResponse;
        response.response_data as IpAddrInfoResult;

        expect( response.response_data.success ).toBe( false );
        expect( response.status_code ).toBe( 400 );
        expect( response.response_data.query_start_at ).toBeInstanceOf( Date );
        expect( response.response_data.query_stop_at ).toBeInstanceOf( Date );

        expect( typeof response.response_data.query_ms ).toBe( 'number' );
        expect( response.response_data.query_ms ).toBeGreaterThan( 0 );

        expect( Array.isArray( response.response_data.errors ) ).toBe( true );
        expect( response.response_data.errors.length ).toBe( 2 );

        expect( response.response_data.errors ).toContain( 'API response status "fail" != "success"' );
        expect( response.response_data.errors ).toContain( 'API error message "private range"' );

        expect( response.response_data.data ).toBeUndefined();
    } );

    test( 'Throws exception [from HttpApiClient]', async() => {

        // Set the client port to something garbage
        const SussyClient = new HttpApiClient;
        SussyClient.port = 1;

        // Should be able to check for error instance here but TypeError does not show equivalent
        await expect( SussyClient.lookup_ip( '8.8.8.8', [ 'isp' ] ) )
            .rejects
            .toThrow( /* TypeError */ );
    } );

    test( 'Throws exception [from IpApiClient] - Test IP 10.255.255.2', async() => {

        const response = await Client.lookup_ip( '10.255.255.2', [ 'isp' ] );

        expect( response.status_code ).toBe( 500 );
        expect( response.response_data?.success ).toBe( false );
        expect( response.response_data?.errors ).toEqual( [ 'Unexpected exception occured! Check console/log output for more details' ] );
    } );

    test( 'Handles non-200 response - Test IP 10.255.255.3', async() => {

        const response = await Client.lookup_ip( '10.255.255.3', [ 'isp' ] );

        expect( response.status_code ).toBe( 400 );
        expect( response.response_data?.success ).toBe( false );
        expect( response.response_data?.errors ).toContain( 'Non-200 status code returned from API call - is 400' );
    } );

    test( 'Successful IP lookup 8.8.8.8 - status added if not explictly asked for', async() => {

        const response = await Client.lookup_ip( '8.8.8.8', [] ) as HttpResponse;
        response.response_data as IpAddrInfoResult;

        expect( response.response_data.success ).toBe( true );

        // Ensure status field gets added back on
        expect( response.response_data.data?.query_status ).toBe( 'success' );
    } );

    test( 'Server stop after stopped throws', async() => {

        // Stop server (is in running state)
        await Server.stop();

        await expect( Server.stop() )
            .rejects
            .toThrow();

        // Restart so in known-state for more tests
        await Server.start();
    } );
} );
