import dotenv from 'dotenv';
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { HTTP_API_PORT } from '../src/constants';

dotenv.config();

const default_swagger_docs_port = 63120;

// Swagger docs port - also accept as a CLI arg
const swagger_docs_port = process.argv[ 2 ] && typeof process.argv[ 2 ] === 'string' && process.argv[ 2 ].length ?
    parseInt( process.argv[ 2 ] ) :
    default_swagger_docs_port;

const swagger_jsdoc_opts = {
    definition : {
        openapi : '3.1.0',
        info    : {
            title   : 'IP Lookup Tool HTTP API Documentation',
            version : '1.0.0',
        },
        servers : [
            {
                url         : 'http://localhost:' + HTTP_API_PORT,
                description : 'IP Info HTTP API on port ' + HTTP_API_PORT,
            },
        ],
    },
    apis: [ './src/lib/HttpApi.ts' ],
};

// Disable the toolbar (no search bar/functionality so is just the Swagger logo)
const swagger_ui_opts = {
    customCss: '.swagger-ui .topbar { display: none }',
};

const specs = swaggerJsdoc( swagger_jsdoc_opts );
const app   = express();

app.use( '/', swaggerUi.serve, swaggerUi.setup( specs, swagger_ui_opts ) );

console.log( 'Starting Swagger docs for IP info lookup HTTP API on port ' + swagger_docs_port );

app.listen( swagger_docs_port, () => {

    console.log( 'Swagger docs for IP info lookup HTTP API running on port ' + swagger_docs_port );
    console.log();
    console.log( '------------------------------------------------------------' );
    console.log();
    console.log( '    http://localhost:' + swagger_docs_port );
    console.log();
    console.log( '------------------------------------------------------------' );
    console.log();
} );
