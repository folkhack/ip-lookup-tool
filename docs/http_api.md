# IP Address Lookup - HTTP API

HTTP API for looking up information about an IPv4 or IPv6 address.

---

* **Application Entrypoint:**
    - [`dist/api.js`](../dist/api.js) - Starts the HTTP API Express server
* **`package.json` scripts:**
    - `npm run api` - Runs the `dist/api.js` entrypoint to start the HTTP API Express server
* **`package.json --save` Core Dependencies:**
    - [`express`](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
    - [`cors`](https://github.com/expressjs/cors) - Provides [Connect](https://github.com/senchalabs/connect)/Express middleware that can be used to enable CORS with various options
    - [`supertest`](https://github.com/ladjs/supertest) - HTTP assertions made easy via [superagent](https://github.com/ladjs/superagent) used to test the Express HTTP API
* **`package.json --save-dev` Development Dependencies:**
    - [`@types/express`](https://www.npmjs.com/package/@types/express) - Type definitions for `express`
    - [`@types/cors`](https://www.npmjs.com/package/@types/cors) - Type definitions for `cors`
    - [`@types/supertest`](https://www.npmjs.com/package/@types/supertest) - Type definitions for `supertest`

---

### HTTP API Documentation

This API is documented in two locations:

* **Manually documented** - This doc `http_api.md`
* Swagger docs in [`swagger.md`](./swagger.md)
  - **NOTE:** Hosted Swagger docs has a full IP Address Lookup HTTP API client implementation to use for development/testing!

---

#### Healthcheck - GET `/`:

* GET /
* HTTP response 200

```json
{ "success": true }
```

---

#### Lookup IP - GET `/lookup-ip`:

##### Lookup w/all fields - Success

* GET "/lookup-ip/209.142.68.29?fields=continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,isp,org,as,asname,mobile,proxy,hosting,query,reverse"
* HTTP response 200

```json
{
  "success": true,
  "query_start_at": "2023-09-00T00:00:17.000Z",
  "query_stop_at": "2023-09-00T00:00:17.050Z",
  "query_ms": 50,
  "data": {
    "queried_ip_addr": "209.142.68.29",
    "country": "United States",
    "country_code": "US",
    "continent": "North America",
    "continent_code": "NA",
    "region": "CA",
    "region_name": "California",
    "city": "Test City",
    "district": "Test District",
    "zip": "55555",
    "lat": 50.123,
    "lon": -100.123,
    "timezone": "America/Los_Angeles",
    "offset": -25200,
    "isp": "Test ISP",
    "org": "Test Company",
    "as": "AS123123 Test Company",
    "as_name": "TEST-ASNAME",
    "is_mobile": false,
    "is_proxy": false,
    "is_hosting": false,
    "reverse": "reverse.123.123.com"
  }
}
```


##### Lookup w/some fields - Success

* GET "/lookup-ip/209.142.68.29?fields=continentCode,countryCode,region,regionName,city,zip,lat,lon"
* HTTP response 200

```json
{
  "success": true,
  "query_start_at": "2023-09-00T00:00:17.000Z",
  "query_stop_at": "2023-09-00T00:00:17.050Z",
  "query_ms": 50,
  "data": {
    "country_code": "US",
    "continent_code": "NA",
    "region": "CA",
    "region_name": "California",
    "city": "Test City",
    "zip": "55555",
    "lat": 50.123,
    "lon": -100.123
  }
}
```


##### Empty IP Address - Failure

* GET "/lookup-ip/?fields=continentCode,countryCode,region,regionName,city,zip,lat,lon"
* HTTP response 400

```json
{
  "success": false,
  "errors": [
    "IP address cannot be empty",
    "IP address format invalid"
  ]
}
```


##### Invalid IP Address - Failure

* GET "/lookup-ip/209.142.68.256?fields=continentCode,countryCode,region,regionName,city,zip,lat,lon"
* HTTP response 400

```json
{
  "success": false,
  "errors": [
    "IP address format invalid"
  ]
}
```


##### Invalid IP Address (downstream API) - Failure

* GET "/lookup-ip/209.142.68.29?fields=continentCode,countryCode,region,regionName,city,zip,lat,lon"
* HTTP response 400

```json
{
  "success": false,
  "query_start_at": "2023-09-00T00:00:17.000Z",
  "query_stop_at": "2023-09-00T00:00:17.050Z",
  "query_ms": 50,
  "errors": [
    "API response status \"fail\" != \"success\"",
    "API error message \"invalid query\""
  ]
}
```


##### API host not found - Failure

* GET "/lookup-ip/209.142.68.29?fields=continentCode,countryCode,region,regionName,city,zip,lat,lon"
* HTTP response 500

```json
{
  "success": false,
  "query_start_at": "2023-09-00T00:00:17.000Z",
  "query_stop_at": "2023-09-00T00:00:17.050Z",
  "query_ms": 50,
  "errors": [
    "API host not found"
  ]
}
```


##### API connection refused - Failure

* GET "/lookup-ip/209.142.68.29?fields=continentCode,countryCode,region,regionName,city,zip,lat,lon"
* HTTP response 500

```json
{
  "success": false,
  "query_start_at": "2023-09-00T00:00:17.000Z",
  "query_stop_at": "2023-09-00T00:00:17.050Z",
  "query_ms": 50,
  "errors": [
    "API connection refused"
  ]
}
```


##### API timeout - Failure

* GET "/lookup-ip/209.142.68.29?fields=continentCode,countryCode,region,regionName,city,zip,lat,lon"
* HTTP response 2000

```json
{
  "success": false,
  "query_start_at": "2023-09-00T00:00:17.000Z",
  "query_stop_at": "2023-09-00T00:00:17.050Z",
  "query_ms": 50,
  "errors": [
    "API timeout"
  ]
}
```
