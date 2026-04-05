// ─────────────────────────────────────────────
//  Renderização de medicamentos EV e VO
// ─────────────────────────────────────────────

import { state } from './state.js';
import { buildWeightDoseBlock, buildSolBadges, copyEVDrug, copyVORx, flashCopyBtn, toggleFav } from './utils.js';
import { buildPumpBlock, handlePumpInput } from './pump.js';
import { addToCart, removeFromCart, isInCart } from './cart.js';

// ── Filtro ───────────────────────────────────

export function filterDrugs(list) {
  const q = state.searchQuery;
  const active = state.activeFilter;
  let filtered = list.filter(m => {
    const matchCat = active === 'Todos' ||
      (active === '⭐' ? state.favs.has(m.n) : m.cat === active);
    if (!q) return matchCat;
    const haystack = [m.n, m.cat, m.dose, m.ind, m.mac,
      m.dil, m.amp, m.apresentacao, m.rx].filter(Boolean).join(' ').toLowerCase();
    return matchCat && haystack.includes(q);
  });
  // Favoritos primeiro
  if (active === 'Todos' || active === '⭐') {
    filtered.sort((a, b) => (state.favs.has(b.n) ? 1 : 0) - (state.favs.has(a.n) ? 1 : 0));
  }
  return filtered;
}

// ── Renderização EV ──────────────────────────

function buildEVCard(m, i) {
  const cat = state.categories[m.cat] || { c: '#888', bg: '#eee', t: '#333' };
  const isFav = state.favs.has(m.n);
  const kg = state.weight;
  const wblock   = buildWeightDoseBlock(m, kg);
  const solHtml  = buildSolBadges(m.n, state.solutions);
  const pumpHtml = buildPumpBlock(m.n, i);

  return `<div class="card" style="--cc:${cat.c};--cbg:${cat.bg};--ct:${cat.t}">
  <div class="ch">
    <span class="dn">${m.n}</span>
    <div style="display:flex;gap:4px;align-items:center">
      <span class="cb">${m.cat}</span>
      <span class="fav${isFav ? ' on' : ''}" data-name="${_esc(m.n)}" onclick="window._toggleFav(this,'ev')">
        ${isFav ? '⭐' : '☆'}
      </span>
      <span class="cp" data-idx="${i}" data-type="ev" onclick="window._copyDrug(this,'ev',${i})">📋</span>
    </div>
  </div>
  <div class="row"><span class="lbl">Ampola</span><span class="val">${m.amp}</span></div>
  <div class="row"><span class="lbl">Dose adulto</span><span class="val">${m.dose}</span></div>
  <div class="row"><span class="lbl">Diluição</span><span class="val">${m.dil}</span></div>
  <div class="row"><span class="lbl">Indicação</span><span class="val">${m.ind}</span></div>
  <div class="row"><span class="lbl">Diluentes</span><span class="val">${solHtml}</span></div>
  <div class="mac">${m.mac}</div>
  ${wblock}${pumpHtml}
</div>`;
}

// ── Renderização VO ──────────────────────────

function buildVOCard(m, i) {
  const cat = state.categories[m.cat] || { c: '#888', bg: '#eee', t: '#333' };
  const isFav   = state.favs.has(m.n);
  const inCart  = isInCart(m.n);
  return `<div class="card" style="--cc:${cat.c};--cbg:${cat.bg};--ct:${cat.t}">
  <div class="ch">
    <span class="dn">${m.n}</span>
    <div style="display:flex;gap:4px;align-items:center">
      <span class="cb">${m.cat}</span>
      <span class="fav${isFav ? ' on' : ''}" data-name="${_esc(m.n)}" onclick="window._toggleFav(this,'vo')">
        ${isFav ? '⭐' : '☆'}
      </span>
      <span class="cp" data-idx="${i}" data-type="vo" onclick="window._copyDrug(this,'vo',${i})" title="Copiar receita">📋</span>
      <span class="cart-add${inCart ? ' in-cart' : ''}" data-name="${_esc(m.n)}" data-idx="${i}" onclick="window._cartToggle(${i})" title="Adicionar à prescrição">${inCart ? '✓ Rx' : '+ Rx'}</span>
    </div>
  </div>
  <div class="row"><span class="lbl">Apresentação</span><span class="val">${m.apresentacao}</span></div>
  <div class="row"><span class="lbl">Dose</span><span class="val">${m.dose}</span></div>
  <div class="row"><span class="lbl">Indicação</span><span class="val">${m.ind}</span></div>
  <div class="mac">${m.mac}</div>
  ${m.rx ? `<div class="rx-preview">${m.rx.replace(/\n/g,'<br>')}</div>` : ''}
</div>`;
}

function _esc(str) { return str.replace(/"/g, '&quot;'); }

// ── Grid ─────────────────────────────────────

export function renderGrid(list, type) {
  const grid = document.getElementById('grid');
  const count = document.getElementById('count');
  const label = type === 'vo' ? 'medicamento VO' : 'medicamento';

  if (type === 'ev') state.shownEV = list;
  else               state.shownVO = list;

  count.textContent = `${list.length} ${label}${list.length !== 1 ? 's' : ''} encontrado${list.length !== 1 ? 's' : ''}`;

  if (!list.length) {
    grid.innerHTML = '<div class="nores">Nenhum resultado encontrado.</div>';
    return;
  }
  grid.innerHTML = list.map((m, i) =>
    type === 'ev' ? buildEVCard(m, i) : buildVOCard(m, i)
  ).join('');
}

// ── Callbacks globais (usados via onclick inline) ─

window._copyDrug = function(el, type, i) {
  const list = type === 'ev' ? state.shownEV : state.shownVO;
  const drug = list[i];
  if (!drug) return;
  if (type === 'ev') copyEVDrug(drug, state.weight);
  else               copyVORx(drug);
  flashCopyBtn(el);
};

window._toggleFav = function(el, type) {
  const name = el.dataset.name;
  const refresh = () => {
    const list = filterDrugs(type === 'ev' ? state.drugsEV : state.drugsVO);
    renderGrid(list, type);
  };
  toggleFav(name, el, refresh);
};

window._handlePumpInput = handlePumpInput;

window._cartToggle = function(i) {
  const drug = state.shownVO[i];
  if (!drug) return;
  const btn = document.querySelector(`.cart-add[data-idx="${i}"]`);
  if (isInCart(drug.n)) {
    removeFromCart(drug.n);
    if (btn) { btn.classList.remove('in-cart'); btn.textContent = '+ Rx'; }
  } else {
    addToCart(drug);
    if (btn) { btn.classList.add('in-cart'); btn.textContent = '✓ Rx'; }
  }
};
