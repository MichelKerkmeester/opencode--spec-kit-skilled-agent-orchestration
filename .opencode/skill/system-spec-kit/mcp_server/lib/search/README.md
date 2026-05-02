---
title: "Search: Memory Retrieval Package"
description: "Code-folder guide for hybrid memory search, vector storage, lexical retrieval, graph signals, reranking, and query routing."
trigger_phrases:
  - "search subsystem"
  - "hybrid search"
  - "vector index"
  - "memory search pipeline"
  - "RRF fusion"
---

# Search: Memory Retrieval Package

> Hybrid memory search package for vector storage, lexical retrieval, graph signals, reranking, and query routing.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/search/` owns memory retrieval for the MCP server. It turns a plain-language query into ranked spec-doc records using vector search, lexical search, graph signals, query routing, scoring, optional reranking, and response metadata.

Current state:

- `hybrid-search.ts` coordinates the main retrieval path.
- `pipeline/` splits search into candidate generation, fusion, enrichment, rerank, and final filtering stages.
- `vector-index*.ts` files own SQLite vector schema, queries, mutations, aliases, and storage helpers.
- `bm25-index.ts` and `sqlite-fts.ts` provide lexical retrieval.
- `graph-search-fn.ts`, `causal-boost.ts`, and graph signal helpers add relationship-aware scoring.
- Query helpers classify intent, route by complexity, expand queries, decompose complex input, and build recovery payloads.

This folder is a domain package. It does not expose MCP tools directly. Handlers call into it through stable exports and receive ranked results, diagnostics, and metadata.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                       SEARCH PACKAGE                             │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ handlers/    │ ───▶ │ hybrid-search.ts │ ───▶ │ pipeline/       │
│ memory tools │      │ orchestration    │      │ staged ranking  │
└──────┬───────┘      └────────┬─────────┘      └────────┬────────┘
       │                       │                         │
       │                       ▼                         ▼
       │              ┌──────────────────┐      ┌─────────────────┐
       └───────────▶  │ query helpers    │      │ vector + lexical│
                      │ intent + routing │      │ retrieval       │
                      └────────┬─────────┘      └────────┬────────┘
                               │                         │
                               ▼                         ▼
                      ┌──────────────────┐      ┌─────────────────┐
                      │ graph signals    │ ───▶ │ rerank + filter │
                      │ causal context   │      │ final payload   │
                      └──────────────────┘      └─────────────────┘

Dependency direction:
handlers ───▶ hybrid-search.ts ───▶ pipeline and retrieval modules
pipeline ───▶ vector, lexical, graph, scoring, and metadata helpers
retrieval helpers ───▶ shared types and database adapters
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
lib/search/
+-- hybrid-search.ts          # Main retrieval orchestration
+-- pipeline/                 # Stage-based candidate, score, rerank, and filter flow
+-- vector-index.ts           # Public vector index facade
+-- vector-index-*.ts         # Schema, query, mutation, store, type, and alias modules
+-- bm25-index.ts             # Pure TypeScript BM25 retrieval
+-- sqlite-fts.ts             # SQLite FTS5 lexical retrieval
+-- graph-search-fn.ts        # Graph and degree retrieval channel
+-- causal-boost.ts           # Causal-neighbor score adjustment
+-- intent-classifier.ts      # Query intent detection
+-- query-*.ts                # Query classification, routing, expansion, decomposition, and surrogates
+-- *feedback*.ts             # Learned feedback and denylist support
+-- *metadata*.ts             # Anchor and validation metadata helpers
+-- *rerank*.ts               # Cross-encoder, local, and score reranking gates
+-- session-*.ts              # Per-session search context and transitions
`-- README.md
```

Allowed dependency direction:

```text
hybrid-search.ts → pipeline/ and retrieval helpers
pipeline/ → vector-index, BM25, FTS, graph, scoring, metadata helpers
vector-index.ts → vector-index-types/schema/queries/mutations/store/aliases
query helpers → shared search types and local utilities
```

Disallowed dependency direction:

```text
lib/search/ → handlers/
vector-index-* → pipeline orchestration when a smaller helper import is enough
graph scoring helpers → MCP transport modules
tests or fixtures → production modules through private build output
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
lib/search/
+-- pipeline/
|   +-- orchestrator.ts       # Stage runner for search pipeline execution
|   +-- stage1-candidate-gen.ts
|   +-- stage2-fusion.ts
|   +-- stage2b-enrichment.ts
|   +-- stage3-rerank.ts
|   +-- stage4-filter.ts
|   +-- ranking-contract.ts
|   +-- types.ts
|   `-- README.md
+-- vector-index.ts
+-- vector-index-types.ts
+-- vector-index-schema.ts
+-- vector-index-queries.ts
+-- vector-index-mutations.ts
+-- vector-index-store.ts
+-- vector-index-aliases.ts
+-- vector-index-impl.ts
+-- hybrid-search.ts
+-- bm25-index.ts
+-- sqlite-fts.ts
+-- cross-encoder.ts
+-- local-reranker.ts
+-- graph-search-fn.ts
+-- intent-classifier.ts
+-- query-router.ts
+-- query-classifier.ts
+-- query-expander.ts
+-- query-decomposer.ts
+-- search-types.ts
+-- search-utils.ts
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `hybrid-search.ts` | Coordinates multi-channel retrieval and returns ranked search results. |
| `pipeline/orchestrator.ts` | Runs the stage-based search flow. |
| `pipeline/stage1-candidate-gen.ts` | Gathers candidates without final scoring changes. |
| `pipeline/stage2-fusion.ts` | Applies fusion and scoring signals. |
| `pipeline/stage2b-enrichment.ts` | Adds enrichment metadata after core fusion. |
| `pipeline/stage3-rerank.ts` | Runs reranking and aggregation when gates allow it. |
| `pipeline/stage4-filter.ts` | Applies final filtering, budgets, and annotations. |
| `vector-index.ts` | Public facade for vector index operations. |
| `vector-index-schema.ts` | Creates and migrates vector index tables. |
| `vector-index-queries.ts` | Reads vector index data and similarity matches. |
| `vector-index-mutations.ts` | Writes, updates, and deletes vector index records. |
| `bm25-index.ts` | Provides keyword ranking without external runtime dependencies. |
| `sqlite-fts.ts` | Runs SQLite FTS5 lexical queries when available. |
| `graph-search-fn.ts` | Produces graph and degree-channel candidates. |
| `intent-classifier.ts` | Maps query text to task intent. |
| `search-types.ts` | Defines shared search result and option types. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public callers | MCP handlers should enter through `hybrid-search.ts`, vector index facades, or named helper exports. |
| Pipeline stages | Stage modules should keep their single responsibility and pass typed rows forward. |
| Vector storage | Schema, query, mutation, and store files keep storage rules separate from ranking. |
| Lexical retrieval | BM25 and FTS helpers return candidates, not transport-level responses. |
| Graph signals | Graph helpers score memory relationships and should not call MCP handlers. |
| Session context | Session helpers may affect ranking inputs, but they should not own persistence policy outside search state. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ memory_search or memory_context handler  │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ classify intent and route query           │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ gather vector, lexical, graph candidates  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ fuse scores and add ranking signals       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ rerank, aggregate, filter, annotate       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ ranked memory results and diagnostics     │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `unifiedSearch` | Function | Main hybrid search path used by memory handlers. |
| `init` | Function | Initializes search dependencies for runtime use. |
| `classifyIntent` | Function | Detects task intent before retrieval. |
| `vectorSearch` | Function | Reads vector similarity results from the vector index. |
| `initializeDb` | Function | Creates or opens the search database schema. |
| `pipeline/orchestrator.ts` | Module | Runs staged retrieval when the pipeline path is used. |
| `cross-encoder.ts` | Module | Reranks candidates with remote or local providers when enabled. |
| `bm25-index.ts` | Module | Provides direct lexical search helpers. |
| `sqlite-fts.ts` | Module | Provides FTS5-backed lexical helpers. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run package checks from `mcp_server/`.

```bash
npm run build
npm test -- lib/search
```

Focused documentation checks from the repository root:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
```

Expected result: build and focused tests exit 0, README validation reports no blocking issues, and structure extraction returns a README document profile.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [`../../README.md`](../../README.md)
- [`pipeline/README.md`](./pipeline/README.md)
- [`../cognitive/README.md`](../cognitive/README.md)
- [`../storage/README.md`](../storage/README.md)
- [`../parsing/README.md`](../parsing/README.md)
- [`../extraction/README.md`](../extraction/README.md)
- [`../../ENV_REFERENCE.md`](../../ENV_REFERENCE.md)

<!-- /ANCHOR:related -->
