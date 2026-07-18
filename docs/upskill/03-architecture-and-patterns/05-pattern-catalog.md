# Pattern Catalog

## Pattern: Thin Controller
**Problem it solves:** Keeps HTTP glue separate from business logic.
**General shape:** Controller parses request primitives, calls service, sets status and JSON body.
**Real example:** `backend/src/modules/events/events.controller.ts:5-52`
**Second example:** `backend/src/modules/exports/exports.controller.ts:6-43`
**Why this implementation works:** Controllers mostly normalize types and delegate.
**Failure modes:**
- Business rules leak into controller branches
- Duplicate validation or auth logic appears in controllers
**Use it when:**
- Transport layer should stay boring
**Avoid it when:**
- You need a full application service? Then use a service, not a fat controller
**Drill:** Find a controller that still contains a little policy and explain whether it should move.

## Pattern: Route-Level Permission Gate
**Problem it solves:** Rejects unauthorized access before business logic runs.
**General shape:** Route wires `requirePermission(...)` before the controller.
**Real example:** `backend/src/modules/audit/audit.routes.ts:11-15`
**Second example:** `backend/src/modules/monitoring/monitoring.routes.ts:11-19`
**Why this implementation works:** Permissions are visible at the public interface.
**Failure modes:** Permission drift between route and frontend UX.
**Use it when:** Access is role or capability based.
**Avoid it when:** You need finer per-resource checks as well; then add both route and resource checks.
**Drill:** Which export routes use `exports:create` vs `exports:view`, and why?

## Pattern: Backend Metric Visibility Filter
**Problem it solves:** Prevents sensitive metrics from leaking through a shared dashboard endpoint.
**General shape:** Build full metric object, then remove fields by role before responding.
**Real example:** `backend/src/shared/permissions.ts:54-67`
**Second example:** `backend/src/modules/dashboard/kpi.service.ts:54-63`
**Why this implementation works:** The server owns the final payload.
**Failure modes:** Hidden-field lists become hard to reason about as metrics grow.
**Use it when:** Same endpoint serves multiple roles with mostly shared shape.
**Avoid it when:** Roles need entirely different semantics, not just omitted fields.
**Drill:** If finance metrics were added, would you extend this pattern or split endpoints?

## Pattern: URL-Backed Dashboard Filters
**Problem it solves:** Makes analytics views shareable and browser-navigable.
**General shape:** Read from `useSearchParams`, derive defaults, update URL on interaction.
**Real example:** `frontend/src/features/dashboard/hooks/useDashboardFilters.ts:6-35`
**Second example:** `frontend/src/features/events/pages/EventLogPage.tsx:13-16`
**Why this implementation works:** Query keys and URLs both depend on the same filter state.
**Failure modes:** Forgetting to include a filter in a query key.
**Use it when:** Views are report-like.
**Avoid it when:** State is purely ephemeral and local.
**Drill:** Add a hypothetical `actorId` filter. Which layers need updates?

## Pattern: Query Key Mirrors Filters
**Problem it solves:** Keeps cache correctness aligned with visible filters.
**General shape:** Query key includes the same inputs the API call uses.
**Real example:** `frontend/src/features/dashboard/hooks/useEventsOverTime.ts:5-9`
**Second example:** `frontend/src/features/dashboard/pages/EngineeringDashboardPage.tsx:16-40`
**Why this implementation works:** Easy to reason about stale data.
**Failure modes:** Silent cache collisions.
**Use it when:** TanStack Query data depends on route or filter state.
**Avoid it when:** Inputs are intentionally ignored for a shared cache entry.
**Drill:** Find one query where key invalidation matters after mutation.

## Pattern: Service-Repostiory Split
**Problem it solves:** Separates business rules from query mechanics.
**General shape:** Service handles validation/orchestration; repository handles persistence.
**Real example:** `backend/src/modules/events/events.service.ts:13-68` + `backend/src/modules/events/events.repository.ts:23-64`
**Second example:** `backend/src/modules/monitoring/monitoring.service.ts:13-100` + `backend/src/modules/monitoring/monitoring.repository.ts:5-58`
**Why this implementation works:** Easier testing and clearer ownership.
**Failure modes:** Too-thin services that merely pass through, or repositories that start encoding policy.
**Use it when:** Features have both rules and query concerns.
**Avoid it when:** The feature is trivial and abstraction would only add noise.
**Drill:** Identify one service that is mostly composition and one that is heavy orchestration.

## Pattern: Raw SQL Escape Hatch
**Problem it solves:** Handles analytics queries Prisma expresses awkwardly or expensively.
**General shape:** Use Prisma for standard CRUD; use `$queryRaw` for bucketed or distinct analytics.
**Real example:** `backend/src/modules/dashboard/dashboard.repository.ts:10-20`
**Second example:** `backend/src/modules/dashboard/dashboard.repository.ts:38-90`
**Why this implementation works:** Query intent stays readable while improving cost model.
**Failure modes:** SQL drift, unsafe interpolation if done incorrectly.
**Use it when:** Time buckets, distinct counts, or grouped analytics matter.
**Avoid it when:** Prisma aggregate already expresses the query clearly.
**Drill:** Why is raw SQL justified for active-user counts here?

## Pattern: Cache-Aside For Expensive Summaries
**Problem it solves:** Reduces latency and DB load for repeated dashboard reads.
**General shape:** Parse inputs, derive key, check cache, compute on miss, store with TTL.
**Real example:** `backend/src/modules/dashboard/kpi.service.ts:15-27,65-66`
**Second example:** `backend/src/modules/monitoring/monitoring.service.ts:18-25,74-75`
**Why this implementation works:** Failure fallback returns uncached data rather than crashing.
**Failure modes:** Stale data, overly broad keys, missing role component.
**Use it when:** Read-heavy aggregates tolerate bounded staleness.
**Avoid it when:** The data is highly sensitive or must be fully current.
**Drill:** Name every field that belongs in the KPI cache key and why.

## Pattern: Graceful Cache Failure
**Problem it solves:** Prevents cache outages from becoming product outages.
**General shape:** Cache read/write errors return null or no-op.
**Real example:** `backend/src/cache/cache.service.ts:3-18`
**Second example:** `backend/src/server.ts:11-18`
**Why this implementation works:** Redis is an optimization, not the source of truth.
**Failure modes:** Silent failure can hide performance regressions.
**Use it when:** The cache is optional acceleration.
**Avoid it when:** Cache correctness is a hard dependency.
**Drill:** What observability would you add so silent cache failure is still visible?

## Pattern: Process-Local Rate Limit
**Problem it solves:** Basic abuse protection with low setup cost.
**General shape:** In-memory map keyed by client IP with count + window.
**Real example:** `backend/src/middleware/rateLimit.middleware.ts:7-31`
**Second example:** No second example found.
**Why this implementation works:** Simple local development and single-instance protection.
**Failure modes:** Multi-instance inconsistency, memory growth, proxy/IP ambiguity.
**Use it when:** MVP or single-instance internal tooling.
**Avoid it when:** Production spans multiple instances or untrusted networks.
**Drill:** List two deployment scenarios where this limiter becomes misleading.

## Pattern: Structured Request Logging
**Problem it solves:** Makes per-request debugging and correlation easier.
**General shape:** Attach request ID, log on response finish as structured JSON.
**Real example:** `backend/src/middleware/requestLogger.middleware.ts:7-23`
**Second example:** Logger helpers in `backend/src/shared/utils/logger.ts:1-32`
**Why this implementation works:** Logs contain method, path, status, duration, requestId.
**Failure modes:** Missing downstream propagation.
**Use it when:** Operational visibility matters.
**Avoid it when:** Never. The only question is how sophisticated it should be.
**Drill:** Which fields here would help you debug a slow endpoint?

## Pattern: Error Translation Middleware
**Problem it solves:** Keeps thrown app errors consistent at the HTTP boundary.
**General shape:** Throw `AppError`; middleware maps it to a response payload.
**Real example:** `backend/src/shared/errors/AppError.ts:1-10`
**Second example:** `backend/src/middleware/error.middleware.ts:7-35`
**Why this implementation works:** Callers can throw semantically meaningful errors.
**Failure modes:** Inconsistent direct `response.status(...).json(...)` branches bypass the pattern.
**Use it when:** A transport boundary needs stable error semantics.
**Avoid it when:** You are not crossing a boundary.
**Drill:** Find one spot that bypasses this pattern and decide if it should.

## Pattern: Generic Data Table
**Problem it solves:** Reuses tabular rendering across internal tools.
**General shape:** Column descriptors + optional renderers.
**Real example:** `frontend/src/components/DataTable.tsx:3-39`
**Second example:** Audit and engineering pages configure it differently (`frontend/src/features/audit/pages/AuditDashboardPage.tsx:64-85`, `frontend/src/features/dashboard/pages/EngineeringDashboardPage.tsx:76-99`)
**Why this implementation works:** Keeps page code focused on data and formatting.
**Failure modes:** Row keys based on index can produce unstable UI behavior (`frontend/src/components/DataTable.tsx:22-24`).
**Use it when:** Internal UI needs flexible tables.
**Avoid it when:** Row interactions need strong identity, virtualization, or nested state.
**Drill:** Explain why row-index keys are risky.

## Pattern: Background-Ready Export
**Problem it solves:** Handles small exports fast while allowing large exports to move off the request path.
**General shape:** Create job, estimate size, process inline if small, queue if large, fall back inline if queue unavailable.
**Real example:** `backend/src/modules/exports/exports.service.ts:27-72`
**Second example:** `backend/src/jobs/export.processor.ts:14-37`
**Why this implementation works:** It keeps one API surface while changing execution mode underneath.
**Failure modes:** Double-processing, stale job list, file cleanup gaps.
**Use it when:** Work size varies widely.
**Avoid it when:** All jobs are reliably tiny or reliably large.
**Drill:** What invariants would you assert before allowing a manual retry?

## Pattern: CSV Injection Sanitization
**Problem it solves:** Prevents spreadsheet formula injection when users open exports.
**General shape:** Prefix dangerous leading characters before CSV serialization.
**Real example:** `backend/src/shared/utils/csv.ts:1-33`
**Second example:** Tests in `backend/tests/unit/csv.test.ts:3-18`
**Why this implementation works:** Sanitization is centralized and covered by tests.
**Failure modes:** Bypassing the shared serializer.
**Use it when:** Exporting user- or system-generated values to CSV.
**Avoid it when:** Never; use stronger serializers if format changes.
**Drill:** List the dangerous prefixes and explain why they matter.

## Pattern: Audit + Analytics Dual Recording
**Problem it solves:** Separates business telemetry from compliance history.
**General shape:** Important actions can emit both tracked events and audit events.
**Real example:** `backend/src/modules/auth/auth.service.ts:47-68`
**Second example:** `backend/src/modules/exports/exports.service.ts:157-180`
**Why this implementation works:** Different audiences and retention needs can consume different records.
**Failure modes:** Duplicate semantics without clear ownership.
**Use it when:** One action matters to both product/ops and compliance/security.
**Avoid it when:** The event is only meaningful to one audience.
**Drill:** For dashboard-config deletion, should there also be a tracked event? Argue both sides.

## Pattern: Default-Per-Role Uniqueness Via Transaction
**Problem it solves:** Prevents multiple dashboard configs from being default for the same role.
**General shape:** Transactionally unset siblings, then update target row.
**Real example:** `backend/src/modules/dashboardConfigs/dashboardConfigs.service.ts:51-66`
**Second example:** No second example found.
**Why this implementation works:** Cross-row invariant is enforced in one write flow.
**Failure modes:** Missed invariant if other write paths bypass the service.
**Use it when:** One row per scope must be unique by business rule.
**Avoid it when:** Database constraints can express the rule more directly and should own it.
**Drill:** Would you prefer an application transaction, a partial unique index, or both?
