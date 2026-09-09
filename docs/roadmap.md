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

Also done, 2026-09-10: the live indicator pill in the top bar, the Chat chip
to the WhatsApp group, How it works in the lead sentence, the instant player
picker, and the second-edition poster with the group QR.

- A success moment after recording a match: the mock's tilted "Recorded"
  banner with confetti and the two rating deltas. The app currently returns
  to the board without ceremony.
- Remember who I am on this phone and prefill me as one side of the match.
- "Rematch" on a player page and in the log that prefills both names, and
  "record another" after a match that keeps the players.
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
