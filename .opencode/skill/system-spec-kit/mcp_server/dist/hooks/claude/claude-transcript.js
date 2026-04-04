// ───────────────────────────────────────────────────────────────
// MODULE: Claude Transcript Parser
// ───────────────────────────────────────────────────────────────
// Parses Claude Code transcript JSONL files to extract token usage,
// model info, and conversation content.
import { createReadStream, statSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { hookLog } from './shared.js';
/** Parse a transcript JSONL file and extract token usage.
 *  Supports incremental parsing via startOffset (byte offset). */
export async function parseTranscript(filePath, startOffset = 0) {
    const usage = {
        promptTokens: 0,
        completionTokens: 0,
        cacheCreationTokens: 0,
        cacheReadTokens: 0,
        totalTokens: 0,
        messageCount: 0,
        model: null,
    };
    try {
        const { size: fileSize } = statSync(filePath);
        if (startOffset >= fileSize) {
            return { usage, newOffset: fileSize };
        }
        const stream = createReadStream(filePath, {
            encoding: 'utf-8',
            start: startOffset,
        });
        const lineReader = createInterface({
            input: stream,
            crlfDelay: Infinity,
        });
        for await (const line of lineReader) {
            if (!line.trim()) {
                continue;
            }
            try {
                const parsed = JSON.parse(line);
                const msg = parsed.message ?? {};
                if (msg.usage) {
                    const u = msg.usage;
                    const prompt = u.input_tokens ?? 0;
                    const completion = u.output_tokens ?? 0;
                    const cacheCreation = u.cache_creation_input_tokens ?? 0;
                    const cacheRead = u.cache_read_input_tokens ?? 0;
                    usage.promptTokens += prompt;
                    usage.completionTokens += completion;
                    usage.cacheCreationTokens += cacheCreation;
                    usage.cacheReadTokens += cacheRead;
                    usage.totalTokens += prompt + completion;
                    usage.messageCount++;
                }
                if (msg.model && !usage.model) {
                    usage.model = msg.model;
                }
            }
            catch {
                // Skip malformed JSON lines
            }
        }
        return { usage, newOffset: fileSize };
    }
    catch (err) {
        hookLog('warn', 'transcript', `Failed to parse transcript: ${err instanceof Error ? err.message : String(err)}`);
        return { usage, newOffset: startOffset };
    }
}
/** Estimate cost in USD based on model and token counts */
export function estimateCost(usage) {
    const model = (usage.model ?? '').toLowerCase();
    // Pricing per 1M tokens (approximate)
    let promptPricePerM;
    let completionPricePerM;
    if (model.includes('opus')) {
        promptPricePerM = 15;
        completionPricePerM = 75;
    }
    else if (model.includes('haiku')) {
        promptPricePerM = 0.25;
        completionPricePerM = 1.25;
    }
    else {
        // Default to Sonnet pricing
        promptPricePerM = 3;
        completionPricePerM = 15;
    }
    const promptCost = (usage.promptTokens / 1_000_000) * promptPricePerM;
    const completionCost = (usage.completionTokens / 1_000_000) * completionPricePerM;
    return Math.round((promptCost + completionCost) * 10000) / 10000;
}
//# sourceMappingURL=claude-transcript.js.map