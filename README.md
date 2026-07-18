# Analytics + Admin Dashboard Platform

Production-style full-stack internal dashboard platform for KPI tracking, operational analytics, audit visibility, monitoring dashboards, CSV exports, and role-aware internal operations workflows.

## Stack

- Frontend: React, TypeScript, Vite, TanStack Query, Zustand, React Router, React Hook Form, Zod, Tailwind CSS, Recharts
- Backend: Node.js, TypeScript, Express, Prisma, PostgreSQL, JWT auth, RBAC
- Async: Redis, BullMQ
- Testing: Vitest, Supertest, React Testing Library, Playwright
- Infra: Docker Compose, GitHub Actions-friendly scripts

## Quick Start

1. Copy `.env.example` to `.env`.
2. Start infrastructure with `docker compose up -d`.
3. Install dependencies with `npm install`.
4. Generate Prisma client with `npm run db:generate`.
5. Run migrations with `npm run db:migrate`.
6. Seed data with `npm run db:seed`.
7. Start the app with `npm run dev`.

## Seeded Users

After seeding, these example users exist with password `Password123!`:

- `system_admin@example.com`
- `ops_manager@example.com`
- `product_manager@example.com`
- `engineering_admin@example.com`
- `audit_viewer@example.com`
- `executive_viewer@example.com`
- `read_only@example.com`

## Workspace

- `backend/`: API, Prisma schema, jobs, RBAC, analytics modules
- `frontend/`: dashboard UI, routing, auth state, chart components
- `docs/`: architecture, learning, testing, deployment, and review guides

## Current Status

## Implemented Scope

- Auth with JWT access tokens, refresh-token rotation, logout revocation, and persisted frontend session state
- RBAC with backend-enforced visibility rules
- Tracked events, audit events, monitoring metrics, export jobs, dashboard configs, and realistic seed data
- KPI summary, event charts, active-user trend, error-rate trend, conversion funnel, and recent activity endpoints
- Audit summaries, monitoring summaries, queue depth, DB query timing, and job failure views
- CSV exports with sanitization, sync-or-queue processing, download links, retry handling, and local artifact storage
- React dashboards for operations, product, engineering, executive, events, exports, and dashboard config administration
- Dockerfiles, GitHub Actions CI, and onboarding-focused documentation

## Onboarding Docs

Start here if you are new to the codebase:

- [docs/ONBOARDING_GUIDE.md](docs/ONBOARDING_GUIDE.md)
- [docs/BACKEND_TOUR.md](docs/BACKEND_TOUR.md)
- [docs/FRONTEND_TOUR.md](docs/FRONTEND_TOUR.md)
- [docs/DATA_MODEL_GUIDE.md](docs/DATA_MODEL_GUIDE.md)
- [docs/FIRST_PR_GUIDE.md](docs/FIRST_PR_GUIDE.md)
- [docs/RUNBOOK.md](docs/RUNBOOK.md)
