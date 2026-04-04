/**
 * Canonical identity for path deduplication.
 *
 * - Uses realpath when possible so symlink aliases collapse to one key.
 * - Falls back to resolved absolute path when file does not exist.
 */
export declare function getCanonicalPathKey(filePath: string): string;
/**
 * Resolve symlinks before spec-folder extraction so that paths through
 * symlinked directories (e.g. `.claude/specs → ../.opencode/specs`)
 * produce the same spec_folder string as the real path.
 *
 * Handles the atomic-save case where the file doesn't exist yet by
 * walking up to the nearest existing ancestor and resolving from there.
 */
export declare function canonicalizeForSpecFolderExtraction(filePath: string): string;
//# sourceMappingURL=canonical-path.d.ts.map