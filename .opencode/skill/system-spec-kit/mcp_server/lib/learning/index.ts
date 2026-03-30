// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────
// Learning from corrections
// Keep the top-level surface explicit so internal exports stay auditable.
export type {
  CorrectionTypes,
  StabilityChanges,
  CorrectionResult,
  CorrectionRecord,
  CorrectionChainEntry,
  CorrectionWithTitles,
  CorrectionChain,
  CorrectionStats,
  RecordCorrectionParams,
  UndoResult,
  SchemaResult,
} from './corrections.js';

export {
  CORRECTION_TYPES,
  CORRECTION_STABILITY_PENALTY,
  REPLACEMENT_STABILITY_BOOST,
  init,
  get_db,
  is_enabled,
  ensure_schema,
  get_correction_types,
  record_correction,
  undo_correction,
  get_corrections_for_memory,
  get_correction_chain,
  get_corrections_stats,
  deprecate_memory,
  supersede_memory,
  refine_memory,
  merge_memories,
  recordCorrection,
  undoCorrection,
  getCorrectionsForMemory,
  getCorrectionChain,
  getCorrectionsStats,
  getCorrectionTypes,
  deprecateMemory,
  supersedeMemory,
  refineMemory,
  mergeMemories,
  isEnabled,
  ensureSchema,
  getDb,
} from './corrections.js';
