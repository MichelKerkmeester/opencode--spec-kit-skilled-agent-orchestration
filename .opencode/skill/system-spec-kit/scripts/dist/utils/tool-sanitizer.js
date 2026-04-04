"use strict";
// ---------------------------------------------------------------
// MODULE: Tool Sanitizer
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeToolDescription = sanitizeToolDescription;
exports.sanitizeToolInputPaths = sanitizeToolInputPaths;
exports.normalizeToolStatus = normalizeToolStatus;
exports.isApiErrorContent = isApiErrorContent;
// ───────────────────────────────────────────────────────────────
// 1. TOOL SANITIZER
// ───────────────────────────────────────────────────────────────
// Sanitizes tool descriptions, input paths, and status values
// shared across all CLI extractors
const workspace_identity_1 = require("./workspace-identity");
const MAX_DESCRIPTION_LENGTH = 80;
/**
 * Sanitizes a tool description to remove paths that could trigger
 * contamination detection or foreign-spec-dominance (V8).
 */
function sanitizeToolDescription(description) {
    if (!description || typeof description !== 'string') {
        return '';
    }
    let sanitized = description
        // Replace spec folder path patterns (specs/NNN-name/...)
        .replace(/specs\/\d{3,}-[a-z0-9-]+(?:\/\d{3,}-[a-z0-9-]+)*/gi, '[spec]')
        // Replace absolute paths (/Users/..., /home/..., C:\...)
        .replace(/(?:\/(?:Users|home|var|tmp|opt|etc|usr)\/|[A-Z]:\\)[^\s"'`,;)}\]]+/g, '[path]')
        // Replace .opencode/ internal paths
        .replace(/\.opencode\/[^\s"'`,;)}\]]+/g, '[internal-path]')
        // Replace .claude/ internal paths
        .replace(/\.claude\/[^\s"'`,;)}\]]+/g, '[internal-path]');
    // Truncate to max length
    if (sanitized.length > MAX_DESCRIPTION_LENGTH) {
        sanitized = sanitized.slice(0, MAX_DESCRIPTION_LENGTH - 3) + '...';
    }
    return sanitized.trim();
}
/**
 * Converts absolute file paths in tool input objects to workspace-relative paths.
 * Handles both single-value keys (filePath, file_path, path) and
 * array-value keys (paths, filePaths, file_paths).
 */
function sanitizeToolInputPaths(projectRoot, input) {
    const sanitized = { ...input };
    const pathKeys = ['filePath', 'file_path', 'path'];
    for (const key of pathKeys) {
        if (typeof sanitized[key] !== 'string') {
            continue;
        }
        const relativePath = (0, workspace_identity_1.toWorkspaceRelativePath)(projectRoot, sanitized[key]);
        if (relativePath) {
            sanitized[key] = relativePath;
        }
        else {
            delete sanitized[key];
        }
    }
    const listKeys = ['paths', 'filePaths', 'file_paths'];
    for (const key of listKeys) {
        if (!Array.isArray(sanitized[key])) {
            continue;
        }
        const relativePaths = sanitized[key]
            .filter((value) => typeof value === 'string')
            .map((value) => (0, workspace_identity_1.toWorkspaceRelativePath)(projectRoot, value))
            .filter(Boolean);
        if (relativePaths.length > 0) {
            sanitized[key] = relativePaths;
        }
        else {
            delete sanitized[key];
        }
    }
    return sanitized;
}
const TOOL_STATUS_ALLOWLIST = new Set([
    'pending', 'completed', 'error', 'snapshot', 'unknown',
]);
/**
 * Normalizes a raw tool status string to one of the canonical ToolStatus values.
 * Handles common aliases (e.g. 'success' -> 'completed', 'failed' -> 'error').
 */
function normalizeToolStatus(raw) {
    if (typeof raw !== 'string' || !raw) {
        return 'unknown';
    }
    const lower = raw.toLowerCase().trim();
    if (TOOL_STATUS_ALLOWLIST.has(lower)) {
        return lower;
    }
    // Common aliases
    if (lower === 'success' || lower === 'done' || lower === 'ok') {
        return 'completed';
    }
    if (lower === 'failed' || lower === 'failure' || lower === 'errored') {
        return 'error';
    }
    if (lower === 'running' || lower === 'in_progress' || lower === 'started') {
        return 'pending';
    }
    return 'unknown';
}
/**
 * Detects API error content in assistant messages.
 * Matches patterns from the contamination filter's high-severity rules.
 */
function isApiErrorContent(text) {
    if (!text || typeof text !== 'string') {
        return false;
    }
    // Match "API Error: NNN" pattern
    if (/\bAPI\s+Error:\s*\d{3}\b/i.test(text)) {
        return true;
    }
    // Match JSON error payloads (error type fields)
    if (/\{"\s*(?:type|error)"\s*:\s*"\s*(?:error|api_error|overloaded_error|rate_limit_error|server_error|invalid_request_error)\b/i.test(text)) {
        return true;
    }
    return false;
}
//# sourceMappingURL=tool-sanitizer.js.map