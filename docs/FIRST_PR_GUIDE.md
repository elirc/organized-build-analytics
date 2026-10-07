# First PR Guide

## Safe First Changes

Each of these is small, touches one layer at a time, and has a check that
tells you it worked.

1. **Add a KPI card sourced from an existing endpoint.** Only the Operations
   dashboard loads the KPI summary today
   (`frontend/src/features/dashboard/pages/OperationsDashboardPage.tsx:20`).
   Add the same `useKpiSummary` call and a card to another page in
   `frontend/src/features/dashboard/pages/`.
   **Check**: the card renders with real data, and changing the date range
   re-fetches it (watch the query key change in React Query devtools).
2. **Improve a dashboard empty state.** Pick a chart and a date range with no
   seeded data (e.g. a week before the seed window), and replace the blank
   render with a message. **Check**: the old range still renders bars; the
   empty range shows your message, not a zero-height chart.
3. **Add one backend validation rule.** `pageSize` in
   `backend/src/modules/events/events.schemas.ts:7` is `z.coerce.number().optional()`
   with no bounds; `getPagination` silently clamps it to 1-100
   (`backend/src/shared/utils/pagination.ts`). Make the schema reject values
   outside that range. **Check**: `pageSize=500` returns 400 with a Zod message,
   and `npm run test -w backend` still passes.
4. **Add one unit test around a helper.** `percent` in
   `backend/src/shared/utils/aggregations.ts` or `parseDateRange` in
   `backend/src/shared/utils/dates.ts` (what happens at exactly 365 days? at
   366?). **Check**: `npm run test -w backend` reports your new test.
5. **Add one audit record to an existing flow.** Only `auth.service.ts`,
   `dashboardConfigs.controller.ts` and `exports.service.ts` call
   `auditService.record`. Pick a mutation that doesn't, such as recording a
   monitoring metric, and add the write.
   **Check**: the action shows up in the audit dashboard for an
   `AUDIT_VIEWER` login.

## Workflow

1. Read the relevant doc for the area you are touching
   (`docs/BACKEND_TOUR.md` or `docs/FRONTEND_TOUR.md` names the entry files).
2. Trace the current path end to end before changing it. The walkthroughs
   in `docs/FEATURE_WALKTHROUGHS.md` are the templates.
3. Make the smallest coherent change that still proves the pattern.
4. Add or adjust tests.
5. Run `npm run typecheck`, `npm run test` and `npm run build` before the PR.

## Review Mindset

Reviewers here will ask, in roughly this order:

- Is the permission right? Two writes in this snapshot sit behind `:view`
  permissions (`POST /api/events/track` and `POST /api/monitoring/metrics`);
  don't add a third.
- Is the date range validated, and does the cache key include everything
  that changes the payload (role, range, interval)?
- Did raw rows cross a boundary where an aggregate should have?
- Would the next engineer understand this from the diff alone?
