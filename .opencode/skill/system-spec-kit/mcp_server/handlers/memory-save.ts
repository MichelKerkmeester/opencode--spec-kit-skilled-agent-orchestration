// ---------------------------------------------------------------
// MODULE: Memory Save Handler
// ---------------------------------------------------------------
/* --- 1. DEPENDENCIES --- */

// Node built-ins
import fs from 'fs';
import path from 'path';

// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';

// Third-party types
import type BetterSqlite3 from 'better-sqlite3';

// Internal modules
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core';
import { createFilePathValidator } from '../utils/validators';
import * as vectorIndex from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as memoryParser from '../lib/parsing/memory-parser';
import type { CausalLinks } from '../lib/parsing/memory-parser';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as bm25Index from '../lib/search/bm25-index';
import * as predictionErrorGate from '../lib/cache/cognitive/prediction-error-gate';
import * as fsrsScheduler from '../lib/cache/cognitive/fsrs-scheduler';
import * as transactionManager from '../lib/storage/transaction-manager';
import * as incrementalIndex from '../lib/storage/incremental-index';
import * as preflight from '../lib/validation/preflight';
import * as toolCache from '../lib/cache/tool-cache';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import * as retryManager from '../lib/providers/retry-manager';
import * as causalEdges from '../lib/storage/causal-edges';
import { runConsolidationCycleIfEnabled } from '../lib/storage/consolidation';
import { getCanonicalPathKey } from '../lib/utils/canonical-path';
import { requireDb, toErrorMessage } from '../utils';
import { needsChunking, chunkLargeFile } from '../lib/chunking/anchor-chunker';
import { thinChunks } from '../lib/chunking/chunk-thinning';
import type { MCPResponse } from './types';
import { clearConstitutionalCache } from '../hooks/memory-surface';

// Sprint 4: Quality gate + reconsolidation — all flag-gated, disabled by default
import { runQualityGate, isQualityGateEnabled } from '../lib/validation/save-quality-gate';
import { reconsolidate, isReconsolidationEnabled } from '../lib/storage/reconsolidation';
import type { ReconsolidationResult } from '../lib/storage/reconsolidation';
import { classifyEncodingIntent } from '../lib/search/encoding-intent';
import { isEncodingIntentEnabled, isSaveQualityGateEnabled, isReconsolidationEnabled as isReconsolidationFlagEnabled } from '../lib/search/search-flags';
import { initEvalDb } from '../lib/eval/eval-db';

import { getMemoryHashSnapshot, appendMutationLedgerSafe } from './memory-crud-utils';
import { lookupEmbedding, storeEmbedding, computeContentHash as cacheContentHash } from '../lib/cache/embedding-cache';
import { normalizeContentForEmbedding } from '../lib/parsing/content-normalizer';

// R10, R8, S5: Entity extraction, memory summaries, entity linking — default-ON via flags
import { isAutoEntitiesEnabled, isMemorySummariesEnabled, isEntityLinkingEnabled } from '../lib/search/search-flags';
import { extractEntities, filterEntities, storeEntities, updateEntityCatalog } from '../lib/extraction/entity-extractor';
import { generateAndStoreSummary } from '../lib/search/memory-summaries';
import { runEntityLinking } from '../lib/search/entity-linker';

// Create local path validator
const validateFilePathLocal = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);

/** Per-spec-folder save mutex to prevent concurrent indexing races (TOCTOU) */
const specFolderLocks = new Map<string, Promise<unknown>>();

async function withSpecFolderLock<T>(specFolder: string, fn: () => Promise<T>): Promise<T> {
  const normalizedFolder = specFolder || '__global__';
  const chain = (specFolderLocks.get(normalizedFolder) ?? Promise.resolve())
    .catch(() => {})
    .then(() => fn());
  specFolderLocks.set(normalizedFolder, chain);
  try {
    return await chain;
  } finally {
    if (specFolderLocks.get(normalizedFolder) === chain) {
      specFolderLocks.delete(normalizedFolder);
    }
  }
}

/* --- 2. TYPES --- */

interface ParsedMemory {
  specFolder: string;
  filePath: string;
  title: string | null;
  triggerPhrases: string[];
  content: string;
  contentHash: string;
  contextType: string;
  importanceTier: string;
  memoryType?: string;
  memoryTypeSource?: string;
  hasCausalLinks?: boolean;
  causalLinks?: CausalLinks;
  /** Spec 126: Document structural type (spec, plan, tasks, memory, etc.) */
  documentType?: string;
  qualityScore?: number;
  qualityFlags?: string[];
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
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
  memoryType?: string;
  memoryTypeSource?: string;
  embeddingStatus?: string;
  embeddingFailureReason?: string;
  warnings?: string[];
  pe_action?: string;
  pe_reason?: string;
  superseded_id?: number;
  related_ids?: number[];
  previous_stability?: number;
  newStability?: number;
  retrievability?: number;
  causalLinks?: Record<string, unknown>;
  message?: string;
  success?: boolean;
  error?: string;
  qualityScore?: number;
  qualityFlags?: string[];
}

interface CausalLinkMapping {
  relation: typeof causalEdges.RELATION_TYPES[keyof typeof causalEdges.RELATION_TYPES];
  reverse: boolean;
}

interface CausalLinksResult {
  processed: number;
  inserted: number;
  resolved: number;
  unresolved: { type: string; reference: string }[];
  errors: { type: string; reference: string; error: string }[];
}

interface AtomicSaveParams {
  file_path: string;
  content: string;
}

interface AtomicSaveOptions {
  force?: boolean;
}

interface AtomicSaveResult {
  success: boolean;
  filePath: string;
  error?: string;
}

interface SaveArgs {
  filePath: string;
  force?: boolean;
  dryRun?: boolean;
  skipPreflight?: boolean;
  asyncEmbedding?: boolean; // T306: When true, embedding generation is deferred (non-blocking)
}

/* --- 3. SQL HELPER FUNCTIONS --- */

/** Escape special SQL LIKE pattern characters (% and _) for safe queries */
function escapeLikePattern(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError(`escapeLikePattern expects string, got ${typeof str}`);
  }
  return str.replace(/%/g, '\\%').replace(/_/g, '\\_');
}

/**
 * TM-06 safety gate: verify a pre-reconsolidation checkpoint exists.
 * Accepts either exact name `pre-reconsolidation` or prefixed variants.
 */
function hasReconsolidationCheckpoint(database: BetterSqlite3.Database, specFolder: string): boolean {
  try {
    const tableExists = database.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='checkpoints'"
    ).get();

    if (!tableExists) {
      return false;
    }

    const row = database.prepare(`
      SELECT COUNT(*) AS count
      FROM checkpoints
      WHERE (name = 'pre-reconsolidation' OR name LIKE 'pre-reconsolidation-%')
        AND (spec_folder = ? OR spec_folder IS NULL OR spec_folder = '')
    `).get(specFolder) as { count?: number } | undefined;

    return (row?.count ?? 0) > 0;
  } catch {
    return false;
  }
}

/* --- 4. PE GATING HELPER FUNCTIONS --- */

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

    // P4-05 FIX: Check result.changes to detect no-op updates (e.g., deleted memory)
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

/* --- 5. CAUSAL LINKS PROCESSING --- */

const CAUSAL_LINK_MAPPINGS: Record<string, CausalLinkMapping> = {
  caused_by: { relation: causalEdges.RELATION_TYPES.CAUSED, reverse: true },
  supersedes: { relation: causalEdges.RELATION_TYPES.SUPERSEDES, reverse: false },
  derived_from: { relation: causalEdges.RELATION_TYPES.DERIVED_FROM, reverse: false },
  blocks: { relation: causalEdges.RELATION_TYPES.ENABLED, reverse: true },
  related_to: { relation: causalEdges.RELATION_TYPES.SUPPORTS, reverse: false }
};

/** Resolve a memory reference (ID, path, or title) to a numeric memory ID */
function resolveMemoryReference(database: BetterSqlite3.Database, reference: string): number | null {
  if (!reference || typeof reference !== 'string') {
    return null;
  }

  const trimmed = reference.trim();
  if (!trimmed) {
    return null;
  }

  const normalizedReference = trimmed.replace(/\\/g, '/');
  const normalizedLower = normalizedReference.toLowerCase();

  if (/^\d+$/.test(trimmed)) {
    const numericId = parseInt(trimmed, 10);
    const exists = database.prepare('SELECT id FROM memory_index WHERE id = ?').get(numericId);
    if (exists) {
      return numericId;
    }
  }

  if (normalizedLower.includes('session') || normalizedReference.match(/^\d{4}-\d{2}-\d{2}/)) {
    const bySession = database.prepare(`
      SELECT id FROM memory_index WHERE file_path LIKE ? ESCAPE '\\'
    `).get(`%${escapeLikePattern(normalizedReference)}%`) as Record<string, unknown> | undefined;
    if (bySession) {
      return bySession.id as number;
    }
  }

  if (normalizedLower.includes('specs/') || normalizedLower.includes('memory/')) {
    const byPath = database.prepare(`
      SELECT id FROM memory_index WHERE file_path LIKE ? ESCAPE '\\'
    `).get(`%${escapeLikePattern(normalizedReference)}%`) as Record<string, unknown> | undefined;
    if (byPath) {
      return byPath.id as number;
    }
  }

  const byTitleExact = database.prepare(`
    SELECT id FROM memory_index WHERE title = ?
  `).get(trimmed) as Record<string, unknown> | undefined;
  if (byTitleExact) {
    return byTitleExact.id as number;
  }

  const byTitlePartial = database.prepare(`
    SELECT id FROM memory_index WHERE title LIKE ? ESCAPE '\\'
  `).get(`%${escapeLikePattern(trimmed)}%`) as Record<string, unknown> | undefined;
  if (byTitlePartial) {
    return byTitlePartial.id as number;
  }

  return null;
}

/** Process causal link declarations from a memory file and insert edges into the graph */
function processCausalLinks(database: BetterSqlite3.Database, memoryId: number, causalLinks: CausalLinks): CausalLinksResult {
  const result: CausalLinksResult = {
    processed: 0,
    inserted: 0,
    resolved: 0,
    unresolved: [],
    errors: []
  };

  if (!causalLinks || typeof causalLinks !== 'object') {
    return result;
  }

  // Initialize causal-edges module with database connection
  causalEdges.init(database);

  const memoryIdStr = String(memoryId);

  for (const [link_type, references] of Object.entries(causalLinks)) {
    if (!Array.isArray(references) || references.length === 0) {
      continue;
    }

    const mapping = CAUSAL_LINK_MAPPINGS[link_type];
    if (!mapping) {
      console.warn(`[causal-links] Unknown link type: ${link_type}`);
      continue;
    }

    for (const reference of references) {
      result.processed++;

      const resolvedId = resolveMemoryReference(database, reference);

      if (!resolvedId) {
        result.unresolved.push({ type: link_type, reference });
        continue;
      }

      result.resolved++;

      const edgeSourceId = mapping.reverse ? String(resolvedId) : memoryIdStr;
      const edgeTargetId = mapping.reverse ? memoryIdStr : String(resolvedId);

      try {
        causalEdges.insertEdge(edgeSourceId, edgeTargetId, mapping.relation, 1.0, `Auto-extracted from ${link_type} in memory file`);
        result.inserted++;
        console.info(`[causal-links] Inserted edge: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        if (message.includes('UNIQUE constraint')) {
          console.info(`[causal-links] Edge already exists: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
        } else {
          result.errors.push({ type: link_type, reference, error: message });
          console.warn(`[causal-links] Failed to insert edge: ${message}`);
        }
      }
    }
  }

  return result;
}

/* --- 6. SPEC LEVEL DETECTION (Spec 126) --- */

/**
 * Detect spec documentation level for a file by checking its parent spec.md.
 * Delegates to the spec.md file in the same directory (or returns null).
 */
function detectSpecLevelFromParsed(filePath: string): number | null {
  const dir = path.dirname(filePath);
  const specMdPath = path.join(dir, 'spec.md');

  try {
    if (!fs.existsSync(specMdPath)) return null;

    // Read first 2KB for SPECKIT_LEVEL marker
    const fd = fs.openSync(specMdPath, 'r');
    let bytesRead = 0;
    const buffer = Buffer.alloc(2048);
    try {
      bytesRead = fs.readSync(fd, buffer, 0, 2048, 0);
    } finally {
      fs.closeSync(fd);
    }

    const header = buffer.toString('utf-8', 0, bytesRead);
    const levelMatch = header.match(/<!--\s*SPECKIT_LEVEL:\s*(\d\+?)\s*-->/i);
    if (levelMatch) {
      const levelStr = levelMatch[1];
      if (levelStr === '3+') return 4;
      const level = parseInt(levelStr, 10);
      if (level >= 1 && level <= 3) return level;
    }

    // Heuristic: check sibling files
    const siblings = fs.readdirSync(dir).map(f => f.toLowerCase());
    if (siblings.includes('decision-record.md')) return 3;
    if (siblings.includes('checklist.md')) return 2;
    return 1;
  } catch (_err: unknown) {
    // AI-GUARD: Spec level detection is best-effort; null signals unknown level to caller
    return null;
  }
}

/* --- 7. CHUNKED INDEXING FOR LARGE FILES --- */

/**
 * Index a large memory file by splitting it into chunks.
 * Creates a parent record (metadata only, no embedding) and child records
 * (each with its own embedding) for each chunk.
 *
 * Parent record: embedding_status='partial', content_text=summary
 * Child records: embedding_status='success'|'pending', parent_id=parent.id
 */
async function indexChunkedMemoryFile(
  filePath: string,
  parsed: ParsedMemory,
  { force = false }: { force?: boolean } = {}
): Promise<IndexResult> {
  const database = requireDb();
  const canonicalFilePath = getCanonicalPathKey(filePath);

  const chunkResult = chunkLargeFile(parsed.content);
  const thinningResult = thinChunks(chunkResult.chunks);
  const retainedChunks = thinningResult.retained;
  const droppedChunkCount = thinningResult.dropped.length;
  const parentEncodingIntent = isEncodingIntentEnabled()
    ? classifyEncodingIntent(parsed.content)
    : undefined;
  console.info(`[memory-save] Chunking ${filePath}: ${chunkResult.strategy} strategy, ${chunkResult.chunks.length} chunks`);
  if (droppedChunkCount > 0) {
    console.info(`[memory-save] Chunk thinning retained ${retainedChunks.length}/${chunkResult.chunks.length} chunks`);
  }

  // Wrap parent setup in transaction to prevent check-then-delete race condition
  const setupParent = database.transaction(() => {
    const existing = database.prepare(`
      SELECT id FROM memory_index
      WHERE spec_folder = ?
        AND parent_id IS NULL
        AND (canonical_file_path = ? OR file_path = ?)
      ORDER BY id DESC
      LIMIT 1
    `).get(parsed.specFolder, canonicalFilePath, filePath) as { id: number } | undefined;

    let pid: number;

    if (existing && !force) {
      pid = existing.id;

      // Delete existing children to re-index
      database.prepare(`DELETE FROM memory_index WHERE parent_id = ?`).run(pid);

      // Update parent metadata
      const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
      const specLevel = isSpecDocumentType(parsed.documentType)
        ? detectSpecLevelFromParsed(filePath)
        : null;
      const fileMetadata = incrementalIndex.getFileMetadata(filePath);
      const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

      database.prepare(`
        UPDATE memory_index
        SET content_hash = ?,
            context_type = ?,
            importance_tier = ?,
            importance_weight = ?,
            embedding_status = 'partial',
            encoding_intent = COALESCE(?, encoding_intent),
            content_text = ?,
            updated_at = datetime('now'),
            file_mtime_ms = ?,
            document_type = ?,
            spec_level = ?,
            quality_score = ?,
            quality_flags = ?
        WHERE id = ?
      `).run(
        parsed.contentHash,
        parsed.contextType,
        parsed.importanceTier,
        importanceWeight,
        parentEncodingIntent,
        chunkResult.parentSummary,
        fileMtimeMs,
        parsed.documentType || 'memory',
        specLevel,
        parsed.qualityScore ?? 0,
        JSON.stringify(parsed.qualityFlags ?? []),
        pid
      );

      return { parentId: pid, isUpdate: true };
    } else {
      // Delete old parent+children if force re-indexing
      if (existing && force) {
        database.prepare(`DELETE FROM memory_index WHERE parent_id = ?`).run(existing.id);
        database.prepare(`DELETE FROM memory_index WHERE id = ?`).run(existing.id);
      }

      // Create parent record (no embedding)
      const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
      const specLevel = isSpecDocumentType(parsed.documentType)
        ? detectSpecLevelFromParsed(filePath)
        : null;

      pid = vectorIndex.indexMemoryDeferred({
        specFolder: parsed.specFolder,
        filePath,
        title: parsed.title,
        triggerPhrases: parsed.triggerPhrases,
        importanceWeight,
        failureReason: 'Chunked parent: embedding in children',
        encodingIntent: parentEncodingIntent,
        documentType: parsed.documentType || 'memory',
        specLevel,
        contentText: chunkResult.parentSummary,
        qualityScore: parsed.qualityScore,
        qualityFlags: parsed.qualityFlags,
      });

      const fileMetadata = incrementalIndex.getFileMetadata(filePath);
      const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

      database.prepare(`
        UPDATE memory_index
        SET content_hash = ?,
            context_type = ?,
            importance_tier = ?,
            memory_type = ?,
            type_inference_source = ?,
            stability = ?,
            difficulty = ?,
            last_review = datetime('now'),
            review_count = 0,
            file_mtime_ms = ?,
            embedding_status = 'partial',
            quality_score = ?,
            quality_flags = ?
        WHERE id = ?
      `).run(
        parsed.contentHash,
        parsed.contextType,
        parsed.importanceTier,
        parsed.memoryType,
        parsed.memoryTypeSource,
        fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
        fileMtimeMs,
        parsed.qualityScore ?? 0,
        JSON.stringify(parsed.qualityFlags ?? []),
        pid
      );

      return { parentId: pid, isUpdate: false };
    }
  });

  const { parentId, isUpdate: existingParentUpdated } = setupParent();
  // Use existingParentUpdated below for mutation ledger (replaces `existing` variable)
  const existing = existingParentUpdated;

  // Index BM25 for parent with summary
  if (bm25Index.isBm25Enabled()) {
    try {
      const bm25 = bm25Index.getIndex();
      bm25.addDocument(String(parentId), chunkResult.parentSummary);
    } catch (bm25_err: unknown) {
      const message = toErrorMessage(bm25_err);
      console.warn(`[memory-save] BM25 indexing failed for parent: ${message}`);
    }
  }

  // Index each chunk as a child record
  let successCount = 0;
  let failedCount = 0;
  const childIds: number[] = [];
  const bm25FailedChunks: number[] = [];

  for (let i = 0; i < retainedChunks.length; i++) {
    const chunk = retainedChunks[i];
    const chunkTitle = `${parsed.title || 'Untitled'} [chunk ${i + 1}/${retainedChunks.length}]`;
    const chunkEncodingIntent = isEncodingIntentEnabled()
      ? classifyEncodingIntent(chunk.content)
      : undefined;

    try {
      // AI-WHY: Persistent embedding cache (REQ-S2-001) avoids re-calling the embedding
      // provider on re-index — content-hash keyed so unchanged chunks skip API entirely.
      let chunkEmbedding: Float32Array | null = null;
      let chunkEmbeddingStatus = 'pending';

      try {
        const chunkHash = cacheContentHash(chunk.content);
        const modelId = embeddings.getModelName();
        const cachedChunkBuf = lookupEmbedding(database, chunkHash, modelId);
        if (cachedChunkBuf) {
          chunkEmbedding = new Float32Array(new Uint8Array(cachedChunkBuf).buffer);
          chunkEmbeddingStatus = 'success';
        } else {
          chunkEmbedding = await embeddings.generateDocumentEmbedding(normalizeContentForEmbedding(chunk.content));
          if (chunkEmbedding) {
            chunkEmbeddingStatus = 'success';
            const chunkBuf = Buffer.from(chunkEmbedding.buffer, chunkEmbedding.byteOffset, chunkEmbedding.byteLength);
            storeEmbedding(database, chunkHash, modelId, chunkBuf, chunkEmbedding.length);
          }
        }
      } catch (embErr: unknown) {
        const message = toErrorMessage(embErr);
        console.warn(`[memory-save] Chunk ${i + 1} embedding failed: ${message}`);
      }

      let childId: number;
      const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);

      if (chunkEmbedding) {
        childId = vectorIndex.indexMemory({
          specFolder: parsed.specFolder,
          filePath,
          anchorId: chunk.label,
          title: chunkTitle,
          triggerPhrases: [],
          importanceWeight,
          embedding: chunkEmbedding,
          encodingIntent: chunkEncodingIntent,
          documentType: parsed.documentType || 'memory',
          contentText: chunk.content,
        });
      } else {
        childId = vectorIndex.indexMemoryDeferred({
          specFolder: parsed.specFolder,
          filePath,
          title: chunkTitle,
          triggerPhrases: [],
          importanceWeight,
          failureReason: 'Chunk embedding failed',
          encodingIntent: chunkEncodingIntent,
          documentType: parsed.documentType || 'memory',
          contentText: chunk.content,
        });
      }

      // Set parent_id, chunk_index, chunk_label on the child
      database.prepare(`
        UPDATE memory_index
        SET parent_id = ?,
            chunk_index = ?,
            chunk_label = ?,
            content_hash = ?,
            context_type = ?,
            importance_tier = ?,
            embedding_status = ?,
            encoding_intent = COALESCE(?, encoding_intent),
            stability = ?,
            difficulty = ?,
            last_review = datetime('now'),
            review_count = 0
        WHERE id = ?
      `).run(
        parentId,
        i,
        chunk.label,
        parsed.contentHash,
        parsed.contextType,
        parsed.importanceTier,
        chunkEmbeddingStatus,
        chunkEncodingIntent,
        fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
        childId
      );

      childIds.push(childId);

      // BM25 index the chunk
      if (bm25Index.isBm25Enabled()) {
        try {
          const bm25 = bm25Index.getIndex();
          bm25.addDocument(String(childId), chunk.content);
        } catch (bm25_err: unknown) {
          const message = toErrorMessage(bm25_err);
          console.error(`[memory-save] BM25 indexing failed for chunk ${i + 1}: ${message}`);
          bm25FailedChunks.push(childId);
        }
      }

      successCount++;
    } catch (chunkErr: unknown) {
      failedCount++;
      const message = toErrorMessage(chunkErr);
      console.error(`[memory-save] Failed to index chunk ${i + 1}: ${message}`);
    }
  }

  // Mutation ledger
  appendMutationLedgerSafe(database, {
    mutationType: existing ? 'update' : 'create',
    reason: `memory_save: chunked indexing (${chunkResult.strategy}, ${chunkResult.chunks.length} chunks)`,
    priorHash: null,
    newHash: parsed.contentHash,
    linkedMemoryIds: [parentId, ...childIds],
    decisionMeta: {
      tool: 'memory_save',
      status: 'chunked',
      chunkStrategy: chunkResult.strategy,
      chunkCount: retainedChunks.length,
      droppedCount: droppedChunkCount,
      successCount,
      failedCount,
      specFolder: parsed.specFolder,
      filePath,
    },
    actor: 'mcp:memory_save',
  });

  // AI-WHY: Chunked path must invalidate caches just like the single-record path;
  // otherwise stale trigger/tool-cache entries persist until next non-chunked save.
  triggerMatcher.clearCache();
  toolCache.invalidateOnWrite('chunked-save', { filePath });

  return {
    status: existing ? 'updated' : 'indexed',
    id: parentId,
    specFolder: parsed.specFolder,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    embeddingStatus: 'partial',
    message: `Chunked: ${successCount}/${retainedChunks.length} chunks indexed (${chunkResult.strategy} strategy)` +
      (bm25FailedChunks.length > 0 ? ` (${bm25FailedChunks.length} BM25 failures)` : ''),
  };
}

/* --- 8. INDEX MEMORY FILE --- */

/** Parse, validate, and index a memory file with PE gating, FSRS scheduling, and causal links */
async function indexMemoryFile(filePath: string, { force = false, parsedOverride = null as ReturnType<typeof memoryParser.parseMemoryFile> | null, asyncEmbedding = false } = {}): Promise<IndexResult> {
  // Reuse parsed content when provided by caller to avoid a second parse.
  const parsed = parsedOverride || memoryParser.parseMemoryFile(filePath);

  const validation: ValidationResult = memoryParser.validateParsedMemory(parsed);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  if (validation.warnings && validation.warnings.length > 0) {
    console.warn(`[memory] Warning for ${path.basename(filePath)}:`);
    validation.warnings.forEach((w: string) => console.warn(`[memory]   - ${w}`));
  }

  // T008: Integrate verify-fix-verify quality loop into the save pipeline.
  // Feature behavior remains gated by SPECKIT_QUALITY_LOOP inside runQualityLoop().
  const qualityLoopResult = runQualityLoop(parsed.content, {
    title: parsed.title ?? '',
    triggerPhrases: parsed.triggerPhrases,
    specFolder: parsed.specFolder,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
  });

  parsed.qualityScore = qualityLoopResult.score.total;
  parsed.qualityFlags = qualityLoopResult.score.issues;

  if (qualityLoopResult.fixes.length > 0) {
    console.info(`[memory-save] Quality loop applied ${qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(filePath)}`);
    // AI-WHY: Persist mutated content from quality loop; recompute content_hash
    // so downstream dedup and change-detection use the post-fix content.
    if (qualityLoopResult.fixedContent) {
      parsed.content = qualityLoopResult.fixedContent;
      parsed.contentHash = memoryParser.computeContentHash(parsed.content);
    }
  }

  if (!qualityLoopResult.passed && qualityLoopResult.rejected) {
    return {
      status: 'rejected',
      id: 0,
      specFolder: parsed.specFolder,
      title: parsed.title ?? '',
      triggerPhrases: parsed.triggerPhrases,
      contextType: parsed.contextType,
      importanceTier: parsed.importanceTier,
      qualityScore: parsed.qualityScore,
      qualityFlags: parsed.qualityFlags,
      warnings: validation.warnings,
      message: qualityLoopResult.rejectionReason,
    };
  }

  // Per-spec-folder lock to prevent TOCTOU race conditions on concurrent saves
  return withSpecFolderLock(parsed.specFolder, async () => {

  // CHUNKING BRANCH: Large files get split into parent + child records
  // AI-WHY: Must be inside withSpecFolderLock to serialize chunked saves too
  if (needsChunking(parsed.content)) {
    console.info(`[memory-save] File exceeds chunking threshold (${parsed.content.length} chars), using chunked indexing`);
    return indexChunkedMemoryFile(filePath, parsed, { force });
  }

  const database = requireDb();
  const canonicalFilePath = getCanonicalPathKey(filePath);
  const existing = database.prepare(`
    SELECT id, content_hash FROM memory_index
    WHERE spec_folder = ?
      AND (canonical_file_path = ? OR file_path = ?)
    ORDER BY id DESC
    LIMIT 1
  `).get(parsed.specFolder, canonicalFilePath, filePath) as { id: number; content_hash: string } | undefined;

  if (existing && existing.content_hash === parsed.contentHash && !force) {
    return {
      status: 'unchanged',
      id: existing.id,
      specFolder: parsed.specFolder,
      title: parsed.title ?? '',
      triggerPhrases: parsed.triggerPhrases,
      contextType: parsed.contextType,
      importanceTier: parsed.importanceTier,
      warnings: validation.warnings
    };
  }

  // T054: SHA256 CONTENT-HASH FAST-PATH DEDUP (TM-02)
  // Before calling the embedding API, check if identical content already exists
  // under ANY file path within this spec_folder. This short-circuits embedding
  // generation for duplicate content saved under a different path (e.g., renamed files).
  if (!force) {
    const duplicateByHash = database.prepare(`
      SELECT id, file_path, title FROM memory_index
      WHERE spec_folder = ?
        AND content_hash = ?
        AND embedding_status != 'pending'
      ORDER BY id DESC
      LIMIT 1
    `).get(parsed.specFolder, parsed.contentHash) as { id: number; file_path: string; title: string | null } | undefined;

    if (duplicateByHash) {
      console.info(`[memory-save] T054: Duplicate content detected (hash match id=${duplicateByHash.id}), skipping embedding`);
      return {
        status: 'duplicate',
        id: duplicateByHash.id,
        specFolder: parsed.specFolder,
        title: parsed.title ?? duplicateByHash.title ?? '',
        triggerPhrases: parsed.triggerPhrases,
        contextType: parsed.contextType,
        importanceTier: parsed.importanceTier,
        warnings: validation.warnings,
        message: `Duplicate content detected: identical to existing memory #${duplicateByHash.id} (${duplicateByHash.file_path}). Skipping embedding generation.`,
      };
    }
  }

  // AI-WHY: Persistent SQLite embedding cache (REQ-S2-001) — hash-keyed lookup avoids
  // redundant provider calls on re-index. Cache miss triggers generation + store.
  // EMBEDDING GENERATION (with persistent SQLite cache — REQ-S2-001)
  let embedding: Float32Array | null = null;
  let embeddingStatus = 'pending';
  let embeddingFailureReason: string | null = null;

  if (asyncEmbedding) {
    embeddingFailureReason = 'Deferred: async_embedding requested';
    console.info(`[memory-save] T306: Async embedding mode - deferring embedding for ${path.basename(filePath)}`);
  } else {
    try {
      // Check persistent embedding cache before calling provider
      const modelId = embeddings.getModelName();
      const cachedBuf = lookupEmbedding(database, parsed.contentHash, modelId);
      if (cachedBuf) {
        // Cache hit: convert Buffer to Float32Array
        embedding = new Float32Array(new Uint8Array(cachedBuf).buffer);
        embeddingStatus = 'success';
        console.info(`[memory-save] Embedding cache HIT for ${path.basename(filePath)}`);
      } else {
        // Cache miss: normalize content then generate embedding via provider
        // S1: strip structural noise (frontmatter, anchors, HTML comments) before embedding
        const normalizedContent = normalizeContentForEmbedding(parsed.content);
        embedding = await embeddings.generateDocumentEmbedding(normalizedContent);
        if (embedding) {
          embeddingStatus = 'success';
          // Store in persistent cache for future re-index
          const embBuf = Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
          storeEmbedding(database, parsed.contentHash, modelId, embBuf, embedding.length);
          console.info(`[memory-save] Embedding cache MISS+STORE for ${path.basename(filePath)}`);
        } else {
          embeddingFailureReason = 'Embedding generation returned null';
          console.warn(`[memory-save] Embedding failed for ${path.basename(filePath)}: ${embeddingFailureReason}`);
        }
      }
    } catch (embedding_error: unknown) {
      const message = toErrorMessage(embedding_error);
      embeddingFailureReason = message;
      console.warn(`[memory-save] Embedding failed for ${path.basename(filePath)}: ${embeddingFailureReason}`);
    }
  }

  // ── Sprint 4: TM-04 Quality Gate (before PE gating, after embedding) ──
  // AI-WHY: When enabled, runs 3-layer validation (structural, content quality, semantic dedup)
  // before allowing the memory to proceed to PE gating and storage. Rejected memories return early.
  if (isSaveQualityGateEnabled() && isQualityGateEnabled()) {
    try {
      const qualityGateResult = runQualityGate({
        title: parsed.title,
        content: parsed.content,
        specFolder: parsed.specFolder,
        triggerPhrases: parsed.triggerPhrases,
        embedding: embedding,
        findSimilar: embedding ? (emb, opts) => {
          return findSimilarMemories(emb as Float32Array, {
            limit: opts.limit,
            specFolder: opts.specFolder,
          }).map(m => ({
            id: m.id,
            file_path: m.file_path,
            similarity: m.similarity,
          }));
        } : null,
      });

      if (!qualityGateResult.pass && !qualityGateResult.warnOnly) {
        console.info(`[memory-save] TM-04: Quality gate REJECTED save for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
        return {
          status: 'rejected',
          id: 0,
          specFolder: parsed.specFolder,
          title: parsed.title ?? '',
          message: `Quality gate rejected: ${qualityGateResult.reasons.join('; ')}`,
          qualityGate: {
            pass: false,
            reasons: qualityGateResult.reasons,
            layers: qualityGateResult.layers,
          },
        };
      }

      if (qualityGateResult.wouldReject) {
        console.warn(`[memory-save] TM-04: Quality gate WARN-ONLY for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
      }
    } catch (qgErr: unknown) {
      const message = toErrorMessage(qgErr);
      console.warn(`[memory-save] TM-04: Quality gate error (proceeding with save): ${message}`);
      // AI-GUARD: Quality gate errors must not block saves
    }
  }

  // PE GATING
  let peDecision: PeDecision = { action: 'CREATE', similarity: 0 };
  let candidates: SimilarMemory[] = [];

  if (!force && embedding) {
    candidates = findSimilarMemories(embedding, {
      limit: 5,
      specFolder: parsed.specFolder
    });
  }

  if (!force && candidates.length > 0) {
    peDecision = predictionErrorGate.evaluateMemory(
      parsed.contentHash,
      parsed.content,
      candidates,
      { specFolder: parsed.specFolder }
    );

    logPeDecision(peDecision, parsed.contentHash, parsed.specFolder);

    // Guard: PE actions that reference an existing memory require existingMemoryId
    if (
      (peDecision.action === predictionErrorGate.ACTION.REINFORCE ||
        peDecision.action === predictionErrorGate.ACTION.SUPERSEDE ||
        peDecision.action === predictionErrorGate.ACTION.UPDATE) &&
      peDecision.existingMemoryId == null
    ) {
      console.warn(`[Memory Save] PE decision returned ${peDecision.action} without existingMemoryId, falling through to CREATE`);
      peDecision = { action: 'CREATE', similarity: peDecision.similarity };
    }

    switch (peDecision.action) {
      case predictionErrorGate.ACTION.REINFORCE: {
        const existingId = peDecision.existingMemoryId as number;
        const priorSnapshot = getMemoryHashSnapshot(database, existingId);
        console.info(`[PE-Gate] REINFORCE: Duplicate detected (${peDecision.similarity.toFixed(1)}%)`);
        const reinforced = reinforceExistingMemory(existingId, parsed);
        reinforced.pe_action = 'REINFORCE';
        reinforced.pe_reason = peDecision.reason;
        reinforced.warnings = validation.warnings;
        reinforced.embeddingStatus = embeddingStatus;

        if (reinforced.status !== 'error') {
          appendMutationLedgerSafe(database, {
            mutationType: 'update',
            reason: 'memory_save: reinforced existing memory via prediction-error gate',
            priorHash: priorSnapshot?.content_hash ?? null,
            newHash: parsed.contentHash,
            linkedMemoryIds: [existingId],
            decisionMeta: {
              tool: 'memory_save',
              action: predictionErrorGate.ACTION.REINFORCE,
              similarity: peDecision.similarity,
              specFolder: parsed.specFolder,
              filePath,
            },
            actor: 'mcp:memory_save',
          });
        }

        return reinforced;
      }

      case predictionErrorGate.ACTION.SUPERSEDE: {
        const existingId = peDecision.existingMemoryId as number;
        console.info(`[PE-Gate] SUPERSEDE: Contradiction detected with memory ${existingId}`);
        const superseded = markMemorySuperseded(existingId);
        if (!superseded) {
          console.warn(`[PE-Gate] Failed to mark memory ${existingId} as superseded, proceeding with CREATE anyway`);
        }
        break;
      }

      case predictionErrorGate.ACTION.UPDATE: {
        const existingId = peDecision.existingMemoryId as number;
        const priorSnapshot = getMemoryHashSnapshot(database, existingId);
        console.info(`[PE-Gate] UPDATE: High similarity (${peDecision.similarity.toFixed(1)}%), updating existing`);
        if (!embedding) {
          console.warn(
            '[Memory Save] embedding unexpectedly null in UPDATE path, falling through to CREATE'
          );
          break;
        }
        const updated = updateExistingMemory(existingId, parsed, embedding);
        updated.pe_action = 'UPDATE';
        updated.pe_reason = peDecision.reason;
        updated.warnings = validation.warnings;
        updated.embeddingStatus = embeddingStatus;

        appendMutationLedgerSafe(database, {
          mutationType: 'update',
          reason: 'memory_save: updated existing memory via prediction-error gate',
          priorHash: priorSnapshot?.content_hash ?? null,
          newHash: parsed.contentHash,
          linkedMemoryIds: [existingId],
          decisionMeta: {
            tool: 'memory_save',
            action: predictionErrorGate.ACTION.UPDATE,
            similarity: peDecision.similarity,
            specFolder: parsed.specFolder,
            filePath,
          },
          actor: 'mcp:memory_save',
        });

        return updated;
      }

      case predictionErrorGate.ACTION.CREATE_LINKED: {
        console.info(`[PE-Gate] CREATE_LINKED: Related content (${peDecision.similarity.toFixed(1)}%)`);
        break;
      }

      case predictionErrorGate.ACTION.CREATE:
      default:
        if (peDecision.similarity > 0) {
          console.info(`[PE-Gate] CREATE: Low similarity (${peDecision.similarity.toFixed(1)}%)`);
        }
        break;
    }
  }

  // ── Sprint 4: TM-06 Reconsolidation-on-Save (after PE gating, before new memory creation) ──
  // AI-WHY: When enabled, checks for similar memories and performs merge (>=0.88 similarity),
  // conflict/supersede (0.75-0.88), or complement (<0.75). If reconsolidation handles the memory
  // (merge or conflict), we skip normal DB insert and return the reconsolidation result.
  // BUG-2 fix: Track reconsolidation warnings for structured MCP response (not just console.warn)
  const reconWarnings: string[] = [];

  if (!force && isReconsolidationFlagEnabled() && isReconsolidationEnabled() && embedding) {
    try {
      const hasCheckpoint = hasReconsolidationCheckpoint(database, parsed.specFolder);
      if (!hasCheckpoint) {
        const reconMsg = 'TM-06: reconsolidation skipped — create checkpoint "pre-reconsolidation" first';
        console.warn(`[memory-save] ${reconMsg}`);
        reconWarnings.push(reconMsg);
        // Continue normal create path without reconsolidation.
      } else {
        const reconResult: ReconsolidationResult | null = await reconsolidate(
          {
            title: parsed.title,
            content: parsed.content,
            specFolder: parsed.specFolder,
            filePath,
            embedding,
            triggerPhrases: parsed.triggerPhrases,
            importanceTier: parsed.importanceTier,
          },
          database,
          {
            findSimilar: (emb, opts) => {
              const results = vectorIndex.vectorSearch(emb as Float32Array, {
                limit: opts.limit,
                specFolder: opts.specFolder,
                minSimilarity: 50,
                includeConstitutional: false,
              });
              return results.map((r: Record<string, unknown>) => ({
                id: r.id as number,
                file_path: r.file_path as string,
                title: (r.title as string) ?? null,
                content_text: (r.content as string) ?? null,
                similarity: ((r.similarity as number) ?? 0) / 100,
                spec_folder: parsed.specFolder,
                importance_weight: typeof (r.importance_weight as unknown) === 'number'
                  ? (r.importance_weight as number)
                  : 0.5,
              }));
            },
            storeMemory: (memory) => {
              const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
              const callbackSpecLevel = isSpecDocumentType(parsed.documentType)
                ? detectSpecLevelFromParsed(memory.filePath)
                : null;
              const memoryEncodingIntent = isEncodingIntentEnabled()
                ? classifyEncodingIntent(memory.content)
                : undefined;

              const memoryId = vectorIndex.indexMemory({
                specFolder: memory.specFolder,
                filePath: memory.filePath,
                title: memory.title,
                triggerPhrases: memory.triggerPhrases ?? [],
                importanceWeight,
                embedding: memory.embedding as Float32Array,
                encodingIntent: memoryEncodingIntent,
                documentType: parsed.documentType || 'memory',
                specLevel: callbackSpecLevel,
                contentText: memory.content,
                qualityScore: parsed.qualityScore,
                qualityFlags: parsed.qualityFlags,
              });

              const fileMetadata = incrementalIndex.getFileMetadata(memory.filePath);
              const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

              database.prepare(`
                UPDATE memory_index
                SET content_hash = ?,
                    context_type = ?,
                    importance_tier = ?,
                    memory_type = ?,
                    type_inference_source = ?,
                    stability = ?,
                    difficulty = ?,
                    last_review = datetime('now'),
                    review_count = 0,
                    file_mtime_ms = ?,
                    encoding_intent = COALESCE(?, encoding_intent),
                    document_type = ?,
                    spec_level = ?,
                    quality_score = ?,
                    quality_flags = ?
                WHERE id = ?
              `).run(
                parsed.contentHash,
                parsed.contextType,
                parsed.importanceTier,
                parsed.memoryType,
                parsed.memoryTypeSource,
                fsrsScheduler.DEFAULT_INITIAL_STABILITY,
                fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
                fileMtimeMs,
                memoryEncodingIntent,
                parsed.documentType || 'memory',
                callbackSpecLevel,
                parsed.qualityScore ?? 0,
                JSON.stringify(parsed.qualityFlags ?? []),
                memoryId
              );

              if (bm25Index.isBm25Enabled()) {
                try {
                  const bm25 = bm25Index.getIndex();
                  bm25.addDocument(String(memoryId), memory.content);
                } catch (bm25Err: unknown) {
                  const message = toErrorMessage(bm25Err);
                  console.warn(`[memory-save] BM25 indexing failed (recon conflict store): ${message}`);
                }
              }

              return memoryId;
            },
            generateEmbedding: async (content: string) => {
              return embeddings.generateDocumentEmbedding(content);
            },
          }
        );

        if (reconResult && reconResult.action !== 'complement') {
          // Reconsolidation handled the memory (merge or conflict) — skip normal CREATE path
          console.info(`[memory-save] TM-06: Reconsolidation ${reconResult.action} for ${path.basename(filePath)}`);

          const reconId = reconResult.action === 'merge'
            ? reconResult.existingMemoryId
            : reconResult.action === 'conflict'
              ? reconResult.newMemoryId
              : 0;

          appendMutationLedgerSafe(database, {
            mutationType: 'update',
            reason: `memory_save: reconsolidation ${reconResult.action}`,
            priorHash: null,
            newHash: parsed.contentHash,
            linkedMemoryIds: reconResult.action === 'conflict'
              ? [reconResult.newMemoryId, reconResult.existingMemoryId]
              : [reconId],
            decisionMeta: {
              tool: 'memory_save',
              action: `reconsolidation_${reconResult.action}`,
              similarity: reconResult.similarity,
              specFolder: parsed.specFolder,
              filePath,
            },
            actor: 'mcp:memory_save',
          });

          return {
            status: reconResult.action === 'merge' ? 'merged' : 'superseded',
            id: reconId,
            specFolder: parsed.specFolder,
            title: parsed.title ?? '',
            reconsolidation: reconResult,
            message: `Reconsolidation: ${reconResult.action} (similarity: ${reconResult.similarity?.toFixed(3) ?? 'N/A'})`,
          };
        }
        // reconResult is null or complement — fall through to normal CREATE path
      }
    } catch (reconErr: unknown) {
      const message = toErrorMessage(reconErr);
      console.warn(`[memory-save] TM-06: Reconsolidation error (proceeding with normal save): ${message}`);
      // AI-GUARD: Reconsolidation errors must not block saves
    }
  }

  // CREATE NEW MEMORY
  let id: number;

  // Spec 126: Detect spec level for spec documents
  const specLevel = isSpecDocumentType(parsed.documentType)
    ? detectSpecLevelFromParsed(filePath)
    : null;
  const encodingIntent = isEncodingIntentEnabled()
    ? classifyEncodingIntent(parsed.content)
    : undefined;

  if (embedding) {
    const indexWithMetadata = database.transaction(() => {
      // Determine importance weight based on document type (Spec 126)
      const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);

      const memory_id: number = vectorIndex.indexMemory({
        specFolder: parsed.specFolder,
        filePath,
        title: parsed.title,
        triggerPhrases: parsed.triggerPhrases,
        importanceWeight,
        embedding: embedding,
        encodingIntent,
        documentType: parsed.documentType || 'memory',
        specLevel,
        contentText: parsed.content,
        qualityScore: parsed.qualityScore,
        qualityFlags: parsed.qualityFlags,
      });

      const fileMetadata = incrementalIndex.getFileMetadata(filePath);
      const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

      database.prepare(`
        UPDATE memory_index
        SET content_hash = ?,
            context_type = ?,
            importance_tier = ?,
            memory_type = ?,
            type_inference_source = ?,
            stability = ?,
            difficulty = ?,
            last_review = datetime('now'),
            review_count = 0,
            file_mtime_ms = ?,
            encoding_intent = COALESCE(?, encoding_intent),
            document_type = ?,
            spec_level = ?,
            quality_score = ?,
            quality_flags = ?
        WHERE id = ?
      `).run(
        parsed.contentHash,
        parsed.contextType,
        parsed.importanceTier,
        parsed.memoryType,
        parsed.memoryTypeSource,
        fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
        fileMtimeMs,
        encodingIntent,
        parsed.documentType || 'memory',
        specLevel,
        parsed.qualityScore ?? 0,
        JSON.stringify(parsed.qualityFlags ?? []),
        memory_id
      );

      if (peDecision.action === predictionErrorGate.ACTION.CREATE_LINKED && peDecision.existingMemoryId != null) {
        try {
          database.prepare(`
            UPDATE memory_index
            SET related_memories = ?
            WHERE id = ?
          `).run(JSON.stringify([peDecision.existingMemoryId]), memory_id);
        } catch (err: unknown) {
          const message = toErrorMessage(err);
          console.error('[PE-Gate] Could not store related memories:', message);
        }
      }

      if (bm25Index.isBm25Enabled()) {
        try {
          const bm25 = bm25Index.getIndex();
          bm25.addDocument(String(memory_id), parsed.content);
        } catch (bm25_err: unknown) {
          const message = toErrorMessage(bm25_err);
          console.warn(`[memory-save] BM25 indexing failed: ${message}`);
        }
      }

      return memory_id;
    });

    id = indexWithMetadata();
  } else {
    console.info(`[memory-save] Using deferred indexing for ${path.basename(filePath)}`);

    const indexDeferred = database.transaction(() => {
      // Determine importance weight based on document type (Spec 126)
      const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);

      const memory_id: number = vectorIndex.indexMemoryDeferred({
        specFolder: parsed.specFolder,
        filePath,
        title: parsed.title,
        triggerPhrases: parsed.triggerPhrases,
        importanceWeight,
        failureReason: embeddingFailureReason,
        encodingIntent,
        documentType: parsed.documentType || 'memory',
        specLevel,
        contentText: parsed.content,
        qualityScore: parsed.qualityScore,
        qualityFlags: parsed.qualityFlags,
      });

      const fileMetadata = incrementalIndex.getFileMetadata(filePath);
      const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

      database.prepare(`
        UPDATE memory_index
        SET content_hash = ?,
            context_type = ?,
            importance_tier = ?,
            memory_type = ?,
            type_inference_source = ?,
            stability = ?,
            difficulty = ?,
            last_review = datetime('now'),
            review_count = 0,
            file_mtime_ms = ?,
            encoding_intent = COALESCE(?, encoding_intent),
            document_type = ?,
            spec_level = ?,
            quality_score = ?,
            quality_flags = ?
        WHERE id = ?
      `).run(
        parsed.contentHash,
        parsed.contextType,
        parsed.importanceTier,
        parsed.memoryType,
        parsed.memoryTypeSource,
        fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
        fileMtimeMs,
        encodingIntent,
        parsed.documentType || 'memory',
        specLevel,
        parsed.qualityScore ?? 0,
        JSON.stringify(parsed.qualityFlags ?? []),
        memory_id
      );

      if (bm25Index.isBm25Enabled()) {
        try {
          const bm25 = bm25Index.getIndex();
          bm25.addDocument(String(memory_id), parsed.content);
        } catch (bm25_err: unknown) {
          const message = toErrorMessage(bm25_err);
          console.warn(`[memory-save] BM25 indexing failed (deferred path): ${message}`);
        }
      }

      return memory_id;
    });

    id = indexDeferred();
  }

  // CAUSAL LINKS PROCESSING
  let causalLinksResult: CausalLinksResult | null = null;
  if (parsed.hasCausalLinks && parsed.causalLinks) {
    try {
      causalLinksResult = processCausalLinks(database, id, parsed.causalLinks);
      if (causalLinksResult.inserted > 0) {
        console.info(`[causal-links] Processed ${causalLinksResult.inserted} causal edges for memory #${id}`);
      }
      if (causalLinksResult.unresolved.length > 0) {
        console.warn(`[causal-links] ${causalLinksResult.unresolved.length} references could not be resolved`);
      }
    } catch (causal_err: unknown) {
      const message = toErrorMessage(causal_err);
      console.warn(`[memory-save] Causal links processing failed: ${message}`);
    }
  }

  // ── R10: Auto Entity Extraction ──
  if (isAutoEntitiesEnabled()) {
    try {
      const rawEntities = extractEntities(parsed.content);
      const filtered = filterEntities(rawEntities);
      if (filtered.length > 0) {
        const entityResult = storeEntities(database, id, filtered);
        updateEntityCatalog(database, filtered);
        console.info(`[entity-extraction] Extracted ${entityResult.stored} entities for memory #${id}`);
      }
    } catch (entityErr: unknown) {
      const message = toErrorMessage(entityErr);
      console.warn(`[memory-save] R10 entity extraction failed: ${message}`);
    }
  }

  // ── R8: Memory Summary Generation ──
  if (isMemorySummariesEnabled()) {
    try {
      const summaryResult = await generateAndStoreSummary(
        database,
        id,
        parsed.content,
        (text: string) => embeddings.generateQueryEmbedding(text)
      );
      if (summaryResult.stored) {
        console.info(`[memory-summaries] Generated summary for memory #${id}`);
      }
    } catch (summaryErr: unknown) {
      const message = toErrorMessage(summaryErr);
      console.warn(`[memory-save] R8 summary generation failed: ${message}`);
    }
  }

  // ── S5: Cross-Document Entity Linking ──
  // Runs after R10 entity storage; links entities across spec folders.
  if (isEntityLinkingEnabled() && isAutoEntitiesEnabled()) {
    try {
      const linkResult = runEntityLinking(database);
      if (linkResult.linksCreated > 0) {
        console.info(`[entity-linking] Created ${linkResult.linksCreated} cross-doc links from ${linkResult.crossDocMatches} entity matches`);
      } else if (linkResult.skippedByDensityGuard) {
        const density = typeof linkResult.edgeDensity === 'number'
          ? linkResult.edgeDensity.toFixed(3)
          : 'unknown';
        const threshold = typeof linkResult.densityThreshold === 'number'
          ? linkResult.densityThreshold.toFixed(3)
          : 'unknown';
        console.info(`[entity-linking] Skipped by density guard (density=${density}, threshold=${threshold})`);
      }
    } catch (linkErr: unknown) {
      const message = toErrorMessage(linkErr);
      console.warn(`[memory-save] S5 entity linking failed: ${message}`);
    }
  }

  let resultStatus: string;
  if (existing) {
    resultStatus = 'updated';
  } else if (embeddingStatus !== 'success') {
    resultStatus = 'deferred';
  } else {
    resultStatus = 'indexed';
  }

  const linkedMemoryIds = [
    id,
    ...(peDecision.existingMemoryId != null ? [peDecision.existingMemoryId] : []),
  ];
  appendMutationLedgerSafe(database, {
    mutationType: existing ? 'update' : 'create',
    reason: existing
      ? 'memory_save: updated indexed memory entry'
      : 'memory_save: created new indexed memory entry',
    priorHash: existing?.content_hash ?? null,
    newHash: parsed.contentHash,
    linkedMemoryIds,
    decisionMeta: {
      tool: 'memory_save',
      status: resultStatus,
      action: peDecision.action,
      similarity: peDecision.similarity,
      specFolder: parsed.specFolder,
      filePath,
      embeddingStatus,
      qualityScore: parsed.qualityScore ?? 0,
      documentType: parsed.documentType || 'memory',
    },
    actor: 'mcp:memory_save',
  });

  const result: IndexResult = {
    status: resultStatus,
    id: id,
    specFolder: parsed.specFolder,
    title: parsed.title ?? '',
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    memoryType: parsed.memoryType,
    memoryTypeSource: parsed.memoryTypeSource,
    embeddingStatus: embeddingStatus,
    warnings: [...validation.warnings, ...reconWarnings],
    qualityScore: parsed.qualityScore,
    qualityFlags: parsed.qualityFlags,
  };

  if (peDecision.action !== predictionErrorGate.ACTION.CREATE) {
    result.pe_action = peDecision.action;
    result.pe_reason = peDecision.reason;
  }

  if (peDecision.action === predictionErrorGate.ACTION.SUPERSEDE && peDecision.existingMemoryId != null) {
    result.superseded_id = peDecision.existingMemoryId;
  }

  if (peDecision.action === predictionErrorGate.ACTION.CREATE_LINKED && peDecision.existingMemoryId != null) {
    result.related_ids = [peDecision.existingMemoryId];
  }

  if (embeddingStatus === 'pending' && embeddingFailureReason) {
    result.embeddingFailureReason = embeddingFailureReason;
    result.message = 'Memory saved with deferred indexing - searchable via BM25/FTS5';
  }

  if (asyncEmbedding && embeddingStatus === 'pending') {
    const memoryId = id;
    const memoryContent = parsed.content;
    setImmediate(() => {
      retryManager.retryEmbedding(memoryId, memoryContent).catch((err: unknown) => {
        const message = toErrorMessage(err);
        console.warn(`[memory-save] T306: Immediate async embedding attempt failed for #${memoryId}: ${message}`);
      });
    });
  }

  if (causalLinksResult) {
    result.causalLinks = {
      processed: causalLinksResult.processed,
      inserted: causalLinksResult.inserted,
      resolved: causalLinksResult.resolved,
      unresolved_count: causalLinksResult.unresolved.length
    };
    if (causalLinksResult.errors.length > 0) {
      (result.causalLinks as Record<string, unknown>).errors = causalLinksResult.errors;
    }
  }

  return result;

  }); // end withSpecFolderLock
}

/* --- 9. MEMORY SAVE HANDLER --- */

/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
async function handleMemorySave(args: SaveArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();

  const { filePath: file_path, force = false, dryRun = false, skipPreflight = false, asyncEmbedding = false } = args;

  if (!file_path || typeof file_path !== 'string') {
    throw new Error('filePath is required and must be a string');
  }

  const validatedPath: string = validateFilePathLocal(file_path);

  if (!memoryParser.isMemoryFile(validatedPath)) {
    throw new Error('File must be a .md or .txt file in: specs/**/memory/, specs/**/ (spec docs), or .opencode/skill/*/constitutional/');
  }

  // PRE-FLIGHT VALIDATION
  let parsedForPreflight: ReturnType<typeof memoryParser.parseMemoryFile> | null = null;
  if (!skipPreflight) {
    parsedForPreflight = memoryParser.parseMemoryFile(validatedPath);
    const database = requireDb();

    const preflightResult = preflight.runPreflight(
      {
        content: parsedForPreflight.content,
        file_path: validatedPath,
        spec_folder: parsedForPreflight.specFolder,
        database: database,
        find_similar: findSimilarMemories as Parameters<typeof preflight.runPreflight>[0]['find_similar'],
      },
      {
        dry_run: dryRun,
        check_anchors: true,
        check_duplicates: !force,
        check_similar: false,
        check_tokens: true,
        check_size: true,
        strict_anchors: false,
      }
    );

    if (dryRun) {
      const dryRunSummary = preflightResult.dry_run_would_pass
        ? 'Pre-flight validation passed (dry-run mode)'
        : `Pre-flight validation failed: ${preflightResult.errors.length} error(s)`;

      return createMCPSuccessResponse({
        tool: 'memory_save',
        summary: dryRunSummary,
        data: {
          status: 'dry_run',
          would_pass: preflightResult.dry_run_would_pass,
          file_path: validatedPath,
          spec_folder: parsedForPreflight.specFolder,
          title: parsedForPreflight.title,
          validation: {
            errors: preflightResult.errors,
            warnings: preflightResult.warnings,
            details: preflightResult.details,
          },
          message: dryRunSummary,
        },
        hints: preflightResult.dry_run_would_pass
          ? ['Dry-run complete - no changes made']
          : ['Fix validation errors before saving', 'Use skipPreflight: true to bypass validation'],
      });
    }

    if (!preflightResult.pass) {
      const errorMessages = preflightResult.errors.map((e: string | { message: string }) =>
        typeof e === 'string' ? e : e.message
      ).join('; ');

      throw new preflight.PreflightError(
        preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID,
        `Pre-flight validation failed: ${errorMessages}`,
        {
          errors: preflightResult.errors,
          warnings: preflightResult.warnings,
          recoverable: true,
          suggestion: 'Fix the validation errors and retry, or use skipPreflight=true to bypass',
        }
      );
    }

    if (preflightResult.warnings.length > 0) {
      console.warn(`[preflight] ${validatedPath}: ${preflightResult.warnings.length} warning(s)`);
      preflightResult.warnings.forEach((w: string | { message: string }) => {
        const msg = typeof w === 'string' ? w : w.message;
        console.warn(`[preflight]   - ${msg}`);
      });
    }
  }

  const result = await indexMemoryFile(validatedPath, { force, parsedOverride: parsedForPreflight, asyncEmbedding });

  if (result.status === 'unchanged') {
    return createMCPSuccessResponse({
      tool: 'memory_save',
      summary: 'Memory already indexed with same content',
      data: {
        status: 'unchanged',
        id: result.id,
        specFolder: result.specFolder,
        title: result.title
      },
      hints: ['Use force: true to re-index anyway']
    });
  }

  triggerMatcher.clearCache();
  toolCache.invalidateOnWrite('save', { specFolder: result.specFolder, filePath: file_path });
  clearConstitutionalCache();

  const response: Record<string, unknown> = {
    status: result.status,
    id: result.id,
    specFolder: result.specFolder,
    title: result.title,
    triggerPhrases: result.triggerPhrases,
    contextType: result.contextType,
    importanceTier: result.importanceTier,
    qualityScore: result.qualityScore,
    qualityFlags: result.qualityFlags,
    message: result.status === 'duplicate' ? `Memory skipped (duplicate content)` : `Memory ${result.status} successfully`
  };

  if (result.pe_action) {
    response.pe_action = result.pe_action;
    response.pe_reason = result.pe_reason;
    response.message = `Memory ${result.status} (PE: ${result.pe_action})`;
  }

  if (result.superseded_id) {
    response.superseded_id = result.superseded_id;
    response.message = `${response.message} - superseded memory #${result.superseded_id}`;
  }

  if (result.related_ids) {
    response.related_ids = result.related_ids;
  }

  if (result.previous_stability !== undefined) {
    response.previous_stability = result.previous_stability;
    response.newStability = result.newStability;
    response.retrievability = result.retrievability;
  }

  if (result.warnings && result.warnings.length > 0) {
    response.warnings = result.warnings;
    response.message = `${response.message} (with ${result.warnings.length} warning(s) - anchor issues detected)`;
  }

  if (result.embeddingStatus) {
    response.embeddingStatus = result.embeddingStatus;
    if (result.embeddingStatus === 'pending') {
      response.message = `${response.message} (deferred indexing - searchable via BM25/FTS5)`;
      if (result.embeddingFailureReason) {
        response.embeddingFailureReason = result.embeddingFailureReason;
      }
    } else if (result.embeddingStatus === 'partial') {
      // Chunked indexing result
      response.message = result.message || `${response.message} (chunked indexing)`;
    }
  }

  const summary = response.message as string;
  const hints: string[] = [];
  if (result.pe_action === 'REINFORCE') {
    hints.push('Existing memory was reinforced instead of creating duplicate');
  }
  if (result.pe_action === 'SUPERSEDE') {
    hints.push(`Previous memory #${result.superseded_id} marked as deprecated`);
  }
  if (result.warnings && result.warnings.length > 0) {
    hints.push('Review anchor warnings for better searchability');
  }
  if (result.embeddingStatus === 'pending') {
    hints.push('Memory will be fully indexed when embedding provider becomes available');
    if (asyncEmbedding) {
      hints.push('Async embedding mode: immediate background attempt triggered, background retry manager as safety net');
    }
  }
  if (result.embeddingStatus === 'partial') {
    hints.push('Large file indexed via chunking: parent record + individual chunk records with embeddings');
  }
  if (result.causalLinks) {
    response.causalLinks = result.causalLinks;
    if ((result.causalLinks as Record<string, unknown>).inserted as number > 0) {
      hints.push(`Created ${(result.causalLinks as Record<string, unknown>).inserted} causal graph edge(s)`);
    }
    if ((result.causalLinks as Record<string, unknown>).unresolved_count as number > 0) {
      hints.push(`${(result.causalLinks as Record<string, unknown>).unresolved_count} causal link reference(s) could not be resolved`);
    }
  }

  if (result.embeddingStatus === 'success') {
    retryManager.processRetryQueue(2).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[memory-save] Opportunistic retry failed:', message);
    });
  }

  // Sprint 6 N3-lite runtime integration (flag-gated)
  try {
    const consolidation = runConsolidationCycleIfEnabled(requireDb());
    if (consolidation) {
      response.consolidation = consolidation;
      hints.push(
        `N3-lite consolidation: +${consolidation.hebbian.strengthened} strengthened, ` +
        `-${consolidation.hebbian.decayed} decayed, ${consolidation.stale.flagged} stale flagged`
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[memory-save] N3-lite consolidation skipped after save: ${message}`);
  }

  return createMCPSuccessResponse({
    tool: 'memory_save',
    summary,
    data: response,
    hints
  });
}

/* --- 10. ATOMIC MEMORY SAVE --- */

/**
 * Write content to disk and index atomically with rollback on failure.
 *
 * P4-01/P4-17 NOTE: True atomicity between file write and DB indexing is not
 * achievable here because `executeAtomicSave` requires a synchronous
 * `dbOperation` callback, while `indexMemoryFile` is async (embedding
 * generation). The current design is: (1) write file atomically, (2) index
 * asynchronously. If indexing fails, the file exists on disk but is not in
 * the DB — a partial-success state that is reported to the caller.
 */
async function atomicSaveMemory(params: AtomicSaveParams, options: AtomicSaveOptions = {}): Promise<AtomicSaveResult> {
  const { file_path, content } = params;
  const { force = false } = options;

  // Pre-index: generate the index result before the atomic write
  // so we can run the sync dbOperation inside executeAtomicSave
  let indexResult: IndexResult | null = null;
  let indexError: Error | null = null;

  // Write file and run DB operation atomically
  const result = transactionManager.executeAtomicSave(
    file_path,
    content,
    () => {
      // DB operation is a no-op during atomic write;
      // indexing happens asynchronously after the write succeeds.
    }
  );

  if (!result.success) {
    return result;
  }

  // Index the saved file (async, after atomic write succeeded)
  try {
    indexResult = await indexMemoryFile(file_path, { force, asyncEmbedding: true });
  } catch (err: unknown) {
    indexError = err instanceof Error ? err : new Error(String(err));
  }

  if (indexError || !indexResult) {
    // File was written but indexing failed — still report partial success
    return {
      success: true,
      filePath: file_path,
      error: `File saved but indexing failed: ${indexError?.message ?? 'unknown'}`,
    };
  }

  triggerMatcher.clearCache();
  clearConstitutionalCache();
  return result;
}

/** Return transaction manager metrics for atomicity monitoring */
function getAtomicityMetrics(): Record<string, unknown> {
  return transactionManager.getMetrics();
}

/* --- 11. QUALITY LOOP (T008) ---
   Post-save quality verification with auto-fix and rejection.
   Gated behind SPECKIT_QUALITY_LOOP env var.
   NOT integrated into save flow yet (Wave 3 will do integration). */

// --- Quality Loop Types ---

interface QualityScoreBreakdown {
  triggers: number;
  anchors: number;
  budget: number;
  coherence: number;
}

interface QualityScore {
  total: number;
  breakdown: QualityScoreBreakdown;
  issues: string[];
}

interface QualityLoopResult {
  passed: boolean;
  score: QualityScore;
  attempts: number;
  fixes: string[];
  rejected: boolean;
  rejectionReason?: string;
  /** Content after auto-fix mutations (present only when fixes were applied) */
  fixedContent?: string;
}

// --- Quality Loop Constants ---

const QUALITY_WEIGHTS = {
  triggers: 0.25,
  anchors: 0.30,
  budget: 0.20,
  coherence: 0.25,
} as const;

/** Rough token-to-char ratio: 1 token ~ 4 chars */
const DEFAULT_TOKEN_BUDGET = 2000;
const CHARS_PER_TOKEN = 4;
const DEFAULT_CHAR_BUDGET = DEFAULT_TOKEN_BUDGET * CHARS_PER_TOKEN;

// --- Quality Loop Feature Flag ---

function isQualityLoopEnabled(): boolean {
  return process.env.SPECKIT_QUALITY_LOOP?.toLowerCase() === 'true';
}

// --- Quality Score Computation ---

/**
 * Compute trigger phrase quality sub-score.
 * 0 triggers → 0, 1-3 → 0.5, 4+ → 1.0
 */
function scoreTriggerPhrases(metadata: Record<string, unknown>): { score: number; issues: string[] } {
  const triggers = Array.isArray(metadata.triggerPhrases) ? metadata.triggerPhrases : [];
  const count = triggers.length;
  const issues: string[] = [];

  if (count === 0) {
    issues.push('No trigger phrases found');
    return { score: 0, issues };
  }
  if (count < 4) {
    issues.push(`Only ${count} trigger phrase(s) — 4+ recommended`);
    return { score: 0.5, issues };
  }
  return { score: 1.0, issues };
}

/**
 * Compute anchor format quality sub-score.
 * Checks that ANCHOR tags are properly opened and closed.
 * No anchors (and no broken ones) → 0.5 (neutral).
 */
function scoreAnchorFormat(content: string): { score: number; issues: string[] } {
  const issues: string[] = [];

  // Match opening anchors: <!-- ANCHOR: name -->
  const openPattern = /<!--\s*ANCHOR:\s*([\w-]+)\s*-->/g;
  // Match closing anchors: <!-- /ANCHOR: name -->
  const closePattern = /<!--\s*\/ANCHOR:\s*([\w-]+)\s*-->/g;

  const openAnchors: string[] = [];
  const closeAnchors: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = openPattern.exec(content)) !== null) {
    openAnchors.push(match[1]);
  }
  while ((match = closePattern.exec(content)) !== null) {
    closeAnchors.push(match[1]);
  }

  // No anchors at all — neutral score
  if (openAnchors.length === 0 && closeAnchors.length === 0) {
    return { score: 0.5, issues: [] };
  }

  // Check for unclosed anchors
  const unclosed = openAnchors.filter(name => !closeAnchors.includes(name));
  const unopened = closeAnchors.filter(name => !openAnchors.includes(name));

  if (unclosed.length > 0) {
    issues.push(`Unclosed ANCHOR tag(s): ${unclosed.join(', ')}`);
  }
  if (unopened.length > 0) {
    issues.push(`Closing ANCHOR without opening: ${unopened.join(', ')}`);
  }

  if (issues.length === 0) {
    return { score: 1.0, issues };
  }

  // Proportional: correct pairs / total unique anchors
  const allNames = new Set([...openAnchors, ...closeAnchors]);
  const brokenCount = unclosed.length + unopened.length;
  const score = Math.max(0, 1 - brokenCount / allNames.size);
  return { score, issues };
}

/**
 * Compute token budget quality sub-score.
 * Under budget → 1.0, over → budget/actual (proportionally less).
 */
function scoreTokenBudget(content: string, charBudget: number = DEFAULT_CHAR_BUDGET): { score: number; issues: string[] } {
  const issues: string[] = [];
  const charCount = content.length;

  if (charCount <= charBudget) {
    return { score: 1.0, issues };
  }

  const ratio = charBudget / charCount;
  issues.push(`Content exceeds token budget: ~${Math.ceil(charCount / CHARS_PER_TOKEN)} tokens (budget: ${DEFAULT_TOKEN_BUDGET})`);
  return { score: Math.max(0, ratio), issues };
}

/**
 * Compute coherence quality sub-score.
 * Basic checks: non-empty, >50 chars, has sections, >200 chars.
 */
function scoreCoherence(content: string): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 0;

  if (!content || content.trim().length === 0) {
    issues.push('Content is empty');
    return { score: 0, issues };
  }
  score += 0.25; // non-empty

  if (content.length > 50) {
    score += 0.25; // >50 chars
  } else {
    issues.push('Content is very short (<50 chars)');
  }

  if (/^#{1,3}\s+.+/m.test(content)) {
    score += 0.25; // has markdown headings
  } else {
    issues.push('No section headings found');
  }

  if (content.length > 200) {
    score += 0.25; // substantial content
  } else {
    issues.push('Content lacks substance (<200 chars)');
  }

  return { score, issues };
}

/**
 * Compute composite quality score for a memory file.
 * Weighted combination of trigger phrase coverage, anchor format,
 * token budget compliance, and content coherence.
 *
 * @returns QualityScore with total (0-1), per-dimension breakdown, and issues list
 */
function computeMemoryQualityScore(
  content: string,
  metadata: Record<string, unknown>,
): QualityScore {
  const triggerResult = scoreTriggerPhrases(metadata);
  const anchorResult = scoreAnchorFormat(content);
  const budgetResult = scoreTokenBudget(content);
  const coherenceResult = scoreCoherence(content);

  const total =
    triggerResult.score * QUALITY_WEIGHTS.triggers +
    anchorResult.score * QUALITY_WEIGHTS.anchors +
    budgetResult.score * QUALITY_WEIGHTS.budget +
    coherenceResult.score * QUALITY_WEIGHTS.coherence;

  return {
    total: Math.round(total * 1000) / 1000, // 3 decimal places
    breakdown: {
      triggers: triggerResult.score,
      anchors: anchorResult.score,
      budget: budgetResult.score,
      coherence: coherenceResult.score,
    },
    issues: [
      ...triggerResult.issues,
      ...anchorResult.issues,
      ...budgetResult.issues,
      ...coherenceResult.issues,
    ],
  };
}

// --- Auto-Fix ---

/**
 * Attempt automatic fixes for quality issues.
 *
 * Strategies:
 * - Re-extract trigger phrases from content headings/title
 * - Close unclosed ANCHOR tags
 * - Trim content to token budget
 *
 * Returns the (possibly modified) content, metadata, and list of applied fixes.
 */
function attemptAutoFix(
  content: string,
  metadata: Record<string, unknown>,
  issues: string[],
): { content: string; metadata: Record<string, unknown>; fixed: string[] } {
  let fixedContent = content;
  const fixedMetadata = { ...metadata };
  const fixed: string[] = [];

  // Fix 1: Re-extract trigger phrases if missing/insufficient
  const hasTriggerIssue = issues.some(i => /trigger phrase/i.test(i));
  if (hasTriggerIssue) {
    const existingTriggers = Array.isArray(fixedMetadata.triggerPhrases)
      ? (fixedMetadata.triggerPhrases as string[])
      : [];

    const extracted = extractTriggersFromContent(fixedContent, fixedMetadata.title as string | undefined);
    if (extracted.length > existingTriggers.length) {
      fixedMetadata.triggerPhrases = extracted;
      fixed.push(`Re-extracted ${extracted.length} trigger phrases from content`);
    }
  }

  // Fix 2: Close unclosed ANCHOR tags
  const hasAnchorIssue = issues.some(i => /unclosed anchor/i.test(i));
  if (hasAnchorIssue) {
    fixedContent = normalizeAnchors(fixedContent);
    fixed.push('Normalized unclosed ANCHOR tags');
  }

  // Fix 3: Trim content to budget
  const hasBudgetIssue = issues.some(i => /token budget/i.test(i));
  if (hasBudgetIssue) {
    if (fixedContent.length > DEFAULT_CHAR_BUDGET) {
      // Trim to budget, preserving the last newline boundary
      const trimmed = fixedContent.substring(0, DEFAULT_CHAR_BUDGET);
      const lastNewline = trimmed.lastIndexOf('\n');
      fixedContent = lastNewline > 0 ? trimmed.substring(0, lastNewline) : trimmed;
      fixed.push(`Trimmed content from ${content.length} to ${fixedContent.length} chars`);
    }
  }

  return { content: fixedContent, metadata: fixedMetadata, fixed };
}

/**
 * Extract trigger phrases from content by scanning headings and the title.
 */
function extractTriggersFromContent(content: string, title?: string): string[] {
  const triggers: string[] = [];

  // Add title as a trigger if present
  if (title && title.trim().length > 0) {
    triggers.push(title.trim().toLowerCase());
  }

  // Extract markdown headings as triggers
  const headingPattern = /^#{1,3}\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = headingPattern.exec(content)) !== null) {
    const heading = match[1].trim().toLowerCase();
    if (heading.length > 3 && heading.length < 80 && !triggers.includes(heading)) {
      triggers.push(heading);
    }
  }

  return triggers.slice(0, 8); // Cap at 8 triggers
}

/**
 * Normalize ANCHOR tags by closing any unclosed ones.
 * Appends <!-- /ANCHOR: name --> at the end of content for unclosed anchors.
 */
function normalizeAnchors(content: string): string {
  const openPattern = /<!--\s*ANCHOR:\s*([\w-]+)\s*-->/g;
  const closePattern = /<!--\s*\/ANCHOR:\s*([\w-]+)\s*-->/g;

  const openAnchors: string[] = [];
  const closeAnchors: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = openPattern.exec(content)) !== null) {
    openAnchors.push(match[1]);
  }
  while ((match = closePattern.exec(content)) !== null) {
    closeAnchors.push(match[1]);
  }

  const unclosed = openAnchors.filter(name => !closeAnchors.includes(name));

  if (unclosed.length === 0) return content;

  // Append closing tags for unclosed anchors
  let result = content;
  for (const name of unclosed) {
    result += `\n<!-- /ANCHOR: ${name} -->`;
  }
  return result;
}

// --- Quality Loop ---

/**
 * Run the verify-fix-verify quality loop on memory content.
 *
 * Gated behind SPECKIT_QUALITY_LOOP env var.
 * Computes quality score, attempts auto-fix if below threshold,
 * rejects after maxRetries failures.
 *
 * @param content - Memory file content
 * @param metadata - Parsed memory metadata (must include triggerPhrases)
 * @param options - threshold (default 0.6), maxRetries (default 2)
 * @returns QualityLoopResult with pass/fail, scores, fixes, rejection info
 */
function runQualityLoop(
  content: string,
  metadata: Record<string, unknown>,
  options?: { maxRetries?: number; threshold?: number },
): QualityLoopResult {
  const threshold = options?.threshold ?? 0.6;
  const maxRetries = options?.maxRetries ?? 2;

  // Feature gate check
  if (!isQualityLoopEnabled()) {
    // When disabled, compute score but always pass
    const score = computeMemoryQualityScore(content, metadata);
    return {
      passed: true,
      score,
      attempts: 1,
      fixes: [],
      rejected: false,
    };
  }

  // First evaluation
  let currentContent = content;
  let currentMetadata = { ...metadata };
  let score = computeMemoryQualityScore(currentContent, currentMetadata);
  const allFixes: string[] = [];

  if (score.total >= threshold) {
    logQualityMetrics(score, 1, true, false);
    return {
      passed: true,
      score,
      attempts: 1,
      fixes: [],
      rejected: false,
    };
  }

  // Auto-fix loop
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const fixResult = attemptAutoFix(currentContent, currentMetadata, score.issues);
    currentContent = fixResult.content;
    currentMetadata = fixResult.metadata;
    allFixes.push(...fixResult.fixed);

    // Re-evaluate after fix
    score = computeMemoryQualityScore(currentContent, currentMetadata);

    if (score.total >= threshold) {
      logQualityMetrics(score, attempt + 1, true, false);
      return {
        passed: true,
        score,
        attempts: attempt + 1,
        fixes: allFixes,
        rejected: false,
        // AI-WHY: Return mutated content so caller can persist it and recompute content_hash
        fixedContent: allFixes.length > 0 ? currentContent : undefined,
      };
    }

    // If no fixes were applied, further retries won't help
    if (fixResult.fixed.length === 0) {
      break;
    }
  }

  // Rejected after all retries
  const rejectionReason = `Quality score ${score.total.toFixed(3)} below threshold ${threshold} after ${maxRetries} auto-fix attempts. Issues: ${score.issues.join('; ')}`;

  logQualityMetrics(score, maxRetries + 1, false, true);

  return {
    passed: false,
    score,
    attempts: maxRetries + 1,
    fixes: allFixes,
    rejected: true,
    rejectionReason,
    // AI-WHY: Return mutated content even on rejection so callers that soft-reject can persist
    fixedContent: allFixes.length > 0 ? currentContent : undefined,
  };
}

// --- Eval Logging for Quality Metrics ---

/**
 * Log quality metrics to the eval infrastructure (eval_metric_snapshots table).
 * Fail-safe: never throws. No-op when eval logging is disabled.
 */
function logQualityMetrics(
  score: QualityScore,
  attempts: number,
  passed: boolean,
  rejected: boolean,
): void {
  try {
    // Use eval logger's feature flag check
    if (process.env.SPECKIT_EVAL_LOGGING?.toLowerCase() !== 'true') return;

    const db = initEvalDb();

    const metadata = JSON.stringify({
      breakdown: score.breakdown,
      issues: score.issues,
      attempts,
      passed,
      rejected,
    });

    db.prepare(`
      INSERT INTO eval_metric_snapshots
        (eval_run_id, metric_name, metric_value, channel, query_count, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      0, // No eval run for quality metrics
      'memory_quality_score',
      score.total,
      'quality_loop',
      attempts,
      metadata,
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[quality-loop] logQualityMetrics failed (non-fatal):', msg);
  }
}

/* --- 12. EXPORTS --- */

export {
  // Primary exports
  indexMemoryFile,
  indexChunkedMemoryFile,
  handleMemorySave,
  atomicSaveMemory,
  getAtomicityMetrics,

  // PE gating helper functions
  calculateDocumentWeight,
  findSimilarMemories,
  reinforceExistingMemory,
  markMemorySuperseded,
  updateExistingMemory,
  logPeDecision,

  // SQL helper functions
  escapeLikePattern,

  // Causal links helper functions
  processCausalLinks,
  resolveMemoryReference,
  CAUSAL_LINK_MAPPINGS,

  // Quality Loop (T008)
  computeMemoryQualityScore,
  attemptAutoFix,
  runQualityLoop,
  isQualityLoopEnabled,
  logQualityMetrics,

  // Quality Loop internals (exported for testing)
  scoreTriggerPhrases,
  scoreAnchorFormat,
  scoreTokenBudget,
  scoreCoherence,
  extractTriggersFromContent,
  normalizeAnchors,
  QUALITY_WEIGHTS,
  DEFAULT_TOKEN_BUDGET,
  DEFAULT_CHAR_BUDGET,
};

// Quality Loop type exports
export type {
  QualityScore,
  QualityScoreBreakdown,
  QualityLoopResult,
};

// Backward-compatible aliases (snake_case)
const index_memory_file = indexMemoryFile;
const handle_memory_save = handleMemorySave;
const atomic_save_memory = atomicSaveMemory;
const get_atomicity_metrics = getAtomicityMetrics;
const calculate_document_weight = calculateDocumentWeight;
const find_similar_memories = findSimilarMemories;
const reinforce_existing_memory = reinforceExistingMemory;
const mark_memory_superseded = markMemorySuperseded;
const update_existing_memory = updateExistingMemory;
const log_pe_decision = logPeDecision;
const process_causal_links = processCausalLinks;
const resolve_memory_reference = resolveMemoryReference;
const compute_memory_quality_score = computeMemoryQualityScore;
const attempt_auto_fix = attemptAutoFix;
const run_quality_loop = runQualityLoop;
const is_quality_loop_enabled = isQualityLoopEnabled;
const log_quality_metrics = logQualityMetrics;

export {
  index_memory_file,
  handle_memory_save,
  atomic_save_memory,
  get_atomicity_metrics,
  calculate_document_weight,
  find_similar_memories,
  reinforce_existing_memory,
  mark_memory_superseded,
  update_existing_memory,
  log_pe_decision,
  process_causal_links,
  resolve_memory_reference,
  compute_memory_quality_score,
  attempt_auto_fix,
  run_quality_loop,
  is_quality_loop_enabled,
  log_quality_metrics,
};
