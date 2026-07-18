# Onboarding Guide

## Who This Is For

This guide is for an engineer who is comfortable reading TypeScript and React, but is still building instincts around full-stack production structure. If that sounds like you, this codebase is intentionally organized to teach while it runs.

## Big Picture First

This system is an internal analytics platform. It answers questions like:

- What happened in the product and operations flow?
- What admin or compliance-sensitive actions happened?
- How healthy is the system?
- What summaries should each role be allowed to see?
- When does a synchronous action become a background job?

The most important idea is that this is a read-heavy system. Most of the interesting engineering is about shaping data safely, quickly, and clearly for dashboards.

## How To Read The Codebase

1. Start with [README.md](../README.md) for setup and scope.
2. Read [ARCHITECTURE.md](ARCHITECTURE.md) for the system map.
3. Read [DATA_MODEL_GUIDE.md](DATA_MODEL_GUIDE.md) to understand the domain tables.
4. Tour [BACKEND_TOUR.md](BACKEND_TOUR.md) and [FRONTEND_TOUR.md](FRONTEND_TOUR.md).
5. Run the app and click through each role-facing page.
6. Follow one feature end to end, such as exports or KPI summary.

## Mental Model

Think in layers:

- Routes define the URL surface.
- Controllers translate HTTP to app calls.
- Services enforce business rules and orchestration.
- Repositories talk to Prisma and SQL.
- Shared utilities hold reusable mechanics.

On the frontend:

- Router decides what page loads.
- TanStack Query owns server state.
- Zustand owns auth and UI-only state.
- Pages compose reusable cards, charts, and tables.

## Good First Exercises

- Change the KPI summary card order for one dashboard role.
- Add one new metric to the monitoring summary.
- Add one new field to an export.
- Create a new audit action and trace it through the UI.

## Common New-Engineer Traps

- Adding logic to controllers instead of services
- Trusting frontend hiding as security
- Fetching raw rows for charts instead of calling aggregate endpoints
- Forgetting date-range validation on new reporting endpoints
- Returning data shapes that are hard for charts to use directly
