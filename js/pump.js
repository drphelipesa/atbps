// ─────────────────────────────────────────────
//  Calculadora de bomba de infusão
// ─────────────────────────────────────────────

import { state } from './state.js';
import { STORAGE } from './config.js';

export function loadPumpDoses() {
  try {
    state.pumpDoses = JSON.parse(localStorage.getItem(STORAGE.PUMP_DOSES) || '{}');
  } catch { state.pumpDoses = {}; }
}

export function calcPumpRate(drugName, dose, kg) {
  const p = state.pump[drugName];
  if (!p || !dose) return '—';
  const needsKg = p.unit.includes('/kg/');
  if (needsKg && !kg) return 'informe o peso ↑';
  let mlh;
  if      (p.unit === 'mcg/kg/min') mlh = (dose * kg * 60) / p.conc;
  else if (p.unit === 'UI/kg/h' || p.unit === 'mg/kg/h') mlh = (dose * kg) / p.conc;
  else if (p.unit === 'mcg/min')    mlh = (dose * 60) / p.conc;
  else                              mlh = dose / p.conc;
  return mlh.toFixed(1) + ' mL/h';
}

export function handlePumpInput(inputEl, drugName) {
  const dose = parseFloat(inputEl.value) || 0;
  state.pumpDoses[drugName] = dose;
  localStorage.setItem(STORAGE.PUMP_DOSES, JSON.stringify(state.pumpDoses));
  const kg = state.weight;
  const resEl = inputEl.parentElement.querySelector('.pump-res');
  if (resEl) resEl.textContent = calcPumpRate(drugName, dose, kg);
}

export function buildPumpBlock(drugName, idx) {
  const p = state.pump[drugName];
  if (!p) return '';
  const currentDose = state.pumpDoses[drugName] ?? p.def;
  const kg = state.weight;
  return `<div class="pump">
  <span class="pump-lbl">⚙️ Bomba</span>
  <span class="pump-dil">${p.dil}</span>
  <div class="pump-row">
    Dose <input type="number" class="pump-inp"
      value="${currentDose}" min="${p.min}" max="${p.max}" step="${p.step}"
      data-drug="${drugName}"
      oninput="window._handlePumpInput(this,'${drugName}')">
    <span class="pump-unit">${p.unit}</span> →
    <b class="pump-res">${calcPumpRate(drugName, currentDose, kg)}</b>
  </div>
</div>`;
}
