# Upskill Curriculum

This curriculum turns this repository into a training lab for a junior engineer growing toward mid-level ownership and senior judgment. It is for engineers who need both orientation in this specific codebase and transferable engineering taste they can carry into the next repo.

This repository is a full-stack internal analytics platform with a React frontend, an Express API, Prisma/PostgreSQL persistence, Redis-backed caching, and BullMQ-style background processing. The product surface is role-aware dashboards, event logs, audit visibility, monitoring summaries, CSV exports, and dashboard configuration. The frontend is organized around route- and role-shaped pages, while the backend keeps business rules in services and data access in repositories. The interesting engineering work is mostly read-heavy: aggregate queries, visibility boundaries, filterable reports, and export workflows. Seed data exists to make the dashboards feel realistic instead of toy-sized. CI runs typecheck, tests, and builds from the root workspace (`package.json:5-24`, `.github/workflows/ci.yml:8-43`).

## Who This Is For

- Junior engineer new to production-style full-stack work
- Junior engineer who knows some React/TypeScript but needs backend and systems depth
- Mid-level engineer new to this repo who wants a fast architecture map
- Senior engineer doing a focused architecture or risk review

## How To Use It

### One Weekend

1. Read [00-fast-track.md](00-fast-track.md).
2. Read [01-codebase-cartography/01-system-map.md](01-codebase-cartography/01-system-map.md) and [01-codebase-cartography/05-key-flows.md](01-codebase-cartography/05-key-flows.md).
3. Trace one frontend flow and one backend flow yourself.
4. Attempt one ticket from [06-contribution-practice/01-good-first-tickets.md](06-contribution-practice/01-good-first-tickets.md).

### Two Weeks

1. Complete all of `01-codebase-cartography/`.
2. Read the JavaScript/TypeScript and React mental-model docs in `02-stack-and-language-mastery/`.
3. Work through two drills from `04-code-reading-gym/`.
4. Add one small test using [05-quality-engineering/02-writing-tests-here.md](05-quality-engineering/02-writing-tests-here.md).

### Eight Weeks

1. Finish all modules in order.
2. Implement 3-5 junior tickets and 1-2 mid-level tickets.
3. Write one short design note using [07-career-and-collaboration/02-writing-prs-and-rfcs.md](07-career-and-collaboration/02-writing-prs-and-rfcs.md).
4. Use [07-career-and-collaboration/04-interview-prep-from-this-repo.md](07-career-and-collaboration/04-interview-prep-from-this-repo.md) to convert your repo knowledge into interview stories.

### Ongoing Contribution Practice

- Revisit the risk register before large changes.
- Use the pattern catalog when reviewing a PR.
- Pick one debugging scenario or review kata each week.
- Keep a personal log of "what changed my mind?" moments. That is usually where senior judgment forms.

## Learning Tracks

- `01-codebase-cartography/`: where things live and how to navigate
- `02-stack-and-language-mastery/`: JavaScript, TypeScript, React, Node, tooling, and contracts
- `03-architecture-and-patterns/`: boundaries, persistence, authz, async, critique
- `04-code-reading-gym/`: active reading, tracing, review practice
- `05-quality-engineering/`: testing, debugging, performance, security, operations
- `06-contribution-practice/`: realistic tickets and projects
- `07-career-and-collaboration/`: code review, PRs, RFCs, communication, interviews
- `08-reference/`: commands, risks, rubrics, verification

## Recommended Paths

### Brand-New Junior

Start with [00-fast-track.md](00-fast-track.md), then all of `01-codebase-cartography/`, then `02-stack-and-language-mastery/01-language-runtime-model.md`.

### Junior With Basic Stack Familiarity

Start with [01-codebase-cartography/05-key-flows.md](01-codebase-cartography/05-key-flows.md), then `03-architecture-and-patterns/`, then the testing and debugging docs in `05-quality-engineering/`.

### Mid-Level Engineer New To This Repo

Read the system map, key flows, pattern catalog, architecture critique, risk register, and command cheatsheet first.

### Senior Engineer Doing Architecture Review

Start with [03-architecture-and-patterns/06-architecture-critique.md](03-architecture-and-patterns/06-architecture-critique.md), [08-reference/risk-register.md](08-reference/risk-register.md), [01-codebase-cartography/05-key-flows.md](01-codebase-cartography/05-key-flows.md), and the interview-prep doc only if you want to translate repo lessons into teachable narratives.

## Conventions

- File anchors use exact paths and line spans, for example `backend/src/app.ts:20-57`.
- Fake code is always labeled `Illustrative fake code: not from this repo.`
- Drills are active exercises, not optional flavor text.
- Self-grading rubrics define what weak, solid, and strong answers look like.
- Key docs include verification notes so you can separate confirmed behavior from plausible risk.

## Senior Mindset

Junior asks, "How do I make it work?" Mid-level asks, "Is this the right pattern for this codebase, and how do I test it safely?" Senior asks, "What does this commit us to, who pays the cost later, where is the blast radius, and how do we reduce risk before rollout?"
