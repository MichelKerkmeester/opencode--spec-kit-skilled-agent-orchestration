# Iteration 009: Missing Integration Tests and Benchmark Corpus

## Focus

Identify regression tests that would catch future precision, recall, latency, and trust-policy regressions.

## Sources

- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:95`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:76`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:132`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:129`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/research.md:665`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/research.md:135`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:135`

## Findings

- Unit tests already check memory_context eval-channel logging for focused and quick flows (`memory-context-eval-channels.vitest.ts:1`, `:95`, `:109`).
- Code graph fallback tests cover empty graph, stale full-scan, readiness error to `rg`, and no inline full scan (`code-graph-query-fallback-decision.vitest.ts:76`, `:132`, `:162`).
- Status snapshot tests cover fresh, empty, broad stale, bounded stale, and unavailable graph states (`code-graph-status-readiness-snapshot.vitest.ts:129`, `:191`).
- Prior root-cause research explicitly called out missing regression tests across multiple surfaces (`002-mcp-runtime-improvement-research/research/research.md:665`).
- v1.0.2 itself warned about N=1 limits and forced weak preamble caveats (`010-stress-test-rerun-v1-0-2/findings.md:135`).

## Insights

The current test base is contract-heavy and useful, but optimization needs outcome tests: same query corpus, labeled relevant documents, expected non-citations under weak quality, p95 budgets, source attribution, and ambiguity decisions. Without that, learned fusion and rerank experiments will be unverifiable.

## Open Questions

- Should the benchmark corpus live inside 019's downstream Phase D packet or under the MCP server tests tree?
- How many golden queries are enough to catch regressions without making local test runs too slow?

## Next Focus

Deduplicate findings, rank workstreams, and write the Phase D Planning Packet.

## Convergence

newInfoRatio: 0.24. Most individual system facts are now known; new value comes from integrating them into a test strategy.

