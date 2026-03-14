// ───────────────────────────────────────────────────────────────
// MODULE: Query Classifier
// ───────────────────────────────────────────────────────────────
/* --- 1. TYPES & CONSTANTS --- */

// Feature catalog: Query complexity router

type QueryComplexityTier = 'simple' | 'moderate' | 'complex';

interface ClassificationResult {
  tier: QueryComplexityTier;
  features: {
    termCount: number;
    charCount: number;
    hasTriggerMatch: boolean;
    stopWordRatio: number;
  };
  confidence: 'high' | 'medium' | 'low' | 'fallback';
}

/** Config-driven thresholds */
const SIMPLE_TERM_THRESHOLD = 3;
const COMPLEX_TERM_THRESHOLD = 8;

/** Common English stop words for semantic complexity heuristic */
const STOP_WORDS: ReadonlySet<string> = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were',
  'in', 'on', 'at', 'to', 'for', 'of',
  'and', 'or', 'but', 'not',
  'with', 'this', 'that', 'it',
  'from', 'by', 'as', 'be',
  'has', 'had', 'have',
  'do', 'does', 'did',
  'will', 'would', 'can', 'could', 'should', 'may', 'might',
]);

/* --- 2. FEATURE FLAG --- */

/**
 * Check if the complexity router feature flag is enabled.
 * Default: TRUE (graduated). Set SPECKIT_COMPLEXITY_ROUTER=false to disable.
 *
 * @returns True when SPECKIT_COMPLEXITY_ROUTER is not explicitly disabled.
 */
function isComplexityRouterEnabled(): boolean {
  const raw = process.env.SPECKIT_COMPLEXITY_ROUTER?.toLowerCase()?.trim();
  return raw !== 'false';
}

/* --- 3. FEATURE EXTRACTION --- */

/**
 * Split query into terms by whitespace, filtering empty strings.
 *
 * @param query - Raw query string to tokenize.
 * @returns Array of non-empty whitespace-delimited terms.
 */
function extractTerms(query: string): string[] {
  return query.trim().split(/\s+/).filter(t => t.length > 0);
}

/**
 * Calculate the ratio of stop words in the query terms.
 * Returns 0 for empty term lists.
 *
 * @param terms - Array of query terms to analyse.
 * @returns Ratio in [0, 1] of stop words to total terms.
 */
function calculateStopWordRatio(terms: string[]): number {
  if (terms.length === 0) return 0;
  const stopCount = terms.filter(t => STOP_WORDS.has(t.toLowerCase())).length;
  return stopCount / terms.length;
}

/**
 * Check if the query exactly matches any known trigger phrase (case-insensitive).
 *
 * @param query          - Raw query string to test.
 * @param triggerPhrases - Known trigger phrases to match against.
 * @returns True when the query matches a trigger phrase exactly.
 */
function hasTriggerMatch(query: string, triggerPhrases: string[]): boolean {
  if (triggerPhrases.length === 0) return false;
  const normalized = query.trim().toLowerCase();
  return triggerPhrases.some(tp => tp.trim().toLowerCase() === normalized);
}

/* --- 4. CLASSIFICATION --- */

/**
 * Determine confidence label based on how clearly the query fits its tier.
 *
 * @param tier          - Classified complexity tier.
 * @param termCount     - Number of query terms.
 * @param hasTrigger    - Whether a trigger phrase matched.
 * @param stopWordRatio - Ratio of stop words in query.
 * @returns Confidence label: 'high', 'medium', or 'low'.
 */
function determineConfidence(
  tier: QueryComplexityTier,
  termCount: number,
  hasTrigger: boolean,
  stopWordRatio: number,
): 'high' | 'medium' | 'low' {
  if (tier === 'simple') {
    // Trigger match is strongest simplicity signal — overrides term count
    if (hasTrigger) return 'high';
    if (termCount <= 2) return 'high';
    return 'medium';
  }

  if (tier === 'complex') {
    // High confidence: many terms and low stop-word ratio (content-rich)
    if (termCount > 12) return 'high';
    if (stopWordRatio < 0.3) return 'high';
    return 'medium';
  }

  // Moderate tier: inherently less certain (between boundaries)
  if (termCount === SIMPLE_TERM_THRESHOLD + 1 || termCount === COMPLEX_TERM_THRESHOLD) {
    return 'low'; // Near boundary
  }
  return 'medium';
}

/**
 * Classify a query's complexity into one of three tiers: simple, moderate, or complex.
 *
 * Classification boundaries:
 * - Simple: ≤3 terms OR trigger phrase match
 * - Complex: >8 terms AND no trigger match
 * - Moderate: everything else (interior)
 *
 * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled (enabled by default,
 * graduated), all queries classify as "complex" (safe fallback — full pipeline).
 *
 * On any error, returns "complex" (safe fallback per spec).
 *
 * @param query          - Raw user query string.
 * @param triggerPhrases - Optional array of known trigger phrases.
 * @returns ClassificationResult with tier, features, and confidence.
 */
function classifyQueryComplexity(
  query: string,
  triggerPhrases?: string[],
): ClassificationResult {
  // Safe fallback for any unexpected state
  const FALLBACK: ClassificationResult = {
    tier: 'complex',
    features: { termCount: 0, charCount: 0, hasTriggerMatch: false, stopWordRatio: 0 },
    confidence: 'fallback',
  };

  try {
    // Feature flag gate: when disabled, always return complex
    if (!isComplexityRouterEnabled()) {
      return FALLBACK;
    }

    // Edge case: empty or whitespace-only queries → complex fallback
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return FALLBACK;
    }

    const terms = extractTerms(query);
    const termCount = terms.length;
    const charCount = query.length;
    const triggers = triggerPhrases ?? [];
    const triggerMatch = hasTriggerMatch(query, triggers);
    const stopWordRatio = calculateStopWordRatio(terms);

    // Classification boundaries
    let tier: QueryComplexityTier;

    // TriggerMatch always forces simple tier regardless of term count
    if (triggerMatch || termCount <= SIMPLE_TERM_THRESHOLD) {
      tier = 'simple';
    } else if (termCount > COMPLEX_TERM_THRESHOLD && !triggerMatch) {
      tier = 'complex';
    } else {
      tier = 'moderate';
    }

    const confidence = determineConfidence(tier, termCount, triggerMatch, stopWordRatio);

    return {
      tier,
      features: {
        termCount,
        charCount,
        hasTriggerMatch: triggerMatch,
        // Round to 3 decimals to avoid floating-point noise in debug output
        stopWordRatio: Math.round(stopWordRatio * 1000) / 1000,
      },
      confidence,
    };
  } catch (_err: unknown) {
    // Classification failure — return moderate default
    return FALLBACK;
  }
}

/* --- 5. EXPORTS --- */

export {
  // Types
  type QueryComplexityTier,
  type ClassificationResult,

  // Constants
  SIMPLE_TERM_THRESHOLD,
  COMPLEX_TERM_THRESHOLD,
  STOP_WORDS,

  // Functions
  classifyQueryComplexity,
  isComplexityRouterEnabled,

  // Internal helpers (exported for testing)
  extractTerms,
  calculateStopWordRatio,
  hasTriggerMatch,
};
