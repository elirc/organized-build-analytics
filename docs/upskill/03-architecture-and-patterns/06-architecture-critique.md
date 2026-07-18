# Architecture Critique

## Strongest Design Choices

1. Backend-enforced authorization is visible and consistent across route wiring (`backend/src/middleware/requirePermission.middleware.ts:7-18`, `backend/src/shared/permissions.ts:13-67`).
2. Dashboard aggregation belongs on the server, and the repo mostly follows that rule (`backend/src/modules/dashboard/kpi.service.ts:29-66`, `frontend/src/features/dashboard/pages/OperationsDashboardPage.tsx:54-72`).
3. The export workflow is one of the better examples of pragmatic internal-tool engineering in the repo (`backend/src/modules/exports/exports.service.ts:20-212`).
4. URL-backed filters and query keys align well on the frontend (`frontend/src/features/dashboard/hooks/useDashboardFilters.ts:6-35`, `frontend/src/features/dashboard/hooks/useEventsOverTime.ts:5-9`).

## Confirmed Risks

1. Process-local rate limiting will not behave consistently across multiple instances (`backend/src/middleware/rateLimit.middleware.ts:7-31`).
2. Some summary endpoints still load many records and aggregate in application code (`backend/src/modules/events/events.service.ts:38-68`, `backend/src/modules/audit/audit.service.ts:52-91`).
3. `DataTable` uses row index as a key, which risks unstable rendering if rows are re-ordered or interactively updated (`frontend/src/components/DataTable.tsx:22-24`).

## Hypotheses / Investigate

1. Export processing may not be idempotent under duplicate worker delivery because completion emits side effects after file generation and job update. Investigate with forced retries (`backend/src/modules/exports/exports.service.ts:148-180`).
2. Queue-depth metrics may diverge from actual BullMQ queue state because they are derived from DB statuses, not queue introspection (`backend/src/modules/monitoring/monitoring.repository.ts:34-47`).

## Improvements In Priority Order

1. Rewrite in-memory summary aggregations to DB-native grouped queries.
   - Migration path: start with events and audit summary endpoints.
   - Test strategy: compare old and new outputs against seeded data.
2. Replace process-local rate limiting with a shared store or infrastructure-native limiter.
   - Migration path: add Redis-backed limiter behind the same middleware contract.
   - Test strategy: integration tests for repeated requests plus multi-instance simulation if available.
3. Strengthen export idempotency.
   - Migration path: explicit status preconditions or dedupe marker before emitting completion side effects.
   - Test strategy: call `processJob` twice on the same job and assert no duplicate completion events.
4. Add direct backend integration coverage for auth, KPI summary, exports, and permission failures.
   - Migration path: build test helpers around `createApp()`.
   - Test strategy: supertest with seeded or fixture data.

## If I Owned This Repo For 3 Months

- Month 1: increase backend integration coverage and performance-test summary endpoints.
- Month 2: harden rate limiting, cache observability, and export idempotency.
- Month 3: introduce snapshot/rollup tables for long-range dashboard queries and add clearer ops runbooks.

## Senior Lesson

The repo already has a healthy shape for a learning project. The next level is less about changing folder structure and more about tightening invariants, reducing silent failure modes, and improving confidence with better tests and instrumentation.
