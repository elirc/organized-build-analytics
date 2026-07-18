# Security Checklist

## Repo-Specific Risk Map

| Risk | Relevant code | Current posture |
| --- | --- | --- |
| Authorization gaps | `backend/src/middleware/requirePermission.middleware.ts:7-18` | Strong route-level pattern exists |
| Metric overexposure | `backend/src/shared/permissions.ts:54-67` | Mitigated by backend filtering |
| IDOR on per-user resources | `backend/src/modules/exports/exports.service.ts:78-99` | User-scoped lookup exists |
| Input validation | `backend/src/middleware/validate.middleware.ts:7-26` | Good route-level pattern |
| CSV injection | `backend/src/shared/utils/csv.ts:1-33` | Explicitly mitigated |
| Rate limiting | `backend/src/middleware/rateLimit.middleware.ts:7-31` | Present but process-local |
| Secrets in config | `backend/src/config/env.ts:5-22`, `.env.example:12-18` | Contract exists, but secret handling depends on deploy |

## Pre-Merge Security Checklist

- Are all new routes validated?
- Are all new routes protected by auth and permission middleware when needed?
- Does the response leak fields that the caller should not receive?
- If exporting data, does it pass through shared CSV sanitization?
- If adding a per-user resource, is ownership checked server-side?
- If adding a role, were both UI gating and backend permissions updated?
- If adding cache, is the cache key scoped by role and filters?

## What A Junior Might Miss

- A hidden button does not enforce access.
- Exports are a data-exfiltration surface.
- Internal tools still need rate limiting and auditability.
