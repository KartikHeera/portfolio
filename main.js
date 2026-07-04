/* =========================================================
   ANIMATED ANIME-CYBERPUNK BACKGROUND (canvas)
   - Perspective grid "digital horizon"
   - Falling katakana / glyph rain (pink + cyan)
   - Occasional glitch flash
========================================================= */
(function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.width = window.innerWidth * dpr;
    height = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const horizonY = () => window.innerHeight * 0.6;
  let gridOffset = 0;
  let flashTimer = 0;
  let flashAlpha = 0;

  // katakana + symbol rain
  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789#$%&';
  const columns = [];
  function setupColumns() {
    columns.length = 0;
    const count = Math.floor(window.innerWidth / 28);
    for (let i = 0; i < count; i++) {
      columns.push({
        x: i * 28 + 12,
        y: Math.random() * -window.innerHeight,
        speed: 0.7 + Math.random() * 2.0,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        pink: Math.random() < 0.4
      });
    }
  }
  setupColumns();
  window.addEventListener('resize', setupColumns);

  function drawGrid(w, h) {
    const hz = horizonY();
    ctx.save();

    // glow band near horizon
    const grad = ctx.createLinearGradient(0, hz - 160, 0, hz + 10);
    grad.addColorStop(0, 'rgba(123,47,247,0)');
    grad.addColorStop(1, 'rgba(255,32,121,0.10)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, hz - 160, w, 170);

    // horizon line
    ctx.strokeStyle = 'rgba(255,32,121,0.6)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(255,32,121,0.85)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(0, hz);
    ctx.lineTo(w, hz);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // perspective verticals
    const vanishX = w / 2;
    const spread = w * 0.95;
    const lineCount = 16;
    ctx.lineWidth = 1;
    for (let i = -lineCount; i <= lineCount; i++) {
      const startX = vanishX + (i / lineCount) * spread;
      const alpha = 0.14 - Math.abs(i / lineCount) * 0.06;
      ctx.strokeStyle = `rgba(23,242,255,${Math.max(alpha, 0.04)})`;
      ctx.beginPath();
      ctx.moveTo(vanishX, hz);
      ctx.lineTo(startX, h);
      ctx.stroke();
    }

    // moving horizontal grid rows below horizon
    const rows = 14;
    for (let j = 0; j < rows; j++) {
      const t = (j + (gridOffset % 1)) / rows;
      const y = hz + Math.pow(t, 2.6) * (h - hz);
      if (y > h) continue;
      const alpha = 0.2 * (1 - t);
      ctx.strokeStyle = `rgba(23,242,255,${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawRain(w, h) {
    ctx.font = '16px "Share Tech Mono", monospace';
    const hz = horizonY();
    columns.forEach(col => {
      col.y += col.speed;
      if (col.y > h + 20) {
        col.y = -20;
        col.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        col.pink = Math.random() < 0.4;
      }
      if (Math.random() < 0.02) col.char = CHARS[Math.floor(Math.random() * CHARS.length)];

      const nearHorizon = col.y > hz - 60 && col.y < hz + 40;
      const alpha = nearHorizon ? 0.55 : 0.18;
      ctx.fillStyle = col.pink
        ? `rgba(255,32,121,${alpha})`
        : `rgba(23,242,255,${alpha})`;
      ctx.fillText(col.char, col.x, col.y);
    });
  }

  function maybeGlitchFlash(w, h) {
    flashTimer -= 1;
    if (flashTimer <= 0 && Math.random() < 0.003) {
      flashTimer = 6;
      flashAlpha = 0.08;
    }
    if (flashAlpha > 0) {
      ctx.fillStyle = `rgba(23,242,255,${flashAlpha})`;
      ctx.fillRect(0, 0, w, h);
      flashAlpha -= 0.02;
    }
  }

  function frame() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    drawGrid(w, h);
    drawRain(w, h);
    maybeGlitchFlash(w, h);
    gridOffset += 0.0032;
    if (!prefersReducedMotion) requestAnimationFrame(frame);
  }

  frame();
  if (prefersReducedMotion) {
    setInterval(() => {
      const w = window.innerWidth, h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      drawGrid(w, h);
    }, 4000);
  }
})();

/* =========================================================
   TYPED ROLE TEXT
========================================================= */
(function typedRole() {
  const el = document.getElementById('typedRole');
  if (!el) return;
  const roles = [
    'Software Engineer',
    'Backend & API Specialist',
    'Full-Stack Developer',
    'Distributed Systems Enthusiast'
  ];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1500);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 70);
  }
  tick();
})();

/* =========================================================
   NAV: scroll state + mobile toggle
========================================================= */
(function navBehavior() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 40
      ? 'rgba(255,32,121,0.5)'
      : 'var(--border)';
  });

  toggle.addEventListener('click', () => {
    links.classList.toggle('is-open');
    toggle.classList.toggle('is-active');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('is-open'));
  });
})();

/* =========================================================
   SCROLL REVEAL
========================================================= */
(function scrollReveal() {
  const targets = document.querySelectorAll(
    '.section-tag, .section-title, .about-grid, .skills-grid, .tag-cloud, .timeline-item, .project-card, .edu-card, .contact-grid'
  );
  targets.forEach(t => t.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(t => io.observe(t));
})();

/* =========================================================
   SKILL BARS: animate width on reveal
========================================================= */
(function skillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const level = bar.getAttribute('data-level') || '0';
        const inner = bar.querySelector('.bar i');
        requestAnimationFrame(() => { inner.style.width = level + '%'; });
        io.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => io.observe(b));
})();

/* =========================================================
   STAT COUNTERS
========================================================= */
(function statCounters() {
  const stats = document.querySelectorAll('.stat-num');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 1400;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  stats.forEach(s => io.observe(s));
})();

/* =========================================================
   CONTACT FORM (front-end only demo handling)
========================================================= */
(function contactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '> transmitting message...';
    setTimeout(() => {
      status.textContent = '> message sent. I\'ll respond within 24-48 hrs.';
      form.reset();
    }, 900);
  });
})();

/* =========================================================
   FOOTER YEAR
========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();
/* ==========================================
   ONE PIECE STRAW HAT CURSOR
========================================== */

const hat = document.querySelector(".cursor-hat");
const glow = document.querySelector(".cursor-glow");

if (hat && glow) {

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let glowX = mouseX;
    let glowY = mouseY;

    // Move hat instantly
    document.addEventListener("mousemove", (e) => {

        mouseX = e.clientX;
        mouseY = e.clientY;

        hat.style.left = mouseX + "px";
        hat.style.top = mouseY + "px";

    });

    // Smooth glow follows cursor
    function animateGlow() {

        glowX += (mouseX - glowX) * 0.18;
        glowY += (mouseY - glowY) * 0.18;

        glow.style.left = glowX + "px";
        glow.style.top = glowY + "px";

        requestAnimationFrame(animateGlow);

    }

    animateGlow();

    // Hover animation
    document.querySelectorAll("a, button, .btn-sticker, input, textarea").forEach(el => {

        el.addEventListener("mouseenter", () => {
            hat.classList.add("cursor-hover");
        });

        el.addEventListener("mouseleave", () => {
            hat.classList.remove("cursor-hover");
        });

    });

    // Click animation
    document.addEventListener("mousedown", () => {
        hat.classList.add("cursor-click");
    });

    document.addEventListener("mouseup", () => {
        hat.classList.remove("cursor-click");
    });

    // Hide cursor when mouse leaves window
    document.addEventListener("mouseleave", () => {
        hat.style.opacity = "0";
        glow.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
        hat.style.opacity = "1";
        glow.style.opacity = "0.8";
    });

}