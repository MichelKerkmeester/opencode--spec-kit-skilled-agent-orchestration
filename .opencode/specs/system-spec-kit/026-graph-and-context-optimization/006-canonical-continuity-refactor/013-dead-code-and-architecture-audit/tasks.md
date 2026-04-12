---
title: "Tasks: 026 / 006 / 013 — dead code and architecture audit"
description: "Task Format: T### Description [EVIDENCE: ...]"
trigger_phrases: ["013 tasks", "dead code audit tasks", "architecture audit tasks"]
importance_tier: "important"
contextType: "implementation"
status: "complete"
level: 3
parent: "006-canonical-continuity-refactor"
_memory:
  continuity:
    packet_pointer: "026/006/013-dead-code-and-architecture-audit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Closed the task ledger with evidence"
    next_safe_action: "Review checklist"
    key_files: ["tasks.md", "checklist.md", "implementation-summary.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 026 / 006 / 013 — dead code and architecture audit

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description [EVIDENCE: ...]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run unused-symbol compiler sweep on `mcp_server`. [EVIDENCE: `tsc --noUnusedLocals --noUnusedParameters` exited 0.]
- [x] T002 Run unused-symbol compiler sweep on `scripts`. [EVIDENCE: `tsc --noUnusedLocals --noUnusedParameters` exited 0.]
- [x] T003 Sweep active code for removed continuity-era concept branches. [EVIDENCE: final active-source grep returned no matches.]
- [x] T004 Sweep production runtime code for raw console usage. [EVIDENCE: scoped runtime sweep isolated only documentation or standalone utility hits outside production scope.]
- [x] T005 Run handler cycle detection. [EVIDENCE: AST handler cycle check passed.]
- [x] T006 Triage orphan-file candidates. [EVIDENCE: no committed source file qualified for deletion after manual reachability triage.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Remove unused imports in handlers. [EVIDENCE: handler cleanup landed in coverage-graph, memory-save, and quality-loop files.]
- [x] T008 Remove unused imports and dead helpers in libs. [EVIDENCE: runtime cleanup landed in archival-manager, merge, parsing, search, and storage files.]
- [x] T009 Remove unused imports and dead helpers in scripts. [EVIDENCE: cleanup landed across core, extractors, loaders, lib helpers, memory helpers, and utility modules.]
- [x] T010 Remove dead concept branches. [EVIDENCE: no surviving active-code branches remained after the final grep.]
- [x] T011 Replace raw production runtime `console.log` with structured logging in active save-path modules. [EVIDENCE: cleanup landed in `scripts/core/`, `scripts/loaders/`, and `scripts/extractors/`.]
- [x] T012 Resolve circular dependencies if found. [EVIDENCE: no cycle-breaking refactor was required because the cycle check passed cleanly.]
- [x] T013 Delete or document orphaned files. [EVIDENCE: packet docs record that only entrypoints, CLI utilities, or transient test artifacts appeared in conservative orphan scans.]
- [x] T014 Normalize touched imports to `sk-code-opencode` ordering. [EVIDENCE: touched files were reordered and both workspace typechecks stayed green.]
- [x] T015 Audit the package architecture document against live runtime structure. [EVIDENCE: the doc rewrite was grounded in direct reads of handlers, hooks, resume, routing, merge, context, continuity, governance, feedback, and coverage modules.]
- [x] T016 Add current Phase 006 runtime modules to the package architecture narrative. [EVIDENCE: the doc now covers resume ladder, content routing, anchor merge, coverage graph, feedback, and authoring surfaces.]
- [x] T017 Remove deleted shared-memory-era framing from the package architecture narrative. [EVIDENCE: the rewritten doc no longer describes retired shared-memory or shadow-rollout structures.]
- [x] T018 Verify runtime layering. [EVIDENCE: architecture boundary check passed.]
- [x] T019 Create missing source READMEs under `mcp_server/`. [EVIDENCE: README files were added for the uncovered source directories.]
- [x] T020 Verify existing source READMEs are not stale. [EVIDENCE: deleted-module README sweep returned no stale references.]
- [x] T021 Confirm new Phase 006 source directories now have README coverage. [EVIDENCE: source-only README inventory returned no missing qualifying directories.]
- [x] T022 Re-read the parent resource map before refresh. [EVIDENCE: the parent map was read before rewrite.]
- [x] T023 Add current Phase 006 runtime surfaces to the parent resource map. [EVIDENCE: the rewritten map now reflects resume, routing, merge, hooks, coverage graph, feedback, authoring, and verification surfaces.]
- [x] T024 Remove deleted runtime surfaces from the parent resource map. [EVIDENCE: shared-memory-era rows were removed.]
- [x] T025 Refresh resource-map ownership wording to current reality. [EVIDENCE: the rewritten map now describes the surviving runtime instead of the older migration snapshot.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T026 Run `npm run --workspace=@spec-kit/mcp-server typecheck`. [EVIDENCE: exited 0 from the package root.]
- [x] T027 Run `npm run --workspace=@spec-kit/scripts typecheck`. [EVIDENCE: exited 0 from the package root.]
- [x] T028 Run affected tests. [EVIDENCE: runtime batch passed `4 files / 125 tests`; scripts batch passed `3 files / 21 tests` with the known config warning.]
- [x] T029 Run `validate.sh --strict` on the phase packet. [EVIDENCE: strict validation passed.]
- [x] T030 Re-run the dead-concept grep as the final active-code gate. [EVIDENCE: exited 1 with no matches.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification evidence recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

### AI Execution Protocol

#### Pre-Task Checklist
- [x] Read target files before editing
- [x] Verify the audit stayed inside approved runtime and packet scope

#### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Execute scans before edits, then rerun verification after edits |
| TASK-SCOPE | Limit runtime changes to the approved package and packet docs |

#### Status Reporting Format
Report by scan state, fix state, and verification state.

#### Blocked Task Protocol
If a verification gate fails, fix it in scope before marking the task complete.
<!-- /ANCHOR:cross-refs -->
