

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

document.querySelectorAll('#primary-menu a').forEach(a =>
  a.addEventListener('click', closeMenu)
);

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

document.addEventListener("DOMContentLoaded", function () {
  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById("currentyear");
  if (yearElement) {
    yearElement.textContent = ` ${currentYear}`;
  }

  const lastModified = document.lastModified;
  const modifiedElement = document.getElementById("lastModified");
  if (modifiedElement) {
    modifiedElement.textContent = `Last Modified: ${lastModified}`;
  }
});

document.addEventListener('DOMContentLoaded', () => {

  const joinForm = document.getElementById('join-form');
  if (!joinForm) return;


  (function setTimestamp() {
    const ts = document.getElementById('timestamp');
    if (!ts) return;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    ts.value =
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  })();


  const backdrop = document.querySelector('[data-backdrop]');
  const openers = document.querySelectorAll('[data-modal-open], [data-open]');
  const lastActiveByModal = new Map();

  function getFirstFocusable(root) {
    return root.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }

  function resolveModalId(datasetValue) {
    if (!datasetValue) return null;
    return datasetValue.startsWith('modal-') ? datasetValue : `modal-${datasetValue}`;
  }

  function openModal(idLike, triggerEl) {
    const modalId = resolveModalId(idLike);
    const modal = document.getElementById(modalId);
    if (!modal) return;

    lastActiveByModal.set(modal, triggerEl || null);

    backdrop && (backdrop.hidden = false);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    (getFirstFocusable(modal) || modal).focus();

    function trapTab(e) {
      if (e.key !== 'Tab') return;
      const nodes = [...modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )].filter(n => !n.disabled && n.offsetParent !== null);

      if (!nodes.length) return;
      const first = nodes[0];
      const last  = nodes[nodes.length - 1];

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      }
    }
    modal.addEventListener('keydown', trapTab, { once: false });

    modal._trapTabHandler = trapTab;
  }

  function closeModal(modal) {
    if (!modal || modal.hidden) return;

    modal.hidden = true;

    const anyOpen = document.querySelector('.modal:not([hidden])');
    if (!anyOpen) {
      backdrop && (backdrop.hidden = true);
      document.body.style.overflow = '';
    }
    
    if (modal._trapTabHandler) {
      modal.removeEventListener('keydown', modal._trapTabHandler);
      delete modal._trapTabHandler;
    }

    const opener = lastActiveByModal.get(modal);
    if (opener && typeof opener.focus === 'function') opener.focus();
  }

    openers.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();    
        const idLike = btn.dataset.modalOpen || btn.dataset.open; 
        openModal(idLike, btn);
    });
    });


  document.addEventListener('click', e => {
    const closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) {
      const modal = closeBtn.closest('.modal');
      closeModal(modal);
    }
  });

  backdrop?.addEventListener('click', () => {
    document.querySelectorAll('.modal:not([hidden])').forEach(m => closeModal(m));
  });


  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const openTop = document.querySelector('.modal:not([hidden])');
      if (openTop) closeModal(openTop);
    }
  });
});
