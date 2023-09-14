// eslint-disable-next-line n/no-extraneous-import
import { jest } from '@jest/globals';
import { cli_ip_lookup, dump_json, error_exit } from './CliUtils';

// Ensure full debugging enabled as it would be in a .env configuration
process.env.CLI_DEBUG     = 'true';
process.env.CLI_DUMP_JSON = 'true';

// Track console messages and exit codes in global vars so we can check them after running tests
let console_msgs:string[] = [];
let exit_code:number|undefined = -1;

beforeEach( () => {
    console_msgs = [];
    exit_code    = -1;
} );

// Spy on console.log and console.error so we can capture output and compare for testing
jest.spyOn( console, 'log' ).mockImplementation( ( ...args ) => {

    console_msgs.push( String( args ).trim() );
} );

jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {

    console_msgs.push( String( args ).trim() );
} );

// process.exit - ignores due to return never not working with TS
//   eslint-disable-next-line @typescript-eslint/ban-ts-comment
/*   @ts-ignore */
jest.spyOn( process, 'exit' ).mockImplementation( ( code ) => {

    exit_code = code;
} );

describe( 'IpAddrUtils', () => {

    test( 'CLI json dumps', () => {

        dump_json( true );

        const expected_msgs = [
            '---',
            'true',
            '---',
        ];

        expect( console_msgs ).toEqual( expected_msgs );
    } );

    test( 'Error exits - array of messages', () => {

        error_exit( 'Error message set from test w/additional array of messagse', [ 'Error message array set from test' ] );

        expect( exit_code ).toBe( 1 );

        const expected_msgs = [
            '❌ \x1B[1m\x1B[91mIP lookup failed!\x1B[39m\x1B[22m\n\x1B[1m\x1B[91m\x1B[39m\x1B[22m',
            'Error message set from test w/additional array of messagse',
            '- Error message array set from test',
            'Exiting with status 1...',
        ];

        expect( console_msgs ).toEqual( expected_msgs );
    } );

    test( 'Error exits - no messages', () => {

        error_exit( 'Single error message set from test' );

        expect( exit_code ).toBe( 1 );

        const expected_msgs = [
            '❌ \x1B[1m\x1B[91mIP lookup failed!\x1B[39m\x1B[22m\n\x1B[1m\x1B[91m\x1B[39m\x1B[22m',
            'Single error message set from test',
            'Exiting with status 1...',
        ];

        expect( console_msgs ).toEqual( expected_msgs );
    } );

    test( 'CLI lookup works', async() => {

        process.env.CLI_DUMP_JSON = 'false';

        await cli_ip_lookup( '8.8.8.8' );

        const expected_msgs = [
            '✅ \x1B[1m\x1B[92mIP lookup successful!\x1B[39m\x1B[22m\n\x1B[1m\x1B[92m\x1B[39m\x1B[22m',
            '\x1B[1m\x1B[96mqueried_ip_addr\x1B[39m\x1B[22m : ,8.8.8.8',
            '\x1B[1m\x1B[96mquery_status   \x1B[39m\x1B[22m : ,success',
            '\x1B[1m\x1B[96mcountry        \x1B[39m\x1B[22m : ,United States',
            '\x1B[1m\x1B[96mcountry_code   \x1B[39m\x1B[22m : ,US',
            '\x1B[1m\x1B[96mcontinent      \x1B[39m\x1B[22m : ,North America',
            '\x1B[1m\x1B[96mcontinent_code \x1B[39m\x1B[22m : ,NA',
            '\x1B[1m\x1B[96mregion         \x1B[39m\x1B[22m : ,VA',
            '\x1B[1m\x1B[96mregion_name    \x1B[39m\x1B[22m : ,Virginia',
            '\x1B[1m\x1B[96mcity           \x1B[39m\x1B[22m : ,Ashburn',
            '\x1B[1m\x1B[96mzip            \x1B[39m\x1B[22m : ,20149',
            '\x1B[1m\x1B[96mlat            \x1B[39m\x1B[22m : ,39.03',
            '\x1B[1m\x1B[96mlon            \x1B[39m\x1B[22m : ,-77.5',
            '\x1B[1m\x1B[96mtimezone       \x1B[39m\x1B[22m : ,America/New_York',
            '\x1B[1m\x1B[96moffset         \x1B[39m\x1B[22m : ,-14400',
            '\x1B[1m\x1B[96misp            \x1B[39m\x1B[22m : ,Google LLC',
            '\x1B[1m\x1B[96morg            \x1B[39m\x1B[22m : ,Google Public DNS',
            '\x1B[1m\x1B[96mas             \x1B[39m\x1B[22m : ,AS15169 Google LLC',
            '\x1B[1m\x1B[96mas_name        \x1B[39m\x1B[22m : ,GOOGLE',
            '\x1B[1m\x1B[96mis_hosting     \x1B[39m\x1B[22m : ,true',
        ];

        expect( console_msgs ).toEqual( expected_msgs );
    } );

    test( 'CLI lookup error handling - no input', async() => {

        process.env.CLI_DUMP_JSON = 'false';

        await cli_ip_lookup( '' );

        const expected_msgs = [
            '❌ \x1B[1m\x1B[91mIP lookup failed!\x1B[39m\x1B[22m\n\x1B[1m\x1B[91m\x1B[39m\x1B[22m',
            'IP address is not valid!',
            '- IP address cannot be empty',
            '- IP address format invalid',
            'Exiting with status 1...',
        ];

        expect( console_msgs ).toEqual( expected_msgs );
    } );

    test( 'CLI lookup error handling - exception test IP 10.255.255.2', async() => {

        process.env.CLI_DUMP_JSON = 'false';

        await cli_ip_lookup( '10.255.255.2' );

        const needles = [
            'DEBUG: IP info API failed lookup! Dumping JSON...',
            '🔥 IP info API stack trace',
            '🔥 IP info API exception',
        ];

        let needles_found = 0;

        for( const msg_str of console_msgs ) {

            for( const needle of needles ) {

                if( msg_str.includes( needle ) ) needles_found++;
            }
        }

        expect( needles.length ).toBe( needles_found );
    } );

    test( 'CLI lookup works - JSON dump', async() => {

        process.env.CLI_DUMP_JSON = 'true';

        await cli_ip_lookup( '8.8.8.8' );

        const needles = [
            '"success": true',
            '"query_start_at"',
            '"errors": []',
        ];

        let needles_found = 0;

        for( const msg_str of console_msgs ) {

            for( const needle of needles ) {

                if( msg_str.includes( needle ) ) needles_found++;
            }
        }

        expect( needles.length ).toBe( needles_found );
    } );
} );
