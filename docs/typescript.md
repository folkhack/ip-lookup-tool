# TypeScript

TypeScript adds static type checking to JavaScript, allowing for early error detection and more robust code. It also provides features like interfaces and generics, enhancing code quality and maintainability.

---

* **Configuration:**
    - [`tsconfig.json`](../tsconfig.json) - Main configuraiton file that controls TypeScript
* **`package.json` scripts:**
    - `npm run compile` - Compiles the TypeScript source in `src/**/*.ts` to plain JavaScript in `dest/**/*.js`
* **`package.json --save-dev` Development Dependencies:**
    - [`typescript`](https://www.typescriptlang.org/) - TypeScript is a strongly typed programming language that builds on JavaScript
    - [`ts-node`](https://typestrong.org/ts-node/) - TypeScript execution and REPL for Node.js; used for both Jest tests and Swagger docs
    - [`@typescript-eslint/eslint-plugin`](https://typescript-eslint.io/) - The tooling that enables ESLint and Prettier to support TypeScript
    - [`@typescript-eslint/parser`](https://github.com/typescript-eslint/typescript-eslint) - ESLint parser which leverages TypeScript ESTree to allow for ESLint to lint TypeScript source code
    - [`ts-jest`](https://www.npmjs.com/package/ts-jest) - Jest transformer with source map support that lets you use Jest to test projects written in TypeScript

---

### `.js`/Extensionless ECMAScript Module Imports:

When importing modules use `.js` extension; ex: `import foo from './path/to/lib.js'`. The exceptions for this are things that are not compiled such-as the `*.test.ts` Jest tests and the `ts-node` driven `swagger/serve_swagger_docs.ts` Express HTTP API Swagger docs server.

**NOTE:** Jest tests will strip the `.js` extension off with the `moduleNameMapper` in `jest.config.js` meaning this convention works there as well.

##### Examples:

```typescript
//
//  Application `*.ts` module
//

// ✅ Works! Language server processing works as well!
import { GreetingHelper } from './lib/GreetingHelper.js';

// ❌ WILL NOT WORK!
// - Module will not be found on run
// - Causes issues with nested imports when ran from Jest
// - OK to use in ts-node ran Jest tests and Swagger docs!
import { GreetingHelper } from './lib/GreetingHelper';
```
