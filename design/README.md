# Design brief for ashdown.win

Read this first before touching the poster or the app's look. It records
Anders' taste and the rules that came out of reviewing nine style explorations
on 2026-09-07. The product itself is described in `../README.md` and
`../docs/architecture.md`; do not reopen product decisions here.

## What the thing is for

A table tennis Elo ladder for Ashdown House, a graduate residence at MIT. The
social effect is the goal and the rating is the means. Everything visual is
judged by one question: does it make someone at the table want to record a
match and look at the board again?

## The chosen style: Fall Guys

Loud, candy-coloured, chunky, playful. Chosen because it is an established
visual grammar people recognise, and because the ladder should feel fun and a
little addictive rather than serious. Source of truth for the language:

- `explorations/fall-guys/brief.md` — palette, type, references, and the
  refinement notes
- `explorations/fall-guys/app.html` — the mobile mock the app was built from
- `../src/app/globals.css` — the same language as implemented in the app

Palette: Bubblegum `#FB3AA3`, Beach Ball blue `#00B5FE`, Banana `#FCC601`,
Crown gold `#FFD046`, Mint `#5EEAC0`, Lilac `#7C7BE8`, Ink `#222126`.
Type: Titan One for display, Fredoka for everything else. Shapes: thick
rounded slabs with a white rim and a hard, unblurred ink shadow; pill buttons
that squash on press; hexagon rank badges; a crown for first place.

## Hard rules

- **Never look official.** Two styles were cut, an MIT-branded one and a
  Bloomberg terminal, specifically because they could be mistaken for an
  institutional product. No MIT logo, no MIT colours as the primary palette,
  nothing that reads as building management. The "official notice" style was
  also judged bad.
- **Mobile first.** Reviewed on an iPhone. Desktop only has to be acceptable.
- **Primary actions live in a bottom dock,** within thumb reach. No tab bar,
  no floating plus button. Found in review and confirmed by the research in
  `research/mobile-patterns.md`.
- **Home is only the leaderboard.** Two actions in the dock, the board, and
  nothing below it. The "How?" and "Log" chips in the top bar cover the rest.
- **Doubles entry is a round-knob pill switch,** or the Playtomic seat model
  with a dashed "add partner" slot per side. Either is acceptable; a tab
  control is not.
- **The rating graph must be intuitive** to someone who has never seen an Elo
  chart: a dashed start line, coloured up and down segments, the current
  rating called out at the end, and a tap tooltip with date, opponent, and
  delta. This was the weak point of the first Fall Guys mock and the reason
  for its refinement pass.
- **History must read at a glance,** the way Lichess does it: singles versus
  doubles and win versus loss visible without reading text.
- **Formulas are typeset,** LaTeX-style with real fractions and superscripts.
  On the poster this is done with KaTeX and embedded fonts; on the site the
  algorithm page renders `../docs/algorithm.md` through KaTeX.

## What was liked in styles that were not chosen

- Lichess: the light and dark toggle, the interactive graph, and how easy
  the match history was to read. Bring those qualities, not the look.
- One word: the cleanliness, and a QR code that sits inside the visual
  language rather than pasted on.
- Irish pub ladder: easy to read, with a physical, tactile language.

## The poster

One poster, used everywhere, at the table and around the house. It must
explain the system and sell it. Fixed contents: a headline, one or two
sentences on what it is, three steps, the Elo rule typeset, the URL very
large, a real QR code to https://ashdown.win, one phone frame showing the
leaderboard with the mock names from `explorations/data.json`, and the
open-source line at the foot. Print source and PDF: `poster/`. A4 portrait,
exactly one page, background graphics on.

## Current top bar and indicator

Logo, a white indicator pill (dot plus time since the last match, cooling
through the day on the curves in `src/lib/activity.ts`), and a green Chat
chip to the WhatsApp group with the logo's rim-and-shadow treatment tilted
the other way. How it works is a link at the end of the home lead. The
explorations that led here are `explorations/live-indicator/`,
`explorations/affordances/`, `explorations/continuity/`, and
`explorations/topbar/`; `live-indicator.md` records the decisions.

## Celebrations

Match recording and player creation share an immediate, centered temporary
animation. Research, timings and the development replay page are documented
in [research/celebration-motion.md](research/celebration-motion.md).

## Open items

- The graph's date axis only becomes meaningful once real matches span days.
- Desktop layout is a centred phone column and nothing more.
- Swap the poster's drawn phone frame for a real screenshot once the live
  board has enough players.

## Files

| Path | What |
|---|---|
| `explorations/` | Nine styles, each with brief, poster, and app mock; `index.html` links them |
| `explorations/data.json` | The shared fake data every mock and the poster use |
| `research/mobile-patterns.md` | 24 apps surveyed for mobile patterns, with recommendations |
| `poster/` | Print-ready Fall Guys posters: `poster.html` (6B, A4), `poster-a3.html`, and `poster-whatsapp.html` (second edition with the WhatsApp group QR as a pop-up), each with a PDF |
| `brand/` | The crown mark: `icon.svg` source, PNG sizes, and the WhatsApp group image |
