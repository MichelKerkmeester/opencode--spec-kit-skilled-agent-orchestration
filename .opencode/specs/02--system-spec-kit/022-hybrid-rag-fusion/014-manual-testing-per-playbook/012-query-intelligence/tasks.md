---
title: "Tasks: query-intelligence manual testing [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase 012 tasks"
  - "query intelligence tasks"
  - "query intelligence task tracker"
importance_tier: "high"
contextType: "general"
---
# Tasks: query-intelligence manual testing

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

- [ ] T001 Load manual testing playbook and identify all 10 Phase 012 scenario rows with exact prompts and command sequences (`plan.md`)
- [ ] T002 Confirm MCP runtime tool available: `memory_search` with `includeTrace: true` (`plan.md`)
- [ ] T003 Confirm feature flag support for 161, 162, 163, 173 in the active runtime (`plan.md`)
- [ ] T004 Record baseline feature flag state for 033 and 037 fallback tests (`scratch/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Execute 033 — Query complexity router (R15): simple/moderate/complex passes + flag-disabled fallback (`scratch/`)
- [ ] T006 [P] Execute 034 — RSF shadow mode (R14/N1): branch inspection + RRF live ranking confirmation (`scratch/`)
- [ ] T007 [P] Execute 035 — Channel min-representation (R2): dominance query + channel representation check (`scratch/`)
- [ ] T008 [P] Execute 036 — Confidence-based result truncation (R15-ext): long-tail query + truncation metadata check (`scratch/`)
- [ ] T009 [P] Execute 037 — Dynamic token budget allocation (FUT-7): per-tier budget queries + flag-disabled fallback (`scratch/`)
- [ ] T010 [P] Execute 038 — Query expansion (R12): complex-query expansion + simple-query bypass (`scratch/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Execute 161 — LLM Reformulation: flag ON deep-mode pass + flag OFF pass; restore flag after (`scratch/`)
- [ ] T012 Execute 162 — HyDE Shadow: flag ON shadow-only pass + flag OFF pass; restore flag after (`scratch/`)
- [ ] T013 Execute 163 — Query Surrogates: flag ON save+surrogate+retrieve pass + flag OFF pass; clean up disposable test record; restore flag after (`scratch/`)
- [ ] T014 Execute 173 — Query Decomposition: flag ON decomposition pass (max 3 sub-queries) + flag OFF pass; restore flag after (`scratch/`)

### Verdict and Verification

- [ ] T015 Assign PASS/PARTIAL/FAIL verdict to all 10 scenarios using review protocol (`scratch/`)
- [ ] T016 Complete all checklist items in `checklist.md` with evidence references (`checklist.md`)
- [ ] T017 Write `implementation-summary.md` with verdict table and known limitations (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (or blocked status explicitly documented)
- [ ] All 10 scenarios have a verdict with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Evidence**: See `scratch/`
<!-- /ANCHOR:cross-refs -->

---
