# Deep Research Prompt: Search Fusion & Reranking Configuration Tuning

Use this prompt to launch the research via the sk-deep-research workflow.

## Invocation

```
/spec_kit:deep-research:auto "Search fusion weight optimization and reranking threshold calibration for system-spec-kit MCP server" --max-iterations=15 --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/001-search-fusion-tuning
```

## Research Charter (for strategy.md initialization)

**Topic:** Investigate whether the hardcoded thresholds, weights, and decay constants in the spec-kit search pipeline (cross-encoder reranking, stage2 fusion, vector-index decay) are optimal for spec-doc retrieval.

**Constraints:**
- No historical save data available (old memories deprecated). All research uses current codebase, schema, and synthetic queries.
- Do NOT modify any source files. Read-only analysis + synthetic testing only.
- Focus on measurable quantities: precision@K, latency distributions, cache hit rates, threshold sensitivity.

**Key Files (read these first):**
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` - reranking models, thresholds, cache, circuit breaker
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/stage2-fusion.ts` - RRF algorithm, fusion weights, source combination
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` - embedding dim, FSRS decay, search weights config
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/stage1-candidate-gen.ts` - candidate generation
- `.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json` - actual weight values

**Research Questions (5):**
1. What search-weights.json values produce the best precision@5/10 for different query intents?
2. Is the FSRS decay constant (0.2346) appropriate for spec-doc continuity?
3. What is the latency distribution across reranking providers (Voyage/Cohere/Local)?
4. Do cross-encoder length penalties (0.9/0.95) help or hurt for spec-doc content?
5. What is the cache hit rate at 5-minute TTL?

**Iteration Focus Suggestions:**
- Iter 1-3: Read and document all hardcoded values across the 5 key files
- Iter 4-6: Analyze the RRF algorithm and fusion logic, test weight sensitivity
- Iter 7-9: Profile the cross-encoder configuration, analyze fallback score ranges
- Iter 10-12: Investigate FSRS decay curve behavior at different time horizons
- Iter 13-15: Synthesize findings into threshold recommendations

**Convergence Signal:** Research converges when all 5 questions have evidence-backed answers and the recommended parameter changes are documented with expected impact.
