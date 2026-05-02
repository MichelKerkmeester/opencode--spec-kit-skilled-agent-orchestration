---
title: "Tasks [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/003-code-graph-operations-hardening/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase 3 tasks"
  - "graph ops hardening tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/003-code-graph-operations-hardening"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Code Graph Operations Hardening

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

### AI Execution Protocol

### Pre-Task Checklist
- Confirm the phase or packet scope before editing.
- Confirm runtime claims are backed by the existing implementation summary.
- Confirm strict validation is the final closeout gate.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `DOC-SCOPE` | Keep edits inside the declared packet or phase scope. |
| `TRUTH-FIRST` | Do not change the meaning of the shipped runtime claims. |
| `VALIDATE-LAST` | Rerun strict validation before claiming completion. |

### Status Reporting Format
- `in-progress`: describe the active doc or validation pass.
- `blocked`: record the validator error or missing evidence.
- `completed`: record changed files and final validation status.

### Blocked Task Protocol
- If validation fails, keep the related task open until the blocker is fixed.
- If evidence is missing, record that gap explicitly instead of marking completion.


---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inventory readiness and health surfaces
- [x] T002 Inventory path identity assumptions
- [x] T003 [P] Inventory current artifact preview behavior
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase -->
## Phase 2: Implementation

- [x] T004 Define doctor/repair scope
- [x] T005 Define export/import design boundaries
- [x] T006 Define portable identity and collision expectations
- [x] T007 Define metadata-only preview rules
<!-- /ANCHOR:phase -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Review readiness consistency against parent research
- [x] T009 Review transport-boundary compatibility with Phase 2
- [x] T010 Prepare concrete runtime implementation tasks
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Runtime hardening scope is explicit
- [x] No `[B]` blocked tasks remain
- [x] Follow-on implementation work is concrete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `../002-opencode-transport-adapter/spec.md`
<!-- /ANCHOR:cross-refs -->
