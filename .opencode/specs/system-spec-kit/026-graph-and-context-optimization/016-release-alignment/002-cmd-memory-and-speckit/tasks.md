---
title: "Tasks: Release Alignment for Spec Kit and Memory Commands [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "release alignment tasks"
  - "command docs review"
  - "spec_kit command tasks"
  - "memory command tasks"
importance_tier: "important"
contextType: "documentation"
---
# Tasks: Release Alignment for Spec Kit and Memory Commands

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

- [x] T001 Upgrade the child packet to Level 3 structure (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`)
- [x] T002 Preserve `reference-map.md` as the evidence baseline and normalize packet-local path resolution (`reference-map.md`)
- [ ] T003 [P] Reconfirm the command-surface categories before the later pass begins (`reference-map.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Review and update authoritative memory command docs first (`.opencode/command/memory/`) — Updated: search.md (graph-first routing, CocoIndex, FTS5 fallback, evidence-gap detection), save.md (026 memory-quality note, deferred indexing, MCP recovery table, compaction note), `memory/README.txt` (tool count 33→43, 10 new tools, 026 retrieval note)
- [x] T005 Review and update authoritative `spec_kit` command docs next (`.opencode/command/spec_kit/`) — Updated: `resume_confirm.yaml` (026 Memory Selection options, confidence framework comments). Skipped (already current): resume.md, `spec_kit/README.txt`, `resume_auto.yaml`
- [x] T006 [P] Review repo-wide command catalogs and operator guidance after the authoritative docs align (`.opencode/README.md`, `README.md`, `AGENTS.md`, `CLAUDE.md`) — Reviewed; authoritative docs aligned in T004/T005, no additional repo-wide changes needed
- [x] T007 [P] Review agent routing docs and alternate runtime wrappers for parity after the authoritative docs are stable (`.opencode/agent/`, `.agents/commands/`) — Reviewed; agent routing and wrapper surfaces consistent with updated authoritative docs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Validate that later edits preserve command names, command counts, and routing language captured in the map (`reference-map.md`)
- [ ] T009 Verify wrapper and mirror wording matches the authoritative command docs after later updates (`.agents/commands/`, repo guidance files)
- [ ] T010 Confirm the phase remains documentation-only and does not introduce runtime engineering tasks (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-3 -->

---

### AI Execution Protocol

#### Pre-Task Checklist
- [ ] Load `spec.md` and confirm scope is still packet-local and planning-only
- [ ] Load `plan.md` and identify the current phase
- [ ] Load `tasks.md` and identify the next incomplete task
- [ ] Verify dependencies are satisfied before editing packet docs
- [ ] Load `checklist.md` and note relevant P0/P1 checks
- [ ] Check `decision-record.md` for blocking decisions
- [ ] Confirm no files outside this child folder are in scope
- [ ] Confirm success criteria still match the 026 release-alignment packet goal
- [ ] Begin work only after the checks above pass

#### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete packet tasks in dependency order unless explicitly parallelizable |
| TASK-SCOPE | Only edit files inside this child folder |
| TASK-VERIFY | Re-run `git diff --check` and `validate.sh --strict` after material packet changes |
| TASK-DOC | Keep the packet planning-only and record scope/decision changes in packet docs |

### Status Reporting Format
Report: `T### [STATUS] - description | Evidence: [File: path or Test: command]`

### Blocked Task Protocol
If a task is blocked, mark it `[B]`, name the blocker directly, and record the unblock condition in `tasks.md` or `decision-record.md` before continuing.

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Later command-document review completed without runtime implementation scope creep
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Evidence**: See `reference-map.md`
<!-- /ANCHOR:cross-refs -->

---

### AI Execution Protocol

### Pre-Task Checklist
1. [ ] Load `spec.md` and confirm scope has not changed.
2. [ ] Load `plan.md` and identify the current phase.
3. [ ] Load `tasks.md` and find the next uncompleted task.
4. [ ] Confirm task dependencies are satisfied.
5. [ ] Review relevant P0/P1 checklist items in `checklist.md`.
6. [ ] Check `decision-record.md` for blocking decisions or constraints.
7. [ ] Re-open `reference-map.md` before touching downstream command docs.
8. [ ] Confirm the work is still documentation-only.
9. [ ] Begin execution only after the authoritative-first order is clear.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Review authoritative command docs before guidance, agents, and wrappers |
| TASK-SCOPE | Stay inside the mapped documentation and wrapper surfaces only |
| TASK-VERIFY | Re-run verification after each material batch of doc edits |
| TASK-DOC | Update packet status immediately when tasks are completed or deferred |

#### Status Reporting Format
Report: `T### [STATUS] - scope - evidence - next`

#### Blocked Task Protocol
If a task needs runtime or code edits, stop, document the blocker, and split that work into a follow-on execution packet.
