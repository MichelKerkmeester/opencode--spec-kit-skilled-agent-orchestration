"use strict";
// ---------------------------------------------------------------
// MODULE: CLI Capture Shared Helpers
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_EXCHANGES_DEFAULT = void 0;
exports.transcriptTimestamp = transcriptTimestamp;
exports.readJsonl = readJsonl;
exports.normalizeToolName = normalizeToolName;
exports.stringifyPreview = stringifyPreview;
exports.extractTextContent = extractTextContent;
exports.buildSessionTitle = buildSessionTitle;
exports.parseToolArguments = parseToolArguments;
exports.sortAndSliceExchanges = sortAndSliceExchanges;
exports.drainPendingPrompts = drainPendingPrompts;
exports.countResponses = countResponses;
// ───────────────────────────────────────────────────────────────
// 1. CLI CAPTURE SHARED HELPERS
// ───────────────────────────────────────────────────────────────
// Shared utility functions extracted from the 4 CLI capture modules
// (claude-code, codex-cli, copilot-cli, gemini-cli) to eliminate
// duplication and prevent behavioral drift.
//
// Created as part of CODEX2-006 deduplication.
// The capture modules can be updated to import from here in a
// follow-up pass.
const fs = __importStar(require("fs/promises"));
/* ───────────────────────────────────────────────────────────────
   2. TIMESTAMP PARSING
------------------------------------------------------------------*/
/**
 * Parses an ISO-8601 (or similar) timestamp string into epoch ms.
 * Returns 0 for falsy, unparseable, or non-finite values.
 *
 * Identical implementation in: claude-code, codex-cli, copilot-cli, gemini-cli.
 */
function transcriptTimestamp(value) {
    if (!value) {
        return 0;
    }
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
}
/* ───────────────────────────────────────────────────────────────
   3. JSONL PARSING
------------------------------------------------------------------*/
/**
 * Reads a JSONL file and returns an array of parsed objects.
 * Silently skips malformed lines and returns [] on read failure.
 *
 * Identical implementation in: claude-code, codex-cli, copilot-cli.
 * (gemini-cli uses JSON session files instead of JSONL.)
 */
async function readJsonl(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return content
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
            try {
                return JSON.parse(line);
            }
            catch {
                return null;
            }
        })
            .filter((entry) => entry !== null);
    }
    catch {
        return [];
    }
}
/* ───────────────────────────────────────────────────────────────
   4. TOOL NAME NORMALIZATION
------------------------------------------------------------------*/
/**
 * Normalizes a raw tool name to lowercase. Returns 'unknown' for
 * non-string inputs.
 *
 * Identical implementation in: claude-code, codex-cli, copilot-cli, gemini-cli.
 */
function normalizeToolName(rawName) {
    return typeof rawName === 'string' ? rawName.toLowerCase() : 'unknown';
}
/* ───────────────────────────────────────────────────────────────
   5. PREVIEW TEXT FORMATTING
------------------------------------------------------------------*/
/**
 * Converts an arbitrary value to a trimmed string preview.
 * Strings are trimmed, nullish values become '', objects are
 * JSON-stringified, and fallback uses String().
 *
 * Identical implementation in: codex-cli, copilot-cli, gemini-cli.
 * (claude-code uses extractToolResultText instead.)
 */
function stringifyPreview(value) {
    if (typeof value === 'string') {
        return value.trim();
    }
    if (value === null || value === undefined) {
        return '';
    }
    try {
        return JSON.stringify(value);
    }
    catch {
        return String(value);
    }
}
/* ───────────────────────────────────────────────────────────────
   6. TEXT CONTENT EXTRACTION
------------------------------------------------------------------*/
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
function extractTextContent(content) {
    if (typeof content === 'string') {
        return content.trim();
    }
    if (!Array.isArray(content)) {
        return '';
    }
    return content
        .map((item) => {
        if (typeof item === 'string') {
            return item;
        }
        if (!item || typeof item !== 'object') {
            return '';
        }
        const block = item;
        // Superset: accept any block with a text string property.
        // Claude-style blocks have type='text', codex/gemini blocks
        // may omit the type field. Both are handled.
        if (typeof block.text === 'string') {
            return block.text;
        }
        return '';
    })
        .filter(Boolean)
        .join('\n')
        .trim();
}
/* ───────────────────────────────────────────────────────────────
   7. SESSION TITLE BUILDING
------------------------------------------------------------------*/
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
function buildSessionTitle(exchanges, sessionId, cliName) {
    const firstPrompt = exchanges.find((exchange) => (exchange.userInput || '').trim().length > 0);
    if (firstPrompt) {
        return (firstPrompt.userInput || '').trim().slice(0, 80);
    }
    return `${cliName} session ${sessionId.slice(0, 8)}`;
}
/* ───────────────────────────────────────────────────────────────
   8. TOOL ARGUMENTS PARSING
------------------------------------------------------------------*/
/**
 * Parses tool call arguments from either an object or a JSON string
 * into a plain record. Returns {} on failure.
 *
 * Canonical implementation from: codex-cli.
 * Also useful for copilot-cli and gemini-cli when arguments arrive
 * as serialized strings.
 */
function parseToolArguments(rawArguments) {
    if (rawArguments && typeof rawArguments === 'object' && !Array.isArray(rawArguments)) {
        return { ...rawArguments };
    }
    if (typeof rawArguments !== 'string') {
        return {};
    }
    try {
        const parsed = JSON.parse(rawArguments);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return parsed;
        }
    }
    catch {
        return {};
    }
    return {};
}
/* ───────────────────────────────────────────────────────────────
   9. EXCHANGE SORTING AND SLICING
------------------------------------------------------------------*/
/**
 * Sorts exchanges by timestamp and returns the most recent N.
 * Guarantees at least 1 exchange is returned (if input is non-empty).
 *
 * Identical pattern in: claude-code, codex-cli, copilot-cli, gemini-cli.
 *
 * @param exchanges - Unsorted capture exchanges
 * @param maxExchanges - Maximum number of exchanges to return
 */
function sortAndSliceExchanges(exchanges, maxExchanges) {
    return exchanges
        .sort((a, b) => transcriptTimestamp(String(a.timestamp)) - transcriptTimestamp(String(b.timestamp)))
        .slice(-Math.max(1, maxExchanges));
}
/* ───────────────────────────────────────────────────────────────
   10. PENDING PROMPT DRAINING
------------------------------------------------------------------*/
/**
 * Drains remaining pending prompts into exchanges with empty
 * assistant responses. Called at the end of transcript processing
 * to ensure no user input is lost.
 *
 * Identical pattern in: claude-code, codex-cli, copilot-cli, gemini-cli.
 */
function drainPendingPrompts(pendingPrompts, exchanges) {
    while (pendingPrompts.length > 0) {
        const pendingPrompt = pendingPrompts.shift();
        if (!pendingPrompt) {
            continue;
        }
        exchanges.push({
            userInput: pendingPrompt.prompt,
            assistantResponse: '',
            timestamp: pendingPrompt.timestamp,
        });
    }
}
/* ───────────────────────────────────────────────────────────────
   11. METADATA BUILDING
------------------------------------------------------------------*/
/**
 * Counts total responses (exchanges with non-empty assistant text).
 *
 * Identical pattern in: claude-code, codex-cli, copilot-cli, gemini-cli.
 */
function countResponses(exchanges) {
    return exchanges.filter((exchange) => (exchange.assistantResponse || '').trim().length > 0).length;
}
/* ───────────────────────────────────────────────────────────────
   12. DEFAULT CONSTANTS
------------------------------------------------------------------*/
/**
 * Default maximum number of exchanges to capture.
 * Used by all 4 CLI capture modules.
 */
exports.MAX_EXCHANGES_DEFAULT = 20;
//# sourceMappingURL=cli-capture-shared.js.map