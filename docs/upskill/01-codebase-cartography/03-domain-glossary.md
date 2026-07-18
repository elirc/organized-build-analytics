# Domain Glossary

| Term | Meaning here | Where it appears |
| --- | --- | --- |
| User | Authenticated internal user with a role | `backend/prisma/schema.prisma:11-24` |
| Role | Authorization category such as `SYSTEM_ADMIN` or `AUDIT_VIEWER` | `backend/prisma/schema.prisma:137-145`, `backend/src/shared/permissions.ts:13-48` |
| Tracked event | Raw operational or product event such as login, error, export | `backend/prisma/schema.prisma:26-42`, `backend/src/modules/events/events.service.ts:8-68` |
| Audit event | Compliance/security record of sensitive actions | `backend/prisma/schema.prisma:44-60`, `backend/src/modules/audit/audit.service.ts:8-91` |
| Monitoring metric | System health measurement such as latency or error rate | `backend/prisma/schema.prisma:62-74`, `backend/src/modules/monitoring/monitoring.service.ts:8-100` |
| Metric snapshot | Pre-aggregated metric record for future rollups | `backend/prisma/schema.prisma:76-88` |
| Dashboard config | Role-specific layout metadata | `backend/prisma/schema.prisma:90-101`, `backend/src/modules/dashboardConfigs/dashboardConfigs.service.ts:7-72` |
| Export job | Trackable export request with status and file metadata | `backend/prisma/schema.prisma:103-123`, `backend/src/modules/exports/exports.service.ts:20-212` |
| Refresh token | Long-lived session credential stored as a hash | `backend/prisma/schema.prisma:125-135`, `backend/src/modules/auth/auth.service.ts:121-190` |
| KPI summary | Aggregated dashboard card payload | `backend/src/modules/dashboard/kpi.service.ts:8-67`, `frontend/src/features/dashboard/components/KpiCardGrid.tsx:5-33` |
| Recent activity | Latest tracked events within a date range | `backend/src/modules/dashboard/dashboard.service.ts:14-20`, `frontend/src/features/dashboard/pages/OperationsDashboardPage.tsx:23-26` |
| Queue depth | Summary of pending/processing/failed export jobs | `backend/src/modules/monitoring/monitoring.repository.ts:34-47` |

## Confusing Near-Synonyms

- `TrackedEvent` vs `AuditEvent`
  - Tracked events are analytics/operations oriented.
  - Audit events are compliance/security oriented.
  - See `backend/prisma/schema.prisma:26-60`.
- Monitoring error rate vs dashboard error rate
  - Dashboard error rate is derived from tracked events (`backend/src/modules/dashboard/dashboard.repository.ts:71-90`).
  - Monitoring error rate is stored as its own metric series (`backend/src/modules/monitoring/monitoring.service.ts:78-91`).
- Role gating in UI vs permission enforcement in API
  - UI uses `RequireRole` and permission helpers (`frontend/src/auth/RequireRole.tsx:5-12`, `frontend/src/lib/permissions.ts:3-25`).
  - Backend uses `requirePermission` and metric filtering (`backend/src/middleware/requirePermission.middleware.ts:7-18`, `backend/src/shared/permissions.ts:54-67`).

## Junior Checkpoint

Can you explain why `ExportJob` exists even though the export file is also written to disk (`backend/src/modules/exports/exports.service.ts:145-155`)?
