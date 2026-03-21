// TEST: Graph Concept Routing (D2 REQ-D2-002) — Query-Time Alias Matching
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  nounPhrases,
  matchAliases,
  routeQueryConcepts,
  __testables,
} from '../lib/search/entity-linker';

const { BUILTIN_CONCEPT_ALIASES, MIN_NOUN_PHRASE_TOKEN_LENGTH, MAX_CONCEPTS_PER_QUERY } = __testables;

// ───────────────────────────────────────────────────────────────
// nounPhrases()
// ───────────────────────────────────────────────────────────────

describe('nounPhrases()', () => {
  it('returns empty array for empty string', () => {
    expect(nounPhrases('')).toEqual([]);
  });

  it('returns empty array for non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(nounPhrases(null)).toEqual([]);
  });

  it('filters out stop-words', () => {
    const tokens = nounPhrases('what is the memory retrieval system');
    expect(tokens).not.toContain('what');
    expect(tokens).not.toContain('is');
    expect(tokens).not.toContain('the');
  });

  it('filters out tokens shorter than MIN_NOUN_PHRASE_TOKEN_LENGTH', () => {
    const tokens = nounPhrases('the ai system at the db level');
    for (const token of tokens) {
      expect(token.length).toBeGreaterThanOrEqual(MIN_NOUN_PHRASE_TOKEN_LENGTH);
    }
  });

  it('returns lowercase tokens', () => {
    const tokens = nounPhrases('Memory Retrieval Pipeline');
    for (const token of tokens) {
      expect(token).toBe(token.toLowerCase());
    }
  });

  it('deduplicates repeated tokens', () => {
    const tokens = nounPhrases('memory memory retrieval retrieval');
    const unique = new Set(tokens);
    expect(unique.size).toBe(tokens.length);
  });

  it('extracts meaningful tokens from a real query', () => {
    const tokens = nounPhrases('how does the embedding retrieval pipeline work');
    expect(tokens).toContain('embedding');
    expect(tokens).toContain('retrieval');
    expect(tokens).toContain('pipeline');
  });

  it('handles punctuation in the query', () => {
    const tokens = nounPhrases('memory-search: find embeddings!');
    // Should not crash and should return tokens
    expect(Array.isArray(tokens)).toBe(true);
  });

  it('includes known alias tokens in output', () => {
    const tokens = nounPhrases('show me sessions checkpoints and graph edges');
    expect(tokens).toContain('sessions');
    expect(tokens).toContain('checkpoints');
    expect(tokens).toContain('graph');
    expect(tokens).toContain('edges');
  });
});

// ───────────────────────────────────────────────────────────────
// matchAliases()
// ───────────────────────────────────────────────────────────────

describe('matchAliases()', () => {
  it('returns empty array for no tokens', () => {
    expect(matchAliases([])).toEqual([]);
  });

  it('returns empty array when no tokens match any alias', () => {
    const tokens = nounPhrases('zebra unicorn dragon');
    expect(matchAliases(tokens)).toEqual([]);
  });

  it('matches "memory" to canonical "memory"', () => {
    const concepts = matchAliases(['memory']);
    expect(concepts).toContain('memory');
  });

  it('matches "memories" to canonical "memory"', () => {
    const concepts = matchAliases(['memories']);
    expect(concepts).toContain('memory');
  });

  it('matches "embedding" to canonical "embedding"', () => {
    const concepts = matchAliases(['embedding']);
    expect(concepts).toContain('embedding');
  });

  it('matches "vectors" to canonical "embedding"', () => {
    const concepts = matchAliases(['vectors']);
    expect(concepts).toContain('embedding');
  });

  it('matches "graph" to canonical "graph"', () => {
    const concepts = matchAliases(['graph']);
    expect(concepts).toContain('graph');
  });

  it('matches "edges" to canonical "graph"', () => {
    const concepts = matchAliases(['edges']);
    expect(concepts).toContain('graph');
  });

  it('uses extra aliases when provided', () => {
    const extraAliases = { 'hydra': 'hydra-system', 'rag': 'retrieval' };
    const concepts = matchAliases(['hydra'], extraAliases);
    expect(concepts).toContain('hydra-system');
  });

  it('extra aliases supplement (not replace) built-in aliases', () => {
    const extraAliases = { 'customthing': 'custom-concept' };
    const concepts = matchAliases(['memory', 'customthing'], extraAliases);
    expect(concepts).toContain('memory');
    expect(concepts).toContain('custom-concept');
  });

  it('deduplicates concepts (multiple aliases -> same canonical)', () => {
    // Both "memory" and "memories" map to "memory"
    const concepts = matchAliases(['memory', 'memories']);
    const unique = new Set(concepts);
    expect(unique.size).toBe(concepts.length);
    expect(concepts.filter((c) => c === 'memory').length).toBe(1);
  });

  it('caps at MAX_CONCEPTS_PER_QUERY', () => {
    // Provide many tokens that all match different concepts
    const manyTokens = Object.keys(BUILTIN_CONCEPT_ALIASES).slice(0, 20);
    const concepts = matchAliases(manyTokens);
    expect(concepts.length).toBeLessThanOrEqual(MAX_CONCEPTS_PER_QUERY);
  });
});

// ───────────────────────────────────────────────────────────────
// routeQueryConcepts()
// ───────────────────────────────────────────────────────────────

describe('routeQueryConcepts()', () => {
  it('returns graphActivated: false for a query with no matching concepts', () => {
    const result = routeQueryConcepts('completely unrelated nonsense zebra unicorn');
    expect(result.graphActivated).toBe(false);
    expect(result.concepts).toEqual([]);
  });

  it('activates graph for a query with known concept aliases', () => {
    const result = routeQueryConcepts('how does memory retrieval work');
    expect(result.graphActivated).toBe(true);
    expect(result.concepts.length).toBeGreaterThan(0);
  });

  it('includes "memory" concept for memory-related query', () => {
    const result = routeQueryConcepts('find memories related to the pipeline');
    expect(result.concepts).toContain('memory');
  });

  it('includes "embedding" concept for vector-related query', () => {
    const result = routeQueryConcepts('retrieve embeddings from the vector index');
    expect(result.concepts).toContain('embedding');
  });

  it('includes "graph" concept for graph-related query', () => {
    const result = routeQueryConcepts('traverse graph edges and nodes');
    expect(result.concepts).toContain('graph');
  });

  it('returns graphActivated: false for empty query', () => {
    const result = routeQueryConcepts('');
    expect(result.graphActivated).toBe(false);
    expect(result.concepts).toEqual([]);
  });

  it('works without a database (built-in aliases only)', () => {
    const result = routeQueryConcepts('memory retrieval pipeline');
    // Should not throw, should still match built-in aliases
    expect(typeof result.graphActivated).toBe('boolean');
    expect(Array.isArray(result.concepts)).toBe(true);
  });

  it('is stable (no throw) for unusual query strings', () => {
    // Unicode, very long query, special chars
    expect(() => routeQueryConcepts('こんにちは memory retrieval')).not.toThrow();
    expect(() => routeQueryConcepts('a'.repeat(1000))).not.toThrow();
    expect(() => routeQueryConcepts('!@#$%^&*()')).not.toThrow();
  });
});

// ───────────────────────────────────────────────────────────────
// Feature flag behavior (SPECKIT_GRAPH_CONCEPT_ROUTING)
// ───────────────────────────────────────────────────────────────

describe('feature flag: isGraphConceptRoutingEnabled()', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.SPECKIT_GRAPH_CONCEPT_ROUTING;
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.SPECKIT_GRAPH_CONCEPT_ROUTING;
    } else {
      process.env.SPECKIT_GRAPH_CONCEPT_ROUTING = originalEnv;
    }
  });

  it('is enabled by default (graduated — no env var set)', async () => {
    delete process.env.SPECKIT_GRAPH_CONCEPT_ROUTING;
    const { isGraphConceptRoutingEnabled } = await import('../lib/search/search-flags');
    expect(isGraphConceptRoutingEnabled()).toBe(true);
  });

  it('is enabled when env var is "true"', async () => {
    process.env.SPECKIT_GRAPH_CONCEPT_ROUTING = 'true';
    const { isGraphConceptRoutingEnabled } = await import('../lib/search/search-flags');
    expect(isGraphConceptRoutingEnabled()).toBe(true);
  });

  it('is disabled when env var is "false"', async () => {
    process.env.SPECKIT_GRAPH_CONCEPT_ROUTING = 'false';
    const { isGraphConceptRoutingEnabled } = await import('../lib/search/search-flags');
    expect(isGraphConceptRoutingEnabled()).toBe(false);
  });

  it('routeQueryConcepts() still works regardless of flag (flag checked by caller)', () => {
    // routeQueryConcepts is a pure function — the flag gates its call in stage1
    const result = routeQueryConcepts('memory retrieval pipeline search');
    expect(typeof result.graphActivated).toBe('boolean');
  });
});
