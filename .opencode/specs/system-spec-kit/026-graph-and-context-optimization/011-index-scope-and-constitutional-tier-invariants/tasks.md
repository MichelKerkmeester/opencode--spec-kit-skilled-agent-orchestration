---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
title: "Tasks: Index Scope and Constitutional Tier Invariants"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "026/011 tasks"
  - "index scope invariants tasks"
  - "constitutional tier cleanup tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Task ledger drafted"
    next_safe_action: "Complete Phase 1 and start helper wiring"
    blockers: []
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Tasks: Index Scope and Constitutional Tier Invariants

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

#### Pre-Task Checklist

- Re-read each runtime file immediately before patching it.
- Keep all edits inside the 011 packet, the listed `mcp_server/` surfaces, the cleanup script, and the 026 parent metadata.
- Run packet validation, focused tests, and cleanup verification before marking a task complete.

#### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| TASK-SEQ-011 | Land the shared helper before wiring scanner or save-path callers. | Keeps policy drift from reappearing during the patch sequence. |
| TASK-SCOPE-011 | Do not modify packet 010 logic beyond ensuring the new guards still cover scan-originated saves. | Preserves the requested scope lock. |
| TASK-DB-011 | Keep every cleanup mutation inside one SQLite transaction. | Prevents partial cleanup states. |
| TASK-VERIFY-011 | Record exact exit codes and before/after counts. | Keeps verification auditable. |

#### Status Reporting Format

- Start state: which packet or runtime surface is being changed.
- Work state: which invariant or cleanup pass is active.
- End state: whether validation, tests, or cleanup are passing, pending, or blocked.

#### Blocked Task Protocol

- Mark a task `[B]` if a schema relationship or DB reference cannot be updated safely.
- Stop the cleanup apply path on the first SQL error and preserve rollback.
- Record the blocker in `implementation-summary.md` before continuing elsewhere.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create packet `011-index-scope-and-constitutional-tier-invariants` with Level 3 docs and metadata (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/`)
- [x] T002 Document the read-only investigation with exact file:line references (`research/research.md`)
- [x] T003 Update 026 parent topology metadata to include child 011 (`../description.json`, `../graph-metadata.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create shared index-scope helper for memory and code graph (`mcp_server/lib/utils/index-scope.ts`)
- [ ] T005 Wire memory discovery and spec-doc classification to the shared helper (`mcp_server/handlers/memory-index-discovery.ts`, `mcp_server/lib/config/spec-doc-paths.ts`)
- [ ] T006 Align `isMemoryFile()` and constitutional README handling with the new policy (`mcp_server/lib/parsing/memory-parser.ts`)
- [ ] T007 Add save-time path rejection and constitutional tier downgrade (`mcp_server/handlers/memory-save.ts`)
- [ ] T008 Wire code-graph recursive and specific-file scanning to the shared helper while preserving existing excludes (`mcp_server/code-graph/lib/structural-indexer.ts`, `mcp_server/code-graph/lib/indexer-types.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 [P] Add focused exclusion and constitutional-tier Vitest coverage (`mcp_server/tests/`)
- [ ] T010 [P] Add cleanup CLI with dry-run, apply, and verify modes (`scripts/memory/cleanup-index-scope-violations.ts`)
- [ ] T011 Update canonical docs with the three invariants and helper reference (`.opencode/skill/system-spec-kit/mcp_server/README.md`)
- [ ] T012 Run packet strict validation (`spec/validate.sh --strict --no-recursive`)
- [ ] T013 Run `npm run typecheck`, `npm run build`, focused Vitest commands, and `npm run test:core`; record outcomes honestly (`implementation-summary.md`, `checklist.md`)
- [ ] T014 Run cleanup dry-run, apply, and verify against the Voyage-4 DB; capture before/after counts (`implementation-summary.md`, `checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Runtime invariants and cleanup verification both pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
