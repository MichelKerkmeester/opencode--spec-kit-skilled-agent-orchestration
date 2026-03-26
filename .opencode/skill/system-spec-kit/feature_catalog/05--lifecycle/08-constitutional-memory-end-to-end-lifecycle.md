---
title: "Constitutional Memory end-to-end lifecycle"
description: "Covers the full constitutional memory path from `/memory:learn` authoring through indexing, retrieval injection, auto-surface hooks, cache layers, mutation invalidation, and operator controls."
---

# Constitutional Memory end-to-end lifecycle

## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. SOURCE METADATA](#4-source-metadata)

## 1. OVERVIEW

Covers the end-to-end lifecycle for constitutional memories: the always-surface rules managed by `/memory:learn`, stored in `.opencode/skill/system-spec-kit/constitutional/`, indexed into `memory_index`, injected into Stage 1 retrieval, surfaced through hook-driven context assembly, enriched with retrieval directives, and kept coherent through layered caches plus post-mutation invalidation.

In practice, this is the highest-priority memory path in the system. Constitutional memories are authored as compact global rules, indexed as first-class memory rows, exempt from normal decay behavior, and then retrieved through two separate runtime paths: search-pipeline injection for regular memory retrieval and auto-surface hooks for tool-dispatch/context-assembly flows.

---

## 2. CURRENT REALITY

- **Creation path.** `/memory:learn` is the operator control plane for constitutional memory lifecycle management. Its create flow writes a markdown rule into `.opencode/skill/system-spec-kit/constitutional/`, then immediately calls `memory_save({ filePath, force: true })`, and finally verifies the rule by running `memory_search()` against one of the trigger phrases. The same command family also exposes `list`, `edit`, `remove`, and `budget` actions, and documents the constitutional tier as the always-surface, no-decay, 3.0x-boost tier.

- **Parser tier inference.** `memory_save` explicitly accepts constitutional markdown files under `.opencode/skill/*/constitutional/`. Once accepted, `memory-parser.ts` classifies those files as `documentType = constitutional`, extracts title, trigger phrases, context type, importance tier, content hash, quality score, quality flags, and causal links, then runs `inferMemoryType()` to populate `memoryType`, `memoryTypeSource`, and confidence. Tier resolution prefers explicit frontmatter, then inline markers, then falls back to the document-type default tier. That means a constitutional file can still land in the constitutional tier even when the tier is being inferred rather than restated manually in every downstream step.

- **Storage schema.** `create-record.ts` persists constitutional memories through the same `memory_index` path used by other saved memories: `indexMemory()` for successful embeddings and `indexMemoryDeferred()` when embeddings are delayed. After the base row is created, `applyPostInsertMetadata()` stamps the metadata that matters for lifecycle behavior, including `content_hash`, `context_type`, `importance_tier`, `memory_type`, `type_inference_source`, FSRS defaults, `file_mtime_ms`, `document_type`, `quality_score`, and `quality_flags`. The fresh-schema definition in `vector-index-schema.ts` shows the wider storage contract around that row: `memory_index` stores location, canonical path, trigger phrases, embedding status, governance scope fields, context type, chunk parentage, learned triggers, interference score, and archive state; companion storage includes `vec_memories` for vector search, `memory_fts` for text retrieval, lineage tables for active-version projection, and the initialized `embedding_cache` table.

- **Retrieval path 1: Stage 1 injection.** `stage1-candidate-gen.ts` keeps constitutional memories on the main search path instead of bolting them on after ranking. When `includeConstitutional = true`, no explicit tier filter is active, and the current candidate set does not already contain constitutional rows, Stage 1 reuses the cached or generated query embedding and issues a dedicated `vectorSearch(..., { tier: 'constitutional', useDecay: false })` call. It injects up to five constitutional rows, deduplicates them against existing candidates, then re-applies context and governance-scope filtering before the results continue to later scoring/reranking stages. The effect is that constitutional memories become normal Stage 1 candidates, just sourced from a protected tier-specific fetch.

- **Retrieval path 2: auto-surface hooks.** `hooks/memory-surface.ts` implements the second runtime path, which is separate from the main search pipeline. It runs around memory-aware tool usage and lifecycle hook points such as tool dispatch and compaction. That hook path always fetches constitutional memories, adds fast trigger-matched memories from the current context hint, and returns a compact `AutoSurfaceResult` payload only when something relevant exists. Hook-specific token budgets enforce bounded payload size, with truncation first removing triggered rows and then constitutional rows if necessary.

- **Retrieval-directive enrichment.** The hook path enriches constitutional results with `retrieval_directive` metadata before returning them. `retrieval-directives.ts` derives deterministic, synchronous instruction strings from the rule content, formatted as `"Always surface when: ... | Prioritize when: ..."`. The source is explicit that this is a metadata-only enrichment pass: it does not filter, reorder, or rescore memories. When the file can be read safely, directives are content-derived; when file reads fail, the system falls back to a title-based directive rather than dropping the memory from the surfaced set.

- **Two retrieval implementations inside the search layer.** `vector-index-queries.ts` shows the constitutional tier participating in retrieval in two related ways. First, `vector_search()` prepends constitutional rows when `includeConstitutional` is enabled and the caller is not explicitly searching only the constitutional tier. Second, `get_constitutional_memories_public()` exists as a prompt-assembly helper that fetches constitutional rows directly and applies a token-budget cap. Those search-layer functions complement, rather than replace, the Stage 1 injection path and the hook-based auto-surface path.

- **4-layer cache architecture.** From the requested source set, the visible cache stack is four layers deep:
  1. Request-scope embedding reuse in Stage 1 via `cachedEmbedding`, which avoids generating a second query embedding just to fetch constitutional injections.
  2. Hook-layer constitutional cache in `memory-surface.ts`, with a 60-second TTL for auto-surface operations.
  3. Store-layer constitutional cache in `vector-index-store.ts`, keyed by `spec_folder` plus `includeArchived`, guarded by DB `mtime` validation, token-capped, and protected against thundering-herd reloads with `constitutional_cache_loading`.
  4. Database infrastructure caches in `vector-index-store.ts`: a `WeakMap` of prepared statements scoped per `Database` instance and a resolved-path connection cache that reuses validated DB handles.

- **Mutation invalidation.** After a successful atomic save, `memory-save.ts` runs `runPostMutationHooks('atomic-save', ...)` for any save that is neither `duplicate` nor `unchanged`. The surfaced feedback contract shows what invalidation means in practice for this lifecycle: trigger cache clearing, constitutional cache clearing, tool cache invalidation counts, graph-signals cache clearing, and coactivation cache clearing. Duplicate and unchanged saves intentionally skip this hook emission and return a hint that caches were left unchanged.

- **Operator controls.** The operator-facing lifecycle remains centered on `/memory:learn`. It provides create, list, edit, remove, and budget dashboards; enforces a shared constitutional token budget of roughly 2000 tokens; and expects created rules to be short, trigger-rich, and globally applicable. That operator budget lines up with the retrieval side, where both direct constitutional retrieval and cache-backed constitutional fetches also trim the surfaced set to stay within bounded prompt budgets.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/command/memory/learn.md` | Command | Operator workflow for create/list/edit/remove/budget lifecycle actions |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Handler | Accepts constitutional files, validates/parses them, indexes them, and emits post-mutation invalidation feedback |
| `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Parsing | Classifies constitutional files, extracts metadata, infers tier and memory type, and defines constitutional file eligibility |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts` | Save handler | Creates `memory_index` rows and applies persisted lifecycle metadata |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface lifecycle path with constitutional cache, trigger matching, directive enrichment, and token budgeting |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Search pipeline | Injects constitutional memories into Stage 1 candidate generation |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Search query | Exposes direct constitutional retrieval through vector search and prompt-assembly helpers |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts` | Search enrichment | Extracts and formats `retrieval_directive` metadata for constitutional memories |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Search store | Implements constitutional cache, prepared-statement cache, and connection cache behavior |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Schema | Defines the persisted `memory_index` contract and companion storage used by this lifecycle |

---

## 4. SOURCE METADATA

- Group: Lifecycle
- Source feature title: Constitutional Memory End-to-End Lifecycle
- Source spec: Deep research remediation 2026-03-26
