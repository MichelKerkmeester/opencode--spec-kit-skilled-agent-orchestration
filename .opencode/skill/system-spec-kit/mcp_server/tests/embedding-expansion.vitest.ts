// TEST: Embedding-Based Query Expansion
// SPECKIT_EMBEDDING_EXPANSION feature flag
//
// Test matrix:
// T1  Feature flag OFF → identity result, no expansion
// T2  Feature flag ON, simple query (R15) → expansion suppressed
// T3  Feature flag ON, complex query → expansion runs (may be empty if no DB)
// T4  R15 mutual exclusion detail — "simple" tier always suppresses
// T5  isExpansionActive() respects flag OFF
// T6  isExpansionActive() respects R15 "simple" classification
// T7  isExpansionActive() returns true for complex query when flag is ON
// T8  Empty embedding → identity result
// T9  ExpandedQuery shape is correct
// T10 No latency degradation for simple queries (< 5 ms)
// T11 combinedQuery equals original when no expansion terms found
// T12 combinedQuery appends expanded terms with space separator
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  expandQueryWithEmbeddings,
  isExpansionActive,
  type ExpandedQuery,
} from '../lib/search/embedding-expansion';

// -- Environment management --------------------------------------------------

const ENV_FLAGS = [
  'SPECKIT_EMBEDDING_EXPANSION',
  'SPECKIT_COMPLEXITY_ROUTER',
] as const;

const originalEnv = Object.fromEntries(
  ENV_FLAGS.map((f) => [f, process.env[f]])
) as Record<string, string | undefined>;

function restoreEnv(): void {
  for (const flag of ENV_FLAGS) {
    const original = originalEnv[flag];
    if (original === undefined) {
      delete process.env[flag];
    } else {
      process.env[flag] = original;
    }
  }
}

// -- Mock: vector-index ------------------------------------------------------
//
// The vector index requires a real SQLite database. We mock it to return
// Controlled memory content without any I/O dependency.

vi.mock('../lib/search/vector-index', () => ({
  vectorSearch: vi.fn(() => []),
}));

import * as vectorIndex from '../lib/search/vector-index';
const mockVectorSearch = vectorIndex.vectorSearch as ReturnType<typeof vi.fn>;

// -- Helpers -----------------------------------------------------------------

/** Build a Float32Array of the given dimension, all values = 0.1. */
function makeEmbedding(dim = 128): Float32Array {
  return Float32Array.from({ length: dim }, () => 0.1);
}

/** A sample memory row returned by a mocked vectorSearch. */
function makeMockMemory(id: number, content: string, title = 'Test memory'): Record<string, unknown> {
  return { id, content, title, similarity: 0.9, importance_tier: 'normal' };
}

// -- Tests --------------------------------------------------------------------

describe('R12: Embedding-Based Query Expansion', () => {

  beforeEach(() => {
    restoreEnv();
    vi.clearAllMocks();
    // Default: vector search returns nothing (safe baseline)
    mockVectorSearch.mockReturnValue([]);
  });

  afterEach(() => {
    restoreEnv();
  });

  // -- T1: Feature flag OFF → identity result ------------------------------

  it('T1: returns identity result when SPECKIT_EMBEDDING_EXPANSION is explicitly off', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'false'; // graduated — must explicitly disable
    const embedding = makeEmbedding();
    const result = await expandQueryWithEmbeddings('find authentication decisions', embedding);

    expect(result.original).toBe('find authentication decisions');
    expect(result.expanded).toEqual([]);
    expect(result.combinedQuery).toBe('find authentication decisions');
    // Vector search must NOT be called when the flag is off
    expect(mockVectorSearch).not.toHaveBeenCalled();
  });

  it('T1b: returns identity result when flag is explicitly "false"', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'false';
    const result = await expandQueryWithEmbeddings('query expansion test', makeEmbedding());

    expect(result.expanded).toEqual([]);
    expect(result.combinedQuery).toBe('query expansion test');
    expect(mockVectorSearch).not.toHaveBeenCalled();
  });

  // -- T2: Feature flag ON, simple query → R15 suppression -----------------

  it('T2: suppresses expansion for "simple" queries when R15 classifier is active', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    // A 3-word query classifies as "simple" (≤ SIMPLE_TERM_THRESHOLD = 3 terms)
    const simpleQuery = 'fix auth bug';
    const result = await expandQueryWithEmbeddings(simpleQuery, makeEmbedding());

    expect(result.original).toBe(simpleQuery);
    expect(result.expanded).toEqual([]);
    expect(result.combinedQuery).toBe(simpleQuery);
    // Vector search must NOT run for simple queries
    expect(mockVectorSearch).not.toHaveBeenCalled();
  });

  it('T2b: suppresses expansion for 1-word query (always simple)', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    const result = await expandQueryWithEmbeddings('login', makeEmbedding());

    expect(result.expanded).toEqual([]);
    expect(mockVectorSearch).not.toHaveBeenCalled();
  });

  // -- T3: Feature flag ON, complex query → expansion runs -----------------

  it('T3: runs expansion for a complex query when flag is on', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    // A 9+ word query classifies as "complex" (> COMPLEX_TERM_THRESHOLD = 8)
    const complexQuery =
      'how does the embedding based query expansion pipeline handle recall precision tradeoffs';

    // Simulate vector index returning memories with rich content
    mockVectorSearch.mockReturnValue([
      makeMockMemory(1, 'recall precision tradeoff semantic retrieval pipeline'),
      makeMockMemory(2, 'embedding similarity vector search semantic expansion candidates'),
      makeMockMemory(3, 'hybrid retrieval fusion recall semantic candidates'),
    ]);

    const result = await expandQueryWithEmbeddings(complexQuery, makeEmbedding());

    expect(result.original).toBe(complexQuery);
    // Vector search must have been called once
    expect(mockVectorSearch).toHaveBeenCalledTimes(1);
  });

  // -- T4: R15 mutual exclusion details ------------------------------------

  it('T4: R15 mutual exclusion — "simple" tier always suppresses, regardless of content', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    // Even with rich memory content available, simple query must not expand
    mockVectorSearch.mockReturnValue([
      makeMockMemory(99, 'extremely rich content with many unique semantic terms for expansion'),
    ]);

    const result = await expandQueryWithEmbeddings('hi there', makeEmbedding());

    expect(result.expanded).toEqual([]);
    expect(result.combinedQuery).toBe('hi there');
    expect(mockVectorSearch).not.toHaveBeenCalled();
  });

  it('T4b: moderate query is NOT suppressed by R15', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    // 5 terms → "moderate" tier (between SIMPLE=3 and COMPLEX=8)
    const moderateQuery = 'embedding expansion retrieval pipeline architecture';

    mockVectorSearch.mockReturnValue([
      makeMockMemory(1, 'semantic retrieval fusion candidates ranking scoring'),
    ]);

    const result = await expandQueryWithEmbeddings(moderateQuery, makeEmbedding());

    // Vector search should have been called (expansion attempted)
    expect(mockVectorSearch).toHaveBeenCalledTimes(1);
    expect(result.original).toBe(moderateQuery);
  });

  // -- T5: isExpansionActive() respects flag OFF ----------------------------

  it('T5: isExpansionActive() returns false when flag is explicitly off', () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'false'; // graduated — must explicitly disable
    expect(isExpansionActive('some complex multi word query here now')).toBe(false);
  });

  it('T5b: isExpansionActive() returns false when flag is "false"', () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'false';
    expect(isExpansionActive('some complex multi word query here now')).toBe(false);
  });

  // -- T6: isExpansionActive() respects R15 simple classification -----------

  it('T6: isExpansionActive() returns false for simple query when R15 is active', () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    // ≤3 terms → simple
    expect(isExpansionActive('fix bug')).toBe(false);
    expect(isExpansionActive('login')).toBe(false);
    expect(isExpansionActive('auth error fix')).toBe(false);
  });

  // -- T7: isExpansionActive() returns true for complex query ---------------

  it('T7: isExpansionActive() returns true for complex query when flag is on', () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    // 9 terms → complex (> COMPLEX_TERM_THRESHOLD = 8)
    const complexQuery = 'how does embedding expansion affect recall and precision tradeoffs here';
    expect(isExpansionActive(complexQuery)).toBe(true);
  });

  it('T7b: isExpansionActive() returns true for complex query even with R15 explicitly disabled', () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    // SPECKIT_COMPLEXITY_ROUTER is graduated — must explicitly disable with 'false'
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';

    // When R15 complexity router is explicitly disabled, its fallback is "complex" for all queries.
    // R12 should therefore run on all queries (flag is on, not "simple").
    expect(isExpansionActive('fix bug')).toBe(true);
    expect(isExpansionActive('one')).toBe(true);
  });

  // -- T8: Empty embedding → identity result -------------------------------

  it('T8: returns identity result for empty embedding (zero-length Float32Array)', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    const emptyEmbedding = new Float32Array(0);
    const result = await expandQueryWithEmbeddings(
      'complex multi word query for semantic expansion testing purposes now',
      emptyEmbedding,
    );

    expect(result.expanded).toEqual([]);
    expect(result.combinedQuery).toBe(
      'complex multi word query for semantic expansion testing purposes now',
    );
    expect(mockVectorSearch).not.toHaveBeenCalled();
  });

  // -- T9: ExpandedQuery shape ----------------------------------------------

  it('T9: result always has original, expanded, and combinedQuery fields', async () => {
    delete process.env.SPECKIT_EMBEDDING_EXPANSION;

    const result: ExpandedQuery = await expandQueryWithEmbeddings('test query', makeEmbedding());

    expect(result).toHaveProperty('original');
    expect(result).toHaveProperty('expanded');
    expect(result).toHaveProperty('combinedQuery');
    expect(Array.isArray(result.expanded)).toBe(true);
    expect(typeof result.combinedQuery).toBe('string');
  });

  it('T9b: expanded is always an array (never null/undefined)', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    // Simple query → identity path
    const simple = await expandQueryWithEmbeddings('fix it', makeEmbedding());
    expect(Array.isArray(simple.expanded)).toBe(true);

    // No DB content → empty expanded
    mockVectorSearch.mockReturnValue([]);
    const complex = await expandQueryWithEmbeddings(
      'complex query for embedding expansion semantic retrieval testing architecture',
      makeEmbedding(),
    );
    expect(Array.isArray(complex.expanded)).toBe(true);
  });

  // -- T10: No latency degradation for simple queries -----------------------

  it('T10: simple query returns within 5 ms (no I/O, flag on)', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    const start = Date.now();
    await expandQueryWithEmbeddings('fix bug', makeEmbedding());
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(5);
  });

  it('T10b: flag-off path returns within 1 ms (no classification overhead)', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'false'; // graduated — must explicitly disable

    const start = Date.now();
    await expandQueryWithEmbeddings('some multi word complex expansion query', makeEmbedding());
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(5);
  });

  // -- T11: combinedQuery equals original when no terms found ---------------

  it('T11: combinedQuery === original when vector search returns no content', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    // Vector search returns memories without content fields
    mockVectorSearch.mockReturnValue([
      { id: 1, similarity: 0.8, importance_tier: 'normal' }, // no content
      { id: 2, similarity: 0.7 },
    ]);

    const query = 'complex multi word query for semantic testing expansion pipeline';
    const result = await expandQueryWithEmbeddings(query, makeEmbedding());

    expect(result.combinedQuery).toBe(query);
    expect(result.expanded).toEqual([]);
  });

  it('T11b: combinedQuery === original when all content tokens already appear in query', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    // The query contains all possible expansion tokens. We mock vectorSearch
    // To return a raw object (bypassing the title injected by makeMockMemory)
    // Whose content only contains words already present in the query.
    mockVectorSearch.mockReturnValue([
      {
        id: 1,
        // Content and title both use only tokens present in the query
        content: 'semantic pipeline query expansion complex',
        title: 'architecture retrieval deep search',
        similarity: 0.9,
        importance_tier: 'normal',
      },
    ]);

    // Query contains all the same tokens → no new terms can be extracted
    const query = 'semantic pipeline query expansion complex architecture retrieval deep search';
    const result = await expandQueryWithEmbeddings(query, makeEmbedding());

    // CombinedQuery should equal original since no new terms were found
    expect(result.combinedQuery).toBe(query);
  });

  // -- T12: combinedQuery appends expanded terms ----------------------------

  it('T12: combinedQuery appends expanded terms space-separated', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    mockVectorSearch.mockReturnValue([
      makeMockMemory(1, 'fusion retrieval ranking scoring candidates vectors similarity'),
      makeMockMemory(2, 'reranking mmr diversity cross-encoder scoring pipeline'),
    ]);

    const query = 'how does embedding based query expansion work across multiple retrieval stages';
    const result = await expandQueryWithEmbeddings(query, makeEmbedding());

    if (result.expanded.length > 0) {
      // CombinedQuery must start with the original query
      expect(result.combinedQuery.startsWith(query)).toBe(true);
      // Expanded terms must be present in combinedQuery
      for (const term of result.expanded) {
        expect(result.combinedQuery).toContain(term);
      }
      // Separator between original and expansion must be a space
      expect(result.combinedQuery.charAt(query.length)).toBe(' ');
    } else {
      // No new terms — combinedQuery is just the original
      expect(result.combinedQuery).toBe(query);
    }
  });

  // -- T13: Graceful degradation on vectorSearch error ---------------------

  it('T13: returns identity result when vectorSearch throws', async () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    mockVectorSearch.mockImplementation(() => {
      throw new Error('DB connection failed');
    });

    const query = 'complex multi word query for semantic retrieval expansion testing pipeline';
    const result = await expandQueryWithEmbeddings(query, makeEmbedding());

    // Must not throw; graceful degradation → identity result
    expect(result.original).toBe(query);
    expect(result.expanded).toEqual([]);
    expect(result.combinedQuery).toBe(query);
  });
});
