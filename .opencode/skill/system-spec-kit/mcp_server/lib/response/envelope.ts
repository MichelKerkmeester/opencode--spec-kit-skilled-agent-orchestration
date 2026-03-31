// ───────────────────────────────────────────────────────────────
// MODULE: Envelope
// ───────────────────────────────────────────────────────────────
import { estimateTokens } from '../../formatters/token-metrics.js';

// Feature catalog: Provenance-rich response envelopes


// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/**
 * Describes the ResponseMeta shape.
 */
export interface ResponseMeta {
  tool: string;
  tokenCount: number;
  tokenBudget?: number;
  latencyMs?: number;
  cacheHit: boolean;
  isError?: boolean;
  severity?: string;
  [key: string]: unknown;
}

/**
 * Describes the MCPEnvelope shape.
 */
export interface MCPEnvelope<T = unknown> {
  summary: string;
  data: T;
  hints: string[];
  meta: ResponseMeta;
}

/**
 * Describes the CreateResponseOptions shape.
 */
export interface CreateResponseOptions<T = unknown> {
  tool: string;
  summary: string;
  data: T;
  hints?: string[];
  startTime?: number | null;
  cacheHit?: boolean;
  extraMeta?: Record<string, unknown>;
}

/**
 * Describes the CreateEmptyResponseOptions shape.
 */
export interface CreateEmptyResponseOptions {
  tool: string;
  summary?: string;
  data?: Record<string, unknown>;
  hints?: string[];
  startTime?: number | null;
}

/**
 * Describes the RecoveryInfo shape.
 */
export interface RecoveryInfo {
  hint?: string;
  actions?: string[];
  toolTip?: string;
  severity?: string;
}

/**
 * Describes the CreateErrorResponseOptions shape.
 */
export interface CreateErrorResponseOptions {
  tool: string;
  error: Error | string;
  code?: string;
  details?: Record<string, unknown>;
  recovery?: RecoveryInfo | null;
  startTime?: number | null;
}

// Re-export canonical MCPResponse from shared (REC-010)
/**
 * Re-exports related public types.
 */
export type { MCPResponse } from '@spec-kit/shared/types';
import type { MCPResponse } from '@spec-kit/shared/types';

/**
 * Describes the DefaultHints shape.
 */
export interface DefaultHints {
  empty_results: string[];
  success: string[];
  rate_limited: string[];
}

function serializeEnvelope<T>(envelope: MCPEnvelope<T>): string {
  return JSON.stringify(envelope, null, 2);
}

type EnvelopeRecord = Record<string, unknown> & { meta?: Record<string, unknown> };

function ensureEnvelopeMeta(envelope: EnvelopeRecord): Record<string, unknown> {
  const meta = envelope.meta;
  if (typeof meta === 'object' && meta !== null && !Array.isArray(meta)) {
    return meta;
  }

  const nextMeta: Record<string, unknown> = {};
  envelope.meta = nextMeta;
  return nextMeta;
}

export function syncEnvelopeTokenCount<T>(envelope: MCPEnvelope<T> | EnvelopeRecord): number {
  const meta = ensureEnvelopeMeta(envelope as EnvelopeRecord);
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

export function serializeEnvelopeWithTokenCount<T>(envelope: MCPEnvelope<T> | EnvelopeRecord): string {
  syncEnvelopeTokenCount(envelope);
  return JSON.stringify(envelope, null, 2);
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS

// ───────────────────────────────────────────────────────────────
/**
 * Defines the DEFAULT_HINTS constant.
 */
export const DEFAULT_HINTS: DefaultHints = {
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
export function createResponse<T = unknown>(options: CreateResponseOptions<T>): MCPEnvelope<T> {
  const {
    tool,
    summary,
    data,
    hints = [],
    startTime = null,
    cacheHit = false,
    extraMeta = {}
  } = options;

  // Calculate latency if start time provided
  const latencyMs = startTime ? Date.now() - startTime : null;

  // Build meta object
  const meta: ResponseMeta = {
    tool,
    tokenCount: 0,
    ...(latencyMs !== null && { latencyMs }),
    cacheHit,
    ...extraMeta
  };

  const envelope: MCPEnvelope<T> = {
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
export function createSuccessResponse<T = unknown>(options: CreateResponseOptions<T>): MCPEnvelope<T> {
  return createResponse({
    ...options,
    hints: options.hints || DEFAULT_HINTS.success
  });
}

/**
 * Provides the createEmptyResponse helper.
 */
export function createEmptyResponse(options: CreateEmptyResponseOptions): MCPEnvelope<{ count: number; results: never[]; [key: string]: unknown }> {
  const {
    tool,
    summary = 'No results found',
    data = {},
    hints = DEFAULT_HINTS.empty_results,
    startTime = null
  } = options;

  return createResponse({
    tool,
    summary,
    data: {
      count: 0,
      results: [] as never[],
      ...data
    },
    hints,
    startTime
  });
}

/**
 * Provides the createErrorResponse helper.
 */
export function createErrorResponse(options: CreateErrorResponseOptions): MCPEnvelope<{ error: string; code: string; details: Record<string, unknown> }> {
  const {
    tool,
    error,
    code = 'E001',
    details = {},
    recovery = null,
    startTime = null
  } = options;

  const errorMessage = error instanceof Error ? error.message : String(error);

  // Build hints from recovery object
  const hints: string[] = [];
  if (recovery) {
    if (recovery.hint) hints.push(recovery.hint);
    if (recovery.actions) hints.push(...recovery.actions);
    if (recovery.toolTip) hints.push(recovery.toolTip);
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
export function wrapForMCP<T>(envelope: MCPEnvelope<T>, isError: boolean = false): MCPResponse {
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
export function createMCPResponse<T = unknown>(options: CreateResponseOptions<T>): MCPResponse {
  const envelope = createResponse(options);
  return wrapForMCP(envelope);
}

/**
 * Provides the createMCPSuccessResponse helper.
 */
export function createMCPSuccessResponse<T = unknown>(options: CreateResponseOptions<T>): MCPResponse {
  const envelope = createSuccessResponse(options);
  return wrapForMCP(envelope);
}

/**
 * Provides the createMCPEmptyResponse helper.
 */
export function createMCPEmptyResponse(options: CreateEmptyResponseOptions): MCPResponse {
  const envelope = createEmptyResponse(options);
  return wrapForMCP(envelope);
}

/**
 * Provides the createMCPErrorResponse helper.
 */
export function createMCPErrorResponse(options: CreateErrorResponseOptions): MCPResponse {
  const envelope = createErrorResponse(options);
  return wrapForMCP(envelope, true);
}
