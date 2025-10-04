// /scripts/join.js
document.addEventListener('DOMContentLoaded', () => {
  // run only on the join page
  const joinForm = document.getElementById('join-form');
  if (!joinForm) return;

  // 1) set the hidden timestamp when page loads (local time, YYYY-MM-DD HH:MM:SS)
  (function setTimestamp() {
    const ts = document.getElementById('timestamp');
    if (!ts) return;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    ts.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} `
             + `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  })();

  // 2) modal controls (native <dialog>)
  const backdrop = document.querySelector('[data-backdrop]');
  const openBtns = document.querySelectorAll('[data-open]');
  const closeBtns = document.querySelectorAll('[data-close]');
  const lastTrigger = new Map(); // dialog -> button that opened it

  function firstFocusable(el) {
    return el.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }

  function openModal(id, trigger) {
    const dlg = document.getElementById(id);
    if (!dlg || typeof dlg.showModal !== 'function') return;

    lastTrigger.set(dlg, trigger || null);
    dlg.showModal();
    // show optional custom backdrop if you're using it
    if (backdrop) backdrop.hidden = false;

    // focus the first focusable inside the dialog (or the dialog itself)
    (firstFocusable(dlg) || dlg).focus();

    // Esc key closes (cancel event)
    dlg.addEventListener(
      'cancel',
      e => {
        e.preventDefault();
        closeModal(dlg);
      },
      { once: true }
    );

    // very light focus trap
    dlg.addEventListener('keydown', function trapTab(e) {
      if (e.key !== 'Tab') return;
      const nodes = [...dlg.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )].filter(n => !n.disabled && n.offsetParent !== null);

      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      }
    }, { once: true });
  }

  function closeModal(dlg) {
    if (!dlg?.open) return;
    dlg.close();
    if (backdrop) backdrop.hidden = true;

    const trigger = lastTrigger.get(dlg);
    if (trigger) trigger.focus();
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.open, btn));
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dlg = btn.closest('dialog');
      if (dlg) closeModal(dlg);
    });
  });

  // clicking the custom backdrop closes any open dialog
  backdrop?.addEventListener('click', () => {
    document.querySelectorAll('dialog[open]').forEach(closeModal);
  });
});