/**
 * STACKLY — Interactive Dashboard Logic & Chart Engine
 * Manages: User session sync, Chart.js instances, Module switching,
 * Dropdown controls, Notifications, Mobile sidebar, and Logout.
 */

// Prevent browser from restoring old scrolled-down position on load/reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  initUserSession();
  initSidebarNavigation();
  initDropdowns();
  initMobileSidebar();
  initLogoutHandler();
  initDashboardActionButtons();
  initLiveNumberCounters();
  startLiveTelemetryTicker();
  initThreeCardShuffleAnimation();

  // Determine which dashboard is active
  if (document.body.classList.contains('dashboard-founder')) {
    initFounderCharts();
  } else if (document.body.classList.contains('dashboard-engineer')) {
    initEngineerCharts();
  }
});

/* ==========================================================================
   1. USER SESSION MANAGEMENT & UI POPULATION
   ========================================================================== */
function initUserSession() {
  const isFounderPage = document.body.classList.contains('dashboard-founder');

  // Retrieve stored session
  let user = null;
  try {
    const raw = sessionStorage.getItem('stackly_user') || localStorage.getItem('stackly_user');
    if (raw) user = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse user session', e);
  }

  // Provide realistic defaults if user accessed page directly
  if (!user) {
    if (isFounderPage) {
      user = {
        name: 'Marcus Vance',
        email: 'marcus.vance@gmail.com',
        role: 'founder',
        roleTitle: 'Founder & Executive',
        avatarInitials: 'MV'
      };
    } else {
      user = {
        name: 'Elena Rostova',
        email: 'elena.rostova@gmail.com',
        role: 'engineer',
        roleTitle: 'DevOps & Infrastructure Architect',
        avatarInitials: 'ER'
      };
    }
  }

  // Populate UI elements
  const userGreetingName = document.querySelectorAll('.dyn-user-name');
  const userInitials = document.querySelectorAll('.dyn-user-initials');
  const userEmail = document.querySelectorAll('.dyn-user-email');
  const userRole = document.querySelectorAll('.dyn-user-role');

  userGreetingName.forEach(el => el.textContent = user.name);
  userInitials.forEach(el => el.textContent = user.avatarInitials || 'ST');
  userEmail.forEach(el => el.textContent = user.email);
  userRole.forEach(el => el.textContent = user.roleTitle);
}

/* ==========================================================================
   2. SIDEBAR MODULE NAVIGATION (TAB SWITCHING)
   ========================================================================== */
function initSidebarNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav-item[data-module]');
  const moduleSections = document.querySelectorAll('.dash-module-section');
  const pageTitle = document.querySelector('.dash-page-title');
  const breadcrumb = document.querySelector('.dash-page-breadcrumb');

  if (!navItems.length || !moduleSections.length) return;

  // Helper to scroll view to the absolute top of the page and content container
  const scrollToDashboardTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const dashMain = document.querySelector('.dash-main');
    if (dashMain) dashMain.scrollTop = 0;
    const dashContent = document.querySelector('.dash-content');
    if (dashContent) dashContent.scrollTop = 0;
  };

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModule = item.getAttribute('data-module');
      const moduleTitle = item.getAttribute('data-title') || 'Overview';

      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Update active section
      moduleSections.forEach(section => {
        if (section.id === targetModule) {
          section.classList.add('active');
          retriggerSectionAnimations(section);
        } else {
          section.classList.remove('active');
        }
      });

      // Update header title
      if (pageTitle) pageTitle.textContent = moduleTitle;
      if (breadcrumb) breadcrumb.textContent = `Dashboard / ${moduleTitle}`;

      // Close mobile sidebar if open
      const sidebar = document.querySelector('.dash-sidebar');
      if (sidebar) sidebar.classList.remove('open');

      // Always reset scroll to the top so user starts from the top of the selected section
      scrollToDashboardTop();
    });
  });

  // Handle clicking the Stackly logo brand pill in the dashboard sidebar:
  // Navigates to the respective dashboard's first page (Overview module)
  const brandPill = document.querySelector('.sidebar-brand-pill');
  if (brandPill) {
    brandPill.addEventListener('click', (e) => {
      e.preventDefault();
      const firstNav = navItems[0];
      if (firstNav) {
        firstNav.click();
      }
      scrollToDashboardTop();
    });
  }
}

/* ==========================================================================
   3. DROPDOWNS (NOTIFICATIONS & PROFILE)
   ========================================================================== */
function initDropdowns() {
  const notifBtn = document.getElementById('notifDropdownBtn');
  const notifMenu = document.getElementById('notifDropdownMenu');
  const profileBtn = document.getElementById('profileDropdownBtn');
  const profileMenu = document.getElementById('profileDropdownMenu');

  // Notifications Bell -> Navigates to 404 page
  if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
      window.location.href = '404.html';
    });
  }

  // Toggle Profile Dropdown
  if (profileBtn && profileMenu) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (notifMenu) notifMenu.classList.remove('show');
      profileMenu.classList.toggle('show');
    });
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (notifMenu && !notifMenu.contains(e.target) && !notifBtn.contains(e.target)) {
      notifMenu.classList.remove('show');
    }
    if (profileMenu && !profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
      profileMenu.classList.remove('show');
    }
  });
}

/* ==========================================================================
   4. MOBILE SIDEBAR DRAWER
   ========================================================================== */
function initMobileSidebar() {
  const toggleBtn = document.getElementById('dashSidebarToggle');
  const closeBtn = document.getElementById('dashSidebarClose');
  const sidebar = document.querySelector('.dash-sidebar');

  if (sidebar) {
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    // Close on any navigation item click
    const navItems = sidebar.querySelectorAll('.sidebar-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          sidebar.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
          sidebar.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    });
  }
}

/* ==========================================================================
   5. LOGOUT HANDLER
   ========================================================================== */
function initLogoutHandler() {
  const logoutBtns = document.querySelectorAll('.logout-action-btn');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('stackly_user');
      localStorage.removeItem('stackly_user');
      window.location.href = 'login.html';
    });
  });
}

/* ==========================================================================
   6. FOUNDER & EXECUTIVE CHARTS (Chart.js - Clean Light Theme)
   ========================================================================== */
function initFounderCharts() {
  if (typeof Chart === 'undefined') return;

  // Chart defaults for clean white theme
  Chart.defaults.color = '#64748b';
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.borderColor = '#e2e8f0';

  // Chart 1: Revenue Growth Area Chart
  const revCtx = document.getElementById('founderRevenueChart');
  if (revCtx) {
    const gradient = revCtx.getContext('2d').createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(140, 79, 39, 0.15)');
    gradient.addColorStop(1, 'rgba(140, 79, 39, 0.0)');

    const revChart = new Chart(revCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'ARR ($k)',
          data: [72, 85, 94, 108, 115, 126, 138, 150, 168, 185, 210, 242],
          borderColor: '#8C4F27',
          borderWidth: 2.5,
          pointBackgroundColor: '#8C4F27',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          backgroundColor: gradient,
          tension: 0.38
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1800,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#090d16',
            titleColor: '#ffffff',
            bodyColor: '#cbd5e1',
            borderColor: '#090d16',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context) => `$${context.raw}K ARR`
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: '#e2e8f0' },
            ticks: {
              callback: (val) => `$${val}k`
            }
          }
        }
      }
    });

    // Timeframe toggle filter
    setupTimeframeButtons('revenueTimeframes', (period) => {
      if (period === '7D') {
        revChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        revChart.data.datasets[0].data = [232, 235, 238, 236, 240, 241, 242];
      } else if (period === '30D') {
        revChart.data.labels = ['W1', 'W2', 'W3', 'W4'];
        revChart.data.datasets[0].data = [210, 218, 230, 242];
      } else {
        revChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        revChart.data.datasets[0].data = [72, 85, 94, 108, 115, 126, 138, 150, 168, 185, 210, 242];
      }
      revChart.update();
    });
  }

  // Chart 2: Revenue Tier Pie / Doughnut Chart
  const tierCtx = document.getElementById('founderTierChart');
  if (tierCtx) {
    new Chart(tierCtx, {
      type: 'doughnut',
      data: {
        labels: ['Enterprise Tier', 'Growth Scale', 'Starter Pro'],
        datasets: [{
          data: [54, 32, 14],
          backgroundColor: ['#8C4F27', '#A56236', '#D6B49A'],
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 16,
              color: '#475569'
            }
          },
          tooltip: {
            backgroundColor: '#090d16',
            borderColor: '#090d16',
            borderWidth: 1,
            callbacks: {
              label: (context) => ` ${context.label}: ${context.raw}%`
            }
          }
        }
      }
    });
  }

  // Chart 3: Sales Conversion Funnel Bar Chart
  const funnelCtx = document.getElementById('founderFunnelChart');
  if (funnelCtx) {
    new Chart(funnelCtx, {
      type: 'bar',
      data: {
        labels: ['Inbound Leads', 'MQL Qualified', 'Product Demos', 'Contract Sent', 'Closed Won'],
        datasets: [{
          label: 'Opportunities',
          data: [1240, 680, 340, 160, 94],
          backgroundColor: ['#582B10', '#723C1A', '#8C4F27', '#A56236', '#C88A58'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1600,
          easing: 'easeOutCubic'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#090d16',
            borderColor: '#090d16',
            borderWidth: 1
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#e2e8f0' } }
        }
      }
    });
  }
}

/* ==========================================================================
   7. DEVOPS & CLOUD ARCHITECT CHARTS (Chart.js - Clean Light Theme)
   ========================================================================== */
function initEngineerCharts() {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.color = '#64748b';
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.borderColor = '#e2e8f0';

  // Chart 1: Latency & Traffic 24h Dual Line Chart
  const latencyCtx = document.getElementById('engineerLatencyChart');
  if (latencyCtx) {
    new Chart(latencyCtx, {
      type: 'line',
      data: {
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', 'Now'],
        datasets: [
          {
            label: 'Latency (ms)',
            data: [14, 12, 11, 24, 28, 22, 19, 21, 18],
            borderColor: '#8C4F27',
            backgroundColor: '#8C4F27',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            yAxisID: 'y'
          },
          {
            label: 'RPS (k req/s)',
            data: [4.2, 3.1, 2.8, 12.5, 18.2, 16.4, 14.1, 11.2, 15.6],
            borderColor: '#64748b',
            borderWidth: 2,
            borderDash: [4, 4],
            tension: 0.4,
            pointRadius: 0,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 12, color: '#475569' }
          },
          tooltip: {
            backgroundColor: '#090d16',
            borderColor: '#090d16',
            borderWidth: 1
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            type: 'linear',
            position: 'left',
            grid: { color: '#e2e8f0' },
            ticks: { callback: (v) => `${v}ms` }
          },
          y1: {
            type: 'linear',
            position: 'right',
            grid: { display: false },
            ticks: { callback: (v) => `${v}k` }
          }
        }
      }
    });
  }

  // Chart 2: Resource Allocation Pie/Doughnut Chart
  const resourceCtx = document.getElementById('engineerResourceChart');
  if (resourceCtx) {
    new Chart(resourceCtx, {
      type: 'doughnut',
      data: {
        labels: ['CPU Cores', 'Memory (RAM)', 'NVMe Storage', 'Network Bandwidth'],
        datasets: [{
          data: [42, 30, 18, 10],
          backgroundColor: ['#8C4F27', '#A56236', '#C88A58', '#E8DDD2'],
          borderColor: '#ffffff',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 14, color: '#475569' }
          }
        }
      }
    });
  }

  // Chart 3: Microservice Requests Distribution Bar Chart
  const microserviceCtx = document.getElementById('engineerMicroserviceChart');
  if (microserviceCtx) {
    new Chart(microserviceCtx, {
      type: 'bar',
      data: {
        labels: ['API Gateway', 'Auth Service', 'Billing Engine', 'Kafka Stream', 'Telemetry Ingest'],
        datasets: [{
          label: 'Requests / min (k)',
          data: [142, 88, 45, 120, 210],
          backgroundColor: ['#582B10', '#723C1A', '#8C4F27', '#A56236', '#C88A58'],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#090d16',
            borderColor: '#090d16',
            borderWidth: 1
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#e2e8f0' } }
        }
      }
    });
  }
}

/* ==========================================================================
   HELPER UTILITIES
   ========================================================================== */
function setupTimeframeButtons(containerId, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const buttons = container.querySelectorAll('.chart-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const period = btn.getAttribute('data-period');
      onSelect(period);
    });
  });
}

// Global Export Simulation & Action Redirect (Navigates to 404.html as requested)
window.exportDashboardData = function(format) {
  window.location.href = '404.html';
};

/* ==========================================================================
   8. DASHBOARD OPERATIONAL ACTION BUTTONS REDIRECTION (TO 404.HTML)
   ========================================================================== */
function initDashboardActionButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, .btn');
    if (!btn) return;

    // Do NOT intercept navigation tabs, dropdown triggers, or theme controls
    if (
      btn.classList.contains('chart-btn') ||
      btn.classList.contains('sidebar-nav-item') ||
      btn.classList.contains('dash-sidebar-mobile-toggle') ||
      btn.classList.contains('notification-bell-btn') ||
      btn.classList.contains('profile-trigger-btn') ||
      btn.classList.contains('logout-action-btn') ||
      btn.id === 'dashSidebarToggle' ||
      btn.id === 'notifDropdownBtn' ||
      btn.id === 'profileDropdownBtn'
    ) {
      return;
    }

    // Check if the button is an operational/action button inside dashboard content
    const text = (btn.textContent || '').trim().toLowerCase();
    const isTargetAction = 
      text.includes('download') ||
      text.includes('export') ||
      text.includes('trigger') ||
      text.includes('manage') ||
      text.includes('generate') ||
      text.includes('configure') ||
      text.includes('promote') ||
      text.includes('audit') ||
      text.includes('statement') ||
      text.includes('package');

    if (isTargetAction || btn.closest('.dash-content button') || btn.closest('.data-panel-card button')) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = '404.html';
    }
  });
}

/* ==========================================================================
   9. LIVE NUMBER COUNTERS & TICKER ENGINE
   ========================================================================== */
function initLiveNumberCounters() {
  const activeSection = document.querySelector('.dash-module-section.active') || document;
  runLiveCounters(activeSection);
}

function runLiveCounters(container) {
  if (!container) return;
  const valueElements = container.querySelectorAll('.kpi-card-value');

  valueElements.forEach(el => {
    // Preserve original raw text for re-counting
    if (!el.dataset.targetRaw) {
      el.dataset.targetRaw = el.textContent.trim();
    }
    const raw = el.dataset.targetRaw;

    // Regex extract prefix, numeric value with commas/decimals, and suffix
    const match = raw.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!match) return;

    const prefix = match[1] || '';
    const numClean = match[2].replace(/,/g, '');
    const suffix = match[3] || '';
    const targetNum = parseFloat(numClean);
    if (isNaN(targetNum)) return;

    const decimalParts = numClean.split('.');
    const decimals = decimalParts.length > 1 ? decimalParts[1].length : 0;
    const hasCommas = match[2].includes(',');

    // Start live count-up animation
    const duration = 1400; // ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = targetNum * ease;

      let formatted = decimals > 0 ? currentVal.toFixed(decimals) : Math.floor(currentVal).toString();
      if (hasCommas) {
        const parts = formatted.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        formatted = parts.join('.');
      }

      el.textContent = `${prefix}${formatted}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = raw;
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

/* Periodic subtle live heartbeat indicator across telemetry */
function startLiveTelemetryTicker() {
  setInterval(() => {
    const activeSection = document.querySelector('.dash-module-section.active');
    if (!activeSection) return;

    const cards = activeSection.querySelectorAll('.kpi-card');
    if (!cards.length) return;

    // Pick one card at random for a live heartbeat pulse
    const idx = Math.floor(Math.random() * cards.length);
    const card = cards[idx];
    const icon = card.querySelector('.kpi-card-icon');
    if (icon) {
      icon.style.borderColor = '#10b981';
      icon.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.4)';
      setTimeout(() => {
        icon.style.borderColor = '';
        icon.style.boxShadow = '';
      }, 800);
    }
  }, 4500);
}

/* ==========================================================================
   10. RETRIGGER DYNAMIC ENTRANCE ANIMATIONS ON MODULE SWITCH
   ========================================================================== */
function retriggerSectionAnimations(section) {
  if (!section) return;

  // 1. Re-trigger the restored entrance animations:
  // - Section 1: Welcome Banner (Left-to-Right)
  // - Section 2: KPI Grid / Cluster Nodes (Right-to-Left)
  // - Section 3: Charts & Data Panels (Bottom-to-Top)
  const animElements = section.querySelectorAll(
    '.dash-welcome-banner, .kpi-cards-grid, .cluster-nodes-grid, .charts-grid-row, .data-panel-card, .module-sub-grid'
  );
  animElements.forEach(el => {
    el.style.animation = 'none';
    void el.offsetHeight; // trigger DOM reflow
    el.style.animation = '';
  });

  // 2. Re-trigger table rows cascading one-by-one
  const tables = section.querySelectorAll('.modern-table tbody');
  tables.forEach(tbody => {
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(tr => {
      tr.style.animation = 'none';
      void tr.offsetHeight;
      tr.style.animation = '';
    });
  });

  // 3. Run live number counters for the newly visible section
  runLiveCounters(section);

  // 4. Re-trigger 3-card shuffle & arrange animations for milestone grids in this section
  const threeCardGridsInSec = section.querySelectorAll('.three-cards-grid');
  threeCardGridsInSec.forEach(grid => {
    if (typeof grid._performShuffle === 'function') {
      setTimeout(() => {
        grid._performShuffle();
      }, 650);
    }
  });
}

/* ==========================================================================
   13. THREE-CARD SHUFFLE & ARRANGE ANIMATION
   - Designed for 3-card milestone and scenario grids
   - Shuffle phase: 3rd card swaps to 1st slot, 1st card swaps to 3rd slot with a riffle tilt, 2nd card lifts in place
   - Arrange phase: Cards glide across into their proper positions (Milestone 01, Milestone 02, Milestone 03) and settle
   ========================================================================== */
function setupThreeCardGrid(grid, triggerBtn) {
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.scenario-card'));
  if (cards.length !== 3) return;

  let isShuffling = false;

  function performShuffle() {
    if (isShuffling) return;
    // If hidden (e.g. inside a non-active tab), do not run
    if (grid.offsetParent === null) return;

    const card0 = cards[0]; // Milestone 01 (Natural slot 0)
    const card1 = cards[1]; // Milestone 02 (Natural slot 1)
    const card2 = cards[2]; // Milestone 03 (Natural slot 2)

    // Compute coordinate deltas between slot 0 and slot 2
    const r0 = card0.getBoundingClientRect();
    const r2 = card2.getBoundingClientRect();

    const deltaX = r2.left - r0.left;
    const deltaY = r2.top - r0.top;

    // Safety check: if cards have 0 width or aren't rendered yet
    if (r0.width === 0) return;

    isShuffling = true;
    if (triggerBtn) triggerBtn.classList.add('is-shuffling');

    cards.forEach(c => {
      c.classList.add('is-shuffling');
      c.classList.remove('docked-settled');
    });

    const isHorizontal = Math.abs(deltaX) > 40;

    // STEP 1: SHUFFLE PHASE (Swap Card 0 and Card 2, lift Card 1)
    if (isHorizontal) {
      // Card 2 shifts across to 1st slot with deck riffle tilt
      card2.style.transition = 'transform 0.48s cubic-bezier(0.34, 1.45, 0.64, 1), box-shadow 0.45s ease';
      card2.style.transform = `translate(${-deltaX}px, ${-deltaY}px) translateY(-18px) rotate(-3.5deg) scale(0.97)`;

      // Card 0 shifts across to 3rd slot with opposing tilt
      card0.style.transition = 'transform 0.48s cubic-bezier(0.34, 1.45, 0.64, 1), box-shadow 0.45s ease';
      card0.style.transform = `translate(${deltaX}px, ${deltaY}px) translateY(-18px) rotate(3.5deg) scale(0.97)`;

      // Card 1 lifts in place in the middle slot
      card1.style.transition = 'transform 0.48s cubic-bezier(0.34, 1.45, 0.64, 1), box-shadow 0.45s ease';
      card1.style.transform = 'translateY(-14px) scale(0.95)';
    } else {
      // Mobile vertical column layout
      card2.style.transition = 'transform 0.48s cubic-bezier(0.34, 1.45, 0.64, 1), box-shadow 0.45s ease';
      card2.style.transform = `translateY(${-deltaY}px) translateX(8px) rotate(-2.5deg) scale(0.98)`;

      card0.style.transition = 'transform 0.48s cubic-bezier(0.34, 1.45, 0.64, 1), box-shadow 0.45s ease';
      card0.style.transform = `translateY(${deltaY}px) translateX(-8px) rotate(2.5deg) scale(0.98)`;

      card1.style.transition = 'transform 0.48s cubic-bezier(0.34, 1.45, 0.64, 1), box-shadow 0.45s ease';
      card1.style.transform = 'translateY(-8px) scale(0.96)';
    }

    // STEP 2: ARRANGE PHASE
    // After pausing in the swapped shuffled configuration, cards glide and dock into correct positions
    setTimeout(() => {
      // Card 0 glides across to 1st slot
      card0.style.transition = 'transform 0.95s cubic-bezier(0.2, 1, 0.3, 1), box-shadow 0.95s ease';
      card0.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';

      // Card 2 glides across to 3rd slot
      card2.style.transition = 'transform 0.95s cubic-bezier(0.2, 1, 0.3, 1), box-shadow 0.95s ease';
      card2.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';

      // Card 1 docks back into 2nd slot
      card1.style.transition = 'transform 0.95s cubic-bezier(0.2, 1, 0.3, 1), box-shadow 0.95s ease';
      card1.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';

      // STEP 3: DOCKED SETTLING FEEDBACK & CLEANUP
      setTimeout(() => {
        cards.forEach(c => {
          c.classList.remove('is-shuffling');
          c.classList.add('docked-settled');
          c.style.transition = '';
          c.style.transform = '';
        });
        if (triggerBtn) triggerBtn.classList.remove('is-shuffling');

        setTimeout(() => {
          cards.forEach(c => c.classList.remove('docked-settled'));
          isShuffling = false;
        }, 500);
      }, 980);
    }, 700);
  }

  // Attach handle for section switches
  grid._performShuffle = performShuffle;

  // Click trigger button
  if (triggerBtn) {
    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      performShuffle();
    });
  }

  // Clicking any card triggers a playful shuffle & arrange
  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (!isShuffling) performShuffle();
    });
  });

  // IntersectionObserver to trigger on scroll
  if ('IntersectionObserver' in window) {
    let triggeredByScroll = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (grid.offsetParent !== null && !triggeredByScroll) {
              triggeredByScroll = true;
              performShuffle();
            }
          }, 650);
        } else {
          // Allow re-trigger when scrolling away and back
          if (entry.boundingClientRect.top > window.innerHeight) {
            triggeredByScroll = false;
          }
        }
      });
    }, { threshold: 0.25 });

    observer.observe(grid);
  }
}

function initThreeCardShuffleAnimation() {
  const grids = document.querySelectorAll('.three-cards-grid');
  grids.forEach(grid => {
    const parentCard = grid.closest('.data-panel-card') || grid.parentElement;
    const triggerBtn = parentCard ? parentCard.querySelector('.shuffle-trigger-btn') : null;
    setupThreeCardGrid(grid, triggerBtn);
  });
}


