---
title: "Tasks: Skill Advisor Setup Command [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/tasks]"
description: "Task record for creating the /doctor:skill-advisor command, YAML workflows, README update, and install guide."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
trigger_phrases:
  - "skill advisor setup command tasks"
  - "012-skill-advisor-setup-command tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command"
    last_updated_at: "2026-04-25T14:30:00Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Created tasks.md"
    next_safe_action: "Create command markdown, YAML workflows, README update, install guide"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0120000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-skill-advisor-setup"
      parent_session_id: "026-phase-root-flatten-2026-04-21"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Advisor Setup Command

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

- [x] T001 [P] Create `.opencode/command/doctor/skill-advisor.md` — command markdown with frontmatter, argument-hint, allowed-tools, execution protocol header, consolidated prompt phase
- [x] T002 [P] Create `doctor_skill-advisor_auto.yaml` — autonomous workflow definition with discovery, analysis, proposal, apply, verify phases (`.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml`)
- [x] T003 [P] Create `doctor_skill-advisor_confirm.yaml` — interactive workflow with approval gates between phases (`.opencode/command/doctor/assets/doctor_skill-advisor_confirm.yaml`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update `README.txt` — add skill-advisor row to command table, update structure tree, add usage example (`.opencode/command/spec_kit/README.txt`)
- [x] T005 Create `SET-UP - Skill Advisor.md` — user-facing install guide with AI-first prompt, prerequisite check, interactive flow, troubleshooting (`.opencode/install_guides/SET-UP - Skill Advisor.md`)
- [x] T006 Update parent `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/context-index.md` — add 012 row to child phase map and key implementation summary
- [x] T007 Update parent `spec.md` — add 012 row to phase documentation map (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/spec.md`)
- [x] T008 Update parent `tasks.md` — add T013 entry for new phase (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/tasks.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Validate command markdown loads correctly — check frontmatter parsing, argument-hint, allowed-tools format
- [x] T010 Validate YAML workflow syntax — parse both YAML files, check for required keys (operating_mode, workflow steps)
- [x] T011 Run parent strict validation (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh`)
- [x] T012 Verify new command appears in `/doctor:skill-advisor` invocation surface
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Command file exists at `.opencode/command/doctor/skill-advisor.md`
- [x] Both YAML assets exist in `assets/`
- [x] README.txt updated
- [x] Install guide exists at `.opencode/install_guides/SET-UP - Skill Advisor.md`
- [x] Parent context-index.md and spec.md updated with new phase entry
- [x] Strict validation passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/spec.md`
- **Plan**: See `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/plan.md`
- **Parent Spec**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/spec.md`
- **Parent Context Index**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/context-index.md`
<!-- /ANCHOR:cross-refs -->
