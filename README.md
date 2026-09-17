# ChestXGPT

A full-stack blog + small e-commerce platform: a Django REST/GraphQL backend, a React admin
dashboard for managing content, and a React storefront/blog for end users. All three run
together via Docker Compose.

## Architecture

| Service | Path | Stack | Port |
|---|---|---|---|
| Backend API | [`django-umer/`](django-umer/) | Django, DRF, GraphQL, Channels/WebSockets, Redis | 8000 |
| Admin dashboard | [`admin-ui/`](admin-ui/) | React, Vite | 3001 |
| Blog & storefront | [`flone-ui-umer-blog/`](flone-ui-umer-blog/) | React, Create React App | 3000 |

Each service has its own README with setup details, environment variables, and tech-stack notes.

## Quickstart (Docker)

```bash
docker compose up -d --build
```

- Backend: http://localhost:8000 (admin panel at `/admin/`, GraphQL at `/graphql`)
- Admin dashboard: http://localhost:3001
- Blog/storefront: http://localhost:3000

Seed some demo data so the frontends have something to show (see the
[backend README](django-umer/README.md#seeding-demo-data)):

```bash
docker exec -it $(docker compose ps -q backend) python manage.py createsuperuser --email admin@gmail.com
docker exec -it $(docker compose ps -q backend) python manage.py seed_data 10
```

## Configuration

Every service reads secrets/URLs from environment variables with working local defaults - see
each service's `.env.example`. Nothing is hardcoded in source.

## Running services individually

See the README in each service's directory for running it outside Docker (e.g. `yarn start` /
`npm start` / `python manage.py runserver`).
