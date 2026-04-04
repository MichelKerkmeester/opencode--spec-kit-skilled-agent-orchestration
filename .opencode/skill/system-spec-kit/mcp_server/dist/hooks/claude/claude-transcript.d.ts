/** Token usage from a single assistant message */
export interface MessageUsage {
    promptTokens: number;
    completionTokens: number;
    cacheCreationTokens: number;
    cacheReadTokens: number;
    totalTokens: number;
    model?: string;
}
/** Aggregated token usage for an entire transcript */
export interface TranscriptUsage {
    promptTokens: number;
    completionTokens: number;
    cacheCreationTokens: number;
    cacheReadTokens: number;
    totalTokens: number;
    messageCount: number;
    model: string | null;
}
/** Parse a transcript JSONL file and extract token usage.
 *  Supports incremental parsing via startOffset (byte offset). */
export declare function parseTranscript(filePath: string, startOffset?: number): Promise<{
    usage: TranscriptUsage;
    newOffset: number;
}>;
/** Estimate cost in USD based on model and token counts */
export declare function estimateCost(usage: TranscriptUsage): number;
//# sourceMappingURL=claude-transcript.d.ts.map