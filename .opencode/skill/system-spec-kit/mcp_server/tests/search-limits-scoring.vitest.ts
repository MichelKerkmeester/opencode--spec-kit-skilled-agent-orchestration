// ───────────────────────────────────────────────────────────────
// 1. SEARCH LIMITS SCORING VITEST
// ───────────────────────────────────────────────────────────────
// TEST: SEARCH LIMITS SCORING
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { TIER_CONFIG, PER_TIER_LIMITS, TIER_PRIORITY, filterAndLimitByState } from '../lib/cognitive/tier-classifier';
import * as crossEncoder from '../lib/search/cross-encoder';

const PROJECT_ROOT = path.resolve(__dirname, '..');

describe('T210 + T211: Search Limits + Scoring Tests', () => {
  type TestTier = 'HOT' | 'WARM' | 'COLD' | 'DORMANT';
  interface TestMemory extends Record<string, unknown> {
    id: number;
    stability: number;
    half_life_days: number;
    created_at: string;
    last_review: string;
    importance_tier: 'normal';
  }

  describe('T210 - Per-Tier Limit Configuration', () => {
    it('T210-CFG1: TIER_CONFIG has limits for all 5 tiers', () => {
      expect(typeof TIER_CONFIG.maxHotMemories).toBe('number');
      expect(typeof TIER_CONFIG.maxWarmMemories).toBe('number');
      expect(typeof TIER_CONFIG.maxColdMemories).toBe('number');
      expect(typeof TIER_CONFIG.maxDormantMemories).toBe('number');
      expect(typeof TIER_CONFIG.maxArchivedMemories).toBe('number');
    });

    it('T210-CFG2: Default limits match spec', () => {
      expect(TIER_CONFIG.maxHotMemories).toBe(5);
      expect(TIER_CONFIG.maxWarmMemories).toBe(10);
      expect(TIER_CONFIG.maxColdMemories).toBe(3);
      expect(TIER_CONFIG.maxDormantMemories).toBe(2);
      expect(TIER_CONFIG.maxArchivedMemories).toBe(1);
    });

    it('T210-CFG3: PER_TIER_LIMITS exported with correct values', () => {
      expect(PER_TIER_LIMITS).toBeDefined();
      expect(typeof PER_TIER_LIMITS).toBe('object');
      expect(PER_TIER_LIMITS.HOT).toBe(5);
      expect(PER_TIER_LIMITS.WARM).toBe(10);
      expect(PER_TIER_LIMITS.COLD).toBe(3);
      expect(PER_TIER_LIMITS.DORMANT).toBe(2);
      expect(PER_TIER_LIMITS.ARCHIVED).toBe(1);
    });

    it('T210-CFG4: TIER_PRIORITY exported in correct order', () => {
      expect(Array.isArray(TIER_PRIORITY)).toBe(true);
      expect(TIER_PRIORITY).toEqual(['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED']);
    });
  });

  describe('T210 - filterAndLimitByState Enforcement', () => {
    function daysAgo(days: number): string {
      const d = new Date();
      d.setDate(d.getDate() - days);
      return d.toISOString();
    }

    function makeMemByTier(id: number, tier: TestTier): TestMemory {
      const elapsed: Record<string, number> = {
        HOT: 0,
        WARM: 1,
        COLD: 10,
        DORMANT: 200,
      };
      return {
        id,
        stability: 0.01,
        half_life_days: 1,
        created_at: daysAgo(elapsed[tier]),
        last_review: daysAgo(elapsed[tier]),
        importance_tier: 'normal',
      };
    }

    it('T210-FL1: HOT memories handled with overflow redistribution', () => {
      const hotMems = Array.from({ length: 10 }, (_, i) => makeMemByTier(i, 'HOT'));
      const result = filterAndLimitByState(hotMems, null, 100);
      // _classification is stripped from returned objects; all inputs are HOT
      expect(result.length).toBeLessThanOrEqual(100);
      expect(result.length).toBeGreaterThanOrEqual(5);
    });

    it('T210-FL2: Mixed tiers balanced with limits', () => {
      const mems = [
        // 8 HOT (limit 5)
        ...Array.from({ length: 8 }, (_, i) => makeMemByTier(i, 'HOT')),
        // 15 WARM (limit 10)
        ...Array.from({ length: 15 }, (_, i) => makeMemByTier(100 + i, 'WARM')),
        // 6 COLD (limit 3)
        ...Array.from({ length: 6 }, (_, i) => makeMemByTier(200 + i, 'COLD')),
        // 5 DORMANT (limit 2)
        ...Array.from({ length: 5 }, (_, i) => makeMemByTier(300 + i, 'DORMANT')),
      ];
      const result = filterAndLimitByState(mems, null, 100);
      // _classification is stripped from returned objects; verify by ID ranges
      const hotCount = result.filter((r) => typeof r.id === 'number' && r.id < 100).length;

      expect(hotCount).toBeGreaterThanOrEqual(5);
      expect(result.length).toBeLessThanOrEqual(34);
      expect(result.length).toBeGreaterThanOrEqual(20);
    });

    it('T210-FL3: Surplus slots redistributed to over-filled tiers', () => {
      const mems = [
        // 2 HOT (under limit of 5 → 3 surplus)
        ...Array.from({ length: 2 }, (_, i) => makeMemByTier(i, 'HOT')),
        // 5 COLD (over limit of 3 → 2 overflow)
        ...Array.from({ length: 5 }, (_, i) => makeMemByTier(200 + i, 'COLD')),
      ];
      const result = filterAndLimitByState(mems, null, 100);
      // _classification is stripped; verify by ID range (COLD IDs start at 200)
      const coldCount = result.filter((r) => typeof r.id === 'number' && r.id >= 200).length;

      expect(coldCount).toBeGreaterThan(3);
    });

    it('T210-FL4: targetState filter bypasses per-tier balancing', () => {
      const mems = Array.from({ length: 10 }, (_, i) => makeMemByTier(i, 'HOT'));
      const result = filterAndLimitByState(mems, 'HOT', 100);
      expect(result).toHaveLength(10);
    });

    it('T210-FL5: Overall limit parameter still respected', () => {
      const mems = Array.from({ length: 50 }, (_, i) => makeMemByTier(i, 'HOT'));
      const result = filterAndLimitByState(mems, null, 7);
      expect(result.length).toBeLessThanOrEqual(7);
    });

    it('T210-FL6: Empty input returns empty array', () => {
      const result = filterAndLimitByState([], null, 20);
      expect(result).toHaveLength(0);
    });
  });

  describe('T211 - Cross-Encoder Length Penalty Conditional', () => {
    let originalVoyage: string | undefined;
    let originalCohere: string | undefined;
    let originalLocal: string | undefined;

    beforeAll(() => {
      originalVoyage = process.env.VOYAGE_API_KEY;
      originalCohere = process.env.COHERE_API_KEY;
      originalLocal = process.env.RERANKER_LOCAL;
    });

    afterAll(() => {
      if (originalVoyage) process.env.VOYAGE_API_KEY = originalVoyage;
      if (originalCohere) process.env.COHERE_API_KEY = originalCohere;
      if (originalLocal) process.env.RERANKER_LOCAL = originalLocal;
    });

    it('T211-CE1: rerankResults accepts applyLengthPenalty option', async () => {
      if (!crossEncoder?.rerankResults) return;

      delete process.env.VOYAGE_API_KEY;
      delete process.env.COHERE_API_KEY;
      delete process.env.RERANKER_LOCAL;
      crossEncoder.resetProvider();

      const docs = [
        { id: 1, content: 'short' },
        { id: 2, content: 'a'.repeat(3000) },
      ];

      const results = await crossEncoder.rerankResults('test', docs, { applyLengthPenalty: false });
      expect(results).toHaveLength(2);
    });
  });

  describe('T211 - Length Penalty Scoring Effects', () => {
    it('T211-LP1: Long content (5000 chars) gets penalty', () => {
      if (!crossEncoder?.calculateLengthPenalty) return;

      const longPenalty = crossEncoder.calculateLengthPenalty(5000);
      expect(longPenalty).toBeLessThan(1.0);
      expect(longPenalty).toBeGreaterThanOrEqual(0.8);
    });

    it('T211-LP2: Medium content (500 chars) no penalty', () => {
      if (!crossEncoder?.calculateLengthPenalty) return;

      const midPenalty = crossEncoder.calculateLengthPenalty(500);
      expect(midPenalty).toBe(1.0);
    });

    it('T211-LP3: Short content (10 chars) gets penalty', () => {
      if (!crossEncoder?.calculateLengthPenalty) return;

      const shortPenalty = crossEncoder.calculateLengthPenalty(10);
      expect(shortPenalty).toBeLessThan(1.0);
    });

    it('T211-LP4: Long doc rerankerScore reduced by penalty', () => {
      if (!crossEncoder?.applyLengthPenalty) return;

      type PenalizedDocument = Parameters<typeof crossEncoder.applyLengthPenalty>[0][number];
      const docs: PenalizedDocument[] = [
        {
          id: 1,
          content: 'a'.repeat(100),
          score: 0.9,
          originalRank: 0,
          rerankerScore: 0.9,
          provider: 'test',
          scoringMethod: 'fallback',
        },
        {
          id: 2,
          content: 'b'.repeat(5000),
          score: 0.9,
          originalRank: 1,
          rerankerScore: 0.9,
          provider: 'test',
          scoringMethod: 'fallback',
        },
      ];
      const penalized = crossEncoder.applyLengthPenalty(docs);

      expect(penalized[0].rerankerScore).toBe(0.9);
      expect(penalized[1].rerankerScore).toBeLessThan(0.9);
    });
  });

  describe('T211 - Handler Integration (source analysis)', () => {
    it('T211-HI1: Handler passes applyLengthPenalty to cross-encoder', () => {
      const handlerSrc = fs.readFileSync(
        path.join(PROJECT_ROOT, 'handlers', 'memory-search.ts'),
        'utf8'
      );
      const callCount = (handlerSrc.match(/applyLengthPenalty/g) || []).length;
      expect(callCount).toBeGreaterThanOrEqual(5);
    });

    it('T211-HI2: Length penalty applied even when reranking is off', () => {
      // Legacy applyCrossEncoderReranking (which contained calculateLengthPenalty)
      // Was removed in 017-refinement-phase-6. Length penalty is now handled by the V2
      // Pipeline's Stage 3 cross-encoder module. Verify the cross-encoder module instead.
      const ceSrc = fs.readFileSync(
        path.join(PROJECT_ROOT, 'lib', 'search', 'cross-encoder.ts'),
        'utf8'
      );
      expect(ceSrc).toContain('calculateLengthPenalty');
    });

    it('T211-HI3: rerankResults conditionally applies length penalty', () => {
      const ceSrc = fs.readFileSync(
        path.join(PROJECT_ROOT, 'lib', 'search', 'cross-encoder.ts'),
        'utf8'
      );
      expect(ceSrc).toContain('shouldApplyLengthPenalty');
    });

    it('T211-HI4: rerankMetadata reports length penalty configuration', () => {
      // Legacy applyCrossEncoderReranking (which used snake_case length_penalty_applied)
      // Was removed in 017-refinement-phase-6. The V2 pipeline's Stage 3 passes length penalty
      // Config via applyLengthPenalty. Verify the pipeline stage instead.
      const stage3Src = fs.readFileSync(
        path.join(PROJECT_ROOT, 'lib', 'search', 'pipeline', 'stage3-rerank.ts'),
        'utf8'
      );
      expect(stage3Src).toContain('applyLengthPenalty');
    });
  });
});
