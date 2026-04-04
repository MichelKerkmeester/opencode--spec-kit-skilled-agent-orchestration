import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser.js';
import type { AssistiveRecommendation, IndexResult, ReconWarningList } from './types.js';
export type { AssistiveClassification, AssistiveRecommendation } from './types.js';
/**
 * Similarity threshold above which two memories are considered near-duplicates
 * and auto-merged.  Requires SPECKIT_ASSISTIVE_RECONSOLIDATION=true.
 */
export declare const ASSISTIVE_AUTO_MERGE_THRESHOLD = 0.96;
/**
 * Similarity threshold above which two memories are considered borderline
 * (possible supersede/complement).  A recommendation is logged but no
 * destructive action is taken.
 */
export declare const ASSISTIVE_REVIEW_THRESHOLD = 0.88;
/**
 * Check whether the assistive reconsolidation feature is enabled.
 * Default: ON (graduated). Set SPECKIT_ASSISTIVE_RECONSOLIDATION=false to disable.
 */
export declare function isAssistiveReconsolidationEnabled(): boolean;
/**
 * Determine the assistive reconsolidation classification for a pair of memories
 * based on their similarity score.
 *
 * Tiers:
 *   similarity >= 0.96  → auto-merge (near-duplicate)
 *   0.88 <= sim < 0.96  → review (supersede or complement recommendation)
 *   sim < 0.88          → keep separate (complement)
 *
 * @param similarity - Cosine similarity in [0, 1]
 * @returns Classification string
 */
export declare function classifyAssistiveSimilarity(similarity: number): 'auto_merge' | 'review' | 'keep_separate';
/**
 * Classify whether a borderline (review-tier) memory pair should be
 * superseded or complemented.
 *
 * Heuristic: if the newer memory's content is longer than the older one,
 * it likely adds information (complement); otherwise it likely replaces it
 * (supersede).  Callers may override with domain-specific logic.
 *
 * @param olderContent - Content text of the older memory
 * @param newerContent - Content text of the newer memory
 * @returns 'supersede' or 'complement'
 */
export declare function classifySupersededOrComplement(olderContent: string, newerContent: string): 'supersede' | 'complement';
/**
 * Log a borderline recommendation to the console (shadow-only).
 * No database writes are performed — this is purely observational.
 *
 * @param recommendation - The recommendation payload
 */
export declare function logAssistiveRecommendation(recommendation: AssistiveRecommendation): void;
/**
 * Result payload from reconsolidation pre-checks during memory_save.
 */
export interface ReconsolidationBridgeResult {
    earlyReturn: IndexResult | null;
    warnings: ReconWarningList;
    /** Populated when SPECKIT_ASSISTIVE_RECONSOLIDATION is enabled and a
     *  borderline pair is detected (review tier). */
    assistiveRecommendation?: AssistiveRecommendation | null;
}
/**
 * Runs reconsolidation when enabled and returns either an early tool response
 * or a signal to continue the standard create-record path.
 */
export declare function runReconsolidationIfEnabled(database: BetterSqlite3.Database, parsed: ReturnType<typeof memoryParser.parseMemoryFile>, filePath: string, force: boolean, embedding: Float32Array | null, scope?: {
    tenantId?: string | null;
    userId?: string | null;
    agentId?: string | null;
    sessionId?: string | null;
    sharedSpaceId?: string | null;
}): Promise<ReconsolidationBridgeResult>;
//# sourceMappingURL=reconsolidation-bridge.d.ts.map