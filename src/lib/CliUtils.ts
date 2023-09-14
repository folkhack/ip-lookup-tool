import chalk from 'chalk';
import { IpAddrUtils } from './IpAddrUtils.js';

/**
 * Exit the program with an error message, with POSIX status 1
 *
 * @param {string} error_str - The primary error message
 * @param {string[]} [error_messages = []] - Additional error messages
 * @returns {void} - Returns nothing; exits the program
 */
const error_exit = ( error_str:string, error_messages:string[] = [] ) => {

    console.error( '❌ ' + chalk.bold.redBright( 'IP lookup failed!\n' ) );
    console.error( error_str );

    for( const error of error_messages ) {

        console.error( ' - ' + error );
    }

    // process.exit OK here due to being CLI tooling which expects a POSIX error code
    console.error( '\nExiting with status 1...' );

    // eslint-disable-next-line n/no-process-exit
    process.exit( 1 );
};

/**
 * Dump an object as JSON to the console
 * - any allowed here due to nature of agnostic debugging function
 *
 * @param {any} obj_to_dump - The object to dump
 * @returns {void} - Returns nothing
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dump_json = ( obj_to_dump:any ):void => {

    console.log( '-'.repeat( 3 ) );
    console.log( JSON.stringify( obj_to_dump, null, 2 ) );
    console.log( '-'.repeat( 3 ) + '\n' );
};

/**
 * Perform an IP address lookup from the CLI
 *
 * @async
 * @param {string} ip_addr - The IP address to look up
 * @returns {Promise<void>} - Returns a Promise that resolves when the lookup is complete
 */
const cli_ip_lookup = async( ip_addr:string ):Promise<void> => {

    const LookupUtil = new IpAddrUtils;

    //
    //  #1. Validate passed-in IP address
    //
    const validation_result = LookupUtil.validate_ip_addr( ip_addr );

    if( validation_result.success !== true ) {

        return error_exit( 'IP address is not valid!', validation_result.errors );
    }

    //
    //  #2. Call ip-api.com
    //
    const ip_info = await LookupUtil.get_ip_info( ip_addr );

    if( ip_info.success !== true ) {

        if( process.env.CLI_DEBUG === 'true' ) {

            console.error( '\n' + chalk.bold.redBright( '🔥 DEBUG: IP info API failed lookup! Dumping JSON...' ) );
            dump_json( ip_info );
        }

        if( process.env.CLI_DEBUG === 'true' && ip_info.exception ) {

            console.error( chalk.bold.redBright( '🔥 IP info API exception:' ), ip_info.exception, '\n' );
        }

        if( process.env.CLI_DEBUG === 'true' && ip_info.stack_trace ) {

            console.error( chalk.bold.redBright( '🔥 IP info API stack trace:' ), ip_info.stack_trace + '\n' );
        }

        return error_exit( 'IP info API call failed!', ip_info.errors );
    }

    //
    //  #3. Output to CLI
    //
    console.log( '✅ ' + chalk.bold.greenBright( 'IP lookup successful!\n' ) );

    if( process.env.CLI_DUMP_JSON === 'true' ) {

        console.error( '\n' + chalk.bold.magentaBright( '🖥️  CLI DUMP: IP info configured to dump JSON...' ) );
        dump_json( ip_info );
    }

    if( ip_info.data ) {

        // Get the max length of the keys in the data array
        const max_key_len = Math.max( ...( Object.keys( ip_info.data ).map( ( key ) => { return key.length; } ) ) );

        // Iterate over object properties for output
        for( const [ key, value ] of Object.entries( ip_info.data ) ) {

            if( value ) {

                console.log( chalk.bold.cyanBright( key.padEnd( max_key_len ) ) + ' : ', value );
            }
        }
    }
};

export { error_exit, dump_json, cli_ip_lookup };
