// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────
// Re-export barrel consumed by test suites. Production code imports
// from concrete sub-modules (./dedup, ./embedding-pipeline, etc.).
export { ALLOWED_POST_INSERT_COLUMNS, applyPostInsertMetadata, hasReconsolidationCheckpoint, } from './db-helpers.js';
export { checkExistingRow, checkContentHashDedup } from './dedup.js';
export { generateOrCacheEmbedding, persistPendingEmbeddingCacheWrite, } from './embedding-pipeline.js';
export { evaluateAndApplyPeDecision } from './pe-orchestration.js';
export { runReconsolidationIfEnabled } from './reconsolidation-bridge.js';
export { createMemoryRecord } from './create-record.js';
export { runPostInsertEnrichment } from './post-insert.js';
export { buildIndexResult, buildSaveResponse } from './response-builder.js';
export { SPEC_FOLDER_LOCKS, withSpecFolderLock } from './spec-folder-mutex.js';
export { MARKDOWN_HEADING_RE, MARKDOWN_BULLET_RE, stripMarkdownDecorators, extractMarkdownSections, extractMarkdownListItems, extractMarkdownTableFiles, buildParsedMemoryEvidenceSnapshot, } from './markdown-evidence-builder.js';
export { applyInsufficiencyMetadata, buildInsufficiencyRejectionResult, buildTemplateContractRejectionResult, buildDryRunSummary, } from './validation-responses.js';
//# sourceMappingURL=index.js.map