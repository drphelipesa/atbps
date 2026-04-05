// ─────────────────────────────────────────────
//  Estado global — único source of truth da app
// ─────────────────────────────────────────────

export const state = {
  // Dados carregados do JSON
  categories: {},
  drugsEV:    [],
  drugsVO:    [],
  protocols:  [],
  pump:       {},
  solutions:  {},

  // Estado de UI
  favs:        new Set(),
  pumpDoses:   {},
  activeTab:   'ev',      // 'ev' | 'vo' | 'proto'
  activeFilter: 'Todos',
  searchQuery: '',
  weight:      0,

  // Listas renderizadas atualmente (para referência em callbacks)
  shownEV: [],
  shownVO: []
};
