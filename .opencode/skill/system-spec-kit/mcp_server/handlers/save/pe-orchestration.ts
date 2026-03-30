// ───────────────────────────────────────────────────────────────
// MODULE: Pe Orchestration
// ───────────────────────────────────────────────────────────────
import type Database from 'better-sqlite3';

import * as predictionErrorGate from '../../lib/cognitive/prediction-error-gate.js';
import type { ParsedMemory } from '../../lib/parsing/memory-parser.js';
import { getMemoryHashSnapshot, appendMutationLedgerSafe } from '../memory-crud-utils.js';
import {
  findSimilarMemories,
  reinforceExistingMemory,
  updateExistingMemory,
  logPeDecision,
} from '../pe-gating.js';
import type { PeDecision, SimilarMemory, IndexResult } from './types.js';

// Feature catalog: Prediction-error save arbitration
// Feature catalog: Memory indexing (memory_save)


export interface PeOrchestrationResult {
  decision: PeDecision;
  earlyReturn: IndexResult | null;
  supersededId: number | null;
}

export function evaluateAndApplyPeDecision(
  database: Database.Database,
  parsed: ParsedMemory,
  embedding: Float32Array | null,
  force: boolean,
  validationWarnings: string[] | undefined,
  embeddingStatus: string,
  filePath: string,
  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
): PeOrchestrationResult {
  let peDecision: PeDecision = { action: 'CREATE', similarity: 0 };
  let candidates: SimilarMemory[] = [];
  let supersededId: number | null = null;

  if (!force && embedding) {
    candidates = findSimilarMemories(embedding, {
      limit: 5,
      specFolder: parsed.specFolder,
      tenantId: scope?.tenantId,
      userId: scope?.userId,
      agentId: scope?.agentId,
      sessionId: scope?.sessionId,
      sharedSpaceId: scope?.sharedSpaceId,
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
        console.error(`[PE-Gate] REINFORCE: Duplicate detected (${peDecision.similarity.toFixed(1)}%)`);
        const reinforced = reinforceExistingMemory(existingId, parsed);
        reinforced.pe_action = 'REINFORCE';
        reinforced.pe_reason = peDecision.reason;
        reinforced.warnings = validationWarnings;
        reinforced.embeddingStatus = embeddingStatus;

        if (reinforced.status !== 'error') {
          const ledgerRecorded = appendMutationLedgerSafe(database, {
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
          if (!ledgerRecorded) {
            reinforced.warnings = [
              ...(Array.isArray(reinforced.warnings) ? reinforced.warnings : validationWarnings ?? []),
              'Mutation ledger append failed; audit trail may be incomplete.',
            ];
          }
        }

        return { decision: peDecision, earlyReturn: reinforced, supersededId: null };
      }

      case predictionErrorGate.ACTION.SUPERSEDE: {
        const existingId = peDecision.existingMemoryId as number;
        console.error(`[PE-Gate] SUPERSEDE: Contradiction detected with memory ${existingId}`);
        // Defer markMemorySuperseded() to caller — it must run AFTER the new
        // record is created, inside the same transaction, to avoid orphaning
        // the old record if new-record creation fails (F1.01).
        supersededId = existingId;
        break;
      }

      case predictionErrorGate.ACTION.UPDATE: {
        const existingId = peDecision.existingMemoryId as number;
        const priorSnapshot = getMemoryHashSnapshot(database, existingId);
        console.error(`[PE-Gate] UPDATE: High similarity (${peDecision.similarity.toFixed(1)}%), updating existing`);
        if (!embedding) {
          console.warn(
            '[Memory Save] embedding unexpectedly null in UPDATE path, falling through to CREATE'
          );
          break;
        }
        const updated = updateExistingMemory(existingId, parsed, embedding);
        updated.pe_action = 'UPDATE';
        updated.pe_reason = peDecision.reason;
        updated.warnings = validationWarnings;
        updated.embeddingStatus = embeddingStatus;

        const ledgerRecorded = appendMutationLedgerSafe(database, {
          mutationType: 'update',
          reason: 'memory_save: updated existing memory via prediction-error gate',
          priorHash: priorSnapshot?.content_hash ?? null,
          newHash: parsed.contentHash,
          linkedMemoryIds: updated.status === 'error' ? [existingId] : [existingId, updated.id],
          decisionMeta: {
            tool: 'memory_save',
            action: predictionErrorGate.ACTION.UPDATE,
            similarity: peDecision.similarity,
            specFolder: parsed.specFolder,
            filePath,
          },
          actor: 'mcp:memory_save',
        });
        if (!ledgerRecorded) {
          updated.warnings = [
            ...(Array.isArray(updated.warnings) ? updated.warnings : validationWarnings ?? []),
            'Mutation ledger append failed; audit trail may be incomplete.',
          ];
        }

        return { decision: peDecision, earlyReturn: updated, supersededId: null };
      }

      case predictionErrorGate.ACTION.CREATE_LINKED: {
        console.error(`[PE-Gate] CREATE_LINKED: Related content (${peDecision.similarity.toFixed(1)}%)`);
        break;
      }

      case predictionErrorGate.ACTION.CREATE:
      default:
        if (peDecision.similarity > 0) {
          console.error(`[PE-Gate] CREATE: Low similarity (${peDecision.similarity.toFixed(1)}%)`);
        }
        break;
    }
  }

  return {
    decision: peDecision,
    earlyReturn: null,
    supersededId,
  };
}
