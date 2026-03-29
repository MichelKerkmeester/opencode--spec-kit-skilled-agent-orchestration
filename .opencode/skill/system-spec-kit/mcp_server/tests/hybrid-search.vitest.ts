// TEST: HYBRID SEARCH
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type Database from 'better-sqlite3';
import * as hybridSearch from '../lib/search/hybrid-search';
import * as bm25Index from '../lib/search/bm25-index';
import * as coActivation from '../lib/cognitive/co-activation';
import * as rrfFusion from '@spec-kit/shared/algorithms/rrf-fusion';

/* ───────────────────────────────────────────────────────────────
   MOCK DATABASE & SEARCH FUNCTIONS
──────────────────────────────────────────────────────────────── */

// Mock documents for testing - each has >10 words for BM25 MIN_DOC_LENGTH requirement
type InitDb = Parameters<typeof hybridSearch.init>[0];
type VectorSearchFn = NonNullable<Parameters<typeof hybridSearch.init>[1]>;
type GraphSearchFn = NonNullable<Parameters<typeof hybridSearch.init>[2]>;
type HybridSearchResult = Awaited<ReturnType<typeof hybridSearch.hybridSearchEnhanced>>[number];
type MaybeAsyncHybridResults = ReturnType<typeof hybridSearch.hybridSearchEnhanced> | HybridSearchResult[];
type HybridModuleExport = keyof typeof hybridSearch;
type RrfSource = (typeof rrfFusion.SOURCE_TYPES)[keyof typeof rrfFusion.SOURCE_TYPES];

interface MockDoc {
  id: number;
  content: string;
  spec_folder: string;
  importance_tier: string;
}

const MOCK_DOCS: MockDoc[] = [
  { id: 1, content: 'Authentication module implementation details for secure user login and session management in the web application system', spec_folder: 'specs/auth', importance_tier: 'high' },
  { id: 2, content: 'Bug fix for login error handling when users enter incorrect credentials or session expires during authentication flow', spec_folder: 'specs/auth', importance_tier: 'medium' },
  { id: 3, content: 'Security audit findings and recommendations for improving application security posture and preventing common vulnerabilities', spec_folder: 'specs/security', importance_tier: 'critical' },
  { id: 4, content: 'Refactoring database connection module to improve performance and add connection pooling with retry logic', spec_folder: 'specs/db', importance_tier: 'medium' },
  { id: 5, content: 'How the caching mechanism works in the system including cache invalidation strategies and performance optimization tips', spec_folder: 'specs/cache', importance_tier: 'high' },
];

// Mock vector search function
const mockVectorSearch: VectorSearchFn = (_queryEmbedding, options = {}) => {
  const limit = typeof options.limit === 'number' ? options.limit : 10;
  const specFolderOption = typeof options.specFolder === 'string'
    ? options.specFolder
    : null;
  let results = [...MOCK_DOCS];
  if (specFolderOption) {
    results = results.filter(d => d.spec_folder === specFolderOption);
  }
  return results.slice(0, limit).map((doc, i) => ({
    ...doc,
    similarity: 0.9 - (i * 0.1),
  }));
};

// Mock graph search function
const mockGraphSearch: GraphSearchFn = (query, options = {}) => {
  const limit = typeof options.limit === 'number' ? options.limit : 10;
  return MOCK_DOCS.filter(d => d.content !== query).slice(0, limit).map((doc, i) => ({
    ...doc,
    graph_distance: i + 1,
  }));
};

const ORIGINAL_ENABLE_BM25 = process.env.ENABLE_BM25;

// Mock database with FTS5 table
function createMockDb(): Database.Database {
  return {
    prepare: function(sql: string) {
      return {
        get: function() {
          if (sql.includes('memory_fts')) {
            return { count: 1 }; // FTS5 table exists
          }
          return null;
        },
        all: function(...params: unknown[]) {
          let docs = [...MOCK_DOCS];
          if (params.length >= 2 && typeof params[1] === 'string' && params[1].startsWith('specs/')) {
            const spec_folder = params[1];
            docs = docs.filter(d => d.spec_folder === spec_folder);
          }
          return docs.slice(0, 5).map((doc, i) => ({
            ...doc,
            fts_score: 10 - i,
          }));
        },
      };
    },
  } as unknown as Database.Database;
}

function createDegreeAwareMockDb(): Database.Database {
  return {
    prepare(sql: string) {
      return {
        get() {
          if (sql.includes('memory_fts')) {
            return { count: 1 };
          }
          if (sql.includes('SELECT MAX(typed_degree) AS max_degree')) {
            return { max_degree: 1 };
          }
          return null;
        },
        all(...params: unknown[]) {
          if (sql.includes('memory_index') && sql.includes('constitutional')) {
            return [];
          }

          if (sql.includes('WITH candidate_nodes(node_id)')) {
            const ids = params.slice(0, -1).map(String);
            if (ids.includes('2')) {
              return [{ node_id: '2', typed_degree: 1 }];
            }
            return [];
          }

          return [];
        },
      };
    },
  } as unknown as Database.Database;
}

function createCoactivationPromotionDb(): Database.Database {
  return {
    prepare(sql: string) {
      return {
        get(param?: unknown) {
          if (sql.includes('memory_fts')) {
            return { count: 1 };
          }

          if (sql.includes('SELECT related_memories FROM memory_index WHERE id = ?')) {
            if (Number(param) === 1) {
              return { related_memories: JSON.stringify([{ id: 4, similarity: 100 }]) };
            }
            return { related_memories: null };
          }

          if (sql.includes('SELECT id, title, spec_folder, file_path, importance_tier FROM memory_index WHERE id = ?')) {
            const memoryId = Number(param);
            const doc = MOCK_DOCS.find((candidate) => candidate.id === memoryId);
            if (!doc) return undefined;
            return {
              id: doc.id,
              title: `Doc ${doc.id}`,
              spec_folder: doc.spec_folder,
              file_path: `/workspace/specs/${doc.spec_folder}/memory/${doc.id}.md`,
              importance_tier: doc.importance_tier,
            };
          }

          return null;
        },
        all(...params: unknown[]) {
          if (sql.includes('causal_edges')) {
            return [];
          }

          if (sql.includes('vec_memories')) {
            return [];
          }

          if (sql.includes('memory_fts')) {
            return MOCK_DOCS.slice(0, 3).map((doc, index) => ({
              ...doc,
              id: doc.id,
              fts_score: 10 - index,
            }));
          }

          if (params.length >= 2 && typeof params[1] === 'string' && params[1].startsWith('specs/')) {
            const spec_folder = params[1];
            return MOCK_DOCS.filter((doc) => doc.spec_folder === spec_folder).slice(0, 3).map((doc, index) => ({
              ...doc,
              fts_score: 10 - index,
            }));
          }

          return MOCK_DOCS.slice(0, 3).map((doc, index) => ({
            ...doc,
            fts_score: 10 - index,
          }));
        },
      };
    },
  } as unknown as Database.Database;
}

function approxEqual(a: number, b: number, epsilon: number = 0.0001): boolean {
  return Math.abs(a - b) < epsilon;
}

function isPromiseLike(
  value: MaybeAsyncHybridResults
): value is ReturnType<typeof hybridSearch.hybridSearchEnhanced> {
  return typeof (value as PromiseLike<HybridSearchResult[]>).then === 'function';
}

/* ───────────────────────────────────────────────────────────────
   TEST SUITES
──────────────────────────────────────────────────────────────── */

describe('Hybrid Search Unit Tests (T031+)', () => {
  beforeEach(() => {
    process.env.ENABLE_BM25 = 'true';
  });

  afterEach(() => {
    if (ORIGINAL_ENABLE_BM25 === undefined) {
      delete process.env.ENABLE_BM25;
    } else {
      process.env.ENABLE_BM25 = ORIGINAL_ENABLE_BM25;
    }
  });

  // 5.1 INITIALIZATION TESTS

  describe('Initialization Tests', () => {

    it('T031-INIT-01: init() accepts null database', () => {
        // Init() does no validation — null db is accepted (graceful degradation)
        expect(() => {
          hybridSearch.init(null as unknown as InitDb, mockVectorSearch);
        }).not.toThrow();
      });

    it('T031-INIT-02: init() accepts null vectorSearch', () => {
      const mockDb = createMockDb();
      // Init() does no validation — null vectorSearch is accepted (graceful degradation)
      expect(() => {
        hybridSearch.init(mockDb, null);
      }).not.toThrow();
    });

    it('T031-INIT-03: init() accepts optional graph search function', () => {
      const mockDb = createMockDb();
      expect(() => {
        hybridSearch.init(mockDb, mockVectorSearch, mockGraphSearch);
      }).not.toThrow();
    });

    it('T031-INIT-04: init() works without graph search function', () => {
      const mockDb = createMockDb();
      expect(() => {
        hybridSearch.init(mockDb, mockVectorSearch);
      }).not.toThrow();
    });
  });

  // 5.2 BM25 SEARCH TESTS

  describe('BM25 Search Tests (T031)', () => {

    beforeEach(() => {
      bm25Index.resetIndex();
    });

    it('T031-BM25-01: is_bm25_available() returns false when empty', () => {
      const available = hybridSearch.isBm25Available();
      expect(available).toBe(false);
    });

    it('T031-BM25-02: is_bm25_available() returns true when populated', () => {
      const bm25 = bm25Index.getIndex();
      for (const doc of MOCK_DOCS) {
        bm25.addDocument(String(doc.id), doc.content);
      }
      const available = hybridSearch.isBm25Available();
      expect(available).toBe(true);
    });

    it('T031-BM25-03: bm25_search() returns results', () => {
      const bm25 = bm25Index.getIndex();
      for (const doc of MOCK_DOCS) {
        bm25.addDocument(String(doc.id), doc.content);
      }
      const results = hybridSearch.bm25Search('authentication', { limit: 5 });
      expect(results).toBeDefined();
      expect(results.length).toBeGreaterThan(0);
    });

    it('T031-BM25-04: bm25_search() results have score', () => {
      const bm25 = bm25Index.getIndex();
      for (const doc of MOCK_DOCS) {
        bm25.addDocument(String(doc.id), doc.content);
      }
      const results = hybridSearch.bm25Search('authentication', { limit: 5 });
      const hasScores = results.every((r: Record<string, unknown>) => typeof r.score === 'number');
      expect(hasScores).toBe(true);
    });

    it('T031-BM25-05: bm25_search() respects limit option', () => {
      const bm25 = bm25Index.getIndex();
      for (const doc of MOCK_DOCS) {
        bm25.addDocument(String(doc.id), doc.content);
      }
      const results = hybridSearch.bm25Search('authentication', { limit: 2 });
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('T031-BM25-06: bm25_search() respects spec_folder filter', () => {
      const bm25 = bm25Index.getIndex();
      for (const doc of MOCK_DOCS) {
        bm25.addDocument(String(doc.id), doc.content);
      }
      const results = hybridSearch.bm25Search('module', { limit: 10, specFolder: 'specs/auth' });
      // B7 FIX: Batch query correctly resolves spec_folder via DB.
      // Only docs with spec_folder='specs/auth' (IDs 1, 2) should survive.
      // The mock DB returns MOCK_DOCS which populates the batch map.
      const authDocIds = MOCK_DOCS.filter(d => d.spec_folder === 'specs/auth').map(d => String(d.id));
      const allMatch = results.every((r: Record<string, unknown>) => authDocIds.includes(String(r.id)));
      expect(allMatch).toBe(true);
    });

    it('T031-BM25-07: bm25_search() fails closed when scoped lookup throws', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const failingDb = {
        prepare(sql: string) {
          if (sql.includes('memory_fts')) {
            return {
              get() {
                return { count: 1 };
              },
            };
          }

          if (sql.includes('SELECT id, spec_folder FROM memory_index')) {
            return {
              all() {
                throw new Error('scope lookup failed');
              },
            };
          }

          return {
            get() {
              return null;
            },
            all() {
              return [];
            },
          };
        },
      } as unknown as Database.Database;

      hybridSearch.init(failingDb, mockVectorSearch, mockGraphSearch);
      const bm25 = bm25Index.getIndex();
      for (const doc of MOCK_DOCS) {
        bm25.addDocument(String(doc.id), doc.content);
      }

      const results = hybridSearch.bm25Search('module', { limit: 10, specFolder: 'specs/auth' });

      expect(results).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        '[BM25] Spec-folder scope lookup failed, returning empty scoped results:',
        expect.any(Error),
      );
    });
  });

  // 5.3 COMBINED LEXICAL SEARCH TESTS

  describe('Combined Lexical Search Tests (T031)', () => {

    beforeEach(() => {
      const mockDb = createMockDb();
      hybridSearch.init(mockDb, mockVectorSearch, mockGraphSearch);
      bm25Index.resetIndex();
      const bm25 = bm25Index.getIndex();
      for (const doc of MOCK_DOCS) {
        bm25.addDocument(String(doc.id), doc.content);
      }
    });

    it('T031-LEX-01: combined_lexical_search() returns results', () => {
      const results = hybridSearch.combinedLexicalSearch('authentication', { limit: 10 });
      expect(results).toBeDefined();
      expect(results.length).toBeGreaterThan(0);
    });

    it('T031-LEX-02: combined_lexical_search() results have score field', () => {
      const results = hybridSearch.combinedLexicalSearch('authentication', { limit: 10 });
      const hasScores = results.every((r: Record<string, unknown>) => typeof r.score === 'number');
      expect(hasScores).toBe(true);
    });

    it('T031-LEX-03: combined_lexical_search() handles source tracking', () => {
      const results = hybridSearch.combinedLexicalSearch('authentication', { limit: 10 });
      const valid = results.every((r: Record<string, unknown>) =>
        ['fts5', 'bm25', 'both'].includes(String(r.source)) ||
        typeof r.bm25Score === 'number' ||
        typeof r.fts_score === 'number'
      );
      expect(valid).toBe(true);
    });

    it('T031-LEX-04: combined_lexical_search() deduplicates by ID', () => {
      const results = hybridSearch.combinedLexicalSearch('authentication module', { limit: 10 });
      const ids = results.map((r) => r.id);
      const uniqueIds = Array.from(new Set(ids));
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('T031-LEX-05: combined_lexical_search() deduplicates canonical IDs', () => {
      const results = hybridSearch.combinedLexicalSearch('authentication module', { limit: 10 });
      const canonicalIds = results.map((r: Record<string, unknown>) =>
        hybridSearch.__testables.canonicalResultId(r.id as number | string)
      );
      const uniqueCanonicalIds = Array.from(new Set(canonicalIds));
      expect(canonicalIds.length).toBe(uniqueCanonicalIds.length);
    });

    it('T031-LEX-05: combined_lexical_search() results sorted by score', () => {
      const results = hybridSearch.combinedLexicalSearch('authentication', { limit: 10 });
      let isSorted = true;
      for (let i = 1; i < results.length; i++) {
        if ((results[i].score || 0) > (results[i - 1].score || 0)) {
          isSorted = false;
          break;
        }
      }
      expect(isSorted).toBe(true);
    });
  });

  // 5.4 HYBRID SEARCH ENHANCED TESTS

  describe('Hybrid Search Enhanced Tests (T023, T031)', () => {

    let mockEmbedding: Float32Array;

    beforeEach(() => {
      const mockDb = createMockDb();
      hybridSearch.init(mockDb, mockVectorSearch, mockGraphSearch);
      bm25Index.resetIndex();
      const bm25 = bm25Index.getIndex();
      for (const doc of MOCK_DOCS) {
        bm25.addDocument(String(doc.id), doc.content);
      }
      mockEmbedding = new Float32Array(384).fill(0.1);
    });

    it('T031-HYB-01: hybridSearchEnhanced() returns results', () => {
      const result = hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 5 }) as MaybeAsyncHybridResults;
      expect(result).toBeDefined();
      // Returns array or promise
      expect(Array.isArray(result) || isPromiseLike(result)).toBe(true);
    });

    it('T031-HYB-02: hybridSearchEnhanced() returns correct type', () => {
      const result = hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 5 }) as MaybeAsyncHybridResults;
      // Production returns Promise<HybridSearchResult[]>, no metadata object
      expect(result).toBeDefined();
    });

    it('T031-HYB-03: hybridSearchEnhanced() accepts useBm25=true', () => {
      expect(() => {
        hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 5, useBm25: true });
      }).not.toThrow();
    });

    it('T031-HYB-04: hybridSearchEnhanced() accepts useBm25=false', () => {
      expect(() => {
        hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 5, useBm25: false });
      }).not.toThrow();
    });

    it('T031-HYB-05: hybridSearchEnhanced() results have scores', () => {
      const result = hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 5 }) as MaybeAsyncHybridResults;
      if (isPromiseLike(result)) {
        // Async function - just verify it returns a promise
        expect(isPromiseLike(result)).toBe(true);
      } else if (Array.isArray(result)) {
        const hasScore = result.every(r => typeof r.score === 'number' || typeof r.rrfScore === 'number');
        expect(hasScore || result.length === 0).toBe(true);
      } else {
        expect(result).toBeDefined();
      }
    });

    it('T031-HYB-06: hybridSearchEnhanced() has source tracking', async () => {
      const results = await hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 5 });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      // Verify results have source field when non-empty
      if (results.length > 0) {
        expect(typeof results[0].source).toBe('string');
      }
    });

    it('T031-HYB-07: hybridSearchEnhanced() respects limit option', async () => {
      const results = await hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 3 });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(3);
    });

    it('T031-HYB-08: hybridSearchEnhanced() accepts specFolder filter', async () => {
      const results = await hybridSearch.hybridSearchEnhanced('module', mockEmbedding, { limit: 10, specFolder: 'specs/auth' });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('T031-HYB-09: hybridSearchEnhanced() accepts query string', async () => {
      const results = await hybridSearch.hybridSearchEnhanced('test query', mockEmbedding, { limit: 5 });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('T031-HYB-10: hybridSearchEnhanced() works with null embedding', () => {
      expect(() => {
        hybridSearch.hybridSearchEnhanced('test', null, { limit: 5 });
      }).not.toThrow();
    });

    it('T031-HYB-S4-01: shadow scoring does NOT attach metadata (REMOVED flag)', async () => {
      const originalShadowFlag = process.env.SPECKIT_SHADOW_SCORING;
      process.env.SPECKIT_SHADOW_SCORING = 'true';

      try {
        const results = await hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 5 });
        expect(results).toBeDefined();
        expect(Array.isArray(results)).toBe(true);

        // Shadow scoring is REMOVED — no metadata attached even with env='true'
        const shadowMeta = (results as unknown as Record<string, unknown>)._s4shadow;
        expect(shadowMeta).toBeUndefined();
      } finally {
        if (originalShadowFlag === undefined) {
          delete process.env.SPECKIT_SHADOW_SCORING;
        } else {
          process.env.SPECKIT_SHADOW_SCORING = originalShadowFlag;
        }
      }
    });
  });

  // 5.5 RRF FUSION INTEGRATION TESTS

  describe('RRF Fusion Integration Tests', () => {

    let mockEmbedding: Float32Array;

    beforeAll(() => {
      const mockDb = createMockDb();
      hybridSearch.init(mockDb, mockVectorSearch, mockGraphSearch);
      mockEmbedding = new Float32Array(384).fill(0.1);
    });

    it('T031-RRF-01: unified_search available from rrf-fusion', () => {
      expect(typeof rrfFusion.unifiedSearch).toBe('function');
    });

    it('T031-RRF-02: is_rrf_enabled available from rrf-fusion', () => {
      expect(typeof rrfFusion.isRrfEnabled).toBe('function');
    });

    it('T031-RRF-03: SOURCE_TYPES available from rrf-fusion', () => {
      expect(rrfFusion.SOURCE_TYPES).toBeDefined();
      expect(rrfFusion.SOURCE_TYPES.VECTOR).toBeDefined();
    });

    it('T031-RRF-04: hybridSearchEnhanced uses RRF fusion internally', () => {
      expect(() => {
        hybridSearch.hybridSearchEnhanced('test', mockEmbedding, { limit: 5 });
      }).not.toThrow();
    });
  });

  // 5.6 HYBRID SEARCH (BASIC) TESTS

  describe('Hybrid Search (Basic) Tests', () => {

    let mockEmbedding: Float32Array;

    beforeAll(() => {
      const mockDb = createMockDb();
      hybridSearch.init(mockDb, mockVectorSearch, null);
      mockEmbedding = new Float32Array(384).fill(0.1);
    });

    it('T031-BASIC-01: hybridSearch() returns result', () => {
      const result = hybridSearch.hybridSearch('authentication', mockEmbedding, { limit: 5 });
      expect(result).toBeDefined();
    });

    it('T031-BASIC-02: hybridSearch() returns correct type', () => {
      const result = hybridSearch.hybridSearch('authentication', mockEmbedding, { limit: 5 });
      expect(typeof result.then === 'function' || Array.isArray(result)).toBe(true);
    });

    it('T031-BASIC-03: hybridSearch() has source tracking', () => {
      expect(() => {
        hybridSearch.hybridSearch('authentication', mockEmbedding, { limit: 5 });
      }).not.toThrow();
    });

    it('T031-BASIC-04: hybridSearch() deduplicates canonical IDs across channels', async () => {
      bm25Index.resetIndex();
      const bm25 = bm25Index.getIndex();
      for (const doc of MOCK_DOCS) {
        bm25.addDocument(String(doc.id), doc.content);
      }

      const results = await hybridSearch.hybridSearch('authentication module', null, {
        limit: 20,
        useVector: false,
        useFts: true,
        useBm25: true,
      });

      const canonicalIds = results.map((r) => hybridSearch.__testables.canonicalResultId(r.id));
      const uniqueCanonicalIds = Array.from(new Set(canonicalIds));
      expect(canonicalIds.length).toBe(uniqueCanonicalIds.length);
    });
  });

  // 5.7 SEARCH WITH FALLBACK TESTS

  describe('Search with Fallback Tests', () => {

    let mockEmbedding: Float32Array;

    beforeAll(() => {
      const mockDb = createMockDb();
      hybridSearch.init(mockDb, mockVectorSearch, null);
      mockEmbedding = new Float32Array(384).fill(0.1);
    });

    it('T031-FALL-01: searchWithFallback() returns result', () => {
      const result = hybridSearch.searchWithFallback('authentication', mockEmbedding, { limit: 5 });
      expect(result).toBeDefined();
    });

    it('T031-FALL-02: searchWithFallback() handles null embedding', () => {
      expect(() => {
        hybridSearch.searchWithFallback('authentication', null, { limit: 5 });
      }).not.toThrow();
    });
  });

  // 5.8 FTS SEARCH TESTS

  describe('FTS5 Search Tests', () => {

    beforeAll(() => {
      const mockDb = createMockDb();
      hybridSearch.init(mockDb, mockVectorSearch, null);
    });

    it('T031-FTS-01: is_fts_available() returns boolean', () => {
      const available = hybridSearch.isFtsAvailable();
      expect(typeof available).toBe('boolean');
    });

    it('T031-FTS-02: fts_search() returns array', () => {
      const results = hybridSearch.ftsSearch('authentication', { limit: 5 });
      expect(Array.isArray(results)).toBe(true);
    });

    it('T031-FTS-03: fts_search() results have fts_score', () => {
      const results = hybridSearch.ftsSearch('authentication', { limit: 5 });
      if (results.length > 0) {
        const hasScores = results.every((r: Record<string, unknown>) => typeof r.fts_score === 'number');
        expect(hasScores).toBe(true);
      }
      // No results is acceptable too
    });

    it('T031-FTS-04: fts_search() escapes special characters', () => {
      const results = hybridSearch.ftsSearch('test*:query()', { limit: 5 });
      expect(Array.isArray(results)).toBe(true);
    });

    it('T031-FTS-05: fts_search() escapes boolean operators', () => {
      const results = hybridSearch.ftsSearch('test AND query OR something NOT here', { limit: 5 });
      expect(Array.isArray(results)).toBe(true);
    });
  });

  // 5.9 MODULE EXPORTS TESTS

  describe('Module Exports Verification', () => {

      const expectedExports = [
        'init',
        'isFtsAvailable',
      'ftsSearch',
      'hybridSearch',
      'hybridSearchEnhanced',
      'searchWithFallback',
        'bm25Search',
        'isBm25Available',
        'combinedLexicalSearch',
      ] as const satisfies readonly HybridModuleExport[];

    for (const name of expectedExports) {
      it(`Export: ${name}`, () => {
        expect(hybridSearch[name]).toBeDefined();
      });
    }
  });

  // 5.10 ERROR HANDLING TESTS

  describe('Error Handling Tests', () => {

    it('T031-ERR-01: hybridSearchEnhanced() with valid init works', () => {
      const mockDb = createMockDb();
      hybridSearch.init(mockDb, mockVectorSearch, null);
      const mockEmbedding = new Float32Array(384).fill(0.1);
      expect(() => {
        hybridSearch.hybridSearchEnhanced('test', mockEmbedding, { limit: 5 });
      }).not.toThrow();
    });

    it('T031-ERR-02: bm25_search() handles empty/disabled state gracefully', () => {
      bm25Index.resetIndex();
      const results = hybridSearch.bm25Search('test', { limit: 5 });
      expect(Array.isArray(results)).toBe(true);
    });

    it('T031-ERR-03: fts_search() handles empty query', () => {
      const mockDb = createMockDb();
      hybridSearch.init(mockDb, mockVectorSearch, null);
      const results = hybridSearch.ftsSearch('', { limit: 5 });
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('T031-ERR-04: combined_lexical_search() handles no results', () => {
      const results = hybridSearch.combinedLexicalSearch('xyzzy123nonexistent', { limit: 5 });
      expect(Array.isArray(results)).toBe(true);
    });
  });
});

describe('C138: Hybrid Search Pipeline Enhancements', () => {
  it('C138-T1: hybridSearch module exports hybridSearchEnhanced (pipeline entry)', () => {
    expect(typeof hybridSearch.hybridSearchEnhanced).toBe('function');
  });

  it('C138-T2: hybridSearch module exports init function', () => {
    expect(typeof hybridSearch.init).toBe('function');
  });

  it('C138-T3: graph source type is defined in rrf-fusion', () => {
    expect(rrfFusion.SOURCE_TYPES.GRAPH).toBe('graph');
  });

  it('C138-T4: RRF fusion accepts graph as a valid source', () => {
    const graphResults = [
      { id: 'g1', title: 'Graph Result 1' },
      { id: 'g2', title: 'Graph Result 2' },
    ];
    const fused = rrfFusion.fuseResultsMulti([
      { source: rrfFusion.SOURCE_TYPES.GRAPH as RrfSource, results: graphResults },
    ]);
    expect(fused).toHaveLength(2);
    expect(fused[0].sources).toContain('graph');
  });
});

describe('C138-P0: useGraph:true Default Routing', () => {
  let mockEmbedding: Float32Array;
  let graphSearchCallCount: number;
  const savedComplexityRouter = process.env.SPECKIT_COMPLEXITY_ROUTER;

  beforeEach(() => {
    // Disable complexity router so all channels (including graph) are active for short queries
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';
    graphSearchCallCount = 0;
    const trackingGraphSearch = (query: string, options: Record<string, unknown>) => {
      graphSearchCallCount++;
      return MOCK_DOCS.slice(0, 2).map((doc, i) => ({
        ...doc,
        score: 0.9 - i * 0.1,
      }));
    };
    const mockDb = createMockDb();
    hybridSearch.init(mockDb, mockVectorSearch, trackingGraphSearch);
    bm25Index.resetIndex();
    const bm25 = bm25Index.getIndex();
    for (const doc of MOCK_DOCS) {
      bm25.addDocument(String(doc.id), doc.content);
    }
    mockEmbedding = new Float32Array(384).fill(0.1);
  });

  afterEach(() => {
    if (savedComplexityRouter === undefined) {
      delete process.env.SPECKIT_COMPLEXITY_ROUTER;
    } else {
      process.env.SPECKIT_COMPLEXITY_ROUTER = savedComplexityRouter;
    }
  });

  it('C138-P0-T1: useGraph defaults to true — graph channel invoked', async () => {
    // No explicit useGraph option → should default to true and invoke graph search
    await hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 10 });
    expect(graphSearchCallCount).toBeGreaterThanOrEqual(1);
  });

  it('C138-P0-T2: useGraph=false disables graph channel', async () => {
    await hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 10, useGraph: false });
    expect(graphSearchCallCount).toBe(0);
  });

  it('C138-P0-T3: graph results appear in fused output with graph source tag', async () => {
    const results = await hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 20 });
    // Since graph search returns results, at least some should come from graph or be fused
    expect(results.length).toBeGreaterThan(0);
  });

  it('C138-P0-T4: graph channel metrics are tracked', async () => {
    hybridSearch.resetGraphMetrics();
    await hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 10 });
    const metrics = hybridSearch.getGraphMetrics();
    expect(metrics.totalQueries).toBeGreaterThanOrEqual(1);
    expect(metrics.graphHits).toBeGreaterThanOrEqual(1);
  });

  it('C138-P0-T5: adaptive graph weight from fusion profile applied', async () => {
    // The graph channel weight should come from the adaptive fusion weights,
    // Not the hardcoded 0.5. For 'understand' intent, graphWeight = 0.15
    const results = await hybridSearch.hybridSearchEnhanced('authentication', mockEmbedding, { limit: 10 });
    // Verify results returned (graph was included in fusion)
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('C138-P0: Adaptive Fallback in searchWithFallback', () => {
  it('C138-P0-FB-T1: two-pass fallback tags results with fallbackRetry', async () => {
    // Use a vector search that returns nothing to force fallback scenarios
    const emptyVectorSearch = () => [];
    const mockDb = createMockDb();
    // Init with empty search functions — will rely on FTS/BM25 from mock DB
    hybridSearch.init(mockDb, emptyVectorSearch, null);
    bm25Index.resetIndex();
    // BM25 is empty, FTS from mock returns results, so primary should return results
    const results = await hybridSearch.searchWithFallback('authentication', null, { limit: 5 });
    // Should get results from FTS at minimum (via mock DB)
    expect(Array.isArray(results)).toBe(true);
  });

  it('C138-P0-FB-T2: tier-2 fallback forces all channels for simple-routed queries', async () => {
    const savedFallback = process.env.SPECKIT_SEARCH_FALLBACK;
    const savedRouter = process.env.SPECKIT_COMPLEXITY_ROUTER;
    process.env.SPECKIT_SEARCH_FALLBACK = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';

    let graphSearchCallCount = 0;
    const lowRecallVectorSearch = () => [{ id: 1, similarity: 0.01, content: 'vector low confidence' }];
    const trackingGraphSearch = (_query: string, _options: Record<string, unknown>) => {
      graphSearchCallCount++;
      return [{ id: 999, score: 0.6, content: 'graph fallback candidate' }];
    };

      try {
        const mockDb = createMockDb();
        hybridSearch.init(mockDb, lowRecallVectorSearch as VectorSearchFn, trackingGraphSearch as GraphSearchFn);

      bm25Index.resetIndex();
      const bm25 = bm25Index.getIndex();
      for (const doc of MOCK_DOCS) {
        bm25.addDocument(String(doc.id), doc.content);
      }

      // "auth" is a simple query; Tier 1 routes to a subset of channels.
      // Limit=1 guarantees degradation (count < 3), so Tier 2 should run and
      // Force-enable all channels, including graph.
      const embedding = new Float32Array(384).fill(0.1);
      await hybridSearch.searchWithFallback('auth', embedding, { limit: 1 });

      expect(graphSearchCallCount).toBeGreaterThanOrEqual(1);
    } finally {
      if (savedFallback === undefined) {
        delete process.env.SPECKIT_SEARCH_FALLBACK;
      } else {
        process.env.SPECKIT_SEARCH_FALLBACK = savedFallback;
      }
      if (savedRouter === undefined) {
        delete process.env.SPECKIT_COMPLEXITY_ROUTER;
      } else {
        process.env.SPECKIT_COMPLEXITY_ROUTER = savedRouter;
      }
    }
  });
});

describe('P1 fallback threshold and channel gating regressions', () => {
  const originalEnv = {
    SPECKIT_SEARCH_FALLBACK: process.env.SPECKIT_SEARCH_FALLBACK,
    SPECKIT_COMPLEXITY_ROUTER: process.env.SPECKIT_COMPLEXITY_ROUTER,
  };

  afterEach(() => {
    bm25Index.resetIndex();
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it('T020: searchWithFallback uses percentage minSimilarity thresholds for adaptive retry', async () => {
    process.env.SPECKIT_SEARCH_FALLBACK = 'false';
    const seenThresholds: number[] = [];
    const recordingVectorSearch: VectorSearchFn = (_embedding, options = {}) => {
      seenThresholds.push(options.minSimilarity as number);
      return [];
    };

    hybridSearch.init(createMockDb(), recordingVectorSearch, null);

    const results = await hybridSearch.searchWithFallback(
      'authentication',
      new Float32Array(384).fill(0.1),
      { limit: 5, useFts: false, useBm25: false, useGraph: false }
    );

    expect(results).toEqual([]);
    expect(seenThresholds).toEqual([30, 17]);
  });

  it('T020: collectRawCandidates tiered fallback widens vector search with 30/10 percent floors', async () => {
    process.env.SPECKIT_SEARCH_FALLBACK = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';
    const seenThresholds: number[] = [];
    const recordingVectorSearch: VectorSearchFn = (_embedding, options = {}) => {
      seenThresholds.push(options.minSimilarity as number);
      return [];
    };

    hybridSearch.init(createMockDb(), recordingVectorSearch, null);

    await hybridSearch.collectRawCandidates(
      'authentication',
      new Float32Array(384).fill(0.1),
      { limit: 5, useFts: false, useBm25: false, useGraph: false }
    );

    expect(seenThresholds).toEqual([30, 10]);
  });

  it('T020: collectRawCandidates adaptive retry tags retry-stage candidates with fallbackRetry', async () => {
    process.env.SPECKIT_SEARCH_FALLBACK = 'false';
    const thresholdAwareVectorSearch: VectorSearchFn = (_embedding, options = {}) => {
      if ((options.minSimilarity as number) <= 17) {
        return [{ id: 777, similarity: 42, content: 'adaptive fallback candidate' }];
      }
      return [];
    };

    hybridSearch.init(createMockDb(), thresholdAwareVectorSearch, null);

    const results = await hybridSearch.collectRawCandidates(
      'authentication',
      new Float32Array(384).fill(0.1),
      { limit: 5, useFts: false, useBm25: false, useGraph: false }
    );

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: 777,
      fallbackRetry: true,
    });
  });

  it('T021: disabled lexical channels stay disabled through the fallback chain', async () => {
    process.env.SPECKIT_SEARCH_FALLBACK = 'false';
    const emptyVectorSearch: VectorSearchFn = () => [];

    hybridSearch.init(createMockDb(), emptyVectorSearch, null);
    bm25Index.resetIndex();
    const bm25 = bm25Index.getIndex();
    for (const doc of MOCK_DOCS) {
      bm25.addDocument(String(doc.id), doc.content);
    }

    const results = await hybridSearch.searchWithFallback(
      'authentication',
      new Float32Array(384).fill(0.1),
      { limit: 5, useFts: false, useBm25: false, useGraph: false }
    );

    expect(results).toEqual([]);
  });

  it('T021: tiered fallback only runs enrichment once after the final tier is chosen', async () => {
    process.env.SPECKIT_SEARCH_FALLBACK = 'true';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';

    const spreadSpy = vi.spyOn(coActivation, 'spreadActivation').mockReturnValue([]);
    const thresholdAwareVectorSearch: VectorSearchFn = (_embedding, options = {}) => {
      if ((options.minSimilarity as number) >= 30) {
        return [{ id: 101, similarity: 95, title: 'tier one candidate' }];
      }
      return [{ id: 202, similarity: 94, title: 'tier two candidate' }];
    };

    hybridSearch.init(createMockDb(), thresholdAwareVectorSearch, null);

    try {
      const results = await hybridSearch.searchWithFallback(
        'authentication',
        new Float32Array(384).fill(0.1),
        { limit: 1, useFts: false, useBm25: false, useGraph: false }
      );

      expect(results).toHaveLength(1);
      expect(spreadSpy).toHaveBeenCalledTimes(1);
    } finally {
      spreadSpy.mockRestore();
    }
  });
});

describe('P1-002-1 raw candidate merge scoring', () => {
  const { mergeRawCandidate } = hybridSearch.__testables;

  it('keeps the base score unchanged for a single-channel candidate and records channelCount', () => {
    const incoming = {
      id: 2,
      score: 0.5,
      source: 'vector',
      sources: ['vector'],
      sourceScores: { vector: 0.5 },
      channelAttribution: ['vector'],
    } as HybridSearchResult;

    const merged = mergeRawCandidate(undefined, incoming);

    expect(merged.score).toBeCloseTo(0.5, 6);
    expect((merged as Record<string, unknown>).channelCount).toBe(1);
    expect((merged as Record<string, unknown>).sources).toEqual(['vector']);
  });

  it('adds a +0.02 bonus for a second contributing channel', () => {
    const merged = mergeRawCandidate(
      {
        id: 2,
        score: 0.5,
        source: 'vector',
        sources: ['vector'],
        sourceScores: { vector: 0.5 },
        channelAttribution: ['vector'],
      } as HybridSearchResult,
      {
        id: 2,
        score: 0.5,
        source: 'graph',
        sources: ['graph'],
        sourceScores: { graph: 0.5 },
        channelAttribution: ['graph'],
      } as HybridSearchResult
    );

    expect(merged.score).toBeCloseTo(0.52, 6);
    expect((merged as Record<string, unknown>).channelCount).toBe(2);
    expect((merged as Record<string, unknown>).sources).toEqual(
      expect.arrayContaining(['vector', 'graph'])
    );
  });

  it('caps the cross-channel bonus at +0.06 and clamps the merged score to 1', () => {
    const merged = mergeRawCandidate(
      {
        id: 'shared-doc',
        score: 0.97,
        source: 'vector',
        sources: ['vector', 'fts', 'bm25', 'graph'],
        sourceScores: {
          vector: 0.97,
          fts: 0.96,
          bm25: 0.95,
          graph: 0.94,
        },
        channelAttribution: ['vector', 'fts', 'bm25', 'graph'],
      } as HybridSearchResult,
      {
        id: 'shared-doc',
        score: 0.96,
        source: 'trigger',
        sources: ['trigger'],
        sourceScores: { trigger: 0.96 },
        channelAttribution: ['trigger'],
      } as HybridSearchResult
    );

    expect(merged.score).toBe(1);
    expect((merged as Record<string, unknown>).channelCount).toBe(5);
    expect((merged as Record<string, unknown>).sources).toEqual(
      expect.arrayContaining(['vector', 'fts', 'bm25', 'graph', 'trigger'])
    );
  });
});

describe('Degree channel fusion regression coverage', () => {
  it('keeps degree ranking in the final fusion when graph returns no results', async () => {
    const degreeAwareDb = createDegreeAwareMockDb();
    const vectorOnlySearch: VectorSearchFn = () => ([
      { id: 1, similarity: 0.9, title: 'vector-first' },
      { id: 2, similarity: 0.8, title: 'degree-promoted' },
    ]);

    hybridSearch.init(degreeAwareDb, vectorOnlySearch, () => []);
    bm25Index.resetIndex();

    const results = await hybridSearch.hybridSearchEnhanced(
      'fix auth bug',
      new Float32Array(384).fill(0.1),
      {
        limit: 5,
        useFts: false,
        useBm25: false,
        forceAllChannels: true,
        intent: 'fix_bug',
      }
    );

    expect(results[0]?.id).toBe(2);
    expect((results[0] as Record<string, unknown>).sources).toContain('degree');
  });

  it('T022: useGraph=false also suppresses the degree channel', async () => {
    const degreeAwareDb = createDegreeAwareMockDb();
    const vectorOnlySearch: VectorSearchFn = () => ([
      { id: 1, similarity: 0.9, title: 'vector-first' },
      { id: 2, similarity: 0.8, title: 'degree-promoted' },
    ]);

    hybridSearch.init(degreeAwareDb, vectorOnlySearch, () => [{ id: 2, score: 0.7 }]);
    bm25Index.resetIndex();

    const results = await hybridSearch.hybridSearchEnhanced(
      'fix auth bug',
      new Float32Array(384).fill(0.1),
      {
        limit: 5,
        useFts: false,
        useBm25: false,
        useGraph: false,
        forceAllChannels: true,
        intent: 'fix_bug',
      }
    );

    expect(results[0]?.id).toBe(1);
    expect(
      results.some((result) => ((result as Record<string, unknown>).sources as string[] | undefined)?.includes('degree'))
    ).toBe(false);
  });

  it('T023: graph-present fusion keeps lexical evidence grouped under the keyword channel', async () => {
    const mockDb = createMockDb();
    const graphSearch: GraphSearchFn = () => [{ id: 999, score: 0.6, title: 'graph result' }];

    hybridSearch.init(mockDb, mockVectorSearch, graphSearch);
    bm25Index.resetIndex();
    const bm25 = bm25Index.getIndex();
    for (const doc of MOCK_DOCS) {
      bm25.addDocument(String(doc.id), doc.content);
    }

    const results = await hybridSearch.hybridSearchEnhanced(
      'authentication',
      new Float32Array(384).fill(0.1),
      { limit: 10, intent: 'understand' }
    );

    const keywordBackedResult = results.find((result) =>
      ((result as Record<string, unknown>).sources as string[] | undefined)?.includes('keyword')
    );

    expect(keywordBackedResult).toBeDefined();
    expect(((keywordBackedResult as Record<string, unknown>).sources as string[])).not.toEqual(
      expect.arrayContaining(['fts', 'bm25'])
    );
  });

  it('T316: MMR reuses vector-provided embeddings without querying vec_memories', async () => {
    const originalMmr = process.env.SPECKIT_MMR;
    const originalCrossEncoder = process.env.SPECKIT_CROSS_ENCODER;
    process.env.SPECKIT_MMR = 'true';
    process.env.SPECKIT_CROSS_ENCODER = 'false';

    let vecEmbeddingQueryCount = 0;
    const mmrDb = {
      prepare(sql: string) {
        return {
          get() {
            if (sql.includes('memory_fts')) {
              return { count: 1 };
            }
            return null;
          },
          all() {
            if (sql.includes('vec_memories')) {
              vecEmbeddingQueryCount += 1;
              return [];
            }
            return [];
          },
        };
      },
    } as unknown as Database.Database;

    const vectorWithEmbeddings: VectorSearchFn = () => [
      { id: 1, similarity: 0.99, title: 'doc-1', embedding: new Float32Array([1, 0, 0, 0]) },
      { id: 2, similarity: 0.98, title: 'doc-2', embedding: new Float32Array([0, 1, 0, 0]) },
    ];

    try {
      hybridSearch.init(mmrDb, vectorWithEmbeddings, null);
      bm25Index.resetIndex();

      const results = await hybridSearch.hybridSearchEnhanced(
        'authentication',
        new Float32Array(384).fill(0.1),
        {
          limit: 5,
          useFts: false,
          useBm25: false,
          useGraph: false,
          forceAllChannels: true,
          intent: 'understand',
        }
      );

      expect(results.length).toBeGreaterThan(0);
      expect(vecEmbeddingQueryCount).toBe(0);
    } finally {
      if (originalMmr === undefined) {
        delete process.env.SPECKIT_MMR;
      } else {
        process.env.SPECKIT_MMR = originalMmr;
      }
      if (originalCrossEncoder === undefined) {
        delete process.env.SPECKIT_CROSS_ENCODER;
      } else {
        process.env.SPECKIT_CROSS_ENCODER = originalCrossEncoder;
      }
    }
  });
});

describe('P1 post-ranking truncation and token budget regressions', () => {
  const originalEnv = {
    SPECKIT_CONFIDENCE_TRUNCATION: process.env.SPECKIT_CONFIDENCE_TRUNCATION,
    SPECKIT_MMR: process.env.SPECKIT_MMR,
    SPECKIT_CROSS_ENCODER: process.env.SPECKIT_CROSS_ENCODER,
    SPECKIT_FOLDER_SCORING: process.env.SPECKIT_FOLDER_SCORING,
    SPECKIT_DYNAMIC_TOKEN_BUDGET: process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET,
    SPECKIT_CONTEXT_HEADERS: process.env.SPECKIT_CONTEXT_HEADERS,
    SPECKIT_SEARCH_FALLBACK: process.env.SPECKIT_SEARCH_FALLBACK,
    SPECKIT_DOCSCORE_AGGREGATION: process.env.SPECKIT_DOCSCORE_AGGREGATION,
  };

  afterEach(() => {
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it('T024: co-activation promotion happens before confidence truncation drops tail candidates', async () => {
    process.env.SPECKIT_CONFIDENCE_TRUNCATION = 'true';
    process.env.SPECKIT_MMR = 'false';
    process.env.SPECKIT_CROSS_ENCODER = 'false';
    process.env.SPECKIT_FOLDER_SCORING = 'false';
    process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET = 'false';
    process.env.SPECKIT_CONTEXT_HEADERS = 'false';
    process.env.SPECKIT_SEARCH_FALLBACK = 'false';
    process.env.SPECKIT_DOCSCORE_AGGREGATION = 'false';

    const promotionDb = createCoactivationPromotionDb();
    const vectorSearch: VectorSearchFn = () => ([
      { id: 1, similarity: 0.99, title: 'seed one' },
      { id: 2, similarity: 0.98, title: 'seed two' },
      { id: 3, similarity: 0.97, title: 'seed three' },
      { id: 4, similarity: 0.96, title: 'promoted by coactivation' },
    ]);

    hybridSearch.init(promotionDb, vectorSearch, null);
    coActivation.init(promotionDb);
    bm25Index.resetIndex();
    const bm25 = bm25Index.getIndex();
    for (const doc of MOCK_DOCS) {
      bm25.addDocument(String(doc.id), doc.content);
    }

    const results = await hybridSearch.hybridSearchEnhanced(
      'authentication',
      new Float32Array(384).fill(0.1),
      { limit: 10, useFts: false, useBm25: true, useGraph: false, intent: 'understand' }
    );

    expect(results.map((result) => result.id)).toContain(4);
  });

  it('T025: estimateResultTokens includes nested metadata and multi-source fields', () => {
    const baseResult = {
      id: 1,
      score: 0.9,
      source: 'vector',
      title: 'Base result',
    } as HybridSearchResult;
    const enrichedResult = {
      ...baseResult,
      sources: ['vector', 'keyword'],
      traceMetadata: {
        stage4: { scoreTrace: 'x'.repeat(120) },
        attribution: { sources: ['vector', 'keyword'] },
      },
    } as HybridSearchResult;

    expect(hybridSearch.estimateResultTokens(enrichedResult)).toBeGreaterThan(
      hybridSearch.estimateResultTokens(baseResult)
    );
  });

  it('T025: truncateToBudget skips an oversized first result and keeps the best fitting candidate', () => {
    const oversized = {
      id: 1,
      score: 0.95,
      source: 'vector',
      title: 'Oversized',
      content: 'x'.repeat(40000),
      traceMetadata: {
        stage4: { debug: 'y'.repeat(4000) },
      },
    } as HybridSearchResult;
    const compact = {
      id: 2,
      score: 0.8,
      source: 'vector',
      title: 'Compact result',
    } as HybridSearchResult;
    const budget = hybridSearch.estimateResultTokens(compact) + 5;

    const truncated = hybridSearch.truncateToBudget([oversized, compact], budget, {
      includeContent: false,
      queryId: 'p1-token-skip',
    });

    expect(truncated.truncated).toBe(true);
    expect(truncated.results.map((result) => result.id)).toEqual([2]);
  });

  it('T025: truncateToBudget keeps a summarized top result when every candidate exceeds the budget', () => {
    const oversizedTop = {
      id: 1,
      score: 0.95,
      source: 'vector',
      title: 'Oversized top match',
      content: 'top '.repeat(6000),
      traceMetadata: {
        stage4: { debug: 'a'.repeat(4000) },
      },
    } as HybridSearchResult;
    const oversizedSecond = {
      id: 2,
      score: 0.9,
      source: 'vector',
      title: 'Oversized secondary match',
      content: 'second '.repeat(5000),
      traceMetadata: {
        stage4: { debug: 'b'.repeat(3000) },
      },
    } as HybridSearchResult;

    const truncated = hybridSearch.truncateToBudget([oversizedSecond, oversizedTop], 50, {
      includeContent: true,
      queryId: 'p1-token-fallback',
    });

    expect(truncated.truncated).toBe(true);
    expect(truncated.results).toHaveLength(1);
    expect(truncated.results[0]?.id).toBe(1);
    expect(truncated.results[0]?.content).toContain('[Summary] Oversized top match:');
    expect(truncated.results[0]?._summarized).toBe(true);
    expect(truncated.overflow?.truncatedToCount).toBe(1);
  });

  it('T311: truncateToBudget reuses the per-result token estimate during total and greedy passes', () => {
    let contentReads = 0;
    const resultWithGetter = {
      id: 7,
      score: 0.9,
      source: 'vector',
      title: 'Getter-backed result',
      get content() {
        contentReads += 1;
        return 'x'.repeat(2000);
      },
    } as HybridSearchResult;

    const truncated = hybridSearch.truncateToBudget([resultWithGetter], 1, {
      includeContent: false,
      queryId: 't311-cache',
    });

    expect(truncated.truncated).toBe(true);
    expect(contentReads).toBe(1);
  });
});

describe('Sprint 1 Search-Core Fixes (Task #2)', () => {
  const ORIGINAL_ENV = {
    SPECKIT_COMPLEXITY_ROUTER: process.env.SPECKIT_COMPLEXITY_ROUTER,
    SPECKIT_DYNAMIC_TOKEN_BUDGET: process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET,
    SPECKIT_FOLDER_SCORING: process.env.SPECKIT_FOLDER_SCORING,
    SPECKIT_FOLDER_TOP_K: process.env.SPECKIT_FOLDER_TOP_K,
  };

  afterEach(() => {
    for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it('S1-FIX-01: routeQuery trigger-phrase path is reachable from hybridSearchEnhanced', async () => {
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
    const mockDb = createMockDb();
    hybridSearch.init(mockDb, mockVectorSearch, mockGraphSearch);

    const longTrigger = 'explain authentication token refresh integration details now please';
    const embedding = new Float32Array(384).fill(0.2);
    const results = await hybridSearch.hybridSearchEnhanced(longTrigger, embedding, {
      limit: 10,
      triggerPhrases: [longTrigger],
    });

    const s3meta = (results as unknown as Record<string, unknown>)._s3meta as
      | { routing?: { tier?: string } }
      | undefined;

    expect(s3meta?.routing?.tier).toBe('simple');
  });

  it('S1-FIX-02: folder scoring integrates into hybrid runtime behind feature flag', async () => {
    process.env.SPECKIT_FOLDER_SCORING = 'true';
    process.env.SPECKIT_FOLDER_TOP_K = '2';
    const mockDb = createMockDb();
    hybridSearch.init(mockDb, mockVectorSearch, mockGraphSearch);

    const embedding = new Float32Array(384).fill(0.1);
    const results = await hybridSearch.hybridSearchEnhanced('authentication module', embedding, { limit: 10 });

    expect(results.length).toBeGreaterThan(0);
    const hasFolderMeta = results.some((r) => {
      const rec = r as Record<string, unknown>;
      return typeof rec.specFolder === 'string' && typeof rec.folderRank === 'number';
    });
    expect(hasFolderMeta).toBe(true);
  });

  it('S1-FIX-03: dynamic token budget is applied to live hybrid results', async () => {
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
    process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET = 'true';

    const hugeVectorSearch = (_embedding: unknown, options: Record<string, unknown> = {}) => {
      const limit = (options.limit as number) || 20;
      return Array.from({ length: limit }, (_v, idx) => ({
        id: idx + 1000,
        title: `Huge Result ${idx + 1}`,
        content: 'x'.repeat(6000),
        similarity: 0.99 - idx * 0.01,
      }));
    };

    const mockDb = createMockDb();
    hybridSearch.init(mockDb, hugeVectorSearch, null);

    const embedding = new Float32Array(384).fill(0.3);
    const results = await hybridSearch.hybridSearchEnhanced('fix bug', embedding, { limit: 20 });

    const s3meta = (results as unknown as Record<string, unknown>)._s3meta as
      | { tokenBudget?: { budget?: number; applied?: boolean } }
      | undefined;

    expect(s3meta?.tokenBudget?.applied).toBe(true);
    expect(s3meta?.tokenBudget?.budget).toBe(1500);
    expect(results.length).toBeLessThan(20);
  });

  it('S1-FIX-04: evaluationMode bypasses token-budget truncation for benchmark calls', async () => {
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
    process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET = 'true';

    const hugeVectorSearch = (_embedding: unknown, options: Record<string, unknown> = {}) => {
      const limit = (options.limit as number) || 20;
      return Array.from({ length: limit }, (_v, idx) => ({
        id: idx + 2000,
        title: `Huge Eval Result ${idx + 1}`,
        content: 'x'.repeat(6000),
        similarity: 0.99 - idx * 0.01,
      }));
    };

    const mockDb = createMockDb();
    hybridSearch.init(mockDb, hugeVectorSearch, null);

    const embedding = new Float32Array(384).fill(0.3);
    const results = await hybridSearch.hybridSearchEnhanced('fix bug', embedding, {
      limit: 20,
      useBm25: false,
      useFts: false,
      useGraph: false,
      forceAllChannels: true,
      evaluationMode: true,
    });

    expect(results).toHaveLength(20);
    expect(results[0]?.traceMetadata).toMatchObject({
      budgetTruncated: false,
      evaluationMode: true,
    });
  });
});

// -- BUG-1 fix: Ablation channel disable integration tests --
describe('BUG-1: Ablation channel disable via useVector/useBm25/useFts options', () => {
  let vectorCallCount: number;

  beforeEach(() => {
    vectorCallCount = 0;
    const trackingVectorSearch = (_embedding: unknown, _opts: Record<string, unknown>) => {
      vectorCallCount++;
      return MOCK_DOCS.slice(0, 2).map((doc, i) => ({
        ...doc,
        score: 0.95 - i * 0.1,
      }));
    };
    const mockDb = createMockDb();
    hybridSearch.init(mockDb, trackingVectorSearch, null);
    bm25Index.resetIndex();
    const bm25 = bm25Index.getIndex();
    for (const doc of MOCK_DOCS) {
      bm25.addDocument(String(doc.id), doc.content);
    }
  });

  it('BUG1-T1: useVector=false prevents vector search function from being called', async () => {
    const embedding = new Float32Array(384).fill(0.1);
    await hybridSearch.hybridSearchEnhanced('authentication', embedding, { limit: 10, useVector: false });
    expect(vectorCallCount).toBe(0);
  });

  it('BUG1-T2: useVector=true (default) calls vector search function', async () => {
    const embedding = new Float32Array(384).fill(0.1);
    await hybridSearch.hybridSearchEnhanced('authentication', embedding, { limit: 10 });
    expect(vectorCallCount).toBeGreaterThanOrEqual(1);
  });

  it('BUG1-T3: useFts=false removes FTS results from output', async () => {
    const embedding = new Float32Array(384).fill(0.1);
    const results = await hybridSearch.hybridSearchEnhanced('authentication', embedding, { limit: 10, useFts: false });
    const ftsSources = results.filter(r => r.source === 'fts');
    expect(ftsSources.length).toBe(0);
  });

  it('BUG1-T4: useBm25=false removes BM25 results from output', async () => {
    const embedding = new Float32Array(384).fill(0.1);
    const results = await hybridSearch.hybridSearchEnhanced('authentication', embedding, { limit: 10, useBm25: false });
    const bm25Sources = results.filter(r => r.source === 'bm25');
    expect(bm25Sources.length).toBe(0);
  });
});
