---
title: "Tasks: scoring-and-calibration manual testing [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase 011 tasks"
  - "scoring calibration tasks"
  - "scoring and calibration task tracker"
importance_tier: "high"
contextType: "general"
---
# Tasks: scoring-and-calibration manual testing

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

- [ ] T001 Load manual testing playbook and identify all 22 Phase 011 scenario rows (`plan.md`)
- [ ] T002 Confirm MCP runtime tools available: `memory_search`, `memory_validate`, `checkpoint_create`, `checkpoint_restore` (`plan.md`)
- [ ] T003 Confirm feature flag support for 159, 160, 170, 171, 172 in the active runtime (`plan.md`)
- [ ] T004 Create pre-execution global checkpoint; record checkpoint name/ID (`scratch/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Execute 023 — Score normalization with `includeTrace: true` (`scratch/`)
- [ ] T006 [P] Execute 024 — Cold-start novelty boost (N4) (`scratch/`)
- [ ] T007 [P] Execute 027 — Folder-level relevance scoring (PI-A1) (`scratch/`)
- [ ] T008 [P] Execute 029 — Double intent weighting investigation (G2) (`scratch/`)
- [ ] T009 [P] Execute 030 — RRF K-value sensitivity analysis (FUT-5) (`scratch/`)
- [ ] T010 [P] Execute 066 — Scoring and ranking corrections (`scratch/`)
- [ ] T011 [P] Execute 074 — Stage 3 effectiveScore fallback chain (`scratch/`)
- [ ] T012 [P] Execute 079 — Scoring and fusion corrections (`scratch/`)
- [ ] T013 [P] Execute 098 — Local GGUF reranker (P1-5); document BLOCKED if host prerequisites unmet (`scratch/`)
- [ ] T014 [P] Execute 102 — node-llama-cpp optionalDependencies (`scratch/`)
- [ ] T015 [P] Execute 118 — Stage-2 score field synchronization (P0-8) (`scratch/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Create sandbox checkpoint before destructive group; record checkpoint ID (`scratch/`)
- [ ] T017 Execute 025 — Interference scoring (TM-01); restore sandbox after (`scratch/`)
- [ ] T018 Execute 026 — Classification-based decay (TM-03); restore sandbox after (`scratch/`)
- [ ] T019 Execute 028 — Embedding cache (R18); restore sandbox after (`scratch/`)
- [ ] T020 Execute 031 — Negative feedback confidence signal (A4); restore sandbox after (`scratch/`)
- [ ] T021 Execute 032 — Auto-promotion on validation (T002a); restore sandbox after (`scratch/`)
- [ ] T022 Execute 121 — Adaptive shadow proposal and rollback (Phase 4); restore sandbox after (`scratch/`)

### Feature-Flag Execution

- [ ] T023 Execute 159 — Learned Stage 2 Combiner: flag ON + flag OFF passes (`scratch/`)
- [ ] T024 Execute 160 — Shadow Feedback Holdout: flag ON + flag OFF passes (`scratch/`)
- [ ] T025 Execute 170 — Fusion Policy Shadow v2: flag ON + flag OFF passes (`scratch/`)
- [ ] T026 Execute 171 — Calibrated Overlap Bonus: flag ON + flag OFF passes (`scratch/`)
- [ ] T027 Execute 172 — RRF K Experimental: flag ON + flag OFF passes (`scratch/`)

### Verdict and Verification

- [ ] T028 Assign PASS/PARTIAL/FAIL verdict to all 22 scenarios using review protocol (`scratch/`)
- [ ] T029 Complete all checklist items in `checklist.md` with evidence references (`checklist.md`)
- [ ] T030 Write `implementation-summary.md` with verdict table and known limitations (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (or blocked status explicitly documented)
- [ ] All 22 scenarios have a verdict with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Evidence**: See `scratch/`
<!-- /ANCHOR:cross-refs -->

---
