import type Database from 'better-sqlite3';
import { GROUND_TRUTH_QUERIES, QUERY_DISTRIBUTION, type GroundTruthQuery, type GroundTruthRelevance, type IntentType, type ComplexityTier } from './ground-truth-data.js';
/** Result returned by generateGroundTruth(). */
export interface GroundTruthDataset {
    queries: GroundTruthQuery[];
    /** Graded relevance judgments mapped to real production memory IDs. */
    relevances: GroundTruthRelevance[];
    distribution: typeof QUERY_DISTRIBUTION;
}
/** Per-dimension diversity validation result. */
export interface DiversityGate {
    dimension: string;
    required: number;
    actual: number;
    passed: boolean;
    detail?: string;
}
/** Full diversity validation report. */
export interface DiversityValidationReport {
    passed: boolean;
    totalQueries: number;
    gates: DiversityGate[];
    summary: string;
}
/** Options for loadGroundTruth(). */
export interface LoadGroundTruthOptions {
    /** If true, DELETE existing rows before inserting. Default: false (skip duplicates). */
    replace?: boolean;
    /** Annotator label to store in eval_ground_truth rows. Default: 'synthetic'. */
    annotator?: string;
}
declare const GATES: {
    readonly MIN_TOTAL_QUERIES: 100;
    readonly MIN_PER_INTENT: 5;
    readonly MIN_COMPLEXITY_TIERS: 3;
    readonly MIN_PER_COMPLEXITY_TIER: 10;
    readonly MIN_MANUAL_QUERIES: 30;
    readonly MIN_HARD_NEGATIVES: 3;
    readonly INTENT_TYPES: IntentType[];
    readonly COMPLEXITY_TIERS: ComplexityTier[];
};
/**
 * Generate the full ground truth dataset.
 *
 * Returns all 110 queries plus graded relevance judgments mapped
 * to real production memory IDs. Each non-hard-negative query has
 * 1-3 relevance entries at grades 3 (highly relevant), 2 (relevant),
 * and 1 (partial). Hard-negative queries have no relevance entries.
 *
 * IDs were mapped from the production context-index.sqlite DB via
 * FTS5-based matching (scripts/map-ground-truth-ids.ts).
 */
export declare function generateGroundTruth(): GroundTruthDataset;
/**
 * Load the ground truth dataset into the evaluation database.
 *
 * Inserts all queries into eval_queries and their relevance
 * judgments into eval_ground_truth. By default uses INSERT OR
 * IGNORE to skip duplicates (based on UNIQUE(query_id, memory_id)
 * constraint in eval_ground_truth).
 *
 * @param evalDb - An initialized better-sqlite3 Database instance.
 * @param options - Load options (replace, annotator).
 * @returns Object with inserted/skipped counts.
 */
export declare function loadGroundTruth(evalDb: Database.Database, options?: LoadGroundTruthOptions): {
    queriesInserted: number;
    relevancesInserted: number;
};
/**
 * Validate that the query dataset meets all diversity hard gates.
 *
 * Hard gates:
 *   1. ≥100 total queries
 *   2. ≥5 queries per intent type (all 7 types)
 *   3. ≥3 distinct complexity tiers present
 *   4. ≥10 queries per complexity tier
 *   5. ≥30 manually curated queries (source='manual')
 *   6. ≥3 hard negative queries (category='hard_negative')
 *   7. No duplicate query strings
 *
 * @param queries - The query array to validate (defaults to full dataset).
 * @returns DiversityValidationReport with per-gate results and summary.
 */
export declare function validateGroundTruthDiversity(queries?: GroundTruthQuery[]): DiversityValidationReport;
export { GROUND_TRUTH_QUERIES, QUERY_DISTRIBUTION, GATES, };
export type { GroundTruthQuery, GroundTruthRelevance, IntentType, ComplexityTier };
//# sourceMappingURL=ground-truth-generator.d.ts.map