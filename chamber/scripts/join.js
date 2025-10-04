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

  // 3) Keyboard progression tip: move radios in DOM order to match visual
  // (Already done; each label wraps the input to enlarge hit area)

  // 4) Optional: client-side pattern tip text if orgTitle invalid
  document.getElementById('join-form')?.addEventListener('submit', (e) => {
    const orgTitle = document.getElementById('orgTitle');
    if (orgTitle?.value && !orgTitle.checkValidity()) {
      orgTitle.reportValidity();
      e.preventDefault();
    }
  });

  // Read query params and show required fields
    const params = new URLSearchParams(location.search);

    const fields = [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName',  label: 'Last Name' },
      { key: 'email',     label: 'Email' },
      { key: 'mobile',    label: 'Mobile Number' },
      { key: 'organization', label: 'Business / Organization' },
      { key: 'timestamp', label: 'Submitted At' },
      // You can show more (optional):
      { key: 'membership', label: 'Membership Level', optional: true },
      { key: 'orgTitle',   label: 'Organizational Title', optional: true },
      { key: 'orgDescription', label: 'Organization Description', optional: true },
    ];

    const container = document.getElementById('submitted');

    fields.forEach(({key, label, optional}) => {
      const val = params.get(key);
      if (!val && optional) return;
      const div = document.createElement('div');
      div.className = 'kv';
      const b = document.createElement('b');
      b.textContent = label;
      const p = document.createElement('p');
      p.textContent = val || '—';
      div.append(b, p);
      container.append(div);
    });