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

function getRequestedScope(scope?: {
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

function readStoredScope(
  database: BetterSqlite3.Database,
  memoryId: number,
): Record<string, unknown> | null {
  if (memoryId <= 0 || typeof database.prepare !== 'function') {
    return null;
  }

  const storedScope = database.prepare(`
    SELECT tenant_id, user_id, agent_id, session_id
    FROM memory_index
    WHERE id = ?
  `).get(memoryId) as Record<string, unknown> | undefined;
  return storedScope ?? null;
}

function candidateMatchesRequestedScope(
  database: BetterSqlite3.Database,
  candidate: Record<string, unknown>,
  requestedScope: RequestedScope,
): boolean {
  const requiresGovernedLookup = hasGovernedScope(requestedScope);
  const candidateId = typeof candidate.id === 'number' ? candidate.id : 0;
  const scopeSource = requiresGovernedLookup
    ? readStoredScope(database, candidateId)
    : candidate;

  if (!scopeSource) {
    return false;
  }

  return RECONSOLIDATION_SCOPE_FIELDS.every(([column, key]) => (
    normalizeScopeValue(scopeSource[column]) === requestedScope[key]
  ));
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

  // T-04: search-flags.ts is the canonical caller-visible opt-in gate.
  // Reconsolidation.ts keeps an internal guard as a defensive fallback for
  // Direct callers and future entry points.
  if (!force && allowSaveTimeReconsolidation && embedding) {
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
              const searchEmb = emb instanceof Float32Array ? emb : new Float32Array(emb as number[]);
              const results = vectorIndex.vectorSearch(searchEmb, {
                limit: (opts.limit ?? 3) * 3, // Over-fetch for post-scope-filter
                specFolder: opts.specFolder,
                minSimilarity: 50,
                includeConstitutional: false,
              });
              // Fail closed: reconsolidation can only consider candidates whose
              // stored governance scope exactly matches the incoming save scope.
              const scopeFiltered = results.filter((r: Record<string, unknown>) => (
                candidateMatchesRequestedScope(database, r, requestedScope)
              )).slice(0, opts.limit ?? 3);
              return scopeFiltered.map((r: Record<string, unknown>) => ({
                id: typeof r.id === 'number' ? r.id : 0,
                file_path: typeof r.file_path === 'string' ? r.file_path : '',
                title: typeof r.title === 'string' ? r.title : null,
                content_text: typeof r.content_text === 'string' ? r.content_text : (typeof r.content === 'string' ? r.content : null),
                similarity: (typeof r.similarity === 'number' ? r.similarity : 0) / 100,
                spec_folder: parsed.specFolder,
                importance_weight: typeof r.importance_weight === 'number'
                  ? r.importance_weight
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
          };
        }
        // ReconResult is null or complement — fall through to normal CREATE path
      }
    } catch (reconErr: unknown) {
      const message = toErrorMessage(reconErr);
      console.warn(`[memory-save] TM-06: Reconsolidation error (proceeding with normal save): ${message}`);
      // Reconsolidation errors must not block saves
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
      const candidateResults = vectorIndex.vectorSearch(searchEmb, {
        limit: 3,
        specFolder: parsed.specFolder,
        minSimilarity: Math.round(ASSISTIVE_REVIEW_THRESHOLD * 100), // convert to 0-100 scale
        includeConstitutional: false,
      });
      const scopedCandidates = candidateResults.filter((candidate: Record<string, unknown>) => (
        candidateMatchesRequestedScope(database, candidate, requestedScope)
      ));

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
      const message = toErrorMessage(assistiveErr);
      console.warn(
        `[reconsolidation-bridge] assistive reconsolidation error (proceeding with normal save): ${message}`
      );
      // Errors must not block saves
    }
  }

  return {
    earlyReturn: null,
    warnings: reconWarnings,
    assistiveRecommendation,
  };
}
