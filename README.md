# Service Desk

A full-stack IT service desk: log in, see role-scoped tickets, work them through their lifecycle
(claim, change status, assign, comment), and create new ones. Angular frontend, Spring Boot API.

### 🔗 Live demo — https://service-desk-demo.netlify.app

## Try it (demo logins)

All accounts share the password **`password123`**. Log in as different roles to see the app change:

| Email | Role | What you'll see |
|---|---|---|
| `admin@servicedesk.local` | **Admin** | Every ticket; can assign tickets to any agent |
| `agent@servicedesk.local` | **Agent** (Network team) | The team's tickets; can claim, comment, change status |
| `requester@servicedesk.local` | **Requester** | Only their own tickets; can create and comment |

More seeded agents (`agent.hw@`, `agent.access@`, `agent.sw@`) and requesters (`sofia.klein@`,
`jonas.weber@`) exist on other teams — same password.

> The demo database **resets to this fixed dataset every night** (03:00 UTC), so feel free to click
> around, change statuses, and post comments — nothing you do sticks or breaks it for the next visitor.

## Features

- **JWT auth** — log in, token stored client-side and sent on every request; logout discards it.
- **Role-scoped ticket list** — admins see all, agents see their team's, requesters see their own.
  Client-side filtering and sorting.
- **Ticket detail** — full ticket, its comment thread, and role- & state-gated actions (claim,
  status transitions limited to legal ones, admin-only assignment, commenting).
- **Create ticket** — with both client-side and server-side validation.
- **Registration** and a "logged in as ___" identity label.

## Tech stack

**Frontend** (this repo): Angular 22 (standalone, **zoneless** — state via signals), TypeScript,
RxJS. Built to static files with `ng build` and hosted on **Netlify**; SPA deep-link routing via a
`_redirects` fallback.

**Backend** ([service-desk-api](https://github.com/Oumaima-Ben-EL-Bey/service-desk-api)): Spring Boot,
Spring Security (JWT), JPA, Flyway, PostgreSQL. Deployed on **Fly.io** with a **Neon** Postgres
database; CI/CD via GitHub Actions (auto-deploy on merge to `main`, plus a nightly reseed job).

The two services run on separate origins, wired together with CORS.

## Run it locally

```bash
npm install
npm start
```

Opens on `http://localhost:4200`. The app talks to the deployed API, so login and data work out of
the box — no local backend needed.

```bash
npm run build   # production build → dist/service-desk-frontend/browser/
npm test        # unit tests (Vitest)
```
