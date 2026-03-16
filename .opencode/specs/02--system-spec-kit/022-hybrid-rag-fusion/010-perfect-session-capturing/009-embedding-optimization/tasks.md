---
title: "Tasks: Embedding Optimization [template:level_1/tasks.md]"
---
# Tasks: Embedding Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

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
## Phase 1: Setup

- [ ] T001 Read existing `semanticChunk()` logic and `generateDocumentEmbedding()` API (`scripts/lib/semantic-summarizer.ts`, `mcp_server/lib/embedding/`)
- [ ] T002 Identify structured section extraction points: title, decisions[], outcomes[], generalContent (`scripts/lib/semantic-summarizer.ts`)
- [ ] T003 Verify `generateDocumentEmbedding` is exported from embedding library (`mcp_server/lib/embedding/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Weighted Payload Builder (REQ-001)

- [ ] T004 Add `buildWeightedEmbeddingPayload()` function to semantic summarizer (`scripts/lib/semantic-summarizer.ts`)
- [ ] T005 Accept structured input: `{ title, decisions[], outcomes[], generalContent }` (`scripts/lib/semantic-summarizer.ts`)
- [ ] T006 Implement concatenation with multipliers: title (1x) + each decision (3x) + each outcome (2x) + general (1x) (`scripts/lib/semantic-summarizer.ts`)
- [ ] T007 Add total length cap with truncation priority: general first, then outcomes, then decisions (`scripts/lib/semantic-summarizer.ts`)

### Indexer Routing Update (REQ-002)

- [ ] T008 Update memory indexer to import `generateDocumentEmbedding` instead of `generateEmbedding` (`scripts/core/memory-indexer.ts`)
- [ ] T009 Extract structured sections from memory content before passing to payload builder (`scripts/core/memory-indexer.ts`)
- [ ] T010 Pass weighted payload to `generateDocumentEmbedding()` (`scripts/core/memory-indexer.ts`)

### Static Decay Metadata (REQ-003, REQ-004)

- [ ] T011 [P] Confirm temporal decay stays in the searcher with no changes required (`scripts/` -- read-only verification)
- [ ] T012 Ensure static decay metadata fields are persisted by the indexer for searcher consumption (`scripts/core/memory-indexer.ts`)

### Embedding Library Wiring (REQ-002)

- [ ] T013 Wire `generateDocumentEmbedding` into the indexing path if not already available (`mcp_server/lib/embedding/`)
- [ ] T014 Ensure the function accepts the weighted payload format (`mcp_server/lib/embedding/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Unit test: verify correct concatenation and multiplier behavior in `buildWeightedEmbeddingPayload()`
- [ ] T016 Unit test: verify length capping and truncation order (general > outcomes > decisions)
- [ ] T017 Unit test: indexer routing calls `generateDocumentEmbedding` with weighted payload
- [ ] T018 Integration test: index a decision-heavy memory and verify improved retrieval ranking in top-k
- [ ] T019 Confirm temporal decay behavior is unchanged at query time
- [ ] T020 Run existing embedding and indexer test suites -- no regressions
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
