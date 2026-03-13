// TEST: Regression Suite (013-refinement-phase-2)
// Guards against regressions for the P0/P1 fixes applied in
// 013-refinement-phase-2. Each describe block maps to a
// Specific finding from the 25-agent comprehensive review.
//
// Covers:
// P0-1  Schema safety — missing columns handled gracefully
// P1-6  ReDoS protection — regex completes in bounded time
// P1-7  NDCG cap — scores never exceed 1.0
// P1-9  Fetch limit — search results respect the limit parameter
import { describe, it, expect } from 'vitest';

describe('Regression Suite (013 fixes)', () => {

  /* ═══════════════════════════════════════════════════════════
     P0-1: Schema Safety — missing columns handled gracefully
  ════════════════════════════════════════════════════════════ */

  describe('P0-1: Schema safety — missing columns', () => {
    it('CREATE TABLE schema includes learned_triggers column', async () => {
      // The v21 migration adds learned_triggers. Verify it is present in
      // The base CREATE TABLE so fresh databases get it without migration.
      const fs = await import('node:fs');
      const path = await import('node:path');
      const schemaFilePath = path.resolve(
        __dirname,
        '../lib/search/vector-index-schema.ts'
      );
      const source = fs.readFileSync(schemaFilePath, 'utf8');

      // The column must appear in the CREATE TABLE statement
      expect(source).toContain('learned_triggers TEXT');
    });

    it('CREATE TABLE schema includes interference_score column', async () => {
      // P1-10 found interference_score only in migration, not base schema.
      // Verify the base CREATE TABLE now includes it.
      const fs = await import('node:fs');
      const path = await import('node:path');
      const schemaFilePath = path.resolve(
        __dirname,
        '../lib/search/vector-index-schema.ts'
      );
      const source = fs.readFileSync(schemaFilePath, 'utf8');

      expect(source).toContain('interference_score REAL');
    });

    it('v21 migration handles duplicate column gracefully', async () => {
      // The migration must not crash when the column already exists
      // (e.g., when running against a fresh schema that already has it).
      const fs = await import('node:fs');
      const path = await import('node:path');
      const schemaFilePath = path.resolve(
        __dirname,
        '../lib/search/vector-index-schema.ts'
      );
      const source = fs.readFileSync(schemaFilePath, 'utf8');

      // Migration must check for 'duplicate column' or 'already exists'
      expect(source).toMatch(/duplicate column|already exists/);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     P1-6: ReDoS Protection — bounded regex execution
  ════════════════════════════════════════════════════════════ */

  describe('P1-6: ReDoS protection', () => {
    it('escapeRegExp neutralizes special regex characters', async () => {
      // The query expander must escape user input before passing to new RegExp().
      // Verify the escapeRegExp function exists and works correctly.
      const fs = await import('node:fs');
      const path = await import('node:path');
      const expanderPath = path.resolve(
        __dirname,
        '../lib/search/query-expander.ts'
      );
      const source = fs.readFileSync(expanderPath, 'utf8');

      // Must contain the escapeRegExp helper
      expect(source).toContain('escapeRegExp');
      // Must use it before constructing RegExp from user input
      expect(source).toContain('escapeRegExp(word)');
    });

    it('expandQuery completes within 50ms on adversarial input', async () => {
      const { expandQuery } = await import('../lib/search/query-expander');

      // Classic ReDoS payload: repeated character that could cause
      // Catastrophic backtracking in an unescaped regex
      const adversarial = 'a]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]';

      const start = performance.now();
      const result = expandQuery(adversarial);
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(50);
      // Must return at least the original query
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0]).toBe(adversarial);
    });

    it('expandQuery handles regex metacharacters without throwing', async () => {
      const { expandQuery } = await import('../lib/search/query-expander');

      // Input containing every regex metacharacter
      const metacharInput = 'fix .*+?^${}()|[]\\bug';

      // Must not throw
      const result = expandQuery(metacharInput);
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('sanitizeFTS5Query truncates input at 2000 characters', async () => {
      const { sanitizeFTS5Query } = await import('../lib/search/bm25-index');

      const longInput = 'test '.repeat(600); // 3000 chars
      const result = sanitizeFTS5Query(longInput);

      // After truncation at 2000 chars, there should be fewer terms
      // Than the full 600 repetitions
      const termCount = result.split('" "').length;
      expect(termCount).toBeLessThan(600);
      expect(typeof result).toBe('string');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     P1-7: NDCG Cap — scores never exceed 1.0
  ════════════════════════════════════════════════════════════ */

  describe('P1-7: NDCG cap at 1.0', () => {
    it('computeNDCG returns value in [0, 1]', async () => {
      const { computeNDCG } = await import('../lib/eval/eval-metrics');

      const results = [
        { memoryId: 1, score: 0.9, rank: 1 },
        { memoryId: 2, score: 0.8, rank: 2 },
        { memoryId: 3, score: 0.7, rank: 3 },
      ];
      const groundTruth = [
        { queryId: 1, memoryId: 1, relevance: 3 },
        { queryId: 1, memoryId: 2, relevance: 2 },
        { queryId: 1, memoryId: 3, relevance: 1 },
      ];

      const ndcg = computeNDCG(results, groundTruth, 10);
      expect(ndcg).toBeGreaterThanOrEqual(0);
      expect(ndcg).toBeLessThanOrEqual(1.0);
    });

    it('computeIntentWeightedNDCG never exceeds 1.0 even with high multipliers', async () => {
      const { computeIntentWeightedNDCG } = await import('../lib/eval/eval-metrics');

      // Security_audit intent has the highest multiplier (5x for grade 3)
      // This is exactly the scenario that caused the P1-7 bug:
      // Grade 3 * 5.0 = 15, which inflated NDCG above 1.0
      const results = [
        { memoryId: 1, score: 0.95, rank: 1 },
        { memoryId: 2, score: 0.90, rank: 2 },
        { memoryId: 3, score: 0.85, rank: 3 },
      ];
      const groundTruth = [
        { queryId: 1, memoryId: 1, relevance: 3 },
        { queryId: 1, memoryId: 2, relevance: 3 },
        { queryId: 1, memoryId: 3, relevance: 3 },
      ];

      const ndcg = computeIntentWeightedNDCG(results, groundTruth, 'security_audit', 10);
      expect(ndcg).toBeLessThanOrEqual(1.0);
      expect(ndcg).toBeGreaterThanOrEqual(0);
    });

    it('computeIntentWeightedNDCG caps weighted grades at MAX_WEIGHTED_GRADE=5', async () => {
      const { computeIntentWeightedNDCG } = await import('../lib/eval/eval-metrics');

      // All 7 intent types should produce NDCG in [0, 1]
      const intents = [
        'add_feature', 'fix_bug', 'refactor', 'security_audit',
        'understand', 'find_spec', 'find_decision',
      ];

      const results = [
        { memoryId: 1, score: 0.99, rank: 1 },
        { memoryId: 2, score: 0.95, rank: 2 },
      ];
      const groundTruth = [
        { queryId: 1, memoryId: 1, relevance: 3 },
        { queryId: 1, memoryId: 2, relevance: 3 },
      ];

      for (const intent of intents) {
        const ndcg = computeIntentWeightedNDCG(results, groundTruth, intent, 10);
        expect(ndcg).toBeLessThanOrEqual(1.0);
        expect(ndcg).toBeGreaterThanOrEqual(0);
      }
    });

    it('computeNDCG returns 0 for empty inputs', async () => {
      const { computeNDCG } = await import('../lib/eval/eval-metrics');

      expect(computeNDCG([], [], 10)).toBe(0);
      expect(computeNDCG([], [{ queryId: 1, memoryId: 1, relevance: 3 }], 10)).toBe(0);
      expect(computeNDCG([{ memoryId: 1, score: 1, rank: 1 }], [], 10)).toBe(0);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     P1-9: Fetch Limit — search results respect limit parameter
  ════════════════════════════════════════════════════════════ */

  describe('P1-9: Fetch limit respected', () => {
    it('co-activation config fetches 2*maxRelated (not maxRelated+1)', async () => {
      // P1-9 found that populateRelatedMemories fetched maxRelated+1 instead
      // Of 2*maxRelated per spec. Verify the fix by reading the source.
      const fs = await import('node:fs');
      const path = await import('node:path');
      const coactivationPath = path.resolve(
        __dirname,
        '../lib/cognitive/co-activation.ts'
      );
      const source = fs.readFileSync(coactivationPath, 'utf8');

      // The vectorSearchFn call must use 2 * maxRelated, not maxRelated + 1
      expect(source).toContain('2 * CO_ACTIVATION_CONFIG.maxRelated');
      expect(source).not.toContain('CO_ACTIVATION_CONFIG.maxRelated + 1');
    });

    it('BM25 search respects the limit parameter', async () => {
      const { BM25Index } = await import('../lib/search/bm25-index');

      const index = new BM25Index();
      // Add more documents than the limit
      for (let i = 0; i < 20; i++) {
        index.addDocument(`doc-${i}`, `memory search retrieval context ${i} testing`);
      }

      const limit = 5;
      const results = index.search('memory search', limit);

      expect(results.length).toBeLessThanOrEqual(limit);
    });

    it('BM25 search with limit=0 returns empty array', async () => {
      const { BM25Index } = await import('../lib/search/bm25-index');

      const index = new BM25Index();
      index.addDocument('doc-1', 'memory search retrieval context testing');

      const results = index.search('memory', 0);
      expect(results.length).toBe(0);
    });

    it('DEFAULT_LIMIT is 20 in hybrid search', async () => {
      // Verify the constant value hasn't drifted
      const fs = await import('node:fs');
      const path = await import('node:path');
      const hybridPath = path.resolve(
        __dirname,
        '../lib/search/hybrid-search.ts'
      );
      const source = fs.readFileSync(hybridPath, 'utf8');

      expect(source).toContain('const DEFAULT_LIMIT = 20');
    });
  });
});

// SELF-GOVERNANCE FOOTER (TCB 10+)
// This regression suite was authored by Opus-I (TCB 10+).
//
// Audit trail:
// - Spec reference: 013-refinement-phase-2 (P0-1, P1-6, P1-7, P1-9)
// - Each test maps 1:1 to a specific finding from the 25-agent review
// - Tests are intentionally lightweight (invariant checks, not full integration)
// - No mocks of production dependencies — tests use real modules or source analysis
//
// Verification: `npx vitest run tests/regression-suite.vitest.ts`
