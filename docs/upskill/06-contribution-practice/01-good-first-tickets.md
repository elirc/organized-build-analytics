# Good First Tickets

These are intentionally small, useful, and aligned with existing patterns.

## Ticket 1: Make export button label match selected export type
**Difficulty:** Easy
**Estimated time:** 20-40 minutes
**Skills practiced:** React state, UI polish
**Story:** As an internal user, I want the export action label to match what I selected so I do not second-guess the action.
**Why this is a good contribution:** Tiny blast radius, obvious user value, no API changes.
**Acceptance criteria:**
- [ ] Button text changes when `exportType` changes
**Read these anchors first:**
- `frontend/src/features/exports/pages/ExportCenterPage.tsx:14-18` - selected export type state
- `frontend/src/features/exports/pages/ExportCenterPage.tsx:45-57` - current select + button
**Files likely touched:**
- `frontend/src/features/exports/pages/ExportCenterPage.tsx` - button label
**Implementation plan:**
1. Derive a display label from `exportType`
2. Render it in the button text
**What could go wrong:**
- Copy becomes awkward for one of the enum values
**Suggested checks:**
- `npm run test -w frontend`
**Review questions:**
- Is the label stable and clear for all four export types?

## Ticket 2: Add backend integration test for invalid date range on a protected route
**Difficulty:** Easy
**Estimated time:** 45-90 minutes
**Skills practiced:** Supertest, validation boundary testing
**Story:** As a maintainer, I want a regression test proving invalid date ranges are rejected.
**Why this is a good contribution:** Protects a shared rule used across reporting surfaces.
**Acceptance criteria:**
- [ ] Request with `startDate > endDate` returns 400
**Read these anchors first:**
- `backend/src/shared/utils/dates.ts:23-37`
- `backend/src/middleware/validate.middleware.ts:7-26`
**Files likely touched:**
- `backend/tests/integration/*`
**Implementation plan:**
1. Spin up `createApp()`
2. Choose a route that validates a date range
3. Send invalid query params and assert 400 response
**What could go wrong:**
- Test fails because auth is missing rather than because validation fired
**Suggested checks:**
- `npm run test -w backend`
**Review questions:**
- Does the test isolate the date-range failure cleanly?

## Ticket 3: Add unit tests for `parseDurationToMs`
**Difficulty:** Easy
**Estimated time:** 20-45 minutes
**Skills practiced:** Utility testing, failure-path thinking
**Story:** As a maintainer, I want duration parsing covered so auth token expiry behavior is less fragile.
**Why this is a good contribution:** Small, production-relevant, zero UI risk.
**Acceptance criteria:**
- [ ] Valid units parse correctly
- [ ] Invalid formats throw
**Read these anchors first:** `backend/src/shared/utils/duration.ts:1-19`
**Files likely touched:** `backend/tests/unit/*`
**Implementation plan:** Add happy-path and failure-path cases.
**What could go wrong:** Missing the `ms` edge case.
**Suggested checks:** `npm run test -w backend`
**Review questions:** Did you cover every supported suffix?

## Ticket 4: Add frontend test for optional KPI cards
**Difficulty:** Easy
**Estimated time:** 30-60 minutes
**Skills practiced:** React Testing Library, optional-field contracts
**Story:** As a maintainer, I want tests proving that role-filtered KPI responses render safely.
**Why this is a good contribution:** Protects backend/frontend contract edges.
**Acceptance criteria:**
- [ ] Cards for missing optional fields do not render
**Read these anchors first:** `frontend/src/features/dashboard/components/KpiCardGrid.tsx:14-24`, `frontend/src/test/KpiCardGrid.test.tsx:5-24`
**Files likely touched:** `frontend/src/test/KpiCardGrid.test.tsx`
**Implementation plan:** Render data without optional metrics and assert absent labels.
**What could go wrong:** Tests accidentally depend on unrelated formatting.
**Suggested checks:** `npm run test -w frontend`
**Review questions:** Is the test really protecting role-conditional rendering?

## Ticket 5: Add empty state to recent audit events table
**Difficulty:** Easy
**Estimated time:** 30-60 minutes
**Skills practiced:** UX states, component composition
**Story:** As an audit user, I want a clear empty state when no events match my filters.
**Why this is a good contribution:** Internal tools still need clarity, especially for filtered result sets.
**Acceptance criteria:**
- [ ] Empty result shows a deliberate message instead of a blank table
**Read these anchors first:** `frontend/src/features/audit/pages/AuditDashboardPage.tsx:64-85`
**Files likely touched:** `frontend/src/features/audit/pages/AuditDashboardPage.tsx`
**Implementation plan:** Branch on empty `items.length`.
**What could go wrong:** Empty state appears during loading instead of after success.
**Suggested checks:** `npm run build`
**Review questions:** Does the empty state distinguish "no data" from "still loading"?

## Ticket 6: Add unit tests for `getPagination`
**Difficulty:** Easy
**Estimated time:** 20-40 minutes
**Skills practiced:** boundary and default testing
**Story:** As a maintainer, I want pagination defaults locked down.
**Why this is a good contribution:** Shared helper; easy regression value.
**Acceptance criteria:**
- [ ] Defaults, min clamp, and max clamp are covered
**Read these anchors first:** `backend/src/shared/utils/pagination.ts:1-6`
**Files likely touched:** `backend/tests/unit/*`
**Implementation plan:** Assert default page/pageSize and clamping.
**What could go wrong:** Missing pageSize cap behavior.
**Suggested checks:** `npm run test -w backend`
**Review questions:** Do the tests reflect how the helper is actually used in repositories?

## Ticket 7: Add integration test for unauthorized export lookup
**Difficulty:** Medium
**Estimated time:** 1-2 hours
**Skills practiced:** authz, per-user resource checks
**Story:** As a maintainer, I want proof that one user cannot fetch another user's export job.
**Why this is a good contribution:** Directly protects an IDOR-style boundary.
**Acceptance criteria:**
- [ ] Requesting another user's export job returns 404
**Read these anchors first:** `backend/src/modules/exports/exports.service.ts:78-99`
**Files likely touched:** `backend/tests/integration/*`
**Implementation plan:** Create two users/jobs or fixture equivalents and assert user scoping.
**What could go wrong:** Test leaks implementation details of auth fixture setup.
**Suggested checks:** `npm run test -w backend`
**Review questions:** Does the test prove ownership enforcement rather than just missing data?

## Ticket 8: Preserve date filters when changing event type
**Difficulty:** Easy
**Estimated time:** 30-60 minutes
**Skills practiced:** URL state
**Story:** As an ops user, I want filter changes to compose instead of resetting each other.
**Why this is a good contribution:** Reinforces a core frontend pattern.
**Acceptance criteria:**
- [ ] Changing event type keeps current date range in the URL
**Read these anchors first:** `frontend/src/features/dashboard/hooks/useDashboardFilters.ts:20-31`, `frontend/src/features/events/pages/EventLogPage.tsx:34-35`
**Files likely touched:** frontend event filter components or tests
**Implementation plan:** Verify current behavior, then fix if drift exists.
**What could go wrong:** Misdiagnosing a bug that already does the right thing.
**Suggested checks:** `npm run test:e2e -w frontend`
**Review questions:** Did you confirm a real issue before changing code?

## Ticket 9: Add unit tests for `applyMetricVisibility`
**Difficulty:** Easy
**Estimated time:** 30-60 minutes
**Skills practiced:** policy testing
**Story:** As a maintainer, I want role-specific KPI visibility rules locked down.
**Why this is a good contribution:** Protects a backend security boundary.
**Acceptance criteria:**
- [ ] At least three roles are covered
- [ ] Hidden keys are asserted absent
**Read these anchors first:** `backend/src/shared/permissions.ts:54-67`
**Files likely touched:** `backend/tests/unit/*`
**Implementation plan:** Feed in a complete metric object and assert filtered outputs.
**What could go wrong:** Only testing one role or asserting too many implementation details.
**Suggested checks:** `npm run test -w backend`
**Review questions:** Does the test document policy clearly enough for future reviewers?

## Ticket 10: Assert request ID on a simple integration response
**Difficulty:** Easy
**Estimated time:** 20-40 minutes
**Skills practiced:** middleware testing
**Story:** As a maintainer, I want proof that request IDs are attached to responses.
**Why this is a good contribution:** Strengthens observability guarantees.
**Acceptance criteria:**
- [ ] Test verifies `x-request-id` header exists
**Read these anchors first:** `backend/src/middleware/requestLogger.middleware.ts:9-19`, `backend/tests/integration/health.test.ts:5-12`
**Files likely touched:** `backend/tests/integration/health.test.ts`
**Implementation plan:** Extend the health test with a header assertion.
**What could go wrong:** Asserting a specific UUID value instead of existence.
**Suggested checks:** `npm run test -w backend`
**Review questions:** Is the assertion resilient?

## Ticket 11: Replace `rowIndex` key in `DataTable`
**Difficulty:** Medium
**Estimated time:** 1-2 hours
**Skills practiced:** React identity, generic component APIs
**Story:** As a maintainer, I want stable row identity so table rendering is safer under updates and sorting.
**Why this is a good contribution:** Real maintainability improvement, visible architectural learning.
**Acceptance criteria:**
- [ ] `DataTable` supports a stable row key strategy
- [ ] Existing usage still compiles
**Read these anchors first:** `frontend/src/components/DataTable.tsx:22-24`
**Files likely touched:** `frontend/src/components/DataTable.tsx`, maybe several callers
**Implementation plan:**
1. Decide between `getRowKey` prop or conventional `id`
2. Update representative callers
3. Add a focused test if practical
**What could go wrong:** Over-generalizing the abstraction
**Suggested checks:** `npm run typecheck`, `npm run build`
**Review questions:** Is the new API simple enough for the current codebase?

## Ticket 12: Add login button loading-state test
**Difficulty:** Easy
**Estimated time:** 30-60 minutes
**Skills practiced:** async UI testing
**Story:** As a maintainer, I want the login form's pending state covered so UX regressions are caught.
**Why this is a good contribution:** Small but teaches mutation-state testing.
**Acceptance criteria:**
- [ ] Pending button label is asserted during mutation
**Read these anchors first:** `frontend/src/auth/LoginPage.tsx:33-42`, `69-70`
**Files likely touched:** frontend auth tests
**Implementation plan:** Mock mutation dependency and assert pending label.
**What could go wrong:** Tight coupling to implementation details.
**Suggested checks:** `npm run test -w frontend`
**Review questions:** Does the test still read clearly if the mutation library changes later?

## Ticket 13: Add direct tests for all dangerous CSV prefixes
**Difficulty:** Easy
**Estimated time:** 15-30 minutes
**Skills practiced:** security regression testing
**Story:** As a maintainer, I want all spreadsheet-injection prefixes tested explicitly.
**Why this is a good contribution:** Security hardening with tiny scope.
**Acceptance criteria:**
- [ ] `=`, `+`, `-`, and `@` are each covered
**Read these anchors first:** `backend/src/shared/utils/csv.ts:1-12`, `backend/tests/unit/csv.test.ts:3-18`
**Files likely touched:** `backend/tests/unit/csv.test.ts`
**Implementation plan:** Add missing cases.
**What could go wrong:** Forgetting null/undefined behavior still matters.
**Suggested checks:** `npm run test -w backend`
**Review questions:** Does the test explain why these prefixes matter?

## Ticket 14: Add docs note about queue-depth approximation
**Difficulty:** Easy
**Estimated time:** 15-30 minutes
**Skills practiced:** architectural communication
**Story:** As a new engineer, I want to know queue depth is derived from DB statuses, not BullMQ introspection.
**Why this is a good contribution:** Pure clarity, no code risk.
**Acceptance criteria:**
- [ ] Relevant doc explicitly names the approximation
**Read these anchors first:** `backend/src/modules/monitoring/monitoring.repository.ts:34-47`
**Files likely touched:** monitoring or architecture docs
**Implementation plan:** Add one precise paragraph and anchor.
**What could go wrong:** Wording certainty too strongly without context.
**Suggested checks:** manual doc review
**Review questions:** Is the note clearly labeled as current behavior, not a flaw by default?

## Ticket 15: Add denied-case integration coverage for audit routes
**Difficulty:** Medium
**Estimated time:** 1-2 hours
**Skills practiced:** permission testing, route-level security
**Story:** As a maintainer, I want tests proving non-audit roles cannot access audit endpoints.
**Why this is a good contribution:** Security-sensitive, realistic, bounded.
**Acceptance criteria:**
- [ ] At least one disallowed role gets 403 on an audit route
**Read these anchors first:** `backend/src/modules/audit/audit.routes.ts:11-15`, `backend/src/middleware/requirePermission.middleware.ts:7-18`
**Files likely touched:** `backend/tests/integration/*`
**Implementation plan:** Build an authenticated non-audit role request and assert denial.
**What could go wrong:** Test setup complexity hides the core assertion.
**Suggested checks:** `npm run test -w backend`
**Review questions:** Does the test prove the permission matrix, not just missing auth?

## Suggested Checks For All Tickets

- `npm run typecheck`
- `npm run test`
- If frontend UI changed: `npm run build`

## Maintainer Rejection Triggers

- Unnecessary drive-by refactors
- Moving logic into controllers or pages when the repo already has a better boundary
- No tests around behavior-sensitive changes
- Quiet contract changes without updating callers
