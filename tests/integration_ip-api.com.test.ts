import dotenv from 'dotenv';
import { IpAddrUtils } from '../src/lib/IpAddrUtils';
import { ALL_FIELDS } from '../src/constants';
import { just_lat_lng, delay_ms } from './integration_test_constants';

dotenv.config();

let first_ran = false;

// Sleep for configured delay between each test
beforeEach( ( done ) => {

    if( ! first_ran ) {

        first_ran = true;
        return done();
    }

    setTimeout( done, delay_ms );
} );

const IpAddrUtilsLocal = new IpAddrUtils;

// Long test due to lots of property checking =/
// eslint-disable-next-line max-lines-per-function
describe( 'ip-api.com Integration', () => {

    test( 'Successful IP lookup 8.8.8.8 - query all fields', async() => {

        const result = await IpAddrUtilsLocal.get_ip_info( '8.8.8.8', ALL_FIELDS );

        expect( result.success ).toBe( true );
        expect( result.status_code ).toBe( 200 );
        expect( result.query_start_at ).toBeInstanceOf( Date );
        expect( result.query_stop_at ).toBeInstanceOf( Date );

        expect( typeof result.query_ms ).toBe( 'number' );
        expect( result.query_ms ).toBeGreaterThan( 0 );

        // Check no errors
        expect( Array.isArray( result.errors ) ).toBe( true );
        expect( result.errors.length ).toBe( 0 );
        expect( result.exception ).toBeUndefined();
        expect( result.stack_trace ).toBeUndefined();

        // Check nested 'response' properties
        expect( result.response?.status ).toBe( 'success' );
        expect( result.response?.country ).toBe( 'United States' );
        expect( result.response?.timezone ).toBe( 'America/New_York' );
        expect( result.response?.continent ).toBe( 'North America' );
        expect( result.response?.continentCode ).toBe( 'NA' );
        expect( result.response?.country ).toBe( 'United States' );
        expect( result.response?.countryCode ).toBe( 'US' );
        expect( result.response?.region ).toBe( 'VA' );
        expect( result.response?.regionName ).toBe( 'Virginia' );
        expect( result.response?.city ).toBe( 'Ashburn' );
        expect( result.response?.district ).toBe( '' );
        expect( result.response?.zip ).toBe( '20149' );
        expect( result.response?.lat ).toBe( 39.03 );
        expect( result.response?.lon ).toBe( -77.5 );
        expect( result.response?.timezone ).toBe( 'America/New_York' );
        expect( result.response?.offset ).toBe( -14400 );
        expect( result.response?.isp ).toBe( 'Google LLC' );
        expect( result.response?.org ).toBe( 'Google Public DNS' );
        expect( result.response?.as ).toBe( 'AS15169 Google LLC' );
        expect( result.response?.asname ).toBe( 'GOOGLE' );
        expect( result.response?.mobile ).toBe( false );
        expect( result.response?.proxy ).toBe( false );
        expect( result.response?.hosting ).toBe( true );
        expect( result.response?.query ).toBe( '8.8.8.8' );
        expect( result.response?.reverse ).toBe( 'dns.google' );

        // Check nested 'data' properties
        expect( result.data?.queried_ip_addr ).toBe( '8.8.8.8' );
        expect( result.data?.query_status ).toBe( 'success' );
        expect( result.data?.query_message ).toBeUndefined();
        expect( result.data?.country ).toBe( 'United States' );
        expect( result.data?.country_code ).toBe( 'US' );
        expect( result.data?.continent ).toBe( 'North America' );
        expect( result.data?.continent_code ).toBe( 'NA' );
        expect( result.data?.region ).toBe( 'VA' );
        expect( result.data?.region_name ).toBe( 'Virginia' );
        expect( result.data?.city ).toBe( 'Ashburn' );
        expect( result.data?.district ).toBe( '' );
        expect( result.data?.zip ).toBe( '20149' );
        expect( result.data?.lat ).toBe( 39.03 );
        expect( result.data?.lon ).toBe( -77.5 );
        expect( result.data?.timezone ).toBe( 'America/New_York' );
        expect( result.data?.offset ).toBe( -14400 );
        expect( result.data?.isp ).toBe( 'Google LLC' );
        expect( result.data?.org ).toBe( 'Google Public DNS' );
        expect( result.data?.as ).toBe( 'AS15169 Google LLC' );
        expect( result.data?.as_name ).toBe( 'GOOGLE' );
        expect( result.data?.is_mobile ).toBe( false );
        expect( result.data?.is_proxy ).toBe( false );
        expect( result.data?.is_hosting ).toBe( true );
        expect( result.data?.reverse ).toBe( 'dns.google' );
    } );

    test( 'Successful IP lookup 8.8.8.8 - default fields', async() => {

        const result = await IpAddrUtilsLocal.get_ip_info( '8.8.8.8' );

        expect( result.success ).toBe( true );
        expect( result.status_code ).toBe( 200 );
        expect( result.query_start_at ).toBeInstanceOf( Date );
        expect( result.query_stop_at ).toBeInstanceOf( Date );

        expect( typeof result.query_ms ).toBe( 'number' );
        expect( result.query_ms ).toBeGreaterThan( 0 );

        // Check no errors
        expect( Array.isArray( result.errors ) ).toBe( true );
        expect( result.errors.length ).toBe( 0 );
        expect( result.exception ).toBeUndefined();
        expect( result.stack_trace ).toBeUndefined();

        // Check nested 'response' properties
        expect( result.response?.status ).toBe( 'success' );
        expect( result.response?.country ).toBe( 'United States' );
        expect( result.response?.timezone ).toBe( 'America/New_York' );
        expect( result.response?.continent ).toBe( 'North America' );
        expect( result.response?.continentCode ).toBe( 'NA' );
        expect( result.response?.country ).toBe( 'United States' );
        expect( result.response?.countryCode ).toBe( 'US' );
        expect( result.response?.region ).toBe( 'VA' );
        expect( result.response?.regionName ).toBe( 'Virginia' );
        expect( result.response?.city ).toBe( 'Ashburn' );
        expect( result.response?.district ).toBe( '' );
        expect( result.response?.zip ).toBe( '20149' );
        expect( result.response?.lat ).toBe( 39.03 );
        expect( result.response?.lon ).toBe( -77.5 );
        expect( result.response?.timezone ).toBe( 'America/New_York' );
        expect( result.response?.offset ).toBe( -14400 );
        expect( result.response?.isp ).toBe( 'Google LLC' );
        expect( result.response?.org ).toBe( 'Google Public DNS' );
        expect( result.response?.as ).toBe( 'AS15169 Google LLC' );
        expect( result.response?.asname ).toBe( 'GOOGLE' );
        expect( result.response?.mobile ).toBe( false );
        expect( result.response?.proxy ).toBe( false );
        expect( result.response?.hosting ).toBe( true );
        expect( result.response?.query ).toBe( '8.8.8.8' );
        expect( result.response?.reverse ).toBeUndefined();

        // Check nested 'data' properties
        expect( result.data?.queried_ip_addr ).toBe( '8.8.8.8' );
        expect( result.data?.query_status ).toBe( 'success' );
        expect( result.data?.query_message ).toBeUndefined();
        expect( result.data?.country ).toBe( 'United States' );
        expect( result.data?.country_code ).toBe( 'US' );
        expect( result.data?.continent ).toBe( 'North America' );
        expect( result.data?.continent_code ).toBe( 'NA' );
        expect( result.data?.region ).toBe( 'VA' );
        expect( result.data?.region_name ).toBe( 'Virginia' );
        expect( result.data?.city ).toBe( 'Ashburn' );
        expect( result.data?.district ).toBe( '' );
        expect( result.data?.zip ).toBe( '20149' );
        expect( result.data?.lat ).toBe( 39.03 );
        expect( result.data?.lon ).toBe( -77.5 );
        expect( result.data?.timezone ).toBe( 'America/New_York' );
        expect( result.data?.offset ).toBe( -14400 );
        expect( result.data?.isp ).toBe( 'Google LLC' );
        expect( result.data?.org ).toBe( 'Google Public DNS' );
        expect( result.data?.as ).toBe( 'AS15169 Google LLC' );
        expect( result.data?.as_name ).toBe( 'GOOGLE' );
        expect( result.data?.is_mobile ).toBe( false );
        expect( result.data?.is_proxy ).toBe( false );
        expect( result.data?.is_hosting ).toBe( true );
        expect( result.data?.reverse ).toBeUndefined();
    } );

    test( 'Successful IP lookup 8.8.8.8 - query some fields', async() => {

        // Query just lat/lng
        const result = await IpAddrUtilsLocal.get_ip_info( '8.8.8.8', just_lat_lng );

        expect( result.success ).toBe( true );
        expect( result.status_code ).toBe( 200 );
        expect( result.query_start_at ).toBeInstanceOf( Date );
        expect( result.query_stop_at ).toBeInstanceOf( Date );

        expect( typeof result.query_ms ).toBe( 'number' );
        expect( result.query_ms ).toBeGreaterThan( 0 );

        // Check no errors
        expect( Array.isArray( result.errors ) ).toBe( true );
        expect( result.errors.length ).toBe( 0 );
        expect( result.exception ).toBeUndefined();
        expect( result.stack_trace ).toBeUndefined();

        // Check nested 'response' properties
        expect( result.response?.status ).toBe( 'success' );
        expect( result.response?.lat ).toBe( 39.03 );
        expect( result.response?.lon ).toBe( -77.5 );
        expect( result.response?.query ).toBeUndefined();
        expect( result.response?.country ).toBeUndefined();
        expect( result.response?.timezone ).toBeUndefined();
        expect( result.response?.continent ).toBeUndefined();
        expect( result.response?.continentCode ).toBeUndefined();
        expect( result.response?.country ).toBeUndefined();
        expect( result.response?.countryCode ).toBeUndefined();
        expect( result.response?.region ).toBeUndefined();
        expect( result.response?.regionName ).toBeUndefined();
        expect( result.response?.city ).toBeUndefined();
        expect( result.response?.district ).toBeUndefined();
        expect( result.response?.zip ).toBeUndefined();
        expect( result.response?.timezone ).toBeUndefined();
        expect( result.response?.offset ).toBeUndefined();
        expect( result.response?.isp ).toBeUndefined();
        expect( result.response?.org ).toBeUndefined();
        expect( result.response?.as ).toBeUndefined();
        expect( result.response?.asname ).toBeUndefined();
        expect( result.response?.reverse ).toBeUndefined();
        expect( result.response?.mobile ).toBeUndefined();
        expect( result.response?.proxy ).toBeUndefined();
        expect( result.response?.hosting ).toBeUndefined();

        // Check nested 'data' properties
        expect( result.data?.query_status ).toBe( 'success' );
        expect( result.data?.lat ).toBe( 39.03 );
        expect( result.data?.lon ).toBe( -77.5 );
        expect( result.data?.queried_ip_addr ).toBe( '8.8.8.8' );
        expect( result.data?.query_message ).toBeUndefined();
        expect( result.data?.country ).toBeUndefined();
        expect( result.data?.country_code ).toBeUndefined();
        expect( result.data?.continent ).toBeUndefined();
        expect( result.data?.continent_code ).toBeUndefined();
        expect( result.data?.region ).toBeUndefined();
        expect( result.data?.region_name ).toBeUndefined();
        expect( result.data?.city ).toBeUndefined();
        expect( result.data?.district ).toBeUndefined();
        expect( result.data?.zip ).toBeUndefined();
        expect( result.data?.timezone ).toBeUndefined();
        expect( result.data?.offset ).toBeUndefined();
        expect( result.data?.isp ).toBeUndefined();
        expect( result.data?.org ).toBeUndefined();
        expect( result.data?.as ).toBeUndefined();
        expect( result.data?.as_name ).toBeUndefined();
        expect( result.data?.is_mobile ).toBeUndefined();
        expect( result.data?.is_proxy ).toBeUndefined();
        expect( result.data?.is_hosting ).toBeUndefined();
        expect( result.data?.reverse ).toBeUndefined();
    } );

    test( 'Failed IP lookup 8.8.8.X - invalid IP address', async() => {

        const result = await IpAddrUtilsLocal.get_ip_info( '8.8.8.X', [ 'isp' ] );

        expect( result.success ).toBe( false );
        expect( result.status_code ).toBe( 200 );
        expect( result.query_start_at ).toBeInstanceOf( Date );
        expect( result.query_stop_at ).toBeInstanceOf( Date );

        expect( typeof result.query_ms ).toBe( 'number' );
        expect( result.query_ms ).toBeGreaterThan( 0 );

        expect( Array.isArray( result.errors ) ).toBe( true );
        expect( result.errors.length ).toBe( 2 );

        expect( result.errors ).toContain( 'API response status "fail" != "success"' );
        expect( result.errors ).toContain( 'API error message "invalid query"' );

        expect( result.data ).toBeUndefined();
        expect( result.exception ).toBeUndefined();
        expect( result.stack_trace ).toBeUndefined();
    } );

    test( 'Failed IP lookup 10.255.255.1 - not routable/private range', async() => {

        const result = await IpAddrUtilsLocal.get_ip_info( '10.255.255.1', [ 'isp' ] );

        expect( result.success ).toBe( false );
        expect( result.status_code ).toBe( 200 );
        expect( result.query_start_at ).toBeInstanceOf( Date );
        expect( result.query_stop_at ).toBeInstanceOf( Date );

        expect( typeof result.query_ms ).toBe( 'number' );
        expect( result.query_ms ).toBeGreaterThan( 0 );

        expect( Array.isArray( result.errors ) ).toBe( true );
        expect( result.errors.length ).toBe( 2 );

        expect( result.errors ).toContain( 'API response status "fail" != "success"' );
        expect( result.errors ).toContain( 'API error message "private range"' );

        expect( result.data ).toBeUndefined();
        expect( result.exception ).toBeUndefined();
        expect( result.stack_trace ).toBeUndefined();
    } );
} );
