// ───────────────────────────────────────────────────────────────
// MODULE: Reconsolidation
// ───────────────────────────────────────────────────────────────
// TM-06: Reconsolidation-on-Save
//
// After embedding generation, check top-3 most similar memories
// In the spec folder:
// - similarity in [0.88, 1.0]: MERGE (duplicate — merge content, boost importance_weight)
// - similarity in [0.75, 0.88): CONFLICT (supersede prior memory via causal 'supersedes' edge)
// - similarity in [0, 0.75): COMPLEMENT (store new memory unchanged)
// Note: cosine similarity, normalized [0,1]. Thresholds defined by MERGE_THRESHOLD and CONFLICT_THRESHOLD constants.
//
// Behind SPECKIT_RECONSOLIDATION opt-in flag (default OFF)
// REQUIRES: checkpoint created before first enable
import { createHash } from 'crypto';
import { recordHistory } from './history.js';
import * as causalEdges from './causal-edges.js';
import * as bm25Index from '../search/bm25-index.js';
import { clear_search_cache } from '../search/vector-index-aliases.js';
import { refresh_interference_scores_for_folder } from '../search/vector-index-store.js';
import { getCanonicalPathKey } from '../utils/canonical-path.js';
import { delete_memory_from_database } from '../search/vector-index-mutations.js';
import { recordLineageTransition } from './lineage-state.js';
import { applyPostInsertMetadata, } from './post-insert-metadata.js';
// ───────────────────────────────────────────────────────────────
// 2. CONFIGURATION
// ───────────────────────────────────────────────────────────────
/** Threshold above which memories are merged (near-duplicates) */
const MERGE_THRESHOLD = 0.88;
/** Threshold above which memories are in conflict (supersede) */
const CONFLICT_THRESHOLD = 0.75;
/** Maximum number of similar memories to check */
const SIMILAR_MEMORY_LIMIT = 3;
// ───────────────────────────────────────────────────────────────
// 3. FEATURE FLAG
// ───────────────────────────────────────────────────────────────
// Reconsolidation gate — canonical implementation in search-flags.ts.
// Default: ON (graduated). Set SPECKIT_RECONSOLIDATION=false to disable.
import { isReconsolidationEnabled } from '../search/search-flags.js';
export { isReconsolidationEnabled };
// ───────────────────────────────────────────────────────────────
// 4. SIMILARITY SEARCH
// ───────────────────────────────────────────────────────────────
/**
 * Find the top-N most similar memories in a spec folder.
 *
 * @param embedding - The embedding vector to compare against
 * @param specFolder - The spec folder to search within
 * @param findSimilar - Callback to find similar memories by embedding
 * @param limit - Maximum number of results (default: 3)
 * @returns Array of similar memories sorted by similarity DESC
 */
export function findSimilarMemories(embedding, specFolder, findSimilar, limit = SIMILAR_MEMORY_LIMIT) {
    try {
        return findSimilar(embedding, { limit, specFolder });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn('[reconsolidation] findSimilarMemories error:', message);
        return [];
    }
}
// ───────────────────────────────────────────────────────────────
// 5. ACTION DETERMINATION
// ───────────────────────────────────────────────────────────────
/**
 * Determine the reconsolidation action based on similarity score.
 *
 * @param similarity - Cosine similarity between new and existing memory
 * @returns The action to take: 'merge', 'conflict', or 'complement'
 */
export function determineAction(similarity) {
    if (similarity >= MERGE_THRESHOLD) {
        return 'merge';
    }
    if (similarity >= CONFLICT_THRESHOLD) {
        return 'conflict';
    }
    return 'complement';
}
// ───────────────────────────────────────────────────────────────
// 6. MERGE OPERATION
// ───────────────────────────────────────────────────────────────
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
export async function executeMerge(existingMemory, newMemory, db, generateEmbedding) {
    const newContent = newMemory.content;
    let newId = 0;
    let bm25RepairWarning = null;
    try {
        const memoryIndexColumns = getTableColumns(db, 'memory_index');
        ensureBm25RepairFlagColumn(db, memoryIndexColumns);
        const existingRow = db.prepare('SELECT * FROM memory_index WHERE id = ?').get(existingMemory.id);
        if (!existingRow || isArchivedRow(existingRow)) {
            return buildMergeAbortResult(existingMemory, newMemory, 'predecessor_gone');
        }
        const predecessorVersion = capturePredecessorVersion(existingRow);
        const existingContent = getOptionalString(existingRow, 'content_text') ?? '';
        const mergedContent = mergeContent(existingContent, newContent);
        const mergedHash = createHash('sha256').update(mergedContent, 'utf-8').digest('hex');
        const currentWeight = getOptionalNumber(existingRow, 'importance_weight') ?? existingMemory.importance_weight ?? 0.5;
        const boostedWeight = Math.min(1.0, currentWeight + 0.1);
        const now = new Date().toISOString();
        // Generate embedding BEFORE transaction (async I/O cannot run inside
        // Better-sqlite3's synchronous transaction callback).
        let newEmbedding = null;
        if (generateEmbedding) {
            try {
                newEmbedding = await generateEmbedding(mergedContent);
            }
            catch (embErr) {
                const msg = embErr instanceof Error ? embErr.message : String(embErr);
                console.warn('[reconsolidation] Failed to regenerate embedding for merge:', msg);
                // Non-fatal: merged content is stored even without updated embedding
            }
        }
        let bm25RepairNeeded = false;
        let mergedBm25DocumentText = '';
        // F04-001: Append-only merge — mark old as superseded, create new record
        const txResult = db.transaction(() => {
            const currentRow = db.prepare('SELECT * FROM memory_index WHERE id = ?').get(existingMemory.id);
            if (!currentRow || isArchivedRow(currentRow)) {
                return { status: 'predecessor_gone' };
            }
            if (hasPredecessorChanged(predecessorVersion, currentRow)) {
                return { status: 'predecessor_changed' };
            }
            const currentFilePath = getOptionalString(currentRow, 'file_path') ?? existingMemory.file_path;
            const reusedEmbeddingRow = db.prepare(`
        SELECT embedding
        FROM vec_memories
        WHERE rowid = ?
      `).get(existingMemory.id);
            const mergedEmbeddingBuffer = newEmbedding
                ? embeddingToBuffer(newEmbedding)
                : (reusedEmbeddingRow?.embedding ?? null);
            const mergedEmbeddingStatus = mergedEmbeddingBuffer ? 'success' : getOptionalString(currentRow, 'embedding_status') ?? 'pending';
            const mergedCanonicalPath = getOptionalString(currentRow, 'canonical_file_path') ?? getCanonicalPathKey(currentFilePath);
            const mergedTriggerPhrases = buildMergedTriggerPhrases(currentRow, newMemory.triggerPhrases);
            const mergedTitle = newMemory.title ?? getOptionalString(currentRow, 'title') ?? existingMemory.title ?? '';
            const mergedImportanceTier = newMemory.importanceTier ?? getOptionalString(currentRow, 'importance_tier');
            mergedBm25DocumentText = bm25Index.buildBm25DocumentText({
                title: mergedTitle,
                content_text: mergedContent,
                trigger_phrases: mergedTriggerPhrases,
                file_path: currentFilePath,
            });
            // Mark existing memory as archived (superseded)
            db.prepare(`
        UPDATE memory_index
        SET is_archived = 1,
            updated_at = datetime('now')
        WHERE id = ?
      `).run(existingMemory.id);
            const insertValues = buildMergedMemoryInsertValues(currentRow, {
                spec_folder: existingMemory.spec_folder,
                file_path: currentFilePath,
                canonical_file_path: mergedCanonicalPath,
                anchor_id: getOptionalString(currentRow, 'anchor_id'),
                title: mergedTitle,
                trigger_phrases: mergedTriggerPhrases,
                importance_weight: boostedWeight,
                importance_tier: mergedImportanceTier,
                content_text: mergedContent,
                content_hash: mergedHash,
                embedding_status: mergedEmbeddingStatus,
                embedding_model: getOptionalString(currentRow, 'embedding_model'),
                embedding_generated_at: mergedEmbeddingBuffer ? now : getOptionalString(currentRow, 'embedding_generated_at'),
                encoding_intent: getOptionalString(currentRow, 'encoding_intent'),
                document_type: getOptionalString(currentRow, 'document_type'),
                spec_level: getOptionalNumber(currentRow, 'spec_level'),
                bm25_repair_needed: 0,
                created_at: now,
                updated_at: now,
            }, memoryIndexColumns);
            const insertColumns = Object.keys(insertValues);
            const insertSql = `
        INSERT INTO memory_index (${insertColumns.join(', ')})
        VALUES (${insertColumns.map(() => '?').join(', ')})
      `;
            const insertResult = db.prepare(insertSql).run(...insertColumns.map((column) => insertValues[column]));
            newId = Number(insertResult.lastInsertRowid);
            if (mergedEmbeddingBuffer) {
                db.prepare(`
          INSERT INTO vec_memories (rowid, embedding)
          VALUES (?, ?)
        `).run(newId, mergedEmbeddingBuffer);
            }
            const postInsertMetadata = buildMergePostInsertMetadata(currentRow, {
                content_hash: mergedHash,
                importance_tier: mergedImportanceTier,
                embedding_status: mergedEmbeddingStatus,
                document_type: getOptionalString(currentRow, 'document_type'),
                spec_level: getOptionalNumber(currentRow, 'spec_level'),
            }, memoryIndexColumns);
            if (Object.keys(postInsertMetadata).length > 0) {
                applyPostInsertMetadata(db, newId, postInsertMetadata);
            }
            // Create supersedes causal edge
            db.prepare(`
        INSERT OR IGNORE INTO causal_edges (source_id, target_id, relation, strength, extracted_at)
        VALUES (?, ?, 'supersedes', 1.0, datetime('now'))
      `).run(newId, existingMemory.id);
            recordLineageTransition(db, newId, {
                actor: 'mcp:reconsolidation',
                predecessorMemoryId: existingMemory.id,
                transitionEvent: 'SUPERSEDE',
            });
            if (bm25Index.isBm25Enabled()) {
                try {
                    const bm25 = bm25Index.getIndex();
                    bm25.removeDocument(String(existingMemory.id));
                    bm25.addDocument(String(newId), mergedBm25DocumentText);
                }
                catch (bm25Err) {
                    const message = bm25Err instanceof Error ? bm25Err.message : String(bm25Err);
                    console.warn('[reconsolidation] Failed to update BM25 index for merge:', message);
                    bm25RepairNeeded = true;
                }
            }
            refresh_interference_scores_for_folder(db, existingMemory.spec_folder);
            clear_search_cache();
            try {
                recordHistory(newId, 'ADD', null, mergedTitle || existingMemory.file_path, 'mcp:reconsolidation');
                recordHistory(existingMemory.id, 'UPDATE', existingMemory.title ?? existingMemory.file_path, mergedTitle || existingMemory.file_path, 'mcp:reconsolidation');
            }
            catch (_historyErr) {
                // Best-effort history tracking during reconsolidation merge
            }
            return { status: 'merged' };
        })();
        if (txResult.status !== 'merged') {
            return buildMergeAbortResult(existingMemory, newMemory, txResult.status);
        }
        if (bm25RepairNeeded) {
            const repairResult = repairBm25Document({
                previousMemoryId: existingMemory.id,
                memoryId: newId,
                documentText: mergedBm25DocumentText,
            });
            if (!repairResult.success) {
                setBm25RepairNeededFlag(db, memoryIndexColumns, newId, true);
                bm25RepairWarning =
                    `BM25 repair failed after reconsolidation merge for memory ${newId}: ${repairResult.error}`;
            }
            else {
                setBm25RepairNeededFlag(db, memoryIndexColumns, newId, false);
            }
        }
        return {
            action: 'merge',
            existingMemoryId: existingMemory.id,
            newMemoryId: newId,
            importanceWeight: boostedWeight,
            mergedContentLength: mergedContent.length,
            similarity: existingMemory.similarity,
            warnings: bm25RepairWarning ? [bm25RepairWarning] : undefined,
        };
    }
    catch (err) {
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
export function mergeContent(existing, incoming) {
    if (!existing || existing.trim().length === 0) {
        return incoming;
    }
    if (!incoming || incoming.trim().length === 0) {
        return existing;
    }
    const existingLines = new Set(existing.split('\n').map(line => line.trim()).filter(line => line.length > 0));
    const newLines = incoming
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !existingLines.has(line));
    if (newLines.length === 0) {
        return existing;
    }
    return existing + '\n\n<!-- Merged content -->\n' + newLines.join('\n');
}
// ───────────────────────────────────────────────────────────────
// 7. CONFLICT OPERATION
// ───────────────────────────────────────────────────────────────
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
export function executeConflict(existingMemory, newMemory, db) {
    try {
        // Add causal 'supersedes' edge only when caller provides a distinct new ID.
        // Prevent self-referential supersedes edges (source == target).
        let edgeId = null;
        const hasDistinctNewId = typeof newMemory.id === 'number' &&
            Number.isFinite(newMemory.id) &&
            newMemory.id !== existingMemory.id;
        if (hasDistinctNewId) {
            // Atomic transaction: deprecate + edge must succeed or fail together.
            // Without this, a failed insertEdge leaves an orphaned deprecation.
            db.transaction(() => {
                const updateResult = db.prepare(`
          UPDATE memory_index
          SET importance_tier = 'deprecated',
              updated_at = datetime('now')
          WHERE id = ?
        `).run(existingMemory.id);
                if (updateResult.changes === 0) {
                    console.warn('[reconsolidation] Deprecate target not found, skipping edge insert');
                    return;
                }
                const sourceId = String(newMemory.id);
                const targetId = String(existingMemory.id);
                edgeId = causalEdges.insertEdge(sourceId, targetId, 'supersedes', 1.0, `TM-06 reconsolidation conflict: similarity ${(existingMemory.similarity * 100).toFixed(1)}%`);
                if (edgeId == null) {
                    throw new Error(`Failed to insert supersedes edge (${sourceId} -> ${targetId}) — aborting reconsolidation`);
                }
            })();
        }
        else {
            // Atomic transaction: content + embedding + hash update together.
            const updatedHash = createHash('sha256').update(newMemory.content, 'utf-8').digest('hex');
            db.transaction(() => {
                db.prepare(`
          UPDATE memory_index
          SET content_text = ?,
              title = ?,
              content_hash = ?,
              updated_at = datetime('now')
          WHERE id = ?
        `).run(newMemory.content, newMemory.title, updatedHash, existingMemory.id);
                if (newMemory.embedding) {
                    const buffer = embeddingToBuffer(newMemory.embedding);
                    db.prepare('UPDATE vec_memories SET embedding = ? WHERE rowid = ?').run(buffer, existingMemory.id);
                }
            })();
        }
        return {
            action: 'conflict',
            existingMemoryId: existingMemory.id,
            newMemoryId: newMemory.id ?? existingMemory.id,
            causalEdgeId: edgeId,
            similarity: existingMemory.similarity,
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`Conflict operation failed: ${message}`);
    }
}
// ───────────────────────────────────────────────────────────────
// 8. COMPLEMENT OPERATION
// ───────────────────────────────────────────────────────────────
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
export function executeComplement(newMemory, storeMemory, topSimilarity) {
    const newMemoryId = storeMemory(newMemory);
    return {
        action: 'complement',
        newMemoryId,
        similarity: topSimilarity,
    };
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
export async function reconsolidate(newMemory, db, options) {
    if (!isReconsolidationEnabled()) {
        return null;
    }
    const { findSimilar, storeMemory, generateEmbedding } = options;
    // Step 1: Find similar memories
    const similarMemories = findSimilarMemories(newMemory.embedding, newMemory.specFolder, findSimilar);
    // No existing memories: complement (new)
    if (similarMemories.length === 0) {
        // Do not persist in orchestrator complement path.
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
                // F04-002: Wrap store + conflict in single transaction for atomicity
                // TM-06 live-save path: materialize memory + supersede edge together
                try {
                    const conflictTx = db.transaction(() => {
                        if (conflictMemory.id === undefined) {
                            const storedId = storeMemory(newMemory);
                            if (typeof storedId === 'number' &&
                                Number.isFinite(storedId) &&
                                storedId > 0 &&
                                storedId !== topMatch.id) {
                                conflictMemory = { ...newMemory, id: storedId };
                            }
                        }
                        return executeConflict(topMatch, conflictMemory, db);
                    });
                    return conflictTx();
                }
                catch (conflictErr) {
                    // If storeMemory succeeded but executeConflict failed, clean up the orphan
                    // Memory so we don't leave dangling rows with no supersedes edge.
                    if (conflictMemory.id !== undefined && conflictMemory.id !== newMemory.id) {
                        // Graph cleanup: Use delete_memory_from_database (includes deleteAncillaryMemoryRows)
                        // instead of raw DELETE to clean lineage, projections, and graph residue.
                        try {
                            const deleted = delete_memory_from_database(db, conflictMemory.id);
                            if (deleted) {
                                try {
                                    recordHistory(conflictMemory.id, 'DELETE', null, null, 'mcp:reconsolidation_cleanup', conflictMemory.specFolder ?? null);
                                }
                                catch (_histErr) { /* best-effort */ }
                            }
                        }
                        catch (_error) {
                            // Best-effort cleanup
                        }
                        console.warn('[reconsolidation] cleaned up orphan memory', conflictMemory.id, 'after executeConflict failure');
                    }
                    throw conflictErr;
                }
            }
        case 'complement':
            // Complement is a routing decision only; caller persists once.
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
// ───────────────────────────────────────────────────────────────
// 10. HELPERS
// ───────────────────────────────────────────────────────────────
/**
 * Convert an embedding array to a Buffer for SQLite storage.
 *
 * @param embedding - The embedding as Float32Array or number[]
 * @returns Buffer representation of the embedding
 */
function embeddingToBuffer(embedding) {
    if (embedding instanceof Float32Array) {
        return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
    }
    return Buffer.from(new Float32Array(embedding).buffer);
}
function repairBm25Document(args) {
    if (!bm25Index.isBm25Enabled()) {
        return { success: true };
    }
    try {
        const bm25 = bm25Index.getIndex();
        if (typeof args.previousMemoryId === 'number') {
            bm25.removeDocument(String(args.previousMemoryId));
        }
        bm25.removeDocument(String(args.memoryId));
        bm25.addDocument(String(args.memoryId), args.documentText);
        return { success: true };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn('[reconsolidation] Immediate BM25 repair failed:', message);
        return {
            success: false,
            error: message,
        };
    }
}
function getTableColumns(db, tableName) {
    const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
    return new Set(rows.map((row) => row.name).filter((name) => typeof name === 'string'));
}
function ensureBm25RepairFlagColumn(db, tableColumns) {
    if (tableColumns.has('bm25_repair_needed')) {
        return;
    }
    try {
        db.exec('ALTER TABLE memory_index ADD COLUMN bm25_repair_needed INTEGER DEFAULT 0');
        tableColumns.add('bm25_repair_needed');
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.toLowerCase().includes('duplicate column')) {
            tableColumns.add('bm25_repair_needed');
            return;
        }
        console.warn('[reconsolidation] Failed to ensure bm25_repair_needed column:', message);
    }
}
function setBm25RepairNeededFlag(db, tableColumns, memoryId, repairNeeded) {
    if (!tableColumns.has('bm25_repair_needed')) {
        return;
    }
    try {
        db.prepare(`
      UPDATE memory_index
      SET bm25_repair_needed = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(repairNeeded ? 1 : 0, memoryId);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[reconsolidation] Failed to persist bm25_repair_needed=${repairNeeded ? 1 : 0} for memory ${memoryId}: ${message}`);
    }
}
function getOptionalString(row, key) {
    const value = row[key];
    return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}
function getOptionalNumber(row, key) {
    const value = row[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}
function capturePredecessorVersion(row) {
    return {
        contentHash: getOptionalString(row, 'content_hash') ?? null,
        updatedAt: getOptionalString(row, 'updated_at') ?? null,
    };
}
function hasPredecessorChanged(snapshot, currentRow) {
    return snapshot.contentHash !== (getOptionalString(currentRow, 'content_hash') ?? null)
        || snapshot.updatedAt !== (getOptionalString(currentRow, 'updated_at') ?? null);
}
function isArchivedRow(row) {
    const value = row.is_archived;
    return value === 1 || value === true;
}
function buildMergeAbortResult(existingMemory, newMemory, status) {
    return {
        action: 'complement',
        status,
        existingMemoryId: existingMemory.id,
        newMemoryId: newMemory.id ?? 0,
        similarity: existingMemory.similarity,
    };
}
function buildMergedTriggerPhrases(existingRow, triggerPhrases) {
    if (Array.isArray(triggerPhrases)) {
        return JSON.stringify(triggerPhrases);
    }
    const existingValue = existingRow.trigger_phrases;
    return typeof existingValue === 'string' ? existingValue : JSON.stringify([]);
}
function buildMergedMemoryInsertValues(existingRow, preferredValues, tableColumns) {
    const insertValues = {};
    for (const column of tableColumns) {
        if (column === 'id') {
            continue;
        }
        if (Object.prototype.hasOwnProperty.call(preferredValues, column)) {
            const value = preferredValues[column];
            if (value !== undefined) {
                insertValues[column] = value;
            }
            continue;
        }
        if (Object.prototype.hasOwnProperty.call(existingRow, column)) {
            const value = existingRow[column];
            if (value !== undefined) {
                insertValues[column] = value;
            }
        }
    }
    return insertValues;
}
function buildMergePostInsertMetadata(existingRow, preferredFields, tableColumns) {
    const metadata = {};
    const fallbackFields = {
        content_hash: existingRow.content_hash,
        context_type: existingRow.context_type,
        importance_tier: existingRow.importance_tier,
        memory_type: existingRow.memory_type,
        type_inference_source: existingRow.type_inference_source,
        stability: existingRow.stability,
        difficulty: existingRow.difficulty,
        review_count: existingRow.review_count,
        file_mtime_ms: existingRow.file_mtime_ms,
        embedding_status: existingRow.embedding_status,
        encoding_intent: existingRow.encoding_intent,
        document_type: existingRow.document_type,
        spec_level: existingRow.spec_level,
        quality_score: existingRow.quality_score,
        quality_flags: existingRow.quality_flags,
        parent_id: existingRow.parent_id,
        chunk_index: existingRow.chunk_index,
        chunk_label: existingRow.chunk_label,
        tenant_id: existingRow.tenant_id,
        user_id: existingRow.user_id,
        agent_id: existingRow.agent_id,
        session_id: existingRow.session_id,
        shared_space_id: existingRow.shared_space_id,
        provenance_source: existingRow.provenance_source,
        provenance_actor: existingRow.provenance_actor,
        governed_at: existingRow.governed_at,
        retention_policy: existingRow.retention_policy,
        delete_after: existingRow.delete_after,
        governance_metadata: existingRow.governance_metadata,
    };
    for (const key of Object.keys(fallbackFields)) {
        if (!tableColumns.has(key)) {
            continue;
        }
        const value = preferredFields[key] ?? fallbackFields[key];
        if (value !== undefined) {
            metadata[key] = value;
        }
    }
    return metadata;
}
/* ───────────────────────────────────────────────────────────────
   11. EXPORTS (constants for testing)
   ──────────────────────────────────────────────────────────────── */
export { MERGE_THRESHOLD, CONFLICT_THRESHOLD, SIMILAR_MEMORY_LIMIT, };
//# sourceMappingURL=reconsolidation.js.map