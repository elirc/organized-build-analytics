# Mid-Level Feature Tickets

Before implementing any of these, write a short design note with:

1. Goal
2. Current anchors
3. Proposed change
4. Risks
5. Tests
6. Rollback

## Ticket 1: Add frontend audit-event detail page
- Scope: router, API client, page, tests
- Read first: `frontend/src/app/router.tsx:48-50`, `backend/src/modules/audit/audit.routes.ts:15`, `frontend/src/features/audit/pages/AuditDashboardPage.tsx:64-85`
- Risks: exposing fields that should stay summary-only
- Rollback: remove route and page

## Ticket 2: Add auth lifecycle backend integration suite
- Scope: backend tests and test helpers
- Read first: `backend/src/modules/auth/auth.routes.ts:11-15`, `backend/src/modules/auth/auth.service.ts:73-161`
- Risks: brittle token fixture setup
- Rollback: keep tests isolated behind helpers

## Ticket 3: Replace event summary loop with grouped repository query
- Scope: events repository + service + tests
- Read first: `backend/src/modules/events/events.service.ts:38-68`
- Risks: output-shape drift, SQL correctness
- Rollback: keep old implementation available until parity tests pass

## Ticket 4: Add export artifact existence check before streaming download
- Scope: export service/controller/tests
- Read first: `backend/src/modules/exports/exports.controller.ts:37-43`, `backend/src/modules/exports/exports.service.ts:88-99`
- Risks: changing error semantics for existing downloads
- Rollback: revert check while retaining tests for future hardening

## Ticket 5: Add export polling while status is pending or processing
- Scope: frontend query behavior, UX states, tests
- Read first: `frontend/src/features/exports/pages/ExportCenterPage.tsx:15-35`
- Risks: overly aggressive polling
- Rollback: disable polling and keep manual refresh

## Ticket 6: Add grouped SQL summaries for audit actions/actors
- Scope: audit repository/service/tests
- Read first: `backend/src/modules/audit/audit.service.ts:52-91`
- Risks: query complexity and shape parity
- Rollback: restore in-memory grouping if correctness issues appear

## Ticket 7: Add admin-only cache refresh control in UI
- Scope: frontend role gating and dashboard query params
- Read first: `backend/src/middleware/metricVisibility.middleware.ts:3-9`, `frontend/src/lib/permissions.ts:19-24`
- Risks: accidental exposure to other roles
- Rollback: hide the control and stop sending param

## Ticket 8: Add integration test coverage for dashboard-config default uniqueness
- Scope: backend tests, maybe test utilities
- Read first: `backend/src/modules/dashboardConfigs/dashboardConfigs.service.ts:51-66`
- Risks: transaction behavior hard to verify without realistic DB setup
- Rollback: keep test scoped to service behavior rather than DB internals

## Ticket 9: Add `entityId` search to event log UI and API
- Scope: frontend filters, events API, repository search, tests
- Read first: `frontend/src/features/dashboard/hooks/useDashboardFilters.ts:14-16`, `backend/src/modules/events/events.repository.ts:35-40`
- Risks: query shape drift or search ambiguity
- Rollback: feature-flag the new filter or remove it cleanly

## Ticket 10: Add monitoring-series aggregation options (day/week)
- Scope: frontend query args, backend series endpoints, tests
- Read first: `backend/src/modules/monitoring/monitoring.service.ts:78-91`
- Risks: large data responses and API contract changes
- Rollback: keep existing daily default only
