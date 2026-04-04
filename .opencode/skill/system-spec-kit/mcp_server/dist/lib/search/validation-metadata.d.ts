import type { PipelineRow } from './pipeline/types.js';
/**
 * Importance tier → quality score mapping.
 * Higher tiers (constitutional, critical) map to higher quality signals.
 * Used when quality_score is absent or zero.
 */
declare const TIER_QUALITY_SCORES: Record<string, number>;
/**
 * Regex for extracting the SPECKIT_LEVEL marker from content.
 * Matches <!-- SPECKIT_LEVEL: N --> (case-insensitive, optional whitespace).
 * '3+' maps to level 4 to keep numeric comparisons consistent.
 */
declare const SPECKIT_LEVEL_REGEX: RegExp;
/**
 * Markers that indicate a completed validation pass in the content.
 * Presence of any of these strings signals the document has been validated.
 */
declare const VALIDATION_COMPLETE_MARKERS: string[];
/**
 * Validation metadata extracted from a memory row's stored signals.
 * All fields are optional; absence means the signal could not be extracted.
 *
 * This is surfaced as retrieval metadata (not a score) so downstream
 * consumers (scoring layer, MCP output) can use it without risk of
 * double-counting in the fusion pipeline.
 */
export interface ValidationMetadata {
    /** Spec documentation level (1 = minimal, 2 = QA, 3 = complex, 4 = enterprise 3+). */
    specLevel?: number;
    /** True when a checklist.md document is detected from path or content. */
    hasChecklist?: boolean;
    /** Completion status derived from content markers ('complete' | 'partial' | 'unknown'). */
    completionStatus?: 'complete' | 'partial' | 'unknown';
    /** Normalised quality score in [0, 1] derived from quality_score or importance_tier. */
    qualityScore?: number;
    /** ISO date string of the most recent validation, if present in content. */
    validationDate?: string;
}
/**
 * Extract validation signals from a single memory pipeline row.
 *
 * Signal resolution order:
 *   1. `quality_score` from the DB column (direct metric, highest priority).
 *      If zero or absent, falls back to tier-derived score.
 *   2. `importance_tier` → tier quality score mapping.
 *   3. `content` → SPECKIT_LEVEL marker (specLevel).
 *   4. `content` → completion markers (completionStatus, validationDate).
 *   5. `file_path` → checklist heuristic (hasChecklist).
 *
 * Returns null when the row carries no extractable validation signals
 * (no tier, no quality_score, no content with markers).
 *
 * @param row - A PipelineRow as it flows through the search pipeline.
 * @returns ValidationMetadata with all available signals, or null.
 */
export declare function extractValidationMetadata(row: PipelineRow): ValidationMetadata | null;
/**
 * Enrich a batch of pipeline rows with validation metadata.
 *
 * For each row, `extractValidationMetadata` is called. When a non-null
 * result is returned, it is attached to the row under the `validationMetadata`
 * key. Rows with no signals pass through unchanged.
 *
 * Score fields are NEVER modified. This function is metadata-only.
 *
 * @param results - Array of PipelineRow values from the scoring pipeline.
 * @returns New array with `validationMetadata` added where signals exist.
 */
export declare function enrichResultsWithValidationMetadata(results: PipelineRow[]): PipelineRow[];
/**
 * Validation metadata constants exposed for tests and downstream consumers.
 */
export { TIER_QUALITY_SCORES, SPECKIT_LEVEL_REGEX, VALIDATION_COMPLETE_MARKERS };
//# sourceMappingURL=validation-metadata.d.ts.map