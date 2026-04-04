/**
 * Domain vocabulary map for server-side synonym expansion.
 * No LLM calls — purely rule-based template substitution.
 */
export declare const DOMAIN_VOCABULARY_MAP: Record<string, string[]>;
/**
 * Expand a query into multiple search variants using synonym maps.
 *
 * - Original query is always included as the first variant.
 * - Splits compound terms via word boundary matching.
 * - Looks up synonyms from `DOMAIN_VOCABULARY_MAP` (case-insensitive).
 * - Returns at most `MAX_VARIANTS` (3) strings.
 *
 * @param query - The input search query string.
 * @returns Array of query variants, original first, max 3 total.
 * @throws {TypeError} If called with a non-string value at runtime.
 * @example
 * ```ts
 * expandQuery('auth error');
 * // ['auth error', 'authentication error', 'auth exception']
 * ```
 */
export declare function expandQuery(query: string): string[];
//# sourceMappingURL=query-expander.d.ts.map