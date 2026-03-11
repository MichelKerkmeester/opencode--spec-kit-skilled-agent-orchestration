---
title: "Tasks: discovery [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "discovery"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
# Tasks: discovery

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

- [x] T001 Re-verify Discovery source-of-truth files for handlers, schemas, tests, and feature catalog (`.opencode/skill/system-spec-kit/mcp_server/*`, `.opencode/skill/system-spec-kit/feature_catalog/03--discovery/*`)
- [x] T002 Re-read all five `003-discovery` docs and identify stale statements to remove (`.opencode/specs/.../003-discovery/*.md`)
- [x] T003 Lock update scope to requested doc set only (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P1] Update docs for `memory_list` handler validation envelopes (`E_INVALID_INPUT` + `requestId`) and resolved `sortBy` response behavior (`mcp_server/handlers/memory-crud-list.ts`)
- [x] T005 [P1] Update docs for `memory_stats` validation of `includeScores`, `includeArchived`, and non-finite `limit`, plus `limit` in success payload (`mcp_server/handlers/memory-crud-stats.ts`)
- [x] T006 [P1] Update docs for `memory_health` schema support for `confirmed` in auto-repair confirmation flow (`mcp_server/schemas/tool-input-schemas.ts`, `mcp_server/tool-schemas.ts`, `mcp_server/tests/tool-input-schema.vitest.ts`)
- [x] T007 [P1] Remove stale Discovery wording (`documentation phase`, old `48/48`, old `computeFolderScores`-limit narrative, outdated Discovery-only inconsistency limitation) across all five docs (`.opencode/specs/.../003-discovery/*.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Record clean TypeScript verification evidence (`npx tsc --noEmit`, no output)
- [x] T009 Record targeted verification evidence: 5 test files, `89/89` passing (`handler-memory-list-edge`, `handler-memory-stats-edge`, `handler-memory-health-edge`, `handler-memory-crud`, `tool-input-schema`)
- [x] T010 Run final cross-file sync check across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification evidence updated to current on-disk reality
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
