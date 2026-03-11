---
title: "Tasks: query-intelligence [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "query intelligence"
  - "query-intelligence"
  - "tasks"
  - "code audit"
  - "query complexity router"
  - "relative score fusion"
  - "channel representation"
  - "token budget"
  - "query expansion"
importance_tier: "normal"
contextType: "general"
---
# Tasks: query-intelligence

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

- [x] T001 Build feature inventory and implementation/test mapping for F-01..F-06 (`feature_catalog/12--query-intelligence/*.md`) — Completed implicitly: all 6 features inventoried via agent reconnaissance
- [x] T002 Cross-reference playbook scenarios and mark per-feature coverage gaps (NEW-060+) — Completed implicitly: gaps documented in checklist CHK-042
- [x] T003 [P] Validate PASS/WARN/FAIL summary alignment across spec/tasks/checklist (`012-query-intelligence/*.md`) — Completed: all artifacts synchronized
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Fix tier routing to reconcile `charCount`/`stopWordRatio` behavior with feature claims — Updated `01-query-complexity-router.md` to accurately document that only `termCount`+`triggerMatch` drive tier, `charCount`/`stopWordRatio` are confidence-only features. Added `hybrid-search.ts` as trace propagation source.
- [x] T005 [P0] Resolve classifier default-state flag contradiction — Fixed JSDoc at `query-classifier.ts:132` from "disabled (default)" to "enabled by default, graduated Sprint 4". Feature catalog aligned.
- [x] T006 [P0] Add `traceMetadata.queryComplexity` propagation tests — Created `trace-propagation.vitest.ts` (18 tests) covering simple/moderate/complex tier propagation through full chain. Added trace test reference to feature catalog.
- [x] T007 [P0] Fix or document channel append-without-re-sort — Documented: `channel-representation.ts` (core) appends without sort; `channel-enforcement.ts` (wrapper) re-sorts globally. Updated `03-channel-min-representation.md` with two-layer architecture, added enforcement wrapper to source table.
- [x] T008 [P0] Replace placeholder channel tests — Added 3 new behavioral tests (T16-T18) to `channel-representation.vitest.ts`: no-sort contract verification, multi-channel under-representation detection, mixed quality floor filtering. Existing 15+19 tests already covered behavioral assertions.
- [x] T009 [P0] Fix query-expansion source/test mapping — Removed stale duplicate `retry-manager.vitest.ts` row from `06-query-expansion.md`. Added `stage1-candidate-gen.ts` to implementation table. Created `stage1-expansion.vitest.ts` (4 tests) for expansion call, dedup, R15 mutual exclusion.
- [x] T010 [P1] Clarify RSF shadow-mode status — Added module-level JSDoc to `rsf-fusion.ts` marking dormant/shadow-only. Updated `02-relative-score-fusion-in-shadow-mode.md` with status banner. Added 3 shadow-mode tests to `rsf-fusion.vitest.ts`.
- [x] T011 [P2] Add adjusted-budget tests and source mapping — Added `hybrid-search.ts` to `05-dynamic-token-budget-allocation.md` implementation table. Added 5 CHK-023 tests to `token-budget.vitest.ts` for `adjustedBudget` formula, floor at 200, and large result count behavior.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 [P] Run targeted Vitest coverage — 14 test files, 339 tests, all passing. TSC clean (0 errors).
- [x] T013 Reconcile checklist verification counts — All CHK items updated with evidence below.
- [x] T014 Synchronize feature-catalog implementation/test tables — All 6 feature catalog docs updated with accurate source/test mappings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — 14 test files, 339 tests, TSC clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
