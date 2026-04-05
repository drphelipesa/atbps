// ─────────────────────────────────────────────
//  Renderização de protocolos clínicos
// ─────────────────────────────────────────────

import { state } from './state.js';

// ── Helpers de item e fase ───────────────────

function buildItem(item) {
  if (item.ou) return '<div class="pou">— ou —</div>';
  const obs = item.obs ? `<div class="pitem-obs">${item.obs}</div>` : '';
  return `<div class="pitem">
  <div class="pitem-top">
    <span class="pitem-drug">${item.n}</span>
    <span class="pitem-dose"> ${item.dose}</span>
  </div>
  ${obs}
</div>`;
}

function buildFase(f) {
  const tempo = f.tempo ? `<span class="pfase-tempo">${f.tempo}</span>` : '';
  return `<div class="pfase">
  <div class="pfase-hd">${f.fase}${tempo}</div>
  ${f.itens.map(buildItem).join('')}
</div>`;
}

// ── Renderização principal ───────────────────

export function renderProtocols() {
  const container = document.getElementById('protocols');
  container.innerHTML = state.protocols.map(p => `
    <div class="pcard" style="border-left-color:${p.cor}">
      <div class="pcard-title">${p.title}</div>
      ${p.passos.map(buildFase).join('')}
    </div>
  `).join('');
}

// ── Prescrição de alta (futuro — estrutura pronta) ─

export function buildDischargeRx(rxList) {
  return rxList.map(item =>
    `${item.n}\n${item.quantidade || ''}\n${item.posologia || item.rx || ''}`.trim()
  ).join('\n\n');
}

export function copyDischargeRx(rxList, btnEl) {
  const text = buildDischargeRx(rxList);
  navigator.clipboard.writeText(text).catch(() => {});
  if (btnEl) {
    const original = btnEl.textContent;
    btnEl.textContent = '✓';
    setTimeout(() => { btnEl.textContent = original; }, 2000);
  }
}
