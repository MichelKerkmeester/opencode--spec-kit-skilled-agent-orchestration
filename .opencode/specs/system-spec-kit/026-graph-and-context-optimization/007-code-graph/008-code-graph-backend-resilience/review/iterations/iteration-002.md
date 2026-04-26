# Iteration 002

**Run Date:** 2026-04-26
**Dimension:** correctness
**Focus:** Hash predicate tests + scan propagation
**Verdict Snapshot:** PASS

## Summary

- REQ-015's three hash-predicate scenarios are covered in `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts`: same-mtime/different-hash at `:107-137`, missing-hash fallback at `:139-164`, and unchanged-content freshness at `:166-191`. Those tests call both `isFileStale(filePath)` and `ensureFreshFiles([filePath])`, so the lazy `getCurrentFileContentHash()` path is exercised in both the single-file and batch helpers.
- The scan handler's propagation is correct in the implementation: `handleCodeGraphScan()` forwards `{ currentContentHash: result.contentHash }` on the post-parse stale guard at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:239-243`, and `result.contentHash` is effectively always a non-empty string because `ParseResult.contentHash` is required at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:74-83` and every parser path populates it at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:744-787`, `:1140-1161`, and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:638-709`.
- No P0 or P1 correctness defects were found in the landed T08 implementation. The remaining issues are test-coverage gaps: the `options.currentContentHash` short-circuit path is still unpinned, and the pre-existing crash-recovery freshness test still passes under the old mtime-only predicate.

## Findings

### P0

- None.

### P1

- None.

### P2

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:242-296` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:239-243` — The scan tests still do not assert that `handleCodeGraphScan()` passes `{ currentContentHash: result.contentHash }` into `graphDb.isFileStale(...)`. The implementation path is currently correct, but CI would still stay green if a future refactor dropped the option and silently fell back to `getCurrentFileContentHash()`, reintroducing the extra file reread that T08 was meant to avoid. Fix: add an incremental-scan assertion such as `expect(mocks.isFileStaleMock).toHaveBeenCalledWith('/workspace/current.ts', { currentContentHash: 'hash-1' })`, while keeping the pre-parse no-op case asserting the guard is not called.
- `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:906-947` — The "stores file mtimes and reports stale files via mtime checks" regression still passes under the pre-T08 mtime-only predicate. Using `generateContentHash(fileContent)` at `:917` fixed the immediate false-failure after T08, but the assertions still only cover unchanged-content freshness (`isFileStale(...) === false` before any edit) and explicit mtime drift (`utimesSync(...)` at `:940-943`). A stale-check implementation that ignored `content_hash` entirely would still satisfy both assertions, so this test is valid as a general freshness/mtime regression but not as proof of the new hash-aware branch. Fix: either rename/scope it as an mtime regression only, or add a same-mtime/content-changed step that preserves `mtimeMs` and expects stale.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/spec.md:94-95,108,117-119,202`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/tasks.md:76,111`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/checklist.md:77`
- `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:906-947`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:101-191`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:111-176,242-329`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:214-250`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:125-130,414-428,437-474`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:74-83,111-114`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:737-791,1140-1161`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:638-709`

## Convergence Signals

- REQ-015 coverage is present for the lazy hash-fallback predicate paths in both `isFileStale()` and `ensureFreshFiles()`.
- The post-parse propagation path is implemented correctly and, under the current `ParseResult` contract, does not naturally pass `undefined`; the `truthy` guard in `scan.ts` is redundant rather than broken.
- The remaining gap is evidentiary, not behavioral: no test pins the `options.currentContentHash` short-circuit, and the crash-recovery regression still cannot distinguish T08 from the old mtime-only semantics.
- Targeted verification passed: `npx vitest run tests/crash-recovery.vitest.ts code_graph/tests/code-graph-indexer.vitest.ts code_graph/tests/code-graph-scan.vitest.ts --reporter=dot` succeeded with 3 files / 71 tests passing.
