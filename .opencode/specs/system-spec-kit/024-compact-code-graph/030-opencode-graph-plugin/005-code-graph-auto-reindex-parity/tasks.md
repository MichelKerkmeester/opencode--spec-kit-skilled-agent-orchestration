---
title: "Tasks: Code [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase 5 tasks"
  - "code graph auto reindex tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Code Graph Auto-Reindex Parity

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
- Confirm edits stay inside the structural graph freshness path and packet 030.
- Confirm CocoIndex parity claims remain behavior-based and truthful.
- Confirm strict validation is the final packet-doc gate.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `RUNTIME-SCOPE` | Keep code changes inside the code graph freshness/read-path files. |
| `SAFETY-FIRST` | Do not remove debounce, timeout, or workspace-bounded protections. |
| `VALIDATE-LAST` | End with targeted runtime tests plus strict packet validation. |

### Status Reporting Format
- `in-progress`: describe the active runtime or packet sync step.
- `blocked`: record the stale/full-rescan safety conflict or failing test.
- `completed`: record changed files and final verification status.

### Blocked Task Protocol
- If inline refresh becomes unsafe, keep the task blocked and restore stale-report-only behavior.
- If parent packet docs drift from runtime truth, fix the docs before phase closeout.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the current `ensureCodeGraphReady()` decision tree and safe-inline boundaries
- [x] T002 Confirm the exact CocoIndex on-use refresh behavior that this phase should mimic
- [x] T003 [P] Confirm parent packet wording for “planned follow-on” status
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update `ensure-ready.ts` to expose the bounded inline refresh path cleanly for structural reads
- [x] T005 Update `code_graph_context` to allow safe inline refresh for small stale sets
- [x] T006 Update `code_graph_query` to allow safe inline refresh for small stale sets
- [x] T007 Preserve stale-report-only behavior for empty, broad branch-switch, and expensive full-rescan cases while allowing small post-commit drift to self-heal inline
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add or update tests for fresh, selective-inline, and stale-report-only paths
- [x] T009 Run `npx tsc --noEmit` and targeted `vitest` for ensure-ready and structural handlers
- [x] T010 Truth-sync the parent packet docs once runtime behavior is verified
- [x] T011 Run strict packet validation for packet 030
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All active Phase 5 tasks are marked `[x]`
- [x] No `[B]` blocked tasks remain
- [x] Code graph read behavior now mimics CocoIndex-style first-use refresh where safe
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `../004-cross-runtime-startup-surfacing-parity/spec.md`
<!-- /ANCHOR:cross-refs -->
