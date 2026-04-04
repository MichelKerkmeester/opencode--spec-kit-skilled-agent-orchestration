// ────────────────────────────────────────────────────────────────
// MODULE: Index — Public API surface
// ────────────────────────────────────────────────────────────────
// @public — Only export what external consumers (scripts/, other packages) need.
// Internal mcp_server code should import from lib/ directly, not through this barrel.
// ARCH-1: Consumer scripts import from '@spec-kit/mcp-server/api' instead of lib/.
// Review note: Barrel is wide due to legitimate external consumers in scripts/evals,
// scripts/core, scripts/spec-folder, and scripts/memory. Do not narrow without
// auditing all consumers first (see review/review-report.md P2-MNT-02).
export { runAblation, storeAblationResults, formatAblationReport, toHybridSearchFlags, isAblationEnabled, inspectGroundTruthAlignment, assertGroundTruthAlignment, ALL_CHANNELS, runBM25Baseline, recordBaselineMetrics, loadGroundTruth, initEvalDb, } from './eval.js';
export { initializeIndexingRuntime, warmEmbeddingModel, runMemoryIndexScan, closeIndexingRuntime, } from './indexing.js';
export { initHybridSearch, hybridSearchEnhanced, fts5Bm25Search, isFts5Available, vectorIndex, } from './search.js';
export { generateEmbedding, generateQueryEmbedding, getEmbeddingProfile, retryManager, } from './providers.js';
export { initCheckpoints, initAccessTracker, } from './storage.js';
// --- Folder discovery (used by scripts/spec-folder, scripts/core) ---
export { generatePerFolderDescription, savePerFolderDescription, loadPerFolderDescription, extractKeywords, slugifyFolderName, } from '../lib/search/folder-discovery.js';
// --- Entity extraction (used by scripts/memory) ---
export { extractEntities, rebuildAutoEntities, } from '../lib/extraction/entity-extractor.js';
// --- Performance benchmarking support (used by scripts/evals) ---
export * as sessionBoost from '../lib/search/session-boost.js';
export * as causalBoost from '../lib/search/causal-boost.js';
export * as workingMemory from '../lib/cognitive/working-memory.js';
export { initExtractionAdapter, getExtractionMetrics, resetExtractionMetrics, } from '../lib/extraction/extraction-adapter.js';
// --- Hybrid RAG Fusion rollout metadata and architecture surfaces ---
export { LAYER_DEFINITIONS, TOOL_LAYER_MAP, getLayerForTool, getLayerTokenBudget, } from '../lib/architecture/layer-definitions.js';
export { getSharedRolloutMetrics, getSharedRolloutCohortSummary, } from '../lib/collab/shared-spaces.js';
export { getMemoryRoadmapCapabilityFlags, getMemoryRoadmapDefaults, getMemoryRoadmapPhase, } from '../lib/config/capability-flags.js';
//# sourceMappingURL=index.js.map