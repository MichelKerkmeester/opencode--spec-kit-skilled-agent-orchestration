---
title: "Tasks: Phase Classification [template:level_1/tasks.md]"
---
# Tasks: Phase Classification

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
## Phase 1: Setup — TopicCluster Interface & Observation Types

- [ ] T001 Define `TopicCluster` interface: `{ id, label, messageIndexes, observationIndexes, dominantTerms, phaseScores, primaryPhase, confidence }` (REQ-001) (`scripts/types/session-types.ts` or `scripts/extractors/session-extractor.ts`)
- [ ] T002 [P] Add observation types `test`, `documentation`, `performance` to existing enum/union (REQ-003) (`scripts/types/session-types.ts`)
- [ ] T003 [P] Update observation classification logic to recognize new types (REQ-003) (`scripts/extractors/file-extractor.ts`)
- [ ] T004 [P] Add expanded observation type placeholders to template (REQ-003) (`templates/core/context_template.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation — Document Vectors, Cluster Scoring & Flow Pattern

### Document Vector Construction
- [ ] T005 [B] Add `buildExchangeVector(exchange: Exchange): TermVector` function using trigger-extractor preprocessing (REQ-002) (`scripts/extractors/session-extractor.ts` or `scripts/lib/trigger-extractor.ts`)
- [ ] T006 Normalize terms: lowercase, stemming via existing trigger-extractor pipeline, stopword removal (REQ-002)
- [ ] T007 Produce term-frequency map per exchange for downstream clustering (REQ-002)

### Cluster-Based Phase Scoring
- [ ] T008 Replace keyword-precedence ladder with cluster scoring in session extractor (REQ-001) (`scripts/extractors/session-extractor.ts`)
- [ ] T009 Group exchanges by cosine similarity on term vectors (threshold-based agglomerative clustering) (REQ-001)
- [ ] T010 For each cluster, compute phase scores: sum term weights for each of the 6 phase categories (REQ-001)
- [ ] T011 Assign `primaryPhase` as highest-scoring category; `confidence` as ratio of top score to total (REQ-001)
- [ ] T012 Handle "grep in debug" case: debug-context terms outweigh grep/search research terms (REQ-001)

### Non-Contiguous Phase Tracking & Flow Pattern
- [ ] T013 Modify phase timeline builder to emit separate entries when a phase recurs after interruption (REQ-004) (`scripts/extractors/session-extractor.ts`)
- [ ] T014 Each timeline entry records: phase label, start index, end index, cluster ID, confidence (REQ-004)
- [ ] T015 Derive `FLOW_PATTERN` from cluster transition graph: linear / branching / iterative / exploratory (REQ-005) (`scripts/extractors/conversation-extractor.ts`)
- [ ] T016 [P] Update `collect-session-data.ts` to support `TopicCluster` output alongside existing structures (`scripts/extractors/collect-session-data.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Add test for "grep in debug output" -> Debugging classification (SC-001)
- [ ] T018 Add test for Research -> Implementation -> Research producing 3 timeline entries (SC-002, REQ-004)
- [ ] T019 Add test for new observation types: test, documentation, performance (REQ-003)
- [ ] T020 Add test for `FLOW_PATTERN` derivation from known cluster structures (REQ-005)
- [ ] T021 Verify existing phase classification tests still pass with updated scoring
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
