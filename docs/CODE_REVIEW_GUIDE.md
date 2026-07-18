# Code Review Guide

## Highest-Risk Areas

- server-side permission enforcement
- date-range validation on analytics endpoints
- aggregate correctness
- CSV injection prevention
- cache key correctness
- raw log pagination and bounds

## Review Questions

- Is business logic in services instead of controllers?
- Does every dashboard endpoint accept and validate date filters?
- Are raw rows being returned where aggregates should be used?
- Are sensitive fields hidden by backend rules, not just frontend UI?
- Are expensive queries cached or intentionally uncached?
