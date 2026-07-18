# Observability And Operations

## Logging

- Request logs with request ID and duration: `backend/src/middleware/requestLogger.middleware.ts:7-23`
- Structured log helpers: `backend/src/shared/utils/logger.ts:1-32`
- Worker completion/failure logs: `backend/src/jobs/export.processor.ts:26-35`

## Health Checks

- Liveness: `backend/src/app.ts:35-37`
- Readiness: `backend/src/app.ts:39-43`

## How Would I Know This Broke?

| Flow | Probe |
| --- | --- |
| Login | 401/403 rates, failed-login tracked events |
| KPI dashboard | request timings, cache hit/miss logs, frontend error states |
| Exports | job status stuck in `PROCESSING`, worker failure logs, missing files |
| Monitoring | summary values flatlining unexpectedly, queue-depth anomalies |

## Local vs Production Differences To Remember

- Rate limiting is per-process in this code.
- Cache and worker startup gracefully degrade if Redis is unavailable (`backend/src/server.ts:11-18`).
- E2E tests currently cover frontend shell more than full-stack behavior.
