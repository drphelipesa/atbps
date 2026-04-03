# Melhorias Sugeridas — Guia EV PA

## 1. Calculadora de Dose por Peso

Campo de peso do paciente na barra superior. Ao digitar o peso (kg), cada card de droga com dosagem mg/kg exibe automaticamente a dose calculada em destaque verde.

**Drogas beneficiadas (~13):**

| Droga | Cálculo |
|-------|---------|
| Fentanil | 1–2 mcg/kg (analgesia) / 2–3 mcg/kg (IOT) |
| Cetamina | 1–2 mg/kg (dissociativa) / 0,3–0,5 mg/kg (analgesia) |
| Etomidato | 0,3 mg/kg (IOT) |
| Propofol | 1–2 mg/kg (indução) |
| Succinilcolina | 1–1,5 mg/kg (ISR) |
| Rocurônio | 0,6 mg/kg (ISR) / 1,2 mg/kg (CICR) |
| Midazolam | 0,1–0,2 mg/kg (status epilepticus) |
| Aminofilina | 5 mg/kg (ataque) |
| Fenitoína | 15–20 mg/kg (ataque) |
| Fenobarbital | 15–20 mg/kg (ataque) |
| Ácido Valproico | 15–30 mg/kg (ataque) |
| Vancomicina | 15–20 mg/kg (PA) / 25–30 mg/kg (ataque sepse) |
| Gentamicina | 3–5 mg/kg/dia |
| Heparina | 80 UI/kg bolus / 18 UI/kg/h manutenção |
| Insulina Regular | 0,1 UI/kg/h (CAD) |
| Dobutamina | 2,5–20 mcg/kg/min |
| Dopamina | 2–20 mcg/kg/min (dose-dependente) |
| Levetiracetam | 20–60 mg/kg (ataque) |

**Exemplo visual no card:**
```
⚖️ Para 70kg
  Analgesia     70–140 mcg
  IOT/Sedação   140–210 mcg
```

---

## 2. Botão Copiar Prescrição

Ícone 📋 em cada card. Um toque copia o texto pronto para colar no sistema de prescrição.

**Formato copiado (sem peso):**
```
FENTANIL — 1–2MCG/KG EV (ANALGESIA)
Diluição: diluir em SF → infundir LENTO 3–5min
AGORA
```

**Formato copiado (com peso preenchido):**
```
FENTANIL — 1–2MCG/KG EV (ANALGESIA)
  Analgesia: 70–140mcg (70kg)
  IOT/Sedação: 140–210mcg (70kg)
Diluição: diluir em SF → infundir LENTO 3–5min
AGORA
```

Após copiar, o ícone muda para ✓ por 2 segundos como confirmação.

---

## 3. Novos Medicamentos

### Nova categoria: Antídoto (verde escuro)

| Medicamento | Dose | Indicação principal |
|-------------|------|---------------------|
| **Naloxona** | 0,4–2mg EV bolus, repetir a cada 2–3min | Reversão de opiáceos — meia-vida curta, pode ressedar |
| **Flumazenil** | 0,2mg EV → repetir 0,1mg/min — máx 1mg | Reversão de benzodiazepínicos |
| **Biperideno EV** | 5mg EV lento, repetir a cada 30min — máx 20mg | Distonia aguda por metoclopramida/haloperidol |

### Categoria Sedação/IOT

| Medicamento | Dose | Indicação principal |
|-------------|------|---------------------|
| **Haloperidol EV** | 2,5–5mg EV lento, repetir a cada 30–60min | Agitação psicomotora, delirium, psicose aguda |

### Categoria Eletrólito

| Medicamento | Dose | Indicação principal |
|-------------|------|---------------------|
| **Insulina Regular EV** | 0,1 UI/kg/h (CAD) / 10 UI bolus (hipercalemia) | Cetoacidose diabética, hipercalemia com alteração de ECG |

### Categoria Cardiovascular

| Medicamento | Dose | Indicação principal |
|-------------|------|---------------------|
| **Dobutamina** | 2,5–20 mcg/kg/min — bomba | Choque cardiogênico, IC aguda com hipoperfusão |
| **Dopamina** | 2–20 mcg/kg/min — bomba (dose-dependente) | Vasopressor alternativo, choque com bradicardia |

### Categoria Anticonvulsivante

| Medicamento | Dose | Indicação principal |
|-------------|------|---------------------|
| **Levetiracetam EV (Keppra)** | 1.000–3.000mg EV em 15min | Alternativa à fenitoína — sem monitoração de ECG necessária |

---

## Resumo

| Melhoria | Impacto | Esforço |
|----------|---------|---------|
| Calculadora de dose por peso | 🔴 Alto — elimina cálculo mental em IOT/sedação | Médio |
| Botão copiar prescrição | 🟡 Médio — reduz transcrição manual | Baixo |
| 8 novos medicamentos + categoria Antídoto | 🔴 Alto — preenche lacunas críticas (Naloxona, Flumazenil) | Médio |
