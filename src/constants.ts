//
//  IMPORTANT!
//  - Optionally expects .env to be loaded into process.env
//

import { HttpScheme } from './lib/FetchHttpClient.js';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

//
//  Both HTTP API and ip-api.com Fields
//  - What fields to query from both our HTTP API, as well as the downstream ip-api.com API
//

export const ALL_FIELDS = [
    'continent',
    'continentCode',
    'country',
    'countryCode',
    'region',
    'regionName',
    'city',
    'district',
    'zip',
    'lat',
    'lon',
    'timezone',
    'offset',
    'isp',
    'org',
    'as',
    'asname',
    'mobile',
    'proxy',
    'hosting',
    'query',
    'reverse', // Keep at end! (popped off for fields_without_reverse)
];

const fields_without_resverse = [ ...ALL_FIELDS ];
fields_without_resverse.pop();

export const DEFAULT_FIELDS = fields_without_resverse;

export const FIELDS = process.env.FIELDS === 'string' && process.env.FIELDS.length ?
    process.env.FIELDS.split( ',' ) :
    DEFAULT_FIELDS;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

//
//  ip-api.com Config
//  - HTTPS does not work with API apparently
//

export const DEFAULT_IP_INFO_API_HTTP_SCHEME = HttpScheme.HTTP;
export const DEFAULT_IP_INFO_API_HOST        = 'ip-api.com';
export const DEFAULT_IP_INFO_API_PORT        = 80;
export const DEFAULT_IP_INFO_API_TIMEOUT_MS  = 2000;

export const IP_INFO_API_HTTP_SCHEME =
    process.env.IP_INFO_API_USE_HTTPS === 'true' ?
        HttpScheme.HTTPS :
        DEFAULT_IP_INFO_API_HTTP_SCHEME;

export const IP_INFO_API_HOST =
    typeof process.env.IP_INFO_API_HOST === 'string' && process.env.IP_INFO_API_HOST.length ?
        process.env.IP_INFO_API_HOST :
        DEFAULT_IP_INFO_API_HOST;

export const IP_INFO_API_PORT =
    typeof process.env.IP_INFO_API_PORT === 'string' && process.env.IP_INFO_API_PORT.length ?
        parseInt( process.env.IP_INFO_API_PORT ) :
        DEFAULT_IP_INFO_API_PORT;

export const IP_INFO_API_TIMEOUT_MS =
    typeof process.env.IP_INFO_API_TIMEOUT_MS === 'string' && process.env.IP_INFO_API_TIMEOUT_MS.length ?
        parseInt( process.env.IP_INFO_API_TIMEOUT_MS ) :
        DEFAULT_IP_INFO_API_TIMEOUT_MS;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

//
//  HTTP API Config
//  - Both client/server settings
//  - Timeout slightly longer than downstream API timeout to allow error to ip-api.com
//    error to likely pass through
//

export const DEFAULT_HTTP_API_PORT               = 63100;
export const DEFAULT_HTTP_API_CLIENT_HTTP_SCHEME = HttpScheme.HTTP;
export const DEFAULT_HTTP_API_CLIENT_HOST        = 'localhost';
export const DEFAULT_HTTP_API_CLIENT_TIMEOUT_MS  = 2500;

export const HTTP_API_PORT =
    typeof process.env.HTTP_API_PORT === 'string' && process.env.HTTP_API_PORT.length ?
        parseInt( process.env.HTTP_API_PORT ) :
        DEFAULT_HTTP_API_PORT;

export const HTTP_API_CLIENT_HTTP_SCHEME =
    process.env.HTTP_API_CLIENT_USE_HTTPS === 'true' ?
        HttpScheme.HTTPS :
        DEFAULT_HTTP_API_CLIENT_HTTP_SCHEME;

export const HTTP_API_CLIENT_HOST =
    typeof process.env.HTTP_API_CLIENT_HOST === 'string' && process.env.HTTP_API_CLIENT_HOST.length ?
        process.env.HTTP_API_CLIENT_HOST :
        DEFAULT_HTTP_API_CLIENT_HOST;

export const HTTP_API_CLIENT_TIMEOUT_MS =
    typeof process.env.HTTP_API_CLIENT_TIMEOUT_MS === 'string' && process.env.HTTP_API_CLIENT_TIMEOUT_MS.length ?
        parseInt( process.env.HTTP_API_CLIENT_TIMEOUT_MS ) :
        DEFAULT_HTTP_API_CLIENT_TIMEOUT_MS;
