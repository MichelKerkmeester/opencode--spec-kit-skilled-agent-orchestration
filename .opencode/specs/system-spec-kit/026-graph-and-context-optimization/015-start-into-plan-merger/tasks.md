---
title: "Tasks: Start-into-Plan Merger"
description: "Task breakdown across six milestones (M0 audit through M5 atomic sweep + deletion) with file:line targets for every touch point."
trigger_phrases:
  - "start into plan tasks"
  - "merger task breakdown"
  - "m0 audit tasks"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-start-into-plan-merger"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Authored Level 3 task list with 46 granular tasks across 6 milestones"
    next_safe_action: "Execute T001 (M0 audit grep) via /spec_kit:implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:pending-first-implementation-run"
      session_id: "plan-authoring-2026-04-15"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Start-into-Plan Merger

<!-- SPECKIT_LEVEL: 3 -->
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

Milestone M0 — Downstream Audit.

- [ ] T001 Grep across `.opencode/command/` for `/spec_kit:start` and `spec_kit/start.md` (output path: M0 findings)
- [ ] T002 [P] Grep across `.opencode/skill/` for `/spec_kit:start` (output path: M0 findings)
- [ ] T003 [P] Grep across `.opencode/install_guides/`, root `README.md`, `.opencode/README.md` (output path: M0 findings)
- [ ] T004 Locate harness skill-registry file (search for `spec_kit:start` entry in harness config paths)
- [ ] T005 Reconcile audit output against `spec.md §3 Files-to-Change`; flag any NEW refs for scope addition
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### M1 — Shared Intake Module

- [ ] T006 Draft `.opencode/skill/system-spec-kit/references/intake-contract.md` (folder classification, repair modes, trio publication, relationships, resume, lock)
- [ ] T007 Review draft against current `start.md` logic; ensure 1:1 semantic coverage (no missed flag, no missed branch)
- [ ] T008 Run sk-doc DQI validator on intake-contract reference; fix any blockers
- [ ] T009 Commit intake-contract reference to repo

### M2 — plan.md Expansion

- [ ] T010 Rewrite `.opencode/command/spec_kit/plan.md` Setup Section 0 (remove duplicate intake questions; keep folder-state detection as trigger for shared-module inclusion)
- [ ] T011 Rewrite plan.md Step 1 Intake block to reference shared intake-contract module (no inline duplication)
- [ ] T012 Add `--intake-only` flag handling — halt after Step 1 completes
- [ ] T013 Verify `:with-phases` pre-workflow interaction with new Step 1 (no regression)
- [ ] T014 [P] Update `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` (lines 98, 328, 359, 373 — reference-only language + `--intake-only` branch)
- [ ] T015 [P] Update `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` (lines 98, 342, 370, 374, 384, 398 — reference-only language + `--intake-only` branch)

### M3 — complete.md Refactor

- [ ] T016 Rewrite `.opencode/command/spec_kit/complete.md` Section 0 to reference shared intake-contract module (remove inline block)
- [ ] T017 Update Steps 5a/8/9 of complete.md to reflect reference-only pattern (semantic behavior unchanged; language aligned)
- [ ] T018 [P] Update `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` (lines 116, 439, 470, 484)
- [ ] T019 [P] Update `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` (lines 137, 484, 512, 516, 526, 540)

### M4 — resume.md Routing

- [ ] T020 Update `.opencode/command/spec_kit/resume.md` routing: `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}` → `/spec_kit:plan --intake-only` with prefilled state
- [ ] T021 Update `.opencode/command/spec_kit/assets/spec_kit_resume_*.yaml` (if present; audit via T004 output)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### M5a — Authoritative Doc Updates

- [ ] T022 [P] Update `.opencode/skill/system-spec-kit/SKILL.md` (lines 121, 210, 564, 923, 932)
- [ ] T023 [P] Update `.opencode/skill/system-spec-kit/README.md` (lines 412, 413, 414, 624, 626)
- [ ] T024 [P] Update template READMEs: templates main (79, 96); level_2 (100); level_3 (106); level_3+ (102); addendum (50)
- [ ] T025 [P] Update `.opencode/skill/sk-deep-research/SKILL.md` (line 445) + `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` (lines 27, 196, 201)
- [ ] T026 [P] Update `.opencode/skill/sk-deep-review/README.md` (line 418) + `.opencode/skill/skill-advisor/README.md` (line 453)
- [ ] T027 [P] Update cli-* agent-delegation refs: cli-claude-code (297); cli-codex (320); cli-gemini (257)
- [ ] T028 [P] Update install guides: `.opencode/install_guides/README.md`; `SET-UP - Opencode Agents`
- [ ] T029 [P] Update top-level docs: `.opencode/README.md`; root `README` command-graph (lines 876, 882, 927, 931); `.opencode/command/README.txt`; `.opencode/command/spec_kit/README.txt` (lines 61, 91, 138, 145)
- [ ] T030 Update `.opencode/specs/descriptions.json` line 4809 (012 packet description — note deliverable superseded by 015)

### M5b — Deletions

- [ ] T031 Delete `.opencode/command/spec_kit/start.md`
- [ ] T032 Delete `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml` + `spec_kit_start_confirm.yaml`
- [ ] T033 Delete `.gemini/commands/spec_kit/start.toml`
- [ ] T034 Remove `spec_kit:start` entry from harness skill-registry file (located in T004)

### M5c–M5i — Validation + Closeout

- [ ] T035 Run `validate.sh --strict` on 015 packet — expect exit 0
- [ ] T036 Run sk-doc DQI validator on all 015 canonical docs — expect PASS
- [ ] T037 Grep `/spec_kit:start` repo-wide; expect zero hits in forward-looking paths (changelog + closed packet 012 internals excluded)
- [ ] T038 Verify closed packet 012: `git diff 012-spec-kit-commands/` must be empty
- [ ] T039 Manual integration test: `/spec_kit:plan --intake-only` on scratch empty folder
- [ ] T040 Manual integration test: `/spec_kit:plan` full workflow on scratch populated folder (expect intake bypass)
- [ ] T041 Manual integration test: `/spec_kit:complete` on scratch empty folder (expect shared-module intake runs)
- [ ] T042 Manual integration test: `/spec_kit:resume` with simulated `reentry_reason: incomplete-interview` (expect route to `/spec_kit:plan --intake-only`)
- [ ] T043 Idempotence test: `/spec_kit:plan --intake-only` invoked twice on same folder — expect second run is no-op
- [ ] T044 Author changelog entry at `.opencode/changelog/01--system-spec-kit/vX.Y.Z` (migration note: `/spec_kit:start → /spec_kit:plan --intake-only`)
- [ ] T045 Populate implementation-summary with verification evidence (replace placeholder markers)
- [ ] T046 Run `/memory:save` on packet 015 (continuity indexing)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001–T046 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (T039–T043 all green)
- [ ] Validation exit 0 (T035)
- [ ] sk-doc DQI PASS (T036)
- [ ] Grep sweep zero hits (T037)
- [ ] 012 diff empty (T038)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec document
- **Plan**: See plan document
- **Checklist**: See checklist document
- **Decision Records**: See decision-record document
- **Superseded Packet**: 012-spec-kit-commands under 026 parent
<!-- /ANCHOR:cross-refs -->

---

<!--
46 tasks across 6 milestones (M0–M5):
- Phase 1 Setup (M0): T001–T005 (5 tasks)
- Phase 2 Implementation (M1–M4): T006–T021 (16 tasks)
- Phase 3 Verification (M5a + M5b + M5c–M5i): T022–T046 (25 tasks)
Total: 46
-->
