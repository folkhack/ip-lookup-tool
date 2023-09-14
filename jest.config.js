export default {

    /////////////////////////////////////////////////////////////////////////////

    // Only run coverage for the TypeScript files in lib as everything in the root of `./src`
    //    is an entry point or constants
    'collectCoverageFrom': [
        'src/lib/**/*.ts'
    ],

    /////////////////////////////////////////////////////////////////////////////

    // A preset that is used as a base for Jest's configuration. A preset should point to an npm
    //    module that has a jest-preset.json, jest-preset.js, jest-preset.cjs or jest-preset.mjs
    //       file at the root
    // - "ts-jest" for no ESM support
    // - "ts-jest/presets/default-esm" for ESM support
    preset : 'ts-jest/presets/default-esm', // ts-jest with ESM support (allows for node_module imports)

    /////////////////////////////////////////////////////////////////////////////

    // Following "ESM Support" configuration example for Jest/TypeScript
    // - https://kulshekhar.github.io/ts-jest/docs/next/guides/esm-support

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
