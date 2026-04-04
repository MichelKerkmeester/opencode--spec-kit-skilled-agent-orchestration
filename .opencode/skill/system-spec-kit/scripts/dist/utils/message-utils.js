"use strict";
// ---------------------------------------------------------------
// MODULE: Message Utils
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTimestamp = formatTimestamp;
exports.truncateToolOutput = truncateToolOutput;
exports.summarizeExchange = summarizeExchange;
// ───────────────────────────────────────────────────────────────
// 1. MESSAGE UTILS
// ───────────────────────────────────────────────────────────────
// Timestamp formatting, exchange summarization, and tool output truncation
// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
const core_1 = require("../core");
const logger_1 = require("./logger");
// ───────────────────────────────────────────────────────────────
// 4. TIMESTAMP FORMATTING
// ───────────────────────────────────────────────────────────────
// NOTE: Similar to lib/simulation-factory.ts:formatTimestamp but differs in:
// - Applies CONFIG.TIMEZONE_OFFSET_HOURS adjustment (simulation-factory uses raw UTC)
// - Logs structuredLog warn for invalid dates (simulation-factory silently falls back)
// - Logs structuredLog warn for unknown format (simulation-factory returns raw ISO string)
function formatTimestamp(date = new Date(), format = 'iso') {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) {
        (0, logger_1.structuredLog)('warn', `Invalid date: ${date}, using current time`);
        return formatTimestamp(new Date(), format);
    }
    if (format === 'iso') {
        return d.toISOString();
    }
    const offsetMs = core_1.CONFIG.TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000;
    const adjustedDate = new Date(d.getTime() + offsetMs);
    const isoString = adjustedDate.toISOString();
    const [datePart, timePart] = isoString.split('T');
    const timeWithoutMs = timePart.split('.')[0];
    switch (format) {
        case 'readable':
            return `${datePart} @ ${timeWithoutMs}`;
        case 'date':
            return datePart;
        case 'date-dutch': {
            const [year, month, day] = datePart.split('-');
            const shortYear = year.slice(-2);
            return `${day}-${month}-${shortYear}`;
        }
        case 'time':
            return timeWithoutMs;
        case 'time-short': {
            const [hours, minutes] = timeWithoutMs.split(':');
            return `${hours}-${minutes}`;
        }
        case 'filename':
            return `${datePart}_${timeWithoutMs.replace(/:/g, '-')}`;
        default:
            (0, logger_1.structuredLog)('warn', `Unknown timestamp format "${format}", using ISO`);
            return d.toISOString();
    }
}
// ───────────────────────────────────────────────────────────────
// 5. OUTPUT TRUNCATION
// ───────────────────────────────────────────────────────────────
function truncateToolOutput(output, maxLines = core_1.CONFIG.MAX_TOOL_OUTPUT_LINES) {
    if (!output)
        return '';
    const lines = output.split('\n');
    if (lines.length <= maxLines) {
        return output;
    }
    const truncateFirstLines = core_1.CONFIG.TRUNCATE_FIRST_LINES;
    const truncateLastLines = core_1.CONFIG.TRUNCATE_LAST_LINES;
    const firstLines = lines.slice(0, truncateFirstLines);
    const lastLines = lines.slice(-truncateLastLines);
    const truncatedCount = lines.length - truncateFirstLines - truncateLastLines;
    return [
        ...firstLines,
        '',
        `... [Truncated: ${truncatedCount} lines] ...`,
        '',
        ...lastLines
    ].join('\n');
}
// ───────────────────────────────────────────────────────────────
// 6. EXCHANGE SUMMARIZATION
// ───────────────────────────────────────────────────────────────
function summarizeExchange(userMessage, assistantResponse, toolCalls = []) {
    let userIntent;
    if (userMessage.length <= 200) {
        userIntent = userMessage;
    }
    else {
        const sentenceEnd = userMessage.substring(0, 200).match(/^(.+?[.!?])\s/);
        userIntent = sentenceEnd ? sentenceEnd[1] : userMessage.substring(0, 200) + '...';
    }
    const mainTools = toolCalls.slice(0, 3).map((t) => t.TOOL_NAME).join(', ');
    const toolSummary = toolCalls.length > 0
        ? ` Used tools: ${mainTools}${toolCalls.length > 3 ? ` and ${toolCalls.length - 3} more` : ''}.`
        : '';
    const sentences = assistantResponse.match(/[^.!?]+[.!?]+/g);
    const outcome = sentences && sentences.length > 0
        ? sentences.slice(0, 2).join(' ').trim()
        : assistantResponse.substring(0, 300);
    return {
        userIntent,
        outcome: outcome + (outcome.length < assistantResponse.length ? '...' : ''),
        toolSummary,
        fullSummary: `${userIntent} \u2192 ${outcome}${toolSummary}`
    };
}
//# sourceMappingURL=message-utils.js.map