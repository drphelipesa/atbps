// ─────────────────────────────────────────────
//  Calculadoras clínicas
// ─────────────────────────────────────────────

const CALCS = [
  {
    id: 'chadsvasc',
    title: 'CHADS-VASc',
    desc: 'Risco de AVC na Fibrilação Atrial',
    color: '#DC2626',
    maxScore: 9,
    items: [
      { pts:1,   label:'Insuficiência cardíaca / Disfunção VE' },
      { pts:1,   label:'Hipertensão arterial' },
      { pts:2,   label:'Idade ≥ 75 anos' },
      { pts:1,   label:'Diabetes mellitus' },
      { pts:2,   label:'AVC / AIT prévio' },
      { pts:1,   label:'Doença vascular (IAM, DAP, placa aórtica)' },
      { pts:1,   label:'Idade 65–74 anos' },
      { pts:1,   label:'Sexo feminino' },
    ],
    interpret(score) {
      if (score === 0) return { text:'Baixo risco — anticoagulação geralmente não indicada', cls:'calc-ok' };
      if (score === 1) return { text:'Risco intermediário — considerar anticoagulação (avaliar caso a caso)', cls:'calc-warn' };
      return { text:'Alto risco — anticoagulação oral recomendada', cls:'calc-alert' };
    }
  },
  {
    id: 'curb65',
    title: 'CURB-65',
    desc: 'Gravidade da Pneumonia Adquirida na Comunidade',
    color: '#2563EB',
    maxScore: 5,
    items: [
      { pts:1, label:'Confusão mental aguda' },
      { pts:1, label:'Ureia > 43 mg/dL (7 mmol/L)' },
      { pts:1, label:'FR ≥ 30 irpm' },
      { pts:1, label:'PA sistólica < 90 ou diastólica ≤ 60 mmHg' },
      { pts:1, label:'Idade ≥ 65 anos' },
    ],
    interpret(score) {
      if (score <= 1) return { text:'Baixo risco — tratamento ambulatorial', cls:'calc-ok' };
      if (score === 2) return { text:'Risco intermediário — internação curta ou observação', cls:'calc-warn' };
      return { text:'Alto risco — internação; score ≥ 3 considerar UTI', cls:'calc-alert' };
    }
  },
  {
    id: 'wells',
    title: 'Wells TEP',
    desc: 'Probabilidade Pré-Teste de Tromboembolismo Pulmonar',
    color: '#7C3AED',
    maxScore: 12.5,
    items: [
      { pts:3,   label:'Sinais/sintomas clínicos de TVP' },
      { pts:3,   label:'Diagnóstico alternativo menos provável que TEP' },
      { pts:1.5, label:'FC > 100 bpm' },
      { pts:1.5, label:'Imobilização ≥ 3 dias ou cirurgia nas últimas 4 semanas' },
      { pts:1.5, label:'TVP ou TEP prévio documentado' },
      { pts:1,   label:'Hemoptise' },
      { pts:1,   label:'Neoplasia ativa (tratamento nos últimos 6 meses ou paliativa)' },
    ],
    interpret(score) {
      if (score < 2)  return { text:'Baixo risco — considerar D-dímero antes da imagem', cls:'calc-ok' };
      if (score <= 6) return { text:'Risco intermediário — angiotomografia indicada', cls:'calc-warn' };
      return { text:'Alto risco — angiotomografia urgente / considerar anticoagulação empírica', cls:'calc-alert' };
    }
  },
];

// ── Handlers globais ─────────────────────────

window._calcScore = function(id) {
  const card = document.getElementById(`calc-${id}`);
  if (!card) return;
  const calc = CALCS.find(c => c.id === id);
  if (!calc) return;
  let score = 0;
  card.querySelectorAll('input[type=checkbox]').forEach((cb, idx) => {
    if (cb.checked) score += calc.items[idx].pts;
  });
  document.getElementById(`calc-${id}-score`).textContent = score;
  const { text, cls } = calc.interpret(score);
  const el = document.getElementById(`calc-${id}-result`);
  el.className = `calc-result ${cls}`;
  el.textContent = text;
};

window._calcCG = function() {
  const age = parseFloat(document.getElementById('cg-age').value)  || 0;
  const wt  = parseFloat(document.getElementById('cg-wt').value)   || 0;
  const cr  = parseFloat(document.getElementById('cg-cr').value)   || 0;
  const female = document.getElementById('cg-female').checked;
  const el = document.getElementById('calc-cg-result');
  if (!age || !wt || !cr) {
    el.className = 'calc-result';
    el.textContent = 'Preencha todos os campos';
    return;
  }
  const base = ((140 - age) * wt) / (72 * cr);
  const val = female ? +(base * 0.85).toFixed(1) : +base.toFixed(1);
  let text, cls;
  if      (val >= 90) { text = `${val} mL/min — Função renal normal`;                  cls = 'calc-ok';    }
  else if (val >= 60) { text = `${val} mL/min — Redução leve`;                         cls = 'calc-ok';    }
  else if (val >= 30) { text = `${val} mL/min — Redução moderada (ajustar doses)`;     cls = 'calc-warn';  }
  else if (val >= 15) { text = `${val} mL/min — Redução grave (ajustar doses)`;        cls = 'calc-alert'; }
  else                { text = `${val} mL/min — Falência renal`;                       cls = 'calc-alert'; }
  el.className = `calc-result ${cls}`;
  el.textContent = text;
};

// ── Construtores de HTML ─────────────────────

function buildCheckCalc(c) {
  const items = c.items.map(item => `
    <label class="calc-item">
      <input type="checkbox" onchange="window._calcScore('${c.id}')">
      <span class="calc-pts">+${item.pts}</span>
      <span>${item.label}</span>
    </label>`).join('');
  return `<div class="calc-card" id="calc-${c.id}" style="border-left-color:${c.color}">
  <div class="calc-hd">
    <span class="calc-title">${c.title}</span>
    <span class="calc-desc">${c.desc}</span>
  </div>
  <div class="calc-items">${items}</div>
  <div class="calc-footer">
    <span class="calc-score-lbl">Score: <strong id="calc-${c.id}-score">0</strong> / ${c.maxScore}</span>
    <div class="calc-result" id="calc-${c.id}-result">Selecione os critérios acima</div>
  </div>
</div>`;
}

function buildCGCalc() {
  return `<div class="calc-card" id="calc-cg" style="border-left-color:#059669">
  <div class="calc-hd">
    <span class="calc-title">Cockroft-Gault</span>
    <span class="calc-desc">Estimativa da Clearance de Creatinina</span>
  </div>
  <div class="calc-numeric">
    <label class="calc-field">
      <span class="calc-field-lbl">Idade (anos)</span>
      <input id="cg-age" type="number" min="1" max="120" placeholder="anos" class="calc-inp" oninput="window._calcCG()">
    </label>
    <label class="calc-field">
      <span class="calc-field-lbl">Peso (kg)</span>
      <input id="cg-wt" type="number" min="20" max="300" step="0.5" placeholder="kg" class="calc-inp" oninput="window._calcCG()">
    </label>
    <label class="calc-field">
      <span class="calc-field-lbl">Creatinina (mg/dL)</span>
      <input id="cg-cr" type="number" min="0.1" max="20" step="0.1" placeholder="mg/dL" class="calc-inp" oninput="window._calcCG()">
    </label>
    <div class="calc-field">
      <span class="calc-field-lbl">Sexo</span>
      <div class="calc-sex">
        <label><input type="radio" name="cg-sex" id="cg-male" checked onchange="window._calcCG()"> Masc.</label>
        <label><input type="radio" name="cg-sex" id="cg-female" onchange="window._calcCG()"> Fem.</label>
      </div>
    </div>
  </div>
  <div class="calc-footer">
    <div class="calc-result" id="calc-cg-result">Preencha os campos acima</div>
  </div>
</div>`;
}

// ── Renderização principal (executada uma vez) ─

let _rendered = false;

export function renderCalculators() {
  if (_rendered) return;
  _rendered = true;
  const container = document.getElementById('calculators');
  container.innerHTML =
    `<div class="calc-grid">` +
    CALCS.map(buildCheckCalc).join('') +
    buildCGCalc() +
    `</div>`;
}
