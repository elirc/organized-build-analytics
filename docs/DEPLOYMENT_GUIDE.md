# Deployment Guide

## Local

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL and Redis with `docker compose up -d`.
3. Install dependencies.
4. Run Prisma generate, migrate, and seed.
5. Start backend and frontend.

## Production Shape

- Frontend: Vercel
- Backend: Railway, Render, or Fly
- Database: managed PostgreSQL
- Cache/queue: managed Redis

## Production Checklist

- strong JWT secrets
- HTTPS-only deployment
- database backups
- Redis persistence strategy
- rate limiting
- structured logs
- CI typecheck, build, and tests
