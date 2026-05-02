---
title: "Tasks: command-md-yaml-alignment"
description: "Task list for auditing six spec_kit command Markdown files and twelve YAML workflow assets."
trigger_phrases:
  - "command md yaml tasks"
  - "packet 006 tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/006-command-md-yaml-alignment"
    last_updated_at: "2026-05-02T06:53:47Z"
    last_updated_by: "codex"
    recent_action: "completed"
    next_safe_action: "final-report"
    blockers: []
    key_files:
      - ".opencode/command/spec_kit/"
    session_dedup:
      fingerprint: "sha256:0060060060060060060060060060060060060060060060060060060060060002"
      session_id: "2026-05-02-006-command-md-yaml-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: command-md-yaml-alignment

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T101 Create Level 3 packet folder (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/006-command-md-yaml-alignment`)
- [x] T102 Author packet specification (`spec.md`)
- [x] T103 Author implementation plan (`plan.md`)
- [x] T104 Author audit task list (`tasks.md`)
- [x] T105 Author decision record (`decision-record.md`)
- [x] T106 Author verification checklist shell (`checklist.md`)
- [x] T107 Stub implementation summary (`implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T108 Audit command doc (`.opencode/command/spec_kit/complete.md`)
- [x] T109 Audit command doc (`.opencode/command/spec_kit/deep-research.md`)
- [x] T110 Audit command doc (`.opencode/command/spec_kit/deep-review.md`)
- [x] T111 Audit command doc (`.opencode/command/spec_kit/implement.md`)
- [x] T112 Audit command doc (`.opencode/command/spec_kit/plan.md`)
- [x] T113 Audit command doc (`.opencode/command/spec_kit/resume.md`)
- [x] T114 Audit YAML asset (`.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`)
- [x] T115 Audit YAML asset (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`)
- [x] T116 Audit YAML asset (`.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`)
- [x] T117 Audit YAML asset (`.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`)
- [x] T118 Audit YAML asset (`.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`)
- [x] T119 Audit YAML asset (`.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`)
- [x] T120 Audit YAML asset (`.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`)
- [x] T121 Audit YAML asset (`.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`)
- [x] T122 Audit YAML asset (`.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`)
- [x] T123 Audit YAML asset (`.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml`)
- [x] T124 Audit YAML asset (`.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`)
- [x] T125 Audit YAML asset (`.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml`)
- [x] T126 Add current feature mentions where command behavior naturally requires them
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T127 Run stale-pattern grep gate
- [x] T128 Run workflow-invariance vitest gate
- [x] T129 Run all-YAML parse gate
- [x] T130 Run strict validation for packet 006
- [x] T131 Run strict validation for sibling packets 003, 004, and 005
- [x] T132 Update parent graph metadata with child 006 and last-active pointer
- [x] T133 Mark checklist with evidence
- [x] T134 Fully populate implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All audit tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Gates A-E pass or critical exhausted blocker is documented
- [x] Final output prints the requested ROUND-6 status block
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
