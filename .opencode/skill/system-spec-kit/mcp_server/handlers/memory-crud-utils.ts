// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Utils
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import * as mutationLedger from '../lib/storage/mutation-ledger.js';
import { toErrorMessage } from '../utils/index.js';

import type { DatabaseExtended } from './types.js';
import type { MemoryHashSnapshot, MutationLedgerInput } from './memory-crud-types.js';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Memory metadata update (memory_update)
// Feature catalog: Single and folder delete (memory_delete)


/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

/** Retrieve a memory's hash snapshot from the database. Returns null if unavailable. */
function getMemoryHashSnapshot(database: DatabaseExtended | null, memoryId: number): MemoryHashSnapshot | null {
  if (!database || !('prepare' in database)) {
    return null;
  }

  try {
    const row = database.prepare(`
      SELECT id, content_hash, spec_folder, file_path
      FROM memory_index
      WHERE id = ?
    `).get(memoryId) as MemoryHashSnapshot | undefined;

    return row ?? null;
  } catch (_err: unknown) {
    return null;
  }
}

/**
 * Safely append a mutation to the ledger. Returns false on failure so callers
 * can surface warnings in their MCP responses (F1.10 fix).
 */
function appendMutationLedgerSafe(database: DatabaseExtended | null, input: MutationLedgerInput): boolean {
  if (!database) {
    return false;
  }

  try {
    mutationLedger.initLedger(database as Parameters<typeof mutationLedger.initLedger>[0]);
    mutationLedger.appendEntry(database as Parameters<typeof mutationLedger.appendEntry>[0], {
      mutation_type: input.mutationType,
      reason: input.reason,
      prior_hash: input.priorHash,
      new_hash: input.newHash,
      linked_memory_ids: input.linkedMemoryIds,
      decision_meta: input.decisionMeta,
      actor: input.actor,
      session_id: input.sessionId ?? null,
    });
    return true;
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn(`[memory-crud] mutation ledger append failed: ${message}`);
    return false;
  }
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  getMemoryHashSnapshot,
  appendMutationLedgerSafe,
};
