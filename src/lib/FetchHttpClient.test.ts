// eslint-disable-next-line n/no-extraneous-import
import { jest } from '@jest/globals';
import { FetchHttpClient, HttpScheme } from './FetchHttpClient';

const Client = new FetchHttpClient( HttpScheme.HTTP, 'api.example.com', 80, 2000 );

let timer: NodeJS.Timeout | number | undefined;

// Clear the mocks before tests
beforeEach( () => {
    ( fetch as jest.Mock ).mockClear();
} );

// Tear down timer at end of tests
afterAll( () => {

    if( timer ) clearTimeout( timer );
} );

// Mocking the global fetch function
( global.fetch as jest.Mock ) = jest.fn( ( url ) => {

    if( url && typeof url === 'string' && url.includes( 'timeout' ) ) {

        return Promise.reject( new Error( 'Request timed out [mocked]' ) );
    }

    return Promise.resolve( {
        url,
        status : 200,
        json   : () => { return Promise.resolve( { success : true } ); },
    } );
} );

// Fully mocked fetch with a 3000ms timeout to surpass configured fetch timeout
const timeout_promise = ():Promise<Response> => {

    return new Promise( ( resolve ) => {

        timer = setTimeout( () => {

            const mock_body_str   = 'hello world!';
            const mock_body_uint8 = new Uint8Array( Buffer.from( mock_body_str, 'utf8' ) );
            const mock_body_blob  = new new Blob( [ mock_body_uint8 ] );

            const mock_response:Response = {
                json       : () => { return Promise.resolve( {} ); },
                headers    : new Headers,
                ok         : true,
                redirected : false,
                status     : 200,
                statusText : 'OK',
                type       : 'default',
                url        : 'https://api.example.com/data',
                clone      : () => { return { ...mock_response }; },
                bodyUsed   : true,
                body       : mock_body_blob.stream(),
                text       : () => { return Promise.resolve( mock_body_str ); },

                // Still valid since this returns a promise
                // eslint-disable-next-line require-await
                arrayBuffer: async() => {

                    return mock_body_uint8.buffer;
                },

                // Still valid since this returns a promise
                // eslint-disable-next-line require-await
                blob: async() => { return mock_body_blob; },

                formData: () => { return Promise.resolve( new FormData ); },
            };

            resolve( mock_response );

        }, 3000 );
    } );
};

describe( 'FetchHttpClient', () => {

    it( 'Successfully fetches within the timeout', async() => {
        const response = await Client.fetch( '/data', {}, 3000 );
        expect( response.json() ).resolves.toEqual( { success : true } );
    } );

    it( 'Times out before fetch completes', async() => {

        // Make fetch delay longer than timeout
        jest.spyOn( global, 'fetch' ).mockImplementationOnce( timeout_promise );

        await expect( Client.fetch( '/data', {}, 1000 ) )
            .rejects
            .toThrow( 'Request timed out' );
    } );

    it( 'Works with default parameters', async() => {

        const response = await Client.fetch( '/data' );
        expect( response.json() ).resolves.toEqual( { success : true } );
    } );

    it( 'Successfully performs a GET request', async() => {

        const response = await Client.get( '/data' );
        expect( response.status_code ).toBe( 200 );
        expect( response.response_data ).toEqual( { success : true } );
    } );

    it( 'Successfully performs a GET request with query parameters', async() => {

        const response = await Client.get( '/data', { key : 'value' } );
        expect( response.status_code ).toBe( 200 );
        expect( response.url ).toContain( '?key=value' );
        expect( response.response_data ).toEqual( { success : true } );
    } );

    it( 'Handles timeout errors', async() => {
        await expect( Client.get( '/timeout' ) )
            .rejects
            .toThrow( 'Request timed out [mocked]' );
    } );
} );
