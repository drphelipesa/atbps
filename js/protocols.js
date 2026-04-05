// ─────────────────────────────────────────────
//  Renderização de protocolos clínicos
// ─────────────────────────────────────────────

import { state } from './state.js';
import { flashCopyBtn } from './utils.js';

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

// ── Texto plano para cópia ──────────────────

function buildProtocolText(p) {
  const lines = [p.title];
  for (const f of p.passos) {
    lines.push('');
    const tempo = f.tempo ? ` (${f.tempo})` : '';
    lines.push(`${f.fase.toUpperCase()}${tempo}`);
    for (const item of f.itens) {
      if (item.ou) { lines.push('— ou —'); continue; }
      lines.push(`• ${item.n} — ${item.dose}`);
      if (item.obs) lines.push(`  ${item.obs}`);
    }
  }
  return lines.join('\n');
}

// ── Renderização principal ───────────────────

export function renderProtocols() {
  const container = document.getElementById('protocols');
  container.innerHTML = state.protocols.map((p, idx) => `
    <div class="pcard" style="border-left-color:${p.cor}">
      <div class="pcard-title">
        ${p.title}
        <span class="cp" onclick="window._copyProtocol(this,${idx})" title="Copiar protocolo">📋</span>
      </div>
      ${p.passos.map(buildFase).join('')}
    </div>
  `).join('');
}

window._copyProtocol = function(el, idx) {
  const p = state.protocols[idx];
  if (!p) return;
  navigator.clipboard.writeText(buildProtocolText(p)).catch(() => {});
  flashCopyBtn(el);
};

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
