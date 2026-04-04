/** Per-source budget configuration */
export interface SourceBudget {
    name: string;
    floor: number;
    actualSize: number;
}
/** Allocation result for a single source */
export interface SourceAllocation {
    name: string;
    floor: number;
    requested: number;
    granted: number;
    dropped: number;
}
/** Combined allocation result */
export interface AllocationResult {
    totalBudget: number;
    totalUsed: number;
    overflow: number;
    allocations: SourceAllocation[];
}
/** Default floor layout for the 4000-token compact brief budget */
export declare const DEFAULT_FLOORS: {
    readonly constitutional: 700;
    readonly codeGraph: 1200;
    readonly cocoIndex: 900;
    readonly triggered: 400;
    readonly overflow: 800;
};
/**
 * Allocate token budget across sources.
 *
 * Algorithm:
 * 1. Assign floor to each source (capped at actual size)
 * 2. Calculate overflow from empty/under-floor sources
 * 3. Redistribute overflow by priority order
 * 4. Enforce total budget cap with deterministic trim
 */
export declare function allocateBudget(sources: SourceBudget[], totalBudget?: number): AllocationResult;
/** Create source budgets with default floors */
export declare function createDefaultSources(constitutionalSize: number, codeGraphSize: number, cocoIndexSize: number, triggeredSize: number, sessionStateSize?: number): SourceBudget[];
//# sourceMappingURL=budget-allocator.d.ts.map