<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "Tasks: Doc Surface Alignment: Graph Metadata Changes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "graph metadata tasks"
  - "doc alignment"
  - "active-only backfill"
importance_tier: "important"
contextType: "implementation"
status: complete
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Marked the doc-surface alignment task list complete after validation passed"
    next_safe_action: "Reuse this task list if a follow-on graph-metadata doc packet opens"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:019-phase-005-doc-surface-alignment-tasks"
      session_id: "019-phase-005-doc-surface-alignment-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which requested surfaces needed real edits vs verification-only reads"
---
# Tasks: Doc Surface Alignment: Graph Metadata Changes

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Read `spec.md` and confirm the six required graph-metadata behavior changes.
- [x] T002 Resolve the exact target paths for `.opencode/skill/system-spec-kit/ARCHITECTURE.md` and `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`.
- [x] T003 Scan every requested surface and record which files actually described stale behavior.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update `.opencode/command/memory/save.md` and `.opencode/command/memory/manage.md`.
- [x] T005 [P] Update `AGENTS.md`, `CLAUDE.md`, and `.opencode/skill/system-spec-kit/SKILL.md`.
- [x] T006 [P] Update `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md`, the canonical continuity feature/playbook pair, and the backfill script guidance.
- [x] T007 Update `.opencode/skill/system-spec-kit/templates/handover.md` and `.opencode/skill/system-spec-kit/templates/debug-delegation.md`.
- [x] T008 Create packet-local `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` so the Level 2 packet closes cleanly.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run focused `rg` sweeps across the updated surfaces to confirm the new contract language appears where expected.
- [x] T010 Run `git diff --check` on the touched files.
- [x] T011 Run `validate.sh --strict` on this packet, then repair the packet docs until the validator passes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
