/** Context about how a user selected a memory. */
export interface SelectionContext {
    /** The search mode used (e.g. "search", "context", "trigger"). */
    searchMode?: string;
    /** The intent type of the query. */
    intent?: string;
    /** The rank position of the selected result. */
    selectedRank?: number;
    /** Total results shown to the user. */
    totalResultsShown?: number;
    /** Session ID for grouping selections. */
    sessionId?: string;
    /** Free-form notes. */
    notes?: string;
}
/** A recorded user selection event. */
export interface UserSelection {
    /** Auto-incremented row ID. */
    id: number;
    /** The query ID (from eval_queries) or a generated query hash. */
    queryId: string;
    /** The memory ID that was selected. */
    memoryId: number;
    /** Context about the selection. */
    context: SelectionContext;
    /** ISO timestamp of the selection. */
    timestamp: string;
}
/** A relevance label produced by the LLM-judge. */
export interface LlmJudgeLabel {
    /** The query ID. */
    queryId: string;
    /** The memory ID being judged. */
    memoryId: number;
    /**
     * Relevance grade assigned by the LLM-judge.
     *   0 = not relevant
     *   1 = partially relevant
     *   2 = relevant
     *   3 = highly relevant
     */
    relevance: number;
    /** Confidence score from the LLM-judge (0-1). */
    confidence: number;
    /** Optional reasoning from the LLM-judge. */
    reasoning?: string;
}
/** A manual relevance label for agreement comparison. */
export interface ManualLabel {
    /** The query ID. */
    queryId: string;
    /** The memory ID. */
    memoryId: number;
    /** Relevance grade assigned by a human annotator (0-3). */
    relevance: number;
}
/** Result of computing agreement between LLM-judge and manual labels. */
export interface JudgeAgreementResult {
    /** Total number of overlapping query-memory pairs compared. */
    totalPairs: number;
    /** Number of pairs where LLM-judge and manual labels agree exactly. */
    exactAgreement: number;
    /** Exact agreement rate = exactAgreement / totalPairs. */
    exactAgreementRate: number;
    /** Number of pairs within +-1 grade tolerance. */
    tolerantAgreement: number;
    /** Tolerant agreement rate = tolerantAgreement / totalPairs. */
    tolerantAgreementRate: number;
    /** Whether the exact agreement rate meets the >=80% target. */
    meetsTarget: boolean;
    /** The target agreement rate used. */
    targetRate: number;
    /** Mean absolute grade difference. */
    meanGradeDifference: number;
}
/** Summary of the ground truth corpus. */
export interface GroundTruthCorpusSummary {
    /** Total ground truth pairs from manual curation. */
    manualPairs: number;
    /** Total ground truth pairs from user selections. */
    selectionPairs: number;
    /** Total ground truth pairs from LLM-judge labeling. */
    llmJudgePairs: number;
    /** Grand total across all sources. */
    totalPairs: number;
}
/**
 * Reset the schema-ensured flag (for testing only).
 */
export declare function resetFeedbackSchemaFlag(): void;
/**
 * Record a user's selection of a memory from search results.
 *
 * This captures implicit relevance feedback: when a user selects
 * a memory, it signals that the memory was relevant to their query.
 *
 * Fail-safe: never throws. Returns the selection ID or 0 on failure.
 *
 * @param queryId - Identifier for the query (can be eval_queries.id or a hash).
 * @param memoryId - The memory ID that was selected.
 * @param selectionContext - Context about the selection event.
 * @returns The inserted row ID, or 0 on failure.
 */
export declare function recordUserSelection(queryId: string, memoryId: number, selectionContext?: SelectionContext): number;
/**
 * Retrieve user selection history.
 *
 * @param queryId - Optional filter by query ID. Omit for all selections.
 * @param limit - Maximum number of results. Default 100.
 * @returns Array of UserSelection records, newest first.
 */
export declare function getSelectionHistory(queryId?: string, limit?: number): UserSelection[];
/**
 * Generate LLM-judge relevance labels for query-selection pairs.
 *
 * Deterministic fallback implementation for LLM-judge relevance labels.
 *
 * Uses lexical overlap between query and memory content to assign
 * relevance grades (0-3) and confidence (0-1). This provides an
 * operational Phase C path without external model dependencies.
 *
 * Scoring bands (query token overlap):
 *   - >= 0.45 or strong phrase match => relevance 3
 *   - >= 0.25                       => relevance 2
 *   - >= 0.10                       => relevance 1
 *   - otherwise                     => relevance 0
 *
 * @param querySelectionPairs - Pairs of query text and memory content to judge.
 * @returns Array of deterministic LlmJudgeLabel values.
 */
export declare function generateLlmJudgeLabels(querySelectionPairs: Array<{
    queryId: string;
    memoryId: number;
    queryText: string;
    memoryContent: string;
}>): LlmJudgeLabel[];
/**
 * Persist LLM-judge labels to the eval database.
 *
 * Uses INSERT OR REPLACE to update existing judgments for the same
 * query-memory pair.
 *
 * @param labels - Array of LlmJudgeLabel to persist.
 * @returns Number of labels successfully inserted/updated.
 */
export declare function saveLlmJudgeLabels(labels: LlmJudgeLabel[]): number;
/**
 * Compute agreement rate between LLM-judge labels and manual labels.
 *
 * Matches labels by (queryId, memoryId) pairs and computes:
 *   - Exact agreement: both labels assign the same relevance grade.
 *   - Tolerant agreement: labels differ by at most 1 grade.
 *   - Mean grade difference: average |llm_grade - manual_grade|.
 *
 * Target: exact agreement rate >= 80%.
 *
 * @param llmLabels - Labels from the LLM-judge.
 * @param manualLabels - Labels from human annotators.
 * @param targetRate - Target agreement rate. Default 0.80 (80%).
 * @returns JudgeAgreementResult with agreement metrics.
 */
export declare function computeJudgeAgreement(llmLabels: LlmJudgeLabel[], manualLabels: ManualLabel[], targetRate?: number): JudgeAgreementResult;
/**
 * Count the total ground truth pairs across all sources.
 *
 * Aggregates:
 *   - Manual/synthetic pairs from eval_ground_truth table.
 *   - User selection pairs from eval_user_selections table.
 *   - LLM-judge pairs from eval_llm_judge_labels table.
 *
 * @returns GroundTruthCorpusSummary with per-source and total counts.
 */
export declare function getGroundTruthCorpusSize(): GroundTruthCorpusSummary;
//# sourceMappingURL=ground-truth-feedback.d.ts.map