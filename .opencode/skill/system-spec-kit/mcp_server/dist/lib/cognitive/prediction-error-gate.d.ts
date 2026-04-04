import type Database from 'better-sqlite3';
declare const THRESHOLD: {
    readonly DUPLICATE: 0.95;
    readonly HIGH_MATCH: 0.85;
    readonly MEDIUM_MATCH: 0.7;
    readonly LOW_MATCH: 0.5;
};
declare const ACTION: {
    readonly CREATE: "CREATE";
    readonly UPDATE: "UPDATE";
    readonly SUPERSEDE: "SUPERSEDE";
    readonly REINFORCE: "REINFORCE";
    readonly CREATE_LINKED: "CREATE_LINKED";
};
type ActionType = typeof ACTION[keyof typeof ACTION];
declare const CONTRADICTION_PATTERNS: Array<{
    pattern: RegExp;
    type: string;
    description: string;
}>;
interface EvaluationResult {
    action: ActionType;
    similarity: number;
    existingMemoryId: number | null;
    contradiction: ContradictionResult | null;
    reason: string;
}
interface ContradictionResult {
    detected: boolean;
    type: string | null;
    description: string | null;
    confidence: number;
}
interface ConflictRecord {
    action: ActionType;
    new_memory_hash: string;
    existing_memory_id: number | null;
    similarity: number;
    reason: string;
    contradiction_detected: number;
    contradiction_type: string | null;
    new_content_preview: string;
    existing_content_preview: string;
    spec_folder: string | null;
}
interface ConflictStats {
    total: number;
    byAction: Record<string, number>;
    contradictions: number;
    averageSimilarity: number;
}
interface BatchEvaluationResult {
    results: EvaluationResult[];
    stats: {
        total: number;
        creates: number;
        updates: number;
        supersedes: number;
        reinforces: number;
        contradictions: number;
    };
}
declare function init(database: Database.Database): void;
/**
 * Truncate content to a preview length.
 */
declare function truncateContent(content: string | null | undefined, maxLength?: number): string;
/**
 * Detect contradictions between new and existing content.
 *
 * Runs pattern detection on new and existing content SEPARATELY to avoid
 * false positives from concatenation (e.g., old "not X" + new "X" matching
 * negation patterns across document boundaries).
 *
 * Strategy: contradiction signals in the NEW content (e.g., "actually",
 * "no longer", "instead") indicate the author is correcting/replacing
 * existing knowledge. We only flag a contradiction when the new content
 * contains such a signal AND the existing content does NOT contain the
 * same signal (ruling out inherited phrasing).
 */
declare function detectContradiction(newContent: string, existingContent: string): ContradictionResult;
/**
 * Evaluate whether a new memory should create, update, or supersede existing.
 */
declare function evaluateMemory(newContentHash: string, newContent: string, candidates: Array<{
    id: number;
    similarity: number;
    content?: string;
    file_path?: string;
    [key: string]: unknown;
}>, options?: {
    specFolder?: string;
}): EvaluationResult;
/**
 * Filter candidates to relevant ones.
 */
declare function filterRelevantCandidates(candidates: Array<{
    id: number;
    similarity: number;
    [key: string]: unknown;
}>): Array<{
    id: number;
    similarity: number;
    [key: string]: unknown;
}>;
/**
 * Format a conflict record for logging.
 */
declare function formatConflictRecord(action: ActionType, newMemoryHash: string, existingMemoryId: number | null, similarity: number, reason: string, contradiction: ContradictionResult, newContentPreview: string, existingContentPreview: string, specFolder: string | null): ConflictRecord;
/**
 * Log a conflict record to the database.
 */
declare function logConflict(record: ConflictRecord): void;
/**
 * Get conflict statistics.
 */
declare function getConflictStats(specFolder?: string | null): ConflictStats;
/**
 * Get recent conflicts.
 */
declare function getRecentConflicts(limit?: number): Array<Record<string, unknown>>;
/**
 * Batch evaluate multiple memories.
 */
declare function batchEvaluate(items: Array<{
    contentHash: string;
    content: string;
    candidates: Array<{
        id: number;
        similarity: number;
        [key: string]: unknown;
    }>;
}>, options?: {
    specFolder?: string;
}): BatchEvaluationResult;
/**
 * Calculate similarity statistics for a set of candidates.
 */
declare function calculateSimilarityStats(candidates: Array<{
    similarity: number;
    [key: string]: unknown;
}>): {
    min: number;
    max: number;
    avg: number;
    count: number;
};
/**
 * Get action priority for sorting.
 */
declare function getActionPriority(action: ActionType): number;
export { THRESHOLD, ACTION, CONTRADICTION_PATTERNS, init, evaluateMemory, detectContradiction, formatConflictRecord, logConflict, getConflictStats, getRecentConflicts, batchEvaluate, calculateSimilarityStats, filterRelevantCandidates, getActionPriority, truncateContent, };
export type { ActionType, EvaluationResult, ContradictionResult, ConflictRecord, ConflictStats, BatchEvaluationResult, };
//# sourceMappingURL=prediction-error-gate.d.ts.map