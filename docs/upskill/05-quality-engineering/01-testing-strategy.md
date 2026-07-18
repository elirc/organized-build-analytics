# Testing Strategy

## Current Test Layers

| Layer | Evidence | What it covers now |
| --- | --- | --- |
| Backend unit | `backend/tests/unit/csv.test.ts:3-18`, `backend/tests/unit/permissions.test.ts:3-10` | Focused utility and policy logic |
| Backend integration | `backend/tests/integration/health.test.ts:5-12` | Basic app boot and middleware stack |
| Frontend component | `frontend/src/test/KpiCardGrid.test.tsx:5-24` | Render contract for KPI cards |
| Frontend E2E | `frontend/src/test/e2e/login.spec.ts:3-6`, `frontend/src/test/e2e/role-dashboards.spec.ts:3-6` | Lightweight route/UI smoke |

## What Belongs Where

- Unit tests: CSV sanitization, permission matrix, date parsing, query-key helper behavior
- Integration tests: auth flows, permission failures, KPI responses, export lifecycle, route validation
- Frontend component tests: cards, filter bars, guarded navigation, state transitions
- E2E tests: role login, filter changes, export center happy path once backend is running in test

## What Not To Test

- Tailwind class strings directly
- Prisma internals already covered by the library
- Trivial pass-through controllers unless they enforce important status or shape behavior

## Flake Prevention

- Keep time-sensitive logic explicit (`backend/src/shared/utils/duration.ts:9-18`)
- Prefer deterministic seed or fixture data
- Be careful with tests that assume Docker or Redis unless the suite provisions them
