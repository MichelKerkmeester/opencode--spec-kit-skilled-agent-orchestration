---
title: "Tasks: UX Hooks Automation"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
# Tasks: UX Hooks Automation

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

- [x] T001 Audit mutation handlers and checkpoint delete flow for shared post-mutation hook gaps
- [x] T002 Define shared post-mutation hook wiring contract and failure-handling behavior
- [x] T003 [P] Capture baseline failing scenarios from CRUD and modularization test paths
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Integrate shared post-mutation hook automation into save/update/delete/bulk-delete and atomic save paths
- [x] T005 Add `memory_health` optional `autoRepair` path with repair metadata reporting
- [x] T006 Add checkpoint delete safety parameter `confirmName` and response metadata
- [x] T007 Update schemas/types/tool definitions for new parameters and response contracts
- [x] T011 Add hook modules `hooks/mutation-feedback.ts` and `hooks/response-hints.ts`, then export via hooks barrel
- [x] T012 Extend `MutationHookResult` with latency and cache-clear booleans
- [x] T013 Update mutation handlers (`memory-save`, `memory-crud-update`, `memory-crud-delete`, `memory-bulk-delete`) to expose `postMutationHooks` and UX hints
- [x] T014 Update `context-server.ts` success path to call `appendAutoSurfaceHints(...)` while preserving `autoSurfacedContext`
- [x] T015 Update hooks README to document new modules and response contracts
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Close follow-up fixes: required `confirmName`, duplicate-save no-op feedback, atomic-save feedback parity/hints, token metadata recomputation before token-budget enforcement, hooks README/export drift, and end-to-end appended-envelope assertion coverage
- [x] T009 Run TypeScript build verification: `npx tsc -b` in `.opencode/skill/system-spec-kit` (PASS)
- [x] T010 Run lint verification: `npm run lint` in `.opencode/skill/system-spec-kit/mcp_server` (PASS)
- [x] T016 Add and pass UX-hook regression suite: `npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts tests/memory-crud-extended.vitest.ts tests/memory-save-ux-regressions.vitest.ts` (PASS, 7 files / 460 tests)
- [x] T017 Pass stdio and embeddings regression suite: `npx vitest run tests/embeddings.vitest.ts tests/stdio-logging-safety.vitest.ts` (PASS, 2 files / 15 tests)
- [x] T018 Pass real MCP SDK stdio smoke test against `node dist/context-server.js` (PASS, 28 tools listed)
- [x] T019 Save fresh phase context to `memory/06-03-26_10-36__ux-hooks-automation.md` via `generate-context.js` (indexed as memory `#1193`)
- [x] T020 Update manual playbook with NEW-103+ UX hook scenarios and evidence criteria
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification evidence recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
