# File Reading Order

## Junior Path

| File | Why it matters | Look for | Do not get distracted by |
| --- | --- | --- | --- |
| `README.md:1-63` | Repo identity | Product scope, quick start | Marketing-style wording |
| `package.json:5-24` | Workspace commands | How the repo is operated | Minor version noise |
| `frontend/src/main.tsx:1-10` | React bootstrap | Entry to the browser app | StrictMode details for now |
| `frontend/src/App.tsx:1-12` | App composition | Router + providers | Minimal wrapper code |
| `frontend/src/app/router.tsx:25-66` | Route ownership | Which pages exist, role gates | The `lazy` syntax |
| `frontend/src/auth/LoginPage.tsx:20-76` | First user interaction | Form, mutation, session set | Styling classes |
| `frontend/src/auth/auth.store.ts:21-42` | Client auth state | What Zustand owns | Zustand implementation details beyond `persist` |
| `frontend/src/features/dashboard/hooks/useDashboardFilters.ts:6-35` | Shareable filters | URL state, defaults | `useMemo` optimization trivia |
| `frontend/src/features/dashboard/pages/OperationsDashboardPage.tsx:18-75` | Dashboard composition | Query hooks + loading states | Styling repetition |
| `backend/src/app.ts:20-57` | API entrypoint | Middleware order, mounted routers | Express boilerplate syntax |
| `backend/src/modules/auth/auth.routes.ts:11-15` | Auth surface | Validation + controller mapping | Router import mechanics |
| `backend/src/modules/auth/auth.service.ts:73-161` | Login lifecycle | Password check, tokens, failure events | Token implementation details on first pass |
| `backend/prisma/schema.prisma:11-192` | Domain tables | Main entities and enums | Index syntax edge cases |

## Mid-Level Path

| File | Why it matters | Look for | Do not get distracted by |
| --- | --- | --- | --- |
| `backend/src/middleware/validate.middleware.ts:7-26` | Validation boundary | Where bad input is rejected | Zod error formatting niceties |
| `backend/src/middleware/requirePermission.middleware.ts:7-18` | Authorization boundary | Permission ownership | Express typing quirks |
| `backend/src/shared/permissions.ts:13-67` | Policy encoding | Role matrix, metric filtering | Whether a different matrix might exist someday |
| `backend/src/modules/dashboard/kpi.service.ts:8-67` | Read-heavy service shape | Cache key, fan-out queries, visibility | Micro-optimizing array literals |
| `backend/src/modules/dashboard/dashboard.repository.ts:10-166` | Query strategy | Raw SQL vs Prisma aggregate | SQL formatting style |
| `backend/src/modules/exports/exports.service.ts:20-212` | Cross-layer orchestration | Sync/async branch, audit, tracked events | File naming style |
| `backend/src/jobs/export.processor.ts:9-38` | Background execution | Job lifecycle and logging | BullMQ internals not used here |
| `frontend/src/api/client.ts:5-40` | Frontend transport | Token injection, error decoding | Fetch API trivia |
| `frontend/src/lib/queryClient.ts:3-10` | Query cache defaults | Staleness, retries | TanStack advanced config not used here |
| `frontend/src/features/exports/pages/ExportCenterPage.tsx:11-110` | UI to async workflow | Mutation + invalidation + download | Small presentation details |

## Senior Path

| File | Why it matters | Look for | Do not get distracted by |
| --- | --- | --- | --- |
| `backend/src/middleware/rateLimit.middleware.ts:7-31` | Operational risk | Single-process assumptions | Minor naming |
| `backend/src/cache/cache.service.ts:3-18` | Failure semantics | Cache fallback behavior | Redis client details already hidden |
| `backend/src/modules/events/events.service.ts:38-68` | Performance smell | Summary-by-loading-rows pattern | Event enum repetition |
| `backend/src/modules/audit/audit.service.ts:52-91` | Scalability tradeoff | Similar summary aggregation pattern | Sort implementation |
| `backend/src/modules/monitoring/monitoring.repository.ts:34-47` | Data truth source | Queue depth inferred from DB state | Exact property naming |
| `frontend/src/components/DataTable.tsx:8-39` | UI correctness risk | `rowIndex` key choice | Table styling |
| `.github/workflows/ci.yml:22-43` | Team contract | What CI actually enforces | Missing deployment stages unless you are reviewing CI scope |

## Reading Advice

- Junior: stop when you can say what each layer owns.
- Mid-level: stop when you can predict which files a feature change would touch.
- Senior: stop when you can name two strengths, two risks, and one migration path.
