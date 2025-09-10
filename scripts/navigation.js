const btn = document.querySelector('.hamburger');
  const nav = document.getElementById('primary-nav');
  const closeBtn = nav?.querySelector('.nav-close');

  function closeMenu() {
    nav.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('noscroll');
  }

  btn?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('noscroll', open);
  });

  closeBtn?.addEventListener('click', closeMenu);

  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  const mq = window.matchMedia('(max-width: 1024px)');
  mq.addEventListener('change', closeMenu);