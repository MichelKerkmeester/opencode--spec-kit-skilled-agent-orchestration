/**
 * Normalizes a raw memory name candidate by stripping filename artifacts
 * (timestamp prefixes, `.md` extensions) and normalizing formatting.
 *
 * @param raw - The raw candidate string to normalize.
 * @returns The cleaned candidate string, or empty string for non-string input.
 */
export declare function normalizeMemoryNameCandidate(raw: string): string;
/**
 * Converts text to a URL-safe, filesystem-safe slug using Unicode normalization.
 *
 * @param text - The input text to slugify (truncated to 200 chars before processing).
 * @returns A lowercase hyphen-separated slug, or empty string for falsy input.
 */
export declare function slugify(text: string): string;
/**
 * Checks if a memory name candidate contains timestamp or filename artifacts,
 * tool invocation patterns, or other contaminated prompt text.
 *
 * @param candidate - The candidate memory name to check.
 * @returns `true` if the candidate matches any contamination pattern.
 */
export declare function isContaminatedMemoryName(candidate: string): boolean;
/**
 * Determines if a task description is too generic to derive a meaningful slug
 * (e.g., "session-summary", "implementation").
 *
 * @param task - The task description string to evaluate.
 * @returns `true` if the slugified task matches a known generic label.
 */
export declare function isGenericContentTask(task: string): boolean;
/**
 * Selects the best content name from a list of candidates based on length
 * and quality heuristics, skipping generic or contaminated entries.
 *
 * @param candidates - Ordered list of candidate names (first valid wins).
 * @returns The best normalized candidate, or empty string if none qualify.
 */
export declare function pickBestContentName(candidates: readonly string[]): string;
/**
 * Ensure a memory filename is unique within a context directory.
 * Appends `-1`, `-2`, etc. on collision. Falls back to random hex suffixes.
 *
 * @param contextDir - Absolute path to the memory directory.
 * @param filename   - Proposed filename (e.g. "08-03-26_10-24__my-slug.md").
 * @returns The original filename if unique, or a collision-free variant.
 */
export declare function ensureUniqueMemoryFilename(contextDir: string, filename: string): string;
/**
 * Generates a content-appropriate slug from a task description, with fallback
 * and alternative candidates. Uses hash-based fallback when no candidate qualifies.
 *
 * @param task - Primary task description to derive the slug from.
 * @param fallback - Fallback text used when task and alternatives are insufficient.
 * @param alternatives - Optional additional candidate strings to consider.
 * @returns A truncated, word-boundary-aware slug for use in memory filenames.
 */
export declare function generateContentSlug(task: string, fallback: string, alternatives?: readonly string[]): string;
//# sourceMappingURL=slug-utils.d.ts.map