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
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
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
});
