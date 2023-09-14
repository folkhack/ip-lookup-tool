import { FetchHttpClient, HttpResponse } from './FetchHttpClient.js';
import { IpAddrInfoResult } from './IpAddrInfoTypes.js';

import {
    HTTP_API_PORT,
    HTTP_API_CLIENT_HTTP_SCHEME,
    HTTP_API_CLIENT_HOST,
    HTTP_API_CLIENT_TIMEOUT_MS,
} from '../constants.js';

// Fetch-based HTTP API client for the Express HTTP API
export class HttpApiClient extends FetchHttpClient {

    constructor() {

        super(
            HTTP_API_CLIENT_HTTP_SCHEME,
            HTTP_API_CLIENT_HOST,
            HTTP_API_PORT,
            HTTP_API_CLIENT_TIMEOUT_MS,
        );
    }

    /**
     * Check the health of the system
     *
     * @async
     * @returns {Promise<boolean>} - Returns a Promise resolving to a boolean indicating the health status
     */
    async check_health():Promise<boolean> {

        try {

            const check_response = await this.get( '/' );
            return check_response.status_code === 200 && check_response.response_data?.success === true;

        } catch( error ) {

            console.error( 'Exception caught when attempting to check HTTP API health!', error );
        }

        return false;
    }

    /**
     * Lookup information about an IP address
     *
     * @async
     * @param {string} ip_address - The IP address to look up
     * @param {string[]} fields - The fields to include in the response
     * @returns {Promise<HttpResponse>} - Returns a Promise resolving to an HttpResponse object
     */
    async lookup_ip( ip_address:string, fields:string[] ):Promise<HttpResponse> {

        try {

            const pathname = '/lookup-ip/' + ip_address;
            const check_response = await this.get( pathname, { fields : fields.join( ',' ) } );

            check_response.response_data as IpAddrInfoResult;

            if( check_response.response_data.query_start_at ) {
                check_response.response_data.query_start_at = new Date( check_response.response_data.query_start_at );
            }

            if( check_response.response_data.query_stop_at ) {
                check_response.response_data.query_stop_at = new Date( check_response.response_data.query_stop_at );
            }

            return check_response;

        } catch( error ) {

            console.error( 'Exception caught when attempting to lookup IP! [HTTP API]', error );
            throw error;
        }
    }
}
