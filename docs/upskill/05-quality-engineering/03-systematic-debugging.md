# Systematic Debugging

General method:

1. Reproduce
2. Narrow the layer
3. Form a cheap hypothesis
4. Probe with logs, breakpoints, or targeted requests
5. Fix root cause
6. Add regression coverage

## Scenario: KPI cards show stale values after data changes
**Reproduction:** Trigger a data change, then reload dashboard quickly.
**First question:** Is the stale data from frontend query cache or backend Redis cache?
**Narrowing path:**
1. Check frontend query keys in `frontend/src/features/dashboard/hooks/useKpiSummary.ts:5-9`.
2. Check backend cache TTL and bypass handling in `backend/src/modules/dashboard/kpi.service.ts:15-27`.
3. Check `metricVisibilityMiddleware` if testing `refresh=true` (`backend/src/middleware/metricVisibility.middleware.ts:3-9`).
**Useful probes:**
- Add temporary log around cache hit/miss in KPI service
- Compare response with and without `refresh=true` as system admin
**Likely root causes:**
- Expected TTL behavior mistaken for a bug
- Missing cache invalidation expectation
**Regression test to add:**
- Integration test asserting same result within TTL for stable seed data
**Senior lesson:** Debugging cache bugs starts by identifying which cache layer you are actually looking at.

## Scenario: User can see page link but API returns forbidden
**Reproduction:** Use a role near a permission boundary.
**First question:** Is the mismatch in frontend gating or backend permission matrix?
**Narrowing path:**
1. Check sidebar gating in `frontend/src/layout/Sidebar.tsx:21-27`.
2. Check route gating in `frontend/src/auth/RequireRole.tsx:5-12`.
3. Check backend permission matrix in `backend/src/shared/permissions.ts:13-52`.
**Likely root causes:**
- Frontend helper drifted from backend matrix
**Senior lesson:** UI affordances and API permissions are separate contracts that can drift.

## Scenario: Export job completes but download fails
**Reproduction:** Completed job row exists, download endpoint errors.
**First question:** Is the DB metadata wrong or is the file missing on disk?
**Narrowing path:**
1. Check completed job fields in `backend/src/modules/exports/exports.service.ts:148-155`.
2. Check resolved file path in `backend/src/modules/exports/exports.service.ts:367-368`.
3. Check controller stream path in `backend/src/modules/exports/exports.controller.ts:37-43`.
**Likely root causes:**
- File write failed after partial state update
- Storage directory mismatch between environments
**Regression test to add:**
- Service-level test that verifies file existence before exposing download
**Senior lesson:** Durable job state and actual artifact storage can diverge unless explicitly verified.

## Scenario: Dashboard request is slow
**Reproduction:** Large date range for dashboard charts.
**First question:** Is the slowness from repeated DB work, in-memory grouping, or lack of cache hit?
**Narrowing path:**
1. Inspect whether endpoint uses SQL grouping or loads rows into memory.
2. Events summary: `backend/src/modules/events/events.service.ts:38-68`
3. Audit summary: `backend/src/modules/audit/audit.service.ts:52-91`
**Likely root causes:**
- Summary endpoint implemented via large row fetch
**Senior lesson:** "Works on seed data" is not the same as "has the right asymptotic behavior."

## Scenario: Login succeeds but user still gets redirected to /login
**Reproduction:** Sign in and observe redirect loop.
**First question:** Did the session persist in Zustand, and is `RequireAuth` reading it?
**Narrowing path:**
1. Inspect `setSession` call in `frontend/src/auth/LoginPage.tsx:33-38`.
2. Inspect store in `frontend/src/auth/auth.store.ts:29-42`.
3. Inspect redirect guard in `frontend/src/auth/RequireAuth.tsx:5-13`.
**Likely root causes:**
- Session not written
- Persist hydration issue
**Senior lesson:** Route guards are just consumers of state. Confirm the state source first.
