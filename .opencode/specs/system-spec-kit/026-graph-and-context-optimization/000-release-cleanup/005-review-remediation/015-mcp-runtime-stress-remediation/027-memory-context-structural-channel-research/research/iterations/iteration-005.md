# Iteration 005 - Synthesis and Planning Packet

## Focus

Synthesize RQ1, RQ2, and RQ3 into implementation guidance. This follows the strategy's iteration 5 focus: "Synthesis + Planning Packet for implementation phase."

## Sources Read

- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/027-memory-context-structural-channel-research/research/iterations/iteration-001.md:1`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/027-memory-context-structural-channel-research/research/iterations/iteration-002.md:1`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/027-memory-context-structural-channel-research/research/iterations/iteration-003.md:1`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/027-memory-context-structural-channel-research/research/iterations/iteration-004.md:1`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1408-1478`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1639-1797`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1145-1497`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:1072-1106`
- `.opencode/skill/system-spec-kit/mcp_server/lib/query/query-plan.ts:38-47`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:29-48`

## Findings

### P1 - Top implementation path is split-payload structural routing inside `memory_context`

The existing handler already classifies structural/hybrid prompts and gathers graph context metadata (`memory-context.ts:1408-1478`), but the final strategy still executes memory modes (`memory-context.ts:1639-1645`). The safest implementation path is to add an operation planner and a split structural payload while leaving document `results` intact. This uses the formatter's safe extra-data merge behavior (`search-results.ts:1072-1106`) and avoids flattening code graph nodes/edges into document rows (`query.ts:1145-1497`).

### P1 - Implementation should centralize structural signals before adding routing power

Iteration 001 found duplicated advisor, memory_context, and backend classifier rule sets. Because routing will become actionable, rule drift becomes higher risk than it is today. The implementation phase should promote `query-intent-classifier.ts` into the shared source for structural/semantic/hybrid scoring, then layer a separate operation planner on top.

### P1 - Envelope work is a narrow but required contract update

`QueryPlan` has the right fields for selected/skipped channels and reasons (`query-plan.ts:38-47`), but the current router channel vocabulary makes `graph` ambiguous (`query-router.ts:29-48`). Implementation should emit `code_graph_query` explicitly in the `memory_context` envelope when the structural backend is selected, and should mirror operation, subject, confidence, and fallback in `data.structural.route`.

### P2 - Caching and token budgets are secondary acceptance gates

The main contract can ship without redesigning cache infrastructure, but structural payloads must not bypass result truncation or mix stale graph data with fresh memory data. This is a secondary gate because the evidence points to response and envelope contracts as the primary risk.

## New Info Ratio

0.16. This iteration mainly integrated prior findings into a plan. It remained above the 0.10 early-stop threshold, so the loop completed all five iterations.

## Open Questions Surfaced

- Exact field name: `data.structural` versus `data.structuralResults`.
- Exact confidence threshold for operation planning.
- Whether structural-only mode should suppress semantic `memory_search` or include semantic fallback hints.

## Convergence Signal

Converged. Stop reason: maxIterationsReached. No early stop was triggered because the last two new-info ratios were 0.28 and 0.16, both above 0.10.

