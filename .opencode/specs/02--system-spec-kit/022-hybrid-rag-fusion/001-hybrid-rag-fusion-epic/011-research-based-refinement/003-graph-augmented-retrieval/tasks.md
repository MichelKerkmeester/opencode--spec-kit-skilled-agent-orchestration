# Tasks: Graph-Augmented Retrieval

> Tracks all implementation tasks across plan phases A, B, and C.

---

## Phase A: Traversal Policy

| #  | Task                                                       | Req     | Size | Status |
| -- | ---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

------------------------------------------------------- | ------- | ---- | ------ |
| 1  | Add `SPECKIT_TYPED_TRAVERSAL` flag to `graph-flags.ts`     | D3-001  | S    | [ ]    |
| 2  | Implement graph-density calculation utility                | D3-001  | S    | [ ]    |
| 3  | Add density-gated community toggle (disable when < 0.5)   | D3-001  | S    | [ ]    |
| 4  | Default traversal to typed 1-hop expansion in `causal-boost.ts` | D3-001 | S | [ ]    |
| 5  | Define intent-to-edge-type priority map (fix_bug, add_feature, find_decision) | D3-002 | S | [ ] |
| 6  | Implement scored traversal formula (`seedScore * edgePrior * hopDecay * freshness`) | D3-002 | M | [ ] |
| 7  | Wire intent-aware traversal into `adaptive-fusion.ts`      | D3-002  | S    | [ ]    |
| 8  | Unit tests: density gate enables/disables community        | D3-001  | S    | [ ]    |
| 9  | Unit tests: per-intent edge priority ordering              | D3-002  | S    | [ ]    |

---

## Phase B: Graph Lifecycle

| #  | Task                                                       | Req     | Size | Status |
| -- | ---------------------------------------------------------- | ------- | ---- | ------ |
| 10 | Create `graph-lifecycle.ts` with dirty-node tracking       | D3-003  | M    | [ ]    |
| 11 | Implement local recompute trigger for small dirty components | D3-003 | M    | [ ]    |
| 12 | Implement scheduled global refresh job                     | D3-003  | M    | [ ]    |
| 13 | Add `SPECKIT_GRAPH_REFRESH_MODE` flag (`off`, `write_local`, `scheduled`) | D3-003 | S | [ ] |
| 14 | Hook `onWrite` into the save pipeline                      | D3-003  | S    | [ ]    |
| 15 | Implement deterministic extraction pipeline (headings, aliases, relation phrases, code-fence tech names) | D3-004 | M | [ ] |
| 16 | Wire extraction to typed-edge creation with `explicit_only` evidence | D3-004 | S | [ ] |
| 17 | Add `SPECKIT_LLM_GRAPH_BACKFILL` flag and async backfill pathway | D3-004 | S | [ ] |
| 18 | Integration test: save document triggers dirty-node refresh | D3-003 | M    | [ ]    |
| 19 | Integration test: save-time enrichment creates expected entities and edges | D3-004 | M | [ ] |

---

## Phase C: Calibration & Communities

| #  | Task                                                       | Req     | Size | Status |
| -- | ---------------------------------------------------------- | ------- | ---- | ------ |
| 20 | Build ablation harness: per-intent MRR@k and NDCG@k measurement | D3-005 | M | [ ]    |
| 21 | Tune `graphWeightBoost` to cap total Stage 2 bonus at ~0.05 | D3-005 | S   | [ ]    |
| 22 | Tune N2a/N2b caps in `rrf-fusion.ts`                      | D3-005  | S    | [ ]    |
| 23 | Add `SPECKIT_GRAPH_CALIBRATION_PROFILE` flag               | D3-005  | S    | [ ]    |
| 24 | Implement density + size threshold config for Louvain activation | D3-006 | S | [ ]  |
| 25 | Ensure community scores are secondary-only in ranking pipeline | D3-006 | S  | [ ]    |
| 26 | Unit test: Louvain skipped when component below threshold  | D3-006  | S    | [ ]    |
| 27 | Unit test: ablation harness produces per-intent metrics    | D3-005  | S    | [ ]    |
| 28 | Latency benchmark: confirm graph operations < 50 ms        | All     | S    | [ ]    |

---

## Summary

| Phase | Tasks | S | M | Status    |
| ----- | ----- | - | - | --------- |
| A     | 9     | 8 | 1 | Not started |
| B     | 10    | 4 | 6 | Not started |
| C     | 9     | 7 | 2 | Not started |
| **Total** | **28** | **19** | **9** | **Not started** |

<!-- ANCHOR:notation -->
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
<!-- /ANCHOR:cross-refs -->
