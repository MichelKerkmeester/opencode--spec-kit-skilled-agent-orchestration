// ───────────────────────────────────────────────────────────────
// 1. TEST — CHANNEL REPRESENTATION
// ───────────────────────────────────────────────────────────────
// 15 tests covering:
// All-represented, one-missing, floor-boundary, multi-missing,
// No-results-not-penalised, empty-topk, flag-disabled,
// Promotion-metadata, channel-counts, exact-floor-threshold

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  analyzeChannelRepresentation,
  isChannelMinRepEnabled,
  QUALITY_FLOOR,
} from '../lib/search/channel-representation';

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
  // Clear tracked keys so next test starts fresh
  for (const key of Object.keys(savedEnv)) {
    delete savedEnv[key];
  }
}

type TopKItem = { id: number | string; score: number; source: string; sources?: string[]; [key: string]: unknown };
type ChannelResult = { id: number | string; score: number; [key: string]: unknown };

function makeTopKItem(id: string, score: number, source: string, extra?: Partial<TopKItem>): TopKItem {
  return { id, score, source, ...extra };
}

function makeChannelResult(id: string, score: number, extra?: Partial<ChannelResult>): ChannelResult {
  return { id, score, ...extra };
}

/* ───────────────────────────────────────────────────────────────
   TESTS
   ──────────────────────────────────────────────────────────────── */

describe('T024 Channel Representation Check', () => {
  beforeEach(() => {
    // Enable flag by default — most tests exercise the active path.
    setEnv(FEATURE_FLAG, 'true');
  });

  afterEach(() => {
    restoreEnv();
  });

  // ---- T1: All channels represented — no promotions ----
  it('T1: all channels represented in topK — returns no promotions', () => {
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
      makeTopKItem('b1', 0.8, 'bm25'),
      makeTopKItem('c1', 0.7, 'graph'),
    ];
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.9), makeChannelResult('a2', 0.6)]],
      ['bm25',   [makeChannelResult('b1', 0.8)]],
      ['graph',  [makeChannelResult('c1', 0.7)]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.promoted).toHaveLength(0);
    expect(result.underRepresentedChannels).toHaveLength(0);
    expect(result.topK).toHaveLength(3);
  });

  // ---- T2: One channel missing from topK but has qualifying results → promotes best ----
  it('T2: one channel missing from topK — promotes its best qualifying result', () => {
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
      makeTopKItem('b1', 0.8, 'bm25'),
    ];
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.9)]],
      ['bm25',   [makeChannelResult('b1', 0.8)]],
      ['graph',  [makeChannelResult('g1', 0.5), makeChannelResult('g2', 0.3)]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.promoted).toHaveLength(1);
    expect(result.promoted[0].id).toBe('g1');         // highest score in channel
    expect(result.promoted[0].promotedFrom).toBe('graph');
    expect(result.topK).toHaveLength(3);
    expect(result.underRepresentedChannels).toContain('graph');
  });

  // ---- T3: Channel missing but its best result is below quality floor — no promotion ----
  it('T3: channel missing and best result below quality floor — no promotion', () => {
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
    ];
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.9)]],
      ['graph',  [makeChannelResult('g1', 0.004), makeChannelResult('g2', 0.001)]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.promoted).toHaveLength(0);
    expect(result.topK).toHaveLength(1); // unchanged
    // Channel is still listed as under-represented even if not promoted
    expect(result.underRepresentedChannels).toContain('graph');
  });

  // ---- T4: Multiple channels under-represented — promotes from each ----
  it('T4: multiple channels under-represented — promotes best from each', () => {
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
    ];
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.9)]],
      ['bm25',   [makeChannelResult('b1', 0.6), makeChannelResult('b2', 0.4)]],
      ['graph',  [makeChannelResult('g1', 0.5)]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.promoted).toHaveLength(2);
    expect(result.topK).toHaveLength(3);

    const promotedChannels = result.promoted.map(p => p.promotedFrom);
    expect(promotedChannels).toContain('bm25');
    expect(promotedChannels).toContain('graph');

    // Best from bm25 is b1 (0.6)
    const bm25Promotion = result.promoted.find(p => p.promotedFrom === 'bm25');
    expect(bm25Promotion?.id).toBe('b1');
  });

  // ---- T5: Channel returned no results at all — not considered under-represented ----
  it('T5: channel with no results at all — not flagged as under-represented', () => {
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
    ];
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.9)]],
      ['bm25',   []], // contributed nothing
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.underRepresentedChannels).not.toContain('bm25');
    expect(result.promoted).toHaveLength(0);
  });

  // ---- T6: Empty topK — returns empty without crash ----
  it('T6: empty topK — returns empty result without crashing', () => {
    const topK: TopKItem[] = [];
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.8)]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.topK).toHaveLength(0);
    expect(result.promoted).toHaveLength(0);
    expect(result.underRepresentedChannels).toHaveLength(0);
  });

  // ---- T7: Feature flag disabled — returns topK unchanged ----
  it('T7: feature flag disabled — returns topK unchanged with no promotions', () => {
    setEnv(FEATURE_FLAG, 'false');

    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
    ];
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.9)]],
      ['graph',  [makeChannelResult('g1', 0.7)]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.topK).toHaveLength(1);
    expect(result.promoted).toHaveLength(0);
    expect(result.underRepresentedChannels).toHaveLength(0);
  });

  // ---- T8: Promoted results include correct metadata (promotedFrom field) ----
  it('T8: promoted result has correct promotedFrom and source metadata', () => {
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
    ];
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.9)]],
      ['bm25',   [makeChannelResult('b1', 0.55, { title: 'BM25 Doc' })]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.promoted).toHaveLength(1);
    const p = result.promoted[0];
    expect(p.promotedFrom).toBe('bm25');
    expect(p.source).toBe('bm25');
    expect(p.id).toBe('b1');
    expect(p.score).toBe(0.55);
    expect((p as Record<string, unknown>).title).toBe('BM25 Doc'); // extra fields preserved
  });

  // ---- T9: Channel counts are accurate in output ----
  it('T9: channelCounts accurately reflects final topK composition', () => {
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
      makeTopKItem('a2', 0.85, 'vector'),
      makeTopKItem('b1', 0.8, 'bm25'),
    ];
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.9), makeChannelResult('a2', 0.85)]],
      ['bm25',   [makeChannelResult('b1', 0.8)]],
      ['graph',  [makeChannelResult('g1', 0.45)]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.channelCounts['vector']).toBe(2);
    expect(result.channelCounts['bm25']).toBe(1);
    // Graph was promoted — its count should now be 1
    expect(result.channelCounts['graph']).toBe(1);
  });

  // ---- T10: Quality floor exact threshold — 0.005 passes, 0.004 fails ----
  it('T10: quality floor is exact — score 0.005 qualifies, 0.004 does not', () => {
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
    ];

    // Test with a result at exactly QUALITY_FLOOR
    const atFloor = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.9)]],
      ['graph',  [makeChannelResult('g1', QUALITY_FLOOR)]],   // exactly QUALITY_FLOOR (0.005)
    ]);
    const resultAtFloor = analyzeChannelRepresentation(topK, atFloor);
    expect(resultAtFloor.promoted).toHaveLength(1);
    expect(resultAtFloor.promoted[0].id).toBe('g1');

    // Test with a result just below the floor
    const belowFloor = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.9)]],
      ['graph',  [makeChannelResult('g1', 0.004)]],            // just below 0.005
    ]);
    const resultBelowFloor = analyzeChannelRepresentation(topK, belowFloor);
    expect(resultBelowFloor.promoted).toHaveLength(0);
  });

  // ---- T11: Promotes the BEST result (highest score) from each channel ----
  it('T11: promotes the highest-scoring qualifying result from under-represented channel', () => {
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
    ];
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.9)]],
      ['graph',  [
        makeChannelResult('g3', 0.21),
        makeChannelResult('g1', 0.55),  // highest
        makeChannelResult('g2', 0.45),
      ]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.promoted).toHaveLength(1);
    expect(result.promoted[0].id).toBe('g1'); // g1 has the highest score
  });

  // ---- T12: Empty allChannelResults — returns topK unchanged ----
  it('T12: empty allChannelResults — returns topK unchanged', () => {
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
    ];
    const allChannelResults = new Map<string, ChannelResult[]>();

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.topK).toHaveLength(1);
    expect(result.promoted).toHaveLength(0);
    expect(result.underRepresentedChannels).toHaveLength(0);
  });

  // ---- T13: isChannelMinRepEnabled reflects env var correctly ----
  it('T13: isChannelMinRepEnabled returns true when env var is set to "true"', () => {
    setEnv(FEATURE_FLAG, 'true');
    expect(isChannelMinRepEnabled()).toBe(true);

    setEnv(FEATURE_FLAG, 'false');
    expect(isChannelMinRepEnabled()).toBe(false);

    setEnv(FEATURE_FLAG, '0');
    expect(isChannelMinRepEnabled()).toBe(false);

    setEnv(FEATURE_FLAG, undefined);
    expect(isChannelMinRepEnabled()).toBe(true); // graduated: default ON
  });

  // ---- T14: Multi-source items (sources array) count for all listed channels ----
  it('T14: topK item with sources array counts toward all listed channels', () => {
    // Item a1 is in both vector and bm25 via convergence
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.95, 'vector', { sources: ['vector', 'bm25'] }),
    ];
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.95)]],
      ['bm25',   [makeChannelResult('a1', 0.90), makeChannelResult('b1', 0.50)]],
      ['graph',  [makeChannelResult('g1', 0.40)]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    // Bm25 is represented via the sources array — should NOT be under-represented
    expect(result.underRepresentedChannels).not.toContain('bm25');
    // Graph is missing — should be promoted
    expect(result.underRepresentedChannels).toContain('graph');
    expect(result.promoted).toHaveLength(1);
    expect(result.promoted[0].promotedFrom).toBe('graph');
  });

  // ---- T15: QUALITY_FLOOR constant is exactly 0.005 ----
  it('T15: QUALITY_FLOOR constant is exactly 0.005', () => {
    expect(QUALITY_FLOOR).toBe(0.005);
  });

  // ---- T16: Core function appends promoted items without re-sorting (architectural contract) ----
  it('T16: promoted items are appended at the end — core function does NOT re-sort', () => {
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
      makeTopKItem('b1', 0.5, 'bm25'),
    ];
    // Graph has a higher score than b1 — if re-sorted it would appear before b1
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.9)]],
      ['bm25',   [makeChannelResult('b1', 0.5)]],
      ['graph',  [makeChannelResult('g1', 0.75)]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.topK).toHaveLength(3);
    // Promoted g1 (0.75) must be at the END, after b1 (0.5), proving no re-sort occurred.
    // The caller (channel-enforcement.ts) is responsible for re-sorting.
    expect(result.topK[0].id).toBe('a1');
    expect(result.topK[1].id).toBe('b1');
    expect(result.topK[2].id).toBe('g1');
  });

  // ---- T17: Under-represented channel detection works for multiple missing channels ----
  it('T17: correctly identifies all under-represented channels from channel map', () => {
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
    ];
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector',  [makeChannelResult('a1', 0.9)]],
      ['bm25',    [makeChannelResult('b1', 0.6)]],
      ['graph',   [makeChannelResult('g1', 0.5)]],
      ['trigger', [makeChannelResult('t1', 0.4)]],
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.underRepresentedChannels).toHaveLength(3);
    expect(result.underRepresentedChannels).toContain('bm25');
    expect(result.underRepresentedChannels).toContain('graph');
    expect(result.underRepresentedChannels).toContain('trigger');
    expect(result.underRepresentedChannels).not.toContain('vector');
  });

  // ---- T18: Mixed quality floor — some channels qualify, some don't ----
  it('T18: only channels with results above QUALITY_FLOOR are promoted', () => {
    const topK: TopKItem[] = [
      makeTopKItem('a1', 0.9, 'vector'),
    ];
    const allChannelResults = new Map<string, ChannelResult[]>([
      ['vector', [makeChannelResult('a1', 0.9)]],
      ['bm25',   [makeChannelResult('b1', 0.6)]],       // above floor → promoted
      ['graph',  [makeChannelResult('g1', 0.003)]],      // below floor → NOT promoted
    ]);

    const result = analyzeChannelRepresentation(topK, allChannelResults);

    expect(result.promoted).toHaveLength(1);
    expect(result.promoted[0].promotedFrom).toBe('bm25');
    expect(result.topK).toHaveLength(2); // original + 1 promoted
    // Graph is under-represented but could not promote due to quality floor
    expect(result.underRepresentedChannels).toContain('graph');
  });
});
