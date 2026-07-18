# Boundaries And Layers

## Layer Map

| Layer | Representative files | Owns | Must not own |
| --- | --- | --- | --- |
| UI/page composition | `frontend/src/features/dashboard/pages/OperationsDashboardPage.tsx:18-75` | Rendering, query orchestration, filter UX | Durable authorization logic |
| Frontend transport | `frontend/src/api/client.ts:5-40` | Request formatting, auth header, error decoding | Business logic |
| HTTP/transport | `backend/src/modules/*/*.routes.ts`, `backend/src/modules/*/*.controller.ts` | Route surface, validation hookup, HTTP status codes | Query design, cross-entity orchestration |
| Service/application | `backend/src/modules/auth/auth.service.ts:25-219`, `backend/src/modules/exports/exports.service.ts:20-212` | Business invariants, orchestration, side effects | Low-level HTTP response building |
| Repository/persistence | `backend/src/modules/*/*.repository.ts` | Query structure, includes, SQL | UI-specific shape decisions beyond API need |
| Cross-cutting middleware | `backend/src/middleware/*.ts` | Auth parsing, permission checks, error translation | Feature-specific policy branching |
| Worker/async | `backend/src/jobs/export.processor.ts:9-38`, `backend/src/worker.ts:5-18` | Background execution | Browser-facing concerns |

## Good Boundaries

- Controller delegates to service without growing logic: `backend/src/modules/auth/auth.controller.ts:5-40`
- Page composes hooks and components without knowing backend implementation details: `frontend/src/features/dashboard/pages/ProductDashboardPage.tsx:14-64`
- Cache keys are centralized instead of string-built ad hoc: `backend/src/cache/cacheKeys.ts:10-21`

## Boundary Leaks To Watch

- `authController.me` performs a manual 401 response even though auth middleware already exists (`backend/src/modules/auth/auth.controller.ts:16-29`)
- `MonitoringDashboardPage` is just an alias to `EngineeringDashboardPage` (`frontend/src/features/monitoring/pages/MonitoringDashboardPage.tsx:1-4`), which is fine for now but couples route identity to one page implementation

## Junior vs Senior Noticing

- Junior notices which file changed.
- Mid-level notices which layer should own the change.
- Senior notices whether the current layer split still reduces risk under future growth.
