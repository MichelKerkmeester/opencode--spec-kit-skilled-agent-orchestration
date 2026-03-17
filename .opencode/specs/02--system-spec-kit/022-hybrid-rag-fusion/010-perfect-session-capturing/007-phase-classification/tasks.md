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
## Phase 1: Setup

- [x] T001 Define `TopicCluster`, `ConversationPhaseLabel`, and `PhaseScoreMap` in `session-types.ts` (REQ-001) (`scripts/types/session-types.ts`)
- [x] T002 [P] Expand `ConversationPhase` / `ConversationData` with cluster metadata, `TOPIC_CLUSTERS`, and `UNIQUE_PHASE_COUNT` (REQ-001) (`scripts/types/session-types.ts`)
- [x] T003 [P] Update observation classification logic to recognize `test`, `documentation`, and `performance` (REQ-003) (`scripts/extractors/file-extractor.ts`)
- [x] T004 [P] Update conversation summary wording for phase segments and unique phase count (REQ-005) (`templates/context_template`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Document Vector Construction
- [x] T005 Add `scripts/utils/phase-classifier.ts` as the exchange classification owner (REQ-002)
- [x] T006 Normalize exchange text through `SemanticSignalExtractor.extract({ mode: 'all', stopwordProfile: 'aggressive', ngramDepth: 2 })` (REQ-002)
- [x] T007 Produce deterministic weighted vectors for topics, phrases, filtered tokens, tools, and observation types (REQ-002)

### Cluster-Based Phase Scoring
- [x] T008 Rework `conversation-extractor.ts` to build exchanges per prompt and delegate classification to `phase-classifier.ts` (REQ-001)
- [x] T009 Group exchanges by contiguous-first cosine/Jaccard similarity (REQ-001)
- [x] T010 Compute cluster phase scores across the 6 canonical conversation phases (REQ-001)
- [x] T011 Assign `primaryPhase` and confidence deterministically, including Discussion fallback (REQ-001)
- [x] T012 Handle the "grep in debug output" failure mode with the explicit debugging override (REQ-001)

### Non-Contiguous Phase Tracking & Flow Pattern
- [x] T013 Emit separate phase segments when a phase recurs after interruption (REQ-004) (`scripts/extractors/conversation-extractor.ts`)
- [x] T014 Record phase label, start index, end index, cluster ID, confidence, and dominant terms per segment (REQ-004)
- [x] T015 Derive `FLOW_PATTERN` from iterative recurrence plus topic-link graph structure (REQ-005) (`scripts/utils/phase-classifier.ts`)
- [x] T016 [P] Align simulation conversation output with the expanded contract (`scripts/lib/simulation-factory.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Add test for "grep in debug output" -> Debugging classification (SC-001)
- [x] T018 Add test for Research -> Implementation -> Research producing 3 timeline segments and `UNIQUE_PHASE_COUNT = 2` (SC-002, REQ-004)
- [x] T019 Add test for new observation types: test, documentation, performance (REQ-003)
- [x] T020 Add test for `FLOW_PATTERN` derivation from known cluster structures and low-signal fallback (REQ-005)
- [x] T021 Verify targeted phase classification suites pass with updated scoring
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
