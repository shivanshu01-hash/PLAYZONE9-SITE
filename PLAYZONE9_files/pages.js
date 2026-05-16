/* ============================================================
   PLAYZONE9 — Shared Page JavaScript
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile Navigation Toggle ─────────────────────────── */
  const hamburger = document.querySelector('.pz-hamburger');
  const navLinks = document.querySelector('.pz-topnav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = hamburger.querySelector('i');
      if (navLinks.classList.contains('open')) {
        icon.classList.replace('fa-bars', 'fa-times');
      } else {
        icon.classList.replace('fa-times', 'fa-bars');
      }
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = hamburger.querySelector('i');
        icon.classList.replace('fa-times', 'fa-bars');
      });
    });
  }

  /* ── Footer Mobile Toggle ─────────────────────────────── */
  const footerToggle = document.querySelector('.pz-footer-toggle');
  const footerLinks = document.querySelector('.pz-footer-links');
  if (footerToggle && footerLinks) {
    footerToggle.addEventListener('click', () => {
      footerToggle.classList.toggle('open');
      footerLinks.classList.toggle('open');
    });
  }

  /* ── FAQ Accordion ────────────────────────────────────── */
  document.querySelectorAll('.pz-faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.pz-faq-item');
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.pz-faq-item').forEach(i => i.classList.remove('open'));
      // Toggle current
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ── Scroll Fade-in Animation ─────────────────────────── */
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('pz-fade-in');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll('.pz-animate').forEach(el => fadeObserver.observe(el));

  /* ── Contact Form Handler ─────────────────────────────── */
  const contactForm = document.getElementById('pz-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = '#10b981';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        contactForm.reset();
      }, 2500);
    });
  }

  /* ── Playinexchange Login Form ────────────────────────── */
  const plForm = document.getElementById('pz-playin-login-form');
  if (plForm) {
    plForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = plForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      // Simulate login
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        alert('Login functionality will be connected to the backend.');
      }, 1500);
    });
  }

  /* ── Active nav link highlight ────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';
  document.querySelectorAll('.pz-topnav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

});
