// eslint-disable-next-line n/no-extraneous-import
import { jest } from '@jest/globals';

import { HttpApiClient } from './HttpApiClient';
const Client = new HttpApiClient;

let arbitrary_throw = false;

// Mocking the global fetch function
( global.fetch as jest.Mock ) = jest.fn( ( url ) => {

    if( url && typeof url === 'string' && url.includes( 'timeout' ) ) {

        return Promise.reject( new Error( 'Request timed out [mocked]' ) );
    }

    if( arbitrary_throw ) {

        throw new Error( 'Arbitrary throw!' );
    }

    return Promise.resolve( {
        url,
        status : 200,
        json   : () => {
            return Promise.resolve( {
                success: true,

                // Tests string to Date datatype conversion
                query_start_at : String( new Date ),
                query_stop_at  : String( new Date ),
            } );
        },
    } );
} );

// Clear the mocks/throw flag before tests
beforeEach( () => {
    ( fetch as jest.Mock ).mockClear();
    arbitrary_throw = false;
} );

describe( 'HttpApiClient', () => {

    it( 'Successfully fetches healthcheck', async() => {

        const response = await Client.check_health();
        expect( response ).toEqual( true );
    } );

    it( 'Failed healthcheck returns false', async() => {

        arbitrary_throw = true;

        const response = await Client.check_health();
        expect( response ).toEqual( false );
    } );

    it( 'Successfully handles lookup', async() => {

        const response = await Client.lookup_ip( '8.8.8.8', [ 'country' ] );

        expect( response.url ).toBe( 'http://localhost:63100/lookup-ip/8.8.8.8?fields=country' );
        expect( response.status_code ).toBe( 200 );
        expect( response.response_data?.success ).toBe( true );
        expect( response.response_data?.query_start_at ).toBeInstanceOf( Date );
        expect( response.response_data?.query_stop_at ).toBeInstanceOf( Date );
    } );

    it( 'Successfully handles error on lookup', async() => {

        await expect( Client.lookup_ip( 'timeout', [ 'country' ] ) )
            .rejects
            .toThrow();
    } );
} );
