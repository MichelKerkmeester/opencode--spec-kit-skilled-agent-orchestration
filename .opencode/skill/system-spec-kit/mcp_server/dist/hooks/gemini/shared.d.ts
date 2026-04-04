/** Parsed JSON from Gemini CLI hook stdin */
export interface GeminiHookInput {
    session_id?: string;
    transcript_path?: string;
    cwd?: string;
    hook_event_name?: string;
    timestamp?: string;
    source?: 'startup' | 'resume' | 'clear' | string;
    trigger?: 'manual' | 'auto';
    prompt?: string;
    prompt_response?: string;
    stop_hook_active?: boolean;
    reason?: string;
    [key: string]: unknown;
}
/**
 * Gemini hook JSON output format.
 *
 * For context injection (SessionStart, BeforeAgent), Gemini looks for
 * hookSpecificOutput.additionalContext. Plain text stdout becomes a
 * systemMessage (displayed to stderr, not injected into conversation).
 */
export interface GeminiHookOutput {
    decision?: 'allow' | 'block' | 'deny';
    systemMessage?: string;
    hookSpecificOutput?: {
        additionalContext?: string;
        [key: string]: unknown;
    };
}
/** Read and parse JSON from stdin (Gemini format). Returns null on failure. */
export declare function parseGeminiStdin(): Promise<GeminiHookInput | null>;
/**
 * Format output as Gemini-compatible JSON.
 *
 * For events that support context injection (SessionStart, BeforeAgent),
 * the content is placed in hookSpecificOutput.additionalContext so Gemini
 * wraps it in <hook_context> tags and prepends it to the conversation.
 *
 * Note: Gemini HTML-escapes additionalContext (< and > become &lt; and &gt;),
 * so avoid markdown headers with angle brackets.
 */
export declare function formatGeminiOutput(content: string, options?: {
    asSystemMessage?: boolean;
}): string;
//# sourceMappingURL=shared.d.ts.map