// ───────────────────────────────────────────────────────────────
// MODULE: Query Intent Classifier
// ───────────────────────────────────────────────────────────────
// Heuristic pre-classifier that routes queries to the optimal
// retrieval backend: structural (code graph) vs semantic
// (CocoIndex) vs hybrid (both).

export type QueryIntent = 'structural' | 'semantic' | 'hybrid';

export interface ClassificationResult {
  intent: QueryIntent;
  confidence: number;
  structuralScore: number;
  semanticScore: number;
  matchedKeywords: string[];
}

// ── Keyword dictionaries ───────────────────────────────────────

const STRUCTURAL_KEYWORDS = new Set([
  // Relationship queries
  'calls', 'imports', 'exports', 'extends', 'implements',
  'contains', 'overrides', 'decorates', 'inherits',
  // Symbol queries
  'function', 'class', 'method', 'interface', 'type',
  'enum', 'variable', 'parameter', 'module',
  // Navigation
  'callers', 'callees', 'dependencies', 'dependents',
  'references', 'definition', 'declaration', 'signature',
  // Graph operations
  'neighborhood', 'outline', 'impact', 'graph',
  'edges', 'nodes', 'symbols', 'hierarchy',
  // Structural patterns
  'inheritance', 'call chain', 'import tree', 'export map',
]);

const SEMANTIC_KEYWORDS = new Set([
  // Similarity
  'similar', 'like', 'related', 'resembles', 'comparable',
  // Conceptual
  'example', 'pattern', 'usage', 'how to', 'approach',
  'technique', 'strategy', 'idiom', 'convention',
  // Discovery
  'find', 'search', 'discover', 'locate', 'where',
  // Understanding
  'explain', 'understand', 'what does', 'purpose', 'why',
  'meaning', 'context', 'concept', 'intent',
  // Content-oriented
  'error handling', 'logging', 'validation', 'configuration',
  'authentication', 'middleware', 'utility', 'helper',
]);

const STRUCTURAL_PATTERNS = [
  /who\s+calls/i,
  /what\s+(?:calls|imports|exports|extends|implements)/i,
  /(?:show|list|get)\s+(?:callers|callees|dependencies|imports|exports)/i,
  /(?:class|function|method)\s+(?:hierarchy|tree)/i,
  /(?:impact|blast\s+radius)\s+of/i,
  /(?:outline|structure)\s+of/i,
];

const SEMANTIC_PATTERNS = [
  /similar\s+to/i,
  /(?:how|where)\s+(?:is|are|do|does|to)/i,
  /(?:find|search)\s+(?:code|files|implementations)\s+(?:that|for|about|related)/i,
  /(?:examples?|patterns?|usage)\s+of/i,
  /what\s+(?:is|are|does)/i,
];

// ── Classification logic ───────────────────────────────────────

function tokenize(query: string): string[] {
  return query.toLowerCase().split(/[\s,;:.()\[\]{}'"]+/).filter(Boolean);
}

function countKeywordHits(tokens: string[], keywords: Set<string>): { count: number; matched: string[] } {
  const matched: string[] = [];
  for (const token of tokens) {
    if (keywords.has(token)) matched.push(token);
  }
  // Also check multi-word phrases
  const lowerQuery = tokens.join(' ');
  for (const kw of keywords) {
    if (kw.includes(' ') && lowerQuery.includes(kw)) {
      matched.push(kw);
    }
  }
  return { count: matched.length, matched };
}

function countPatternHits(query: string, patterns: RegExp[]): number {
  let count = 0;
  for (const pattern of patterns) {
    if (pattern.test(query)) count++;
  }
  return count;
}

/**
 * Classify a query's intent for routing between structural
 * (code graph) and semantic (CocoIndex) retrieval backends.
 *
 * Returns intent + confidence score. Hybrid intent means
 * both backends should be queried and results merged.
 */
export function classifyQueryIntent(query: string): ClassificationResult {
  if (!query?.trim()) {
    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords: [] };
  }

  const tokens = tokenize(query);
  const structuralHits = countKeywordHits(tokens, STRUCTURAL_KEYWORDS);
  const semanticHits = countKeywordHits(tokens, SEMANTIC_KEYWORDS);
  const structuralPatterns = countPatternHits(query, STRUCTURAL_PATTERNS);
  const semanticPatterns = countPatternHits(query, SEMANTIC_PATTERNS);

  // Weighted scoring: keywords count 1x, patterns count 2x
  const structuralScore = structuralHits.count + structuralPatterns * 2;
  const semanticScore = semanticHits.count + semanticPatterns * 2;
  const total = structuralScore + semanticScore;

  const matchedKeywords = [...structuralHits.matched, ...semanticHits.matched];

  // No signals at all → hybrid (run both)
  if (total === 0) {
    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords };
  }

  const structuralRatio = structuralScore / total;
  const semanticRatio = semanticScore / total;

  // Clear structural signal (>65% structural)
  if (structuralRatio > 0.65) {
    return {
      intent: 'structural',
      confidence: Math.min(0.95, 0.6 + structuralRatio * 0.35),
      structuralScore,
      semanticScore,
      matchedKeywords,
    };
  }

  // Clear semantic signal (>65% semantic)
  if (semanticRatio > 0.65) {
    return {
      intent: 'semantic',
      confidence: Math.min(0.95, 0.6 + semanticRatio * 0.35),
      structuralScore,
      semanticScore,
      matchedKeywords,
    };
  }

  // Ambiguous → hybrid with moderate confidence
  return {
    intent: 'hybrid',
    confidence: 0.5 + Math.abs(structuralRatio - semanticRatio) * 0.3,
    structuralScore,
    semanticScore,
    matchedKeywords,
  };
}
