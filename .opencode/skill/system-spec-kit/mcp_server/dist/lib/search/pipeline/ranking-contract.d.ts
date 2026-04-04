/**
 * Stage 2 graph-walk additive bonus cap.
 *
 * Centralized here so deterministic ordering rules and additive graph-bonus
 * bounds share one contract surface.
 */
export declare const STAGE2_GRAPH_BONUS_CAP = 0.03;
/**
 * Clamp a Stage 2 graph-derived additive bonus to the bounded contract.
 *
 * The contract is strictly additive and never allows negative graph bonuses.
 */
export declare function clampStage2GraphBonus(value: number): number;
/**
 * Compare rows deterministically so ties resolve the same way across runs.
 *
 * A1 FIX: Primary score now delegates to resolveEffectiveScore (canonical chain
 * in types.ts) so sorting, filtering, and score resolution always agree.
 * Tiebreaker on raw similarity is preserved (different purpose than score resolution).
 *
 * @param a - First ranked row.
 * @param b - Second ranked row.
 * @returns Negative when `a` should sort before `b`.
 */
export declare function compareDeterministicRows(a: Record<string, unknown> & {
    id: number;
}, b: Record<string, unknown> & {
    id: number;
}): number;
/**
 * Sort a result set with the deterministic ranking contract.
 *
 * @param rows - Ranked rows to sort without mutating the input array.
 * @returns Copy of the input rows sorted with deterministic tie-breaking.
 */
export declare function sortDeterministicRows<T extends Record<string, unknown> & {
    id: number;
}>(rows: T[]): T[];
//# sourceMappingURL=ranking-contract.d.ts.map