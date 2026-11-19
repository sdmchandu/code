/**
 * ============================================================================
 * CHANDANA - PERSONAL DEVELOPER PORTFOLIO
 * Modular Client-Side Interactions (Vanilla JavaScript)
 * Target: Poornaprajna Institute of Management (PIM), Udupi
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Mode with LocalStorage Sync)
  // Default Appearance Mode: Light Theme (per student's preference)
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'chandana_portfolio_theme';
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark') {
      setTheme('dark');
    } else if (savedTheme === 'light') {
      setTheme('light');
    } else {
      // Default to Light Theme
      setTheme('light');
    }
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('title', 'Switch to light theme');
        themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
      }
    } else {
      htmlElement.setAttribute('data-theme', 'light');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('title', 'Switch to dark theme');
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
      }
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  initTheme();

  // --------------------------------------------------------------------------
  // 2. Mobile Drawer Navigation
  // --------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.add('active');
    drawerBackdrop.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileToggleBtn) {
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileToggleBtn) {
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', openDrawer);
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeDrawer();
    });
  });

  // --------------------------------------------------------------------------
  // 3. Active Link Scroll-Spy & Sticky Header Blur
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');
  const siteHeader = document.getElementById('header');

  function updateActiveSection() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });

        mobileNavLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });

    // Sticky header shadow addition on scroll
    if (siteHeader) {
      if (window.scrollY > 20) {
        siteHeader.style.boxShadow = 'var(--shadow-sm)';
      } else {
        siteHeader.style.boxShadow = 'none';
      }
    }
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();

  // --------------------------------------------------------------------------
  // 4. Project Filtering Tabs
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filterValue = btn.getAttribute('data-filter');

      // Update active state
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards
      projectCards.forEach(function (card) {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. Toast Notification System
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message, duration = 3000) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, duration);
  }

  // --------------------------------------------------------------------------
  // 6. One-Click Copy to Clipboard (Email & Phone)
  // --------------------------------------------------------------------------
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(
          function () {
            showToast('Copied "' + textToCopy + '" to clipboard!');
          },
          function () {
            fallbackCopyText(textToCopy);
          }
        );
      } else {
        fallbackCopyText(textToCopy);
      }
    });
  });

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('Copied "' + text + '" to clipboard!');
    } catch (err) {
      showToast('Could not auto-copy. Please copy manually: ' + text);
    }
    document.body.removeChild(textArea);
  }

  // --------------------------------------------------------------------------
  // 7. Interactive Resume Modal & Direct Printing
  // --------------------------------------------------------------------------
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const mobileResumeBtn = document.getElementById('mobile-resume-btn');
  const heroResumeTrigger = document.getElementById('hero-resume-trigger');
  const closeResumeBtn = document.getElementById('close-resume-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  function openResume() {
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeResumeBtn) {
      closeResumeBtn.focus();
    }
  }

  function closeResume() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openResumeBtn) openResumeBtn.addEventListener('click', openResume);
  if (mobileResumeBtn) {
    mobileResumeBtn.addEventListener('click', function () {
      closeDrawer();
      openResume();
    });
  }
  if (heroResumeTrigger) heroResumeTrigger.addEventListener('click', openResume);
  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);

  if (resumeModal) {
    resumeModal.addEventListener('click', function (e) {
      if (e.target === resumeModal) {
        closeResume();
      }
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', function () {
      window.print();
    });
  }

  // Global Escape key listener to close active overlays
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (resumeModal && resumeModal.classList.contains('active')) {
        closeResume();
      }
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        closeDrawer();
      }
    }
  });

  // --------------------------------------------------------------------------
  // 8. Contact Form Validation & Pre-filled Mailto Trigger
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('sender-name');
      const emailInput = document.getElementById('sender-email');
      const subjectInput = document.getElementById('message-subject');
      const bodyInput = document.getElementById('message-body');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        subjectInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        subjectInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Message Body
      if (!bodyInput.value.trim()) {
        bodyInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        bodyInput.closest('.form-group').classList.remove('has-error');
      }

      if (isValid) {
        const recipient = 'c24800293@gmail.com';
        const subject = encodeURIComponent(subjectInput.value.trim());
        const bodyContent =
          'Hello Chandana,\n\n' +
          bodyInput.value.trim() +
          '\n\nBest regards,\n' +
          nameInput.value.trim() +
          '\n' +
          emailInput.value.trim();

        const mailtoUrl =
          'mailto:' + recipient + '?subject=' + subject + '&body=' + encodeURIComponent(bodyContent);

        showToast('Opening your email client to send message...');

        // Trigger email client
        window.location.href = mailtoUrl;

        // Reset form
        contactForm.reset();
      }
    });

    // Remove errors on input change
    contactForm.querySelectorAll('.form-input, .form-textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        input.closest('.form-group').classList.remove('has-error');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Back To Top Floating Trigger
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      },
      { passive: true }
    );

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. Dynamic Current Year in Footer
  // --------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
})();
