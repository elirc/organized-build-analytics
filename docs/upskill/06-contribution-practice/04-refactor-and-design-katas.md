# Refactor And Design Katas

## Kata 1: Identify a boundary leak
- Candidate: `backend/src/modules/auth/auth.controller.ts:16-29`
- Task: argue whether the inline 401 branch belongs here.
- Self-grade: strong answer references the existing middleware boundary.

## Kata 2: Propose an outbox-style export-eventing design
- Candidate: `backend/src/modules/exports/exports.service.ts:157-208`
- Task: sketch how to make completion side effects more durable.
- Self-grade: strong answer includes failure and replay semantics.

## Kata 3: Split a large module responsibly
- Candidate: `backend/src/modules/exports/exports.service.ts:20-369`
- Task: propose 2-3 submodules without over-fragmenting.
- Self-grade: strong answer preserves coherent ownership.

## Kata 4: Remove duplicate summary grouping logic
- Candidates: `backend/src/modules/events/events.service.ts:55-68`, `backend/src/modules/audit/audit.service.ts:79-91`
- Task: design a shared abstraction only if it helps.
- Self-grade: strong answer avoids premature abstraction.

## Kata 5: Improve type safety for dashboard layout JSON
- Candidate: `backend/src/modules/dashboardConfigs/dashboardConfigs.schemas.ts:3-43`
- Task: propose a stronger layout contract.
- Self-grade: strong answer balances safety with evolution cost.

## Kata 6: Design a DB-backed invariant for default dashboard configs
- Candidate: `backend/src/modules/dashboardConfigs/dashboardConfigs.service.ts:51-66`
- Task: compare transaction-only enforcement vs DB constraints.
- Self-grade: strong answer includes migration steps.

## Kata 7: Reduce event summary query cost
- Candidate: `backend/src/modules/events/events.service.ts:41-52`
- Task: replace repeated counting with grouped SQL.
- Self-grade: strong answer includes parity test strategy.

## Kata 8: Write a mini-RFC for queue-depth truth
- Candidate: `backend/src/modules/monitoring/monitoring.repository.ts:34-47`
- Task: decide whether DB job statuses are sufficient.
- Self-grade: strong answer separates operator need from implementation convenience.
