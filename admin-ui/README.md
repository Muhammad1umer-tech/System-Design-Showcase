# Admin Dashboard

A React admin panel for managing blog posts (create/edit/list, image uploads, categories) that
talks to the [Django backend](../django-umer). Built on the [Vuexy](https://pixinvent.com/vuexy-react-admin-dashboard-template/)
admin template (React 18 + Bootstrap + Redux Toolkit + Vite).

## Tech stack

- **React 18** + **Vite** - build tooling and dev server
- **Redux Toolkit** - state management
- **Bootstrap 5** / **Reactstrap** - UI components (Vuexy theme)
- **Axios** - API calls, with an interceptor that auto-refreshes JWTs on 401
- **WebSocket** client for live notifications from the backend

## Running with Docker (recommended)

From the repo root:

```bash
docker compose up -d admin-ui
```

Serves the dashboard at `http://localhost:3001`.

## Running locally without Docker

```bash
yarn install
cp .env.example .env   # defaults already point at http://localhost:8000
yarn start
```

Runs at `http://localhost:3000` by default (mapped to `3001` in the root `docker-compose.yml`
to avoid clashing with the blog frontend).

## Configuration

The backend URL is read from `VITE_API_BASE_URL` / `VITE_WS_BASE_URL` (see
[`.env.example`](.env.example)) - no backend URLs are hardcoded in source.

## Login

Log in with the superuser/admin account created on the backend (see the
[backend README](../django-umer/README.md#seeding-demo-data)) - e.g. `admin@gmail.com`.
