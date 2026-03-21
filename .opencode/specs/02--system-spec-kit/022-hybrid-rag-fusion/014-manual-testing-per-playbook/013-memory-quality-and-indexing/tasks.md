---
title: "Tasks: manual-testing-per-playbook memory quality and indexing phase [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "memory quality tasks"
  - "phase 013 tasks"
  - "memory indexing tasks"
  - "tasks core memory"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook memory quality and indexing phase

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Extract prompts, command sequences, and pass criteria for all 42 exact Phase 013 IDs from `../../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`.
- [x] T002 [P] Confirm feature catalog links for the Phase 013 `NEW-*` scenarios under `../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/`.
- [x] T003 [P] Confirm direct or nearest-category mappings for `M-001` through `M-008` plus the dedicated-memory sub-scenarios.
- [x] T004 Identify destructive scenarios requiring sandbox or checkpoint isolation, including `M-005a`, `M-005b`, `M-006`, and the `M-007*` family.
- [x] T005 [P] Prepare disposable sandbox spec folders and `/tmp` artifacts before any write, corruption, or collision scenario begins.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Draft `spec.md` with 42 exact-ID scope rows and 42 requirement rows.
- [x] T011 Draft `plan.md` with readiness gates, architecture, four execution phases, and a 42-row testing strategy.
- [x] T012 Draft `tasks.md` and `checklist.md` around the exact-ID model instead of the older top-level-only model.
- [x] T013 Update `implementation-summary.md` to reflect the exact-ID draft packet and current non-executed state.
- [x] T014 [P] Add evidence references and verdict outcomes for non-destructive exact IDs after execution. (Part A: scratch/execution-evidence-partA.md — 18 PASS, 1 PARTIAL)
- [x] T015 [P] Add evidence references and verdict outcomes for destructive exact IDs after sandboxed execution. (Part B: scratch/execution-evidence-partB.md — 21 PASS, 2 PARTIAL; checkpoint ID 20 created/restored)
- [x] T016 Resolve the canonical sandbox folder for description.json corruption, filename collision, and dry-run save scenarios. (Used `.opencode/specs/test-sandbox-m008/` as disposable sandbox; `/tmp/` for CLI artifacts; dry-run path confirmed via `memory_save(dryRun:true)`)
- [x] T017 Resolve whether `M-001` through `M-004` remain on nearest-category mappings or receive future feature-catalog backfill. (Nearest-category mappings retained; Part A Part B both complete; backfill deferred — no catalog gap blocks execution)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Execute the non-destructive exact IDs following `plan.md` Phase 2 execution order. (Part A complete: 039, 040, 041, 045, 046, 047, 048, 069, 073, 092, 131, 133, M-001, M-002, M-004, M-005c, M-006a, M-006b, M-006c)
- [x] T021 Execute the destructive exact IDs in isolated sandboxes following `plan.md` Phase 3 order. (Checkpoint ID 20 created pre-execution; sandbox `.opencode/specs/test-sandbox-m008/` used and deleted; checkpoint restored after completion)
- [x] T022 Assign PASS, PARTIAL, or FAIL verdicts to each of the 42 exact IDs using the review protocol. (Part A: 19 verdicts; Part B: 23 verdicts; combined 42/42)
- [x] T023 Confirm phase coverage as 42/42 exact IDs with no omitted dedicated-memory sub-scenarios. (All M-005a/b/c, M-006a/b/c, M-007a..j, M-008 individually verdicted)
- [x] T024 Validate documentation structure and required ANCHOR blocks in `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 42 exact IDs have PASS, PARTIAL, or FAIL verdicts with supporting evidence
- [x] Phase coverage confirmed at 42/42 with no omitted exact IDs
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
