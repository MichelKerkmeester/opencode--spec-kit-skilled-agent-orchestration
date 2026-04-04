/** Timeout for hook scripts — must stay under 2s hard cap */
export declare const HOOK_TIMEOUT_MS = 1800;
/** Token budget for compaction context injection */
export declare const COMPACTION_TOKEN_BUDGET = 4000;
/** Token budget for session priming (startup/resume) */
export declare const SESSION_PRIME_TOKEN_BUDGET = 2000;
/** Parsed JSON from Claude Code hook stdin */
export interface HookInput {
    session_id?: string;
    transcript_path?: string;
    trigger?: 'auto' | 'manual';
    source?: 'startup' | 'resume' | 'clear' | 'compact';
    custom_instructions?: string;
    stop_hook_active?: boolean;
    last_assistant_message?: string;
    [key: string]: unknown;
}
/** A titled section for hook stdout output */
export interface OutputSection {
    title: string;
    content: string;
}
/** Read and parse JSON from stdin. Returns null on failure. */
export declare function parseHookStdin(): Promise<HookInput | null>;
/** Format sections into readable text block for stdout injection */
export declare function formatHookOutput(sections: OutputSection[]): string;
/** Wrap a promise with a timeout. Returns fallback value on timeout. */
export declare function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T>;
/** Log to stderr (stdout is reserved for hook output injection) */
export declare function hookLog(level: 'info' | 'warn' | 'error', tag: string, msg: string): void;
/** Estimate token count (rough: 1 token ≈ 4 chars) and truncate if over budget */
export declare function truncateToTokenBudget(text: string, maxTokens: number): string;
/** Remove obvious system-instruction lines from recovered transcript text */
export declare function sanitizeRecoveredPayload(payload: string): string;
/** Add explicit provenance markers around recovered compact context */
export declare function wrapRecoveredCompactPayload(payload: string, cachedAt: string, metadata?: {
    producer?: string;
    trustState?: string;
    sourceSurface?: string;
}): string;
/** Calculate pressure-adjusted budget based on context window usage */
export declare function calculatePressureAdjustedBudget(currentTokens: number | undefined, maxTokens: number | undefined, baseBudget: number): number;
//# sourceMappingURL=shared.d.ts.map