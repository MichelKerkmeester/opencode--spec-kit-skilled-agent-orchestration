// ───────────────────────────────────────────────────────────────
// MODULE: Intent Classifier
// ───────────────────────────────────────────────────────────────
// Feature catalog: Query complexity router
/* --- 1. TYPES & CONSTANTS --- */

type IntentType = 'add_feature' | 'fix_bug' | 'refactor' | 'security_audit' | 'understand' | 'find_spec' | 'find_decision';

interface RankedIntent {
  intent: IntentType;
  confidence: number;
  score: number;
}

interface IntentResult {
  intent: IntentType;
  confidence: number;
  scores: Record<IntentType, number>;
  keywords: string[];
  rankedIntents: RankedIntent[];
}

interface IntentWeights {
  recency: number;
  importance: number;
  similarity: number;
  contextType: string | null;
}

type IntentCentroids = Record<IntentType, Float32Array>;

const INTENT_TYPES: Record<string, IntentType> = {
  ADD_FEATURE: 'add_feature',
  FIX_BUG: 'fix_bug',
  REFACTOR: 'refactor',
  SECURITY_AUDIT: 'security_audit',
  UNDERSTAND: 'understand',
  FIND_SPEC: 'find_spec',
  FIND_DECISION: 'find_decision',
} as const;

const INTENT_KEYWORDS: Record<IntentType, string[]> = {
  add_feature: [
    'add', 'create', 'new', 'implement', 'build', 'feature', 'extend',
    'introduce', 'support', 'enable', 'integrate', 'develop',
  ],
  fix_bug: [
    'fix', 'bug', 'error', 'issue', 'broken', 'crash', 'fail', 'wrong',
    'problem', 'debug', 'patch', 'resolve', 'repair', 'incorrect',
  ],
  refactor: [
    'refactor', 'clean', 'improve', 'optimize', 'restructure', 'simplify',
    'reorganize', 'consolidate', 'migrate', 'modernize', 'rename',
  ],
  security_audit: [
    'security', 'vulnerability', 'exploit', 'injection', 'xss', 'csrf',
    'authentication', 'authorization', 'permission', 'audit', 'pentest',
    'sanitize', 'validate', 'encrypt', 'decrypt',
  ],
  understand: [
    'understand', 'explain', 'describe', 'overview',
    'architecture', 'design', 'flow', 'documentation', 'guide',
    'learn', 'strategy', 'purpose', 'context',
  ],
  find_spec: [
    'spec', 'specification', 'requirements', 'scope', 'feature',
    'plan', 'tasks', 'checklist', 'implementation',
  ],
  find_decision: [
    'decision', 'why', 'chose', 'rationale', 'alternative',
    'trade-off', 'tradeoff', 'adr', 'decision-record',
  ],
};

const INTENT_PATTERNS: Record<IntentType, RegExp[]> = {
  add_feature: [
    /add\s+(?:a\s+)?(?:new\s+)?/i,
    /create\s+(?:a\s+)?/i,
    /implement\s+/i,
    /build\s+(?:a\s+)?/i,
    /introduce\s+/i,
  ],
  fix_bug: [
    /fix\s+(?:the\s+)?/i,
    /debug\s+/i,
    /(?:is|are)\s+(?:broken|failing|crashing)/i,
    /(?:not|doesn't|won't)\s+(?:work|function|run)/i,
    /error\s+(?:in|with|when)/i,
    /how\s+to\s+fix/i,
  ],
  refactor: [
    /refactor\s+/i,
    /clean\s*up\s+/i,
    /improve\s+(?:the\s+)?/i,
    /optimize\s+/i,
    /migrate\s+(?:from|to)\s+/i,
  ],
  security_audit: [
    /security\s+(?:audit|review|check)/i,
    /vulnerabilit(?:y|ies)/i,
    /(?:sql|xss|csrf)\s+(?:injection|attack)/i,
    /pentest/i,
    /authentication\s+(?:issue|problem|bug)/i,
  ],
  understand: [
    /explain\s+(?:the\s+|how\s+|why\s+)/i,
    /(?:tell|show)\s+me\s+(?:about|how)/i,
    /give\s+(?:me\s+)?(?:an?\s+)?overview/i,
    /describe\s+(?:the\s+)?(?:architecture|design|flow)/i,
    /how\s+does\s+(?:the\s+|this\s+)/i,
    /what\s+is\s+(?:the\s+|this\s+)/i,
    /why\s+was\s+(?:the\s+|this\s+)?(?:architecture|design|approach)\s+chosen/i,
  ],
  find_spec: [
    /(?:find|show|get)\s+(?:the\s+)?spec/i,
    /what\s+(?:are|were)\s+the\s+requirements/i,
    /what\s+(?:is|was)\s+the\s+(?:scope|plan)/i,
    /spec(?:ification)?\s+for\s+/i,
    /what\s+(?:did|does)\s+(?:the\s+)?(?:spec|plan)\s+say/i,
  ],
  find_decision: [
    /why\s+(?:did|do)\s+we\s+(?:choose|pick|select|decide)/i,
    /what\s+(?:was|were)\s+the\s+(?:decision|rationale)/i,
    /decision\s+(?:record|log|history)/i,
    /(?:find|show|get)\s+(?:the\s+)?decision/i,
    /what\s+alternatives?\s+(?:were|was)\s+considered/i,
  ],
};

/**
 * T016: Lightweight deterministic embedding centroid classifier.
 *
 * The model uses hashed bag-of-words embeddings so centroids can be built
 * synchronously at module initialization with no external provider dependency.
 */
const CENTROID_EMBED_DIM = 128;

const INTENT_CENTROID_SEEDS: Record<IntentType, string[]> = {
  add_feature: [
    'add new feature and implement capability',
    'create and build a new integration',
    'introduce support for a new flow',
  ],
  fix_bug: [
    'fix bug and debug failing error',
    'resolve broken crash and incorrect behavior',
    'repair issue and patch regression',
  ],
  refactor: [
    'refactor and simplify existing code',
    'restructure and clean architecture',
    'improve maintainability and modernize module',
  ],
  security_audit: [
    'security audit vulnerability and injection review',
    'authorization authentication and permission checks',
    'pentest sanitize validate and encryption checks',
  ],
  understand: [
    'understand architecture and explain design',
    'describe system overview and flow',
    'learn purpose and documentation context',
  ],
  find_spec: [
    'find spec requirements plan and checklist',
    'show specification scope and implementation tasks',
    'locate feature plan and requirement details',
  ],
  find_decision: [
    'find decision record rationale and trade off',
    'show why this choice was made',
    'locate adr alternatives and final decision',
  ],
};

/**
 * P3-12: Negative patterns — when matched, penalize the given intent.
 * E.g., "how to fix" should not score for "understand".
 */
const INTENT_NEGATIVE_PATTERNS: Partial<Record<IntentType, RegExp[]>> = {
  understand: [
    /how\s+to\s+(?:fix|add|create|implement|build|repair|patch)/i,
    /what\s+(?:is\s+)?(?:wrong|broken|failing|the\s+error|the\s+bug)/i,
    /why\s+(?:is\s+it\s+)?(?:broken|failing|crashing|not\s+working)/i,
  ],
  security_audit: [
    /\bunderstand\b/i,
    /\bhow\s+does\b/i,
    /\bwhat\s+is\s+the\s+purpose\b/i,
  ],
};

/** P3-12: Minimum confidence threshold below which "general" style fallback is used */
const MIN_CONFIDENCE_THRESHOLD = 0.08;
const MAX_RANKED_INTENTS = 3;

const INTENT_WEIGHT_ADJUSTMENTS: Record<IntentType, IntentWeights> = {
  add_feature: { recency: 0.3, importance: 0.4, similarity: 0.3, contextType: 'implementation' },
  fix_bug: { recency: 0.5, importance: 0.2, similarity: 0.3, contextType: 'implementation' },
  refactor: { recency: 0.2, importance: 0.3, similarity: 0.5, contextType: 'implementation' },
  security_audit: { recency: 0.1, importance: 0.5, similarity: 0.4, contextType: 'research' },
  understand: { recency: 0.2, importance: 0.3, similarity: 0.5, contextType: null },
  find_spec: { recency: 0.1, importance: 0.5, similarity: 0.4, contextType: 'planning' },
  find_decision: { recency: 0.1, importance: 0.5, similarity: 0.4, contextType: 'planning' },
};

const INTENT_CENTROIDS: IntentCentroids = buildIntentCentroids();

/* --- 2. SCORING FUNCTIONS --- */

/**
 * Score a query against an intent's keyword list, returning normalized score and matched keywords.
 *
 * @param query - Raw user query string
 * @param intent - Intent type to score against
 * @returns Object with normalized score and array of matched keywords
 */
function calculateKeywordScore(query: string, intent: IntentType): { score: number; matches: string[] } {
  const lower = query.toLowerCase();
  const keywords = INTENT_KEYWORDS[intent];
  const matches: string[] = [];
  let score = 0;

  for (const keyword of keywords) {
    if (lower.includes(keyword)) {
      score += 1;
      matches.push(keyword);
    }
  }

  // P3-12: Require at least 2 keyword matches for a meaningful keyword score.
  // A single generic keyword match produces a heavily discounted score.
  if (matches.length === 1) {
    score *= 0.3;
  }

  // Normalize by keyword count
  return {
    score: keywords.length > 0 ? score / keywords.length : 0,
    matches,
  };
}

/**
 * Score a query against an intent's regex patterns, returning fraction of patterns matched.
 *
 * @param query - Raw user query string
 * @param intent - Intent type to score against
 * @returns Fraction of patterns matched (0-1)
 */
function calculatePatternScore(query: string, intent: IntentType): number {
  const patterns = INTENT_PATTERNS[intent];
  let matches = 0;

  for (const pattern of patterns) {
    if (pattern.test(query)) {
      matches++;
    }
  }

  return patterns.length > 0 ? matches / patterns.length : 0;
}

/**
 * Detect explicit spec-retrieval phrasing so document lookup intent wins over domain terms.
 *
 * @param query - Raw user query string
 * @returns True if query explicitly targets spec/plan/requirements lookup
 */
function isExplicitSpecLookup(query: string): boolean {
  return (
    /(?:find|show|get)\s+(?:me\s+)?(?:the\s+)?(?:spec|specification|requirements|scope|plan|checklist)/i.test(query) ||
    /(?:spec|specification)\s+for\s+/i.test(query) ||
    /what\s+(?:are|is|was|were)\s+the\s+(?:requirements|scope|plan)/i.test(query)
  );
}

/**
 * Compute a deterministic normalized embedding for text.
 *
 * @param text - Input text to embed
 * @returns Normalized Float32Array embedding vector
 */
function toDeterministicEmbedding(text: string): Float32Array {
  const vec = new Float32Array(CENTROID_EMBED_DIM);
  const tokens = text.toLowerCase().match(/[a-z0-9_]+/g) ?? [];
  for (const token of tokens) {
    const idx = hashToken(token) % CENTROID_EMBED_DIM;
    vec[idx] += 1;
  }
  return normalizeVector(vec);
}

/**
 * Build one centroid vector per intent from seed phrases and keywords.
 *
 * @returns Map of intent types to their centroid embedding vectors
 */
function buildIntentCentroids(): IntentCentroids {
  const out = {} as IntentCentroids;
  for (const intent of Object.values(INTENT_TYPES)) {
    const sources = [...INTENT_CENTROID_SEEDS[intent], ...INTENT_KEYWORDS[intent]];
    const acc = new Float32Array(CENTROID_EMBED_DIM);
    for (const src of sources) {
      const emb = toDeterministicEmbedding(src);
      for (let i = 0; i < acc.length; i++) {
        acc[i] += emb[i];
      }
    }
    out[intent] = normalizeVector(acc);
  }
  return out;
}

/**
 * Hash a token into a stable non-negative integer.
 * // FNV-1a hash chosen for speed and low collision rate on short strings
 *
 * @param token - Single lowercase token to hash
 * @returns Non-negative 32-bit integer hash
 */
function hashToken(token: string): number {
  let h = 2166136261;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * L2-normalize a vector in place.
 *
 * @param vec - Float32Array vector to normalize
 * @returns The same vector, normalized to unit length
 */
function normalizeVector(vec: Float32Array): Float32Array {
  let norm = 0;
  for (let i = 0; i < vec.length; i++) {
    norm += vec[i] * vec[i];
  }
  if (norm <= 0) return vec;
  const inv = 1 / Math.sqrt(norm);
  for (let i = 0; i < vec.length; i++) {
    vec[i] *= inv;
  }
  return vec;
}

/**
 * Dot product similarity for normalized vectors.
 *
 * @param a - First vector
 * @param b - Second vector
 * @returns Dot product (cosine similarity for unit vectors)
 */
function dotProduct(a: Float32Array | number[], b: Float32Array | number[]): number {
  const len = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += (a[i] as number) * (b[i] as number);
  }
  return sum;
}

/**
 * Score query-to-intent using centroid embeddings.
 *
 * @param query - Raw user query string
 * @param intent - Intent type to score against
 * @returns Cosine similarity score (0-1)
 */
function calculateCentroidScore(query: string, intent: IntentType): number {
  const queryEmb = toDeterministicEmbedding(query);
  const centroid = INTENT_CENTROIDS[intent];
  return Math.max(0, dotProduct(queryEmb, centroid));
}

function buildRankedIntents(scores: Record<IntentType, number>): RankedIntent[] {
  return Object.entries(scores)
    .map(([intent, score]) => ({
      intent: intent as IntentType,
      confidence: Math.min(1, score),
      score,
    }))
    .filter((rankedIntent) => rankedIntent.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return left.intent.localeCompare(right.intent);
    })
    .slice(0, MAX_RANKED_INTENTS);
}

/* --- 3. CLASSIFICATION --- */

/**
 * Classify a query string into one of 7 intent types with confidence and keyword evidence.
 *
 * @param query - Raw user query string
 * @returns Intent result with type, confidence, per-intent scores, and matched keywords
 */
function classifyIntent(query: string): IntentResult {
  if (!query || typeof query !== 'string') {
    return {
      intent: 'understand',
      confidence: 0,
      scores: { add_feature: 0, fix_bug: 0, refactor: 0, security_audit: 0, understand: 0, find_spec: 0, find_decision: 0 },
      keywords: [],
      rankedIntents: [],
    };
  }

  const scores: Record<IntentType, number> = {
    add_feature: 0,
    fix_bug: 0,
    refactor: 0,
    security_audit: 0,
    understand: 0,
    find_spec: 0,
    find_decision: 0,
  };

  const allKeywords: string[] = [];

  for (const intent of Object.values(INTENT_TYPES)) {
    const { score: keywordScore, matches } = calculateKeywordScore(query, intent);
    const patternScore = calculatePatternScore(query, intent);
    const centroidScore = calculateCentroidScore(query, intent);

    let combined = (centroidScore * 0.5) + (keywordScore * 0.35) + (patternScore * 0.15);

    // P3-12: Apply negative pattern penalties
    const negPatterns = INTENT_NEGATIVE_PATTERNS[intent];
    if (negPatterns) {
      for (const neg of negPatterns) {
        if (neg.test(query)) {
          combined *= 0.3; // Heavy penalty when negative pattern matches
          break;
        }
      }
    }

    scores[intent] = combined;
    allKeywords.push(...matches);
  }

  if (isExplicitSpecLookup(query)) {
    scores.find_spec += 0.25;
    scores.security_audit *= 0.6;
  }

  // Find top intent
  let topIntent: IntentType = 'understand';
  let topScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > topScore) {
      topScore = score;
      topIntent = intent as IntentType;
    }
  }

  const rankedIntents = buildRankedIntents(scores);

  // P3-12: If top score is below minimum confidence, return "understand" with low confidence
  // This prevents weak single-keyword matches from dominating classification.
  if (topScore < MIN_CONFIDENCE_THRESHOLD) {
    return {
      intent: 'understand',
      confidence: topScore,
      scores,
      keywords: [...new Set(allKeywords)],
      rankedIntents,
    };
  }

  return {
    intent: topIntent,
    confidence: Math.min(1, topScore),
    scores,
    keywords: [...new Set(allKeywords)],
    rankedIntents,
  };
}

/**
 * Detect intent (alias for classifyIntent).
 *
 * @param query - Raw user query string
 * @returns Intent result with type, confidence, scores, and keywords
 */
function detectIntent(query: string): IntentResult {
  return classifyIntent(query);
}

/**
 * Get weight adjustments for an intent.
 *
 * @param intent - Intent type to get weights for
 * @returns Weight adjustments for recency, importance, similarity, and context type
 */
function getIntentWeights(intent: IntentType): IntentWeights {
  return INTENT_WEIGHT_ADJUSTMENTS[intent] ?? INTENT_WEIGHT_ADJUSTMENTS.understand;
}

/**
 * Apply intent-based weight adjustments to search results.
 *
 * @param results - Array of search result records
 * @param intent - Classified intent type to apply
 * @returns Results sorted by intent-adjusted score
 */
function applyIntentWeights(
  results: Array<Record<string, unknown>>,
  intent: IntentType
): Array<Record<string, unknown>> {
  const weights = getIntentWeights(intent);

  // recency was previously ignored.
  // Parse timestamps, min/max normalize to [0,1], apply weights.recency.
  // Use reduce instead of Math.max(...) to avoid stack overflow on large arrays.
  let minTs = Infinity;
  let maxTs = -Infinity;
  const timestamps: number[] = results.map(r => {
    const dateStr = r.created_at as string | undefined || r.last_accessed as string | undefined || r.last_review as string | undefined;
    if (!dateStr) return 0;
    const ts = typeof dateStr === 'string' ? new Date(dateStr).getTime() : Number(dateStr);
    const valid = Number.isFinite(ts) ? ts : 0;
    if (valid > 0) {
      if (valid < minTs) minTs = valid;
      if (valid > maxTs) maxTs = valid;
    }
    return valid;
  });
  if (!Number.isFinite(minTs)) minTs = 0;
  if (!Number.isFinite(maxTs) || maxTs <= 0) maxTs = 1;
  const tsRange = maxTs - minTs;

  return results.map((r, i) => {
    const recencyRaw = timestamps[i] > 0 && tsRange > 0
      ? (timestamps[i] - minTs) / tsRange
      : 0.5; // default mid-range if no timestamp
    return {
      ...r,
      intentAdjustedScore:
        (((r.similarity as number) || 0) / 100) * weights.similarity +
        ((r.importance_weight as number) || 0.5) * weights.importance +
        recencyRaw * weights.recency,
    };
  }).sort((a, b) =>
    ((b.intentAdjustedScore as number) || 0) - ((a.intentAdjustedScore as number) || 0)
  );
}

/**
 * Get search query weights based on detected intent.
 *
 * @param query - Raw user query string
 * @returns Weight adjustments derived from auto-detected intent
 */
function getQueryWeights(query: string): IntentWeights {
  const result = classifyIntent(query);
  return getIntentWeights(result.intent);
}

/**
 * Check if an intent type is valid.
 *
 * @param intent - String to validate as an IntentType
 * @returns True if the string is a valid IntentType
 */
function isValidIntent(intent: string): intent is IntentType {
  return Object.values(INTENT_TYPES).includes(intent as IntentType);
}

/**
 * Get all valid intent types.
 *
 * @returns Array of all valid IntentType values
 */
function getValidIntents(): IntentType[] {
  return Object.values(INTENT_TYPES);
}

/**
 * Get human-readable description for an intent.
 *
 * @param intent - Intent type to describe
 * @returns Human-readable description string
 */
function getIntentDescription(intent: IntentType): string {
  const descriptions: Record<IntentType, string> = {
    add_feature: 'Adding a new feature or capability',
    fix_bug: 'Fixing a bug or error',
    refactor: 'Refactoring or improving existing code',
    security_audit: 'Security audit or vulnerability assessment',
    understand: 'Understanding or exploring the codebase',
    find_spec: 'Finding spec documents, requirements, or plans',
    find_decision: 'Finding decision records or rationale',
  };
  return descriptions[intent] || 'Unknown intent';
}

/* --- 4. INTENT-TO-PROFILE MAPPING --- */

/**
 * Phase C: Intent-to-profile auto-routing.
 * Maps detected intent types to the most appropriate response profile.
 * Used when no explicit profile is specified by the caller.
 */
const INTENT_TO_PROFILE: Readonly<Record<IntentType, 'quick' | 'research' | 'debug'>> = {
  fix_bug: 'debug',
  security_audit: 'debug',
  understand: 'research',
  find_spec: 'research',
  find_decision: 'research',
  add_feature: 'quick',
  refactor: 'quick',
} as const;

/**
 * Get the auto-routed response profile for a detected intent.
 *
 * @param intent - Detected intent type
 * @returns Response profile name or null if no mapping exists
 */
function getProfileForIntent(intent: IntentType): 'quick' | 'research' | 'debug' | null {
  return INTENT_TO_PROFILE[intent] ?? null;
}

/* --- 5. EXPORTS --- */

/**
 * C138: Intent-to-MMR-lambda mapping.
 * Controls the trade-off between relevance and diversity for each intent.
 * Lower lambda → more diversity. Higher lambda → more relevance.
 * Per spec: understand→0.5 (diversity), fix_bug→0.85 (relevance).
 */
const INTENT_LAMBDA_MAP: Readonly<Record<string, number>> = {
  understand: 0.5,
  fix_bug: 0.85,
  find_spec: 0.5,
  find_decision: 0.5,
  add_feature: 0.7,
  refactor: 0.6,
  security_audit: 0.75,
} as const;

export {
  INTENT_TYPES,
  INTENT_KEYWORDS,
  INTENT_PATTERNS,
  INTENT_WEIGHT_ADJUSTMENTS,
  INTENT_LAMBDA_MAP,
  INTENT_TO_PROFILE,

  // Scoring
  calculateKeywordScore,
  calculatePatternScore,
  calculateCentroidScore,
  dotProduct,
  toDeterministicEmbedding,
  INTENT_CENTROIDS,

  // Classification
  classifyIntent,
  detectIntent,
  getIntentWeights,
  applyIntentWeights,
  getQueryWeights,
  isValidIntent,
  getValidIntents,
  getIntentDescription,
  getProfileForIntent,
};

export type {
  IntentType,
  IntentResult,
  RankedIntent,
  IntentWeights,
};
