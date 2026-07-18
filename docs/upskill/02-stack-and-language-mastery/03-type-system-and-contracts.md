# Type System And Contracts

## Contract Layers In This Repo

| Layer | Example | Purpose |
| --- | --- | --- |
| Environment contract | `backend/src/config/env.ts:5-22` | Prevent invalid startup config |
| Request validation contract | `backend/src/modules/events/events.schemas.ts:43-55` | Reject malformed client input |
| Permission contract | `backend/src/shared/permissions.ts:3-67` | Encode who may do what |
| API response contract | `frontend/src/api/dashboard.api.ts:8-29` | Let pages depend on stable shapes |
| DB schema contract | `backend/prisma/schema.prisma:11-192` | Durable storage structure |

## Unknown vs Any

The repo usually avoids `any`. Where it still uses broad JSON shapes such as `filtersJson` or `layoutJson`, it keeps them typed as `unknown`-ish records and narrows only when needed (`backend/src/modules/exports/exports.schemas.ts:3-10`, `backend/src/modules/dashboardConfigs/dashboardConfigs.schemas.ts:3-43`).

## Drill

Choose one of these and explain what could break if it drifted:

- Role enum between backend and frontend
- Export status values between DB and UI
- KPI response fields between service and card component
