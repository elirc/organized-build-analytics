# Learning Rubrics

## Junior

- Can run the main verified commands
- Can name the major layers and their owners
- Can trace one feature from UI to DB
- Can make a small safe change without moving logic into the wrong layer

## Mid-Level

- Can design a cross-layer change with a test plan
- Can identify permission, validation, and data-shape boundaries
- Can debug by narrowing layers instead of guessing randomly
- Can review a PR for correctness and maintainability

## Senior

- Can identify invariants and hidden coupling
- Can critique architecture with tradeoffs, not just preferences
- Can propose migrations and rollout/rollback plans
- Can teach the codebase to others and raise the team's quality bar

## Self-Assessment Checklist

- Can I name where authorization actually happens?
- Can I say which queries should become SQL-first if scale grows?
- Can I explain why the export workflow needs both job state and files?
- Can I describe one confirmed risk and one hypothesis without overstating certainty?
