# Runtime And Tooling Map

## Package Manager And Workspaces

- Root npm workspaces: `package.json:5-8`
- Root scripts fan out into backend and frontend workspaces: `package.json:9-20`

## Backend Runtime

- Node.js + Express: `backend/package.json:22-35`
- Env parsing with Zod: `backend/src/config/env.ts:5-22`
- Prisma client: `backend/src/db/prisma.ts:1-3`
- Redis client: `backend/src/cache/redis.ts:7-16`
- Worker entrypoint: `backend/src/worker.ts:5-18`

## Frontend Runtime

- React + Vite: `frontend/package.json:15-42`, `frontend/vite.config.ts:5-10`
- Router entrypoint: `frontend/src/app/router.tsx:25-66`
- Query provider: `frontend/src/app/providers.tsx:7-13`
- Persisted auth store: `frontend/src/auth/auth.store.ts:29-42`

## Test Tooling

- Backend Vitest: `backend/package.json:15-20`
- Frontend Vitest: `frontend/vitest.config.ts:4-12`
- Frontend Playwright: `frontend/playwright.config.ts:3-14`
- CI runs generate, typecheck, test, build: `.github/workflows/ci.yml:22-43`

## Runtime Boundaries

| Boundary | Files | What changes crossing it should make you think about |
| --- | --- | --- |
| Browser -> API | `frontend/src/api/client.ts:5-40` | Auth header, error shape, network failures |
| API -> Service | `backend/src/modules/*/*.controller.ts` | Request normalization and status codes |
| Service -> DB | `backend/src/modules/*/*.repository.ts` | Query cost, transaction need, invariants |
| Service -> Cache | `backend/src/modules/dashboard/kpi.service.ts:16-27` | Staleness, cache key stability, bypass rules |
| Service -> Queue | `backend/src/modules/exports/exports.service.ts:54-69` | Idempotency, failure fallback |
| Worker -> File system | `backend/src/modules/exports/exports.service.ts:145-155` | Storage path, retention, file existence |

## Environment Variables

Root examples: `.env.example:1-18`

Backend examples: `backend/.env.example:1-13`

Frontend examples: `frontend/.env.example:1-1`

High-level groups:

- Ports and URLs: `BACKEND_PORT`, `FRONTEND_URL`, `API_BASE_URL`
- Data stores: `DATABASE_URL`, `DIRECT_URL`, `REDIS_URL`
- Auth secrets and durations: `JWT_*`
- Export storage: `EXPORT_STORAGE_DIR`
- Rate limiting: `RATE_LIMIT_*`
- Frontend API base: `VITE_API_URL`

## Tooling Sharp Edges

- Backend `lint` is currently a typecheck alias, not an ESLint-style ruleset (`backend/package.json:15-17`).
- Frontend `lint` is also a typecheck alias (`frontend/package.json:10-12`).
- Playwright stands up only the frontend dev server (`frontend/playwright.config.ts:5-13`), so current E2E coverage is UI-shell level rather than full frontend+backend integration.

## Verification Notes

- Verified commands: root typecheck, test, build, frontend e2e
- Inferred but not live-verified: Docker-backed DB/Redis startup and Prisma migration/seed
