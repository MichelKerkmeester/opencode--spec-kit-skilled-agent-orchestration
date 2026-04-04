import type { Stage4Input, Stage4Output, Stage4ReadonlyRow } from './types.js';
declare function normalizeStateValue(state: unknown): string | null;
declare function resolveStateForFiltering(row: Stage4ReadonlyRow): string;
/**
 * Per-state tally produced by `filterByMemoryState`.
 * Keys are state names (e.g. "HOT", "WARM"); values are counts.
 */
export type StateStats = Record<string, number>;
/**
 * Return value of the internal `filterByMemoryState` function.
 */
export interface FilterResult {
    /** Rows that survived state filtering, in original order. */
    filtered: Stage4ReadonlyRow[];
    /** Pre-filter per-state counts (includes removed rows). */
    statsBefore: StateStats;
    /** Post-filter per-state counts. */
    statsAfter: StateStats;
    /** Total number of rows removed. */
    removedCount: number;
}
/**
 * Remove rows whose `memoryState` falls below `minState` priority and,
 * optionally, enforce per-tier result limits via `STATE_LIMITS`.
 *
 * IMPORTANT: This function ONLY removes items — it never reorders or
 * modifies score fields. The original ordering from Stage 3 is preserved
 * for all rows that survive.
 *
 * @param results        - Read-only rows from Stage 3 output.
 * @param minState       - Minimum acceptable state (e.g. "WARM").
 * @param applyStateLimits - When true, cap each tier to STATE_LIMITS[tier].
 * @returns FilterResult with the surviving rows and before/after stats.
 */
export declare function filterByMemoryState(results: Stage4ReadonlyRow[], minState: string, applyStateLimits: boolean): FilterResult;
/**
 * Extract the best available numeric score from a row for evidence-gap
 * analysis. Delegates to resolveEffectiveScore (canonical chain in types.ts)
 * so scoring, sorting, and filtering all agree on precedence and normalization.
 *
 * A1 FIX: Previously used a different precedence order (rrfScore first) and
 * did NOT divide similarity by 100, causing a 100x scale mismatch on rows
 * that only had the similarity field set.
 *
 * @param row - A Stage4ReadonlyRow to inspect.
 * @returns The best available numeric score clamped to [0,1], or 0.
 */
export declare function extractScoringValue(row: Stage4ReadonlyRow): number;
/**
 * Execute Stage 4 of the 4-stage retrieval pipeline: Filter + Annotate.
 *
 * Stage 4 is the final pipeline stage. It removes results that fall below
 * the configured minimum memory state, runs the Transparent Reasoning Module
 * (TRM) evidence-gap check, attaches annotation metadata, and verifies the
 * score invariant before returning.
 *
 * **Score invariant:** No score fields are modified in Stage 4. The compile-time
 * guarantee is enforced via Stage4ReadonlyRow readonly fields; the runtime check
 * via captureScoreSnapshot / verifyScoreInvariant provides defence-in-depth. If
 * verifyScoreInvariant throws, it indicates a Stage 4 implementation bug.
 *
 * **Session dedup:** Session deduplication is intentionally NOT performed here.
 * It happens after the cache layer in the main handler to avoid cache pollution.
 *
 * @param input - Stage4Input containing read-only results and pipeline config.
 * @returns Stage4Output with filtered/annotated results and metadata.
 * @throws Error if verifyScoreInvariant detects any score mutation (Stage 4 bug).
 */
export declare function executeStage4(input: Stage4Input): Promise<Stage4Output>;
/**
 * Exported internals for unit testing.
 * Not intended for production use outside the test harness.
 */
export declare const __testables: {
    readonly filterByMemoryState: typeof filterByMemoryState;
    readonly resolveStateForFiltering: typeof resolveStateForFiltering;
    readonly normalizeStateValue: typeof normalizeStateValue;
    readonly extractScoringValue: typeof extractScoringValue;
    readonly STATE_PRIORITY: Record<string, number>;
    readonly STATE_LIMITS: Record<string, number>;
    readonly UNKNOWN_STATE_PRIORITY: 6;
};
export {};
//# sourceMappingURL=stage4-filter.d.ts.map