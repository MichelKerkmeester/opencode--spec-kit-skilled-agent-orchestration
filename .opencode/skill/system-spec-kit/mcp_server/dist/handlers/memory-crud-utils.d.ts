import type { DatabaseExtended } from './types.js';
import type { MemoryHashSnapshot, MutationLedgerInput } from './memory-crud-types.js';
/** Retrieve a memory's hash snapshot from the database. Returns null if unavailable. */
declare function getMemoryHashSnapshot(database: DatabaseExtended | null, memoryId: number): MemoryHashSnapshot | null;
/**
 * Safely append a mutation to the ledger. Returns false on failure so callers
 * can surface warnings in their MCP responses (F1.10 fix).
 */
declare function appendMutationLedgerSafe(database: DatabaseExtended | null, input: MutationLedgerInput): boolean;
export { getMemoryHashSnapshot, appendMutationLedgerSafe, };
//# sourceMappingURL=memory-crud-utils.d.ts.map