// ───────────────────────────────────────────────────────────────
// MODULE: Gemini Hook Shared Utilities
// ───────────────────────────────────────────────────────────────
// Gemini-specific stdin/stdout handling. Reuses core helpers from
// ../claude/shared.js for budget, logging, and formatting.

import { hookLog } from '../claude/shared.js';

/** Parsed JSON from Gemini CLI hook stdin */
export interface GeminiHookInput {
  session_id?: string;
  transcript_path?: string;
  cwd?: string;
  hook_event_name?: string;
  timestamp?: string;
  // SessionStart fields (Gemini has startup/resume/clear; no native compact source)
  source?: 'startup' | 'resume' | 'clear' | string;
  // PreCompress fields
  trigger?: 'manual' | 'auto';
  // AfterAgent fields
  prompt?: string;
  prompt_response?: string;
  stop_hook_active?: boolean;
  // SessionEnd fields
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
