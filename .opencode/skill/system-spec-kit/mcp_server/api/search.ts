// ────────────────────────────────────────────────────────────────
// MODULE: Search
// ────────────────────────────────────────────────────────────────
// @public — scripts should import from here, not lib/ internals.
// ARCH-1 stable re-export surface for search functionality.
// Consumer scripts import from here instead of reaching into lib/search/.

export {
  init as initHybridSearch,
  hybridSearchEnhanced,
  type HybridSearchOptions,
  type HybridSearchResult,
} from '../lib/search/hybrid-search.js';

export {
  fts5Bm25Search,
  isFts5Available,
} from '../lib/search/sqlite-fts.js';

export * as vectorIndex from '../lib/search/vector-index.js';
