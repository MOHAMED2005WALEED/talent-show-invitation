# Talent Show 2024/2025 — Interactive Invitation Website

A premium, cinematic, mobile-first invitation website for the Faculty of
Management Studies talent show at Sabaragamuwa University of Sri Lanka.

## Folder structure

```
talent-show-invitation/
├── index.html          Main page (all sections)
├── style.css            All styling — colors, layout, animations
├── script.js             Opening sequence, countdown, form, controls
├── README.md
└── assets/
    ├── images/          Bottle graphic + gallery placeholder artwork (SVG)
    └── audio/           Add your own background-music.mp3 here
```

No build step is required — it's plain HTML/CSS/JS. Open `index.html`
directly in a browser, or serve the folder with any static host
(GitHub Pages, Netlify, Vercel, or your university's web server).

## Quick customization checklist

1. **Event date & countdown** — open `script.js`, edit the `EVENT.dateTime`
   value near the top (ISO format, includes timezone).
2. **Date / Time / Venue / Dress code cards** — edit the text directly in
   `index.html` inside the `<section class="details" id="event">` block.
3. **Map** — the venue section embeds a Google Maps search for
   "Sabaragamuwa University of Sri Lanka." Replace the `src` of the
   `<iframe>` in the Venue section with a specific embed URL if you want
   to pin the exact auditorium.
4. **Gallery photos** — swap the SVG placeholders in `assets/images/` for
   real event photography (`gallery-1.svg` … `gallery-6.svg`). Any image
   format works — just update the `src` attributes and keep a square
   aspect ratio for the cleanest grid.
5. **Background music** — drop a royalty-free instrumental MP3 into
   `assets/audio/` named `background-music.mp3` (see the README.txt
   inside that folder for sources). Music stays muted until a guest
   taps the floating music button — this respects autoplay policies on
   both Android and iPhone.
6. **RSVP submissions** — the form currently saves responses to the
   visitor's browser (`localStorage`) as a lightweight demo and shows a
   confirmation message. For real submissions, replace the `fetch`-ready
   block in the `rsvpForm` submit handler in `script.js` with a call to
   your Google Form endpoint, a spreadsheet webhook (e.g. via Google
   Apps Script), or your own backend.
7. **Sinhala translation** — all visible copy lives in `index.html`.
   Duplicate the file as `index-si.html`, translate the text nodes, and
   link the two versions together (or swap the copy in place if you only
   need one language at a time).

## What's inside the opening sequence

The signature moment is a short cinematic sequence built with inline SVG
and GSAP: a glass bottle floats in on a bed of golden stars, its cork
pops, and a rolled invitation rises out and unfurls to reveal the event
name before the whole scene fades into the hero section. It plays
automatically a moment after the page loads, and can also be triggered
early by a tap/click or the Enter/Space key (for accessibility). Guests
who have "reduce motion" enabled in their OS skip straight to the
invitation with no animation.

## Performance & accessibility notes

- Fonts load from Google Fonts, icons from Font Awesome, and GSAP/AOS
  from cdnjs — all via `<link>`/`<script>` tags with no bundler needed.
- Star fields and floating particles are drawn on `<canvas>` for
  performance rather than hundreds of DOM nodes.
- All interactive controls are keyboard-reachable and carry
  `aria-label`s; the RSVP form uses a `<fieldset>`/`<legend>` for the
  attendance question and `aria-live` status text for feedback.
- `prefers-reduced-motion` is respected throughout — the intro, star
  field, hero particles, and confetti all shorten or disable themselves.
- Tested layouts for iPhone/Android widths (360px–430px) up through
  desktop; the timeline and venue section swap to single-column layouts
  below 720px.

## Browser support

Modern Safari, Chrome, Edge, and Firefox (last 2 versions). CSS uses
`backdrop-filter` for the glassmorphism cards, which is supported in all
of the above; browsers without it will still render solid cards cleanly.
