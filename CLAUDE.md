# GovernanceHub

## Overview

GovernanceHub is a multi-tenant incident and operational risk management SaaS application.

## Tech Stack

- React + TypeScript frontend
- Express + TypeScript backend
- PostgreSQL database
- Docker Compose for local development

## Core Rules

- All tenant-owned tables must include tenant_id
- Never trust tenant_id from frontend input
- Backend derives tenant_id from authenticated JWT
- Use PostgreSQL parameterized queries
- Use TypeScript throughout
- Use async/await
- Keep code simple and readable

## React + TypeScript Frontend Rules

- Do not explicitly use `JSX.Element` return types for React function components.
- Prefer inferred component return types:
  - use `function Component() {`
  - not `function Component(): JSX.Element {`
- Use `import type` for type-only imports.
- Keep all imports at the top of the file.
- When adding routing, make `/login` the unauthenticated entry page.
- Do not assume `user` exists unless it has been loaded from localStorage or state.
- Protected pages must redirect to `/login` when no token exists.
- API request helpers go in `src/api`
- Route/page components go in `src/pages`
- Keep `App.tsx` and `main.tsx` in `src/`
- Frontend API helpers must match the exact backend JSON response shape.
- Before implementing frontend fetch logic, inspect the actual backend response structure.

## AI Workflow

Claude Code should operate in plan-first mode.

Before major implementation:
1. Explain plan
2. Identify affected files
3. Identify security concerns
4. Then implement

All AI-generated code must be reviewed carefully.

Watch especially for:
- tenant isolation bugs
- missing validation
- inconsistent error handling
- unsafe SQL