# Iteration 007: D1 Correctness

## Findings

No P0 issues found.

### [P1] `allocateBudget()` hard-codes a 4000-token ceiling, so larger caller budgets are silently ignored
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:31-38`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:52-57`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:75-91`
- **Issue**: The allocator accepts a `totalBudget` parameter, but the distribution logic is still anchored to `DEFAULT_FLOORS` plus a fixed `overflow` bucket of 800 tokens. That means the function can trim budgets down when `totalBudget < 4000`, but it can never expand allocations when `totalBudget > 4000`. Callers asking for a larger compact budget therefore get a misleading `totalBudget` in the result while the live allocation remains capped at the baked-in 4000-token baseline.
- **Evidence**: `overflowPool` is initialized from `DEFAULT_FLOORS.overflow` and only grows via unused floor reclamation; there is no branch that seeds extra distributable budget from `totalBudget - 4000`. A runtime reproduction against the built module confirms the failure: `allocateBudget(createDefaultSources(10000, 10000, 10000, 10000), 8000)` returns `totalBudget: 8000` but `totalUsed: 4000`.
- **Why it matters**: Any caller that tries to raise the compaction budget above 4000 will silently drop context instead of using the available allowance. That is a correctness bug in the exported API, not just an internal accounting detail.
- **Fix**: Either derive floors/overflow from `totalBudget` or clamp/reject non-4000 budgets at the API boundary so callers cannot believe they received a larger allocation than the allocator can actually spend.

### [P1] `truncateToTokens()` can exceed the granted budget and even emit content for zero-budget sections
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:45-55`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:122-153`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:163-183`
- **Issue**: The truncation helper slices to `maxTokens * 4` characters, then appends `\n[...truncated]` without charging that suffix back to the budget. Because sections are rendered whenever the input string is non-empty, a source with `granted = 0` still produces a visible placeholder section instead of disappearing. The merger therefore breaks its own allocation contract in two ways: non-zero grants can overflow, and zero-budget grants can still leak text into the final brief.
- **Evidence**: A runtime reproduction against the built module shows both failures. With only `codeGraph` populated and `totalBudget = 1`, the allocator grants `codeGraph` exactly 1 token, but `mergeCompactBrief()` returns a section whose `tokenEstimate` is 5 (`"aaaa\n[...truncated]"`). With both `codeGraph` and `cocoIndex` populated and `totalBudget = 1`, `cocoIndex` receives `granted: 0` yet the merged brief still renders a `Semantic Neighbors` section containing `"[...truncated]"`, and the combined `totalTokenEstimate` rises to 9.
- **Why it matters**: This is the exact budget-integrity failure the compact pipeline is supposed to prevent. Tight-budget recovery prompts can overflow the target window and keep low-priority sections alive even after the allocator trimmed them to zero.
- **Fix**: Make truncation budget-aware end to end: reserve space for the truncation marker inside `maxTokens`, and skip section rendering entirely when `granted <= 0`.

### [P2] `WorkingSetTracker` does not enforce `maxFiles` until the map grows past 2x capacity
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:20-22`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:44-47`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:89-98`
- **Issue**: The class advertises a configurable `maxFiles`, but `trackFile()` only calls `evictOldest()` once `files.size > maxFiles * 2`. Until that threshold is crossed, the tracker simply keeps growing beyond the configured cap. That makes the public size/capacity contract incorrect for every caller that expects `maxFiles` to be a real upper bound rather than a delayed cleanup watermark.
- **Evidence**: A runtime reproduction against the built module shows the mismatch directly: `new WorkingSetTracker(2)` reports `sizeAfter3: 3` after tracking three files, and only shrinks back to 2 after the fifth insert crosses the `> maxFiles * 2` threshold.
- **Why it matters**: Any consumer that uses the tracker during that over-cap window will rank and serialize more roots than configured, which is especially risky in a compaction-oriented working-set helper where caps are part of the budget discipline.
- **Fix**: Enforce the configured limit immediately (`> maxFiles`) or rename/document the setting as a soft watermark if the hysteresis is intentional.

### [P2] Default indexer config claims `.zsh` is supported as `bash`, but the default scan never discovers those files
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:17-18`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:80-95`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:97-105`
- **Issue**: `detectLanguage()` maps `.zsh` files to `bash`, but `getDefaultConfig()` only includes `**/*.sh` for shell discovery. As a result, the default scan path advertises support for `.zsh` while never globbing those files into the index in the first place.
- **Evidence**: A runtime reproduction against the built modules confirms the inconsistency: `detectLanguage('test.zsh')` returns `"bash"`, but `indexFiles(getDefaultConfig(tempRoot))` over a temp directory containing only `test.zsh` indexes no files because the generated include globs omit `**/*.zsh`.
- **Why it matters**: This is a real correctness/contract gap in the default indexer surface. Users following the advertised supported-language behavior will silently miss shell files unless they override `includeGlobs` manually.
- **Fix**: Add `**/*.zsh` (and likely `**/*.bash`) to the default include globs, or stop claiming those extensions are supported in `detectLanguage()`.

## Verification

- `TMPDIR=$PWD/.tmp/vitest-tmp npx vitest run tests/compact-merger.vitest.ts tests/budget-allocator.vitest.ts tests/code-graph-indexer.vitest.ts`
- `node --input-type=module` runtime repro for `allocateBudget(createDefaultSources(...), 8000)` against `dist/lib/code-graph/budget-allocator.js`
- `node --input-type=module` runtime repro for `mergeCompactBrief(..., 1)` against `dist/lib/code-graph/compact-merger.js`
- `node --input-type=module` runtime repro for `new WorkingSetTracker(2)` against `dist/lib/code-graph/working-set-tracker.js`
- `node --input-type=module` runtime repro for `detectLanguage('test.zsh')` plus `indexFiles(getDefaultConfig(tempRoot))` against `dist/lib/code-graph/indexer-types.js` and `dist/lib/code-graph/structural-indexer.js`

## Notes

- I did not find a new off-by-one bug in the recency decay math itself; the main `WorkingSetTracker` correctness break in this slice is the capacity invariant, not the decay formula.
- I did not find a new "all sources empty" allocator failure. `allocateBudget(createDefaultSources(0, 0, 0, 0), 4000)` still returns `totalUsed = 0` as intended.

## Summary

- P0: 0 findings
- P1: 2 findings
- P2: 2 findings
- newFindingsRatio: 1.00
- Recommended next focus: either move back to D2/convergence, or if implementation starts now, backfill regression coverage for configurable total budgets, zero-budget truncation, strict working-set caps, and default shell-file discovery
