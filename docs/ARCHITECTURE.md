# Architecture

## System Shape

The platform is a read-heavy analytics and admin system split into a React frontend and an Express API. PostgreSQL stores operational records, audit records, monitoring metrics, export jobs, configs, and auth data. Redis supports caching and BullMQ-backed background jobs.

## Backend Design

- Controllers stay thin and delegate to services.
- Services enforce business rules, role checks, aggregation shape, and orchestration.
- Repositories isolate Prisma and SQL-heavy data access.
- Middleware handles auth, permissions, validation, logging, and error translation.
- Dashboard endpoints return chart-ready aggregates instead of raw rows.

## Frontend Design

- React Router owns route structure and protected navigation.
- TanStack Query owns server-state caching and refetch behavior.
- Zustand owns auth session and UI-only preferences.
- URL query params store analytics filters for shareable, reproducible views.

## Data Domains

- `TrackedEvent`: product and operations analytics signals
- `AuditEvent`: compliance and security records
- `MonitoringMetric`: system health time-series data
- `ExportJob`: background export lifecycle tracking
- `DashboardConfig`: role-specific layout defaults

## Performance Principles

- Aggregate on the backend.
- Paginate raw logs.
- Cache expensive summaries in Redis.
- Use SQL when time-bucket analytics are awkward in ORM form.
- Seed realistic volume early so performance problems show up before production.
