// ───────────────────────────────────────────────────────────────
// MODULE: Core
// ───────────────────────────────────────────────────────────────
// Memory error class and utility functions
// Migrated from lib/errors.js for proper folder organization
import { ERROR_CODES, RECOVERY_HINTS, DEFAULT_HINT, getRecoveryHint, hasSpecificHint, getAvailableHints, } from './recovery-hints.js';
const DEFAULT_TOOL_ERROR_CODES = {
    memory_search: ERROR_CODES.SEARCH_FAILED,
    memory_quick_search: ERROR_CODES.SEARCH_FAILED,
    memory_context: ERROR_CODES.SEARCH_FAILED,
    memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
    memory_save: ERROR_CODES.MEMORY_SAVE_FAILED,
    memory_delete: ERROR_CODES.MEMORY_DELETE_FAILED,
    memory_update: ERROR_CODES.MEMORY_UPDATE_FAILED,
    checkpoint_create: ERROR_CODES.CHECKPOINT_CREATE_FAILED,
    checkpoint_restore: ERROR_CODES.CHECKPOINT_RESTORE_FAILED,
    memory_drift_why: ERROR_CODES.TRAVERSAL_ERROR,
    memory_causal_link: ERROR_CODES.CAUSAL_GRAPH_ERROR,
    memory_causal_stats: ERROR_CODES.CAUSAL_GRAPH_ERROR,
    memory_causal_unlink: ERROR_CODES.CAUSAL_GRAPH_ERROR,
};
// 2. ERROR CODES (Legacy)
//
// Re-export from recovery-hints for backward compatibility.
// New code should use ERROR_CODES from recovery-hints.ts.
/**
 * Defines the ErrorCodes constant.
 */
export const ErrorCodes = {
    EMBEDDING_FAILED: 'E001',
    EMBEDDING_DIMENSION_INVALID: 'E002',
    FILE_NOT_FOUND: 'E010',
    FILE_ACCESS_DENIED: 'E011',
    FILE_ENCODING_ERROR: 'E012',
    DB_CONNECTION_FAILED: 'E020',
    DB_QUERY_FAILED: 'E021',
    DB_TRANSACTION_FAILED: 'E022',
    DATABASE_ERROR: 'E025',
    INVALID_PARAMETER: 'E030',
    MISSING_REQUIRED_PARAM: 'E031',
    SEARCH_FAILED: 'E040',
    VECTOR_SEARCH_UNAVAILABLE: 'E041',
    QUERY_TOO_LONG: 'E042',
    QUERY_EMPTY: 'E043',
    API_KEY_INVALID_STARTUP: 'E050',
    API_KEY_INVALID_RUNTIME: 'E051',
    LOCAL_MODEL_UNAVAILABLE: 'E052',
    CAUSAL_EDGE_NOT_FOUND: 'E100',
    CAUSAL_CYCLE_DETECTED: 'E101',
    CAUSAL_INVALID_RELATION: 'E102',
    CAUSAL_SELF_REFERENCE: 'E103',
    CAUSAL_GRAPH_ERROR: 'E104',
    TRAVERSAL_ERROR: 'E105',
    RATE_LIMITED: 'E429',
};
// ───────────────────────────────────────────────────────────────
// 2. MEMORY ERROR CLASS
// ───────────────────────────────────────────────────────────────
/**
 * Represents the MemoryError type.
 */
export class MemoryError extends Error {
    code;
    details;
    recoveryHint;
    constructor(code, message, details = {}) {
        super(message);
        // Required for proper instanceof checks when targeting ES5 or with certain TS compilation targets
        Object.setPrototypeOf(this, MemoryError.prototype);
        this.code = code;
        this.details = details;
        this.name = 'MemoryError';
    }
    toJSON() {
        return { code: this.code, message: this.message, details: this.details };
    }
}
export function getDefaultErrorCodeForTool(toolName) {
    return DEFAULT_TOOL_ERROR_CODES[toolName] || ErrorCodes.SEARCH_FAILED;
}
// ───────────────────────────────────────────────────────────────
// 3. TIMEOUT WRAPPER
// ───────────────────────────────────────────────────────────────
// Fixed timer leak - now properly clears timeout on success or rejection
/**
 * Provides the withTimeout helper.
 */
export function withTimeout(promise, ms, operation) {
    let timeoutId = null;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new MemoryError(ErrorCodes.SEARCH_FAILED, `${operation} timed out after ${ms}ms`, { timeout: ms, operation })), ms);
    });
    return (async () => {
        try {
            return await Promise.race([promise, timeoutPromise]);
        }
        finally {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        }
    })();
}
/**
 * Provides the userFriendlyError helper.
 */
export function userFriendlyError(error) {
    const internalPatterns = [
        { pattern: /SQLITE_BUSY/, message: 'Database is temporarily busy. Please retry.' },
        { pattern: /SQLITE_LOCKED/, message: 'Database is locked. Please wait and retry.' },
        { pattern: /ENOENT/, message: 'File not found.' },
        { pattern: /EACCES/, message: 'Permission denied.' },
        { pattern: /ECONNREFUSED/, message: 'Connection refused. Service may be unavailable.' },
        { pattern: /ETIMEDOUT/, message: 'Operation timed out. Please retry.' },
        { pattern: /embedding.*failed/i, message: 'Failed to generate embedding. Search may be unavailable.' },
    ];
    for (const { pattern, message } of internalPatterns) {
        if (pattern.test(error.message))
            return message;
    }
    // Return generic message to avoid leaking internal details.
    // Raw error is logged for debugging but not returned to the caller.
    console.error('[errors] Unmatched error (debug):', error.message);
    return 'An unexpected error occurred. Please check logs for details.';
}
let retryModule = null;
let retryModulePromise = null;
let retryModuleLoadError = null;
async function loadRetryModule() {
    if (retryModule !== null) {
        return retryModule;
    }
    if (retryModulePromise !== null) {
        return retryModulePromise;
    }
    const retryModulePath = '../utils/retry.js';
    const loadPromise = (async () => {
        try {
            retryModule = await import(retryModulePath);
            retryModuleLoadError = null;
            return retryModule;
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            retryModuleLoadError = msg;
            console.warn('[errors/core] Retry module lazy import failed:', msg);
            return null;
        }
    })();
    retryModulePromise = loadPromise;
    try {
        return await loadPromise;
    }
    finally {
        if (retryModulePromise === loadPromise) {
            retryModulePromise = null;
        }
    }
}
/**
 * Check if an error is transient (worth retrying).
 * REQ-032: Uses retry module for comprehensive classification
 * when available, falls back to legacy patterns.
 */
export function isTransientError(error) {
    if (retryModule === null && retryModulePromise === null) {
        void loadRetryModule();
    }
    if (retryModule === null && retryModuleLoadError) {
        console.warn(`[errors] Retry module unavailable; using legacy transient patterns: ${retryModuleLoadError}`);
        retryModuleLoadError = null;
    }
    // Use retry module if available (REQ-032)
    if (retryModule && retryModule.isTransientError) {
        return retryModule.isTransientError(error);
    }
    // Legacy fallback patterns
    const transientPatterns = [
        /SQLITE_BUSY/,
        /SQLITE_LOCKED/,
        /ECONNRESET/,
        /ETIMEDOUT/,
        /ECONNREFUSED/,
        /temporarily unavailable/i,
        /rate limit/i,
    ];
    return transientPatterns.some(pattern => pattern.test(error.message));
}
/**
 * Check if an error is permanent (should NOT retry).
 * REQ-032: Fail-fast for 401, 403, and other permanent errors.
 */
export function isPermanentError(error) {
    if (retryModule === null && retryModulePromise === null) {
        void loadRetryModule();
    }
    if (retryModule === null && retryModuleLoadError) {
        console.warn(`[errors] Retry module unavailable; using legacy permanent patterns: ${retryModuleLoadError}`);
        retryModuleLoadError = null;
    }
    // Use retry module if available (REQ-032)
    if (retryModule && retryModule.isPermanentError) {
        return retryModule.isPermanentError(error);
    }
    // Legacy fallback patterns
    const permanentPatterns = [
        /unauthorized/i,
        /authentication failed/i,
        /invalid api key/i,
        /forbidden/i,
        /access denied/i,
    ];
    return permanentPatterns.some(pattern => pattern.test(error.message));
}
// ───────────────────────────────────────────────────────────────
// 6. ERROR RESPONSE BUILDER WITH HINTS
// ───────────────────────────────────────────────────────────────
//
// Build standardized error responses with recovery hints.
export function sanitizeErrorField(value) {
    return value
        .replace(/sk-[a-zA-Z0-9_\-]{20,}/g, '[REDACTED]')
        .replace(/voy_[a-zA-Z0-9]{20,}/g, '[REDACTED]')
        .replace(/[Bb]earer\s+[a-zA-Z0-9._\-]+/g, 'Bearer [REDACTED]')
        .replace(/key[=:]\s*['"]?[a-zA-Z0-9_\-]{20,}/gi, 'key=[REDACTED]');
}
function sanitizeDetails(details, seen) {
    if (!details)
        return details;
    if (typeof details === 'string')
        return sanitizeErrorField(details);
    if (typeof details !== 'object')
        return details;
    const visited = seen ?? new WeakSet();
    if (visited.has(details))
        return '[Circular]';
    visited.add(details);
    if (Array.isArray(details))
        return details.map(item => sanitizeDetails(item, visited));
    const sanitized = {};
    for (const [k, v] of Object.entries(details)) {
        sanitized[k] = sanitizeDetails(v, visited);
    }
    return sanitized;
}
/**
 * Build an error response object with recovery hints.
 * REQ-019: Uses standardized envelope (summary, data, hints, meta).
 */
export function buildErrorResponse(toolName, error, context = {}) {
    // Extract error code (from MemoryError or fallback)
    const errorCode = error.code || getDefaultErrorCodeForTool(toolName);
    const publicMessage = error instanceof MemoryError
        ? sanitizeErrorField(error.message)
        : userFriendlyError(error);
    // Get recovery hint (zero-cost static lookup)
    const recoveryHint = getRecoveryHint(toolName, errorCode);
    // Build hints array from recovery hint
    const hints = [];
    if (recoveryHint.hint)
        hints.push(recoveryHint.hint);
    if (recoveryHint.actions)
        hints.push(...recoveryHint.actions);
    if (recoveryHint.toolTip)
        hints.push(recoveryHint.toolTip);
    // Build standardized envelope format
    return {
        summary: `Error: ${publicMessage}`,
        data: {
            error: publicMessage,
            code: errorCode,
            details: sanitizeDetails(error.details || context || null)
        },
        hints,
        meta: {
            tool: toolName,
            isError: true,
            severity: recoveryHint.severity
        }
    };
}
/**
 * Create a MemoryError with recovery hint pre-attached.
 * Convenience function for throwing errors with hints.
 */
export function createErrorWithHint(code, message, details = {}, toolName = null) {
    const error = new MemoryError(code, message, details);
    // Attach recovery hint if tool context provided
    if (toolName) {
        error.recoveryHint = getRecoveryHint(toolName, code);
    }
    return error;
}
// ───────────────────────────────────────────────────────────────
// 7. RE-EXPORTS
// ───────────────────────────────────────────────────────────────
export { ERROR_CODES, RECOVERY_HINTS, DEFAULT_HINT, getRecoveryHint, hasSpecificHint, getAvailableHints, };
//# sourceMappingURL=core.js.map