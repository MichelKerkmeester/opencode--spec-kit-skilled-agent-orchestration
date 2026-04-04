import type { MCPResponse } from './types.js';
interface ContextMode {
    readonly name: string;
    readonly description: string;
    readonly strategy: string;
    readonly tokenBudget?: number;
}
interface ContextResult extends Record<string, unknown> {
    strategy: string;
    mode: string;
}
interface ContextArgs {
    input: string;
    mode?: string;
    intent?: string;
    specFolder?: string;
    tenantId?: string;
    userId?: string;
    agentId?: string;
    sharedSpaceId?: string;
    limit?: number;
    sessionId?: string;
    enableDedup?: boolean;
    includeContent?: boolean;
    includeTrace?: boolean;
    tokenUsage?: number;
    anchors?: string[];
    /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
    profile?: string;
}
/** T205: Token budget enforcement metadata */
interface TokenBudgetEnforcement {
    budgetTokens: number;
    actualTokens: number;
    enforced: boolean;
    truncated: boolean;
    originalResultCount?: number;
    returnedResultCount?: number;
}
/**
 * T205: Enforce token budget on strategy results.
 *
 * Estimates the token count of the serialized result. If over budget,
 * parses embedded result arrays and removes lowest-priority items
 * until within budget. Higher-scored results are preserved.
 */
declare function enforceTokenBudget(result: ContextResult, budgetTokens: number): {
    result: ContextResult;
    enforcement: TokenBudgetEnforcement;
};
declare const CONTEXT_MODES: Record<string, ContextMode>;
declare const INTENT_TO_MODE: Record<string, string>;
/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
 * @param args - Context retrieval arguments (intent, mode, specFolder, anchors, etc.)
 * @returns MCP response with context-aware memory results
 */
declare function handleMemoryContext(args: ContextArgs): Promise<MCPResponse>;
export { handleMemoryContext, CONTEXT_MODES, INTENT_TO_MODE, enforceTokenBudget, };
declare const handle_memory_context: typeof handleMemoryContext;
export { handle_memory_context, };
//# sourceMappingURL=memory-context.d.ts.map