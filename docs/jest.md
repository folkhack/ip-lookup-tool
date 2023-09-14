# Jest Tests/Coverage

Jest provides a testing framework for JavaScript, complete with a built-in coverage tool that generates reports on how much code is covered by tests. The framework supports various types of tests including unit, integration, and end-to-end, streamlining the testing process across different layers of your application.

---

* **Configuration/Tests:**
    - [`jest.config.js`](../jest.config.js) - Main configuraiton file that controls Jest testing
    - [`src/lib/*.test.ts`](../src/lib) - Unit tests for project libraries/classes
    - [`src/tests/*.test.ts`](../tests) - Integration tests for own Express HTTP API and ip-api.com API
* **`package.json` scripts:**
    - `npm run tests` - Runs the tests with `--silent` to suppress console.log/error statements
    - `npm run tests_verbose` - Runs the tests with full console output
    - `npm run coverage` - Runs the `*.test.ts` tests in `./src/lib` with `--silent` and `--coverage` options to suppress console.log/error statements and generate code coverage reports
    - `npm run coverage_verbose` - Runs the `*.test.ts` tests in `./src/lib` with `--coverage` option to generate code coverage reports with full console output
* **`package.json --save-dev` Development Dependencies:**
    - [`jest`](https://jestjs.io/) - JavaScript Testing Framework with a focus on simplicity
    - [`@types/jest`](https://www.npmjs.com/package/@types/jest) - Type definitions for Jest
    - [`ts-node`](https://typestrong.org/ts-node/) - TypeScript execution and REPL for Node.js, Jest requires it to read TypeScript configuration files
    - [`ts-jest`](https://www.npmjs.com/package/ts-jest) - Jest transformer with source map support that lets you use Jest to test projects written in TypeScript
    - [`eslint-plugin-jest`](https://github.com/jest-community/eslint-plugin-jest#readme) - ESLint plugin for Jest
    - [`supertest`](https://github.com/ladjs/supertest) - HTTP assertions made easy via [superagent](https://github.com/ladjs/superagent) used to test the Express HTTP API
    - [`@types/supertest`](https://www.npmjs.com/package/@types/supertest) Type definitions for supertest

---

### Node.js `--experimental-vm-modules` ECMAScript Modules Support

The `--experimental-vm-modules` flag is required when running `jest.js` with Node.js binary. This will generate a warning about using an experimental flag which can be ignored with `--no-warnings`. The following is what the base `npm run test` `package.json` script command:

```bash
# Run all Jest unit and integration tests
node --no-warnings --experimental-vm-modules node_modules/jest/bin/jest.js
```

More on **[Jest ECMAScript Modules »](https://jestjs.io/docs/ecmascript-modules)**

---

### Jest `--detectOpenHandles`, `--silent`

**NOTE:** Both of these are optional!

* `--detectOpenHandles` - Attempts to report on open handles preventing Jest from exiting cleanly; ex: a non-cleared `setTimeout`
* `--silent` - Hide `console.*` output to console and only show test/coverage results; this flag is the difference between the `npm run tests` and the `npm run tests_verbose` `package.json` scripts

```bash
# Run all Jest unit and integration tests with recommended Jest options
node --no-warnings --experimental-vm-modules node_modules/jest/bin/jest.js --detectOpenHandles --silent
node --no-warnings --experimental-vm-modules node_modules/jest/bin/jest.js --detectOpenHandles
```

More on **[`--detectOpenHandles` »](https://jestjs.io/docs/cli#--detectopenhandles)**

---

### Extensionless ECMAScript Module Imports

Jest tests do not require `.js` extensions on the imported modules. More information in the [TypeScript Docs »](./typescript.md)
