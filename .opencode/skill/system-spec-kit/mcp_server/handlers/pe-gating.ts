// ───────────────────────────────────────────────────────────────
// MODULE: Prediction Error Gating Helpers
// ───────────────────────────────────────────────────────────────
import * as vectorIndex from '../lib/search/vector-index.js';
import * as fsrsScheduler from '../lib/cognitive/fsrs-scheduler.js';
import * as incrementalIndex from '../lib/storage/incremental-index.js';
import { recordHistory } from '../lib/storage/history.js';
import { recordLineageTransition } from '../lib/storage/lineage-state.js';
import { classifyEncodingIntent } from '../lib/search/encoding-intent.js';
import { isEncodingIntentEnabled } from '../lib/search/search-flags.js';
import { calculateDocumentWeight, isSpecDocumentType } from '../lib/storage/document-helpers.js';
import { applyPostInsertMetadata } from '../lib/storage/post-insert-metadata.js';
import { detectSpecLevelFromParsed } from '../lib/spec/spec-level.js';
import { requireDb, toErrorMessage } from '../utils/index.js';

// Feature catalog: Prediction-error save arbitration
// Feature catalog: Memory indexing (memory_save)

export { calculateDocumentWeight, isSpecDocumentType } from '../lib/storage/document-helpers.js';


interface ParsedMemory {
  specFolder: string;
  filePath: string;
  title: string | null;
  triggerPhrases: string[];
  content: string;
  contentHash: string;
  contextType: string;
  importanceTier: string;
  documentType?: string;
  qualityScore?: number;
  qualityFlags?: string[];
}

interface SimilarMemory {
  id: number;
  similarity: number;
  content: string;
  stability: number;
  difficulty: number;
  file_path: string;
  [key: string]: unknown;
}

import type { PeDecision } from './save/types.js';

interface IndexResult extends Record<string, unknown> {
  status: string;
  id: number;
  specFolder: string;
  title: string | null;
  triggerPhrases?: string[];
  contextType?: string;
  importanceTier?: string;
  previous_stability?: number;
  newStability?: number;
  retrievability?: number;
  success?: boolean;
  error?: string;
}

/** Find memories with similar embeddings for PE gating deduplication */
function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null } = {}): SimilarMemory[] {
  const { limit = 5, specFolder = null, tenantId = null, userId = null, agentId = null, sessionId = null, sharedSpaceId = null } = options;

  if (!embedding) {
    return [];
  }

  const matchesScopedValue = (expected: string | null, actual: unknown): boolean => {
    if (!expected) {
      return true;
    }
    return typeof actual === 'string' && actual === expected;
  };

  try {
    const scopedMatches: SimilarMemory[] = [];
    const seenCandidateIds = new Set<number>();
    const seenScopedIds = new Set<number>();
    let fetchLimit = Math.max(limit * 3, limit);

    while (scopedMatches.length < limit) {
      const previousCandidateCount = seenCandidateIds.size;
      const results = vectorIndex.vectorSearch(embedding, {
        limit: fetchLimit,
        specFolder: specFolder,
        minSimilarity: 50,
        includeConstitutional: false
      });

      for (const r of results) {
        if (typeof r.id === 'number') {
          seenCandidateIds.add(r.id);
        }

        if (!matchesScopedValue(tenantId, r.tenant_id)) continue;
        if (!matchesScopedValue(userId, r.user_id)) continue;
        if (!matchesScopedValue(agentId, r.agent_id)) continue;
        // H9 FIX: Filter by sessionId to prevent false duplicate/supersede decisions across sessions
        if (!matchesScopedValue(sessionId, r.session_id)) continue;
        if (!matchesScopedValue(sharedSpaceId, r.shared_space_id)) continue;
        if (typeof r.id === 'number' && seenScopedIds.has(r.id)) continue;

        const rawSim = typeof r.similarity === 'number' ? r.similarity / 100 : 0;
        scopedMatches.push({
          id: r.id as number,
          similarity: Number.isFinite(rawSim) ? Math.min(1, Math.max(0, rawSim)) : 0,
          content: (r.content_text as string) || (r.content as string) || '',
          stability: (r.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY,
          difficulty: (r.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
          file_path: r.file_path as string,
        });

        if (typeof r.id === 'number') {
          seenScopedIds.add(r.id);
        }

        if (scopedMatches.length >= limit) {
          break;
        }
      }

      const candidatesExhausted = results.length < fetchLimit;
      const sawNewCandidates = seenCandidateIds.size > previousCandidateCount;
      if (candidatesExhausted || !sawNewCandidates) {
        break;
      }

      fetchLimit *= 2;
    }

    return scopedMatches.slice(0, limit);
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn('[PE-Gate] Vector search failed:', message);
    return [];
  }
}

/** Reinforce an existing memory's stability via FSRS scheduling instead of creating a duplicate */
function reinforceExistingMemory(memoryId: number, parsed: ParsedMemory): IndexResult {
  const database = requireDb();

  try {
    const memory = database.prepare(`
      SELECT id, stability, difficulty, last_review, review_count, title
      FROM memory_index
      WHERE id = ?
    `).get(memoryId) as Record<string, unknown> | undefined;

    if (!memory) {
      throw new Error(`Memory ${memoryId} not found for reinforcement`);
    }

    const elapsedDays = fsrsScheduler.calculateElapsedDays(memory.last_review as string | null);
    const currentStability = (memory.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY;
    const currentDifficulty = (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY;
    const retrievability = fsrsScheduler.calculateRetrievability(currentStability, elapsedDays);

    const newStability = fsrsScheduler.updateStability(
      currentStability,
      currentDifficulty,
      fsrsScheduler.GRADE_GOOD,
      retrievability
    );

    // Keep document-type-aware weighting on reinforcement.
    const importanceWeight = calculateDocumentWeight(parsed.filePath, parsed.documentType);

    // P4-05 FIX: Check result.changes to detect no-op updates (e.g., deleted memory)
    const updateResult = database.prepare(`
      UPDATE memory_index
      SET stability = ?,
          importance_weight = ?,
          content_text = COALESCE(content_text, ?),
          content_hash = CASE WHEN content_text IS NULL THEN ? ELSE content_hash END,
          last_review = datetime('now'),
          review_count = COALESCE(review_count, 0) + 1,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(newStability, importanceWeight, parsed.content, parsed.contentHash, memoryId);

    if ((updateResult as { changes: number }).changes === 0) {
      throw new Error(`PE reinforcement UPDATE matched 0 rows for memory ${memoryId}`);
    }

    return {
      status: 'reinforced',
      id: memoryId,
      title: memory.title as string,
      specFolder: parsed.specFolder,
      previous_stability: currentStability,
      newStability: newStability,
      retrievability: retrievability
    };
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.error('[memory-save] PE reinforcement failed:', message);
    return { status: 'error', id: memoryId, title: '', specFolder: '', success: false, error: message };
  }
}

/** Mark a memory as superseded (deprecated) when a newer contradicting version is saved */
function markMemorySuperseded(memoryId: number): boolean {
  const database = requireDb();

  try {
    const result = database.prepare(`
      UPDATE memory_index
      SET importance_tier = 'deprecated',
          updated_at = datetime('now')
      WHERE id = ?
    `).run(memoryId);

    if ((result as { changes: number }).changes === 0) {
      console.warn(`[PE-Gate] Memory ${memoryId} not found, cannot mark as superseded`);
      return false;
    }

    console.error(`[PE-Gate] Memory ${memoryId} marked as superseded`);
    return true;
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn('[PE-Gate] Failed to mark memory as superseded:', message);
    return false;
  }
}

/** Append a new immutable version and advance the active projection. */
function updateExistingMemory(memoryId: number, parsed: ParsedMemory, embedding: Float32Array): IndexResult {
  const database = requireDb();

  // Keep document-type-aware weighting and metadata on update.
  const importanceWeight = calculateDocumentWeight(parsed.filePath, parsed.documentType);
  const specLevel = isSpecDocumentType(parsed.documentType)
    ? detectSpecLevelFromParsed(parsed.filePath)
    : null;
  const previous = database.prepare(`
    SELECT id, title
    FROM memory_index
    WHERE id = ?
  `).get(memoryId) as { id: number; title: string | null } | undefined;

  if (!previous) {
    return {
      status: 'error',
      id: memoryId,
      specFolder: parsed.specFolder,
      title: parsed.title,
      error: `Memory ${memoryId} not found in memory_index, update had no effect`,
    };
  }

  const fileMetadata = incrementalIndex.getFileMetadata(parsed.filePath);
  const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;
  const encodingIntent = isEncodingIntentEnabled() ? classifyEncodingIntent(parsed.content) : undefined;

  const appendVersion = database.transaction(() => {
    const nextMemoryId = vectorIndex.indexMemory({
      specFolder: parsed.specFolder,
      filePath: parsed.filePath,
      title: parsed.title,
      triggerPhrases: parsed.triggerPhrases,
      importanceWeight,
      embedding,
      encodingIntent,
      documentType: parsed.documentType || 'memory',
      specLevel,
      contentText: parsed.content,
      qualityScore: parsed.qualityScore,
      qualityFlags: parsed.qualityFlags,
      appendOnly: true,
    });

    applyPostInsertMetadata(database, nextMemoryId, {
      content_hash: parsed.contentHash,
      context_type: parsed.contextType,
      importance_tier: parsed.importanceTier,
      file_mtime_ms: fileMtimeMs,
      encoding_intent: encodingIntent,
      document_type: parsed.documentType || 'memory',
      spec_level: specLevel,
      quality_score: parsed.qualityScore ?? 0,
      quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
    });

    database.prepare(`
      UPDATE memory_index
      SET importance_tier = 'deprecated',
          updated_at = ?
      WHERE id = ?
    `).run(new Date().toISOString(), memoryId);

    recordLineageTransition(database, nextMemoryId, {
      actor: 'mcp:memory_save',
      predecessorMemoryId: memoryId,
      transitionEvent: 'UPDATE',
    });

    try {
      recordHistory(nextMemoryId, 'ADD', null, parsed.title ?? parsed.filePath, 'mcp:memory_save');
      recordHistory(memoryId, 'UPDATE', previous.title, parsed.title ?? parsed.filePath, 'mcp:memory_save');
    } catch (_histErr: unknown) {
      // History recording is best-effort during save
    }

    return nextMemoryId;
  });

  const nextMemoryId = appendVersion();
  return {
    status: 'updated',
    id: nextMemoryId,
    specFolder: parsed.specFolder,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier
  };
}

/** Log a prediction-error gating decision to the memory_conflicts table */
function logPeDecision(decision: PeDecision, contentHash: string, specFolder: string): void {
  const database = requireDb();

  try {
    const tableExists = database.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name='memory_conflicts'
    `).get();

    if (!tableExists) {
      console.warn('[PE-Gate] memory_conflicts table not yet created, skipping log');
      return;
    }

    database.prepare(`
      INSERT INTO memory_conflicts (
        new_memory_hash,
        existing_memory_id,
        similarity,
        action,
        contradiction_detected,
        reason,
        spec_folder
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      contentHash,
      decision.existingMemoryId ?? null,
      decision.similarity || 0,
      decision.action,
      decision.contradiction?.detected ? 1 : 0,
      decision.reason || '',
      specFolder
    );
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.error('[memory-save] Failed to log conflict:', message);
  }
}

export {
  findSimilarMemories,
  reinforceExistingMemory,
  markMemorySuperseded,
  updateExistingMemory,
  logPeDecision,
};

export type {
  SimilarMemory,
  PeDecision,
};
