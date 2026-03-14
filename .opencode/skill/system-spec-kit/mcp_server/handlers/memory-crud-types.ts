// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Types
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────────────────────── */

/** Arguments for the memory_delete handler. */

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Memory metadata update (memory_update)
// Feature catalog: Single and folder delete (memory_delete)
// Feature catalog: Tier-based bulk deletion (memory_bulk_delete)

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

/** Arguments for the memory_health handler. */
interface HealthArgs {
  reportMode?: 'full' | 'divergent_aliases';
  limit?: number;
  specFolder?: string;
  autoRepair?: boolean;
  confirmed?: boolean;
}

/** Partial embedding provider metadata — see shared/types.ts ProviderMetadata for the full shape. */
interface PartialProviderMetadata {
  provider: string;
  model?: string;
  dim?: number;
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

/** Result returned by post-mutation hooks (cache invalidation, etc.). */
interface MutationHookResult {
  latencyMs: number;
  triggerCacheCleared: boolean;
  constitutionalCacheCleared: boolean;
  toolCacheInvalidated: number;
  graphSignalsCacheCleared: boolean;
  coactivationCacheCleared: boolean;
  errors: string[];
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export type {
  DeleteArgs,
  UpdateArgs,
  ListArgs,
  StatsArgs,
  HealthArgs,
  PartialProviderMetadata,
  MemoryHashSnapshot,
  CrudMutationType,
  MutationLedgerInput,
  MutationHookResult,
};
