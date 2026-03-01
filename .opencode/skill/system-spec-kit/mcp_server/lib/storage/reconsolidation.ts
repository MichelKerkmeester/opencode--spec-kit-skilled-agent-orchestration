// ---------------------------------------------------------------
// MODULE: Reconsolidation
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// TM-06: Reconsolidation-on-Save
//
// After embedding generation, check top-3 most similar memories
// in the spec folder:
// - similarity >= 0.88: MERGE (duplicate - merge content,
//   boost importance_weight)
// - similarity 0.75-0.88: CONFLICT (supersede prior memory via causal
//   'supersedes' edge)
// - similarity < 0.75: COMPLEMENT (store new memory unchanged)
//
// Behind SPECKIT_RECONSOLIDATION flag (default OFF)
// REQUIRES: checkpoint created before first enable
// ---------------------------------------------------------------

import { createHash } from 'crypto';
import type Database from 'better-sqlite3';
import * as causalEdges from './causal-edges';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

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
  importanceWeight: number;
  mergedContentLength: number;
  similarity: number;
}

/** Result of a conflict (supersede) operation */
export interface ConflictResult {
  action: 'conflict';
  existingMemoryId: number;
  newMemoryId: number;
  causalEdgeId: number | null;
  similarity: number;
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
}

/** Combined reconsolidation result */
export type ReconsolidationResult = MergeResult | ConflictResult | ComplementResult;

/** Callback for finding similar memories by embedding */
type FindSimilarFn = (
  embedding: Float32Array | number[],
  options: { limit: number; specFolder?: string }
) => SimilarMemory[];

/** Callback for storing a new memory (complement path) */
type StoreMemoryFn = (memory: NewMemoryData) => number;

/** Callback for generating an embedding from content */
type GenerateEmbeddingFn = (content: string) => Promise<Float32Array | number[] | null>;

/* ---------------------------------------------------------------
   2. CONFIGURATION
   --------------------------------------------------------------- */

/** Threshold above which memories are merged (near-duplicates) */
const MERGE_THRESHOLD = 0.88;

/** Threshold above which memories are in conflict (supersede) */
const CONFLICT_THRESHOLD = 0.75;

/** Maximum number of similar memories to check */
const SIMILAR_MEMORY_LIMIT = 3;

/* ---------------------------------------------------------------
   3. FEATURE FLAG
   --------------------------------------------------------------- */

/**
 * Check if reconsolidation is enabled via feature flag.
 *
 * @returns true if SPECKIT_RECONSOLIDATION is not explicitly disabled (default: ON)
 */
export function isReconsolidationEnabled(): boolean {
  return process.env.SPECKIT_RECONSOLIDATION?.toLowerCase() !== 'false';
}

/* ---------------------------------------------------------------
   4. SIMILARITY SEARCH
   --------------------------------------------------------------- */

/**
 * Find the top-N most similar memories in a spec folder.
 *
 * @param embedding - The embedding vector to compare against
 * @param specFolder - The spec folder to search within
 * @param findSimilar - Callback to find similar memories by embedding
 * @param limit - Maximum number of results (default: 3)
 * @returns Array of similar memories sorted by similarity DESC
 */
export function findSimilarMemories(
  embedding: Float32Array | number[],
  specFolder: string,
  findSimilar: FindSimilarFn,
  limit: number = SIMILAR_MEMORY_LIMIT
): SimilarMemory[] {
  try {
    return findSimilar(embedding, { limit, specFolder });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[reconsolidation] findSimilarMemories error:', message);
    return [];
  }
}

/* ---------------------------------------------------------------
   5. ACTION DETERMINATION
   --------------------------------------------------------------- */

/**
 * Determine the reconsolidation action based on similarity score.
 *
 * @param similarity - Cosine similarity between new and existing memory
 * @returns The action to take: 'merge', 'conflict', or 'complement'
 */
export function determineAction(similarity: number): ReconsolidationAction {
  if (similarity >= MERGE_THRESHOLD) {
    return 'merge';
  }
  if (similarity >= CONFLICT_THRESHOLD) {
    return 'conflict';
  }
  return 'complement';
}

/* ---------------------------------------------------------------
   6. MERGE OPERATION
   --------------------------------------------------------------- */

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
 * @returns MergeResult with merge details
 */
export async function executeMerge(
  existingMemory: SimilarMemory,
  newMemory: NewMemoryData,
  db: Database.Database,
  generateEmbedding?: GenerateEmbeddingFn | null
): Promise<MergeResult> {
  const existingContent = existingMemory.content_text ?? '';
  const newContent = newMemory.content;

  // Merge content: append new unique sections
  const mergedContent = mergeContent(existingContent, newContent);

  // Boost importance_weight on merge (capped at 1.0)
  const currentWeight = existingMemory.importance_weight ?? 0.5;
  const boostedWeight = Math.min(1.0, currentWeight + 0.1);

  try {
    // AI-WHY: Include content_hash in UPDATE so change-detection and dedup
    // use the merged content's hash, not the stale pre-merge value.
    const mergedHash = createHash('sha256').update(mergedContent, 'utf-8').digest('hex');

    // Update the existing memory with merged content and boosted importance
    const mergeResult = db.prepare(`
      UPDATE memory_index
      SET content_text = ?,
          importance_weight = ?,
          content_hash = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(mergedContent, boostedWeight, mergedHash, existingMemory.id);

    if (mergeResult.changes === 0) {
      throw new Error(`executeMerge: target memory ${existingMemory.id} no longer exists`);
    }

    // Optionally regenerate embedding for merged content
    if (generateEmbedding) {
      try {
        const newEmbedding = await generateEmbedding(mergedContent);
        if (newEmbedding) {
          const buffer = embeddingToBuffer(newEmbedding);
          db.prepare(
            'UPDATE vec_memories SET embedding = ? WHERE rowid = ?'
          ).run(buffer, existingMemory.id);
        }
      } catch (embErr: unknown) {
        const msg = embErr instanceof Error ? embErr.message : String(embErr);
        console.warn('[reconsolidation] Failed to regenerate embedding for merge:', msg);
        // Non-fatal: merged content is stored even without updated embedding
      }
    }

    return {
      action: 'merge',
      existingMemoryId: existingMemory.id,
      importanceWeight: boostedWeight,
      mergedContentLength: mergedContent.length,
      similarity: existingMemory.similarity,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Merge operation failed: ${message}`);
  }
}

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
export function mergeContent(existing: string, incoming: string): string {
  if (!existing || existing.trim().length === 0) {
    return incoming;
  }
  if (!incoming || incoming.trim().length === 0) {
    return existing;
  }

  const existingLines = new Set(
    existing.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  );

  const newLines = incoming
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !existingLines.has(line));

  if (newLines.length === 0) {
    return existing;
  }

  return existing + '\n\n<!-- Merged content -->\n' + newLines.join('\n');
}

/* ---------------------------------------------------------------
   7. CONFLICT OPERATION
   --------------------------------------------------------------- */

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
export function executeConflict(
  existingMemory: SimilarMemory,
  newMemory: NewMemoryData,
  db: Database.Database
): ConflictResult {
  try {
    // Add causal 'supersedes' edge only when caller provides a distinct new ID.
    // AI-GUARD: Prevent self-referential supersedes edges (source == target).
    let edgeId: number | null = null;
    const hasDistinctNewId =
      typeof newMemory.id === 'number' &&
      Number.isFinite(newMemory.id) &&
      newMemory.id !== existingMemory.id;

    if (hasDistinctNewId) {
      // Preferred TM-06 path: preserve superseded content and mark as deprecated.
      db.prepare(`
        UPDATE memory_index
        SET importance_tier = 'deprecated',
            updated_at = datetime('now')
        WHERE id = ?
      `).run(existingMemory.id);

      const sourceId = String(newMemory.id);
      const targetId = String(existingMemory.id);
      edgeId = causalEdges.insertEdge(
        sourceId,
        targetId,
        'supersedes',
        1.0,
        `TM-06 reconsolidation conflict: similarity ${(existingMemory.similarity * 100).toFixed(1)}%`
      );
    } else {
      // Legacy fallback: in-place replacement when caller cannot provide new ID.
      db.prepare(`
        UPDATE memory_index
        SET content_text = ?,
            title = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `).run(newMemory.content, newMemory.title, existingMemory.id);

      if (newMemory.embedding) {
        try {
          const buffer = embeddingToBuffer(newMemory.embedding);
          db.prepare(
            'UPDATE vec_memories SET embedding = ? WHERE rowid = ?'
          ).run(buffer, existingMemory.id);
        } catch {
          // Non-fatal: content is updated even if embedding update fails
        }
      }
    }

    return {
      action: 'conflict',
      existingMemoryId: existingMemory.id,
      newMemoryId: newMemory.id ?? existingMemory.id,
      causalEdgeId: edgeId,
      similarity: existingMemory.similarity,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Conflict operation failed: ${message}`);
  }
}

/* ---------------------------------------------------------------
   8. COMPLEMENT OPERATION
   --------------------------------------------------------------- */

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
export function executeComplement(
  newMemory: NewMemoryData,
  storeMemory: StoreMemoryFn,
  topSimilarity: number | null
): ComplementResult {
  const newMemoryId = storeMemory(newMemory);

  return {
    action: 'complement',
    newMemoryId,
    similarity: topSimilarity,
  };
}

/* ---------------------------------------------------------------
   9. RECONSOLIDATION ORCHESTRATOR
   --------------------------------------------------------------- */

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
export async function reconsolidate(
  newMemory: NewMemoryData,
  db: Database.Database,
  options: ReconsolidateOptions
): Promise<ReconsolidationResult | null> {
  if (!isReconsolidationEnabled()) {
    return null;
  }

  const { findSimilar, storeMemory, generateEmbedding } = options;

  // Step 1: Find similar memories
  const similarMemories = findSimilarMemories(
    newMemory.embedding,
    newMemory.specFolder,
    findSimilar
  );

  // No existing memories: complement (new)
  if (similarMemories.length === 0) {
    // AI-WHY: Do not persist in orchestrator complement path.
    // Caller owns canonical create flow (prevents duplicate writes).
    return {
      action: 'complement',
      newMemoryId: newMemory.id ?? 0,
      similarity: null,
    };
  }

  // Step 2: Get the most similar memory and determine action
  const topMatch = similarMemories[0];
  const action = determineAction(topMatch.similarity);

  // Step 3: Execute action
  switch (action) {
    case 'merge':
      return executeMerge(topMatch, newMemory, db, generateEmbedding);

    case 'conflict':
      {
        let conflictMemory = newMemory;

        // TM-06 live-save path: materialize a distinct memory ID before conflict
        // so supersedes edges can be created deterministically.
        if (conflictMemory.id === undefined) {
          try {
            const storedId = storeMemory(newMemory);
            if (
              typeof storedId === 'number' &&
              Number.isFinite(storedId) &&
              storedId > 0 &&
              storedId !== topMatch.id
            ) {
              conflictMemory = { ...newMemory, id: storedId };
            }
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.warn('[reconsolidation] conflict pre-store failed, falling back to in-place conflict:', message);
          }
        }

        return executeConflict(topMatch, conflictMemory, db);
      }

    case 'complement':
      // AI-WHY: Complement is a routing decision only; caller persists once.
      return {
        action: 'complement',
        newMemoryId: newMemory.id ?? 0,
        similarity: topMatch.similarity,
      };

    default:
      // Exhaustive check
      return {
        action: 'complement',
        newMemoryId: newMemory.id ?? 0,
        similarity: topMatch.similarity,
      };
  }
}

/* ---------------------------------------------------------------
   10. HELPERS
   --------------------------------------------------------------- */

/**
 * Convert an embedding array to a Buffer for SQLite storage.
 *
 * @param embedding - The embedding as Float32Array or number[]
 * @returns Buffer representation of the embedding
 */
function embeddingToBuffer(embedding: Float32Array | number[]): Buffer {
  if (embedding instanceof Float32Array) {
    return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
  }
  return Buffer.from(new Float32Array(embedding).buffer);
}

/* ---------------------------------------------------------------
   11. EXPORTS (constants for testing)
   --------------------------------------------------------------- */

export {
  MERGE_THRESHOLD,
  CONFLICT_THRESHOLD,
  SIMILAR_MEMORY_LIMIT,
};

export type {
  FindSimilarFn,
  StoreMemoryFn,
  GenerateEmbeddingFn,
};
