// ===== Mobile menu (overlay) =====
const root     = document.documentElement;           // <html>
const nav      = document.getElementById('primary-menu');  // the overlay nav
const openBtn  = document.querySelector('.menu-toggle');   // hamburger
const closeBtn = document.querySelector('.menu-close');    // × button

const isDesktop = () => window.matchMedia('(min-width:768px)').matches;

function openMenu() {
  nav.classList.add('open');         // expands overlay (CSS)
  root.classList.add('nav-open');    // swaps hamburger -> × (CSS)
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

// Close when a menu link is tapped
document.querySelectorAll('#primary-menu a').forEach(a =>
  a.addEventListener('click', closeMenu)
);

// Close if resized to desktop
window.addEventListener('resize', () => { if (isDesktop()) closeMenu(); });

// Optional: ESC closes overlay
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });


// ===== Dark mode toggle (your original code, kept) =====
const themeBtn = document.querySelector('.theme-toggle');
themeBtn?.addEventListener('click', () => {
  const active = root.classList.toggle('dark');
  themeBtn.setAttribute('aria-pressed', String(active));
  try { localStorage.setItem('theme', active ? 'dark' : 'light'); } catch {}
});

// Load saved theme
try {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    root.classList.add('dark');
    themeBtn?.setAttribute('aria-pressed', 'true');
  }
} catch {}
