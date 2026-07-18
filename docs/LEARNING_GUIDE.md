# Learning Guide

## Why This Project Matters

Internal dashboards are not “just charts.” They are trust systems. A team uses them to make decisions, triage incidents, answer audits, and spot operational drift.

## Core Lessons

- Read-heavy systems need different design than CRUD apps.
- Aggregation belongs on the backend so the browser stays fast.
- Date-range filters shape indexing, cache keys, and API contracts.
- Role-based visibility must be enforced server-side.
- CSV export is part product feature, part security feature.
- Seed volume matters because fake-small datasets hide query problems.

## Suggested Study Path

1. Start with `TrackedEvent`, `AuditEvent`, and `MonitoringMetric`.
2. Follow how date ranges move from URL params to backend validation.
3. Trace KPI endpoints and compare raw logs versus aggregate responses.
4. Review the cache key strategy and think about invalidation tradeoffs.
5. Study why export jobs evolve from synchronous to background processing.
