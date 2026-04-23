---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
title: "Tasks: Cross-File Symbol Dedup Defense"
description: "Task list for packet 012/003, covering Level 2 docs, structural indexer dedup, DB INSERT OR IGNORE, focused tests, build, dist verification, and implementation summary."
trigger_phrases:
  - "cross-file symbol dedup tasks"
  - "012/003 tasks"
  - "globalSeenIds task"
  - "code graph db insert ignore task"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/012-code-graph-context-and-scan-scope/003-cross-file-dedup-defense"
    last_updated_at: "2026-04-23T00:00:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Created task breakdown"
    next_safe_action: "Execute T-001 through T-007"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-db.vitest.ts"
    session_dedup:
      fingerprint: "sha256:012-003-cross-file-dedup-defense-tasks-2026-04-23"
      session_id: "cg-012-003-2026-04-23"
      parent_session_id: "cg-012-002-2026-04-23"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Cross-File Symbol Dedup Defense

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

- [x] T-001 Create Level 2 packet docs (`003-cross-file-dedup-defense/`; expected diff ~350-450 lines)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Add global cross-file dedup sweep after TESTED_BY edges (`code-graph/lib/structural-indexer.ts`; expected diff ~12-18 lines)
- [x] T-003 Change node persistence insert mode to `INSERT OR IGNORE` (`code-graph/lib/code-graph-db.ts`; expected diff 1 line)
- [x] T-004 Add `indexFiles()` cross-file dedup tests (`tests/structural-contract.vitest.ts`; expected diff ~70-110 lines)
- [x] T-005 Add `replaceNodes()` duplicate-tolerance tests (`tests/code-graph-db.vitest.ts`; expected diff ~90-130 lines)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-006 Run strict spec validation, build, focused Vitest, and dist grep checks (commands in `plan.md`)
- [x] T-007 Write implementation summary with `_memory.continuity` and final validation (`implementation-summary.md`; expected diff ~100-150 lines)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] `validate.sh --strict` exits 0.
- [x] `npm run build` exits 0.
- [x] Focused Vitest command exits 0 with new tests included.
- [x] Operator step documented for MCP restart plus live full scan.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/research.md`
- **Prior packet**: `../002-incremental-fullscan-recovery/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
