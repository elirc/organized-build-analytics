# Backend Tour

## Entry Points

- `src/app.ts`: Express app setup, middleware, and route mounting
- `src/server.ts`: API bootstrap
- `src/worker.ts`: background export worker bootstrap

## Key Folders

- `config/`: runtime env parsing
- `db/`: Prisma client
- `cache/`: Redis helpers and cache-key construction
- `jobs/`: BullMQ processor registration
- `middleware/`: auth, permissions, validation, rate limiting, logging, and errors
- `modules/`: feature modules grouped by domain
- `shared/`: app-wide utilities and error primitives

## Feature Module Shape

Most modules follow this pattern:

- `*.routes.ts`: path registration
- `*.controller.ts`: request/response handling
- `*.service.ts`: business logic
- `*.repository.ts`: database access
- `*.schemas.ts`: Zod validation

## What To Pay Attention To

### Auth

`modules/auth/auth.service.ts` shows access-token issuance, refresh-token rotation, and logout revocation. This is the main lifecycle for session management.

### Dashboard

`modules/dashboard/` contains the most analytics-heavy logic. This is where we decide which work belongs in SQL, which results can be cached, and how role visibility changes the returned payload.

### Exports

`modules/exports/exports.service.ts` is a good production-style example because it combines permission checks, row estimation, synchronous fallback, queue handoff, file storage, audit logging, and failure handling.

### Monitoring

Monitoring is intentionally separate from tracked events. It models system health rather than product usage.

## Advice For Adding Backend Features

- If the feature changes HTTP shape, start with schema and route.
- If the feature changes business rules, start in the service.
- If the feature changes data shape or query efficiency, examine the repository and indexes.
- If the feature affects visibility, update both permissions and result filtering.
