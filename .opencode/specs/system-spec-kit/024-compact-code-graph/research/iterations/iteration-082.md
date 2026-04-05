# Iteration 82: Verification of Performance Analysis from Iteration 070

## Focus
Verify the five performance claims recorded in iteration 070 against the **current** timing code in:

- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts`

Cross-check only enough adjacent code (`code-graph-context.ts`, `code-graph-db.ts`, `hook-state.ts`) to determine whether the prior latency numbers are actually measured in the current implementation or were architectural inference.

## Findings

### 1. Claim: hook timeout is 1800ms, current usage is ~10-50ms, headroom is ~1700ms
**Status: MODIFIED.**

The `1800ms` constant is still real: `HOOK_TIMEOUT_MS` remains `1800` in `shared.ts`. However, the current PreCompact hook does **not** enforce that timeout across the full hook pipeline. In `compact-inject.ts`, `withTimeout(HOOK_TIMEOUT_MS)` wraps only `parseHookStdin()`. After stdin parsing completes, the rest of the work runs outside that timeout wrapper:

- `tailFile()` reads the transcript synchronously via `readFileSync`
- `buildMergedContext()` extracts paths/topics/attention signals
- `mergeCompactBrief()` is timed with `performance.now()`
- `truncateToTokenBudget()` truncates the final payload
- `updateState()` writes hook state to disk

So iteration 070's statement that the `1800ms` budget covers the **entire** hook execution is no longer precise for current code. Also, the current source does **not** measure end-to-end hook time, so the "~10-50ms current usage" and "~1700ms headroom" figures are **not directly verifiable from the present timing code**.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:5-6]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:205-241]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:79-95]

### 2. Claim: SQLite 1-hop neighborhood costs ~1-9ms
**Status: NOT DIRECTLY VERIFIABLE FROM CURRENT TIMING CODE.**

The current `compact-inject.ts` hook does **not** call the code graph database at all. It imports only shared hook utilities, hook-state helpers, and `mergeCompactBrief()`. No SQLite access occurs on the live PreCompact hook path.

The separate code graph path still exists in `code-graph-context.ts`: `expandAnchor()` performs 1-hop graph expansion via `queryEdgesFrom()` / `queryEdgesTo()` across `CALLS`, `IMPORTS`, and `CONTAINS`, and it keeps a **400ms default latency budget** for that expansion path. The DB schema still has the expected supporting indexes, and the query helpers still issue indexed edge lookups plus per-edge node lookups. But there is **no code-level timing instrumentation** here that proves the prior `~1-9ms` figure.

So the low-latency conclusion remains architecturally plausible, but the specific `1-9ms` number is currently an **inference**, not a live measured value in the checked source.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:10-18]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:179-249]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:18-68]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:204-238]

### 3. Claim: token estimation uses `Math.ceil(text.length / 4)` with ~15-25% error margin
**Status: PARTIALLY VERIFIED.**

The heuristic itself is fully verified. `shared.ts` uses:

```ts
const estimatedTokens = Math.ceil(text.length / 4);
```

and `compact-merger.ts` uses:

```ts
return Math.ceil(text.length / 4);
```

So iteration 070 correctly identified the current token-estimation formula.

What is **not** verified by current code is the "~15-25% error margin." Neither file documents, measures, nor tests that range. The code confirms the heuristic, but the accuracy band remains an external inference rather than something encoded in the implementation.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:83-89]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:45-55]

### 4. Claim: CocoIndex costs ~100-500ms and cannot be used in the hook path
**Status: MODIFIED.**

The current PreCompact hook does **not** make a CocoIndex call. Instead, when active files are found, it places a **literal hint string** into the `cocoIndex` field:

`Use \`mcp__cocoindex_code__search\` to find semantic neighbors of active files listed above.`

That string is then passed into `mergeCompactBrief()` as one of the merge inputs. In other words, the current hook path does not perform a live CocoIndex MCP roundtrip; it merely injects a post-recovery suggestion.

This supports the practical conclusion that the current hook path cannot rely on live CocoIndex results. But the numeric `~100-500ms` roundtrip estimate is **not verifiable from current timing code**, because no such request is made here.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:152-155]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:183-189]

### 5. Claim: full hook-path pipeline is ~11-74ms (regex) or ~11-209ms (tree-sitter)
**Status: FALSE AS A DESCRIPTION OF THE CURRENT HOOK PATH.**

The current PreCompact hook path is much narrower than the pipeline described in iteration 070. Today it does **not** perform:

- code graph freshness checks
- SQLite neighborhood expansion
- stale-file reindex
- tree-sitter parsing
- live CocoIndex search

The only explicit timing in `compact-inject.ts` is around `mergeCompactBrief()` itself. And inside that merger, `budget-allocator.ts` has **no timing instrumentation at all**; it is just a small fixed-size allocation routine over four named sources plus overflow redistribution.

That means the earlier `~11-74ms` / `~11-209ms` numbers should now be treated as **future-state architecture estimates**, not verified measurements of the live hook implementation.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:191-202]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:107-184]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:52-115]

### 6. Claim: budget allocation timing was part of the verified latency picture
**Status: NOT TIMED IN CURRENT CODE.**

The current `budget-allocator.ts` does not use `performance.now()` or any other timing hook. It performs:

1. a floor-assignment pass over `sources`
2. an overflow redistribution loop over static `PRIORITY_ORDER`
3. an optional reverse-priority trim pass

Because the current implementation uses four default sources, this routine is bounded and likely very cheap, but the repository does **not** currently record any measured timing for it. So any precise budget-allocation latency claim remains inferred rather than instrumented.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:31-42]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:52-115]

## Synthesis

Iteration 070 mixed together three different things:

1. **Current code facts** that still hold
2. **Reasonable architectural latency estimates**
3. **A future richer hook pipeline** that is not what `compact-inject.ts` currently executes

What remains directly verified today:

- `HOOK_TIMEOUT_MS` is still `1800`
- token estimation still uses `Math.ceil(text.length / 4)`
- the PreCompact hook still times `mergeCompactBrief()` with `performance.now()`

What is **not** directly verified by present code:

- end-to-end current hook runtime (`~10-50ms`)
- SQLite 1-hop latency (`~1-9ms`)
- CocoIndex roundtrip (`~100-500ms`)
- full hook-path totals (`~11-74ms` / `~11-209ms`)
- token-estimation error margin (`~15-25%`)

The biggest correction is conceptual: **the current PreCompact hook is still a lightweight transcript-analysis + merge + cache-write path, not the fully enriched graph/CocoIndex pipeline described in iteration 070.**

## Ruled Out

- Treating the `1800ms` timeout as an end-to-end guard on the entire live PreCompact pipeline
- Treating the prior SQLite, CocoIndex, or tree-sitter latency numbers as currently instrumented facts
- Treating the current hook's `cocoIndex` input as a live MCP search result rather than a literal advisory string

## Dead Ends

None. The checked files were sufficient to verify which claims are direct code facts and which remain design-level estimates.

## Sources Consulted

- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-070.md`

## Assessment

- New information ratio: 0.68
- Summary: Iteration 070 still correctly captured several constants and heuristics, but it overstated how much of the proposed enriched pipeline is actually present on the live PreCompact hook path. Most of the specific latency ranges are not currently instrumented in code and should be treated as estimates rather than verified measurements.

## Reflection

- What worked and why: Reading the current hook files together with the merger and allocator made the scope mismatch obvious. The key clue was that `withTimeout()` wraps only `parseHookStdin()`, while `performance.now()` wraps only `mergeCompactBrief()`, leaving no end-to-end timing for the full hook body.
- What did not work and why: Iteration 070's summary compressed present implementation and future design into one latency narrative, which made several estimates sound like measured facts.
- What I would do differently: If this performance story needs to become authoritative, add explicit end-to-end timing around the entire PreCompact `main()` path and separate instrumentation around transcript read, merge, and state write so future research can cite measurements rather than inference.

## Recommended Next Focus

Continue Segment 7 verification by checking whether other "performance-sensitive" research claims in Segment 6 likewise describe current implementation, future design, or a mixture of both.
