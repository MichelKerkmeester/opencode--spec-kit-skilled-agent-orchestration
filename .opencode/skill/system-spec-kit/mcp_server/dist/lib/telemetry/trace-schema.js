const RETRIEVAL_TRACE_STAGES = [
    'candidate',
    'filter',
    'fusion',
    'rerank',
    'fallback',
    'final-rank',
];
const TRACE_STAGE_SET = new Set(RETRIEVAL_TRACE_STAGES);
const TRACE_PAYLOAD_KEYS = [
    'traceId',
    'totalDurationMs',
    'finalResultCount',
    'stages',
];
const TRACE_STAGE_KEYS = [
    'stage',
    'timestamp',
    'inputCount',
    'outputCount',
    'durationMs',
];
function isObjectRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function hasOnlyKeys(record, allowedKeys) {
    const keys = Object.keys(record);
    return keys.every((key) => allowedKeys.includes(key));
}
function toNonNegativeFiniteNumber(value) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        return null;
    }
    return value;
}
function sanitizeTraceStagePayload(payload) {
    if (!isObjectRecord(payload)) {
        return null;
    }
    const stageValue = payload.stage;
    if (typeof stageValue !== 'string' || !TRACE_STAGE_SET.has(stageValue)) {
        return null;
    }
    const timestamp = toNonNegativeFiniteNumber(payload.timestamp);
    const inputCount = toNonNegativeFiniteNumber(payload.inputCount);
    const outputCount = toNonNegativeFiniteNumber(payload.outputCount);
    const durationMs = toNonNegativeFiniteNumber(payload.durationMs);
    if (timestamp === null ||
        inputCount === null ||
        outputCount === null ||
        durationMs === null) {
        return null;
    }
    return {
        stage: stageValue,
        timestamp,
        inputCount,
        outputCount,
        durationMs,
    };
}
function sanitizeRetrievalTracePayload(payload) {
    if (!isObjectRecord(payload)) {
        return null;
    }
    const traceIdValue = payload.traceId;
    if (typeof traceIdValue !== 'string' || traceIdValue.trim().length === 0) {
        return null;
    }
    const stagesValue = payload.stages;
    if (!Array.isArray(stagesValue)) {
        return null;
    }
    const stages = [];
    for (const stagePayload of stagesValue) {
        const sanitized = sanitizeTraceStagePayload(stagePayload);
        if (!sanitized) {
            return null;
        }
        stages.push(sanitized);
    }
    const derivedTotalDurationMs = stages.reduce((sum, stage) => sum + stage.durationMs, 0);
    const derivedFinalResultCount = stages.length > 0 ? stages[stages.length - 1].outputCount : 0;
    const totalDurationMs = toNonNegativeFiniteNumber(payload.totalDurationMs) ?? derivedTotalDurationMs;
    const finalResultCount = toNonNegativeFiniteNumber(payload.finalResultCount) ?? derivedFinalResultCount;
    const canonicalPayload = {
        traceId: traceIdValue,
        totalDurationMs,
        finalResultCount,
        stages,
    };
    return canonicalPayload;
}
function isTelemetryTracePayload(payload) {
    if (!isObjectRecord(payload) || !hasOnlyKeys(payload, TRACE_PAYLOAD_KEYS)) {
        return false;
    }
    const canonical = sanitizeRetrievalTracePayload(payload);
    if (!canonical) {
        return false;
    }
    if (payload.traceId !== canonical.traceId ||
        payload.totalDurationMs !== canonical.totalDurationMs ||
        payload.finalResultCount !== canonical.finalResultCount) {
        return false;
    }
    if (!Array.isArray(payload.stages) || payload.stages.length !== canonical.stages.length) {
        return false;
    }
    for (let index = 0; index < payload.stages.length; index += 1) {
        const rawStage = payload.stages[index];
        const canonicalStage = canonical.stages[index];
        if (!isObjectRecord(rawStage) || !hasOnlyKeys(rawStage, TRACE_STAGE_KEYS)) {
            return false;
        }
        if (rawStage.stage !== canonicalStage.stage ||
            rawStage.timestamp !== canonicalStage.timestamp ||
            rawStage.inputCount !== canonicalStage.inputCount ||
            rawStage.outputCount !== canonicalStage.outputCount ||
            rawStage.durationMs !== canonicalStage.durationMs) {
            return false;
        }
    }
    return true;
}
const isRetrievalTracePayload = isTelemetryTracePayload;
const validateRetrievalTracePayload = sanitizeRetrievalTracePayload;
export { RETRIEVAL_TRACE_STAGES, sanitizeRetrievalTracePayload, isRetrievalTracePayload, validateRetrievalTracePayload, };
//# sourceMappingURL=trace-schema.js.map