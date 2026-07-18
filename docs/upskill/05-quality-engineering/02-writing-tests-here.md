# Writing Tests Here

## Commands

- Backend: `npm run test -w backend`
- Frontend unit: `npm run test -w frontend`
- Frontend e2e: `npm run test:e2e -w frontend`

## Test Recipes

### Recipe 1: Happy-path utility test

Copy the style of `backend/tests/unit/csv.test.ts:3-18`.

### Recipe 2: Permission failure

Start from `backend/src/shared/permissions.ts:13-52` and assert denied cases like `backend/tests/unit/permissions.test.ts:8-10`.

### Recipe 3: Validation failure integration test

Use `createApp()` like `backend/tests/integration/health.test.ts:3-12`, but hit a route with missing `startDate`.

### Recipe 4: Auth lifecycle integration test

Target:

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

Relevant files:

- `backend/src/modules/auth/auth.routes.ts:11-15`
- `backend/src/modules/auth/auth.service.ts:73-161`

### Recipe 5: KPI response visibility test

Target `backend/src/modules/dashboard/kpi.service.ts:54-63` and assert that executive roles do not receive admin-only fields.

### Recipe 6: Export retry failure-path test

Target `backend/src/modules/exports/exports.service.ts:101-122` with a failed job fixture.

### Recipe 7: Frontend URL-filter test

Verify that changing date range mutates the URL and query key inputs for `useDashboardFilters` and dependent hooks.

### Recipe 8: Component optional-field rendering test

Extend `frontend/src/test/KpiCardGrid.test.tsx:5-24` to assert that missing optional KPI fields do not render cards.
