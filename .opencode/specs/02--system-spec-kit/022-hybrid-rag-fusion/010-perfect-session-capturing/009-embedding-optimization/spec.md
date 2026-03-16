---
title: "Feature Specification: Embedding Optimization"
---
# Feature Specification: Embedding Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [010-perfect-session-capturing](../spec.md) |
| **R-Item** | R-09 |
| **Sequence** | B3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Current indexing embeds full markdown content as-is via `generateEmbedding(content)`. The `semanticChunk()` function preserves the first 500 and last 300 characters then selects decision/high/medium sections when content exceeds 8000 characters, but this is truncation rather than weighting. A dedicated `generateDocumentEmbedding()` function exists in the embedding library but the indexer does not use it. Temporal decay already lives at retrieval time and is not affected.

### Purpose

Replace raw `generateEmbedding(content)` in the indexer with a structured weighted payload builder that routes through `generateDocumentEmbedding()`, so that decision-heavy and outcome-rich memories produce higher-quality embeddings for retrieval without changing the retrieval-time temporal decay behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Build a weighted payload concatenation function: title + decisions x3 + outcomes x2 + general x1
- Route the indexer through `generateDocumentEmbedding()` instead of raw `generateEmbedding()`
- Wire the weighted payload builder into the semantic summarizer
- Preserve temporal decay in the searcher (query-time, already implemented)

### Out of Scope

- Changing temporal decay logic -- it stays in the searcher and is already current and query-tunable
- Modifying the embedding model or vector dimensions
- Changing the searcher or retrieval ranking algorithm

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/core/memory-indexer.ts` | Modify | Use `generateDocumentEmbedding` instead of `generateEmbedding` |
| `scripts/lib/semantic-summarizer.ts` | Modify | Build weighted payload: title + decisions x3 + outcomes x2 + general x1 |
| `mcp_server/lib/embedding/` | Modify | Wire `generateDocumentEmbedding` into the indexing path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Embedding input uses weighted concatenation: title + decisions x3 + outcomes x2 + general x1 | Payload builder produces repeated section content with correct multipliers before embedding |
| REQ-002 | `memory-indexer` routes through `generateDocumentEmbedding()` instead of raw `generateEmbedding()` | Indexer call site uses `generateDocumentEmbedding` and passes structured input |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Temporal decay stays in the searcher (already implemented, always current, query-tunable) | No changes to searcher decay logic; decay remains a retrieval-time concern |
| REQ-004 | Static decay inputs stored by the indexer for searcher consumption | Indexer persists the metadata fields that the searcher uses for temporal decay calculation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Retrieval quality measurably improves for decision-heavy memories -- decision-related queries return more relevant results in top-k
- **SC-002**: Embedding generation uses structured weighted input, not raw markdown -- `generateDocumentEmbedding` receives weighted payload from the semantic summarizer
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | R-08 (unified signal extractor) | Provides structured topic data for weighting | Can use existing section headers as fallback until R-08 lands |
| Risk | Over-weighting decisions distorts retrieval for non-decision queries | Medium | Weight multipliers are configurable; validate with diverse query set |
| Risk | Payload size exceeds embedding model token limit after repetition | Low | Cap total payload length after weighting; truncate general content first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **OQ-001**: Confirm searcher-side temporal decay placement. Any use case for indexer-side pre-computation?
<!-- /ANCHOR:questions -->
