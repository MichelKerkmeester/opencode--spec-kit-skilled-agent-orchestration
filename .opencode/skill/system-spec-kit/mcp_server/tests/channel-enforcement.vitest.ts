// ───────────────────────────────────────────────────────────────
// 1. TEST — CHANNEL ENFORCEMENT
// ───────────────────────────────────────────────────────────────
// Channel Enforcement + Precision Verification (T003b + T003c)
//
// Coverage:
// T003b — Enforcement wrapper (enforceChannelRepresentation)
// T1:  enforcement applies when flag enabled and a channel is missing
// T2:  enforcement does not apply when flag is disabled
// T3:  topK parameter limits the inspection window
// T4:  promoted results are appended and metadata is correct
// T5:  promoted raw scores are normalized into the fused range before sorting
//
// T003c — Precision verification (R2 guarantee)
// T6:  all channels represented → top-3 unchanged (precision preserved)
// T7:  one channel missing → top-3 still contains high-scoring items
// T8:  promotions never displace items already in top-3 (appended)
// T9:  quality floor prevents low-quality promotions
// T10: multiple missing channels → each gets at most 1 promotion
// T11: R15+R2 interaction — ≥2 channels from router preserves R2 guarantee
//
// Edge cases
// T12: empty results → no crash
// T13: single result → no crash
// T14: all channel result sets empty → no enforcement needed
// T15: topK=0 → no enforcement (empty window), tail returned intact
// T16: topK larger than results → full list inspected
// T17: promoted items carry original extra fields
// T18: channelCounts in EnforcementResult cover full result list

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  enforceChannelRepresentation,
  type EnforcementResult,
} from '../lib/search/channel-enforcement';
import { QUALITY_FLOOR } from '../lib/search/channel-representation';

/* ───────────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────────────── */

const FEATURE_FLAG = 'SPECKIT_CHANNEL_MIN_REP';

const savedEnv: Record<string, string | undefined> = {};

function setEnv(key: string, value: string | undefined) {
  if (!(key in savedEnv)) savedEnv[key] = process.env[key];
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

function restoreEnv() {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  for (const key of Object.keys(savedEnv)) {
    delete savedEnv[key];
  }
}

type FusedResult = { id: number | string; score: number; source: string; sources?: string[]; [key: string]: unknown };
type ChannelResult = { id: number | string; score: number; [key: string]: unknown };

function makeFused(id: string, score: number, source: string, extra?: Partial<FusedResult>): FusedResult {
  return { id, score, source, ...extra };
}

function makeChannel(id: string, score: number, extra?: Partial<ChannelResult>): ChannelResult {
  return { id, score, ...extra };
}

/** Extract the top-N result IDs in order from an EnforcementResult. */
function topNIds(result: EnforcementResult, n: number): Array<string | number> {
  return result.results.slice(0, n).map(r => r.id);
}

/* ───────────────────────────────────────────────────────────────
   TESTS
   ──────────────────────────────────────────────────────────────── */

describe('T028 Channel Enforcement + Precision Verification', () => {
  beforeEach(() => {
    // Enable flag by default — most tests exercise the active path.
    setEnv(FEATURE_FLAG, 'true');
  });

  afterEach(() => {
    restoreEnv();
  });

  // ========== T003b: ENFORCEMENT WRAPPER TESTS ==========================

  // ---- T1: Enforcement applies when flag enabled and a channel is missing ----
  it('T1: enforcement applies when flag enabled and channel is missing', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.9, 'vector'),
      makeFused('b1', 0.8, 'bm25'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.9)]],
      ['bm25',   [makeChannel('b1', 0.8)]],
      ['graph',  [makeChannel('g1', 0.55)]],
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    expect(result.enforcement.applied).toBe(true);
    expect(result.enforcement.promotedCount).toBe(1);
    expect(result.enforcement.underRepresentedChannels).toContain('graph');
    expect(result.results).toHaveLength(3);
  });

  // ---- T2: Enforcement does not apply when flag is disabled ----
  it('T2: enforcement does not apply when flag is disabled', () => {
    setEnv(FEATURE_FLAG, 'false');

    const fused: FusedResult[] = [
      makeFused('a1', 0.9, 'vector'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.9)]],
      ['graph',  [makeChannel('g1', 0.7)]],
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    expect(result.enforcement.applied).toBe(false);
    expect(result.enforcement.promotedCount).toBe(0);
    expect(result.results).toHaveLength(1);
    expect(result.results[0].id).toBe('a1');
  });

  // ---- T3: topK parameter limits the inspection window ----
  it('T3: topK parameter limits the inspection window to the first N results', () => {
    // 5 results; graph is present at position 4 (outside window=3).
    // When window=3, graph should appear under-represented.
    const fused: FusedResult[] = [
      makeFused('a1', 0.95, 'vector'),
      makeFused('b1', 0.90, 'bm25'),
      makeFused('a2', 0.85, 'vector'),
      makeFused('g1', 0.80, 'graph'),  // position 4 — outside window
      makeFused('a3', 0.75, 'vector'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.95), makeChannel('a2', 0.85), makeChannel('a3', 0.75)]],
      ['bm25',   [makeChannel('b1', 0.90)]],
      ['graph',  [makeChannel('g1', 0.80), makeChannel('g2', 0.50)]],
    ]);

    const result = enforceChannelRepresentation(fused, channels, 3);

    // Graph was missing from the top-3 window → should have been promoted
    expect(result.enforcement.promotedCount).toBeGreaterThanOrEqual(1);
    expect(result.enforcement.underRepresentedChannels).toContain('graph');
    // Total results = 5 original + 1 promotion = 6 (g1 already in tail but a new
    // Promotion from g2 might be added, or g1 gets promoted into the window).
    // The key guarantee: window size was limited to 3 for analysis.
    expect(result.results.length).toBeGreaterThanOrEqual(5);
  });

  // ---- T4: Promoted results appended and metadata is correct ----
  it('T4: promoted results appear in results list and metadata reflects the promotion', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.9, 'vector'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.9)]],
      ['bm25',   [makeChannel('b1', 0.65, { title: 'BM25 Doc' })]],
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    expect(result.enforcement.promotedCount).toBe(1);
    expect(result.enforcement.underRepresentedChannels).toContain('bm25');
    const promoted = result.results.find(r => r.id === 'b1');
    expect(promoted).toBeDefined();
    expect(promoted?.source).toBe('bm25');
    // Extra fields should be preserved on the promoted item
    expect((promoted as Record<string, unknown>)?.title).toBe('BM25 Doc');
  });

  // ---- T5: Promoted raw scores are normalized into the fused range ----
  it('T5: promoted raw scores are normalized into the fused range before sorting', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.9, 'vector'),
      makeFused('b1', 0.7, 'bm25'),
    ];
    // The graph promotion uses a raw lexical-style score that would previously
    // dominate the normalized fused ranking.
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.9)]],
      ['bm25',   [makeChannel('b1', 0.7)]],
      ['graph',  [makeChannel('g1', 10)]],
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    expect(result.results).toHaveLength(3);
    const scores = result.results.map(r => r.score);
    // Verify descending order
    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
    }

    const promoted = result.results.find(r => r.id === 'g1') as Record<string, unknown> | undefined;
    expect(promoted).toBeDefined();
    expect(promoted?.promotedRawScore).toBe(10);
    expect(typeof promoted?.score).toBe('number');
    expect((promoted?.score as number)).toBeGreaterThanOrEqual(0.7);
    expect((promoted?.score as number)).toBeLessThanOrEqual(0.9);

    // The normalized promotion must no longer outrank the highest fused item.
    expect(result.results[0].id).toBe('a1');
    expect(result.results[2].id).toBe('g1');
  });

  // ========== T003c: PRECISION VERIFICATION TESTS =======================

  // ---- T6: All channels represented → top-3 unchanged (precision preserved) ----
  it('T6: all channels represented — top-3 is identical before and after enforcement', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.95, 'vector'),
      makeFused('b1', 0.88, 'bm25'),
      makeFused('g1', 0.80, 'graph'),
      makeFused('a2', 0.72, 'vector'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.95), makeChannel('a2', 0.72)]],
      ['bm25',   [makeChannel('b1', 0.88)]],
      ['graph',  [makeChannel('g1', 0.80)]],
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    // No promotions expected — all channels already represented.
    expect(result.enforcement.promotedCount).toBe(0);
    expect(result.results).toHaveLength(4);
    // Top-3 unchanged
    expect(topNIds(result, 3)).toEqual(['a1', 'b1', 'g1']);
  });

  // ---- T7: One channel missing → top-3 still contains high-scoring items ----
  it('T7: one channel missing — top-3 still contains the original high-scoring items', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.95, 'vector'),
      makeFused('b1', 0.88, 'bm25'),
      makeFused('a2', 0.78, 'vector'),
    ];
    // Graph is missing; its best result scores 0.40 (well below the top-3).
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.95), makeChannel('a2', 0.78)]],
      ['bm25',   [makeChannel('b1', 0.88)]],
      ['graph',  [makeChannel('g1', 0.40)]],
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    // Original top-3 items (a1, b1, a2) must still be present in positions 0-2.
    const topThree = result.results.slice(0, 3).map(r => r.id);
    expect(topThree).toContain('a1');
    expect(topThree).toContain('b1');
    expect(topThree).toContain('a2');

    // Promoted g1 (0.40) must appear AFTER the original top-3 because it scored lower.
    const g1Index = result.results.findIndex(r => r.id === 'g1');
    expect(g1Index).toBeGreaterThanOrEqual(3);
  });

  // ---- T8: Promotions never displace items already in top-3 (appended, not inserted) ----
  it('T8: promotions with lower scores are appended after the top-3, not inserted', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.93, 'vector'),
      makeFused('b1', 0.87, 'bm25'),
      makeFused('a2', 0.81, 'vector'),
    ];
    // Graph best result score < all top-3 items.
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.93), makeChannel('a2', 0.81)]],
      ['bm25',   [makeChannel('b1', 0.87)]],
      ['graph',  [makeChannel('g1', 0.30)]],
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    expect(result.results[0].id).toBe('a1');
    expect(result.results[1].id).toBe('b1');
    expect(result.results[2].id).toBe('a2');
    // Promoted g1 must be position 3 (appended).
    expect(result.results[3].id).toBe('g1');
  });

  // ---- T9: Quality floor prevents low-quality promotions ----
  it('T9: quality floor blocks promotions below 0.005, preventing low-quality pollution', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.9, 'vector'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.9)]],
      ['bm25',   [makeChannel('b1', 0.004)]],  // just below floor (0.005)
      ['graph',  [makeChannel('g1', 0.001)]],  // well below floor
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    // No promotions — both channels below quality floor.
    expect(result.enforcement.promotedCount).toBe(0);
    expect(result.results).toHaveLength(1);
    // Channels are still listed as under-represented (they tried but failed the floor).
    expect(result.enforcement.underRepresentedChannels).toContain('bm25');
    expect(result.enforcement.underRepresentedChannels).toContain('graph');
  });

  // ---- T10: Multiple missing channels — each gets at most 1 promotion ----
  it('T10: multiple missing channels — each receives at most 1 promotion', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.9, 'vector'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.9)]],
      ['bm25',   [makeChannel('b1', 0.70), makeChannel('b2', 0.60), makeChannel('b3', 0.50)]],
      ['graph',  [makeChannel('g1', 0.65), makeChannel('g2', 0.45)]],
      ['rerank', [makeChannel('r1', 0.55)]],
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    // 3 channels missing → 3 promotions max (one per channel)
    expect(result.enforcement.promotedCount).toBe(3);
    expect(result.results).toHaveLength(4); // 1 original + 3 promoted

    // Each promoted channel should contribute exactly 1 item.
    const bm25Count = result.results.filter(r => r.source === 'bm25').length;
    const graphCount = result.results.filter(r => r.source === 'graph').length;
    const rerankCount = result.results.filter(r => r.source === 'rerank').length;

    expect(bm25Count).toBe(1);
    expect(graphCount).toBe(1);
    expect(rerankCount).toBe(1);

    // Best from bm25 is b1 (0.70), best from graph is g1 (0.65).
    expect(result.results.find(r => r.source === 'bm25')?.id).toBe('b1');
    expect(result.results.find(r => r.source === 'graph')?.id).toBe('g1');
  });

  // ---- T11: R15+R2 interaction — min 2 channels from router preserves R2 guarantee ----
  it('T11: when router returns ≥2 channels both present in top-k, no promotion is triggered', () => {
    // R15 (router) guarantees at least 2 channels. R2 (channel min-rep) should
    // Be a no-op when those channels already appear in the top-k window.
    const fused: FusedResult[] = [
      makeFused('a1', 0.92, 'vector'),
      makeFused('b1', 0.85, 'bm25'),
      makeFused('a2', 0.79, 'vector'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.92), makeChannel('a2', 0.79)]],
      ['bm25',   [makeChannel('b1', 0.85)]],
      // No third channel — router only returned 2.
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    // Both router-selected channels are in top-k → no enforcement needed.
    expect(result.enforcement.promotedCount).toBe(0);
    expect(result.enforcement.underRepresentedChannels).toHaveLength(0);
    // Results unchanged.
    expect(result.results).toHaveLength(3);
    expect(result.results.map(r => r.id)).toEqual(['a1', 'b1', 'a2']);
  });

  // ========== EDGE CASES ================================================

  // ---- T12: Empty results → no crash ----
  it('T12: empty fusedResults — returns empty results without crashing', () => {
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.8)]],
    ]);

    const result = enforceChannelRepresentation([], channels);

    expect(result.results).toHaveLength(0);
    expect(result.enforcement.promotedCount).toBe(0);
    // AnalyzeChannelRepresentation returns [] on empty topK — no under-representation.
    expect(result.enforcement.underRepresentedChannels).toHaveLength(0);
  });

  // ---- T13: Single result → no crash ----
  it('T13: single fused result — returns correctly without crashing', () => {
    const fused: FusedResult[] = [makeFused('a1', 0.8, 'vector')];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.8)]],
      ['bm25',   [makeChannel('b1', 0.5)]],
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    expect(result.results.length).toBeGreaterThanOrEqual(1);
    expect(result.results[0].id).toBe('a1'); // original item still present
  });

  // ---- T14: All channel result sets empty → no enforcement needed ----
  it('T14: all channel result sets empty — no promotions, results pass through', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.8, 'vector'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', []],
      ['bm25',   []],
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    expect(result.enforcement.promotedCount).toBe(0);
    expect(result.enforcement.underRepresentedChannels).toHaveLength(0);
    expect(result.results).toHaveLength(1);
  });

  // ---- T15: topK=0 → empty window, tail returned intact ----
  it('T15: topK=0 — empty inspection window, full results returned without promotions', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.9, 'vector'),
      makeFused('b1', 0.8, 'bm25'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.9)]],
      ['bm25',   [makeChannel('b1', 0.8)]],
      ['graph',  [makeChannel('g1', 0.6)]],
    ]);

    const result = enforceChannelRepresentation(fused, channels, 0);

    // Window is empty — analyzeChannelRepresentation returns empty for empty topK.
    // Tail (all 2 items) should be returned unchanged.
    expect(result.results).toHaveLength(2);
    expect(result.enforcement.promotedCount).toBe(0);
  });

  // ---- T16: topK larger than results → full list inspected ----
  it('T16: topK larger than results length — full list is inspected, no out-of-bounds', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.9, 'vector'),
      makeFused('b1', 0.8, 'bm25'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.9)]],
      ['bm25',   [makeChannel('b1', 0.8)]],
      ['graph',  [makeChannel('g1', 0.5)]],
    ]);

    // TopK=100 but only 2 results — should not throw.
    expect(() => enforceChannelRepresentation(fused, channels, 100)).not.toThrow();

    const result = enforceChannelRepresentation(fused, channels, 100);
    expect(result.enforcement.promotedCount).toBe(1);
    expect(result.results).toHaveLength(3);
  });

  // ---- T17: Promoted items carry original extra fields ----
  it('T17: promoted items preserve extra fields from the channel result', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.9, 'vector'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.9)]],
      ['bm25',   [makeChannel('b1', 0.55, { title: 'Doc Title', content: 'Some content', rank: 2 })]],
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    const promotedB1 = result.results.find(r => r.id === 'b1') as Record<string, unknown> | undefined;
    expect(promotedB1).toBeDefined();
    expect(promotedB1?.title).toBe('Doc Title');
    expect(promotedB1?.content).toBe('Some content');
    expect(promotedB1?.rank).toBe(2);
  });

  // ---- T18: channelCounts in EnforcementResult cover full result list ----
  it('T18: channelCounts reflects per-channel counts across the full result list', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.9, 'vector'),
      makeFused('a2', 0.85, 'vector'),
      makeFused('b1', 0.80, 'bm25'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.9), makeChannel('a2', 0.85)]],
      ['bm25',   [makeChannel('b1', 0.80)]],
      ['graph',  [makeChannel('g1', 0.45)]],
    ]);

    const result = enforceChannelRepresentation(fused, channels);

    expect(result.enforcement.channelCounts['vector']).toBe(2);
    expect(result.enforcement.channelCounts['bm25']).toBe(1);
    // Graph was promoted → count should be 1
    expect(result.enforcement.channelCounts['graph']).toBe(1);

    // Total items = sum of all channel counts
    const total = Object.values(result.enforcement.channelCounts).reduce((s, v) => s + v, 0);
    expect(total).toBe(result.results.length);
  });

  // ---- Extra: QUALITY_FLOOR re-exported and usable ----
  it('SANITY: QUALITY_FLOOR is 0.005 and is exported from channel-representation', () => {
    expect(QUALITY_FLOOR).toBe(0.005);
  });

  it('T19: preserves global score order when topK is smaller than result list', () => {
    const fused: FusedResult[] = [
      makeFused('a1', 0.95, 'vector'),
      makeFused('b1', 0.90, 'bm25'),
      makeFused('a2', 0.85, 'vector'),
      makeFused('b2', 0.80, 'bm25'),
    ];
    const channels = new Map<string, ChannelResult[]>([
      ['vector', [makeChannel('a1', 0.95), makeChannel('a2', 0.85)]],
      ['bm25',   [makeChannel('b1', 0.90), makeChannel('b2', 0.80)]],
      ['graph',  [makeChannel('g1', 0.10)]],
    ]);

    const result = enforceChannelRepresentation(fused, channels, 1);
    const scores = result.results.map(r => r.score);

    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
    }
  });
});
