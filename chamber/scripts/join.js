// /scripts/join.js
document.addEventListener('DOMContentLoaded', () => {
  // run only on the join page
  const joinForm = document.getElementById('join-form');
  if (!joinForm) return;

  /* =========================
   * 1) Set hidden timestamp
   * ========================= */
  (function setTimestamp() {
    const ts = document.getElementById('timestamp');
    if (!ts) return;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    ts.value =
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  })();

  /* =========================
   * 2) Custom modal controls
   *    (no <dialog> element)
   * ========================= */
  const backdrop = document.querySelector('[data-backdrop]');
  // support new data-modal-open plus old data-open (back-compat)
  const openers = document.querySelectorAll('[data-modal-open], [data-open]');
  const lastActiveByModal = new Map();

  function getFirstFocusable(root) {
    return root.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }

  function resolveModalId(datasetValue) {
    // new buttons pass "np", "bronze", etc.
    // old buttons may pass "modal-np", etc.
    if (!datasetValue) return null;
    return datasetValue.startsWith('modal-') ? datasetValue : `modal-${datasetValue}`;
  }

  function openModal(idLike, triggerEl) {
    const modalId = resolveModalId(idLike);
    const modal = document.getElementById(modalId);
    if (!modal) return;

    lastActiveByModal.set(modal, triggerEl || null);

    // show
    backdrop && (backdrop.hidden = false);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    // focus management
    (getFirstFocusable(modal) || modal).focus();

    // simple focus trap while open
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

    // store to remove later when closing
    modal._trapTabHandler = trapTab;
  }

  function closeModal(modal) {
    if (!modal || modal.hidden) return;

    // hide
    modal.hidden = true;

    // if no other modals are open, hide backdrop & unlock scroll
    const anyOpen = document.querySelector('.modal:not([hidden])');
    if (!anyOpen) {
      backdrop && (backdrop.hidden = true);
      document.body.style.overflow = '';
    }

    // cleanup focus trap
    if (modal._trapTabHandler) {
      modal.removeEventListener('keydown', modal._trapTabHandler);
      delete modal._trapTabHandler;
    }

    // return focus to opener
    const opener = lastActiveByModal.get(modal);
    if (opener && typeof opener.focus === 'function') opener.focus();
  }

  // open buttons
  openers.forEach(btn => {
    btn.addEventListener('click', () => {
      const idLike = btn.dataset.modalOpen || btn.dataset.open; // support both
      openModal(idLike, btn);
    });
  });

  // close buttons (new data-modal-close)
  document.addEventListener('click', e => {
    const closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) {
      const modal = closeBtn.closest('.modal');
      closeModal(modal);
    }
  });

  // close when clicking the backdrop
  backdrop?.addEventListener('click', () => {
    document.querySelectorAll('.modal:not([hidden])').forEach(m => closeModal(m));
  });

  // Esc to close the topmost open modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const openTop = document.querySelector('.modal:not([hidden])');
      if (openTop) closeModal(openTop);
    }
  });
});
