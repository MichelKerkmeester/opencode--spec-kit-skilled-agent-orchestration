import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
interface ConstitutionalMemory {
    id: number;
    specFolder: string;
    filePath: string;
    title: string;
    importanceTier: string;
    /** PI-A4: LLM-consumable retrieval directive, e.g. "Always surface when: …" */
    retrieval_directive?: string;
}
interface AutoSurfaceResult {
    constitutional: ConstitutionalMemory[];
    triggered: {
        memory_id: number;
        spec_folder: string;
        title: string;
        matched_phrases: string[];
    }[];
    codeGraphStatus?: {
        status: 'ok' | 'error';
        data?: {
            totalFiles: number;
            totalNodes: number;
            totalEdges: number;
            staleFiles: number;
            lastScanAt: string | null;
            dbFileSize: number | null;
            schemaVersion: number;
            nodesByKind: Record<string, number>;
            edgesByType: Record<string, number>;
            parseHealth: Record<string, number>;
        };
        error?: string;
    };
    sessionPrimed?: boolean;
    primedTool?: string;
    /** T018: Structured Prime Package returned on first tool call */
    primePackage?: PrimePackage;
    surfaced_at: string;
    latencyMs: number;
}
/** T018: Structured session prime payload for non-hook CLI auto-priming */
interface PrimePackage {
    specFolder: string | null;
    currentTask: string | null;
    codeGraphStatus: 'fresh' | 'stale' | 'empty';
    cocoIndexAvailable: boolean;
    recommendedCalls: string[];
    /** Phase 027: Structural bootstrap contract for non-hook runtimes */
    structuralContext?: StructuralBootstrapContract;
    /** Phase 009 T041: Graph retrieval routing rules for AI session priming */
    routingRules?: {
        graphRetrieval: string;
        communitySearch: string;
        toolRouting: string;
    };
}
declare const MEMORY_AWARE_TOOLS: Set<string>;
declare const TOOL_DISPATCH_TOKEN_BUDGET = 4000;
declare const COMPACTION_TOKEN_BUDGET = 4000;
declare const CONSTITUTIONAL_CACHE_TTL = 60000;
/** T018: Update last tool call timestamp (called from context-server dispatch). */
declare function recordToolCall(sessionId?: string): void;
/** T018: Get session tracking timestamps */
declare function getSessionTimestamps(): {
    serverStartedAt: number;
    lastToolCallAt: number;
};
/**
 * T018: Check if a specific session has been primed.
 * Session identity is required to avoid cross-session bleed-through.
 */
declare function isSessionPrimed(sessionId: string): boolean;
/** Mark a specific session as primed */
declare function markSessionPrimed(sessionId: string): void;
declare function getLastActiveSessionId(): string | null;
declare function extractContextHint(args: Record<string, unknown> | null | undefined): string | null;
declare function getConstitutionalMemories(): Promise<ConstitutionalMemory[]>;
declare function clearConstitutionalCache(): void;
declare function getCodeGraphStatusSnapshot(): NonNullable<AutoSurfaceResult['codeGraphStatus']>;
declare function autoSurfaceMemories(contextHint: string, tokenBudget?: number, hookName?: 'tool-dispatch' | 'compaction' | 'memory-aware'): Promise<AutoSurfaceResult | null>;
declare function primeSessionIfNeeded(toolName: string, toolArgs: Record<string, unknown>, sessionId?: string): Promise<AutoSurfaceResult | null>;
/**
 * Reset priming state. When called with a sessionId, clears only that session.
 * When called without arguments, clears all sessions (backward-compatible).
 */
declare function resetSessionPrimed(sessionId?: string): void;
/**
 * autoSurfaceAtToolDispatch
 *
 * Fires at tool dispatch lifecycle points. Extracts a context hint from
 * the dispatched tool's arguments, then surfaces relevant memories via
 * the standard autoSurfaceMemories path.
 *
 * Skipped when:
 *   - toolName is in MEMORY_AWARE_TOOLS (prevents recursive surfacing)
 *   - No context hint can be extracted from args
 *   - enableToolDispatchHook is false in the integration config
 *
 * Token budget: TOOL_DISPATCH_TOKEN_BUDGET (4000 max)
 *
 * @param toolName   - Name of the tool being dispatched
 * @param toolArgs   - Arguments passed to the dispatched tool
 * @param options    - Optional integration-layer config flags
 * @returns AutoSurfaceResult or null if nothing to surface / hook disabled
 */
declare function autoSurfaceAtToolDispatch(toolName: string, toolArgs: Record<string, unknown>, options?: {
    enableToolDispatchHook?: boolean;
}): Promise<AutoSurfaceResult | null>;
/**
 * autoSurfaceAtCompaction
 *
 * Fires at session compaction lifecycle points. Surfaces memories relevant
 * to the ongoing session context so that critical knowledge is preserved
 * across the compaction boundary.
 *
 * Skipped when:
 *   - sessionContext is empty or too short to extract signal
 *   - enableCompactionHook is false in the integration config
 *
 * Token budget: COMPACTION_TOKEN_BUDGET (4000 max)
 *
 * @param sessionContext - A textual summary of the current session state
 * @param options        - Optional integration-layer config flags
 * @returns AutoSurfaceResult or null if nothing to surface / hook disabled
 */
declare function autoSurfaceAtCompaction(sessionContext: string, options?: {
    enableCompactionHook?: boolean;
}): Promise<AutoSurfaceResult | null>;
export { MEMORY_AWARE_TOOLS, CONSTITUTIONAL_CACHE_TTL, TOOL_DISPATCH_TOKEN_BUDGET, COMPACTION_TOKEN_BUDGET, extractContextHint, getConstitutionalMemories, clearConstitutionalCache, autoSurfaceMemories, primeSessionIfNeeded, resetSessionPrimed, autoSurfaceAtToolDispatch, autoSurfaceAtCompaction, recordToolCall, getSessionTimestamps, getLastActiveSessionId, isSessionPrimed, markSessionPrimed, getCodeGraphStatusSnapshot, };
export type { PrimePackage, AutoSurfaceResult };
//# sourceMappingURL=memory-surface.d.ts.map