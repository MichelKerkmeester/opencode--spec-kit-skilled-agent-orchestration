# Wave 2: Optimized Roadmap

> **Purpose:** Dependency graph validation, critical path analysis, effort recalibration, and subsystem-grouped rollout
> **Date:** 2026-02-26
> **Inputs:** 141 synthesis document (sections 8-11), Wave 1 priority analysis
> **Method:** Codebase-verified dependency tracing + subsystem-aware scheduling

---

## 1. Dependency Graph Validation

### 1.1 Verified Dependencies (Correct)

| Dependency | Verification | Evidence |
|---|---|---|
| **G1 -> R4** | CONFIRMED | [SOURCE: `graph-search-fn.ts:110`] Graph emits `id: "mem:${row.id}"` where `row.id` is the causal *edge* ID. [SOURCE: `rrf-fusion.ts:96,156`] RRF uses `scoreMap.get(item.id)` -- string `"mem:123"` never matches numeric `123`. R4 degree scoring is pointless until G1 fixes ID format. |
| **G1 -> N2** | CONFIRMED | N2 items 1-3 require functional graph channel. Wave 1 confirmed graphHitRate = 0%. |
| **R7 needs chunks to exist** | CONFIRMED | [SOURCE: `anchor-chunker.ts:102-103,232-238`] Chunk thinning operates on existing anchor chunks. No dependency on R8 summaries. |

### 1.2 Challenged Dependencies (Incorrect or Overstated)

| Claimed Dependency | Assessment | Rationale |
|---|---|---|
| **R4 needs R13** | OVERSTATED | R4 can be implemented, tested locally with unit tests, and deployed behind a feature flag without evaluation infrastructure. R13 is needed to *measure impact*, not to *implement*. The dependency is "should have" not "must have." Realistic order: G1 -> R4 (implement+flag) -> R13 Sprint 1 (measure) -> enable R4 based on data. |
| **R1 needs R13** | OVERSTATED | Same reasoning. MPAB is a self-contained formula change with deterministic behavior. Unit-testable independently. R13 validates the decision to enable it, not the ability to build it. |
| **R6 -> R7** | INCORRECT | The 141 doc claims R6 (pipeline refactor) should precede R7 (chunk thinning). But chunk thinning operates at *index time* (thinning stored chunks), not at *search time* (pipeline stages). These are orthogonal subsystems. R7 can be implemented independently. |
| **R8 -> R7** | INCORRECT | 141 implies summaries (R8) feed into chunk thinning (R7). But R7's thinning criterion is chunk-to-parent *similarity*, not chunk-to-summary similarity. R8 adds a summary column; R7 compares chunk embeddings to parent embedding. No actual dependency. |
| **R6 -> R8** | WEAK | Summaries (R8) are generated at save time, stored as a column. The pipeline refactor (R6) restructures search-time stages. R8's search-time benefit (summary-based pre-filtering) could be added to either pipeline version. |

### 1.3 Corrected Dependency Graph

```
                     G1 (Fix graph IDs) ---- URGENT, UNBLOCKS GRAPH
                      |
                      v
                     R4 (Degree channel) ---- can implement before R13
                      |
                      v
              R13-S1 (Eval Sprint 1) ---- ENABLE R4 based on data
             /    |    \       \
            v     v     v       v
          R1    R14/N1  R11   R15 (all measurable via R13)

  INDEPENDENT TRACKS (no cross-deps):

  Track A (Quick wins):       G3, R17, N4, R18
  Track B (Graph):            G1 -> R4 -> N2(4-6)
  Track C (Measurement):      R13-S1 -> R13-S2
  Track D (Scoring tweaks):   R1, R14/N1, R2, R16
  Track E (Pipeline/Index):   R6, R7, R8, R9 (all independent of each other)
  Track F (Feedback loop):    R11 (needs R13 data, not R13 code)
  Track G (Advanced):         R10, N3, S1-S5
```

### 1.4 True Critical Path

The critical path (longest chain of hard dependencies) is:

```
G1 (2-4h) -> R4 (8-12h) -> R13-S1 (20-25h) -> R14/N1 (8-10h) -> R6 (30-40h)
Total: ~70-90h elapsed
```

Everything else can run in parallel to this chain.

---

## 2. Effort Estimate Recalibration

### 2.1 Wave 1 Correction Pattern

Wave 1 identified that 141's LOC-based estimates undercount by 2-3x due to missing test code, feature flags, schema migrations, and integration wiring. Applying this systematically:

| Rec | 141 Estimate | Wave 1 Corrected | Wave 2 Realistic (incl. integration) | Rationale |
|---|---|---|---|---|
| G1 | 2-4h | 2-4h | 3-5h | Simple but needs RRF integration testing |
| G2 | 2-4h | 3-5h | 4-6h | Requires full call-chain tracing; may be non-issue |
| G3 | 2-3h | 2-3h | 2-4h | Accurate |
| R1 | ~50 LOC | 6-8h | 8-12h | Formula + tests + flag + dark-run comparison + edge cases (N=0, N=1, N=many) |
| R4 | ~40 LOC | 8-12h | 12-16h | Batch edge query, typed weighting, normalization, cap, constitutional exclusion, tests |
| R13-S1 | 23h | 20-25h | 25-35h | Schema, logging hooks in 6+ handler files, metric computation, ground truth seeding |
| R13-S2 | 15h | 15h | 15-20h | Shadow scoring wiring, channel attribution |
| R14/N1 | ~80 LOC | 8-10h | 10-14h | Fusion algorithm + A/B wiring + comparison analysis |
| R15 | ~100 LOC | 8-12h | 10-16h | Classifier + routing + per-complexity-level config + edge cases |
| R17 | ~5 LOC | 1-2h | 1-2h | Accurate -- truly trivial |
| R18 | ~50 LOC | 6-8h | 8-12h | Schema migration, cache lookup, invalidation, model_id handling |
| N4 | ~15 LOC | 2-4h | 3-5h | Composite scoring addition + timestamp logic + tests |
| R6 | "Low risk" | 30-40h | 40-55h | Major refactor of core search path; 158+ tests must pass |
| R11 | ~20 LOC | 12-16h | 16-24h | Safeguards are complex: provenance, TTL, denylist, cap, threshold logic |
| R2 | not explicit | not explicit | 6-10h | Post-fusion injection + quality floor + tests |
| R7 | ~100 LOC | ~100 LOC | 10-15h | Similarity computation, anchor preservation, checkpoint logic |
| R8 | not explicit | 15-20h | 15-20h | Schema migration + LLM call integration |
| R9 | not explicit | 4-6h | 5-8h | Confidence classifier + pre-filter logic |
| R16 | ~15 LOC | 4-6h | 5-8h | Column addition + intent capture at save + congruence scoring |
| N2(4-6) | 20-30h | 20-30h | 25-35h | Community detection, betweenness centrality -- research-grade |

### 2.2 Total Effort: Realistic Range

| Category | 141 Estimate | Wave 2 Estimate | Delta |
|---|---|---|---|
| P0 Bugs (G1, G3) | 4-7h | 5-9h | +25% |
| P0 Foundation (R13-S1) | 23h | 25-35h | +30% |
| P0 Core (R4, G1 already counted) | 8-12h | 12-16h | +40% |
| P1 Scoring (R1, R14/N1, R15, R17, R18, N4) | ~30-40h | 40-61h | +50% |
| P1 Feedback (R11, R2, G2) | ~20-25h | 26-40h | +50% |
| P2 Pipeline (R6, R7, R8, R9, R16, S2-S4) | ~60-80h | 80-121h | +45% |
| P3 Advanced (R10, N3, N2(4-6), S1, S5) | ~40-60h | 50-80h | +30% |
| **TOTAL** | **130-165h** | **238-362h** | **~2x original** |

**Bottom line:** 141's 130-165h estimate should be read as **240-360h** of actual implementation time. The Wave 1 observation of 2-3x underestimate is confirmed across the full set.

---

## 3. Phase Grouping Analysis: Risk-Based vs Subsystem-Based

### 3.1 Current Approach (141): Risk-Based Phases

```
Phase 0: Bug fixes + Foundation     (G1-G4, R13-S1)     -- mixed subsystems
Phase 1: Low-risk scoring           (R1, R4, N4, R16)    -- scoring subsystem + graph
Phase 2: Query + feedback           (R2, R11, R12, R14/N1, R15, R18) -- mixed
Phase 3: Infrastructure + pipeline  (R6, N2, R8, R7, R9, R17) -- mixed
Phase 4: Advanced                   (S1-S5, N3, R10, R13-S3) -- mixed
```

**Problem with risk-based grouping:** Every phase touches 3-4 different subsystems (scoring, graph, pipeline, indexing). Engineers must context-switch constantly. Phase 2 alone touches fusion (R14/N1), query routing (R15), feedback (R11), filtering (R2), caching (R18), and expansion (R12).

### 3.2 Alternative: Subsystem-Based Grouping

The codebase has clear subsystem boundaries:

| Subsystem | Files | Recommendations |
|---|---|---|
| **Graph** | `graph-search-fn.ts`, `causal-boost.ts`, `fsrs.ts` | G1, R4, R17, N2(4-6), R10 |
| **Fusion/Scoring** | `rrf-fusion.ts`, `adaptive-fusion.ts`, composite (new) | R1, R2, R14/N1, N4, R16 |
| **Pipeline** | `hybrid-search.ts` | R6, R15 |
| **Indexing/Storage** | `vector-index-impl.ts`, `anchor-chunker.ts`, `memory-save.ts` | R7, R8, R18, S1, S2, S5 |
| **Search Handlers** | `memory-search.ts` | R9, R11, R12 |
| **Evaluation** | new: `eval-db`, `eval-logger` | R13 |
| **Logic Layer** | spec-kit scripts | S1-S5 |

### 3.3 Verdict: Hybrid Approach (Subsystem-Grouped Within Risk Gates)

Pure subsystem grouping ignores the critical path (R13 measurement gates). Pure risk grouping causes context-switching. The optimal approach groups by subsystem but gates releases on measurement milestones.

---

## 4. Quick Win Validation

### 4.1 G1-G4 Assessment

| Item | "Quick Win"? | Actual Assessment |
|---|---|---|
| **G1** (graph ID mismatch) | YES | 3-5h. Change `id: "mem:${row.id}"` to emit `source_id` or `target_id` as numeric IDs in `graph-search-fn.ts:110`. Verify RRF merge. Clear quick win. |
| **G2** (double intent weighting) | MAYBE NOT | Wave 1 downgraded to P1. Requires tracing full intent application chain across `adaptive-fusion.ts`, `hybrid-search.ts`, and any downstream scoring. May not be a bug at all. 4-6h investigation, not a quick fix. |
| **G3** (chunk collapse) | YES | 2-4h. Conditional logic fix in `memory-search.ts:303,1003`. Clear quick win. |
| **G4** (wire learnFromSelection) | NO | Wave 1 correctly merged into R11 (P1). Wiring without safeguards is dangerous. With safeguards = 16-24h. Not a quick win. |

**Conclusion:** Only G1 and G3 are genuine quick wins. G2 needs investigation. G4 is a feature, not a fix.

### 4.2 Other Quick Wins Identified

| Item | Hours | Why Quick |
|---|---|---|
| **R17** (fan-effect divisor) | 1-2h | Literal single-line formula change. [SOURCE: 141 section R17 code diff] |
| **N4** (cold-start boost) | 3-5h | ~15 LOC addition to composite scoring with exponential decay. Self-contained. |
| **R18** (embedding cache) | 8-12h | Independent infrastructure, no ranking impact. Schema + cache lookup. |

---

## 5. Optimized Rollout

### Design Principles

1. **Subsystem coherence:** Group work by code area to minimize context-switching
2. **Measure-then-enable:** Build behind flags, measure via R13, then enable
3. **True dependencies only:** Do not block on "nice to have" dependencies
4. **Quick wins first:** Ship small, safe changes immediately for momentum
5. **Go/no-go gates:** Data-driven decisions between phases, not time-based

### Sprint 0: Quick Wins + Graph Fix (5-11h, ~1 week)

**Subsystem focus:** Graph channel + search handlers

| # | Item | Hours | Subsystem | Go/No-Go Criteria |
|---|---|---|---|---|
| 0.1 | **G1:** Fix graph channel ID format | 3-5h | Graph | Graph results appear in RRF fusion (graphHitRate > 0%) |
| 0.2 | **G3:** Fix chunk collapse dedup | 2-4h | Search handlers | No duplicate chunk rows in default search mode |
| 0.3 | **R17:** Fan-effect divisor | 1-2h | Graph/co-activation | Hub nodes no longer flood activation network |

**Gate 0 -> Sprint 1:** G1 verified (graph results appearing). G3 verified (no duplicates).

### Sprint 1: Measurement Foundation (25-35h, ~2 weeks)

**Subsystem focus:** Evaluation infrastructure (new code, no existing system changes)

| # | Item | Hours | Subsystem | Go/No-Go Criteria |
|---|---|---|---|---|
| 1.1 | **R13 Sprint 1:** Eval DB schema, logging hooks, pipeline instrumentation | 20-28h | Evaluation (new) | Queries logged with channel attribution |
| 1.2 | **R13 Ground Truth A:** Synthetic pairs from trigger phrases | 5-7h | Evaluation (new) | Baseline MRR@5, NDCG@10, Recall@20 computed |

**Gate 1 -> Sprint 2:** Baseline metrics captured for at least 50 queries. MRR@5, NDCG@10, Recall@20 have concrete values.

### Sprint 2: Graph + Scoring (18-33h, ~2 weeks)

**Subsystem focus:** Graph channel enhancement + fusion/scoring tweaks

| # | Item | Hours | Subsystem | Go/No-Go Criteria |
|---|---|---|---|---|
| 2.1 | **R4:** Typed-weighted degree as 5th RRF channel (behind flag) | 12-16h | Graph | Dark-run: no single memory in >60% of results |
| 2.2 | **N4:** Cold-start boost with exponential decay (behind flag) | 3-5h | Scoring | New memories (<48h) appear when relevant |
| 2.3 | **R1:** MPAB chunk-to-memory aggregation (behind flag) | 8-12h | Scoring | Dark-run: MRR@10 improves or stays within 2% |
| 2.4 | Enable R4 + N4 if dark-run passes | 0h | -- | Eval metrics improve >= 3% MRR@10 combined |

**Gate 2 -> Sprint 3:** R4 dark-run shows graph channel contributing meaningfully (channel attribution > 5%). N4 dark-run shows no regression. R1 dark-run shows no regression for N=1 memories.

### Sprint 3: Query Intelligence (18-30h, ~2 weeks)

**Subsystem focus:** Pipeline routing + alternative fusion

| # | Item | Hours | Subsystem | Go/No-Go Criteria |
|---|---|---|---|---|
| 3.1 | **R15:** Query complexity router (behind flag) | 10-16h | Pipeline | Simple query latency < 30ms; complex queries get deeper retrieval |
| 3.2 | **R14/N1:** Relative Score Fusion parallel to RRF (behind flag) | 10-14h | Fusion | Shadow comparison: Kendall tau vs RRF on eval corpus |
| 3.3 | **G2:** Investigate double intent weighting | 4-6h | Fusion | Determine if bug exists; fix if confirmed |
| 3.4 | Enable R15 if latency targets met | 0h | -- | p95 latency for simple queries < 30ms |

**Gate 3 -> Sprint 4:** R15 latency validated. R14/N1 shadow comparison data collected (minimum 100 queries). G2 resolved (fixed or marked non-issue).

### Sprint 4: Operational Efficiency + Feedback (27-41h, ~2 weeks)

**Subsystem focus:** Indexing/caching + feedback loop

| # | Item | Hours | Subsystem | Go/No-Go Criteria |
|---|---|---|---|---|
| 4.1 | **R18:** Embedding cache for re-index | 8-12h | Indexing | Re-index of unchanged files requires 0 API calls |
| 4.2 | **R2:** Channel minimum-representation | 6-10h | Fusion | Top-3 precision within 5% of baseline (via R13) |
| 4.3 | **R11:** Learned relevance feedback with full safeguards | 16-24h | Search handlers | Shadow-log 1 week shows < 5% noise rate |
| 4.4 | **R13 Sprint 2:** Shadow scoring, channel attribution, ground truth Phase B | 15-20h | Evaluation | Full A/B comparison infrastructure operational |

**Gate 4 -> Sprint 5:** R18 cache hit rate > 90% on re-index. R11 shadow log reviewed manually. R13-S2 operational.

### Sprint 5: Pipeline Refactor (45-70h, ~3 weeks)

**Subsystem focus:** Core pipeline restructuring

| # | Item | Hours | Subsystem | Go/No-Go Criteria |
|---|---|---|---|---|
| 5.1 | **Checkpoint:** `memory_checkpoint_create("pre-pipeline-refactor")` | -- | -- | Verified |
| 5.2 | **R6:** 4-stage pipeline refactor (dark-run) | 40-55h | Pipeline | 0 ordering differences on eval corpus vs current pipeline |
| 5.3 | **R9:** Spec folder pre-filter | 5-8h | Pipeline | Cross-folder queries produce identical results |

**Gate 5 -> Sprint 6:** R6 dark-run produces identical results to current pipeline on full eval corpus. All 158+ existing tests pass.

### Sprint 6: Index Optimization + Advanced Graph (25-42h, ~2 weeks)

**Subsystem focus:** Indexing/chunking + graph deepening

| # | Item | Hours | Subsystem | Go/No-Go Criteria |
|---|---|---|---|---|
| 6.1 | **R7:** Anchor-aware chunk thinning | 10-15h | Indexing | Recall@20 within 10% of baseline |
| 6.2 | **R16:** Encoding-intent capture | 5-8h | Indexing/scoring | Intent stored on save; congruence boost measurable |
| 6.3 | **N2(4-6):** Graph centrality, community detection | 25-35h | Graph | Graph channel attribution increases >10% |

**Gate 6 -> Sprint 7:** R7 recall validated. N2 graph features show measurable contribution.

### Sprint 7: Long Horizon (50-80h, as needed)

**Subsystem focus:** Advanced features, logic layer

| # | Item | Hours | Subsystem | Go/No-Go Criteria |
|---|---|---|---|---|
| 7.1 | **R10:** Auto entity extraction | 12-18h | Graph/indexing | False positive rate < 20% |
| 7.2 | **N3:** Memory consolidation background process | 30-40h | Background/graph | Auto-created links are useful (manual review) |
| 7.3 | **S1-S5:** Spec-kit logic layer improvements | 20-30h | Logic layer | Template + validation enhancements |
| 7.4 | **R8:** Memory summaries (if scale warrants) | 15-20h | Indexing | Only if memory count > 5K |
| 7.5 | **R13 Sprint 3:** Full reporting + ablation | 12-16h | Evaluation | Weekly reports auto-generated |
| 7.6 | Evaluate R5 (quantization) need | 2h | -- | Decision based on scale metrics |

---

## 6. Summary Comparison: 141 vs Optimized

| Dimension | 141 Original | Optimized (This Document) |
|---|---|---|
| **Phases** | 4 phases (risk-grouped) | 7 sprints (subsystem-grouped with measurement gates) |
| **Estimated hours** | 130-165h | 238-362h (realistic, 2x original) |
| **Timeline** | 12 weeks | 16-20 weeks (2x honest) |
| **Context switches per phase** | 3-4 subsystems per phase | 1-2 subsystems per sprint |
| **Measurement gate** | Phase 0 only (R13) | Every sprint has go/no-go data criteria |
| **Critical path** | Unclear | G1 -> R4 -> R13-S1 -> measure -> enable (70-90h) |
| **Quick wins** | G1-G4 (but G2/G4 aren't quick) | G1, G3, R17 only (genuinely quick) |
| **Build-vs-enable separation** | Not explicit | All scoring changes built behind flags, enabled by data |

### Key Differences from 141

1. **G2 moved out of quick wins** -- requires investigation, may not be a bug
2. **G4 merged into R11** -- not a standalone fix; needs safeguards
3. **R4 does not hard-depend on R13** -- can build and test locally, enable after measurement
4. **R6 does not block R7/R8** -- orthogonal subsystems (search-time vs index-time)
5. **R8 downgraded further** -- defer until 5K+ memories (Wave 1 already said P3)
6. **Every sprint is subsystem-coherent** -- maximum 2 subsystems touched per sprint
7. **Go/no-go gates are data-driven** -- specific metric thresholds, not time-based
8. **Realistic timeline is 16-20 weeks**, not 12

---

## 7. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| R13-S1 takes longer than estimated (35h+) | HIGH | Delays all measurement-dependent work | Descope to core logging + MRR@5 only; defer NDCG/Recall to S2 |
| G1 fix causes unexpected graph result flood | MED | Low-quality graph results degrade rankings | G1 deployed behind existing `SPECKIT_GRAPH_UNIFIED` flag; monitor graphHitRate |
| R4 hub domination despite cap | MED | Constitutional memories dominate | Cap at 0.15, exclude constitutional tier from degree boost, monitor diversity |
| R6 pipeline refactor introduces subtle regressions | HIGH | Core search broken | Mandatory dark-run, checkpoint before deploy, all 158 tests must pass |
| Effort estimates still undercount | HIGH | Timeline extends beyond 20 weeks | Track actual vs estimated per sprint; recalibrate remaining after Sprint 2 |
| R11 trigger pollution despite safeguards | MED | Learned triggers degrade recall | Shadow-log period mandatory; provenance tracking enables bulk cleanup |
