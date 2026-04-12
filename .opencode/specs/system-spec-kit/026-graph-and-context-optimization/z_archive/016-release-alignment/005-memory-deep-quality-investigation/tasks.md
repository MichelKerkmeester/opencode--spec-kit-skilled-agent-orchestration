---
title: "Tasks: Memory Deep Quality Investigation"
description: "Task Format: T### [P?] Description"
trigger_phrases:
  - "memory investigation tasks"
  - "root cause analysis tasks"
  - "phase 005 tasks"
importance_tier: "normal"
contextType: "research"
---
# Tasks: Memory Deep Quality Investigation

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

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read `scratch/deep-findings.json` and confirm 16 categories with 562 total findings
- [ ] T002 Inventory `.opencode/skill/system-spec-kit/scripts/src/memory/` source tree
- [ ] T003 Map each finding category to candidate generator files (hypothesis list)
- [ ] T004 Pick 3 representative sample files per category for inspection
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Root cause analysis per category
- [ ] T005 [P] causal_links_empty (123 files) — investigate causal link extractor
- [ ] T006 [P] trigger_phrases_overlapping (113 files) — investigate phrase generator
- [ ] T007 [P] provenance_empty (109 files) — investigate session capture
- [ ] T008 [P] git_fileCount_zero (44 files) — investigate git state capture
- [ ] T009 [P] title_pathSuffix (37 files) — investigate title builder
- [ ] T010 [P] spec_folder_health_errors (35 files) — investigate validator
- [ ] T011 [P] key_topics_duplicated (34 files) — investigate topic extractor
- [ ] T012 [P] stale_specFolder_refs (27 files) — investigate cross-ref validator
- [ ] T013 [P] trigger_phrases_ngramNoise (15 files) — investigate phrase filter
- [ ] T014 [P] decisions_mismatch (14 files) — investigate decision extractor
- [ ] T015 [P] continueSession_template (6 files) — investigate continue-session builder
- [ ] T016 [P] duplicate_sessions (5 files) — investigate session dedup logic

### Documentation
- [ ] T017 Write the root-causes document with 16 category sections
- [ ] T018 Write the downstream-impact document quantifying blast radius per category
- [ ] T019 Write the phase-006-proposal document with P0/P1/P2 fix priorities
- [ ] T020 Classify each category: generator_bug / template_bug / upstream_bug / historical_accept
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Verify root-causes.md has one section per finding category (16/16)
- [ ] T022 Verify each root cause cites specific line numbers or function names
- [ ] T023 Verify phase-006-proposal.md has prioritized fix list
- [ ] T024 Verify no generator code or memory files were modified (`git diff --stat` check)
- [ ] T025 Update implementation-summary.md with investigation evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 25 tasks marked `[x]`
- [ ] root-causes.md, downstream-impact.md, phase-006-proposal.md all written
- [ ] Zero unintended modifications
- [ ] Implementation-summary.md written
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Findings baseline**: See `scratch/deep-findings.json`
- **Predecessor**: `../004-memory-retroactive-alignment/`
<!-- /ANCHOR:cross-refs -->
