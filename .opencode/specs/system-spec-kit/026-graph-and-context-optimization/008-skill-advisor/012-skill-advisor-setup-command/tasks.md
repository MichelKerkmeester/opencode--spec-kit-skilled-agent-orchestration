---
title: "Tasks: Skill Advisor Setup Command [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/tasks]"
description: "Task record for creating the /spec_kit:skill-advisor command, YAML workflows, README update, and install guide."
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
template_source_hint: ""
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

- [ ] T001 [P] Create `skill-advisor.md` — command markdown with frontmatter, argument-hint, allowed-tools, execution protocol header, consolidated prompt phase (`.opencode/command/spec_kit/skill-advisor.md`)
- [ ] T002 [P] Create `spec_kit_skill-advisor_auto.yaml` — autonomous workflow definition with discovery, analysis, proposal, apply, verify phases (`.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml`)
- [ ] T003 [P] Create `spec_kit_skill-advisor_confirm.yaml` — interactive workflow with approval gates between phases (`.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Update `README.txt` — add skill-advisor row to command table, update structure tree, add usage example (`.opencode/command/spec_kit/README.txt`)
- [ ] T005 Create `SET-UP - Skill Advisor.md` — user-facing install guide with AI-first prompt, prerequisite check, interactive flow, troubleshooting (`.opencode/install_guides/SET-UP - Skill Advisor.md`)
- [ ] T006 Update parent `context-index.md` — add 012 row to child phase map and key implementation summary (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/context-index.md`)
- [ ] T007 Update parent `spec.md` — add 012 row to phase documentation map (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/spec.md`)
- [ ] T008 Update parent `tasks.md` — add T013 entry for new phase (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/tasks.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Validate command markdown loads correctly — check frontmatter parsing, argument-hint, allowed-tools format
- [ ] T010 Validate YAML workflow syntax — parse both YAML files, check for required keys (operating_mode, workflow steps)
- [ ] T011 Run parent strict validation (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh`)
- [ ] T012 Verify new command appears in `/spec_kit:skill-advisor` invocation surface
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Command file exists at `.opencode/command/spec_kit/skill-advisor.md`
- [ ] Both YAML assets exist in `assets/`
- [ ] README.txt updated
- [ ] Install guide exists at `.opencode/install_guides/SET-UP - Skill Advisor.md`
- [ ] Parent context-index.md and spec.md updated with new phase entry
- [ ] Strict validation passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: `../spec.md`
- **Parent Context Index**: `../context-index.md`
<!-- /ANCHOR:cross-refs -->
