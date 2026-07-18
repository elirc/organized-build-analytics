# Writing PRs And RFCs

## PR Description Template

- What changed
- Why it changed
- How it was tested
- Risks
- Screenshots or logs if UI/ops behavior changed
- Follow-ups not included

## Commit Message Advice

- Use an imperative verb
- Mention the subsystem
- Example: `exports: add retry-state integration coverage`

## When To Write An RFC

Write an RFC when you are changing:

- authorization model
- dashboard aggregation strategy
- queue/reliability behavior
- schema shape with migration risk
- frontend state ownership pattern

## RFC Template For This Repo

1. Problem
2. Current behavior with anchors
3. Proposed change
4. Alternatives considered
5. Risks and rollout
6. Test plan
7. Rollback plan
