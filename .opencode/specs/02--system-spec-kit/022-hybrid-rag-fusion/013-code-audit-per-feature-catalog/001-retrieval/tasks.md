---
title: "Tasks: 001-Retrieval Code Audit"
description: "Task Format: T-## [P?] Description (file path)"
trigger_phrases: ["tasks", "retrieval", "audit", "template", "tasks core"]
importance_tier: "normal"
contextType: "general"
---
# Tasks: 001-Retrieval Code Audit
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

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 4 | Correctness fixes in retrieval runtime behavior |
| P1 | 4 | Required test-quality and compatibility hardening |
| P2 | 1 | Documentation/evidence synchronization |
| **Total** | **9** | |

---

<!-- ANCHOR:phase-1 -->
## P0 - Critical / Correctness

- [x] T-01 Harden token-budget enforcement for structured over-budget payloads
  - **Priority:** P0
  - **Feature:** F-01 Unified context retrieval (memory_context)
  - **Status:** DONE
  - **Source:** `mcp_server/handlers/memory-context.ts`
  - **Issue:** Structured payloads could remain over budget in single-result and parse-sensitive paths.
  - **Fix:** `enforceTokenBudget()` now continues enforcement for structured payloads using field compaction, then binary-search truncation fallback when still over budget.
  - **Evidence:** `token-budget-enforcement.vitest.ts` strengthened assertions and added single-result compaction coverage.

- [x] T-02 Fix transactional delete reporting on rollback
  - **Priority:** P0
  - **Feature:** F-02/F-04 shared retrieval mutation path
  - **Status:** DONE
  - **Source:** `mcp_server/lib/search/vector-index-mutations.ts`
  - **Issue:** `delete_memories()` could report successful deletions even when the transaction rolled back.
  - **Fix:** Counts now reflect committed state only; rollback path returns `deleted: 0` and `failed` for requested IDs.
  - **Evidence:** `vector-index-impl.vitest.ts` includes new batch-delete rollback regression.

- [x] T-03 Remove remaining silent catches and harden migration backfill path safety
  - **Priority:** P0
  - **Feature:** F-04/F-05 shared retrieval schema/index path
  - **Status:** DONE
  - **Source:** `mcp_server/lib/search/vector-index-schema.ts`
  - **Issue:** Remaining catch blocks in `create_common_indexes()` and migration backfill file reads could fail silently or read unsafe paths.
  - **Fix:** Silent catches replaced with structured warnings. Migration v14 backfill now validates base paths before reads and logs structured warnings on rejected/unreadable files.
  - **Evidence:** Retrieval-targeted suite remains green and schema operations preserve warn-not-throw behavior.

- [x] T-04 Restore intended multi-source boost behavior in RRF fusion
  - **Priority:** P0
  - **Feature:** F-04/F-05/F-08 shared fusion behavior
  - **Status:** DONE
  - **Source:** `shared/algorithms/rrf-fusion.ts`, `shared/dist/algorithms/rrf-fusion.js`
  - **Issue:** `fuseResultsMulti()` default convergence bonus path did not apply the intended multi-source boost.
  - **Fix:** Default convergence bonus set to `CONVERGENCE_BONUS` in both source and dist runtime build.
  - **Evidence:** `rrf-fusion.vitest.ts` and `unit-rrf-fusion.vitest.ts` expectation updates pass.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## P1 - Behavior Mismatch / Significant Code Issues

- [x] T-05 Add backward-compatible extraction fallback for older schemas
  - **Priority:** P1
  - **Feature:** F-09 tool-result extraction path
  - **Status:** DONE
  - **Source:** `mcp_server/lib/extraction/extraction-adapter.ts`
  - **Issue:** Older databases without `canonical_file_path` could fail memory-id resolution.
  - **Fix:** `resolveMemoryIdFromText()` now falls back to `file_path` lookup when canonical-path column is unavailable.
  - **Evidence:** `extraction-adapter.vitest.ts` included in green retrieval-targeted verification.

- [x] T-06 Strengthen token-budget test contracts
  - **Priority:** P1
  - **Feature:** F-01 Unified context retrieval (memory_context)
  - **Status:** DONE
  - **Source:** `mcp_server/tests/token-budget-enforcement.vitest.ts`
  - **Issue:** Prior assertions did not enforce budget strongly enough for all response shapes.
  - **Fix:** Assertions now check effective token bounds and include explicit single-result structured compaction coverage.
  - **Evidence:** Suite is part of `365 passed / 0 failed` retrieval-targeted run.

- [x] T-07 Replace placeholder/todo assertions with concrete retrieval checks
  - **Priority:** P1
  - **Feature:** Cross-feature test quality (F-01..F-09 audit support)
  - **Status:** DONE
  - **Source:** `search-archival.vitest.ts`, `memory-context.vitest.ts`, `memory-search-integration.vitest.ts`, `vector-index-impl.vitest.ts`, `bm25-index.vitest.ts`
  - **Issue:** Placeholder assertions, todos, and weak conditions reduced regression signal.
  - **Fix:** Replaced placeholders/todos with source-backed assertions, tightened fallback checks, added rollback and title-change regressions.
  - **Evidence:** All listed files are in passing targeted verification set.

- [x] T-08 Update RRF test expectations to match corrected convergence defaults
  - **Priority:** P1
  - **Feature:** F-04/F-05/F-08 fusion ranking verification
  - **Status:** DONE
  - **Source:** `mcp_server/tests/rrf-fusion.vitest.ts`, `mcp_server/tests/unit-rrf-fusion.vitest.ts`
  - **Issue:** Expectations reflected pre-fix default convergence behavior.
  - **Fix:** Updated expected multi-source bonus behavior to align with restored default (`CONVERGENCE_BONUS`).
  - **Evidence:** Both suites pass in retrieval-targeted verification.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## P2 - Documentation / Test Gaps

- [x] T-09 Synchronize spec-folder documentation with verified post-fix reality
  - **Priority:** P2
  - **Feature:** Audit evidence quality across all 9 retrieval features
  - **Status:** DONE
  - **Source:** `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
  - **Issue:** Documentation still contained stale pass counts, unsupported review-score claims, and fixed findings shown as open.
  - **Fix:** Updated all five spec documents to match current verified numbers and closed-finding state.
  - **Evidence:** Retrieval-targeted (`365/0`) and full-suite baseline (`7339 passed, 5 failed, 28 todo, 1 pending`) are now represented consistently.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `npx tsc --noEmit --pretty false` passes in `mcp_server`
- [x] Retrieval-targeted verification passed (`10` suites, `365` passed, `0` failed)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
