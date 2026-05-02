---
title: "Task [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/004-cross-runtime-startup-surfacing-parity/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase 4 tasks"
  - "startup parity tasks"
  - "runtime startup surfacing"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/004-cross-runtime-startup-surfacing-parity"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Cross-Runtime Startup Surfacing Parity

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

- [x] T001 Inventory OpenCode startup/session-context surfacing as the reference behavior
- [x] T002 Inventory Claude and Gemini SessionStart outputs and recovery cues
- [x] T003 [P] Inventory the current Codex startup/bootstrap surface
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase -->
## Phase 2: Implementation

- [x] T004 Define the common startup sections and recovery cues that all targeted runtimes should surface
- [x] T005 Map and apply the runtime/config changes needed for Claude, Gemini, Codex, and Copilot
- [x] T006 Separate hook-capable and hookless runtime behavior without reopening phases 001-003
- [x] T007 Update the packet-local verification plan and evidence targets
<!-- /ANCHOR:phase -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Implement the runtime/config changes for shared startup surfacing
- [x] T009 Run runtime/config validation plus strict packet validation
- [x] T010 Verify the startup surfacing matches the OpenCode reference and record evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All phase-004 tasks marked `[x]`
- [x] No `[B]` blocked tasks remain
- [x] Runtime startup surfacing parity is verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `../003-code-graph-operations-hardening/spec.md`
<!-- /ANCHOR:cross-refs -->
