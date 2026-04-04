// ───────────────────────────────────────────────────────────────
// MODULE: Validators
// ───────────────────────────────────────────────────────────────
import path from 'path';
import os from 'os';
// ───────────────────────────────────────────────────────────────
// 2. CONFIGURATION CONSTANTS
// ───────────────────────────────────────────────────────────────
export const INPUT_LIMITS = {
    query: 10000,
    title: 500,
    specFolder: 200,
    contextType: 100,
    name: 200,
    prompt: 10000,
    filePath: 500
};
/** Maximum query length for search operations (BUG-007) */
export const MAX_QUERY_LENGTH = 10000;
// ───────────────────────────────────────────────────────────────
// 3. QUERY VALIDATION
// ───────────────────────────────────────────────────────────────
/**
 * Validate and normalize a search query
 * BUG-007: Properly rejects empty, null, and invalid queries.
 */
export function validateQuery(query) {
    if (query === null || query === undefined) {
        throw new Error('Query cannot be null or undefined');
    }
    if (typeof query !== 'string') {
        throw new Error('Query must be a string');
    }
    const normalized = query.trim();
    if (normalized.length === 0) {
        throw new Error('Query cannot be empty or whitespace-only');
    }
    if (normalized.length > MAX_QUERY_LENGTH) {
        throw new Error(`Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters`);
    }
    return normalized;
}
// ───────────────────────────────────────────────────────────────
// 4. INPUT LENGTH VALIDATION
// ───────────────────────────────────────────────────────────────
/**
 * Validate input string lengths
 * SEC-003: Input length enforcement for CWE-400 mitigation
 */
export function validateInputLengths(args) {
    if (!args || typeof args !== 'object')
        return;
    const checks = [
        ['query', INPUT_LIMITS.query],
        ['title', INPUT_LIMITS.title],
        ['specFolder', INPUT_LIMITS.specFolder],
        ['contextType', INPUT_LIMITS.contextType],
        ['name', INPUT_LIMITS.name],
        ['prompt', INPUT_LIMITS.prompt],
        ['filePath', INPUT_LIMITS.filePath]
    ];
    for (const [field, maxLength] of checks) {
        const value = args[field];
        if (value && typeof value === 'string' && value.length > maxLength) {
            throw new Error(`Input '${field}' exceeds maximum length of ${maxLength} characters`);
        }
    }
}
// ───────────────────────────────────────────────────────────────
// 5. FILE PATH VALIDATION
// ───────────────────────────────────────────────────────────────
/**
 * Create a file path validator with specified allowed base paths
 */
export function createFilePathValidator(allowedBasePaths, sharedValidateFilePath) {
    /**
     * Validate file path against allowed directories
     */
    return function validateFilePathLocal(filePath) {
        const result = sharedValidateFilePath(filePath, allowedBasePaths);
        if (result === null) {
            throw new Error('Access denied: Path outside allowed directories');
        }
        // Additional check for .. patterns (not just null bytes which shared handles)
        if (filePath.includes('..')) {
            throw new Error('Access denied: Invalid path pattern');
        }
        return result;
    };
}
/**
 * Get default allowed base paths for file operations
 */
export function getDefaultAllowedPaths(defaultBasePath) {
    const basePath = defaultBasePath || process.cwd();
    return [
        path.join(os.homedir(), '.claude'),
        basePath,
        process.cwd()
    ]
        .filter(Boolean)
        .map(base => path.resolve(base));
}
/* ───────────────────────────────────────────────────────────────
   6. (ESM exports above — no CommonJS module.exports needed)
   ──────────────────────────────────────────────────────────────── */
//# sourceMappingURL=validators.js.map