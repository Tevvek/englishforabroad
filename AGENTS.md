# AGENTS.md

Guidance for autonomous coding agents working in this repository.
This project is an Astro + TypeScript app managed with pnpm.

## Project Snapshot

- Framework: Astro 5
- Languages: TypeScript, Astro, React, Vue
- Package manager: pnpm
- Type checking: `astro check`
- CI currently validates freebies metadata and runs Astro checks

## Environment and Setup

1. Use Node.js 20 (matches CI workflow).
2. Use pnpm 9 (matches CI workflow setup).
3. Install dependencies:

```bash
pnpm install --frozen-lockfile
```

4. Copy envs if needed:

```bash
cp .env.example .env
```

5. Do not commit `.env` or secrets.

## Build and Check Commands

### Core commands

- Start dev server:

```bash
pnpm dev
```

- Build production output (includes type checks):

```bash
pnpm build
```

- Preview production build:

```bash
pnpm preview
```

- Run Astro type/content checks directly:

```bash
pnpm astro check
```

- Validate freebies frontmatter/data:

```bash
pnpm validate:freebies
```

### Linting status

- There is currently **no dedicated lint script** in `package.json`.
- There is no root ESLint/Prettier/Biome config in this repo.
- Treat `pnpm astro check` as the main static-quality gate.
- If asked to add linting, do so in a separate, explicit change.

## Repo Structure (High-level)

- `src/`: app code (pages, components, actions, utils, middleware)
- `db/`: Astro DB schema and seed
- `scripts/`: maintenance/validation scripts
- `.github/workflows/`: CI automation

## TypeScript and Imports

- TS config extends `astro/tsconfigs/strict`; keep code strict-safe.
- Use configured path aliases when appropriate:
  - `@/*` -> `src/*`
  - `@db/*` -> `db/*`
- Prefer `import type` for type-only imports.
- Keep imports grouped in this order:
  1. External packages
  2. Internal alias imports (`@/...`)
  3. Relative imports
- Avoid deep relative traversal when alias paths are available.

## Formatting and Style

- Follow the style already used in the file you touch.
- Do not reformat unrelated code.
- Keep line changes minimal and focused.
- Use clear names over abbreviations.
- Prefer small, single-purpose functions.
- Avoid adding comments unless logic is non-obvious.

## Naming Conventions

- `PascalCase`: components, types, schema objects, classes.
- `camelCase`: functions, variables, helpers.
- `UPPER_SNAKE_CASE`: module-level constants.
- File names:
  - Components: existing local convention (often PascalCase for component files).
  - Utilities/schemas/actions: existing kebab/camel patterns; preserve local style.

## Validation, Types, and Data Contracts

- Prefer schema-first validation with Zod.
- Use `safeParse` for untrusted input paths and return actionable errors.
- Infer types from schemas when possible (`z.infer<typeof Schema>`).
- Avoid `any`; use unions, generics, and narrow unknown values.

## Error Handling and Logging

- In Astro actions, use `ActionError` for structured user-facing failures.
- In API routes, return explicit `Response` with status codes.
- Prefer early returns for validation and failure branches.
- Include contextual logs for server-side failures, but do not leak secrets.
- Reuse helper patterns like `to()` when they improve readability.

## Agent Execution Rules for This Repo

- Before finalizing changes, run the narrowest relevant checks first.
- For broader risk areas, run `pnpm astro check`.
- Do not edit generated/build output directories (`dist/`, `.vercel/`, `.astro/`).
- Do not commit secrets, API keys, or local env files.

## CI Awareness

Current workflow in `.github/workflows/validate-freebies.yml` does:
- `pnpm install --frozen-lockfile`
- `pnpm validate:freebies`
- `pnpm astro check`

Agents should keep these green for related changes.

## Cursor and Copilot Rules

- `.cursorrules`: not present.
- `.cursor/rules/`: not present.
- `.github/copilot-instructions.md`: not present.

If any of the above are added later, treat them as higher-priority, repo-specific
instructions and update this file to reflect their requirements.
