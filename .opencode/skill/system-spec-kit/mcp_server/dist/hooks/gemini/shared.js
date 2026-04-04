// ───────────────────────────────────────────────────────────────
// MODULE: Gemini Hook Shared Utilities
// ───────────────────────────────────────────────────────────────
// Gemini-specific stdin/stdout handling. Reuses core helpers from
// ../claude/shared.js for budget, logging, and formatting.
import { hookLog } from '../claude/shared.js';
/** Read and parse JSON from stdin (Gemini format). Returns null on failure. */
export async function parseGeminiStdin() {
    try {
        const chunks = [];
        for await (const chunk of process.stdin) {
            chunks.push(chunk);
        }
        const raw = Buffer.concat(chunks).toString('utf-8').trim();
        if (!raw)
            return null;
        return JSON.parse(raw);
    }
    catch (err) {
        hookLog('warn', 'gemini:stdin', `Failed to parse hook stdin: ${err instanceof Error ? err.message : String(err)}`);
        return null;
    }
}
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
export function formatGeminiOutput(content, options) {
    if (options?.asSystemMessage) {
        // systemMessage goes to stderr display, not into conversation
        const output = {
            decision: 'allow',
            systemMessage: content,
        };
        return JSON.stringify(output);
    }
    // additionalContext gets injected into the conversation
    const output = {
        decision: 'allow',
        hookSpecificOutput: {
            additionalContext: content,
        },
    };
    return JSON.stringify(output);
}
//# sourceMappingURL=shared.js.map