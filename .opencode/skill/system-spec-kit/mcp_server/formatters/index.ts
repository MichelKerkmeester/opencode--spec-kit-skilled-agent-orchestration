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
} from './token-metrics';

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

} from './search-results';

// Re-export ALLOWED_BASE_PATHS from its canonical source
export { ALLOWED_BASE_PATHS } from '../core/config';
