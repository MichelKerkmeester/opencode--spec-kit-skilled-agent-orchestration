// ────────────────────────────────────────────────────────────────
// MODULE: Index
// ────────────────────────────────────────────────────────────────

import * as memorySearch from './memory-search';
import * as memoryTriggers from './memory-triggers';
import * as memorySave from './memory-save';
import * as memoryCrud from './memory-crud';
import * as memoryIndex from './memory-index';
import * as memoryBulkDelete from './memory-bulk-delete';
import * as checkpoints from './checkpoints';
import * as sessionLearning from './session-learning';
import * as causalGraph from './causal-graph';
import * as evalReporting from './eval-reporting';
import * as sharedMemory from './shared-memory';
// T061: L1 Orchestration - unified entry point
import * as memoryContext from './memory-context';
import * as memoryIngest from './memory-ingest';

// Feature catalog: Transaction wrappers on mutation handlers


/* ───────────────────────────────────────────────────────────────
   RE-EXPORTS: All handler functions
──────────────────────────────────────────────────────────────── */

// Memory search handlers
export {
  handleMemorySearch,
  handle_memory_search,
} from './memory-search';

// Memory triggers handlers
export {
  handleMemoryMatchTriggers,
  handle_memory_match_triggers,
} from './memory-triggers';

// Memory save handlers
export {
  handleMemorySave,
  indexMemoryFile,
  atomicSaveMemory,
  getAtomicityMetrics,
  handle_memory_save,
  index_memory_file,
  atomic_save_memory,
  get_atomicity_metrics,
} from './memory-save';

// PE-gating handlers (extracted from memory-save)
export {
  calculateDocumentWeight,
  isSpecDocumentType,
  findSimilarMemories,
  reinforceExistingMemory,
  markMemorySuperseded,
  updateExistingMemory,
  logPeDecision,
} from './pe-gating';

// Memory ingest handlers
export {
  handleMemoryIngestStart,
  handleMemoryIngestStatus,
  handleMemoryIngestCancel,
  handle_memory_ingest_start,
  handle_memory_ingest_status,
  handle_memory_ingest_cancel,
} from './memory-ingest';

// Memory CRUD handlers
export {
  handleMemoryDelete,
  handleMemoryUpdate,
  handleMemoryList,
  handleMemoryStats,
  handleMemoryHealth,
  setEmbeddingModelReady,
  isEmbeddingModelReady,
  handle_memory_delete,
  handle_memory_update,
  handle_memory_list,
  handle_memory_stats,
  handle_memory_health,
  set_embedding_model_ready,
  is_embedding_model_ready,
} from './memory-crud';

// Memory index handlers
export {
  handleMemoryIndexScan,
  indexSingleFile,
  findConstitutionalFiles,
  handle_memory_index_scan,
  index_single_file,
  find_constitutional_files,
} from './memory-index';

// Memory bulk delete handler
export {
  handleMemoryBulkDelete,
} from './memory-bulk-delete';

// Checkpoint handlers
export {
  handleCheckpointCreate,
  handleCheckpointList,
  handleCheckpointRestore,
  handleCheckpointDelete,
  handleMemoryValidate,
  handle_checkpoint_create,
  handle_checkpoint_list,
  handle_checkpoint_restore,
  handle_checkpoint_delete,
  handle_memory_validate,
} from './checkpoints';

// Session learning handlers
export {
  handleTaskPreflight,
  handleTaskPostflight,
  handleGetLearningHistory,
  handle_task_preflight,
  handle_task_postflight,
  handle_get_learning_history,
} from './session-learning';

// Eval reporting handlers (R13-S3 MCP exposure)
export {
  handleEvalRunAblation,
  handleEvalReportingDashboard,
  handle_eval_run_ablation,
  handle_eval_reporting_dashboard,
} from './eval-reporting';

// Causal graph handlers (T043-T047)
export {
  handleMemoryDriftWhy,
  handleMemoryCausalLink,
  handleMemoryCausalStats,
  handleMemoryCausalUnlink,
  handle_memory_drift_why,
  handle_memory_causal_link,
  handle_memory_causal_stats,
  handle_memory_causal_unlink,
} from './causal-graph';

// T061: L1 Orchestration handler
export {
  handleMemoryContext,
  handle_memory_context,
} from './memory-context';

export {
  handleSharedMemoryEnable,
  handleSharedMemoryStatus,
  handleSharedSpaceMembershipSet,
  handleSharedSpaceUpsert,
} from './shared-memory';

/* ───────────────────────────────────────────────────────────────
   SUB-MODULE REFERENCES (for direct access)
──────────────────────────────────────────────────────────────── */

export {
  memorySearch,
  memoryTriggers,
  memorySave,
  memoryCrud,
  memoryIndex,
  memoryBulkDelete,
  checkpoints,
  sessionLearning,
  causalGraph,
  evalReporting,
  memoryContext,
  memoryIngest,
  sharedMemory,
};
