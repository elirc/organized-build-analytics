# Tooling And Build System

## Commands That Matter

- Root workspace orchestration: `package.json:9-20`
- Backend build/test scripts: `backend/package.json:9-20`
- Frontend build/test scripts: `frontend/package.json:6-13`

## Build Mental Model

1. TypeScript compiles backend into `backend/dist` (`backend/package.json:12-15`, `backend/tsconfig.json:3-17`).
2. Vite bundles the frontend (`frontend/package.json:7-13`, `frontend/vite.config.ts:5-10`).
3. Prisma client generation is a separate explicit step (`backend/package.json:18-20`).

## CI Mental Model

CI does not run a full live stack. It installs dependencies, generates Prisma client with env vars, then runs typecheck, tests, and build (`.github/workflows/ci.yml:22-43`).

## Drill

If a PR changes only frontend styles, which commands should still run before merge, and why?
