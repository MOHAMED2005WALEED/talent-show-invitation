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
6. **RSVP submissions — where do they go?** By default, RSVPs are only
   saved in the visitor's own browser (`localStorage`), so there's no
   central list. Two ways to actually see them:

   - **Quick local check:** open `admin.html` in the same browser someone
     just submitted from. It lists every RSVP saved on that device, with
     Refresh, Export CSV, and Clear all buttons. Good for testing, but it
     only shows submissions made on that exact device/browser.
   - **Real shared list (recommended):** connect the form to a Google
     Sheet so every guest's RSVP — from any phone or computer — lands in
     one place automatically.
     1. Open `apps-script.gs` in this folder and follow the numbered
        setup steps inside it (create a Sheet, paste the script into
        Extensions → Apps Script, deploy as a Web App, copy the URL).
     2. Paste that URL into the `RSVP_SHEET_URL` constant near the top
        of `script.js`.
     3. Re-upload `script.js`. From then on, every submission is written
        as a new row in your Google Sheet, and still kept locally too
        (so `admin.html` keeps working as a backup view).
7. **Watch Live button & inline player** — open `script.js`, edit the
   `LIVE_STREAM_URL` constant near the top (next to `RSVP_SHEET_URL`).
   The moment that's a real link, two things happen automatically:
   - Facebook's official video plugin is embedded right inside the
     "Watch Live" section, so the stream **plays directly on the site**
     (no click-through needed) — same as pasting a video link into a
     Facebook post to embed it elsewhere.
   - The "Open on Facebook" button below the player also starts pointing
     to that link, as a fallback for anyone whose browser blocks embeds
     (common in some in-app browsers like Instagram/Messenger's).

   Two options for `LIVE_STREAM_URL`:
   - The direct video URL Facebook gives you the moment you go live
     (looks like `https://www.facebook.com/PAGE/videos/12345/`) — most
     reliable, use this once broadcasting starts.
   - The Union Page's main URL — Facebook's plugin will usually surface
     whatever is live/most recent there, but the direct video link above
     is more dependable.

   The badge above the player automatically switches between
   "Streaming Soon" → "Live Now" (pulsing red dot) → "Watch The Replay",
   timed off `EVENT.dateTime` and the `LIVE_DURATION_HOURS` constant —
   adjust that number to roughly match how long the show runs. Until
   `LIVE_STREAM_URL` is a real link, the player area just shows a
   placeholder icon instead of a broken embed.

   **To actually go live from the Union's Facebook Page on the day:**
   1. On the phone/laptop logged in as an admin of the Union's Page,
      open the Facebook app (or facebook.com) and switch into the Page
      (tap the Page's profile picture / "Switch" if you're on your
      personal profile — you must post *as the Page*, not your own
      account).
   2. Tap **Create Post** → **Live video** (mobile app: the "Live" icon
      under "What's on your mind?"; desktop: the video camera icon on
      the Page's composer).
   3. Grant camera/microphone permission, add a title (e.g. "ත්‍රිවේද '26
      — Live from the Auditorium") and description, pick the video
      quality your connection can sustain, then tap **Go Live**.
   4. Facebook shows a short countdown, then you're broadcasting — the
      video URL appears immediately in the address bar (desktop) or by
      tapping **Share → Copy Link** (mobile). Paste that URL into
      `LIVE_STREAM_URL` in `script.js` and re-upload — this makes the
      embedded player on the site show the actual live video.
   5. In the Union Page's **Settings → Privacy**, make sure the video's
      privacy is set to Public — the embed plugin can't play private or
      restricted videos.
   6. For a stable stream over a couple of hours: prefer Wi-Fi over
      mobile data if possible, keep the phone plugged into power, and
      use a tripod/stabilizer pointed at the stage.
   7. Tap **Finish** when the show ends — the video stays on the Page as
      a replay automatically, and the same embed keeps working so
      latecomers can watch it after.

8. **Sinhala translation** — all visible copy lives in `index.html`.
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
