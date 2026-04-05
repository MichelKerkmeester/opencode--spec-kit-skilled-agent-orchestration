---
title: "Tasks: OpenCode Transport Adapter [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/002-opencode-transport-adapter/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase 2 tasks"
  - "transport adapter tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: OpenCode Transport Adapter

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

- [x] T001 Review Phase 1 shared contract
- [x] T002 Inventory hook responsibilities
- [x] T003 [P] Define payload-to-hook mapping
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define adapter interface
- [x] T005 Define startup digest injection behavior
- [x] T006 Define messages-transform context injection behavior
- [x] T007 Define compaction-note injection behavior
- [x] T007a Register the live OpenCode plugin and diagnostic tool
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify transport-only boundary in responsibility while the plugin remains live
- [x] T009 Verify no duplicate retrieval policy was introduced
- [x] T010 Prepare handoff to graph-ops hardening
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Hook mapping is complete
- [x] Adapter boundary is explicit
- [x] Live plugin registration is explicit
- [x] No `[B]` blocked tasks remain
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `../001-shared-payload-provenance-layer/spec.md`
<!-- /ANCHOR:cross-refs -->
