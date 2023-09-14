import { FetchHttpClient } from './FetchHttpClient.js';

import {
    IP_INFO_API_HTTP_SCHEME,
    IP_INFO_API_HOST,
    IP_INFO_API_PORT,
    IP_INFO_API_TIMEOUT_MS,
} from '../constants.js';

import { IpAddrInfoResult } from './IpAddrInfoTypes.js';

// Fetch-based HTTP API client for the downstream ip-api.com API
export class IpApiClient extends FetchHttpClient {

    constructor() {

        super(
            IP_INFO_API_HTTP_SCHEME,
            IP_INFO_API_HOST,
            IP_INFO_API_PORT,
            IP_INFO_API_TIMEOUT_MS,
        );
    }

    async lookup_ip( ip_addr:string, fields:string[] ):Promise<IpAddrInfoResult> {

        const result:IpAddrInfoResult = {
            success        : false,
            query_start_at : new Date,
            errors         : [],
        };

        try {

            // Testing stub for when running tests against the API
            // - 10.255.255.2 to trigger
            // - Throws exception
            if( process.env.TS_JEST && ip_addr === '10.255.255.2' ) {

                throw new Error( 'Throwing test exception' );
            }

            // Prepend message/status if needed (these API fields are always used for success checking)
            if( fields && ! fields.includes( 'message' ) ) fields.unshift( 'message' );
            if( fields && ! fields.includes( 'status' ) ) fields.unshift( 'status' );

            const check_response = await this.get( '/json/' + ip_addr, { fields : fields.join( ',' ) } );

            check_response.response_data as IpAddrInfoResult;

            result.url         = check_response.url;
            result.response    = check_response.response_data;
            result.status_code = check_response.status_code;

            // Testing stub for when running tests against the API
            // - 10.255.255.3 to trigger
            // - Non-200 response
            if( process.env.TS_JEST && ip_addr === '10.255.255.3' ) {

                result.status_code = 400;
            }

            if( result.status_code !== 200 ) {

                result.errors.push( 'Non-200 status code returned from API call - is ' + result.status_code );
            }

            if( result.response?.status !== 'success' ) {

                result.errors.push( 'API response status "' + result.response?.status + '" != "success"' );
            }

            if( result.response?.message ) {

                result.errors.push( 'API error message "' + result.response.message + '"' );
            }

            if( result.status_code === 200 && result.response?.status === 'success' ) {

                result.success = true;
                result.data    = { queried_ip_addr : ip_addr };

                if( 'status' in result.response )        result.data.query_status   = result.response.status;
                if( 'message' in result.response )       result.data.query_message  = result.response.message;
                if( 'country' in result.response )       result.data.country        = result.response.country;
                if( 'countryCode' in result.response )   result.data.country_code   = result.response.countryCode;
                if( 'continent' in result.response )     result.data.continent      = result.response.continent;
                if( 'continentCode' in result.response ) result.data.continent_code = result.response.continentCode;
                if( 'region' in result.response )        result.data.region         = result.response.region;
                if( 'regionName' in result.response )    result.data.region_name    = result.response.regionName;
                if( 'city' in result.response )          result.data.city           = result.response.city;
                if( 'district' in result.response )      result.data.district       = result.response.district;
                if( 'zip' in result.response )           result.data.zip            = result.response.zip;
                if( 'lat' in result.response )           result.data.lat            = result.response.lat;
                if( 'lon' in result.response )           result.data.lon            = result.response.lon;
                if( 'timezone' in result.response )      result.data.timezone       = result.response.timezone;
                if( 'offset' in result.response )        result.data.offset         = result.response.offset;
                if( 'isp' in result.response )           result.data.isp            = result.response.isp;
                if( 'org' in result.response )           result.data.org            = result.response.org;
                if( 'as' in result.response )            result.data.as             = result.response.as;
                if( 'asname' in result.response )        result.data.as_name        = result.response.asname;
                if( 'mobile' in result.response )        result.data.is_mobile      = result.response.mobile;
                if( 'proxy' in result.response )         result.data.is_proxy       = result.response.proxy;
                if( 'hosting' in result.response )       result.data.is_hosting     = result.response.hosting;
                if( 'reverse' in result.response )       result.data.reverse        = result.response.reverse;
            }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch( error:any ) {

            // Error can be explicit any type - will be handled without trusting properties
            console.error( 'Exception caught when attempting to lookup IP [ip-api.com]!', error );

            result.success = false;
            result.errors.push( 'Exception encountered "' + String( error ) + '"' );
            result.exception = error;

            if( error.stack && typeof error.stack === 'string' && error.stack.length ) {

                result.stack_trace = error.stack;
            }
        }

        result.query_stop_at = new Date;
        result.query_ms = result.query_stop_at.getTime() - result.query_start_at.getTime();

        return result;
    }
}
