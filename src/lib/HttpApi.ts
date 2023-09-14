import express from 'express';
import cors from 'cors';
import http from 'http';
import { IpAddrUtils } from './IpAddrUtils.js';
import { IpAddrInfoData } from './IpAddrInfoTypes.js';
import { HTTP_API_PORT } from '../constants.js';

export interface LookupIpResponse {
    success:boolean;
    query_start_at?:Date;
    query_stop_at?:Date;
    query_ms?:number;
    data?:IpAddrInfoData;
    errors?:string[];
}

export class HttpApi {

    app:express.Express;
    port:number;
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>|null;
    IpAddrUtils:IpAddrUtils;

    constructor() {

        this.app    = express();
        this.port   = HTTP_API_PORT;
        this.server = null;

        // Enable CORS for all routes
        this.app.use( cors() );

        // Setup routes
        this.app.get( '/', this.route_healthcheck.bind( this ) );
        this.app.get( '/lookup-ip/:ip_address?', this.route_lookup_ip.bind( this ) );

        // Setup validation and get IP info methods (done this way so can be swapped out
        //    for testing mocks)
        this.IpAddrUtils = new IpAddrUtils;
    }

    /**
    * Start the HTTP API
    *
    * @async
    * @returns {Promise<void>} - Returns a Promise that resolves when the API has started
    */
    start():Promise<void> {

        return new Promise<void>( ( resolve ) => {

            console.log( 'Starting IP info lookup tool HTTP API on port ' + this.port );

            // Nested promise useful here for fully catching the app listen start
            // eslint-disable-next-line no-new
            new Promise( () => {

                this.server = this.app.listen( this.port, () => {

                    console.log( 'IP info lookup tool HTTP API running on port ' + this.port );

                    resolve();
                } );
            } );
        } );
    }

    /**
     * Stop the HTTP API
     *
     * @async
     * @returns {Promise<void>} - Returns a Promise that resolves when the API has stopped
     */
    stop():Promise<void> {

        return new Promise<void>( ( resolve, reject ) => {

            if( this.server ) {

                this.server.close( ( err ) => {

                    if( err ) {

                        reject( err );
                        return;
                    }

                    console.log( 'Stopped IP info lookup tool HTTP API!' );
                    resolve();
                } );
            }
        } );
    }

    /**
     * Handle health check requests
     *
     * @param {express.Request} req - The Express request object
     * @param {express.Response} res - The Express response object
     * @returns {void} - Returns nothing
     * @swagger
     * /:
     *   get:
     *     summary: Health check endpoint
     *     description: Health check endpoint for checking if application is available/online without
     *                  running a downstream API operation
     *     responses:
     *       200:
     *         description: Successful healthcheck
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     */
    route_healthcheck( req:express.Request, res:express.Response ):void {

        res.status( 200 ).json( { success : true } );
    }

    /**
     * Handle IP address lookup requests
     *
     * @async
     * @param {express.Request} req - The Express request object
     * @param {express.Response} res - The Express response object
     * @returns {Promise<void>} - Returns a Promise that resolves when the lookup is complete
     * @swagger
     * /lookup-ip/{ip_address}:
     *   get:
     *     summary: Lookup IPv4 or IPv6 address information
     *     description: Calls 3rd party ip-api.com API to get information about an IP
     *     parameters:
     *       - name: ip_address
     *         in: path
     *         required: true
     *         type: string
     *         description: IPv4 or IPv6 address to lookup; example 209.142.68.29
     *       - name: fields
     *         in: query
     *         required: false
     *         description: Comma-delimited list of fields to include in the response
     *         style: form
     *         explode: false
     *         schema:
     *           type: array
     *           default: [
     *               'continent',
     *               'continentCode',
     *               'country',
     *               'countryCode',
     *               'region',
     *               'regionName',
     *               'city',
     *               'district',
     *               'zip',
     *               'lat',
     *               'lon',
     *               'timezone',
     *               'offset',
     *               'isp',
     *               'org',
     *               'as',
     *               'asname',
     *               'mobile',
     *               'proxy',
     *               'hosting',
     *               'query'
     *           ]
     *           items:
     *             type: string
     *             enum: [
     *                'continent',
     *                'continentCode',
     *                'country',
     *                'countryCode',
     *                'region',
     *                'regionName',
     *                'city',
     *                'district',
     *                'zip',
     *                'lat',
     *                'lon',
     *                'timezone',
     *                'offset',
     *                'isp',
     *                'org',
     *                'as',
     *                'asname',
     *                'mobile',
     *                'proxy',
     *                'hosting',
     *                'query',
     *                'reverse'
     *             ]
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 query_start_at:
     *                   type: string
     *                   format: date-time
     *                 query_stop_at:
     *                   type: string
     *                   format: date-time
     *                 query_ms:
     *                   type: integer
     *                 data:
     *                   type: object
     *                   properties:
     *                     queried_ip_addr:
     *                       type: string
     *                     country:
     *                       type: string
     *                     country_code:
     *                       type: string
     *                     continent:
     *                       type: string
     *                     continent_code:
     *                       type: string
     *                     region:
     *                       type: string
     *                     region_name:
     *                       type: string
     *                     city:
     *                       type: string
     *                     district:
     *                       type: string
     *                     zip:
     *                       type: string
     *                     lat:
     *                       type: number
     *                     lon:
     *                       type: number
     *                     timezone:
     *                       type: string
     *                     offset:
     *                       type: integer
     *                     isp:
     *                       type: string
     *                     org:
     *                       type: string
     *                     as:
     *                       type: string
     *                     as_name:
     *                       type: string
     *                     is_mobile:
     *                       type: boolean
     *                     is_proxy:
     *                       type: boolean
     *                     is_hosting:
     *                       type: boolean
     *                     reverse:
     *                       type: string
     *       400:
     *         description: Incorrect request (fails validation)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   default: false
     *                 errors:
     *                   type: array
     *                   items:
     *                     type: string
     *       500:
     *         description: Application error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   default: false
     *                 query_start_at:
     *                   type: string
     *                   format: date-time
     *                 query_stop_at:
     *                   type: string
     *                   format: date-time
     *                 query_ms:
     *                   type: integer
     *                 errors:
     *                   type: array
     *                   items:
     *                     type: string
     */
    async route_lookup_ip( req:express.Request, res:express.Response ):Promise<void> {

        try {

            //
            //  #1. Validate passed-in IP address
            //
            const ip_address        = req.params.ip_address as string;
            const validation_result = this.IpAddrUtils.validate_ip_addr( ip_address );

            if( validation_result.success !== true ) {

                res.status( 400 ).json( {
                    success : false,
                    errors  : validation_result.errors,
                } );

                return;
            }

            //
            //  #2. Call ip-api.com
            //
            const fields_str = req.query?.fields as string;
            const fields_arr = fields_str && fields_str.length ? fields_str.split( ',' ) : undefined;
            const lookup     = await this.IpAddrUtils.get_ip_info( ip_address, fields_arr );

            if( lookup.exception ) {

                console.error( 'Exception caught when running lookup!' );
                throw lookup.exception;
            }

            //
            //  #3. Format response and return to user
            //
            const response_obj:LookupIpResponse = { success : false };

            response_obj.success = lookup.success;

            if( lookup.data )           response_obj.data           = lookup.data;
            if( lookup.query_start_at ) response_obj.query_start_at = lookup.query_start_at;
            if( lookup.query_stop_at )  response_obj.query_stop_at  = lookup.query_stop_at;
            if( lookup.query_ms )       response_obj.query_ms       = lookup.query_ms;
            if( lookup.errors )         response_obj.errors         = lookup.errors;

            let response_status_code = 500;

            if( lookup.success ) {

                // Successful lookup
                response_status_code = 200;

            } else if(

                // Response from downsteam API gives us messages denoting invalid IP/input
                lookup.response?.message === 'invalid query' ||
                lookup.response?.message === 'private range'
            ) {

                // HTTP 400 for bad request (ie: invalid input data)
                response_status_code = 400;
            }

            res.status( response_status_code ).json( response_obj );

        } catch( error ) {

            console.error( 'Exception encountered during IP lookup!', error );

            res.status( 500 ).json( {
                success : false,
                errors  : [ 'Unexpected exception occured! Check console/log output for more details' ],
            } );
        }
    }
}
