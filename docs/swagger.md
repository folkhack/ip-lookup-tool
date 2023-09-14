# Swagger API Docs + API Client

Swagger API specifications offer a standard, language-agnostic way to describe RESTful APIs. This enables automatic documentation, code generation, and client SDK generation, simplifying both development and integration.

Fully defines same API specified in [`docs/http_api.md` »](./http_api.md)

---

* **URL:** - Default location when hosted is at [localhost:63120](http://localhost:63120) after started with `npm run swagger_docs`
    - **IMPORTANT!** - You can test the entire API for the IP lookup tool's HTTP API from the Swagger docs UI!
* **Server Entrypoint:**
    - [`swagger/serve_swagger_docs.ts`](../swagger/serve_swagger_docs.ts) - TypeScript Express Swagger docs server entrypoint
* **`package.json` scripts:**
    - `npm run swagger_docs` - Start the Swagger docs server
* **`package.json --save-dev` Development Dependencies:**
    - [`ts-node`](https://typestrong.org/ts-node/) - TypeScript execution and REPL for Node.js, used to run Swagger Express server
    - [`swagger-ui-express`]() - Auto-generated [`swagger-ui`](https://swagger.io/tools/swagger-ui/) generated API docs from Express
    - [`@types/swagger-ui-express`](https://www.npmjs.com/package/@types/swagger-ui-express) - Type definitions for `swagger-ui-express`
    - [`swagger-jsdoc`]() - Reads JSDoc-annotated source code to generate an OpenAPI (Swagger) specification
    - [`@types/swagger-jsdoc`](https://www.npmjs.com/package/@types/swagger-jsdoc) - Type definitions for `swagger-jsdoc`

---

### Change Hosted Docs Port

If you need to change the port then just supply an argument with the desired port to the Node.js `package.json` script (or full command):

```bash
# Custom Swagger docs port
npm run swagger_docs 40012
node --no-warnings --loader ts-node/esm --experimental-specifier-resolution=node swagger/serve_swagger_docs.ts 40012
```

---

### Node.js ECMAScript Module Support Flags

* `--loader ts-node/esm` - Use `ts-node` ESM module-specific loader
* `--experimental-specifier-resolution=node` - Allows for extensionless imports in `swagger/serve_swagger_docs.ts` to match Jest tests
* `--no-warnings` - Disable Node.js experimental feature warning due to `--experimental-specifier-resolution=node`

```bash
# Serve the Swagger docs via Express server
node --no-warnings --loader ts-node/esm --experimental-specifier-resolution=node swagger/serve_swagger_docs.ts
```

**[More Information »](https://stackoverflow.com/a/68969661)**

---

### Extensionless ECMAScript Module Imports

Swagger docs server does not require `.js` extensions on the imported modules due to being ran with `ts-node`. More information in the [TypeScript Docs »](./typescript.md)
