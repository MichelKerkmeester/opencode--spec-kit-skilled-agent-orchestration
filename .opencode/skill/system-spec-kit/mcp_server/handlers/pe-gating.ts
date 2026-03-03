// ---------------------------------------------------------------
// MODULE: Prediction Error Gating Helpers
// ---------------------------------------------------------------

import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../lib/search/vector-index';
import * as predictionErrorGate from '../lib/cache/cognitive/prediction-error-gate';
import * as fsrsScheduler from '../lib/cache/cognitive/fsrs-scheduler';
import * as incrementalIndex from '../lib/storage/incremental-index';
import { classifyEncodingIntent } from '../lib/search/encoding-intent';
import { isEncodingIntentEnabled } from '../lib/search/search-flags';
import { requireDb, toErrorMessage } from '../utils';
import { detectSpecLevelFromParsed } from './causal-links-processor';

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

interface PeDecision {
  action: string;
  similarity: number;
  existingMemoryId?: number | null;
  reason?: string;
  contradiction?: { detected: boolean; type: string | null; description: string | null; confidence: number } | null;
}

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

/**
 * Calculate importance weight based on file path and document type.
 * Spec 126: Applies document-type-aware weighting.
 *
 * Weights: constitutional -> 1.0, spec/decision-record -> 0.8, plan -> 0.7,
 * tasks/impl-summary/research -> 0.6, checklist/handover -> 0.5,
 * memory -> 0.5, scratch -> 0.25
 */
function calculateDocumentWeight(filePath: string, documentType?: string): number {
  // If documentType is provided, use it directly
  if (documentType) {
    const DOC_TYPE_WEIGHTS: Record<string, number> = {
      spec: 0.8,
      decision_record: 0.8,
      plan: 0.7,
      tasks: 0.6,
      implementation_summary: 0.6,
      research: 0.6,
      checklist: 0.5,
      handover: 0.5,
      constitutional: 1.0,
      memory: 0.5,
      scratch: 0.25,
    };
    const weight = DOC_TYPE_WEIGHTS[documentType];
    if (weight !== undefined) return weight;
  }

  // Fallback: path-based heuristic (backward compatibility)
  const normalizedPath = filePath.replace(/\\/g, '/');
  if (normalizedPath.includes('/scratch/')) return 0.25;
  return 0.5;
}

/** Spec 126: True for structural spec documents (not memory/constitutional). */
function isSpecDocumentType(documentType?: string): boolean {
  return !!documentType && documentType !== 'memory' && documentType !== 'constitutional';
}

/** Find memories with similar embeddings for PE gating deduplication */
function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null } = {}): SimilarMemory[] {
  const { limit = 5, specFolder = null } = options;

  if (!embedding) {
    return [];
  }

  try {
    const results = vectorIndex.vectorSearch(embedding, {
      limit: limit,
      specFolder: specFolder,
      minSimilarity: 50,
      includeConstitutional: false
    });

    return results.map((r: Record<string, unknown>) => ({
      id: r.id as number,
      similarity: (r.similarity as number) / 100,
      content: (r.content as string) || '',
      stability: (r.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY,
      difficulty: (r.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
      file_path: r.file_path as string
    }));
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

    // Spec 126: Keep document-type-aware weighting on reinforcement
    const importanceWeight = calculateDocumentWeight(parsed.filePath, parsed.documentType);

    // AI-TRACE:P4-05 FIX: Check result.changes to detect no-op updates (e.g., deleted memory)
    const updateResult = database.prepare(`
      UPDATE memory_index
      SET stability = ?,
          importance_weight = ?,
          content_text = COALESCE(content_text, ?),
          last_review = datetime('now'),
          review_count = COALESCE(review_count, 0) + 1,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(newStability, importanceWeight, parsed.content, memoryId);

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

    console.info(`[PE-Gate] Memory ${memoryId} marked as superseded`);
    return true;
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn('[PE-Gate] Failed to mark memory as superseded:', message);
    return false;
  }
}

/** Update an existing memory's content, embedding, and metadata in-place */
function updateExistingMemory(memoryId: number, parsed: ParsedMemory, embedding: Float32Array): IndexResult {
  const database = requireDb();

  // Spec 126: Keep document-type-aware weighting and metadata on update
  const importanceWeight = calculateDocumentWeight(parsed.filePath, parsed.documentType);
  const specLevel = isSpecDocumentType(parsed.documentType)
    ? detectSpecLevelFromParsed(parsed.filePath)
    : null;

  vectorIndex.updateMemory({
    id: memoryId,
    title: parsed.title ?? undefined,
    triggerPhrases: parsed.triggerPhrases,
    importanceWeight,
    embedding: embedding,
    encodingIntent: isEncodingIntentEnabled() ? classifyEncodingIntent(parsed.content) : undefined,
    documentType: parsed.documentType || 'memory',
    specLevel,
    contentText: parsed.content,
    qualityScore: parsed.qualityScore,
    qualityFlags: parsed.qualityFlags,
  });

  const fileMetadata = incrementalIndex.getFileMetadata(parsed.filePath);
  const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

  const updateResult = database.prepare(`
    UPDATE memory_index
    SET content_hash = ?,
        context_type = ?,
        importance_tier = ?,
        importance_weight = ?,
        last_review = datetime('now'),
        review_count = COALESCE(review_count, 0) + 1,
        updated_at = datetime('now'),
        file_mtime_ms = ?,
        document_type = ?,
        spec_level = ?,
        content_text = ?,
        quality_score = ?,
        quality_flags = ?
    WHERE id = ?
  `).run(
    parsed.contentHash,
    parsed.contextType,
    parsed.importanceTier,
    importanceWeight,
    fileMtimeMs,
    parsed.documentType || 'memory',
    specLevel,
    parsed.content,
    parsed.qualityScore ?? 0,
    JSON.stringify(parsed.qualityFlags ?? []),
    memoryId
  );

  if ((updateResult as { changes: number }).changes === 0) {
    return {
      status: 'error',
      id: memoryId,
      specFolder: parsed.specFolder,
      title: parsed.title,
      error: `Memory ${memoryId} not found in memory_index, update had no effect`,
    };
  }

  return {
    status: 'updated',
    id: memoryId,
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
  calculateDocumentWeight,
  isSpecDocumentType,
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
