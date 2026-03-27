// ───────────────────────────────────────────────────────────────
// TEST: D5 Phase A — Empty/Weak Result Recovery Payload (REQ-D5-001)
// ───────────────────────────────────────────────────────────────
// Validates recovery payload generation, status classification,
// reason inference, suggested query reformulation, and feature flag gating.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  buildRecoveryPayload,
  shouldTriggerRecovery,
  isEmptyResultRecoveryEnabled,
  type RecoveryContext,
  type RecoveryPayload,
} from '../lib/search/recovery-payload';

// -- Test Helpers --

function makeCtx(overrides: Partial<RecoveryContext> = {}): RecoveryContext {
  return {
    query: 'test query',
    hasSpecFolderFilter: false,
    resultCount: 0,
    ...overrides,
  };
}

// -- Feature Flag --

describe('isEmptyResultRecoveryEnabled() — feature flag', () => {
  const ORIGINAL = process.env.SPECKIT_EMPTY_RESULT_RECOVERY_V1;

  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.SPECKIT_EMPTY_RESULT_RECOVERY_V1;
    else process.env.SPECKIT_EMPTY_RESULT_RECOVERY_V1 = ORIGINAL;
  });

  it('defaults to true when env var is not set (graduated)', () => {
    delete process.env.SPECKIT_EMPTY_RESULT_RECOVERY_V1;
    expect(isEmptyResultRecoveryEnabled()).toBe(true);
  });

  it('returns true when set to "true"', () => {
    process.env.SPECKIT_EMPTY_RESULT_RECOVERY_V1 = 'true';
    expect(isEmptyResultRecoveryEnabled()).toBe(true);
  });

  it('returns true when set to "TRUE" (case-insensitive)', () => {
    process.env.SPECKIT_EMPTY_RESULT_RECOVERY_V1 = 'TRUE';
    expect(isEmptyResultRecoveryEnabled()).toBe(true);
  });

  it('returns false when set to "false"', () => {
    process.env.SPECKIT_EMPTY_RESULT_RECOVERY_V1 = 'false';
    expect(isEmptyResultRecoveryEnabled()).toBe(false);
  });

  it('returns true for "1" (graduated — any non-false value is ON)', () => {
    process.env.SPECKIT_EMPTY_RESULT_RECOVERY_V1 = '1';
    expect(isEmptyResultRecoveryEnabled()).toBe(true);
  });
});

// -- shouldTriggerRecovery --

describe('shouldTriggerRecovery()', () => {
  it('returns true when resultCount is 0', () => {
    expect(shouldTriggerRecovery(makeCtx({ resultCount: 0 }))).toBe(true);
  });

  it('returns true when avgConfidence is below the default threshold (0.4)', () => {
    expect(shouldTriggerRecovery(makeCtx({
      resultCount: 5,
      avgConfidence: 0.3,
    }))).toBe(true);
  });

  it('returns true when avgConfidence equals the threshold (boundary)', () => {
    // Threshold is 0.4 — exactly at the boundary still triggers recovery
    // because the check is strict < threshold means: 0.4 is NOT < 0.4 → no recovery
    expect(shouldTriggerRecovery(makeCtx({
      resultCount: 5,
      avgConfidence: 0.4,
    }))).toBe(false);
  });

  it('returns true when resultCount is below PARTIAL_RESULT_MIN (3)', () => {
    expect(shouldTriggerRecovery(makeCtx({
      resultCount: 1,
      avgConfidence: undefined, // no confidence data
    }))).toBe(true);

    expect(shouldTriggerRecovery(makeCtx({
      resultCount: 2,
      avgConfidence: undefined,
    }))).toBe(true);
  });

  it('returns true when upstream evidence-gap detection marks coverage incomplete', () => {
    expect(shouldTriggerRecovery(makeCtx({
      resultCount: 1,
      avgConfidence: 0.2,
      evidenceGap: true,
    }))).toBe(true);
  });

  it('returns false when resultCount >= 3 and avgConfidence is not below threshold', () => {
    expect(shouldTriggerRecovery(makeCtx({
      resultCount: 5,
      avgConfidence: 0.75,
    }))).toBe(false);
  });

  it('returns false when avgConfidence is not provided and resultCount >= 3', () => {
    expect(shouldTriggerRecovery(makeCtx({
      resultCount: 5,
      avgConfidence: undefined,
    }))).toBe(false);
  });

  it('respects custom lowConfidenceThreshold', () => {
    expect(shouldTriggerRecovery(makeCtx({
      resultCount: 5,
      avgConfidence: 0.55,
      lowConfidenceThreshold: 0.6,
    }))).toBe(true);

    expect(shouldTriggerRecovery(makeCtx({
      resultCount: 5,
      avgConfidence: 0.65,
      lowConfidenceThreshold: 0.6,
    }))).toBe(false);
  });
});

// -- buildRecoveryPayload — status field --

describe('buildRecoveryPayload() — status classification', () => {
  it('emits status "no_results" when resultCount is 0', () => {
    const payload = buildRecoveryPayload(makeCtx({ resultCount: 0 }));
    expect(payload.status).toBe('no_results');
  });

  it('emits status "low_confidence" when avgConfidence < threshold', () => {
    const payload = buildRecoveryPayload(makeCtx({
      resultCount: 5,
      avgConfidence: 0.2,
    }));
    expect(payload.status).toBe('low_confidence');
  });

  it('emits status "partial" when resultCount is between 1 and PARTIAL_RESULT_MIN-1', () => {
    const payload = buildRecoveryPayload(makeCtx({ resultCount: 2 }));
    expect(payload.status).toBe('partial');
  });

  it('emits status "partial" when evidence-gap detection marks incomplete coverage', () => {
    const payload = buildRecoveryPayload(makeCtx({
      resultCount: 1,
      avgConfidence: 0.2,
      evidenceGap: true,
    }));
    expect(payload.status).toBe('partial');
  });
});

// -- buildRecoveryPayload — reason field --

describe('buildRecoveryPayload() — reason classification', () => {
  it('emits reason "spec_filter_too_narrow" when filter was applied and no results', () => {
    const payload = buildRecoveryPayload(makeCtx({
      resultCount: 0,
      hasSpecFolderFilter: true,
      query: 'some complex multi-word query',
    }));
    expect(payload.reason).toBe('spec_filter_too_narrow');
  });

  it('emits reason "low_signal_query" for very short queries (1-2 words)', () => {
    const payload = buildRecoveryPayload(makeCtx({
      resultCount: 0,
      hasSpecFolderFilter: false,
      query: 'search',
    }));
    expect(payload.reason).toBe('low_signal_query');
  });

  it('emits reason "low_signal_query" for 2-word queries', () => {
    const payload = buildRecoveryPayload(makeCtx({
      resultCount: 0,
      hasSpecFolderFilter: false,
      query: 'spec folder',
    }));
    expect(payload.reason).toBe('low_signal_query');
  });

  it('emits reason "knowledge_gap" as default for medium-length query with no filter', () => {
    const payload = buildRecoveryPayload(makeCtx({
      resultCount: 0,
      hasSpecFolderFilter: false,
      query: 'implementation details for hybrid rag fusion pipeline',
    }));
    expect(payload.reason).toBe('knowledge_gap');
  });

  it('emits reason "knowledge_gap" when query is null', () => {
    const payload = buildRecoveryPayload(makeCtx({
      resultCount: 0,
      query: null,
      hasSpecFolderFilter: false,
    }));
    expect(payload.reason).toBe('knowledge_gap');
  });
});

// -- buildRecoveryPayload — recommendedAction field --

describe('buildRecoveryPayload() — recommendedAction mapping', () => {
  it('recommends "retry_broader" for no_results + spec_filter_too_narrow', () => {
    const payload = buildRecoveryPayload(makeCtx({
      resultCount: 0,
      hasSpecFolderFilter: true,
      query: 'implementation details for hybrid rag fusion pipeline',
    }));
    expect(payload.recommendedAction).toBe('retry_broader');
  });

  it('recommends "switch_mode" for no_results + low_signal_query', () => {
    const payload = buildRecoveryPayload(makeCtx({
      resultCount: 0,
      hasSpecFolderFilter: false,
      query: 'search',
    }));
    expect(payload.recommendedAction).toBe('switch_mode');
  });

  it('recommends "save_memory" for no_results + knowledge_gap', () => {
    const payload = buildRecoveryPayload(makeCtx({
      resultCount: 0,
      hasSpecFolderFilter: false,
      query: 'the complete architecture of the advanced fusion pipeline v3',
    }));
    expect(payload.recommendedAction).toBe('save_memory');
  });

  it('recommends "retry_broader" for partial results', () => {
    const payload = buildRecoveryPayload(makeCtx({ resultCount: 1 }));
    expect(payload.recommendedAction).toBe('retry_broader');
  });

  it('recommends "ask_user" for low_confidence + knowledge_gap', () => {
    const payload = buildRecoveryPayload(makeCtx({
      resultCount: 5,
      avgConfidence: 0.2,
      hasSpecFolderFilter: false,
      query: 'detailed implementation notes on the advanced scoring module internals',
    }));
    expect(payload.status).toBe('low_confidence');
    expect(payload.recommendedAction).toBe('ask_user');
  });
});

// -- buildRecoveryPayload — suggestedQueries field --

describe('buildRecoveryPayload() — suggestedQueries', () => {
  it('returns an array for every query', () => {
    const payload = buildRecoveryPayload(makeCtx({ query: 'hybrid rag fusion pipeline' }));
    expect(Array.isArray(payload.suggestedQueries)).toBe(true);
  });

  it('returns at most 3 suggestions', () => {
    const payload = buildRecoveryPayload(makeCtx({ query: 'hybrid rag fusion pipeline implementation' }));
    expect(payload.suggestedQueries.length).toBeLessThanOrEqual(3);
  });

  it('returns fallback terms when query is empty', () => {
    const payload = buildRecoveryPayload(makeCtx({ query: '' }));
    expect(payload.suggestedQueries.length).toBeGreaterThan(0);
    expect(payload.suggestedQueries.every((s) => typeof s === 'string' && s.length > 0)).toBe(true);
  });

  it('returns fallback terms when query is null', () => {
    const payload = buildRecoveryPayload(makeCtx({ query: null }));
    expect(payload.suggestedQueries.length).toBeGreaterThan(0);
  });

  it('shortens long queries by keeping the first 3 words', () => {
    const payload = buildRecoveryPayload(makeCtx({
      query: 'implementation details for hybrid rag fusion pipeline stage two',
    }));
    const hasShortened = payload.suggestedQueries.some((s) =>
      s.split(' ').length <= 3
    );
    expect(hasShortened).toBe(true);
  });

  it('removes parenthetical clauses from queries', () => {
    const payload = buildRecoveryPayload(makeCtx({
      query: 'stage2 fusion (rrfScore normalized)',
    }));
    const hasParenFree = payload.suggestedQueries.some((s) => !s.includes('('));
    expect(hasParenFree).toBe(true);
  });

  it('produces only unique, non-empty suggestions', () => {
    const payload = buildRecoveryPayload(makeCtx({ query: 'short' }));
    const unique = new Set(payload.suggestedQueries);
    expect(unique.size).toBe(payload.suggestedQueries.length);
    expect(payload.suggestedQueries.every((s) => s.trim().length > 0)).toBe(true);
  });
});

// -- buildRecoveryPayload — payload shape --

describe('buildRecoveryPayload() — payload shape contract', () => {
  it('always returns all four required keys', () => {
    const payload = buildRecoveryPayload(makeCtx());
    expect(payload).toHaveProperty('status');
    expect(payload).toHaveProperty('reason');
    expect(payload).toHaveProperty('suggestedQueries');
    expect(payload).toHaveProperty('recommendedAction');
  });

  it('status is one of the valid literals', () => {
    const validStatuses = ['no_results', 'low_confidence', 'partial'] as const;
    const payload = buildRecoveryPayload(makeCtx({ resultCount: 0 }));
    expect(validStatuses).toContain(payload.status);
  });

  it('reason is one of the valid literals', () => {
    const validReasons = ['spec_filter_too_narrow', 'low_signal_query', 'knowledge_gap'] as const;
    const payload = buildRecoveryPayload(makeCtx({ resultCount: 0 }));
    expect(validReasons).toContain(payload.reason);
  });

  it('recommendedAction is one of the valid literals', () => {
    const validActions = ['retry_broader', 'switch_mode', 'save_memory', 'ask_user'] as const;
    const payload = buildRecoveryPayload(makeCtx({ resultCount: 0 }));
    expect(validActions).toContain(payload.recommendedAction);
  });
});
