export interface IpAddrInfoData {
    queried_ip_addr : string;
    query_status? : string;
    query_message? : string;
    country? : string;
    country_code? : string;
    continent? : string;
    continent_code? : string;
    region? : string;
    region_name? : string;
    city? : string;
    district? : string;
    zip? : string;
    lat? : number;
    lon? : number;
    timezone? : string;
    offset? : number;
    isp? : string;
    org? : string;
    as? : string;
    as_name? : string;
    is_mobile? : boolean;
    is_proxy? : boolean;
    is_hosting? : boolean;
    reverse? : string;
}

export interface IpAddrInfoResponse {
    status : string;
    message? : string;
    country? : string;
    countryCode? : string;
    continent? : string;
    continentCode? : string;
    region? : string;
    regionName? : string;
    city? : string;
    district? : string;
    zip? : string;
    lat? : number;
    lon? : number;
    timezone? : string;
    offset? : number;
    isp? : string;
    org? : string;
    as? : string;
    asname? : string;
    mobile? : boolean;
    proxy? : boolean;
    hosting? : boolean;
    query? : string;
    reverse? : string;
}

export interface IpAddrInfoResult {

    success : boolean;

    // HTTP status code
    status_code? : number;

    // URL called
    url? : string;

    // Start/stop of operation
    query_start_at : Date;
    query_stop_at? : Date;

    // HTTP API query TTL in milliseconds
    query_ms? : number;

    // Strings of error messages to be displayed to user
    errors : string[];

    // To simplify exception handling we will not create/extend our own explicit Error object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exception? : any;

    // If a stack trace is on the exception error then it is stored here
    stack_trace? : string;

    // 1:1 response from API
    response? : IpAddrInfoResponse;

    // Repackaged data (snake-case)
    data? : IpAddrInfoData;
}

export interface IpUtilsValidationResult {
    success : boolean;
    errors : string[];
}

export interface IpUtilsLookupInterface {

    validate_ip_addr( ip_addr:string ):IpUtilsValidationResult;
    get_ip_info( ip_addr:string, fields_arr:string[] ):Promise<IpAddrInfoResult>
}
