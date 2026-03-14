// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Atomic-save parity and partial-indexing hints

export type {
  ValidationResult,
  SimilarMemory,
  PeDecision,
  IndexResult,
  CausalLinksResult,
  AtomicSaveParams,
  AtomicSaveOptions,
  AtomicSaveResult,
  SaveArgs,
  PostInsertMetadataFields,
  ParsedMemory,
} from './types';

export {
  ALLOWED_POST_INSERT_COLUMNS,
  applyPostInsertMetadata,
  hasReconsolidationCheckpoint,
} from './db-helpers';

export { checkExistingRow, checkContentHashDedup } from './dedup';

export type { EmbeddingResult } from './embedding-pipeline';
export {
  generateOrCacheEmbedding,
  persistPendingEmbeddingCacheWrite,
} from './embedding-pipeline';

export type { PeOrchestrationResult } from './pe-orchestration';
export { evaluateAndApplyPeDecision } from './pe-orchestration';

export type { ReconsolidationBridgeResult } from './reconsolidation-bridge';
export { runReconsolidationIfEnabled } from './reconsolidation-bridge';

export { createMemoryRecord } from './create-record';

export type { PostInsertEnrichmentResult } from './post-insert';
export { runPostInsertEnrichment } from './post-insert';

export { buildIndexResult, buildSaveResponse } from './response-builder';
