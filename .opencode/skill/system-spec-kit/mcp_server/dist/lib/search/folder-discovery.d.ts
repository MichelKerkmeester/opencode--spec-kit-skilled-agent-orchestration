/**
 * Describes a single spec folder with its cached description
 * and extracted keywords for lightweight matching.
 */
export interface FolderDescription {
    specFolder: string;
    description: string;
    keywords: string[];
    lastUpdated: string;
}
/**
 * Top-level cache structure written to descriptions.json.
 * version is always 1 for this implementation.
 */
export interface DescriptionCache {
    version: number;
    generated: string;
    folders: FolderDescription[];
}
/**
 * Per-folder description stored as `description.json` inside each spec folder.
 * Extends FolderDescription with identity and memory-tracking fields.
 */
export interface PerFolderDescription extends FolderDescription {
    specId: string;
    folderSlug: string;
    parentChain: string[];
    memorySequence: number;
    memoryNameHistory: string[];
}
/**
 * Extract a short 1-sentence description from spec.md content.
 *
 * Strategy (in order):
 * 1. Look for the first `#` heading — that is the spec title
 * 2. Look for "Problem Statement" or "Problem & Purpose" section
 *    and take the first non-empty line after the heading
 * 3. Fall back to the first non-empty non-heading line
 *
 * The result is trimmed to MAX_DESCRIPTION_LENGTH characters maximum.
 *
 * @param specContent - Raw string content of a spec.md file.
 * @returns A 1-sentence description string, or empty string for empty input.
 */
export declare function extractDescription(specContent: string): string;
/**
 * Extract significant keywords from a description string.
 *
 * - Lowercases all words
 * - Splits on non-alphanumeric boundaries
 * - Filters stop words and words shorter than 3 characters
 * - Deduplicates
 *
 * @param description - A description string to extract keywords from.
 * @returns Deduplicated array of significant lowercase keywords.
 */
export declare function extractKeywords(description: string): string[];
/**
 * Find the most relevant spec folders for a given query using
 * simple keyword-overlap scoring.
 *
 * Algorithm:
 * - Tokenize the query into lowercase words (reuse extractKeywords)
 * - For each folder in the cache, count how many query terms appear
 *   in its keywords or description (case-insensitive)
 * - Normalize score: matchCount / totalQueryTerms
 * - Return top `limit` folders with score > 0, sorted descending
 *
 * This is a lightweight pre-filter, NOT a replacement for vector search.
 *
 * @param query  - User search query string.
 * @param cache  - Loaded DescriptionCache to search against.
 * @param limit  - Maximum number of results to return (default 3).
 * @returns Array of { specFolder, relevanceScore } sorted by score desc.
 */
export declare function findRelevantFolders(query: string, cache: DescriptionCache, limit?: number): Array<{
    specFolder: string;
    relevanceScore: number;
}>;
/**
 * Scan spec base paths for spec.md files and generate a
 * DescriptionCache by extracting descriptions from each.
 *
 * - Uses synchronous file I/O — this is a build-time/cache generation
 *   function, NOT a hot path.
 * - Expects specsBasePaths to be absolute paths to directories that
 *   contain spec folder subdirectories (e.g., the `specs/` root).
 * - A spec folder is any direct child directory of a base path
 *   that contains a `spec.md` file.
 * - Nested spec folders (phase subfolders) are also discovered if
 *   they contain a `spec.md`.
 *
 * @param specsBasePaths - Array of absolute directory paths to scan.
 * @returns A fully populated DescriptionCache.
 */
export declare function generateFolderDescriptions(specsBasePaths: string[]): DescriptionCache;
/**
 * F-39: Batch repair stale description.json files.
 * Separated from generateFolderDescriptions to keep the main generation loop fast.
 * Call this as a maintenance operation, not on every cache rebuild.
 *
 * @param specsBasePaths - Array of absolute directory paths to scan.
 */
export declare function repairStaleDescriptions(specsBasePaths: string[]): void;
/**
 * Slugify a spec folder name: strip numeric prefix, replace non-alphanumeric
 * characters with hyphens, lowercase, collapse runs, trim edges.
 */
export declare function slugifyFolderName(folderName: string): string;
/**
 * Generate a PerFolderDescription by reading the spec.md in a folder.
 * Preserves memorySequence and memoryNameHistory from existing description.json.
 *
 * @param folderPath - Absolute path to the spec folder.
 * @param basePath   - Absolute path to the specs root directory.
 * @returns A PerFolderDescription, or null if spec.md is unreadable.
 */
export declare function generatePerFolderDescription(folderPath: string, basePath: string): PerFolderDescription | null;
/**
 * Load a PerFolderDescription from `description.json` in the given folder.
 * Returns null if missing, corrupt, or structurally invalid (graceful degradation).
 *
 * @param folderPath - Absolute path to the spec folder.
 * @returns The parsed PerFolderDescription, or null.
 */
export declare function loadPerFolderDescription(folderPath: string): PerFolderDescription | null;
/**
 * Save a PerFolderDescription to `description.json` using atomic write.
 * Creates parent directories if needed.
 *
 * Note: memorySequence/memoryNameHistory tracking is best-effort.
 * Concurrent processes may cause lost updates (acceptable trade-off
 * for non-critical tracking data — no file lock is used).
 *
 * @param desc       - The PerFolderDescription to persist.
 * @param folderPath - Absolute path to the spec folder.
 */
export declare function savePerFolderDescription(desc: PerFolderDescription, folderPath: string): void;
/**
 * Check whether a per-folder description.json is stale.
 * Compares description.json mtime vs spec.md mtime.
 * Missing description.json = stale.
 *
 * @param folderPath - Absolute path to the spec folder.
 * @returns true if description.json is missing or older than spec.md.
 */
export declare function isPerFolderDescriptionStale(folderPath: string): boolean;
/**
 * Load a DescriptionCache from a JSON file on disk.
 *
 * @param cachePath - Absolute path to the descriptions.json file.
 * @returns The parsed DescriptionCache, or null if the file does not
 *          exist or cannot be parsed.
 */
export declare function loadDescriptionCache(cachePath: string): DescriptionCache | null;
/**
 * Write a DescriptionCache to a JSON file on disk.
 * Creates parent directories if they do not exist.
 *
 * @param cache     - The DescriptionCache to persist.
 * @param cachePath - Absolute path to write the descriptions.json file.
 */
export declare function saveDescriptionCache(cache: DescriptionCache, cachePath: string): void;
/**
 * Resolve the standard specs base paths for a workspace.
 * Returns all existing directories from: `specs/` and `.opencode/specs/`
 * relative to the given workspace (or cwd if omitted).
 *
 * @param workspacePath - Optional workspace root. Defaults to process.cwd().
 * @returns Array of absolute directory paths that exist.
 */
export declare function getSpecsBasePaths(workspacePath?: string): string[];
/**
 * Check whether a description cache is stale by comparing its
 * `generated` timestamp against the most recent spec.md mtime
 * across all base paths using recursive depth-limited scan.
 *
 * @param cache     - The loaded DescriptionCache to check.
 * @param basePaths - Spec base directories to scan for spec.md files.
 * @returns true if any spec.md was modified after cache generation, or if cache is invalid.
 */
export declare function isCacheStale(cache: DescriptionCache | null, basePaths: string[]): boolean;
/**
 * Ensure a fresh description cache exists. Loads existing cache from
 * disk, checks staleness, regenerates if needed, saves, and returns it.
 *
 * @param basePaths - Spec base directories to scan.
 * @returns The up-to-date DescriptionCache, or null if no base paths exist.
 */
export declare function ensureDescriptionCache(basePaths: string[]): DescriptionCache | null;
/**
 * Discover the most relevant spec folder for a query.
 * Orchestrates: ensureCache → findRelevantFolders → threshold check.
 *
 * @param query     - User search query.
 * @param basePaths - Spec base directories.
 * @param threshold - Minimum relevance score to accept (default 0.3).
 * @returns The best-matching specFolder path, or null if none meets threshold.
 */
export declare function discoverSpecFolder(query: string, basePaths: string[], threshold?: number): string | null;
//# sourceMappingURL=folder-discovery.d.ts.map