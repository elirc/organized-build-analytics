# Feature Walkthroughs

Each walkthrough names the real files in order. Open them side by side as you
read. Paths are under `backend/src/` unless stated. This repository is a
snapshot of [elirc/3buildanalytics](https://github.com/elirc/3buildanalytics)
from before its 20-story backlog was merged, and these walkthroughs were
checked against this snapshot on 2026-10-06.

## Track Event Flow

1. `POST /api/events/track` is registered in
   `modules/events/events.routes.ts:11`. It is gated by `events:view`, a *read*
   permission, so any role that can read events can also write them. There is
   no `events:write` in the matrix (`shared/permissions.ts:3-11`). The
   maintained repository later fixed this by adding `events:write`.
2. `validate(trackEventSchema)` rejects malformed payloads before the
   controller runs (`events.schemas.ts`).
3. `eventsController.track` → `eventsService.track` → `events.repository.ts`
   writes the `TrackedEvent` row.
4. From that moment the row is visible to `GET /api/events` (paginated raw
   log) and to the `summary/by-type` and `summary/over-time` aggregates.

## KPI Dashboard Flow

1. Filter state lives in the URL. The TanStack Query key includes the same
   date range (`frontend/src/features/dashboard/hooks/useKpiSummary.ts:7`), so
   a changed filter is a different cache entry on *both* ends.
2. `GET /api/dashboard/kpi-summary` (`modules/dashboard/dashboard.routes.ts:15`).
   The whole router is wrapped in `requirePermission("dashboard:view")` once,
   via `dashboardRouter.use(...)` (`:12`), instead of per route.
3. `kpiService.getSummary` (`modules/dashboard/kpi.service.ts`):
   - `parseDateRange(..., { maxRangeDays: 365 })` validates at the service
     boundary (`:15`);
   - the cache key comes from `cacheKeys.kpiSummary({ role, startDate, endDate })`
     (`:16-20`), so the **role is part of the key**;
   - `refresh=true` skips the cache read (`:22-27`);
   - on a miss, seven counts run in one `Promise.all` (`:29-52`),
     `applyMetricVisibility(role, ...)` strips metrics the role may not see
     (`:54`), and the result is cached for 300 seconds (`:65`).

## Chart Data Flow

Charts never aggregate client-side. Each chart has its own endpoint in
`dashboard.routes.ts:16-21` (`/events-over-time`, `/events-by-type`,
`/active-users`, `/error-rate`, `/conversion-funnel`, `/recent-activity`),
all validated by `dashboardRangeSchema`, all returning buckets the chart
library renders directly. Every chart reads live data. `jobs/metricSnapshot.processor.ts`
exists, but its register function is an empty stub.

## Audit Dashboard Flow

Audit routes require `audit:view` (`modules/audit/audit.routes.ts:11-15`). Of
the seven roles, only `SYSTEM_ADMIN` and `AUDIT_VIEWER` have it; the
`permissionMatrix` in `shared/permissions.ts:13-48` is the single source of
truth. Summaries are grouped server-side (`/summary/by-action`,
`/summary/by-actor`, `/summary/over-time`), and raw records stay paginated.

## Monitoring Flow

`MonitoringMetric` is ingested separately from tracked events: system
health, not product usage. Note that `POST /api/monitoring/metrics` is gated
by `monitoring:view` (`modules/monitoring/monitoring.routes.ts:11`), the same
read-for-write pattern as event tracking. `jobs/monitoringRollup.processor.ts`
is an empty stub, so there is no rollup or retention yet.

## Export Flow

1. The frontend calls create on the exports module. `exportsService.create`
   (`modules/exports/exports.service.ts:21-72`) inserts the `ExportJob` row and
   records an `EXPORT_REQUESTED` audit event *first*, then estimates the row
   count with `estimateExportRows` (`:45`).
2. `MAX_SYNC_EXPORT_ROWS = 10_000` (`:18`) splits the paths: at or under it,
   the CSV is generated inline; over it, the job is queued to BullMQ for
   `jobs/export.processor.ts`. If the queue is unavailable, the export falls
   back to running inline (`:60-69`). The processor is registered by both the
   API (`server.ts:13`) and the separate worker process (`worker.ts`).
3. Failures land in the `ExportJob` row's `errorMessage` (`:186`), the first
   place to look when an export sits in a failed state (see
   `docs/DEBUGGING_GUIDE.md`).
4. `retry` (`:101-120`) resets the failed row to `PENDING` and then calls
   `create`, which inserts a *new* row. The old row is never touched again.
