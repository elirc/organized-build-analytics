# Feature Walkthroughs

## Track Event Flow

Client or internal producer sends an event payload to `/api/events/track`. The API validates the request, stores a tracked event, and makes that data available for summaries and recent activity views.

## KPI Dashboard Flow

Frontend filter state lives in the URL. TanStack Query keys include the same date range. The backend validates the range, checks visibility, reads or warms Redis cache, computes metrics, and returns card-ready data.

## Chart Data Flow

Charts call dedicated aggregate endpoints like `/api/dashboard/events-over-time`. The response is already bucketed for the chart library, so the frontend just renders.

## Audit Dashboard Flow

Audit routes require audit permissions. Summaries are grouped on the server, while raw records remain paginated and role-limited.

## Monitoring Flow

Monitoring metrics are ingested separately from tracked events, then exposed as time-series and summary endpoints for engineering-facing dashboards.

## Export Flow

The frontend creates an export job. The backend validates permissions, stores the request, queues work, and later exposes status and download behavior through `ExportJob`.
