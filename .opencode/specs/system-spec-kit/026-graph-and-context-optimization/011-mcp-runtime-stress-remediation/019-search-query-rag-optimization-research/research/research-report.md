# Search, Query Intelligence, and RAG Fusion Optimization Research Report

Session: `dr-20260428T204226Z-019-search-query-rag-optimization`  
Status: Complete  
Stop reason: max iteration 10 reached; convergence did not trigger.

## 1. Executive Summary

Verdict: **trigger Phase D remediation, but start with measurement before changing behavior**. The current stack has many good local contracts: memory search has hybrid fusion and weak-retrieval response policy, code graph has degraded-readiness fallback envelopes, CocoIndex exposes dedup/path telemetry, advisor has explainable lane fusion, and causal graph has relation weights. The gap is cross-system optimization evidence.

Top actionable findings:

1. **P1: End-to-end search-quality harness is missing.** v1.0.2 proved remediation progress at 83.8%, but the rerun itself notes N=1 limits and a marginal code-graph cell (`010-stress-test-rerun-v1-0-2/findings-rubric.json:71`, `010-stress-test-rerun-v1-0-2/findings.md:135`, `:87`).
2. **P1: Query intelligence needs an explicit query-plan contract.** Current routing still relies on deterministic term-count and heuristic/centroid classification surfaces (`query-classifier.ts:21`, `query-router.ts:62`, `intent-classifier.ts:158`).
3. **P2: RAG fusion needs a composed trust tree.** Memory response policy, code graph fallback, advisor trustState, CocoIndex telemetry, and causal relation weights exist locally but are not represented as one answer-level provenance object (`search-results.ts:297`, `code_graph/handlers/context.ts:62`, `advisor-status.ts:101`, `seed-resolver.ts:20`, `causal-edges.ts:18`).
4. **P2: Rerank should be conditional.** Cross-encoder and local rerank have useful gates, cache, and circuit breakers, but provider timeouts and local memory requirements make always-on rerank a poor default (`cross-encoder.ts:35`, `:161`, `local-reranker.ts:206`).
5. **P2: Advisor learned weights should start in shadow mode.** The live registry has fixed lane weights and semantic shadow weight 0.00, which is a stable base for offline comparison rather than immediate online learning (`lane-registry.ts:5`, `weights-config.ts:24`).

Headline conclusion: **the stack is ready for optimization only if Phase D first adds outcome measurement**: relevance labels, source attribution, weak-refusal expectations, latency budgets, and trust telemetry over a shared query corpus.

## 2. Research Questions Answered

### RQ1: Highest-leverage performance optimizations

Answer: **HIGH evidence**. Start with latency instrumentation and benchmark corpus, then tune channel routing and conditional rerank. Hybrid search executes synchronous better-sqlite3 work sequentially by design (`hybrid-search.ts:999`), code graph context has explicit profile deadlines (`code_graph/handlers/context.ts:99`), CocoIndex overfetch is fixed at 4x (`query.py:282`), and rerank providers have 15-30s timeouts (`cross-encoder.ts:35`, `local-reranker.ts:42`). The leverage is measuring which stage dominates p95 before changing ranking.

### RQ2: Precision and recall loss points

Answer: **HIGH evidence**. Precision loss historically came from weak retrieval being cited as if authoritative; v1.0.1 I2 showed hallucinated path risk after weak memory search (`001-search-intelligence-stress-test/002-scenario-execution/findings.md:96`). Recall loss risk remains in routing and dedup windows: query router can skip channels by complexity (`query-router.ts:62`), while CocoIndex dedup depends on 4x overfetch (`query.py:282`). Current response policy reduces hallucination risk by refusing or asking under weak evidence (`search-results.ts:273`, `recovery-payload.ts:203`).

### RQ3: Query intelligence beyond sorted-token heuristic

Answer: **HIGH evidence**. The next step is an explicit query-plan object that records normalized intent, complexity, artifact class, source authority need, selected channels, skipped channels, and routing reasons. Current code has term-count complexity thresholds (`query-classifier.ts:21`, `:126`), channel choices by complexity (`query-router.ts:62`), and hashed bag-of-words centroid intent classification (`intent-classifier.ts:158`). That is stable but not enough for paraphrase handling, ambiguity, or learned fusion diagnostics.

### RQ4: Optimal RAG fusion strategy

Answer: **MEDIUM evidence**. Best current strategy is staged fusion: deterministic hybrid recall first, trust-tree telemetry second, conditional rerank third, refusal/citation policy last. Memory search already merges channels and applies adaptive fusion (`hybrid-search.ts:560`, `:1248`), CocoIndex exposes raw/path telemetry (`schema.py:8`, `query.py:176`), and causal graph weights can represent supersedes/contradicts/supports semantics (`causal-edges.ts:33`). The exact learned weights need runtime evaluation.

### RQ5: Cross-cutting integration friction points

Answer: **HIGH evidence**. Friction appears at integration boundaries:

- Memory search has response/citation policy, but composed context loading does not expose a global trust tree (`search-results.ts:297`).
- Code graph readiness and fallback are strong locally, but they need stress proof under degraded states (`query.ts:787`, `context.ts:62`).
- Advisor status exposes freshness/trustState and lane weights, but those do not feed composed RAG policy (`advisor-status.ts:101`, `:140`).
- CocoIndex seed telemetry is preserved into code graph context, but fusion does not yet treat it as a first-class ranking/trust signal (`seed-resolver.ts:20`, `:110`).

### RQ6: v1.0.2 residuals

Answer: **HIGH evidence**. v1.0.2 is a success baseline, not a failure baseline: +7.2pp, 6/7 PROVEN, 0 regressions (`010-stress-test-rerun-v1-0-2/findings.md:15`, `:73`). Residuals were marginal or proof-limited: packet 005 NEUTRAL, forced weak preamble caveat, N=1 limitations, and a still-bypassed copilot path in post-stress research (`010-stress-test-rerun-v1-0-2/findings.md:87`, `:135`, `011-post-stress-followup-research/research/research.md:29`). Later packets appear to have remediated several of those contract gaps, so Phase C should not mutate the closure tally.

### RQ7: Underutilized affordances

Answer: **MEDIUM evidence**. Strong affordances are present but underused:

- Causal relation weights for trust and contradiction (`causal-edges.ts:18`, `:33`).
- CocoIndex `raw_score`, `path_class`, and `rankingSignals` (`schema.py:24`, `seed-resolver.ts:20`).
- Advisor lane attribution (`advisor-recommend.ts:141`, `fusion.ts:356`).
- Code graph readiness/trustState/fallback envelopes (`status.ts:158`, `context.ts:62`).

These should become telemetry first, then ranking inputs after benchmark proof.

### RQ8: Rerank cost-of-correctness

Answer: **MEDIUM evidence**. Rerank is justified for ambiguous or high-value queries, not as a blanket default. The code already has opt-in providers, cache, circuit breaker, and local memory/model checks (`cross-encoder.ts:126`, `:161`, `:215`, `local-reranker.ts:206`). The cost side is real: provider timeouts are 15s and local timeout is 30s (`cross-encoder.ts:35`, `local-reranker.ts:42`). Correctness gain must be proven against refusal/citation expectations, not only top-1 relevance.

### RQ9: Advisor scoring fusion and learned weights

Answer: **HIGH evidence**. Advisor fusion is explainable and stable, but not learned. Five lanes exist, four live and one semantic shadow at weight 0 (`lane-registry.ts:5`). Weight config is strict literal schema (`weights-config.ts:24`), ambiguity is top-two confidence delta <= 0.05 (`ambiguity.ts:7`), and outputs can include lane attribution (`advisor-recommend.ts:141`). Path to learned weights: offline corpus, shadow scoring, compare against registry weights, promote only if false-positive rate and ambiguous-route quality improve.

### RQ10: Missing integration tests

Answer: **HIGH evidence**. Existing tests verify contracts, not outcome quality. There are tests for memory_context eval channels, code graph fallback decisions, and status readiness snapshots (`memory-context-eval-channels.vitest.ts:1`, `code-graph-query-fallback-decision.vitest.ts:76`, `code-graph-status-readiness-snapshot.vitest.ts:129`). Missing: multi-source query corpus, precision/recall judgments, weak-refusal expected outputs, p95/p99 budgets, advisor ambiguity labels, CocoIndex duplicate-heavy corpora, and contradiction/trust-tree assertions.

## 3. Top Optimization Workstreams

1. **Search-quality harness and corpus**  
   Leverage: Very high. Feasibility: High.  
   Create a fixture corpus from v1.0.1/v1.0.2 stress cells plus ambiguous/paraphrase queries. Record per-channel candidates, final relevance, citation policy, refusal policy, and latency.

2. **Explicit query-plan contract**  
   Leverage: High. Feasibility: High.  
   Add a query-plan object that explains intent, complexity, authority need, artifact class, selected/skipped channels, and fallback policy. This can be telemetry-only first.

3. **Composed RAG trust tree**  
   Leverage: High. Feasibility: Medium.  
   Merge local trust signals into answer-level provenance: memory responsePolicy, code graph readiness, advisor trustState, CocoIndex path/raw signals, causal supports/supersedes/contradicts.

4. **Conditional rerank experiment**  
   Leverage: Medium-high. Feasibility: Medium.  
   Gate rerank to ambiguous, weak, or multi-channel-disagreement queries. Measure precision gain, latency cost, and refusal/citation preservation.

5. **Advisor shadow learned weights**  
   Leverage: Medium. Feasibility: Medium.  
   Keep live lane registry fixed. Run learned weights as shadow output over labeled prompts, especially ambiguous prompts.

6. **CocoIndex overfetch and path-class calibration**  
   Leverage: Medium. Feasibility: High.  
   Test fixed 4x overfetch against duplicate-heavy repos. Tune multiplier or make it adaptive only if recall gain exceeds latency cost.

7. **Code graph degraded-readiness stress cells**  
   Leverage: Medium. Feasibility: High.  
   Convert current unit contracts into stress cells for stale, empty, full-scan-required, and unavailable graph states.

## 4. Cross-System Integration Insights

- **Trust boundaries should be explicit.** Memory can refuse weak citations, code graph can say graph answers are omitted, advisor can report stale/unavailable graph, and CocoIndex can expose path class. A composed RAG answer should preserve those boundaries instead of flattening them into a single confidence score.
- **Fusion should separate recall, ranking, and response policy.** Recall should overfetch safely; ranking should fuse deterministic and optional rerank signals; response policy should still be able to ask/refuse after ranking.
- **Telemetry-first changes are safest.** Query-plan, trust-tree, and learned-weight shadow outputs can ship without changing user-visible answers, which makes Phase D lower risk.
- **Contradiction detection belongs in the trust tree before ranking.** Causal `contradicts` and `supersedes` relations should be visible to callers before they become automatic rank penalties.
- **Current code has local observability but lacks a shared experiment ID.** A benchmark run should tie memory, code graph, advisor, CocoIndex, and RAG output rows under one query/run identifier.

## 5. Active Findings Registry

| ID | Severity | Finding | Evidence | Recommended Action |
|----|----------|---------|----------|--------------------|
| F-001 | P1 | End-to-end search-quality harness is missing | `001-search-intelligence-stress-test/implementation-summary.md:54`, `010-stress-test-rerun-v1-0-2/findings.md:135` | Build corpus + metrics before ranking changes |
| F-004 | P1 | Query intelligence needs explicit query-plan contract | `query-classifier.ts:21`, `query-router.ts:62`, `intent-classifier.ts:158` | Add telemetry-only query plan |
| F-020 | P1 | Phase D should start with measurement before behavior changes | Iterations 001 and 009 | Make harness first remediation packet |
| F-002 | P2 | v1.0.2 residual is marginal code-graph evidence, not broad regression | `010-stress-test-rerun-v1-0-2/findings.md:73`, `:87` | Add degraded-readiness stress cells |
| F-003 | P2 | Weak-retrieval hallucination remains canonical failure mode | `001-search-intelligence-stress-test/002-scenario-execution/findings.md:96` | Preserve refusal/citation contracts |
| F-005 | P2 | Memory search has local fusion signals but lacks shared evaluation telemetry | `hybrid-search.ts:560`, `:1248` | Log channel survival and final policy together |
| F-006 | P2 | Weak-quality refusal contracts should not be bypassed | `search-results.ts:273`, `recovery-payload.ts:203` | Assert refusal survives rerank/fusion |
| F-007 | P2 | Code graph fast-fail is implemented; residual is proof | `ensure-ready.ts:141`, `query.ts:787`, fallback tests | Test degraded states end-to-end |
| F-008 | P2 | Code graph deadlines are clear p95 targets | `context.ts:99` | Include profile latency budgets |
| F-009 | P2 | CocoIndex telemetry is available for downstream fusion | `schema.py:8`, `query.py:158`, `query.py:176` | Add telemetry to trust tree |
| F-010 | P2 | CocoIndex overfetch should be tuned | `query.py:282`, `query.py:302` | Benchmark duplicate-heavy corpora |
| F-011 | P2 | Advisor fusion is explainable but static | `lane-registry.ts:5`, `weights-config.ts:24` | Add shadow learned weights |
| F-012 | P2 | Advisor ambiguity needs labeled prompts | `ambiguity.ts:7`, `advisor-recommend.ts:141` | Build ambiguous routing corpus |
| F-013 | P2 | Causal weights can become answer-level trust evidence | `causal-edges.ts:18`, `:33` | Surface supports/supersedes/contradicts |
| F-014 | P2 | Causal graph has safe runtime bounds | `causal-edges.ts:45`, `:203` | Start telemetry-only |
| F-015 | P2 | Rerank should be conditional, not default | `cross-encoder.ts:35`, `:161`, `local-reranker.ts:206` | Gate rerank to high-value cases |
| F-016 | P2 | Local trust contracts are not globally composed | `recovery-payload.ts:12`, `context.ts:62`, `advisor-status.ts:101` | Add trust tree |
| F-017 | P2 | CocoIndex seed telemetry can be trust-tree leaf evidence | `seed-resolver.ts:20`, `:110` | Preserve path/raw/ranking signals |
| F-018 | P2 | Existing tests are contract tests, not outcome tests | `memory-context-eval-channels.vitest.ts:1`, fallback/status tests | Add outcome benchmark |
| F-019 | P2 | v1.0.2 N=1 limits require larger regression corpus | `010-stress-test-rerun-v1-0-2/findings.md:135` | Expand query matrix |

### Adversarial Checks for P1 Findings

**F-001 / F-020: Search-quality harness first**

- Hunter: Current evidence shows many local contracts and a successful stress rerun, but no shared corpus that measures relevance, latency, trust, and refusal across all sources. Rerank or learned weights without that harness would be ungrounded.
- Skeptic: The v1.0.2 stress matrix already had 30 scored cells and 83.8% overall, so calling the harness P1 could overstate the gap.
- Referee: Keep P1, scoped to optimization planning. This is not a production blocker or regression. It is a blocker for safely changing search/rerank/fusion behavior.

**F-004: Query-plan contract**

- Hunter: Current routing uses term thresholds, keyword/centroid intent, and channel-skipping decisions; these need a single visible plan object before calibration or learned routing.
- Skeptic: v1.0.2 found no broad intent-regression pattern, and deterministic routing is easier to reason about than learned planners.
- Referee: Keep P1, again scoped to Phase D optimization. The recommendation is telemetry-first, not replacement of deterministic routing.

No P0 actionable findings survived adversarial review.

## 6. Planning Packet

```json
{
  "triggered": true,
  "verdict": "Proceed to Phase D with measurement-first remediation",
  "recommendedRemediationPhases": [
    {
      "id": "D1",
      "title": "Search Quality Harness and Corpus",
      "priority": "P1",
      "scope": "Create golden query corpus and metrics for memory, code graph, advisor, CocoIndex, and composed RAG outputs.",
      "acceptance": [
        "Fixture corpus includes baseline stress cells plus ambiguous/paraphrase queries",
        "Metrics include precision, recall, citation/refusal correctness, p95 latency, source attribution, and trust telemetry",
        "Harness can run without mutating production memory databases"
      ]
    },
    {
      "id": "D2",
      "title": "Query Plan Telemetry Contract",
      "priority": "P1",
      "scope": "Emit query-plan object with intent, complexity, artifact class, authority need, selected/skipped channels, and routing reasons.",
      "acceptance": [
        "Telemetry-only by default",
        "Covered by simple, moderate, complex, ambiguous, and paraphrase fixtures",
        "No response behavior changes in first pass"
      ]
    },
    {
      "id": "D3",
      "title": "RAG Trust Tree",
      "priority": "P2",
      "scope": "Compose memory response policy, code graph readiness, advisor trustState, CocoIndex telemetry, and causal relation evidence into answer-level provenance.",
      "acceptance": [
        "Trust tree records degraded, unsupported, contradicted, and cited claims",
        "Contradictions lower confidence or ask user before ranking changes",
        "Weak-retrieval refusal remains binding"
      ]
    },
    {
      "id": "D4",
      "title": "Conditional Rerank and Learned Fusion Experiments",
      "priority": "P2",
      "scope": "Run shadow rerank and learned advisor weights against the harness; promote only with measured gain.",
      "acceptance": [
        "Rerank only runs for configured ambiguity/disagreement cases",
        "Learned advisor weights stay shadow until false-positive rate improves",
        "Latency and refusal-policy impact are reported"
      ]
    },
    {
      "id": "D5",
      "title": "Degraded Readiness and CocoIndex Regression Cells",
      "priority": "P2",
      "scope": "Add stress fixtures for code graph degraded states and duplicate-heavy CocoIndex corpora.",
      "acceptance": [
        "Empty/stale/unavailable graph states produce expected fallbackDecision",
        "CocoIndex duplicate collapse preserves unique relevant results",
        "Path-class and raw-score telemetry survive downstream"
      ]
    }
  ],
  "specSeed": {
    "folderSuggestion": "specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-search-quality-harness-and-query-plan",
    "title": "Search Quality Harness and Query Plan Telemetry",
    "problem": "Search optimization lacks a shared outcome harness and explicit query-plan telemetry, so rerank, learned fusion, and trust-tree changes cannot be safely evaluated.",
    "nonGoals": [
      "No always-on learned rerank in first packet",
      "No closure tally mutation for prior 026 packets",
      "No license audit scope"
    ]
  },
  "planSeed": {
    "phaseOrder": [
      "Build fixture corpus from v1.0.1/v1.0.2 plus synthetic ambiguity cases",
      "Add telemetry-only query-plan output",
      "Wire per-source metrics under one run id",
      "Add baseline outcome assertions",
      "Only then evaluate rerank/learned-weight changes"
    ],
    "initialTests": [
      "weak retrieval must not cite unsupported paths",
      "complex structural query must expose code graph fallback when graph is stale/full-scan-required",
      "duplicate-heavy CocoIndex query must return unique implementation paths with telemetry",
      "ambiguous advisor prompt must expose lane breakdown and ambiguity flag"
    ]
  }
}
```

## 7. Convergence Audit

newInfoRatio sequence: `1.00, 0.86, 0.74, 0.68, 0.56, 0.48, 0.39, 0.31, 0.24, 0.18`.

Stop reason: **max iteration 10 reached**.

Convergence status: **not converged under configured rule**. The rule required 3 or more consecutive iterations with newInfoRatio <= 0.20. Only iteration 10 met that threshold.

Dimension coverage:

- Memory search: covered iterations 002, 008, 009.
- Code graph: covered iterations 003, 008, 009.
- CocoIndex: covered iterations 004, 008, 009.
- Skill graph/advisor: covered iteration 005 and RQ9 synthesis.
- Causal graph/deep-loop: covered iteration 006 and trust-tree synthesis.
- Rerank/cost: covered iteration 007.
- Tests/harness: covered iterations 001, 009, 010.

## 8. Sources Reviewed

- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/implementation-summary.md:54`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/implementation-summary.md:126`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:23`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:68`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:96`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:121`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:15`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:46`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:73`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:87`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:135`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings-rubric.json:71`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/research.md:62`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/research.md:74`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/research.md:84`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/research.md:665`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/research.md:29`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/research.md:135`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/research.md:243`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/research.md:303`
- `specs/system-spec-kit/026-graph-and-context-optimization/006-graph-impact-and-affordance-uplift/008-deep-research-review/research/research.md:92`
- `specs/system-spec-kit/026-graph-and-context-optimization/006-graph-impact-and-affordance-uplift/008-deep-research-review/research/research.md:421`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:217`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:560`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:999`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1248`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1446`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:62`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:21`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:158`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:35`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:126`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:161`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:42`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:206`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:273`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:297`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:12`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:203`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:463`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:523`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:845`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:22`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:141`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1078`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:62`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:99`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:158`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:20`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:110`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:76`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:129`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py:8`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:158`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:176`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:253`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:282`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:302`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:52`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:194`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lane-registry.ts:5`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts:24`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts:7`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:42`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:270`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:101`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:141`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:101`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts:15`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:33`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:45`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:159`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:203`

## 9. Open Questions / Deferred

- Live p95/p99 latency under concurrent dispatch was not measured in this research-only phase.
- Learned fusion weights cannot be recommended for live routing until a labeled corpus exists.
- Rerank provider selection needs runtime cost data and failure-mode testing.
- Contradiction handling policy needs a product decision: ask user, cite both sides, or dampen confidence silently.
- It remains unknown how sparse causal edges are across the production memory corpus, so causal trust-tree impact should start as telemetry.

