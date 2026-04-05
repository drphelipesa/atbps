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
  document.getElementById('clearBtn').style.display = 'none';
  window.scrollTo(0, 0);

  if (isProto) { renderProtocols(); return; }

  buildFilters();
  updateView();
}

// ── Filtros de categoria ─────────────────────

export function buildFilters() {
  const currentList = state.activeTab === 'vo' ? state.drugsVO : state.drugsEV;
  const usedCats = new Set(currentList.map(d => d.cat));
  const cats = ['Todos', '⭐', ...Object.keys(state.categories).filter(c => usedCats.has(c)).sort((a, b) => a.localeCompare(b, 'pt'))];
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
  const searchEl = document.getElementById('search');
  const clearBtn = document.getElementById('clearBtn');

  searchEl.addEventListener('input', e => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    clearBtn.style.display = state.searchQuery ? 'block' : 'none';
    updateView();
  });

  clearBtn.addEventListener('click', () => {
    searchEl.value = '';
    state.searchQuery = '';
    clearBtn.style.display = 'none';
    searchEl.focus();
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
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  navigator.serviceWorker.register('./sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          document.getElementById('updateBanner').style.display = 'flex';
        }
      });
    });
  }).catch(() => {});
}

// ── Expõe setTab globalmente para uso no HTML ─
window._setTab = setTab;

document.addEventListener('DOMContentLoaded', init);
