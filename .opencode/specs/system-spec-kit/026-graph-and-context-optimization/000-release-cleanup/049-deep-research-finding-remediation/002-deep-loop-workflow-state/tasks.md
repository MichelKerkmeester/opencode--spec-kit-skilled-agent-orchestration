---
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
title: "Tasks: 002 Deep-Loop Workflow State-Machine Remediation [template:level_2/tasks.md]"
description: "Task list for closing F-010-B5-01..04 and F-019-D4-01. Five surgical fixes plus test extension plus validate + stress + commit + push."
trigger_phrases:
  - "F-010-B5 tasks"
  - "F-019-D4 tasks"
  - "002 deep-loop workflow state tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/002-deep-loop-workflow-state"
    last_updated_at: "2026-04-30T00:00:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Tasks authored"
    next_safe_action: "Apply five fixes, extend test, validate, stress, commit, push"
    blockers: []
    key_files:
      - ".opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml"
      - ".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml"
      - ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts"
      - ".opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-002-deep-loop-state"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Tasks: 002 Deep-Loop Workflow State-Machine Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P?]` is the priority tag from packet 046/019 (P1 or P2). Status uses `[x]` for done, `[ ]` for pending. Each finding ID appears in the description for traceability.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P1] Re-read packet 046 §B5 and packet 019 §D4 findings to confirm finding IDs and cited line ranges
- [x] T002 [P1] Verify each cited file:line still matches research.md claim before editing (`*` four target files)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P1] Add halt/cancel lock cleanup directive to `step_acquire_lock` (F-010-B5-01) (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`)
- [ ] T004 [P1] Emit canonical fallback iteration record in `step_evaluate_results.on_missing_outputs` (F-010-B5-02) (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`)
- [ ] T005 [P1] Emit canonical fallback iteration record in `step_evaluate_results.on_missing_outputs` (F-010-B5-03) (`.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`)
- [ ] T006 [P2] Thread `--no-resource-map` flag through `step_create_config` and `step_create_state_log` in both YAMLs (F-010-B5-04) (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`)
- [ ] T007 [P1] Refresh parent `children_ids` and `last_save_at` on child save (F-019-D4-01) (`.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`)
- [ ] T008 [P1] Extend `phase-parent-pointer.vitest.ts` with children_ids refresh assertion (F-019-D4-01) (`.opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 [P1] Run extended phase-parent-pointer vitest — must pass
- [ ] T010 [P1] Build TS to refresh `scripts/dist/` (`tsc -p .opencode/skill/system-spec-kit/scripts/tsconfig.json` or equivalent)
- [ ] T011 [P1] Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <sub-phase-folder> --strict` — exit 0 (or warnings-only)
- [ ] T012 [P1] Run `npm run stress` — must remain 56+ files / 163+ tests / exit 0
- [ ] T013 [P1] Confirm git diff shows only the four product files plus this packet's spec docs
- [ ] T014 [P1] Commit + push to origin main with finding IDs in message body
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All five findings marked `[x]` in the Findings closed table of `checklist.md` and `implementation-summary.md`
- `validate.sh --strict` exit 0 (or warnings-only) on this packet
- `npm run stress` exit 0 with no count regression
- Commit pushed to origin main with finding IDs in body
- Phase-parent-pointer vitest extended with the new children_ids test passing
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source of truth: `../046-system-deep-research-bugs-and-improvements/research/research.md` §B5 and `019-*/research/research.md` §D4
- Worked-pilot pattern: `../010-cli-orchestrator-drift/` (commit 889d1ee08)
- Parent packet: `../spec.md` (049 phase parent — manifest)
<!-- /ANCHOR:cross-refs -->
