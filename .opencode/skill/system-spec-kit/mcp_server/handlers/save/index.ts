// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────
// Re-export barrel consumed by test suites. Production code imports
// from concrete sub-modules (./dedup, ./embedding-pipeline, etc.).

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
} from './types.js';

export {
  ALLOWED_POST_INSERT_COLUMNS,
  applyPostInsertMetadata,
  hasReconsolidationCheckpoint,
} from './db-helpers.js';

export { checkExistingRow, checkContentHashDedup } from './dedup.js';

export type { EmbeddingResult } from './embedding-pipeline.js';
export {
  generateOrCacheEmbedding,
  persistPendingEmbeddingCacheWrite,
} from './embedding-pipeline.js';

export type { PeOrchestrationResult } from './pe-orchestration.js';
export { evaluateAndApplyPeDecision } from './pe-orchestration.js';

export type { ReconsolidationBridgeResult } from './reconsolidation-bridge.js';
export { runReconsolidationIfEnabled } from './reconsolidation-bridge.js';

export { createMemoryRecord } from './create-record.js';

export type { PostInsertEnrichmentResult } from './post-insert.js';
export { runPostInsertEnrichment } from './post-insert.js';

export { buildIndexResult, buildSaveResponse } from './response-builder.js';

export { SPEC_FOLDER_LOCKS, withSpecFolderLock } from './spec-folder-mutex.js';

export {
  MARKDOWN_HEADING_RE,
  MARKDOWN_BULLET_RE,
  stripMarkdownDecorators,
  extractMarkdownSections,
  extractMarkdownListItems,
  extractMarkdownTableFiles,
  buildParsedMemoryEvidenceSnapshot,
} from './markdown-evidence-builder.js';

export {
  applyInsufficiencyMetadata,
  buildInsufficiencyRejectionResult,
  buildTemplateContractRejectionResult,
  buildDryRunSummary,
} from './validation-responses.js';
