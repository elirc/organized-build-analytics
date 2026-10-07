# Learning Guide

## Why This Project Matters

Internal dashboards are not “just charts.” They are trust systems. A team uses them to make decisions, triage incidents, answer audits, and spot operational drift.

## Core Lessons

- Read-heavy systems need different design than CRUD apps. Compare the
  dashboard module (aggregates, caching) to the users module (a plain list).
- Aggregation belongs on the backend: every chart endpoint in
  `backend/src/modules/dashboard/dashboard.routes.ts` returns bucketed,
  chart-ready data.
- Date-range filters shape everything. `parseDateRange` in
  `backend/src/shared/utils/dates.ts` defaults to a 180-day cap, the KPI
  summary raises it to 365, and the same `startDate`/`endDate` pair appears in
  URL params, Zod schemas, cache keys and SQL.
- Role-based visibility is enforced server-side twice: at route entry
  (`requirePermission`) and in payload shaping (`applyMetricVisibility` in
  `backend/src/shared/permissions.ts`).
- CSV export is part product feature, part security feature. See the
  formula-injection tests in `backend/tests/unit/csv.test.ts` and the
  ownership check in `exportsService.getById`.
- Seed volume matters because fake-small datasets hide query problems.

## Study Path

Each step names the files and ends with a check you can run or answer. Do
them in order; later steps assume the earlier mental model.

1. **The three event streams.** Read the `TrackedEvent`, `AuditEvent` and
   `MonitoringMetric` models in `backend/prisma/schema.prisma`, then
   `docs/DATA_MODEL_GUIDE.md` for why they are separate.
   **Check**: for each stream, name its permission (`events:view`,
   `audit:view`, `monitoring:view`) and find the route file that enforces it.
2. **One date range, end to end.** Start at a dashboard page's URL params in
   the frontend, then follow `startDate`/`endDate` through
   `dashboard.schemas.ts` (validation), `kpi.service.ts` (parsing and caching)
   and `dashboard.repository.ts` (SQL).
   **Check**: explain where an invalid range (end before start, or more than
   365 days) is rejected, and what status code the client sees.
3. **The KPI summary path.** Read `kpi.service.ts` top to bottom.
   **Check**: call `/api/dashboard/kpi-summary` twice with the same range and
   explain where the second answer comes from; then explain what
   `refresh=true` changes.
4. **Cache keys as a correctness tool.** Read `backend/src/cache/cacheKeys.ts`.
   The role is part of every key.
   **Check**: describe the exact bug that would occur if `role` were removed
   from `kpiSummary`'s key but `applyMetricVisibility` still ran. Which user
   would see whose numbers?
5. **Exports: sync vs queued.** Read `exports.service.ts`.
   `MAX_SYNC_EXPORT_ROWS = 10_000` decides whether an export runs inline or goes
   to BullMQ (`backend/src/jobs/export.processor.ts`).
   **Check**: say what happens to a 9,000-row and an 11,000-row export, what
   happens when Redis is down, and where a failure message ends up (the
   `ExportJob` row's `errorMessage`).
6. **The permission matrix.** Read `permissionMatrix` in
   `backend/src/shared/permissions.ts` and the route for
   `POST /api/events/track` in `events.routes.ts`.
   **Check**: list the roles that can track events, explain why gating a
   write with `events:view` is a bug, and name the permission you would add.
