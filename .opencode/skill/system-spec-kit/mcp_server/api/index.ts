// ────────────────────────────────────────────────────────────────
// MODULE: Index
// ────────────────────────────────────────────────────────────────
// @public — single entry point for all public API surfaces.
// ARCH-1 consumer scripts import from '../../mcp_server/api/index.js'
// Instead of reaching into lib/ internals.

export {
  runAblation,
  storeAblationResults,
  formatAblationReport,
  toHybridSearchFlags,
  isAblationEnabled,
  inspectGroundTruthAlignment,
  assertGroundTruthAlignment,
  ALL_CHANNELS,
  type AblationChannel,
  type AblationSearchFn,
  type AblationReport,
  type GroundTruthAlignmentSummary,
  runBM25Baseline,
  recordBaselineMetrics,
  type BM25SearchFn,
  type BM25SearchResult,
  type BM25BaselineResult,
  loadGroundTruth,
  initEvalDb,
} from './eval.js';

export {
  initializeIndexingRuntime,
  warmEmbeddingModel,
  runMemoryIndexScan,
  closeIndexingRuntime,
  type MemoryIndexScanArgs,
} from './indexing.js';

export {
  initHybridSearch,
  hybridSearchEnhanced,
  type HybridSearchOptions,
  type HybridSearchResult,
  fts5Bm25Search,
  isFts5Available,
  vectorIndex,
} from './search.js';

export {
  generateEmbedding,
  generateQueryEmbedding,
  getEmbeddingProfile,
  retryManager,
} from './providers.js';

export {
  initCheckpoints,
  initAccessTracker,
} from './storage.js';

// --- Folder discovery (used by scripts/spec-folder, scripts/core) ---
export {
  generatePerFolderDescription,
  savePerFolderDescription,
  loadPerFolderDescription,
  extractKeywords,
  slugifyFolderName,
} from '../lib/search/folder-discovery.js';
export type { PerFolderDescription } from '../lib/search/folder-discovery.js';

// --- Entity extraction (used by scripts/memory) ---
export {
  extractEntities,
  rebuildAutoEntities,
} from '../lib/extraction/entity-extractor.js';

// --- Performance benchmarking support (used by scripts/evals) ---
export * as sessionBoost from '../lib/search/session-boost.js';
export * as causalBoost from '../lib/search/causal-boost.js';
export * as workingMemory from '../lib/cognitive/working-memory.js';
export {
  initExtractionAdapter,
  getExtractionMetrics,
  resetExtractionMetrics,
} from '../lib/extraction/extraction-adapter.js';
export type { ExtractionMetrics } from '../lib/extraction/extraction-adapter.js';

// --- Hybrid RAG Fusion rollout metadata and architecture surfaces ---
export {
  LAYER_DEFINITIONS,
  TOOL_LAYER_MAP,
  getLayerForTool,
  getLayerTokenBudget,
} from '../lib/architecture/layer-definitions.js';
export type { LayerDefinition, LayerId } from '../lib/architecture/layer-definitions.js';

export {
  getSharedRolloutMetrics,
  getSharedRolloutCohortSummary,
} from '../lib/collab/shared-spaces.js';
export type {
  SharedMembership,
  SharedRole,
  SharedRolloutCohortSummary,
  SharedRolloutMetrics,
  SharedSpaceDefinition,
  SharedSubjectType,
} from '../lib/collab/shared-spaces.js';

export {
  getMemoryRoadmapCapabilityFlags,
  getMemoryRoadmapDefaults,
  getMemoryRoadmapPhase,
} from '../lib/config/capability-flags.js';
export type { MemoryRoadmapCapabilityFlags } from '../lib/config/capability-flags.js';
