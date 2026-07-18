# Command Cheatsheet

| Command | Status | Why |
| --- | --- | --- |
| `npm install` | Inferred | Install workspace deps |
| `npm run db:generate` | Inferred | Generate Prisma client |
| `npm run db:migrate` | Inferred | Run Prisma migrations |
| `npm run db:seed` | Inferred | Seed realistic demo data |
| `npm run dev` | Inferred | Start backend + frontend |
| `npm run typecheck` | Verified | Full repo typecheck |
| `npm run test` | Verified | Backend + frontend tests |
| `npm run build` | Verified | Backend compile + frontend bundle |
| `npm run test:e2e -w frontend` | Verified | Playwright UI smoke |
| `docker compose up -d` | Inferred | Start Postgres + Redis |
| `npm run dev -w backend` | Inferred | Backend dev server |
| `npm run dev:worker -w backend` | Inferred | Export worker in watch mode |
| `npm run dev -w frontend` | Inferred | Frontend dev server |
