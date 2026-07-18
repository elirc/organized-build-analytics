# Language Runtime Model

## JavaScript Event Loop And Async Boundaries

### Concept

JavaScript can start many asynchronous operations without running them in parallel on the call stack. The shape that matters here is "start all independent work, then await them together."

### Why it matters in production

Serial async work inflates latency. In a dashboard app, latency often comes from avoidable round trips to the database or queue backend.

### Real code

- Parallel fan-out in KPI summary: `backend/src/modules/dashboard/kpi.service.ts:29-52`
- Parallel queue-depth aggregate: `backend/src/modules/monitoring/monitoring.repository.ts:34-39`
- Parallel frontend queries on a page: `frontend/src/features/dashboard/pages/EngineeringDashboardPage.tsx:16-40`

### Failure modes

- Accidentally awaiting each DB call one by one
- Starting too many unrelated queries and overwhelming downstream systems
- Forgetting that parallelism changes failure behavior: one rejection fails `Promise.all`

### Drill

Find one place where the code intentionally parallelizes work and one place where it still does repeated work.

### Self-grade

- Weak: "It uses `Promise.all` for speed."
- Solid: explains latency reduction and the all-or-nothing failure semantics.
- Strong: can say when limited concurrency or SQL aggregation would be better than raw `Promise.all`.

## TypeScript Contracts

### Concept

TypeScript is valuable here because APIs, roles, filters, and response shapes cross many layers. The important question is not "is it typed?" but "where is the contract authoritative?"

### Real code

- Auth store role union on the frontend: `frontend/src/auth/auth.store.ts:4-19`
- Shared API response types: `frontend/src/api/dashboard.api.ts:8-29`
- Zod request schemas: `backend/src/modules/auth/auth.schemas.ts:3-40`
- Env contract with Zod: `backend/src/config/env.ts:5-22`

### Failure modes

- Overtrusting client-side types when server validation is absent
- Allowing stringly typed enums to drift across frontend and backend
- Using broad `Record<string, unknown>` forever instead of refining hot paths

### Drill

Compare `frontend/src/api/dashboard.api.ts:8-29` with `backend/src/modules/dashboard/kpi.service.ts:54-63`. Which fields are guaranteed? Which are role-conditional?

## Node Runtime Constraints

### Concept

Backend code can use the filesystem, process environment, and long-lived connections. Frontend code cannot. This sounds obvious until a feature crosses the boundary.

### Real code

- Filesystem writes for exports: `backend/src/modules/exports/exports.service.ts:145-146`
- Environment parsing: `backend/src/config/env.ts:5-22`
- Browser fetch code: `frontend/src/api/client.ts:17-29`

### Failure modes

- Trying to move a server-side pattern into the browser unchanged
- Forgetting that browser local state is user-controlled
- Assuming frontend E2E tests validate backend behavior when they do not

## Python Interview Prep Mapping

This repo is TypeScript, not Python. Use this section to map repo concepts into Python interview language without pretending the codebase is Python.

### Repo concept -> Python framing

| Repo concept | Real anchor | Python framing |
| --- | --- | --- |
| Parallel I/O fan-out | `backend/src/modules/dashboard/kpi.service.ts:29-52` | `asyncio.gather` or concurrent DB/API calls |
| Validation boundary | `backend/src/middleware/validate.middleware.ts:7-26` | Pydantic/FastAPI request models |
| Service/repository split | `backend/src/modules/exports/exports.service.ts:20-212` | Django/Flask/FastAPI service layer plus DAO/repository |
| Background job | `backend/src/jobs/export.processor.ts:9-38` | Celery/RQ worker mental model |
| Data contract | `backend/prisma/schema.prisma:11-192` | SQLAlchemy models or migration-defined schema |

### Interview drill

Explain the export workflow twice:

1. In JavaScript/TypeScript terms
2. In Python/FastAPI/Celery terms

If you can do both, you understand the concept instead of just the syntax.

## Verification Notes

- Anchors inspected directly in backend services, middleware, and frontend query hooks
