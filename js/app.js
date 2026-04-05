// ─────────────────────────────────────────────
//  App entry point — init, tabs, eventos
// ─────────────────────────────────────────────

import { loadAllData }               from './loader.js';
import { state }                     from './state.js';
import { initTheme, toggleTheme, loadFavs } from './utils.js';
import { loadPumpDoses }             from './pump.js';
import { filterDrugs, renderGrid }   from './drugs.js';
import { renderProtocols }           from './protocols.js';
import { CACHE_NAME }                from './config.js';

// ── Inicialização ────────────────────────────

async function init() {
  initTheme();
  loadFavs();
  loadPumpDoses();

  try {
    const data = await loadAllData();
    Object.assign(state, data);
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
    document.getElementById('grid').innerHTML =
      '<div class="nores">Erro ao carregar dados. Verifique sua conexão.</div>';
    return;
  }

  buildFilters();
  updateView();
  bindEvents();
  registerSW();
}

// ── Troca de aba ─────────────────────────────

export function setTab(tab) {
  state.activeTab    = tab;
  state.activeFilter = 'Todos';
  state.searchQuery  = '';

  const isProto = tab === 'proto';
  const isVO    = tab === 'vo';
  const isEV    = tab === 'ev';

  document.getElementById('bar').style.display      = isProto ? 'none' : '';
  document.getElementById('grid').style.display     = isProto ? 'none' : '';
  document.getElementById('protocols').style.display = isProto ? 'block' : 'none';

  document.querySelectorAll('.tab').forEach(t =>
    t.classList.toggle('on', t.dataset.tab === tab)
  );

  document.getElementById('search').value = '';
  document.getElementById('wt').value     = '';
  state.weight = 0;

  if (isProto) { renderProtocols(); return; }

  buildFilters();
  updateView();
}

// ── Filtros de categoria ─────────────────────

export function buildFilters() {
  const cats = ['Todos', '⭐', ...Object.keys(state.categories)];
  const el = document.getElementById('filters');
  el.innerHTML = cats.map(c =>
    `<button class="filt${c === state.activeFilter ? ' on' : ''}" data-c="${c}">${c}</button>`
  ).join('');
  el.querySelectorAll('.filt').forEach(b =>
    b.addEventListener('click', () => {
      state.activeFilter = b.dataset.c;
      buildFilters();
      updateView();
    })
  );
}

// ── Atualização da view ──────────────────────

function updateView() {
  const list = filterDrugs(
    state.activeTab === 'vo' ? state.drugsVO : state.drugsEV
  );
  renderGrid(list, state.activeTab === 'vo' ? 'vo' : 'ev');
}

// ── Eventos ──────────────────────────────────

function bindEvents() {
  document.getElementById('search').addEventListener('input', e => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    updateView();
  });

  document.getElementById('wt').addEventListener('input', e => {
    state.weight = parseFloat(e.target.value) || 0;
    updateView();
  });

  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  document.querySelectorAll('.tab').forEach(t =>
    t.addEventListener('click', () => setTab(t.dataset.tab))
  );
}

// ── Service Worker ───────────────────────────

function registerSW() {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

// ── Expõe setTab globalmente para uso no HTML ─
window._setTab = setTab;

document.addEventListener('DOMContentLoaded', init);
