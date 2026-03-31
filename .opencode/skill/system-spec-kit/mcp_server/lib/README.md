---
title: "MCP Server Library"
description: "Core library modules for search, scoring, cognitive memory and storage."
trigger_phrases:
  - "mcp library"
  - "lib modules"
  - "cognitive memory"
---

# MCP Server Library

> Core library modules for search, scoring, cognitive memory and storage.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. USAGE EXAMPLES](#5--usage-examples)
- [6. TROUBLESHOOTING](#6--troubleshooting)
- [7. RELATED DOCUMENTS](#7--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### What is the MCP Server Library?

The MCP Server Library provides the core functionality for the Spec Kit Memory MCP server. It implements cognitive memory features including semantic search, attention decay, importance scoring and intelligent context retrieval. These modules work together to provide AI assistants with human-like memory recall and context awareness.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Module Categories | 29 | architecture, cache, chunking, code-graph, cognitive, collab, config, contracts, errors, eval, extraction, feedback, governance, graph, interfaces, learning, manage, ops, parsing, providers, response, scoring, search, session, spec, storage, telemetry, utils, validation |
| Cognitive Features | 10+ | FSRS scheduler, attention decay, PE gating, working memory, tier classification, co-activation, temporal contiguity, archival manager, causal graph, corrections |
| Search Intents | 7 | add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision |
| Index Sources | 3 | spec memories, constitutional files, spec documents (`includeSpecDocs`) |
| Schema Milestones | v13+ | v13 introduced `document_type` and `spec_level` for spec-doc indexing and scoring |
| Total Modules | 179 | Recursive `.ts` files under `lib/`, spanning 29 top-level directories plus top-level `errors.ts` |
| Last Verified | 2026-03-28 | Module category and TypeScript file counts revalidated against the live source tree |

### Key Features

| Feature | Description |
|---------|-------------|
| **Semantic Search** | Vector-based similarity search with SQLite vector index and hybrid keyword matching |
| **Cognitive Memory** | Human-like memory features including attention decay, working memory and co-activation |
| **Importance Scoring** | Six-tier importance classification (constitutional, critical, important, normal, temporary, deprecated) |
| **Folder Ranking** | Composite scoring for spec folders based on recency, relevance and importance |
| **Document-Type Scoring** | Document-aware ranking supports spec lifecycle docs (spec/plan/tasks/checklist/decision-record/implementation-summary/research/handover) |
| **Spec Document Indexing** | 3-source indexing pipeline supports optional spec-doc ingestion via `includeSpecDocs` (default: true) |
| **Content Parsing** | Memory file parsing, trigger matching (with CORRECTION/PREFERENCE signals) and entity scope detection |
| **Batch Processing** | Utilities for batch operations, retry logic and rate limiting |
| **Embedding Cache** | Persistent SQLite cache for embedding reuse with LRU eviction |
| **Query Routing** | Complexity classifier routes simple/moderate/complex queries to optimal pipelines |
| **Interference Scoring** | TM-01 penalizes high-similarity near-duplicates in result sets |
| **Confidence Truncation** | Removes low-confidence tail results using 2x median gap detection |
| **Dynamic Token Budget** | Tier-aware budgets (1500/2500/4000) for result delivery |
| **Classification Decay** | TM-03 tier/context 2D multiplier matrix for FSRS decay modulation |
| **Learned Feedback** | R11 selection tracking boosts future searches (9 safeguards, 0.7x weight) |
| **Save Quality Gate** | TM-04 pre-storage 3-layer gate rejects content below 0.4 signal density |
| **Reconsolidation** | TM-06 auto-merges similar memories on save (>=0.88 similarity threshold) |
| **Graph Signals** | N2a momentum scoring, N2b causal depth signal, N2c community detection |
| **Chunk Thinning** | R7 anchor-aware chunk scoring and threshold-based dropping at index time |
| **Entity Extraction** | R10 auto-extracts entities at save time for cross-document linking |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| better-sqlite3 | 9+ | Latest |
| Voyage AI API | Required | For embeddings |

<!-- /ANCHOR:overview -->

---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```typescript
// 1. Import direct modules from the source tree
import { SQLiteVectorStore } from './search/vector-index';
import * as attentionDecay from './cognitive/attention-decay';
import { formatAgeString } from './utils/format-helpers';

// 2. Initialize modules with database
import Database from 'better-sqlite3';
const db = new Database('context-index.sqlite');
attentionDecay.init(db);

// 3. Use exported symbols
console.log(SQLiteVectorStore.name, formatAgeString(new Date().toISOString()));
```

### Verify Installation

```typescript
// Check that direct imports resolve
import { SQLiteVectorStore } from './search/vector-index';
import { calculateRetrievabilityDecay } from './cognitive/attention-decay';
console.log(typeof SQLiteVectorStore, typeof calculateRetrievabilityDecay);
// Expected: 'function', 'function'
```

### First Use

```typescript
// Example: Normalize a canonical path key
import { getCanonicalPathKey } from './utils/canonical-path';
console.log(getCanonicalPathKey('context-index.sqlite'));
```

<!-- /ANCHOR:quick-start -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
lib/                            # TypeScript source files
├── search/                     # Search and retrieval (62 modules)
│   ├── vector-index.ts         # Vector similarity search with SQLite
│   ├── vector-index-impl.ts    # Core vector index implementation
│   ├── hybrid-search.ts        # Combined semantic + keyword search + token budget
│   ├── rrf-fusion.ts           # Reciprocal Rank Fusion scoring (5 channels incl. degree)
│   ├── reranker.ts             # Result reranking
│   ├── bm25-index.ts           # BM25 lexical indexing
│   ├── sqlite-fts.ts           # SQLite FTS5 full-text search
│   ├── cross-encoder.ts        # Cross-encoder reranking
│   ├── intent-classifier.ts    # 7 intent types classification
│   ├── query-classifier.ts     # Query complexity classifier (simple/moderate/complex)
│   ├── query-expander.ts       # Multi-query RAG fusion expansion
│   ├── query-router.ts         # Query routing based on complexity
│   ├── artifact-routing.ts     # 9 artifact classes with per-type retrieval strategies
│   ├── causal-boost.ts         # Causal relationship boosting
│   ├── session-boost.ts        # Session-aware relevance boosting
│   ├── graph-search-fn.ts      # Typed-weighted degree computation (Sprint 1)
│   ├── graph-flags.ts          # Graph feature flags
│   ├── search-flags.ts         # Search feature flags
│   ├── channel-enforcement.ts  # Channel enforcement policies
│   ├── channel-representation.ts # Min-representation R2 (QUALITY_FLOOR=0.005)
│   ├── confidence-truncation.ts # Confidence truncation (2x median gap, min 3 results)
│   ├── dynamic-token-budget.ts # Dynamic token budget (1500/2500/4000 by tier)
│   ├── evidence-gap-detector.ts # TRM with Z-score confidence
│   ├── folder-discovery.ts     # Spec folder description discovery
│   ├── folder-relevance.ts     # Folder-level relevance scoring
│   ├── fsrs.ts                 # FSRS core algorithm
│   └── README.md               # Module documentation
│
├── scoring/                    # Ranking and scoring (5 modules)
│   ├── composite-scoring.ts    # Multi-factor composite scores (5-factor + N4 boost + normalization)
│   ├── interference-scoring.ts # TM-01 interference penalty (-0.08 * score)
│   ├── folder-scoring.ts       # Spec folder ranking
│   ├── importance-tiers.ts     # Tier-based importance weights
│   ├── confidence-tracker.ts   # Confidence tracking
│   └── README.md               # Module documentation
│
├── cognitive/                  # Cognitive memory features (10 modules)
│   ├── attention-decay.ts      # Multi-factor decay with type-specific half-lives
│   ├── fsrs-scheduler.ts       # FSRS algorithm
│   ├── prediction-error-gate.ts # PE gating for duplicates
│   ├── working-memory.ts       # Session working memory
│   ├── tier-classifier.ts      # 5-state memory classification
│   ├── co-activation.ts        # Related memory activation
│   ├── temporal-contiguity.ts  # Temporal memory linking
│   ├── archival-manager.ts     # 5-state archival model
│   ├── pressure-monitor.ts     # Cognitive pressure monitoring
│   ├── rollout-policy.ts       # Feature rollout policy engine
│   └── README.md               # Module documentation
│
├── storage/                    # Data persistence (7 modules)
│   ├── access-tracker.ts       # Memory access tracking
│   ├── checkpoints.ts          # State checkpointing
│   ├── history.ts              # History management
│   ├── causal-edges.ts         # Causal graph storage
│   ├── incremental-index.ts    # Incremental indexing
│   ├── transaction-manager.ts  # Transaction management
│   ├── mutation-ledger.ts      # Append-only audit trail with SQLite triggers
│   └── README.md               # Module documentation
│
├── parsing/                    # Content parsing (2 modules)
│   ├── memory-parser.ts        # Memory file parser
│   ├── trigger-matcher.ts      # Trigger phrase matching
│   └── README.md               # Module documentation
│
├── providers/                  # External services (2 modules)
│   ├── embeddings.ts           # Embedding provider (Voyage AI)
│   ├── retry-manager.ts        # API retry logic
│   └── README.md               # Module documentation
│
├── session/                    # Session management (1 module)
│   ├── session-manager.ts      # Session deduplication (~1050 lines)
│   └── README.md               # Module documentation
│
├── errors/                     # Error handling (2 modules + barrel)
│   ├── recovery-hints.ts       # 49 error codes with recovery hints
│   ├── core.ts                 # Core error classes
│   └── index.ts                # Barrel export
│
├── learning/                   # Learning system (1 module + barrel)
│   ├── corrections.ts          # Learning from corrections
│   └── index.ts                # Barrel export
│
├── architecture/               # Architecture definitions (1 module)
│   ├── layer-definitions.ts    # 7-layer MCP architecture
│   └── README.md               # Module documentation
│
├── response/                   # Response formatting (1 module)
│   ├── envelope.ts             # Standardized response envelope
│   └── README.md               # Module documentation
│
├── cache/                      # Caching layer (3 modules + subdirs)
│   ├── tool-cache.ts           # Tool result caching
│   ├── embedding-cache.ts      # Persistent SQLite embedding cache with LRU eviction
│   ├── cognitive/              # Cognitive cache modules
│   ├── scoring/
│   │   └── composite-scoring.ts # Cache-aware composite scoring
│   └── README.md               # Module documentation
│
├── eval/                       # Evaluation and metrics (9 modules)
│   ├── eval-db.ts              # Evaluation database
│   ├── eval-logger.ts          # Evaluation logging
│   ├── eval-metrics.ts         # Evaluation metrics
│   ├── eval-quality-proxy.ts   # Quality proxy scoring
│   ├── bm25-baseline.ts        # BM25 baseline measurement
│   ├── edge-density.ts         # Edge density measurement (Sprint 1)
│   ├── ground-truth-data.ts    # Ground truth dataset
│   ├── ground-truth-generator.ts # Ground truth generation
│   └── k-value-analysis.ts     # K-value sensitivity analysis
│
├── config/                     # Configuration (2 modules)
│   ├── memory-types.ts         # Memory type definitions
│   ├── type-inference.ts       # Type inference utilities
│   └── README.md               # Module documentation
│
├── interfaces/                 # TypeScript interfaces (1 module)
│   ├── vector-store.ts         # Vector store interface
│   └── README.md               # Module documentation
│
├── utils/                      # Utilities (4 modules)
│   ├── format-helpers.ts       # Format utilities
│   ├── logger.ts               # Logging utilities
│   ├── path-security.ts        # Path validation and security
│   ├── canonical-path.ts       # Canonical path normalization
│   └── README.md               # Module documentation
│
├── validation/                 # Input validation (2 modules)
│   ├── preflight.ts            # Preflight checks
│   ├── save-quality-gate.ts    # Save-time quality gate
│   └── README.md               # Module documentation
│
├── contracts/                  # Proxy docs for shared retrieval contracts
│   └── README.md               # Points to ../shared/contracts/retrieval-trace.ts
│
├── telemetry/                  # Retrieval telemetry metrics (4 modules)
│   ├── consumption-logger.ts   # Selection and usage telemetry
│   ├── retrieval-telemetry.ts  # Latency, mode, fallback and quality metrics
│   ├── scoring-observability.ts # Score instrumentation helpers
│   ├── trace-schema.ts         # Trace payload sanitization and guards
│   └── README.md               # Module documentation
│
├── extraction/                 # Post-tool extraction pipeline (4 modules)
│   ├── entity-denylist.ts      # Denylist for extracted entities
│   ├── entity-extractor.ts     # Entity extraction helpers
│   ├── extraction-adapter.ts   # Extraction adapter
│   ├── redaction-gate.ts       # Redaction gate
│   └── README.md               # Module documentation
│
├── collab/                     # Shared-memory collaboration (1 module)
│   └── shared-spaces.ts        # Shared spaces, memberships, rollout and kill switch
│
├── feedback/                   # Feedback learning utilities (4 modules)
│   ├── batch-learning.ts       # Batch feedback aggregation pipeline
│   ├── feedback-ledger.ts      # Implicit feedback event ledger
│   ├── rank-metrics.ts         # Rank comparison metrics
│   └── shadow-scoring.ts       # Shadow evaluation and promotion gating
│
├── governance/                 # Scope governance (1 module)
│   └── scope-governance.ts     # Hierarchical scope enforcement and governed ingest
│
├── graph/                      # Graph scoring helpers (2 modules)
│   ├── community-detection.ts  # Community detection helpers
│   ├── graph-signals.ts        # Graph signal aggregation
│   └── README.md               # Module documentation
│
├── ops/                        # Operational helpers (2 modules)
│   ├── file-watcher.ts         # File watcher operations
│   ├── job-queue.ts            # Async job queue helpers
│   └── README.md               # Module documentation
│
├── errors.ts                   # Custom error classes (legacy)
└── README.md                   # This file

Compiled output location:
dist/lib/                       # Compiled JavaScript + type definitions
├── [same structure as lib/]
├── *.js                        # Compiled JavaScript
├── *.d.ts                      # TypeScript declarations
└── *.js.map                    # Source maps
```

### Key Files

| File | Purpose |
|------|---------|
| `errors.ts` | Custom error classes for error handling (legacy) |
| `search/vector-index.ts` | Core vector similarity search with RRF fusion |
| `search/vector-index-impl.ts` | Core vector index implementation |
| `search/reranker.ts` | Result reranking |
| `search/bm25-index.ts` | BM25 lexical search indexing |
| `search/cross-encoder.ts` | Cross-encoder semantic reranking |
| `search/intent-classifier.ts` | 7 intent types classification |
| `cognitive/attention-decay.ts` | Multi-factor decay with type-specific half-lives |
| `cognitive/fsrs-scheduler.ts` | FSRS power-law forgetting curve algorithm |
| `cognitive/prediction-error-gate.ts` | Four-tier similarity gating to prevent duplicates |
| `cognitive/archival-manager.ts` | 5-state archival model |
| `cognitive/temporal-contiguity.ts` | Temporal memory linking |
| `session/session-manager.ts` | Session deduplication (~1050 lines) |
| `errors/recovery-hints.ts` | 49 error codes with recovery hints |
| `storage/causal-edges.ts` | Causal graph storage (6 relationships) |
| `storage/history.ts` | History management |
| `learning/corrections.ts` | Learning from corrections |
| `scoring/importance-tiers.ts` | Six-tier importance classification system |
| `scoring/interference-scoring.ts` | TM-01 interference penalty for near-duplicates |
| `search/query-classifier.ts` | Query complexity routing (simple/moderate/complex) |
| `search/confidence-truncation.ts` | Low-confidence tail removal (2x median gap) |
| `search/dynamic-token-budget.ts` | Per-tier token budgets (1500/2500/4000) |
| `search/graph-search-fn.ts` | Typed-weighted degree computation for RRF 5th channel |
| `search/channel-representation.ts` | Min-representation R2 (QUALITY_FLOOR=0.005) |
| `cache/embedding-cache.ts` | Persistent SQLite embedding cache with LRU eviction |
| `eval/edge-density.ts` | Edge density measurement for graph analysis |
| `utils/canonical-path.ts` | Canonical path normalization for deduplication |
| `utils/logger.ts` | Logging utilities |
| `validation/preflight.ts` | Input validation and security checks |

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

### Search and Retrieval

**Vector Index**: Semantic similarity search using Voyage AI embeddings

| Aspect | Details |
|--------|---------|
| **Purpose** | Find memories by semantic meaning, not just keywords |
| **Usage** | `search.vectorIndex.search_memories(query, options)` |
| **Options** | `limit`, `threshold`, `specFolder`, `anchors` |

**Hybrid Search**: Combines semantic and keyword search for better recall

| Aspect | Details |
|--------|---------|
| **Purpose** | Use both semantic understanding and exact keyword matches |
| **Usage** | `search.hybridSearch.search(query, options)` |
| **Fusion** | Uses Reciprocal Rank Fusion (RRF) to merge results |

### Cognitive Features

**FSRS Power-Law Decay**: Research-backed forgetting curve using formula R(t,S) = (1 + (19/81) x t/S)^(-0.5) where 19/81 ~ 0.2346

```typescript
// Calculate retrievability using FSRS algorithm
import { calculateRetrievabilityDecay } from './cognitive/attention-decay';

const elapsedDays = 7;

const retrievability = calculateRetrievabilityDecay(
  stability,   // Memory stability (days) - higher = slower decay
  elapsedDays  // Days since last review
);

// Memory states based on retrievability:
// HOT (R >= 0.80)      - Active working memory, full content
// WARM (0.25 <= R < 0.80) - Accessible background, summary only
// COLD (0.05 <= R < 0.25) - Inactive but retrievable
// DORMANT (0.02 <= R < 0.05) - Very weak, needs revival
// ARCHIVED (R < 0.02)  - Effectively forgotten, time-based archival
```

**Retrievability Calculation Priority** (tier-classifier.ts):

The tier classifier uses this priority order when calculating retrievability:

1. **Pre-computed `retrievability`**: If memory has a numeric `retrievability` field, use it directly (highest priority)
2. **FSRS calculation**: If timestamps exist (`last_review`, `lastReview`, `updated_at`, or `created_at`), calculate using FSRS formula
3. **Stability fallback**: If only `stability` exists but no timestamps, use `min(1, stability / 10)`
4. **Attention score fallback**: If `attentionScore` exists, use it directly
5. **Default**: Returns 0 if no data available

**Prediction Error Gating**: Prevents duplicate memories using three-tier similarity thresholds

```typescript
// Check if new memory is too similar to existing memories
const isDuplicate = await cognitive.predictionErrorGate.is_duplicate(
  newContent,         // New memory content
  existingMemories,   // Array of existing memories in same folder
  {
    tier1Threshold: 0.95,  // Near-identical threshold (BLOCK)
    tier2Threshold: 0.90,  // High similarity (WARN)
    tier3Threshold: 0.70,  // Medium similarity (LINK)
    tier4Threshold: 0.50   // Low similarity (NOTE)
  }
);
```

**Testing Effect**: Accessing memories strengthens them (desirable difficulty)

```typescript
// Update stability when memory is accessed
const newStability = cognitive.fsrsScheduler.update_stability(
  currentStability,   // Current memory stability
  grade              // Performance grade (1-4): 1=forgot, 4=easy recall
);
```

**Working Memory**: Manages session-scoped memory activation

| Aspect | Details |
|--------|---------|
| **Purpose** | Track recently accessed memories within a session |
| **Capacity** | Configurable limit (default: 7 items, inspired by Miller's Law) |
| **Decay** | Automatic cleanup of old items based on session boundaries |

**Co-Activation**: Activates related memories together

| Aspect | Details |
|--------|---------|
| **Purpose** | When one memory is retrieved, boost related memories |
| **Mechanism** | Shared spec folders, temporal proximity and entity relationships |
| **Impact** | Improves context coherence across multiple retrievals |

### Scoring and Ranking

**Importance Tiers**: Six-level classification system

| Tier | Decay | Boost | Description |
|------|-------|-------|-------------|
| Constitutional | No | 3.0x | Permanent rules and core principles |
| Critical | No | 2.0x | Essential information, breaking changes |
| Important | No | 1.5x | Significant context, architectural decisions |
| Normal | Yes | 1.0x | Standard information |
| Temporary | Yes (fast) | 0.5x | Session-specific, ephemeral |
| Deprecated | No | 0.0x | Obsolete but preserved |

**Composite Scoring**: Multi-factor ranking for spec folders

```typescript
// Combines recency, relevance, importance and access patterns
const score = scoring.folderScoring.calculate_folder_score({
  specFolder: 'specs/<###-spec-name>',
  queryRelevance: 0.85,
  lastAccessed: new Date('2025-01-20'),
  importanceTier: 'critical',
  accessCount: 12
});
```

### Storage and Persistence

**Access Tracking**: Records memory access patterns

| Feature | Description |
|---------|-------------|
| Track reads | Records when memories are retrieved |
| Access frequency | Counts how often memories are accessed |
| Recency boost | Recent access increases importance |

**Checkpoints**: Save and restore memory state

```typescript
// Save current state
await storage.checkpoints.save_checkpoint('before-refactor');

// Restore previous state
await storage.checkpoints.restore_checkpoint('before-refactor');
```

### Parsing and Validation

**Memory Parser**: Extracts structured data from markdown memory files

| Feature | Description |
|---------|-------------|
| ANCHOR sections | Parses `<!-- ANCHOR: name -->` blocks |
| Frontmatter | Extracts YAML metadata |
| Entity extraction | Identifies files, functions and concepts |

**Trigger Matcher**: Matches user prompts to memory trigger phrases

```typescript
// Find memories with matching trigger phrases
const matches = await parsing.triggerMatcher.match_triggers({
  prompt: 'How does authentication work?',
  threshold: 0.7
});
```

### Document-Type Indexing References

- `handlers/memory-index.ts`: indexes 5 sources and applies safety rules for incremental updates and post-success mtime writes.
- `lib/search/vector-index-impl.ts`: v13 migration adds `document_type` and `spec_level` columns and indexes.
- `tests/full-spec-doc-indexing.vitest.ts`: validates document typing, scoring multipliers and spec-doc intent routing.

<!-- /ANCHOR:features -->

---

## 5. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Semantic Memory Search

```typescript
// Search for memories related to a query
import * as vectorIndex from './search/vector-index';

const queryEmbedding = new Float32Array(vectorIndex.getEmbeddingDim());
const results = vectorIndex.vectorSearch(queryEmbedding, {
  limit: 5,
  specFolder: 'specs/<###-spec-name>' // Optional: filter by folder
});

console.log(`Found ${results.length} relevant memories`);
results.forEach(r => {
  console.log(`- ${r.title} (score: ${r.score.toFixed(2)})`);
});
```

**Result**: Returns top 5 memories ranked by semantic similarity and importance

### Example 2: FSRS-Based Memory State Calculation

```typescript
// Calculate memory state using FSRS retrievability
import { calculateRetrievabilityDecay } from './cognitive/attention-decay';

const lastAccessed = new Date('2025-01-15').getTime();
const stability = 7.0; // Memory stability in days
const now = Date.now();
const elapsedDays = (now - lastAccessed) / (1000 * 60 * 60 * 24);

// Calculate retrievability using FSRS power-law formula
const retrievability = calculateRetrievabilityDecay(stability, elapsedDays);

// Determine memory state (matches 5-state model)
let state: string;
if (retrievability >= 0.80) state = 'HOT';
else if (retrievability >= 0.25) state = 'WARM';
else if (retrievability >= 0.05) state = 'COLD';
else if (retrievability >= 0.02) state = 'DORMANT';
else state = 'ARCHIVED';

console.log(`Retrievability: ${retrievability.toFixed(2)}, State: ${state}`);
// Output: Retrievability: 0.76, State: WARM
```

### Example 3: Hybrid Search with Fusion

```typescript
// Combine semantic and keyword search
import { hybridSearch } from './search/hybrid-search';

const queryEmbedding = new Float32Array(768);
const results = await hybridSearch('TODO authentication', queryEmbedding, {
  limit: 10
});

// Results are merged using Reciprocal Rank Fusion
results.forEach(r => {
  console.log(`${r.title}: ${r.score?.toFixed?.(2) ?? 'n/a'}`);
});
```

### Example 4: Batch Processing with Retry

```typescript
// Process items in batches with automatic retry
import { processBatches } from '../utils/batch-processor';

const items = [/* ... large array ... */];

const results = await processBatches(
  items,
  async (batch) => {
    // Process each batch
    return await processItems(batch);
  },
  50,
  100,
  { maxRetries: 3 }
);
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Direct imports | `import { SQLiteVectorStore } from './search/vector-index';` | Focused module usage |
| Cognitive module | `import * as attentionDecay from './cognitive/attention-decay';` | Modules requiring database |
| Utility function | `import { formatAgeString } from './utils/format-helpers';` | Pure helper utilities |
| Error handling | `try { ... } catch (err) { if (err instanceof MemoryError) ... }` | Specific error types |

<!-- /ANCHOR:usage-examples -->

---

## 6. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Module not found

**Symptom**: `Error: Cannot find module './search/vector-index'`

**Cause**: Incorrect import path. The package does not export a `dist/lib` barrel.

**Solution**:
```typescript
// Import concrete modules that exist in lib/
import { SQLiteVectorStore } from './search/vector-index';
import * as attentionDecay from './cognitive/attention-decay';
```

#### Database not initialized

**Symptom**: `Error: [attention-decay] Database reference is required`

**Cause**: Cognitive modules require database initialization before use

**Solution**:
```typescript
import Database from 'better-sqlite3';
const db = new Database('context-index.sqlite');

// Initialize modules that need database
import * as attentionDecay from './cognitive/attention-decay';
attentionDecay.init(db);
```

#### Embedding API errors

**Symptom**: `Error: Voyage AI API request failed`

**Cause**: Missing API key or rate limit exceeded

**Solution**:
```typescript
// Set the environment variable before starting the process:
// export VOYAGE_API_KEY="your-api-key-here"

import * as embeddingsProvider from './providers/embeddings';
// Adjust provider settings or retry behavior as needed
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Import errors | Use concrete module paths such as `./search/vector-index` |
| Database errors | Initialize modules: `module.init(db)` |
| API rate limits | Check `VOYAGE_API_KEY` environment variable |
| Validation errors | Check input against `INPUT_LIMITS` in validation/preflight |

### Diagnostic Commands

```typescript
// Check direct imports
import { SQLiteVectorStore } from './search/vector-index';
import { calculateRetrievabilityDecay } from './cognitive/attention-decay';
console.log('Available exports:', SQLiteVectorStore.name, typeof calculateRetrievabilityDecay);

// Verify database connection
import Database from 'better-sqlite3';
const db = new Database('context-index.sqlite');
console.log('Tables:', db.prepare('SELECT name FROM sqlite_master WHERE type="table"').all());

// Test embedding provider
import * as embeddingsProvider from './providers/embeddings';
const embedding = await embeddingsProvider.generateQueryEmbedding('test query');
console.log('Embedding dimensions:', embedding.length);
```

<!-- /ANCHOR:troubleshooting -->

---

## 7. RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [MCP Server README](../README.md) | Overview of the entire MCP server |
| [Handlers Documentation](../handlers/README.md) | MCP tool handlers using lib modules |
| [Tests README](../tests/README.md) | Test suite for lib modules |
| [Utils README](../utils/README.md) | Utility functions documentation |

### Module Documentation

| Module | Purpose |
|--------|---------|
| [Search Modules](./search/) | Vector index, hybrid search, fusion algorithms |
| [Scoring Modules](./scoring/) | Importance tiers, composite scoring, folder ranking |
| [Cognitive Modules](./cognitive/) | Attention decay, working memory, co-activation |
| [Storage Modules](./storage/) | Access tracking, checkpoints, history |
| [Parsing Modules](./parsing/) | Memory parser, trigger matching, entity extraction |

### External Resources

| Resource | Description |
|----------|-------------|
| [Voyage AI Docs](https://docs.voyageai.com/) | Embedding API documentation |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | SQLite Node.js library |
| [MCP Protocol](https://modelcontextprotocol.io/) | Model Context Protocol specification |

<!-- /ANCHOR:related -->

---

*Documentation version: 1.6 | Last updated: 2026-03-25*
