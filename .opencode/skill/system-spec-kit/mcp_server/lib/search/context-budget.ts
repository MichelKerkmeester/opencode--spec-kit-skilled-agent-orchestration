// --- 1. CONTEXT BUDGET ---
// Token-budget-aware result selection with graph region diversity.
// --- 2. CONSTANTS ---

/** Default token budget when none is supplied by the caller. */
const DEFAULT_BUDGET_TOKENS = 2000;

/** Approximate number of characters per token (widely accepted heuristic). */
const CHARS_PER_TOKEN = 4;

/**
 * Threshold: a result from an already-seen graph region is only
 * preferred over an unseen-region result when the seen-region result's
 * score exceeds the unseen-region candidate's score by this factor.
 * Expressed as a fraction of the current candidate score (0.5 = 50%).
 */
const REGION_DIVERSITY_THRESHOLD = 0.5;

// --- 3. INTERFACES ---

/**
 * A single search result eligible for context-budget selection.
 */
export interface BudgetResult {
  /** Unique identifier (string or numeric). */
  id: string | number;
  /** Relevance score (higher is better). */
  score: number;
  /**
   * Pre-computed token estimate for this result.
   * If absent, `estimateTokens` is used with an assumed content length of 0.
   */
  tokens?: number;
  /**
   * Optional graph region label (e.g. skill name, subgraph id).
   * Used to promote diversity across graph regions.
   */
  graphRegion?: string;
  /** Raw content string — used by `estimateTokens` when `tokens` is absent. */
  content?: string;
}

// --- 4. HELPERS ---

/**
 * Rough token count estimate for a plain-text string.
 *
 * Uses the widely accepted heuristic of ~4 characters per token.
 * Returns 0 for empty or absent content.
 *
 * @param content - The text to estimate tokens for.
 * @returns Estimated token count (integer, rounded up).
 */
export function estimateTokens(content: string | undefined): number {
  if (!content || content.length === 0) return 0;
  return Math.ceil(content.length / CHARS_PER_TOKEN);
}

// --- 5. CORE FUNCTION ---

/**
 * Select results within a token budget, promoting graph-region diversity.
 *
 * Selection algorithm:
 * 1. Sort all results by score descending (greedy).
 * 2. Iterate candidates in score order.
 * 3. For each candidate:
 *    a. If no `graphRegion` info is present anywhere → fall back to
 *       standard top-K by score (no diversity pass).
 *    b. If the candidate's region has already been seen AND an
 *       unseen-region result with score > 50 % of the current
 *       candidate's score exists → take the unseen-region result first.
 *    c. Otherwise select the current candidate.
 * 4. Stop when the token budget would be exceeded.
 *
 * @param results      - Candidate results to select from.
 * @param budgetTokens - Maximum number of tokens to include (default 2000).
 * @returns Ordered array of selected results within the token budget.
 */
export function optimizeContextBudget(
  results: BudgetResult[],
  budgetTokens: number = DEFAULT_BUDGET_TOKENS
): BudgetResult[] {
  if (results.length === 0) return [];

  // Determine whether any result carries region information.
  const hasRegionInfo = results.some(r => r.graphRegion !== undefined && r.graphRegion !== '');

  // Work on a score-sorted copy; do not mutate the input.
  const sorted = [...results].sort((a, b) => b.score - a.score);

  // Fall back to simple top-K by score when no region data is available.
  if (!hasRegionInfo) {
    return selectByScore(sorted, budgetTokens);
  }

  // Region-diversity-aware selection.
  const selected: BudgetResult[] = [];
  const seenRegions = new Set<string>();
  const remaining = [...sorted]; // pool of unselected candidates
  let usedTokens = 0;

  while (remaining.length > 0) {
    // Find the highest-scoring unseen-region candidate (if any).
    const unseenIdx = remaining.findIndex(
      r => !r.graphRegion || !seenRegions.has(r.graphRegion)
    );

    // The next candidate by score is always remaining[0].
    const nextCandidate = remaining[0];
    const nextScore = nextCandidate.score;

    let chosenIdx = 0; // default: take next by score

    if (unseenIdx > 0) {
      // There is an unseen-region candidate that is not the top scorer.
      const unseenCandidate = remaining[unseenIdx];
      const unseenScore = unseenCandidate.score;

      // Prefer the unseen-region result if its score is above the diversity threshold.
      if (unseenScore > nextScore * REGION_DIVERSITY_THRESHOLD) {
        chosenIdx = unseenIdx;
      }
    }

    const chosen = remaining[chosenIdx];
    const tokenCost = chosen.tokens ?? estimateTokens(chosen.content);

    // Stop if this result alone would exceed the budget.
    if (usedTokens + tokenCost > budgetTokens) {
      break;
    }

    selected.push(chosen);
    usedTokens += tokenCost;

    if (chosen.graphRegion) {
      seenRegions.add(chosen.graphRegion);
    }

    // Remove chosen from remaining pool.
    remaining.splice(chosenIdx, 1);
  }

  return selected;
}

// --- 6. PRIVATE HELPERS ---

/**
 * Standard top-K selection: pick results in score order until budget is full.
 */
function selectByScore(sorted: BudgetResult[], budgetTokens: number): BudgetResult[] {
  const selected: BudgetResult[] = [];
  let usedTokens = 0;

  for (const result of sorted) {
    const tokenCost = result.tokens ?? estimateTokens(result.content);
    if (usedTokens + tokenCost > budgetTokens) break;
    selected.push(result);
    usedTokens += tokenCost;
  }

  return selected;
}
