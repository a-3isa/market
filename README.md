# Market

[![CI](https://github.com/a-3isa/market/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/a-3isa/market/actions/workflows/ci.yml)

A small product-catalogue API built with Express 5, TypeScript and PostgreSQL: users sign up and log in with JSON Web Tokens, admins manage products with options (size, colour, ...), and users can follow each other. Schema changes are managed with `node-pg-migrate`.

## Features

- **Accounts:** signup and login; passwords stored as salted scrypt hashes; tokens valid for 2 days. New accounts are clients; admins are promoted in the database.
- **Catalogue:** admins create products with any number of options and option values, and delete them. Clients see id, name, image and price; admins see every column.
- **Social:** follow another user.

## Architecture

```mermaid
flowchart LR
    client[Client or Postman] -->|JWT| api[Express 5 API]
    api -->|pg| db[(PostgreSQL:<br/>users, followers, products,<br/>product_options, product_option_values)]
```

## Tech stack

TypeScript 7, Node.js 20+, Express 5, PostgreSQL (`pg`), `node-pg-migrate`, `jsonwebtoken`.

## Getting started

```bash
git clone https://github.com/a-3isa/market.git
cd market
npm ci
cp config.env.example config.env      # then fill in the values
```

| Variable | Used by | Purpose |
|---|---|---|
| `DATABASE_LOCAL`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE` | API | PostgreSQL host, user, password and database name |
| `PORT` | API | PostgreSQL **port** (e.g. 5432). The API itself always listens on 3000 |
| `JWT_SECRET` | API | Signs tokens; the API will not start without it |
| `JWT_COOKIE_EXPIRES_IN` | API | Days the `jwt` cookie lasts (default 7) |
| `DATABASE_URL` | migrations | Connection string for `node-pg-migrate` |
| `NODE_ENV` | API | `production` marks the cookie Secure |

```bash
DATABASE_URL=postgres://user:password@localhost:5432/market npm run migrate up
npm start        # compiles src/ to dist/ (prestart), then runs it with nodemon on :3000
```

**First admin.** Sign up, then promote the account:

```sql
UPDATE users SET role = 'admin' WHERE name = 'your-name';
```

## API

Send `Authorization: Bearer <token>` except for signup and login. `market.postman_collection.json` has example requests.

| Route | Body | Who |
|---|---|---|
| `POST /user/signup` | `{ name, password }` | Anyone |
| `POST /user/login` | `{ name, password }` | Anyone |
| `POST /user/follow` | `{ following_id }` | Signed in |
| `GET /product` | | Signed in (admins get every column) |
| `POST /product` | `{ name, price, quantity, image, owner_id, options: [{ name, values: [] }] }` | Admin |
| `DELETE /product` | `{ id }` | Admin |

## Project layout

```
src/            Express app, routes, controllers, password hashing
migrations/     node-pg-migrate migration
index.html, catalog.html   static pages
```

## Checks

```bash
npm run lint     # tsc --noEmit
npm run build
```

CI runs both on every pull request and on pushes to `main`. There are no automated tests yet.

## Security notes

- Passwords are hashed with scrypt and a random salt and compared in constant time; tokens are signed with `JWT_SECRET` only.
- Every query is parameterised.
- Product changes check the admin role; signup cannot choose a role.
- Errors are thrown rather than mapped to status codes, so a bad login or token currently answers 500 instead of 401.
- See [SECURITY.md](SECURITY.md) to report a vulnerability.

## License and author

[MIT](LICENSE). Built by Ahmed Ibrahim Hussien ([a-3isa](https://github.com/a-3isa)).
