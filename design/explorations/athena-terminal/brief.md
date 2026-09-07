# Athena terminal

## Style language

The site is the output of one command, `athena% ladder`, on a black screen
in amber phosphor. Everything is monospace. Tables use
light box-drawing glyphs (U+2500 set), section titles are prompt lines, and
the bottom status bar is a reverse-video strip as tmux and lazygit draw it.
A block cursor blinks after the last line of output. Menu options are
numbered like a cluster login menu and rendered as full-width bracketed rows,
so a tap target is 48 px tall while still reading as text. Inputs are
prompts (`A> `). Wins print in xterm green, losses in xterm red; everything
else is a shade of amber. A faint scanline overlay and a soft glow are the
only decoration; both honour `prefers-reduced-motion`.

## References

- cool-retro-term, https://github.com/Swordfish90/cool-retro-term. Palette
  family from its shipped profiles (Default Amber, Default Green, IBM DOS);
  bloom and scanlines kept barely visible.
- xterm 16-colour table, https://en.wikipedia.org/wiki/ANSI_escape_code.
  Exact xterm green (`#00CD00`, bright `#00FF00`) and red (`#CD0000`) for
  win and loss.
- Monochrome monitor, https://en.wikipedia.org/wiki/Monochrome_monitor. P3
  amber as the ergonomic phosphor; afterglow is the reason for the glow and
  the fade-in on new output.
- Athena reference card, http://www.mit.edu/~rsi/pdfs/reference-athena.pdf.
  Vocabulary: `add`, `renew`, `delete`, `undelete`, `lsdel`. Deleted matches
  are shown under `lsdel`.
- MIT News on Project Athena,
  https://news.mit.edu/2018/mit-looking-back-project-athena-distributed-computing-for-students-1111.
  Shared cluster workstations: a tool, not a product.
- Box-drawing characters, https://en.wikipedia.org/wiki/Box-drawing_characters.
  Code points; they only align in monospace, hence fixed-width spans.

## Palette

| Role | Value |
|---|---|
| Screen | `#080806` |
| Amber text | `#FFB000` |
| Amber dim (rules, hints) | `#8A6000` |
| Amber bright (headings, selected) | `#FFD27A` |
| Win | `#00FF00` |
| Loss | `#FF5555` |
| Reverse video | `#080806` on `#FFB000` |

## Type

IBM Plex Mono via Google Fonts, falling back to `ui-monospace, Menlo,
"DejaVu Sans Mono", monospace`. 15 px / 1.45 on phones, 16 px on desktop.
Hierarchy comes from prompts and rules, not size.

## Why it suits a dorm ladder

Ashdown residents are graduate students who spend the day in a shell. A
terminal says: this is a tool, it does one thing, and the whole state is
readable at a glance. It carries no brand, which fits a site with no
accounts and no logo, and it makes the audit-trail promise visible. A log
that looks like a log is a log you believe.
