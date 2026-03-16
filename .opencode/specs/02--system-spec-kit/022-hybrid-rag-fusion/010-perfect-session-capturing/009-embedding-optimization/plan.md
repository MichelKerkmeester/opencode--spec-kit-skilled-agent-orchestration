---
title: "Implementation Plan: Embedding Optimization"
---
# Implementation Plan: Embedding Optimization

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] All acceptance criteria met (REQ-001 through REQ-004)
- [ ] Tests passing -- weighted payload builder unit tests and indexer integration tests
- [ ] Docs updated (spec/plan in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pipeline modification -- weighted payload builder injected between content extraction and embedding generation, with indexer routing updated to use the document-aware embedding function.

### Key Components

- **Weighted payload builder (`scripts/lib/semantic-summarizer.ts`)**: Takes structured memory content (title, decisions, outcomes, general) and produces a weighted concatenation with section repetition for emphasis
- **Memory indexer (`scripts/core/memory-indexer.ts`)**: Updated to call `generateDocumentEmbedding` with the weighted payload instead of raw content
- **Embedding wiring (`mcp_server/lib/embedding/`)**: Ensures `generateDocumentEmbedding` is available and invoked in the indexing path

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

### Phase 1: Weighted Payload Builder

- [ ] Add `buildWeightedEmbeddingPayload()` function to `semantic-summarizer.ts`
- [ ] Accept structured input: `{ title, decisions[], outcomes[], generalContent }`
- [ ] Concatenate with multipliers: title (1x) + each decision (3x) + each outcome (2x) + general (1x)
- [ ] Add total length cap with truncation priority: general first, then outcomes, then decisions
- [ ] Unit test: verify correct concatenation and multiplier behavior

### Phase 2: Indexer Routing Update

- [ ] Update `memory-indexer.ts` to import and call `generateDocumentEmbedding` instead of `generateEmbedding`
- [ ] Extract structured sections from memory content before passing to payload builder
- [ ] Pass weighted payload to `generateDocumentEmbedding()`
- [ ] Ensure static decay metadata fields are persisted for searcher consumption

### Phase 3: Embedding Library Wiring

- [ ] Verify `generateDocumentEmbedding` is exported from `mcp_server/lib/embedding/`
- [ ] Wire the function into the indexing path if not already available
- [ ] Ensure the function accepts the weighted payload format

### Phase 4: Verification

- [ ] Run existing embedding and indexer test suites
- [ ] Add test cases for weighted payload generation with various content structures
- [ ] Test with decision-heavy memories and verify improved retrieval ranking
- [ ] Confirm temporal decay behavior is unchanged at query time
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
| R-08 (unified signal extractor) | Internal | Yellow | Provides structured topic data for section identification; can use existing section header parsing as fallback |
| `generateDocumentEmbedding` function | Internal | Green | Already exists in embedding library but unused by indexer |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Embedding quality degrades for non-decision queries, or payload size causes embedding failures
- **Procedure**: Revert indexer to call `generateEmbedding(content)` directly; remove weighted payload builder; `generateDocumentEmbedding` remains available but unused. Re-index affected memories with raw content.
<!-- /ANCHOR:rollback -->
