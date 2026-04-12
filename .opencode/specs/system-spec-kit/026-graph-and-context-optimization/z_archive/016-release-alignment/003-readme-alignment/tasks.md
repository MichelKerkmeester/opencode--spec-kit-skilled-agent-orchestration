---
title: "Tasks: 003 README Alignment Planning [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "readme alignment tasks"
  - "026 documentation tasks"
  - "release alignment task list"
  - "level 3 packet"
  - "readme audit tasks"
importance_tier: "important"
contextType: "documentation"
---
# Tasks: 003 README Alignment Planning

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
- [x] T002 Preserve `readme-audit.md` as the evidence baseline and normalize packet-local path resolution (`readme-audit.md`)
- [x] T003 [P] Reconfirm the highest-priority README targets before the later pass begins (`readme-audit.md`) — Evidence: Targets confirmed during T004-T007 execution
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Review root repo README entrypoints first (`.opencode/README.md`, `README.md`) | Evidence: Updated `.opencode/README.md` (tool counts 33->43, 40->52, graph-first routing, CocoIndex channel) and root `README.md` (Code Graph description, memory engine, hybrid search, RRF, query routing)
- [x] T005 Review command README indexes next (`.opencode/command/spec_kit/README.txt`, `.opencode/command/memory/README.txt`, `.opencode/command/README.txt`) | Evidence: Updated scripts/memory/README.md; command README indexes (.opencode/command/memory/README.txt, .opencode/command/spec_kit/README.txt) handled in sibling packet 002
- [x] T006 [P] Review core `system-spec-kit` README and runtime README surfaces after the roots align (`.opencode/skill/system-spec-kit/README.md`, `.opencode/skill/system-spec-kit/mcp_server/README.md`, `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`) | Evidence: Updated mcp_server/README.md (key numbers, RAG comparison, CocoIndex bridge, graph-first routing), mcp_server/INSTALL_GUIDE.md (architecture diagram with code-graph.sqlite, removed stale context-prime.toml, added web-tree-sitter dep), mcp_server/ENV_REFERENCE.md (graph-first-class feature family note)
- [x] T007 [P] Review supporting README surfaces only if root and command README wording changes require parity updates (`.opencode/install_guides/README.md`, subsystem READMEs, mapped packet-local README targets) | Evidence: scripts/memory/README.md updated for parity with root changes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-check touched README paths against the curated target list in `readme-audit.md` (`readme-audit.md`) — Evidence: All 6 updated files match audit target list
- [x] T009 Run strict packet validation after packet or later README updates change (`003-readme-alignment/`) — Evidence: validate.sh --strict PASSED
- [x] T010 Confirm the change set stayed documentation-only and did not introduce runtime code edits (`git diff`, README target review) — Evidence: git diff confirms only markdown documentation files modified
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

#### Status Reporting Format
Report: `T### [STATUS] - description | Evidence: [File: path or Test: command]`

#### Blocked Task Protocol
If a task is blocked, mark it `[B]`, name the blocker directly, and record the unblock condition in `tasks.md` or `decision-record.md` before continuing.

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] README review/update work stays within the audit-defined release-alignment scope
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Evidence**: See `readme-audit.md`
<!-- /ANCHOR:cross-refs -->
