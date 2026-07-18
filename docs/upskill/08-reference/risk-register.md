# Risk Register

| Risk | Evidence | File anchors | Impact | Likelihood | Suggested test | Suggested fix | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Process-local rate limiting | In-memory map keyed by IP | `backend/src/middleware/rateLimit.middleware.ts:7-31` | Medium | High in multi-instance deploys | repeated request integration test | shared limiter | High |
| Event summary scaling | Summary loops and large fetches | `backend/src/modules/events/events.service.ts:38-68` | Medium | Medium | compare large-range timings | grouped SQL | High |
| Audit summary scaling | In-memory grouping | `backend/src/modules/audit/audit.service.ts:52-91` | Medium | Medium | large-range benchmark | grouped SQL | High |
| Queue depth may not match real queue | Derived from DB status counts | `backend/src/modules/monitoring/monitoring.repository.ts:34-47` | Low-Medium | Medium | compare with queue introspection | source-of-truth review | Medium |
| Export idempotency | Completion side effects emitted during processing | `backend/src/modules/exports/exports.service.ts:157-180` | Medium | Medium | duplicate `processJob` test | status guard / idempotency key | Medium |
| Unstable table row identity | `rowIndex` used as key | `frontend/src/components/DataTable.tsx:22-24` | Low | Medium | interactive reorder test | stable key API | High |
