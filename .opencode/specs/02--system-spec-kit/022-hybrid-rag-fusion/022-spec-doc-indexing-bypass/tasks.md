---
title: "Tasks: Spec Doc Indexing Bypass [02--system-spec-kit/022-hybrid-rag-fusion/022-spec-doc-indexing-bypass/tasks]"
description: "Task tracking for completing the warn-only bypass across all 4 rejection gates in processPreparedMemory."
trigger_phrases:
  - "spec doc bypass tasks"
  - "indexing bypass tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Spec Doc Indexing Bypass

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Gate 1 bypass: Add `qualityGateMode === 'warn-only'` to V-rule rejection at line 333 (`mcp_server/handlers/memory-save.ts`)
- [x] T002 Gate 2 bypass: Add `qualityGateMode === 'warn-only'` to sufficiency rejection at line 350 (`mcp_server/handlers/memory-save.ts`)
- [x] T003 Gate 3 bypass: Add `qualityGateMode === 'warn-only'` to template contract rejection at line 354 (`mcp_server/handlers/memory-save.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run `npm run build` in `mcp_server/` — verify clean build
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Restart MCP server
- [x] T006 Run `memory_index_scan({ force: true })` — confirm 0 rejected spec docs (verified: 0 rejected, 1670 indexed, 128 updated)
- [x] T007 Verify memory files still subject to all 4 gates (no regression) (verified: 24 memory files rejected by quality gates, 57 updated)
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
- **Predecessor**: v3.0.0.1 release — `changelog/01--system-spec-kit/v3.0.0.1.md`
<!-- /ANCHOR:cross-refs -->
