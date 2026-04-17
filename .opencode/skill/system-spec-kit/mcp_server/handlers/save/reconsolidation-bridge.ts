// ───────────────────────────────────────────────────────────────
// MODULE: Reconsolidation Bridge
// ───────────────────────────────────────────────────────────────
import path from 'path';
import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../../lib/search/vector-index.js';
import * as embeddings from '../../lib/providers/embeddings.js';
import * as bm25Index from '../../lib/search/bm25-index.js';
import * as fsrsScheduler from '../../lib/cognitive/fsrs-scheduler.js';
import * as incrementalIndex from '../../lib/storage/incremental-index.js';
import { reconsolidate } from '../../lib/storage/reconsolidation.js';
import type { ReconsolidationResult } from '../../lib/storage/reconsolidation.js';
import { classifyEncodingIntent } from '../../lib/search/encoding-intent.js';
import {
  isEncodingIntentEnabled,
  isSaveReconsolidationEnabled,
  isAssistiveReconsolidationEnabled as _isAssistiveReconsolidationEnabled,
} from '../../lib/search/search-flags.js';
import type { SavePlannerMode } from '../../lib/search/search-flags.js';
import type * as memoryParser from '../../lib/parsing/memory-parser.js';
import { toErrorMessage } from '../../utils/index.js';

import { recordHistory } from '../../lib/storage/history.js';
import { appendMutationLedgerSafe } from '../memory-crud-utils.js';
import { calculateDocumentWeight, isSpecDocumentType } from '../pe-gating.js';
import { detectSpecLevelFromParsed } from '../handler-utils.js';
import { applyPostInsertMetadata, hasReconsolidationCheckpoint } from './db-helpers.js';
import { buildScopePostInsertMetadata } from './create-record.js';
import type {
  AssistiveRecommendation,
  IndexResult,
  ReconsolidationFailureReason,
  ReconsolidationOperationResult,
  ReconWarningList,
} from './types.js';
export type { AssistiveClassification, AssistiveRecommendation } from './types.js';

const RECONSOLIDATION_SCOPE_FIELDS = [
  ['tenant_id', 'tenantId'],
  ['user_id', 'userId'],
  ['agent_id', 'agentId'],
  ['session_id', 'sessionId'],
] as const;

type RequestedScopeKey = typeof RECONSOLIDATION_SCOPE_FIELDS[number][1];
type RequestedScope = Record<RequestedScopeKey, string | null>;

interface StoredScopeSnapshot {
  id: number;
  tenant_id: string | null;
  user_id: string | null;
  agent_id: string | null;
  session_id: string | null;
  content_hash: string | null;
  updated_at: string | null;
  importance_tier: string | null;
}

export interface ScopeFilteredSearchResult {
  candidates: ReconsolidationResultCandidate[];
  suppressedCandidateIds: number[];
  /**
   * T-RCB-10 (R16-002): vector-search rows rejected as malformed — missing
   * id, file_path, or similarity.  Reported separately from scope-suppressed
   * ids so callers can distinguish data-integrity failures from ordinary
   * scope mismatches.
   */
  malformedCandidateCount: number;
  /**
   * T-RCB-09 (R12-003): original vector-search row count before scope/malformed
   * filtering trimmed the set.  When `rawCandidateCount > 0 && candidates.length === 0`,
   * the limit-pre-filter window or scope filter has starved otherwise-relevant
   * candidates.
   */
  rawCandidateCount: number;
}

export interface ReconsolidationResultCandidate extends Record<string, unknown> {
  id: number;
  file_path: string;
  title: string | null;
  content_text: string | null;
  similarity: number;
  spec_folder: string;
  importance_weight?: number;
  content_hash?: string | null;
  updated_at?: string | null;
  importance_tier?: string | null;
  tenant_id?: string | null;
  user_id?: string | null;
  agent_id?: string | null;
  session_id?: string | null;
}

// Feature catalog: Reconsolidation-on-save
// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Assistive reconsolidation (REQ-D4-005)

// ───────────────────────────────────────────────────────────────
// ASSISTIVE RECONSOLIDATION CONSTANTS (REQ-D4-005)
// ───────────────────────────────────────────────────────────────

/**
 * Similarity threshold above which assistive reconsolidation emits a
 * high-similarity compatibility note for near-duplicate memories.
 * No merge or archival side effects occur at this threshold.
 */
export const ASSISTIVE_COMPATIBILITY_NOTE_THRESHOLD = 0.96;

/**
 * Similarity threshold above which two memories are considered borderline
 * (possible supersede/complement).  A recommendation is logged but no
 * destructive action is taken.
 */
export const ASSISTIVE_REVIEW_THRESHOLD = 0.88;

/**
 * Check whether the assistive reconsolidation feature is enabled.
 * Default: ON (graduated). Set SPECKIT_ASSISTIVE_RECONSOLIDATION=false to disable.
 */
export function isAssistiveReconsolidationEnabled(): boolean {
  return _isAssistiveReconsolidationEnabled();
}

/**
 * Determine the assistive reconsolidation classification for a pair of memories
 * based on their similarity score.
 *
 * Tiers:
 *   similarity >= 0.96  → high-similarity compatibility note (internal auto_merge tier)
 *   0.88 <= sim < 0.96  → review (supersede or complement recommendation)
 *   sim < 0.88          → keep separate (complement)
 *
 * @param similarity - Cosine similarity in [0, 1]
 * @returns Classification string
 */
export function classifyAssistiveSimilarity(
  similarity: number
): 'auto_merge' | 'review' | 'keep_separate' {
  if (similarity >= ASSISTIVE_COMPATIBILITY_NOTE_THRESHOLD) return 'auto_merge';
  if (similarity >= ASSISTIVE_REVIEW_THRESHOLD)     return 'review';
  return 'keep_separate';
}

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
export function classifySupersededOrComplement(
  olderContent: string,
  newerContent: string
): 'supersede' | 'complement' {
  const olderLen = (olderContent ?? '').length;
  const newerLen = (newerContent ?? '').length;
  // Newer is substantially longer → it complements rather than replaces
  return newerLen > olderLen * 1.2 ? 'complement' : 'supersede';
}

/**
 * Log a borderline recommendation to the console (shadow-only).
 * No database writes are performed — this is purely observational.
 *
 * @param recommendation - The recommendation payload
 */
export function logAssistiveRecommendation(
  recommendation: AssistiveRecommendation
): void {
  console.warn(
    `[reconsolidation-bridge] assistive recommendation: ` +
    `${recommendation.classification} — ` +
    `older=${recommendation.olderMemoryId} newer=${recommendation.newerMemoryId ?? 'pending'} ` +
    `similarity=${recommendation.similarity.toFixed(3)}`
  );
}

/**
 * Result payload from reconsolidation pre-checks during memory_save.
 */
export interface ReconsolidationBridgeResult {
  earlyReturn: IndexResult | null;
  warnings: ReconWarningList;
  /** Populated when SPECKIT_ASSISTIVE_RECONSOLIDATION is enabled and a
   *  borderline pair is detected (review tier). */
  assistiveRecommendation?: AssistiveRecommendation | null;
  saveTimeReconsolidation: ReconsolidationOperationResult;
}

export interface ReconsolidationBridgeOptions {
  plannerMode?: SavePlannerMode;
}

function repairBm25Document(args: {
  memoryId: number;
  title: string | null;
  contentText: string;
  triggerPhrases: string[];
  filePath: string;
  contextLabel: string;
}): string | null {
  try {
    const bm25 = bm25Index.getIndex();
    const documentText = bm25Index.buildBm25DocumentText({
      title: args.title,
      content_text: args.contentText,
      trigger_phrases: args.triggerPhrases,
      file_path: args.filePath,
    });

    bm25.removeDocument(String(args.memoryId));
    bm25.addDocument(String(args.memoryId), documentText);
    return null;
  } catch (repairErr: unknown) {
    const repairMessage = toErrorMessage(repairErr);
    console.warn(`[memory-save] Immediate BM25 repair failed (${args.contextLabel}): ${repairMessage}`);
    return `BM25 repair failed after ${args.contextLabel} for memory ${args.memoryId}: ${repairMessage}`;
  }
}

function normalizeScopeValue(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function getRequestedScope(scope?: {
  tenantId?: string | null;
  userId?: string | null;
  agentId?: string | null;
  sessionId?: string | null;
}): RequestedScope {
  return {
    tenantId: normalizeScopeValue(scope?.tenantId),
    userId: normalizeScopeValue(scope?.userId),
    agentId: normalizeScopeValue(scope?.agentId),
    sessionId: normalizeScopeValue(scope?.sessionId),
  };
}

function hasGovernedScope(requestedScope: RequestedScope): boolean {
  return Object.values(requestedScope).some((value) => value !== null);
}

function extractCandidateId(candidate: Record<string, unknown>): number | null {
  return typeof candidate.id === 'number' && Number.isFinite(candidate.id) && candidate.id > 0
    ? candidate.id
    : null;
}

function readStoredScopeBatch(
  database: BetterSqlite3.Database,
  memoryIds: readonly number[],
): Map<number, StoredScopeSnapshot> {
  if (memoryIds.length === 0 || typeof database.prepare !== 'function') {
    return new Map();
  }

  const placeholders = memoryIds.map(() => '?').join(', ');
  const rows = database.prepare(`
    SELECT
      id,
      tenant_id,
      user_id,
      agent_id,
      session_id,
      content_hash,
      updated_at,
      importance_tier
    FROM memory_index
    WHERE id IN (${placeholders})
  `).all(...memoryIds) as StoredScopeSnapshot[];

  return new Map(rows.map((row) => [row.id, row]));
}

function candidateMatchesRequestedScope(
  scopeSource: Record<string, unknown>,
  requestedScope: RequestedScope,
): boolean {
  return RECONSOLIDATION_SCOPE_FIELDS.every(([column, key]) => (
    normalizeScopeValue(scopeSource[column]) === requestedScope[key]
  ));
}

/**
 * T-RCB-10 (R16-002): reject malformed vector-search rows instead of coercing
 * them into sentinel values.  A valid candidate must carry a positive integer
 * `id`, a non-empty `file_path`, and a finite numeric `similarity`.  Returning
 * `null` from this mapper tells `findScopeFilteredCandidates` to drop (and
 * report) the row rather than substitute a plausible-looking placeholder.
 */
function mapScopeFilteredCandidate(
  candidate: Record<string, unknown>,
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  storedScope?: StoredScopeSnapshot,
): ReconsolidationResultCandidate | null {
  const id = typeof candidate.id === 'number' && Number.isInteger(candidate.id) && candidate.id > 0
    ? candidate.id
    : null;
  const filePath = typeof candidate.file_path === 'string' && candidate.file_path.length > 0
    ? candidate.file_path
    : null;
  const similarityRaw = typeof candidate.similarity === 'number' && Number.isFinite(candidate.similarity)
    ? candidate.similarity
    : null;

  if (id === null || filePath === null || similarityRaw === null) {
    return null;
  }

  return {
    id,
    file_path: filePath,
    title: typeof candidate.title === 'string' ? candidate.title : null,
    content_text: typeof candidate.content_text === 'string'
      ? candidate.content_text
      : (typeof candidate.content === 'string' ? candidate.content : null),
    similarity: similarityRaw > 1 ? similarityRaw / 100 : similarityRaw,
    spec_folder: parsed.specFolder,
    importance_weight: typeof candidate.importance_weight === 'number'
      ? candidate.importance_weight
      : 0.5,
    content_hash: normalizeScopeValue(storedScope?.content_hash),
    updated_at: normalizeScopeValue(storedScope?.updated_at),
    importance_tier: normalizeScopeValue(storedScope?.importance_tier),
    tenant_id: normalizeScopeValue(storedScope?.tenant_id),
    user_id: normalizeScopeValue(storedScope?.user_id),
    agent_id: normalizeScopeValue(storedScope?.agent_id),
    session_id: normalizeScopeValue(storedScope?.session_id),
  };
}

export function findScopeFilteredCandidates(args: {
  database: BetterSqlite3.Database;
  embedding: Float32Array;
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
  requestedScope: RequestedScope;
  limit: number;
  minSimilarity: number;
  overfetchMultiplier?: number;
}): ScopeFilteredSearchResult {
  const rawCandidates = vectorIndex.vectorSearch(args.embedding, {
    limit: args.limit * (args.overfetchMultiplier ?? 1),
    specFolder: args.parsed.specFolder,
    minSimilarity: args.minSimilarity,
    includeConstitutional: false,
  });

  const candidateIds = rawCandidates
    .map((candidate) => extractCandidateId(candidate as Record<string, unknown>))
    .filter((candidateId): candidateId is number => candidateId != null);
  const scopeRows = hasGovernedScope(args.requestedScope)
    ? readStoredScopeBatch(args.database, candidateIds)
    : new Map<number, StoredScopeSnapshot>();

  const candidates: ReconsolidationResultCandidate[] = [];
  const suppressedCandidateIds: number[] = [];
  let malformedCandidateCount = 0;

  for (const rawCandidate of rawCandidates as Array<Record<string, unknown>>) {
    const candidateId = extractCandidateId(rawCandidate);
    const scopeSource = hasGovernedScope(args.requestedScope)
      ? (candidateId != null ? scopeRows.get(candidateId) : null)
      : rawCandidate;

    if (!scopeSource) {
      if (candidateId != null) {
        suppressedCandidateIds.push(candidateId);
      }
      continue;
    }

    if (!candidateMatchesRequestedScope(scopeSource as Record<string, unknown>, args.requestedScope)) {
      if (candidateId != null) {
        suppressedCandidateIds.push(candidateId);
      }
      continue;
    }

    const mapped = mapScopeFilteredCandidate(rawCandidate, args.parsed, scopeRows.get(candidateId ?? -1));
    if (mapped === null) {
      // T-RCB-10 (R16-002): reject rather than sentinel-substitute.
      malformedCandidateCount += 1;
      continue;
    }

    candidates.push(mapped);
    if (candidates.length >= args.limit) {
      break;
    }
  }

  return {
    candidates,
    suppressedCandidateIds,
    malformedCandidateCount,
    rawCandidateCount: rawCandidates.length,
  };
}

/**
 * T-RCB-09 (R11-004, R12-003): append a structured `scope_filter_suppressed_candidates`
 * warning to the shared recon warning carrier when the scope filter or overfetch window
 * silently drops in-scope candidates.  The plain-text warning remains for human
 * readability; the structured entry is what automation keys on.
 */
function recordScopeFilterSuppressionWarnings(
  searchResult: ScopeFilteredSearchResult,
  reconWarnings: ReconWarningList,
  contextLabel: string,
): void {
  const { candidates, suppressedCandidateIds, malformedCandidateCount, rawCandidateCount } = searchResult;
  const starved = rawCandidateCount > 0 && candidates.length === 0;
  const suppressedInScope = suppressedCandidateIds.length > 0 && candidates.length === 0;

  if (suppressedCandidateIds.length > 0 || starved || suppressedInScope) {
    if (!reconWarnings.structuredWarnings) {
      reconWarnings.structuredWarnings = [];
    }
    reconWarnings.structuredWarnings.push({
      code: 'scope_filter_suppressed_candidates',
      candidates: [...suppressedCandidateIds],
      message:
        `Scope filter dropped ${suppressedCandidateIds.length} candidate(s)` +
        (starved ? ` with no in-scope matches surviving (raw=${rawCandidateCount})` : '') +
        ` during ${contextLabel}.`,
    });
    reconWarnings.push(
      `[memory-save] ${contextLabel}: scope-filtered ${suppressedCandidateIds.length} candidate(s)` +
      (starved ? ` (all ${rawCandidateCount} raw candidates suppressed)` : '') +
      '.',
    );
  }

  if (malformedCandidateCount > 0) {
    reconWarnings.push(
      `[memory-save] ${contextLabel}: rejected ${malformedCandidateCount} malformed vector-search row(s).`,
    );
  }
}

function buildReconsolidationFailureResult(
  reason: ReconsolidationFailureReason,
  warnings: string[],
  persistedState?: ReconsolidationOperationResult['persistedState'],
): ReconsolidationOperationResult {
  return {
    status: 'failed',
    reason,
    ...(warnings.length > 0 ? { warnings } : {}),
    ...(persistedState ? { persistedState } : {}),
  };
}

function mapReconsolidationFailureReason(error: unknown): ReconsolidationFailureReason {
  const message = toErrorMessage(error);
  if (message.includes('checkpoint')) {
    return 'checkpoint_failed';
  }
  if (message.includes('conflict_stale_predecessor')) {
    return 'conflict_stale_predecessor';
  }
  if (message.includes('scope_retagged')) {
    return 'scope_retagged';
  }
  if (message.includes('similarity')) {
    return 'similarity_failed';
  }
  return 'conflict_failed';
}

/**
 * Runs reconsolidation when enabled and returns either an early tool response
 * or a signal to continue the standard create-record path.
 */
export async function runReconsolidationIfEnabled(
  database: BetterSqlite3.Database,
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  filePath: string,
  force: boolean,
  embedding: Float32Array | null,
  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null },
  options: ReconsolidationBridgeOptions = {},
): Promise<ReconsolidationBridgeResult> {
  // BUG-2 fix: Track reconsolidation warnings for structured MCP response (not just console.warn)
  const reconWarnings = [] as ReconWarningList;
  const plannerMode = options.plannerMode ?? 'plan-only';
  const allowSaveTimeReconsolidation = plannerMode === 'full-auto' || isSaveReconsolidationEnabled();
  const requestedScope = getRequestedScope(scope);
  let saveTimeReconsolidation: ReconsolidationOperationResult = {
    status: allowSaveTimeReconsolidation ? 'ran' : 'skipped',
    persistedState: {
      kind: allowSaveTimeReconsolidation ? 'create' : 'complement',
    },
  };

  // T-04: search-flags.ts is the canonical caller-visible opt-in gate.
  // Reconsolidation.ts keeps an internal guard as a defensive fallback for
  // Direct callers and future entry points.
  if (!force && allowSaveTimeReconsolidation && embedding) {
    let similarityFailureMessage: string | null = null;
    try {
      const hasCheckpoint = hasReconsolidationCheckpoint(database, parsed.specFolder);
      if (!hasCheckpoint) {
        const reconMsg = 'TM-06: reconsolidation skipped — create checkpoint "pre-reconsolidation" first';
        console.warn(`[memory-save] ${reconMsg}`);
        reconWarnings.push(reconMsg);
        saveTimeReconsolidation = {
          status: 'skipped',
          reason: 'checkpoint_missing',
          warnings: [reconMsg],
          persistedState: { kind: 'create' },
        };
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
              try {
                const searchEmb = emb instanceof Float32Array ? emb : new Float32Array(emb as number[]);
                const searchResult = findScopeFilteredCandidates({
                  database,
                  embedding: searchEmb,
                  parsed,
                  requestedScope,
                  limit: opts.limit ?? 3,
                  minSimilarity: 50,
                  overfetchMultiplier: 3,
                });
                // T-RCB-09/10 (R11-004, R12-003, R16-002): surface scope-filter
                // suppression + malformed-row rejection as structured warnings.
                recordScopeFilterSuppressionWarnings(
                  searchResult,
                  reconWarnings,
                  'save-time reconsolidation candidate lookup',
                );
                return searchResult.candidates;
              } catch (error: unknown) {
                similarityFailureMessage = toErrorMessage(error);
                throw error;
              }
            },
            storeMemory: (memory) => {
              const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
              const callbackSpecLevel = isSpecDocumentType(parsed.documentType)
                ? detectSpecLevelFromParsed(memory.filePath)
                : null;
              const memoryEncodingIntent = isEncodingIntentEnabled()
                ? classifyEncodingIntent(memory.content)
                : undefined;

              // P1-01 fix — wrap all DB writes (index, metadata, BM25, history) in a
              // Single transaction for atomicity. better-sqlite3 supports nested transactions
              // Via savepoints, so this is safe even if indexMemory uses its own transaction.
              const fileMetadata = incrementalIndex.getFileMetadata(memory.filePath);
              const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

              const memoryId = database.transaction(() => {
                const id = vectorIndex.indexMemory({
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

                applyPostInsertMetadata(database, id, {
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
                  ...buildScopePostInsertMetadata(scope),
                });

                if (bm25Index.isBm25Enabled()) {
                  try {
                    const bm25 = bm25Index.getIndex();
                    bm25.addDocument(String(id), bm25Index.buildBm25DocumentText({
                      title: memory.title,
                      content_text: memory.content,
                      trigger_phrases: memory.triggerPhrases ?? [],
                      file_path: memory.filePath,
                    }));
                  } catch (bm25Err: unknown) {
                    const message = toErrorMessage(bm25Err);
                    console.warn(`[memory-save] BM25 indexing failed (recon conflict store): ${message}`);
                    const bm25Warning = repairBm25Document({
                      memoryId: id,
                      title: memory.title,
                      contentText: memory.content,
                      triggerPhrases: memory.triggerPhrases ?? [],
                      filePath: memory.filePath,
                      contextLabel: 'recon conflict store',
                    });
                    if (bm25Warning) {
                      reconWarnings.push(bm25Warning);
                    }
                  }
                }

                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');

                return id;
              })();

              return memoryId;
            },
            generateEmbedding: async (content: string) => {
              return embeddings.generateDocumentEmbedding(content);
            },
          }
        );

        if (similarityFailureMessage) {
          const warning = `TM-06: Reconsolidation similarity search failed: ${similarityFailureMessage}`;
          reconWarnings.push(warning);
          return {
            earlyReturn: null,
            warnings: reconWarnings,
            saveTimeReconsolidation: buildReconsolidationFailureResult(
              'similarity_failed',
              [warning],
              { kind: 'create' },
            ),
          };
        }

        if (
          reconResult &&
          reconResult.action === 'conflict' &&
          'status' in reconResult
        ) {
          const failureReason =
            reconResult.status === 'scope_retagged'
              ? 'scope_retagged'
              : 'conflict_stale_predecessor';
          const failureWarnings = [
            ...reconWarnings,
            ...(reconResult.warnings ?? []),
            `TM-06: Conflict reconsolidation aborted: ${reconResult.status}`,
          ];
          return {
            earlyReturn: null,
            warnings: failureWarnings,
            saveTimeReconsolidation: buildReconsolidationFailureResult(
              failureReason,
              failureWarnings,
              {
                kind: 'conflict',
                existingMemoryId: reconResult.existingMemoryId,
                candidateMemoryIds: [reconResult.existingMemoryId],
              },
            ),
          };
        }

        if (reconResult && reconResult.action !== 'complement') {
          // Reconsolidation handled the memory (merge or conflict) — skip normal CREATE path
          console.error(`[memory-save] TM-06: Reconsolidation ${reconResult.action} for ${path.basename(filePath)}`);

          const reconId = reconResult.newMemoryId;

          const ledgerRecorded = appendMutationLedgerSafe(database, {
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
          const earlyReturnWarnings = [
            ...reconWarnings,
            ...(reconResult.warnings ?? []),
            ...(!ledgerRecorded ? ['Mutation ledger append failed; audit trail may be incomplete.'] : []),
          ];

          return {
            earlyReturn: {
              status: reconResult.action === 'merge' ? 'merged' : 'superseded',
              id: reconId,
              specFolder: parsed.specFolder,
              title: parsed.title ?? '',
              reconsolidation: reconResult,
              message: `Reconsolidation: ${reconResult.action} (similarity: ${reconResult.similarity?.toFixed(3) ?? 'N/A'})`,
              warnings: earlyReturnWarnings.length > 0 ? earlyReturnWarnings : undefined,
            },
            warnings: reconWarnings,
            saveTimeReconsolidation: {
              status: 'ran',
              ...(reconResult.warnings?.length ? { warnings: reconResult.warnings } : {}),
              persistedState: {
                kind: reconResult.action,
                id: reconId,
                existingMemoryId: reconResult.existingMemoryId,
              },
            },
          };
        }
        saveTimeReconsolidation = {
          status: 'ran',
          persistedState: {
            kind: reconResult?.action === 'complement' ? 'complement' : 'create',
            id: reconResult?.newMemoryId,
          },
        };
        // ReconResult is null or complement — fall through to normal CREATE path
      }
    } catch (reconErr: unknown) {
      const message = toErrorMessage(reconErr);
      const warning = `[memory-save] TM-06: Reconsolidation error: ${message}`;
      console.warn(warning);
      reconWarnings.push(warning);
      return {
        earlyReturn: null,
        warnings: reconWarnings,
        saveTimeReconsolidation: buildReconsolidationFailureResult(
          mapReconsolidationFailureReason(reconErr),
          [warning],
          { kind: 'create' },
        ),
      };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // ASSISTIVE RECONSOLIDATION (REQ-D4-005)
  // Runs independently of the TM-06 flag.  Requires embedding.
  // Does NOT block normal save — all actions are advisory or
  // shadow-only (auto-merge at >= 0.96 only archives old record).
  // ─────────────────────────────────────────────────────────────
  let assistiveRecommendation: AssistiveRecommendation | null = null;

  if (!force && allowSaveTimeReconsolidation && isAssistiveReconsolidationEnabled() && embedding) {
    try {
      // Find the top similar memory using the existing vector search
      const searchEmb = embedding instanceof Float32Array ? embedding : new Float32Array(embedding as number[]);
      const assistiveSearchResult = findScopeFilteredCandidates({
        database,
        embedding: searchEmb,
        parsed,
        requestedScope,
        limit: 3,
        minSimilarity: Math.round(ASSISTIVE_REVIEW_THRESHOLD * 100),
      });
      // T-RCB-09/10 (R11-004, R12-003, R16-002): surface assistive-lookup
      // scope-filter suppression and malformed rows alongside the save path.
      recordScopeFilterSuppressionWarnings(
        assistiveSearchResult,
        reconWarnings,
        'assistive reconsolidation candidate lookup',
      );
      const scopedCandidates = assistiveSearchResult.candidates;

      if (scopedCandidates.length > 0) {
        const top = scopedCandidates[0] as Record<string, unknown>;
        // vectorSearch returns similarity in [0, 100], normalise to [0, 1]
        const rawSimilarity = typeof top.similarity === 'number' ? top.similarity : 0;
        const similarity = rawSimilarity > 1 ? rawSimilarity / 100 : rawSimilarity;
        const topId = typeof top.id === 'number' ? top.id : 0;
        const topContent = typeof top.content_text === 'string' ? top.content_text :
                          (typeof top.content === 'string' ? top.content : '');

        const tier = classifyAssistiveSimilarity(similarity);

        if (tier === 'auto_merge') {
          console.warn(
            `[reconsolidation-bridge] assistive high-similarity compatibility note: ` +
            `older=${topId} similarity=${similarity.toFixed(3)}; archived-tier side effects are disabled`
          );
        } else if (tier === 'review') {
          // Review tier: classify and surface as recommendation (no mutations)
          const classification = classifySupersededOrComplement(topContent, parsed.content);
          assistiveRecommendation = {
            action: 'review',
            candidateMemoryIds: [topId],
            description:
              `Review borderline similarity ${similarity.toFixed(3)} between the pending save ` +
              `and existing memory #${topId}; heuristic suggests ${classification}.`,
            olderMemoryId: topId,
            newerMemoryId: null,
            similarity,
            classification,
            recommendedAt: Date.now(),
          };
          // Preserve the advisory payload on the warning carrier so the normal save
          // path can forward it without widening the handler signature.
          reconWarnings.assistiveRecommendation = assistiveRecommendation;
          logAssistiveRecommendation(assistiveRecommendation);
        }
        // 'keep_separate' → no action, fall through to normal save
      }
    } catch (assistiveErr: unknown) {
      // T-RCB-11 (R19-002): do not silently fall open. Surface assistive failures
      // as a structured warning + machine-readable status on the save-time recon
      // result so callers can route to remediation.  The ordinary save still
      // proceeds (assistive is advisory), but the failure is now auditable.
      const message = toErrorMessage(assistiveErr);
      const assistiveWarning = `[memory-save] Assistive reconsolidation error: ${message}`;
      console.warn(
        `[reconsolidation-bridge] assistive reconsolidation error (proceeding with normal save): ${message}`
      );
      reconWarnings.push(assistiveWarning);
      const priorWarnings = saveTimeReconsolidation.warnings ?? [];
      saveTimeReconsolidation = {
        ...saveTimeReconsolidation,
        status: 'partial',
        reason: 'assistive_failed',
        warnings: [...priorWarnings, assistiveWarning],
      };
    }
  }

  return {
    earlyReturn: null,
    warnings: reconWarnings,
    assistiveRecommendation,
    saveTimeReconsolidation,
  };
}
