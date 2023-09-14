export enum HttpScheme {
    HTTP = 'http',
    HTTPS = 'https',
}

export interface QueryParameters {
    [ key: string ]: string|number|boolean;
}

export interface HttpResponse {

    url:string,
    status_code:number,

    // Allow any due to ambiguous response data (will be cast when queried)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response_data:any
}

export class FetchHttpClient {

    http_scheme:HttpScheme;
    hostname:string;
    port:number;
    timeout_ms:number;

    /**
     * Create an instance of the fetch HTTP client wrapper
     *
     * @param {HttpScheme} http_scheme - The HTTP scheme to use (http or https)
     * @param {string} hostname - The hostname of the server
     * @param {number} port - The port number to connect to
     * @param {number} timeout_ms - The timeout in milliseconds
     */
    constructor( http_scheme:HttpScheme, hostname:string, port:number, timeout_ms:number ) {

        this.http_scheme = http_scheme;
        this.hostname    = hostname;
        this.port        = port;
        this.timeout_ms  = timeout_ms;
    }

    /**
     * Wrapper around fetch API with timeout functionality
     *
     * @param {string} url - The URL to fetch
     * @param {string} options - Fetch API options; defaults to {}
     * @param {number} timeout_ms - Timeout in milliseconds; defaults to 2000
     * @returns {Promise<Response>} Promise with the fetched response
     */
    async fetch( url: string, options: RequestInit = {}, timeout_ms: number = 2000 ): Promise<Response> {

        let timer: NodeJS.Timeout | number | undefined;

        // Wrap both the fetch and the timer in promises
        const timeout_promise = new Promise<Response>( ( _, reject ) => {

            timer = setTimeout( () => {
                reject( new Error( 'Request timed out' ) );
            }, timeout_ms );
        } );

        try {

            const fetch_promise = fetch( url, options );

            // Use Promise.race to see which promise resolves/rejects first
            const result = await Promise.race( [ fetch_promise, timeout_promise ] );
            return result;

        } finally {

            // Clear the timer in either case
            if( timer !== undefined ) clearTimeout( timer );
        }
    }


    /**
     * Perform an HTTP GET request.
     *
     * @async
     * @param {string} pathname - The path of the URL to request.
     * @param {QueryParameters} [query_params] - Optional query parameters to include in the URL.
     * @returns {Promise<Object>} An object containing the status code and JSON response data.
     */
    async get( pathname:string, query_params?:QueryParameters ):Promise<HttpResponse> {

        // Initialize URL object with scheme and hostname
        const url = new URL( this.http_scheme + '://' + this.hostname );

        // Set port for the URL
        url.port = String( this.port );

        // Set the pathname for the URL
        url.pathname = pathname;

        // Check if query parameters are provided
        if( query_params ) {

            // Initialize URLSearchParams object
            const params = new URLSearchParams;

            // Loop through query_params object and append to URLSearchParams
            for( const [ key, value ] of Object.entries( query_params ) ) {

                params.append( key, String( value ) );
            }

            // Set the search field of the URL
            url.search = params.toString();
        }

        // Perform the fetch request and await response
        const response = await this.fetch( url.toString(), {}, this.timeout_ms );

        // Return the status code and JSON response data
        const return_response:HttpResponse = {
            url           : response.url,
            status_code   : response.status,
            response_data : await response.json(),
        };

        return return_response;
    }
}
