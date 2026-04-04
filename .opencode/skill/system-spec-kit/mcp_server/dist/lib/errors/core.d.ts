import { ERROR_CODES, RECOVERY_HINTS, DEFAULT_HINT, getRecoveryHint, hasSpecificHint, getAvailableHints } from './recovery-hints.js';
import type { RecoveryHint, Severity } from './recovery-hints.js';
/**
 * Describes the ErrorResponseData shape.
 */
export interface ErrorResponseData {
    error: string;
    code: string;
    details: Record<string, unknown> | null;
}
/**
 * Describes the ErrorResponseMeta shape.
 */
export interface ErrorResponseMeta {
    tool: string;
    isError: true;
    severity: Severity;
}
/**
 * Describes the ErrorResponse shape.
 */
export interface ErrorResponse {
    summary: string;
    data: ErrorResponseData;
    hints: string[];
    meta: ErrorResponseMeta;
}
/**
 * Defines the ErrorCodes constant.
 */
export declare const ErrorCodes: {
    readonly EMBEDDING_FAILED: "E001";
    readonly EMBEDDING_DIMENSION_INVALID: "E002";
    readonly FILE_NOT_FOUND: "E010";
    readonly FILE_ACCESS_DENIED: "E011";
    readonly FILE_ENCODING_ERROR: "E012";
    readonly DB_CONNECTION_FAILED: "E020";
    readonly DB_QUERY_FAILED: "E021";
    readonly DB_TRANSACTION_FAILED: "E022";
    readonly DATABASE_ERROR: "E025";
    readonly INVALID_PARAMETER: "E030";
    readonly MISSING_REQUIRED_PARAM: "E031";
    readonly SEARCH_FAILED: "E040";
    readonly VECTOR_SEARCH_UNAVAILABLE: "E041";
    readonly QUERY_TOO_LONG: "E042";
    readonly QUERY_EMPTY: "E043";
    readonly API_KEY_INVALID_STARTUP: "E050";
    readonly API_KEY_INVALID_RUNTIME: "E051";
    readonly LOCAL_MODEL_UNAVAILABLE: "E052";
    readonly CAUSAL_EDGE_NOT_FOUND: "E100";
    readonly CAUSAL_CYCLE_DETECTED: "E101";
    readonly CAUSAL_INVALID_RELATION: "E102";
    readonly CAUSAL_SELF_REFERENCE: "E103";
    readonly CAUSAL_GRAPH_ERROR: "E104";
    readonly TRAVERSAL_ERROR: "E105";
    readonly RATE_LIMITED: "E429";
};
/**
 * Defines the LegacyErrorCodeKey type.
 */
export type LegacyErrorCodeKey = keyof typeof ErrorCodes;
/**
 * Represents the MemoryError type.
 */
export declare class MemoryError extends Error {
    code: string;
    details: Record<string, unknown>;
    recoveryHint?: RecoveryHint;
    constructor(code: string, message: string, details?: Record<string, unknown>);
    toJSON(): {
        code: string;
        message: string;
        details: Record<string, unknown>;
    };
}
export declare function getDefaultErrorCodeForTool(toolName: string): string;
/**
 * Provides the withTimeout helper.
 */
export declare function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T>;
/**
 * Provides the userFriendlyError helper.
 */
export declare function userFriendlyError(error: Error): string;
/**
 * Check if an error is transient (worth retrying).
 * REQ-032: Uses retry module for comprehensive classification
 * when available, falls back to legacy patterns.
 */
export declare function isTransientError(error: Error): boolean;
/**
 * Check if an error is permanent (should NOT retry).
 * REQ-032: Fail-fast for 401, 403, and other permanent errors.
 */
export declare function isPermanentError(error: Error): boolean;
export declare function sanitizeErrorField(value: string): string;
/**
 * Build an error response object with recovery hints.
 * REQ-019: Uses standardized envelope (summary, data, hints, meta).
 */
export declare function buildErrorResponse(toolName: string, error: Error | MemoryError, context?: Record<string, unknown>): ErrorResponse;
/**
 * Create a MemoryError with recovery hint pre-attached.
 * Convenience function for throwing errors with hints.
 */
export declare function createErrorWithHint(code: string, message: string, details?: Record<string, unknown>, toolName?: string | null): MemoryError;
export { ERROR_CODES, RECOVERY_HINTS, DEFAULT_HINT, getRecoveryHint, hasSpecificHint, getAvailableHints, };
//# sourceMappingURL=core.d.ts.map