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

document.addEventListener("DOMContentLoaded", function () {
  // current year
  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById("currentyear");
  if (yearElement) {
    yearElement.textContent = ` ${currentYear}`;
  }

  // last modified date of the document
  const lastModified = document.lastModified;
  const modifiedElement = document.getElementById("lastModified");
  if (modifiedElement) {
    modifiedElement.textContent = `Last Modified: ${lastModified}`;
  }
});

const contentEl = document.querySelector('.directory__content');
const btnGrid   = document.getElementById('viewGrid');
const btnTable  = document.getElementById('viewTable');

let members = [];

(async function init(){
  await loadMembers();
  renderGrid();                 // default view
  btnGrid.addEventListener('click', renderGrid);
  btnTable.addEventListener('click', renderTable);
})();

async function loadMembers(){
  try {
    const res = await fetch('./data/members.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    members = data.members || [];
  } catch (err) {
    console.error('Failed to load members.json:', err);
    contentEl.innerHTML = `<p style="padding:12px;">Unable to load members.</p>`;
  }
}

function renderGrid(){
  press(btnGrid);
  const grid = document.createElement('div');
  grid.className = 'dir-grid';
  grid.append(...members.map(cardEl));
  contentEl.innerHTML = '';
  contentEl.appendChild(grid);
}

function renderTable(){
  press(btnTable);

  const wrap = document.createElement('div');
  wrap.className = 'table-scroll';

  const table = document.createElement('table');
  table.className = 'dir-table';

  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Address</th>
        <th>Phone</th>
        <th>Level</th>
        <th>Website</th>
      </tr>
    </thead>
    <tbody>
      ${members.map(m => `
        <tr>
          <td data-label="Name">${m.name}</td>
          <td data-label="Address">${m.address}</td>
          <td data-label="Phone">${m.phone}</td>
          <td data-label="Level">${levelLabel(m.membershipLevel)}</td>
          <td data-label="Website"><a href="${m.website}" target="_blank" rel="noopener">${shortUrl(m.website)}</a></td>
        </tr>
      `).join('')}
    </tbody>
  `;

  contentEl.innerHTML = '';
  wrap.appendChild(table);
  contentEl.appendChild(wrap);
}

function cardEl(m){
  const el = document.createElement('article');
  el.className = 'dir-card';
  el.innerHTML = `
    <img src="${m.image}" alt="${m.name} logo" loading="lazy">
    <h3>${m.name}</h3>
    <p class="tagline">${levelLabel(m.membershipLevel)}</p>
    <p><strong>Address:</strong> ${m.address}</p>
    <p><strong>Phone:</strong> ${m.phone}</p>
    <p><strong>URL:</strong> <a href="${m.website}" target="_blank" rel="noopener">${shortUrl(m.website)}</a></p>
  `;
  return el;
}

function levelLabel(level){
  switch (Number(level)) { case 3: return 'Gold Member'; case 2: return 'Silver Member'; default: return 'Member'; }
}
function shortUrl(url){
  try { return new URL(url).hostname.replace(/^www\./,''); } catch { return url; }
}
function press(active){
  [btnGrid, btnTable].forEach(b => b.setAttribute('aria-pressed', String(b === active)));
}
