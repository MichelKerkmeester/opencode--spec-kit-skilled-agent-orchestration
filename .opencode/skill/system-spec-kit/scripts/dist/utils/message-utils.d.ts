import type { ToolCallEntry } from '../types/session-types';
/** Supported timestamp formats */
export type TimestampFormat = 'iso' | 'readable' | 'date' | 'date-dutch' | 'time' | 'time-short' | 'filename';
/** Tool call record within a message — alias for the canonical ToolCallEntry. */
export type ToolCall = ToolCallEntry;
/** Message record for artifact extraction */
export interface Message {
    timestamp?: string;
    toolCalls?: ToolCall[];
    prompt?: string;
    content?: string;
    [key: string]: unknown;
}
/** Summary of a conversation exchange (artifact-level, differs from session-types ExchangeSummary) */
export interface ExchangeArtifactSummary {
    userIntent: string;
    outcome: string;
    toolSummary: string;
    fullSummary: string;
}
/** Compat alias for ExchangeArtifactSummary. */
export type ExchangeSummary = ExchangeArtifactSummary;
/** File artifact entry */
export interface FileArtifact {
    path: string;
    timestamp?: string;
}
/** Command artifact entry */
export interface CommandArtifact {
    command: string;
    timestamp?: string;
}
/** Error artifact entry */
export interface ErrorArtifact {
    error: string;
    timestamp?: string;
}
declare function formatTimestamp(date?: Date | string | number, format?: TimestampFormat): string;
declare function truncateToolOutput(output: string, maxLines?: number): string;
declare function summarizeExchange(userMessage: string, assistantResponse: string, toolCalls?: ToolCallEntry[]): ExchangeArtifactSummary;
export { formatTimestamp, truncateToolOutput, summarizeExchange, };
//# sourceMappingURL=message-utils.d.ts.map