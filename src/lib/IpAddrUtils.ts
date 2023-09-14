import { IpAddrInfoResult, IpUtilsValidationResult, IpUtilsLookupInterface } from './IpAddrInfoTypes.js';
import { IpApiClient } from './IpApiClient.js';
import { FIELDS } from '../constants.js';

export class IpAddrUtils implements IpUtilsLookupInterface {

    /**
     * Validate an IPv4 address string
     *
     * @static
     * @param {string} ip_addr - The IPv4 address string to validate
     * @returns {boolean} - Returns true if valid, false otherwise
     */
    static validate_ipv4_str( ip_addr:string ):boolean {

        // eslint-disable-next-line max-len, prefer-named-capture-group
        const regex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
        return regex.test( ip_addr );
    }

    /**
     * Validate an IPv6 address string
     *
     * @static
     * @param {string} ip_addr - The IPv6 address string to validate
     * @returns {boolean} - Returns true if valid, false otherwise
     */
    static validate_ipv6_str( ip_addr:string ):boolean {

        // eslint-disable-next-line max-len, prefer-named-capture-group
        const regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|([0-9a-fA-F]{1,4}:){1,1}(:[0-9a-fA-F]{1,4}){1,6}|:((:[0-9a-fA-F]{1,4}){1,7}|:)|::)$/;
        return regex.test( ip_addr );
    }

    /**
     * Validate an IP address string, either IPv4 or IPv6
     *
     * @param {string} ip_addr - The IP address string to validate
     * @returns {IpUtilsValidationResult} - Returns a validation result object
     */
    validate_ip_addr( ip_addr:string ):IpUtilsValidationResult {

        const errors: string[] = [];

        // Check if empty
        if( ! ip_addr ) errors.push( 'IP address cannot be empty' );

        // Validate IPv4 or IPv6
        if( IpAddrUtils.validate_ipv4_str( ip_addr ) || IpAddrUtils.validate_ipv6_str( ip_addr ) ) {

            return { success : true, errors : [] };
        }

        // If not matched, add error
        errors.push( 'IP address format invalid' );

        return { success : false, errors };
    }

    /**
     * Get information about an IP address.
     *
     * @async
     * @param {string} ip_addr - The IP address to get information for
     * @param {string[]} [fields_arr = FIELDS] - The fields to include in the result
     * @returns {Promise<IpAddrInfoResult>} - Returns a Promise resolving to an IpAddrInfoResult object
     */
    get_ip_info( ip_addr:string, fields_arr:string[] = FIELDS ):Promise<IpAddrInfoResult> {

        return ( new IpApiClient ).lookup_ip( ip_addr, fields_arr );
    }
}
