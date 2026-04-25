---
title: "Tasks: Code Graph Doctor Command [system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/tasks]"
description: "Task record for creating the diagnostic-only /doctor:code-graph command (Phase A)."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
trigger_phrases:
  - "code graph doctor command tasks"
  - "006-code-graph-doctor-command tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command"
    last_updated_at: "2026-04-25T20:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created tasks.md"
    next_safe_action: "Create remaining packet docs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0260000000007006000000000000000000000000000000000000000000000002"
      session_id: "006-code-graph-doctor-command"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Code Graph Doctor Command

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

- [x] T001 [P] Create the planned .opencode/command/doctor/code-graph.md (created by T001) — command markdown with frontmatter, argument-hint, allowed-tools (Read + Bash + code_graph_* MCP tools), execution protocol, consolidated setup prompt
- [x] T002 [P] Create `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml` — autonomous workflow with 3 phases (Discovery, Analysis, Proposal-as-report)
- [x] T003 [P] Create `.opencode/command/doctor/assets/doctor_code-graph_confirm.yaml` — interactive workflow with one `pre_phase_2` approval gate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create `.opencode/install_guides/SET-UP - Code Graph.md` — AI-first prompt + prerequisite check + report-reading guide
- [x] T005 Update `.opencode/README.md` Doctor Commands section — add 4th doctor command entry, bump command count from 22 to 23
- [x] T006 Update parent `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/context-index.md` — add 006 row to child phase map
- [x] T007 Update parent `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/spec.md` — add 006 entry to phase documentation map
- [x] T008 Update parent `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/tasks.md` — add T-NNN entry tracking the 006 child packet
- [x] T009 Cross-reference 007-code-graph-resilience-research packet in spec.md + plan.md (Phase B dependency)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Validate command markdown loads correctly — frontmatter parse, argument-hint format, allowed-tools list
- [x] T011 Validate both YAML workflows parse via `python3 yaml.safe_load`
- [x] T012 Verify mutation_boundaries.allowed_targets is empty in both YAMLs (Phase A read-only invariant)
- [x] T013 Run strict spec-folder validation (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh`)
- [x] T014 Verify `/doctor:code-graph` appears in runtime skill list after creation
- [x] T015 Smoke-test: invoke `/doctor:code-graph:auto` against this repo and confirm report at packet scratch with no other file changes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1-3 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Command file exists at the planned .opencode/command/doctor/code-graph.md (created by T001)
- [x] Both YAML assets exist in `.opencode/command/doctor/assets/`
- [x] Install guide exists at `.opencode/install_guides/SET-UP - Code Graph.md`
- [x] Parent context-index, spec, tasks updated with 006 child entry
- [x] Strict validation passes 0/0
- [x] Phase B explicitly documented as deferred and gated on 007 research packet
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/spec.md`
- **Plan**: See `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/plan.md`
- **Parent Spec**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/spec.md`
- **Sibling research dependency**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/spec.md`
- **Pattern source**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/`
<!-- /ANCHOR:cross-refs -->
