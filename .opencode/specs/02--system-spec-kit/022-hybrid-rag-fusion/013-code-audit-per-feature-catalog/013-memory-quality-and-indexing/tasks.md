---
title: "Tasks: memory-quality-and-indexing [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "memory quality"
  - "memory indexing"
  - "quality loop"
  - "entity extraction"
  - "feature catalog"
importance_tier: "normal"
contextType: "general"
---
# Tasks: memory-quality-and-indexing

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

- [x] T001 [P] Reconfirm 16-feature inventory and playbook mapping baseline (feature_catalog/13--memory-quality-and-indexing/) — 16 features confirmed, all catalog files present
- [x] T002 [P] Validate source/test file references used by findings backlog (feature_catalog/13--memory-quality-and-indexing/) — paths corrected in plan (handlers/ not lib/validation/, lib/extraction/ not lib/indexing/, lib/search/ not lib/indexing/)
- [x] T003 Normalize status/priority labels across checklist and tasks artifacts (checklist.md, tasks.md) — labels synchronized
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Align F-01 catalog wording with code (mcp_server/handlers/quality-loop.ts, feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md) — catalog updated: "3 total attempts (1 initial + 2 auto-fix retries, maxRetries=2)"
- [x] T005 Replace hardcoded token budget message with runtime charBudget value (mcp_server/handlers/quality-loop.ts) — scoreTokenBudget() now derives budget from charBudget parameter
- [x] T006 Harmonize chars-per-token constants between preflight and quality-loop (mcp_server/lib/validation/preflight.ts, mcp_server/handlers/quality-loop.ts) — both now read MCP_CHARS_PER_TOKEN env with default 4; preflight tests updated
- [x] T007 Correct reconsolidation default state in feature description (feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md) — updated from "default ON" to "default OFF, opt-in (SPECKIT_RECONSOLIDATION=true)"
- [x] T008 Verify working-memory import path in extraction adapter (mcp_server/lib/extraction/extraction-adapter.ts) — verified correct: lib/cache/cognitive/ is symlink to ../cognitive/, all imports valid, no changes needed
- [x] T009 Route quality-loop feature flag through centralized search flags (mcp_server/handlers/quality-loop.ts, mcp_server/lib/search/search-flags.ts) — added isQualityLoopEnabled() to search-flags.ts, quality-loop.ts imports and re-exports
- [x] T010 Fix stale save-quality-gate comments (mcp_server/lib/validation/save-quality-gate.ts) — removed TM-04/MR12 tracking codes, fixed "default OFF" to "default ON, graduated"
- [x] T011 Reconcile encoding-intent default documentation (mcp_server/lib/search/encoding-intent.ts, feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md) — JSDoc fixed from "opt-in, default OFF" to "default ON, graduated" (isFeatureEnabled treats undefined as enabled)
- [x] T012 Correct F-11/F-12 feature catalog references (feature_catalog/13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md, feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md) — F-11 paths fixed to scripts/utils/slug-utils.ts and tests/slug-utils-boundary.vitest.ts; F-12 verified correct
- [x] T016 Persist quality-loop metadata fixes on accepted saves (mcp_server/handlers/quality-loop.ts, mcp_server/handlers/memory-save.ts) — accepted saves now retain quality-loop metadata updates
- [x] T017 Keep quality-loop content rewrites in-memory under lock until later hard-reject gates pass (mcp_server/handlers/quality-loop.ts, mcp_server/handlers/memory-save.ts) — rewrite payload is not persisted prematurely
 - [x] T018 Prevent same-path `unchanged` from masking unhealthy embedding states (mcp_server/handlers/save/dedup.ts, mcp_server/context-server.ts) — same-path and metadata-only `unchanged` flows no longer hide unhealthy embeddings
 - [x] T019 Update hash dedup for chunked-parent state validity (mcp_server/handlers/save/dedup.ts, mcp_server/handlers/chunking-orchestrator.ts) — valid `partial` parents retained; invalid `complete` parents dropped
 - [x] T020 Switch chunking embedding-cache keying to normalized-content hashing (mcp_server/handlers/chunking-orchestrator.ts) — cache identity now tracks normalized content
 - [x] T021 Stop forcing deferred embeddings on watcher/ingest reindex normal cache misses (mcp_server/handlers/memory-index.ts, mcp_server/context-server.ts) — normal cache-miss path now keeps standard embedding mode
 - [x] T022 Broaden post-mutation invalidation behavior in `memory_index_scan` (mcp_server/handlers/memory-index.ts, mcp_server/context-server.ts) — invalidation now covers adjacent mutation surfaces
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 [P] Re-run combined targeted Vitest suites for touched save/indexing paths (mcp_server/tests/) — 410/410 tests pass across quality-loop, handler-memory-save, content-hash-dedup, chunking-orchestrator-swap, context-server, handler-memory-index-cooldown, and mutation-hooks suites
- [x] T014 [P] Re-audit impacted features and refresh PASS/WARN/FAIL status entries (checklist.md) — 7 WARN features remediated to PASS; new totals: 16 PASS, 0 WARN, 0 FAIL
- [x] T015 Update spec/plan/tasks/checklist/implementation-summary for consistency after remediation and adjacent-path pass (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md) — all artifacts updated with evidence
- [x] T023 [P] Re-run type-check verification (`npx tsc --noEmit`) on updated save/indexing paths — pass
- [x] T024 [P] Run alignment drift verifier for `.opencode/skill/system-spec-kit/mcp_server` — pass with 0 findings
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — 410/410 targeted tests green, `npx tsc --noEmit` pass, alignment drift verifier pass (0 findings)
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
