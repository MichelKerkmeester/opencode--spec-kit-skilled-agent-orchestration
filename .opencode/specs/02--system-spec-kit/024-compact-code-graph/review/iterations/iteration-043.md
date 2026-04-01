# Review Iteration 043
## Dimension: D1 Correctness
## Focus: Phase 019 auto-trigger (ensure-ready.ts, handler changes in context.ts/query.ts/status.ts)

## Findings

### [P2] F048 - ensureCodeGraphReady selective reindex overwrites includeGlobs instead of scoping to stale files
- File: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:176
- Evidence: `config.includeGlobs = state.staleFiles.map(f => f)` replaces the entire includeGlobs array with raw file paths. But `indexFiles()` expects glob patterns, not absolute file paths. If staleFiles contains paths like `/Users/foo/project/src/bar.ts`, the glob matcher may not match them correctly depending on whether indexFiles treats them as literal paths or as glob patterns. Additionally, `getDefaultConfig(rootDir)` sets `excludeGlobs` which may exclude the very stale files we're trying to reindex.
- Fix: Verify that indexFiles() correctly handles literal file paths in includeGlobs. If it uses glob matching, convert stale file paths to relative paths from rootDir. Also ensure excludeGlobs doesn't filter out stale files.

### [P2] F049 - ensureCodeGraphReady timeout via AbortController does not actually cancel indexFiles
- File: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:108-139
- Evidence: `indexWithTimeout` uses `Promise.race` with an abort signal, but `indexFiles()` is not passed the AbortController's signal, so the indexing continues running in the background even after the timeout rejects. The `clearTimeout(timer)` in finally only clears the timer, not the ongoing indexFiles() operation. This means after a timeout, there's a fire-and-forget indexing operation that continues consuming resources and may produce partial results that never get persisted (since the finally block only clears the timer, not the indexing).
- Fix: Pass the AbortController signal to indexFiles() so it can check for cancellation between files. Alternatively, accept the fire-and-forget behavior but document it.

## Verified Correct
- detectState() correctly checks three conditions: empty graph, git HEAD change, file mtime drift
- SELECTIVE_REINDEX_THRESHOLD (50) appropriately escalates to full scan for many stale files
- ensureCodeGraphReady returns ReadyResult with action + reason (non-blocking on failure)
- getCurrentGitHead uses 5s timeout and stdio piping to avoid hanging on git
- getGraphFreshness is non-mutating (does not trigger reindex) for status display
- context.ts handler: calls ensureCodeGraphReady(process.cwd()) with try/catch, non-blocking
- query.ts handler: same pattern, non-blocking auto-trigger before query
- status.ts handler: reports freshness via getGraphFreshness() without triggering reindex
- AUTO_INDEX_TIMEOUT_MS (10s) is a reasonable guard for auto-indexing

## Iteration Summary
- New findings: 2 (P2)
- Items verified correct: 9
- Reviewer: Claude Opus 4.6 (1M context)
