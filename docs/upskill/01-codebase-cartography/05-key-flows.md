# Key Flows

## Flow: Login And Session Establishment
**Why this flow matters:** Every other feature depends on it. It touches validation, password verification, token issuance, client persistence, and role-aware navigation.
**Open these files first:**
- `frontend/src/auth/LoginPage.tsx:20-76` - form, mutation, session persistence
- `frontend/src/api/auth.api.ts:10-46` - frontend contract
- `backend/src/modules/auth/auth.routes.ts:11-15` - route registration and validation
- `backend/src/modules/auth/auth.service.ts:73-196` - login, refresh, logout, token storage
- `frontend/src/app/router.tsx:30-66` - protected app shell
**Trace:**
| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | UI | `frontend/src/auth/LoginPage.tsx:25-31` | Seeded defaults hydrate form | `{ email, password }` | Confusing demo creds if seed not run |
| 2 | UI | `frontend/src/auth/LoginPage.tsx:33-41` | Mutation calls login API | same | Missing backend availability |
| 3 | Client API | `frontend/src/api/auth.api.ts:10-15` | POST `/api/auth/login` | JSON body | Contract drift |
| 4 | Route | `backend/src/modules/auth/auth.routes.ts:12` | Zod validation runs before controller | parsed body | Weak schema would leak bad input |
| 5 | Service | `backend/src/modules/auth/auth.service.ts:73-106` | User lookup, password verify, tracked login event, session creation | user row | Incorrect auth or missing inactive-user check |
| 6 | Service | `backend/src/modules/auth/auth.service.ts:164-196` | Access token + refresh token created, refresh hash persisted | `{ user, accessToken, refreshToken }` | Refresh-token lifecycle bugs |
| 7 | UI state | `frontend/src/auth/auth.store.ts:29-42` | Session persisted in Zustand | session object | Token theft if broader storage policy changed |
| 8 | Router | `frontend/src/auth/RequireAuth.tsx:5-13` | Authenticated routes unlock | user presence | UI-only trust if backend were weak |
**Validation and authorization:** Form inputs are validated on the client with Zod in `LoginPage.tsx:13-18`, then again on the server with `loginSchema` in `backend/src/modules/auth/auth.schemas.ts:23-30`. Authorization for later routes depends on `authMiddleware` decoding the access token (`backend/src/middleware/auth.middleware.ts:5-25`).
**Persistence and side effects:** Failed logins create tracked events (`backend/src/modules/auth/auth.service.ts:78-90`). Successful sessions persist a hashed refresh token (`backend/src/modules/auth/auth.service.ts:184-190`).
**Tests that cover it:** UI smoke only in `frontend/src/test/e2e/login.spec.ts:3-6`. No direct backend auth integration test found in this pass.
**What juniors usually miss:**
- Refresh tokens are persisted differently from access tokens.
- UI route guards are not the real security boundary.
- Failed auth still creates analytics/audit-relevant data.
**What seniors notice:**
- Refresh rotation revokes old tokens before issuing new ones (`backend/src/modules/auth/auth.service.ts:141-146`).
- `authController.me` has an inline 401 branch even though the route already uses `requireAuthenticated` (`backend/src/modules/auth/auth.controller.ts:16-29`).
**Drill:** Trace the refresh flow from `POST /api/auth/refresh` and explain how replay protection is approximated here.
**Self-grade:**
- Basic: you can name the files.
- Solid: you can explain why refresh tokens are hashed in storage.
- Strong: you can describe one missing backend auth test and what it should assert.

## Flow: KPI Summary Dashboard
**Why this flow matters:** This is the core read-heavy path. It shows backend aggregation, caching, role-aware metric visibility, and lightweight frontend composition.
**Open these files first:**
- `frontend/src/features/dashboard/pages/OperationsDashboardPage.tsx:18-75` - dashboard page
- `frontend/src/features/dashboard/hooks/useKpiSummary.ts:5-9` - query key
- `backend/src/modules/dashboard/dashboard.routes.ts:12-21` - protected dashboard surface
- `backend/src/modules/dashboard/kpi.service.ts:8-67` - aggregation and cache
- `backend/src/modules/dashboard/dashboard.repository.ts:6-20,130-166` - query helpers
**Trace:**
| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | UI | `OperationsDashboardPage.tsx:19-22` | Reads URL-backed filters and starts queries | `{ startDate, endDate, interval }` | Invalid or stale filters |
| 2 | Hook | `useKpiSummary.ts:5-9` | Creates stable query key | key tuple | Cache fragmentation if key unstable |
| 3 | API | `frontend/src/api/dashboard.api.ts:31-37` | Calls `/api/dashboard/kpi-summary` | query string | Contract drift |
| 4 | Route | `backend/src/modules/dashboard/dashboard.routes.ts:12-15` | Permission + visibility middleware + validation | request query | Missing authz would be severe |
| 5 | Service | `backend/src/modules/dashboard/kpi.service.ts:15-27` | Date range parse, cache lookup | cache key | Stale or over-broad cache |
| 6 | Repo | `backend/src/modules/dashboard/kpi.service.ts:29-52` | Fan-out counts and aggregates in parallel | numbers | Expensive query mix |
| 7 | Policy | `backend/src/modules/dashboard/kpi.service.ts:54-63` | Role-based metric filtering | summary object | Leaking sensitive metrics |
| 8 | UI | `frontend/src/features/dashboard/components/KpiCardGrid.tsx:5-33` | Cards render only fields that exist | KPI cards | Tight coupling to response shape |
**Validation and authorization:** `dashboardRangeSchema` is wired in `backend/src/modules/dashboard/dashboard.routes.ts:15-21`. `requirePermission("dashboard:view")` enforces route access before handlers run (`backend/src/modules/dashboard/dashboard.routes.ts:12`).
**Persistence and side effects:** Reads from `TrackedEvent` and `MonitoringMetric`; writes cache entries with a 300-second TTL (`backend/src/modules/dashboard/kpi.service.ts:65-66`).
**Tests that cover it:** No direct KPI integration test found in this pass. Frontend card rendering is lightly covered in `frontend/src/test/KpiCardGrid.test.tsx:5-24`.
**What juniors usually miss:**
- Visibility filtering is part of the backend response, not a frontend post-process.
- Aggregation happens server-side on purpose.
- Query keys should mirror filter inputs.
**What seniors notice:**
- `countDistinctActors` already moved to raw SQL to avoid `findMany(distinct)` style scaling issues (`backend/src/modules/dashboard/dashboard.repository.ts:10-20`).
- Cache bypass is limited by `metricVisibilityMiddleware` so only system admins can use `refresh=true` (`backend/src/middleware/metricVisibility.middleware.ts:3-9`).
**Drill:** Add a hypothetical new KPI. List every layer that would likely change, and where you would add tests first.
**Self-grade:**
- Basic: you can explain why the frontend does not compute the KPI totals itself.
- Solid: you can name the cache key inputs and the visibility boundary.
- Strong: you can propose a performance improvement for a high-cardinality metric.

## Flow: Event Log And Event Detail
**Why this flow matters:** It teaches paginated read APIs, date-range validation, and the difference between log browsing and dashboard aggregates.
**Open these files first:**
- `frontend/src/features/events/pages/EventLogPage.tsx:12-67`
- `frontend/src/features/events/pages/EventDetailPage.tsx:10-48`
- `backend/src/modules/events/events.routes.ts:11-15`
- `backend/src/modules/events/events.service.ts:13-68`
- `backend/src/modules/events/events.repository.ts:23-64`
**Trace:**
| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | UI | `EventLogPage.tsx:13-16` | Reads date and event-type filters | URL params | Wrong defaults |
| 2 | Client API | `frontend/src/api/events.api.ts:14-23` | Sends query params to backend | paginated query | Missing filters |
| 3 | Route | `backend/src/modules/events/events.routes.ts:12-15` | Permission and validation gate access | query + params | Unauthorized raw event access |
| 4 | Service | `backend/src/modules/events/events.service.ts:13-26` | Parses date range and delegates list | filter object | Over-broad ranges |
| 5 | Repo | `backend/src/modules/events/events.repository.ts:23-59` | Builds Prisma where clause + pagination | `{ items, total, page, pageSize }` | N+1 or unbounded query risk |
| 6 | UI | `EventLogPage.tsx:49-61` | Renders rows and detail links | table rows | Missing metadata context |
| 7 | Detail | `EventDetailPage.tsx:12-44` | Fetches event by id and displays metadata | event row | Data exposure if endpoint over-trusted |
**Validation and authorization:** `listEventsSchema` requires `startDate` and `endDate` (`backend/src/modules/events/events.schemas.ts:43-47`), and `requirePermission("events:view")` protects both list and detail routes (`backend/src/modules/events/events.routes.ts:11-15`).
**Persistence and side effects:** Pure reads on this path.
**Tests that cover it:** No direct event-list integration test found in this pass.
**What juniors usually miss:**
- Log pages are not the same thing as chart APIs.
- Pagination defaults come from shared helper logic (`backend/src/shared/utils/pagination.ts:1-6`).
**What seniors notice:**
- `summaryByType` currently loops through enum values and calls list/count logic repeatedly (`backend/src/modules/events/events.service.ts:38-52`).
- Search only covers `actorEmail` and `entityType` today (`backend/src/modules/events/events.repository.ts:35-40`).
**Drill:** Explain why `pageSize: 10_000` in a summary path is a smell even if it works for seed data.
**Self-grade:**
- Basic: you can trace list -> repository -> table render.
- Solid: you can name the pagination helper and search filters.
- Strong: you can outline a SQL-based rewrite for summary endpoints.

## Flow: Audit Dashboard
**Why this flow matters:** It shows a separate compliance-oriented data model and a stricter permission boundary.
**Open these files first:**
- `frontend/src/features/audit/pages/AuditDashboardPage.tsx:14-89`
- `backend/src/modules/audit/audit.routes.ts:11-15`
- `backend/src/modules/audit/audit.service.ts:8-91`
- `backend/src/modules/audit/audit.repository.ts:9-74`
**Trace:**
| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | UI | `AuditDashboardPage.tsx:17-34` | Starts action, actor, list, and trend queries | date range | Too many parallel requests |
| 2 | Route | `backend/src/modules/audit/audit.routes.ts:11-15` | `audit:view` permission enforced | request | Severe data leakage if bypassed |
| 3 | Service | `backend/src/modules/audit/audit.service.ts:29-40` | Date range parsed and list delegated | filters | Over-broad range |
| 4 | Repo | `backend/src/modules/audit/audit.repository.ts:30-49` | Actor relation included for display | audit rows | Overexposing actor fields |
| 5 | Service | `backend/src/modules/audit/audit.service.ts:52-91` | Summary endpoints group in memory | summary arrays | Scaling limit |
| 6 | UI | `AuditDashboardPage.tsx:64-85` | Recent audit events rendered in generic table | data table rows | Compliance UX hiding nuance |
**Validation and authorization:** Route-level `requirePermission("audit:view")` is the key boundary (`backend/src/modules/audit/audit.routes.ts:11-15`).
**Persistence and side effects:** Dashboard path is read-only, but audit events are written by other services such as auth and exports (`backend/src/modules/auth/auth.service.ts:60-68`, `backend/src/modules/exports/exports.service.ts:171-180`).
**Tests that cover it:** No direct audit route tests found in this pass.
**What juniors usually miss:**
- Audit records are not just another flavor of analytics event.
- Some users should see summary-level data without raw detail in many real systems, even if this repo's current matrix is simpler.
**What seniors notice:**
- Actor relation selection is limited to a safe subset (`backend/src/modules/audit/audit.repository.ts:33-43`).
- Summary logic likely wants SQL aggregation later.
**Drill:** Compare `TrackedEvent` and `AuditEvent` and explain when a new action belongs in one, the other, or both.
**Self-grade:**
- Basic: you can say who may access the audit dashboard.
- Solid: you can distinguish analytics data from compliance data.
- Strong: you can propose a safer summary/detail split for executive or cross-team viewers.

## Flow: Monitoring Dashboard
**Why this flow matters:** It teaches that system-health metrics are modeled separately from business events and may have different freshness needs.
**Open these files first:**
- `frontend/src/features/dashboard/pages/EngineeringDashboardPage.tsx:13-103`
- `backend/src/modules/monitoring/monitoring.routes.ts:11-19`
- `backend/src/modules/monitoring/monitoring.service.ts:13-100`
- `backend/src/modules/monitoring/monitoring.repository.ts:20-58`
**Trace:**
| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | UI | `EngineeringDashboardPage.tsx:16-40` | Starts summary and series queries | date range | Overfetching |
| 2 | Route | `backend/src/modules/monitoring/monitoring.routes.ts:12-19` | `monitoring:view` enforced | request | Exposure of infra data |
| 3 | Service | `backend/src/modules/monitoring/monitoring.service.ts:13-76` | Summary averaged and cached for 60s | summary object | Staleness vs freshness tradeoff |
| 4 | Repo | `backend/src/modules/monitoring/monitoring.repository.ts:20-31` | Average values computed in DB | numeric averages | Missing percentile view |
| 5 | Repo | `backend/src/modules/monitoring/monitoring.repository.ts:34-47` | Queue depth inferred from export-job statuses | counts | Can drift from real queue state |
| 6 | UI | `EngineeringDashboardPage.tsx:76-99` | Recent job failures rendered from tracked events | event rows | Mixed semantics between monitoring and events |
**Validation and authorization:** `monitoringRangeSchema` validates summary requests (`backend/src/modules/monitoring/monitoring.schemas.ts:23-30`), and `requirePermission("monitoring:view")` is route-level (`backend/src/modules/monitoring/monitoring.routes.ts:11-19`).
**Persistence and side effects:** Reads from `MonitoringMetric` and `ExportJob`, plus tracked events for background failures.
**Tests that cover it:** No direct monitoring tests found in this pass.
**What juniors usually miss:**
- "Error rate" can mean different underlying sources depending on the dashboard.
- A metric summary can be fresher than a KPI summary because the TTL differs.
**What seniors notice:**
- Queue depth is not coming from BullMQ introspection.
- Monitoring ingestion currently uses the same permission used for viewing (`backend/src/modules/monitoring/monitoring.routes.ts:11-18`), which is worth re-evaluating if external emitters are added.
**Drill:** Decide whether a new "slow endpoint" feature belongs in monitoring metrics, tracked events, or both.
**Self-grade:**
- Basic: you can explain the summary vs series split.
- Solid: you can name the queue-depth approximation.
- Strong: you can propose a better observability boundary with rollout considerations.

## Flow: CSV Export Lifecycle
**Why this flow matters:** This is the best example of orchestration, side effects, async fallback, and user-visible job tracking.
**Open these files first:**
- `frontend/src/features/exports/pages/ExportCenterPage.tsx:11-110`
- `backend/src/modules/exports/exports.routes.ts:11-15`
- `backend/src/modules/exports/exports.service.ts:20-369`
- `backend/src/modules/exports/csv.service.ts:3-10`
- `backend/src/jobs/export.processor.ts:9-38`
**Trace:**
| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | UI | `ExportCenterPage.tsx:20-29` | Create-export mutation posts selected type and default range | `{ exportType, filters }` | Weak UX for arbitrary filters |
| 2 | Route | `backend/src/modules/exports/exports.routes.ts:11-15` | Permission and validation guard | request | Unauthorized export |
| 3 | Service | `backend/src/modules/exports/exports.service.ts:27-45` | Export job created and audit event recorded | export job row | Missing audit trail |
| 4 | Service | `backend/src/modules/exports/exports.service.ts:45-72` | Row count estimated; sync vs queue branch chosen | count | Under/over-estimation |
| 5 | Worker or fallback | `backend/src/modules/exports/exports.service.ts:124-212` | Job marked processing, rows built, CSV written, job updated | CSV file + job status | Partial failure and retries |
| 6 | Side effects | `backend/src/modules/exports/exports.service.ts:157-180` | Completion tracked and audited | events | Duplicate events if idempotency weak |
| 7 | Download | `backend/src/modules/exports/exports.controller.ts:37-43` | File streamed to client | CSV stream | Missing file or incorrect auth |
| 8 | UI | `ExportCenterPage.tsx:76-101` | Download or retry action exposed | blob / retried job | UI stale cache |
**Validation and authorization:** Export creation uses `createExportSchema` (`backend/src/modules/exports/exports.schemas.ts:3-10`) and `requirePermission("exports:create")` (`backend/src/modules/exports/exports.routes.ts:11`).
**Persistence and side effects:** Writes `ExportJob`, audit events, tracked events, files on disk, and optional queue jobs.
**Tests that cover it:** No direct export integration test found in this pass.
**What juniors usually miss:**
- CSV generation is a security boundary because spreadsheet injection exists.
- Background work still needs user-visible state transitions.
- Export files are not the source of truth; the export job row is.
**What seniors notice:**
- Queue unavailability falls back to inline processing (`backend/src/modules/exports/exports.service.ts:54-69`).
- CSV cells are sanitized centrally in `backend/src/shared/utils/csv.ts:1-33`.
- File retention is modeled with `expiresAt` but cleanup automation is not present in the code inspected here.
**Drill:** Write the invariants for an export job state machine using only the statuses in `backend/prisma/schema.prisma:186-192`.
**Self-grade:**
- Basic: you can trace create -> process -> download.
- Solid: you can explain why audit and tracked events are both emitted.
- Strong: you can describe one idempotency risk and one mitigation.
