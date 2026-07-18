# Performance Thinking

## Performance Domains In This Repo

- Frontend render and query churn
- Network request count
- Backend aggregation latency
- Database query cost
- Cache hit rate
- Queue throughput
- Bundle size

## Likely Hotspots

- Repeated summary loops in `backend/src/modules/events/events.service.ts:41-52`
- In-memory audit aggregation in `backend/src/modules/audit/audit.service.ts:52-91`
- Large frontend bundle chunks including charts (`npm run build` output showed large chart-related bundles)
- Row-index keyed tables if later made interactive (`frontend/src/components/DataTable.tsx:22-24`)

## Measure First

- Use response timing from structured request logs (`backend/src/middleware/requestLogger.middleware.ts:12-19`)
- Compare cache hit vs miss behavior in dashboard services
- Watch bundle output during frontend build

## Checklist

- Is a chart endpoint returning rows or true aggregates?
- Is async fan-out parallel where safe?
- Are date ranges bounded?
- Are indexes aligned with filters?
- Is cache keyed by role and filter?
