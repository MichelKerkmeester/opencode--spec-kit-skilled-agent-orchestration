// ---------------------------------------------------------------
// MODULE: Memory Crud Utils
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import * as mutationLedger from '../lib/storage/mutation-ledger';
import { toErrorMessage } from '../utils';

import type { DatabaseExtended } from './types';
import type { MemoryHashSnapshot, MutationLedgerInput } from './memory-crud-types';

/* ---------------------------------------------------------------
   HELPERS
--------------------------------------------------------------- */

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

/** Safely append a mutation to the ledger. Swallows errors to avoid disrupting the caller. */
function appendMutationLedgerSafe(database: DatabaseExtended | null, input: MutationLedgerInput): void {
  if (!database) {
    return;
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
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn(`[memory-crud] mutation ledger append failed: ${message}`);
  }
}

/* ---------------------------------------------------------------
   EXPORTS
--------------------------------------------------------------- */

export {
  getMemoryHashSnapshot,
  appendMutationLedgerSafe,
};
