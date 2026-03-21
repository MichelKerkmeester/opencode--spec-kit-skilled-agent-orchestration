---
title: "Feature Specification: Graph-Augmented Retrieval"
description: "Implement sparse-first graph policy, intent-aware typed traversal, graph refresh on write, deterministic save-time enrichment, graph signal calibration, and communities as secondary layer."
# SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2
trigger_phrases: ["typed traversal", "graph refresh", "entity enrichment", "graph calibration", "sparse graph", "community detection"]
importance_tier: "important"
contextType: "implementation"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Graph-Augmented Retrieval

## Phase Context

| Field       | Value                                              |
| ----------- | -------------------------------------------------- |
| Phase       | 3 of 5                                             |
| Parent      | `../spec.md`                                       |
| Predecessor | `../002-query-intelligence-reformulation/spec.md`  |
| Successor   | `../004-feedback-quality-learning/spec.md`          |

---

## 1. Overview

Graph-Augmented Retrieval adds a knowledge-graph layer to the Hybrid RAG Fusion pipeline. Rather than treating the graph as a first-class ranker from day one, this phase adopts a **sparse-first** posture: typed 1-hop expansion by default, communities only when density justifies it, and deterministic save-time enrichment that keeps the graph fresh without runtime LLM calls.

Six requirements span traversal policy, lifecycle management, enrichment, calibration, and community detection.

---

## 2. Requirements

### REQ-D3-001: Sparse-First Graph Policy

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Research Ref | Research Item #4                                             |
| Size         | S                                                            |
| Flag         | `SPECKIT_TYPED_TRAVERSAL` (extends existing `SPECKIT_CAUSAL_BOOST`) |
| Files        | `causal-boost.ts`, `graph-flags.ts`                          |

**Behavior:**
- Default to **1-hop typed expansion** from seed nodes.
- Disable community detection when graph density < 0.5.
- Gate traversal depth and community toggle behind `SPECKIT_TYPED_TRAVERSAL`.

**Sketch:**

```ts
if (graphDensity < 0.5) {
  community = disabled;
  traversal = typed_1hop_only;
}
```

---

### REQ-D3-002: Intent-Aware Edge Traversal

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Research Ref | Research Item #5                                             |
| Size         | S                                                            |
| Flag         | `SPECKIT_TYPED_TRAVERSAL` (shared with REQ-D3-001)           |
| Files        | `causal-boost.ts`, `adaptive-fusion.ts`                      |

**Behavior:**
- Map classified query intents to edge-type priority orderings.
- Compute traversal score as a product of seed relevance, edge prior, hop decay, and freshness.

**Intent-to-Edge Priority Map:**

| Intent          | Edge Priority Order            |
| --------------- | ------------------------------ |
| `fix_bug`       | CORRECTION > DEPENDS_ON        |
| `add_feature`   | EXTENDS > DEPENDS_ON           |
| `find_decision` | PREFERENCE / CORRECTION        |

**Sketch:**

```ts
score = seedScore * edgePrior * hopDecay * freshness;
```

---

### REQ-D3-003: Graph Refresh on Write

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Research Ref | Research Item #13                                            |
| Size         | M                                                            |
| Flag         | `SPECKIT_GRAPH_REFRESH_MODE` (values: `off`, `write_local`, `scheduled`) |
| Files        | new `graph-lifecycle.ts`, save pipeline hooks                |

**Behavior:**
- On edge change, mark affected nodes as dirty.
- If the dirty component is small (below configurable threshold), recompute locally and synchronously.
- Otherwise, schedule a global refresh for background execution.

**Sketch:**

```ts
onWrite(edges) {
  markDirty(edges.nodes);
  if (component.size < threshold) {
    recomputeLocal();
  }
  scheduleGlobalRefresh();
}
```

---

### REQ-D3-004: Deterministic Save-Time Enrichment

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Research Ref | Research Item #14                                            |
| Size         | M                                                            |
| Flag         | Reuses `SPECKIT_AUTO_ENTITIES` + `SPECKIT_ENTITY_LINKING`; adds `SPECKIT_LLM_GRAPH_BACKFILL` |
| Files        | `entity-extractor.ts`, `entity-linker.ts`                    |

**Behavior:**
- FastGraphRAG-style deterministic extraction at save time: headings, aliases, relation phrases, code-fence technology names.
- Create typed edges with `evidence='explicit_only'` provenance.
- Async LLM backfill reserved for high-value documents only (gated by `SPECKIT_LLM_GRAPH_BACKFILL`).

**Sketch:**

```ts
onIndex(doc) =>
  extract({ modules, filenames, headings, quotes })
    .createTypedEdges(evidence = 'explicit_only');

onAsync(() => llmBackfillHighValueDocs());
```

---

### REQ-D3-005: Graph Signal Calibration

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Research Ref | Research Item #15                                            |
| Size         | M                                                            |
| Flag         | `SPECKIT_GRAPH_CALIBRATION_PROFILE`                          |
| Files        | `graph-signals.ts`, `rrf-fusion.ts`                          |

**Behavior:**
- Ablate graph signals by intent category, measuring MRR@k and NDCG@k.
- Tune `graphWeightBoost` and N2a / N2b caps per calibration profile.
- Target: total Stage 2 graph bonus capped at ~0.05 combined (down from current ~0.10).

**Sketch:**

```
Total Stage 2 graph bonus capped ~0.05 combined (down from current ~0.10)
```

---

### REQ-D3-006: Communities as Secondary Layer

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Research Ref | Research Item #29                                            |
| Size         | M                                                            |
| Flag         | Reuses `SPECKIT_COMMUNITY_DETECTION`                         |
| Files        | community detection modules                                  |

**Behavior:**
- Run Louvain community detection **only** on sufficiently large, dense components.
- Community membership is a secondary signal, never a first-rank scoring factor.
- Skip community computation entirely when density or size thresholds are not met.

**Sketch:**

```ts
if (component.density > threshold && size > minSize) {
  runLouvain();
} else {
  skipCommunity();
}
```

---

## 3. Success Criteria

| Criterion                     | Target                                              |
| ----------------------------- | --------------------------------------------------- |
| Graph precision               | Improved over baseline (measured via ablation)       |
| Graph operation latency       | < 50 ms for traversal and refresh operations         |
| Stale community data          | No stale community data in the hot retrieval path    |
| Deterministic enrichment      | All save-time extractions reproducible without LLM   |
| Calibration coverage          | Ablation results available per intent category       |

---

## 4. Risks

| Risk                          | Mitigation                                          |
| ----------------------------- | --------------------------------------------------- |
| Sparse graph instability      | Density gate disables features below threshold       |
| Computation cost              | Local recompute only for small components; global is scheduled |
| Stale `degree_snapshots`      | Dirty-node tracking triggers refresh                 |
| Enrichment noise flooding     | `explicit_only` evidence; LLM backfill gated and async |

---

## 5. Verification (Level 2)

- [ ] All feature flags documented and gated
- [ ] Unit tests per requirement
- [ ] Integration test: save-time enrichment round-trip
- [ ] Ablation report produced for at least two intent categories
- [ ] Latency benchmark confirms < 50 ms graph operations
- [ ] No stale community data observable in hot-path test<!-- ANCHOR:metadata -->
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->
