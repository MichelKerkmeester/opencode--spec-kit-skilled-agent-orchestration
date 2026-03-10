# Tasks — 018 UX Hooks

## Summary

| Priority | Count |
|----------|-------|
| P0       | 2     |
| P1       | 8     |
| P2       | 7     |
| **Total** | **17** |

---

## P0 — FAIL (Immediate Fix)

### T-01: Fix aggregate repair reporting for mixed outcomes
- **Priority:** P0
- **Feature:** F-02 Memory health autoRepair metadata
- **Status:** TODO
- **Source:** `mcp_server/handlers/memory-crud-health.ts:375-377,403-405`
- **Issue:** `repair.repaired` can be set `true` by orphan-edge cleanup even after unresolved FTS mismatch was recorded, overstating overall repair success. Callers cannot reliably inspect repair outcomes when mixed results exist.
- **Fix:** Track per-repair-step status and compute aggregate `repaired` only when no unresolved warnings/errors remain.

### T-02: Make CheckpointDeleteArgs.confirmName required across all layers
- **Priority:** P0
- **Feature:** F-04 Schema and type contract synchronization
- **Status:** TODO
- **Source:** `mcp_server/handlers/checkpoints.ts:47-50`; `mcp_server/schemas/tool-input-schemas.ts:230-233,368`; `mcp_server/tool-schemas.ts:290-304`; `mcp_server/tools/types.ts:193-196`
- **Issue:** Contract desync: checkpoint delete handler args type keeps `confirmName` optional while schema/tool-type boundaries require it. Feature claims synchronized required `confirmName` across all layers, but handler type still permits omission at compile time.
- **Fix:** Change handler `CheckpointDeleteArgs.confirmName` to required. Add a type-contract regression test covering handler + tool-type parity.

---

## P1 — WARN with Behavior Mismatch or Significant Code Issues

### T-03: Add warning-level logging to mutation hook catch blocks
- **Priority:** P1
- **Feature:** F-01 Shared post-mutation hook wiring
- **Status:** TODO
- **Source:** `mcp_server/handlers/mutation-hooks.ts:22-58`
- **Issue:** All cache-clear/invalidation exceptions are swallowed with boolean fallbacks, hiding concrete failure causes during production debugging. Silent catch blocks violate the "no swallowed catches" guideline.
- **Fix:** Add warning-level logging per hook failure path in `runPostMutationHooks`.

### T-04: Add integration test for all mutation handler hook wiring
- **Priority:** P1
- **Feature:** F-01 Shared post-mutation hook wiring
- **Status:** TODO
- **Source:** `mcp_server/handlers/mutation-hooks.ts:22-58`; `feature_catalog/18--ux-hooks/01-shared-post-mutation-hook-wiring.md:73`
- **Issue:** Listed tests do not directly assert all wired paths (`save`, `update`, `delete`, `bulk-delete`, `atomic-save`) invoke post-mutation hooks. Missing `retry.vitest.ts` reference in catalog.
- **Fix:** Add one integration test that validates hook execution across all mutation handlers. Remove stale `retry.vitest.ts` entry or add the missing test file.

### T-05: Add mixed-outcome regression test for autoRepair
- **Priority:** P1
- **Feature:** F-02 Memory health autoRepair metadata
- **Status:** TODO
- **Source:** `mcp_server/tests/memory-crud-extended.vitest.ts:1283-1335`; `feature_catalog/18--ux-hooks/02-memory-health-autorepair-metadata.md:178`
- **Issue:** Catalog test table does not include the strongest auto-repair assertion. Missing `retry.vitest.ts` reference in catalog.
- **Fix:** Add a regression test for mixed repair outcomes (partial fix + persistent mismatch). Align feature catalog test list with actual auto-repair regression tests.

### T-06: Include deletion metadata in checkpoint delete success response
- **Priority:** P1
- **Feature:** F-03 Checkpoint delete confirmName safety
- **Status:** TODO
- **Source:** `mcp_server/handlers/checkpoints.ts:298-301`; `feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md:108`
- **Issue:** Success payload exposes `success` and `safetyConfirmationUsed` only, but no explicit deletion metadata (name/id/timestamp). Feature text says successful deletion reports confirmation outcome plus deletion metadata; metadata is not present.
- **Fix:** Include deletion metadata in success response (`name`, optional checkpoint id, deletion timestamp). Extend tests to assert deletion metadata contract.

### T-07: Replace wildcard exports in hooks barrel with explicit named exports
- **Priority:** P1
- **Feature:** F-05 Dedicated UX hook modules
- **Status:** TODO
- **Source:** `mcp_server/hooks/index.ts:5-7`
- **Issue:** Hook barrel uses wildcard re-exports instead of explicit named exports, violating repository standards.
- **Fix:** Convert `hooks/index.ts` to explicit named exports. Add barrel/export-surface regression test.

### T-08: Preserve diagnosable hook failure details in mutation hook runner
- **Priority:** P1
- **Feature:** F-06 Mutation hook result contract expansion
- **Status:** TODO
- **Source:** `mcp_server/handlers/mutation-hooks.ts:22-58`; `feature_catalog/18--ux-hooks/06-mutation-hook-result-contract-expansion.md:73`
- **Issue:** Hook-runner failure details are suppressed (boolean fallback only), reducing diagnosability when expanded contract fields indicate failures. Silent catches in hook runner.
- **Fix:** Log non-fatal hook exceptions with operation/context. Add handler-level assertions for all expanded fields (`latencyMs`, each cache boolean, `toolCacheInvalidated`).

### T-09: Add observable warning logs for hint-append parse failures
- **Priority:** P1
- **Feature:** F-08 Context-server success-path hint append
- **Status:** TODO
- **Source:** `mcp_server/hooks/response-hints.ts:106-108`; `feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md:346`
- **Issue:** `appendAutoSurfaceHints` catches and suppresses all parse/serialization failures, so hint-append regressions can be silent. Missing `retry.vitest.ts` reference in catalog.
- **Fix:** Emit non-fatal warning logs/metrics in the catch path. Add a regression test that verifies malformed envelope handling is observable without breaking response.

### T-10: Replace wildcard exports in hooks barrel (README alignment)
- **Priority:** P1
- **Feature:** F-12 Hooks README and export alignment
- **Status:** TODO
- **Source:** `mcp_server/hooks/index.ts:5-7`; `feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md:76`
- **Issue:** Barrel uses wildcard exports rather than explicit named exports. No test enforces README-to-barrel synchronization. Missing `retry.vitest.ts` reference.
- **Fix:** Replace wildcard exports with explicit exports. Add a lightweight doc/export alignment test. Remove stale retry test reference.

---

## P2 — WARN with Documentation/Test Gaps Only

### T-11: Update mutation response UX payload test mappings
- **Priority:** P2
- **Feature:** F-07 Mutation response UX payload exposure
- **Status:** TODO
- **Source:** `feature_catalog/18--ux-hooks/07-mutation-response-ux-payload-exposure.md:25-34`; `mcp_server/tests/memory-save-ux-regressions.vitest.ts:69-111`
- **Issue:** Feature's listed tests are mostly envelope/type tests and do not directly assert `postMutationHooks` exposure from mutation handlers. The strongest regression test is not in the feature's test table.
- **Fix:** Add explicit response-contract tests for `memory_save`, `memory_update`, `memory_delete`, and `memory_bulk_delete`. Update feature catalog test table to include UX payload regression tests.

### T-12: Add atomic duplicate no-op regression assertion
- **Priority:** P2
- **Feature:** F-09 Duplicate-save no-op feedback hardening
- **Status:** TODO
- **Source:** `mcp_server/tests/memory-save-ux-regressions.vitest.ts:69-92`; `feature_catalog/18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md:173`
- **Issue:** Coverage is strong for `memory_save` duplicate no-op, but there is no equivalent duplicate no-op assertion for atomic path. Missing `retry.vitest.ts` reference.
- **Fix:** Add atomic duplicate no-op regression assertion (no `postMutationHooks`, no false cache-clear hints). Remove stale retry test reference.

### T-13: Add partial-indexing hint branch test for atomic save
- **Priority:** P2
- **Feature:** F-10 Atomic-save parity and partial-indexing hints
- **Status:** TODO
- **Source:** `mcp_server/handlers/memory-save.ts:478-480`; `feature_catalog/18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md:153`
- **Issue:** Atomic save success hook parity is tested, but there is no direct assertion for the partial-indexing hint branch. Missing `retry.vitest.ts` reference.
- **Fix:** Add targeted test for `embeddingStatus === 'partial'` in atomic path and verify partial-indexing guidance. Remove stale retry test entry.

### T-14: Add tests section to final token metadata recomputation feature
- **Priority:** P2
- **Feature:** F-11 Final token metadata recomputation
- **Status:** TODO
- **Source:** `feature_catalog/18--ux-hooks/11-final-token-metadata-recomputation.md`; `mcp_server/tests/hooks-ux-feedback.vitest.ts:48-82`; `mcp_server/tests/context-server.vitest.ts:829-867`
- **Issue:** Feature file lists no tests despite behavior being non-trivial. Actual coverage exists in `hooks-ux-feedback.vitest.ts` and `context-server.vitest.ts`, but catalog linkage is missing.
- **Fix:** Add explicit tests section to the feature catalog entry. Link the existing token-count recomputation tests in the Source Files table.

### T-15: Add end-to-end success-envelope test to feature catalog
- **Priority:** P2
- **Feature:** F-13 End-to-end success-envelope verification
- **Status:** TODO
- **Source:** `feature_catalog/18--ux-hooks/13-end-to-end-success-envelope-verification.md:5,23-32`; `mcp_server/tests/context-server.vitest.ts:781-867`
- **Issue:** Feature text says end-to-end verification is in `tests/context-server.vitest.ts`, but the feature's own test table omits that file, so catalog metadata is out of sync.
- **Fix:** Add `mcp_server/tests/context-server.vitest.ts` to this feature's test table. Add explicit scenario mapping for the end-to-end success-envelope assertion.

### T-16: Add handler-level expanded contract assertions
- **Priority:** P2
- **Feature:** F-06 Mutation hook result contract expansion
- **Status:** TODO
- **Source:** `mcp_server/handlers/mutation-hooks.ts:22-58`; `feature_catalog/18--ux-hooks/06-mutation-hook-result-contract-expansion.md:73`
- **Issue:** Listed tests do not directly verify expanded `postMutationHooks` contract shape across all mutation handlers (save/update/delete/bulk-delete/atomic-save). Missing `retry.vitest.ts` reference.
- **Fix:** Add handler-level assertions for all expanded fields. Fix stale test reference.

### T-17: Add parse-failure telemetry test for hint append
- **Priority:** P2
- **Feature:** F-08 Context-server success-path hint append
- **Status:** TODO
- **Source:** `mcp_server/tests/context-server.vitest.ts:781-867`; `mcp_server/hooks/response-hints.ts:106-108`
- **Issue:** While success path is covered, there is no observable assertion for parse-failure telemetry/logging path.
- **Fix:** Add a regression test that verifies malformed envelope handling emits observable logs without breaking response.
