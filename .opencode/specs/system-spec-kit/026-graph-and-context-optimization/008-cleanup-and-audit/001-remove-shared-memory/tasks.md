---
title: "018 / 010 — Shared memory removal tasks"
description: "Task ledger for the hard-delete shared-memory implementation pass."
trigger_phrases: ["018 010 tasks", "shared memory removal tasks", "hard delete shared memory tasks"]
importance_tier: "critical"
contextType: "implementation"
status: "complete"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/001-remove-shared-memory"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed the shared-memory hard-delete task list"
    next_safe_action: "Review implementation-summary.md"
    key_files: ["tasks.md", "implementation-summary.md"]
---
# Tasks: 018 / 010 — Remove shared memory

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

- [x] T001 Re-anchor on the `008-cleanup-and-audit` coordination parent and the operator’s hard-delete rules. (`../graph-metadata.json`, `../description.json`)
- [x] T002 Audit the shared-memory runtime, command, catalog, playbook, and test surfaces through direct file reads and `rg` sweeps. (`.opencode/skill/system-spec-kit/**`, `.opencode/command/memory/manage.md`)
- [x] T003 Create the `010-remove-shared-memory` phase folder and populate the Level 2 packet docs. (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove the four shared-memory lifecycle tool registrations, schemas, and type definitions. (`mcp_server/tools/lifecycle-tools.ts`, `mcp_server/tools/types.ts`, `mcp_server/schemas/tool-input-schemas.ts`, `mcp_server/tool-schemas.ts`)
- [x] T005 Delete the dedicated shared-memory handler and shared-space runtime library, then remove their barrel/API references. (`mcp_server/handlers/shared-memory.ts`, `mcp_server/lib/collab/shared-spaces.ts`, `mcp_server/handlers/index.ts`, `mcp_server/api/index.ts`)
- [x] T006 Remove `sharedSpaceId` request plumbing and shared-space filtering from retrieval, trigger, save, checkpoint, and helper paths. (`mcp_server/handlers/*.ts`, `mcp_server/lib/**/*.ts`, `mcp_server/tools/memory-tools.ts`)
- [x] T007 Keep the schema-column exception only, including the required comment on `memory_index.shared_space_id`. (`mcp_server/lib/search/vector-index-schema.ts`)
- [x] T008 Remove shared-memory command docs, skill/MCP docs, shared-space directories, feature-catalog rows, and playbook scenarios. (`.opencode/command/memory/manage.md`, `.opencode/skill/system-spec-kit/**/*.md`)
- [x] T009 Delete shared-memory-only tests and remove shared-memory assertions from mixed suites. (`mcp_server/tests/**/*.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the required MCP server typecheck. (`npm run --workspace=@spec-kit/mcp-server typecheck`)
- [x] T011 Run the required scripts workspace typecheck and build. (`npm run --workspace=@spec-kit/scripts typecheck`, `npm run build --workspace=@spec-kit/scripts`)
- [x] T012 Run the remaining test suite after deleting shared-memory-only files. (`npm test`/Vitest workspace command)
- [x] T013 Run strict packet validation for this phase folder. (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .../010-remove-shared-memory`)
- [x] T014 Run the final shared-reference grep and confirm only the schema/doc exceptions remain. (`grep -rn ...`)
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
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
