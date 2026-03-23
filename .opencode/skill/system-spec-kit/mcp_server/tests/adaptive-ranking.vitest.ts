import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import {
  buildAdaptiveShadowProposal,
  ensureAdaptiveTables,
  getAdaptiveThresholdSnapshot,
  recordAdaptiveSignal,
  resetAdaptiveThresholdOverrides,
  resetAdaptiveState,
  summarizeAdaptiveSignalQuality,
  tuneAdaptiveThresholdsAfterEvaluation,
} from '../lib/cognitive/adaptive-ranking';

describe('Phase 4 adaptive ranking shadow proposals', () => {
  afterEach(() => {
    delete process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING;
    delete process.env.SPECKIT_MEMORY_ADAPTIVE_MODE;
    resetAdaptiveThresholdOverrides();
  });

  it('defaults adaptive ranking to disabled mode until explicitly enabled', () => {
    const db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'access', signalValue: 1 });

    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 0 });
  });

  it('records bounded shadow proposals without mutating production order', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    const db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 2, signalType: 'access', signalValue: 4 });
    recordAdaptiveSignal(db, { memoryId: 2, signalType: 'outcome', signalValue: 2 });
    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'correction', signalValue: 2 });

    const proposal = buildAdaptiveShadowProposal(db, 'test query', [
      { id: 1, score: 0.7, similarity: 70 },
      { id: 2, score: 0.68, similarity: 68 },
    ]);

    expect(proposal).not.toBeNull();
    expect(proposal?.mode).toBe('shadow');
    expect(proposal?.bounded).toBe(true);
    expect(proposal?.rows).toHaveLength(2);
    expect(proposal?.rows.some((row) => row.memoryId === 2 && row.shadowRank === 1)).toBe(true);
  });

  it('clears adaptive shadow state during rollback drills without reversing schema', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    process.env.SPECKIT_MEMORY_ADAPTIVE_MODE = 'promoted';

    const db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 7, signalType: 'access', signalValue: 2 });
    recordAdaptiveSignal(db, { memoryId: 7, signalType: 'outcome', signalValue: 1 });
    recordAdaptiveSignal(db, { memoryId: 9, signalType: 'correction', signalValue: 1 });

    const proposal = buildAdaptiveShadowProposal(db, 'rollback query', [
      { id: 7, score: 0.63, similarity: 63 },
      { id: 9, score: 0.61, similarity: 61 },
    ]);

    expect(proposal?.mode).toBe('promoted');
    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 3 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_shadow_runs').get()).toEqual({ count: 1 });

    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'false';
    delete process.env.SPECKIT_MEMORY_ADAPTIVE_MODE;

    expect(resetAdaptiveState(db)).toEqual({
      clearedSignals: 3,
      clearedRuns: 1,
    });

    recordAdaptiveSignal(db, { memoryId: 7, signalType: 'access', signalValue: 5 });

    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_shadow_runs').get()).toEqual({ count: 0 });
  });

  it('summarizes adaptive signal quality and threshold bounds', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    process.env.SPECKIT_MEMORY_ADAPTIVE_MODE = 'promoted';

    const db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 11, signalType: 'access', signalValue: 2 });
    recordAdaptiveSignal(db, { memoryId: 11, signalType: 'outcome', signalValue: 1.5 });
    recordAdaptiveSignal(db, { memoryId: 11, signalType: 'correction', signalValue: 0.5 });
    recordAdaptiveSignal(db, { memoryId: 12, signalType: 'access', signalValue: 4 });

    buildAdaptiveShadowProposal(db, 'quality summary query', [
      { id: 11, score: 0.7, similarity: 70 },
      { id: 12, score: 0.69, similarity: 69 },
    ]);

    expect(getAdaptiveThresholdSnapshot()).toEqual({
      maxAdaptiveDelta: 0.08,
      minSignalsForPromotion: 3,
      signalWeights: {
        access: 0.005,
        outcome: 0.02,
        correction: -0.03,
      },
    });

    expect(summarizeAdaptiveSignalQuality(db)).toEqual({
      totalSignals: 4,
      distinctMemories: 2,
      promotionReadyMemories: 1,
      shadowRunCount: 1,
      latestShadowMode: 'promoted',
      weightedSignalScore: 0.045,
      signalCounts: {
        access: 2,
        outcome: 1,
        correction: 1,
      },
      signalTotals: {
        access: 6,
        outcome: 1.5,
        correction: 0.5,
      },
    });
  });

  it('tunes thresholds after evaluation and applies them to promotion gating', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    process.env.SPECKIT_MEMORY_ADAPTIVE_MODE = 'promoted';

    const db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 2, signalType: 'outcome', signalValue: 3 });
    recordAdaptiveSignal(db, { memoryId: 2, signalType: 'outcome', signalValue: 2 });
    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'correction', signalValue: 1 });
    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'correction', signalValue: 1 });
    recordAdaptiveSignal(db, { memoryId: 3, signalType: 'access', signalValue: 1 });
    recordAdaptiveSignal(db, { memoryId: 3, signalType: 'access', signalValue: 1 });

    const beforeTuning = buildAdaptiveShadowProposal(db, 'threshold tuning query', [
      { id: 1, score: 0.72, similarity: 72 },
      { id: 2, score: 0.69, similarity: 69 },
      { id: 3, score: 0.67, similarity: 67 },
    ]);

    expect(beforeTuning?.promotedIds).toEqual([]);
    expect(beforeTuning?.maxDeltaApplied).toBe(0.08);
    expect(getAdaptiveThresholdSnapshot()).toEqual({
      maxAdaptiveDelta: 0.08,
      minSignalsForPromotion: 3,
      signalWeights: {
        access: 0.005,
        outcome: 0.02,
        correction: -0.03,
      },
    });

    const tuning = tuneAdaptiveThresholdsAfterEvaluation(db);
    expect(tuning.summary.totalSignals).toBe(6);
    expect(tuning.summary.distinctMemories).toBe(3);
    expect(tuning.summary.promotionReadyMemories).toBe(0);
    expect(tuning.summary.weightedSignalScore).toBeCloseTo(0.05, 6);
    expect(tuning.summary.signalCounts).toEqual({
      access: 2,
      outcome: 2,
      correction: 2,
    });
    expect(tuning.summary.signalTotals).toEqual({
      access: 2,
      outcome: 5,
      correction: 2,
    });
    expect(tuning.previous).toEqual({
      maxAdaptiveDelta: 0.08,
      minSignalsForPromotion: 3,
      signalWeights: {
        access: 0.005,
        outcome: 0.02,
        correction: -0.03,
      },
    });
    expect(tuning.next).toEqual({
      maxAdaptiveDelta: 0.1,
      minSignalsForPromotion: 2,
      signalWeights: {
        access: 0.005,
        outcome: 0.025,
        correction: -0.03,
      },
    });

    const afterTuning = buildAdaptiveShadowProposal(db, 'threshold tuning query', [
      { id: 1, score: 0.72, similarity: 72 },
      { id: 2, score: 0.69, similarity: 69 },
      { id: 3, score: 0.67, similarity: 67 },
    ]);

    expect(afterTuning?.maxDeltaApplied).toBe(0.1);
    expect(afterTuning?.promotedIds).toContain(2);
    expect(afterTuning?.promotedIds.length).toBeGreaterThan(0);
    expect(afterTuning?.rows.find((row) => row.memoryId === 2)).toMatchObject({
      shadowRank: 1,
      scoreDelta: 0.1,
    });
  });
});
