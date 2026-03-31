---
title: "...it/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/003-graph-augmented-retrieval/plan]"
description: "Goal: Establish the sparse-first typed traversal foundation and intent-aware edge prioritization."
trigger_phrases:
  - "022"
  - "hybrid"
  - "rag"
  - "fusion"
  - "001"
  - "plan"
  - "003"
  - "graph"
importance_tier: "important"
contextType: "planning"
---
# Plan: Graph-Augmented Retrieval

> Phase 3 of 5 in the Research-Based Refinement track.

---

## Phase A: Traversal Policy (REQ-D3-001, REQ-D3-002)

**Goal:** Establish the sparse-first typed traversal foundation and intent-aware edge prioritization.

| Step | Description                                                | Req        |
| ---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

- | ---------------------------------------------------------- | ---------- |
| A.1  | Add `SPECKIT_TYPED_TRAVERSAL` flag to `graph-flags.ts`     | D3-001     |
| A.2  | Implement density check; disable communities when < 0.5    | D3-001     |
| A.3  | Default traversal to 1-hop typed expansion in `causal-boost.ts` | D3-001 |
| A.4  | Define intent-to-edge-type priority map                    | D3-002     |
| A.5  | Implement scored traversal: `seedScore * edgePrior * hopDecay * freshness` | D3-002 |
| A.6  | Wire intent-aware traversal into `adaptive-fusion.ts`      | D3-002     |
| A.7  | Unit tests: density gate, hop limit, per-intent traversal  | D3-001/002 |

**Exit Criteria:** Typed 1-hop traversal active under flag; intent-mapped edge priorities return correct ordering in tests.

---

## Phase B: Graph Lifecycle (REQ-D3-003, REQ-D3-004)

**Goal:** Keep the graph fresh on writes and populate it deterministically at save time.

| Step | Description                                                | Req        |
| ---- | ---------------------------------------------------------- | ---------- |
| B.1  | Create `graph-lifecycle.ts` with dirty-node tracking       | D3-003     |
| B.2  | Implement local recompute for small dirty components       | D3-003     |
| B.3  | Implement scheduled global refresh fallback                | D3-003     |
| B.4  | Add `SPECKIT_GRAPH_REFRESH_MODE` flag (`off`, `write_local`, `scheduled`) | D3-003 |
| B.5  | Hook `onWrite` into the save pipeline                      | D3-003     |
| B.6  | Implement deterministic extraction: headings, aliases, relation phrases, code-fence tech names | D3-004 |
| B.7  | Wire extraction output to typed-edge creation with `explicit_only` evidence | D3-004 |
| B.8  | Add `SPECKIT_LLM_GRAPH_BACKFILL` flag for async LLM enrichment | D3-004 |
| B.9  | Integration test: save a document, verify entities and edges created | D3-003/004 |

**Exit Criteria:** Writes mark dirty nodes and trigger local/scheduled refresh; save-time enrichment creates typed edges without LLM; LLM backfill gated behind flag.

---

## Phase C: Calibration & Communities (REQ-D3-005, REQ-D3-006)

**Goal:** Tune graph signal weights via ablation and demote community detection to a secondary layer.

| Step | Description                                                | Req        |
| ---- | ---------------------------------------------------------- | ---------- |
| C.1  | Build ablation harness: per-intent MRR@k and NDCG@k       | D3-005     |
| C.2  | Tune `graphWeightBoost` to cap Stage 2 bonus at ~0.05     | D3-005     |
| C.3  | Tune N2a/N2b caps in `rrf-fusion.ts`                      | D3-005     |
| C.4  | Add `SPECKIT_GRAPH_CALIBRATION_PROFILE` flag               | D3-005     |
| C.5  | Implement density + size threshold for Louvain activation  | D3-006     |
| C.6  | Ensure community scores are secondary (never first-rank)   | D3-006     |
| C.7  | Tests: ablation produces per-intent metrics; Louvain skipped below threshold | D3-005/006 |

**Exit Criteria:** Ablation report covers at least two intent categories; graph bonus within target range; Louvain only runs on qualifying components.

---

<!-- ANCHOR:dependencies -->
## Dependencies

| Dependency                                       | Direction |
| ------------------------------------------------ | --------- |
| Phase 2 (Query Intelligence & Reformulation)     | Incoming  |
| Existing `SPECKIT_CAUSAL_BOOST` flag             | Incoming  |
| Phase 4 (Feedback & Quality Learning)            | Outgoing  |

<!-- ANCHOR:summary -->
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
<!-- /ANCHOR:dependencies -->
<!-- /ANCHOR:dependencies -->


<!-- ANCHOR:rollback -->
<!-- /ANCHOR:rollback -->
