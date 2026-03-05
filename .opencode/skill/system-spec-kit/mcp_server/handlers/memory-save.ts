// ---------------------------------------------------------------
// MODULE: Memory Save Handler
// ---------------------------------------------------------------
/* --- 1. DEPENDENCIES --- */

// Node built-ins
import { randomUUID } from 'node:crypto';
import path from 'path';

// Third-party types
import type BetterSqlite3 from 'better-sqlite3';

// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';

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
import { runConsolidationCycleIfEnabled } from '../lib/storage/consolidation';
import { getCanonicalPathKey } from '../lib/utils/canonical-path';
import { requireDb, toErrorMessage } from '../utils';
import type { MCPResponse } from './types';
import { clearConstitutionalCache } from '../hooks/memory-surface';

import { runQualityGate, isQualityGateEnabled } from '../lib/validation/save-quality-gate';
import { reconsolidate, isReconsolidationEnabled } from '../lib/storage/reconsolidation';
import type { ReconsolidationResult } from '../lib/storage/reconsolidation';
import { classifyEncodingIntent } from '../lib/search/encoding-intent';
import { isEncodingIntentEnabled, isSaveQualityGateEnabled, isReconsolidationEnabled as isReconsolidationFlagEnabled } from '../lib/search/search-flags';

import { getMemoryHashSnapshot, appendMutationLedgerSafe } from './memory-crud-utils';
import { lookupEmbedding, storeEmbedding, computeContentHash as cacheContentHash } from '../lib/cache/embedding-cache';
import { normalizeContentForEmbedding } from '../lib/parsing/content-normalizer';
import {
  calculateDocumentWeight,
  findSimilarMemories,
  reinforceExistingMemory,
  markMemorySuperseded,
  updateExistingMemory,
  logPeDecision,
  isSpecDocumentType,
} from './pe-gating';
import {
  processCausalLinks,
  resolveMemoryReference,
  CAUSAL_LINK_MAPPINGS,
} from './causal-links-processor';
import { detectSpecLevelFromParsed } from './handler-utils';
import { indexChunkedMemoryFile, needsChunking } from './chunking-orchestrator';
import {
  computeMemoryQualityScore,
  attemptAutoFix,
  runQualityLoop,
  isQualityLoopEnabled,
  logQualityMetrics,
  scoreTriggerPhrases,
  scoreAnchorFormat,
  scoreTokenBudget,
  scoreCoherence,
  extractTriggersFromContent,
  normalizeAnchors,
  QUALITY_WEIGHTS,
  DEFAULT_TOKEN_BUDGET,
  DEFAULT_CHAR_BUDGET,
} from './quality-loop';
import type {
  QualityScore,
  QualityScoreBreakdown,
  QualityLoopResult,
} from './quality-loop';

// AI-TRACE:R10, AI-TRACE:R8, AI-TRACE:S5: Entity extraction, memory summaries, entity linking — default-ON via flags
import { isAutoEntitiesEnabled, isMemorySummariesEnabled, isEntityLinkingEnabled } from '../lib/search/search-flags';
import { extractEntities, filterEntities, storeEntities, updateEntityCatalog } from '../lib/extraction/entity-extractor';
import { generateAndStoreSummary } from '../lib/search/memory-summaries';
import { runEntityLinking } from '../lib/search/entity-linker';

// Create local path validator
const validateFilePathLocal = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);

/** Per-spec-folder save mutex to prevent concurrent indexing races (TOCTOU) */
const SPEC_FOLDER_LOCKS = new Map<string, Promise<unknown>>();

async function withSpecFolderLock<T>(specFolder: string, fn: () => Promise<T>): Promise<T> {
  const normalizedFolder = specFolder || '__global__';
  const chain = (SPEC_FOLDER_LOCKS.get(normalizedFolder) ?? Promise.resolve())
    .catch(() => {})
    .then(() => fn());
  SPEC_FOLDER_LOCKS.set(normalizedFolder, chain);
  try {
    return await chain;
  } finally {
    if (SPEC_FOLDER_LOCKS.get(normalizedFolder) === chain) {
      SPEC_FOLDER_LOCKS.delete(normalizedFolder);
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
  asyncEmbedding?: boolean; // AI-TRACE:T306: When true, embedding generation is deferred (non-blocking)
}

/* --- 3. SQL HELPER FUNCTIONS --- */

/**
 * Columns that may be set on a memory_index row after an INSERT via
 * vectorIndex.indexMemory / indexMemoryDeferred.  All fields are optional;
 * only the ones supplied are included in the generated UPDATE.
 *
 * `encoding_intent` receives special COALESCE treatment so a NULL value
 * does not overwrite a previously stored intent.
 *
 * `last_review` is always set to `datetime('now')` and `review_count` defaults
 * to 0 unless explicitly provided.
 */
interface PostInsertMetadataFields {
  content_hash?: string;
  context_type?: string;
  importance_tier?: string;
  memory_type?: string;
  type_inference_source?: string;
  stability?: number;
  difficulty?: number;
  review_count?: number;
  file_mtime_ms?: number | null;
  embedding_status?: string;
  encoding_intent?: string | null;
  document_type?: string;
  spec_level?: number | null;
  quality_score?: number;
  quality_flags?: string;          // pre-stringified JSON
  parent_id?: number;
  chunk_index?: number;
  chunk_label?: string;
}

/** Allowed column names for the dynamic UPDATE builder (injection guard). */
const ALLOWED_POST_INSERT_COLUMNS = new Set<string>([
  'content_hash', 'context_type', 'importance_tier', 'memory_type',
  'type_inference_source', 'stability', 'difficulty', 'review_count',
  'file_mtime_ms', 'embedding_status', 'encoding_intent', 'document_type',
  'spec_level', 'quality_score', 'quality_flags', 'parent_id',
  'chunk_index', 'chunk_label',
]);

/**
 * Build and execute a dynamic `UPDATE memory_index SET ... WHERE id = ?`
 * from the supplied field map.  Reduces the five near-identical post-insert
 * UPDATE blocks to a single helper call.
 *
 * Special handling:
 * - `encoding_intent` → `COALESCE(?, encoding_intent)` (preserves existing value when NULL)
 * - `last_review` is always appended as `datetime('now')`
 * - `review_count` defaults to `0` when not explicitly supplied
 */
function applyPostInsertMetadata(
  db: BetterSqlite3.Database,
  memoryId: number,
  fields: PostInsertMetadataFields,
): void {
  const setClauses: string[] = [];
  const values: unknown[] = [];

  for (const [col, val] of Object.entries(fields)) {
    if (val === undefined) continue;                      // skip unset fields
    if (!ALLOWED_POST_INSERT_COLUMNS.has(col)) continue;  // injection guard

    if (col === 'encoding_intent') {
      setClauses.push('encoding_intent = COALESCE(?, encoding_intent)');
    } else {
      setClauses.push(`${col} = ?`);
    }
    values.push(val);
  }

  // Always set last_review; default review_count to 0 when caller omitted it
  setClauses.push("last_review = datetime('now')");
  if (!Object.prototype.hasOwnProperty.call(fields, 'review_count')) {
    setClauses.push('review_count = 0');
  }

  values.push(memoryId);

  db.prepare(`
    UPDATE memory_index
    SET ${setClauses.join(',\n        ')}
    WHERE id = ?
  `).run(...values);
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

  // AI-TRACE:T008: Integrate verify-fix-verify quality loop into the save pipeline.
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
    return indexChunkedMemoryFile(filePath, parsed, { force, applyPostInsertMetadata });
  }

  const database = requireDb();
  const canonicalFilePath = getCanonicalPathKey(filePath);
  const existing = database.prepare(`
    SELECT id, content_hash FROM memory_index
    WHERE spec_folder = ?
      AND parent_id IS NULL
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

  // AI-TRACE:T054: SHA256 CONTENT-HASH FAST-PATH DEDUP (TM-02)
  // Before calling the embedding API, check if identical content already exists
  // under ANY file path within this spec_folder. This short-circuits embedding
  // generation for duplicate content saved under a different path (e.g., renamed files).
  if (!force) {
    const duplicateByHash = database.prepare(`
      SELECT id, file_path, title FROM memory_index
      WHERE spec_folder = ?
        AND content_hash = ?
        AND parent_id IS NULL
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

              applyPostInsertMetadata(database, memoryId, {
                content_hash: parsed.contentHash,
                context_type: parsed.contextType,
                importance_tier: parsed.importanceTier,
                memory_type: parsed.memoryType,
                type_inference_source: parsed.memoryTypeSource,
                stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
                difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
                file_mtime_ms: fileMtimeMs,
                encoding_intent: memoryEncodingIntent,
                document_type: parsed.documentType || 'memory',
                spec_level: callbackSpecLevel,
                quality_score: parsed.qualityScore ?? 0,
                quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
              });

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

      applyPostInsertMetadata(database, memory_id, {
        content_hash: parsed.contentHash,
        context_type: parsed.contextType,
        importance_tier: parsed.importanceTier,
        memory_type: parsed.memoryType,
        type_inference_source: parsed.memoryTypeSource,
        stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
        file_mtime_ms: fileMtimeMs,
        encoding_intent: encodingIntent,
        document_type: parsed.documentType || 'memory',
        spec_level: specLevel,
        quality_score: parsed.qualityScore ?? 0,
        quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
      });

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

      applyPostInsertMetadata(database, memory_id, {
        content_hash: parsed.contentHash,
        context_type: parsed.contextType,
        importance_tier: parsed.importanceTier,
        memory_type: parsed.memoryType,
        type_inference_source: parsed.memoryTypeSource,
        stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
        file_mtime_ms: fileMtimeMs,
        encoding_intent: encodingIntent,
        document_type: parsed.documentType || 'memory',
        spec_level: specLevel,
        quality_score: parsed.qualityScore ?? 0,
        quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
      });

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

  // ── AI-TRACE:R10: Auto Entity Extraction ──
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
  // A7-P2-1: Generate requestId for incident correlation in error responses
  const requestId = randomUUID();
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

      // AI-WHY: Fix #23 (017-refinement-phase-6) — Use the actual error code from the
      // first validation error instead of hardcoding ANCHOR_FORMAT_INVALID.
      const firstError = preflightResult.errors[0];
      const errorCode = (typeof firstError === 'object' && firstError?.code)
        ? firstError.code
        : preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID;
      throw new preflight.PreflightError(
        errorCode,
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
      console.warn(`[memory-save] Opportunistic retry failed [requestId=${requestId}]:`, message);
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
    console.warn(`[memory-save] N3-lite consolidation skipped after save [requestId=${requestId}]: ${message}`);
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
