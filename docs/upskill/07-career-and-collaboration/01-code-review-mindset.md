# Code Review Mindset

Review in layers:

1. Does it work?
2. Is it correct for edge cases and permissions?
3. Will it stay correct?
4. Does it fit this codebase's boundaries?
5. Is it kind to future maintainers?

## Repo-Specific Review Checklist

- Is new business logic in a service, not a controller?
- Are new routes validated with Zod?
- Are role restrictions enforced server-side?
- Are dashboards returning aggregates, not raw rows?
- Are query keys aligned with filter inputs?
- If CSV changed, does sanitization still apply?
- If a background job changed, what is the idempotency story?

## Good Review Comment Examples

> This works for the happy path, but it moves authorization-sensitive filtering into the client. Can we keep the filtering in the service layer and only change the rendered shape in the page?

> I like the direction. One thing I'm missing is a regression test around the role boundary because `applyMetricVisibility` currently drives optional fields for several dashboards.
