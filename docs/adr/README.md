# Architecture decision records

ADRs record decisions that would be expensive to reverse: they shape the data
model, the trust model, or the hosting, or they close a door. Smaller choices
live only in the [decision ledger](../decision-ledger.md).

ADRs are append-only. Do not edit a decision into something else; write a new
ADR that supersedes or scopes the old one and update both statuses.

## Format

Filename `NNNN-short-slug.md`. Frontmatter with `type`, `adr`, `status`, and
`date`. Sections in order: Status, Context, Options considered, Decision,
Consequences, Reversal triggers, Related.

Status is one of Proposed, Accepted, Superseded by NNNN, or Scoped by NNNN.

## Index

| ADR | Status | Decision |
|---|---|---|
| [0001](0001-no-accounts-social-pressure.md) | Accepted | No accounts. Anyone can record or delete a match. A public log and social pressure are the only guard. |
| [0002](0002-name-only-identity.md) | Accepted | A player is a name and nothing else. Full name by default, MIT username as the unique fallback. |
| [0003](0003-single-rating-derived-from-log.md) | Accepted | One rating per player, recomputed from the log. Standard Elo, doubles by team average, K 32 and 16, start 1000. |
| [0004](0004-vercel-and-neon.md) | Accepted | Vercel hosting with Neon Postgres, on free tiers. |
| [0005](0005-ashdown-win-house-identity.md) | Accepted | The name is ashdown.win and it belongs to the house, not to table tennis or to a person. |
