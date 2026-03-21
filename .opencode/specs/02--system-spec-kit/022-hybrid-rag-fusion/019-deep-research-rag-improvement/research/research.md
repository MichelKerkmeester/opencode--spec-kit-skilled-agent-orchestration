# Deep Research: Hybrid RAG Fusion System Improvement — 5-Dimensional Synthesis

> **Date:** 2026-03-21 | **Agents:** 5x GPT 5.4 (high reasoning) via Codex CLI | **Total tokens:** ~1.35M
> **Spec folder:** `02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement`

---

## 1. Executive Synthesis

Five GPT 5.4 agents independently investigated the Hybrid RAG Fusion system across Fusion (D1), Query Intelligence (D2), Graph Retrieval (D3), Feedback Learning (D4), and Retrieval UX (D5). Key cross-cutting findings:

1. **The system is more mature than expected.** All 5 agents discovered capabilities beyond what the prompts described — TM-04 quality gates, TM-06 reconsolidation, learned feedback with 10 safeguards, entity extraction/linking modules, trace envelopes, evidence-gap detection. The gap is not missing code but **missing wiring and calibration**.

2. **Heuristics → Calibration is the #1 theme.** Across all dimensions, the biggest recurring recommendation is replacing flat constants with data-driven, query-aware values: k=60, convergence bonus +0.10, graph boost 1.5x, FSRS decay, Stage 2 signal weights — all are heuristics that should be calibrated via evaluation data.

3. **Simple queries must stay fast.** Every agent independently recommended protecting the simple-query fast path. New intelligence (HyDE, decomposition, LLM reformulation, graph expansion) should be gated to deep/complex/low-confidence queries only.

4. **Log before learning.** D4 (Feedback) and D1 (Fusion) converge: build the event ledger and shadow scoring infrastructure before any live ranking changes. The corpus is too small for online learning.

5. **Graph value is in typed traversal, not community detection.** D3 and D1 agree: for sparse organically-grown graphs, intent-aware typed edge traversal (SimGRAG pattern) beats Louvain/community detection. Communities should be a secondary expansion layer, not a primary retrieval primitive.

---

## 2. Cross-Dimensional Priority Matrix

### Tier 1: High Impact, Low Risk (Do First)

| # | Recommendation | Dimension | Size | Impact | Sprint |
|---|---|---|---|---|---|
| 1 | **Calibrated overlap bonus** — replace flat +0.10 with query-aware bounded feature | D1 Fusion | S | +0-1.5 NDCG@10 | Sprint 2 follow-up |
| 2 | **Implicit feedback event ledger** — log search_shown, result_cited, query_reformulated, same-topic-requery | D4 Feedback | S | Unlocks training data | Sprint 4 |
| 3 | **FSRS hybrid decay** — type-aware no-decay for decisions/constitutional, FSRS only for engagement-sensitive docs | D4 Feedback | S | High precision on durable docs | Sprint 4 |
| 4 | **Sparse-first graph policy** — default to 1-hop typed traversal, disable community when density <0.5 | D3 Graph | S | Better precision + latency | Sprint 6 |
| 5 | **Intent-aware edge traversal** — fix_bug→CORRECTION, add_feature→EXTENDS, find_decision→PREFERENCE | D3 Graph | S | Better recall without noise | Sprint 6 |
| 6 | **Empty/weak result recovery UX** — status codes, failure reasons, suggested reformulations | D5 UX | S | Fewer silent failures | Sprint 9 follow-up |
| 7 | **Short-critical quality gate exception** — bypass length gate for decisions with strong structural signals | D4 Feedback | S | Preserves rare critical memories | Sprint 4 |

### Tier 2: High Impact, Medium Effort

| # | Recommendation | Dimension | Size | Impact | Sprint |
|---|---|---|---|---|---|
| 8 | **Shadow fusion lab** — evaluate RRF vs minmax_linear vs zscore_linear on judged queries | D1 Fusion | M | +1-4 MRR@5 | Sprint 2 follow-up |
| 9 | **K-optimization with judged relevance** — segment by query class, test k=10..120 | D1 Fusion | M | +0-2 MRR@5 | Sprint 2 follow-up |
| 10 | **Query decomposition** — bounded facet detection for deep multi-faceted questions | D2 Query | M | +6-15% recall on complex | Sprint 3 follow-up |
| 11 | **Graph concept routing** — query-time alias matching to control graph channel activation | D2 Query | S/M | +3-8% on graph queries | Sprint 6 |
| 12 | **Corpus-grounded LLM reformulation** — step-back + corpus seeds, not raw HyDE | D2 Query | M | +4-10% on paraphrase queries | Sprint 3 follow-up |
| 13 | **Graph refresh on write** — mark dirty nodes, local recompute, scheduled global refresh | D3 Graph | M | Fresh signals without spikes | Sprint 6 |
| 14 | **Deterministic save-time enrichment** — FastGraphRAG-style extraction (headings, aliases, relation phrases) | D3 Graph | M | Higher edge density | Sprint 6 |
| 15 | **Graph signal calibration** — ablate by intent, tune graphWeightBoost/N2a/N2b caps | D3 Graph | M | Less ranking volatility | Sprint 6 |
| 16 | **Two-tier explainability** — slim default + opt-in debug with per-channel attribution | D5 UX | M | Better evidence selection | Sprint 9 follow-up |
| 17 | **Mode-aware response shape** — quick/research/resume/debug presentation profiles | D5 UX | M | Lower token waste | Sprint 9 follow-up |
| 18 | **Per-result calibrated confidence** — margin + agreement + reranker + anchor density | D5 UX | M | Better caller abstention | Sprint 9 follow-up |
| 19 | **Weekly batch feedback learning** — min-support thresholds, cap boosts, shadow evaluation | D4 Feedback | M | Medium-high, low risk | Sprint 4 |
| 20 | **Assistive reconsolidation** — merge ≥0.96, review 0.88-0.96, keep separate <0.88 | D4 Feedback | M | Fewer duplicates, no nuance loss | Sprint 4 |
| 21 | **Shadow scoring with holdout** — compare would-have-changed vs live rank on holdout slice | D4 Feedback | M | Strong safety net | Sprint 4 |
| 22 | **Query-aware graph weight** — promote for multi-hop, demote for literal lookups | D1 Fusion | M | +2-6 NDCG@10 on graph queries | Sprint 6 |
| 23 | **Intent router selects fusion family** — RRF vs score fusion vs graph-heavy based on QPP features | D1 Fusion | M | +0.5-3 NDCG@10 | Sprint 2 follow-up |

### Tier 3: High Impact, Large Effort

| # | Recommendation | Dimension | Size | Impact | Sprint |
|---|---|---|---|---|---|
| 24 | **HyDE in shadow mode** — only for low-confidence deep queries, conditional promotion | D2 Query | M | +2-6% on semantic mismatch | New sprint |
| 25 | **Index-time query surrogates** — precompute aliases, decision summaries, likely questions | D2 Query | M/L | +3-7% broad recall | New sprint |
| 26 | **Progressive disclosure** — summary layer + continuation cursors, replace hard truncation | D5 UX | L | Better quality under tight budgets | New sprint |
| 27 | **Retrieval session state** — track active goal, seen results, open questions across turns | D5 UX | L | Strongest for multi-step tasks | New sprint |
| 28 | **Learned Stage 2 weights** — regularized linear ranker from judged set, not neural | D1 Fusion | M→L | +1-4 NDCG@10 | New sprint |
| 29 | **Communities as secondary layer** — Louvain only on dense components, expansion/summarization role | D3 Graph | M | Lower complexity | Sprint 6 |

---

## 3. Sprint Alignment Map

### Sprint 4: Feedback & Quality (DRAFT → can now be designed)
**Agent informing:** D4 (primary), D1, D5 (secondary)
- Implicit feedback event ledger (#2)
- FSRS hybrid decay policy (#3)
- Short-critical quality gate exception (#7)
- Weekly batch feedback learning (#19)
- Assistive reconsolidation (#20)
- Shadow scoring with holdout (#21)

### Sprint 6: Indexing & Graph (DRAFT → can now be designed)
**Agent informing:** D3 (primary), D1, D2 (secondary)
- Sparse-first graph policy (#4)
- Intent-aware edge traversal (#5)
- Graph concept routing (#11)
- Graph refresh on write (#13)
- Deterministic save-time enrichment (#14)
- Graph signal calibration (#15)
- Query-aware graph weight (#22)
- Communities as secondary layer (#29)

### Sprint 2 Follow-Up (Scoring Calibration)
**Agent informing:** D1 (primary)
- Calibrated overlap bonus (#1)
- Shadow fusion lab (#8)
- K-optimization (#9)
- Intent router selects fusion family (#23)

### Sprint 3 Follow-Up (Query Intelligence)
**Agent informing:** D2 (primary)
- Query decomposition (#10)
- Corpus-grounded LLM reformulation (#12)

### Sprint 9 Follow-Up (UX/Productization)
**Agent informing:** D5 (primary)
- Empty/weak result recovery (#6)
- Two-tier explainability (#16)
- Mode-aware response shape (#17)
- Per-result calibrated confidence (#18)

### New Sprint(s)
- HyDE shadow mode (#24)
- Index-time query surrogates (#25)
- Progressive disclosure (#26)
- Retrieval session state (#27)
- Learned Stage 2 weights (#28)

---

## 4. Cross-Dimensional Dependency Graph

```
D1 Fusion ←→ D3 Graph
  Graph boost calibration depends on graph density/quality signals
  Fusion strategy selection needs graph-aware QPP features

D1 Fusion ←→ D4 Feedback
  Judged queries from feedback are the label source for learned weights
  Shadow scoring infrastructure shared between fusion lab and feedback

D2 Query ←→ D3 Graph
  Query concept extraction feeds graph channel activation
  Intent classification controls edge-type priors and hop budget

D2 Query ←→ D5 UX
  Query rewrite/decomposition traces should be exposed in debug mode
  Multi-faceted queries need facet-aware result formatting

D4 Feedback ←→ D5 UX
  Implicit feedback signals (re-queries, reformulations) need UX contract
  Explainability needed for why a result was boosted/demoted by feedback

D3 Graph ←→ D5 UX
  Graph hits should show provenance: "via CORRECTION from X, hop 1"
  Graph freshness/staleness signals aid caller trust assessment
```

---

## 5. Feature Flag Strategy

All 29 recommendations use feature flags for gradual rollout. Proposed new flags:

| Flag | Recommendation | Default |
|---|---|---|
| `SPECKIT_CALIBRATED_OVERLAP_BONUS` | #1 | ON (replaces flat +0.10) |
| `SPECKIT_IMPLICIT_FEEDBACK_LOG` | #2 | ON (shadow-only) |
| `SPECKIT_HYBRID_DECAY_POLICY` | #3 | ON |
| `SPECKIT_TYPED_TRAVERSAL` | #4, #5 | ON |
| `SPECKIT_EMPTY_RESULT_RECOVERY_V1` | #6 | ON |
| `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS` | #7 | ON (warn-only initially) |
| `SPECKIT_FUSION_POLICY_SHADOW_V2` | #8 | OFF (eval-only) |
| `SPECKIT_RRF_K_EXPERIMENTAL` | #9 | OFF (eval-only) |
| `SPECKIT_QUERY_DECOMPOSITION` | #10 | OFF (deep-mode only) |
| `SPECKIT_GRAPH_CONCEPT_ROUTING` | #11 | OFF |
| `SPECKIT_LLM_REFORMULATION` | #12 | OFF (deep-mode only) |
| `SPECKIT_GRAPH_REFRESH_MODE` | #13 | write_local |
| `SPECKIT_LLM_GRAPH_BACKFILL` | #14 | OFF (async) |
| `SPECKIT_GRAPH_CALIBRATION_PROFILE` | #15 | OFF (eval-only) |
| `SPECKIT_RESULT_EXPLAIN_V1` | #16 | OFF (opt-in) |
| `SPECKIT_RESPONSE_PROFILE_V1` | #17 | OFF |
| `SPECKIT_RESULT_CONFIDENCE_V1` | #18 | OFF |
| `SPECKIT_BATCH_LEARNED_FEEDBACK` | #19 | OFF (shadow-only) |
| `SPECKIT_ASSISTIVE_RECONSOLIDATION` | #20 | OFF |
| `SPECKIT_SHADOW_FEEDBACK` | #21 | OFF |
| `SPECKIT_GRAPH_QUERY_GATING_V1` | #22 | OFF |
| `SPECKIT_FUSION_POLICY_ROUTER` | #23 | OFF |
| `SPECKIT_HYDE` | #24 | OFF (shadow) |
| `SPECKIT_QUERY_SURROGATES` | #25 | OFF |
| `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` | #26 | OFF |
| `SPECKIT_SESSION_RETRIEVAL_STATE_V1` | #27 | OFF |
| `SPECKIT_LEARNED_STAGE2_COMBINER` | #28 | OFF (eval-only) |

---

## 6. Evaluation Metrics

All agents agree on the core eval metrics:
- **MRR@5** — primary ranking quality signal
- **NDCG@10** — graded relevance measure
- **Recall@20** — coverage measure
- **HitRate@1** — first-result precision
- **Latency p95** — must stay sub-second for simple queries

Additional metrics proposed:
- **Per-intent breakdown** of all metrics (D1, D2)
- **Graph-specific recall** for graph-relevant queries (D3)
- **Feedback signal density** — events collected per query (D4)
- **Context budget utilization** — tokens used vs budget (D5)
- **Recovery rate** — % of empty-result queries that produce results after recovery (D5)

---

## 7. Key Academic Sources (Deduplicated)

### Fusion & Ranking
- Cormack et al. (2009) — RRF: Reciprocal Rank Fusion
- Bruch et al. (2024) — Fusion analysis: calibrated score fusion vs RRF
- ListT5 (ACL 2024) — Listwise reranking
- MMLF (NAACL 2025) — Multi-query late fusion

### Query Intelligence
- Gao et al. (ACL 2023) — HyDE: Hypothetical Document Embeddings
- Wang et al. (EMNLP 2023) — query2doc
- Jagerman et al. (2023) — LLM query expansion
- Lei et al. (EACL 2024) — Corpus-steered query expansion
- Zheng et al. (ICLR 2024) — Step-back prompting
- Ammann et al. (ACL SRW 2025) — Question decomposition for RAG
- Xia et al. (NAACL 2025) — Knowledge-aware query expansion

### Graph-Augmented Retrieval
- Microsoft GraphRAG (2024) — Local/global/DRIFT search
- RAPTOR (ICLR 2024) — Recursive abstractive processing for tree-organized retrieval
- SimGRAG (ACL 2025) — Query-to-graph-pattern alignment
- Tiles (2016) — Incremental community detection
- Sparse network community detection (Nature 2015)

### Feedback & Learning
- Joachims et al. (2007) — Click bias in implicit feedback
- Shen et al. (EMNLP 2024) — RAG-specific end-task supervision
- Dai et al. (2011) — Freshness vs relevance tradeoff

### Retrieval UX
- Anthropic (2025) — Context management and context engineering
- Vladika & Matthes (NAACL 2025) — Context size study
- FunnelRAG (NAACL 2025) — Coarse-to-fine retrieval
- BRIEF (NAACL 2025) — Retrieval compression
- R2AG (EMNLP 2024) — Retrieval-side signals for generation

### Production Systems
- Azure AI Search — Hybrid RRF, semantic ranking, query rewrite
- Elasticsearch — RRF, linear retriever, LTR, profile API
- OpenSearch — Score normalization, z-score hybrid
- Weaviate — Relative score fusion
- Vespa — Document summaries, rank features
- Algolia — Event-based personalization
- NVIDIA NeMo — Semantic deduplication

---

## 8. Agent Token Usage

| Agent | Dimension | Tokens | Web Searches |
|---|---|---|---|
| D1 | Fusion & Scoring | 311,305 | ~10 |
| D2 | Query Intelligence | 207,881 | ~9 |
| D3 | Graph Retrieval | 330,979 | ~8 |
| D4 | Feedback Loops | 252,472 | ~10 |
| D5 | Retrieval UX | 244,628 | ~15 |
| **Total** | | **1,347,265** | **~52** |

---

## 9. Methodology

- **Prompt framework:** CRAFT (Context, Role, Action, Format, Target) with DEPTH processing (Deep energy: all 5 phases, 5 perspectives)
- **Quality scoring:** CLEAR 43/50 (C:9 L:8 E:13 A:9 R:4)
- **Agent delegation:** Codex CLI v0.115.0, `codex exec -p research --model gpt-5.4` (reasoning: high)
- **Codebase grounding:** Each agent autonomously explored the codebase via CocoIndex, grep, and file reads before producing recommendations
- **Web search:** All agents performed web searches for academic papers and production system documentation
- **Wave structure:** All 5 agents dispatched in parallel (Wave 1+2 merged for efficiency)
