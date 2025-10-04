
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

const contentEl = document.querySelector('.directory__content');
const btnGrid   = document.getElementById('viewGrid');
const btnTable  = document.getElementById('viewTable');

let members = [];

(async function init(){
  await loadMembers();
  renderGrid();            
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


const spotlightEl = document.querySelector('.spotlights__list');

(async function init(){
  await loadMembers();
  renderGrid();                 
  renderSpotlights();        
  btnGrid.addEventListener('click', renderGrid);
  btnTable.addEventListener('click', renderTable);
})();

function eligibleMembers() {
  return members.filter(m => [2, 3].includes(Number(m.membershipLevel)));
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderSpotlights() {
  if (!spotlightEl) return;

  const pool = eligibleMembers();
  if (pool.length === 0) {
    spotlightEl.innerHTML = `<p style="padding:12px;">No spotlight members yet.</p>`;
    return;
  }

  const count = Math.min(pool.length, Math.random() < 0.5 ? 2 : 3);
  const picks = shuffleInPlace([...pool]).slice(0, count);

  const frag = document.createDocumentFragment();
  picks.forEach(m => frag.appendChild(cardEl(m)));

  spotlightEl.innerHTML = '';
  spotlightEl.appendChild(frag);
}

document.addEventListener('DOMContentLoaded', () => {
  const directoryRoot = document.querySelector('[data-directory-root]') 
                      || document.getElementById('directory-root');
  if (!directoryRoot) return;


  const toggleBtns = document.querySelectorAll('[data-view]');
  const cardsWrap  = document.getElementById('cards');

  toggleBtns.forEach(btn => {
    btn?.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      if (cardsWrap) {
        cardsWrap.setAttribute('data-view', view);
      }
    });
  });

});


