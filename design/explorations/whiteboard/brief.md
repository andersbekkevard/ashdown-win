# Whiteboard

The site looks like a grad student explained the ladder on the common-room
whiteboard and nobody wiped it. Black dry-erase lettering on an off-white
board; blue, red and green marker used sparingly, each with one job: blue for
structure and links, red for the thing you must notice (the URL, the winner),
green for the table and for gains. Every box is drawn by hand: double-stroked
wobbly rectangles with overshooting corners, generated at runtime by a short
rough-rectangle function so no two boxes match. Emphasis is a hachure fill or
a wobbly underline, never a shadow. Cards sit half a degree off level.

Charm never beats clarity. Inputs are drawn boxes but native inputs with
44px tap targets. Body text is a legible handwriting face at 17px or larger.
Leaderboard rows stay level; only the frame wobbles. If the web fonts fail
the page still reads in the system's casual face.

## References

- Rough.js, https://roughjs.com/ . Took the mechanics: two passes per edge
  with small offsets and a bowed midpoint, roughness about 1, hachure fill at
  45 degrees. Reimplemented as inline JS.
- Excalidraw and the Virgil typeface, https://github.com/excalidraw/excalidraw ,
  https://github.com/excalidraw/virgil . Took the defaults: near-black stroke,
  width 2, "artist" sloppiness, colour on one element at a time.
- xkcd, https://en.wikipedia.org/wiki/Xkcd and https://github.com/ipython/xkcd-font .
  Took hand-lettered charts with arrows, black line on white, sparse colour.
- Open Color, https://yeun.github.io/open-color/ . Starting hex values for the
  three inks, then dulled toward dry-erase.
- Patrick Hand and Caveat descriptions in https://github.com/google/fonts .
  Patrick Hand is real handwriting that stays legible at body size.

## Palette

- Board white `#fbfbf8`, marker black `#22262b`
- Blue `#1d5fb4`, red `#c9302c`, green `#2b8a3e`
- Ghost (half-erased residue) `#dfe2e5`, tray aluminium `#b6bbc1`

## Typefaces

- Headlines and numbers: Permanent Marker; fallback "Marker Felt",
  "Chalkboard SE", "Segoe Print", cursive.
- Body and inputs: Patrick Hand at 17-19px; fallback "Comic Sans MS",
  "Chalkboard", "Segoe Print", cursive.
- Annotations: Caveat, rotated a few degrees.

## Why it suits a dorm ladder

The ladder works only if people who have never touched it feel they may. A
polished sports app implies a league with officials; a whiteboard implies
someone in the house set this up last week and you can write your name on it.
The hand-drawn boxes say "unfinished, join in", and the Elo line written in
marker says the maths is short enough to check yourself, which is the site's
trust model.
