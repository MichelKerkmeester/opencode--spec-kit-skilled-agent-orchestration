import { isQualityLoopEnabled } from '../lib/search/search-flags.js';
type CoherenceResolver = (reference: string) => boolean;
interface CoherenceMetadata extends Record<string, unknown> {
    title?: string;
    filePath?: string;
    lastModified?: string;
    causalLinks?: Record<string, unknown>;
    resolveReference?: CoherenceResolver;
}
interface QualityScoreBreakdown {
    triggers: number;
    anchors: number;
    budget: number;
    coherence: number;
}
interface QualityScore {
    total: number;
    breakdown: QualityScoreBreakdown;
    issues: string[];
}
interface QualityLoopResult {
    passed: boolean;
    score: QualityScore;
    attempts: number;
    fixes: string[];
    rejected: boolean;
    rejectionReason?: string;
    /** Content after auto-fix mutations (present only when fixes were applied) */
    fixedContent?: string;
    /** Trigger phrases after auto-fix metadata mutations */
    fixedTriggerPhrases?: string[];
}
interface QualityLoopOptions {
    maxRetries?: number;
    threshold?: number;
    emitEvalMetrics?: boolean;
}
declare const QUALITY_WEIGHTS: {
    readonly triggers: 0.25;
    readonly anchors: 0.3;
    readonly budget: 0.2;
    readonly coherence: 0.25;
};
/** Rough token-to-char ratio: 1 token ~ 4 chars (env-configurable via MCP_CHARS_PER_TOKEN) */
declare const DEFAULT_TOKEN_BUDGET = 2000;
declare const DEFAULT_CHAR_BUDGET: number;
/**
 * Compute trigger phrase quality sub-score.
 *
 * Evaluates whether the memory metadata declares enough trigger phrases for
 * reliable retrieval via the `memory_match_triggers` tool. The scoring
 * thresholds are:
 *   - 0 phrases  → score 0.0  (memory will never surface via trigger matching)
 *   - 1–3 phrases → score 0.5  (below the recommended minimum of four)
 *   - 4+ phrases  → score 1.0  (meets or exceeds the recommended minimum)
 *
 * @param metadata - Raw metadata record extracted from the memory file. Expected
 *   to contain a `triggerPhrases` key whose value is an array of strings.
 * @returns An object with:
 *   - `score`  — Sub-score in the range [0, 1].
 *   - `issues` — Human-readable issue strings when the count is below 4.
 */
declare function scoreTriggerPhrases(metadata: Record<string, unknown>): {
    score: number;
    issues: string[];
};
/**
 * Compute anchor format quality sub-score.
 *
 * Scans `content` for HTML comment–style ANCHOR tags in the forms
 * `<!-- ANCHOR: name -->` and `<!-- /ANCHOR: name -->`, then verifies that
 * every opening tag has a matching closing tag and vice-versa.
 *
 * Scoring rules:
 *   - No anchors present at all → score 0.5 (neutral; anchors are optional)
 *   - All anchors properly paired  → score 1.0
 *   - Mismatches present → proportional deduction: `1 - brokenCount / totalUniqueNames`
 *     (minimum 0.0)
 *
 * @param content - Full text content of the memory file to inspect.
 * @returns An object with:
 *   - `score`  — Sub-score in the range [0, 1].
 *   - `issues` — Descriptions of any unclosed or unopened ANCHOR tags found.
 */
declare function scoreAnchorFormat(content: string): {
    score: number;
    issues: string[];
};
/**
 * Compute token budget quality sub-score.
 *
 * Approximates token count from character length using the constant ratio
 * `CHARS_PER_TOKEN` (4 chars ≈ 1 token) and compares the result against
 * `charBudget`. Memories that exceed the budget are penalised proportionally
 * so that callers can surface oversized files before indexing.
 *
 * Scoring rules:
 *   - `content.length <= charBudget` → score 1.0 (within budget)
 *   - `content.length > charBudget`  → score `charBudget / content.length`
 *     (always > 0 because `charBudget > 0`)
 *
 * @param content    - Full text content of the memory file.
 * @param charBudget - Maximum allowed character count before penalisation.
 *   Defaults to `DEFAULT_CHAR_BUDGET` (`DEFAULT_TOKEN_BUDGET * CHARS_PER_TOKEN`,
 *   i.e. 2000 tokens × 4 = 8000 characters).
 * @returns An object with:
 *   - `score`  — Sub-score in the range (0, 1].
 *   - `issues` — A single message describing the overage when the budget is
 *     exceeded, including the approximate token count.
 */
declare function scoreTokenBudget(content: string, charBudget?: number): {
    score: number;
    issues: string[];
};
/**
 * Compute coherence quality sub-score.
 *
 * Starts with four additive structural checks, each worth 0.25 points, then
 * applies bounded deductions for temporal and relational inconsistencies:
 *
 *   1. Non-empty (trimmed length > 0)        → +0.25
 *   2. Minimal length (> 50 chars)            → +0.25
 *   3. Has at least one Markdown heading
 *      (`# …`, `## …`, or `### …`)           → +0.25
 *   4. Substantial content (> 200 chars)      → +0.25
 *
 * Deductions:
 *   - Future-dated completion claims          → up to -0.25
 *   - Unresolved/self causal references       → up to -0.25
 *
 * Each failing check contributes a descriptive string to `issues`.
 * An entirely empty content string short-circuits to score 0.0.
 *
 * @param content - Full text content of the memory file.
 * @param metadata - Optional metadata used for temporal/relational validation.
 * @returns An object with:
 *   - `score`  — Sub-score in the range [0, 1].
 *   - `issues` — One entry per failed structural check.
 */
declare function scoreCoherence(content: string, metadata?: CoherenceMetadata): {
    score: number;
    issues: string[];
};
/**
 * Compute composite quality score for a memory file.
 *
 * Aggregates the four dimension sub-scores into a single weighted total using
 * the weights defined in `QUALITY_WEIGHTS`:
 *   - triggers  × 0.25
 *   - anchors   × 0.30
 *   - budget    × 0.20
 *   - coherence × 0.25
 *
 * The total is rounded to three decimal places before being returned.
 *
 * @param content  - Full text content of the memory file.
 * @param metadata - Raw metadata record extracted from the memory file. Passed
 *   through to `scoreTriggerPhrases`; must contain a `triggerPhrases` key
 *   whose value is an array of strings.
 * @returns A `QualityScore` object containing:
 *   - `total`     — Weighted composite score in the range [0, 1], rounded to
 *     three decimal places.
 *   - `breakdown` — Per-dimension raw sub-scores (`triggers`, `anchors`,
 *     `budget`, `coherence`), each in [0, 1].
 *   - `issues`    — Concatenated issue strings from all four dimension scorers,
 *     in order: triggers → anchors → budget → coherence.
 */
declare function computeMemoryQualityScore(content: string, metadata: Record<string, unknown>): QualityScore;
/**
 * Attempt automatic fixes for quality issues.
 *
 * Strategies:
 * - Re-extract trigger phrases from content headings/title
 * - Close unclosed ANCHOR tags
 * - Trim content to token budget
 *
 * Returns the (possibly modified) content, metadata, and list of applied fixes.
 */
declare function attemptAutoFix(content: string, metadata: Record<string, unknown>, issues: string[]): {
    content: string;
    metadata: Record<string, unknown>;
    fixed: string[];
};
declare function extractTriggersFromContent(content: string, title?: string): string[];
/**
 * Normalize ANCHOR tags by closing any unclosed ones.
 * Appends <!-- /ANCHOR: name --> at the end of content for unclosed anchors.
 */
declare function normalizeAnchors(content: string): string;
/**
 * Run the verify-fix-verify quality loop on memory content.
 *
 * Gated behind SPECKIT_QUALITY_LOOP env var.
 * Computes quality score, attempts auto-fix if below threshold,
 * rejects after maxRetries failures.
 * Retry attempts are intentionally immediate (no delay/backoff): fixes are
 * deterministic local transforms and the loop is tightly bounded, so immediate
 * retries keep ingestion latency predictable within a single request cycle.
 *
 * @param content - Memory file content
 * @param metadata - Parsed memory metadata (must include triggerPhrases)
 * @param options - threshold (default 0.6), maxRetries (default 2 immediate retries)
 * @returns QualityLoopResult with pass/fail, scores, fixes, rejection info
 */
declare function runQualityLoop(content: string, metadata: Record<string, unknown>, options?: QualityLoopOptions): QualityLoopResult;
/**
 * Log quality metrics to the eval infrastructure (eval_metric_snapshots table).
 * Fail-safe: never throws. No-op when eval logging is disabled.
 */
declare function logQualityMetrics(score: QualityScore, attempts: number, passed: boolean, rejected: boolean, emitEvalMetrics?: boolean): void;
export { computeMemoryQualityScore, scoreTriggerPhrases, scoreAnchorFormat, scoreTokenBudget, scoreCoherence, attemptAutoFix, extractTriggersFromContent, normalizeAnchors, runQualityLoop, logQualityMetrics, isQualityLoopEnabled, QUALITY_WEIGHTS, DEFAULT_TOKEN_BUDGET, DEFAULT_CHAR_BUDGET, };
export type { QualityScore, QualityScoreBreakdown, QualityLoopResult, };
//# sourceMappingURL=quality-loop.d.ts.map