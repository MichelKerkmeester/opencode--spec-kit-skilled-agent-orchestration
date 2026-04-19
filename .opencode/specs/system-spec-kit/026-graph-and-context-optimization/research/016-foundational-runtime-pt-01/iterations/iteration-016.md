# Iteration 16 — Domain 1: Silent Fail-Open Patterns (6/10)

## Investigation Thread
I re-ran the five requested runtime seams against Iterations 001-015 and the Phase 015 review, but only kept caller-visible fail-open behavior that had not already been written down. This pass focused on contract bypasses: unsupported query operations and malformed vector-search rows that the runtime normalizes into success-shaped outputs instead of explicit rejection.

## Findings

### Finding R16-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `417-436, 547-548`
- **Severity:** P1
- **Description:** Trigger: a caller sends `includeTransitive: true` with an unsupported `operation` string that still resolves a subject. Caller perception: invalid operations should be rejected with the same `Unknown operation` error used by the one-hop path. Reality: the transitive branch runs before the switch-level validation, derives direction from `operation.endsWith('from')`, defaults the edge type to `CALLS` when none is recognized, and returns `status: "ok"` with a synthetic traversal instead of surfacing invalid input.
- **Evidence:** The transitive branch executes immediately after subject resolution and returns a success payload without checking `operation` against the allowed set (`code-graph/query.ts:417-436`). The only explicit invalid-operation guard lives later in the one-hop switch default (`code-graph/query.ts:547-548`), so it is unreachable whenever `includeTransitive` is truthy. Direct coverage only exercises a valid transitive `calls_from` request and never probes an unsupported operation under `includeTransitive` (`mcp_server/tests/code-graph-query-handler.vitest.ts:87-107`).
- **Downstream Impact:** MCP clients, agents, or stale callers can get a plausible-looking transitive graph answer for an operation the API does not support. The blast radius is every structural workflow that treats `status: "ok"` as proof the query contract was honored; unsupported operations can silently degrade into `CALLS` traversals and drive wrong dependency or impact conclusions.

### Finding R16-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Lines:** `295-305`
- **Severity:** P2
- **Description:** Trigger: `vectorSearch()` returns a candidate row with malformed or missing structural fields such as `id`, `similarity`, or `content_text`. Caller perception: reconsolidation examined a real candidate set and correctly decided there was no actionable duplicate. Reality: the bridge silently coerces malformed rows into sentinel values (`id: 0`, `file_path: ''`, `content_text: null`, `similarity: 0`), then hands them to reconsolidation, where `determineAction(0)` routes to the complement/no-op path and lets the normal create flow continue.
- **Evidence:** The bridge maps each raw search row with permissive fallbacks instead of rejecting bad rows (`reconsolidation-bridge.ts:295-305`). Downstream, reconsolidation treats the top candidate's numeric similarity as authoritative; `determineAction()` returns `complement` for low values, and the complement path returns `newMemoryId: 0` so the caller proceeds with the standard create path (`lib/storage/reconsolidation.ts:184-191, 628-694`). The direct bridge suite only uses well-formed vector rows with numeric IDs and real `content_text`, so there is no regression covering malformed-candidate normalization (`mcp_server/tests/reconsolidation-bridge.vitest.ts:218-223, 267-274`).
- **Downstream Impact:** Upstream vector-index corruption or contract drift can silently suppress dedup/reconsolidation and create duplicate memories while the save path looks like a normal, governed complement decision. The blast radius is every save-time reconsolidation flow that trusts raw vector-search rows to be structurally valid.

## Novel Insights
- The new residual risk is no longer another warning-only branch in `session-stop.ts`, `graph-metadata-parser.ts`, or `post-insert.ts`; it is **input-contract normalization**. Invalid operations and malformed candidate rows are being converted into plausible success states rather than rejected.
- Re-checking the explicitly requested `session-stop.ts:85-101,199-218`, `graph-metadata-parser.ts:223-255`, `reconsolidation-bridge.ts:283-294`, and `post-insert.ts` slices did not surface additional non-duplicate fail-open paths beyond Iterations 11-15. The only additive findings this pass came from the adjacent runtime edges that those slices flow into.
- The test suites remain heavily happy-path oriented at exactly these seams: valid transitive graph requests and well-formed reconsolidation candidates are covered, but malformed-input behavior is largely unexercised.

## Next Investigation Angle
Trace the consumer-facing layers that receive these success-shaped degradations: the MCP boundary for `code_graph_query` input validation and the `memory_save` response assembly that decides whether malformed reconsolidation evidence should become a surfaced warning instead of a silent complement fallback.
