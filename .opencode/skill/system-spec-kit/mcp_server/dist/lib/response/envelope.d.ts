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
type EnvelopeRecord = Record<string, unknown> & {
    meta?: Record<string, unknown>;
};
export declare function syncEnvelopeTokenCount<T>(envelope: MCPEnvelope<T> | EnvelopeRecord): number;
export declare function serializeEnvelopeWithTokenCount<T>(envelope: MCPEnvelope<T> | EnvelopeRecord): string;
/**
 * Defines the DEFAULT_HINTS constant.
 */
export declare const DEFAULT_HINTS: DefaultHints;
/**
 * Provides the createResponse helper.
 */
export declare function createResponse<T = unknown>(options: CreateResponseOptions<T>): MCPEnvelope<T>;
/**
 * Provides the createSuccessResponse helper.
 */
export declare function createSuccessResponse<T = unknown>(options: CreateResponseOptions<T>): MCPEnvelope<T>;
/**
 * Provides the createEmptyResponse helper.
 */
export declare function createEmptyResponse(options: CreateEmptyResponseOptions): MCPEnvelope<{
    count: number;
    results: never[];
    [key: string]: unknown;
}>;
/**
 * Provides the createErrorResponse helper.
 */
export declare function createErrorResponse(options: CreateErrorResponseOptions): MCPEnvelope<{
    error: string;
    code: string;
    details: Record<string, unknown>;
}>;
/**
 * Provides the wrapForMCP helper.
 */
export declare function wrapForMCP<T>(envelope: MCPEnvelope<T>, isError?: boolean): MCPResponse;
/**
 * Provides the createMCPResponse helper.
 */
export declare function createMCPResponse<T = unknown>(options: CreateResponseOptions<T>): MCPResponse;
/**
 * Provides the createMCPSuccessResponse helper.
 */
export declare function createMCPSuccessResponse<T = unknown>(options: CreateResponseOptions<T>): MCPResponse;
/**
 * Provides the createMCPEmptyResponse helper.
 */
export declare function createMCPEmptyResponse(options: CreateEmptyResponseOptions): MCPResponse;
/**
 * Provides the createMCPErrorResponse helper.
 */
export declare function createMCPErrorResponse(options: CreateErrorResponseOptions): MCPResponse;
//# sourceMappingURL=envelope.d.ts.map