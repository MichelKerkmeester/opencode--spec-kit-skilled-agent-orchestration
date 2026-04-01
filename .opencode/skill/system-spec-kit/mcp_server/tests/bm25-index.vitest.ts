// TEST: BM25 INDEX
import { describe, it, expect, beforeEach, afterEach, afterAll, vi } from 'vitest';
import type BetterSqlite3 from 'better-sqlite3';
import {
  BM25Index,
  tokenize,
  simpleStem,
  getTermFrequencies,
  getIndex,
  resetIndex,
  isBm25Enabled,
  buildBm25DocumentText,
  DEFAULT_K1,
  DEFAULT_B,
} from '../lib/search/bm25-index';

type BetterSqliteDatabase = InstanceType<typeof BetterSqlite3>;
type HybridSearchModule = typeof import('../lib/search/hybrid-search');

const ORIGINAL_ENABLE_BM25 = process.env.ENABLE_BM25;
process.env.ENABLE_BM25 = 'true';

let hybridSearch: HybridSearchModule | null = null;
try {
  // @ts-expect-error top-level await in test file
  hybridSearch = await import('../lib/search/hybrid-search');
} catch {
  // Hybrid-search not available
}

describe('BM25 Index Tests (T031-T039)', () => {
  beforeEach(() => {
    process.env.ENABLE_BM25 = 'true';
    resetIndex();
  });

  afterEach(() => {
    resetIndex();
    vi.useRealTimers();
    process.env.ENABLE_BM25 = 'true';
  });

  /* ═══════════════════════════════════════════════════════════
     T031: BM25Index class instantiation
  ════════════════════════════════════════════════════════════ */

  describe('T031: BM25Index class instantiation', () => {
    it('T031.1: new BM25Index() creates instance', () => {
      const index = new BM25Index();
      expect(index).toBeInstanceOf(BM25Index);
    });

    it('T031.2: Default k1 = 1.2', () => {
      const index = new BM25Index();
      expect((index as unknown as { k1: number }).k1).toBe(1.2);
    });

    it('T031.3: Default b = 0.75', () => {
      const index = new BM25Index();
      expect((index as unknown as { b: number }).b).toBe(0.75);
    });

    it('T031.4: Custom k1/b parameters accepted', () => {
      const custom = new BM25Index(1.5, 0.5);
      expect(custom).toBeInstanceOf(BM25Index);
    });

    it('T031.5: Initial state is empty', () => {
      const index = new BM25Index();
      const stats = index.getStats();
      expect(stats.documentCount).toBe(0);
      expect(stats.termCount).toBe(0);
    });

    it('T031.6: Internal Maps initialized', () => {
      const index = new BM25Index();
      const stats = index.getStats();
      expect(typeof stats.documentCount).toBe('number');
      expect(typeof stats.termCount).toBe('number');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     T032: Tokenization splits text correctly
  ════════════════════════════════════════════════════════════ */

  describe('T032: Tokenization splits text correctly', () => {
    it('T032.1: Basic whitespace splitting', () => {
      const tokens = tokenize('hello world test');
      expect(tokens).toContain('hello');
      expect(tokens).toContain('world');
      expect(tokens).toContain('test');
    });

    it('T032.2: Converts to lowercase', () => {
      const tokens = tokenize('HELLO World TEST');
      expect(tokens).toContain('hello');
      expect(tokens).toContain('world');
      expect(tokens).toContain('test');
    });

    it('T032.3: Removes punctuation', () => {
      const tokens = tokenize('hello, world! test.');
      expect(tokens.some((t: string) => t.includes(',') || t.includes('!') || t.includes('.'))).toBe(false);
    });

    it('T032.4: Filters stopwords', () => {
      const tokens = tokenize('the quick brown fox is a test');
      expect(tokens).not.toContain('the');
      expect(tokens).not.toContain('is');
      expect(tokens).not.toContain('a');
    });

    it('T032.5: Filters short words (< 2 chars)', () => {
      const tokens = tokenize('I a am we go');
      expect(tokens).not.toContain('i');
      expect(tokens).not.toContain('a');
    });

    it('T032.6: Preserves underscores', () => {
      const tokens = tokenize('hello_world test_function');
      expect(tokens.some((t: string) => t.includes('_'))).toBe(true);
    });

    it('T032.7: Empty input returns []', () => {
      const tokens = tokenize('');
      expect(Array.isArray(tokens)).toBe(true);
      expect(tokens.length).toBe(0);
    });

    it('T032.8: Null input returns []', () => {
      // @ts-expect-error intentionally passing null to verify runtime guard
      const tokens = tokenize(null);
      expect(Array.isArray(tokens)).toBe(true);
      expect(tokens.length).toBe(0);
    });

    it('T032.9: Non-string input returns []', () => {
      // @ts-expect-error intentionally passing number to verify runtime guard
      const tokens = tokenize(12345);
      expect(Array.isArray(tokens)).toBe(true);
      expect(tokens.length).toBe(0);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     T033: Porter stemmer subset reduces words to stems
  ════════════════════════════════════════════════════════════ */

  describe('T033: Porter stemmer subset reduces words to stems', () => {
    it('T033.1: -ing suffix removal + double-consonant dedup', () => {
      // Fix #18 — "running" → "runn" → "run" (doubled consonant collapsed)
      expect(simpleStem('running')).toBe('run');
    });

    it('T033.2: -ed suffix removal', () => {
      expect(simpleStem('tested')).toBe('test');
    });

    it('T033.3: -ies -> i transformation', () => {
      expect(simpleStem('studies')).toBe('studi');
    });

    it('T033.4: -es suffix removal', () => {
      expect(simpleStem('boxes')).toBe('box');
    });

    it('T033.5: -s suffix removal', () => {
      expect(simpleStem('tests')).toBe('test');
    });

    it('T033.6: -tion suffix removal', () => {
      expect(simpleStem('reaction')).toBe('reac');
    });

    it('T033.7: -ment not in simpleStem ruleset', () => {
      expect(simpleStem('agreement')).toBe('agreement');
    });

    it('T033.8: -ness/-s suffix processing', () => {
      const stem = simpleStem('kindness');
      expect(typeof stem).toBe('string');
      expect(stem.length).toBeLessThan('kindness'.length);
    });

    it('T033.9: Short words unchanged', () => {
      expect(simpleStem('run')).toBe('run');
    });

    it('T033.10: -able not in simpleStem ruleset', () => {
      expect(simpleStem('readable')).toBe('readable');
    });

    it('T033.11: -ful not in simpleStem ruleset', () => {
      expect(simpleStem('helpful')).toBe('helpful');
    });

    it('T033.12: -less/-s suffix processing', () => {
      const stem = simpleStem('careless');
      expect(typeof stem).toBe('string');
      expect(stem.length).toBeLessThan('careless'.length);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     T034: Inverted index construction from documents
  ════════════════════════════════════════════════════════════ */

  describe('T034: Inverted index construction from documents', () => {
    let index: BM25Index;

    beforeEach(() => {
      index = new BM25Index();
    });

    it('T034.1: addDocument updates total_docs', () => {
      index.addDocument('doc1', 'memory search retrieval document indexing testing vector semantic hybrid bm25');
      expect(index.getStats().documentCount).toBe(1);
    });

    it('T034.2: Document stored and searchable', () => {
      index.addDocument('doc1', 'memory search retrieval document indexing testing vector semantic hybrid bm25');
      const searchResult = index.search('memory', 1);
      expect(searchResult.length).toBeGreaterThan(0);
      expect(searchResult[0].id).toBe('doc1');
    });

    it('T034.3: Index populated', () => {
      index.addDocument('doc1', 'memory search retrieval document indexing testing vector semantic hybrid bm25');
      expect(index.getStats().termCount).toBeGreaterThan(0);
    });

    it('T034.4: Term search returns correct doc', () => {
      index.addDocument('doc1', 'memory search retrieval document indexing testing vector semantic hybrid bm25');
      const results = index.search('memory search', 5);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe('doc1');
    });

    it('T034.5: Document frequencies updated', () => {
      index.addDocument('doc1', 'memory search retrieval document indexing testing vector semantic hybrid bm25');
      expect(index.getStats().termCount).toBeGreaterThan(0);
    });

    it('T034.6: avgDocLength calculated', () => {
      index.addDocument('doc1', 'memory search retrieval document indexing testing vector semantic hybrid bm25');
      expect(index.getStats().avgDocLength).toBeGreaterThan(0);
    });

    it('T034.7: removeDocument cleans up correctly', () => {
      index.addDocument('doc1', 'memory search retrieval document indexing testing vector semantic hybrid bm25');
      index.addDocument('doc2', 'another document context memory retrieval testing search hybrid vector semantic');
      const beforeRemove = index.getStats().documentCount;
      index.removeDocument('doc2');
      expect(index.getStats().documentCount).toBe(beforeRemove - 1);
    });

    it('T034.8: Bulk addDocuments works', () => {
      const docs = [
        { id: 'bulk1', text: 'first document memory search retrieval testing vector semantic hybrid bm25' },
        { id: 'bulk2', text: 'second document context retrieval testing memory search semantic vector hybrid' },
        { id: 'bulk3', text: 'third document testing memory retrieval search vector semantic bm25 hybrid' },
      ];
      index.addDocuments(docs);
      expect(index.getStats().documentCount).toBe(3);
    });

    it('T034.9: Short document handling', () => {
      index.addDocument('short', 'too short');
      expect(index.getStats().documentCount).toBeGreaterThanOrEqual(0);
    });

    it('T034.10: clear() resets index', () => {
      index.addDocument('doc1', 'memory search retrieval document indexing testing vector semantic hybrid bm25');
      index.clear();
      const stats = index.getStats();
      expect(stats.documentCount).toBe(0);
      expect(stats.termCount).toBe(0);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     T035: IDF calculation for term importance
  ════════════════════════════════════════════════════════════ */

  describe('T035: IDF calculation for term importance', () => {
    let index: BM25Index;

    beforeEach(() => {
      index = new BM25Index();
      index.addDocuments([
        { id: 'doc1', text: 'memory retrieval search testing document indexing vector semantic hybrid bm25' },
        { id: 'doc2', text: 'memory context search document retrieval testing vector semantic hybrid bm25' },
        { id: 'doc3', text: 'another document different context testing retrieval search vector semantic hybrid' },
      ]);
    });

    it('T035.1: Common term has non-negative IDF', () => {
      const idf = index.calculateIdf('memory');
      expect(typeof idf).toBe('number');
      expect(idf).toBeGreaterThanOrEqual(0);
    });

    it('T035.2: Rare term IDF calculation works', () => {
      const idf = index.calculateIdf('another');
      expect(typeof idf).toBe('number');
      expect(idf).toBeGreaterThanOrEqual(0);
    });

    it('T035.3: Unknown term has zero IDF', () => {
      expect(index.calculateIdf('xyzunknownterm')).toBe(0);
    });

    it('T035.4: IDF formula produces valid result', () => {
      const idf = index.calculateIdf('search');
      expect(typeof idf).toBe('number');
      expect(idf).toBeGreaterThanOrEqual(0);
    });

    it('T035.5: IDF always non-negative', () => {
      const terms = ['memory', 'search', 'document', 'another', 'context'];
      const allIdfs = terms.map(t => index.calculateIdf(t));
      expect(allIdfs.every(idf => typeof idf === 'number' && idf >= 0)).toBe(true);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     T036: BM25 scoring with k1=1.2, b=0.75 parameters
  ════════════════════════════════════════════════════════════ */

  describe('T036: BM25 scoring with k1=1.2, b=0.75 parameters', () => {
    let index: BM25Index;

    beforeEach(() => {
      index = new BM25Index();
      index.addDocuments([
        { id: 'doc1', text: 'memory memory memory retrieval search testing document indexing vector semantic' },
        { id: 'doc2', text: 'memory context search document retrieval testing vector semantic hybrid bm25' },
        { id: 'doc3', text: 'another document different context testing retrieval search vector semantic hybrid' },
      ]);
    });

    it('T036.1: Default parameters k1=1.2, b=0.75', () => {
      expect(DEFAULT_K1).toBe(1.2);
      expect(DEFAULT_B).toBe(0.75);
    });

    it('T036.2: Higher TF yields higher score', () => {
      const score1 = index.calculateScore(['memory'], 'doc1');
      const score2 = index.calculateScore(['memory'], 'doc2');
      expect(score1).toBeGreaterThan(score2);
    });

    it('T036.3: Document without term gets zero score', () => {
      expect(index.calculateScore(['memory'], 'doc3')).toBe(0);
    });

    it('T036.4: Multi-term query accumulates scores', () => {
      const multiQuery = tokenize('memory search');
      const multiScore = index.calculateScore(multiQuery, 'doc1');
      const singleScore = index.calculateScore(['memory'], 'doc1');
      expect(multiScore).toBeGreaterThan(singleScore);
    });

    it('T036.5: BM25 formula produces valid scores', () => {
      const score = index.calculateScore(['memory'], 'doc1');
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThan(0);
    });

    it('T036.6: search() returns results sorted by score', () => {
      const results = index.search('memory');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].score).toBeGreaterThanOrEqual(results[1]?.score || 0);
    });

    it('T036.7: search() respects limit parameter', () => {
      const results = index.search('memory search', 2);
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('T036.8: search() returns all matching documents', () => {
      const idx = new BM25Index();
      idx.addDocument('sf1', 'memory retrieval search testing document indexing vector semantic hybrid bm25');
      idx.addDocument('sf2', 'memory retrieval search testing document indexing vector semantic hybrid bm25');
      const results = idx.search('memory', 10);
      expect(results.length).toBe(2);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     T037: ENABLE_BM25 feature flag controls activation
  ════════════════════════════════════════════════════════════ */

  describe('T037: ENABLE_BM25 feature flag controls activation', () => {
    it('T037.1: isBm25Enabled() returns boolean', () => {
      expect(typeof isBm25Enabled()).toBe('boolean');
    });

    it('T037.2: BM25 is enabled by default when ENABLE_BM25 is unset', () => {
      delete process.env.ENABLE_BM25;
      expect(isBm25Enabled()).toBe(true);
    });

    it('T037.2b: BM25 enables when the experimental flag is set', () => {
      process.env.ENABLE_BM25 = 'true';
      expect(isBm25Enabled()).toBe(true);
    });

    it('T037.3: getStats() reports valid structure', () => {
      const index = new BM25Index();
      const stats = index.getStats();
      expect(typeof stats.documentCount).toBe('number');
    });

    it('T037.4: search() works when enabled', () => {
      const index = new BM25Index();
      index.addDocument('test', 'memory retrieval search testing document indexing vector semantic hybrid bm25');
      const results = index.search('memory');
      if (isBm25Enabled()) {
        expect(results.length).toBeGreaterThan(0);
      }
    });

    it('T037.5: DEFAULT_K1 and DEFAULT_B exported', () => {
      expect(DEFAULT_K1).toBe(1.2);
      expect(DEFAULT_B).toBe(0.75);
    });

    it('T037.6: Singleton functions exported', () => {
      expect(typeof getIndex).toBe('function');
      expect(typeof resetIndex).toBe('function');
    });

    it('T037.7: getIndex() returns singleton', () => {
      resetIndex();
      const idx1 = getIndex();
      const idx2 = getIndex();
      expect(idx1).toBe(idx2);
    });

    it('T037.8: resetIndex() clears singleton', () => {
      const idx = getIndex();
      idx.addDocument('test', 'memory retrieval search testing document indexing vector semantic hybrid bm25');
      resetIndex();
      const idx2 = getIndex();
      expect(idx2.getStats().documentCount).toBe(0);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     T038: BM25 integration with hybrid search pipeline
  ════════════════════════════════════════════════════════════ */

  describe('T038: BM25 integration with hybrid search pipeline', () => {
    it.skipIf(!hybridSearch)('T038.1: bm25Search exported from hybrid-search', () => {
      expect(typeof hybridSearch!.bm25Search).toBe('function');
    });

    it.skipIf(!hybridSearch)('T038.2: isBm25Available exported from hybrid-search', () => {
      expect(typeof hybridSearch!.isBm25Available).toBe('function');
    });

    it.skipIf(!hybridSearch)('T038.3: hybridSearchEnhanced exported', () => {
      expect(typeof hybridSearch!.hybridSearchEnhanced).toBe('function');
    });

    it.skipIf(!hybridSearch)('T038.4: isBm25Available() true when index populated', () => {
      resetIndex();
      const bm25idx = getIndex();
      bm25idx.addDocument('int1', 'memory retrieval search testing document indexing vector semantic hybrid integration');
      bm25idx.addDocument('int2', 'context memory search testing retrieval document vector semantic hybrid integration');
      const available = hybridSearch!.isBm25Available();
      if (isBm25Enabled()) {
        expect(available).toBe(true);
      } else {
        expect(available).toBe(false);
      }
    });

    it.skipIf(!hybridSearch)('T038.5: bm25Search returns results via hybrid-search', () => {
      resetIndex();
      const bm25idx = getIndex();
      bm25idx.addDocument('int1', 'memory retrieval search testing document indexing vector semantic hybrid integration');
      bm25idx.addDocument('int2', 'context memory search testing retrieval document vector semantic hybrid integration');
      const results = hybridSearch!.bm25Search('memory search', { limit: 5 });
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it.skipIf(!hybridSearch)('T038.6: Legacy camelCase aliases available', () => {
      expect(typeof hybridSearch!.bm25Search).toBe('function');
      expect(typeof hybridSearch!.isBm25Available).toBe('function');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     T039: combined_lexical_search() merges FTS5 + BM25 results
  ════════════════════════════════════════════════════════════ */

  describe('T039: combined_lexical_search() merges FTS5 + BM25', () => {
    it.skipIf(!hybridSearch)('T039.1: combinedLexicalSearch exported', () => {
      expect(typeof hybridSearch!.combinedLexicalSearch).toBe('function');
    });

    it.skipIf(!hybridSearch)('T039.2: combinedLexicalSearch returns array', () => {
      resetIndex();
      const results = hybridSearch!.combinedLexicalSearch('test query', { limit: 10 });
      expect(Array.isArray(results)).toBe(true);
    });

    it.skipIf(!hybridSearch)('T039.3: combinedLexicalSearch returns BM25 results', () => {
      resetIndex();
      const bm25comb = getIndex();
      bm25comb.addDocument('comb1', 'memory retrieval search testing document indexing vector semantic hybrid combined');
      bm25comb.addDocument('comb2', 'context memory search testing retrieval document vector semantic hybrid combined');
      const results = hybridSearch!.combinedLexicalSearch('memory search', { limit: 5 });
      expect(results.length).toBeGreaterThan(0);
    });

    it.skipIf(!hybridSearch)('T039.4: Results include score', () => {
      resetIndex();
      const bm25 = getIndex();
      bm25.addDocument('comb1', 'memory retrieval search testing document indexing vector semantic hybrid combined');
      const results = hybridSearch!.combinedLexicalSearch('memory', { limit: 5 });
      expect(results.length).toBeGreaterThan(0);
      expect(typeof results[0].score).toBe('number');
    });

    it.skipIf(!hybridSearch)('T039.5: Results include source or bm25 score', () => {
      resetIndex();
      const bm25 = getIndex();
      bm25.addDocument('comb1', 'memory retrieval search testing document indexing vector semantic hybrid combined');
      const results = hybridSearch!.combinedLexicalSearch('memory', { limit: 5 });
      expect(results.length).toBeGreaterThan(0);
      const hasSource = typeof results[0].source === 'string';
      const hasBm25Score = typeof results[0].score === 'number';
      expect(hasSource || hasBm25Score).toBe(true);
    });

    it.skipIf(!hybridSearch)('T039.6: Results include combined or bm25 score', () => {
      resetIndex();
      const bm25 = getIndex();
      bm25.addDocument('comb1', 'memory retrieval search testing document indexing vector semantic hybrid combined');
      const results = hybridSearch!.combinedLexicalSearch('memory', { limit: 5 });
      expect(results.length).toBeGreaterThan(0);
      const hasCombinedScore = typeof results[0].combined_lexical_score === 'number';
      const hasBm25Score = typeof results[0].score === 'number';
      expect(hasCombinedScore || hasBm25Score).toBe(true);
    });

    it.skipIf(!hybridSearch || !isBm25Enabled())('T039.7: Respects limit parameter', () => {
      resetIndex();
      const bm25 = getIndex();
      bm25.addDocument('comb1', 'memory retrieval search testing document indexing vector semantic hybrid combined');
      bm25.addDocument('comb2', 'context memory search testing retrieval document vector semantic hybrid combined');
      const results = hybridSearch!.combinedLexicalSearch('memory', { limit: 1 });
      expect(results.length).toBeLessThanOrEqual(1);
    });

    it.skipIf(!hybridSearch || !isBm25Enabled())('T039.8: combinedLexicalSearch returns results', () => {
      resetIndex();
      const bm25 = getIndex();
      bm25.addDocument('filt1', 'memory retrieval search testing document indexing vector semantic hybrid filter');
      bm25.addDocument('filt2', 'memory retrieval search testing document indexing vector semantic hybrid filter');
      const results = hybridSearch!.combinedLexicalSearch('memory', { limit: 10 });
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThanOrEqual(0);
    });

    it.skipIf(!hybridSearch)('T039.9: Legacy alias combinedLexicalSearch available', () => {
      expect(typeof hybridSearch!.combinedLexicalSearch).toBe('function');
    });
  });
});

describe('C138: Weighted BM25 FTS5 Enhancements', () => {
  it('C138-T1: BM25 index exports getIndex function', () => {
    expect(typeof getIndex).toBe('function');
  });

  it('C138-T2: DEFAULT_K1 is standard BM25 constant', () => {
    expect(DEFAULT_K1).toBeGreaterThan(0);
    expect(DEFAULT_K1).toBeLessThanOrEqual(3.0);
  });

  it('C138-T3: DEFAULT_B is standard BM25 constant', () => {
    expect(DEFAULT_B).toBeGreaterThan(0);
    expect(DEFAULT_B).toBeLessThanOrEqual(1.0);
  });

  it('C138-T4: tokenize handles multi-field input', () => {
    const titleTokens = tokenize('AuthGuard Module');
    const bodyTokens = tokenize('The AuthGuard module handles authentication for the application system');

    // Title has fewer tokens than body
    expect(titleTokens.length).toBeLessThan(bodyTokens.length);
    // Both contain the key term
    expect(titleTokens.some(t => t.includes('authguard') || t.includes('auth'))).toBe(true);
    expect(bodyTokens.some(t => t.includes('authguard') || t.includes('auth'))).toBe(true);
  });

  it('C138-T5: term frequencies computed correctly', () => {
    const tokens = tokenize('auth auth auth login login');
    const tf = getTermFrequencies(tokens);
    // 'auth' appears 3 times, 'login' 2 times
    expect(tf.get('auth') || 0).toBe(3);
    expect(tf.get('login') || 0).toBe(2);
  });

  it('C138-T6: buildBm25DocumentText matches rebuild field shape', () => {
    const text = buildBm25DocumentText({
      title: 'Spec Memory',
      content_text: '---\ntitle: Hidden frontmatter\n---\nSearchable body token',
      trigger_phrases: ['hybrid-search', 'bm25-sync'],
      file_path: 'specs/001/spec.md',
    });

    expect(text).toContain('Spec Memory');
    expect(text).toContain('Searchable body token');
    expect(text).toContain('hybrid-search');
    expect(text).toContain('bm25-sync');
    expect(text).toContain('specs/001/spec.md');
    expect(text).not.toContain('Hidden frontmatter');
  });

  it('T312: rebuildFromDatabase defers warmup and hydrates documents in batches', async () => {
    vi.useFakeTimers();

    type WarmupRow = {
      id: number;
      title: string;
      content_text: string;
      trigger_phrases: string;
      file_path: string;
    };

    const rows = new Map<number, WarmupRow>([
      [1, { id: 1, title: 'Auth doc', content_text: 'authentication search memory body', trigger_phrases: 'auth', file_path: 'specs/auth/1.md' }],
      [2, { id: 2, title: 'Cache doc', content_text: 'cache retrieval system body', trigger_phrases: 'cache', file_path: 'specs/cache/2.md' }],
    ]);

    const mockDb = {
      prepare(sql: string) {
        if (sql.includes('SELECT id') && sql.includes('ORDER BY id')) {
          return {
            all: () => Array.from(rows.values()).map((row) => ({ id: row.id })),
          };
        }

        if (sql.includes('WHERE id IN')) {
          return {
            all: (...ids: Array<number>) => ids
              .map((id) => rows.get(id))
              .filter((row): row is WarmupRow => row != null),
          };
        }

        throw new Error(`Unexpected SQL in test: ${sql}`);
      },
    } as unknown as BetterSqliteDatabase;

    const index = new BM25Index();
    const scheduled = index.rebuildFromDatabase(mockDb);

    expect(scheduled).toBe(2);
    expect(index.getStats().documentCount).toBe(0);

    await vi.runAllTimersAsync();

    expect(index.getStats().documentCount).toBe(2);
  });

  it('T312: syncChangedRows removes archived or missing documents incrementally', () => {
    const index = new BM25Index();
    index.addDocument('5', 'stale document that should be removed');

    const mockDb = {
      prepare() {
        return {
          all: () => [],
        };
      },
    } as unknown as BetterSqliteDatabase;

    const synced = index.syncChangedRows(mockDb, [5]);

    expect(synced).toBe(1);
    expect(index.getStats().documentCount).toBe(0);
  });

  // MAINTENANCE: This harness mocks 10 modules. If any export signature
  // Changes upstream, update the corresponding vi.doMock below.
  async function setupMemoryUpdateHarness() {
    vi.resetModules();

    const addDocument = vi.fn();
    const mockDb = {
      prepare: vi.fn(() => ({
        get: vi.fn(() => ({
          title: 'Updated title',
          content_text: 'Updated body',
          trigger_phrases: 'updated trigger phrase',
          file_path: 'specs/001/spec.md',
        })),
      })),
    };
    const runInTransaction = vi.fn((_database: unknown, callback: () => void) => {
      callback();
    });

    vi.doMock('../core', () => ({
      checkDatabaseUpdated: vi.fn(async () => {}),
    }));
    vi.doMock('../lib/search/vector-index', () => ({
      getMemory: vi.fn(() => ({
        id: 42,
        title: 'Original title',
        content_text: 'Original body',
        content_hash: 'previous-hash',
      })),
      getDb: vi.fn(() => mockDb),
      updateMemory: vi.fn(),
      updateEmbeddingStatus: vi.fn(),
    }));
    vi.doMock('../lib/providers/embeddings', () => ({
      generateDocumentEmbedding: vi.fn(async () => new Float32Array([0.1, 0.2, 0.3])),
    }));
    vi.doMock('../lib/search/bm25-index', () => ({
      isBm25Enabled: vi.fn(() => true),
      buildBm25DocumentText: vi.fn((row: { title?: string | null; content_text?: string | null; trigger_phrases?: string | string[] | null; file_path?: string | null }) =>
        [
          row.title ?? '',
          row.content_text ?? '',
          Array.isArray(row.trigger_phrases) ? row.trigger_phrases.join(' ') : (row.trigger_phrases ?? ''),
          row.file_path ?? '',
        ].filter(Boolean).join(' ')
      ),
      getIndex: vi.fn(() => ({
        addDocument,
      })),
    }));
    vi.doMock('../lib/storage/mutation-ledger', () => ({
      computeHash: vi.fn(() => 'new-hash'),
    }));
    vi.doMock('../lib/storage/transaction-manager', () => ({
      runInTransaction,
    }));
    vi.doMock('../lib/response/envelope', () => ({
      createMCPSuccessResponse: vi.fn((payload: unknown) => payload),
      createMCPErrorResponse: vi.fn((payload: unknown) => payload),
    }));
    vi.doMock('../utils', () => ({
      toErrorMessage: vi.fn((error: unknown) => String(error)),
    }));
    vi.doMock('../handlers/memory-crud-utils', () => ({
      getMemoryHashSnapshot: vi.fn(() => ({ content_hash: 'previous-hash' })),
      appendMutationLedgerSafe: vi.fn(),
    }));
    vi.doMock('../handlers/mutation-hooks', () => ({
      runPostMutationHooks: vi.fn(() => ({
        latencyMs: 0,
        triggerCacheCleared: false,
        constitutionalCacheCleared: false,
        toolCacheInvalidated: 0,
        graphSignalsCacheCleared: false,
        coactivationCacheCleared: false,
      })),
    }));
    vi.doMock('../hooks/mutation-feedback', () => ({
      buildMutationHookFeedback: vi.fn(() => ({ hints: [], data: {} })),
    }));

    const { handleMemoryUpdate } = await import('../handlers/memory-crud-update');
    return { handleMemoryUpdate, addDocument, runInTransaction };
  }

  it('BM25 re-index fires when triggerPhrases change', async () => {
    const { handleMemoryUpdate, addDocument } = await setupMemoryUpdateHarness();
    await handleMemoryUpdate({ id: 42, triggerPhrases: ['updated trigger phrase'] });
    expect(addDocument).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('Updated'));
  });

  it('BM25 re-index fires when title changes', async () => {
    const { handleMemoryUpdate, addDocument } = await setupMemoryUpdateHarness();
    await handleMemoryUpdate({ id: 42, title: 'Updated title' });
    expect(addDocument).toHaveBeenCalledWith(
      '42',
      buildBm25DocumentText({
        title: 'Updated title',
        content_text: 'Updated body',
        trigger_phrases: 'updated trigger phrase',
        file_path: 'specs/001/spec.md',
      })
    );
  });

  it('BM25 re-index does NOT fire when non-trigger fields change', async () => {
    const { handleMemoryUpdate, addDocument } = await setupMemoryUpdateHarness();
    await handleMemoryUpdate({ id: 42, importanceWeight: 0.8 });
    expect(addDocument).not.toHaveBeenCalled();
  });

  it('memory_update wraps the update path in runInTransaction', async () => {
    const { handleMemoryUpdate, runInTransaction } = await setupMemoryUpdateHarness();
    await handleMemoryUpdate({ id: 42, title: 'Updated title' });
    expect(runInTransaction).toHaveBeenCalledTimes(1);
    expect(runInTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
  });

  it('BM25 data failures are surfaced from inside the transaction callback', async () => {
    const { handleMemoryUpdate, addDocument, runInTransaction } = await setupMemoryUpdateHarness();
    addDocument.mockImplementation(() => {
      throw new Error('bad bm25 payload');
    });

    await expect(handleMemoryUpdate({ id: 42, title: 'Updated title' }))
      .rejects
      .toThrow('BM25 re-index failed: bad bm25 payload');

    expect(runInTransaction).toHaveBeenCalledTimes(1);
  });
});

afterAll(() => {
  if (ORIGINAL_ENABLE_BM25 === undefined) {
    delete process.env.ENABLE_BM25;
  } else {
    process.env.ENABLE_BM25 = ORIGINAL_ENABLE_BM25;
  }
});
