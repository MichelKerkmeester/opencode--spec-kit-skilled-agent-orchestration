// ------- MODULE: Memory CRUD Types -------

/* ---------------------------------------------------------------
   TYPES
--------------------------------------------------------------- */

/** Arguments for the memory_delete handler. */
interface DeleteArgs {
  id?: number | string;
  specFolder?: string;
  confirm?: boolean;
}

/** Arguments for the memory_update handler. */
interface UpdateArgs {
  id: number;
  title?: string;
  triggerPhrases?: string[];
  importanceWeight?: number;
  importanceTier?: string;
  allowPartialUpdate?: boolean;
}

/** Arguments for the memory_list handler. */
interface ListArgs {
  limit?: number;
  offset?: number;
  specFolder?: string;
  sortBy?: string;
  includeChunks?: boolean;
}

/** Arguments for the memory_stats handler. */
interface StatsArgs {
  folderRanking?: string;
  excludePatterns?: string[];
  includeScores?: boolean;
  includeArchived?: boolean;
  limit?: number;
}

/** Arguments for the memory_health handler (currently unused). */
interface HealthArgs {
  reportMode?: 'full' | 'divergent_aliases';
  limit?: number;
  specFolder?: string;
  autoRepair?: boolean;
}

/** Embedding provider metadata returned by the health check. */
interface ProviderMetadata {
  provider: string;
  model: string;
  healthy?: boolean;
}

/** Snapshot of a memory's hash state for mutation tracking. */
interface MemoryHashSnapshot {
  id: number;
  content_hash: string | null;
  spec_folder?: string | null;
  file_path?: string | null;
}

/** Valid mutation types for the CRUD ledger. */
type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';

/** Input parameters for recording a mutation in the ledger. */
interface MutationLedgerInput {
  mutationType: CrudMutationType;
  reason: string;
  priorHash: string | null;
  newHash: string;
  linkedMemoryIds: number[];
  decisionMeta: Record<string, unknown>;
  actor: string;
  sessionId?: string | null;
}

/* ---------------------------------------------------------------
   EXPORTS
--------------------------------------------------------------- */

export type {
  DeleteArgs,
  UpdateArgs,
  ListArgs,
  StatsArgs,
  HealthArgs,
  ProviderMetadata,
  MemoryHashSnapshot,
  CrudMutationType,
  MutationLedgerInput,
};
