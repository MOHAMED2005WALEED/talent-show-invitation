/* =========================================================
   TALENT SHOW 2024/2025 — script.js
   Opening cinematic sequence, ambient background, countdown,
   scroll animations, RSVP handling, and floating controls.
   ========================================================= */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     1. EVENT CONFIG — edit these to update the whole site
     ========================================================= */
  const EVENT = {
    // ISO date/time used for the live countdown. Edit to the real date.
    dateTime: "2026-08-14T09:00:00+05:30",
    name: "Talent Show 2024/2025",
    venue: "Main Auditorium, Sabaragamuwa University of Sri Lanka"
  };

  // Paste your deployed Google Apps Script Web App URL here to send every
  // RSVP straight into a shared Google Sheet (see README.md for the
  // 5-minute setup). Leave empty to keep RSVPs saved only in this
  // browser's localStorage (viewable via admin.html on this device).
  const RSVP_SHEET_URL = "https://script.google.com/macros/s/AKfycbz-RjkII9E_nECqtVhN7OjhatrjqeMLU2hJSaHD2EF2c_B7llq2-TCuKkTn2NANZplP/exec";

  /* =========================================================
     2. STAR / PARTICLE CANVAS (shared by intro + ambient bg)
     ========================================================= */
  function createStarField(canvas, opts = {}) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    let w, h, dpr;
    const density = opts.density || 0.00012;
    const speed = opts.speed || 0.15;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor(w * h * density);
      stars = Array.from({ length: count }, () => makeStar());
    }

    function makeStar() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.25,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * speed
      };
    }

    let raf;
    function tick(t) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.phase += s.twinkleSpeed;
        s.y += s.drift;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;
        const alpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(s.phase));
        ctx.beginPath();
        ctx.fillStyle = `rgba(244,229,178,${alpha.toFixed(3)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    if (!prefersReducedMotion) {
      raf = requestAnimationFrame(tick);
    } else {
      tick(0); // draw once, static
    }
    return { stop: () => cancelAnimationFrame(raf) };
  }

  const starCanvas = document.getElementById("starCanvas");
  const bgCanvas = document.getElementById("bgCanvas");
  if (starCanvas) createStarField(starCanvas, { density: 0.00018, speed: 0.18 });
  if (bgCanvas) createStarField(bgCanvas, { density: 0.00007, speed: 0.08 });

  /* =========================================================
     3. OPENING CINEMATIC SEQUENCE (bottle -> cork -> scroll)
     ========================================================= */
  const intro = document.getElementById("intro");
  const bottleWrap = document.getElementById("bottleWrap");
  const cork = () => document.querySelector("#bottleSvg #cork");
  const bottleGlow = () => document.querySelector("#bottleSvg #bottleGlow");
  const burstLight = document.getElementById("burstLight");
  const scrollEl = document.getElementById("scroll");
  const introHint = document.getElementById("introHint");
  const siteHeader = document.getElementById("siteHeader");

  let introPlayed = false;

  function playIntro() {
    if (introPlayed) return;
    introPlayed = true;
    if (introHint) introHint.style.display = "none";
    intro.classList.add("intro--closing");

    if (prefersReducedMotion || typeof gsap === "undefined") {
      // Instant, gentle fallback
      finishIntro();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: finishIntro
    });

    // gentle float-in
    tl.fromTo(bottleWrap, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });

    // idle floating loop happens via CSS-independent gsap for a couple cycles
    tl.to(bottleWrap, { y: -14, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: 1 }, "-=0.2");

    // cork pop
    tl.to(cork(), {
      y: -70, x: 14, rotate: 35, opacity: 0, duration: 0.5, ease: "back.in(1.8)"
    }, "+=0.1");

    // golden burst
    tl.set(burstLight, { opacity: 1 })
      .to(burstLight, {
        scale: 26, opacity: 0, duration: 0.9, ease: "power2.out"
      }, "<");

    // bottle glows from within right as cork pops
    tl.to(bottleGlow(), { opacity: 0.9, duration: 0.35 }, "<");

    // scroll rises out
    tl.to(scrollEl, {
      opacity: 1, scale: 1, y: -60, duration: 0.9, ease: "power3.out"
    }, "-=0.4");

    // scroll unfurls
    tl.to(".scroll-paper", { scaleY: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.3");

    // hold, then fade whole intro to reveal site
    tl.to(intro, { opacity: 0, duration: 0.9, ease: "power2.inOut", delay: 0.9 });
  }

  function finishIntro() {
    intro.style.display = "none";
    document.body.style.overflow = "";
    revealHeaderAndHero();
    launchConfetti();
  }

  function revealHeaderAndHero() {
    if (siteHeader) siteHeader.classList.add("is-visible");
    if (typeof AOS !== "undefined") AOS.refreshHard();
  }

  // Lock scroll until intro completes
  document.body.style.overflow = "hidden";

  intro.addEventListener("click", playIntro);
  intro.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") playIntro();
  });
  intro.setAttribute("tabindex", "0");
  intro.setAttribute("role", "button");
  intro.setAttribute("aria-label", "Tap or press Enter to open your invitation");

  // Auto-play shortly after load so the experience feels alive even without interaction
  window.addEventListener("load", () => {
    setTimeout(() => { if (!introPlayed) playIntro(); }, 1600);
  });

  /* =========================================================
     4. CONFETTI BURST (lightweight canvas confetti, no deps)
     ========================================================= */
  function launchConfetti() {
    if (prefersReducedMotion) return;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;z-index:400;pointer-events:none;width:100%;height:100%;";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ["#D4AF37", "#F4E5B2", "#ffffff", "#B8892E"];
    const pieces = Array.from({ length: 90 }, () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: window.innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 9,
      vy: Math.random() * -9 - 3,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 12,
      life: 0
    }));

    let frame = 0;
    function step() {
      frame++;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = false;
      for (const p of pieces) {
        p.vy += 0.22; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life++;
        if (p.y < window.innerHeight + 20) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - p.life / 140);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        ctx.restore();
      }
      if (alive && frame < 150) {
        requestAnimationFrame(step);
      } else {
        canvas.remove();
      }
    }
    requestAnimationFrame(step);
  }

  /* =========================================================
     5. AOS INIT
     ========================================================= */
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: prefersReducedMotion
    });
  }

  /* =========================================================
     6. HEADER SCROLL STATE
     ========================================================= */
  const header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* =========================================================
     7. LIVE COUNTDOWN
     ========================================================= */
  function startCountdown() {
    const target = new Date(EVENT.dateTime).getTime();
    const els = {
      d: document.getElementById("cd-days"),
      h: document.getElementById("cd-hours"),
      m: document.getElementById("cd-minutes"),
      s: document.getElementById("cd-seconds")
    };
    if (!els.d) return;

    function pad(n) { return String(Math.max(0, n)).padStart(2, "0"); }

    function tick() {
      const now = Date.now();
      let diff = target - now;
      if (diff < 0) diff = 0;
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      els.d.textContent = pad(days);
      els.h.textContent = pad(hours);
      els.m.textContent = pad(mins);
      els.s.textContent = pad(secs);
    }
    tick();
    setInterval(tick, 1000);
  }
  startCountdown();

  /* =========================================================
     8. HERO AMBIENT PARTICLES (small floating gold flecks)
     ========================================================= */
  const heroParticles = document.querySelector(".hero__particles");
  if (heroParticles && !prefersReducedMotion) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 26; i++) {
      const dot = document.createElement("span");
      const size = Math.random() * 3 + 1;
      dot.style.cssText = `
        position:absolute; left:${Math.random() * 100}%; top:${Math.random() * 100}%;
        width:${size}px; height:${size}px; border-radius:50%;
        background: radial-gradient(circle, #F4E5B2, transparent 70%);
        opacity:${Math.random() * 0.5 + 0.2};
      `;
      frag.appendChild(dot);
      if (typeof gsap !== "undefined") {
        gsap.to(dot, {
          y: `random(-40,40)`,
          x: `random(-30,30)`,
          duration: Math.random() * 6 + 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    }
    heroParticles.appendChild(frag);
  }

  /* =========================================================
     9. RSVP FORM HANDLING
     ========================================================= */
  const rsvpForm = document.getElementById("rsvpForm");
  const formStatus = document.getElementById("formStatus");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = rsvpForm.name.value.trim();
      const attendance = rsvpForm.querySelector('input[name="attendance"]:checked');

      if (!name) {
        formStatus.textContent = "Please share your name so we know who to expect.";
        rsvpForm.name.focus();
        return;
      }
      if (!attendance) {
        formStatus.textContent = "Please let us know whether you'll be attending.";
        return;
      }

      const payload = {
        name,
        email: rsvpForm.email.value.trim(),
        phone: rsvpForm.phone.value.trim(),
        attendance: attendance.value,
        submittedAt: new Date().toISOString()
      };

      const submitBtn = rsvpForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      // 1) Always keep a local copy so admin.html can show recent RSVPs
      //    made on this device, even if the Sheet call below fails.
      try {
        const existing = JSON.parse(localStorage.getItem("talentshow_rsvps") || "[]");
        existing.push(payload);
        localStorage.setItem("talentshow_rsvps", JSON.stringify(existing));
      } catch (err) {
        /* localStorage unavailable — ignore silently */
      }

      const messages = {
        yes: `Wonderful, ${name.split(" ")[0]}! We can't wait to see you there.`,
        no: `Thank you for letting us know, ${name.split(" ")[0]}. You'll be missed!`,
        maybe: `Noted, ${name.split(" ")[0]} — we hope you can make it!`
      };

      function wrapUp() {
        formStatus.textContent = messages[payload.attendance] || "Thank you for your response!";
        rsvpForm.reset();
        showToast("RSVP received — thank you!");
        if (submitBtn) submitBtn.disabled = false;
      }

      // 2) If a Google Sheet webhook URL is configured, send it there too
      //    so every guest's response lands in one shared place.
      if (RSVP_SHEET_URL) {
        // no-cors: Apps Script web apps don't return CORS headers, so the
        // response is opaque — we simply trust the request was sent.
        fetch(RSVP_SHEET_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        })
          .catch(() => {
            showToast("Saved on this device — couldn't reach the shared sheet.");
          })
          .finally(wrapUp);
      } else {
        wrapUp();
      }
    });
  }

  /* =========================================================
     10. FLOATING CONTROLS — music, share, scroll-to-top
     ========================================================= */
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");
  if (musicToggle && bgMusic) {
    bgMusic.volume = 0.35;
    musicToggle.addEventListener("click", () => {
      const playing = musicToggle.getAttribute("aria-pressed") === "true";
      if (playing) {
        bgMusic.pause();
        musicToggle.setAttribute("aria-pressed", "false");
        musicToggle.setAttribute("aria-label", "Play background music");
        musicToggle.innerHTML = '<i class="fa-solid fa-music" aria-hidden="true"></i>';
      } else {
        bgMusic.play().catch(() => {
          showToast("Add a track at assets/audio/background-music.mp3 to enable music.");
        });
        musicToggle.setAttribute("aria-pressed", "true");
        musicToggle.setAttribute("aria-label", "Pause background music");
        musicToggle.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
      }
    });
  }

  const shareBtn = document.getElementById("shareBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const shareData = {
        title: EVENT.name,
        text: `You're invited: ${EVENT.name} — Faculty of Management Studies, Sabaragamuwa University of Sri Lanka.`,
        url: window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch (err) { /* user cancelled */ }
      } else {
        try {
          await navigator.clipboard.writeText(shareData.url);
          showToast("Invitation link copied to clipboard!");
        } catch (err) {
          showToast("Copy this page's URL to share the invitation.");
        }
      }
    });
  }

  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
    window.addEventListener("scroll", () => {
      scrollTopBtn.classList.toggle("is-visible", window.scrollY > 600);
    }, { passive: true });
  }

  /* =========================================================
     11. TOAST HELPER
     ========================================================= */
  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

})();
