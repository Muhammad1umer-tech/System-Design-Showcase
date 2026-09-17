# Blog & Storefront

The public-facing frontend: blog (posts, comments, likes), a small e-commerce storefront (cart,
checkout via Stripe), account registration/login (email+password, Google OAuth, phone/email
verification), and real-time notifications. Talks to the [Django backend](../django-umer). Built
on the [Flone](https://github.com/rakibhstu/flone) React e-commerce template (Create React App +
Redux Toolkit + Bootstrap).

## Tech stack

- **React 18** (Create React App) - build tooling and dev server
- **Redux Toolkit** + **redux-persist** - state management
- **Bootstrap 5** / **React Bootstrap** - UI (Flone theme)
- **Axios** - API calls, with an interceptor that auto-refreshes JWTs on 401
- **i18next** - multi-language support (`public/locales`)
- **Google OAuth**, **Google Maps**, **Google reCAPTCHA** integrations

## Running with Docker (recommended)

From the repo root:

```bash
docker compose up -d blog-ui
```

Serves the storefront/blog at `http://localhost:3000`.

## Running locally without Docker

```bash
npm install --force
cp .env.example .env   # fill in Google keys if you want those features to work
npm start
```

## Configuration

The backend URL and third-party keys (Google OAuth, Google Maps, reCAPTCHA) are read from
environment variables - see [`.env.example`](.env.example). Nothing is hardcoded in source;
without real keys those specific integrations (social login, the store-locator map, captcha)
simply won't work, but the rest of the app runs fine.
