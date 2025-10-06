// /scripts/places.js
import { places } from '../data/places.mjs';

const base_root = document.querySelector('#places');

function createPlaceCard(place) {
  const article = document.createElement('article');
  article.className = 'place-card';
  article.innerHTML = `
    <figure class="place-media" style="--bg:url('./images/places/${place.image_url}')">
      <img src="./images/${place.image_url}"
           alt="${place.title}"
           loading="lazy"
           width="640" height="420">
    </figure>

    <h3 class="place-title">${place.title}</h3>

    <p class="place-address">
      <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
      <span>${place.address}</span>
    </p>

    <p class="place-desc">${place.description}</p>

    <div class="place-cta">
      <a class="discover-btn" href="#" aria-label="View more about ${place.title}">Learn More</a>
    </div>
  `;
  return article;
}

function renderPlaces(list) {
  if (!base_root) return;
  base_root.innerHTML = '';
  list.forEach(p => base_root.appendChild(createPlaceCard(p)));
}

/* ---------- LAST VISIT OVERLAY ---------- */
const STORAGE_KEY = 'lastVisitMs';

function initVisitMsg() {
  const container = document.getElementById('visit-msg');
  if (!container) return;

  container.classList.add('as-overlay');

  const nowMs = Date.now();
  const lastMsRaw = localStorage.getItem(STORAGE_KEY);
  const lastMs = Number(lastMsRaw);

  let message = '';
  if (!lastMs || Number.isNaN(lastMs)) {
    message = 'Welcome! Let us know if you have any questions.';
  } else {
    const diffMs = nowMs - lastMs;
    const dayMs = 86_400_000;
    const days = Math.floor(diffMs / dayMs);
    message = days < 1
      ? 'Back so soon! Awesome!'
      : `You last visited ${days} ${days === 1 ? 'day' : 'days'} ago.`;
  }

  const textNode = container.querySelector('[data-msg]');
  if (textNode) textNode.textContent = message;
  container.hidden = false;

  localStorage.setItem(STORAGE_KEY, String(nowMs));

  const closeBtn = container.querySelector('[data-close]');
  const hide = (ev) => {
    ev?.preventDefault?.();
    ev?.stopPropagation?.();
    container.remove();
  };

  closeBtn?.addEventListener('click', hide, { capture: true });
  closeBtn?.addEventListener('pointerup', hide, { capture: true });

  container.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.nodeType === Node.ELEMENT_NODE && t.closest('[data-close]')) {
      hide(e);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.contains(container)) hide(e);
  });
}

/* ---------- NAV / THEME / FOOTER UTIL ---------- */
function initChrome() {
  const root     = document.documentElement;
  const nav      = document.getElementById('primary-menu');
  const openBtn  = document.querySelector('.menu-toggle');
  const closeBtn = document.querySelector('.menu-close');

  const isDesktop = () => window.matchMedia('(min-width:768px)').matches;

  function openMenu() {
    nav.classList.add('open');
    root.classList.add('nav-open');
    openBtn?.setAttribute('aria-expanded', 'true');
    openBtn?.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    nav.classList.remove('open');
    root.classList.remove('nav-open');
    openBtn?.setAttribute('aria-expanded', 'false');
    openBtn?.setAttribute('aria-label', 'Open menu');
  }

  openBtn?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  document.querySelectorAll('#primary-menu a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (isDesktop()) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  const themeBtn = document.querySelector('.theme-toggle');
  themeBtn?.addEventListener('click', () => {
    const active = root.classList.toggle('dark');
    themeBtn.setAttribute('aria-pressed', String(active));
    try { localStorage.setItem('theme', active ? 'dark' : 'light'); } catch {}
  });
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      root.classList.add('dark');
      themeBtn?.setAttribute('aria-pressed', 'true');
    }
  } catch {}

  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById('currentyear');
  if (yearElement) yearElement.textContent = ` ${currentYear}`;

  const lastModified = document.lastModified;
  const modifiedElement = document.getElementById('lastModified');
  if (modifiedElement) modifiedElement.textContent = `Last Modified: ${lastModified}`;
}

function boot() {
  renderPlaces(places);
  initVisitMsg();
  initChrome();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
