# LED scoreboard: "Scoreboard in the dark"

## Style language

A stadium scoreboard seen from the stands after the floodlights come on.
Everything sits on a near-black aluminium panel and one light colour, amber,
does all the work. Numbers are seven-segment digits with the unlit segments
faintly visible, as on a real LED board, so every rating reads as a ghosted
"8888" with the live value burning through. Words are 5x7 dot-matrix glyphs
rendered as SVG circles, so the headline and the URL are literally rows of
LEDs. Scoreboard captions (HOME, GUEST, PERIOD, BONUS) become the labels of
the interface: RANK, RATING, SIDE A, SIDE B, DOUBLES. A fine LED dot mask and
scanlines cover every surface. Digits roll from 0000 to their value when a
board appears and flicker when they change. Red and green appear only as
ColorSmart accents on deltas.

## References

- Daktronics BB-2101 basketball scoreboard,
  https://www.daktronics.com/en-us/products/sports/BB-2101. Took: amber
  clock, red score, white captions on a black cabinet, ColorSmart digits that
  switch red/amber/green with game state.
- DSEG seven-segment font by keshikan, https://www.keshikan.net/fonts-e.html
  and https://github.com/keshikan/DSEG. Took: slanted hexagonal segments,
  blinking colon, dim off-segments.
- Seven-segment display, https://en.wikipedia.org/wiki/Seven-segment_display.
  Took: hexagon segment geometry, oblique slant, two ways to draw 1 and 7.
- Dot-matrix display, https://en.wikipedia.org/wiki/Dot-matrix_display. Took:
  5x7 character cell with a blank column between glyphs, 128x16 sign format.
- Split-flap (Solari) departure boards,
  https://en.wikipedia.org/wiki/Split-flap_display. Took: rows of equal-width
  fields updating in place; the roll-in animation replaces the flap clatter.

## Palette

- Panel black: #050505 (page), #0c0c0c (cabinet), #151515 (borders)
- Amber lit: #ffb000; amber glow: rgba(255,176,0,.55)
- Amber unlit segment: rgba(255,176,0,.09)
- Caption white: #e8e4d8
- ColorSmart green: #3dff5c; ColorSmart red: #ff3b2f

## Typefaces

- Seven-segment digits: drawn in CSS (7 skewed hexagons per digit), no font.
- Dot-matrix display type: hand-coded 5x7 bitmap rendered as SVG circles.
- Captions: Silkscreen (Google Fonts), fallback monospace, uppercase.
- Body and names: Share Tech Mono (Google Fonts), fallback monospace.

## Why it suits a dorm ladder

Every resident can read a scoreboard from across a room without being
taught. It promises numbers that are live, public and unarguable, which is
the trust model of an open log with no accounts. It also makes the ladder an
event rather than a spreadsheet: the rating rolling up after a match is what
pulls the next pair to the table.
