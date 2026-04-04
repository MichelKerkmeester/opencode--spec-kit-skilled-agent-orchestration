export type IssueSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
export interface ReviewIssue {
    severity: IssueSeverity;
    field: string;
    message: string;
    fix: string;
}
export interface PostSaveReviewResult {
    status: 'PASSED' | 'ISSUES_FOUND' | 'SKIPPED';
    issues: ReviewIssue[];
    skipReason?: string;
}
export interface PostSaveReviewInput {
    savedFilePath: string;
    collectedData: {
        sessionSummary?: string;
        _manualTriggerPhrases?: string[];
        importanceTier?: string;
        importance_tier?: string;
        contextType?: string;
        context_type?: string;
        keyDecisions?: unknown[];
        _manualDecisions?: unknown[];
        _source?: string;
    } | null;
    inputMode?: string;
}
/**
 * Review a saved memory file against the original JSON payload.
 * Detects silent field overrides/discards that defeat JSON mode.
 */
export declare function reviewPostSaveQuality(input: PostSaveReviewInput): PostSaveReviewResult;
/**
 * Compute a quality score penalty based on post-save review findings.
 * Returns a negative number (penalty) to be added to the quality_score.
 * The penalty is capped at -0.30 to prevent the score from going below a floor.
 */
export declare function computeReviewScorePenalty(issues: ReviewIssue[]): number;
/**
 * Print the post-save quality review result to stdout in machine-readable format.
 */
export declare function printPostSaveReview(result: PostSaveReviewResult): void;
//# sourceMappingURL=post-save-review.d.ts.map