/* ========== NAV / MENU ========== */
(function () {
  const body   = document.body;
  const header = document.querySelector('.site-header');
  const toggle = header?.querySelector('.nav-toggle');
  const nav    = document.getElementById('primary-nav');
  const scrim  = header?.querySelector('.nav-scrim');
  const DESKTOP = 900;

  if (!header || !toggle || !nav || !scrim) return;

  const isOpen = () => body.classList.contains('menu-open');
  const lock   = () => { body.style.overflow = 'hidden'; };
  const unlock = () => { body.style.overflow = ''; };

  function openMenu(){
    body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Close menu');
    scrim.hidden = false;
    lock();

    nav.querySelector('a, button, [tabindex]:not([tabindex="-1"])')?.focus({ preventScroll:true });
    startTrap();
  }
  function closeMenu(){
    body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
    scrim.hidden = true;
    unlock();
    stopTrap();
    toggle.focus({ preventScroll:true });
  }
  const toggleMenu = () => (isOpen() ? closeMenu() : openMenu());

  toggle.addEventListener('click', toggleMenu);
  scrim.addEventListener('click', closeMenu);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) closeMenu(); });

  let raf;
  window.addEventListener('resize', ()=>{
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(()=>{
      if (window.innerWidth >= DESKTOP && isOpen()) closeMenu();
    });
  });

  let trapHandler = null;
  function startTrap(){
    const nodes = nav.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    trapHandler = (e)=>{
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', trapHandler);
  }
  function stopTrap(){ if (trapHandler){ document.removeEventListener('keydown', trapHandler); trapHandler = null; } }
})();

/* ========== SERVICES (fallback data) ========== */
const SERVICES = [
  { title: "CRM", desc: "Our CRM empowers us to build stronger customer relationships, streamline sales, and deliver personalized experiences for lasting satisfaction.", btn: "Learn More", href: "pricing-plans.html", img: "images/crm-image.webp", mediaText: "CRM Image" },
  { title: "Web Desinging", desc: "Crafting personalized, visually stunning, and user-friendly websites tailored to your brand, enhancing engagement and driving results.", btn: "Learn More", href: "pricing-plans.html", img: "images/web-designin.webp", mediaText: "Web Design" },
  { title: "Social Media Marketing", desc: "Boost your brand’s presence with tailored social media marketing strategies that engage, connect, and drive customer loyalty.", btn: "Learn More", href: "pricing-plans.html", img: "images/social-media-marketing.webp", mediaText: "Social Media Marketing" },
  { title: "Professional Video Editing", desc: "Transform your raw footage into stunning, personalized stories with our professional video editing expertise and creative flair.", btn: "Learn More", href: "pricing-plans.html", img: "images/professional-video-editing.webp", mediaText: "Professional Video Editing" },
  { title: "SEO", desc: "Boost your online presence with my personalized SEO strategies, driving targeted traffic and improving search rankings.", btn: "Learn More", href: "pricing-plans.html", img: "images/SEO.webp", mediaText: "Search Engine Optimization" },
  { title: "Targetd Ads", desc: "Personalized targeted ads connect your business with the right audience, increasing engagement, conversions, and customer satisfaction effectively.", btn: "Learn More", href: "pricing-plans.html", img: "images/targeted-ads.webp", mediaText: "Targetd Ads" }
];

/* ========== CARD RENDERER ========== */
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

/* ========== API/DATA INTEGRATION with ASYNC + TRY/CATCH ========== */
// Tries to load /data/services.json; falls back to SERVICES if it fails.
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

function renderServices(list) {
  const top = document.getElementById('servicesTop');
  const bottom = document.getElementById('servicesBottom');
  if (!top || !bottom) return;
  top.innerHTML    = list.slice(0, 3).map(cardHTML).join('');
  bottom.innerHTML = list.slice(3, 6).map(cardHTML).join('');
}

document.addEventListener('DOMContentLoaded', loadServices);

/* ========== FORM (ASYNC SUBMIT with TRY/CATCH + fallback) ========== */
(function () {
  const LS_KEY = 'contactSubmissions';
  const TEMP_KEY = 'lastContactSubmission';

  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email    = document.getElementById('email').value.trim();
    const message  = document.getElementById('message').value.trim();
    const service  = document.getElementById('service').value;

    if (!fullName || !email || !message || !service) {
      alert('Please complete all fields.');
      return;
    }

    const record = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      fullName, email, service, message,
      submittedAt: new Date().toISOString()
    };

    let sentToServer = false;

    try {
      // TODO: replace '/api/contact' with your real endpoint (or a mock endpoint)
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const saved = await resp.json();
      console.log('Server saved:', saved); // <-- demonstrate output
      sentToServer = true;
    } catch (err) {
      console.warn('Network/server error; saving locally instead:', err);
      const existing = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      existing.push(record);
      localStorage.setItem(LS_KEY, JSON.stringify(existing));
    }

    // Save the last submission for the thank-you page regardless
    localStorage.setItem(TEMP_KEY, JSON.stringify({ ...record, sentToServer }));

    // Redirect to thank you page
    window.location.href = 'submitted.html';
  });
})();

/* ========== CAROUSEL (guarded) ========== */
(function(){
  const wrapper  = document.querySelector('.carousel-wrapper');
  if (!wrapper) return;

  const carousel = wrapper.querySelector('.carousel');
  const items    = wrapper.querySelectorAll('.card');
  const prevBtn  = wrapper.querySelector('.prev');
  const nextBtn  = wrapper.querySelector('.next');

  if (!carousel || !items.length || !prevBtn || !nextBtn) return;

  let index = 0;

  function visibleCount() {
    const w = window.innerWidth;
    if (w < 768) return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  function stepSize() {
    const itemW = items[0].getBoundingClientRect().width; 
    const styles = getComputedStyle(carousel);
    const gap = parseFloat(styles.gap || styles.columnGap || 0); 
    return itemW + gap;
  }

  function maxIndex() {
    return Math.max(0, items.length - visibleCount());
  }

  function updateCarousel() {
    if (index > maxIndex()) index = maxIndex();
    if (index < 0) index = 0;

    const x = -(index * stepSize());
    carousel.style.transform = `translateX(${x}px)`;
  }

  prevBtn.addEventListener('click', () => {
    index -= visibleCount();
    updateCarousel();
  });
  nextBtn.addEventListener('click', () => {
    index += visibleCount();
    updateCarousel();
  });

  window.addEventListener('resize', updateCarousel);
  window.addEventListener('load', updateCarousel);
  updateCarousel();
})();
