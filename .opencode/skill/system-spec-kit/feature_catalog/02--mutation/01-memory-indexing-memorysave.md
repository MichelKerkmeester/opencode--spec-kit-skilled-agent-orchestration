---
title: "Memory indexing (memory_save)"
description: "Covers the save entry point that reads files, generates embeddings, applies quality gating and indexes content into the memory database."
audited_post_018: true
phase_018_replaces: "legacy memory-file save model with spec-doc anchored continuity save path"
---

# Memory indexing (memory_save)

## 1. OVERVIEW

Covers the save entry point that reads files, generates embeddings, applies quality gating and indexes content into the memory database.

This is how you add new knowledge to the system. You point it at a file and it reads, understands and stores the content so it becomes searchable. Before storing, it checks whether the same information already exists and decides whether to add it fresh, update an older version or skip it entirely. Quality checks catch low-value content before it clutters up the knowledge base.

---

## 2. CURRENT REALITY

`memory_save` is the save entry point for the canonical packet continuity path. You point it at a packet document or other supported markdown input, and it routes the content through `contentRouter`, applies the selected merge behavior via `anchorMergeOperation`, and writes the result through `atomicIndexMemory` inside the existing spec-folder lock. `_memory.continuity` now lives as supporting frontmatter state inside the spec doc, and `/spec_kit:resume` remains the canonical recovery surface.

The canonical router now classifies save chunks across 8 categories: `narrative_progress`, `narrative_delivery`, `decision`, `handover_state`, `research_finding`, `task_update`, `metadata_only`, and `drop`. Tier 1 handles structured and heuristic routes, Tier 2 compares against the routing prototype library, and Tier 3 is now wired into the live save handler by default and the configured LLM endpoint is available. Delivery cues now favor sequencing, gating, rollout, and verification language over generic implementation verbs, while the handover/drop boundary keeps hard transcript or telemetry wrappers on the refuse-to-route side and lets softer operational phrases survive when the chunk is clearly a stop-state note.

`routeAs` can force any of the 8 categories and preserves the natural router decision for audit when the override crosses a natural `drop`. Router session context now passes `packet_kind` derived from spec metadata first (`type`, `title`, `description`), with parent-phase fallback only when the metadata is silent.

Before the indexed write, the handler still normalizes content, generates embeddings, runs prediction-error arbitration, applies the three-layer quality gate and performs reconsolidation where enabled. The save path still records mutation history, invalidates caches and preserves async-embedding behavior, but those steps now feed spec-doc anchored continuity instead of treating legacy memory-file continuity as the primary source of truth.

The interesting part is what happens before the record is created. A Prediction Error (PE) gating system compares the new content against existing memories via cosine similarity and decides one of five actions. CREATE stores a new record when no similar memory exists. REINFORCE boosts the FSRS stability of an existing duplicate without creating a new entry (the system already knows this, so it strengthens the memory). UPDATE overwrites an existing high-similarity memory in-place when the new version supersedes the old. SUPERSEDE marks the old memory as deprecated, creates a new record and links them with a causal edge. CREATE_LINKED stores a new memory with a relationship edge to a similar but distinct existing memory.

A three-layer quality gate runs before storage when `SPECKIT_SAVE_QUALITY_GATE` is enabled (default ON). Layer 1 validates structure (title exists, content at least 50 characters, valid spec folder path). Layer 2 scores content quality across five dimensions (title, triggers, length, anchors, metadata) against a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity, rejecting near-duplicates above 0.92. A warn-only mode runs for the first 14 days after activation, logging would-reject decisions without blocking saves.

When `SPECKIT_QUALITY_LOOP=true`, the save path also runs a verify-fix-verify loop before storage. The runtime performs one initial evaluation and then up to 2 immediate auto-fix retries by default. The reported `attempts` count is the actual number of evaluations used, so early-break cases do not claim the full configured retry budget. Accepted saves persist quality-loop metadata fixes, while rewritten body content stays in memory until later hard-reject gates clear under the per-spec-folder lock. If the loop rejects the save, `atomicIndexMemory()` returns `status: 'rejected'` and rolls back the just-written index write instead of retrying again.

Two earlier hard-blocks now sit between the quality loop and the older pre-storage quality gate:

1. the shared semantic sufficiency gate, which rejects thin aligned memories with `INSUFFICIENT_CONTEXT_ABORT`
2. the spec-doc structure validator, which rejects malformed files when required frontmatter, mandatory section anchors/HTML ids, or cleanup invariants are missing

That means `memory_save` no longer treats a merely parseable file as good enough. It must be both semantically durable and structurally compliant before the pre-storage quality gate runs.

Reconsolidation-on-save runs after embedding generation only when `SPECKIT_RECONSOLIDATION=true` (default OFF). The system checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and `importance_weight` is boosted (capped at 1.0). Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores unchanged. A checkpoint must exist for the spec folder before reconsolidation can run.

For large files exceeding the chunking threshold, the system splits into a parent record (metadata only) plus child chunk records, each with its own embedding. Before indexing, anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary) and content density (weight 0.4, 0-1). Chunks scoring below 0.3 are dropped to reduce storage and search noise. The thinning never returns an empty array. Chunk embedding cache keys now hash normalized content, matching the main embedding path, so structurally equivalent chunks reuse the same cache entry.

When `SPECKIT_ENCODING_INTENT` is enabled (default ON), the content type is classified at index time as `document`, `code` or `structured_data` using heuristic scoring against a 0.4 threshold. The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. This metadata has no retrieval-time scoring impact yet. It builds a labeled dataset for future type-aware retrieval.

After every successful save, a consolidation cycle hook fires when `SPECKIT_CONSOLIDATION` is enabled (default ON). The N3-lite consolidation engine scans for contradictions (memory pairs above 0.85 cosine similarity with negation keyword conflicts), runs Hebbian strengthening on recently accessed edges (+0.05 per cycle with a 30-day decay), detects stale edges (unfetched for 90+ days) and enforces edge bounds (maximum 20 per node). The cycle runs on a weekly cadence.

The `asyncEmbedding` parameter (boolean, default `false`) enables non-blocking saves. When set to `true`, embedding generation is deferred: the memory record is written immediately with a `pending` embedding status, and an async background attempt generates the embedding afterward. The memory is immediately searchable via BM25 and FTS5 while the embedding processes. When `false` (the default), the save blocks until embedding generation completes before returning. Watcher- and ingest-driven reindex paths no longer force deferred embeddings on ordinary cache misses. They follow this normal synchronous path unless `asyncEmbedding: true` was explicitly requested or embedding generation actually fails.

Safety mechanisms run deep. Path security validation checks the file against an allowlist of base paths. File type validation accepts only `.md` and `.txt` in approved directories. Pre-flight validation checks anchor format, detects duplicates and estimates token budget before investing in embedding generation. A per-spec-folder mutex lock prevents TOCTOU race conditions when multiple saves target the same folder. SHA-256 content hashing skips same-path saves only when the existing row is in a healthy state (`success`, `pending`, or valid chunked-parent `partial`), so unhealthy rows still re-enter indexing. Cross-path hash dedup also accepts chunked parents in `partial` state and ignores invalid parent rows marked `complete`. A mutation ledger records every create, update, reinforce and supersede action for audit. The trigger matcher cache, tool cache and constitutional cache are all invalidated on write, and `memory_index_scan` now routes scan-triggered invalidation through the broader mutation-hook behavior used by other mutation paths. If embedding generation fails, the memory is still stored and searchable via BM25/FTS5 with the embedding marked as pending for later re-indexing.

Successful insertions now clear the search cache immediately instead of waiting for delete-time invalidation or TTL expiry. `index_memory()` calls `clear_search_cache()` after the transactional insert, active-projection update and optional `vec_memories` write succeed, so a brand-new memory becomes visible to repeated `memory_search` calls right away. The fix closes a stale-results gap where the save path could report success while cached searches still replayed a pre-insert snapshot.

Document type affects importance weighting automatically: constitutional files get 1.0, spec documents 0.8, plans 0.7, supporting memory artifacts 0.5 and scratch files 0.25.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-save.ts` | Handler | Save entry point and orchestration for validation, quality gating, PE arbitration, spec-doc routing, reconsolidation, and persistence |
| `mcp_server/handlers/save/atomic-index-memory.ts` | Handler | Atomic post-merge index/write commit for spec-doc continuity |
| `mcp_server/lib/routing/content-router.ts` | Lib | Classifies save content and selects the merge/routing path |
| `mcp_server/lib/merge/anchor-merge-operation.ts` | Lib | Anchor-aware merge modes used by the save path |
| `mcp_server/handlers/save/markdown-evidence-builder.ts` | Handler | Extracts structured markdown evidence snapshots used by save-time semantic sufficiency checks |
| `mcp_server/handlers/save/validation-responses.ts` | Handler | Builds insufficiency, template-contract, and dry-run response payloads for the save path |
| `mcp_server/handlers/save/embedding-pipeline.ts` | Handler | Embedding cache lookup, provider generation, and async/deferred pending behavior |
| `mcp_server/handlers/save/pe-orchestration.ts` | Handler | Save-path PE decision evaluation and early-return handling |
| `mcp_server/handlers/save/create-record.ts` | Handler | Record creation, BM25 insert, lineage transition, and save-time history writes |
| `mcp_server/handlers/save/spec-folder-mutex.ts` | Handler | Per-spec-folder serialization around save execution |
| `mcp_server/handlers/chunking-orchestrator.ts` | Handler | Chunked indexing path for large packet documents |
| `mcp_server/handlers/quality-loop.ts` | Handler | Verify-fix-verify quality loop before storage |
| `mcp_server/lib/validation/spec-doc-structure.ts` | Lib | Phase-018 spec-doc structure rule set for save legality |
| `mcp_server/lib/validation/save-quality-gate.ts` | Lib | Pre-storage quality gate and semantic dedup checks |
| `mcp_server/lib/storage/history.ts` | Lib | ADD/UPDATE history logging used by the save path |
| `shared/parsing/memory-template-contract.ts` | Shared | Rendered document structural contract validator |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-memory-save.vitest.ts` | Save handler validation and template-contract enforcement |
| `mcp_server/tests/memory-save-integration.vitest.ts` | Save-path PE arbitration integration tests |
| `mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts` | Save pipeline enforcement and async/deferred embedding scenarios |
| `mcp_server/tests/quality-loop.vitest.ts` | Quality loop behavior |

---

## 4. SOURCE METADATA

- Group: Mutation
- Source feature title: Memory indexing (memory_save)
- Current reality source: FEATURE_CATALOG.md
- Source list updated 2026-03-25 per deep review
