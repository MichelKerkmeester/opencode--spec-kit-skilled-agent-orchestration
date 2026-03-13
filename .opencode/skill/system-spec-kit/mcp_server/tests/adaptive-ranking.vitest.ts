import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import {
  buildAdaptiveShadowProposal,
  ensureAdaptiveTables,
  recordAdaptiveSignal,
  resetAdaptiveState,
} from '../lib/cache/cognitive/adaptive-ranking';

describe('Phase 4 adaptive ranking shadow proposals', () => {
  afterEach(() => {
    delete process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING;
    delete process.env.SPECKIT_MEMORY_ADAPTIVE_MODE;
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

    delete process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING;
    delete process.env.SPECKIT_MEMORY_ADAPTIVE_MODE;

    expect(resetAdaptiveState(db)).toEqual({
      clearedSignals: 3,
      clearedRuns: 1,
    });

    recordAdaptiveSignal(db, { memoryId: 7, signalType: 'access', signalValue: 5 });

    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_shadow_runs').get()).toEqual({ count: 0 });
  });
});
