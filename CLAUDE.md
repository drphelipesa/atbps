# CLAUDE.md

Guia para o Claude Code trabalhar neste repositório.

## O que é este projeto

**Guia PA** é uma PWA (Progressive Web App) de referência clínica para Pronto-Atendimento. Funciona 100% offline após o primeiro acesso. Hospedado no GitHub Pages. Sem backend, sem build system, sem dependências externas.

O médico usa no celular durante o plantão para consultar:
- Medicamentos **EV** (endovenosos): dose, diluição, indicações, calculadora por peso, bomba de infusão
- Medicamentos **VO** (via oral): dose, apresentação, botão de cópia de receita pré-formatada
- **Protocolos** clínicos: ISR, PCR/ACLS, Anafilaxia, Status Epilepticus, Sepse

## Arquitetura

App estática com ES Modules + arquivos JSON. **Requer servidor HTTP** para rodar localmente (não funciona em `file://`).

```
/
├── index.html              ← shell HTML puro (~45 linhas)
├── manifest.json           ← PWA manifest
├── sw.js                   ← Service Worker (cache: guia-ev-v2)
├── icon.svg
├── css/
│   └── app.css             ← todo o CSS (dark/light theme, cards, badges)
├── js/
│   ├── config.js           ← constantes: APP_VERSION, CACHE_NAME, STORAGE keys, DATA_URLS
│   ├── state.js            ← estado global único (categories, drugsEV, drugsVO, protocols, pump, solutions, favs, weight...)
│   ├── loader.js           ← fetch paralelo (Promise.all) dos 6 JSONs de dados
│   ├── utils.js            ← tema, favoritos, clipboard, buildWeightDoseBlock, buildSolBadges
│   ├── pump.js             ← calculadora de bomba de infusão (mL/h)
│   ├── drugs.js            ← filterDrugs, renderGrid, buildEVCard, buildVOCard
│   ├── protocols.js        ← renderProtocols, buildDischargeRx (stub futuro)
│   └── app.js              ← init, setTab, buildFilters, bindEvents, registerSW
└── data/
    ├── categories.json     ← 13 categorias com cores (hex: c, bg, t)
    ├── drugs-ev.json       ← 87 medicamentos EV
    ├── drugs-vo.json       ← 15 medicamentos VO com campo rx (receita pré-formatada)
    ├── protocols.json      ← 5 protocolos clínicos
    ├── pump.json           ← 8 drogas vasoativas/sedação com parâmetros de bomba
    └── solutions.json      ← exceções de diluentes (SF only / SG5% only / direto)
```

### Fluxo de dependências (sem ciclos)
```
config.js ← state.js ← utils.js / pump.js / loader.js ← drugs.js / protocols.js ← app.js
```

### Padrão de inline handlers
Os cards são gerados via template string. Callbacks usam `window._*` para contornar a limitação de onclick inline com módulos ES:
- `window._copyDrug(el, type, i)` — copia info do medicamento
- `window._toggleFav(el, type)` — toggle favorito (⭐/☆)
- `window._handlePumpInput(el, drugName)` — recalcula bomba de infusão

## Como adicionar medicamentos

### Medicamento EV (`data/drugs-ev.json`)
```json
{
  "n": "Nome (Nome Comercial)",
  "cat": "Categoria",
  "amp": "Apresentação da ampola",
  "dose": "Dose adulto",
  "dil": "Diluição e tempo de infusão",
  "ind": "Indicações clínicas",
  "mac": "⚠️ Alerta clínico ou ✅ destaque",
  "w": [
    {"l": "Label da dose", "min": 0.1, "max": 0.2, "u": "mg/kg"}
  ]
}
```
- `w` é opcional (calculadora por peso). Omitir se não aplicável.
- `cat` deve existir em `data/categories.json`.
- Se o medicamento tem bomba de infusão, adicionar também em `data/pump.json`.
- Se tem restrição de diluente, adicionar em `data/solutions.json`.

### Medicamento VO (`data/drugs-vo.json`)
```json
{
  "n": "Nome Comercial / Genérico",
  "cat": "Categoria",
  "apresentacao": "Comprimido Xmg | Xarope Xmg/mL",
  "dose": "Dose e posologia",
  "ind": "Indicações",
  "mac": "Alertas e contraindicações",
  "rx": "Nome do medicamento\nApresentação e quantidade\nInstruções de uso"
}
```
- O campo `rx` é o texto copiado ao clicar 📋. Usar `\n` para quebras de linha. Formato tipo Whitebook.

### Nova categoria
Adicionar em `data/categories.json`:
```json
"Nome da Categoria": {"c": "#HEX_BORDA", "bg": "#HEX_FUNDO_BADGE", "t": "#HEX_TEXTO_BADGE"}
```

## Como testar localmente

```bash
python3 -m http.server 8080
# Acessar: http://localhost:8080
```

**Não abrir `index.html` diretamente** — ES Modules e `fetch()` não funcionam em `file://`.

## Deploy

```bash
git add data/drugs-ev.json   # ou o arquivo modificado
git commit -m "adiciona NomeDoDrug EV"
git push
```

GitHub Pages serve automaticamente. O Service Worker (`guia-ev-v2`) faz cache de todos os arquivos para uso offline. Se mudar arquivos JS ou CSS, incrementar a versão do cache em `sw.js` (linha 1) para forçar atualização nos dispositivos.

## Categorias existentes

Analgésico, Antiemético, Antiespasmódico, Corticoide, Broncodilatador, Anticonvulsivante, Sedação/IOT, Antibiótico, Cardiovascular, Eletrólito, Hemostático, Protetor Gástrico, Anticoagulante

## Funcionalidades futuras planejadas

- **Protocolos por condição clínica**: dor abdominal → conduta no PA → drogas EV → prescrição de alta VO (estilo Whitebook). Estrutura já preparada em `protocols.js` (`buildDischargeRx`, `copyDischargeRx`).
- Schema de protocolos em `data/protocols.json` já suporta campo `rx` por item.
