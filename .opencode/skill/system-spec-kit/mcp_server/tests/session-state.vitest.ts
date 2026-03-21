// ───────────────────────────────────────────────────────────────
// TEST: D5 Phase C — Retrieval Session State (REQ-D5-006)
// ───────────────────────────────────────────────────────────────
// Validates session state management, cross-turn deduplication,
// goal-aware refinement, TTL expiry, LRU eviction, and feature flag gating.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  manager,
  SessionStateManager,
  isSessionRetrievalStateEnabled,
  deduplicateResults,
  refineForGoal,
  computeGoalAlignment,
  type SessionResult,
  SESSION_TTL_MS,
  MAX_SESSIONS,
  SEEN_DEDUP_FACTOR,
  GOAL_BOOST_MAX,
} from '../lib/search/session-state';

// -- Test Helpers --

function makeResult(overrides: Partial<SessionResult> = {}): SessionResult {
  return {
    id: 1,
    content: 'Test content for session state testing.',
    score: 0.8,
    ...overrides,
  };
}

function makeResults(count: number): SessionResult[] {
  return Array.from({ length: count }, (_, i) => makeResult({
    id: i + 1,
    content: `Content for result ${i + 1}`,
    score: 0.9 - i * 0.05,
  }));
}

// -- Feature Flag --

describe('isSessionRetrievalStateEnabled() — feature flag', () => {
  const ORIGINAL = process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1;

  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1;
    else process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1 = ORIGINAL;
  });

  it('defaults to true when env var is not set (graduated)', () => {
    delete process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1;
    expect(isSessionRetrievalStateEnabled()).toBe(true);
  });

  it('returns true when set to "true"', () => {
    process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1 = 'true';
    expect(isSessionRetrievalStateEnabled()).toBe(true);
  });

  it('returns true when set to "TRUE" (case-insensitive)', () => {
    process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1 = 'TRUE';
    expect(isSessionRetrievalStateEnabled()).toBe(true);
  });

  it('returns false when set to "false"', () => {
    process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1 = 'false';
    expect(isSessionRetrievalStateEnabled()).toBe(false);
  });

  it('returns true for "1" (graduated — any non-false value is ON)', () => {
    process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1 = '1';
    expect(isSessionRetrievalStateEnabled()).toBe(true);
  });
});

// -- SessionStateManager: getOrCreate --

describe('SessionStateManager — getOrCreate()', () => {
  let mgr: SessionStateManager;

  beforeEach(() => {
    mgr = new SessionStateManager();
  });

  it('creates a new session when none exists', () => {
    const session = mgr.getOrCreate('sess-1');
    expect(session.sessionId).toBe('sess-1');
    expect(session.activeGoal).toBeNull();
    expect(session.seenResultIds.size).toBe(0);
    expect(session.openQuestions).toEqual([]);
    expect(session.preferredAnchors).toEqual([]);
  });

  it('returns the same session on repeated calls', () => {
    const first = mgr.getOrCreate('sess-1');
    first.activeGoal = 'test goal';
    const second = mgr.getOrCreate('sess-1');
    expect(second.activeGoal).toBe('test goal');
    expect(second).toBe(first);
  });

  it('tracks session count', () => {
    mgr.getOrCreate('sess-1');
    mgr.getOrCreate('sess-2');
    expect(mgr.size).toBe(2);
  });

  it('sets createdAt and updatedAt timestamps', () => {
    const before = Date.now();
    const session = mgr.getOrCreate('sess-1');
    const after = Date.now();
    expect(session.createdAt).toBeGreaterThanOrEqual(before);
    expect(session.createdAt).toBeLessThanOrEqual(after);
    expect(session.updatedAt).toBeGreaterThanOrEqual(before);
  });
});

// -- SessionStateManager: updateGoal --

describe('SessionStateManager — updateGoal()', () => {
  let mgr: SessionStateManager;

  beforeEach(() => {
    mgr = new SessionStateManager();
  });

  it('sets the active goal', () => {
    mgr.updateGoal('sess-1', 'find architecture decisions');
    const session = mgr.getOrCreate('sess-1');
    expect(session.activeGoal).toBe('find architecture decisions');
  });

  it('clears goal when set to null', () => {
    mgr.updateGoal('sess-1', 'some goal');
    mgr.updateGoal('sess-1', null);
    const session = mgr.getOrCreate('sess-1');
    expect(session.activeGoal).toBeNull();
  });
});

// -- SessionStateManager: markSeen --

describe('SessionStateManager — markSeen()', () => {
  let mgr: SessionStateManager;

  beforeEach(() => {
    mgr = new SessionStateManager();
  });

  it('tracks result IDs as seen', () => {
    mgr.markSeen('sess-1', [1, 2, 3]);
    const session = mgr.getOrCreate('sess-1');
    expect(session.seenResultIds.has('1')).toBe(true);
    expect(session.seenResultIds.has('2')).toBe(true);
    expect(session.seenResultIds.has('3')).toBe(true);
  });

  it('accumulates seen IDs across multiple calls', () => {
    mgr.markSeen('sess-1', [1, 2]);
    mgr.markSeen('sess-1', [3, 4]);
    const session = mgr.getOrCreate('sess-1');
    expect(session.seenResultIds.size).toBe(4);
  });

  it('handles string IDs', () => {
    mgr.markSeen('sess-1', ['abc', 'def'] as unknown as number[]);
    const session = mgr.getOrCreate('sess-1');
    expect(session.seenResultIds.has('abc')).toBe(true);
    expect(session.seenResultIds.has('def')).toBe(true);
  });

  it('deduplicates repeated IDs', () => {
    mgr.markSeen('sess-1', [1, 1, 2, 2]);
    const session = mgr.getOrCreate('sess-1');
    expect(session.seenResultIds.size).toBe(2);
  });
});

// -- SessionStateManager: addQuestion, setAnchors, clear --

describe('SessionStateManager — additional methods', () => {
  let mgr: SessionStateManager;

  beforeEach(() => {
    mgr = new SessionStateManager();
  });

  it('addQuestion appends to openQuestions', () => {
    mgr.addQuestion('sess-1', 'What is the architecture?');
    mgr.addQuestion('sess-1', 'How does caching work?');
    const session = mgr.getOrCreate('sess-1');
    expect(session.openQuestions).toEqual([
      'What is the architecture?',
      'How does caching work?',
    ]);
  });

  it('setAnchors replaces preferred anchors', () => {
    mgr.setAnchors('sess-1', ['state', 'summary']);
    const session = mgr.getOrCreate('sess-1');
    expect(session.preferredAnchors).toEqual(['state', 'summary']);

    mgr.setAnchors('sess-1', ['next-steps']);
    const updated = mgr.getOrCreate('sess-1');
    expect(updated.preferredAnchors).toEqual(['next-steps']);
  });

  it('clear removes the session entirely', () => {
    mgr.getOrCreate('sess-1');
    expect(mgr.size).toBe(1);
    mgr.clear('sess-1');
    expect(mgr.size).toBe(0);
  });

  it('clearAll removes all sessions', () => {
    mgr.getOrCreate('sess-1');
    mgr.getOrCreate('sess-2');
    mgr.clearAll();
    expect(mgr.size).toBe(0);
  });
});

// -- Session Expiry --

describe('SessionStateManager — TTL expiry', () => {
  it('evicts expired sessions on access', () => {
    const mgr = new SessionStateManager();
    const session = mgr.getOrCreate('old-session');

    // Manually backdate the updatedAt to simulate expiry
    session.updatedAt = Date.now() - SESSION_TTL_MS - 1000;

    // Accessing any session triggers eviction of expired ones
    mgr.getOrCreate('new-session');

    // Old session should be gone, new one should exist
    expect(mgr.size).toBe(1);
  });
});

// -- LRU Eviction --

describe('SessionStateManager — LRU eviction', () => {
  it('evicts the oldest session when at MAX_SESSIONS capacity', () => {
    const mgr = new SessionStateManager();

    // Fill to capacity
    for (let i = 0; i < MAX_SESSIONS; i++) {
      const session = mgr.getOrCreate(`sess-${i}`);
      // Stagger updatedAt so we know which is oldest
      session.updatedAt = Date.now() - (MAX_SESSIONS - i) * 1000;
    }
    expect(mgr.size).toBe(MAX_SESSIONS);

    // Add one more — should evict the oldest (sess-0)
    mgr.getOrCreate('new-session');
    expect(mgr.size).toBe(MAX_SESSIONS);

    // Verify the oldest was evicted by trying to get it (will create new)
    const recreated = mgr.getOrCreate('sess-0');
    expect(recreated.seenResultIds.size).toBe(0); // fresh session, not the original
  });
});

// -- Cross-Turn Deduplication --

describe('deduplicateResults()', () => {
  const ORIGINAL = process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1;

  beforeEach(() => {
    process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1 = 'true';
    manager.clearAll();
  });

  afterEach(() => {
    manager.clearAll();
    if (ORIGINAL === undefined) delete process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1;
    else process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1 = ORIGINAL;
  });

  it('deprioritizes seen results by multiplying score by SEEN_DEDUP_FACTOR', () => {
    manager.markSeen('sess-1', [1, 2]);
    const results = makeResults(4);
    const { results: deduped, metadata } = deduplicateResults(results, 'sess-1');

    // Results 1 and 2 should have reduced scores
    const result1 = deduped.find(r => r.id === 1);
    const result3 = deduped.find(r => r.id === 3);
    expect(result1!.score).toBeCloseTo(0.9 * SEEN_DEDUP_FACTOR, 5);
    // Result 3 should be unchanged
    expect(result3!.score).toBeCloseTo(0.8, 5);
    expect(metadata.deprioritizedCount).toBe(2);
    expect(metadata.deduplicated).toBe(true);
  });

  it('does not remove seen results, only deprioritizes', () => {
    manager.markSeen('sess-1', [1]);
    const results = makeResults(3);
    const { results: deduped } = deduplicateResults(results, 'sess-1');
    expect(deduped).toHaveLength(3);
    expect(deduped.some(r => r.id === 1)).toBe(true);
  });

  it('re-sorts results by score after deprioritization', () => {
    manager.markSeen('sess-1', [1]); // Highest scorer
    const results = makeResults(3); // scores: 0.9, 0.85, 0.8
    const { results: deduped } = deduplicateResults(results, 'sess-1');
    // Result 1 (score 0.9*0.3=0.27) should now be last
    expect(deduped[deduped.length - 1].id).toBe(1);
  });

  it('returns unchanged results when no IDs are seen', () => {
    // Empty seen set
    const results = makeResults(3);
    const { results: deduped, metadata } = deduplicateResults(results, 'sess-1');
    expect(metadata.deprioritizedCount).toBe(0);
    expect(metadata.deduplicated).toBe(false);
    // Scores should be unchanged
    expect(deduped[0].score).toBeCloseTo(0.9, 5);
  });

  it('handles all results being seen', () => {
    manager.markSeen('sess-1', [1, 2, 3]);
    const results = makeResults(3);
    const { results: deduped, metadata } = deduplicateResults(results, 'sess-1');
    expect(metadata.deprioritizedCount).toBe(3);
    // All scores reduced
    for (const r of deduped) {
      expect(r.score).toBeLessThan(0.3);
    }
  });

  it('returns unchanged when feature flag is OFF', () => {
    process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1 = 'false';
    manager.markSeen('sess-1', [1, 2]);
    const results = makeResults(3);
    const { results: deduped, metadata } = deduplicateResults(results, 'sess-1');
    expect(metadata.deduplicated).toBe(false);
    expect(deduped[0].score).toBeCloseTo(0.9, 5);
  });

  it('handles empty results array', () => {
    const { results: deduped, metadata } = deduplicateResults([], 'sess-1');
    expect(deduped).toEqual([]);
    expect(metadata.deduplicated).toBe(false);
  });
});

// -- Goal-Aware Refinement --

describe('refineForGoal()', () => {
  const ORIGINAL = process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1;

  beforeEach(() => {
    process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1 = 'true';
    manager.clearAll();
  });

  afterEach(() => {
    manager.clearAll();
    if (ORIGINAL === undefined) delete process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1;
    else process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1 = ORIGINAL;
  });

  it('boosts results aligned with the active goal', () => {
    manager.updateGoal('sess-1', 'architecture decisions');
    const results: SessionResult[] = [
      makeResult({ id: 1, content: 'This describes architecture decisions in the system.', score: 0.7 }),
      makeResult({ id: 2, content: 'Unrelated topic about testing.', score: 0.8 }),
    ];

    const { results: refined, metadata } = refineForGoal(results, 'sess-1');
    expect(metadata.refined).toBe(true);
    expect(metadata.boostedCount).toBeGreaterThan(0);

    // The architecture-related result should be boosted
    const archResult = refined.find(r => r.id === 1);
    expect(archResult!.score).toBeGreaterThan(0.7);
  });

  it('boost factor does not exceed GOAL_BOOST_MAX', () => {
    manager.updateGoal('sess-1', 'test content');
    const results: SessionResult[] = [
      makeResult({ id: 1, content: 'test content exactly matches the goal', score: 1.0 }),
    ];
    const { results: refined } = refineForGoal(results, 'sess-1');
    // Maximum boost is 1.2x → 1.0 * 1.2 = 1.2
    expect(refined[0].score).toBeLessThanOrEqual(GOAL_BOOST_MAX);
  });

  it('does not boost when no goal is set', () => {
    // No goal set for session
    const results = makeResults(3);
    const { results: refined, metadata } = refineForGoal(results, 'sess-1');
    expect(metadata.refined).toBe(false);
    expect(metadata.activeGoal).toBeNull();
    expect(refined[0].score).toBeCloseTo(0.9, 5);
  });

  it('returns unchanged when feature flag is OFF', () => {
    process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1 = 'false';
    manager.updateGoal('sess-1', 'some goal');
    const results = makeResults(3);
    const { results: refined, metadata } = refineForGoal(results, 'sess-1');
    expect(metadata.refined).toBe(false);
    expect(refined[0].score).toBeCloseTo(0.9, 5);
  });

  it('re-sorts results after goal boosting', () => {
    manager.updateGoal('sess-1', 'architecture decisions');
    const results: SessionResult[] = [
      makeResult({ id: 1, content: 'Unrelated content about testing.', score: 0.9 }),
      makeResult({ id: 2, content: 'Architecture decisions for the system.', score: 0.5 }),
    ];
    const { results: refined } = refineForGoal(results, 'sess-1');
    // Result 2 may have been boosted enough to change order, or not
    // Key assertion: results are sorted by score descending
    for (let i = 0; i < refined.length - 1; i++) {
      const scoreA = typeof refined[i].score === 'number' ? refined[i].score! : 0;
      const scoreB = typeof refined[i + 1].score === 'number' ? refined[i + 1].score! : 0;
      expect(scoreA).toBeGreaterThanOrEqual(scoreB);
    }
  });

  it('handles empty results array', () => {
    manager.updateGoal('sess-1', 'some goal');
    const { results: refined, metadata } = refineForGoal([], 'sess-1');
    expect(refined).toEqual([]);
    expect(metadata.refined).toBe(false);
  });
});

// -- computeGoalAlignment --

describe('computeGoalAlignment()', () => {
  it('returns 0 when goal is empty', () => {
    expect(computeGoalAlignment('', 'some content')).toBe(0);
  });

  it('returns 0 when content is empty', () => {
    expect(computeGoalAlignment('some goal', '')).toBe(0);
  });

  it('returns 1.0 for perfect keyword overlap', () => {
    const alignment = computeGoalAlignment('architecture decisions', 'the architecture decisions were important');
    expect(alignment).toBe(1.0);
  });

  it('returns fractional score for partial overlap', () => {
    const alignment = computeGoalAlignment('architecture decisions testing', 'the architecture was solid');
    // "architecture" matches (3 goal words > 2 chars: architecture, decisions, testing)
    // Only "architecture" found → 1/3
    expect(alignment).toBeCloseTo(1 / 3, 2);
  });

  it('is case-insensitive', () => {
    const alignment = computeGoalAlignment('Architecture', 'ARCHITECTURE of the system');
    expect(alignment).toBeGreaterThan(0);
  });

  it('skips words with 2 or fewer characters', () => {
    const alignment = computeGoalAlignment('a is it go', 'a is it go everywhere');
    // "go" has length 2, all others <= 2 → all filtered → 0 goal words → 0
    expect(alignment).toBe(0);
  });
});

// -- Constants --

describe('constants', () => {
  it('SESSION_TTL_MS is 30 minutes', () => {
    expect(SESSION_TTL_MS).toBe(30 * 60 * 1000);
  });

  it('MAX_SESSIONS is 100', () => {
    expect(MAX_SESSIONS).toBe(100);
  });

  it('SEEN_DEDUP_FACTOR is 0.3', () => {
    expect(SEEN_DEDUP_FACTOR).toBe(0.3);
  });

  it('GOAL_BOOST_MAX is 1.2', () => {
    expect(GOAL_BOOST_MAX).toBe(1.2);
  });
});

// -- Singleton Manager --

describe('singleton manager', () => {
  beforeEach(() => {
    manager.clearAll();
  });

  afterEach(() => {
    manager.clearAll();
  });

  it('exports a usable singleton manager instance', () => {
    const session = manager.getOrCreate('singleton-test');
    expect(session.sessionId).toBe('singleton-test');
  });
});
