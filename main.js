/* =========================================================
   CUSTOM CYBERPUNK CURSOR
========================================================= */
(function customCursor() {
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!isFinePointer) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // smooth trailing ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // enlarge ring over interactive elements
  const hoverTargets = 'a, button, input, textarea, .skill-bar, .project-card, .contact-link';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.add('is-hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('is-hovering');
  });

  document.addEventListener('mousedown', () => ring.classList.add('is-clicking'));
  document.addEventListener('mouseup', () => ring.classList.remove('is-clicking'));

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();

/* =========================================================
   ANIMATED ANIME-CYBERPUNK BACKGROUND (canvas)
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

    const grad = ctx.createLinearGradient(0, hz - 160, 0, hz + 10);
    grad.addColorStop(0, 'rgba(123,47,247,0)');
    grad.addColorStop(1, 'rgba(255,32,121,0.10)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, hz - 160, w, 170);

    ctx.strokeStyle = 'rgba(255,32,121,0.6)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(255,32,121,0.85)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(0, hz);
    ctx.lineTo(w, hz);
    ctx.stroke();
    ctx.shadowBlur = 0;

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
      ctx.fillStyle = col.pink ? `rgba(255,32,121,${alpha})` : `rgba(23,242,255,${alpha})`;
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
    'B.Tech CSE Student',
    'Aspiring Software Engineer',
    'Java Developer',
    'Software Analyst (Fresher)'
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
    navbar.style.borderBottomColor = window.scrollY > 40 ? 'rgba(255,32,121,0.5)' : 'var(--border)';
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
   SKILL BARS
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
   CONTACT FORM — submits to Formspree so messages land in
   your real inbox. Replace YOUR_FORM_ID in index.html first.
========================================================= */
(function contactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (form.action.includes('YOUR_FORM_ID')) {
      status.textContent = '> form not connected yet — replace YOUR_FORM_ID in index.html with your Formspree form ID.';
      status.className = 'form-status mono error';
      return;
    }

    status.textContent = '> transmitting message...';
    status.className = 'form-status mono pending';
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        status.textContent = "> message sent. I'll respond within 24-48 hrs.";
        status.className = 'form-status mono success';
        form.reset();
      } else {
        status.textContent = '> something went wrong. Please try again or email me directly.';
        status.className = 'form-status mono error';
      }
    } catch (err) {
      status.textContent = '> network error. Please try again or email me directly.';
      status.className = 'form-status mono error';
    } finally {
      submitBtn.disabled = false;
    }
  });
})();

/* =========================================================
   FOOTER YEAR
========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();