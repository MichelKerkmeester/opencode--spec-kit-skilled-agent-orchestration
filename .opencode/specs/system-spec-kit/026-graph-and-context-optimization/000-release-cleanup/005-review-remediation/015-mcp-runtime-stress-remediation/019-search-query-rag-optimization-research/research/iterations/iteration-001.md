# Iteration 001: Baseline Stress Evidence and Residual Framing

## Focus

Establish what the v1.0.1 and v1.0.2 stress corpus already proved, then define the optimization axis without reopening prior closure counts.

## Sources

- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/implementation-summary.md:54`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:23`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:15`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:73`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings-rubric.json:71`

## Findings

- The v1.0.1 baseline was already a search-intelligence test, not a generic runtime smoke test: it used 9 scenarios, a 5-dimension rubric, and a cross-AI dispatch matrix (`001-search-intelligence-stress-test/implementation-summary.md:54`). That makes it a usable seed corpus for future search-quality evaluation.
- The baseline failure pattern was uneven by surface. S2 succeeded through `memory_quick_search` plus CocoIndex, while Q1 exposed sparse code-graph behavior and I2 showed hallucinated path risk after weak retrieval (`001-search-intelligence-stress-test/002-scenario-execution/findings.md:23`, `:68`, `:96`).
- The v1.0.2 rerun materially improved the system: +7.2 percentage points, 6/7 remediation packets PROVEN, and 0 regressions (`010-stress-test-rerun-v1-0-2/findings.md:15`, `:73`). The sidecar recomputed the overall score at 83.8% (`010-stress-test-rerun-v1-0-2/findings-rubric.json:71`).
- Packet 005 was the key marginal result: code-graph fallback was NEUTRAL in the rerun, while token budget, CocoIndex dedup, and response policy were PROVEN (`010-stress-test-rerun-v1-0-2/findings.md:87`).

## Insights

The highest-value next step is not another closure tally. It is a stable optimization benchmark that can run the same query corpus against memory search, code graph, advisor, CocoIndex, and composed RAG outputs with relevance, hallucination, citation, and latency labels.

## Open Questions

- Which v1.0.1/v1.0.2 cells should become permanent golden relevance fixtures?
- Does the existing stress matrix need synthetic ambiguous/paraphrase queries before it can calibrate learned fusion?

## Next Focus

Read current memory search and RAG fusion source to separate already-closed response-policy issues from residual optimization opportunities.

## Convergence

newInfoRatio: 1.00. First iteration, no convergence signal.

