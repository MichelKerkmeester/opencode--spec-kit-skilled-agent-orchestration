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
- [x] T016 Add and pass the fresh remediation-pass combined regression rerun: `npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts tests/memory-crud-extended.vitest.ts tests/memory-save-ux-regressions.vitest.ts tests/embeddings.vitest.ts tests/stdio-logging-safety.vitest.ts` (PASS, 9 files / 485 tests)
- [x] T017 Confirm stdio and embeddings regression coverage is included in the same combined remediation-pass Vitest rerun (PASS, 9 files / 485 tests)
- [x] T018 Pass real MCP SDK stdio smoke test against `node dist/context-server.js` (PASS, 28 tools listed)
- [x] T019 Re-save fresh phase context via `generate-context.js`, record the saved artifact path, and document that direct phase-folder save is rejected while parent-spec indexing still fails on the 1024 vs 768 embedding mismatch (artifact: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/06-03-26_16-41__sgqs-comprehensive-review-blocked.md`; no new indexed memory ID available)
- [x] T020 Update manual playbook with NEW-103+ UX hook scenarios and evidence criteria
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Review-Driven Fixes

- [x] T021 [P] Apply M1+M2: Add `sanitizeErrorForHint()` and `redactPath()` in `memory-crud-health.ts`; sanitize 4 hint call sites and redact 3 path exposures. Add Windows path regex per review P1 finding. Sanitize `repair.errors` per review P1 finding. (`handlers/memory-crud-health.ts`)
- [x] T022 [P] Apply M3: Wrap `toolCache.invalidateOnWrite()` in try/catch in `mutation-hooks.ts`; wrap file-watcher `runPostMutationHooks` in try/catch in `context-server.ts` (`handlers/mutation-hooks.ts`, `context-server.ts`)
- [x] T023 [P] Apply M4: Extract `MutationHookResult` to `memory-crud-types.ts`, re-export from `mutation-hooks.ts`, update import in `mutation-feedback.ts` (`handlers/memory-crud-types.ts`, `handlers/mutation-hooks.ts`, `hooks/mutation-feedback.ts`)
- [x] T024 [P] Apply m1+m2+m3: Replace non-null assertion with safe access, add convergence comment, add serialization trade-off comment (`hooks/response-hints.ts`)
- [x] T025 [P] Apply m4: Wrap `runPostMutationHooks` call sites in try/catch with fallback `MutationHookResult` in 3 handler files (`handlers/memory-crud-update.ts`, `handlers/memory-crud-delete.ts`, `handlers/memory-bulk-delete.ts`)
- [x] T026 [P] Apply m10: Add latency measurement for auto-surface precheck path with 250ms p95 warning (`context-server.ts`)
- [x] T027 [P] Apply m5+s6+s7: Replace T521-L3 placeholder with behavioral test; add all-caches-succeed test; add zero-count auto-surface test (`tests/handler-checkpoints.vitest.ts`, `tests/hooks-ux-feedback.vitest.ts`)
- [x] T028 [P] Apply s3: Add single-process assumption comment to module-level cache state (`hooks/memory-surface.ts`)
- [x] T029 Verify: TypeScript type-check passes (`npx tsc --noEmit` PASS)
- [x] T030 Verify: 416/416 tests pass across 4 affected test suites
- [x] T031 Review: 2-agent parallel review confirms no P0 blockers. Score: R1=90/100, R2=98/100. Two P1 findings (Windows path regex, unsanitized repair.errors) fixed immediately.
<!-- /ANCHOR:phase-4 -->

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
