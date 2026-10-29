# Market

A small product-catalogue backend with user signup/login, built with Express 5, TypeScript and PostgreSQL. Authentication uses JSON Web Tokens; schema changes are managed with `node-pg-migrate`.

## Tech stack

TypeScript, Node.js, Express 5, PostgreSQL (`pg`), `node-pg-migrate`, `jsonwebtoken`.

## Getting started

Prerequisites: Node.js 18+, PostgreSQL.

```bash
git clone https://github.com/a-3isa/market.git
cd market
npm install
```

Create a database named `market`, then provide your own configuration. Replace every value, and never reuse the development defaults committed in `config.env`:

```env
PORT=3000
DATABASE_URL=postgres://<user>:<password>@localhost:5432/market
JWT_SECRET=<long random string>
JWT_EXPIRES_IN=90d
```

`PORT` is the API server port, not PostgreSQL's 5432 (that belongs in `DATABASE_URL`).

```bash
npm run migrate up
npm start
```

## Project layout

```
src/            Express app, routes and controllers (TypeScript)
migrations/     node-pg-migrate migrations
package.json
tsconfig.json
```

## Status

A learning project covering authentication, a relational schema and migrations. The UI is minimal.
