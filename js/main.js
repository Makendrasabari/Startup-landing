/**
 * STACKLY — Main Website Interactivity & Animations
 * Handles: Preloader, GSAP animations, Navbar, Architecture tabs,
 * Statistics counter, Testimonials filter, Contact validation & Floating hub.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initPreloader();
  initStickyHeader();
  initMobileMenu();
  initArchitectureTabs();
  initStatsCounter();
  initTestimonialFilter();
  initContactForm();
  initNewsletterForm();
  initFloatingHub();
  initHeroSlider();
  initHeroBgSlider();
  initRightSlideTextAnimations();
  initLiveTelemetryNumbers();
  initCardsShuffleAnimation();
  initLocationsShuffleAnimation();
  initPricingShuffleAnimation();
  initBlogFeaturedSplitJoin();
  initBlogCardsShuffleAnimation();
  initWhitepapersAnimation();
  initCustomDropdowns();
  initContactPageAnimations();
  initTeamMarquee();
});

/* ==========================================================================
   0. NATIVE HARDWARE-ACCELERATED SMOOTH SCROLLING
   Fluid 60/120fps native scrolling with anchor targeting & header compensation
   ========================================================================== */
function initSmoothScroll() {
  // Ensure native smooth scrolling is enabled on root document
  document.documentElement.style.scrollBehavior = 'smooth';

  // Smooth anchor link scrolling with fixed header offset compensation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 70;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Back to top smooth button action
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================================================
   1. PRELOADER
   Black & White elegant logo animation with safety auto-dismiss
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.querySelector('.preloader-bar');
  if (!preloader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 25) + 15;
    if (progress > 100) progress = 100;
    if (progressBar) progressBar.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 300);
    }
  }, 100);

  // Hard safety timeout: dismiss after 2.0 seconds max so user is never blocked
  setTimeout(() => {
    if (!preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
    }
  }, 2000);
}

/* ==========================================================================
   2. STICKY HEADER & SCROLL SPY
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   3. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav .btn, .mobile-nav-cta');
  const closeBtn = document.querySelector('.mobile-nav-close') || document.getElementById('mobileNavClose');

  if (!toggleBtn || !mobileNav) return;

  const closeMenu = () => {
    toggleBtn.classList.remove('active');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    toggleBtn.classList.add('active');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const toggle = () => {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  toggleBtn.addEventListener('click', toggle);

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Close when clicking nav links or CTAs
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close when viewport resized back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   4. ARCHITECTURE / SHOWCASE TABS
   ========================================================================== */
function initArchitectureTabs() {
  const tabBtns = document.querySelectorAll('.showcase-tab');
  const panels = document.querySelectorAll('.showcase-panel');

  if (!tabBtns.length || !panels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. STATISTICS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  let animated = false;

  const runCounter = () => {
    statNumbers.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentVal = target * easeProgress;

        el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runCounter();
      } else if (!entry.isIntersecting) {
        animated = false;
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   6. TESTIMONIALS FILTER
   ========================================================================== */
function initTestimonialFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.testimonial-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. CONTACT FORM VALIDATION, RESET & BFCACHE LIFECYCLE
   ========================================================================== */
function resetContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Reset standard HTML form fields
  form.reset();

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const msgInput = document.getElementById('contactMessage');
  const emailErrorSpan = document.getElementById('contactEmailError');

  if (nameInput) {
    nameInput.value = '';
    nameInput.classList.remove('invalid');
  }
  if (emailInput) {
    emailInput.value = '';
    emailInput.classList.remove('invalid');
  }
  if (msgInput) {
    msgInput.value = '';
    msgInput.classList.remove('invalid');
  }
  if (emailErrorSpan) {
    emailErrorSpan.textContent = 'Please enter the email';
  }

  // Clear all invalid classes and error states
  form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

  // Reset custom dropdown 1: Primary Architecture Need
  const interestInput = document.getElementById('contactInterestInput');
  const interestTriggerText = document.querySelector('#interestTrigger .custom-select-selected-value');
  const interestOptions = document.querySelectorAll('#interestSelectWrapper .custom-select-option');
  if (interestInput) interestInput.value = 'multi-cloud';
  if (interestTriggerText) interestTriggerText.textContent = 'Autonomous Multi-Cloud Kubernetes Orchestration';
  interestOptions.forEach(opt => {
    const isDefault = opt.getAttribute('data-value') === 'multi-cloud';
    opt.classList.toggle('is-selected', isDefault);
    opt.setAttribute('aria-selected', isDefault ? 'true' : 'false');
  });

  // Reset custom dropdown 2: Monthly Cloud Spend
  const spendInput = document.getElementById('contactPodsInput');
  const spendTriggerText = document.querySelector('#spendTrigger .custom-select-selected-value');
  const spendOptions = document.querySelectorAll('#spendSelectWrapper .custom-select-option');
  if (spendInput) spendInput.value = 'seed';
  if (spendTriggerText) spendTriggerText.textContent = '< $5,000 / month (Seed)';
  spendOptions.forEach(opt => {
    const isDefault = opt.getAttribute('data-value') === 'seed';
    opt.classList.toggle('is-selected', isDefault);
    opt.setAttribute('aria-selected', isDefault ? 'true' : 'false');
  });

  // Restore Submit button to active default state
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <span>Submit Priority Request</span>
      <span class="btn-icon-right">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </span>
    `;
  }
}

// Ensure form is fresh on normal load and on browser Back/Forward (bfcache) navigation
window.addEventListener('pageshow', (event) => {
  resetContactForm();
  resetNewsletterForm();
  setTimeout(() => {
    resetContactForm();
    resetNewsletterForm();
  }, 50);
});

window.addEventListener('popstate', () => {
  resetContactForm();
  resetNewsletterForm();
});

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Initial reset on initialization
  resetContactForm();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const msgInput = document.getElementById('contactMessage');
    let isValid = true;

    // Name check
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.classList.add('invalid');
      isValid = false;
    } else {
      nameInput.classList.remove('invalid');
    }

    // Email check (valid email pattern)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailErrorSpan = document.getElementById('contactEmailError');
    if (!emailInput.value.trim()) {
      emailInput.classList.add('invalid');
      if (emailErrorSpan) emailErrorSpan.textContent = 'Please enter the email';
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('invalid');
      if (emailErrorSpan) emailErrorSpan.textContent = 'Please enter the email';
      isValid = false;
    } else {
      emailInput.classList.remove('invalid');
    }

    // Message check
    if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
      msgInput.classList.add('invalid');
      isValid = false;
    } else {
      msgInput.classList.remove('invalid');
    }

    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Submitting Request...</span>';
      }

      setTimeout(() => {
        // Reset the form in memory right before navigating so the browser's bfcache snapshot is pristine
        resetContactForm();
        window.location.href = '404.html';
      }, 500);
    }
  });

  // Clear validation on input
  form.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
    });
  });
}

/* ==========================================================================
   CUSTOM DROPDOWN COMPONENT
   Replaces native HTML select elements with interactive styled dropdowns
   ========================================================================== */
function initCustomDropdowns() {
  const dropdownWrappers = document.querySelectorAll('.custom-select-wrapper');
  if (!dropdownWrappers.length) return;

  dropdownWrappers.forEach(wrapper => {
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const hiddenInput = wrapper.querySelector('input[type="hidden"]');
    const selectedText = wrapper.querySelector('.custom-select-selected-value');
    const options = wrapper.querySelectorAll('.custom-select-option');

    if (!trigger) return;

    // Toggle dropdown open/closed
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('is-open');

      // Close all other dropdowns first
      dropdownWrappers.forEach(w => {
        if (w !== wrapper) {
          w.classList.remove('is-open');
          const t = w.querySelector('.custom-select-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });

      wrapper.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });

    // Select option
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        const label = option.querySelector('.option-label')?.textContent || option.textContent;

        if (hiddenInput) {
          hiddenInput.value = value;
          hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (selectedText) {
          selectedText.textContent = label.trim();
        }

        options.forEach(opt => {
          opt.classList.remove('is-selected');
          opt.setAttribute('aria-selected', 'false');
        });
        option.classList.add('is-selected');
        option.setAttribute('aria-selected', 'true');

        wrapper.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // Close when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
      dropdownWrappers.forEach(w => {
        w.classList.remove('is-open');
        const t = w.querySelector('.custom-select-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownWrappers.forEach(w => {
        w.classList.remove('is-open');
        const t = w.querySelector('.custom-select-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ==========================================================================
   CONTACT PAGE ANIMATIONS
   - Text animations for Global Headquarters & Support
   - Channel Cards Split Entrance (Email from Left, Live Support from Right)
   - Visit Our Engineering Center Text Animation
   - 5-Item FAQ Alternating (Right, Left, Right, Left, Right) Entrance
   ========================================================================== */
function initContactPageAnimations() {
  // 1. Direct Channels Split Entrance (Email from left, Live Support from right)
  const channelsWrap = document.getElementById('contactChannelsWrap');
  if (channelsWrap) {
    const hqTitle = document.getElementById('contactHqTitle');
    if (hqTitle) splitElementIntoChars(hqTitle, 100, 22);

    const hqDesc = document.getElementById('contactHqDesc');
    if (hqDesc) splitElementIntoChars(hqDesc, 380, 10);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          channelsWrap.classList.add('is-revealed', 'is-in-view');
        } else {
          channelsWrap.classList.remove('is-revealed', 'is-in-view');
        }
      });
    }, { threshold: 0.12 });

    observer.observe(channelsWrap);
  }

  // 2. Visit Our Engineering Center Section
  const mapSection = document.querySelector('.stackly-map-full-section');
  if (mapSection) {
    const mapTitle = document.getElementById('visitMapTitle');
    if (mapTitle) splitElementIntoChars(mapTitle, 100, 22);

    const mapSubtitle = document.getElementById('visitMapSubtitle');
    if (mapSubtitle) splitElementIntoChars(mapSubtitle, 380, 10);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          mapSection.classList.add('is-in-view');
        } else {
          mapSection.classList.remove('is-in-view');
        }
      });
    }, { threshold: 0.12 });

    observer.observe(mapSection);
  }

  // 3. 5-Item FAQ Alternating (Right, Left, Right, Left, Right) Entrance
  const faqList = document.querySelector('.faq-accordion-list');
  if (faqList) {
    const faqTitle = document.getElementById('faqSectionTitle');
    if (faqTitle) splitElementIntoChars(faqTitle, 100, 22);

    const faqSubtitle = document.getElementById('faqSectionSubtitle');
    if (faqSubtitle) splitElementIntoChars(faqSubtitle, 380, 10);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          faqList.classList.add('is-revealed', 'is-in-view');
        } else {
          faqList.classList.remove('is-revealed', 'is-in-view');
        }
      });
    }, { threshold: 0.12 });

    observer.observe(faqList);
  }
}

/* ==========================================================================
   8. UNIVERSAL NEWSLETTER SUBSCRIPTION VALIDATION & EMAIL RECOMMENDATIONS
   - Disables native browser "Please fill out this field" tooltips across all pages
   - Displays animated red notification "Please enter the email" below input
   - Provides recommended email suggestions on input click
   - Automatically resets and clears previous email inputs when returning from 404 page
   - Navigates to 404.html when valid email is entered and Subscribe is clicked
   ========================================================================== */
function updateNewsletterRecommendations() {
  const datalist = document.getElementById('blogEmailList');
  if (!datalist) return;
  datalist.innerHTML = '';

  const emails = new Set();

  // 1. Check localStorage for previously submitted newsletter emails
  try {
    const stored = JSON.parse(localStorage.getItem('stackly_newsletter_emails') || '[]');
    if (Array.isArray(stored)) {
      stored.forEach(em => {
        if (em && typeof em === 'string' && em.trim().length > 3) {
          emails.add(em.trim());
        }
      });
    }
  } catch (e) {}

  // 2. Active logged-in user email if available
  try {
    const rawUser = sessionStorage.getItem('stackly_user') || localStorage.getItem('stackly_user');
    if (rawUser) {
      const u = JSON.parse(rawUser);
      if (u && u.email && typeof u.email === 'string') {
        emails.add(u.email.trim());
      }
    }
  } catch (e) {}

  // 3. Fallback default recommendation if no email stored yet
  if (emails.size === 0) {
    emails.add('marcus.vance@gmail.com');
  }

  emails.forEach(email => {
    const opt = document.createElement('option');
    opt.value = email;
    datalist.appendChild(opt);
  });
}

function resetNewsletterForm() {
  const forms = document.querySelectorAll(
    '#blogNewsletterForm, #newsletterForm, form[id*="newsletter"], .newsletter-form, .cta-banner-box form'
  );

  forms.forEach(form => {
    form.reset();

    const emailInput = form.querySelector('input[type="email"], input[name="email"], input');
    if (emailInput) {
      emailInput.value = '';
      emailInput.classList.remove('input-has-error');
    }

    const errorEl = form.querySelector('.newsletter-error-msg') || document.getElementById('blogEmailError');
    if (errorEl) {
      errorEl.style.display = 'none';
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Subscribe';
    }
  });

  updateNewsletterRecommendations();
}

function initNewsletterForm() {
  // Globally suppress native browser validation tooltip across all forms on the website
  document.querySelectorAll('form').forEach(f => f.setAttribute('novalidate', 'true'));

  // Ensure fresh empty input and load email recommendations on initial load
  resetNewsletterForm();

  const forms = document.querySelectorAll(
    '#blogNewsletterForm, #newsletterForm, form[id*="newsletter"], .newsletter-form, .cta-banner-box form'
  );

  forms.forEach(form => {
    // Disable native browser validation balloons
    form.setAttribute('novalidate', 'true');

    const emailInput = form.querySelector('input[type="email"], input[name="email"], input');
    if (!emailInput) return;

    // Check if error element already exists, or create one
    let errorEl = form.querySelector('.newsletter-error-msg') || document.getElementById('blogEmailError');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'newsletter-error-msg';
      errorEl.style.display = 'none';
      errorEl.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        Please enter the email
      `;
      const inputWrap = emailInput.closest('div') || form;
      inputWrap.insertAdjacentElement('afterend', errorEl);
    }

    // Clear error state dynamically as soon as user types
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('input-has-error');
      if (errorEl) errorEl.style.display = 'none';
    });

    // When clicking or focusing the input, update recommendations and trigger native suggestions
    const openRecommendations = () => {
      updateNewsletterRecommendations();
      if (typeof emailInput.showPicker === 'function') {
        try {
          emailInput.showPicker();
        } catch (err) {}
      }
    };
    emailInput.addEventListener('click', openRecommendations);
    emailInput.addEventListener('focus', openRecommendations);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = emailInput.value.trim();

      if (!val) {
        emailInput.classList.add('input-has-error');
        if (errorEl) {
          errorEl.style.display = 'flex';
        }
        emailInput.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        emailInput.classList.add('input-has-error');
        if (errorEl) {
          errorEl.style.display = 'flex';
        }
        emailInput.focus();
        return;
      }

      // 1. Save valid email to recommendations so it appears in the dropdown
      try {
        let recents = JSON.parse(localStorage.getItem('stackly_newsletter_emails') || '[]');
        if (!Array.isArray(recents)) recents = [];
        recents = recents.filter(item => item && item.toLowerCase() !== val.toLowerCase());
        recents.unshift(val);
        if (recents.length > 5) recents = recents.slice(0, 5);
        localStorage.setItem('stackly_newsletter_emails', JSON.stringify(recents));
      } catch (err) {}

      updateNewsletterRecommendations();

      // 2. Clear input value in memory right before navigating so bfcache snapshot is completely empty
      emailInput.value = '';
      form.reset();

      // 3. Navigate to 404 page as requested
      window.location.href = '404.html';
    });
  });
}

/* ==========================================================================
   9. FLOATING BRAND HUB (REMOVED)
   ========================================================================== */
function initFloatingHub() {
  // Removed per design requirements
}

/* ==========================================================================
   10. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   11. HERO IMAGE SLIDER (5 Images, Continuous 2-Second Rotation)
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const urlText = document.getElementById('sliderUrlText');
  const statusText = document.getElementById('sliderStatusText');

  if (!slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let timer = null;

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    const activeSlide = slides[index];
    if (activeSlide) {
      const url = activeSlide.getAttribute('data-url');
      const status = activeSlide.getAttribute('data-status');
      if (urlText && url) urlText.textContent = url;
      if (statusText && status) statusText.textContent = status;
    }
    currentIndex = index;
  }

  function nextSlide() {
    const next = (currentIndex + 1) % totalSlides;
    goToSlide(next);
  }

  function startAutoPlay() {
    stopAutoPlay();
    timer = setInterval(nextSlide, 2000); // Continuous 2-second timing
  }

  function stopAutoPlay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide'), 10);
      goToSlide(idx);
      startAutoPlay();
    });
  });

  const slider = document.getElementById('heroSlider');
  if (slider) {
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

/* ==========================================================================
   12. HERO FULL-BLEED BACKGROUND SLIDER (5 Images, 2-Second Rotation)
   Seamless cross-fade without blank gaps or white flash
   ========================================================================== */
function initHeroBgSlider() {
  const bgSlides = document.querySelectorAll('.hero-bg-slide');
  if (!bgSlides.length) return;

  // Preload all 5 high-clarity background images into memory
  bgSlides.forEach(slide => {
    const styleBg = slide.style.backgroundImage;
    const match = styleBg.match(/url\(['"]?(.*?)['"]?\)/);
    if (match && match[1]) {
      const img = new Image();
      img.src = match[1];
    }
  });

  let currentBg = 0;
  const totalBg = bgSlides.length;

  // Ensure initial slide has top z-index
  bgSlides[0].style.zIndex = '2';

  setInterval(() => {
    const prevBg = currentBg;
    currentBg = (currentBg + 1) % totalBg;

    // Incoming slide gets top z-index and fades in to opacity 1
    bgSlides[currentBg].style.zIndex = '2';
    bgSlides[currentBg].classList.add('active');

    // Previous slide stays underneath at z-index 1 while fading out
    bgSlides[prevBg].style.zIndex = '1';
    bgSlides[prevBg].classList.remove('active');

    // All other slides reset to base z-index 0
    bgSlides.forEach((slide, idx) => {
      if (idx !== currentBg && idx !== prevBg) {
        slide.style.zIndex = '0';
        slide.classList.remove('active');
      }
    });
  }, 2000); // Exactly 2-second continuous rotation
}

/* ==========================================================================
   13. RIGHT-SIDE SLIDE-IN TEXT ANIMATIONS (Letter-by-Letter & Word-by-Word)
   Splits text into animated glyphs gliding from the right into perfect dock
   ========================================================================== */

/**
 * Splits text inside a DOM element into individual characters that slide in from the right.
 * Preserves inner elements (e.g., .highlight-text, <br>) and wraps words in nowrap containers
 * so that standard responsive line-breaking is preserved.
 *
 * @param {HTMLElement} container - The element containing text to split
 * @param {number} initialDelay - Starting animation delay in ms
 * @param {number} stepDelay - Increment per character in ms
 * @returns {number} The next accumulated delay in ms
 */
function splitElementIntoChars(container, initialDelay = 0, stepDelay = 22) {
  if (!container || container.getAttribute('data-chars-animated') === 'true') {
    return initialDelay;
  }
  container.setAttribute('data-chars-animated', 'true');

  let currentDelay = initialDelay;

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text) return document.createTextNode('');

      const fragment = document.createDocumentFragment();
      // Split text into words and whitespace
      const tokens = text.split(/(\s+)/);

      tokens.forEach(token => {
        if (!token) return;

        if (/^\s+$/.test(token)) {
          // Whitespace separator
          const spaceSpan = document.createElement('span');
          spaceSpan.className = 'char-slide-right char-space';
          spaceSpan.style.setProperty('--char-delay', currentDelay);
          spaceSpan.innerHTML = '&nbsp;';
          fragment.appendChild(spaceSpan);
          currentDelay += Math.floor(stepDelay * 0.6);
        } else {
          // Word container preserves layout and prevents mid-word breaks
          const wordWrap = document.createElement('span');
          wordWrap.style.display = 'inline-block';
          wordWrap.style.whiteSpace = 'nowrap';

          for (let i = 0; i < token.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.className = 'char-slide-right';
            charSpan.style.setProperty('--char-delay', currentDelay);
            charSpan.textContent = token[i];
            wordWrap.appendChild(charSpan);
            currentDelay += stepDelay;
          }
          fragment.appendChild(wordWrap);
        }
      });

      return fragment;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BR') {
        return node.cloneNode(true);
      }
      const clonedEl = node.cloneNode(false);
      Array.from(node.childNodes).forEach(child => {
        const processedChild = processNode(child);
        if (processedChild) clonedEl.appendChild(processedChild);
      });
      return clonedEl;
    }
    return node.cloneNode(true);
  }

  const newFragment = document.createDocumentFragment();
  Array.from(container.childNodes).forEach(child => {
    const processed = processNode(child);
    if (processed) newFragment.appendChild(processed);
  });

  container.innerHTML = '';
  container.appendChild(newFragment);

  return currentDelay;
}

function initRightSlideTextAnimations() {
  // 1. Hero Headline & Subtitle (index.html)
  const heroTitle = document.getElementById('heroTitle');
  const heroDesc = document.getElementById('heroDesc');
  const heroSection = document.querySelector('.hero-section');

  if (heroTitle) {
    const titleEndDelay = splitElementIntoChars(heroTitle, 140, 23);
    if (heroDesc) {
      splitElementIntoChars(heroDesc, Math.max(750, titleEndDelay - 200), 10);
    }

    if (heroSection) {
      heroSection.classList.add('is-in-view', 'is-revealed');
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            heroSection.classList.add('is-in-view', 'is-revealed');
          } else {
            heroSection.classList.remove('is-in-view', 'is-revealed');
          }
        });
      }, { threshold: 0.15 });

      heroObserver.observe(heroSection);
    }
  }

  // 2. Second Section (#about-teaser: About Stackly, Engineered for velocity, zero bottlenecks, and tick items)
  const aboutSection = document.getElementById('about-teaser') || document.querySelector('.about-section');
  if (aboutSection) {
    const label = aboutSection.querySelector('.section-label');
    if (label) {
      label.style.setProperty('--block-delay', '60');
      label.classList.add('block-slide-right');
    }

    const title = aboutSection.querySelector('.section-title');
    let nextDelay = 120;
    if (title) {
      nextDelay = splitElementIntoChars(title, 120, 20);
    }

    const subtitle = aboutSection.querySelector('.section-subtitle');
    if (subtitle) {
      splitElementIntoChars(subtitle, Math.max(300, nextDelay - 150), 9);
    }

    const featureItems = aboutSection.querySelectorAll('.about-feature-item');
    featureItems.forEach((item, idx) => {
      item.style.setProperty('--block-delay', (600 + (idx * 220)).toString());
      item.classList.add('block-slide-right');
    });

    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutSection.classList.add('is-in-view', 'is-revealed');
        } else {
          aboutSection.classList.remove('is-in-view', 'is-revealed');
        }
      });
    }, { threshold: 0.12 });

    aboutObserver.observe(aboutSection);
  }

  // 3. Blog Teaser Section: Right-slide letters for heading + 3-card directional entrance (Left, Down, Right)
  const blogSection = document.getElementById('blog-teaser') || document.querySelector('.blog-section');
  if (blogSection) {
    const title = blogSection.querySelector('.section-title');
    if (title) splitElementIntoChars(title, 100, 20);

    const subtitle = blogSection.querySelector('.section-subtitle');
    if (subtitle) splitElementIntoChars(subtitle, 350, 10);

    const blogGrid = blogSection.querySelector('.blog-grid');

    const blogObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          blogSection.classList.add('is-in-view');
          if (blogGrid) blogGrid.classList.add('is-revealed');
        } else {
          blogSection.classList.remove('is-in-view');
          if (blogGrid) blogGrid.classList.remove('is-revealed');
        }
      });
    }, { threshold: 0.12 });

    blogObserver.observe(blogSection);
  }

  // 4. Developer Ecosystem Section: Right-slide letters for heading + smooth card cascade from downside
  const ecosystemSection = document.getElementById('ecosystem-section') || document.querySelector('.ecosystem-section');
  if (ecosystemSection) {
    const title = ecosystemSection.querySelector('.section-title');
    if (title) splitElementIntoChars(title, 100, 20);

    const subtitle = ecosystemSection.querySelector('.section-subtitle');
    if (subtitle) splitElementIntoChars(subtitle, 350, 10);

    const ecoGrid = ecosystemSection.querySelector('.ecosystem-grid');

    const ecoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ecosystemSection.classList.add('is-in-view');
          if (ecoGrid) ecoGrid.classList.add('is-revealed');
        } else {
          ecosystemSection.classList.remove('is-in-view');
          if (ecoGrid) ecoGrid.classList.remove('is-revealed');
        }
      });
    }, { threshold: 0.12 });

    ecoObserver.observe(ecosystemSection);
  }

  // 5. CTA Banner Box: Enters smoothly from downside + inside letters slide letter-by-letter from right
  const ctaSections = document.querySelectorAll('.cta-banner-section');
  ctaSections.forEach(ctaSec => {
    const ctaBox = ctaSec.querySelector('.cta-banner-box');
    const ctaTitle = ctaSec.querySelector('.cta-banner-title');
    if (ctaTitle) splitElementIntoChars(ctaTitle, 150, 20);
    const ctaDesc = ctaSec.querySelector('.cta-banner-desc');
    if (ctaDesc) splitElementIntoChars(ctaDesc, 400, 10);

    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ctaSec.classList.add('is-in-view');
          if (ctaBox) ctaBox.classList.add('is-revealed');
        } else {
          ctaSec.classList.remove('is-in-view');
          if (ctaBox) ctaBox.classList.remove('is-revealed');
        }
      });
    }, { threshold: 0.12 });

    ctaObserver.observe(ctaSec);
  });

  // 6. About Mission Section ("Born out of frustration with infrastructure sprawl")
  const missionSection = document.getElementById('missionSection');
  if (missionSection) {
    const title = document.getElementById('missionTitle');
    if (title) splitElementIntoChars(title, 100, 20);

    const desc1 = missionSection.querySelector('.mission-desc-1');
    if (desc1) splitElementIntoChars(desc1, 350, 10);

    const desc2 = missionSection.querySelector('.mission-desc-2');
    if (desc2) splitElementIntoChars(desc2, 700, 10);

    const statCards = missionSection.querySelector('.about-stat-cards');

    const missionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          missionSection.classList.add('is-in-view');
          if (statCards) statCards.classList.add('is-revealed');
          initAboutLiveNumbers();
        } else {
          missionSection.classList.remove('is-in-view');
          if (statCards) statCards.classList.remove('is-revealed');
        }
      });
    }, { threshold: 0.12 });

    missionObserver.observe(missionSection);
  }

  // 7. About Locations Section ("Operating from world tech capitals.")
  const locationsSection = document.getElementById('locationsSection');
  if (locationsSection) {
    const title = document.getElementById('locationsTitle') || locationsSection.querySelector('.section-title');
    if (title) splitElementIntoChars(title, 100, 20);

    const subtitle = document.getElementById('locationsSubtitle') || locationsSection.querySelector('.section-subtitle');
    if (subtitle) splitElementIntoChars(subtitle, 350, 10);

    const locObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          locationsSection.classList.add('is-in-view', 'is-revealed');
        } else {
          locationsSection.classList.remove('is-in-view', 'is-revealed');
        }
      });
    }, { threshold: 0.12 });

    locObserver.observe(locationsSection);
  }

  // 8. Security & Compliance Section ("SOC2 Type II & Zero-Trust Certified")
  const securitySection = document.getElementById('security');
  if (securitySection) {
    const title = document.getElementById('securityTitle') || securitySection.querySelector('.section-title');
    if (title) splitElementIntoChars(title, 100, 20);

    const subtitle = document.getElementById('securitySubtitle') || securitySection.querySelector('.section-subtitle');
    if (subtitle) splitElementIntoChars(subtitle, 350, 10);

    const secGrid = document.getElementById('securityGrid') || securitySection.querySelector('.security-grid');

    const secObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          securitySection.classList.add('is-in-view');
          if (secGrid) secGrid.classList.add('is-revealed');
        } else {
          securitySection.classList.remove('is-in-view');
          if (secGrid) secGrid.classList.remove('is-revealed');
        }
      });
    }, { threshold: 0.12 });

    secObserver.observe(securitySection);
  }

  // 9. Service Blocks 1, 2, 3 (Autonomous Orchestration, APM Telemetry, Revenue Intelligence)
  [
    { id: 'service1', titleId: 'serviceTitle1', subId: 'serviceSubtitle1', rotateId: 'serviceRotateBox1' },
    { id: 'service2', titleId: 'serviceTitle2', subId: 'serviceSubtitle2' },
    { id: 'service3', titleId: 'serviceTitle3', subId: 'serviceSubtitle3' }
  ].forEach(srv => {
    const sec = document.getElementById(srv.id);
    if (!sec) return;

    const title = document.getElementById(srv.titleId) || sec.querySelector('.section-title');
    if (title) splitElementIntoChars(title, 100, 20);

    const sub = document.getElementById(srv.subId) || sec.querySelector('.section-subtitle');
    if (sub) splitElementIntoChars(sub, 350, 10);

    const items = sec.querySelectorAll('.service-feature-item');
    items.forEach((item, idx) => {
      item.style.setProperty('--block-delay', (600 + (idx * 200)).toString());
      item.classList.add('block-slide-right');
    });

    const rotateBox = srv.rotateId ? document.getElementById(srv.rotateId) : null;

    const srvObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sec.classList.add('is-in-view', 'is-revealed');
          if (rotateBox) rotateBox.classList.add('is-revealed');
        } else {
          sec.classList.remove('is-in-view', 'is-revealed');
          if (rotateBox) rotateBox.classList.remove('is-revealed');
        }
      });
    }, { threshold: 0.12 });

    srvObserver.observe(sec);
  });

  // 10. SLA Section ("Guaranteed SLAs backed by contractual credits.")
  const serviceSla = document.getElementById('serviceSla');
  if (serviceSla) {
    const title = document.getElementById('slaTitle') || serviceSla.querySelector('.section-title');
    if (title) splitElementIntoChars(title, 100, 20);

    const subtitle = document.getElementById('slaSubtitle') || serviceSla.querySelector('.section-subtitle');
    if (subtitle) splitElementIntoChars(subtitle, 350, 10);

    const grid = document.getElementById('slaGrid');

    const slaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          serviceSla.classList.add('is-in-view');
          if (grid) grid.classList.add('is-revealed');
        } else {
          serviceSla.classList.remove('is-in-view');
          if (grid) grid.classList.remove('is-revealed');
        }
      });
    }, { threshold: 0.12 });

    slaObserver.observe(serviceSla);
  }

  // 11. Migration Workflow Section ("Zero-downtime migration in four autonomous steps.")
  const migrationWorkflow = document.getElementById('migrationWorkflow');
  if (migrationWorkflow) {
    const title = document.getElementById('migrationTitle') || migrationWorkflow.querySelector('.section-title');
    if (title) splitElementIntoChars(title, 100, 20);

    const subtitle = document.getElementById('migrationSubtitle') || migrationWorkflow.querySelector('.section-subtitle');
    if (subtitle) splitElementIntoChars(subtitle, 350, 10);

    const grid = document.getElementById('migrationGrid');

    const migObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          migrationWorkflow.classList.add('is-in-view');
          if (grid) grid.classList.add('is-revealed');
        } else {
          migrationWorkflow.classList.remove('is-in-view');
          if (grid) grid.classList.remove('is-revealed');
        }
      });
    }, { threshold: 0.12 });

    migObserver.observe(migrationWorkflow);
  }

  // 12. Pricing Section ("Simple, predictable pricing for startups.")
  const pricingSection = document.getElementById('pricing');
  if (pricingSection) {
    const title = document.getElementById('pricingTitle') || pricingSection.querySelector('.section-title');
    if (title) splitElementIntoChars(title, 100, 20);

    const subtitle = document.getElementById('pricingSubtitle') || pricingSection.querySelector('.section-subtitle');
    if (subtitle) splitElementIntoChars(subtitle, 350, 10);

    const grid = document.getElementById('pricingGrid');

    const priceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          pricingSection.classList.add('is-in-view');
          if (grid) grid.classList.add('is-revealed');
        } else {
          pricingSection.classList.remove('is-in-view');
          if (grid) grid.classList.remove('is-revealed');
        }
      });
    }, { threshold: 0.12 });

    priceObserver.observe(pricingSection);
  }

  // 13. Generalize across all page heroes (about.html, services.html, blog.html, contact.html)
  const pageHeroTitles = document.querySelectorAll('.page-hero-title');
  pageHeroTitles.forEach(title => {
    splitElementIntoChars(title, 120, 22);
  });

  const pageHeroDescs = document.querySelectorAll('.page-hero-desc');
  pageHeroDescs.forEach(desc => {
    splitElementIntoChars(desc, 450, 10);
  });

  const pageHeroes = document.querySelectorAll('.page-hero');
  pageHeroes.forEach(ph => {
    ph.classList.add('is-in-view', 'is-revealed');
    const phObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ph.classList.add('is-in-view', 'is-revealed');
        } else {
          ph.classList.remove('is-in-view', 'is-revealed');
        }
      });
    }, { threshold: 0.15 });

    phObserver.observe(ph);
  });

  // 14. Generalize across other section titles on scroll across all pages
  const otherSectionTitles = document.querySelectorAll('.section-title:not(#about-teaser .section-title):not(#blog-teaser .section-title):not(#ecosystem-section .section-title):not(#missionSection .section-title):not(#locationsSection .section-title):not(#security .section-title):not(#service1 .section-title):not(#service2 .section-title):not(#service3 .section-title):not(#serviceSla .section-title):not(#migrationWorkflow .section-title):not(#pricing .section-title)');
  if (otherSectionTitles.length) {
    otherSectionTitles.forEach(t => splitElementIntoChars(t, 80, 20));

    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view', 'is-revealed');
        } else {
          entry.target.classList.remove('is-in-view', 'is-revealed');
        }
      });
    }, { threshold: 0.15 });

    otherSectionTitles.forEach(t => titleObserver.observe(t));
  }

  // 15. All CTA Banner Boxes: Downside entrance & title letters slide from right
  const ctaBoxes = document.querySelectorAll('.cta-banner-box');
  if (ctaBoxes.length) {
    ctaBoxes.forEach(box => {
      const title = box.querySelector('.cta-banner-title');
      if (title) splitElementIntoChars(title, 120, 22);

      const desc = box.querySelector('.cta-banner-desc');
      if (desc) splitElementIntoChars(desc, 450, 10);
    });

    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed', 'is-in-view');
        } else {
          entry.target.classList.remove('is-revealed', 'is-in-view');
        }
      });
    }, { threshold: 0.12 });

    ctaBoxes.forEach(box => ctaObserver.observe(box));
  }
}

/**
 * Live numbers ticker for About page stat cards (2,400+ & $4.8B+)
 */
function initAboutLiveNumbers() {
  const statStartups = document.getElementById('aboutStatStartups');
  const statArr = document.getElementById('aboutStatArr');
  if (!statStartups && !statArr) return;

  let startupsCount = 2400;

  // Startups count-up
  if (statStartups) {
    const duration = 1400;
    const start = performance.now();
    const updateStartups = (now) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const current = Math.floor(ease * startupsCount);
      statStartups.innerHTML = `${current.toLocaleString()}+ <span class="live-pulse-dot" title="Live Scaleup Count"></span>`;
      if (p < 1) {
        requestAnimationFrame(updateStartups);
      } else {
        statStartups.innerHTML = `${startupsCount.toLocaleString()}+ <span class="live-pulse-dot" title="Live Scaleup Count"></span>`;
      }
    };
    requestAnimationFrame(updateStartups);
  }

  // ARR count-up
  if (statArr) {
    const duration = 1500;
    const start = performance.now();
    const updateArr = (now) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const current = 1.0 + (3.8 * ease);
      statArr.innerHTML = `$${current.toFixed(1)}B+ <span class="live-pulse-dot" title="Continuous Real-Time ARR Telemetry"></span>`;
      if (p < 1) {
        requestAnimationFrame(updateArr);
      } else {
        statArr.innerHTML = `$4.8B+ <span class="live-pulse-dot" title="Continuous Real-Time ARR Telemetry"></span>`;
      }
    };
    requestAnimationFrame(updateArr);
  }

  // Live real-time heartbeat updates
  setInterval(() => {
    if (statStartups) {
      startupsCount += Math.floor(Math.random() * 2) + 1;
      statStartups.innerHTML = `${startupsCount.toLocaleString()}+ <span class="live-pulse-dot" title="Live Scaleup Count"></span>`;
    }
  }, 4200);

  setInterval(() => {
    if (statArr) {
      const micro = (Math.random() * 0.08).toFixed(2);
      const liveVal = (4.8 + parseFloat(micro)).toFixed(2);
      statArr.innerHTML = `$${liveVal}B+ <span class="live-pulse-dot" title="Continuous Real-Time ARR Telemetry"></span>`;
    }
  }, 3500);
}

/* ==========================================================================
   14. LIVE TELEMETRY NUMBERS TICKER
   Dynamic count-up followed by real-time continuous ping & cluster updates
   ========================================================================== */
function initLiveTelemetryNumbers() {
  const statStartups = document.getElementById('statStartups');
  const statSla = document.getElementById('statSla');
  const statLatency = document.getElementById('statLatency');

  if (!statStartups && !statSla && !statLatency) return;

  let startupsCount = 2400;
  let slaVal = 99.999;
  let hasTriggered = false;

  const runInitialCountUp = () => {
    // 1. Startups: 0 to 2,400+
    if (statStartups) {
      const duration = 1400;
      const start = performance.now();
      const updateStartups = (now) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const current = Math.floor(ease * startupsCount);
        statStartups.innerHTML = `${current.toLocaleString()}+ <span class="live-pulse-dot" title="Live Telemetry Stream"></span>`;
        if (p < 1) {
          requestAnimationFrame(updateStartups);
        } else {
          statStartups.innerHTML = `${startupsCount.toLocaleString()}+ <span class="live-pulse-dot" title="Live Telemetry Stream"></span>`;
        }
      };
      requestAnimationFrame(updateStartups);
    }

    // 2. SLA: 95.000% to 99.999%
    if (statSla) {
      const duration = 1600;
      const start = performance.now();
      const updateSla = (now) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const current = 95 + (4.999 * ease);
        statSla.innerHTML = `${current.toFixed(3)}% <span class="live-pulse-dot" title="Continuous SLA Audit"></span>`;
        if (p < 1) {
          requestAnimationFrame(updateSla);
        } else {
          statSla.innerHTML = `99.999% <span class="live-pulse-dot" title="Continuous SLA Audit"></span>`;
        }
      };
      requestAnimationFrame(updateSla);
    }

    // 3. Latency: 55ms down to <16ms
    if (statLatency) {
      const duration = 1300;
      const start = performance.now();
      const targetLatency = 16.4;
      const updateLatency = (now) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const current = 55 - ((55 - targetLatency) * ease);
        statLatency.innerHTML = `&lt;${current.toFixed(1)}ms <span class="live-pulse-dot" title="Real-Time Ping Pulse"></span>`;
        if (p < 1) {
          requestAnimationFrame(updateLatency);
        } else {
          statLatency.innerHTML = `&lt;16.4ms <span class="live-pulse-dot" title="Real-Time Ping Pulse"></span>`;
        }
      };
      requestAnimationFrame(updateLatency);
    }
  };

  // Trigger when image card or stats come into view
  const triggerContainer = document.querySelector('.about-image-card') || document.getElementById('about-teaser');
  if (triggerContainer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasTriggered) {
          hasTriggered = true;
          runInitialCountUp();
        } else if (!entry.isIntersecting) {
          hasTriggered = false;
        }
      });
    }, { threshold: 0.15 });
    observer.observe(triggerContainer);
  } else {
    runInitialCountUp();
  }

  // Continuous real-time updates (telemetry heartbeat)
  // Latency micro-ping fluctuation every 1.8 seconds (14.2ms to 17.6ms)
  setInterval(() => {
    if (statLatency && hasTriggered) {
      const livePing = (14.1 + (Math.random() * 3.4)).toFixed(1);
      statLatency.innerHTML = `&lt;${livePing}ms <span class="live-pulse-dot" title="Real-Time Ping Pulse"></span>`;
    }
  }, 1800);

  // Startups live onboarding every 4.5 seconds (+1 or +2)
  setInterval(() => {
    if (statStartups && hasTriggered) {
      startupsCount += Math.floor(Math.random() * 2) + 1;
      statStartups.innerHTML = `${startupsCount.toLocaleString()}+ <span class="live-pulse-dot" title="Live Telemetry Stream"></span>`;
    }
  }, 4500);

  // SLA verified pulse
  setInterval(() => {
    if (statSla && hasTriggered) {
      statSla.innerHTML = `99.999% <span class="live-pulse-dot" title="Continuous SLA Audit"></span>`;
    }
  }, 3000);
}

/* ==========================================================================
   15. BUILT FOR SCALE: 6-CARD SHUFFLE & ARRANGE ANIMATION
   Uses physical FLIP kinematics to lift, shuffle, and glide cards into position
   ========================================================================== */
function initCardsShuffleAnimation() {
  const grid = document.getElementById('servicesGrid') || document.querySelector('.services-grid');
  const triggerBtn = document.getElementById('shuffleServicesBtn');
  if (!grid) return;

  let isShuffling = false;
  let autoShuffleInterval = null;
  let initialShuffleTimer = null;

  function performShuffle(isManual = false) {
    if (isShuffling) return;
    const cards = Array.from(grid.querySelectorAll('.service-card'));
    if (cards.length < 2) return;

    isShuffling = true;
    if (triggerBtn) triggerBtn.classList.add('is-shuffling');

    // Step 1: Capture initial layout positions
    const firstRects = cards.map(c => c.getBoundingClientRect());

    // Step 2: Lift & tilt cards (riffle shuffle deck motion)
    cards.forEach((card, idx) => {
      card.classList.add('is-shuffling');
      const tilt = (idx % 2 === 0 ? 1 : -1) * (3.5 + (idx * 0.8));
      const liftY = -18 - (idx % 3) * 3;
      card.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease';
      card.style.transform = `scale(0.95) translateY(${liftY}px) rotate(${tilt}deg)`;
    });

    // Step 3: Rearrange order in DOM & compute inversion deltas
    setTimeout(() => {
      // Re-order cards cyclically (last card rotates to first position)
      const reorderedCards = [...cards];
      const movedCard = reorderedCards.pop();
      reorderedCards.unshift(movedCard);

      // Re-append to DOM in new sequence
      reorderedCards.forEach(c => grid.appendChild(c));

      // Capture new layout positions
      const lastRects = cards.map(c => c.getBoundingClientRect());

      // Invert: shift cards back to their previous screen positions instantaneously
      cards.forEach((card, idx) => {
        const deltaX = firstRects[idx].left - lastRects[idx].left;
        const deltaY = firstRects[idx].top - lastRects[idx].top;
        const angle = (idx % 2 === 0 ? -1 : 1) * 3.5;

        card.style.transition = 'none';
        card.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.95) rotate(${angle}deg)`;
      });

      // Force synchronous layout reflow so the inverted transforms are committed
      void grid.offsetHeight;

      // Step 4: Play arrange animation (cards physically fly and dock into their new arranged slots)
      cards.forEach((card, idx) => {
        const delay = idx * 45; // micro-cascading glide
        card.style.transition = `transform 0.85s cubic-bezier(0.2, 1, 0.3, 1) ${delay}ms, box-shadow 0.85s ease ${delay}ms`;
        card.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';

        setTimeout(() => {
          card.classList.remove('is-shuffling');
          card.style.transition = '';
          card.style.transform = '';
        }, 900 + (cards.length * 45));
      });

      setTimeout(() => {
        if (triggerBtn) triggerBtn.classList.remove('is-shuffling');
        isShuffling = false;
      }, 950 + (cards.length * 45));

    }, 380);
  }

  // Connect manual trigger button
  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      performShuffle(true);
    });
  }

  // Automated trigger on scroll + periodic shuffle while section is visible
  const servicesSection = document.getElementById('services-teaser') || grid.closest('section');
  if (servicesSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Debounced initial shuffle after entering view
          if (initialShuffleTimer) clearTimeout(initialShuffleTimer);
          initialShuffleTimer = setTimeout(() => {
            performShuffle(false);
          }, 800);

          // Periodic continuous shuffle cycle while viewing this section
          if (!autoShuffleInterval) {
            autoShuffleInterval = setInterval(() => {
              performShuffle(false);
            }, 6500);
          }
        } else {
          // Pause when outside viewport to conserve resources and avoid queue pileup
          if (initialShuffleTimer) {
            clearTimeout(initialShuffleTimer);
            initialShuffleTimer = null;
          }
          if (autoShuffleInterval) {
            clearInterval(autoShuffleInterval);
            autoShuffleInterval = null;
          }
        }
      });
    }, { threshold: 0.18 });

    observer.observe(servicesSection);
  }
}

/* ==========================================================================
   16. ABOUT PAGE: 3 GLOBAL LOCATIONS SHUFFLE & ARRANGE ANIMATION
   Specifications:
   - 3 cards: San Francisco (HQ), London, Singapore
   - Shuffle phase: 3rd card (Singapore) is placed 1st, 1st card (SF) is placed 3rd, 2nd card (London) is placed 2nd
   - Arrange phase: Cards glide across and dock into perfect positions:
     1st card 1st (San Francisco), 2nd card 2nd (London), 3rd card 3rd (Singapore)
   ========================================================================== */
function initLocationsShuffleAnimation() {
  const grid = document.getElementById('locationsGrid');
  const triggerBtn = document.getElementById('shuffleLocationsBtn');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.location-card'));
  if (cards.length !== 3) return;

  let isShuffling = false;
  let autoShuffleInterval = null;
  let initialShuffleTimer = null;

  function performShuffle() {
    if (isShuffling) return;
    isShuffling = true;
    if (triggerBtn) triggerBtn.classList.add('is-shuffling');

    const card0 = cards[0]; // San Francisco (Natural 0)
    const card1 = cards[1]; // London (Natural 1)
    const card2 = cards[2]; // Singapore (Natural 2)

    // Compute coordinate deltas between slot 0 and slot 2 (handles both row and column layouts)
    const r0 = card0.getBoundingClientRect();
    const r2 = card2.getBoundingClientRect();

    const deltaX = r2.left - r0.left;
    const deltaY = r2.top - r0.top;

    // STEP 1: SHUFFLE PHASE
    // Place third card at first, first card at third, second card in middle
    cards.forEach(c => c.classList.add('is-shuffling'));

    // Card 2 (Singapore) shifts across to 1st slot with a riffle tilt
    card2.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.45s ease';
    card2.style.transform = `translate(${-deltaX}px, ${-deltaY}px) translateY(-18px) rotate(-3.5deg) scale(0.97)`;

    // Card 0 (San Francisco) shifts across to 3rd slot with a riffle tilt
    card0.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.45s ease';
    card0.style.transform = `translate(${deltaX}px, ${deltaY}px) translateY(-18px) rotate(3.5deg) scale(0.97)`;

    // Card 1 (London) stays in 2nd slot, slightly lifted
    card1.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.45s ease';
    card1.style.transform = 'translateY(-14px) scale(0.95)';

    // STEP 2: ARRANGE PHASE
    // After pausing in the shuffled configuration, cards glide and dock into their perfect natural positions
    setTimeout(() => {
      // Card 0 (San Francisco) glides left across into 1st position
      card0.style.transition = 'transform 0.95s cubic-bezier(0.2, 1, 0.3, 1), box-shadow 0.95s ease';
      card0.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';

      // Card 2 (Singapore) glides right across into 3rd position
      card2.style.transition = 'transform 0.95s cubic-bezier(0.2, 1, 0.3, 1), box-shadow 0.95s ease';
      card2.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';

      // Card 1 (London) gently docks into 2nd position
      card1.style.transition = 'transform 0.95s cubic-bezier(0.2, 1, 0.3, 1), box-shadow 0.95s ease';
      card1.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';

      // Step 3: Clean up inline transforms so CSS hover rules function smoothly
      setTimeout(() => {
        cards.forEach(c => {
          c.classList.remove('is-shuffling');
          c.style.transition = '';
          c.style.transform = '';
        });
        if (triggerBtn) triggerBtn.classList.remove('is-shuffling');
        isShuffling = false;
      }, 1050);
    }, 650);
  }

  // Connect manual trigger button
  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      performShuffle();
    });
  }

  // Automated trigger on scroll + periodic shuffle while section is visible
  const locationsSection = document.getElementById('locationsSection') || grid.closest('section');
  if (locationsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Debounced initial shuffle after entering view
          if (initialShuffleTimer) clearTimeout(initialShuffleTimer);
          initialShuffleTimer = setTimeout(() => {
            performShuffle();
          }, 850);

          // Periodic continuous shuffle cycle while viewing this section
          if (!autoShuffleInterval) {
            autoShuffleInterval = setInterval(() => {
              performShuffle();
            }, 7500);
          }
        } else {
          if (initialShuffleTimer) {
            clearTimeout(initialShuffleTimer);
            initialShuffleTimer = null;
          }
          if (autoShuffleInterval) {
            clearInterval(autoShuffleInterval);
            autoShuffleInterval = null;
          }
        }
      });
    }, { threshold: 0.18 });

    observer.observe(locationsSection);
  }
}

/* ==========================================================================
   17. SERVICES PAGE: 3 PRICING TIERS REVERSE & ARRANGE ANIMATION
   Specifications:
   - 3 tiers: Starter Scale ($299), Growth Unicorn ($899), Enterprise Dedicated (Custom)
   - Reverse phase: 3rd card (Enterprise) comes first, 2nd card (Growth) stays 2nd, 1st card (Starter) comes 3rd
   - Arrange phase: Cards glide across and dock into their natural slots:
     1st = Starter Scale, 2nd = Growth Unicorn, 3rd = Enterprise Dedicated
   - Trigger: scroll into view, manual button (#shufflePricingBtn), and periodic cycle
   ========================================================================== */
function initPricingShuffleAnimation() {
  const grid = document.getElementById('pricingGrid');
  const triggerBtn = document.getElementById('shufflePricingBtn');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.pricing-card'));
  if (cards.length !== 3) return;

  let isShuffling = false;
  let autoShuffleInterval = null;
  let initialShuffleTimer = null;

  function performShuffle() {
    if (isShuffling) return;
    isShuffling = true;
    if (triggerBtn) triggerBtn.classList.add('is-shuffling');

    const card0 = cards[0]; // Starter Scale (Natural 0)
    const card1 = cards[1]; // Growth Unicorn (Natural 1)
    const card2 = cards[2]; // Enterprise Dedicated (Natural 2)

    // Compute coordinate deltas between slot 0 and slot 2 (handles responsive layouts)
    const r0 = card0.getBoundingClientRect();
    const r2 = card2.getBoundingClientRect();

    const deltaX = r2.left - r0.left;
    const deltaY = r2.top - r0.top;

    // STEP 1: REVERSE SHUFFLE PHASE
    // Place third card at first, first card at third, second card in middle
    cards.forEach(c => c.classList.add('is-shuffling'));

    // Card 2 (Enterprise) shifts across to 1st slot with a riffle tilt
    card2.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.45s ease';
    card2.style.transform = `translate(${-deltaX}px, ${-deltaY}px) translateY(-18px) rotate(-3.5deg) scale(0.97)`;

    // Card 0 (Starter) shifts across to 3rd slot with a riffle tilt
    card0.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.45s ease';
    card0.style.transform = `translate(${deltaX}px, ${deltaY}px) translateY(-18px) rotate(3.5deg) scale(0.97)`;

    // Card 1 (Growth) stays in 2nd slot, slightly lifted
    card1.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.45s ease';
    card1.style.transform = 'translateY(-14px) scale(0.95)';

    // STEP 2: ARRANGE PHASE
    // After pausing in the reversed configuration, cards glide and dock into their natural slots
    setTimeout(() => {
      // Card 0 (Starter) glides left across into 1st position
      card0.style.transition = 'transform 0.95s cubic-bezier(0.2, 1, 0.3, 1), box-shadow 0.95s ease';
      card0.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';

      // Card 2 (Enterprise) glides right across into 3rd position
      card2.style.transition = 'transform 0.95s cubic-bezier(0.2, 1, 0.3, 1), box-shadow 0.95s ease';
      card2.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';

      // Card 1 (Growth) settles into 2nd position
      card1.style.transition = 'transform 0.95s cubic-bezier(0.2, 1, 0.3, 1), box-shadow 0.95s ease';
      card1.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';

      // Step 3: Clean up inline transforms so CSS hover rules and button hover reveal operate seamlessly
      setTimeout(() => {
        cards.forEach(c => {
          c.classList.remove('is-shuffling');
          c.style.transition = '';
          c.style.transform = '';
        });
        if (triggerBtn) triggerBtn.classList.remove('is-shuffling');
        isShuffling = false;
      }, 1050);
    }, 650);
  }

  // Connect manual trigger button
  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      performShuffle();
    });
  }

  // Automated trigger on scroll + periodic shuffle while section is visible
  const pricingSection = document.getElementById('pricing') || grid.closest('section');
  if (pricingSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Debounced initial reverse-and-arrange shuffle after entering view
          if (initialShuffleTimer) clearTimeout(initialShuffleTimer);
          initialShuffleTimer = setTimeout(() => {
            performShuffle();
          }, 850);

          // Periodic continuous shuffle cycle while viewing this section
          if (!autoShuffleInterval) {
            autoShuffleInterval = setInterval(() => {
              performShuffle();
            }, 7500);
          }
        } else {
          if (initialShuffleTimer) {
            clearTimeout(initialShuffleTimer);
            initialShuffleTimer = null;
          }
          if (autoShuffleInterval) {
            clearInterval(autoShuffleInterval);
            autoShuffleInterval = null;
          }
        }
      });
    }, { threshold: 0.18 });

    observer.observe(pricingSection);
  }
}

/* ==========================================================================
   18. BLOG FEATURED ARTICLE SPLIT & JOIN ANIMATION
   Left section slides from left, right section slides from right, meet in center
   ========================================================================== */
function initBlogFeaturedSplitJoin() {
  const card = document.getElementById('featuredArticleCard');
  if (!card) return;

  const title = document.getElementById('featuredArticleTitle');
  if (title) splitElementIntoChars(title, 120, 20);

  const desc = document.getElementById('featuredArticleDesc');
  if (desc) splitElementIntoChars(desc, 380, 10);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        card.classList.add('is-joined', 'is-in-view');
      } else {
        card.classList.remove('is-joined', 'is-in-view');
      }
    });
  }, { threshold: 0.12 });

  observer.observe(card);
}

/* ==========================================================================
   19. BLOG 6-CARD SHUFFLE & ARRANGE ANIMATION
   Uses physical FLIP kinematics to lift, shuffle, and glide the 6 articles into position
   ========================================================================== */
function initBlogCardsShuffleAnimation() {
  const grid = document.getElementById('blogGrid');
  const triggerBtn = document.getElementById('shuffleBlogBtn');
  if (!grid) return;

  let isShuffling = false;
  let autoShuffleInterval = null;
  let initialShuffleTimer = null;

  function performShuffle(isManual = false) {
    if (isShuffling) return;
    const cards = Array.from(grid.querySelectorAll('.blog-card'));
    if (cards.length < 2) return;

    isShuffling = true;
    if (triggerBtn) triggerBtn.classList.add('is-shuffling');

    // Step 1: Capture initial layout positions
    const firstRects = cards.map(c => c.getBoundingClientRect());

    // Step 2: Lift & tilt cards (riffle shuffle deck motion)
    cards.forEach((card, idx) => {
      card.classList.add('is-shuffling');
      const tilt = (idx % 2 === 0 ? 1 : -1) * (3.5 + (idx * 0.7));
      const liftY = -18 - (idx % 3) * 3;
      card.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease';
      card.style.transform = `scale(0.95) translateY(${liftY}px) rotate(${tilt}deg)`;
    });

    // Step 3: Rearrange order in DOM & compute inversion deltas
    setTimeout(() => {
      // Re-order cards cyclically (last card rotates to first position)
      const reorderedCards = [...cards];
      const movedCard = reorderedCards.pop();
      reorderedCards.unshift(movedCard);

      // Re-append to DOM in new sequence
      reorderedCards.forEach(c => grid.appendChild(c));

      // Capture new layout positions
      const lastRects = cards.map(c => c.getBoundingClientRect());

      // Invert: shift cards back to their previous screen positions instantaneously
      cards.forEach((card, idx) => {
        const deltaX = firstRects[idx].left - lastRects[idx].left;
        const deltaY = firstRects[idx].top - lastRects[idx].top;
        const angle = (idx % 2 === 0 ? -1 : 1) * 3.5;

        card.style.transition = 'none';
        card.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.95) rotate(${angle}deg)`;
      });

      // Force synchronous layout reflow so the inverted transforms are committed
      void grid.offsetHeight;

      // Step 4: Play arrange animation (cards physically fly and dock into their new arranged slots)
      cards.forEach((card, idx) => {
        const delay = idx * 45; // micro-cascading glide
        card.style.transition = `transform 0.85s cubic-bezier(0.2, 1, 0.3, 1) ${delay}ms, box-shadow 0.85s ease ${delay}ms`;
        card.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';

        setTimeout(() => {
          card.classList.remove('is-shuffling');
          card.style.transition = '';
          card.style.transform = '';
        }, 900 + (cards.length * 45));
      });

      setTimeout(() => {
        if (triggerBtn) triggerBtn.classList.remove('is-shuffling');
        isShuffling = false;
      }, 950 + (cards.length * 45));

    }, 380);
  }

  // Connect manual trigger button
  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      performShuffle(true);
    });
  }

  // Automated trigger on scroll + periodic shuffle while section is visible
  const articlesSection = document.getElementById('blogArticlesSection') || grid.closest('section');
  if (articlesSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Debounced initial shuffle after entering view
          if (initialShuffleTimer) clearTimeout(initialShuffleTimer);
          initialShuffleTimer = setTimeout(() => {
            performShuffle(false);
          }, 800);

          if (!autoShuffleInterval) {
            autoShuffleInterval = setInterval(() => {
              performShuffle(false);
            }, 8500);
          }
        } else {
          if (initialShuffleTimer) {
            clearTimeout(initialShuffleTimer);
            initialShuffleTimer = null;
          }
          if (autoShuffleInterval) {
            clearInterval(autoShuffleInterval);
            autoShuffleInterval = null;
          }
        }
      });
    }, { threshold: 0.15 });

    observer.observe(articlesSection);
  }
}

/* ==========================================================================
   20. TECHNICAL WHITEPAPERS SECTION ENTRANCE
   Reveals 4 blueprint cards cascading from downside + letter right slide
   ========================================================================== */
function initWhitepapersAnimation() {
  const section = document.getElementById('whitepapersSection');
  const grid = document.getElementById('whitepaperGrid');
  if (!section || !grid) return;

  const title = document.getElementById('whitepaperTitle');
  if (title) splitElementIntoChars(title, 100, 20);

  const subtitle = document.getElementById('whitepaperSubtitle');
  if (subtitle) splitElementIntoChars(subtitle, 350, 10);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        section.classList.add('is-in-view');
        grid.classList.add('is-revealed');
      } else {
        section.classList.remove('is-in-view');
        grid.classList.remove('is-revealed');
      }
    });
  }, { threshold: 0.12 });

  observer.observe(section);
}

/* ==========================================================================
   21. TEAM MARQUEE RUNNER (Touch-to-Pause Interaction on Mobile)
   ========================================================================== */
function initTeamMarquee() {
  const marquee = document.getElementById('teamMarquee');
  if (!marquee) return;
  const track = marquee.querySelector('.team-marquee-track');
  if (!track) return;

  marquee.addEventListener('touchstart', () => {
    track.style.animationPlayState = 'paused';
  }, { passive: true });

  marquee.addEventListener('touchend', () => {
    track.style.animationPlayState = 'running';
  }, { passive: true });
}





