"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Tool Detection
// ───────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectToolCall = detectToolCall;
exports.isProseContext = isProseContext;
exports.classifyConversationPhase = classifyConversationPhase;
const phase_classifier_1 = require("../lib/phase-classifier");
// ───────────────────────────────────────────────────────────────
// 3. TOOL CALL DETECTION
// ───────────────────────────────────────────────────────────────
function detectToolCall(text) {
    if (!text || typeof text !== 'string')
        return null;
    const explicitMatch = text.match(/\bTool:\s*(\w+)/i);
    if (explicitMatch) {
        return { tool: explicitMatch[1], confidence: 'high' };
    }
    const callSyntaxMatch = text.match(/^\s*(Read|Edit|Write|Bash|Grep|Glob|Task|WebFetch|WebSearch|Skill)\s*\(/);
    if (callSyntaxMatch) {
        return { tool: callSyntaxMatch[1], confidence: 'high' };
    }
    const usingToolMatch = text.match(/\busing\s+(Read|Edit|Write|Bash|Grep|Glob|Task|WebFetch|WebSearch)\s+tool\b/i);
    if (usingToolMatch) {
        return { tool: usingToolMatch[1], confidence: 'medium' };
    }
    const calledMatch = text.match(/\bcalled?\s+(Read|Edit|Write|Bash|Grep|Glob|Task|WebFetch|WebSearch)\s*\(/i);
    if (calledMatch) {
        return { tool: calledMatch[1], confidence: 'medium' };
    }
    return null;
}
// ───────────────────────────────────────────────────────────────
// 4. PROSE CONTEXT DETECTION
// ───────────────────────────────────────────────────────────────
function isProseContext(text, matchStartIndex) {
    if (matchStartIndex < 0)
        return false;
    const before = text.substring(Math.max(0, matchStartIndex - 20), matchStartIndex);
    const after = text.substring(matchStartIndex, Math.min(text.length, matchStartIndex + 50));
    const sentenceBefore = /[.!?]\s*$/;
    const lowercaseAfter = /^[a-z]/;
    if (sentenceBefore.test(before) && lowercaseAfter.test(after)) {
        return true;
    }
    const contextWindow = before.substring(Math.max(0, before.length - 10)) + after.substring(0, 30);
    const prosePatterns = [
        /\bread\s+more\b/i,
        /\bread\s+about\b/i,
        /\bread\s+the\b/i,
        /\bto\s+read\b/i,
        /\byou\s+should\s+read\b/i
    ];
    for (const pattern of prosePatterns) {
        if (pattern.test(contextWindow)) {
            return true;
        }
    }
    return false;
}
// ───────────────────────────────────────────────────────────────
// 5. CONVERSATION PHASE CLASSIFICATION
// ───────────────────────────────────────────────────────────────
/** Pass-through wrapper. Prefer classifyPhaseViaSignals from phase-classifier.ts directly. */
function classifyConversationPhase(toolCalls, messageContent) {
    return (0, phase_classifier_1.classifyConversationPhase)(toolCalls, messageContent);
}
//# sourceMappingURL=tool-detection.js.map