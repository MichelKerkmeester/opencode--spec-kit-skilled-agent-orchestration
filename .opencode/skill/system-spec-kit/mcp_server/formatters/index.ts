// ────────────────────────────────────────────────────────────────
// MODULE: Formatters (Barrel Export)
// ────────────────────────────────────────────────────────────────

export {
  // Types
  type TieredResult,
  type TokenMetrics,

  // Functions
  estimateTokens,
  calculateTokenMetrics,
} from './token-metrics.js';

export {
  // Types
  type AnchorTokenMetrics,
  type RawSearchResult,
  type FormattedSearchResult,
  type MemoryParserLike,
  type MCPResponse,

  // Functions
  formatSearchResults,
  validateFilePathLocal,
  safeJsonParse,

} from './search-results.js';

// Re-export ALLOWED_BASE_PATHS from its canonical source
export { ALLOWED_BASE_PATHS } from '../core/config.js';
