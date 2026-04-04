// ───────────────────────────────────────────────────────────────
// MODULE: Envelope
// ───────────────────────────────────────────────────────────────
import { estimateTokens } from '../../formatters/token-metrics.js';
function serializeEnvelope(envelope) {
    return JSON.stringify(envelope, null, 2);
}
function ensureEnvelopeMeta(envelope) {
    const meta = envelope.meta;
    if (typeof meta === 'object' && meta !== null && !Array.isArray(meta)) {
        return meta;
    }
    const nextMeta = {};
    envelope.meta = nextMeta;
    return nextMeta;
}
export function syncEnvelopeTokenCount(envelope) {
    const meta = ensureEnvelopeMeta(envelope);
    const currentTokenCount = meta.tokenCount;
    let previousCount = typeof currentTokenCount === 'number' && Number.isFinite(currentTokenCount)
        ? currentTokenCount
        : -1;
    // Converges in 2-3 iterations; the 5-iteration cap is a safety bound.
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const nextTokenCount = estimateTokens(JSON.stringify(envelope, null, 2));
        meta.tokenCount = nextTokenCount;
        if (nextTokenCount === previousCount) {
            return nextTokenCount;
        }
        previousCount = nextTokenCount;
    }
    return typeof meta.tokenCount === 'number' ? meta.tokenCount : 0;
}
export function serializeEnvelopeWithTokenCount(envelope) {
    syncEnvelopeTokenCount(envelope);
    return JSON.stringify(envelope, null, 2);
}
// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────
/**
 * Defines the DEFAULT_HINTS constant.
 */
export const DEFAULT_HINTS = {
    empty_results: [
        'Try broadening your search query',
        'Use memory_list() to browse available memories',
        'Check if specFolder filter is too restrictive'
    ],
    success: [],
    rate_limited: [
        'Wait before retrying',
        'Consider batching operations'
    ]
};
// ───────────────────────────────────────────────────────────────
// 3. RESPONSE ENVELOPE FACTORY
// ───────────────────────────────────────────────────────────────
/**
 * Provides the createResponse helper.
 */
export function createResponse(options) {
    const { tool, summary, data, hints = [], startTime = null, cacheHit = false, extraMeta = {} } = options;
    // Calculate latency if start time provided
    const latencyMs = startTime ? Date.now() - startTime : null;
    // Build meta object
    const meta = {
        tool,
        tokenCount: 0,
        ...(latencyMs !== null && { latencyMs }),
        cacheHit,
        ...extraMeta
    };
    const envelope = {
        summary,
        data,
        hints,
        meta
    };
    syncEnvelopeTokenCount(envelope);
    return envelope;
}
/**
 * Provides the createSuccessResponse helper.
 */
export function createSuccessResponse(options) {
    return createResponse({
        ...options,
        hints: options.hints || DEFAULT_HINTS.success
    });
}
/**
 * Provides the createEmptyResponse helper.
 */
export function createEmptyResponse(options) {
    const { tool, summary = 'No results found', data = {}, hints = DEFAULT_HINTS.empty_results, startTime = null } = options;
    return createResponse({
        tool,
        summary,
        data: {
            count: 0,
            results: [],
            ...data
        },
        hints,
        startTime
    });
}
/**
 * Provides the createErrorResponse helper.
 */
export function createErrorResponse(options) {
    const { tool, error, code = 'E001', details = {}, recovery = null, startTime = null } = options;
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Build hints from recovery object
    const hints = [];
    if (recovery) {
        if (recovery.hint)
            hints.push(recovery.hint);
        if (recovery.actions)
            hints.push(...recovery.actions);
        if (recovery.toolTip)
            hints.push(recovery.toolTip);
    }
    return createResponse({
        tool,
        summary: `Error: ${errorMessage}`,
        data: {
            error: errorMessage,
            code,
            details
        },
        hints,
        startTime,
        extraMeta: {
            isError: true,
            severity: recovery?.severity || 'error'
        }
    });
}
// ───────────────────────────────────────────────────────────────
// 4. MCP RESPONSE WRAPPER
// ───────────────────────────────────────────────────────────────
/**
 * Provides the wrapForMCP helper.
 */
export function wrapForMCP(envelope, isError = false) {
    // Check if envelope meta indicates an error
    const isErrorResponse = isError || envelope.meta?.isError || false;
    return {
        content: [{
                type: 'text',
                text: serializeEnvelope(envelope)
            }],
        isError: isErrorResponse
    };
}
/**
 * Provides the createMCPResponse helper.
 */
export function createMCPResponse(options) {
    const envelope = createResponse(options);
    return wrapForMCP(envelope);
}
/**
 * Provides the createMCPSuccessResponse helper.
 */
export function createMCPSuccessResponse(options) {
    const envelope = createSuccessResponse(options);
    return wrapForMCP(envelope);
}
/**
 * Provides the createMCPEmptyResponse helper.
 */
export function createMCPEmptyResponse(options) {
    const envelope = createEmptyResponse(options);
    return wrapForMCP(envelope);
}
/**
 * Provides the createMCPErrorResponse helper.
 */
export function createMCPErrorResponse(options) {
    const envelope = createErrorResponse(options);
    return wrapForMCP(envelope, true);
}
//# sourceMappingURL=envelope.js.map