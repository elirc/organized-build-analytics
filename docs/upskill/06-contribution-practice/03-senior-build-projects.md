# Senior Build Projects

## Project 1: Snapshot-Backed Historical Reporting
**Problem statement:** Long-range dashboard queries will eventually outgrow direct raw-event aggregation.
**Product value:** Predictable historical dashboard latency.
**Design checklist:** snapshot cadence, backfill, invalidation, parity checks, role visibility.
**Architecture decisions:** snapshot table vs materialized views, dual-read strategy.
**Likely files/modules:** `backend/prisma/schema.prisma:76-88`, `backend/src/modules/dashboard/*`, `backend/src/jobs/*`
**Migration plan:** dual-write or scheduled backfill, compare results, then cut over.
**Test plan:** fixture-based parity tests and performance comparison.
**Security plan:** keep backend metric filtering after snapshot read.
**Performance plan:** benchmark long-range KPI and trend queries.
**Rollout/rollback plan:** feature flag snapshot reads.
**Open questions:** Should snapshot ownership live in jobs or a separate analytics module?
**Stretch goals:** retention policy and backfill CLI.

## Project 2: Redis-Backed Distributed Rate Limiting
**Problem statement:** Current limiter is process-local.
**Product value:** More realistic production abuse protection.
**Design checklist:** proxy awareness, instance consistency, operational visibility.
**Likely files/modules:** `backend/src/middleware/rateLimit.middleware.ts:7-31`, `backend/src/cache/redis.ts:7-16`
**Migration plan:** keep middleware interface, swap implementation.
**Test plan:** repeated-request integration tests.
**Security plan:** avoid bypass via proxy misconfiguration.
**Performance plan:** keep limiter overhead bounded.
**Rollout/rollback plan:** environment flag to fall back to current limiter.

## Project 3: Export Idempotency Hardening
**Problem statement:** Export retries may duplicate side effects.
**Product value:** Safer worker recovery and manual retries.
**Design checklist:** job-state preconditions, dedupe markers, artifact checks.
**Likely files/modules:** `backend/src/modules/exports/exports.service.ts:124-210`, `backend/src/jobs/export.processor.ts:14-37`
**Migration plan:** add guards before emitting completion events.
**Test plan:** forced duplicate processing tests.
**Security plan:** ensure retries cannot expose stale files.
**Performance plan:** avoid extra heavy reads on the hot path.
**Rollout/rollback plan:** ship with extra logs first, then enforce hard guards.

## Project 4: Full-Stack Auth Integration Harness
**Problem statement:** Auth is central but lightly integration-tested.
**Product value:** Higher confidence for every protected surface.
**Design checklist:** seeded users, token helpers, route coverage, denied cases.
**Likely files/modules:** `backend/src/modules/auth/*`, `frontend/src/auth/*`, tests
**Migration plan:** start backend-only, then add browser paths.
**Test plan:** login, refresh, logout, denied routes.
**Security plan:** never log real secrets in test output.
**Performance plan:** keep suite parallel and deterministic.
**Rollout/rollback plan:** mark slow tests separately if needed.

## Project 5: SQL-First Summary Endpoints
**Problem statement:** Some summaries still aggregate in memory.
**Product value:** Better scalability and cleaner backend contracts.
**Design checklist:** shape parity, indexes, query readability.
**Likely files/modules:** `backend/src/modules/events/events.service.ts:38-68`, `backend/src/modules/audit/audit.service.ts:52-91`
**Migration plan:** replace one endpoint at a time with parity tests.
**Test plan:** seed-based snapshot comparisons.
**Security plan:** keep permission boundaries unchanged.
**Performance plan:** collect before/after timings from request logs.
**Rollout/rollback plan:** endpoint-by-endpoint release.
