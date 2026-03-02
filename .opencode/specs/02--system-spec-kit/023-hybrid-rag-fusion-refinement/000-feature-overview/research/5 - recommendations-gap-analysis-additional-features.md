# 144 - Recommendations: Gap Analysis & Additional Features

> **Source:** 10-agent parallel analysis of all research documents (140, 141, 142 pairs), 16 scratch files, parent spec/plan/tasks, and all 8 sprint subfolder specs.
> **Date:** 2026-02-26
> **Purpose:** Identify features from research NOT captured in the current spec, plus novel additions.

---

## Coverage Assessment

**The spec is ~85% comprehensive.** Of ~57 distinct research recommendations, 30+ are fully captured with sprint assignments, 3 are intentionally excluded (R3, R5, N5), and sprint-level specs add granularity beyond the parent plan. However, there are meaningful gaps worth considering.

---

## TIER 1: Low-Hanging Fruit (~15-20h total, can slot into existing sprints)

| # | Feature | Source | Sprint | Effort | Why Add It |
|---|---------|--------|--------|--------|------------|
| 1 | **Inversion Rate Metric** | scratch/wave2-gaps | S0 | 1-2h | Zero-cost ranking diagnostic — "how often is position 2 selected over 1?" No ground truth needed |
| 2 | **R13a: Constitutional Surfacing Rate** | 141 §7.2 | S0 | 1-2h | Critical safety metric — % of queries where constitutional memories land in top-3 |
| 3 | **R13b: Importance-Weighted Recall** | 141 §7.2 | S0 | 1-2h | Recall that cares about tier — finding a critical memory matters more than a normal one |
| 4 | **R13c: Cold-Start Detection Rate** | 141 §7.2 | S0 | 1-2h | Already used in off-ramp criteria but not computed as a formal eval metric |
| 5 | **R13d: Intent-Weighted NDCG** | 141 §7.2 | S0 | 2-3h | NDCG weighted by query intent confidence — rewards correct intent routing |
| 6 | **FUT-5: RRF K-Value Investigation** | 140 missed opportunities | S2/S3 | 2-3h | K=60 is likely an untuned default. Simple A/B during calibration sprint |
| 7 | **FUT-7: Dynamic Token Budget Allocation** | 140 analysis §3.7 | S3 | 3-5h | Natural R15 extension — simple queries get tighter budgets, saving tokens |
| 8 | **R13e: Channel Attribution Score** | 141 §7.2 | S4 | 2-3h | Per-channel exclusive-contribution rate for R13-S2 |

**These 8 items are essentially "free" additions to existing sprint scopes — SQL computations over already-logged data or tiny calibration experiments.**

---

## TIER 2: Medium-Effort Sprint Enhancements (~45-75h total)

| # | Feature | Source | Sprint | Effort | Why Add It |
|---|---------|--------|--------|--------|------------|
| 9 | **N2a: Graph Momentum** | 141 §4 N2 | S6 | 5-8h | Temporal degree delta — identifies trending/declining nodes, not just static centrality |
| 10 | **N2b: Causal Depth Signal** | 141 §4 N2 | S6 | 3-5h | DAG depth distinguishes foundational decisions from derived ones |
| 11 | **N2c: Contradiction Cluster Surfacing** | 141 §4 N2 | S6 | 3-5h | N3-lite detects contradictions but doesn't surface ALL cluster members in results |
| 12 | **Confidence-Based Result Truncation** | scratch/wave2-gaps | S3 | 5-8h | Return fewer results when top results are highly confident — reduces agent token waste |
| 13 | **FUT-4: Working Memory to Search Feedback** | 140 missed opportunities | S4/S6 | 8-12h | Sustained attention signals already exist in cognitive layer — feed them into scoring |
| 14 | **Pairwise Preference Testing** | scratch/wave2-gaps | S4 | 5-8h | Alternative ground truth construction — easier to collect than absolute grades |
| 15 | **Retrieval Explanation in MCP Response** | novel (extends G-NEW-2) | S1/S5 | 8-12h | Agents get results with no explanation of WHY — `_retrievalExplanation` metadata field |
| 16 | **Feature Flag Interaction Testing** | scratch/wave2-risks | cross-cutting | 5-8h | 24 flags = 16.7M combinations. Need a testing strategy, not just a 6-flag cap |

---

## TIER 3: New Features Requiring Scope Expansion (~85-135h total)

| # | Feature | Description | Effort | Placement |
|---|---------|-------------|--------|-----------|
| 17 | **Adaptive Channel Weighting** | Channel weights that learn per query-type (graph excels for decisions, BM25 for keywords) | 15-25h | Post-S3 |
| 18 | **Negative Feedback / Suppression** | Mark memories as HARMFUL to specific query types, not just useful/not-useful | 8-12h | Extends R11, S4 |
| 19 | **Query Session Context** | Use prior queries in same session to disambiguate current query | 15-20h | Post-S3 |
| 20 | **Topical Diversity Control** | Ensure top-5 spans different spec folders/topics, not just different channels | 10-15h | Extends S3 |
| 21 | **Memory Importance Auto-Promotion** | Auto-promote consistently-validated memories from "normal" to "critical" | 5-8h | Extends S4 R11 |
| 22 | **Monitoring / Observability** | Real-time health endpoint (latency, cache hits, channel distribution, errors) | 20-30h | Cross-cutting |
| 23 | **Embedding Model Abstraction** | Decouple from specific model for future model switching | 8-12h | S5/S7 |

---

## TIER 4: Future Horizon (post-Sprint 7, ~70-100h total)

| # | Feature | Source | Notes |
|---|---------|--------|-------|
| 24 | **FUT-1: Matryoshka Embeddings** | 140 | Dimension truncation for tiered fast/precise search |
| 25 | **FUT-2: SPLADE / Learned Sparse** | 140 | Replace hand-crafted BM25 with learned sparse model |
| 26 | **FUT-6: Two-Stage Search** | 140 | Summary pre-filter at full precision, then full detail search |
| 27 | **Memory Versioning / Edit History** | novel | Track memory mutations for before/after comparison |
| 28 | **Concurrent Read/Write Safety** | scratch/wave2-risks | SQLite concurrent access during search + save |
| 29 | **Security / Privacy Review** | scratch/wave2-gaps | PII detection, access control, content sanitization |

---

## Strongest ROI Recommendations

### Must-Add (Tier 1, items 1-5: Enhanced Eval Metrics)

Add ALL five agent-memory evaluation metrics to Sprint 0. They are ~8-12h extra on a 30-45h sprint. The evaluation infrastructure is the FOUNDATION everything else is measured against. Richer metrics = better decisions at every subsequent gate.

### Strong Additions

1. **Item 12 (Confidence-Based Result Truncation)** — Directly reduces agent token consumption. Pairs perfectly with R15 query complexity router already in Sprint 3.

2. **Items 9-11 (Graph Sub-Signals)** — Sprint 6 already plans "graph centrality + community detection" generically. Making the 3 specific sub-signals explicit ensures they don't get dropped during implementation.

3. **Item 15 (Retrieval Explanation)** — The single most impactful agent UX improvement. Agents currently fly blind about WHY results were returned.

4. **Item 21 (Memory Auto-Promotion)** — Closes the virtuous feedback loop. Without it, R11 captures feedback but doesn't use it to improve tier classification.

### Wait Until Off-Ramp

Tiers 3-4 features should wait until the Sprint 3 off-ramp checkpoint. If MRR@5 >= 0.7 is achieved, the system may not need the additional complexity.

---

## Cross-Reference: What's Already Covered

The following research recommendations are FULLY captured in the current spec/plan:

G1, G2, G3, R1-R2, R4, R6-R18, N1 (merged with R14), N2 (items 4-6), N3-lite, N4, G-NEW-1, G-NEW-2, G-NEW-3, S1-S5, R13-S1, R13-S2, R13-S3, score normalization, feature flag governance, dark-run performance budget.

**Intentionally excluded:** R3 (SKIP — irreversible data risk), R5 (DEFER — evaluate-only in S7), N5 (DROP — 2x cost).

---

## Effort Summary

| Tier | Effort | Items | Action |
|------|--------|-------|--------|
| Tier 1 | ~15-20h | 8 | Slot into existing sprints immediately |
| Tier 2 | ~45-75h | 8 | Add as sub-features to existing sprints |
| Tier 3 | ~85-135h | 7 | Evaluate at Sprint 3 off-ramp |
| Tier 4 | ~70-100h | 6 | Post-Sprint 7 or conditional activation |
| **Total** | **~215-330h** | **29** | — |

Current planned effort: 270-456h. Adding Tier 1+2 would bring total to ~330-551h (~22% increase for significant quality improvement).
