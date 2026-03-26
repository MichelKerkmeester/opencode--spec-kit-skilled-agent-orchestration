---
title: "Search Pipeline - 4-Stage Retrieval"
description: "Four-stage retrieval pipeline: candidate generation, fusion, reranking and filtering."
trigger_phrases:
  - "search pipeline"
  - "retrieval pipeline"
  - "4-stage pipeline"
  - "candidate generation"
  - "fusion scoring"
  - "reranking"
  - "stage 4 filter"
  - "score invariant"
  - "MPAB chunk collapse"
---

# Search Pipeline - 4-Stage Retrieval

A four-stage retrieval pipeline that takes a search query through candidate generation, score fusion, reranking and final filtering to produce ranked memory results.

---

## Table of Contents

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. PIPELINE STAGES](#3--pipeline-stages)
- [4. KEY INVARIANTS](#4--key-invariants)
- [5. RELATED DOCUMENTS](#5--related-documents)

---

## 1. OVERVIEW

The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.

The public API is a single function: `executePipeline(config)` exported from `index.ts`.

---

## 2. STRUCTURE

| File | Description |
|------|-------------|
| `index.ts` | Public barrel export. Re-exports `executePipeline` from the orchestrator and all pipeline type definitions from `types.ts`. |
| `orchestrator.ts` | Wires the four stages together in sequence. Passes each stage's output as input to the next and assembles the final `PipelineResult` with per-stage metadata. |
| `stage1-candidate-gen.ts` | Stage 1: Candidate Generation. Runs search channels (hybrid, vector, multi-concept), applies deep-mode query expansion (R6), embedding-based expansion (R12), summary embeddings (R8), constitutional memory injection, quality threshold filtering and tier/contextType filtering. |
| `stage2-fusion.ts` | Stage 2: Fusion + Signal Integration. The single authoritative scoring point. Applies 9 signal steps in fixed order: session boost, causal boost, co-activation spreading, community co-retrieval, graph signals, FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals, artifact limiting, anchor metadata and validation metadata scoring. |
| `stage3-rerank.ts` | Stage 3: Rerank + Aggregate. Applies cross-encoder reranking (remote or local GGUF), MMR diversity pruning and MPAB chunk collapse with parent document reassembly from the database. |
| `stage4-filter.ts` | Stage 4: Filter + Annotate. Removes results below minimum memory state priority, enforces per-tier limits, runs TRM evidence-gap detection and attaches annotation metadata. Enforces the score immutability invariant at runtime. |
| `types.ts` | All pipeline data contracts: `PipelineRow`, `Stage4ReadonlyRow`, `PipelineConfig`, stage I/O interfaces (`Stage1Input`/`Output` through `Stage4Input`/`Output`), `PipelineResult`, `ScoreSnapshot` and the `resolveEffectiveScore()` shared score resolution function. Also provides `captureScoreSnapshot()` and `verifyScoreInvariant()` for Stage 4 defence-in-depth. |

---

## 3. PIPELINE STAGES

```text
Query + Config
      |
      v
  Stage 1: Candidate Generation
      |  search channels, constitutional injection, quality filter
      v
  Stage 2: Fusion + Signal Integration
      |  session/causal/co-activation boosts, intent weights,
      |  artifact routing, feedback signals, FSRS write-back
      v
  Stage 3: Rerank + Aggregate
      |  cross-encoder reranking, MMR diversity, MPAB chunk collapse
      v
  Stage 4: Filter + Annotate
      |  state filter, per-tier limits, TRM evidence gap, annotations
      v
  PipelineResult { results, metadata, annotations, trace }
```

**Stage 1 - Candidate Generation** (`stage1-candidate-gen.ts`)
- Runs one or more search channels based on `searchType` and `mode`.
- Channels: hybrid (with optional deep-mode expansion), vector, multi-concept.
- Optional R12 embedding expansion and R8 summary embedding channels.
- Injects constitutional memories when absent and no tier filter is active.
- Applies quality threshold and tier/contextType filters.

**Stage 2 - Fusion + Signal Integration** (`stage2-fusion.ts`)
- The only stage where scoring modifications happen (except Stage 3 reranking).
- 9 signal steps applied in a fixed order that must not be reordered.
- G2 prevention: intent weights are applied only for non-hybrid search types.
- FSRS testing effect fires only when `trackAccess` is explicitly true.

**Stage 3 - Rerank + Aggregate** (`stage3-rerank.ts`)
- Cross-encoder reranking via remote API or local GGUF model.
- MMR diversity pruning using per-intent lambda values.
- MPAB chunk collapse: groups chunks by parent, elects best chunk, reassembles parent content from the database.
- Preserves Stage 2 scores as `stage2Score` for auditability.

**Stage 4 - Filter + Annotate** (`stage4-filter.ts`)
- Memory state priority filtering (HOT > WARM > COLD > DORMANT > ARCHIVED).
- Per-tier hard limits prevent any single tier from dominating results.
- TRM evidence-gap detection (Z-score confidence check on score distribution).
- Runtime score invariant verification via snapshot comparison.

---

## 4. KEY INVARIANTS

1. **Single Scoring Point.** All score modifications happen in Stage 2 (fusion) or Stage 3 (reranking). Stage 4 must not change any score field.
2. **G2 Double-Weighting Guard.** Intent weights are applied only for non-hybrid search types. Hybrid search incorporates intent weighting during RRF/RSF fusion internally.
3. **Stage 4 Score Immutability.** Enforced at compile time via `Stage4ReadonlyRow` readonly fields and at runtime via `captureScoreSnapshot()` / `verifyScoreInvariant()`.
4. **Score Resolution Consistency.** All stages use the shared `resolveEffectiveScore()` function from `types.ts` with fallback chain: `intentAdjustedScore` > `rrfScore` > `score` > `similarity/100`, clamped to [0, 1].

---

## 5. RELATED DOCUMENTS

- `mcp_server/lib/search/` - Parent search directory containing hybrid search, vector index, cross-encoder and other search modules consumed by the pipeline.
- `mcp_server/lib/ops/` - Background operations (file watcher, job queue) that feed data into the search index.
- `@spec-kit/shared/contracts/retrieval-trace.ts` - Trace contract used for pipeline observability.
- `@spec-kit/shared/algorithms/mmr-reranker.ts` - MMR algorithm used by Stage 3.
