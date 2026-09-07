# AGENTS.md

Agent map for the ashdown.win repository. Keep this file short. It points;
it does not explain.

## What this is

A public table tennis Elo ladder for Ashdown House, MIT. No accounts, names
only, every rating derived from a public append-only match log. Read
`README.md` first for the product in one page.

## Read before changing

- Product shape and the reasons for it: `docs/architecture.md`
- The rating maths: `docs/algorithm.md`
- Every decision taken so far, small and large: `docs/decision-ledger.md`
- Decisions that are hard to reverse, with options and triggers: `docs/adr/`

## Where things live

- Rating constants (K, start rating, name length): `src/lib/config.ts`. Nothing
  else hard-codes them.
- Rating engine, pure and framework-free: `src/lib/rating.ts`. Tests beside it
  in `src/lib/rating.test.ts` (`pnpm test`).
- Schema, one file, append-only: `src/db/schema.ts`. Lazy Neon client:
  `src/db/index.ts`. Migrations are generated into `drizzle/` with
  `pnpm db:generate` and applied with `pnpm db:migrate`; check them in.
- Reads (leaderboard, search, player page, log): `src/lib/queries.ts`. Every
  read replays the log; nothing caches a rating.
- Writes (create player, record match, delete match, search):
  `src/app/actions.ts`, zod-validated server actions.
- Pages under `src/app/`: `/` leaderboard, `/players/new`, `/matches/new`,
  `/players/[id]`, `/log`, `/algorithm`. Client components in `src/components/`.
- `/algorithm` renders `docs/algorithm.md` at build time via
  `src/lib/algorithm-doc.ts`; edit the doc, not the page.
- Environment: `.env.example`. `next build` must pass with no `DATABASE_URL`.
- Checks: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.

## Conditional pointers

- Changing K, the starting rating, or the doubles rule: read `docs/algorithm.md`
  and ADR 0003 first. Constants live in one config file; the log is recomputed.
- Adding any form of login, identity, or contact field: read ADR 0001 and
  ADR 0002. The no-account model is deliberate and has a reversal trigger.
- Adding a second game such as pool: the domain and repo name were chosen to
  allow this, see ADR 0005. Keep one match log per game.
- Hosting or deployment: ADR 0004. Vercel plus Neon Postgres.
- Any new decision with lasting consequences: append to
  `docs/decision-ledger.md`, and write an ADR if it meets the bar in
  `docs/adr/README.md`.

## Rules

- Nothing in the match log is ever mutated. Deletions are new log entries.
- Docs change in the same commit as the behaviour they describe.
- This repository is public. No personal contact details of residents anywhere
  in the tree.
