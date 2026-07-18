# First PR Guide

## Safe First Changes

- add a new KPI card sourced from an existing endpoint
- improve a dashboard empty state
- add one backend validation rule
- add one unit test around a helper
- add one audit record to an existing admin flow

## Workflow

1. Read the relevant doc for the area you are touching.
2. Trace the current path end to end.
3. Make the smallest coherent change that still proves the pattern.
4. Add or adjust tests.
5. Run typecheck, tests, and build.

## Review Mindset

Reviewers will care about:

- correctness
- permission safety
- query shape
- maintainability
- whether the result teaches the next person something clear
