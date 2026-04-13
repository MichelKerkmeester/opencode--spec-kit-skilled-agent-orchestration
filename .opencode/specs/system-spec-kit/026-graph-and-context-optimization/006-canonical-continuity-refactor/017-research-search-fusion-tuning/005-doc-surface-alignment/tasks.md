<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "Tasks: Doc Surface Alignment: Search Fusion Changes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "search fusion tasks"
  - "doc alignment tasks"
  - "continuity profile tasks"
importance_tier: "important"
contextType: "implementation"
status: complete
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/005-doc-surface-alignment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Marked the search-fusion doc alignment task list complete after packet validation"
    next_safe_action: "Reuse this task list if another search-fusion doc packet opens"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:017-phase-005-doc-surface-alignment-tasks"
      session_id: "017-phase-005-doc-surface-alignment-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which requested surfaces needed real edits versus scan-only confirmation"
---
# Tasks: Doc Surface Alignment: Search Fusion Changes

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

- [x] T001 Read `spec.md` and verify the five runtime behavior changes plus the packet-closeout requirement.
- [x] T002 Confirm the implementation source of truth for neutral length scaling, cache telemetry, continuity adaptive fusion, the rerank gate, and continuity Stage 3 MMR lambda behavior.
- [x] T003 Scan every requested surface and record which files still described stale search behavior.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update `README.md` and `.opencode/skill/system-spec-kit/ARCHITECTURE.md`.
- [x] T005 Update `.opencode/command/memory/search.md`, `.opencode/skill/system-spec-kit/SKILL.md`, and `.opencode/skill/system-spec-kit/mcp_server/configs/README.md`.
- [x] T006 [P] Update the affected feature catalog and manual testing playbook entries under `.opencode/skill/system-spec-kit/feature_catalog/` and `.opencode/skill/system-spec-kit/manual_testing_playbook/`.
- [x] T007 Leave `.opencode/command/memory/manage.md`, `.opencode/agent/context.md`, and `AGENTS.md` unchanged after confirming they do not directly describe the changed behavior.
- [x] T008 Create packet-local `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run focused read-backs and `rg` sweeps across the updated surfaces.
- [x] T010 Run `git diff --check` on the touched files.
- [x] T011 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/005-doc-surface-alignment` and repair packet docs until it passes.
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
