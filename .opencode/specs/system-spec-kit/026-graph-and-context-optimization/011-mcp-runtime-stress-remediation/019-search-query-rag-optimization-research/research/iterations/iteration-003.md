# Iteration 003: Code Graph Readiness and Structural Search

## Focus

Determine whether code graph defects are current runtime gaps or post-remediation test/benchmark gaps.

## Sources

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:22`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:141`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1078`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:62`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:99`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:158`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:76`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:1`

## Findings

- The readiness layer can now produce explicit actions: `none`, `selective_reindex`, `full_scan`, and `error` (`ensure-ready.ts:22`). It chooses full scan for empty graph, head changes, missing tracked files, and broad stale sets, while bounded stale sets take selective reindex (`ensure-ready.ts:141`).
- `code_graph_query` blocks graph answers when readiness requires full scan and returns a fallback decision that points callers to `code_graph_scan`; readiness errors route to `rg` (`query.ts:787`, `:810`, `:1136`).
- `code_graph_context` mirrors the degraded-read behavior, with profile-specific deadlines of 250ms quick, 700ms debug, 900ms research, and 400ms default (`context.ts:62`, `:99`).
- `code_graph_status` reads a non-mutating readiness snapshot before graph stats and surfaces degraded status without throwing on unavailable DB (`status.ts:158`, `:181`).
- Unit coverage exists for the core fallback matrix and readiness snapshot behavior (`code-graph-query-fallback-decision.vitest.ts:76`, `code-graph-status-readiness-snapshot.vitest.ts:1`).

## Insights

The earlier packet-005 NEUTRAL finding should not be carried forward as "missing fast fail" in current source. The residual is stronger: code graph needs integrated stress cells that prove degraded envelopes, fallback decisions, and profile deadlines under stale, empty, and unavailable DB states.

## Open Questions

- What is the actual latency distribution for `code_graph_context` under research profile with large structural expansions?
- Should fallback envelopes include enough query planning metadata for a composed RAG layer to downgrade structural confidence automatically?

## Next Focus

Inspect CocoIndex semantic search dedup, overfetch, and telemetry passthrough.

## Convergence

newInfoRatio: 0.74. New source-level detail still materially changes the residual framing.

