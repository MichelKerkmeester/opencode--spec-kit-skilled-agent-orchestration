// ───────────────────────────────────────────────────────────────
// MODULE: Response Builder
// ───────────────────────────────────────────────────────────────
import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser.js';

import * as predictionErrorGate from '../../lib/cognitive/prediction-error-gate.js';
import * as retryManager from '../../lib/providers/retry-manager.js';
import { runConsolidationCycleIfEnabled } from '../../lib/storage/consolidation.js';
import { createMCPErrorResponse, createMCPSuccessResponse } from '../../lib/response/envelope.js';
import { requireDb, toErrorMessage } from '../../utils/index.js';

import { appendMutationLedgerSafe } from '../memory-crud-utils.js';
import { runPostMutationHooks } from '../mutation-hooks.js';
import type { MCPResponse } from '../types.js';
import { buildMutationHookFeedback } from '../../hooks/mutation-feedback.js';
import type {
  AssistiveRecommendation,
  IndexResult,
  PeDecision,
  ReconWarningList,
} from './types.js';
import type { EnrichmentStatus } from './post-insert.js';
import { MEMORY_SUFFICIENCY_REJECTION_CODE } from '@spec-kit/shared/parsing/memory-sufficiency';

// Feature catalog: Mutation response UX payload exposure
// Feature catalog: Duplicate-save no-op feedback hardening
// Feature catalog: Atomic-save parity and partial-indexing hints


interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
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
  reconWarnings: ReconWarningList;
  peDecision: PeDecision;
  embeddingFailureReason: string | null;
  asyncEmbedding: boolean;
  causalLinksResult: CausalLinksResult | null;
  enrichmentStatus?: EnrichmentStatus;
  filePath: string;
}

interface BuildSaveResponseParams {
  result: IndexResult;
  filePath: string;
  asyncEmbedding: boolean;
  requestId: string;
}

function buildAssistiveReviewDescription(
  recommendation: Pick<
    AssistiveRecommendation,
    'classification' | 'olderMemoryId' | 'newerMemoryId' | 'similarity'
  >,
): string {
  const newerLabel = recommendation.newerMemoryId != null
    ? `saved memory #${recommendation.newerMemoryId}`
    : 'the pending save';
  return (
    `Review borderline similarity ${recommendation.similarity.toFixed(3)} between ` +
    `${newerLabel} and existing memory #${recommendation.olderMemoryId}; ` +
    `heuristic suggests ${recommendation.classification}.`
  );
}

function finalizeAssistiveRecommendation(
  reconWarnings: ReconWarningList,
  savedMemoryId: number,
): AssistiveRecommendation | undefined {
  const rawRecommendation = reconWarnings.assistiveRecommendation;
  if (!rawRecommendation) return undefined;

  const candidateMemoryIds = Array.from(
    new Set([
      ...rawRecommendation.candidateMemoryIds,
      rawRecommendation.olderMemoryId,
      savedMemoryId,
    ].filter((memoryId) => Number.isInteger(memoryId) && memoryId > 0)),
  );

  const newerMemoryId = rawRecommendation.newerMemoryId ?? savedMemoryId;
  return {
    ...rawRecommendation,
    newerMemoryId,
    candidateMemoryIds,
    description: buildAssistiveReviewDescription({
      classification: rawRecommendation.classification,
      olderMemoryId: rawRecommendation.olderMemoryId,
      newerMemoryId,
      similarity: rawRecommendation.similarity,
    }),
  };
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
  enrichmentStatus,
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
  const ledgerRecorded = appendMutationLedgerSafe(database, {
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
  if (!ledgerRecorded) {
    result.warnings = result.warnings || [];
    result.warnings.push('Mutation ledger append failed; audit trail may be incomplete.');
  }

  const assistiveRecommendation = finalizeAssistiveRecommendation(reconWarnings, id);
  if (assistiveRecommendation) {
    result.assistiveRecommendation = assistiveRecommendation;
  }

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
    // Security: raw provider errors sanitized before persistence/response
    result.embeddingFailureReason = retryManager.sanitizeEmbeddingFailureMessage(embeddingFailureReason) ?? undefined;
    result.message = 'Memory saved with deferred indexing - searchable via BM25/FTS5';
  }

  if (asyncEmbedding && embeddingStatus === 'pending') {
    const memoryId = id;
    const memoryContent = parsed.content;
    setImmediate(() => {
      retryManager.claimAndRetryEmbedding(memoryId, memoryContent, 'pending')
        .then((retryResult) => {
          if (retryResult && !retryResult.success && retryResult.error) {
            console.warn(`[memory-save] T306: Immediate async embedding attempt failed for #${memoryId}: ${retryResult.error}`);
          }
        })
        .catch((err: unknown) => {
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

  // C5-6: Surface enrichment gaps when any step failed
  if (enrichmentStatus && Object.values(enrichmentStatus).some(v => !v)) {
    const failed = Object.entries(enrichmentStatus)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    result.warnings = result.warnings || [];
    result.warnings.push(`Partial enrichment: ${failed.join(', ')} failed`);
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

  if (result.status === 'error') {
    const errorMessage = typeof result.error === 'string' && result.error.length > 0
      ? result.error
      : (typeof result.message === 'string' && result.message.length > 0 ? result.message : 'Memory save failed');

    return createMCPErrorResponse({
      tool: 'memory_save',
      error: errorMessage,
      code: 'E081',
      details: {
        status: result.status,
        id: result.id,
        specFolder: result.specFolder,
        title: result.title,
        ...(typeof result.superseded === 'boolean' ? { superseded: result.superseded } : {}),
      },
    });
  }

  if (result.status === 'rejected') {
    const isInsufficientContext = result.rejectionCode === MEMORY_SUFFICIENCY_REJECTION_CODE;
    return createMCPSuccessResponse({
      tool: 'memory_save',
      summary: result.message ?? result.rejectionReason ?? 'Memory save rejected',
      data: {
        status: 'rejected',
        id: result.id,
        specFolder: result.specFolder,
        title: result.title,
        qualityScore: result.qualityScore,
        qualityFlags: result.qualityFlags,
        ...(result.rejectionCode ? { rejectionCode: result.rejectionCode } : {}),
        rejectionReason: result.rejectionReason ?? result.message,
        ...(result.sufficiency ? { sufficiency: result.sufficiency } : {}),
        ...(result.qualityGate ? { qualityGate: result.qualityGate } : {}),
        ...(result.warnings ? { warnings: result.warnings } : {}),
        message: result.message ?? result.rejectionReason ?? 'Memory save rejected',
      },
      hints: isInsufficientContext
        ? [
            'Rejected saves do not mutate the memory index',
            'Not enough context was available to save a durable memory',
            'Add at least one concrete file, tool result, decision, blocker, next action, or outcome and retry',
            'Use dryRun: true to inspect insufficiency reasons and evidence counts without writing',
          ]
        : ['Rejected saves do not mutate the memory index', 'Review quality issues and retry the save'],
    });
  }

  const shouldEmitPostMutationFeedback = result.status !== 'duplicate' && result.status !== 'unchanged';
  let postMutationFeedback: ReturnType<typeof buildMutationHookFeedback> | null = null;
  if (shouldEmitPostMutationFeedback) {
    let postMutationHooks: import('../mutation-hooks.js').MutationHookResult;
    try {
      postMutationHooks = runPostMutationHooks('save', { specFolder: result.specFolder, filePath });
    } catch (hookError: unknown) {
      const msg = hookError instanceof Error ? hookError.message : String(hookError);
      postMutationHooks = {
        latencyMs: 0, triggerCacheCleared: false,
        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
        graphSignalsCacheCleared: false, coactivationCacheCleared: false,
        errors: [msg],
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
  if (result.assistiveRecommendation) {
    response.assistiveRecommendation = result.assistiveRecommendation;
  }
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
    // Preserve typed warnings with categories for programmatic consumers
    response.warnings = result.warnings;
    const typedWarnings: Array<{ category: string; message: string }> = result.warnings.map(
      (w: string | { category: string; message: string }) => {
        if (typeof w === 'string' && w.startsWith('[file-persistence-failed]')) {
          return { category: 'file-persistence-failed', message: w.slice('[file-persistence-failed] '.length) };
        }
        return typeof w === 'string' ? { category: 'anchor-issues', message: w } : w;
      }
    );
    (response as Record<string, unknown>).typedWarnings = typedWarnings;
    const persistenceWarnings = typedWarnings.filter(w => w.category === 'file-persistence-failed');
    const anchorWarnings = typedWarnings.filter(w => w.category !== 'file-persistence-failed');
    const parts: string[] = [];
    if (anchorWarnings.length > 0) parts.push(`${anchorWarnings.length} anchor issue(s)`);
    if (persistenceWarnings.length > 0) parts.push(`${persistenceWarnings.length} file-persistence warning(s)`);
    response.message = `${response.message} (with ${parts.join(', ')})`;
  }

  if (result.embeddingStatus) {
    response.embeddingStatus = result.embeddingStatus;
    if (result.embeddingStatus === 'pending') {
      response.message = `${response.message} (deferred indexing - searchable via BM25/FTS5)`;
      if (result.embeddingFailureReason) {
        response.embeddingFailureReason = retryManager.sanitizeEmbeddingFailureMessage(result.embeddingFailureReason);
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

  // the rollout N3-lite runtime integration (flag-gated)
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
