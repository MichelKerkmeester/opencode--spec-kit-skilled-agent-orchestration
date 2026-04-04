import type Database from 'better-sqlite3';
declare const SESSION_BOOST_MULTIPLIER = 0.15;
declare const MAX_COMBINED_BOOST = 0.2;
interface RankedSearchResult extends Record<string, unknown> {
    id: number;
    score?: number;
    rrfScore?: number;
    similarity?: number;
}
interface SessionBoostMetadata {
    enabled: boolean;
    applied: boolean;
    sessionId: string | null;
    boostedCount: number;
    maxBoostApplied: number;
}
/**
 * Check whether session boost is enabled.
 * Default: ON (graduated). Set SPECKIT_SESSION_BOOST=false to disable.
 * When enabled, session attention scores from working_memory are used
 * to boost results that the user recently interacted with.
 *
 * Delegates to the canonical flag check in search-flags.ts.
 */
declare function isEnabled(_sessionId?: string | null): boolean;
declare function init(database: Database.Database): void;
declare function capCombinedBoost(sessionBoost: number, causalBoost?: number): number;
declare function calculateSessionBoost(attentionScore: number, causalBoost?: number): number;
declare function getAttentionBoost(sessionId: string | null | undefined, memoryIds: number[]): Map<number, number>;
declare function applySessionBoost(results: RankedSearchResult[], sessionId: string | null | undefined): {
    results: RankedSearchResult[];
    metadata: SessionBoostMetadata;
};
export { SESSION_BOOST_MULTIPLIER, MAX_COMBINED_BOOST, init, isEnabled, capCombinedBoost, calculateSessionBoost, getAttentionBoost, applySessionBoost, };
/**
 * Session boost types exposed for search pipeline consumers.
 */
export type { RankedSearchResult, SessionBoostMetadata, };
//# sourceMappingURL=session-boost.d.ts.map