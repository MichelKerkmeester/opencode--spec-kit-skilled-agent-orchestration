"use strict";
// ---------------------------------------------------------------
// MODULE: Topic Extractor
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractKeyTopics = extractKeyTopics;
// ───────────────────────────────────────────────────────────────
// 1. TOPIC EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Extracts key topics from session data using weighted scoring and bigram analysis
const semantic_signal_extractor_1 = require("../lib/semantic-signal-extractor");
const SIMULATION_MARKER = 'SIMULATION';
// NOTE: Similar to extractors/session-extractor.ts:extractKeyTopics but differs in:
// - Uses compound phrase extraction (bigrams) for more meaningful topics
// - Accepts `string` only (session-extractor accepts `string | undefined`)
// - Includes spec folder name tokens as high-priority topics
// - Processes TITLE/RATIONALE from decisions with higher weight
/** Extract key topics. */
function extractKeyTopics(summary, decisions = [], _specFolderName) {
    const weightedSegments = [];
    // T09: Do NOT push spec folder name into weightedSegments — folder path fragments
    // contaminate topics with generic infrastructure words. Topics should come from
    // actual session content (summary, decisions).
    for (const decision of decisions) {
        const title = decision.TITLE || '';
        const rationale = decision.RATIONALE || '';
        if (title && !title.includes(SIMULATION_MARKER)) {
            weightedSegments.push(title, title);
        }
        if (rationale && !rationale.includes(SIMULATION_MARKER)) {
            weightedSegments.push(rationale);
        }
    }
    if (summary && summary.length >= 20 && !summary.includes(SIMULATION_MARKER)) {
        weightedSegments.push(summary);
    }
    return semantic_signal_extractor_1.SemanticSignalExtractor.extractTopicTerms(weightedSegments.join('\n\n'), {
        stopwordProfile: 'aggressive',
        ngramDepth: 2,
    });
}
//# sourceMappingURL=topic-extractor.js.map