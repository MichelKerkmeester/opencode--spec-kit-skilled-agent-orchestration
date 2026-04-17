// ───────────────────────────────────────────────────────────────
// MODULE: Gemini Hook Shared Utilities
// ───────────────────────────────────────────────────────────────
// Gemini-specific stdin/stdout handling. Reuses core helpers from
// ../claude/shared.js for budget, logging, and formatting.

import { hookLog } from '../claude/shared.js';

// Re-export shared provenance helpers so Gemini-side modules can
// import them without reaching into ../claude/shared.js (T-W1-HOK-02).
export {
  escapeProvenanceField,
  sanitizeRecoveredPayload,
  wrapRecoveredCompactPayload,
  type RecoveredCompactMetadata,
} from '../shared-provenance.js';

/** Parsed JSON from Gemini CLI hook stdin */
export interface GeminiHookInput {
  readonly session_id?: string;
  readonly transcript_path?: string;
  readonly cwd?: string;
  readonly hook_event_name?: string;
  readonly timestamp?: string;
  // SessionStart fields (Gemini has startup/resume/clear; no native compact source)
  readonly source?: 'startup' | 'resume' | 'clear' | string;
  // PreCompress fields
  readonly trigger?: 'manual' | 'auto';
  // AfterAgent fields
  readonly prompt?: string;
  readonly prompt_response?: string;
  readonly stop_hook_active?: boolean;
  // SessionEnd fields
  readonly reason?: string;
  readonly [key: string]: unknown;
}

/**
 * Gemini hook JSON output format.
 *
 * For context injection (SessionStart, BeforeAgent), Gemini looks for
 * hookSpecificOutput.additionalContext. Plain text stdout becomes a
 * systemMessage (displayed to stderr, not injected into conversation).
 */
export interface GeminiHookOutput {
  readonly decision?: 'allow' | 'block' | 'deny';
  readonly systemMessage?: string;
  readonly hookSpecificOutput?: {
    readonly additionalContext?: string;
    readonly [key: string]: unknown;
  };
}

/** Read and parse JSON from stdin (Gemini format). Returns null on failure. */
export async function parseGeminiStdin(): Promise<GeminiHookInput | null> {
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk as Buffer);
    }
    const raw = Buffer.concat(chunks).toString('utf-8').trim();
    if (!raw) return null;
    return JSON.parse(raw) as GeminiHookInput;
  } catch (err: unknown) {
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
export function formatGeminiOutput(content: string, options?: { asSystemMessage?: boolean }): string {
  if (options?.asSystemMessage) {
    // systemMessage goes to stderr display, not into conversation
    const output: GeminiHookOutput = {
      decision: 'allow',
      systemMessage: content,
    };
    return JSON.stringify(output);
  }

  // additionalContext gets injected into the conversation
  const output: GeminiHookOutput = {
    decision: 'allow',
    hookSpecificOutput: {
      additionalContext: content,
    },
  };
  return JSON.stringify(output);
}
