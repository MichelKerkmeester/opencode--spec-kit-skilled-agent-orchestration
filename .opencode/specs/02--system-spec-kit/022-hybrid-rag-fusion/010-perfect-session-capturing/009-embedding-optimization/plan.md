---
title: "Implementation Plan: Embedding Optimization"
---
# Implementation Plan: Embedding Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | generate-context.js pipeline, MCP embedding library |
| **Storage** | SQLite vector store (via embedding library) |
| **Testing** | Vitest |

### Overview

This plan implements an embedding pipeline update: build a weighted payload builder in the semantic summarizer that concatenates title + decisions x3 + outcomes x2 + general x1, then route the memory indexer through `generateDocumentEmbedding()` instead of raw `generateEmbedding()`. The goal is to produce embeddings that give higher weight to decision and outcome content, improving retrieval quality for the most valuable parts of captured memories without altering the retrieval-time temporal decay behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (R-08 for structured topic data)

### Definition of Done

- [x] All acceptance criteria met (REQ-001 through REQ-005)
- [x] Tests passing for helper behavior, scripts routing, save-path weighting, and ranking-oriented coverage
- [x] Docs updated to match the actual implementation seams in this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pipeline modification -- weighted payload builder injected between content extraction and embedding generation, with indexer routing updated to use the document-aware embedding function.

### Key Components

- **Shared weighted helper (`shared/embeddings.ts`)**: Owns the canonical `title + decisions x3 + outcomes x2 + general x1` contract and truncation policy.
- **Scripts summary/indexing path (`scripts/lib/semantic-summarizer.ts`, `scripts/core/workflow.ts`, `scripts/core/memory-indexer.ts`)**: Builds weighted sections from implementation-summary data plus markdown fallback and sends weighted text into `generateDocumentEmbedding()`.
- **MCP save path (`mcp_server/handlers/save/embedding-pipeline.ts`)**: Extracts weighted sections from parsed memory content and uses the same weighted helper before save-time embedding generation.

### Data Flow

1. Memory content is parsed into structured sections: title, decisions, outcomes, general body
2. Weighted payload builder concatenates: title (1x) + decisions (3x) + outcomes (2x) + general (1x)
3. Total payload is length-capped if it exceeds the embedding model token limit (truncate general first)
4. Memory indexer passes the weighted payload to `generateDocumentEmbedding()`
5. Resulting embedding vector is stored; static decay metadata is persisted alongside for searcher use
6. At query time, searcher applies temporal decay as before (no change)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Shared Weighting Contract

- [x] Added `WeightedDocumentSections` and `buildWeightedDocumentText()` in `shared/embeddings.ts`.
- [x] Implemented section multipliers and length capping with truncation priority `general -> outcomes -> decisions -> title`.

### Phase 2: Scripts Indexing Rollout

- [x] Added `buildWeightedEmbeddingSections()` in `scripts/lib/semantic-summarizer.ts`.
- [x] Updated `scripts/core/workflow.ts` to hand precomputed weighted sections to the indexer.
- [x] Updated `scripts/core/memory-indexer.ts` to call `generateDocumentEmbedding()` with weighted text instead of raw `generateEmbedding()`.

### Phase 3: MCP Save Rollout

- [x] Updated `mcp_server/handlers/save/embedding-pipeline.ts` to build weighted sections from parsed memory content.
- [x] Kept the rollout scoped to `memory_save`; other document callers were intentionally left unchanged.

### Phase 4: Verification

- [x] Added focused helper/unit/routing/save-path coverage.
- [x] Added a deterministic ranking-oriented fixture for decision-focused retrieval behavior.
- [x] Re-ran scripts and MCP compile/test gates without changing temporal decay behavior.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Weighted payload builder: correct concatenation, multipliers, length capping, truncation order | Vitest |
| Unit | Indexer routing: `generateDocumentEmbedding` called with weighted payload | Vitest |
| Integration | End-to-end: index a decision-heavy memory, query for decisions, verify top-k ranking improvement | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| R-08 (unified signal extractor) | Internal | Green | Existing summary and signal-extraction heuristics were sufficient for this phase |
| `generateDocumentEmbedding` function | Internal | Green | Already exists in embedding library but unused by indexer |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Embedding quality degrades for non-decision queries, or payload size causes embedding failures
- **Procedure**: Revert indexer to call `generateEmbedding(content)` directly; remove weighted payload builder; `generateDocumentEmbedding` remains available but unused. Re-index affected memories with raw content.
<!-- /ANCHOR:rollback -->
