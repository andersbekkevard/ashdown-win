# Live activity indicator — research and recommendation

A tiny "is the table busy right now?" indicator for the ashdown.win top bar, driven by
the timestamp of the last recorded match. Three states: **live** (a match inside the last
~30 min), **recent** (within the last few hours), **quiet** (nothing today). It taps
through to the match log page. It must not use the word "Log" as its label, it must be
tiny, and its grammar is borrowed rather than invented.

Four proposals are in `index.html` beside this file.

## The measurement that decided the shape

Before drawing anything, the real top bar was measured in headless Chrome with the actual
`globals.css` rules and the real Google Fonts loaded.

At a 390 px viewport the top bar has **354 px** of usable width (390 − 28 px of `.phone`
padding − 8 px of `.topbar` padding). The current contents already spend all of it:

| Element | Width |
|---|---|
| Logo pill, Titan One 22 px | 232.9 px |
| Chips group ("How?" 59.2 + gap 6 + "Log" 49.8) | 115.0 px |
| Flex gap between them | 8.0 px |
| **Total** | **355.9 px** |
| **Available** | **354.0 px** |

So the row is already 1.9 px over at 390 px. Nothing can simply be *added* beside the
existing chips. Something has to give, and there are only three candidates:

1. **Give up the "Log" chip** and let the indicator stand in its slot. It navigates to the
   same page, and the brief already forbids the word "Log" as the label — so the label was
   going to change anyway. Frees ~50 px. **This is what all four proposals do.**
2. **Shrink the logo.** Dropping the wordmark from 22 px to 18 px narrows the pill by about
   29 px, which would leave room to keep all three. It costs the brand mark its presence,
   which is the loudest thing on the home screen.
3. **Move the indicator out of the top bar** entirely, e.g. into the board header. Out of scope
   for this brief but worth noting.

Working budget for the indicator: **≈48 px**. Every proposal is measured live in the page
itself — each in-context mock prints the indicator width, the total row width, and the
remaining slack, computed from `offsetWidth` at runtime rather than asserted.

## Research: how real applications signal live or recent activity

| Application | Grammar — shape, colour, motion, wording, how time is expressed | Image URL (HEAD-verified 200) |
|---|---|---|
| **Twitch** | Rounded rectangle badge in Twitch red, uppercase `LIVE`, often with viewer count beside it. Anchored to the corner of a thumbnail. Avatar gets a red ring while live. Offline channels lose the badge entirely and fall back to "last streamed" text. Time is expressed as presence/absence, not a number. | https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Twitch_Glitch_Logo_Purple.svg/960px-Twitch_Glitch_Logo_Purple.svg.png |
| **YouTube** | Same family: a red pill, uppercase `LIVE`, no dot, bottom-left of the thumbnail where the duration normally sits — it literally replaces the duration. Once the stream ends the pill vanishes and the metadata line becomes "Streamed 2 hours ago". One slot, three degrees of recency. | https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_of_YouTube_%282015-2017%29.svg/960px-Logo_of_YouTube_%282015-2017%29.svg.png |
| **Instagram** | Live is a ring, not a badge: a pink/purple gradient ring around the profile picture with a small `LIVE` tab at its foot. Unwatched stories use the full orange-pink-purple gradient, watched ones a flat grey ring. Colour and gradient encode freshness; there is no timestamp at all. | https://upload.wikimedia.org/wikipedia/commons/3/3a/Instagram_screenshot.png |
| **Slack** | The smallest possible presence display and completely wordless. A solid green dot beside the name means active (the app was used in roughly the last 30 minutes); a hollow green ring means away. State is carried by the *fill*, not the hue, so it survives colour blindness. No motion at all — the point is calm. | https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/960px-Slack_icon_2019.svg.png |
| **Discord** | Same dot, more states, all distinguished by silhouette: filled green circle online, a crescent with a bite out of it for idle, a circle with a horizontal bar for do-not-disturb, a circle with a hole for offline. The dot sits in a notch cut out of the avatar's bottom-right. Wordless; the sentence lives in the tooltip. | https://upload.wikimedia.org/wikipedia/commons/0/0b/Discord_browser_options_%28September_2020%29.png |
| **GitHub / status pages** | A coloured disc plus a short declarative sentence — "All Systems Operational". Four levels (none / minor / major / critical) mapped to green / yellow / orange / red, and per-component rows rather than one global light. Time is a separate "updated N minutes ago" line, never inside the dot. | https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/960px-GitHub_Invertocat_Logo.svg.png |
| **Google Maps** | Busyness as a histogram, not an announcement. Grey bars for the typical week, the current hour highlighted, and a live overlay in a second colour when real-time data disagrees with the prediction. The wording is comparative and plain: "Live", "Busier than usual", "Usually not too busy", "Usually as busy as it gets". Quantity first, alert second. | https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/960px-Google_Maps_icon_%282020%29.svg.png |
| **Uber** | A dot on a map that expands rings outward while the driver's position updates, paired with a countdown in minutes. The pulse means "this is being tracked right now"; when tracking stops the rings stop and the position is stale. | https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/960px-Uber_logo_2018.svg.png |
| **Apple Find My** | The canonical version of the same object: a blue disc with two expanding, fading rings on a half-period offset — the radar cadence. Beside it a lowercase relative timestamp, "Just now", "2h ago", or "No location found". Live and stale share one object; only the rings and the words change. | https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/IPhone_14_Pro_vector.svg/960px-IPhone_14_Pro_vector.svg.png |
| **Apple Dynamic Island / Live Activities** | A black obround that grows and shrinks with a spring. Compact form splits into leading and trailing zones, each roughly 60 × 36 pt: leading carries a glyph or the core metric, trailing a short confirmation. The motion is the announcement — the shape changing size is what draws the eye, not colour. | https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/IPhone_14_Pro_DI_Vector.svg/960px-IPhone_14_Pro_DI_Vector.svg.png |
| **Strava** | No live dot. Recency is expressed entirely in prose on the activity card — "2 hours ago" — and shared activity is surfaced after the fact through Flyby rather than in real time. Useful as the counter-example: a social fitness product deliberately declined a presence indicator. | https://upload.wikimedia.org/wikipedia/commons/8/8c/Logo_Strava.png |
| **BeReal** | Time as a window rather than a state. One notification, a two-minute window, and posts outside it are permanently stamped "late". The grammar is a countdown and a social penalty, not a badge. Relevant here for wording register — a short human phrase beats a technical one — but the mechanic itself is wrong for a ladder. | *(no verifying image URL found on a stable host; dropped)* |
| **Instagram / Snapchat story rings (generic)** | Included above under Instagram. | — |

Image URLs were checked with `curl -sIL` and only 200/`image/*` responses were kept. One
candidate (a Google Maps pin SVG thumbnail) returned 404 and was replaced; the BeReal entry
had no stable image host and its URL was dropped rather than left broken.

## The four proposals

Each borrows from a different family, and they differ in shape, motion and wording rather
than in colour.

| # | Family | Shape | Motion | Wording | Measured width |
|---|---|---|---|---|---|
| 1 | YouTube / Twitch | Saturated pill with one uppercase display word | Whole pill beats once every 1.5 s and throws a hard white rim | `LIVE` / `2H` / `OFF` | 45 px, 5 px spare |
| 2 | Slack / Discord / GitHub | Ink coin, 32 px, matching the existing chips | The coin breathes, ~6 times a minute | none — the state is the dot's silhouette | 32 px, 18 px spare |
| 3 | Google Maps popular times | Ink pill containing a four-bar histogram and a numeral | The current-hour bar rises and falls | a numeral: today's match count | 46 px, 4 px spare |
| 4 | Find My / Uber | No container — a dot on the blue, throwing rings | Two rings expand outward on a half-period offset | `now` / `2h` / `—` | 43 px, 7 px spare |

In (2) the three states are distinguished by silhouette, not hue: filled disc, crescent,
hollow ring. That is the Slack/Discord contract and it is the only one of the four that
still reads correctly in greyscale and at arm's length.

## Recommendation

**Ship number 2, the presence dot.**

It is the only proposal that solves the space problem rather than negotiating with it: at
32 px it leaves 18 px of genuine slack in a row that is currently 2 px over budget, which
means it survives the 375 px iPhone SE as well as the 390 px case, and it leaves room for a
longer wordmark later. Because it is wordless it never touches the "Log" restriction, it
needs no translation, and it cannot be misread as a button that does something to the app —
it is clearly a status light. It is an ink coin exactly as tall as the existing "How?" chip,
so it joins the chip family instead of introducing a fifth visual species into a top bar
that already carries a pink logo, black chips and a blue field. And its three states are
encoded in the shape of the dot, so the whole thing degrades gracefully: no motion, no
colour, no text, and it still says which of the three things is true. Number 1 is the
runner-up and the one to pick if Anders wants the indicator to shout — `LIVE` in Titan One
on a pink pill is unmissable, and unmissable may be exactly the point for a ladder whose
success metric is whether someone records a match. Number 3 is the most informative and the
most likely to be ignored; number 4 is the prettiest and the only one whose animation
escapes its own bounds, which is a liability in a 4 px-of-slack row.

One consequence to accept with any of them: the "Log" chip loses its word. The destination
is unchanged, but the top bar stops naming it. If that is unacceptable, the fallback is to
take the logo from 22 px to 18 px, which buys about 29 px and lets all three coexist.

---

# Round 2 — the recording button

Anders reviewed round 1 and asked for a different direction: **recording-button grammar**. A dot
*and* a short word encoding recent activity — LIVE, REC, NOW or ON, never "Log". His reference:
a red filled circle inside a ring beside the word REC
(`https://thumbs.dreamstime.com/b/recording-sign-button-red-app-panel-rec-vector-symbol-isolated-white-background-201660247.jpg`,
verified 200 `image/jpeg`).

Four options are in `rec.html`. `index.html` is unchanged.

## Research: how recording and live status are signalled with a dot and a word

| Application / object | Grammar — shape, colour, motion, wording, how time is expressed | Image URL (HEAD-verified 200) |
|---|---|---|
| **Anders' reference** | Filled red disc centred inside a thin ring, the word `REC` beside it in the same red. The ring is the record button's bezel; the disc is the button. No motion in the still, but the convention it depicts blinks. | https://thumbs.dreamstime.com/b/recording-sign-button-red-app-panel-rec-vector-symbol-isolated-white-background-201660247.jpg |
| **iPhone privacy indicators** | The smallest recording signal Apple ships: a solid **orange** dot means the microphone is in use, a solid **green** dot means the camera. Never both at once. Wordless, no motion, and — the detail worth stealing — with *Differentiate Without Color* enabled the orange dot becomes an orange **square**. Apple encodes the state in the silhouette, not the hue. | https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/IPhone_14_Pro_DI_Vector.svg/960px-IPhone_14_Pro_DI_Vector.svg.png |
| **iPhone screen recording, pre-Island** | The status bar itself becomes the indicator: the clock turns into a solid red capsule and stays there while recording, visible in every app. The container is the message; there is no separate badge and no word beyond the time it is already showing. | https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Bauer_Bosch_VCC_836_-_CRT_viewfinder-49315.jpg/960px-Bauer_Bosch_VCC_836_-_CRT_viewfinder-49315.jpg |
| **Dynamic Island recording state** | The Island expands for a 3-2-1 countdown, then settles as a **pulsing red circle** in the black cutout, expanding to a red pill when tapped. The black carrier never changes colour; only the small red element inside it does, and the motion is a size change rather than a blink. | https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/IPhone_14_Pro_DI_Vector.svg/960px-IPhone_14_Pro_DI_Vector.svg.png |
| **Camcorder viewfinder OSD** | A hard-cornered box in the corner of the frame, white or red `REC` with a dot that blinks at roughly one beat a second. Square corners, monospaced-feeling type, no animation on the word. Elapsed time sits beside it as a running counter, so time is a number, not a state. | https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Sharp_VL-N1S_-_viewfinder-0311.jpg/960px-Sharp_VL-N1S_-_viewfinder-0311.jpg |
| **Consumer camcorder body** | Same grammar in hardware: a physical red lamp beside the lens, on solidly while rolling. The dot came before the badge; the on-screen badge is a picture of the lamp. | https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Sony_DVD_DCR-PC7E_camcorder-CnAM_43799-IMG_5360-black.jpg/960px-Sony_DVD_DCR-PC7E_camcorder-CnAM_43799-IMG_5360-black.jpg |
| **Broadcast tally light** | A lamp above the lens: **red** for on air, **green** for preview (about to be), **orange** for ISO recording. Three degrees of liveness in one object, distinguished by colour and by nothing else — which is exactly the ladder's three states, and exactly the reason to add a shape difference on top. | https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Small_tally_light_on_camera.jpg/960px-Small_tally_light_on_camera.jpg |
| **Studio ON AIR sign** | The maximal version: a lit word, no dot, binary. Useful only as the reminder that the word alone is enough once it is lit — the dot is what makes it legible when it is *not*. | https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Radio_WWOZ_Studios_New_Orleans_June_2021_-_On_Air_Sign.jpg/960px-Radio_WWOZ_Studios_New_Orleans_June_2021_-_On_Air_Sign.jpg |
| **Vintage recording lamp** | An animated red lamp, the ancestor of the CSS blink. One hertz, hard on/off, no easing — the cadence that reads as "machine running" rather than "app notifying". | https://upload.wikimedia.org/wikipedia/commons/6/68/Recording-light.gif |
| **Twitch** | Dot-plus-word in its modern form: a red rounded badge reading `LIVE`, pinned to a thumbnail corner, with the avatar taking a red ring. Absence of the badge is the off state. | https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Twitch_Glitch_Logo_Purple.svg/960px-Twitch_Glitch_Logo_Purple.svg.png |
| **YouTube** | The same red pill placed where the video duration normally sits, so it literally replaces the timestamp; afterwards the metadata reads "Streamed 2 hours ago". One slot carrying live, recent and old. | https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_of_YouTube_%282015-2017%29.svg/960px-Logo_of_YouTube_%282015-2017%29.svg.png |
| **Instagram Live** | Dot-plus-word wrapped around an avatar: a pink/purple ring with a small `LIVE` tab at its foot. Shows that the word can hang off an existing object instead of occupying its own slot. | https://upload.wikimedia.org/wikipedia/commons/3/3a/Instagram_screenshot.png |

All URLs re-checked with `curl -sIL`; every one returns 200 with an `image/*` content type. Note that
only pre-generated Wikimedia thumbnail sizes resolve — one candidate passed on first check and later
returned 400 once its cached thumbnail was evicted, and was replaced.

## The four options

Same width budget as round 1 — the indicator takes the "Log" chip's slot, leaving roughly 48 px —
and each option carries a `min-width` so its three states are identical in width and the chips
never shift when the state changes. Widths below are measured in the page at runtime.

| # | Option | Grammar from | Shape | Motion | Words | Recommended colour | Measured |
|---|---|---|---|---|---|---|---|
| A | Viewfinder badge | Camcorder OSD, tally light | Hard-cornered rounded rectangle, filled | Dot blinks at 1 Hz on a true square wave (`steps(1)`), word fixed | `REC` / `2H` / `OFF` | **Mint** | 47 px, 3 px spare |
| B | Status-bar pill | Apple screen recording | Full pill, filled, white rim | The whole pill throws a hard rim every 1.7 s | `ON` / `2H` / `OFF` | **Gold** | 43 px, 7 px spare |
| C | Dot in a ring | The record button itself | No container — ring with a dot inside, word beside on the blue | Dot breathes to 60% and back every 1.4 s | `LIVE` / `2H` / `OFF` | **REC red** | 44 px, 6 px spare |
| D | Island capsule | Dynamic Island recording state | Ink capsule matching the existing chips, fixed 46 px | The dot stretches into a slab and the word fades up on it, 4.6 s cycle | `NOW` / `2H` / `–` | **REC red** | 46 px, 4 px spare |

### Why the recommended colours differ

The top bar already holds a hot pink logo on a saturated blue field. That decides the colour
question almost by itself: **red is safe in proportion to how little of it there is.** A and B are
filled objects roughly 45 px wide, so in red they put a third hot hue eight pixels from the logo and
the row starts to vibrate; they take mint and gold, which sit calmly on blue and keep dark ink text.
C and D spend their colour on a 7–9 px element inside a white ring or an ink capsule, and at that
size true REC red reads as a lamp rather than as a second brand colour — so they get the red, and
with it the citation.

## Recommendation

**Ship option C in REC red.**

It is the reference image, unmodified in structure: a filled red dot inside a ring with the word
beside it. Everything good about that drawing survives the translation. The red is confined to a
7 px disc, which is the only place in this top bar where true recording red can go without arguing
with the pink logo, and at that size it reads unambiguously as a lamp — the thing the whole grammar
is built on. It has no container, so it adds no new filled object to a bar that already carries a
pink pill, a black chip and a blue field; it is the lightest of the four on the eye while being the
most literal about what it means. The motion is the record button at rest, a 1.4 s breath rather
than a strobe, which is legible without being irritating on the fifth visit. And the state ladder is
borrowed from the broadcast tally light and then improved on Apple's own principle of encoding state
in silhouette: **filled** dot for live, **hollow** dot for recent, **empty** ring for quiet. Those
three read apart in greyscale, under colour blindness, and on a phone in direct sun, which none of
the purely chromatic ladders do.

Two caveats, both cheap. Because C has no background its tap target is only as tall as its content,
so it needs an invisible hit area padded out to 44 px before it ships. And it is the quietest of the
four — if the point of the indicator is to *pull* someone into recording a match rather than merely
to inform them, **option D in red** is the runner-up: same small-red-element discipline, but a solid
ink capsule that matches the existing chips exactly, an obvious hit area, and a morph that is much
harder to ignore. Option A in mint is the most fun and the most "equipment", and it is also the
tightest fit at 3 px of spare width, so it is the one most likely to break on a narrower phone.

---

# Round 3 — eight contained pills

Anders reviewed `rec.html` and moved the brief again. Round 3 is in `live3.html`; `index.html` and
`rec.html` are unchanged.

What changed, in his terms: **it must be obviously tappable**, so every option is a pill or capsule
and the bare dot-in-a-ring from round 2 is dead. **Colour narrows to pink or red**, because the
indicator lands beside the brand pink logo and nothing else is in play. **The dot stays and pulses
under about ten minutes.** **Wording opens up** — new words, and a serious test of whether a relative
timestamp beats a word. **At least eight options**, distinct in shape, motion and label strategy.

## Pink or red, judged against the logo

The page opens with one identical pill rendered six ways in the real top bar, so the hue is judged
eight pixels from the wordmark rather than in isolation.

| Treatment | Verdict |
|---|---|
| Brand pink `#fb3aa3` fill | Matches the logo exactly, and that is the problem. Two pink pills in one row read as a single interrupted object, and the indicator borrows authority from the wordmark that it has not earned. |
| REC red `#e8232a` fill | The true recording red, and legible — but as a *filled pill* it sits a short hop from the logo's magenta and the pair vibrates. Red is safe in proportion to how little of it there is. |
| Crimson `#b8102e` fill | Dark enough to read as a decision rather than a near-miss. The best of the filled reds against pink. |
| Vermilion `#f4501e` fill | Pushed toward orange, so it separates from the pink cleanly — but it starts to argue with the crown's gold. |
| **Ink pill, REC red dot** | Red confined to eight pixels. Nothing competes with the logo and the pill is already a member of the chip family. |
| **White pill, REC red dot** | Same discipline, louder container. The white slab is the app's own card, so it reads as a control at a glance. |

The conclusion the strip makes visible: **the colour question is really a question about area.** Any
red works at dot scale; almost none works as a 47 px filled pill next to that logo. Pink fails not
because it clashes but because it duplicates.

## The eight

Every option shows its full life cycle in the 390 px top bar — under ten minutes with the pulse
running, ten to sixty minutes, a few hours, nothing today, and the live state again frozen under
reduced motion — with the logo and the How? chip present in all of them.

| # | Option | Label strategy | Colour | Shape | Motion | Widest state |
|---|---|---|---|---|---|---|
| 1 | REC card | A word while hot, a time after — `REC` `24m` `3h` `OFF` | White slab, vermilion dot | Rounded slab, 9 px corners; the only non-pill | Dot pulses in scale, ~1.1 Hz | 48 px, 2 spare |
| 2 | Timecode | Elapsed clock — `0:04` `0:37` `3:12` `–:–` | Crimson pill, ink screen | Pill wrapping a recessed dark screen | The colon blinks, hard 1 Hz | 47 px, 3 spare |
| 3 | Chip minutes | Bare compact time — `4m` `24m` `3h` `–` | Ink pill, REC red dot | The existing How? chip exactly | A hard halo contracts onto the dot | 47 px, 3 spare |
| 4 | Heat pill | Temperature, no numbers — `HOT` `WARM` `COOL` `COLD` | Brand pink, white rim | Pill wearing the logo's own rim | A hard white rim grows and fades | 47 px, 3 spare |
| 5 | Numeral capsule | Time with the digit large, unit small | Vermilion lamp well + ink body | Two-tone capsule; the most distinctive silhouette | The lamp well washes darker | 46 px, 4 spare |
| 6 | Collapsing pill | A label only when there is news; a bare lamp when there is none | Crimson pill, white dot | Pill that shrinks to a 31 px coin when quiet | A gloss sweeps across, 2.6 s | 46 px, 4 spare |
| 7 | Long phrase | A real sentence — `just now` `18 min` `2 hours` `quiet` | White pill, REC red dot | Wide pill, body type, sentence case | The whole pill breathes, 2.3 s | 74 px, 15 spare — logo 22→18 px |
| 8 | Ago pill | Relative time with the *ago* spelled out — `4m ago` `24m ago` `3h ago` `none` | Ink pill, vermilion dot | Full pill, chip-native | The dot blinks hard, 1 Hz square wave | 67 px, 12 spare — logo 22→19 px |

## The finding that decides it

Building these produced a result I did not expect and would not have got from arithmetic alone.

**The compact options are the fragile ones.** Options 1 to 6 all fit, but they fit by 2 to 4 pixels.
They are wedged into whatever the current layout happens to leave over, and that margin is thinner
than the difference between Titan One and its fallback, thinner than a 375 px iPhone SE, and thinner
than any future change to the wordmark. Every one of them is one small decision away from breaking.

**The verbose options are the robust ones.** Options 7 and 8 look like they cost more and in fact
cost less. Taking the logo from 22 px to 19 px frees about 29 px while the extra label costs about
20, so option 8 ends up with **12 px of spare width — three times the headroom of any compact
option** — and option 7 with 15. Buying space once, deliberately, from the element that has it,
leaves a layout with slack in it. Squeezing into the leftovers does not.

That inverts the trade-off. Anders' hunch that a time is a higher signal than a word is right, and
it turns out the honest version of a time is also the safer one to build.

## Recommendation

**Ship option 8, the Ago pill: an ink pill with a vermilion dot, labelled `4m ago`.**

It answers every part of the brief without a compromise anywhere. It is a filled pill identical in
ink, radius and height to the existing How? chip, so it is unmistakably a control and it joins a
family rather than founding one. Its only colour is an eight-pixel dot, which the comparison strip
shows is the one place any red is safe beside that logo — so the pink-versus-red question is
answered by not making the indicator a coloured object at all. The dot blinks on a hard square wave
while the last match is under ten minutes old, which is the camera cadence and reads as a machine
running rather than an app notifying, and it goes solid, then dark, then grey as the day ages.

And the label is the thing worth arguing for. `4m` is ambiguous — it could be a duration, a score, a
court number. `4m ago` can only be a time, nobody has to be taught it, and it costs fourteen pixels.
Those fourteen pixels are bought from three points of wordmark, and the mock shows the logo at 19 px
looking entirely intact. The result has more slack than any of the tightly-packed alternatives.

Two refinements to fold in at build time, both free. Borrow option 7's wording for the freshest
state: `just now` measures the same as `24m ago`, so the ladder can read *just now → 24m ago → 3h
ago → none* at no extra width. And if the canonical recording red is wanted over the vermilion, swap
the dot to `#e8232a`; at eight pixels the strip shows both are safe.

**Runner-up:** option 7 if a whole sentence is worth four points of wordmark rather than three — it
is warmer and needs no decoding at all, in the app's own white slab. **If the logo must stay at
22 px**, option 3, Chip minutes, is the pick: the same ink-pill-and-red-dot discipline, `4m` as the
label, and the smallest footprint of the eight. It is the safe answer rather than the good one.

**Not recommended:** option 4 is the clearest illustration of why pink fails — the mock shows two
pink pills reading as one broken object. Option 6 is charming but changes the row's width when the
first match of the day lands, which shifts the How? chip; only worth it if empty days are the norm.
