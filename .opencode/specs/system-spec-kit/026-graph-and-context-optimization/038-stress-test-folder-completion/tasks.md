---
title: "Tasks: Stress Test Folder Completion"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "038-stress-test-folder-completion"
  - "stress test full migration"
  - "search-quality harness move"
  - "content-based stress migration"
  - "stress folder reorganization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/038-stress-test-folder-completion"
    last_updated_at: "2026-04-29T18:45:00Z"
    last_updated_by: "codex"
    recent_action: "Verification recorded."
    next_safe_action: "Hand off for commit."
    blockers: []
    key_files:
      - "migration-plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: Stress Test Folder Completion

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

- [x] T001 Read prior 037/005 migration plan.
- [x] T002 Read current stress README and tests README.
- [x] T003 Read Vitest config and package scripts.
- [x] T004 Run content-based discovery commands.
- [x] T005 Classify discovered candidates in `migration-plan.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Create subsystem folders under `mcp_server/stress_test/`.
- [x] T007 Move the legacy search-quality tree to `stress_test/search-quality/`.
- [x] T008 Move clear memory benchmark suites to `stress_test/memory/`.
- [x] T009 Move clear session stress suites to `stress_test/session/`.
- [x] T010 Move skill graph concurrency stress suite to `stress_test/skill-advisor/`.
- [x] T011 Move code graph degraded and cap stress suites to `stress_test/code-graph/`.
- [x] T012 Move synthetic matrix comparison to `stress_test/matrix/`.
- [x] T013 Update relative imports in moved files.
- [x] T014 Add `vitest.stress.config.ts`.
- [x] T015 Update `package.json` stress scripts.
- [x] T016 Refresh stress README content.
- [x] T017 Refresh tests README and MCP server docs.
- [x] T018 Refresh direct old-path references in 011/030/035/037 packet docs.
- [x] T019 Create Level 2 packet docs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run stale-reference grep.
- [x] T021 Run strict validator.
- [x] T022 Run `npm run build`.
- [x] T023 Run `npm test`; unrelated failures/hang documented.
- [x] T024 Run `npm run stress`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Final verification passed or any failures documented with evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Migration ledger**: See `migration-plan.md`.

`git mv` was attempted first, but the sandbox could not create `.git/index.lock`.
Files were moved with filesystem moves after that blocker. No commit was created.
<!-- /ANCHOR:cross-refs -->
