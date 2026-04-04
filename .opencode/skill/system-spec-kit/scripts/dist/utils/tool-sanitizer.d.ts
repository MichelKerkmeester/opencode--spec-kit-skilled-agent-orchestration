/**
 * Canonical tool status values used across all CLI extractors.
 */
type ToolStatus = 'pending' | 'completed' | 'error' | 'snapshot' | 'unknown';
/**
 * Sanitizes a tool description to remove paths that could trigger
 * contamination detection or foreign-spec-dominance (V8).
 */
declare function sanitizeToolDescription(description: string): string;
/**
 * Converts absolute file paths in tool input objects to workspace-relative paths.
 * Handles both single-value keys (filePath, file_path, path) and
 * array-value keys (paths, filePaths, file_paths).
 */
declare function sanitizeToolInputPaths(projectRoot: string, input: Record<string, unknown>): Record<string, unknown>;
/**
 * Normalizes a raw tool status string to one of the canonical ToolStatus values.
 * Handles common aliases (e.g. 'success' -> 'completed', 'failed' -> 'error').
 */
declare function normalizeToolStatus(raw: unknown): ToolStatus;
/**
 * Detects API error content in assistant messages.
 * Matches patterns from the contamination filter's high-severity rules.
 */
declare function isApiErrorContent(text: string): boolean;
export { sanitizeToolDescription, sanitizeToolInputPaths, normalizeToolStatus, isApiErrorContent };
export type { ToolStatus };
//# sourceMappingURL=tool-sanitizer.d.ts.map