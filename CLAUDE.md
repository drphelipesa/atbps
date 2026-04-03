# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**atbps** é um guia de referência clínica de medicamentos EV (endovenosos) para uso no Pronto-Atendimento (PA). É uma aplicação estática de arquivo único (`index.html`) sem dependências externas, sem build system e sem framework.

Para usar: abrir `index.html` diretamente no navegador.

## Architecture

Todo o código está em `index.html`, dividido em três seções inline:

1. **CSS** (`<style>`) — estilização minimalista com variáveis CSS (`--cc`, `--cbg`, `--ct`) herdadas por cada card via `style` attribute. Cada categoria de medicamento tem sua paleta de cores definida no objeto `C`.

2. **Dados** (`const M`) — array de objetos JavaScript com todos os medicamentos. Cada objeto tem os campos:
   - `n` — nome do medicamento
   - `cat` — categoria (deve corresponder a uma chave do objeto `C`)
   - `amp` — apresentação da ampola
   - `dose` — dose adulto
   - `dil` — diluição e tempo de infusão
   - `ind` — indicações clínicas
   - `mac` — macete/alerta clínico (suporta emoji para sinalizações visuais)

3. **Lógica** (`<script>`) — ~35 linhas. Filtro por categoria (`active`) + busca textual full-text sobre todos os campos concatenados. A função `show()` renderiza os cards via template string.

## Adding/Editing Medications

Para adicionar um medicamento, inserir um novo objeto no array `M`. A categoria deve existir em `C` ou uma nova entrada deve ser adicionada em `C` com as cores `c` (borda), `bg` (fundo do badge) e `t` (texto do badge).

Categorias existentes: Analgésico, Antiemético, Antiespasmódico, Corticoide, Broncodilatador, Anticonvulsivante, Sedação/IOT, Antibiótico, Cardiovascular, Eletrólito, Hemostático, Protetor Gástrico.

## Content Guidelines

Este é um guia clínico de uso em emergência. O campo `mac` deve conter alertas de segurança relevantes (contraindicações, velocidade de infusão, antídotos, interações). Usar ⚠️ para alertas e ✅ para destaques positivos/escolha preferencial.
