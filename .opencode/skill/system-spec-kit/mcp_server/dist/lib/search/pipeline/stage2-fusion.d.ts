import type Database from 'better-sqlite3';
import { resolveEffectiveScore } from './types.js';
import type { Stage2Input, Stage2Output, PipelineRow, IntentWeightsConfig, ArtifactRoutingConfig } from './types.js';
import { enrichResultsWithAnchorMetadata } from '../anchor-metadata.js';
import { enrichResultsWithValidationMetadata } from '../validation-metadata.js';
/** Result of the strengthenOnAccess FSRS write-back. */
interface StrengthenResult {
    stability: number;
    difficulty: number;
}
/**
 * Apply validation-signal scoring at the Stage 2 single scoring point.
 *
 * Uses quality metadata extracted from spec artifacts to apply a bounded
 * multiplier over the current composite score. This keeps S3 integrated
 * in ranking while preserving score stability.
 */
declare function applyValidationSignalScoring(results: PipelineRow[]): PipelineRow[];
/**
 * Write an FSRS strengthening update for a single memory access.
 *
 * Mirrors the `strengthenOnAccess` logic from the legacy memory-search
 * handler. Uses GRADE_GOOD with a difficulty bonus inversely proportional
 * to current retrievability, so low-retrievability memories receive the
 * largest stability boost.
 *
 * @param db             - Active SQLite connection
 * @param memoryId       - ID of the memory being strengthened
 * @param retrievability - Current retrievability R(t) in [0, 1]
 */
declare function strengthenOnAccess(db: Database.Database, memoryId: number, retrievability: number): StrengthenResult | null;
/**
 * Apply intent-based weights to search results.
 *
 * G2 PREVENTION: This function is ONLY called for non-hybrid search types.
 * Hybrid search (RRF / RSF) already incorporates intent-weighted signals
 * during fusion. Calling this on hybrid results would double-count intent.
 *
 * Weight combination:
 *   intentScore = similarity * w.similarity + importance * w.importance + recency * w.recency
 *
 * Similarity is normalised from the raw 0–100 scale to 0–1 before the
 * weighted combination so all three dimensions operate on the same scale.
 * Results are sorted descending by intentAdjustedScore.
 *
 * @param results - Pipeline rows to score
 * @param weights - Intent weight configuration {similarity, importance, recency}
 * @returns New array sorted by intentAdjustedScore descending
 */
declare function applyIntentWeightsToResults(results: PipelineRow[], weights: IntentWeightsConfig): PipelineRow[];
/**
 * Apply artifact routing weight boosts to results.
 *
 * When the routing system detected a known artifact class with non-zero
 * confidence, the class strategy's `boostFactor` is applied to the
 * current composite score (`score`, then `rrfScore`, then `similarity`).
 * Results are re-sorted by score descending after boosting.
 *
 * @param results       - Pipeline rows to boost
 * @param routingResult - Artifact routing configuration from Stage 1
 * @returns New array with updated scores, sorted descending
 */
declare function applyArtifactRouting(results: PipelineRow[], routingResult: ArtifactRoutingConfig): PipelineRow[];
/**
 * Apply feedback signals — learned trigger boosts and negative feedback demotions.
 *
 * Learned triggers: each memory that matches the query's learned terms receives
 * a proportional boost to its score (capped at 1.0). The boost magnitude uses
 * `match.weight` directly because queryLearnedTriggers already applies the
 * configured learned-trigger weighting (0.7x).
 *
 * Negative feedback: memories with wasUseful=false validations receive a
 * confidence-multiplier demotion. The multiplier is batch-loaded from the DB
 * then applied via applyNegativeFeedback. Feature-gated via
 * SPECKIT_NEGATIVE_FEEDBACK env var.
 *
 * @param results - Pipeline rows to adjust
 * @param query   - Original search query (used for learned trigger matching)
 * @returns New array with feedback-adjusted scores
 */
declare function applyFeedbackSignals(results: PipelineRow[], query: string): PipelineRow[];
declare function applyUsageRankingBoost(db: Database.Database, results: PipelineRow[]): PipelineRow[];
/**
 * Apply FSRS testing effect (strengthening write-back) for all accessed memories.
 *
 * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
 * unintended write side-effects during read-only searches).
 *
 * For each result, the current retrievability R(t) is computed from the stored
 * stability and last_review fields, then `strengthenOnAccess` fires an FSRS
 * GRADE_GOOD update — increasing stability proportional to how much the memory
 * needed the review.
 *
 * Errors per-row are caught and logged; they do not abort the full set.
 *
 * @param db      - Active SQLite database connection
 * @param results - Pipeline rows that were accessed
 */
declare function applyTestingEffect(db: Database.Database, results: PipelineRow[]): void;
/**
 * Execute Stage 2: Fusion + Signal Integration.
 *
 * This is the SINGLE authoritative point where all scoring signals are
 * applied. The ordering is fixed and must not be changed without updating
 * the architectural documentation (see types.ts Stage2 comment block).
 *
 * Signal application order (13 steps):
 *   1.  Session boost      (hybrid only — working memory attention)
 *   1a. Recency fusion     (all types — time-decay bonus)
 *   2.  Causal boost       (hybrid only — graph-traversal amplification)
 *   2a. Co-activation      (spreading activation from top-N seeds)
 *   2b. Community boost    (N2c — inject co-members)
 *   2c. Graph signals      (N2a+N2b — momentum + depth)
 *   3.  Testing effect     (all types, when trackAccess = true)
 *   4.  Intent weights     (non-hybrid only — G2 prevention)
 *   5.  Artifact routing   (all types, when routing confidence > 0)
 *   6.  Feedback signals   (all types — learned triggers + negative feedback)
 *   7.  Artifact limiting  (trim to strategy.maxResults if routing active)
 *   8.  Anchor metadata    (annotation — no score mutation)
 *   9.  Validation metadata (spec quality signals + quality scoring)
 *
 * @param input - Stage 2 input containing candidates and pipeline config
 * @returns Stage 2 output with scored results and per-signal metadata
 */
export declare function executeStage2(input: Stage2Input): Promise<Stage2Output>;
/**
 * Internal functions exposed for unit testing.
 *
 * These are NOT part of the public API and may change without notice.
 * Access only from `*.test.ts` / `*.vitest.ts` files.
 */
export declare const __testables: {
    resolveBaseScore: typeof resolveEffectiveScore;
    strengthenOnAccess: typeof strengthenOnAccess;
    applyIntentWeightsToResults: typeof applyIntentWeightsToResults;
    applyArtifactRouting: typeof applyArtifactRouting;
    applyFeedbackSignals: typeof applyFeedbackSignals;
    applyUsageRankingBoost: typeof applyUsageRankingBoost;
    applyTestingEffect: typeof applyTestingEffect;
    enrichResultsWithAnchorMetadata: typeof enrichResultsWithAnchorMetadata;
    enrichResultsWithValidationMetadata: typeof enrichResultsWithValidationMetadata;
    applyValidationSignalScoring: typeof applyValidationSignalScoring;
};
export {};
//# sourceMappingURL=stage2-fusion.d.ts.map