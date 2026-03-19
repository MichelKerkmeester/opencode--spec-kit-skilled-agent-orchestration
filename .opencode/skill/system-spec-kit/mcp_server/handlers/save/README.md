---
title: "Save Handler Pipeline"
description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
trigger_phrases:
  - "save handler"
  - "memory save pipeline"
  - "save modules"
  - "memory indexing"
---


# Save Handler Pipeline

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. PIPELINE FLOW](#3--pipeline-flow)
- [4. KEY CONCEPTS](#4--key-concepts)
- [5. RELATED DOCUMENTS](#5--related-documents)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.

The barrel `index.ts` re-exports every module so consumers can import from `handlers/save` directly.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:structure -->
## 2. STRUCTURE

| File                        | Description                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `types.ts`                  | Shared interfaces for the pipeline: `IndexResult`, `PeDecision`, `SimilarMemory`, `SaveArgs`, `PostInsertMetadataFields` and related types. |
| `index.ts`                  | Barrel re-export of all save sub-modules.                                                                            |
| `dedup.ts`                  | Pre-save deduplication. `checkExistingRow` matches by file path but returns `unchanged` only for healthy rows (`success`, `pending`, `partial`); `checkContentHashDedup` matches by content hash and accepts chunked parents only when their status is valid `partial`. |
| `embedding-pipeline.ts`     | Embedding generation with persistent cache. Cache keys hash normalized content, matching the main and chunked embedding paths. Checks the embedding cache first, falls back to the provider, and stores new embeddings for future re-index. Async/deferred mode is opt-in. |
| `pe-orchestration.ts`       | Prediction-error (PE) gate orchestration. Finds similar memories, evaluates via `predictionErrorGate`, and applies REINFORCE, SUPERSEDE, UPDATE or CREATE_LINKED actions with mutation ledger logging. |
| `reconsolidation-bridge.ts` | TM-06 reconsolidation bridge. When enabled and a checkpoint exists, delegates to the reconsolidation engine for merge/conflict resolution before falling through to normal creation. |
| `create-record.ts`          | Core record creation. Inserts into vector index (or deferred index), applies post-insert metadata, links related memories and indexes into BM25 when enabled. |
| `db-helpers.ts`             | Database utility functions: `applyPostInsertMetadata` builds a dynamic UPDATE for metadata columns, `hasReconsolidationCheckpoint` verifies TM-06 safety gate prerequisites. |
| `post-insert.ts`            | Post-insert enrichment pipeline. Runs causal links processing, R10 entity extraction, R8 summary generation and S5 cross-document entity linking. Each step is feature-flag gated and independently error-guarded. |
| `response-builder.ts`       | Final response assembly. `buildIndexResult` constructs the `IndexResult` with PE actions, causal links and warnings. `buildSaveResponse` wraps it in a standard MCP success envelope with hints, triggers post-mutation hooks and runs N3-lite consolidation. |

<!-- /ANCHOR:structure -->
<!-- ANCHOR:pipeline-flow -->
## 3. PIPELINE FLOW

```
1. dedup          -- Skip if unchanged or duplicate content hash
2. embedding      -- Generate or retrieve cached embedding
3. save-quality-gate -- Evaluate semantic/structural quality before persistence
4. pe-orchestration -- Predict action via similarity comparison
5. reconsolidation -- Merge/conflict handling (TM-06, flag-gated)
6. create-record  -- Insert memory into vector + BM25 indexes
7. db-helpers     -- Apply post-insert metadata columns
8. post-insert    -- Enrich with entities, summaries, causal links
9. response-builder -- Assemble MCP response envelope
```

<!-- /ANCHOR:pipeline-flow -->
<!-- ANCHOR:key-concepts -->
## 4. KEY CONCEPTS

- **Prediction-Error (PE) Gate** -- Compares new content against existing memories to decide between CREATE, REINFORCE, UPDATE, SUPERSEDE or CREATE_LINKED actions.
- **Deferred Indexing** -- When embedding generation fails or async mode is explicitly requested, the memory is stored with `embedding_status = 'pending'` and remains searchable via BM25/FTS5. Normal watcher/ingest reindex cache misses still run the eager provider path.
- **Reconsolidation** -- Optional merge/conflict resolution pass that requires a pre-reconsolidation checkpoint (TM-06 safety gate).
- **Mutation Ledger** -- Every create/update action appends to the mutation ledger for audit trail.

<!-- /ANCHOR:key-concepts -->
<!-- ANCHOR:related-documents -->
## 5. RELATED DOCUMENTS

- `../memory-crud-utils.ts` -- mutation ledger helpers used by PE orchestration and reconsolidation
- `../pe-gating.ts` -- PE gate action functions (findSimilarMemories, reinforceExistingMemory, etc.)
- `../mutation-hooks.ts` -- post-mutation hook runner called during response building
- `../../lib/cognitive/prediction-error-gate.ts` -- core PE evaluation logic
- `../../lib/cognitive/fsrs-scheduler.ts` -- FSRS stability/difficulty defaults
- `../../lib/storage/reconsolidation.ts` -- reconsolidation engine
- `../../lib/search/vector-index.ts` -- vector index operations
- `../../lib/search/bm25-index.ts` -- BM25 full-text index
- `../../lib/providers/embeddings.ts` -- embedding provider interface

<!-- /ANCHOR:related-documents -->
