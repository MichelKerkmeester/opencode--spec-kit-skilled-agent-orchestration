---
title: "Tasks: Readiness Scaffolding Cleanup"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task list for mechanical removal of vestigial embedding-readiness scaffolding, including extra references discovered by pre-flight grep."
trigger_phrases:
  - "026-readiness-scaffolding-cleanup"
  - "readiness scaffolding cleanup"
  - "embedding readiness deprecation"
  - "tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/026-readiness-scaffolding-cleanup"
    last_updated_at: "2026-04-29T09:45:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Removed embedding readiness scaffolding and ran verification"
    next_safe_action: "Review documented Vitest failures before claiming full-suite green"
    blockers:
      - "Full vitest suite reported unrelated failures and then did not terminate within the observed window"
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/core/db-state.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/core/index.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
    completion_pct: 100
---
# Tasks: Readiness Scaffolding Cleanup

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

- [x] T001 Read packet contract (`spec.md`)
- [x] T002 Read core/runtime/handler target files
- [x] T003 [P] Run pre-flight grep and record extra references
- [x] T004 [P] Author Level 1 plan and tasks docs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Remove readiness mocks and readiness-specific tests (`mcp_server/tests/*.vitest.ts`)
- [x] T006 Remove context-server startup wait and bootstrap marker (`mcp_server/context-server.ts`)
- [x] T007 Remove extra runtime readiness callers discovered by grep (`api/indexing.ts`, `lib/feedback/shadow-evaluation-runtime.ts`, `handlers/memory-crud-health.ts`)
- [x] T008 Remove handler/core readiness exports (`handlers/memory-crud.ts`, `handlers/index.ts`, `core/index.ts`)
- [x] T009 Remove readiness state and helper definitions (`core/db-state.ts`)
- [x] T010 Update packet spec scope and continuity (`spec.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify zero readiness references in non-dist TypeScript
- [x] T012 Run `npx tsc --noEmit`
- [x] T013 Run `npx tsc`
- [x] T014 Run `npx vitest run` and document failures/hang
- [x] T015 Run strict packet validator
- [x] T016 Write implementation summary with files changed, verification, and limitations
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Required verification commands completed and documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
