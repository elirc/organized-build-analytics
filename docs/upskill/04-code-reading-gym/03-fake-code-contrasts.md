# Fake Code Contrasts

## Contrast 1: Coupling UI Shape To DB Shape

```ts
// Illustrative fake code: not from this repo.
const rows = await fetch("/api/events");
const chart = groupByDay(rows.items);
```

Better shape:

```ts
// Illustrative fake code: not from this repo.
const chart = await fetch("/api/dashboard/events-over-time");
```

Real pattern: `frontend/src/features/dashboard/pages/OperationsDashboardPage.tsx:55-68`, `backend/src/modules/dashboard/dashboard.repository.ts:38-52`

## Contrast 2: Missing Permission Filter

```ts
// Illustrative fake code: not from this repo.
app.get("/dashboard/kpis", async (_req, res) => {
  res.json(await buildKpis());
});
```

Better shape: route gate plus metric filtering.

Real pattern: `backend/src/modules/dashboard/dashboard.routes.ts:12-21`, `backend/src/shared/permissions.ts:54-67`

## Contrast 3: N+1 Summary Loop

```ts
// Illustrative fake code: not from this repo.
for (const type of eventTypes) {
  counts[type] = await countEvents(type);
}
```

Better shape: grouped SQL query.

Real repo tie-in: current implementation still has a version of this smell in `backend/src/modules/events/events.service.ts:41-52`.

## Contrast 4: Stale Query Key

```ts
// Illustrative fake code: not from this repo.
useQuery({ queryKey: ["events"], queryFn: () => getEvents(startDate, endDate) });
```

Better shape: include all filter inputs.

Real pattern: `frontend/src/features/dashboard/hooks/useEventsOverTime.ts:5-9`

## Contrast 5: Side Effect In Unreliable Place

```ts
// Illustrative fake code: not from this repo.
res.json(await db.insertUser());
await audit("USER_CREATED");
```

Better shape: service owns sequence and failure handling.

Real pattern: `backend/src/modules/auth/auth.service.ts:35-70`

## Contrast 6: Swallowing Errors Without Signal

```ts
// Illustrative fake code: not from this repo.
try {
  await redis.set(key, value);
} catch {}
```

Better shape: fallback is okay, but observability matters.

Real pattern to study critically: `backend/src/cache/cache.service.ts:3-18`

## Contrast 7: Overusing `any`

```ts
// Illustrative fake code: not from this repo.
function renderKpis(data: any) {}
```

Better shape: typed API contract.

Real pattern: `frontend/src/api/dashboard.api.ts:8-29`, `frontend/src/features/dashboard/components/KpiCardGrid.tsx:5-33`

## Contrast 8: Casual Public Contract Change

```ts
// Illustrative fake code: not from this repo.
return { total: totalEvents };
```

Better shape: consider every consumer, tests, and role-specific optionality.

Real pattern: `backend/src/modules/dashboard/kpi.service.ts:54-63` consumed by `frontend/src/features/dashboard/components/KpiCardGrid.tsx:6-24`
