# IP Address Lookup - CLI Tool

CLI tool for looking up information about an IPv4 or IPv6 address.

---

* **Application Entrypoint:**
    - [`dist/cli.js`](../dist/api.js) - Runs an IP information lookup for the supplied IP address as an argument; ex: `node dist/cli.js 209.142.68.29`
* **`package.json` scripts:**
    - `npm run cli` - Runs the `dist/cli.js` entrypoint with with an IP address as an argument; ex: `npm run cli "209.142.68.29"`
* **`package.json --save` Core Dependencies:**
    - [`chalk`](https://www.npmjs.com/package/chalk) - Colored CLI support
