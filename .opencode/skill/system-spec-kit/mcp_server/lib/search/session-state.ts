// ───────────────────────────────────────────────────────────────
// MODULE: Session State
// ───────────────────────────────────────────────────────────────
// REQ-D5-006: Retrieval session state for cross-turn context
//
// PURPOSE: Track per-session retrieval state to enable:
// 1. Cross-turn deduplication — deprioritize already-seen results
// 2. Goal-aware refinement — boost results aligned with session goal
// 3. Stateful session tracking — questions, anchors, seen items
//
// FEATURE FLAG: SPECKIT_SESSION_RETRIEVAL_STATE_V1 (default ON, graduated; set false to disable)
//
// STORAGE: In-memory only (ephemeral by design, no SQLite persistence).
// Sessions expire after 30 minutes of inactivity, LRU eviction at 100 capacity.

// -- Constants --

/** Session inactivity TTL in milliseconds (30 minutes). */
const SESSION_TTL_MS = 30 * 60 * 1000;

/** Maximum concurrent sessions before LRU eviction. */
const MAX_SESSIONS = 100;

/** Score multiplier for seen results (deprioritize, don't remove). */
const SEEN_DEDUP_FACTOR = 0.3;

/** Maximum goal alignment boost factor. */
const GOAL_BOOST_MAX = 1.2;

// -- Types --

/** Session state for a single retrieval session. */
interface SessionState {
  sessionId: string;
  activeGoal: string | null;
  seenResultIds: Set<string>;
  openQuestions: string[];
  preferredAnchors: string[];
  createdAt: number;
  updatedAt: number;
}

/** Minimal result shape for session operations. */
interface SessionResult {
  id: number | string;
  content?: string;
  score?: number;
  [key: string]: unknown;
}

/** Metadata attached to deduplication results. */
interface DedupMetadata {
  deduplicated: boolean;
  seenCount: number;
  deprioritizedCount: number;
}

/** Result of goal-aware refinement. */
interface GoalRefinementMetadata {
  refined: boolean;
  activeGoal: string | null;
  boostedCount: number;
}

// -- Session State Manager --

/**
 * In-memory session state manager with TTL-based cleanup and LRU eviction.
 *
 * Sessions are ephemeral — they exist only in process memory and are not
 * persisted to disk or database. This is intentional: session state is
 * transient retrieval context, not durable memory.
 */
class SessionStateManager {
  private sessions: Map<string, SessionState> = new Map();

  /**
   * Get an existing session or create a new one.
   *
   * @param sessionId - Unique session identifier.
   * @returns The session state (existing or newly created).
   */
  getOrCreate(sessionId: string): SessionState {
    this.evictExpired();

    const existing = this.sessions.get(sessionId);
    if (existing) {
      existing.updatedAt = Date.now();
      return existing;
    }

    // LRU eviction if at capacity
    if (this.sessions.size >= MAX_SESSIONS) {
      this.evictLRU();
    }

    const now = Date.now();
    const session: SessionState = {
      sessionId,
      activeGoal: null,
      seenResultIds: new Set(),
      openQuestions: [],
      preferredAnchors: [],
      createdAt: now,
      updatedAt: now,
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Update the active retrieval goal for a session.
   *
   * @param sessionId - Session to update.
   * @param goal - The new active goal (or null to clear).
   */
  updateGoal(sessionId: string, goal: string | null): void {
    const session = this.getOrCreate(sessionId);
    session.activeGoal = goal;
    session.updatedAt = Date.now();
  }

  /**
   * Mark result IDs as seen in a session (accumulates across calls).
   *
   * @param sessionId - Session to update.
   * @param resultIds - Result IDs to mark as seen.
   */
  markSeen(sessionId: string, resultIds: Array<number | string>): void {
    const session = this.getOrCreate(sessionId);
    for (const id of resultIds) {
      session.seenResultIds.add(String(id));
    }
    session.updatedAt = Date.now();
  }

  /**
   * Add an unresolved question to the session.
   *
   * @param sessionId - Session to update.
   * @param question - The question to track.
   */
  addQuestion(sessionId: string, question: string): void {
    const session = this.getOrCreate(sessionId);
    session.openQuestions.push(question);
    session.updatedAt = Date.now();
  }

  /**
   * Set preferred anchors for the session.
   *
   * @param sessionId - Session to update.
   * @param anchors - Array of preferred anchor names.
   */
  setAnchors(sessionId: string, anchors: string[]): void {
    const session = this.getOrCreate(sessionId);
    session.preferredAnchors = [...anchors];
    session.updatedAt = Date.now();
  }

  /**
   * Remove a session entirely.
   *
   * @param sessionId - Session to remove.
   */
  clear(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  /**
   * Get the current number of active sessions.
   * Useful for monitoring and testing.
   */
  get size(): number {
    return this.sessions.size;
  }

  /**
   * Clear all sessions. Useful for testing.
   */
  clearAll(): void {
    this.sessions.clear();
  }

  // -- Internal Helpers --

  /**
   * Evict sessions that have exceeded the inactivity TTL.
   */
  private evictExpired(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (now - session.updatedAt > SESSION_TTL_MS) {
        this.sessions.delete(id);
      }
    }
  }

  /**
   * Evict the least-recently-updated session (LRU).
   * Called when session count reaches MAX_SESSIONS.
   */
  private evictLRU(): void {
    let oldestId: string | null = null;
    let oldestTime = Infinity;

    for (const [id, session] of this.sessions) {
      if (session.updatedAt < oldestTime) {
        oldestTime = session.updatedAt;
        oldestId = id;
      }
    }

    if (oldestId !== null) {
      this.sessions.delete(oldestId);
    }
  }
}

// -- Singleton Manager --

const manager = new SessionStateManager();

// -- Feature Flag --

// Session retrieval state gate — canonical implementation in search-flags.ts.
// Default: TRUE (graduated). Set SPECKIT_SESSION_RETRIEVAL_STATE_V1=false to disable.
import { isSessionRetrievalStateEnabled } from './search-flags.js';

// -- Cross-Turn Deduplication --

/**
 * Deprioritize results whose IDs appear in the session's seenResultIds set.
 * Does NOT remove results — just multiplies their score by SEEN_DEDUP_FACTOR (0.3).
 *
 * @param results - Result set to deduplicate.
 * @param sessionId - Session ID for seen-result lookup.
 * @returns Modified result set with dedup metadata.
 */
function deduplicateResults(
  results: SessionResult[],
  sessionId: string,
): { results: SessionResult[]; metadata: DedupMetadata } {
  const defaultMeta: DedupMetadata = { deduplicated: false, seenCount: 0, deprioritizedCount: 0 };

  if (!Array.isArray(results) || results.length === 0) {
    return { results, metadata: defaultMeta };
  }

  if (!isSessionRetrievalStateEnabled()) {
    return { results, metadata: defaultMeta };
  }

  const session = manager.getOrCreate(sessionId);
  if (session.seenResultIds.size === 0) {
    return { results, metadata: { ...defaultMeta, seenCount: 0 } };
  }

  let deprioritizedCount = 0;

  const modified = results.map((result) => {
    const resultIdStr = String(result.id);
    if (session.seenResultIds.has(resultIdStr)) {
      deprioritizedCount++;
      const baseScore = typeof result.score === 'number' && Number.isFinite(result.score) ? result.score : 0;
      return {
        ...result,
        score: baseScore * SEEN_DEDUP_FACTOR,
        _deduplicated: true,
      };
    }
    return result;
  });

  // Re-sort by score descending after dedup adjustments
  modified.sort((a, b) => {
    const scoreA = typeof a.score === 'number' ? a.score : 0;
    const scoreB = typeof b.score === 'number' ? b.score : 0;
    return scoreB - scoreA;
  });

  return {
    results: modified,
    metadata: {
      deduplicated: deprioritizedCount > 0,
      seenCount: session.seenResultIds.size,
      deprioritizedCount,
    },
  };
}

// -- Goal-Aware Refinement --

/**
 * Compute keyword overlap between goal and content.
 * Returns a score between 0 and 1 based on fraction of goal keywords found in content.
 */
function computeGoalAlignment(goal: string, content: string): number {
  if (!goal || !content) return 0;

  const goalWords = new Set(
    goal
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2), // skip very short words
  );

  if (goalWords.size === 0) return 0;

  const contentLower = content.toLowerCase();
  let matchCount = 0;

  for (const word of goalWords) {
    if (contentLower.includes(word)) {
      matchCount++;
    }
  }

  return matchCount / goalWords.size;
}

/**
 * Boost results that align with the session's active goal.
 * Applies a boost factor of up to GOAL_BOOST_MAX (1.2x) based on keyword overlap.
 *
 * @param results - Result set to refine.
 * @param sessionId - Session ID for goal lookup.
 * @returns Modified result set with refinement metadata.
 */
function refineForGoal(
  results: SessionResult[],
  sessionId: string,
): { results: SessionResult[]; metadata: GoalRefinementMetadata } {
  const defaultMeta: GoalRefinementMetadata = { refined: false, activeGoal: null, boostedCount: 0 };

  if (!Array.isArray(results) || results.length === 0) {
    return { results, metadata: defaultMeta };
  }

  if (!isSessionRetrievalStateEnabled()) {
    return { results, metadata: defaultMeta };
  }

  const session = manager.getOrCreate(sessionId);
  if (!session.activeGoal) {
    return { results, metadata: { ...defaultMeta, activeGoal: null } };
  }

  const goal = session.activeGoal;
  let boostedCount = 0;

  const modified = results.map((result) => {
    const content = typeof result.content === 'string' ? result.content : '';
    const alignment = computeGoalAlignment(goal, content);

    if (alignment > 0) {
      boostedCount++;
      const boostFactor = 1 + alignment * (GOAL_BOOST_MAX - 1);
      const baseScore = typeof result.score === 'number' && Number.isFinite(result.score) ? result.score : 0;
      return {
        ...result,
        score: baseScore * boostFactor,
        _goalBoosted: true,
        _goalAlignment: Math.round(alignment * 1000) / 1000,
      };
    }

    return result;
  });

  // Re-sort by score descending after goal boost
  modified.sort((a, b) => {
    const scoreA = typeof a.score === 'number' ? a.score : 0;
    const scoreB = typeof b.score === 'number' ? b.score : 0;
    return scoreB - scoreA;
  });

  return {
    results: modified,
    metadata: {
      refined: boostedCount > 0,
      activeGoal: goal,
      boostedCount,
    },
  };
}

// -- Exports --

export {
  // Types
  type SessionState,
  type SessionResult,
  type DedupMetadata,
  type GoalRefinementMetadata,

  // Constants
  SESSION_TTL_MS,
  MAX_SESSIONS,
  SEEN_DEDUP_FACTOR,
  GOAL_BOOST_MAX,

  // Feature flag
  isSessionRetrievalStateEnabled,

  // Session management (via singleton)
  manager,
  SessionStateManager,

  // Cross-turn dedup
  deduplicateResults,

  // Goal-aware refinement
  refineForGoal,
  computeGoalAlignment,
};
