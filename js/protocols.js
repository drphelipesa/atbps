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

// ── Filtro de grupo ──────────────────────────

const GROUP_EMOJI = {
  'Cardiovascular':  '🔴',
  'Neurológico':     '🟣',
  'Via Aérea':       '🔵',
  'Metabólico':      '🟢',
  'Alérgico/Tóxico': '🟡',
};

let activeGroup = 'Todos';

function titleText(title) {
  return title.replace(/^[^\p{L}]+/u, '').trim();
}

// ── Renderização principal ───────────────────

export function renderProtocols() {
  const container = document.getElementById('protocols');

  const groups = ['Todos', ...Object.keys(GROUP_EMOJI)];

  const visible = state.protocols
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => activeGroup === 'Todos' || p.grupo === activeGroup)
    .sort((a, b) => titleText(a.p.title).localeCompare(titleText(b.p.title), 'pt'));

  const filtersHtml = `<div id="proto-filters">
    ${groups.map(g => {
      const label = g === 'Todos' ? 'Todos' : `${GROUP_EMOJI[g]} ${g}`;
      return `<button class="filt${g === activeGroup ? ' on' : ''}" onclick="window._setProtoGroup('${g}')">${label}</button>`;
    }).join('')}
  </div>`;

  const cardsHtml = visible.map(({ p, i }) => `
    <div class="pcard" id="pcard-${i}" style="border-left-color:${p.cor}">
      <div class="pcard-hd" onclick="window._toggleProto(${i})">
        <span class="pcard-title">${p.title}</span>
        <div class="pcard-actions">
          <span class="cp" onclick="event.stopPropagation();window._copyProtocol(this,${i})" title="Copiar protocolo">📋</span>
          <span class="pchev">▾</span>
        </div>
      </div>
      <div class="pcard-body">
        ${p.passos.map(buildFase).join('')}
      </div>
    </div>
  `).join('');

  container.innerHTML = filtersHtml + cardsHtml;
}

window._setProtoGroup = function(group) {
  activeGroup = group;
  renderProtocols();
};

window._toggleProto = function(idx) {
  document.getElementById(`pcard-${idx}`).classList.toggle('open');
};

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
