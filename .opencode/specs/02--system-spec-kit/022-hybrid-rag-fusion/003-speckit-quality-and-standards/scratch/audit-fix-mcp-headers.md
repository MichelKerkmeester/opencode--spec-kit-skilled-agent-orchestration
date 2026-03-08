# Fix Report: mcp_server/ TypeScript Headers

## Scope
- Audit sources: H-01 through H-10
- Total P0-1 violations found: 90 files need fixing (8 already correct, were false positives)
- Fix type: Mechanical (replace/insert 3-line MODULE header)
- Required format (exact):
  ```
  // ---------------------------------------------------------------
  // MODULE: [Name]
  // ---------------------------------------------------------------
  ```

## Violation Categories

| Category | Description | Count | Fix Strategy |
|----------|-------------|------:|--------------|
| **A** | 1-line format (`// ------- MODULE: Name -------`) | 6 | Replace line 1 with 3-line block |
| **B** | Unicode box-drawing separators (`───` instead of `---`) | 3 | Replace separators + insert closing line |
| **C** | Correct L1+L2, description on L3 instead of closing separator | 81 | Insert `// ---------------------------------------------------------------` as new L3 |

## False Positives (8 files already correct)
These files were flagged in audits but already have exact 3-line headers:
- `lib/eval/ablation-framework.ts`
- `lib/eval/channel-attribution.ts`
- `lib/eval/edge-density.ts`
- `lib/eval/ground-truth-data.ts`
- `lib/eval/ground-truth-feedback.ts`
- `lib/eval/shadow-scoring.ts`
- `scripts/reindex-embeddings.ts` (correct after shebang)
- `cli.ts` (correct after shebang)

---

## Fix Plan

### Category A: 1-line Format (6 files)

These files use `// ------- MODULE: Name -------` as a single line. The fix replaces line 1 with the standard 3-line block.

---

### File: handlers/memory-crud-health.ts
**Current (lines 1-5):**
```
// ------- MODULE: Memory CRUD Health Handler -------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */
```
**Proposed header (replace line 1):**
```
// ---------------------------------------------------------------
// MODULE: Memory CRUD Health Handler
// ---------------------------------------------------------------
```

---

### File: handlers/memory-crud-list.ts
**Current (lines 1-5):**
```
// ------- MODULE: Memory CRUD List Handler -------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */
```
**Proposed header (replace line 1):**
```
// ---------------------------------------------------------------
// MODULE: Memory CRUD List Handler
// ---------------------------------------------------------------
```

---

### File: handlers/memory-crud-stats.ts
**Current (lines 1-5):**
```
// ------- MODULE: Memory CRUD Stats Handler -------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */
```
**Proposed header (replace line 1):**
```
// ---------------------------------------------------------------
// MODULE: Memory CRUD Stats Handler
// ---------------------------------------------------------------
```

---

### File: handlers/memory-crud-types.ts
**Current (lines 1-5):**
```
// ------- MODULE: Memory CRUD Types -------

/* ---------------------------------------------------------------
   TYPES
--------------------------------------------------------------- */
```
**Proposed header (replace line 1):**
```
// ---------------------------------------------------------------
// MODULE: Memory CRUD Types
// ---------------------------------------------------------------
```

---

### File: handlers/memory-crud-utils.ts
**Current (lines 1-5):**
```
// ------- MODULE: Memory CRUD Utilities -------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */
```
**Proposed header (replace line 1):**
```
// ---------------------------------------------------------------
// MODULE: Memory CRUD Utilities
// ---------------------------------------------------------------
```

---

### File: handlers/memory-crud.ts
**Current (lines 1-5):**
```
// ------- MODULE: Memory CRUD -------

import { handleMemoryDelete } from './memory-crud-delete';
import { handleMemoryUpdate } from './memory-crud-update';
import { handleMemoryList } from './memory-crud-list';
```
**Proposed header (replace line 1):**
```
// ---------------------------------------------------------------
// MODULE: Memory CRUD
// ---------------------------------------------------------------
```

---

### Category B: Unicode Separators (3 files)

These files use `───` (U+2500 BOX DRAWINGS LIGHT HORIZONTAL) instead of `-` (U+002D HYPHEN-MINUS). The fix replaces the Unicode separators with standard hyphens and inserts the closing separator on line 3.

---

### File: lib/interfaces/vector-store.ts
**Current (lines 1-5):**
```
// ───────────────────────────────────────────────────────────────
// MODULE: Vector Store Interface
// INTERFACE: IVectorStore (abstract base class)
// ───────────────────────────────────────────────────────────────
// Concrete base class providing the IVectorStore contract for JS consumers.
```
**Proposed header (replace lines 1-4):**
```
// ---------------------------------------------------------------
// MODULE: Vector Store Interface
// ---------------------------------------------------------------
```
Note: Current lines 3-4 (`// INTERFACE:...` and closing Unicode separator) become unnecessary. Description can remain as a separate comment block below.

---

### File: lib/learning/corrections.ts
**Current (lines 1-5):**
```
// ───────────────────────────────────────────────────────────────
// MODULE: Learning Corrections Tracking
// LEARNING: CORRECTIONS TRACKING
// ───────────────────────────────────────────────────────────────

```
**Proposed header (replace lines 1-4):**
```
// ---------------------------------------------------------------
// MODULE: Learning Corrections Tracking
// ---------------------------------------------------------------
```

---

### File: lib/learning/index.ts
**Current (lines 1-5):**
```
// ───────────────────────────────────────────────────────────────
// MODULE: LEARNING INDEX
// Phase 3 of SpecKit Reimagined - Learning from Corrections
// ───────────────────────────────────────────────────────────────

```
**Proposed header (replace lines 1-4):**
```
// ---------------------------------------------------------------
// MODULE: Learning Index
// ---------------------------------------------------------------
```

---

### Category C: Description on Line 3 (81 files)

All 81 files share the same structural issue: lines 1-2 are correct (`// ---...` + `// MODULE: Name`) but line 3 contains a description comment instead of the closing separator `// ---------------------------------------------------------------`. The fix inserts the closing separator as a new line 3, pushing the description content down.

**Fix pattern:** Insert `// ---------------------------------------------------------------` as new line 3 after `// MODULE: [Name]`.

Existing description content (currently L3+) is preserved below the 3-line header block.

---

#### lib/search/ (A-F) -- from H-03

### File: lib/search/anchor-metadata.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Anchor Metadata Extraction
// Sprint 5 Phase B -- S2 template anchor optimization
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/artifact-routing.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Artifact-Class Routing Table (C136-09)
// Splits retrieval strategy by artifact class for class-specific
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/auto-promotion.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Auto-Promotion Engine (T002a)
//
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/causal-boost.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Causal Boost
// Graph-traversal score boosting via causal edge relationships.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/channel-enforcement.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Channel Enforcement (T003b)
// Pipeline-ready wrapper around the channel min-representation check.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/context-budget.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Context Budget Optimizer
// Token-budget-aware result selection with graph region diversity.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/cross-encoder.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Cross-Encoder Reranker
//
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/dynamic-token-budget.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Dynamic Token Budget
//
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/embedding-expansion.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Embedding-Based Query Expansion (R12)
// AI-WHY: Sprint 5 Phase B -- semantic query expansion using embedding similarity.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/encoding-intent.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Encoding-Intent Capture at Index Time (R16)
// Sprint 6a -- classify content intent for metadata enrichment.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/entity-linker.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Cross-Document Entity Linking (S5)
// Gated via SPECKIT_ENTITY_LINKING
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/evidence-gap-detector.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Evidence Gap Detector (C138-P1)
// Transparent Reasoning Module (TRM): Z-score confidence check
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/feedback-denylist.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Feedback Denylist (R11)
// AI-GUARD: 100+ stop words that should never be learned as trigger phrases.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/folder-relevance.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Folder Relevance Scoring (DocScore)
// Computes folder-level relevance scores from individual memory
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/search/ (G-R) -- from H-04

### File: lib/search/graph-flags.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Graph Search Compatibility Flag
// AI-WHY: Legacy compatibility shim retained for test/runtime imports.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/learned-feedback.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Learned Relevance Feedback Engine (R11)
//
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/memory-summaries.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Memory Summary Storage + Search Channel (R8)
// Gated via SPECKIT_MEMORY_SUMMARIES
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/query-expander.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Query Expander (C138-P3)
// Rule-based synonym expansion for mode="deep" multi-query RAG.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/query-router.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Query Router
// Tier-to-channel-subset routing for query complexity (Sprint 3, T001b)
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/reranker.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Reranker
// Simple score-based reranking utility. Sorts results by score
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/search/ (S-Z) + pipeline/ -- from H-05

### File: lib/search/search-flags.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Search Feature Flags
// Default-on runtime gates for search pipeline controls
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/sqlite-fts.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: SQLite FTS5 BM25 Search (C138-P2)
// Weighted BM25 scoring for FTS5 full-text search.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/tfidf-summarizer.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: TF-IDF Extractive Summarizer (R8)
// Pure TypeScript, zero dependencies
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/validation-metadata.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Validation Metadata Enrichment (Sprint 5 Phase B)
// AI-GUARD:
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/vector-index-impl.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Vector Index Legacy Facade
// AI-WHY: NOTE: Implementation has been split into focused modules:
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/vector-index.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Vector Index Facade
// AI-WHY: Backward-compatible export surface across split modules.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/pipeline/index.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Pipeline Index
// Sprint 5 (R6): Public API for the 4-stage retrieval pipeline
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/pipeline/orchestrator.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Pipeline Orchestrator
// Sprint 5 (R6): 4-stage pipeline execution behind SPECKIT_PIPELINE_V2
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/pipeline/stage1-candidate-gen.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Stage 1 -- Candidate Generation
// Sprint 5 (R6): 4-Stage Retrieval Pipeline Architecture
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/pipeline/stage2-fusion.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Stage 2 -- Fusion + Signal Integration
// AI-GUARD: Sprint 5 (R6): 4-Stage Retrieval Pipeline
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/pipeline/stage3-rerank.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Stage 3 -- Rerank + Aggregate
// AI-GUARD: 4-Stage Retrieval Pipeline: Stage 3 of 4
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/pipeline/stage4-filter.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Stage 4 -- Filter + Annotate
// AI-WHY: Sprint 5 (R6): Final stage of the 4-stage retrieval pipeline.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/search/pipeline/types.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Pipeline Types -- 4-Stage Retrieval Pipeline Architecture
// Sprint 5 (R6): Stage interfaces with Stage 4 immutability invariant
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/cognitive/ -- from H-06

### File: lib/cognitive/archival-manager.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Archival Manager
// Background archival job for dormant/archived memories
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/cognitive/attention-decay.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Attention Decay
// DECAY STRATEGY (ADR-004): This module is the FACADE for all long-term
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/cognitive/temporal-contiguity.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Temporal Contiguity
// Boost search results when memories are temporally adjacent,
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/cognitive/working-memory.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Working Memory
// AI-WHY: Session-based attention management
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/scoring/ -- from H-06

### File: lib/scoring/folder-scoring.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Folder Scoring Re-Export
// SCORING: FOLDER SCORING BARREL
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/scoring/interference-scoring.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Interference Scoring (TM-01)
// Sprint 2, Task T005
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/scoring/negative-feedback.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Negative Feedback Confidence Signal (T002b / A4)
// AI-GUARD:
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/eval/ -- from H-07

### File: lib/eval/bm25-baseline.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: BM25-Only Baseline Runner (T008)
//
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/eval/eval-ceiling.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Eval Ceiling (T006f)
// Full-Context Ceiling Evaluation -- computes the theoretical
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/eval/eval-db.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Eval DB
// T004: Separate evaluation database with 5 tables for tracking
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/eval/eval-logger.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Eval Logger
// AI-TRACE: T005: Non-blocking, fail-safe logging hooks for search, context,
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/eval/eval-metrics.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Eval Metrics
// T006a-e: Pure computation functions for 11 evaluation metrics
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/eval/eval-quality-proxy.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Eval Quality Proxy (T006g)
// Automated quality proxy metric that correlates with manual
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/eval/ground-truth-generator.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Ground Truth Generator
// T007: Functions for generating, loading, and validating the
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/eval/k-value-analysis.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: K-Value Sensitivity Analysis (T004a)
// Measures the impact of different RRF K-values on ranking stability.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/eval/reporting-dashboard.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Reporting Dashboard (R13-S3)
// Sprint 7: Full reporting dashboard for eval infrastructure.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/storage/ -- from H-08

### File: lib/storage/access-tracker.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Access Tracker
// Batched access tracking with accumulator
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/storage/causal-edges.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Causal Edges
// Causal relationship graph for memory lineage
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/storage/checkpoints.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Checkpoints
// Gzip-compressed database checkpoints with embedding preservation
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/storage/consolidation.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: N3-lite Consolidation Engine
// Lightweight graph maintenance: contradiction scan, Hebbian
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/storage/history.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: History
// Tracks change history for memory entries (ADD, UPDATE, DELETE)
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/storage/incremental-index.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Incremental Index
// Mtime-based incremental indexing for fast re-indexing
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/storage/index-refresh.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Index Refresh
// Manages embedding index freshness on the memory_index table
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/storage/learned-triggers-schema.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Learned Triggers Schema Migration (R11)
// AI-GUARD: Schema migration for the learned_triggers column.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/storage/mutation-ledger.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Mutation Ledger
// Append-only audit trail for all memory mutations
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/storage/transaction-manager.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Transaction Manager
// AI-GUARD: Atomic file + index operations with pending file recovery
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/chunking/ -- from H-09

### File: lib/chunking/anchor-chunker.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Anchor-Aware Chunker
// Splits large memory files into chunks using ANCHOR tags as
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/chunking/chunk-thinning.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Anchor-Aware Chunk Thinning (R7)
// Scores chunks by anchor presence + content density, then
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/config/ -- from H-09

### File: lib/config/memory-types.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Memory Types Config
// CONFIG: MEMORY TYPES
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/config/type-inference.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Type Inference Config
// CONFIG: TYPE INFERENCE
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/errors/ -- from H-09

### File: lib/errors/core.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Errors Core
// Memory error class and utility functions
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/errors/recovery-hints.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Recovery Hints
// T009-T011: Error catalog with recovery hints (REQ-004, REQ-009)
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/extraction/ -- from H-09

### File: lib/extraction/entity-denylist.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Entity Denylist (R10)
// Common nouns and stop words filtered from entity extraction.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/extraction/entity-extractor.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Auto Entity Extraction (R10)
// Deferred feature -- gated via SPECKIT_AUTO_ENTITIES
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/graph/ -- from H-09

### File: lib/graph/community-detection.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Community Detection -- BFS + Louvain (N2c)
// Deferred feature -- gated via SPECKIT_COMMUNITY_DETECTION
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/graph/graph-signals.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Graph Signals -- Momentum + Causal Depth (N2a + N2b)
// Deferred feature -- gated via SPECKIT_GRAPH_SIGNALS
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/interfaces/ -- from H-09 (Category B)

(See Category B section above for `lib/interfaces/vector-store.ts`)

---

#### lib/learning/ -- from H-09 (Category B)

(See Category B section above for `lib/learning/corrections.ts` and `lib/learning/index.ts`)

---

#### lib/parsing/ -- from H-09

### File: lib/parsing/content-normalizer.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Content Normalizer
// Sprint 7 / S1 -- Smarter Memory Content Generation
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/parsing/entity-scope.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Entity Scope
// Provides context type detection, scope filtering, and session ID
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/providers/ -- from H-09

### File: lib/providers/embeddings.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Embeddings Provider Re-Export
// PROVIDERS: EMBEDDINGS
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### lib/utils/ -- from H-09

### File: lib/utils/format-helpers.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Format Helpers
// UTILS: FORMAT HELPERS
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/utils/logger.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: MCP-Safe Logger
// Structured logging that writes ALL output to stderr.
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: lib/utils/path-security.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Path Security Re-Export
// UTILS: PATH SECURITY BARREL
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### Top-level utils/ -- from H-10

### File: utils/batch-processor.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Batch Processor Utils
// UTILS: BATCH PROCESSOR
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: utils/db-helpers.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Database Helpers
// UTILS: Database Helpers
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: utils/index.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Utils Barrel Export
// UTILS - Barrel Export
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: utils/json-helpers.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: JSON Helpers
// UTILS: JSON HELPERS
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

### File: utils/validators.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Validators
// UTILS: VALIDATORS
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

#### formatters/ -- from H-10

### File: formatters/token-metrics.ts
**Current (lines 1-3):**
```
// ---------------------------------------------------------------
// MODULE: Token Metrics Formatter
// FORMATTERS: TOKEN METRICS
```
**Fix:** Insert `// ---------------------------------------------------------------` as new line 3.

---

## Summary

| Metric | Value |
|--------|------:|
| Files audited across H-01 to H-10 | 98 |
| Files already correct (false positives) | 8 |
| **Files to fix** | **90** |
| Category A (1-line format) | 6 |
| Category B (Unicode separators) | 3 |
| Category C (missing closing separator on L3) | 81 |
| Fix complexity | Mechanical (no logic changes) |

### Automation Note

Category C (81 files) can be fixed with a single `sed` command per file:
```bash
sed -i '' '2a\
// ---------------------------------------------------------------' "$FILE"
```
This inserts the closing separator line after line 2 (the `// MODULE:` line), pushing existing line 3+ content down.

Category A (6 files) requires replacing line 1 with 3 lines.

Category B (3 files) requires replacing the Unicode separator lines and restructuring.

All paths are relative to: `.opencode/skill/system-spec-kit/mcp_server/`
