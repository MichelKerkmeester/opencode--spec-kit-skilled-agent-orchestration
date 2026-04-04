/**
 * Defines the Severity type.
 */
export type Severity = 'low' | 'medium' | 'high' | 'critical';
/**
 * Describes the RecoveryHint shape.
 */
export interface RecoveryHint {
    hint: string;
    actions: string[];
    severity: Severity;
    toolTip?: string;
}
/**
 * Defines the RecoveryHintMap type.
 */
export type RecoveryHintMap = Record<string, RecoveryHint>;
/**
 * Defines the ToolSpecificHintMap type.
 */
export type ToolSpecificHintMap = Record<string, Record<string, RecoveryHint>>;
/**
 * Defines the ERROR_CODES constant.
 */
export declare const ERROR_CODES: {
    readonly EMBEDDING_FAILED: "E001";
    readonly EMBEDDING_DIMENSION_INVALID: "E002";
    readonly EMBEDDING_TIMEOUT: "E003";
    readonly EMBEDDING_PROVIDER_UNAVAILABLE: "E004";
    readonly FILE_NOT_FOUND: "E010";
    readonly FILE_ACCESS_DENIED: "E011";
    readonly FILE_ENCODING_ERROR: "E012";
    readonly FILE_TOO_LARGE: "E013";
    readonly FILE_INVALID_PATH: "E014";
    readonly DB_CONNECTION_FAILED: "E020";
    readonly DB_QUERY_FAILED: "E021";
    readonly DB_TRANSACTION_FAILED: "E022";
    readonly DB_MIGRATION_FAILED: "E023";
    readonly DB_CORRUPTION: "E024";
    readonly DATABASE_ERROR: "E025";
    readonly INVALID_PARAMETER: "E030";
    readonly MISSING_REQUIRED_PARAM: "E031";
    readonly PARAMETER_OUT_OF_RANGE: "E032";
    readonly INVALID_SPEC_FOLDER: "E033";
    readonly SEARCH_FAILED: "E040";
    readonly VECTOR_SEARCH_UNAVAILABLE: "E041";
    readonly QUERY_TOO_LONG: "E042";
    readonly QUERY_EMPTY: "E043";
    readonly NO_RESULTS: "E044";
    readonly API_KEY_INVALID_STARTUP: "E050";
    readonly API_KEY_INVALID_RUNTIME: "E051";
    readonly LOCAL_MODEL_UNAVAILABLE: "E052";
    readonly API_RATE_LIMITED: "E053";
    readonly CHECKPOINT_NOT_FOUND: "E060";
    readonly CHECKPOINT_RESTORE_FAILED: "E061";
    readonly CHECKPOINT_CREATE_FAILED: "E062";
    readonly CHECKPOINT_DUPLICATE_NAME: "E063";
    readonly SESSION_EXPIRED: "E070";
    readonly SESSION_INVALID: "E071";
    readonly SESSION_RECOVERY_FAILED: "E072";
    readonly MEMORY_NOT_FOUND: "E080";
    readonly MEMORY_SAVE_FAILED: "E081";
    readonly MEMORY_DELETE_FAILED: "E082";
    readonly MEMORY_UPDATE_FAILED: "E083";
    readonly MEMORY_DUPLICATE: "E084";
    readonly VALIDATION_FAILED: "E090";
    readonly ANCHOR_FORMAT_INVALID: "E091";
    readonly TOKEN_BUDGET_EXCEEDED: "E092";
    readonly PREFLIGHT_FAILED: "E093";
    readonly CAUSAL_EDGE_NOT_FOUND: "E100";
    readonly CAUSAL_CYCLE_DETECTED: "E101";
    readonly CAUSAL_INVALID_RELATION: "E102";
    readonly CAUSAL_SELF_REFERENCE: "E103";
    readonly CAUSAL_GRAPH_ERROR: "E104";
    readonly TRAVERSAL_ERROR: "E105";
    readonly RATE_LIMITED: "E429";
    readonly SERVICE_UNAVAILABLE: "E503";
};
/**
 * Defines the ErrorCodeKey type.
 */
export type ErrorCodeKey = keyof typeof ERROR_CODES;
/**
 * Defines the ErrorCodeValue type.
 */
export type ErrorCodeValue = (typeof ERROR_CODES)[ErrorCodeKey];
/**
 * Defines the RECOVERY_HINTS constant.
 */
export declare const RECOVERY_HINTS: RecoveryHintMap;
/**
 * Defines the DEFAULT_HINT constant.
 */
export declare const DEFAULT_HINT: RecoveryHint;
/**
 * Defines the TOOL_SPECIFIC_HINTS constant.
 */
export declare const TOOL_SPECIFIC_HINTS: ToolSpecificHintMap;
/**
 * Get recovery hint for a specific error in tool context.
 * Checks tool-specific hints first, then generic hints.
 */
export declare function getRecoveryHint(toolName: string, errorCode: string): RecoveryHint;
/**
 * Check if a specific hint exists (not default).
 */
export declare function hasSpecificHint(toolName: string, errorCode: string): boolean;
/**
 * Get all available hints for a tool.
 * Useful for documentation generation.
 */
export declare function getAvailableHints(toolName: string): RecoveryHintMap;
/**
 * Get all error codes.
 */
export declare function getErrorCodes(): typeof ERROR_CODES;
//# sourceMappingURL=recovery-hints.d.ts.map