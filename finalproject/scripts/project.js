/* =========================================================
   NAV / MENU
   - Handles mobile nav toggle, focus trapping, and body scroll lock
   - Closes automatically on desktop resize breakpoint
   ========================================================= */
(function () {
  // Cache frequently used nodes and constants
  const body   = document.body;
  const header = document.querySelector('.site-header');
  const toggle = header?.querySelector('.nav-toggle');       // Button that opens/closes the menu
  const nav    = document.getElementById('primary-nav');     // Main nav container (focus trap lives here)
  const DESKTOP = 900;                                       // px breakpoint where menu should auto-close

  // If any critical element is missing, bail early
  if (!header || !toggle || !nav ) return;

  // Helpers for menu state and scroll locking
  const isOpen = () => body.classList.contains('menu-open');
  const lock   = () => { body.style.overflow = 'hidden'; };  // Prevent background scroll when menu is open
  const unlock = () => { body.style.overflow = '';  };        // Restore default overflow

  // Open the off-canvas menu
  function openMenu(){
    body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded','true');             // Better a11y for assistive tech
    toggle.setAttribute('aria-label','Close menu');
    lock();

    // Move focus to the first focusable element in the nav (prevents focus loss)
    nav.querySelector('a, button, [tabindex]:not([tabindex="-1"])')?.focus({ preventScroll:true });

    // Start focus trap so Tab stays within the menu
    startTrap();
  }

  // Close the off-canvas menu
  function closeMenu(){
    body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
    unlock();

    // Stop focus trap and return focus to the toggle for logical focus order
    stopTrap();
    toggle.focus({ preventScroll:true });
  }

  // Toggle convenience wrapper
  const toggleMenu = () => (isOpen() ? closeMenu() : openMenu());

  // Wire up open/close interactions
  toggle.addEventListener('click', toggleMenu);              // Main toggle button
  nav.querySelectorAll('a').forEach(a =>                     // Navigating to a link closes the menu
    a.addEventListener('click', closeMenu)
  );

  // Allow ESC key to close the menu
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) closeMenu(); });

  // On resize, if we cross into desktop widths, auto-close the menu
  // requestAnimationFrame batches DOM reads/writes after resize finishes
  let raf;
  window.addEventListener('resize', ()=>{
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(()=>{
      if (window.innerWidth >= DESKTOP && isOpen()) closeMenu();
    });
  });

  // ===== Simple focus trap implementation =====
  let trapHandler = null;

  function startTrap(){
    // All tabbable elements within the nav
    const nodes = nav.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!nodes.length) return;

    const first = nodes[0], last = nodes[nodes.length - 1];

    // Keep focus cycling between the first and last element when Tab/Shift+Tab at edges
    trapHandler = (e)=>{
      if (e.key !== 'Tab') return;

      // Shift+Tab on first sends focus to last
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
      // Tab on last sends focus to first
      else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', trapHandler);
  }

  function stopTrap(){
    if (trapHandler){
      document.removeEventListener('keydown', trapHandler);
      trapHandler = null;
    }
  }
})();

/* =========================================================
   SERVICES DATA (fallback)
   Used if ./data/services.json is unavailable
   ========================================================= */
const SERVICES = [
  {
    title: "CRM",
    desc: "Our CRM empowers us to build stronger customer relationships, streamline sales, and deliver personalized experiences for lasting satisfaction.",
    btn: "Learn More",
    href: "pricing-plans.html",
    img: "images/crm-image.webp",
    mediaText: "CRM Image"
  },
  {
    title: "Web Designing",
    desc: "Crafting personalized, visually stunning, and user-friendly websites tailored to your brand, enhancing engagement and driving results.",
    btn: "Learn More",
    href: "pricing-plans.html",
    img: "images/web-designin.webp",
    mediaText: "Web Design"
  },
  {
    title: "Social Media Marketing",
    desc: "Boost your brand’s presence with tailored social media marketing strategies that engage, connect, and drive customer loyalty.",
    btn: "Learn More",
    href: "pricing-plans.html",
    img: "images/social-media-marketing.webp",
    mediaText: "Social Media Marketing"
  },
  {
    title: "Professional Video Editing",
    desc: "Transform your raw footage into stunning, personalized stories with our professional video editing expertise and creative flair.",
    btn: "Learn More",
    href: "pricing-plans.html",
    img: "images/professional-video-editing.webp",
    mediaText: "Professional Video Editing"
  },
  {
    title: "SEO",
    desc: "Boost your online presence with my personalized SEO strategies, driving targeted traffic and improving search rankings.",
    btn: "Learn More",
    href: "pricing-plans.html",
    img: "images/SEO.webp",
    mediaText: "Search Engine Optimization"
  },
  {
    title: "Targeted Ads",
    desc: "Personalized targeted ads connect your business with the right audience, increasing engagement, conversions, and customer satisfaction effectively.",
    btn: "Learn More",
    href: "pricing-plans.html",
    img: "images/targeted-ads.webp",
    mediaText: "Targeted Ads"
  }
];

/* =========================================================
   CARD RENDERER
   - Pure function that returns a card's HTML string
   ========================================================= */
const cardHTML = (item) => `
  <article class="service-card">
    <div class="media">
      <img src="${item.img}" alt="${item.mediaText}" loading="lazy">
    </div>
    <h3>${item.title}</h3>
    <p>${item.desc}</p>
    <a class="btn btn-small btn-ghost" href="${item.href}">${item.btn}</a>
  </article>
`;

/* =========================================================
   API/DATA INTEGRATION with ASYNC + TRY/CATCH
   - Attempts to fetch ./data/services.json (no cache)
   - Falls back to in-file SERVICES if fetch fails
   ========================================================= */
async function loadServices() {
  try {
    const res = await fetch('./data/services.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const services = await res.json();
    renderServices(services);
  } catch (err) {
    console.warn('Failed to fetch services; using fallback data.', err);
    renderServices(SERVICES);
  }
}

/**
 * Injects top/bottom service cards into #servicesTop / #servicesBottom
 * Expects at least 6 items; gracefully renders what’s available otherwise
 */
function renderServices(list) {
  const top = document.getElementById('servicesTop');
  const bottom = document.getElementById('servicesBottom');
  if (!top || !bottom) return;

  top.innerHTML    = list.slice(0, 3).map(cardHTML).join('');
  bottom.innerHTML = list.slice(3, 6).map(cardHTML).join('');
}

// Ensure services render once DOM is ready
document.addEventListener('DOMContentLoaded', loadServices);

/* =========================================================
   CONTACT FORM (Progressive enhancement)
   - Tries to POST to /api/contact
   - On network/server failure, stores in localStorage as offline fallback
   - Persists last attempt (with sentToServer flag) in TEMP_KEY for thank-you page
   ========================================================= */
(function () {
  const LS_KEY = 'contactSubmissions';     // Offline queue for failed submissions
  const TEMP_KEY = 'lastContactSubmission';// Singular record for immediate confirmation page

  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Gather and minimally validate user input
    const fullName = document.getElementById('fullName').value.trim();
    const email    = document.getElementById('email').value.trim();
    const message  = document.getElementById('message').value.trim();
    const service  = document.getElementById('service').value;

    if (!fullName || !email || !message || !service) {
      alert('Please complete all fields.');
      return;
    }

    // Create a submission record with a resilient ID
    const record = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      fullName, email, service, message,
      submittedAt: new Date().toISOString()
    };

    let sentToServer = false;

    try {
      // Attempt to send to server API
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      // Optionally consume the server response (ID, etc.)
      const saved = await resp.json();
      console.log('Server saved:', saved);
      sentToServer = true;
    } catch (err) {
      // On failure, push to localStorage queue for future retry
      console.warn('Network/server error; saving locally instead:', err);
      const existing = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      existing.push(record);
      localStorage.setItem(LS_KEY, JSON.stringify(existing));
    }

    // Store a single “last submission” record used by submitted.html for UI feedback
    localStorage.setItem(TEMP_KEY, JSON.stringify({ ...record, sentToServer }));

    // Navigate to a confirmation page (static or dynamic)
    window.location.href = 'submitted.html';
  });
})();

/* =========================================================
   BASIC CAROUSEL (No external libs)
   - Shows 1/2/3 cards depending on viewport width
   - Moves by the current visible count for a snap-like experience
   - Respects CSS gap for accurate step size
   ========================================================= */
(function(){
  const wrapper  = document.querySelector('.carousel-wrapper');
  if (!wrapper) return;

  const carousel = wrapper.querySelector('.carousel'); // The moving track (flex row or grid)
  const items    = wrapper.querySelectorAll('.card');  // Individual cards
  const prevBtn  = wrapper.querySelector('.prev');     // Prev control
  const nextBtn  = wrapper.querySelector('.next');     // Next control

  // Ensure all required pieces exist
  if (!carousel || !items.length || !prevBtn || !nextBtn) return;

  let index = 0; // Index of the left-most visible card

  // How many cards should be visible at this viewport width?
  function visibleCount() {
    const w = window.innerWidth;
    if (w < 768) return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  // Calculate the pixel distance for one step, including CSS gap
  function stepSize() {
    const itemW = items[0].getBoundingClientRect().width;
    const styles = getComputedStyle(carousel);
    const gap = parseFloat(styles.gap || styles.columnGap || 0);
    return itemW + gap;
  }

  // Clamp the index so we can't scroll past the last full page
  function maxIndex() {
    return Math.max(0, items.length - visibleCount());
  }

  // Apply transform to slide the track based on current index
  function updateCarousel() {
    if (index > maxIndex()) index = maxIndex();
    if (index < 0) index = 0;

    const x = -(index * stepSize());
    carousel.style.transform = `translateX(${x}px)`;
  }

  // Move by a page (equal to number of visible items)
  prevBtn.addEventListener('click', () => {
    index -= visibleCount();
    updateCarousel();
  });
  nextBtn.addEventListener('click', () => {
    index += visibleCount();
    updateCarousel();
  });

  // Keep layout responsive
  window.addEventListener('resize', updateCarousel);
  window.addEventListener('load', updateCarousel);

  // Initial position
  updateCarousel();
})();
