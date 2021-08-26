<h1 align="center">Jinsokuna Restaurant App</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

Technical test required by Wellness.

Electricity usage CRUD built with React and DB seeded with three .csv files, served with NodeJS.

Layout built with Bootstrap and data visualisation made with Recharts.

<br/>

## Install

```sh
cd client; npm install; cd ../server; npm install;
```
Paste the following in the <code>.env</code> file:

```sh
PORT=5000

DB_NAME=wellness_data
DB_HOST=mongodb://localhost

DOMAIN=http://localhost:3000
```

## Usage

<br/>
Seed DB from .csv files:

```sh
cd server/bin; node seed.js;
```

In different terminals:

```sh
cd server; npm run start;
```
```sh
cd client; npm start;
```
<br/>
<hr>
<br/>

## Endpoints Table

<br/>

### Client

| Verb | Endpoint         | Result        |
| ---- | ---------------- | ------------- |
| GET  | "/"              | Home page     |
| GET  | "/consumos"      | Data table for CRUD operations     |
| GET  | "/graficos"      | Data visualisation page     |

<br/>

### Server

| Verb | Endpoint            | Result                              |
| ---- | ------------------- | ----------------------------------- |
| GET  | "/api/uses"         | All uses json                       |
| PUT  | "/api/:_id"         | Edit use                            |  
| DELETE  | "/api/:_id"      | Delete use                          |  

<br/>
<hr>
<br/>

## Author

<br/>

👤 **Jaime Fernández-Castaño**

* Github: [@jaimeferncast](https://github.com/jaimeferncast)
* LinkedIn: [@jaimeferncast](https://linkedin.com/in/jaimeferncast)
