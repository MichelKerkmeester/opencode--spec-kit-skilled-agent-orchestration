---
title: "Feature Specification: Embedding Optimization"
description: "Optimize embedding workload and retrieval preparation for memory indexing."
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
| **Status** | Complete |
| **Created** | 2026-03-16 |
| **Completed** | 2026-03-16 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 9 of 16 |
| **Predecessor** | 008-signal-extraction |
| **Successor** | 010-integration-testing |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-09 |
| **Sequence** | B3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 9** of the Perfect Session Capturing specification.

**Scope Boundary**: Before this phase, the scripts-side indexer embedded raw markdown via generateEmbedding(content), while the MCP save path normalized content but still treated the document as a flat body.
**Dependencies**: 008-signal-extraction
**Deliverables**: Built a weighted payload concatenation function (title + decisions x3 + outcomes x2 + general x1); routed scripts indexer through generateDocumentEmbedding()
<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Before this phase, the scripts-side indexer embedded raw markdown via `generateEmbedding(content)`, while the MCP save path normalized content but still treated the document as a flat body. The shared embedding layer already exposed `generateDocumentEmbedding()`, but neither save surface supplied a weighted title/decision/outcome payload. Temporal decay already lived at retrieval time and was not part of the indexing problem.

### Purpose

Add one shared weighted document-text builder and use it on the scripts indexer path plus the MCP `memory_save` path, so decision-heavy and outcome-rich memories produce stronger document embeddings without changing retrieval-time decay behavior or widening the rollout to other document callers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Build a weighted payload concatenation function: title + decisions x3 + outcomes x2 + general x1
- Route the scripts indexer through `generateDocumentEmbedding()` instead of raw `generateEmbedding()`
- Build script-side weighted sections from the implementation summary with markdown fallback
- Route the MCP `memory_save` embedding pipeline through the same weighted payload contract
- Preserve temporal decay in the searcher (query-time, already implemented)

### Out of Scope

- Changing temporal decay logic -- it stays in the searcher and is already current and query-tunable
- Modifying the embedding model or vector dimensions
- Changing the searcher or retrieval ranking algorithm

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `shared/embeddings.ts` | Modify | Add `WeightedDocumentSections` and `buildWeightedDocumentText()` |
| `scripts/lib/semantic-summarizer.ts` | Modify | Build weighted sections from implementation summary data plus markdown fallback |
| `scripts/core/workflow.ts` | Modify | Pass precomputed weighted sections into the indexer handoff |
| `scripts/core/memory-indexer.ts` | Modify | Use `generateDocumentEmbedding()` with weighted document text |
| `mcp_server/handlers/save/embedding-pipeline.ts` | Modify | Build weighted save-path sections and route them through `generateDocumentEmbedding()` |
| `scripts/tests/memory-indexer-weighting.vitest.ts` | Create | Scripts-side routing coverage for weighted document input |
| `mcp_server/tests/embedding-weighting.vitest.ts` | Create | Helper/unit coverage plus deterministic ranking-oriented fixture |
| `mcp_server/tests/embedding-pipeline-weighting.vitest.ts` | Create | Save-path weighting coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Embedding input uses weighted concatenation: title + decisions x3 + outcomes x2 + general x1 | Payload builder produces repeated section content with correct multipliers before embedding |
| REQ-002 | Scripts indexing uses `generateDocumentEmbedding()` instead of raw `generateEmbedding()` | `memory-indexer.ts` calls `generateDocumentEmbedding()` with weighted document text |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Temporal decay stays in the searcher (already implemented, always current, query-tunable) | No changes to searcher decay logic; decay remains a retrieval-time concern |
| REQ-004 | Static decay inputs stored by the indexer for searcher consumption | Existing index/write paths still persist the metadata fields that the searcher uses for temporal decay calculation |
| REQ-005 | MCP `memory_save` uses the same weighted document payload contract | `embedding-pipeline.ts` builds weighted sections from parsed memory content before calling `generateDocumentEmbedding()` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** a weighted payload with title, decisions, outcomes, and general content, **Then** helper coverage proves correct multipliers, ordering, empty-section handling, and truncation priority.
- **SC-002**: **Given** scripts indexing and MCP `memory_save` flows, **Then** both call `generateDocumentEmbedding()` with weighted document text instead of raw markdown.
- **SC-003**: **Given** a decision-focused query fixture, **Then** the decision-rich memory ranks above a general memory when weighting is applied.
- **SC-004**: **Given** retrieval-time decay behavior in the searcher, **Then** this phase leaves decay ownership unchanged while improving embedding input quality.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | R-08 (unified signal extractor) | Provides aligned script-side topic conventions | Reuse the existing implementation-summary and heading heuristics instead of adding a new classifier |
| Risk | Over-weighting decisions distorts retrieval for non-decision queries | Medium | Keep the rollout scoped to scripts + `memory_save` and validate with a ranking-oriented fixture |
| Risk | Payload size exceeds embedding model token limit after repetition | Low | Cap total payload length after weighting; truncate general content first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **OQ-001**: Temporal decay remains searcher-side only. This phase does not add indexer-side pre-computation.
- **OQ-002**: Broader document-embedding parity is deferred; this rollout covers the scripts indexer and `memory_save` only.
<!-- /ANCHOR:questions -->

---
