---
title: "Tasks: Refinement Phase 5 Finalized Scope [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path) + verification command when applicable; includes tranche-4 continuation coverage."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "refinement phase 5 tasks"
  - "tranche 1 tasks"
  - "tranche 2 tasks"
  - "tranche 3 tasks"
  - "tranche 4 tasks"
  - "isInShadowPeriod correction"
  - "save-quality-gate robustness"
  - "canonical id dedup"
  - "force all channels"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Refinement Phase 5 Finalized Scope

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
## Phase 1: Child Doc Alignment (Completed)

- [x] T001 Lock tranche-1 scope to the three implementation fixes (`spec.md`)
- [x] T002 Define phase plan and test commands tied to exact target files (`plan.md`)
- [x] T003 [P] Update checklist P0/P1 mappings for each fix with evidence placeholders (`checklist.md`)
- [x] T004 Initialize implementation-summary tracking and reference tranche continuity targets (`implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation Tranche (Completed)

- [x] T005 Correct RSF/shadow/fallback/floor/reconsolidation wording (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md`)
- [x] T006 Correct contradiction around `isInShadowPeriod` (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md`)
- [x] T007 Harden config-table ensure behavior across DB reinit/handle changes (`.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`)
- [x] T008 [P] Add focused handle-change coverage test `WO6` (`.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and Evidence (Completed)

- [x] T009 Run targeted quality-gate tests (`npm run test --workspace=mcp_server -- tests/save-quality-gate.vitest.ts tests/mpab-quality-gate-integration.vitest.ts`) [Result: PASS, 2 files passed, 102 tests passed]
- [x] T010 Run child-folder validation (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope"`) [Result: PASS, Errors 0, Warnings 0]
- [x] T011 Run contradiction/wording verification search (`rg -n "RSF|shadow|fallback|floor|reconsolidation" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md && rg -n "isInShadowPeriod" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md`) [Result: PASS, targeted contradiction/stale wording removed]
- [x] T012 Finalize evidence links and status (`checklist.md`, `implementation-summary.md`) [Result: Completed in child status docs]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Tranche-2 Canonical Dedup Continuation (Completed)

- [x] T013 Apply canonical ID dedup in `combinedLexicalSearch()` for mixed ID representations (`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`)
- [x] T014 Apply canonical ID dedup in legacy `hybridSearch()` dedup map for mixed ID representations (`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`)
- [x] T015 [P] Add regression test `T031-LEX-05` for canonical dedup in `combined_lexical_search()` (`.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts`)
- [x] T016 [P] Add regression test `T031-BASIC-04` for canonical dedup across channels in legacy `hybridSearch()` (`.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts`)
- [x] T017 Run expanded targeted suite including hybrid-search + quality-gate coverage (`npm run test --workspace=mcp_server -- tests/hybrid-search.vitest.ts tests/save-quality-gate.vitest.ts tests/mpab-quality-gate-integration.vitest.ts`) [Result: PASS, 3 files passed, 174 tests passed]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Tranche-3 Continuation (Completed)

- [x] T018 Preserve persisted activation timestamp across restart so warn-only window is not reset (`.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`)
- [x] T019 [P] Add regression test `WO7: runQualityGate does not reset persisted activation window on restart` (`.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts`)
- [x] T020 Add and plumb `forceAllChannels` so tier-2 fallback can bypass simple-routing channel reduction (`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`)
- [x] T021 [P] Add regression test `C138-P0-FB-T2: tier-2 fallback forces all channels for simple-routed queries` (`.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts`)
- [x] T022 Align parent feature summaries for R11 default/gating truth, G-NEW-2 instrumentation inert status, TM-05 hook-scope correction, and dead-code list correction (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md`)
- [x] T023 Re-run expanded targeted suite including hybrid-search + quality-gate coverage (`npm run test --workspace=mcp_server -- tests/hybrid-search.vitest.ts tests/save-quality-gate.vitest.ts tests/mpab-quality-gate-integration.vitest.ts`) [Result: PASS, 3 files passed, 176 tests passed]
- [x] T024 Re-run child-folder validation (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope"`) [Result: PASS, Errors 0, Warnings 0]
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Tranche-4 P2 Documentation Polish (Completed)

- [x] T025 Apply parent-summary P2 polish updates A/C/D/F (MPAB naming, PI-B3 folder-discovery ID, global density-guard wording, entity-linking dependency wording) in existing-features summary (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md`)
- [x] T026 Apply parent-summary P2 polish updates A/B/E/F (global density-guard checks, SQL wording accuracy, active-flag inventory count to 20, entity-linking dependency wording) in new-features summary (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md`)
- [x] T027 [P] Update child checklist with tranche-4 completed P2 entries and evidence references to both parent summary files (`checklist.md`)
- [x] T028 [P] Update implementation summary with tranche-4 outcomes and evidence references to both parent summary files (`implementation-summary.md`)
- [x] T029 Re-run child-folder validation after tranche-4 doc-polish updates (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope"`) [Result: PASS, Errors 0, Warnings 0]
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0-mapped tasks across tranche-1 through tranche-4 (T005-T029) are complete with evidence.
- [x] No `[B]` blockers remain for save-quality-gate robustness verification.
- [x] Canonical ID dedup behavior is covered in both `combined_lexical_search()` and legacy `hybridSearch()` regression tests.
- [x] Tier-2 fallback channel forcing behavior is covered in regression tests and routed through `forceAllChannels`.
- [x] Checklist P0/P1 items include command output or file diff evidence.
- [x] Tranche-4 P2 parent-summary documentation polish items (A-F) are completed with evidence links in child tracking docs.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent**: `../000-feature-overview/spec.md`
- **Predecessor**: `../024-timer-persistence-stage3-fallback/spec.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- End of filled Level 2 task list for child 016 (tranche-1 through tranche-4 aligned). -->
