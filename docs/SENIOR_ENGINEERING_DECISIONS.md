# Senior Engineering Decisions

## Aggregates Over Raw Rows

Dashboard consumers need trusted summaries. Returning raw rows and asking the frontend to compute metrics is slower, leakier, and harder to reason about.

## Separate Tracked Events, Audit Events, and Monitoring Metrics

These records look similar at first, but they serve different audiences and retention rules. Keeping them separate avoids muddy permissions and query patterns.

## Redis for Expensive Reads

Read-heavy KPI and chart endpoints are ideal cache candidates. TTL-based caching is a practical MVP default before full invalidation strategy work.

## Background Exports

Large CSV generation is long-running and failure-prone. Export jobs create a safer user experience and a clearer operational model than synchronous giant downloads.

## URL-Backed Filters

Dashboard filters belong in the URL because analysts share links, revisit views, and compare time ranges.

## Seed Realistic Volume

A dashboard can feel perfect with 30 records and break badly at 10,000. Seeded volume makes query design and UI loading behavior honest early.
