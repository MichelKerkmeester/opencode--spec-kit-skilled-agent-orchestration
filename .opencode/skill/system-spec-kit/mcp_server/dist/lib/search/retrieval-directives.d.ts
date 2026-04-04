/**
 * Retrieval directive derived from a constitutional memory.
 *
 * - `surfaceCondition`  — "Always surface when: <condition>" phrase for LLM consumption.
 * - `priorityCondition` — "Prioritize when: <condition>" phrase for LLM consumption.
 * - `rulePattern`       — Extracted imperative rule phrase from content.
 * - `source`            — Origin label (memory title or file path).
 */
export interface RetrievalDirective {
    surfaceCondition: string;
    priorityCondition: string;
    rulePattern: string;
    source: string;
}
/**
 * A constitutional memory result, optionally enriched with a retrieval directive.
 *
 * This mirrors the ConstitutionalMemory shape in hooks/memory-surface.ts but is
 * kept intentionally structural (duck-typed) so the retrieval-directives module
 * has no hard dependency on the surface hook's private types.
 */
export interface ConstitutionalResult {
    id: number;
    specFolder: string;
    filePath: string;
    title: string;
    importanceTier: string;
    /** Optional: populated by enrichWithRetrievalDirectives() */
    retrieval_directive?: string;
}
/**
 * Extract a retrieval directive from constitutional memory content.
 *
 * Parsing strategy:
 * 1. Scan up to MAX_CONTENT_SCAN_CHARS of content for lines containing
 *    imperative keywords (must, always, never, should, …).
 * 2. For each candidate line, parse out the rule verb and condition clause.
 * 3. Build "Always surface when:" and "Prioritize when:" phrases.
 * 4. If no imperative lines are found, fall back to the title as the directive.
 * 5. Returns null only when both content and title are empty.
 *
 * This function is a pure transformation — no I/O, no side effects.
 *
 * @param content - Full text content of the constitutional memory file.
 * @param title   - Title of the memory (used as fallback source label).
 * @returns RetrievalDirective, or null if no directive can be extracted.
 */
export declare function extractRetrievalDirective(content: string, title?: string): RetrievalDirective | null;
/**
 * Format a retrieval directive as a single metadata field value string.
 *
 * Output format (pipe-delimited for easy parsing):
 *   "<surfaceCondition> | <priorityCondition>"
 *
 * This compact format is designed for LLM consumption: the two pipe-separated
 * clauses provide both a mandatory-surface signal and a priority-boosting hint
 * in a single field that fits naturally in a metadata envelope.
 *
 * @param directive - The retrieval directive to format.
 * @returns A formatted string suitable for use as the `retrieval_directive` metadata field.
 */
export declare function formatDirectiveMetadata(directive: RetrievalDirective): string;
/**
 * Enrich an array of constitutional memory results with `retrieval_directive` metadata.
 *
 * For each result:
 * - Reads the memory file content (if filePath is set and readable).
 * - Extracts a retrieval directive from content + title.
 * - Attaches the formatted directive string as `retrieval_directive`.
 *
 * Results that fail content reading receive a title-only directive (never null).
 * Results without a parseable directive are returned unchanged (no `retrieval_directive` field).
 *
 * This function performs NO scoring changes. It is a pure metadata enrichment pass
 * that adds the `retrieval_directive` field to each result object.
 *
 * @param results - Array of constitutional memory results to enrich.
 * @returns New array (shallow copy) with `retrieval_directive` added where extractable.
 */
export declare function enrichWithRetrievalDirectives(results: ConstitutionalResult[]): ConstitutionalResult[];
//# sourceMappingURL=retrieval-directives.d.ts.map