---
title: "Tasks: Embedd [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/009-embedding-optimization/tasks]"
description: 'title: "Tasks: Embedding Optimization [template:level_2/tasks.md]"'
trigger_phrases:
  - "tasks"
  - "embedd"
  - "009"
  - "embedding"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/009-embedding-optimization"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Embedding Optimization

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T001 Read existing `semanticChunk()` logic and `generateDocumentEmbedding()` API (`shared/embeddings.ts`, `mcp_server/lib/providers/embeddings.ts`)
- [x] T002 Identify structured section extraction points for title, decisions, outcomes, and general content on the scripts and save paths (`scripts/lib/semantic-summarizer.ts`, `mcp_server/handlers/save/embedding-pipeline.ts`)
- [x] T003 Verify the shared helper/export surface can expose the weighted payload builder without widening unrelated callers (`shared/index.ts`, `mcp_server/lib/providers/embeddings.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### Weighted Payload Builder (REQ-001)

- [x] T004 Add `WeightedDocumentSections` and `buildWeightedDocumentText()` to the shared embedding layer (`shared/embeddings.ts`)
- [x] T005 Accept structured input `{ title, decisions[], outcomes[], general }` through the shared helper and scripts/save-path extraction seams
- [x] T006 Implement concatenation with multipliers: title (1x) + each decision (3x) + each outcome (2x) + general (1x) (`shared/embeddings.ts`)
- [x] T007 Add total length cap with truncation priority: general first, then outcomes, then decisions (`shared/embeddings.ts`)

### Indexer Routing Update (REQ-002)

- [x] T008 Update memory indexer to call `generateDocumentEmbedding` instead of `generateEmbedding` (`scripts/core/memory-indexer.ts`)
- [x] T009 Build scripts-side weighted sections from the implementation summary with markdown fallback (`scripts/lib/semantic-summarizer.ts`, `scripts/core/workflow.ts`)
- [x] T010 Pass weighted payload to `generateDocumentEmbedding()` (`scripts/core/memory-indexer.ts`)

### Static Decay Metadata (REQ-003, REQ-004)

- [x] T011 [P] Confirm temporal decay stays in the searcher with no changes required (`mcp_server/lib/search/vector-index-queries.ts`, `mcp_server/lib/cognitive/tier-classifier.ts`)
- [x] T012 Ensure existing static decay metadata fields remain persisted for searcher consumption (`mcp_server/lib/search/vector-index-schema.ts`, unchanged write paths)

### Embedding Library Wiring (REQ-002)

- [x] T013 Wire `generateDocumentEmbedding` into the `memory_save` indexing path (`mcp_server/handlers/save/embedding-pipeline.ts`)
- [x] T014 Ensure the save path accepts the weighted payload format through the shared helper (`mcp_server/lib/providers/embeddings.ts`, `shared/index.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T015 Unit test: verify correct concatenation and multiplier behavior in the shared weighted helper (`mcp_server/tests/embedding-weighting.vitest.ts`)
- [x] T016 Unit test: verify length capping and truncation order (general > outcomes > decisions) (`mcp_server/tests/embedding-weighting.vitest.ts`)
- [x] T017 Unit test: indexer routing calls `generateDocumentEmbedding` with weighted payload (`scripts/tests/memory-indexer-weighting.vitest.ts`)
- [x] T018 Integration-oriented test: deterministic ranking fixture proves decision-heavy memory outranks general memory for a decision-focused query (`mcp_server/tests/embedding-weighting.vitest.ts`)
- [x] T019 Confirm temporal decay behavior is unchanged at query time (searcher files unchanged, targeted compile/test reruns passed)
- [x] T020 Run existing embedding and indexer suites with focused regressions (`task-enrichment.vitest.ts`, `embeddings.vitest.ts`, `handler-memory-save.vitest.ts`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
