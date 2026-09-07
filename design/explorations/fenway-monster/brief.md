# Fenway steel

## Style language

The site is built from the physical parts of Fenway Park's boards, not from a
picture of them. There are five parts and every screen is assembled from them.

The **wall** is painted green sheet steel. It has a faint seam every panel, a
slightly lighter top and darker base, and nothing else: no texture overlay, no
grain, no vignette. Lettering that belongs to the wall (headers, player names,
labels) is painted straight onto it in bold condensed white capitals, the way
"BOSTON" and "AT BAT" are painted on the Monster.

A **slot** is a rectangle cut into the wall. It is drawn as a dark cavity with a
hard inset shadow at the top and left edge, and a thin light lip at the bottom,
so the eye reads depth. Slots exist because the numbers on the Monster are
loaded from behind through slits; the cavity is the slit.

A **plate** is a loose piece of painted steel sitting in a slot. It is a slightly
different green from the wall, carries one numeral in white, has a highlight
along its top edge, and casts a small shadow into the cavity around it. Every
digit of every rating is its own plate, so a rating of 1071 is four objects.
Yellow-amber on a plate means "in progress", which is exactly what a yellow
digit means on the Monster.

A **lamp** is a domed jewel lens in a dark socket with a bright bezel. Teal is a
win, red is a loss, amber is something pending. A lit lamp has a specular
highlight and a saturated body; an unlit lamp is the same lens gone dark. Lamps
never glow; there is no outer halo.

The **LED strip** is the modern layer: a charcoal panel with a grid of cells,
each outlined by a thin grey frame, each with a caption above a large white
value, and one orange value per panel. Statistics, the rating rule, the graph
and the Elo preview live here.

Everything sits in a **steel cabinet**: charcoal rails top and bottom with a row
of domed rivets, bolted push-plate buttons, a rocker switch for doubles. The
primary action is the one amber button on the screen.

## References

- SABR, "Fenway Park's Hand-Operated Scoreboard"
  (https://sabr.org/journal/article/fenway-parks-hand-operated-scoreboard/).
  Plates are 16 by 16 in and 3 lb for runs and hits, 12 by 16 in and 2 lb for
  innings and pitcher numbers, inserted from behind through slits; a slot is
  "like taking an inbox from a desk and placing it vertically against the
  scoreboard", some loaded from the top and some from the bottom; an inning in
  progress shows a yellow digit, replaced by white when the inning ends; the
  1976 sheet-metal skin. Took: the slot as a real cavity, the plate as a loose
  object, amber as "in progress".
- Wikipedia, "Green Monster" (https://en.wikipedia.org/wiki/Green_Monster).
  127 slots, 13 by 16 in plates, and the vertical white lines between the
  American League columns that carry the Yawkeys' initials in Morse code. Took:
  the single vertical white rule between names and ratings on the board.
- fenwayfanatics.com, "Manual Scoreboard"
  (https://www.fenwayfanatics.com/fenway-park/features/manual-scoreboard/).
  Three operators inside the wall; green and red lights signal balls, strikes
  and outs. Took: a lamp is a state, not decoration.
- ESPN on the 2025 City Connect uniform
  (https://www.espn.com/mlb/story/_/id/45165321/boston-red-sox-2025-city-connect-uniform-green-monster).
  "Three green lights and four red" replicate the vintage ball-strike-out
  indicator; the wordmark copies "the signature hand-painted lettering" on the
  wall; white numbers are the ones hung each inning. Took: lettering is painted,
  not typeset, and the two-colour lamp logic.
- Benjamin Moore SC-12 Green Monster Green (https://encycolorpedia.com/54796d
  and https://www.benjaminmooreitalia.com/en/colors/sc-12). The chip is
  #54796d, LRV 16.33, from the 2014 Fenway Collection with Baseline White
  SC-08, Boston Blue SC-09, Foul Pole Yellow SC-27 and Boston Red SC-42. Took:
  the chip value, and the observation that the wall in photographs reads
  darker and greener than the chip because it is mostly in shade.
- Boston.com on the Fenway Collection
  (https://www.boston.com/news/local-news/2014/08/20/now-you-can-paint-your-apartment-green-monster-green/).
  Benjamin Moore has painted the wall since 2002 and put the same paint in the
  can. Took: confidence that the green is one flat coat, so no texture.
- Jewel-lens pilot lamp hardware
  (https://www.ebay.com/itm/CED-L115-JEWEL-SCREW-LENS-FOR-PILOT-LAMP-INDICATOR-LIGHT-BULB-VINTAGE-AMP-RED-/400307316956).
  Threaded faceted glass jewel on a panel socket, 17/32 in across, colour
  changed by the bulb behind it. Took: the lamp drawing (dome highlight, dark
  socket, bright bezel ring, unlit version is the same lens gone dark).
- WBUR, "Where Did The Original Green Monster Scoreboard Go?"
  (https://www.wbur.org/news/2011/04/08/fenway-scoreboard). The 1934 board had
  rusted through at the bottom edge; Counterpart in South Dakota built the
  replica from drawings. Took: the board is fabricated steel in panels, hence
  the seams and the rails.
- AVNetwork on the LG LED boards
  (https://www.avnetwork.com/news/boston-red-sox-get-monster-display-upgrade-with-lg)
  and the 2024 right-field digital board that replaced the out-of-town
  scoreboard. Took: the bordered charcoal cell grid is Fenway's own modern
  layer, so it can sit next to the painted wall without a style clash.
- Ballparks of Baseball, Fenway Park
  (https://www.ballparksofbaseball.com/ballparks/fenway-park/). The 1976
  electronic scoreboard, the press box glassed in 1975 and turned into the 600
  Club in 1988, all on steel columns. Took: the steel cabinet framing.
- The Fenway Purist, April 2018 (http://www.fenwaypurist.com/2018/04/; the host
  refuses automated fetches, read through the search excerpt). Everything on
  the wall except the ad decals is hand painted; the lettering resembles
  "Modern Egyptian" in E. C. Matthews' 1928 sign-painting manual; the video
  boards imitate it. Took: bold condensed painted capitals, so Oswald.
- FunTrivia on the "Fenway Park JF" font
  (https://ask.funtrivia.com/askft/Question120420.html). That script is the
  park logo, not the board. Noted so it would not be used.

## Palette

| Token | Value | Source |
|---|---|---|
| SC-12 chip | #54796d | Benjamin Moore Green Monster Green |
| wall, lit | #3f6a55 | chip shifted to how the wall photographs |
| wall, shade | #325343 | |
| slot cavity | #182b22 | |
| plate | #3b6450, highlight #4a7560 | |
| painted white | #f2efe4 | Baseline White, warmed |
| steel | #2d3033, highlight #5f6469, edge #9ea3a7 | |
| LED surface | #131517, cell outline #8b9094, caption #c6cacd, grid #2a2e31 | |
| orange | #f08a2a | LED stat board accent |
| amber | #f3b03f | yellow in-progress digit |
| lamps | teal #2aa9bf, red #d8362b, amber #f0a134 | |

## Typefaces

Oswald 600/700 for painted lettering and plate numerals; Barlow Condensed
500/600 for captions, body and LED cell labels. Both from Google Fonts, with
Arial Narrow and Impact as fallbacks so the page still reads offline.

## Why it suits a dorm ladder

A ladder on a wall next to a table is a scoreboard, and the Monster is the
scoreboard everyone in Boston already knows how to read: a name painted on
green, a number on a plate, a lamp for the count. The system is honest about
what the site does. Plates are loose because ratings are recomputed from the
log every time; the yellow digit says a result is pending; the lamps say win or
loss without a word. And it is local: the ladder is two miles from the wall it
borrows from.
