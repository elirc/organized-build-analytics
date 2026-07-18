# Fast Track

This is the weekend-sized path. The goal is not mastery. The goal is to get one real mental model, one safe change, and one working explanation.

## Install, Run, Test

Verified root commands come from `package.json:9-20`.

1. `npm install`
2. `npm run db:generate`
3. `npm run typecheck`
4. `npm run test`
5. `npm run build`
6. `npm run test:e2e`

Infra commands are documented in `README.md:15-21` and `docker-compose.yml:1-24`.

1. `docker compose up -d`
2. `npm run db:migrate`
3. `npm run db:seed`
4. `npm run dev`

Notes:

- `docker compose up -d`, `npm run db:migrate`, and `npm run db:seed` are inferred from docs and scripts. I did not verify them in this pass because Docker was not available.
- `npm run typecheck`, `npm run test`, `npm run build`, and `npm run test:e2e -w frontend` were verified.

## Two End-To-End Flows To Trace

### Flow 1: Login To Role-Gated Dashboard

Open these files first:

- `frontend/src/auth/LoginPage.tsx:20-76`
- `frontend/src/api/auth.api.ts:10-46`
- `backend/src/modules/auth/auth.routes.ts:11-15`
- `backend/src/modules/auth/auth.service.ts:73-161`
- `frontend/src/app/router.tsx:25-66`

What to look for:

- Where form validation happens
- Where session tokens are stored
- Where role-based UI gates happen
- Where the backend, not just the frontend, enforces permissions

### Flow 2: Create And Complete A CSV Export

Open these files first:

- `frontend/src/features/exports/pages/ExportCenterPage.tsx:11-110`
- `frontend/src/api/exports.api.ts:14-34`
- `backend/src/modules/exports/exports.routes.ts:11-15`
- `backend/src/modules/exports/exports.service.ts:20-212`
- `backend/src/jobs/export.processor.ts:9-38`

What to look for:

- Sync vs queued export branching
- Audit and tracked-event side effects
- How file download is exposed back to the user
- What happens on failure

## First 10 Files To Open

1. `README.md:1-63` because it tells you what the repo is trying to be.
2. `package.json:5-24` because it tells you how the repo is operated.
3. `backend/src/app.ts:20-57` because it shows the backend's true public surface.
4. `backend/prisma/schema.prisma:11-192` because data shape drives the whole app.
5. `frontend/src/app/router.tsx:25-66` because it maps UI ownership and role gates.
6. `backend/src/modules/auth/auth.service.ts:25-219` because auth touches security, persistence, and side effects.
7. `backend/src/modules/dashboard/kpi.service.ts:8-67` because it shows cache + aggregation + visibility.
8. `backend/src/modules/exports/exports.service.ts:20-369` because it is the best cross-layer example in the repo.
9. `frontend/src/features/dashboard/pages/OperationsDashboardPage.tsx:18-75` because it is the cleanest dashboard composition example.
10. `frontend/src/features/dashboard/hooks/useDashboardFilters.ts:6-35` because URL-backed filters are a core frontend idea here.

## One Small Safe Change To Attempt

Change the export button label so it reflects the selected export type instead of always saying `Create tracked-event export` (`frontend/src/features/exports/pages/ExportCenterPage.tsx:50-57`).

Why this is safe:

- UI-only
- No API contract change
- Easy to verify visually and with a targeted component test if you add one

## One Test Or Check To Run

Run `npm run test -w frontend` and inspect `frontend/src/test/KpiCardGrid.test.tsx:5-24`. Then ask yourself: what is this test protecting, and what is it not protecting?

## Teach-Back Exercise

In 10 minutes, explain this to another engineer:

1. Why dashboard filters live in the URL instead of Zustand (`frontend/src/features/dashboard/hooks/useDashboardFilters.ts:6-35`)
2. Why KPI data is aggregated on the backend instead of built from raw rows in the browser (`backend/src/modules/dashboard/kpi.service.ts:29-66`, `frontend/src/features/dashboard/pages/OperationsDashboardPage.tsx:54-72`)

## What This Fast Path Does Not Cover

- Deep Prisma query tradeoffs
- Queue reliability and rollout concerns
- Security review depth
- Performance critique
- Schema migration strategy

## Verification Notes

- Verified: `npm run typecheck`, `npm run test`, `npm run build`, `npm run test:e2e -w frontend`
- Inspected: root scripts, schema, backend entrypoints, frontend router, representative pages, export service, auth service
- Uncertainty: live database migration and seeding were not re-verified in this pass because Docker was unavailable
