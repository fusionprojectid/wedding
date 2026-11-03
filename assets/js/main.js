/**
 * MAIN INTERACTIVITY & CORE LOGIC
 * Digital Wedding Invitation - fusionproject.id
 */

// Global Toast System
window.showToast = function (message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.getElementById('welcome-screen');
  const openBtn = document.getElementById('open-btn');
  const guestNameEl = document.getElementById('guest-name');
  const rsvpNameInput = document.getElementById('rsvp-name');
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  const bottomNav = document.getElementById('bottom-nav');

  // Lock scroll initially until invitation is opened
  document.body.classList.add('locked');

  // 1. Read Guest Name from URL (?to=Nama+Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const toParam = urlParams.get('to');
  if (toParam) {
    try {
      const formattedName = decodeURIComponent(toParam.replace(/\+/g, ' '));
      if (guestNameEl) guestNameEl.textContent = formattedName;
      if (rsvpNameInput) rsvpNameInput.value = formattedName;
    } catch (e) {
      console.warn('Error decoding guest name parameter:', e);
    }
  }

  // 2. Open Invitation Button
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      // Audio Autoplay on user gesture
      if (bgMusic) {
        bgMusic.play().then(() => {
          if (musicBtn) musicBtn.classList.add('playing');
        }).catch(err => {
          console.warn('Audio autoplay blocked or failed:', err);
        });
      }

      // Unlock Screen
      if (welcomeScreen) {
        welcomeScreen.classList.add('opened');
        // Hide welcome screen completely after animation finishes to prevent touch interception
        setTimeout(() => {
          welcomeScreen.style.display = 'none';
        }, 900);
      }
      document.body.classList.remove('locked');

      // Show bottom navigation
      if (bottomNav) {
        bottomNav.classList.add('visible');
      }

      // Smooth scroll to hero section
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 3. Background Music Toggle
  if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          musicBtn.classList.add('playing');
          musicBtn.innerHTML = '<i class="fas fa-compact-disc"></i>';
        });
      } else {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
  }

  // 4. Copy to Clipboard (Bank Account, Address, etc.)
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', () => {
      const textToCopy = button.getAttribute('data-copy');
      const label = button.getAttribute('data-label') || 'Teks';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          window.showToast(`${label} berhasil disalin!`);
        }).catch(() => {
          fallbackCopyText(textToCopy, label);
        });
      } else {
        fallbackCopyText(textToCopy, label);
      }
    });
  });

  function fallbackCopyText(text, label) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      window.showToast(`${label} berhasil disalin!`);
    } catch (e) {
      window.showToast('Gagal menyalin teks.');
    }
    document.body.removeChild(textarea);
  }

  // 5. ScrollSpy & Navigation Active State
  const sections = document.querySelectorAll('section[id], div[id="hero"]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    let scrollPos = window.scrollY || document.documentElement.scrollTop;
    if (window.innerWidth >= 992) {
      const siteWrapper = document.querySelector('.site-wrapper');
      if (siteWrapper) scrollPos = siteWrapper.scrollTop;
    }

    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  const siteWrapper = document.querySelector('.site-wrapper');
  if (siteWrapper) {
    siteWrapper.addEventListener('scroll', onScroll, { passive: true });
  }

  // 6. Smooth Scroll for Nav Links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 7. Scroll Reveal Animation (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
});
