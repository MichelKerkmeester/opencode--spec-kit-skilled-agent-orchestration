// ---------------------------------------------------------------
// MODULE: Response Builder
// ---------------------------------------------------------------

import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser';

import * as predictionErrorGate from '../../lib/cache/cognitive/prediction-error-gate';
import * as retryManager from '../../lib/providers/retry-manager';
import { runConsolidationCycleIfEnabled } from '../../lib/storage/consolidation';
import { createMCPSuccessResponse } from '../../lib/response/envelope';
import { requireDb, toErrorMessage } from '../../utils';

import { appendMutationLedgerSafe } from '../memory-crud-utils';
import { runPostMutationHooks } from '../mutation-hooks';
import type { MCPResponse } from '../types';
import { buildMutationHookFeedback } from '../../hooks/mutation-feedback';
import type { IndexResult } from './types';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface PeDecision {
  action: string;
  similarity: number;
  existingMemoryId?: number | null;
  reason?: string;
  contradiction?: { detected: boolean; type: string | null; description: string | null; confidence: number } | null;
}

interface CausalLinksResult {
  processed: number;
  inserted: number;
  resolved: number;
  unresolved: { type: string; reference: string }[];
  errors: { type: string; reference: string; error: string }[];
}

interface BuildIndexResultParams {
  database: BetterSqlite3.Database;
  existing: { id: number; content_hash: string } | undefined;
  embeddingStatus: string;
  id: number;
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
  validation: ValidationResult;
  reconWarnings: string[];
  peDecision: PeDecision;
  embeddingFailureReason: string | null;
  asyncEmbedding: boolean;
  causalLinksResult: CausalLinksResult | null;
  filePath: string;
}

interface BuildSaveResponseParams {
  result: IndexResult;
  filePath: string;
  asyncEmbedding: boolean;
  requestId: string;
}

export function buildIndexResult({
  database,
  existing,
  embeddingStatus,
  id,
  parsed,
  validation,
  reconWarnings,
  peDecision,
  embeddingFailureReason,
  asyncEmbedding,
  causalLinksResult,
  filePath,
}: BuildIndexResultParams): IndexResult {
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
    id,
    specFolder: parsed.specFolder,
    title: parsed.title ?? '',
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    memoryType: parsed.memoryType,
    memoryTypeSource: parsed.memoryTypeSource,
    embeddingStatus,
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
      unresolved_count: causalLinksResult.unresolved.length,
    };
    if (causalLinksResult.errors.length > 0) {
      (result.causalLinks as Record<string, unknown>).errors = causalLinksResult.errors;
    }
  }

  return result;
}

export function buildSaveResponse({ result, filePath, asyncEmbedding, requestId }: BuildSaveResponseParams): MCPResponse {
  if (result.status === 'unchanged') {
    return createMCPSuccessResponse({
      tool: 'memory_save',
      summary: 'Memory already indexed with same content',
      data: {
        status: 'unchanged',
        id: result.id,
        specFolder: result.specFolder,
        title: result.title,
      },
      hints: ['Use force: true to re-index anyway'],
    });
  }

  const shouldEmitPostMutationFeedback = result.status !== 'duplicate';
  let postMutationFeedback: ReturnType<typeof buildMutationHookFeedback> | null = null;
  if (shouldEmitPostMutationFeedback) {
    let postMutationHooks: import('../mutation-hooks').MutationHookResult;
    try {
      postMutationHooks = runPostMutationHooks('save', { specFolder: result.specFolder, filePath });
    } catch {
      postMutationHooks = {
        latencyMs: 0, triggerCacheCleared: false,
        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
        graphSignalsCacheCleared: false, coactivationCacheCleared: false,
      };
    }
    postMutationFeedback = buildMutationHookFeedback('save', postMutationHooks);
  }

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
    message: result.message ?? (result.status === 'duplicate' ? 'Memory skipped (duplicate content)' : `Memory ${result.status} successfully`),
  };
  if (postMutationFeedback) {
    response.postMutationHooks = postMutationFeedback.data;
  }

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

  if (postMutationFeedback) {
    hints.push(...postMutationFeedback.hints);
  } else if (result.status === 'duplicate') {
    hints.push('Duplicate content matched an existing indexed memory, so caches were left unchanged');
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
    hints,
  });
}
