# back-ts-backbone

A minimal Express + TypeScript REST API backbone: helmet, CORS, JSON body parsing, a layered router/service structure and centralised error and 404 handling. It ships with an in-memory menu items resource as an example.

## Getting started

```bash
cp env/app.env.example env/app.env
docker compose up --build
```

Or locally:

```bash
cd app
npm install
PORT=1000 npm run dev       # ts-node-dev with respawn
npm run build && PORT=1000 npm start
npm run typecheck
```

## API

Base path: `/api/menu/items`

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/` | List items |
| `GET` | `/:id` | Get an item |
| `POST` | `/` | Create an item (`name`, `price`, `description`, `image`) |
| `PUT` | `/:id` | Update an item, or create it if it does not exist |
| `DELETE` | `/:id` | Delete an item |

## Structure

```
app/src/
├── index.ts                 # app setup and server start
├── items/                   # router, service and interfaces for the items resource
├── middleware/              # error and not-found handlers
└── common/http-exception.ts
```
