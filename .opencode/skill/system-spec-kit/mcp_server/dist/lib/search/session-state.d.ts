/** Session inactivity TTL in milliseconds (30 minutes). */
declare const SESSION_TTL_MS: number;
/** Maximum concurrent sessions before LRU eviction. */
declare const MAX_SESSIONS = 100;
/** Score multiplier for seen results (deprioritize, don't remove). */
declare const SEEN_DEDUP_FACTOR = 0.3;
/** Maximum goal alignment boost factor. */
declare const GOAL_BOOST_MAX = 1.2;
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
/**
 * In-memory session state manager with TTL-based cleanup and LRU eviction.
 *
 * Sessions are ephemeral — they exist only in process memory and are not
 * persisted to disk or database. This is intentional: session state is
 * transient retrieval context, not durable memory.
 */
declare class SessionStateManager {
    private sessions;
    /**
     * Get an existing session or create a new one.
     *
     * @param sessionId - Unique session identifier.
     * @returns The session state (existing or newly created).
     */
    getOrCreate(sessionId: string): SessionState;
    /**
     * Update the active retrieval goal for a session.
     *
     * @param sessionId - Session to update.
     * @param goal - The new active goal (or null to clear).
     */
    updateGoal(sessionId: string, goal: string | null): void;
    /**
     * Mark result IDs as seen in a session (accumulates across calls).
     *
     * @param sessionId - Session to update.
     * @param resultIds - Result IDs to mark as seen.
     */
    markSeen(sessionId: string, resultIds: Array<number | string>): void;
    /**
     * Add an unresolved question to the session.
     *
     * @param sessionId - Session to update.
     * @param question - The question to track.
     */
    addQuestion(sessionId: string, question: string): void;
    /**
     * Set preferred anchors for the session.
     *
     * @param sessionId - Session to update.
     * @param anchors - Array of preferred anchor names.
     */
    setAnchors(sessionId: string, anchors: string[]): void;
    /**
     * Remove a session entirely.
     *
     * @param sessionId - Session to remove.
     */
    clear(sessionId: string): void;
    /**
     * Get the current number of active sessions.
     * Useful for monitoring and testing.
     */
    get size(): number;
    /**
     * Clear all sessions. Useful for testing.
     */
    clearAll(): void;
    /**
     * Evict sessions that have exceeded the inactivity TTL.
     */
    private evictExpired;
    /**
     * Evict the least-recently-updated session (LRU).
     * Called when session count reaches MAX_SESSIONS.
     */
    private evictLRU;
}
declare const manager: SessionStateManager;
import { isSessionRetrievalStateEnabled } from './search-flags.js';
/**
 * Deprioritize results whose IDs appear in the session's seenResultIds set.
 * Does NOT remove results — just multiplies their score by SEEN_DEDUP_FACTOR (0.3).
 *
 * @param results - Result set to deduplicate.
 * @param sessionId - Session ID for seen-result lookup.
 * @returns Modified result set with dedup metadata.
 */
declare function deduplicateResults(results: SessionResult[], sessionId: string): {
    results: SessionResult[];
    metadata: DedupMetadata;
};
/**
 * Compute keyword overlap between goal and content.
 * Returns a score between 0 and 1 based on fraction of goal keywords found in content.
 */
declare function computeGoalAlignment(goal: string, content: string): number;
/**
 * Boost results that align with the session's active goal.
 * Applies a boost factor of up to GOAL_BOOST_MAX (1.2x) based on keyword overlap.
 *
 * @param results - Result set to refine.
 * @param sessionId - Session ID for goal lookup.
 * @returns Modified result set with refinement metadata.
 */
declare function refineForGoal(results: SessionResult[], sessionId: string): {
    results: SessionResult[];
    metadata: GoalRefinementMetadata;
};
export { type SessionState, type SessionResult, type DedupMetadata, type GoalRefinementMetadata, SESSION_TTL_MS, MAX_SESSIONS, SEEN_DEDUP_FACTOR, GOAL_BOOST_MAX, isSessionRetrievalStateEnabled, manager, SessionStateManager, deduplicateResults, refineForGoal, computeGoalAlignment, };
//# sourceMappingURL=session-state.d.ts.map