/* ===== Bala Tripura Solutions — Main Script ===== */

document.addEventListener('DOMContentLoaded', () => {
  // ——— Preloader ———
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader?.classList.add('hidden'), 400);
  });
  // Fallback in case 'load' already fired
  if (document.readyState === 'complete') {
    setTimeout(() => preloader?.classList.add('hidden'), 400);
  }

  // ——— Navbar scroll effect ———
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ——— Mobile menu toggle ———
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = navLinks.querySelectorAll('a');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(navLinks.classList.contains('open')));
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ——— Active nav link on scroll ———
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.navbar__link');

  const activateLink = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.navbar__link[href="#${id}"]`);
        active?.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', activateLink, { passive: true });
  activateLink();

  // ——— Scroll reveal ———
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach(el => observer.observe(el));

  // ——— Animated counters ———
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCount(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(el => counterObserver.observe(el));

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    const tick = now => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ——— Back to top ———
  const backToTop = document.getElementById('backToTop');
  const toggleBackToTop = () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };
  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ——— Contact form ———
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');
  const submitButton = document.getElementById('form-submit-btn');

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    formError.textContent = '';
    formError.classList.remove('show');
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not submit your booking. Please try again.');

      form.reset();
      formSuccess.classList.remove('show');
      void formSuccess.offsetWidth;
      formSuccess.classList.add('show');
      window.setTimeout(() => formSuccess.classList.remove('show'), 8000);
    } catch (error) {
      formError.textContent = error instanceof TypeError
        ? 'Unable to reach the booking service. Please check your connection and try again.'
        : error.message;
      formError.classList.add('show');
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
    }
  });

  // ——— Smooth scroll for anchor links ———
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ——— Parallax on hero orbs (desktop only) ———
  if (window.matchMedia('(min-width: 1024px)').matches) {
    const orbs = document.querySelectorAll('.hero__orb');
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.5;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    }, { passive: true });
  }

  // ——— Typing effect on hero badge ———
  const badge = document.querySelector('.hero__badge-text');
  if (badge) {
    const text = badge.textContent;
    badge.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        badge.textContent += text[i];
        i++;
        setTimeout(type, 40);
      }
    };
    setTimeout(type, 800);
  }
});
