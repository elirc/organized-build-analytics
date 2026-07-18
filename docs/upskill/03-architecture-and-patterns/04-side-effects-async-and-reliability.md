# Side Effects, Async, And Reliability

## Side-Effect Map

| Side effect | Where triggered | Reliability question |
| --- | --- | --- |
| Tracked auth events | `backend/src/modules/auth/auth.service.ts:47-58,79-88,96-104` | What if event write fails after auth logic? |
| Audit records | `backend/src/modules/auth/auth.service.ts:60-68`, `backend/src/modules/exports/exports.service.ts:171-208`, `backend/src/modules/dashboardConfigs/dashboardConfigs.controller.ts:15-57` | Do we need stronger transactional guarantees? |
| Cache writes | `backend/src/modules/dashboard/kpi.service.ts:65-66`, `backend/src/modules/monitoring/monitoring.service.ts:74-75` | Is stale data acceptable? |
| Queue handoff | `backend/src/modules/exports/exports.service.ts:54-69` | What if Redis is down? |
| File writes | `backend/src/modules/exports/exports.service.ts:145-146` | What if disk write fails after DB update? |

## Idempotency

The export processor assumes a job can be retried, but the current code would re-emit tracked and audit events on repeated successful processing unless additional guards are added. That is a good senior-level investigation target (`backend/src/modules/exports/exports.service.ts:157-180`).

## Retries

- Queue retries are not deeply configured in the inspected code.
- Manual retry exists at the API level for failed export jobs (`backend/src/modules/exports/exports.routes.ts:14-15`, `backend/src/modules/exports/exports.service.ts:101-122`).

## Backpressure And Timeouts

- Large exports are diverted away from synchronous handling based on estimated row count (`backend/src/modules/exports/exports.service.ts:45-72`).
- Dashboard reads rely on query shaping and cache TTLs rather than explicit timeout logic in the inspected code.

## Risky Side-Effect Placements

- Auth registration writes user row, tracked event, and audit event as separate operations without a transaction (`backend/src/modules/auth/auth.service.ts:35-70`).
- Export completion updates DB state and writes file in a multi-step flow. Failures are handled, but not atomically (`backend/src/modules/exports/exports.service.ts:139-210`).
