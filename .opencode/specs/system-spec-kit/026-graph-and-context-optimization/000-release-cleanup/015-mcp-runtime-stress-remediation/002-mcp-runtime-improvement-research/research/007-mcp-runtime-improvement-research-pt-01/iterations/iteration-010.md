# Iteration 010 - Q5 memory_context truncation closure

## Focus

Q5: close the `memory_context` truncation question by reconciling the prior Iteration 002/005 findings with current source. The goal was not to re-open Q1 or modify runtime code; it was to document the canonical wrapper fix-and-verify protocol for the `count:0,results:[]` symptom.

## Actions Taken

1. Read the active deep-research state log and confirmed Q5 already had partial findings from Iterations 002 and 005.
2. Inspected the current `memory_context` strategy path, mode budgets, wrapper token enforcement, and dispatch-level budget decorator.
3. Checked the original 005 REQ-002 acceptance criterion for the exact 2 percent budget reproduction.
4. Reviewed current regression tests that exercise `enforceTokenBudget()` and identified the remaining payload invariant gap.

## Findings

### 1. The 2 percent symptom is post-fallback telemetry, not an under-budget truncation decision

The 005 bug report records `memory_context({input:"Semantic Search", mode:"auto"})` returning `actualTokens:71` against `budgetTokens:3000` while the nested payload contained `{"count":0,"results":[]}` [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs/spec.md:114`]. Current `enforceTokenBudget()` first serializes the full strategy result and returns unchanged when `actualTokens <= budgetTokens` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:447`]. It only enters truncation when the pre-enforcement wrapper is already over budget [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:451`].

The confusing 2 percent number is produced later: fallback enforcement reports `fallbackTokens = estimateTokens(JSON.stringify(fallbackResult))` as `actualTokens` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:810`]. If the fallback result is tiny, telemetry can show a tiny token count even though the original wrapper overflowed.

### 2. The current source contains the survivor-preservation repair, but empty fallback still exists

The repair claimed for 005 is present in source. `preservedAfterStructural` snapshots survivors before fallback [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:691`], the fallback builder tries preserved candidates before empty candidates [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:500`], and the final `returnedResultCount` is re-derived from the emitted fallback payload [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:812`].

The residual risk is explicit: the fallback ladder still contains empty `count:0, results:[]` candidates [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:551`] and a final unconditional empty payload [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:607`]. That may be necessary for impossible budgets, but it should be treated as a named degradation, not a normal successful truncation.

### 3. Outer dispatch enforcement is a secondary metadata risk, not the nested-zero root

The `memory_context` handler enforces a mode budget first: quick 800, deep 3500, focused 3000, resume 2000 [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:844`]. The server then enforces the generic L1 budget on the final envelope [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1115`]. That pass only pops `envelope.data.results` when it is an array [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1146`].

For `memory_context`, the actual search hits are nested inside `data.content[0].text`, because deep and focused strategies delegate to `handleMemorySearch()` and spread the MCP response into the wrapper [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:922`]. Therefore the dispatch pass can add misleading envelope metadata or warnings, but the observed nested `data.content[0].text = {"count":0,"results":[]}` symptom originates in `handlers/memory-context.ts`.

### 4. Current tests cover survivor preservation, but not the exact metadata/payload invariant everywhere

The newer token-budget tests assert that a large result keeps at least one result and stays within budget [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:73`]. They also parse the single oversized-result payload and assert `count === 1` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:151`].

The older `memory-context.vitest.ts` coverage is weaker on the exact historical failure. T203 checks `returnedResultCount` but does not parse the final nested payload [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:890`]. T206 says a zero budget "can't truncate below 1", but only asserts `actualTokens > 0` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:956`]. Since the live bug was a mismatch between metadata and nested payload, the invariant must parse the final emitted `content[0].text` and compare `meta.tokenBudgetEnforcement.returnedResultCount` to `data.results.length`.

## Questions Answered

Q5 is answered. The wrapper dropped to zero because the nested `memory_context` fallback path historically zero-filled after the full outer strategy result exceeded budget, then reported the post-fallback token size as `actualTokens`. Direct `memory_search` returned hits because it bypassed the L1 wrapper and its nested fallback ladder.

The canonical fix-and-verify protocol:

1. Preserve at least one survivor as metadata-only before any empty fallback.
2. Add `preEnforcementTokens` and `returnedTokens`; do not leave post-fallback size as the only `actualTokens` signal.
3. Allow `count:0,results:[]` only with an explicit `droppedAllResultsReason` such as `impossible_budget`.
4. Re-parse the final emitted nested payload after all handler and dispatch decoration, and assert `returnedResultCount === data.results.length`.
5. Rebuild `dist/`, restart the MCP daemon, and probe the live daemon, not only TypeScript source or unit tests.

## Questions Remaining

- Q4: weak retrieval hallucination guardrails.
- Q6: empty/stale code graph recovery.
- Q7: supersedes-heavy causal-edge growth.

Q2, Q3, Q5, and Q8 now have source-backed recommendations in the iteration set. Q1 was already answered in Iteration 001 and was not re-investigated.

## Next Focus

Finalize synthesis from the answered set, or use the next pass on Q4 if one more targeted iteration is allowed.
