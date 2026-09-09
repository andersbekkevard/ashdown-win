# Roadmap

Where ashdown.win could go, and how each step fits the design. This is a
planning document; live behaviour is described in `architecture.md`, and the
reason each shape is safe is ADR 0006. Order within a group is rough priority.

## The principle

The match log is append-only and every rating is recomputed from it. Every
feature below is either a new kind of log entry or a new table beside the
log. None rewrites existing rows. That is what makes growth safe: the worst
migration is an added column, and the worst feature is one nobody uses.

## Before the poster goes up

Done on 2026-09-09: name normalisation, delete confirmation with restore,
anonymous device labels, error handling that keeps form input, creating an
opponent from inside the match form, and log backups.

- The live activity indicator in the top bar, borrowed from recording-status
  grammar, linking to the log. In design.
- A WhatsApp group link as a chip in the top bar and on the page after
  creating a player. Waiting on the invite link.
- A short "what's new" strip, keyed by a version number and dismissed per
  device, so features can be announced without accounts.

## After about thirty active players

- Contacts and verification. A `contacts` table keyed by player with kind,
  value, and verified time. A one-time link by email or WhatsApp sets a token
  on that phone; the phone stays verified. First use: a verified badge. Second
  use, if abuse appears: recording only from verified phones.
- Duplicate players. A `merges` log entry that maps one player id onto another
  during replay, so history stays reproducible and nothing is deleted.
- Head-to-head pages, streaks, and a weekly summary posted to the group.
- Soft rate limiting per device label if flooding actually happens.

## Later, if wanted

- Finality: a match older than about seven days can no longer be deleted or
  restored by anyone. One check in the two actions. Stops quiet voiding of
  old losses. Not yet wanted; revisit if old-match deletions appear in the log.
- Proof of work on player creation, a half-second hash puzzle in the browser,
  if scripted flooding ever happens. Invisible to a person, no sign-in.
- Signing keys per device instead of the cookie label, so attribution is
  verifiable in a dispute. Deferred: keys vanish when storage is cleared.

- A second game such as pool: a `game` column on matches with a default of
  table tennis, replay grouped by game, one toggle at the top, same names.
- Seasons: a `seasons` table; the board shows the current season, history
  keeps every match.
- Brackets for a house tournament, as a separate table that references
  matches.
- A second house on the same code: a `venue` column, one deployment.

## Not planned

- Hash-chained log, a published head hash, and a verifier script. These
  protect against the operator, and residents know the operator. Considered
  2026-09-09 and dropped.

- Accounts or passwords. Verification of a phone is enough.
- Score lines per match. A margin-of-victory rating is not worth the extra
  field at the table.
- Rating decay or a variable K. The rule stays explainable in one line.
