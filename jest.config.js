export default {

    /////////////////////////////////////////////////////////////////////////////

    // Only run coverage for the TypeScript files in lib as everything in the root of `./src`
    //    is an entry point or constants
    'collectCoverageFrom': [
        'src/lib/**/*.ts'
    ],


    // Enable useESM true for ts-jest config
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            { useESM : true },
        ],
    },

    // Treat all TypeScript files as ESM modules
    extensionsToTreatAsEsm : [ '.ts' ],

    // Remove the .js extension when running tests because Jest is directly running the TypeScript
    //    files instead of compiling them to JavaScript
    moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },

    /////////////////////////////////////////////////////////////////////////////

    // The default environment in Jest is a Node.js environment
    // - If you are building a web app, you can use a browser-like environment through jsdom instead
    // testEnvironment: 'jsdom',
};
