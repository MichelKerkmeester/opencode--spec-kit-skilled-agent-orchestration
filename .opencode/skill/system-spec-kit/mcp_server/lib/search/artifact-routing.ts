// ───────────────────────────────────────────────────────────────
// MODULE: Artifact Routing
// ───────────────────────────────────────────────────────────────
// Splits retrieval strategy by artifact class for class-specific
// Retrieval policies with deterministic branch behavior.
/* ───────────────────────────────────────────────────────────────
   1. TYPES
----------------------------------------------------------------*/

type ArtifactClass =
  | 'spec'
  | 'plan'
  | 'tasks'
  | 'checklist'
  | 'decision-record'
  | 'implementation-summary'
  | 'memory'
  | 'research'
  | 'unknown';

interface RetrievalStrategy {
  artifactClass: ArtifactClass;
  /** Weight for semantic (vector) search component, 0-1 */
  semanticWeight: number;
  /** Weight for keyword (BM25) search component, 0-1 */
  keywordWeight: number;
  /** Recency bias factor, 0-1 (higher = prefer newer) */
  recencyBias: number;
  /** Maximum results to return */
  maxResults: number;
  /** Boost factor applied to final scores, 0-2 */
  boostFactor: number;
}

interface RoutingResult {
  strategy: RetrievalStrategy;
  detectedClass: ArtifactClass;
  confidence: number;
}

interface WeightedResult extends Record<string, unknown> {
  id: number;
  score?: number;
  similarity?: number;
  artifactBoostApplied?: number;
}

/* ───────────────────────────────────────────────────────────────
   2. ROUTING TABLE
----------------------------------------------------------------*/

const ROUTING_TABLE: Record<ArtifactClass, RetrievalStrategy> = {
  spec: {
    artifactClass: 'spec',
    semanticWeight: 0.7,
    keywordWeight: 0.3,
    recencyBias: 0.2,
    maxResults: 5,
    boostFactor: 1.0,
  },
  plan: {
    artifactClass: 'plan',
    semanticWeight: 0.6,
    keywordWeight: 0.4,
    recencyBias: 0.3,
    maxResults: 5,
    boostFactor: 1.0,
  },
  tasks: {
    artifactClass: 'tasks',
    semanticWeight: 0.4,
    keywordWeight: 0.6,
    recencyBias: 0.5,
    maxResults: 10,
    boostFactor: 0.9,
  },
  checklist: {
    artifactClass: 'checklist',
    semanticWeight: 0.3,
    keywordWeight: 0.7,
    recencyBias: 0.4,
    maxResults: 10,
    boostFactor: 0.9,
  },
  'decision-record': {
    artifactClass: 'decision-record',
    semanticWeight: 0.6,
    keywordWeight: 0.4,
    recencyBias: 0.2,
    maxResults: 5,
    boostFactor: 1.0,
  },
  'implementation-summary': {
    artifactClass: 'implementation-summary',
    semanticWeight: 0.5,
    keywordWeight: 0.5,
    recencyBias: 0.3,
    maxResults: 5,
    boostFactor: 1.0,
  },
  memory: {
    artifactClass: 'memory',
    semanticWeight: 0.8,
    keywordWeight: 0.2,
    recencyBias: 0.6,
    maxResults: 5,
    boostFactor: 1.1,
  },
  research: {
    artifactClass: 'research',
    semanticWeight: 0.7,
    keywordWeight: 0.3,
    recencyBias: 0.2,
    maxResults: 5,
    boostFactor: 1.0,
  },
  unknown: {
    artifactClass: 'unknown',
    semanticWeight: 0.5,
    keywordWeight: 0.5,
    recencyBias: 0.3,
    maxResults: 10,
    boostFactor: 1.0,
  },
};

/* ───────────────────────────────────────────────────────────────
   3. FILE PATH CLASSIFICATION PATTERNS
----------------------------------------------------------------*/

/**
 * Ordered classification patterns. First match wins.
 * More specific patterns precede generic ones.
 */
const FILE_PATH_PATTERNS: Array<{ pattern: RegExp; artifactClass: ArtifactClass }> = [
  { pattern: /decision-record\.md$/i, artifactClass: 'decision-record' },
  { pattern: /implementation-summary\.md$/i, artifactClass: 'implementation-summary' },
  { pattern: /checklist\.md$/i, artifactClass: 'checklist' },
  { pattern: /tasks\.md$/i, artifactClass: 'tasks' },
  { pattern: /plan\.md$/i, artifactClass: 'plan' },
  { pattern: /spec\.md$/i, artifactClass: 'spec' },
  { pattern: /research\.md$/i, artifactClass: 'research' },
  // Memory files live in memory/ subdirectory with timestamp naming
  { pattern: /\/memory\/[^/]+\.md$/i, artifactClass: 'memory' },
  { pattern: /memory\.md$/i, artifactClass: 'memory' },
];

/* ───────────────────────────────────────────────────────────────
   4. QUERY DETECTION PATTERNS
----------------------------------------------------------------*/

/**
 * Query keyword/pattern mapping for artifact class detection from
 * natural language queries. Scored by match count.
 */
const QUERY_PATTERNS: Array<{ keywords: string[]; patterns: RegExp[]; artifactClass: ArtifactClass }> = [
  {
    artifactClass: 'checklist',
    keywords: ['checklist', 'checkbox', 'check list', 'verification', 'p0', 'p1', 'p2', 'blocker'],
    patterns: [/checklist/i, /verification\s+items?/i, /what\s+(?:is|are)\s+(?:the\s+)?(?:remaining|pending|blocking)/i],
  },
  {
    artifactClass: 'tasks',
    keywords: ['tasks', 'task list', 'todo', 'to-do', 'work items', 'backlog'],
    patterns: [/tasks?\.md/i, /(?:open|pending|remaining)\s+tasks?/i, /task\s+(?:list|breakdown)/i],
  },
  {
    artifactClass: 'decision-record',
    keywords: ['decision', 'adr', 'decision-record', 'rationale', 'trade-off', 'tradeoff', 'chose', 'alternative'],
    patterns: [/decision[\s-]record/i, /why\s+(?:did|do)\s+we/i, /what\s+(?:was|were)\s+the\s+(?:decision|rationale)/i],
  },
  {
    artifactClass: 'implementation-summary',
    keywords: ['implementation-summary', 'implementation summary', 'summary of changes', 'what was implemented', 'config', 'setup', 'env', 'flag', 'setting'],
    patterns: [/implementation[\s-]summary/i, /what\s+(?:was|got)\s+implemented/i, /summary\s+of\s+(?:changes|implementation)/i],
  },
  {
    artifactClass: 'plan',
    keywords: ['plan', 'planning', 'approach', 'strategy', 'phases', 'milestones', 'timeline'],
    patterns: [/plan\.md/i, /(?:the|our|current)\s+plan/i, /how\s+(?:will|should)\s+we\s+(?:approach|implement)/i],
  },
  {
    artifactClass: 'spec',
    keywords: ['spec', 'specification', 'requirements', 'scope', 'objective', 'constraints'],
    patterns: [/spec\.md/i, /specification/i, /(?:the|our)\s+(?:spec|requirements|scope)/i],
  },
  {
    artifactClass: 'research',
    keywords: ['research', 'investigation', 'analysis', 'findings', 'study', 'evaluation', 'search', 'retrieval', 'pipeline', 'indexing', 'embedding', 'vector', 'semantic'],
    patterns: [/research\.md/i, /research\s+(?:findings|results|notes)/i],
  },
  {
    artifactClass: 'memory',
    keywords: ['memory', 'context', 'session', 'previous session', 'prior work', 'last time', 'continue', 'resume', 'recover', 'continuation'],
    patterns: [/memory/i, /(?:previous|prior|last)\s+(?:session|work|context)/i, /what\s+(?:did|was)\s+(?:we|I)\s+(?:do|work\s+on)\s+(?:last|before)/i],
  },
];

/* ───────────────────────────────────────────────────────────────
   5. INTENT-TO-ARTIFACT FALLBACK
----------------------------------------------------------------*/

/**
 * Intent-based fallback mapping for artifact class detection.
 * Used when keyword/pattern scoring yields zero matches but an
 * intent classifier result is available. Confidence: 0.4.
 */
const INTENT_TO_ARTIFACT: Record<string, ArtifactClass> = {
  understand: 'research',
  find_spec: 'spec',
  find_decision: 'decision-record',
  add_feature: 'implementation-summary',
  fix_bug: 'memory',
  refactor: 'implementation-summary',
  security_audit: 'research',
};

/* ───────────────────────────────────────────────────────────────
   6. CLASSIFICATION FUNCTIONS
----------------------------------------------------------------*/

/**
 * Classify artifact class from a file path.
 * Uses ordered pattern matching; first match wins.
 * Returns 'unknown' if no pattern matches.
 */
function classifyArtifact(filePath: string): ArtifactClass {
  if (!filePath || typeof filePath !== 'string') {
    return 'unknown';
  }

  const trimmed = filePath.trim();
  if (trimmed.length === 0) {
    return 'unknown';
  }

  for (const { pattern, artifactClass } of FILE_PATH_PATTERNS) {
    if (pattern.test(trimmed)) {
      return artifactClass;
    }
  }

  return 'unknown';
}

/**
 * Get retrieval strategy for an artifact class.
 * Always returns a valid strategy (falls back to 'unknown').
 */
function getStrategy(artifactClass: ArtifactClass): RetrievalStrategy {
  return ROUTING_TABLE[artifactClass] || ROUTING_TABLE.unknown;
}

/**
 * Detect artifact class from a natural language query and optional specFolder.
 * Returns a RoutingResult with the detected class, strategy, and confidence.
 */
function getStrategyForQuery(query: string, specFolder?: string, intent?: string): RoutingResult {
  const defaultResult: RoutingResult = {
    strategy: ROUTING_TABLE.unknown,
    detectedClass: 'unknown',
    confidence: 0,
  };

  if (!query || typeof query !== 'string') {
    return defaultResult;
  }

  const lower = query.toLowerCase().trim();
  if (lower.length === 0) {
    return defaultResult;
  }

  let bestClass: ArtifactClass = 'unknown';
  let bestScore = 0;

  for (const { keywords, patterns, artifactClass } of QUERY_PATTERNS) {
    let score = 0;

    // Keyword matching (each match adds 1 point)
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        score += 1;
      }
    }

    // Pattern matching (each match adds 2 points — patterns are more specific)
    for (const pattern of patterns) {
      if (pattern.test(query)) {
        score += 2;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestClass = artifactClass;
    }
  }

  // Confidence: normalize score. Max realistic score ~6-8 (3 keywords + 2 patterns).
  // Use a soft cap at 6 to map to 0-1 range.
  const confidence = bestScore > 0 ? Math.min(1, bestScore / 6) : 0;

  // Intent-based fallback: use module-level INTENT_TO_ARTIFACT map
  if (bestScore === 0 && intent && INTENT_TO_ARTIFACT[intent]) {
    const mappedClass = INTENT_TO_ARTIFACT[intent];
    return {
      strategy: ROUTING_TABLE[mappedClass],
      detectedClass: mappedClass,
      confidence: 0.4,
    };
  }

  // If specFolder hints at an artifact type, use it as tiebreaker
  if (bestScore === 0 && specFolder) {
    const folderClass = classifyArtifact(specFolder);
    if (folderClass !== 'unknown') {
      return {
        strategy: ROUTING_TABLE[folderClass],
        detectedClass: folderClass,
        confidence: 0.3, // Low confidence from folder hint only
      };
    }
  }

  return {
    strategy: ROUTING_TABLE[bestClass],
    detectedClass: bestClass,
    confidence,
  };
}

/**
 * Apply routing-based weight adjustments to search results.
 * Modifies scores based on the artifact class strategy:
 * - Applies boostFactor to final scores
 * - Deterministic: same inputs always produce same outputs
 */
function applyRoutingWeights(
  results: WeightedResult[],
  strategy: RetrievalStrategy,
): WeightedResult[] {
  if (!Array.isArray(results) || results.length === 0) {
    return results;
  }

  if (!strategy || typeof strategy.boostFactor !== 'number') {
    return results;
  }

  const boostFactor = Math.max(0, Math.min(2, strategy.boostFactor));

  return results.map(result => {
    const baseScore = typeof result.score === 'number' && Number.isFinite(result.score)
      ? result.score
      : typeof result.similarity === 'number' && Number.isFinite(result.similarity)
        ? result.similarity / 100
        : 0;

    const boostedScore = baseScore * boostFactor;

    return {
      ...result,
      score: boostedScore,
      artifactBoostApplied: boostFactor,
    };
  });
}

/* ───────────────────────────────────────────────────────────────
   7. EXPORTS
----------------------------------------------------------------*/

export {
  ROUTING_TABLE,
  FILE_PATH_PATTERNS,
  QUERY_PATTERNS,
  INTENT_TO_ARTIFACT,

  // Classification
  classifyArtifact,
  getStrategy,
  getStrategyForQuery,
  applyRoutingWeights,
};

export type {
  ArtifactClass,
  RetrievalStrategy,
  RoutingResult,
  WeightedResult,
};
