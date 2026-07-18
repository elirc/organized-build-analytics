# Interview Prep From This Repo

Use this repository as a source of real examples for mid-level software engineering interviews. The point is not to memorize answers. The point is to practice explaining tradeoffs from real code.

## JavaScript / TypeScript Questions

### Q1: When would you use `Promise.all`, and what are the tradeoffs?

Use `backend/src/modules/dashboard/kpi.service.ts:29-52`.

- Junior answer: "It runs independent async work together and makes the endpoint faster."
- Mid-level answer: "These queries are independent, so parallel fan-out reduces endpoint latency. I'd also note that one rejection fails the whole `Promise.all`, so I'd only group operations whose failure should fail the response."
- Senior answer: "I'd also ask whether DB-native aggregation could outperform fan-out at scale. `Promise.all` is good here, but it is not a substitute for query-shape optimization."

### Q2: What is a good boundary between client state and server state?

Use `frontend/src/auth/auth.store.ts:21-42`, `frontend/src/features/dashboard/hooks/useDashboardFilters.ts:6-35`, and `frontend/src/lib/queryClient.ts:3-10`.

- Junior answer: "Zustand stores auth, TanStack Query stores fetched data."
- Mid-level answer: "This repo uses URL query params for report filters, TanStack Query for server state, and Zustand only for auth/session."
- Senior answer: "That split reduces stale duplication and keeps analytics views shareable and debuggable."

### Q3: How do you prevent stale data bugs in React Query?

Use `frontend/src/features/dashboard/hooks/useEventsOverTime.ts:5-9` and `frontend/src/features/exports/pages/ExportCenterPage.tsx:26-35`.

### Q4: Explain optional fields in an API response.

Use `backend/src/shared/permissions.ts:54-67` and `frontend/src/features/dashboard/components/KpiCardGrid.tsx:14-24`.

## Python Interview Prep

This repo is not Python, so these examples are conceptual mappings. Be explicit about that in an interview.

### Q1: How would you describe this export workflow in Python terms?

Real anchor: `backend/src/modules/exports/exports.service.ts:20-212`

- Junior answer: "It's like a service function that may call a background worker."
- Mid-level answer: "In Python I'd model this like a FastAPI endpoint creating a DB row plus a Celery task for large jobs, with a synchronous fast path for small exports."
- Senior answer: "I'd also discuss idempotency, durable job state, and artifact lifecycle, because those concerns transfer across languages."

### Q2: How do you think about validation in web apps?

Real anchors: `backend/src/middleware/validate.middleware.ts:7-26`, `backend/src/modules/auth/auth.schemas.ts:23-40`

Map to Python: request models in FastAPI/Pydantic or serializers/forms in Django.

### Q3: When would you drop below an ORM?

Real anchor: `backend/src/modules/dashboard/dashboard.repository.ts:10-20,38-90`

Map to Python: SQLAlchemy plus raw SQL for hard analytics queries.

## Debugging Questions

### Q: A dashboard is slow. How do you approach it?

Use:

- `backend/src/modules/events/events.service.ts:38-68`
- `backend/src/modules/dashboard/kpi.service.ts:15-27`
- `backend/src/middleware/requestLogger.middleware.ts:12-19`

Strong answer includes:

- isolate endpoint
- identify cache hit/miss
- inspect query shape
- compare DB-native aggregation vs in-memory grouping

## System Design Questions

### Design an internal analytics dashboard

Start from:

- role-gated routes (`backend/src/modules/dashboard/dashboard.routes.ts:12-21`)
- aggregate endpoints (`backend/src/modules/dashboard/dashboard.repository.ts:38-90`)
- caching (`backend/src/cache/cacheKeys.ts:10-21`)
- export jobs (`backend/src/modules/exports/exports.service.ts:20-212`)

### Design a secure export system

Start from:

- ownership checks (`backend/src/modules/exports/exports.service.ts:78-99`)
- queue/offline processing (`backend/src/modules/exports/exports.service.ts:45-72`)
- CSV sanitization (`backend/src/shared/utils/csv.ts:1-33`)

## Code Review Questions

### "What would you flag in this diff?"

Practice with:

- `frontend/src/components/DataTable.tsx:22-24`
- `backend/src/middleware/rateLimit.middleware.ts:7-31`
- `backend/src/modules/events/events.service.ts:41-52`

Strong answer names:

- correctness risk
- maintainability risk
- scale risk
- suggested follow-up test

## "Tell Me About A Time" Prompts

Use your work in this repo to answer:

- "Tell me about a time you improved reliability."
  - Example: hardening export retries or adding auth integration tests
- "Tell me about a time you reduced risk in a feature."
  - Example: keeping metric visibility on the backend
- "Tell me about a time you found a performance issue."
  - Example: replacing in-memory summaries with grouped SQL

## Interview Drills

1. Explain the difference between authentication and authorization using `auth.middleware.ts` and `requirePermission.middleware.ts`.
2. Explain why URL query params are a better fit than global state for report filters here.
3. Explain one thing this repo does well architecturally and one thing you would improve.

## Verification Notes

- JavaScript/TypeScript examples are anchored to real repo files.
- Python examples are intentionally labeled as conceptual mappings, not claims about this codebase.
