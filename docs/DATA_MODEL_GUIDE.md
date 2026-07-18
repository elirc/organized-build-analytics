# Data Model Guide

## Three Important Event Streams

### TrackedEvent

Use for product and operations analytics.

Examples:

- user signed up
- login happened
- API error occurred
- CSV export completed

### AuditEvent

Use for compliance, security, and admin accountability.

Examples:

- role changed
- export requested
- dashboard config changed

### MonitoringMetric

Use for technical health time-series data.

Examples:

- API latency
- error rate
- DB query time
- cache hit rate

## Why They Are Separate

A new engineer often asks why these are not one giant event table. The short answer is that they serve different readers, retention rules, and permissions. Merging them would make querying and access control more confusing.

## ExportJob

This table tracks the lifecycle of long-running or download-oriented work. It lets us separate user intent from background completion.

## DashboardConfig

This holds role-oriented layout metadata. Treat it as product configuration, not business facts.
