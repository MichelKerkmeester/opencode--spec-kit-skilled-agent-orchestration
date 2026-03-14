// ───────────────────────────────────────────────────────────────
// 1. TEST — QUERY ROUTER-CHANNEL INTERACTION
// ───────────────────────────────────────────────────────────────
// Ensures that R15 complexity-based channel routing does NOT violate
// R2 channel-minimum representation.
//
// Key invariants:
// 1. R15 always routes to >= 2 channels (MIN_CHANNELS enforcement)
// 2. R2 can enforce diversity within whatever channel subset R15 provides
// 3. The two modules compose correctly in the pipeline

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  classifyQueryComplexity,
  type QueryComplexityTier,
} from '../lib/search/query-classifier';
import {
  routeQuery,
  getChannelSubset,
  enforceMinimumChannels,
  MIN_CHANNELS,
  DEFAULT_ROUTING_CONFIG,
  type ChannelName,
} from '../lib/search/query-router';
import {
  analyzeChannelRepresentation,
  isChannelMinRepEnabled,
  QUALITY_FLOOR,
} from '../lib/search/channel-representation';
import {
  enforceChannelRepresentation,
} from '../lib/search/channel-enforcement';

/* ───────────────────────────────────────────────────────────────
   TEST HELPERS
   ──────────────────────────────────────────────────────────────── */

/** Create a fused result item */
function makeFused(id: number, score: number, source: string) {
  return { id, score, source, sources: [source] };
}

/** Create a channel result */
function makeChannelResult(id: number, score: number) {
  return { id, score };
}

/** Save and restore env vars */
let savedEnv: Record<string, string | undefined> = {};
function saveEnv(...keys: string[]) {
  for (const key of keys) {
    savedEnv[key] = process.env[key];
  }
}
function restoreEnv() {
  for (const [key, val] of Object.entries(savedEnv)) {
    if (val === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = val;
    }
  }
  savedEnv = {};
}

/* ───────────────────────────────────────────────────────────────
   TESTS
   ──────────────────────────────────────────────────────────────── */

describe('T033: R15 + R2 Interaction Tests', () => {

  beforeEach(() => {
    saveEnv(
      'SPECKIT_COMPLEXITY_ROUTER',
      'SPECKIT_CHANNEL_MIN_REP',
      'SPECKIT_SCORE_NORMALIZATION',
    );
    // Disable score normalization for predictable RRF scores
    delete process.env.SPECKIT_SCORE_NORMALIZATION;
  });

  afterEach(() => {
    restoreEnv();
  });

  /* -- Section 1: R15 minimum channel guarantee -- */

  describe('R15 minimum channel guarantee', () => {

    it('T033-01: simple tier always routes to >= 2 channels', () => {
      process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
      const result = routeQuery('hello');
      expect(result.tier).toBe('simple');
      expect(result.channels.length).toBeGreaterThanOrEqual(MIN_CHANNELS);
      expect(result.channels.length).toBeGreaterThanOrEqual(2);
    });

    it('T033-02: moderate tier routes to >= 2 channels', () => {
      process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
      const result = routeQuery('search for memory context retrieval');
      expect(result.tier).toBe('moderate');
      expect(result.channels.length).toBeGreaterThanOrEqual(2);
    });

    it('T033-03: complex tier routes to all 5 channels', () => {
      process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
      const result = routeQuery('find all implementation details about the hybrid search pipeline including scoring normalization and channel representation enforcement mechanisms');
      expect(result.tier).toBe('complex');
      expect(result.channels.length).toBe(5);
    });

    it('T033-04: enforceMinimumChannels pads empty array to 2', () => {
      const padded = enforceMinimumChannels([]);
      expect(padded.length).toBeGreaterThanOrEqual(2);
      expect(padded).toContain('vector');
      expect(padded).toContain('fts');
    });

    it('T033-05: enforceMinimumChannels pads single channel to 2', () => {
      const padded = enforceMinimumChannels(['bm25'] as ChannelName[]);
      expect(padded.length).toBeGreaterThanOrEqual(2);
      expect(padded).toContain('bm25');
    });

    it('T033-06: simple tier default config has exactly 2 channels', () => {
      expect(DEFAULT_ROUTING_CONFIG.simple.length).toBe(2);
      expect(DEFAULT_ROUTING_CONFIG.simple).toContain('vector');
      expect(DEFAULT_ROUTING_CONFIG.simple).toContain('fts');
    });
  });

  /* -- Section 2: R2 within R15-routed channel subsets -- */

  describe('R2 diversity within R15 channel subsets', () => {

    it('T033-07: R2 with 2 channels (simple tier) — promotes missing channel', () => {
      process.env.SPECKIT_CHANNEL_MIN_REP = 'true';

      // Simulate simple tier: only vector and fts channels
      const channels: ChannelName[] = ['vector', 'fts'];

      // Top-K results only from vector (fts missing)
      const topK = [
        makeFused(1, 0.9, 'vector'),
        makeFused(2, 0.85, 'vector'),
        makeFused(3, 0.80, 'vector'),
      ];

      // Channel raw results (fts has results but none in top-k)
      const channelResults = new Map<string, Array<{ id: number | string; score: number }>>();
      channelResults.set('vector', [
        makeChannelResult(1, 0.9),
        makeChannelResult(2, 0.85),
        makeChannelResult(3, 0.80),
      ]);
      channelResults.set('fts', [
        makeChannelResult(10, 0.7),
        makeChannelResult(11, 0.5),
      ]);

      const result = analyzeChannelRepresentation(topK, channelResults);

      // R2 should detect fts is under-represented and promote from it
      expect(result.underRepresentedChannels).toContain('fts');
      expect(result.promoted.length).toBeGreaterThanOrEqual(1);
      expect(result.promoted[0].promotedFrom).toBe('fts');
      // Enhanced top-k should now include an fts result
      const ftsInTopK = result.topK.filter(r => r.source === 'fts');
      expect(ftsInTopK.length).toBeGreaterThanOrEqual(1);
    });

    it('T033-08: R2 with 3 channels (moderate tier) — promotes all missing channels', () => {
      process.env.SPECKIT_CHANNEL_MIN_REP = 'true';

      // Moderate tier: vector, fts, bm25
      const topK = [
        makeFused(1, 0.9, 'vector'),
        makeFused(2, 0.85, 'vector'),
        makeFused(3, 0.80, 'vector'),
      ];

      const channelResults = new Map<string, Array<{ id: number | string; score: number }>>();
      channelResults.set('vector', [
        makeChannelResult(1, 0.9),
        makeChannelResult(2, 0.85),
        makeChannelResult(3, 0.80),
      ]);
      channelResults.set('fts', [
        makeChannelResult(10, 0.65),
      ]);
      channelResults.set('bm25', [
        makeChannelResult(20, 0.55),
      ]);

      const result = analyzeChannelRepresentation(topK, channelResults);

      expect(result.underRepresentedChannels).toContain('fts');
      expect(result.underRepresentedChannels).toContain('bm25');
      expect(result.promoted.length).toBe(2);

      // Both fts and bm25 should now appear in top-k
      const sources = new Set(result.topK.map(r => r.source));
      expect(sources.has('fts')).toBe(true);
      expect(sources.has('bm25')).toBe(true);
    });

    it('T033-09: R2 with 5 channels (complex tier) — full pipeline diversity', () => {
      process.env.SPECKIT_CHANNEL_MIN_REP = 'true';

      // Complex tier: all 5 channels
      const topK = [
        makeFused(1, 0.95, 'vector'),
        makeFused(2, 0.90, 'vector'),
        makeFused(3, 0.85, 'fts'),
      ];

      const channelResults = new Map<string, Array<{ id: number | string; score: number }>>();
      channelResults.set('vector', [
        makeChannelResult(1, 0.95), makeChannelResult(2, 0.90),
      ]);
      channelResults.set('fts', [makeChannelResult(3, 0.85)]);
      channelResults.set('bm25', [makeChannelResult(10, 0.60)]);
      channelResults.set('graph', [makeChannelResult(20, 0.50)]);
      channelResults.set('degree', [makeChannelResult(30, 0.40)]);

      const result = analyzeChannelRepresentation(topK, channelResults);

      // Bm25, graph, degree should all be under-represented
      expect(result.underRepresentedChannels).toContain('bm25');
      expect(result.underRepresentedChannels).toContain('graph');
      expect(result.underRepresentedChannels).toContain('degree');
      expect(result.promoted.length).toBe(3);

      // After promotion, all 5 channels should be represented
      const sources = new Set(result.topK.map(r => r.source));
      expect(sources.size).toBe(5);
    });
  });

  /* -- Section 3: Pipeline enforcement wrapper -- */

  describe('Pipeline enforcement (channel-enforcement.ts)', () => {

    it('T033-10: enforceChannelRepresentation passes through when flag disabled', () => {
      process.env.SPECKIT_CHANNEL_MIN_REP = 'false';

      const fusedResults = [
        makeFused(1, 0.9, 'vector'),
        makeFused(2, 0.85, 'vector'),
      ];
      const channelResults = new Map<string, Array<{ id: number | string; score: number }>>();
      channelResults.set('vector', [makeChannelResult(1, 0.9)]);
      channelResults.set('fts', [makeChannelResult(10, 0.7)]);

      const result = enforceChannelRepresentation(fusedResults, channelResults);

      expect(result.enforcement.applied).toBe(false);
      expect(result.enforcement.promotedCount).toBe(0);
      expect(result.results.length).toBe(2);
    });

    it('T033-11: enforceChannelRepresentation promotes when flag enabled', () => {
      process.env.SPECKIT_CHANNEL_MIN_REP = 'true';

      const fusedResults = [
        makeFused(1, 0.9, 'vector'),
        makeFused(2, 0.85, 'vector'),
      ];
      const channelResults = new Map<string, Array<{ id: number | string; score: number }>>();
      channelResults.set('vector', [makeChannelResult(1, 0.9), makeChannelResult(2, 0.85)]);
      channelResults.set('fts', [makeChannelResult(10, 0.7)]);

      const result = enforceChannelRepresentation(fusedResults, channelResults);

      expect(result.enforcement.applied).toBe(true);
      expect(result.enforcement.promotedCount).toBe(1);
      expect(result.results.length).toBe(3); // 2 original + 1 promoted
      // Results should be sorted by score descending
      for (let i = 1; i < result.results.length; i++) {
        expect(result.results[i].score).toBeLessThanOrEqual(result.results[i - 1].score);
      }
    });

    it('T033-12: R2 does not promote below QUALITY_FLOOR', () => {
      process.env.SPECKIT_CHANNEL_MIN_REP = 'true';

      const topK = [
        makeFused(1, 0.9, 'vector'),
        makeFused(2, 0.85, 'vector'),
      ];

      const channelResults = new Map<string, Array<{ id: number | string; score: number }>>();
      channelResults.set('vector', [makeChannelResult(1, 0.9), makeChannelResult(2, 0.85)]);
      // Fts results are all below quality floor (0.005)
      channelResults.set('fts', [
        makeChannelResult(10, 0.003),
        makeChannelResult(11, 0.002),
      ]);

      const result = analyzeChannelRepresentation(topK, channelResults);

      // Fts is under-represented but nothing qualifies for promotion
      expect(result.underRepresentedChannels).toContain('fts');
      // No items should be promoted because all are below QUALITY_FLOOR
      const promotedFts = result.promoted.filter(p => p.promotedFrom === 'fts');
      expect(promotedFts.length).toBe(0);
    });

    it('T033-13: R2 handles channel with no results gracefully', () => {
      process.env.SPECKIT_CHANNEL_MIN_REP = 'true';

      const topK = [
        makeFused(1, 0.9, 'vector'),
      ];

      const channelResults = new Map<string, Array<{ id: number | string; score: number }>>();
      channelResults.set('vector', [makeChannelResult(1, 0.9)]);
      channelResults.set('fts', []); // Empty — should not be penalized

      const result = analyzeChannelRepresentation(topK, channelResults);

      // Fts returned nothing — should NOT be listed as under-represented
      expect(result.underRepresentedChannels).not.toContain('fts');
      expect(result.promoted.length).toBe(0);
    });
  });

  /* -- Section 4: Composition of R15 + R2 -- */

  describe('Full R15 + R2 composition', () => {

    it('T033-14: simple tier with R2 produces diverse results', () => {
      process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
      process.env.SPECKIT_CHANNEL_MIN_REP = 'true';

      // Step 1: R15 routes the query
      const route = routeQuery('hello');
      expect(route.tier).toBe('simple');
      expect(route.channels).toContain('vector');
      expect(route.channels).toContain('fts');
      expect(route.channels.length).toBe(2);

      // Step 2: Simulate fused results dominated by one channel
      const fusedResults = [
        makeFused(1, 0.9, 'vector'),
        makeFused(2, 0.85, 'vector'),
        makeFused(3, 0.80, 'vector'),
      ];

      // Only the routed channels should have results
      const channelResults = new Map<string, Array<{ id: number | string; score: number }>>();
      channelResults.set('vector', [
        makeChannelResult(1, 0.9),
        makeChannelResult(2, 0.85),
        makeChannelResult(3, 0.80),
      ]);
      channelResults.set('fts', [
        makeChannelResult(10, 0.65),
        makeChannelResult(11, 0.50),
      ]);

      // Step 3: R2 enforcement
      const enforcement = enforceChannelRepresentation(fusedResults, channelResults);

      expect(enforcement.enforcement.applied).toBe(true);
      expect(enforcement.enforcement.promotedCount).toBeGreaterThanOrEqual(1);

      // Both channels should be represented
      const sources = new Set(enforcement.results.map(r => r.source));
      expect(sources.has('vector')).toBe(true);
      expect(sources.has('fts')).toBe(true);
    });

    it('T033-15: complex tier with R2 enforces all-channel diversity', () => {
      process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
      process.env.SPECKIT_CHANNEL_MIN_REP = 'true';

      // Step 1: R15 routes the query to all channels
      const route = routeQuery('find all implementation details about the hybrid search pipeline including scoring normalization and channel representation enforcement mechanisms');
      expect(route.tier).toBe('complex');
      expect(route.channels.length).toBe(5);

      // Step 2: Fused results only from 2 channels
      const fusedResults = [
        makeFused(1, 0.95, 'vector'),
        makeFused(2, 0.90, 'vector'),
        makeFused(3, 0.85, 'fts'),
      ];

      // All 5 channels have results
      const channelResults = new Map<string, Array<{ id: number | string; score: number }>>();
      channelResults.set('vector', [makeChannelResult(1, 0.95), makeChannelResult(2, 0.90)]);
      channelResults.set('fts', [makeChannelResult(3, 0.85)]);
      channelResults.set('bm25', [makeChannelResult(10, 0.60)]);
      channelResults.set('graph', [makeChannelResult(20, 0.50)]);
      channelResults.set('degree', [makeChannelResult(30, 0.40)]);

      // Step 3: R2 enforcement
      const enforcement = enforceChannelRepresentation(fusedResults, channelResults);

      expect(enforcement.enforcement.applied).toBe(true);
      expect(enforcement.enforcement.promotedCount).toBe(3); // bm25, graph, degree

      // All 5 channels should be represented
      const sources = new Set(enforcement.results.map(r => r.source));
      expect(sources.size).toBe(5);
    });

    it('T033-16: when R15 is disabled, all channels run and R2 still works', () => {
      process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';
      process.env.SPECKIT_CHANNEL_MIN_REP = 'true';

      // When R15 flag disabled, routeQuery returns all 5 channels
      const route = routeQuery('simple query');
      expect(route.channels.length).toBe(5);

      // Fused results only from vector
      const fusedResults = [
        makeFused(1, 0.9, 'vector'),
      ];

      const channelResults = new Map<string, Array<{ id: number | string; score: number }>>();
      channelResults.set('vector', [makeChannelResult(1, 0.9)]);
      channelResults.set('fts', [makeChannelResult(10, 0.7)]);
      channelResults.set('bm25', [makeChannelResult(20, 0.5)]);

      const enforcement = enforceChannelRepresentation(fusedResults, channelResults);

      expect(enforcement.enforcement.applied).toBe(true);
      expect(enforcement.enforcement.promotedCount).toBe(2);
    });
  });
});
