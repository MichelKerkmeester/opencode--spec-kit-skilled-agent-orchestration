## F-01: Shared post-mutation hook wiring
- **Status:** WARN
- **Code Issues:** 1. `mcp_server/handlers/mutation-hooks.ts:22-58` swallows all cache-clear/invalidation exceptions and returns boolean fallbacks, which hides concrete failure causes during production debugging.
- **Standards Violations:** 1. Silent catch blocks violate the “no swallowed catches” guideline (`mcp_server/handlers/mutation-hooks.ts:25-27,32-34,40-42,48-50,56-58`).
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. Feature catalog references `mcp_server/tests/retry.vitest.ts` (`01-shared-post-mutation-hook-wiring.md:73`), but the file is missing in repo (`glob **/retry.vitest.ts` returns no matches). 2. Listed tests do not directly assert all wired paths (`save`, `update`, `delete`, `bulk-delete`, `atomic-save`) invoke post-mutation hooks.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Add warning-level logging per hook failure path in `runPostMutationHooks`. 2. Add one integration test that validates hook execution across all mutation handlers. 3. Remove stale `retry.vitest.ts` entry or add the missing test file.

## F-02: Memory health autoRepair metadata
- **Status:** FAIL
- **Code Issues:** 1. `repair.repaired` can be set `true` by orphan-edge cleanup (`mcp_server/handlers/memory-crud-health.ts:403-405`) even after unresolved FTS mismatch was recorded (`:375-377`), overstating overall repair success.
- **Standards Violations:** NONE
- **Behavior Mismatch:** `Current Reality` says callers can inspect what changed reliably, but mixed outcomes can still report `repair.repaired = true` even when key drift remains unresolved (`mcp_server/handlers/memory-crud-health.ts:375-377,403-405`).
- **Test Gaps:** 1. Catalog lists `mcp_server/tests/retry.vitest.ts` (`02-memory-health-autorepair-metadata.md:178`), but file is missing. 2. Catalog test table does not include the strongest auto-repair assertion (`mcp_server/tests/memory-crud-extended.vitest.ts:1283-1335`), so mapped coverage is incomplete.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Track per-repair-step status and compute aggregate `repaired` only when no unresolved warnings/errors remain. 2. Add a regression test for mixed repair outcomes (partial fix + persistent mismatch). 3. Align feature catalog test list with actual auto-repair regression tests.

## F-03: Checkpoint delete confirmName safety
- **Status:** WARN
- **Code Issues:** 1. Success payload exposes `success` and `safetyConfirmationUsed` only (`mcp_server/handlers/checkpoints.ts:298-301`), but no explicit deletion metadata (for example deleted checkpoint name/id/timestamp).
- **Standards Violations:** 1. Handler-local delete args allow optional `confirmName` (`mcp_server/handlers/checkpoints.ts:47-50`) despite runtime and schema requiring it.
- **Behavior Mismatch:** Feature text says successful deletion reports confirmation outcome **plus deletion metadata**; metadata is not present in response data (`mcp_server/handlers/checkpoints.ts:298-301`).
- **Test Gaps:** 1. Tests validate confirmation and safety flag but not deletion metadata (`mcp_server/tests/handler-checkpoints.vitest.ts:313-324`). 2. Catalog references missing `mcp_server/tests/retry.vitest.ts` (`03-checkpoint-delete-confirmname-safety.md:108`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Include deletion metadata in success response (`name`, optional checkpoint id, deletion timestamp). 2. Make `CheckpointDeleteArgs.confirmName` required in handler type. 3. Extend tests to assert deletion metadata contract.

## F-04: Schema and type contract synchronization
- **Status:** FAIL
- **Code Issues:** 1. Contract desync remains: checkpoint delete handler args type keeps `confirmName` optional (`mcp_server/handlers/checkpoints.ts:47-50`) while schema/tool-type boundaries require it (`mcp_server/schemas/tool-input-schemas.ts:230-233,368`; `mcp_server/tool-schemas.ts:290-304`; `mcp_server/tools/types.ts:193-196`).
- **Standards Violations:** 1. Type contract is not uniformly strict across layers (handler vs schema/tool types).
- **Behavior Mismatch:** Feature claims synchronized required `confirmName` across all layers, but handler type still permits omitted confirmation at compile time.
- **Test Gaps:** `mcp_server/tests/tool-input-schema.vitest.ts:181-191` verifies schema requirement only; there is no type-level/handler-contract guard preventing future handler-type drift.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Change handler `CheckpointDeleteArgs.confirmName` to required. 2. Add a type-contract regression test (or source assertion) covering handler + tool-type parity.

## F-05: Dedicated UX hook modules
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. Hook barrel uses wildcard re-exports (`mcp_server/hooks/index.ts:5-7`) instead of explicit named exports.
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. No focused test verifies hooks barrel exports exactly match documented hook surface in README. 2. Catalog references missing `mcp_server/tests/retry.vitest.ts` (`05-dedicated-ux-hook-modules.md:76`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Convert `hooks/index.ts` to explicit named exports. 2. Add barrel/export-surface regression test. 3. Remove stale retry test reference from catalog.

## F-06: Mutation hook result contract expansion
- **Status:** WARN
- **Code Issues:** 1. Hook-runner failure details are suppressed (boolean fallback only), reducing diagnosability when expanded contract fields indicate failures (`mcp_server/handlers/mutation-hooks.ts:22-58`).
- **Standards Violations:** 1. Silent catches in hook runner (`mcp_server/handlers/mutation-hooks.ts:25-27,32-34,40-42,48-50,56-58`).
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. Listed tests do not directly verify expanded `postMutationHooks` contract shape across all mutation handlers (save/update/delete/bulk-delete/atomic-save). 2. Catalog references missing `mcp_server/tests/retry.vitest.ts` (`06-mutation-hook-result-contract-expansion.md:73`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Add handler-level assertions for all expanded fields (`latencyMs`, each cache boolean, `toolCacheInvalidated`). 2. Log non-fatal hook exceptions with operation/context. 3. Fix stale test reference.

## F-07: Mutation response UX payload exposure
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. Feature’s listed tests (`07-mutation-response-ux-payload-exposure.md:25-34`) are mostly envelope/type tests and do not directly assert `postMutationHooks` exposure from mutation handlers. 2. The strongest regression (`mcp_server/tests/memory-save-ux-regressions.vitest.ts:69-111`) is not in this feature’s test table.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Add explicit response-contract tests for `memory_save`, `memory_update`, `memory_delete`, and `memory_bulk_delete` success responses. 2. Update feature catalog test table to include UX payload regression tests.

## F-08: Context-server success-path hint append
- **Status:** WARN
- **Code Issues:** 1. `appendAutoSurfaceHints` catches and suppresses all parse/serialization failures (`mcp_server/hooks/response-hints.ts:106-108`), so hint-append regressions can be silent.
- **Standards Violations:** 1. Silent catch in hook module (`mcp_server/hooks/response-hints.ts:106-108`).
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. Catalog references missing `mcp_server/tests/retry.vitest.ts` (`08-context-server-success-hint-append.md:346`). 2. While success path is covered (`mcp_server/tests/context-server.vitest.ts:781-867`), there is no observable assertion for parse-failure telemetry/logging path.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Emit non-fatal warning logs/metrics in the catch path. 2. Add a regression test that verifies malformed envelope handling is observable (without breaking response).

## F-09: Duplicate-save no-op feedback hardening
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. Catalog references missing `mcp_server/tests/retry.vitest.ts` (`09-duplicate-save-no-op-feedback-hardening.md:173`). 2. Coverage is strong for `memory_save` duplicate no-op (`mcp_server/tests/memory-save-ux-regressions.vitest.ts:69-92`), but there is no equivalent duplicate no-op assertion for atomic path.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Add atomic duplicate no-op regression assertion (no `postMutationHooks`, no false cache-clear hints). 2. Remove stale retry test reference.

## F-10: Atomic-save parity and partial-indexing hints
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. Atomic save success hook parity is tested (`mcp_server/tests/memory-save-ux-regressions.vitest.ts:94-111`), but there is no direct assertion for the partial-indexing hint branch (`mcp_server/handlers/memory-save.ts:478-480`). 2. Catalog references missing `mcp_server/tests/retry.vitest.ts` (`10-atomic-save-parity-and-partial-indexing-hints.md:153`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Add targeted test for `embeddingStatus === 'partial'` in atomic path and verify partial-indexing guidance. 2. Remove stale retry test entry from catalog.

## F-11: Final token metadata recomputation
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. Feature file lists no tests, despite behavior being non-trivial (`11-final-token-metadata-recomputation.md` has no `### Tests` section). 2. Actual coverage exists in `mcp_server/tests/hooks-ux-feedback.vitest.ts:48-82` and `mcp_server/tests/context-server.vitest.ts:829-867`, but catalog linkage is missing.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Add explicit tests section to the feature catalog entry. 2. Link the existing token-count recomputation tests in the Source Files table.

## F-12: Hooks README and export alignment
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. Barrel uses wildcard exports (`mcp_server/hooks/index.ts:5-7`) rather than explicit named exports.
- **Behavior Mismatch:** NONE (README modules and barrel targets are aligned: `mcp_server/hooks/README.md:29-31`, `mcp_server/hooks/index.ts:5-7`).
- **Test Gaps:** 1. No test enforces README-to-barrel synchronization. 2. Catalog references missing `mcp_server/tests/retry.vitest.ts` (`12-hooks-readme-and-export-alignment.md:76`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Replace wildcard exports with explicit exports. 2. Add a lightweight doc/export alignment test. 3. Remove stale retry test reference.

## F-13: End-to-end success-envelope verification
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** Feature text says end-to-end verification is in `tests/context-server.vitest.ts` (`13-end-to-end-success-envelope-verification.md:5`), but the feature’s own test table omits that file (`13-end-to-end-success-envelope-verification.md:23-32`), so catalog metadata is out of sync.
- **Test Gaps:** Listed tests in this feature do not directly assert the success-path hint append flow; the real assertion is in `mcp_server/tests/context-server.vitest.ts:781-867` and is currently not catalog-linked.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Add `mcp_server/tests/context-server.vitest.ts` to this feature’s test table. 2. Add/annotate explicit scenario mapping for the end-to-end success-envelope assertion.
