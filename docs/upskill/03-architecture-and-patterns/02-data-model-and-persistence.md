# Data Model And Persistence

## Key Entities

| Entity | Purpose | Key relationships |
| --- | --- | --- |
| `User` | Internal authenticated actor | Owns audit events, export jobs, refresh tokens (`backend/prisma/schema.prisma:11-24`) |
| `TrackedEvent` | Product and operations event stream | Optional actor and entity references (`backend/prisma/schema.prisma:26-42`) |
| `AuditEvent` | Sensitive action ledger | Optional actor relation to `User` (`backend/prisma/schema.prisma:44-60`) |
| `MonitoringMetric` | System-health timeseries | No direct foreign keys (`backend/prisma/schema.prisma:62-74`) |
| `MetricSnapshot` | Future rollup/snapshot table | Currently modeled but not a major runtime surface in inspected code (`backend/prisma/schema.prisma:76-88`) |
| `DashboardConfig` | Role-targeted layout metadata | Role-indexed JSON layout (`backend/prisma/schema.prisma:90-101`) |
| `ExportJob` | Lifecycle tracking for exports | Belongs to `User` (`backend/prisma/schema.prisma:103-123`) |
| `RefreshToken` | Revocable session record | Belongs to `User` (`backend/prisma/schema.prisma:125-135`) |

## Index Strategy

The initial migration encodes the expected read patterns: date-based scans, enum filters, actor filters, and export-center queries (`backend/prisma/migrations/20260519_init/migration.sql:140-198`).

## Transaction Boundaries

- Dashboard config update uses a transaction so "default per role" stays consistent when toggling defaults (`backend/src/modules/dashboardConfigs/dashboardConfigs.service.ts:51-66`).
- Most other writes are single-record or best-effort multi-step workflows without an explicit transaction, especially auth and export side effects (`backend/src/modules/auth/auth.service.ts:35-70`, `backend/src/modules/exports/exports.service.ts:139-210`).

## Consistency Expectations

- Refresh token rotation expects one old token record to be revoked before a new one is persisted (`backend/src/modules/auth/auth.service.ts:121-146`, `164-190`).
- Export job status is the system-of-record for export progress (`backend/src/modules/exports/exports.service.ts:134-155`, `183-187`).
- Dashboard data is allowed to be slightly stale because of cache TTLs (`backend/src/modules/dashboard/kpi.service.ts:22-27`, `65-66`).

## How To Safely Change The Schema

1. Start with the model and enum changes in `backend/prisma/schema.prisma`.
2. Think about query paths and add indexes if the new field will be filtered or sorted.
3. Decide whether seed data should populate the new field (`backend/prisma/seed.ts:16-166`).
4. Update services and API contracts before UI code relies on the field.
5. Add or update tests before relying on the new shape.
6. Verify migration blast radius, especially for existing non-null constraints.
