import type Database from 'better-sqlite3';
/** Action determined by similarity threshold comparison */
export type ReconsolidationAction = 'merge' | 'conflict' | 'complement';
/** An existing memory found during similarity search */
export interface SimilarMemory {
    id: number;
    file_path: string;
    title: string | null;
    content_text: string | null;
    similarity: number;
    spec_folder: string;
    importance_weight?: number;
    [key: string]: unknown;
}
/** A new memory to be reconsolidated */
export interface NewMemoryData {
    id?: number;
    title: string | null;
    content: string;
    specFolder: string;
    filePath: string;
    embedding: Float32Array | number[];
    triggerPhrases?: string[];
    importanceTier?: string;
    importanceWeight?: number;
}
/** Result of a merge operation */
export interface MergeResult {
    action: 'merge';
    existingMemoryId: number;
    newMemoryId: number;
    importanceWeight: number;
    mergedContentLength: number;
    similarity: number;
    warnings?: string[];
}
export type MergeAbortStatus = 'predecessor_changed' | 'predecessor_gone';
/** Result when a merge candidate becomes stale before commit */
export interface MergeAbortedResult {
    action: 'complement';
    status: MergeAbortStatus;
    existingMemoryId: number;
    newMemoryId: number;
    similarity: number;
    warnings?: string[];
}
/** Result of a conflict (supersede) operation */
export interface ConflictResult {
    action: 'conflict';
    existingMemoryId: number;
    newMemoryId: number;
    causalEdgeId: number | null;
    similarity: number;
    warnings?: string[];
}
/** Result of a complement (new) operation */
export interface ComplementResult {
    action: 'complement';
    /**
     * Memory ID when already known by caller; 0 means "not persisted yet" and
     * caller should execute normal create flow.
     */
    newMemoryId: number;
    similarity: number | null;
    warnings?: string[];
}
/** Combined reconsolidation result */
export type ReconsolidationResult = MergeResult | MergeAbortedResult | ConflictResult | ComplementResult;
/** Callback for finding similar memories by embedding */
type FindSimilarFn = (embedding: Float32Array | number[], options: {
    limit: number;
    specFolder?: string;
}) => SimilarMemory[];
/** Callback for storing a new memory (complement path) */
type StoreMemoryFn = (memory: NewMemoryData) => number;
/** Callback for generating an embedding from content */
type GenerateEmbeddingFn = (content: string) => Promise<Float32Array | number[] | null>;
/** Threshold above which memories are merged (near-duplicates) */
declare const MERGE_THRESHOLD = 0.88;
/** Threshold above which memories are in conflict (supersede) */
declare const CONFLICT_THRESHOLD = 0.75;
/** Maximum number of similar memories to check */
declare const SIMILAR_MEMORY_LIMIT = 3;
import { isReconsolidationEnabled } from '../search/search-flags.js';
export { isReconsolidationEnabled };
/**
 * Find the top-N most similar memories in a spec folder.
 *
 * @param embedding - The embedding vector to compare against
 * @param specFolder - The spec folder to search within
 * @param findSimilar - Callback to find similar memories by embedding
 * @param limit - Maximum number of results (default: 3)
 * @returns Array of similar memories sorted by similarity DESC
 */
export declare function findSimilarMemories(embedding: Float32Array | number[], specFolder: string, findSimilar: FindSimilarFn, limit?: number): SimilarMemory[];
/**
 * Determine the reconsolidation action based on similarity score.
 *
 * @param similarity - Cosine similarity between new and existing memory
 * @returns The action to take: 'merge', 'conflict', or 'complement'
 */
export declare function determineAction(similarity: number): ReconsolidationAction;
/**
 * Merge a new memory into an existing one (similarity >= 0.88).
 *
 * Combines content by appending new unique sections to the existing
 * memory, boosts the importance_weight, and updates the embedding
 * to reflect the merged content.
 *
 * @param existingMemory - The existing memory to merge into
 * @param newMemory - The new memory being saved
 * @param db - The database instance
 * @param generateEmbedding - Optional callback to regenerate embedding for merged content
 * @returns MergeResult when merged, or a complement-style abort result when the predecessor changed
 */
export declare function executeMerge(existingMemory: SimilarMemory, newMemory: NewMemoryData, db: Database.Database, generateEmbedding?: GenerateEmbeddingFn | null): Promise<MergeResult | MergeAbortedResult>;
/**
 * Merge two content strings by appending unique new lines.
 *
 * Splits both contents into lines, then appends lines from the new
 * content that are not present in the existing content.
 *
 * @param existing - The existing memory content
 * @param incoming - The new memory content
 * @returns The merged content string
 */
export declare function mergeContent(existing: string, incoming: string): string;
/**
 * Resolve a conflict between highly similar memories (similarity 0.75-0.88).
 *
 * Preferred path (when caller provides a distinct new memory ID):
 * - Mark existing memory as deprecated (superseded)
 * - Create a 'supersedes' causal edge from new -> existing
 *
 * Legacy fallback (when no new ID is available):
 * - Update existing memory content/title in-place
 * - Skip edge creation (avoids self-referential edges)
 *
 * @param existingMemory - The existing memory being superseded
 * @param newMemory - The new memory replacing it
 * @param db - The database instance
 * @returns ConflictResult with supersede details
 */
export declare function executeConflict(existingMemory: SimilarMemory, newMemory: NewMemoryData, db: Database.Database): ConflictResult;
/**
 * Store a new memory unchanged (similarity < 0.75).
 *
 * The new memory is distinct enough from existing memories to be
 * stored as a separate entry.
 *
 * @param newMemory - The new memory to store
 * @param storeMemory - Callback to store the memory
 * @param topSimilarity - The highest similarity score found (null if no candidates)
 * @returns ComplementResult with storage details
 */
export declare function executeComplement(newMemory: NewMemoryData, storeMemory: StoreMemoryFn, topSimilarity: number | null): ComplementResult;
/** Options for the reconsolidation orchestrator */
export interface ReconsolidateOptions {
    findSimilar: FindSimilarFn;
    storeMemory: StoreMemoryFn;
    generateEmbedding?: GenerateEmbeddingFn | null;
}
/**
 * Orchestrate the full reconsolidation flow for a new memory.
 *
 * 1. Find top-3 most similar memories in the spec folder
 * 2. Determine action based on highest similarity score
 * 3. Execute the appropriate operation (merge/conflict/complement)
 *
 * When the feature flag is OFF, returns null (caller should use
 * normal store path).
 *
 * @param newMemory - The new memory to reconsolidate
 * @param db - The database instance
 * @param options - Callbacks for similarity search and storage
 * @returns ReconsolidationResult or null if feature is disabled
 */
export declare function reconsolidate(newMemory: NewMemoryData, db: Database.Database, options: ReconsolidateOptions): Promise<ReconsolidationResult | null>;
export { MERGE_THRESHOLD, CONFLICT_THRESHOLD, SIMILAR_MEMORY_LIMIT, };
/**
 * Re-exports related public types.
 */
export type { FindSimilarFn, StoreMemoryFn, GenerateEmbeddingFn, };
//# sourceMappingURL=reconsolidation.d.ts.map