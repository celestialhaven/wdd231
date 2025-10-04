// 1) Set hidden timestamp when form loads (ISO string; readable but machine-parseable)
  (function setTimestamp(){
    const ts = document.getElementById('timestamp');
    if (ts) {
      const now = new Date();
      // Example: 2025-10-04 14:05:22 (local)
      const pad = n => String(n).padStart(2,'0');
      const stamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      ts.value = stamp;
    }
  })();

  // 2) Accessible modal handling (HTML <dialog>)
  (function modalControls(){
    const openBtns = document.querySelectorAll('[data-open]');
    const closeBtns = document.querySelectorAll('[data-close]');
    const backdrop = document.querySelector('[data-backdrop]');
    let lastTrigger = null;

    function openModal(id, trigger){
      const dlg = document.getElementById(id);
      if (!dlg) return;
      lastTrigger = trigger || null;
      dlg.showModal();
      if (backdrop) backdrop.hidden = false;
      // Focus the first focusable thing inside
      const focusable = dlg.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
      // Esc to close
      dlg.addEventListener('cancel', e => {
        e.preventDefault();
        closeModal(dlg);
      }, { once: true });
    }

    function closeModal(dlg){
      dlg.close();
      if (backdrop) backdrop.hidden = true;
      if (lastTrigger) lastTrigger.focus();
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

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        document.querySelectorAll('dialog[open]').forEach(closeModal);
      });
    }
  })();

