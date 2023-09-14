# IP Lookup Tool

This project is a proof-of-concept for a good-practices Node.js/Typescript application. It is a fully functional IP address validation and lookup tool that uses [ip-api.com](https://ip-api.com) to query information about the supplied address.

There is a CLI tool, and a HTTP API.

##### Application Features:

* Linux, Mac, Windows support
* IPv4 and IPv6 lookup support
* Input validation, error handling
* [CLI](docs/cli.md) - `npm run cli "70.95.21.162"`
* [HTTP API](docs/http_api.md) - `npm run api` then [http://localhost:63100/lookup-ip/209.142.68.29](http://localhost:63100/lookup-ip/209.142.68.29)

##### Development Features:

* Linux, Mac, Windows support
* Node.js LTS
* ECMAScript 2015 Module Imports
* TypeScript - [`tsconfig.json`](./tsconfig.json)
* eslint (linting) - [`.eslintrc.json`](./.eslintrc.json)
* Jest (testing) - `npm run tests`; [`jest.config.js`](./jest.config.js)
    - Unit testing - `npm run tests ./src/lib`; [`src/lib/**/*.test.ts`](./src/lib)
    - Integration testing
        + `npm run tests ./tests`;
        + Downstream ip-api.com API [`tests/integration_ip-api.com.test.ts`](./tests/integration_ip-api.com.test.ts)
        + HTTP API [`tests/integration_http_api.test.ts`](./tests/integration_http_api.test.ts)
    - Code coverage at 100% - `npm run coverage`
* Swagger API documentation - `npm run swagger_docs` then [localhost:63120](http://localhost:63120)
* Sublime 4 workflow (linting, TypeScript support w/LSP, Linux/Mac/Windows support) - [`*.sublime-project`](ip_lookup_tool.sublime-project)

---

## Usage:

**NOTE:** `npm run` statements correlate to `package.json` scripts. Full invocation is specified in there, and will show when running `npm run script_name`.

#### Node.js Setup/Dependencies

```bash
# Use the project's .nvmrc specified Node.js/npm version
nvm use

# Install project dependencies
npm install

# Copy over the .env.default sample and configure (optional!)
# - Tests will runn successfully without .env
cp .env.default .env
nano .env
```

#### Building `./dist` JavaScript

```bash
# Compile the TypeScript into native JavaScript to ./dist
npm run compile

# Delete compiled *.js files in ./dist
npm run clean
```

#### Running CLI and HTTP

```bash
# CLI (via npm run, or manually; IPv4 and IPv6 support)
npm run cli "209.142.68.29"
npm run cli "2602:fea7:d00::25"

# HTTP API (both package.json script invocation + compiled JS invocation)
npm run api
node ./dist/api.js
```

#### Development Tooling

```bash
## eslint linting ##############################################################

# Run eslint linter
npm run lint

# Run eslint and automatically fix what we can
npm run lint_fix

## Jest tests ##################################################################

# Run Jest tests/code coverage report
# - use _verbose to see exceptions and console.log output
npm run tests
npm run tests_verbose

# Runs the integration tests in ./tests only
npm run tests ./tests
npm run tests_verbose ./tests

# Runs the unit tests in ./src/lib only
npm run tests ./src/lib
npm run tests_verbose ./src/lib

# Runs unit tests in ./src/lib only with coverage reports
npm run coverage
npm run coverage_verbose

## Swagger docs ###############################################################

# Launch the Swagger docs (via swagger-express-ui)
npm run swagger_docs
```

---

### Project Parts:

The following are the major parts that make up the application's build system. The docs guide you through a rough setup of each sub-system to support the application/application development.

* [Node.js/base setup](docs/node.md) - Base nvm/Node.js installation, module imports, `package.json` setup
* [TypeScript](docs/typescript.md) - strongly typed programming language built on JavaScript
* [Jest](docs/jest.md) - Unit and integration testing, code coverage
* [eslint](docs/eslint.md) - linting, code formatting
* [HTTP API Swagger Docs](docs/swagger.md) - Swagger docs for the HTTP API
* [Application - CLI](docs/cli.md) - CLI interface for built IP lookup application
* [Application - HTTP API](docs/http_api.md) - Express HTTP API interface for built IP lookup application
* [Sublime Text 4](docs/sublime.md) - Project config designed to use TypeScript language server and eslint linting

---

### Modifying to Taste:

This is an optional list to help you get started modifying this project a sane starting-point for another project. This is not a definitive list and avoids documenting obvious things like dependencies.

* Project name:
    - Rename `*.sublime-project` to `project_name.sublime-project`
    - Set `name` in [`package.json`](/package.json)
    - Search for "ip_lookup_tool" in the docs:
        + `README.md` (this file)
* ECMA version:
    - [`tsconfig.json`](/tsconfig.json)
        + `compilerOptions.target`
        + `compilerOptions.module`
    - [`.eslintrc.json`](/.eslintrc.json)
        + `env.es6` for modern ECMA features
        + `parserOptions.ecmaVersion`
* Module support:
    - [`package.json`](/package.json)
        + `type` (remove if CJS desired)
    - [`tsconfig.json`](/tsconfig.json)
        + `compilerOptions.moduleResolution`
        + `compilerOptions.module`
    - [`.eslintrc.json`](/.eslintrc.json)
        + `env.es6` for modern ECMA features
        + `parserOptions.sourceType`
    - [`jest.config.js`](/jest.config.js)
        + `preset`
        + `extensionsToTreatAsEsm`
        + `transform` (modify/remove `useEsm` transforms)
* Node.js support:
    - [`tsconfig.json`](/tsconfig.json)
        + `compilerOptions.moduleResolution`
    - [`.eslintrc.json`](/.eslintrc.json)
        + `env.node`
        + `extends` - `plugin:n/recommended`
        + Remove Node-specific rules
* TypeScript support:
    - [`.eslintrc.json`](/.eslintrc.json)
        + `parser`
        + `extends` - `@typescript-eslint/recommended`
        + `plugins` - `@typescript-eslint`
        + Remove TypeScript-specific rules
* Browser support:
    - [`tsconfig.json`](/tsconfig.json)
        + `compilerOptions.moduleResolution`
    - [`.eslintrc.json`](/.eslintrc.json)
        + `env.browser`
        + Remove Browser-specific rules
    - [`jest.config.js`](/jest.config.js)
        + `testEnvironment`
* Jest support:
    - [`.eslintrc.json`](/.eslintrc.json)
        + `env.jest`
        + `plugins` - `jest`
        + Remove Jest-specific rules

---

## TODO + Issues/Roadmap:

#### Backlog:

* Eventually need to update `n/no-missing-import` in `.eslintrc.json` to support typescriptExtensionMap; feature should be arriving soon in next eslint release
    - Currently set to "off" which is not ideal - would like to have missing import linting as this would catch errors in the build process
    - https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-missing-import.md
    - https://github.com/eslint-community/eslint-plugin-n/commit/20d2713de7054b823ab29f40925ba782123208c3
