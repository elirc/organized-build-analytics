# Validation, Auth, And Permissions

## Validation Layers

| Layer | Files | Notes |
| --- | --- | --- |
| Env validation | `backend/src/config/env.ts:5-22` | Fails fast at startup |
| Request validation | `backend/src/middleware/validate.middleware.ts:7-26` | All major routes should wire a Zod schema |
| Date-range semantic validation | `backend/src/shared/utils/dates.ts:11-40` | Enforces ordering and max range |
| Client form validation | `frontend/src/auth/LoginPage.tsx:13-18` | UX help, not security |

## Authentication

- Access token parsing happens centrally in `backend/src/middleware/auth.middleware.ts:5-25`.
- Refresh token verification and revocation happen in `backend/src/modules/auth/auth.service.ts:121-161`.
- Frontend session persistence lives in `frontend/src/auth/auth.store.ts:29-42`.

## Authorization

- Route-level permission enforcement: `backend/src/middleware/requirePermission.middleware.ts:7-18`
- Permission matrix: `backend/src/shared/permissions.ts:13-52`
- Backend metric visibility filtering: `backend/src/shared/permissions.ts:54-67`
- Frontend route gating: `frontend/src/auth/RequireRole.tsx:5-12`

## What A Junior Might Miss

- UI hiding is not authorization.
- `dashboard:view` lets several roles load dashboards, but the payload is still filtered by role.
- Date validation is a business rule, not just a parsing concern.

## What A Senior Checks

- Is every raw-data route protected server-side?
- Does a role ever receive data it should not receive, even if the UI hides it?
- Are summary endpoints leaking more than intended through derived fields?
- Does cache bypass accidentally widen access? Here it is constrained by `metricVisibilityMiddleware` (`backend/src/middleware/metricVisibility.middleware.ts:3-9`).

## IDOR-Style Thinking

Export download and lookup are user-scoped by `requestedById` in `backend/src/modules/exports/exports.service.ts:78-99`. That is the right shape to look for whenever a route exposes per-user resources.
