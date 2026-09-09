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
