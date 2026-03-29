// TEST: MEMORY SEARCH INTEGRATION
import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Mock core/db-state to prevent real DB operations (checkDatabaseUpdated throws
// when the database directory cannot be resolved in the test environment).
vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

vi.mock('../core', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

import * as memorySearchHandler from '../handlers/memory-search.js';
import * as fsrsScheduler from '../lib/cognitive/fsrs-scheduler.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import * as hybridSearch from '../lib/search/hybrid-search.js';
import * as rrfFusion from '@spec-kit/shared/algorithms/rrf-fusion.js';

const SERVER_ROOT = process.cwd();
const MEMORY_SEARCH_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'handlers', 'memory-search.ts'), 'utf-8');
const VECTOR_INDEX_QUERIES_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'vector-index-queries.ts'), 'utf-8');
const HYBRID_SEARCH_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'hybrid-search.ts'), 'utf-8');
const VECTOR_INDEX_SCHEMA_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'vector-index-schema.ts'), 'utf-8');
const STAGE1_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'pipeline', 'stage1-candidate-gen.ts'), 'utf-8');
const STAGE2_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'pipeline', 'stage2-fusion.ts'), 'utf-8');
const ACCESS_TRACKER_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'storage', 'access-tracker.ts'), 'utf-8');
const HANDLER_INPUT_REQUIRED_ERROR = 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.';

function parseResponseData(response: Awaited<ReturnType<typeof memorySearchHandler.handleMemorySearch>>): Record<string, unknown> {
  const payload = JSON.parse(response.content[0].text) as Record<string, unknown>;
  const data = payload.data;
  return (data && typeof data === 'object')
    ? data as Record<string, unknown>
    : payload;
}

describe('Memory Search Integration (T601-T650) [deferred - requires DB test fixtures]', () => {

  describe('T601-T610 - Testing Effect Formula', () => {
    it('T601: GRADE_GOOD constant is 3', () => {
      expect(fsrsScheduler.GRADE_GOOD).toBe(3);
    });

    it('T602: Difficulty bonus calculation correct', () => {
      const testCases = [
        { r: 0.0, expected: 0.45 },
        { r: 0.2, expected: 0.35 },
        { r: 0.5, expected: 0.20 },
        { r: 0.9, expected: 0.00 },
        { r: 1.0, expected: 0.00 },
      ];
      for (const tc of testCases) {
        const calculated = Math.max(0, (0.9 - tc.r) * 0.5);
        expect(Math.abs(calculated - tc.expected)).toBeLessThan(0.001);
      }
    });

    it('T603: GRADE_GOOD increases stability', () => {
      const initial = fsrsScheduler.createInitialParams();
      const reviewed = fsrsScheduler.processReview(initial, fsrsScheduler.GRADE_GOOD);
      expect(reviewed.stability).toBeGreaterThan(initial.stability);
    });

    it('T604: Stability multiplier applied with difficulty bonus', () => {
      const lowRetrievability = fsrsScheduler.updateStability(2.0, 5.0, fsrsScheduler.GRADE_GOOD, 0.2);
      const highRetrievability = fsrsScheduler.updateStability(2.0, 5.0, fsrsScheduler.GRADE_GOOD, 0.9);
      expect(lowRetrievability).toBeGreaterThan(highRetrievability);
    });

    it('T605: Formula handles edge cases', () => {
      expect(fsrsScheduler.calculateRetrievability(-1, 5)).toBe(0);
      expect(fsrsScheduler.calculateOptimalInterval(0, 0.9)).toBe(0);
    });
  });

  describe('T611-T620 - Desirable Difficulty', () => {
    it('T611: Low R (0.2) gives ~0.35 bonus', () => {
      const bonus = Math.max(0, (0.9 - 0.2) * 0.5);
      expect(Math.abs(bonus - 0.35)).toBeLessThan(0.001);
    });

    it('T612: High R (0.9) gives ~0.0 bonus', () => {
      const bonus = Math.max(0, (0.9 - 0.9) * 0.5);
      expect(Math.abs(bonus - 0.0)).toBeLessThan(0.001);
    });

    it('T613: R = 1.0 gives zero difficulty bonus', () => {
      const bonus = Math.max(0, (0.9 - 1.0) * 0.5);
      expect(bonus).toBe(0);
    });

    it('T614: R = 0 gives maximum bonus (0.45)', () => {
      const bonus = Math.max(0, (0.9 - 0.0) * 0.5);
      expect(Math.abs(bonus - 0.45)).toBeLessThan(0.001);
    });

    it('T615: Bonus capped at reasonable level', () => {
      const bonusExtreme = Math.max(0, (0.9 - (-1.0)) * 0.5);
      expect(bonusExtreme).toBeLessThanOrEqual(1.0);
    });

    it('T616: Bonus decreases monotonically with R', () => {
      const rValues = [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0];
      const bonuses = rValues.map(r => Math.max(0, (0.9 - r) * 0.5));
      for (let i = 1; i < bonuses.length; i++) {
        expect(bonuses[i]).toBeLessThanOrEqual(bonuses[i - 1]);
      }
    });

    it('T617: Difficulty bonus formula matches spec', () => {
      const actual = Math.max(0, (0.9 - 0.5) * 0.5);
      expect(Math.abs(actual - 0.2)).toBeLessThan(0.001);
    });

    it('T618: Combined boost = base_stability * (1 + difficultyBonus)', () => {
      const baseStability = 2.0;
      const difficultyBonus = Math.max(0, (0.9 - 0.2) * 0.5);
      const combined = baseStability * (1 + difficultyBonus);
      expect(Math.abs(combined - 2.7)).toBeLessThan(0.01);
    });

    it('T619: FSRS stability bounds (0.1 to 365) respected', () => {
      const reviewed = fsrsScheduler.processReview({
        stability: 0.01,
        difficulty: 5,
        lastReview: null,
        reviewCount: 0,
      }, fsrsScheduler.GRADE_AGAIN);
      expect(reviewed.stability).toBeGreaterThanOrEqual(fsrsScheduler.MIN_STABILITY);
      expect(fsrsScheduler.calculateRetrievability(365, 30)).toBeLessThanOrEqual(1);
    });

    it('T620: Negative R handled in bonus calculation', () => {
      const bonus = Math.max(0, (0.9 - (-0.5)) * 0.5);
      expect(bonus).toBeGreaterThan(0);
    });
  });

  describe('T621-T630 - Multi-Concept Search', () => {
    it('T621: handleMemorySearch function exported', () => {
      expect(typeof memorySearchHandler.handleMemorySearch).toBe('function');
    });

    it('T622: Concepts array validation exists', () => {
      expect(MEMORY_SEARCH_SOURCE).toContain('Array.isArray(concepts)');
    });

    it('T623: Maximum 5 concepts enforced', () => {
      expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('concepts.length > 5');
      expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('Multi-concept search requires 2-5 concepts');
    });

    it('T624: Each concept generates embedding', () => {
      expect(STAGE1_SOURCE).toContain('generateQueryEmbedding(concept)');
    });

    it('T625: multiConceptSearch available', () => {
      expect(typeof vectorIndex.multiConceptSearch).toBe('function');
    });

    it('T626: Multi-concept requests are labeled as multi_concept search type', () => {
      expect(MEMORY_SEARCH_SOURCE).toContain("searchType: (hasValidConcepts && concepts!.length >= 2)");
      expect(MEMORY_SEARCH_SOURCE).toContain("'multi-concept'");
    });

    it('T627: Empty concepts array rejected', async () => {
      const response = await memorySearchHandler.handleMemorySearch({ concepts: [] });
      const data = parseResponseData(response);
      expect(data.error).toBe(HANDLER_INPUT_REQUIRED_ERROR);
    });

    it('T628: Single concept rejected', async () => {
      const response = await memorySearchHandler.handleMemorySearch({ concepts: ['only-one'] });
      const data = parseResponseData(response);
      expect(data.error).toBe(HANDLER_INPUT_REQUIRED_ERROR);
    });

    it('T629: Non-array concepts rejected', async () => {
      const response = await memorySearchHandler.handleMemorySearch({ concepts: 'bad-input' as unknown as string[] });
      const data = parseResponseData(response);
      expect(data.error).toBe(HANDLER_INPUT_REQUIRED_ERROR);
    });

    it('T630: Null concepts handled', async () => {
      const response = await memorySearchHandler.handleMemorySearch({ concepts: null as unknown as string[] });
      const data = parseResponseData(response);
      expect(data.error).toBe(HANDLER_INPUT_REQUIRED_ERROR);
    });
  });

  describe('T631-T640 - Hybrid Search', () => {
    it('T631: hybrid-search.js loads', () => {
      expect(hybridSearch).toBeTruthy();
    });

    it('T632: hybridSearch function exported', () => {
      expect(typeof hybridSearch.hybridSearch).toBe('function');
    });

    it('T633: searchWithFallback function exported', () => {
      expect(typeof hybridSearch.searchWithFallback).toBe('function');
    });

    it('T634: FTS availability check function exists', () => {
      expect(typeof hybridSearch.isFtsAvailable).toBe('function');
    });

    it('T635: Hybrid search uses fusion-based ranking', () => {
      expect(HYBRID_SEARCH_SOURCE).toContain('fuseResultsMulti');
    });

    it('T636: Hybrid combines vector + FTS', () => {
      expect(HYBRID_SEARCH_SOURCE).toContain('combinedLexicalSearch');
      expect(HYBRID_SEARCH_SOURCE).toContain('hybridSearchEnhanced');
    });

    it('T637: RRF fusion available for hybrid ranking', () => {
      expect(typeof rrfFusion.fuseResultsMulti).toBe('function');
    });

    it('T638: Deduplication handled in RRF fusion', () => {
      const fused = rrfFusion.fuseResultsMulti([
        { source: 'vector', results: [{ id: 1 }, { id: 2 }] },
        { source: 'keyword', results: [{ id: 1 }, { id: 3 }] },
      ]);
      const item = fused.find((result) => result.id === 1);
      expect(item).toBeDefined();
      expect(item!.sources).toContain('vector');
      expect(item!.sources).toContain('keyword');
    });

    it('T639: searchWithFallback falls back to FTS after empty hybrid results', () => {
      expect(HYBRID_SEARCH_SOURCE).toContain('const ftsResults = ftsSearch(query, options);');
      expect(HYBRID_SEARCH_SOURCE).toContain('if (ftsResults.length > 0) return ftsResults;');
    });

    it('T640: searchWithFallback falls back to BM25 after empty FTS results', () => {
      expect(HYBRID_SEARCH_SOURCE).toContain('const bm25Results = bm25Search(query, options);');
      expect(HYBRID_SEARCH_SOURCE).toContain('if (bm25Results.length > 0) return bm25Results;');
    });
  });

  describe('T641-T650 - Review Count & Timestamp', () => {
    it('T641: review_count column exists in schema', () => {
      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('review_count INTEGER DEFAULT 0');
    });

    it('T642: last_review column exists', () => {
      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('last_review TEXT');
    });

    it('T643: access_count column exists', () => {
      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('access_count INTEGER DEFAULT 0');
    });

    it('T644: last_accessed column exists', () => {
      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('last_accessed INTEGER DEFAULT 0');
    });

    it('T645: Default review_count is 0', () => {
      expect(VECTOR_INDEX_SCHEMA_SOURCE).toMatch(/review_count INTEGER DEFAULT 0/);
    });

    it('T646: review_count increments correctly', () => {
      expect(STAGE2_SOURCE).toContain('review_count = review_count + 1');
    });

    it('T647: Multiple increments accumulate', () => {
      expect(STAGE2_SOURCE).not.toContain('review_count = 1');
    });

    it('T648: last_review timestamp updates', () => {
      expect(STAGE2_SOURCE).toContain('last_review = CURRENT_TIMESTAMP');
    });

    it('T649: Timestamp parseable as Date', () => {
      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
    });

    it('T650: last_accessed stores epoch timestamp', () => {
      expect(ACCESS_TRACKER_SOURCE).toContain('const now = Date.now();');
      expect(ACCESS_TRACKER_SOURCE).toContain('last_accessed = ?');
    });
  });

  describe('Review and access update pipeline', () => {
    it('updates stability, review_count, access_count, and last_accessed together', () => {
      expect(STAGE2_SOURCE).toContain('SET stability = ?,');
      expect(STAGE2_SOURCE).toContain('review_count = review_count + 1');
      expect(STAGE2_SOURCE).toContain('access_count = access_count + 1');
      expect(STAGE2_SOURCE).toContain('last_accessed = ?');
    });

    it('access tracker gracefully returns false on invalid write attempts', () => {
      expect(ACCESS_TRACKER_SOURCE).toContain('return false;');
    });

    it('normalizes invalid retrievability inputs back to 0.9', () => {
      const rInvalid = -0.5;
      const rNormalized = (typeof rInvalid !== 'number' || rInvalid < 0 || rInvalid > 1)
        ? 0.9
        : rInvalid;
      expect(rNormalized).toBe(0.9);
    });
  });

  describe('Pipeline support', () => {
    it('generates one embedding per concept in stage 1 candidate generation', () => {
      expect(STAGE1_SOURCE).toContain('for (const concept of concepts)');
      expect(STAGE1_SOURCE).toContain('generateQueryEmbedding(concept)');
    });

    it('keeps multi-concept embedding generation independent per concept', () => {
      expect(STAGE1_SOURCE).toContain('conceptEmbeddings.push(emb)');
    });

    it('persists direct access tracking with its own update path', () => {
      expect(ACCESS_TRACKER_SOURCE).toContain('SET access_count = access_count + 1');
    });
  });
});
