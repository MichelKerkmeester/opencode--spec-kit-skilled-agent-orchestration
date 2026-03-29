// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud
// ────────────────────────────────────────────────────────────────

import { handleMemoryDelete } from './memory-crud-delete.js';
import { handleMemoryUpdate } from './memory-crud-update.js';
import { handleMemoryList } from './memory-crud-list.js';
import { handleMemoryStats } from './memory-crud-stats.js';
import { handleMemoryHealth } from './memory-crud-health.js';
import { setEmbeddingModelReady, isEmbeddingModelReady } from '../core/index.js';

// Feature catalog: Memory browser (memory_list)
// Feature catalog: System statistics (memory_stats)
// Feature catalog: Health diagnostics (memory_health)


/* ───────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  handleMemoryDelete,
  handleMemoryUpdate,
  handleMemoryList,
  handleMemoryStats,
  handleMemoryHealth,
  setEmbeddingModelReady,
  isEmbeddingModelReady,
};

// Backward-compatible aliases (snake_case) — remove after all callers migrate to camelCase
const handle_memory_delete = handleMemoryDelete;
const handle_memory_update = handleMemoryUpdate;
const handle_memory_list = handleMemoryList;
const handle_memory_stats = handleMemoryStats;
const handle_memory_health = handleMemoryHealth;
const set_embedding_model_ready = setEmbeddingModelReady;
const is_embedding_model_ready = isEmbeddingModelReady;

export {
  handle_memory_delete,
  handle_memory_update,
  handle_memory_list,
  handle_memory_stats,
  handle_memory_health,
  set_embedding_model_ready,
  is_embedding_model_ready,
};
