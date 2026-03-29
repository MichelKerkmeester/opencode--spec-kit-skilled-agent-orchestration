// ───────────────────────────────────────────────────────────────
// MODULE: Dynamic Token Budget
// ───────────────────────────────────────────────────────────────
//
// ADVISORY-ONLY: This module computes a token budget for a query
// Based on its complexity tier, but does NOT enforce that budget
// Downstream. The returned BudgetResult is handed to callers who
// Are solely responsible for respecting it (e.g. by trimming
// Result sets or truncating content before sending to the LLM).
import { type QueryComplexityTier } from './query-classifier.js';
import { isDynamicTokenBudgetEnabled } from './search-flags.js';

// Feature catalog: Dynamic token budget allocation


/* --- 1. TYPES & CONSTANTS --- */

/** Budget (in tokens) allocated per complexity tier. */
interface TokenBudgetConfig {
  /** Simple query budget: 1500 tokens. */
  simple: number;
  /** Moderate query budget: 2500 tokens. */
  moderate: number;
  /** Complex query budget: 4000 tokens. */
  complex: number;
}

/** Result of a token budget lookup. */
interface BudgetResult {
  /** The complexity tier that determined the budget. */
  tier: QueryComplexityTier;
  /** The allocated token budget. */
  budget: number;
  /** Whether the dynamic flag was active (false = default fallback used). */
  applied: boolean;
}

/** Default budget when the feature flag is disabled — treat everything as complex. */
const DEFAULT_BUDGET = 4000;

/** Default tier-to-budget mapping when dynamic allocation is enabled.
 * 1500/2500/4000 tiers balance context window cost vs. recall —
 * simple queries need fewer tokens, complex queries need the full budget. */
const DEFAULT_TOKEN_BUDGET_CONFIG: TokenBudgetConfig = {
  simple: 1500,
  moderate: 2500,
  complex: 4000,
};

/* --- 2. FEATURE FLAG --- */

/* --- 3. BUDGET RESOLUTION --- */

/**
 * Get the token budget for a given query complexity tier.
 *
 * When SPECKIT_DYNAMIC_TOKEN_BUDGET is disabled (default), returns the DEFAULT_BUDGET
 * (4000) for all queries regardless of tier, with applied=false.
 *
 * When enabled, maps tier to the configured budget:
 *   simple   → 1500 tokens
 *   moderate → 2500 tokens
 *   complex  → 4000 tokens
 *
 * @param tier   - The complexity tier from the query classifier
 * @param config - Optional custom budget config (overrides DEFAULT_TOKEN_BUDGET_CONFIG)
 * @returns BudgetResult with tier, budget, and applied flag
 */
function getDynamicTokenBudget(
  tier: QueryComplexityTier,
  config?: TokenBudgetConfig,
): BudgetResult {
  // Feature flag gate: return default when disabled
  if (!isDynamicTokenBudgetEnabled()) {
    return {
      tier,
      budget: DEFAULT_BUDGET,
      applied: false,
    };
  }

  const effectiveConfig = config ?? DEFAULT_TOKEN_BUDGET_CONFIG;
  const budget = effectiveConfig[tier] ?? DEFAULT_BUDGET;

  return {
    tier,
    budget,
    applied: true,
  };
}

/* --- 4. EXPORTS --- */

export {
  // Types
  type TokenBudgetConfig,
  type BudgetResult,

  // Constants
  DEFAULT_BUDGET,
  DEFAULT_TOKEN_BUDGET_CONFIG,

  // Functions
  getDynamicTokenBudget,
  isDynamicTokenBudgetEnabled,
};
