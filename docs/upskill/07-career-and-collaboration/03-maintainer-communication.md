# Maintainer Communication

## Ask For Help Without Outsourcing Thinking

Good question shape:

1. What you tried
2. What you observed
3. Your current hypothesis
4. The smallest question you need answered

## Templates

### Asking a question

"While tracing `backend/src/modules/exports/exports.service.ts:124-210`, I noticed retries can re-enter processing. My current hypothesis is that duplicate completion side effects are possible if the same job is processed twice. Am I reading that boundary correctly?"

### Proposing a feature

"I'd like to add export polling in the frontend. The current anchor is `frontend/src/features/exports/pages/ExportCenterPage.tsx:15-35`. I'm planning a short polling window only for `PENDING`/`PROCESSING` rows and would keep invalidation scoped to `[\"exports\"]`."

### Reporting a bug

"Observed: completed export job row exists, but download returns 400. Repro: create export, wait for status `COMPLETED`, click Download. Relevant code seems to be `backend/src/modules/exports/exports.service.ts:88-99` and `145-155`."

### Responding to requested changes

"I updated the PR to move the permission logic back into middleware and added a backend test for the denied case. I left one follow-up note about the remaining UI helper drift."
