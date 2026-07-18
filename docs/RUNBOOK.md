# Runbook

## Local Startup

1. Copy env files.
2. Start Postgres and Redis with Docker Compose.
3. Install dependencies.
4. Generate Prisma client.
5. Run migrations.
6. Seed data.
7. Start backend, frontend, and optionally worker.

## Useful Commands

- `npm run dev`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:seed`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run dev:worker -w backend`

## If Something Breaks

### Backend will not start

- confirm env vars
- confirm Postgres is reachable
- confirm Prisma client generated

### Frontend cannot reach API

- check `VITE_API_URL`
- check backend port
- inspect browser network tab

### Exports stay pending

- check Redis
- check worker startup
- check export job `errorMessage`

### Dashboard data looks empty

- verify seed ran
- verify date range includes seeded dates
- verify role is allowed to see the data
