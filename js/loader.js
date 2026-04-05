// ─────────────────────────────────────────────
//  Carregamento de dados via fetch paralelo
// ─────────────────────────────────────────────

import { DATA_URLS } from './config.js';

export async function loadAllData() {
  const [categories, drugsEV, drugsVO, protocols, pump, solutions] = await Promise.all([
    fetch(DATA_URLS.categories).then(r => r.json()),
    fetch(DATA_URLS.drugsEV).then(r => r.json()),
    fetch(DATA_URLS.drugsVO).then(r => r.json()),
    fetch(DATA_URLS.protocols).then(r => r.json()),
    fetch(DATA_URLS.pump).then(r => r.json()),
    fetch(DATA_URLS.solutions).then(r => r.json())
  ]);
  return { categories, drugsEV, drugsVO, protocols, pump, solutions };
}
