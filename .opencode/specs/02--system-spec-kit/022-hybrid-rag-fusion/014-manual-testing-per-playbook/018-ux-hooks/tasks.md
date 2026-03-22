---
title: "Tasks: manual-testing-per-playbook ux-hooks phase [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description"
trigger_phrases:
  - "ux hooks tasks"
  - "phase 018 tasks"
  - "ux hooks test execution tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: manual-testing-per-playbook ux-hooks phase

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

- [ ] T001 Open and verify playbook source: `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] T002 Load review protocol from playbook §4
- [ ] T003 Confirm feature catalog links for all 11 UX-hooks scenarios: `../../feature_catalog/18--ux-hooks/`
- [ ] T004 Confirm vitest test files exist: `hooks-ux-feedback.vitest.ts`, `memory-save-ux-regressions.vitest.ts`, `context-server.vitest.ts`, `handler-checkpoints.vitest.ts`, `tool-input-schema.vitest.ts`, `mcp-input-validation.vitest.ts`
- [ ] T005 Confirm `rg` (ripgrep) available; note grep fallback if absent
- [ ] T006 [P] Confirm feature flag support for SPECKIT_RESULT_EXPLAIN_V1, SPECKIT_RESPONSE_PROFILE_V1, SPECKIT_PROGRESSIVE_DISCLOSURE_V1, SPECKIT_SESSION_RETRIEVAL_STATE_V1, SPECKIT_EMPTY_RESULT_RECOVERY_V1, SPECKIT_RESULT_CONFIDENCE_V1 (all default OFF)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Execute 103 — `npx vitest run tests/hooks-ux-feedback.vitest.ts`; capture 6/6 pass transcript
- [ ] T008 Execute 104 — `npx vitest run tests/memory-save-ux-regressions.vitest.ts`; inspect no-op, FSRS, atomic-save assertions
- [ ] T009 Execute 105 — `npx vitest run tests/context-server.vitest.ts`; inspect hints, autoSurfacedContext, token metadata assertions
- [ ] T010 Execute 107 step 1 — `npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts`; inspect confirmName rejection and safetyConfirmationUsed assertions
- [ ] T011 Execute 107 step 2 — `npx vitest run tests/context-server.vitest.ts` Group 13b (T103–T106); inspect structural source-code pattern verification
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Execute 106 step 1 — `rg "mutation-feedback|response-hints" .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts`; capture output
- [ ] T013 Execute 106 step 2 — `rg "mutation-feedback|response-hints|MutationHookResult|postMutationHooks" .opencode/skill/system-spec-kit/mcp_server/hooks/README.md`; capture output
- [ ] T014 Execute 166 step 1 — Enable SPECKIT_RESULT_EXPLAIN_V1; run `memory_search` with `includeTrace`; inspect tier-1 summary explain output
- [ ] T015 Execute 166 step 2 — Inspect tier-2 detailed score breakdown; disable flag; confirm no explain output
- [ ] T016 Execute 167 step 1 — Enable SPECKIT_RESPONSE_PROFILE_V1; run query with profile=quick; capture output shape
- [ ] T017 Execute 167 step 2 — Run queries with profile=research, profile=resume, profile=debug; compare output verbosity; disable flag; confirm default shape
- [ ] T018 Execute 168 step 1 — Enable SPECKIT_PROGRESSIVE_DISCLOSURE_V1; run large-result query; inspect initial page and cursor token
- [ ] T019 Execute 168 step 2 — Request next page using cursor; verify no duplicates; check final page has no cursor; disable flag; confirm single-response return
- [ ] T020 Execute 169 step 1 — Enable SPECKIT_SESSION_RETRIEVAL_STATE_V1; run first query; run follow-up query in same session; verify dedup behavior
- [ ] T021 Execute 169 step 2 — Start new session; verify state reset; disable flag; confirm no cross-turn dedup
- [ ] T022 Execute 179 step 1 — Enable SPECKIT_EMPTY_RESULT_RECOVERY_V1; run empty-result query; run weak-result query; inspect all 3 recovery statuses
- [ ] T023 Execute 179 step 2 — Run healthy-result query; confirm no recovery payload; disable flag; confirm no structured recovery output
- [ ] T024 Execute 180 step 1 — Enable SPECKIT_RESULT_CONFIDENCE_V1; run representative search queries; inspect per-result calibrated confidence fields
- [ ] T025 Execute 180 step 2 — Verify 4-factor weighting visible in trace output; disable flag; confirm no calibrated confidence field in results
- [ ] T026 Capture evidence bundle for 103: transcript, raw output, verdict (PASS/PARTIAL/FAIL)
- [ ] T027 Capture evidence bundle for 104: transcript, raw output, verdict (PASS/PARTIAL/FAIL)
- [ ] T028 Capture evidence bundle for 105: transcript, raw output, verdict (PASS/PARTIAL/FAIL)
- [ ] T029 Capture evidence bundle for 106: ripgrep output, verdict (PASS/PARTIAL/FAIL)
- [ ] T030 Capture evidence bundle for 107: both suite runs, raw output, verdict (PASS/PARTIAL/FAIL)
- [ ] T031 Capture evidence bundle for 166: enabled and disabled outputs, verdict (PASS/PARTIAL/FAIL)
- [ ] T032 Capture evidence bundle for 167: all 4 profile outputs, disabled-flag output, verdict (PASS/PARTIAL/FAIL)
- [ ] T033 Capture evidence bundle for 168: page 1, page 2+, final page, disabled-flag output, verdict (PASS/PARTIAL/FAIL)
- [ ] T034 Capture evidence bundle for 169: same-session dedup, new-session reset, disabled-flag output, verdict (PASS/PARTIAL/FAIL)
- [ ] T035 Capture evidence bundle for 179: all 3 recovery statuses, healthy result, disabled-flag output, verdict (PASS/PARTIAL/FAIL)
- [ ] T036 Capture evidence bundle for 180: confidence fields, 4-factor trace, disabled-flag output, verdict (PASS/PARTIAL/FAIL)
- [ ] T037 Report phase coverage as 11/11 scenarios with verdict summary
- [ ] T038 Update `implementation-summary.md` when execution and verification are complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 11 scenarios have verdicts (PASS/PARTIAL/FAIL)
- [ ] Phase coverage reported as 11/11
- [ ] All feature flags reset to OFF after execution
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
