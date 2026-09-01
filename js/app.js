/* ============================================================
   MOCKHARD — Shared Application Utilities
   Navigation, theme toggle, toast notifications, scroll effects,
   and helpers used across all pages.
   ============================================================ */

const MockApp = (() => {
  // ────────────────────────────────────────
  // INITIALIZATION
  // ────────────────────────────────────────
  function init() {
    initTheme();
    initNavbar();
    initScrollEffects();
    initAnimations();
    initModalDismiss();
  }

  function initModalDismiss() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
      }
    });
  }

  // ────────────────────────────────────────
  // THEME
  // ────────────────────────────────────────
  function initTheme() {
    const theme = MockStorage.getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const newTheme = MockStorage.toggleTheme();
        updateThemeIcon(newTheme);
      });
    }
  }

  function updateThemeIcon(theme) {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }

  // ────────────────────────────────────────
  // NAVBAR
  // ────────────────────────────────────────
  function initNavbar() {
    const hamburger = document.getElementById('navHamburger');
    const links = document.getElementById('navLinks');
    const overlay = document.getElementById('navOverlay');

    if (hamburger && links) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        links.classList.toggle('mobile-open');
        if (overlay) overlay.classList.toggle('active');
        document.body.style.overflow = links.classList.contains('mobile-open') ? 'hidden' : '';
      });

      // Close on overlay click
      if (overlay) {
        overlay.addEventListener('click', () => {
          hamburger.classList.remove('active');
          links.classList.remove('mobile-open');
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        });
      }

      // Close on nav link click (mobile)
      links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
            hamburger.classList.remove('active');
            links.classList.remove('mobile-open');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
          }
        });
      });
    }

    // Set active nav link
    setActiveNavLink();
  }

  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // ────────────────────────────────────────
  // SCROLL EFFECTS
  // ────────────────────────────────────────
  function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ────────────────────────────────────────
  // SCROLL ANIMATIONS (Intersection Observer)
  // ────────────────────────────────────────
  function initAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // ────────────────────────────────────────
  // TOAST NOTIFICATIONS
  // ────────────────────────────────────────
  function showToast(message, type = 'info', duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    `;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ────────────────────────────────────────
  // MODAL
  // ────────────────────────────────────────
  function showModal({ title, body, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, confirmClass = 'btn-primary' }) {
    // Remove existing modal
    const existing = document.getElementById('appModal');
    if (existing) existing.remove();
    const existingBackdrop = document.getElementById('appModalBackdrop');
    if (existingBackdrop) existingBackdrop.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'appModalBackdrop';
    backdrop.className = 'modal-backdrop';

    const modal = document.createElement('div');
    modal.id = 'appModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <h3 class="modal-title">${title}</h3>
      <div class="modal-body">${body}</div>
      <div class="modal-actions">
        <button class="btn btn-ghost modal-cancel">${cancelText}</button>
        <button class="btn ${confirmClass} modal-confirm">${confirmText}</button>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    // Animate in
    requestAnimationFrame(() => {
      backdrop.classList.add('active');
      modal.classList.add('active');
    });

    function close() {
      backdrop.classList.remove('active');
      modal.classList.remove('active');
      setTimeout(() => {
        backdrop.remove();
        modal.remove();
      }, 300);
    }

    modal.querySelector('.modal-confirm').addEventListener('click', () => {
      close();
      if (onConfirm) onConfirm();
    });

    modal.querySelector('.modal-cancel').addEventListener('click', () => {
      close();
      if (onCancel) onCancel();
    });

    backdrop.addEventListener('click', () => {
      close();
      if (onCancel) onCancel();
    });
  }

  function closeModal() {
    const backdrop = document.getElementById('appModalBackdrop');
    const modal = document.getElementById('appModal');
    if (backdrop) {
      backdrop.classList.remove('active');
      setTimeout(() => backdrop.remove(), 300);
    }
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }
  }

  // ────────────────────────────────────────
  // HELPERS
  // ────────────────────────────────────────
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  function formatTimeAgo(isoString) {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(isoString);
  }

  function getPerformanceBadge(percentage) {
    if (percentage >= 80) return { text: 'Excellent', class: 'excellent' };
    if (percentage >= 60) return { text: 'Good', class: 'good' };
    if (percentage >= 40) return { text: 'Average', class: 'average' };
    return { text: 'Needs Practice', class: 'poor' };
  }

  function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Get URL parameters
  function getParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
  }

  // Animated counter (for stats)
  function animateCounter(element, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      element.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ── Public API ──
  return {
    init,
    showToast,
    showModal,
    closeModal,
    formatTime,
    formatDate,
    formatTimeAgo,
    getPerformanceBadge,
    shuffleArray,
    getParams,
    animateCounter,
  };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', MockApp.init);
