# Iteration 015: D1 Correctness Re-verification

## Focus

Re-verify prior D1 findings `F011`, `F012`, and `F013` against the current compact-helper implementation in `budget-allocator.ts`, `compact-merger.ts`, and `working-set-tracker.ts`. This pass also checks for adjacent budget-integrity defects in the same slice so the review packet reflects the current shipped behavior rather than only the earlier discovery snapshot.

## Scorecard

- Verdict: CONDITIONAL
- Re-verified findings: 3
- Status changes: 0
- New findings: 1
- Verification:
  - `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR="$PWD/.tmp/vitest-tmp" npx vitest run tests/budget-allocator.vitest.ts tests/compact-merger.vitest.ts --reporter=dot`
  - Result: PASS (2 files, 12 tests)
  - Dist-module repros reproduced the allocator ceiling, truncation/zero-budget leakage, unbudgeted `sessionState` overflow, and delayed working-set eviction.
- Confidence: High

## Re-verification Matrix

### F011 - CONFIRMED

- **Finding:** `allocateBudget()` still hard-codes a 4000-token distribution ceiling, so larger caller budgets are silently ignored.
- **Evidence:** `DEFAULT_FLOORS` still encodes a fixed 4000-token baseline (`700 + 1200 + 900 + 400 + 800`), and `allocateBudget()` still seeds `overflowPool` from that fixed `DEFAULT_FLOORS.overflow` value rather than from `totalBudget - floorTotal`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:31-38][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:52-57]
- **Evidence:** The redistribution loop still only spends reclaimed floor/overflow tokens; there is still no path that expands allocations when `totalBudget > 4000`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:75-91]
- **Executable check:** The current `dist` module still reports `totalBudget: 8000` but `totalUsed: 4000` for `allocateBudget(createDefaultSources(10000, 10000, 10000, 10000), 8000)`, confirming the API still cannot spend the extra caller budget.
- **Assessment:** No status change. The earlier wording remains accurate.
- **Severity:** P1 unchanged

### F012 - CONFIRMED

- **Finding:** `truncateToTokens()` still appends the truncation marker outside the granted budget, and `mergeCompactBrief()` still renders sections whose allocation was trimmed to zero.
- **Evidence:** `truncateToTokens()` still slices to `maxTokens * 4` characters and then unconditionally appends `\n[...truncated]`, so the suffix itself is not budgeted.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:50-55]
- **Evidence:** `mergeCompactBrief()` still renders each non-empty source section based on `input.*.trim()` alone; there is still no guard that suppresses a section when the allocation grant is `0`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:122-153]
- **Executable check:** The current `dist` merger still produces a 5-token `Active Files & Structural Context` section from a 1-token budget and still renders a zero-budget `Semantic Neighbors` section containing only the truncation marker, yielding `totalTokenEstimate: 9` for a `totalBudget` of `1`.
- **Assessment:** No status change. Both halves of the prior finding remain directly reproducible.
- **Severity:** P1 unchanged

### F013 - CONFIRMED

- **Finding:** `WorkingSetTracker` still allows the tracked-file map to grow past `maxFiles` until it exceeds `maxFiles * 2`.
- **Evidence:** `trackFile()` still delays eviction until `this.files.size > this.maxFiles * 2` rather than enforcing the configured cap immediately.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:24-47]
- **Evidence:** `evictOldest()` still trims back to `maxFiles`, which means the public cap is only restored after the delayed threshold is crossed.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:89-97]
- **Executable check:** The current `dist` tracker still reports `size: 3` after three inserts into `new WorkingSetTracker(2)`, confirming the contract mismatch remains active before the hysteresis threshold is crossed.
- **Assessment:** No status change. The earlier finding still describes the current behavior.
- **Severity:** P2 unchanged

## New Correctness Issues

### [P1] F020 - `mergeCompactBrief()` never budgets `sessionState`, so the final brief can exceed caller `totalBudget` even when source allocations stay within budget

- `mergeCompactBrief()` still computes source sizes and budget allocation from only four sources: `constitutional`, `codeGraph`, `cocoIndex`, and `triggered`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:114-120]
- The function then always appends `sessionState` directly into `sections` with its full token estimate and no truncation/allocation step; the code comment claims this comes "from overhead budget", but there is no overhead-budget variable or deduction anywhere in the function.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:144-147]
- `metadata.totalTokenEstimate` is still computed from every rendered section, so the exported result can truthfully report a total far above `allocation.totalBudget`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:163-171]
- This path is live: `compact-inject.ts` still passes `COMPACTION_TOKEN_BUDGET` into `mergeCompactBrief(...)` and returns the merged text as the compact payload.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:183-203]
- **Executable check:** The current `dist` merger still returns a `Session State / Next Steps` section with `tokenEstimate: 1000` and `totalTokenEstimate: 1000` when called with `totalBudget = 1` and only `sessionState` populated.
- **Impact:** This breaks the compact brief's exported budget contract even when `allocateBudget()` itself stays within the caller budget. A caller can receive a budget-looking allocation object and still get a merged brief that massively exceeds the requested window.
- **Fix:** Budget `sessionState` explicitly as part of the total allocation model, or reserve/subtract a tracked session-state allowance before allocating the other sources. The current comment-only "overhead budget" assumption is not enforced by code.

## Verified Healthy

- The targeted `budget-allocator` and `compact-merger` Vitest slice still passes on the current codebase, which is useful as a regression boundary check for existing happy-path behavior.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts:22-57][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:17-51]
- Those tests still do not cover >4000 caller budgets, zero-budget section suppression, unbudgeted `sessionState`, or strict `maxFiles` enforcement, so their green status does not retire the confirmed findings in this pass.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts:22-57][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:17-51]

## Summary

- `F011`: CONFIRMED
- `F012`: CONFIRMED
- `F013`: CONFIRMED
- `F020`: NEW P1
- New findings delta: `+0 P0`, `+1 P1`, `+0 P2`
- Recommended next focus: remediate the compact-helper budget contract end to end - remove the 4000 allocator ceiling, reserve truncation markers inside granted budgets, suppress zero-budget sections, budget `sessionState`, enforce `maxFiles` immediately - then rerun this D1 slice.
