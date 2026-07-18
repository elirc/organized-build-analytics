# Contributing

## Workflow

1. Create a branch.
2. Keep changes layered by module.
3. Run typecheck and tests before opening a PR.
4. Document notable architectural changes in the docs suite.

## Style

- Keep controllers thin.
- Prefer Zod validation at the edge.
- Add indexes when introducing new read-heavy filters.
- Prefer aggregate endpoints for dashboard widgets.

## Before Merge

- verify permissions
- verify date-range handling
- verify cache behavior
- verify CSV output safety
