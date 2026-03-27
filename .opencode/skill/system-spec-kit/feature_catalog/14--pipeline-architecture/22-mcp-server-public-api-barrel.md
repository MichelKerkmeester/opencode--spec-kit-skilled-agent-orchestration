---
title: "MCP Server Public API Barrel"
description: "Stable top-level import surface re-exporting evaluation, indexing, search, provider, and metadata helpers without exposing internal lib/core/handlers modules."
---

# MCP Server Public API Barrel

## TABLE OF CONTENTS
- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

The `mcp_server/api/index.ts` file is the public barrel for the MCP server runtime. Its file header explicitly marks it as the single public entry point, and the README reinforces that external consumers such as scripts, eval tooling, and automation should import from `api/` instead of reaching into `lib/`, `core/`, or `handlers/` directly. In practice, that makes the barrel the stable top-level boundary that shields downstream code from internal path churn.

The barrel is broader than a simple re-export of the five `api/*.ts` modules. It also curates selected helper surfaces from internal `lib/` modules when those helpers are needed by script families such as spec-folder workflows, memory tooling, eval benchmarking, architecture metadata consumers, and rollout reporting. That keeps the public import contract centralized: consumers still use one approved boundary even when the underlying implementation lives in multiple subsystems.

Because it re-exports runtime functions, constants, types, namespace modules, and rollout metadata together, the barrel acts as a compatibility layer for orchestration code. Consumers can bootstrap search and indexing, run evals, inspect capability flags, and access approved metadata helpers from one import location without taking a direct dependency on private module layout.

---

## 2. CURRENT REALITY

The barrel currently re-exports the full evaluation surface from `api/eval.ts`: `runAblation`, `storeAblationResults`, `formatAblationReport`, `toHybridSearchFlags`, `isAblationEnabled`, `ALL_CHANNELS`, `runBM25Baseline`, `recordBaselineMetrics`, `loadGroundTruth`, and `initEvalDb`, plus the associated eval and BM25 types (`AblationChannel`, `AblationSearchFn`, `AblationReport`, `BM25SearchFn`, `BM25SearchResult`, and `BM25BaselineResult`). This makes the barrel an approved entrypoint for benchmark execution, baseline measurement, report formatting, and eval database bootstrap.

From `api/indexing.ts`, it exposes indexing lifecycle controls: `initializeIndexingRuntime`, `warmEmbeddingModel`, `runMemoryIndexScan`, and `closeIndexingRuntime`, along with `MemoryIndexScanArgs`. From `api/search.ts`, it exposes the hybrid search bootstrap and execution surface: `initHybridSearch`, `hybridSearchEnhanced`, `fts5Bm25Search`, `isFts5Available`, and `vectorIndex`, plus the public search types `HybridSearchOptions` and `HybridSearchResult`.

Provider and storage bootstrap surfaces are also promoted through the same boundary. `api/providers.ts` contributes `generateEmbedding`, `generateQueryEmbedding`, `getEmbeddingProfile`, and `retryManager`, while `api/storage.ts` contributes `initCheckpoints` and `initAccessTracker`. Together these exports let consumers initialize storage dependencies, produce embeddings, inspect embedding configuration, and use the retry orchestration surface without importing provider or storage internals directly.

The barrel also intentionally promotes several curated internal helpers. Folder-discovery helpers from `lib/search/folder-discovery.ts` include `generatePerFolderDescription`, `savePerFolderDescription`, `loadPerFolderDescription`, `extractKeywords`, `slugifyFolderName`, and the `PerFolderDescription` type. Entity extraction support comes from `lib/extraction/entity-extractor.ts` via `extractEntities` and `rebuildAutoEntities`. For benchmarking and instrumentation, the barrel exports namespace objects `sessionBoost`, `causalBoost`, and `workingMemory`, plus `initExtractionAdapter`, `getExtractionMetrics`, `resetExtractionMetrics`, and the `ExtractionMetrics` type from `lib/extraction/extraction-adapter.ts`.

Finally, the barrel exposes architecture and rollout metadata surfaces that would otherwise require deep internal imports. From `lib/architecture/layer-definitions.ts`, it exports `LAYER_DEFINITIONS`, `TOOL_LAYER_MAP`, `getLayerForTool`, `getLayerTokenBudget`, `LayerDefinition`, and `LayerId`. From `lib/collab/shared-spaces.ts`, it exports rollout reporting helpers `getSharedRolloutMetrics` and `getSharedRolloutCohortSummary` plus the related shared-space types. From `lib/config/capability-flags.ts`, it exports `getMemoryRoadmapCapabilityFlags`, `getMemoryRoadmapDefaults`, `getMemoryRoadmapPhase`, and `MemoryRoadmapCapabilityFlags`. The result is a single public barrel that spans evaluation, runtime bootstrap, search, provider orchestration, script-facing helper utilities, and rollout metadata, while keeping consumers on one stable import path.

---

## 3. SOURCE FILES

### Implementation
| File | Layer | Role |
|------|-------|------|
| `mcp_server/api/index.ts` | API | Top-level public barrel and stable import boundary |
| `mcp_server/api/eval.ts` | API | Evaluation, ablation, BM25 baseline, and eval DB exports |
| `mcp_server/api/indexing.ts` | API | Indexing runtime bootstrap, warmup, scan, and shutdown exports |
| `mcp_server/api/search.ts` | API | Hybrid search, BM25/FTS5, and vector index exports |
| `mcp_server/api/providers.ts` | API | Embedding generation, profile access, and retry exports |
| `mcp_server/api/storage.ts` | API | Checkpoint and access-tracker initialization exports (DEAD_CODE — only consumed internally by api/indexing.ts; no external callers found) |
| `mcp_server/lib/search/folder-discovery.ts` | Lib | Folder description, keyword extraction, and slug helper exports promoted by the barrel |
| `mcp_server/lib/extraction/entity-extractor.ts` | Lib | Entity extraction helpers promoted by the barrel |
| `mcp_server/lib/search/session-boost.ts` | Lib | Session boost benchmarking namespace exported by the barrel |
| `mcp_server/lib/search/causal-boost.ts` | Lib | Causal boost benchmarking namespace exported by the barrel |
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working-memory benchmarking namespace exported by the barrel |
| `mcp_server/lib/extraction/extraction-adapter.ts` | Lib | Extraction adapter metrics and lifecycle helpers promoted by the barrel |
| `mcp_server/lib/architecture/layer-definitions.ts` | Lib | Layer metadata, tool-layer mapping, and token budget helpers |
| `mcp_server/lib/collab/shared-spaces.ts` | Lib | Shared rollout metrics and cohort summary helpers |
| `mcp_server/lib/config/capability-flags.ts` | Lib | Roadmap capability flag and default/phase helpers |
| `mcp_server/api/README.md` | Docs | Consumer policy documenting `api/` as the approved public surface |

### Tests
| File | Focus |
|------|-------|
| `mcp_server/tests/api-public-surfaces.vitest.ts` | Direct barrel export contract for search and top-level API surfaces |
| `mcp_server/tests/feature-flag-reference-docs.vitest.ts` | Rollout metadata and capability-flag exports exposed by the top-level barrel |
| `mcp_server/tests/shared-spaces.vitest.ts` | Shared rollout metrics exposed through the public barrel |
| `mcp_server/tests/memory-roadmap-flags.vitest.ts` | Memory-roadmap phase/default/capability helpers exposed through the public barrel |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Source feature title: MCP Server Public API Barrel
- Current reality source: direct implementation audit of `mcp_server/api/index.ts` plus the listed export and rollout-metadata tests
