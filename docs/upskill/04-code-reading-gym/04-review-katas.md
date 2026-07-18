# Review Katas

## Kata 1: "Move KPI math to the browser"
**Author intent:** Reduce backend load by sending raw events to the frontend.
**Fake diff summary:**
- Removes `/api/dashboard/kpi-summary`
- Frontend fetches `/api/events`
- Browser computes cards and error rate
**Files this resembles:**
- `backend/src/modules/dashboard/kpi.service.ts:8-67`
- `frontend/src/features/dashboard/pages/OperationsDashboardPage.tsx:18-75`
**Your task:** Review this PR.
**Expected findings:**
Blocking:
- Breaks backend authorization/visibility boundary
- Replaces aggregate API with raw-row transport
Important:
- Worse performance and cache behavior
Optional:
- None
**Good review comment example:**
> This moves both aggregation and visibility-sensitive filtering into the browser. In this repo the KPI endpoint is the trusted boundary, so I'd keep the server aggregate and optimize it there instead.

## Kata 2: "Enable refresh=true for every dashboard user"
**Author intent:** Let users bypass stale cache.
**Fake diff summary:** Removes role restriction in `metricVisibilityMiddleware`.
**Files this resembles:** `backend/src/middleware/metricVisibility.middleware.ts:3-9`
**Your task:** Review this PR.
**Expected findings:**
Blocking:
- Broadens an admin-only control without a policy discussion
Important:
- Could increase DB load during incidents
Optional:
- UI affordance should match actual policy
**Good review comment example:**
> This changes more than UX. It widens a backend capability currently scoped to system admins, so I'd want an explicit policy decision plus load considerations before merging.

## Kata 3: "Simplify exports by removing job rows"
**Author intent:** Fewer tables and less code.
**Fake diff summary:** Direct-download endpoint only; no `ExportJob`.
**Files this resembles:** `backend/src/modules/exports/exports.service.ts:20-212`
**Expected findings:**
Blocking:
- Removes retry/history/progress surface
Important:
- Breaks async-ready design for large exports
Optional:
- N/A

## Kata 4: "Use row index keys in all tables"
**Author intent:** Silence key warnings quickly.
**Fake diff summary:** Adds `key={rowIndex}` to every mapped row.
**Files this resembles:** `frontend/src/components/DataTable.tsx:22-24`
**Expected findings:**
Important:
- Unstable identity under reorder/update
Optional:
- Could be acceptable for some static tables, but generic component should be safer

## Kata 5: "Remove backend validation because forms already validate"
**Author intent:** Eliminate duplication.
**Fake diff summary:** Deletes `validate(...)` middleware from several routes.
**Files this resembles:** `backend/src/middleware/validate.middleware.ts:7-26`
**Expected findings:**
Blocking:
- Removes server trust boundary

## Kata 6: "Inline permission checks inside each controller"
**Author intent:** Make auth logic easier to read.
**Fake diff summary:** Removes `requirePermission(...)` from routes and adds `if` checks in controllers.
**Files this resembles:** `backend/src/middleware/requirePermission.middleware.ts:7-18`
**Expected findings:**
Important:
- Scatters policy and makes auditability worse

## Kata 7: "Auto-retry failed exports forever"
**Author intent:** Improve reliability.
**Fake diff summary:** Background job retries on failure with no cap or dedupe logic.
**Files this resembles:** `backend/src/modules/exports/exports.service.ts:101-122`
**Expected findings:**
Blocking:
- Can amplify duplicate side effects
Important:
- Could create noisy failure loops

## Kata 8: "Delete login telemetry to speed auth"
**Author intent:** Reduce writes on login.
**Fake diff summary:** Removes failed-login and login-success tracked events.
**Files this resembles:** `backend/src/modules/auth/auth.service.ts:78-104`
**Expected findings:**
Important:
- Loses security and operational signals
Optional:
- Might be replaced by lower-cost telemetry, but not silently removed
