/* ==========================================================================
   MISA BOT — Showcase Micro-Animations & Interaction Script
   Theme: Death Note / Misa Amane Dark Gothic
   Includes Mobile Hamburger Menu & Smooth Drawer Navigation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollObserver();
  initNavbarScrollState();
  initSmoothScroll();
  initMouseGlowEffect();
  initCounterAnimation();
});

/**
 * Mobile Hamburger Menu Toggle & Close Handlers
 */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-actions a');

  if (!hamburgerBtn || !mobileMenu) return;

  function toggleMenu() {
    hamburgerBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  }

  function closeMenu() {
    hamburgerBtn.classList.remove('active');
    mobileMenu.classList.remove('open');
  }

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close when clicking outside header
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      closeMenu();
    }
  });
}

/**
 * Pure JavaScript IntersectionObserver for Staggered Scroll Animations
 * Supports .reveal, .reveal-left, .reveal-right, .reveal-scale
 */
function initScrollObserver() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Navbar Scrolled Visual State
 */
function initNavbarScrollState() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/**
 * Smooth Scroll handling for internal navigation links
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Subtle mouse cursor light tracking on gothic cards
 */
function initMouseGlowEffect() {
  const cards = document.querySelectorAll('.feature-card, .arch-card, .about-card, .misa-avatar-card, .tech-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * Animated metric number counters on scroll
 */
function initCounterAnimation() {
  const counterElements = document.querySelectorAll('.metric-value[data-count]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetNumber = parseInt(el.getAttribute('data-count'), 10);
        let currentNumber = 0;
        const duration = 1500;
        const increment = Math.ceil(targetNumber / (duration / 16));

        const counterInterval = setInterval(() => {
          currentNumber += increment;
          if (currentNumber >= targetNumber) {
            el.textContent = targetNumber + '+';
            clearInterval(counterInterval);
          } else {
            el.textContent = currentNumber + '+';
          }
        }, 16);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
}
