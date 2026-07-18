# Trace Tables

## UI To API Trace: Login

| Step | File/line | Value shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | `frontend/src/auth/LoginPage.tsx:25-31` | `{ email, password }` | UI form | Default values + local validation | Demo creds can mislead |
| 2 | `frontend/src/api/auth.api.ts:10-15` | JSON body | frontend API client | POST request | Contract drift |
| 3 | `backend/src/modules/auth/auth.schemas.ts:23-30` | parsed login body | backend validation | email/password constraints | Weak schema |
| 4 | `backend/src/modules/auth/auth.service.ts:73-106` | user row -> session | service | verify + create session | auth bug |
| 5 | `frontend/src/auth/auth.store.ts:35-36` | session object | client state | persist session | token storage tradeoff |

## Persistence Trace: Export Job

| Step | File/line | Value shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | `backend/src/modules/exports/exports.service.ts:27-32` | `ExportJob` row | service/repo | DB row created | duplicate request handling |
| 2 | `backend/src/modules/exports/exports.service.ts:134-137` | status update | service/repo | `PENDING` -> `PROCESSING` | lost update |
| 3 | `backend/src/modules/exports/exports.service.ts:145-146` | CSV string -> file | service/fs | file write | disk failure |
| 4 | `backend/src/modules/exports/exports.service.ts:148-155` | completed job | service/repo | file metadata persisted | file/path mismatch |

## Auth / Permission Trace: Dashboard Request

| Step | File/line | Value shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | `frontend/src/api/client.ts:6-15` | access token | client | auth header added | missing token |
| 2 | `backend/src/middleware/auth.middleware.ts:14-20` | JWT payload | middleware | `request.user` populated | bad token handling |
| 3 | `backend/src/modules/dashboard/dashboard.routes.ts:12-15` | request | route/middleware | permission and refresh scoping | authz gap |
| 4 | `backend/src/shared/permissions.ts:54-67` | metric object | policy | fields removed by role | leakage |

## Error Trace: Validation Failure

| Step | File/line | Value shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | `backend/src/middleware/validate.middleware.ts:9-24` | thrown `ZodError` | middleware | converted to `AppError` | poor message fidelity |
| 2 | `backend/src/middleware/error.middleware.ts:13-20` | `AppError` | error middleware | JSON error response | inconsistent bypass |
| 3 | `frontend/src/api/client.ts:22-27` | response JSON | client API | JS `Error` thrown | low-context client errors |
