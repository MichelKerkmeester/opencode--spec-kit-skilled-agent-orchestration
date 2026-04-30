# Deep Research Strategy: Search Query RAG Optimization

## Topic

Optimize search, query intelligence, and RAG fusion across MCP runtime grounding systems: memory search, memory context, code graph, skill graph/advisor, CocoIndex, causal graph, and composed response policy.

## Research Questions

- RQ1: Highest-leverage performance optimizations across the search stack.
- RQ2: Precision and recall loss points.
- RQ3: Query intelligence improvements beyond sorted-token heuristic.
- RQ4: Optimal RAG fusion strategy across memory, code graph, skill graph, and CocoIndex.
- RQ5: Cross-cutting integration friction points.
- RQ6: Residuals in v1.0.2 stress data.
- RQ7: Underutilized affordances for search quality.
- RQ8: Cost-of-correctness tradeoff for rerank layer.
- RQ9: Advisor scoring fusion under ambiguity and path to learned weights.
- RQ10: Missing integration tests for future regressions.

## Known Context

- v1.0.1 stress data showed severe weak-retrieval behavior: S2 opencode was the best case through `memory_quick_search` plus CocoIndex, Q1 code graph had sparse results with high latency, and I2 hallucinated canonical paths after weak memory search (`001-search-intelligence-stress-test/002-scenario-execution/findings.md:23`, `:68`, `:96`, `:121`).
- v1.0.2 improved the system to 83.8% overall with 6/7 packets PROVEN and zero regressions, while packet 005 remained NEUTRAL because code-graph fallback was not proven by stress rerun evidence (`010-stress-test-rerun-v1-0-2/findings.md:15`, `:73`, `:87`).
- Prior root-cause research found recurring internal-signal gaps: stale daemon, memory_context fallback, weak memory_search advisory, CocoIndex duplicates, causal balance diagnostics, code graph recovery, and intent classifier contract evidence (`002-mcp-runtime-improvement-research/research/research.md:62`, `:74`, `:84`, `:94`).
- Follow-up research narrowed residuals to authority tokens, graph fast-fail testability, graph status readiness action visibility, and CocoIndex seed-fidelity passthrough (`011-post-stress-followup-research/research/research.md:29`, `:243`, `:264`, `:303`).
- Current source shows several follow-up contracts already landed: code graph readiness blocks full-scan read paths, CocoIndex seed metadata is preserved into code graph context, advisor has a five-lane registry, and memory search has adaptive fusion, response policy, token budget enforcement, and optional rerank gates.

## Completed Iterations

1. Baseline stress evidence and residual framing.
2. Memory search fusion, token budgets, weak retrieval policy.
3. Code graph search readiness and structural query behavior.
4. CocoIndex semantic search, dedup, overfetch, path-class ranking.
5. Skill graph and advisor ambiguity behavior.
6. Causal graph and deep-loop affordances.
7. Rerank cost-of-correctness.
8. RAG fusion trust tree, contradiction detection, citation policy.
9. Integration test gaps and benchmark corpus.
10. Synthesis, workstream ranking, convergence audit.

## Exhausted Approaches

- Treating packet 005's earlier NEUTRAL verdict as a current runtime defect. Current source and follow-up packets show code graph fallback and readiness contracts have since been implemented; the residual is test coverage and live benchmark evidence, not a known missing handler contract.
- Treating CocoIndex dedup as missing. Current source overfetches at 4x and deduplicates by real path or content hash plus line range; the residual is tuning and downstream fusion use.
- Treating rerank as a universal default. Current cross-encoder/local reranker gates, timeouts, cache, and circuit breaker make it more suitable as an ambiguity or weak-retrieval layer than an always-on layer.

## Ruled-Out Directions

- License audit or package compliance work: out of scope.
- Runtime code patches: explicitly deferred to Phase D.
- Changing previous stress closure tallies: this packet extends evidence and planning only.

## Next Focus

Phase D should turn the Planning Packet in `research/research-report.md` into remediation specs. The first packet should be a search-quality harness because it creates the measurement substrate for the other workstreams.

## Convergence Tracking

newInfoRatio sequence: `1.00, 0.86, 0.74, 0.68, 0.56, 0.48, 0.39, 0.31, 0.24, 0.18`.

Stop reason: max iteration 10 reached. Convergence did not trigger because there were not three consecutive iterations with newInfoRatio <= 0.20.

