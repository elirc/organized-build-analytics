# Annotation Drills

Use this prompt for each excerpt:

- Inputs
- Outputs
- Dependencies
- Invariants
- Side effects
- Failure modes

## Drill 1

Excerpt: `backend/src/middleware/auth.middleware.ts:5-25`

Focus: auth parsing vs authorization

## Drill 2

Excerpt: `backend/src/modules/auth/auth.service.ts:73-106`

Focus: failed login path and success path divergence

## Drill 3

Excerpt: `backend/src/modules/auth/auth.service.ts:121-146`

Focus: refresh-token rotation invariant

## Drill 4

Excerpt: `backend/src/modules/dashboard/kpi.service.ts:15-66`

Focus: cache-aside flow and role visibility

## Drill 5

Excerpt: `backend/src/modules/dashboard/dashboard.repository.ts:38-52`

Focus: time-bucket query and returned shape

## Drill 6

Excerpt: `backend/src/modules/exports/exports.service.ts:45-72`

Focus: sync vs queue decision

## Drill 7

Excerpt: `frontend/src/features/dashboard/hooks/useDashboardFilters.ts:6-35`

Focus: URL state ownership

## Drill 8

Excerpt: `frontend/src/features/dashboard/pages/EngineeringDashboardPage.tsx:16-40`

Focus: server-state query orchestration

## Drill 9

Excerpt: `frontend/src/components/DataTable.tsx:8-39`

Focus: generic UI abstraction and key stability risk

## Self-Grading Rubric

- Basic: names inputs/outputs and can paraphrase the code.
- Solid: names the owning layer, one invariant, and one likely bug class.
- Strong: names the blast radius of a bad change and the first regression test to add.
