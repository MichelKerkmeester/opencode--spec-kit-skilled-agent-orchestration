# Iteration 76: Verification of Q13 Core Findings

## Focus
Verify the current implementation against the four Q13 core findings previously reported in iterations 056 and 060:
1. `endLine` handling in `structural-indexer.ts`
2. Missing `EdgeType` values
3. Ghost `SymbolKind` values
4. Budget allocator overflow-pool improvement proposals

## Findings

### Claim 1 — endLine bug in structural-indexer.ts, breaking CALLS edge detection
**Status: MODIFIED**

The underlying bug is still present. Every parser in `structural-indexer.ts` still assigns `endLine: lineNum`, so all captures remain single-line ranges in JavaScript/TypeScript, Python, and Bash parsers. `capturesToNodes()` still hashes only `slice(c.startLine - 1, c.endLine)`, and `extractEdges()` still scans `contentLines.slice(caller.startLine - 1, caller.endLine)` for call sites. That means multi-line function and method bodies are still invisible to `CALLS` extraction.

The wording from prior research needs one refinement: `CALLS` edge detection is not literally zeroed out in all cases. Same-line definitions such as `function foo() { return bar(); }` can still be detected because the declaration line is scanned. So the strong version of the claim ("breaking CALLS edge detection") is directionally right but slightly overstated. The precise current state is: **the bug still exists unchanged and severely degrades CALLS extraction for normal multi-line bodies**.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:30-169]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:171-191]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:282-313]

### Claim 2 — three missing edge types: DECORATES, OVERRIDES, TYPE_OF
**Status: VERIFIED**

`EdgeType` still defines only:
`CONTAINS`, `CALLS`, `IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, and `TESTED_BY`.

There is still no `DECORATES`, `OVERRIDES`, or `TYPE_OF` in `indexer-types.ts`, and no extraction logic in `structural-indexer.ts` that would emit those relationships. This part of the earlier research remains fully accurate.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:12-15]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:29-169]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:194-343]

### Claim 3 — three ghost SymbolKinds: variable, module, parameter
**Status: VERIFIED**

`SymbolKind` still declares `variable`, `module`, and `parameter`. However, the current parser logic only emits `function`, `class`, `interface`, `type_alias`, `enum`, `import`, `export`, and `method`. There is still no extraction path that produces nodes of kind `variable`, `module`, or `parameter`.

So these remain "ghost" kinds: the type system advertises them, but the extractor does not populate them.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:7-10]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:29-169]

### Claim 4 — five budget allocator improvements proposed
**Status: VERIFIED**

The current `budget-allocator.ts` still matches the limitations identified in iteration 060. None of the five proposed improvements appear to have been implemented:

1. **Intent-aware priority order** — still absent; `PRIORITY_ORDER` is static.
2. **Proportional overflow distribution** — still absent; overflow is redistributed greedily in priority order.
3. **Minimum-floor trim protection** — still absent; reverse-priority trim can reduce any allocation down to zero.
4. **Telemetry/metrics** — still absent; `AllocationResult` exposes only `totalBudget`, `totalUsed`, `overflow`, and `allocations`.
5. **Dynamic source registry** — still absent; `createDefaultSources()` still hardcodes exactly four named sources.

This means the prior improvement list is still current and still unimplemented in the checked file.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:24-29]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:31-42]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:52-115]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:118-130]

## Sources Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-056.md`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-060.md`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/deep-research-strategy.md`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/deep-research-state.jsonl`

## Assessment
- `newInfoRatio`: 0.18
- Summary: No material implementation changes were found in the three reviewed code files. Three prior claims remain fully correct, and one claim (the CALLS impact statement) remains correct in substance but benefits from narrower wording.

## Reflection
The earlier Q13 research has held up well. The only substantive adjustment from this verification pass is precision: the `endLine` bug still cripples normal multi-line call extraction, but it does not eliminate every possible `CALLS` edge because same-line bodies still get scanned. Overall, this verification suggests the segment 6 findings are still a reliable basis for prioritization.
