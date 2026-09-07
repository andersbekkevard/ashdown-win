# ashdown.win agent instructions

Public Ashdown House table-tennis Elo ladder: no accounts, names only, with
ratings derived from a public append-only match log. Read `README.md` for
orientation and `docs/architecture.md` for a structural change.

Human commitments for operating or developing this app belong in Google Tasks
`Hub`. Use the installed `anders-environment` skill for current list IDs and
verified writes.

## Boundaries and routes

- Match-log entries are immutable; a deletion is a new event. Rating constants
  have one owner, `src/lib/config.ts`; reads replay the log rather than cache
  ratings. Before changing rating or doubles rules, read `docs/algorithm.md`
  and ADR 0003.
- `/algorithm` renders `docs/algorithm.md` at build time through
  `src/lib/algorithm-doc.ts`. Edit that doc to change the explanation.
- Before adding login, identity or contact fields, read ADRs 0001 and 0002.
  The no-account choice is deliberate. This repository is public: resident
  contact details must stay out of the tree.
- Before adding another game, read ADR 0005; keep one match log per game.
- For deployment, read ADR 0004. Builds must succeed without `DATABASE_URL`.
- For schema changes, use the commands in `package.json`, inspect generated
  migrations under `drizzle/`, and commit them. Preserve append-only semantics.
- For visual design, read `design/explorations/index.html` and its current
  selection state before treating an exploration as the accepted design.

Keep behavior and its docs in the same commit. Record lasting decisions in
`docs/decision-ledger.md`; use `docs/adr/README.md` to decide whether an ADR is
needed. `package.json` owns check commands; run those relevant to the change.
