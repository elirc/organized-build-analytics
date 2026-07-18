# Frontend Tour

## Entry Points

- `src/main.tsx`: React bootstrap
- `src/App.tsx`: top-level providers
- `src/app/router.tsx`: route tree and role gates

## Layout

- `layout/AppLayout.tsx`: shared shell
- `layout/Sidebar.tsx`: role-aware navigation
- `layout/Header.tsx`: user identity and logout

## Server State

TanStack Query owns API data fetching. Query keys are intentionally tied to URL filters so cache behavior stays predictable.

## Client State

Zustand is intentionally narrow here:

- auth session
- persisted tokens
- no heavy dashboard data

That division matters. Server state should stay in query cache unless there is a strong reason not to.

## Page Strategy

Each dashboard page is role-shaped:

- operations: KPIs, volume, recent activity
- product: active users, funnel, usage trend
- engineering: health and system metrics
- executive: simple summaries only
- audit: compliance views and actor/action breakdowns

## Advice For Adding Frontend Features

- Start by checking if a page already has a reusable card or chart that fits.
- Prefer one more focused API call over dragging raw records into the browser and reshaping them there.
- Keep filters in the URL when the view is shareable or report-like.
- Use loading and error states intentionally; internal tools still need clarity.
