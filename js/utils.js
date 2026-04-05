// ─────────────────────────────────────────────
//  Utilitários: tema, favoritos, cópia, peso
// ─────────────────────────────────────────────

import { state } from './state.js';
import { STORAGE } from './config.js';

// ── Tema ─────────────────────────────────────

export function initTheme() {
  const saved = localStorage.getItem(STORAGE.THEME);
  if (saved === 'dark') {
    document.documentElement.dataset.theme = 'dark';
    document.getElementById('themeBtn').textContent = '☀️';
  }
}

export function toggleTheme() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? '' : 'dark';
  document.getElementById('themeBtn').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem(STORAGE.THEME, isDark ? 'light' : 'dark');
}

// ── Favoritos ────────────────────────────────

export function loadFavs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE.FAVS) || '[]');
    state.favs = new Set(saved);
  } catch { state.favs = new Set(); }
}

export function saveFavs() {
  localStorage.setItem(STORAGE.FAVS, JSON.stringify([...state.favs]));
}

export function toggleFav(name, el, refreshFn) {
  if (state.favs.has(name)) {
    state.favs.delete(name);
    el.textContent = '☆';
    el.classList.remove('on');
  } else {
    state.favs.add(name);
    el.textContent = '⭐';
    el.classList.add('on');
  }
  saveFavs();
  refreshFn();
}

// ── Cópia de medicamento EV ──────────────────

export function copyEVDrug(drug, kg) {
  let txt = `${drug.n.toUpperCase()}\nDose: ${drug.dose}\nDiluição: ${drug.dil}`;
  if (kg > 0 && drug.w) {
    txt += `\n⚖️ Para ${kg}kg:\n` + drug.w.map(r => {
      const lo = +(r.min * kg).toFixed(1);
      const hi = +(r.max * kg).toFixed(1);
      return `  ${r.l}: ${lo === hi ? lo : lo + '–' + hi} ${r.u}`;
    }).join('\n');
  }
  _copyToClipboard(txt);
}

// ── Cópia de receita VO ──────────────────────

export function copyVORx(drug) {
  _copyToClipboard(drug.rx || `${drug.n}\n${drug.dose}`);
}

function _copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {});
}

export function flashCopyBtn(el) {
  const original = el.textContent;
  el.textContent = '✓';
  setTimeout(() => { el.textContent = original; }, 2000);
}

// ── Bloco de dose por peso ───────────────────

export function buildWeightDoseBlock(drug, kg) {
  if (!kg || !drug.w) return '';
  const lines = drug.w.map(r => {
    const lo = +(r.min * kg).toFixed(1);
    const hi = +(r.max * kg).toFixed(1);
    return `<br><span class="wdl">${r.l}:</span> ${lo === hi ? lo : lo + '–' + hi} ${r.u}`;
  }).join('');
  return `<div class="wdose">⚖️ Para ${kg}kg${lines}</div>`;
}

// ── Badges de diluentes ──────────────────────

export function buildSolBadges(drugName, solutions) {
  const sols = solutions[drugName] || ['SF', 'SG5'];
  return sols.map(d =>
    d === 'direto'  ? `<span class="sol sol-d">direto</span>` :
    d === 'SF'      ? `<span class="sol sol-sf">SF ✓</span>` :
                      `<span class="sol sol-sg">SG5% ✓</span>`
  ).join('');
}
