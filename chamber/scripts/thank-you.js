
  document.getElementById('join-form')?.addEventListener('submit', (e) => {
    const orgTitle = document.getElementById('orgTitle');
    if (orgTitle?.value && !orgTitle.checkValidity()) {
      orgTitle.reportValidity();
      e.preventDefault();
    }
  });


    const params = new URLSearchParams(location.search);

    const fields = [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName',  label: 'Last Name' },
      { key: 'email',     label: 'Email' },
      { key: 'mobile',    label: 'Mobile Number' },
      { key: 'organization', label: 'Business / Organization' },
      { key: 'timestamp', label: 'Submitted At' },

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