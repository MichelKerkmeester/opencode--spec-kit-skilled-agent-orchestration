import type { CaptureExchange } from '../utils/input-normalizer';
/**
 * A user prompt awaiting pairing with an assistant response.
 * Used identically across all 4 capture modules.
 */
export type PendingPrompt = {
    prompt: string;
    timestamp: string;
};
/**
 * Parses an ISO-8601 (or similar) timestamp string into epoch ms.
 * Returns 0 for falsy, unparseable, or non-finite values.
 *
 * Identical implementation in: claude-code, codex-cli, copilot-cli, gemini-cli.
 */
export declare function transcriptTimestamp(value?: string): number;
/**
 * Reads a JSONL file and returns an array of parsed objects.
 * Silently skips malformed lines and returns [] on read failure.
 *
 * Identical implementation in: claude-code, codex-cli, copilot-cli.
 * (gemini-cli uses JSON session files instead of JSONL.)
 */
export declare function readJsonl(filePath: string): Promise<unknown[]>;
/**
 * Normalizes a raw tool name to lowercase. Returns 'unknown' for
 * non-string inputs.
 *
 * Identical implementation in: claude-code, codex-cli, copilot-cli, gemini-cli.
 */
export declare function normalizeToolName(rawName: unknown): string;
/**
 * Converts an arbitrary value to a trimmed string preview.
 * Strings are trimmed, nullish values become '', objects are
 * JSON-stringified, and fallback uses String().
 *
 * Identical implementation in: codex-cli, copilot-cli, gemini-cli.
 * (claude-code uses extractToolResultText instead.)
 */
export declare function stringifyPreview(value: unknown): string;
/**
 * Extracts plain text from a message content field that may be a
 * string, an array of content blocks ({ type: 'text', text: '...' }),
 * or an array of strings.
 *
 * This is the superset implementation covering all CLI formats:
 * - claude-code: checks block.type === 'text' && block.text
 * - codex-cli: checks block.text directly (no type guard)
 * - gemini-cli: checks block.text directly (no type guard)
 *
 * The unified version handles both patterns: blocks with a `text`
 * property (codex/gemini style) and blocks with type='text' + text
 * property (claude style) are both extracted.
 */
export declare function extractTextContent(content: unknown): string;
/**
 * Builds a human-readable session title from the first non-empty
 * user prompt, truncated to 80 chars. Falls back to a generic
 * label using the CLI name and session ID prefix.
 *
 * Identical logic in: claude-code, codex-cli, copilot-cli, gemini-cli
 * (each uses a different fallback label).
 *
 * @param exchanges - Sorted capture exchanges
 * @param sessionId - Session identifier for fallback label
 * @param cliName - CLI name for fallback (e.g. 'Claude Code', 'Codex CLI')
 */
export declare function buildSessionTitle(exchanges: CaptureExchange[], sessionId: string, cliName: string): string;
/**
 * Parses tool call arguments from either an object or a JSON string
 * into a plain record. Returns {} on failure.
 *
 * Canonical implementation from: codex-cli.
 * Also useful for copilot-cli and gemini-cli when arguments arrive
 * as serialized strings.
 */
export declare function parseToolArguments(rawArguments: unknown): Record<string, unknown>;
/**
 * Sorts exchanges by timestamp and returns the most recent N.
 * Guarantees at least 1 exchange is returned (if input is non-empty).
 *
 * Identical pattern in: claude-code, codex-cli, copilot-cli, gemini-cli.
 *
 * @param exchanges - Unsorted capture exchanges
 * @param maxExchanges - Maximum number of exchanges to return
 */
export declare function sortAndSliceExchanges(exchanges: CaptureExchange[], maxExchanges: number): CaptureExchange[];
/**
 * Drains remaining pending prompts into exchanges with empty
 * assistant responses. Called at the end of transcript processing
 * to ensure no user input is lost.
 *
 * Identical pattern in: claude-code, codex-cli, copilot-cli, gemini-cli.
 */
export declare function drainPendingPrompts(pendingPrompts: PendingPrompt[], exchanges: CaptureExchange[]): void;
/**
 * Counts total responses (exchanges with non-empty assistant text).
 *
 * Identical pattern in: claude-code, codex-cli, copilot-cli, gemini-cli.
 */
export declare function countResponses(exchanges: CaptureExchange[]): number;
/**
 * Default maximum number of exchanges to capture.
 * Used by all 4 CLI capture modules.
 */
export declare const MAX_EXCHANGES_DEFAULT = 20;
//# sourceMappingURL=cli-capture-shared.d.ts.map