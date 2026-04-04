"use strict";
// ---------------------------------------------------------------
// MODULE: Fact Coercion
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerceFactToText = coerceFactToText;
exports.coerceFactsToText = coerceFactsToText;
// ───────────────────────────────────────────────────────────────
// 1. FACT COERCION
// ───────────────────────────────────────────────────────────────
// Normalizes runtime fact values into displayable strings without
// silently dropping object-shaped content at extractor boundaries.
const logger_1 = require("./logger");
function coerceFactToText(value) {
    if (typeof value === 'string') {
        return {
            text: value,
            sourceType: 'string',
        };
    }
    if (value === null || value === undefined) {
        return {
            text: '',
            dropReason: 'nullish',
            sourceType: 'nullish',
        };
    }
    if (typeof value === 'object') {
        const candidate = value;
        if (typeof candidate.text === 'string' && candidate.text.length > 0) {
            return {
                text: candidate.text,
                sourceType: 'text-object',
            };
        }
        try {
            return {
                text: `[object] ${JSON.stringify(value)}`,
                sourceType: 'object',
            };
        }
        catch {
            return {
                text: '[object] [unserializable]',
                dropReason: 'unserializable-object',
                sourceType: 'object',
            };
        }
    }
    return {
        text: String(value),
        sourceType: 'primitive',
    };
}
function coerceFactsToText(facts, logContext) {
    if (!Array.isArray(facts) || facts.length === 0) {
        return [];
    }
    const coerced = facts.map((fact) => coerceFactToText(fact));
    const dropped = coerced.filter((fact) => fact.dropReason);
    if (dropped.length > 0) {
        const ctx = logContext || { component: 'unknown', fieldPath: 'unknown' };
        const dropReasonCounts = dropped.reduce((counts, fact) => {
            const reason = fact.dropReason || 'unknown';
            counts[reason] = (counts[reason] || 0) + 1;
            return counts;
        }, {});
        (0, logger_1.structuredLog)('warn', 'fact_coercion_drop', {
            component: ctx.component,
            fieldPath: ctx.fieldPath,
            specFolder: ctx.specFolder,
            sessionId: ctx.sessionId,
            droppedCount: dropped.length,
            dropReasonCounts,
        });
    }
    return coerced
        .map((fact) => fact.text)
        .filter((text) => text.length > 0);
}
//# sourceMappingURL=fact-coercion.js.map