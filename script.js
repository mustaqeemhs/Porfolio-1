document.addEventListener('DOMContentLoaded', function () {
  var nav = document.getElementById('mh-portfolio-nav');
  var navLinks = document.getElementById('mh-portfolio-nav-links');
  var navToggle = document.getElementById('mh-portfolio-nav-toggle');
  var engine = document.getElementById('mh-portfolio-engine');
  var hero = document.querySelector('.mh-portfolio-hero');
  var yearEl = document.getElementById('mh-portfolio-year');
  var form = document.getElementById('mh-portfolio-form');
  var formStatus = document.getElementById('mh-portfolio-form-status');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Footer year */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Sticky nav background on scroll */
  function onScroll() {
    if (window.scrollY > 30) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu toggle */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* Smooth scroll for in-page anchor links */
  document.querySelectorAll('.mh-portfolio-page a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  });

  /* Subtle mouse parallax on the engine (desktop only) */
  if (engine && hero && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    var rafId = null;
    var maxOffset = 10;

    hero.addEventListener('mousemove', function (e) {
      if (rafId) return;
      rafId = requestAnimationFrame(function () {
        var rect = hero.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width - 0.5;
        var relY = (e.clientY - rect.top) / rect.height - 0.5;
        engine.style.transform =
          'translate(' + (relX * maxOffset).toFixed(1) + 'px, ' + (relY * maxOffset).toFixed(1) + 'px)';
        rafId = null;
      });
    });

    hero.addEventListener('mouseleave', function () {
      engine.style.transform = 'translate(0, 0)';
    });
  }

  /* Scroll-triggered reveal for cards */
  var revealEls = document.querySelectorAll('.mh-portfolio-reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* Contact form — submits to Formspree without leaving the page */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var actionUrl = form.getAttribute('action');
      var submitBtn = form.querySelector('.mh-portfolio-form-submit');
      submitBtn.disabled = true;
      formStatus.textContent = 'Sending...';

      fetch(actionUrl, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            formStatus.textContent = "Thanks — I'll get back to you soon.";
            form.reset();
          } else {
            formStatus.textContent = 'Something went wrong. Please try again.';
          }
        })
        .catch(function () {
          formStatus.textContent = 'Something went wrong. Please try again.';
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  /* Mobile two-gear chamber — touch/mouse drag with inertia, plus optional
     phone-tilt motion. Rotation animation itself keeps running via CSS
     regardless of any of this; dragging/tilt only ever nudges its position. */
  var chamber = document.getElementById('mh-portfolio-chamber');
  var motionBtn = document.getElementById('mh-portfolio-motion-btn');

  if (chamber && window.PointerEvent) {
    var chamberX = 0, chamberY = 0;
    var velX = 0, velY = 0;
    var dragging = false;
    var startX = 0, startY = 0, lastX = 0, lastY = 0, lastT = 0;
    var tiltX = 0, tiltY = 0;
    var settleRaf = null;
    var maxDrag = 22;
    var maxTilt = 10;

    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }

    function renderChamber() {
      var x = clamp(chamberX + tiltX, -(maxDrag + maxTilt), maxDrag + maxTilt);
      var y = clamp(chamberY + tiltY, -(maxDrag + maxTilt), maxDrag + maxTilt);
      chamber.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    }

    function settleChamber() {
      cancelAnimationFrame(settleRaf);

      if (reduceMotion) {
        chamber.style.transition = 'transform 0.25s ease';
        chamberX = 0;
        chamberY = 0;
        velX = 0;
        velY = 0;
        renderChamber();
        return;
      }

      chamber.style.transition = 'none';
      function step() {
        chamberX = (chamberX + velX) * 0.88;
        chamberY = (chamberY + velY) * 0.88;
        velX *= 0.82;
        velY *= 0.82;
        renderChamber();
        if (Math.abs(chamberX) > 0.3 || Math.abs(chamberY) > 0.3 || Math.abs(velX) > 0.3 || Math.abs(velY) > 0.3) {
          settleRaf = requestAnimationFrame(step);
        } else {
          chamberX = 0;
          chamberY = 0;
          renderChamber();
        }
      }
      settleRaf = requestAnimationFrame(step);
    }

    chamber.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      cancelAnimationFrame(settleRaf);
      chamber.style.transition = 'none';
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = performance.now();
      try { chamber.setPointerCapture(e.pointerId); } catch (err) {}
    });

    chamber.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      chamberX = clamp(dx * 0.5, -maxDrag, maxDrag);
      chamberY = clamp(dy * 0.5, -maxDrag, maxDrag);

      var now = performance.now();
      var dt = Math.max(now - lastT, 1);
      velX = ((e.clientX - lastX) / dt) * 6;
      velY = ((e.clientY - lastY) / dt) * 6;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;

      renderChamber();
    });

    function endChamberDrag() {
      if (!dragging) return;
      dragging = false;
      settleChamber();
    }

    chamber.addEventListener('pointerup', endChamberDrag);
    chamber.addEventListener('pointercancel', endChamberDrag);
    chamber.addEventListener('pointerleave', function () {
      if (dragging) endChamberDrag();
    });

    /* Optional enhancement: subtle phone-tilt movement. Normal rotation and
       touch dragging above both work fully without this. */
    function onOrientation(e) {
      if (dragging || reduceMotion || e.beta === null || e.gamma === null) return;
      var gamma = clamp(e.gamma, -30, 30);
      var beta = clamp(e.beta - 40, -30, 30); // ~40° = a natural phone-holding angle, treated as neutral
      tiltX = (gamma / 30) * maxTilt;
      tiltY = (beta / 30) * maxTilt;
      renderChamber();
    }

    var hasOrientation = typeof window.DeviceOrientationEvent !== 'undefined';
    var needsPermission = hasOrientation && typeof DeviceOrientationEvent.requestPermission === 'function';

    if (hasOrientation && !needsPermission) {
      /* Android and other browsers that don't gate this behind a permission prompt */
      window.addEventListener('deviceorientation', onOrientation);
    } else if (needsPermission && motionBtn) {
      /* iOS 13+: permission may only be requested from within a user gesture,
         and is never requested automatically on page load. */
      motionBtn.hidden = false;
      motionBtn.addEventListener('click', function () {
        DeviceOrientationEvent.requestPermission()
          .then(function (state) {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', onOrientation);
            }
          })
          .catch(function () {
            /* Denied, blocked, or unsupported — fall back silently to
               normal rotation + touch dragging, no error shown. */
          })
          .finally(function () {
            motionBtn.hidden = true;
          });
      });
    }
  }

  /* Certificate modal */
  var certModal = document.getElementById('mh-portfolio-cert-modal');
  var certButtons = Array.prototype.slice.call(document.querySelectorAll('.mh-portfolio-cert-view'));

  if (certModal && certButtons.length) {
    var certModalImg = document.getElementById('mh-portfolio-cert-modal-img');
    var certModalTitle = document.getElementById('mh-portfolio-cert-modal-title');
    var certModalMeta = document.getElementById('mh-portfolio-cert-modal-meta');
    var certPrevBtn = document.getElementById('mh-portfolio-cert-prev');
    var certNextBtn = document.getElementById('mh-portfolio-cert-next');
    var certCloseEls = certModal.querySelectorAll('[data-cert-close]');
    var certIndex = 0;
    var lastFocusedEl = null;

    function openCertAt(index) {
      certIndex = (index + certButtons.length) % certButtons.length;
      var btn = certButtons[certIndex];
      certModalImg.src = btn.getAttribute('data-cert-img') || '';
      certModalImg.alt = btn.getAttribute('data-cert-title') || 'Certificate';
      certModalTitle.textContent = btn.getAttribute('data-cert-title') || '';
      certModalMeta.textContent = [btn.getAttribute('data-cert-org'), btn.getAttribute('data-cert-year')].filter(Boolean).join(' · ');

      var multiple = certButtons.length > 1;
      certPrevBtn.hidden = !multiple;
      certNextBtn.hidden = !multiple;
    }

    function openCertModal(index) {
      lastFocusedEl = document.activeElement;
      openCertAt(index);
      certModal.hidden = false;
      document.body.style.overflow = 'hidden';
      certModal.querySelector('.mh-portfolio-cert-modal__close').focus();
      document.addEventListener('keydown', onCertKeydown);
    }

    function closeCertModal() {
      certModal.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onCertKeydown);
      if (lastFocusedEl) lastFocusedEl.focus();
    }

    function onCertKeydown(e) {
      if (e.key === 'Escape') {
        closeCertModal();
      } else if (e.key === 'ArrowRight') {
        openCertAt(certIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        openCertAt(certIndex - 1);
      }
    }

    certButtons.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        openCertModal(i);
      });
    });

    certCloseEls.forEach(function (el) {
      el.addEventListener('click', closeCertModal);
    });

    certPrevBtn.addEventListener('click', function () { openCertAt(certIndex - 1); });
    certNextBtn.addEventListener('click', function () { openCertAt(certIndex + 1); });
  }
});
