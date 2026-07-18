# Debugging Guide

## KPI Totals Look Wrong

- Confirm the selected `startDate` and `endDate`.
- Check whether the role is hiding fields.
- Verify the cache key matches the current filter set.
- Compare the aggregate endpoint to raw event counts for the same range.

## Chart Missing Data

- Validate the date range first.
- Confirm the seed generated events in the requested period.
- Check whether the backend endpoint returns empty buckets or only populated ones.

## Export Job Failed

- Check BullMQ worker registration.
- Inspect the export job row for `errorMessage`.
- Confirm Redis is available.

## Dashboard Feels Slow

- Inspect the SQL or Prisma query plan.
- Check index coverage on date fields and grouping fields.
- Confirm cache TTL and cache hit rate.

## Role Sees Too Much

- Verify backend permission middleware.
- Verify server-side metric visibility filtering.
- Do not trust frontend navigation hiding as security.
