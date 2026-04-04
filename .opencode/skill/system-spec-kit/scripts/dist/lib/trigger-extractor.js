"use strict";
// ---------------------------------------------------------------
// MODULE: Trigger Extractor
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOP_WORDS_ENGLISH = exports.CONFIG = exports.extract_trigger_phrases_with_stats = exports.extract_trigger_phrases = void 0;
exports.extractTriggerPhrases = extractTriggerPhrases;
exports.extractTriggerPhrasesWithStats = extractTriggerPhrasesWithStats;
// ───────────────────────────────────────────────────────────────
// 1. TRIGGER EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Script-side compatibility wrapper over the unified semantic signal extractor.
const semantic_signal_extractor_1 = require("./semantic-signal-extractor");
const trigger_extractor_1 = require("@spec-kit/shared/trigger-extractor");
Object.defineProperty(exports, "STOP_WORDS_ENGLISH", { enumerable: true, get: function () { return trigger_extractor_1.STOP_WORDS_ENGLISH; } });
function normalizeTextInput(text) {
    return typeof text === 'string' ? text : '';
}
function extractTriggerPhrases(text) {
    const normalizedText = normalizeTextInput(text);
    if (normalizedText.trim().length < 3) {
        return [];
    }
    return semantic_signal_extractor_1.SemanticSignalExtractor.extractTriggerPhrases(normalizedText);
}
function extractTriggerPhrasesWithStats(text) {
    const normalizedText = normalizeTextInput(text);
    if (normalizedText.trim().length < 3) {
        return {
            phrases: [],
            stats: {
                inputLength: normalizedText.length,
                cleanedLength: normalizedText.trim().length,
                tokenCount: 0,
                filteredTokenCount: 0,
                phraseCount: 0,
                extractionTimeMs: 0,
            },
            breakdown: {
                problemTerms: 0,
                technicalTerms: 0,
                decisionTerms: 0,
                actionTerms: 0,
                compoundNouns: 0,
                samples: {
                    problem: [],
                    technical: [],
                    decision: [],
                    action: [],
                    compound: [],
                },
            },
        };
    }
    return semantic_signal_extractor_1.SemanticSignalExtractor.extractTriggerPhrasesWithStats(normalizedText);
}
exports.extract_trigger_phrases = extractTriggerPhrases;
exports.extract_trigger_phrases_with_stats = extractTriggerPhrasesWithStats;
exports.CONFIG = trigger_extractor_1.CONFIG;
//# sourceMappingURL=trigger-extractor.js.map