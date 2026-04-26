# Iteration 001

**Run Date:** 2026-04-26
**Dimension:** correctness
**Focus:** Hash predicate logic
**Verdict Snapshot:** PASS

## Summary

- `isFileStale()` and `ensureFreshFiles()` match the 007 iter-008 design on the reviewed branches: mtime mismatch short-circuits to stale, missing rows/files/read failures stale conservatively, empty-string / null stored hashes stale for backfill, and same-mtime comparisons hash UTF-8 file content through the same `generateContentHash()` helper used during parse.
- No P0 or P1 correctness defects were found in the landed T08 predicate logic.
- One P2 remains: the scan-handler tests do not pin the `currentContentHash` propagation that T08 added for the post-parse stale guard.

## Findings

### P0

- None.

### P1

- None.

### P2

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:242-289` — The incremental scan tests exercise the post-parse stale guard, but they never assert that `handleCodeGraphScan()` forwards `result.contentHash` into `graphDb.isFileStale(...)`. The optimization added at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:240-243` is therefore unpinned by tests, so a future refactor could silently drop hash propagation or reintroduce an extra file reread without failing CI. Fix: add an assertion in an incremental-scan test that `isFileStaleMock` is called with `('/workspace/current.ts', { currentContentHash: 'hash-1' })`, while keeping the no-op pre-parse case asserting that the guard is not called at all.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/spec.md:72-95,202`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/plan.md:89-125`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-008.md:1-260`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:7-10,117-130,413-474`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:236-243`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:112-114`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1140-1152,1902-1918`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:101-188`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:242-327`
- `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:906-947`

## Convergence Signals

- The predicate implementation is aligned with the 007 iter-008 patch surface for all reviewed edge cases.
- No ENOENT/read-error freshness bug was found; both single-file and batch helpers default to stale on stat/read failure.
- No encoding mismatch was found; both the scan path and live hash fallback feed UTF-8 strings into `generateContentHash()`.
- One documentation drift is visible: 007 iter-008 says missing stored hashes should stale for backfill, while 008 `spec.md` later says null hashes fall back to mtime-only. The code follows the research design and the tests reinforce that behavior.
