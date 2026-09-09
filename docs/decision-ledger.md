# Decision ledger

Every decision that shapes the product, in the order taken. Small decisions
live only here. Decisions that are costly to reverse also have an ADR under
[adr/](adr/README.md), linked from the row.

All decisions below were taken on 2026-09-07 in the founding design
conversation, unless a later date is given.

| # | Decision | Reason | Revisit when |
|---|---|---|---|
| 1 | The social effect is the goal; the rating is the means. | The table is popular already. The site should add pull, not process. | Never. This is the purpose. |
| 2 | No accounts, no login. Anyone can create players, record matches, and delete matches. Social pressure is the guard. [ADR 0001](adr/0001-no-accounts-social-pressure.md) | Every login step loses players. The house is small and the log is public. | Visible cheating that social pressure does not correct. |
| 3 | A player is a free-text name. Full name by default, MIT username offered as the unique fallback, then any unique name. No contact details. [ADR 0002](adr/0002-name-only-identity.md) | Lowest friction that still gives a person one stable identity in the log. | People ask for a way to reach each other for matches. |
| 4 | Contact info, messaging, and "find a match" features are out of scope for version one. | The table is the meeting place. Adding contact info costs sign-up friction before the ladder has proven itself. | Around thirty active players, if anyone asks. |
| 5 | A match record is winner and loser only. No game or point score. | One fewer field per match. Scores can be added later without touching existing entries. | A margin-of-victory rating is wanted. |
| 6 | One rating per player, moved by both singles and doubles. Doubles uses the team-average rule. [ADR 0003](adr/0003-single-rating-derived-from-log.md) | One leaderboard keeps attention in one place. Team average is the standard amateur convention. | A separate doubles ladder is wanted by players. |
| 7 | Constants: singles K 32, doubles K 16, start 1000. Fixed K, no provisional period. [ADR 0003](adr/0003-single-rating-derived-from-log.md) | Common club values. Explainable in one line. | Ratings of long-standing players swing too much on single results. |
| 8 | Ratings are never stored; they are recomputed from the log with the current constants. [ADR 0003](adr/0003-single-rating-derived-from-log.md) | Makes constant changes, deletions, and audit free. | Replay becomes slow, which is years away. |
| 9 | Deleting a match is an append-only log entry, visible like any match. | Consistent with the trust model. Nothing is hidden. | Never. |
| 10 | Everyone appears on the leaderboard from creation, including players with no matches. | A new player sees where their first match will send them. | Never, unless the board becomes unreadable. |
| 11 | Home screen is exactly three things: Create player, Record match, leaderboard. | Anything more dilutes the one action that matters. | Never for version one. |
| 12 | A name that matches nobody offers a "create this player" option; it does not create silently. | Creating a player should be a deliberate act so names are owned. | Never. |
| 13 | Match search matches any substring, case-insensitively, with a "did you mean" nudge. | Prevents accidental duplicate players. | Duplicates still appear. |
| 14 | An algorithm page written as a short paper, linked from a small button. | The residents are graduate students who will want to check the maths. | Never. |
| 15 | The repository is public under the MIT licence and linked from the poster. | Transparency of the algorithm and a path for residents to contribute. | Never. |
| 16 | Hosted on Vercel with Neon Postgres, free tiers. [ADR 0004](adr/0004-vercel-and-neon.md) | Zero cost, git-push deploys, custom domain in minutes. | Free tiers change or the site outgrows them. |
| 17 | Domain ashdown.win, repository ashdown-win. Name belongs to the house, not the sport. [ADR 0005](adr/0005-ashdown-win-house-identity.md) | Cheapest sensible domain found. Leaves room for pool. | Never. |
| 18 | Mobile first, works on desktop. | Matches are recorded standing at the table. | Never. |
| 19 | Pool or other game ladders are possible later, one match log per game. | The domain and repo name were chosen to allow it. | When table tennis has proven the pattern. |
| 20 | A "who is at the table now" indicator is out of scope. | Needs presence, which needs identity. | After the social layer, if ever. |
| 21 | Doubles entry may use either a pill toggle or the Playtomic seat model (a dashed "add partner" slot per side, no mode switch). Decided 2026-09-07 after the mobile-pattern research in `design/research/mobile-patterns.md`. | The seat model removes a mode switch; the toggle was liked in mockups. Both acceptable until a style is chosen. | A style is chosen. |
| 22 | Primary actions sit in a bottom bar on mobile. No tab bar, no floating plus button. | Found in mockup review and confirmed by the research. | Never for version one. |
| 23 | Visual style chosen: Fall Guys. Decided 2026-09-07 after reviewing nine explorations and three refinement passes. | Established, fun, playful, and the leaderboard reads instantly; matches the goal of making play addictive. | Never for version one. |
| 24 | One promo poster used everywhere, always with the QR code, with a single phone frame showing the leaderboard with mock names. Print source in `design/poster/`. | One artefact is simpler to print and reuse; the QR is the conversion; a phone frame explains the product faster than text. | The board has enough real players that real names would sell better. |
| 25 | Names are normalised (NFKC, invisible characters stripped, whitespace collapsed) before storage and comparison. Decided 2026-09-09. | Look-alike names would defeat the public log. | Never. |
| 26 | Deleting asks for a confirming tap, is attributed by an anonymous device label, and can be undone by a restore entry. Decided 2026-09-09. [ADR 0006](adr/0006-append-only-log-as-growth-principle.md) | One-tap irreversible deletion was the biggest trust risk in the review. | Never. |
| 27 | Every write stores an anonymous device label, disclosed on the algorithm page. Decided 2026-09-09. | The only abuse signal available without identity. | Verification exists. |
| 28 | Migrations run from Europa after a forced export; the Vercel build migrates only when explicitly allowed; a daily export goes to a private backup repository. Decided 2026-09-09. [ADR 0006](adr/0006-append-only-log-as-growth-principle.md) | The log is the only irreplaceable data. | Never. |
| 29 | Creating an opponent from the match form opens a sheet and keeps the half-filled match. Decided 2026-09-09. | The newcomer flow on poster night must not lose work. | Never. |
| 30 | No game column yet. Decided 2026-09-09. | Additive migrations make it as cheap later. | Pool is wanted. |
| 31 | A WhatsApp group (invite link in `design/poster/poster-whatsapp.html`) is the contact layer. No approval gate. The second-edition poster carries its QR as a pop-up more prominent than the site QR. Decided 2026-09-09. | Zero data collected by the site; one tap on a thing everyone has. | Never. |
| 32 | The brand mark is the crown on a pink disc (`design/brand/icon.svg`), used as favicon, Apple touch icon, and the WhatsApp group image. Decided 2026-09-09. | One mark everywhere. | Never. |
| 33 | Match recording and player creation share a root-level celebration: immediate pending motion, success copy and canvas-confetti only after confirmation, automatic exit, static reduced-motion alternative. Decided 2026-09-09. [Motion notes](../design/research/celebration-motion.md) | Remove navigation latency, keep text centered, and give inline creation the same welcome without losing the match. | Motion review or accessibility evidence calls for adjustment. |
