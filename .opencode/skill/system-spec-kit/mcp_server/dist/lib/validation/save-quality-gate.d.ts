/** Result from Layer 1: Structural validation */
export interface StructuralValidationResult {
    pass: boolean;
    reasons: string[];
}
/** Individual dimension scores from Layer 2 */
export interface ContentQualityDimensions {
    titleQuality: number;
    triggerQuality: number;
    lengthQuality: number;
    anchorQuality: number;
    metadataQuality: number;
}
/** Result from Layer 2: Content quality scoring */
export interface ContentQualityResult {
    pass: boolean;
    signalDensity: number;
    dimensions: ContentQualityDimensions;
    threshold: number;
    reasons: string[];
}
/** Result from Layer 3: Semantic dedup */
export interface SemanticDedupResult {
    pass: boolean;
    isDuplicate: boolean;
    mostSimilarId: number | null;
    mostSimilarScore: number | null;
    threshold: number;
    reason: string | null;
}
/** Combined result from all quality gate layers */
export interface QualityGateResult {
    pass: boolean;
    gateEnabled: boolean;
    warnOnly: boolean;
    wouldReject: boolean;
    layers: {
        structural: StructuralValidationResult;
        contentQuality: ContentQualityResult;
        semanticDedup: SemanticDedupResult | null;
    };
    reasons: string[];
}
/** Parameters for running the quality gate */
export interface QualityGateParams {
    title: string | null;
    content: string;
    specFolder: string;
    triggerPhrases?: string[];
    anchors?: string[];
    embedding?: Float32Array | number[] | null;
    findSimilar?: FindSimilarFn | null;
    /** REQ-D4-003: context_type for short-critical exception evaluation */
    contextType?: string | null;
}
/** Callback for finding similar memories by embedding */
type FindSimilarFn = (embedding: Float32Array | number[], options: {
    limit: number;
    specFolder?: string;
}) => Array<{
    id: number;
    file_path: string;
    similarity: number;
}>;
/** Signal density threshold: below this score, content is too low quality */
declare const SIGNAL_DENSITY_THRESHOLD = 0.4;
/** Semantic dedup similarity threshold: above this, reject as near-duplicate */
declare const SEMANTIC_DEDUP_THRESHOLD = 0.92;
/** Minimum content length for structural validation */
declare const MIN_CONTENT_LENGTH = 50;
/** Warn-only period duration in milliseconds (14 days) */
declare const WARN_ONLY_PERIOD_MS: number;
/** Minimum number of structural signals required for short-critical exception. */
declare const SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS = 2;
declare const SHORT_DECISION_EXCEPTION_LOG_PREFIX = "[QUALITY-GATE] short-critical-exception";
/**
 * Check if the quality gate feature flag is enabled.
 * Default: TRUE. Set SPECKIT_SAVE_QUALITY_GATE=false to disable.
 *
 * @returns true if SPECKIT_SAVE_QUALITY_GATE is not explicitly disabled
 */
export declare function isQualityGateEnabled(): boolean;
/**
 * Check if the quality gate is in warn-only mode.
 * For the first 14 days after activation, the gate logs scores but
 * does not block saves, preventing disruption during rollout.
 *
 * P1-015: Lazy-loads from SQLite if in-memory value is null, so the
 * 14-day countdown survives server restarts.
 *
 * @returns true if in warn-only period
 */
export declare function isWarnOnlyMode(): boolean;
/**
 * Record the activation timestamp for warn-only mode tracking.
 * Called when the quality gate is first enabled.
 *
 * P1-015: Persists to SQLite config table for restart survival.
 *
 * @param timestamp - Unix timestamp in milliseconds. If not provided, uses Date.now()
 */
export declare function setActivationTimestamp(timestamp?: number): void;
/**
 * Reset the activation timestamp. Used in testing.
 * P1-015: Also clears the persisted value from SQLite.
 */
export declare function resetActivationTimestamp(): void;
/**
 * REQ-D4-003: Check whether the save quality gate exceptions feature is enabled.
 * Default: TRUE (graduated). Set SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=false to disable.
 *
 * When enabled, decision documents with sufficient structural signals may bypass
 * the 50-character minimum content length check. All other gates (0.4 density,
 * 0.92 dedup) remain enforced.
 */
export declare function isSaveQualityGateExceptionsEnabled(): boolean;
/**
 * REQ-D4-003: Count structural signals present in a document.
 *
 * Structural signals: title, specFolder (non-empty), anchor (non-empty string).
 * A decision document with >= 2 signals qualifies for the short-critical exception.
 */
export declare function countStructuralSignals(params: {
    title: string | null;
    specFolder: string | null | undefined;
    anchor?: string | null;
}): number;
/**
 * REQ-D4-003: Determine whether the short-critical exception applies.
 *
 * Returns true when ALL conditions hold:
 *   1. SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS is enabled
 *   2. context_type === 'planning' (or legacy 'decision')
 *   3. At least SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS (2) structural signals present
 *
 * This is warn-only initially — callers must log bypass events.
 */
export declare function isShortCriticalException(params: {
    contextType: string | null | undefined;
    title: string | null;
    specFolder: string | null | undefined;
    anchor?: string | null;
}): boolean;
export declare function isQualityGateExceptionEnabled(): boolean;
export declare function shouldBypassShortDecisionLengthGate(params: {
    contextType: string | null | undefined;
    title: string | null;
    specFolder: string | null | undefined;
    anchor?: string | null;
}): boolean;
/**
 * Layer 1: Validate structural requirements for a memory.
 *
 * Checks:
 * - Title exists and is non-empty
 * - Content is non-empty and meets minimum length
 * - Spec folder path is valid format
 *
 * REQ-D4-003: When SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS is enabled, the
 * minimum content length check is bypassed for `planning` (or legacy `decision`)
 * context_type documents that have >= 2 structural signals (title + specFolder + anchor).
 * Bypass events are logged as warnings (warn-only initially).
 *
 * @param params - The memory parameters to validate
 * @returns StructuralValidationResult with pass/fail and reasons
 */
export declare function validateStructural(params: {
    title: string | null;
    content: string;
    specFolder: string;
    contextType?: string | null;
    anchor?: string | null;
}): StructuralValidationResult;
/**
 * Score title quality (0-1).
 * Considers length and specificity (penalizes generic titles).
 *
 * @param title - The memory title
 * @returns Score between 0 and 1
 */
export declare function scoreTitleQuality(title: string | null): number;
/**
 * Score trigger phrase quality (0-1).
 *
 * @param triggerPhrases - Array of trigger phrases
 * @returns Score: 0 phrases=0, 1-2=0.5, 3+=1.0
 */
export declare function scoreTriggerQuality(triggerPhrases: string[]): number;
/**
 * Score content length quality (0-1).
 *
 * @param content - The memory content
 * @returns Score: short<200=0.3, 200-1000=0.7, >1000=1.0
 */
export declare function scoreLengthQuality(content: string): number;
/**
 * Score anchor quality (0-1).
 *
 * @param anchors - Array of anchor IDs found in content
 * @returns Score: 0 anchors=0, 1-2=0.5, 3+=1.0
 */
export declare function scoreAnchorQuality(anchors: string[]): number;
/**
 * Score metadata quality (0-1).
 * Checks for YAML frontmatter presence and completeness.
 *
 * @param content - The memory content to check for frontmatter
 * @returns Score: no frontmatter=0, partial=0.5, complete=1.0
 */
export declare function scoreMetadataQuality(content: string): number;
/**
 * Compute a lightweight quality score for backfilled rows.
 *
 * @param row - Backfilled memory row fields
 * @returns Score between 0.1 and 1.0
 */
export declare function computeBackfillQualityScore(row: {
    content_text?: string;
    trigger_phrases?: string;
    title?: string;
    importance_tier?: string;
}): number;
/**
 * Layer 2: Compute content quality score across all dimensions.
 *
 * Signal density is the weighted average of all dimension scores.
 * Threshold: >= 0.4 to pass.
 *
 * @param params - The memory parameters to score
 * @returns ContentQualityResult with scores and pass/fail
 */
export declare function scoreContentQuality(params: {
    title: string | null;
    content: string;
    triggerPhrases?: string[];
    anchors?: string[];
}): ContentQualityResult;
/**
 * Compute cosine similarity between two vectors.
 *
 * @param a - First vector
 * @param b - Second vector
 * @returns Cosine similarity in range [-1, 1]
 */
export declare function cosineSimilarity(a: Float32Array | number[], b: Float32Array | number[]): number;
/**
 * Layer 3: Check for semantic near-duplicates using vector similarity.
 *
 * Compares the new memory's embedding against existing memories in
 * the same spec folder. If similarity > 0.92 against any existing
 * memory, the new memory is rejected as a near-duplicate.
 *
 * @param embedding - The embedding vector of the new memory
 * @param specFolder - The spec folder to search within
 * @param findSimilar - Callback to find similar memories by embedding
 * @returns SemanticDedupResult with pass/fail and most similar memory
 */
export declare function checkSemanticDedup(embedding: Float32Array | number[], specFolder: string, findSimilar: FindSimilarFn): SemanticDedupResult;
/**
 * Run the full 3-layer quality gate for a memory save operation.
 *
 * When the feature flag is OFF, returns a pass-through result.
 * When in warn-only mode, logs scores but allows saves.
 *
 * @param params - The memory parameters to validate
 * @returns QualityGateResult with combined pass/fail and layer details
 */
export declare function runQualityGate(params: QualityGateParams): QualityGateResult;
export { SIGNAL_DENSITY_THRESHOLD, SEMANTIC_DEDUP_THRESHOLD, MIN_CONTENT_LENGTH, WARN_ONLY_PERIOD_MS, SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS, SHORT_DECISION_EXCEPTION_LOG_PREFIX, };
/**
 * Re-exports related public types.
 */
export type { FindSimilarFn };
//# sourceMappingURL=save-quality-gate.d.ts.map