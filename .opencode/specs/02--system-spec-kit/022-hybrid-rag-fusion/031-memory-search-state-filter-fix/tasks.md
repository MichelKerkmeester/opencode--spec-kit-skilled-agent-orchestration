---
title: "Tasks: Memory Search State Filter Fix + Folder Discovery Follow-up"
description: "Task Format: T### [P?] Description (file path)"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Memory Search State Filter Fix + Folder Discovery Follow-up

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

- [x] T001 Confirm folder-discovery behavior for nested spec layers and root alias inputs (`.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`) [E: Follow-up scope identified for deep recursion + alias dedupe]
- [x] T002 Confirm expected root handling for `specs/` symlink + `.opencode/specs/` alias [E: Canonical-path dedupe requirement documented with first-candidate retention]
- [x] T003 [P] Confirm graceful behavior target for invalid/nonexistent explicit input paths [E: `ensureDescriptionCache` empty-cache return requirement documented]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement depth-limited recursive discovery with max depth 8 (`.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`) [E: Recursive folder discovery now supports deep nested spec layers]
- [x] T005 Implement canonical-path dedupe for alias roots while preserving first candidate path (`.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`) [E: `specs/` and `.opencode/specs/` aliases deduped by canonical path]
- [x] T006 [P] Update staleness checks to run on recursive discovered spec folders (`.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`) [E: Staleness evaluation now consumes recursive discovery output]
- [x] T007 Ensure `ensureDescriptionCache` returns empty cache object for invalid/nonexistent non-empty input paths (`.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`) [E: Graceful fallback behavior implemented]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Update unit tests for recursive discovery and invalid path behavior (`.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts`) [E: `npm run test --workspace=mcp_server -- tests/folder-discovery.vitest.ts` -> 45 passed]
- [x] T009 Update integration tests for alias dedupe + recursive staleness behavior (`.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts`) [E: `npm run test --workspace=mcp_server -- tests/folder-discovery-integration.vitest.ts` -> 24 passed]
- [x] T010 Run and pass typecheck/build in system-spec-kit workspace [E: `npm run typecheck && npm run build` in `.opencode/skill/system-spec-kit` -> PASS]
- [x] T011 Run alignment drift verification for MCP server subtree [E: `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/mcp_server` -> PASS]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] REQ-001..REQ-005 verified with test evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
