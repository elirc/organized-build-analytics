# Framework Mental Models

## React

### Concept

React pages describe UI from state. In this repo, the important split is:

- URL state for shareable dashboard filters
- Query cache for server state
- Zustand for auth/session state only

### Real code

- URL-backed filters: `frontend/src/features/dashboard/hooks/useDashboardFilters.ts:6-35`
- Query client defaults: `frontend/src/lib/queryClient.ts:3-10`
- Auth store scope: `frontend/src/auth/auth.store.ts:21-42`
- Route-level gating: `frontend/src/auth/RequireAuth.tsx:5-13`, `frontend/src/auth/RequireRole.tsx:5-12`

### Pitfall checklist

- Do not store dashboard API payloads in Zustand.
- Do not move report filters out of the URL unless the view stops being shareable.
- Do not trust role-based UI hiding as security.
- Do not fetch raw event rows for charts when aggregate endpoints already exist.

### Drill

Explain why `OperationsDashboardPage` issues several queries from one page without centralizing them in a giant page store (`frontend/src/features/dashboard/pages/OperationsDashboardPage.tsx:18-75`).

## TanStack Query

### Concept

Query keys are a cache contract. If the key omits a filter, the UI may show the wrong data. If the key includes unstable noise, caching becomes useless.

### Real code

- KPI key: `frontend/src/features/dashboard/hooks/useKpiSummary.ts:5-9`
- Events-over-time key: `frontend/src/features/dashboard/hooks/useEventsOverTime.ts:5-9`
- Shared staleness policy: `frontend/src/lib/queryClient.ts:3-10`

### Failure modes

- Forgetting `interval` in a series key
- Using objects with unstable identity as keys without normalization
- Not invalidating relevant queries after a mutation (`frontend/src/features/exports/pages/ExportCenterPage.tsx:26-35`)

## Express

### Concept

Express here is used as a transport and composition layer, not as the place where business rules live.

### Real code

- Middleware stack: `backend/src/app.ts:23-33`
- Route registration: `backend/src/modules/exports/exports.routes.ts:11-15`
- Thin controller example: `backend/src/modules/exports/exports.controller.ts:6-43`

### Pitfall checklist

- Do not put business logic in controllers.
- Do not skip validation middleware for "internal" routes.
- Do not forget middleware order matters.

## Prisma

### Concept

Prisma is the default data-access tool, but this repo uses raw SQL when analytics queries need more direct control.

### Real code

- Standard Prisma aggregate: `backend/src/modules/monitoring/monitoring.repository.ts:20-31`
- Raw SQL distinct count: `backend/src/modules/dashboard/dashboard.repository.ts:10-20`
- Raw SQL time bucket query: `backend/src/modules/dashboard/dashboard.repository.ts:38-52`

### Senior noticing

This is the right instinct: keep CRUD and ordinary aggregates in Prisma, but escape to SQL when the data shape or cost model matters.
