import path from 'path';
import * as workingMemory from '../cognitive/working-memory.js';
import { isFeatureEnabled } from '../cognitive/rollout-policy.js';
import { applyRedactionGate } from './redaction-gate.js';
const REDACTION_SKIP_THRESHOLD = 0.9;
const RULES = [
    {
        id: 'read-spec',
        toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
        contentPattern: /spec\.md/i,
        attention: 0.9,
        summarizer: 'firstLast500',
    },
    {
        id: 'grep-error',
        toolPattern: /^(grep|memory_search)$/i,
        contentPattern: /\berror\b/i,
        attention: 0.8,
        summarizer: 'matchCountSummary',
    },
    {
        id: 'bash-git-commit',
        toolPattern: /^(bash|memory_save|memory_update)$/i,
        contentPattern: /\bgit\s+commit\b/i,
        attention: 0.7,
        summarizer: 'stdoutSummary',
    },
];
let db = null;
const metrics = {
    matched: 0,
    inserted: 0,
    skipped: 0,
    redacted: 0,
};
function isEnabled(identity) {
    return isFeatureEnabled('SPECKIT_EXTRACTION', identity);
}
function normalizeAttention(value) {
    if (!Number.isFinite(value))
        return 0;
    return Math.max(0, Math.min(1, value));
}
function assertSafeRegex(expression, ruleId, fieldName) {
    const source = expression.source;
    if (/\([^)]*[+*][^)]*\)[+*{?]/.test(source)) {
        throw new Error(`[extraction-adapter] Unsafe regex rejected (${ruleId}.${fieldName}): nested quantifier group detected`);
    }
    if (/\\[1-9]/.test(source)) {
        throw new Error(`[extraction-adapter] Unsafe regex rejected (${ruleId}.${fieldName}): backreferences are not allowed`);
    }
}
function validateExtractionRules(rules) {
    for (const rule of rules) {
        assertSafeRegex(rule.toolPattern, rule.id, 'toolPattern');
        assertSafeRegex(rule.contentPattern, rule.id, 'contentPattern');
        if (rule.summarizer !== 'firstLast500' && rule.summarizer !== 'matchCountSummary' && rule.summarizer !== 'stdoutSummary') {
            throw new Error(`[extraction-adapter] Unknown summarizer for rule ${rule.id}: ${rule.summarizer}`);
        }
    }
}
function stringifyToolResult(result) {
    if (typeof result === 'string')
        return result;
    if (result === null || result === undefined)
        return '';
    const maybeEnvelope = result;
    const envelopeText = maybeEnvelope?.content?.[0]?.text;
    if (typeof envelopeText === 'string' && envelopeText.length > 0) {
        return envelopeText;
    }
    try {
        return JSON.stringify(result, null, 2);
    }
    catch {
        // Intentional no-op — error deliberately discarded for fail-safe fallback
        return String(result);
    }
}
function summarizeFirstLast500(content) {
    if (content.length <= 1000)
        return content;
    const head = content.slice(0, 500);
    const tail = content.slice(-500);
    return `${head}\n...\n${tail}`;
}
function summarizeMatchCount(content) {
    const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
    const sample = lines.slice(0, 5).join('\n');
    return `match_count=${lines.length}\n${sample}`;
}
function summarizeStdout(content) {
    const trimmed = content.trim();
    if (trimmed.length <= 600)
        return trimmed;
    return `${trimmed.slice(0, 600)}...`;
}
/** Applies the configured summarizer to produce a summary from the given text content. */
function applySummarizer(summarizer, content) {
    if (summarizer === 'firstLast500')
        return summarizeFirstLast500(content);
    if (summarizer === 'matchCountSummary')
        return summarizeMatchCount(content);
    return summarizeStdout(content);
}
/** Tests input text against extraction rules and returns the first matching rule, or null. */
function matchRule(toolName, rawText) {
    for (const rule of RULES) {
        if (!rule.toolPattern.test(toolName)) {
            continue;
        }
        if (!rule.contentPattern.test(rawText)) {
            continue;
        }
        return { rule, sourceText: rawText };
    }
    return null;
}
function resolveSessionId(result) {
    try {
        const maybeEnvelope = result;
        const payloadText = maybeEnvelope?.content?.[0]?.text;
        if (typeof payloadText === 'string' && payloadText.trim().length > 0) {
            const parsed = JSON.parse(payloadText);
            const fromLifecycle = parsed?.meta?.sessionLifecycle?.effectiveSessionId;
            if (typeof fromLifecycle === 'string' && fromLifecycle.trim().length > 0) {
                return fromLifecycle;
            }
            const fromMeta = parsed?.meta?.sessionId;
            if (typeof fromMeta === 'string' && fromMeta.trim().length > 0) {
                return fromMeta;
            }
            const fromData = parsed?.data?.sessionId;
            if (typeof fromData === 'string' && fromData.trim().length > 0) {
                return fromData;
            }
        }
    }
    catch {
        // Intentional no-op — error deliberately discarded for fail-safe fallback
    }
    return 'auto-extraction';
}
// E2 FIX: Returns null on resolution failure instead of falling back to most-recent memory ID
function resolveMemoryIdFromText(sourceText) {
    if (!db)
        return null;
    const idMatch = sourceText.match(/"id"\s*:\s*(\d+)/);
    if (idMatch) {
        const memoryId = Number.parseInt(idMatch[1], 10);
        const exists = db.prepare('SELECT id FROM memory_index WHERE id = ? LIMIT 1')
            .get(memoryId);
        if (exists?.id) {
            return exists.id;
        }
    }
    const pathMatch = sourceText.match(/[A-Za-z0-9_./-]*spec\.md/);
    if (pathMatch && pathMatch[0].length > 0) {
        const resolvedPath = path.resolve(pathMatch[0]);
        try {
            const canonicalRow = db.prepare('SELECT id FROM memory_index WHERE canonical_file_path = ? LIMIT 1')
                .get(resolvedPath);
            if (canonicalRow?.id) {
                return canonicalRow.id;
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (!message.includes('canonical_file_path')) {
                return null;
            }
        }
        const filePathRow = db.prepare('SELECT id FROM memory_index WHERE file_path = ? LIMIT 1')
            .get(resolvedPath);
        if (filePathRow?.id) {
            return filePathRow.id;
        }
    }
    return null;
}
function redactionRatio(original, redacted) {
    if (original.length === 0)
        return 0;
    const delta = Math.max(0, original.length - redacted.length);
    return delta / original.length;
}
async function handleAfterTool(toolName, callId, result) {
    if (!isEnabled(callId) || !db) {
        return;
    }
    const rawText = stringifyToolResult(result);
    const matched = matchRule(toolName, rawText);
    if (!matched) {
        return;
    }
    metrics.matched += 1;
    const summary = applySummarizer(matched.rule.summarizer, matched.sourceText);
    const redactionResult = applyRedactionGate(summary);
    if (redactionResult.redactionApplied) {
        metrics.redacted += 1;
    }
    if (redactionRatio(summary, redactionResult.redactedText) > REDACTION_SKIP_THRESHOLD) {
        metrics.skipped += 1;
        console.error(`[extraction-adapter] Skipped insert for ${matched.rule.id}: redaction ratio above threshold`);
        return;
    }
    const memoryId = resolveMemoryIdFromText(matched.sourceText);
    if (!memoryId) {
        metrics.skipped += 1;
        console.error(`[extraction-adapter] Skipped insert for ${matched.rule.id}: no memory_id resolved`);
        return;
    }
    const sessionId = resolveSessionId(result);
    const inserted = workingMemory.upsertExtractedEntry({
        sessionId,
        memoryId,
        attentionScore: normalizeAttention(matched.rule.attention),
        sourceTool: toolName,
        sourceCallId: callId,
        extractionRuleId: matched.rule.id,
        redactionApplied: redactionResult.redactionApplied,
    });
    if (inserted) {
        metrics.inserted += 1;
        console.error(`[extraction-adapter] Inserted working_memory item for memory ${memoryId} (${matched.rule.id})`);
    }
    else {
        metrics.skipped += 1;
    }
}
/** Initializes the extraction adapter with a database connection and optional tool callback. */
function initExtractionAdapter(database, registerCallback) {
    db = database;
    validateExtractionRules(RULES);
    registerCallback(handleAfterTool);
}
/** Returns current extraction metrics including match counts and processing stats. */
function getExtractionMetrics() {
    return { ...metrics };
}
/** Resets all extraction metrics counters to zero. */
function resetExtractionMetrics() {
    metrics.matched = 0;
    metrics.inserted = 0;
    metrics.skipped = 0;
    metrics.redacted = 0;
}
export { RULES, initExtractionAdapter, applySummarizer, matchRule, getExtractionMetrics, resetExtractionMetrics, };
//# sourceMappingURL=extraction-adapter.js.map