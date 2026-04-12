// ────────────────────────────────────────────────────────────────
// MODULE: Index — Public API surface
// ────────────────────────────────────────────────────────────────
// @public — Only export what external consumers (scripts/, other packages) need.
// Internal mcp_server code should import from lib/ directly, not through this barrel.
// ARCH-1: Consumer scripts import from '@spec-kit/mcp-server/api' instead of lib/.
// Review note: Barrel is wide due to legitimate external consumers in scripts/evals,
// scripts/core, scripts/spec-folder, and scripts/memory. Do not narrow without
// auditing all consumers first (see review/review-report.md P2-MNT-02).

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

// --- Graph metadata (used by scripts/core, scripts/graph, tests) ---
export {
  GRAPH_METADATA_DOCUMENT_TYPE,
  GRAPH_METADATA_FILENAME,
  GRAPH_METADATA_SCHEMA_VERSION,
  createEmptyGraphMetadataManual,
  graphMetadataSchema,
  packetReferenceSchema,
  graphEntityReferenceSchema,
} from '../lib/graph/graph-metadata-schema.js';
export type {
  GraphMetadata,
  GraphMetadataDerived,
  GraphMetadataManual,
  GraphEntityReference,
  PacketReference,
} from '../lib/graph/graph-metadata-schema.js';
export {
  validateGraphMetadataContent,
  loadGraphMetadata,
  deriveGraphMetadata,
  mergeGraphMetadata,
  serializeGraphMetadata,
  writeGraphMetadataFile,
  refreshGraphMetadataForSpecFolder,
  graphMetadataToIndexableText,
  packetReferencesToCausalLinks,
} from '../lib/graph/graph-metadata-parser.js';

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
  getMemoryRoadmapCapabilityFlags,
  getMemoryRoadmapDefaults,
  getMemoryRoadmapPhase,
} from '../lib/config/capability-flags.js';
export type { MemoryRoadmapCapabilityFlags } from '../lib/config/capability-flags.js';
