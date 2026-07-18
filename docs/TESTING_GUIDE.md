# Testing Guide

## Unit Tests

- CSV sanitization
- permission matrix behavior
- date-range validation
- aggregation helpers

## Integration Tests

- health endpoint
- auth flows
- filtered event listing
- dashboard summary behavior
- export job creation

## Frontend Tests

- KPI component rendering
- protected routing
- filter-state behavior
- error and loading states

## E2E Direction

Use Playwright for role-based happy paths:

- Ops manager dashboard and event filtering
- Audit viewer dashboard access and restrictions
- Engineering admin monitoring visibility
