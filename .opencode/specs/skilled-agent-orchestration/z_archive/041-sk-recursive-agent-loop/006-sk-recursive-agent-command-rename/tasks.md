---
title: "Tasks: Recursive [skilled-agent-orchestration/041-sk-recursive-agent-loop/006-sk-recursive-agent-command-rename/tasks]"
description: "Task tracking for phase 006 under packet 041."
trigger_phrases:
  - "041 phase 006 tasks"
  - "recursive agent command rename tasks"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/006-sk-recursive-agent-command-rename"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Recursive Agent Command Rename

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

- [x] T001 Create the new `006-sk-improve-agent-command-rename/` phase packet
- [x] T002 Identify all active command-name and command-path references before editing
- [x] T003 Confirm the rename remains bounded to command surfaces and packet history
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rename the canonical command markdown file into the agent-improver command family
- [x] T005 Rename the YAML workflow assets to `improve_agent-improver_*.yaml`
- [x] T006 Rename the `.agents` and `.gemini` wrapper TOMLs to `agent-improver.toml`
- [x] T007 Update runtime docs, skill docs, README examples, and active packet docs to `/improve:agent-improver`
- [x] T008 Update parent packet `041` and registry metadata to record phase `006`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `validate_document.py --type command` for the renamed command
- [x] T010 Parse renamed wrapper TOMLs and `descriptions.json`
- [x] T011 Run strict validation for phase `006`
- [x] T012 Run strict validation for root `041`
- [x] T013 Update the implementation summary with final evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The command entrypoint uses the agent-improver name and path
- [x] YAML assets and wrappers use the agent-improver naming family
- [x] Runtime docs, skill docs, and packet docs reference the new command surface
- [x] Root `041` records phase `006` and validates strictly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent Packet**: See [../](../)
- **Previous Phase**: See [../005-sk-improve-agent-package-runtime-alignment/](../005-sk-improve-agent-package-runtime-alignment/)
- **Specification**: See [spec.md](./spec.md)
- **Plan**: See [plan.md](./plan.md)
- **Checklist**: See [checklist.md](./checklist.md)
- **Implementation Summary**: See [implementation-summary.md](./implementation-summary.md)
<!-- /ANCHOR:cross-refs -->

---
