# W6-A4 — Sprint 1-2 decomposition

## Scope basis
- Consolidated sprint spec: `005-core-rag-sprints-0-to-8/spec.md` sections `011-graph-signal-activation` and `012-scoring-calibration`
- Epic spec: `001-hybrid-rag-fusion-epic/spec.md` phase map, handoff criteria, and requirements for S1/S2
- Hard gate: Sprint 0 exit gate must pass before either sprint starts
- Scheduling rule: Sprint 1 and Sprint 2 are parallel siblings after Sprint 0, and both must clear their exit criteria before Sprint 3 starts

## Planning assumptions
- All subtasks are sized to fit a 2-8 hour working block.
- "Critical path" means work that directly gates Sprint 1 exit, Sprint 2 exit, or Sprint 3 entry.
- Optional/in-scope extras from the sprint specs are included, but not all are on the critical path.

---

# Sprint 1 — Graph Signal Activation

## Sprint goal
Activate graph-derived ranking signal now that G1 is fixed, measure graph density and contribution, and produce enough evidence to decide whether sparse-graph remediation must be pulled forward.

## Sprint 1 subtasks

| ID | Est. | Critical path | Parallelizable | Description | Inputs | Outputs | Dependencies |
|---|---:|---|---|---|---|---|---|
| **S1-1** | 2-4h | **Yes** | No | Establish Sprint 1 implementation contract: confirm Sprint 0 gate artifacts, lock R4 parameters/edge weights, define dark-run metrics and hub-domination checks. | Sprint 0 eval DB, G1 fix, current `graph-search-fn.ts`, `rrf-fusion.ts`, epic requirements for R4/A7 | Task/test matrix, parameter sheet, dark-run checklist | Sprint 0 exit gate |
| **S1-2** | 5-7h | **Yes** | No | Implement typed-weighted degree computation in graph search, including edge-type weighting, degree caps, zero-edge fallback, and constitutional exclusion behavior. | S1-1 contract, graph schema, edge-type weights from spec | Degree score computation in `graph-search-fn.ts` with deterministic test cases | S1-1 |
| **S1-3** | 4-6h | **Yes** | Limited | Wire R4 in as the 5th RRF channel in fusion/search pipeline, behind `SPECKIT_DEGREE_BOOST`, including cache/invalidation behavior expected by the spec. | S1-2 degree outputs, `rrf-fusion.ts`, `hybrid-search.ts` | End-to-end degree channel integration, feature flag wiring, integration tests | S1-2 |
| **S1-4** | 2-4h | No | **Yes** | Raise co-activation boost strength (A7) and tune the interaction boundary between co-activation and the new degree signal so graph investment becomes visible without domination. | S1-1 parameter sheet, current `co-activation.ts`, R17 baseline | Updated co-activation multiplier/config and dark-run comparison notes | S1-1 |
| **S1-5** | 3-5h | **Yes** | **Yes** | Add edge-density measurement and trend logging to the R13 evaluation path; define the R10 escalation rule when density is below threshold. | Sprint 0 R13 schema, S1 success criteria, density threshold from spec | Density metric logged to eval DB, escalation decision template, verification query/report | S1-1 |
| **S1-6** | 4-6h | No | **Yes** | Add graph-channel contribution instrumentation for agent consumption patterns (G-NEW-2): log query, returned IDs, selected IDs, ignored IDs, and derive initial usage categories. | Sprint 0 logging hooks, current agent consumption path, S1-1 checklist | Consumption instrumentation, initial report scaffold with >=5 pattern buckets | S1-1 |
| **S1-7** | 3-5h | **Yes** | Limited | Run Sprint 1 dark-run and exit-gate validation: measure MRR@5 delta, check hub domination, verify density path, and decide whether R4 can be promoted or remains flag-gated. | S1-3, S1-4, S1-5, R13 baseline corpus | Exit-gate evidence pack, R4 go/no-go decision, Sprint 3 handoff inputs | S1-3, S1-4, S1-5 |
| **S1-8** | 3-5h | No | **Yes** | Complete remaining in-scope adjunct work not needed for the main gate: TM-08 vocabulary expansion and/or PI-A5 verify-fix-verify memory-quality loop if retained in this sprint plan. | Trigger vocabulary, `trigger-matcher.ts`, `memory-save.ts`, S1 implementation context | Secondary deliverables completed or explicitly deferred with rationale | S1-1 |

## Sprint 1 critical path
`S1-1 -> S1-2 -> S1-3 -> S1-7`

## Sprint 1 parallel work lanes
- **Lane A:** `S1-2 -> S1-3` (core R4 implementation)
- **Lane B:** `S1-4` (A7 tuning) can proceed after `S1-1`
- **Lane C:** `S1-5` (density instrumentation) can proceed after `S1-1`
- **Lane D:** `S1-6` and `S1-8` can run in parallel once the contract is locked

## Sprint 1 blocking outputs for Sprint 3
- R4 dark-run evidence with either `>+2%` MRR@5 lift or density-conditional correctness evidence
- Edge density measured and escalation decision recorded
- Hub-domination guard verified (`<60%` presence for any single memory)

---

# Sprint 2 — Scoring Calibration

## Sprint goal
Normalize the RRF/composite scale mismatch, calibrate weights so channel contributions are real rather than scale artifacts, and validate that scoring-side changes improve behavior without regressing retrieval quality.

## Sprint 2 subtasks

| ID | Est. | Critical path | Parallelizable | Description | Inputs | Outputs | Dependencies |
|---|---:|---|---|---|---|---|---|
| **S2-1** | 3-5h | **Yes** | No | Capture scoring baselines and choose normalization strategy (min-max vs z-score or equivalent bounded transform) using real R13 score distributions, target invariants, and rollback criteria. | Sprint 0 eval data, current RRF/composite distributions, Sprint 2 requirements | Normalization decision record, calibration dataset, acceptance thresholds | Sprint 0 exit gate |
| **S2-2** | 4-6h | No | **Yes** | Design and add embedding-cache schema/path (`content_hash + model_id`), including migration plan and cache invalidation rules. | Current indexing schema, re-index flow, S2 cache requirements | Cache table/schema update, migration/test plan | Sprint 0 exit gate |
| **S2-3** | 4-6h | No | Limited | Implement embedding-cache lookup/write/read-through behavior and verify >90% hit-rate path on unchanged re-indexes. | S2-2 schema, indexing pipeline, content-hash logic | Working cache path with benchmarks and stale-entry safeguards | S2-2 |
| **S2-4** | 3-5h | **Yes** | **Yes** | Trace the G2 double intent weighting anomaly across `hybrid-search.ts`, `intent-classifier.ts`, and `adaptive-fusion.ts`; decide whether it is a bug or intentional weighting design. | Current intent-weight flow, code in three locations, R13 baseline traces | Root-cause decision, patch plan or design note, before/after scoring traces | Sprint 0 exit gate |
| **S2-5** | 5-8h | **Yes** | Limited | Implement score normalization in `rrf-fusion.ts` and composite scoring, then expose/adjust channel weights so fusion behavior reflects calibrated contributions instead of raw scale mismatch. | S2-1 strategy, S2-4 intent-weight findings, current scoring code | Normalized scoring outputs in `[0,1]`, calibrated weight constants/config, regression tests | S2-1, S2-4 |
| **S2-6** | 3-5h | No | **Yes** | Implement N4 cold-start boost with the correct ordering relative to FSRS decay and feature-flag it for dark-run validation. | S2-1 invariants, current `composite-scoring.ts`, `fsrs-scheduler.ts` | Novelty boost implementation, timestamp test matrix, flag wiring | S2-1 |
| **S2-7** | 4-6h | No | **Yes** | Implement ancillary scoring calibrators from sprint scope: TM-01 interference scoring and TM-03 classification-based decay policy updates. | `memory_index` schema, `composite-scoring.ts`, `fsrs-scheduler.ts`, S2-1 strategy | Interference/decay calibration features with tests and config knobs | S2-1 |
| **S2-8** | 4-6h | **Yes** | Limited | Execute calibration validation: run dark-runs, compare pre/post distributions, sweep RRF K-values (FUT-5), verify MRR@5 is not regressed, and finalize the promoted weight set. | S2-3, S2-5, S2-6, R13 evaluation corpus | Final calibration report, optimal K recommendation, Sprint 2 exit evidence | S2-3, S2-5, S2-6 |

## Sprint 2 critical path
`S2-1 -> S2-4 -> S2-5 -> S2-8`

## Sprint 2 parallel work lanes
- **Lane A:** `S2-2 -> S2-3` (embedding cache)
- **Lane B:** `S2-4 -> S2-5` (intent-weight anomaly plus normalization)
- **Lane C:** `S2-6` (cold-start boost) after `S2-1`
- **Lane D:** `S2-7` (interference/decay calibrators) after `S2-1`

## Sprint 2 blocking outputs for Sprint 3
- Cache hit rate `>90%`
- G2 resolved and documented
- RRF and composite distributions normalized to `[0,1]`
- Calibrated weight set and K-value recommendation validated without material retrieval regression

---

# Cross-sprint dependency graph

## Key execution rule
Sprint 1 and Sprint 2 both start after the Sprint 0 exit gate and can run in parallel. Sprint 3 is blocked until **both** sprints clear their exit criteria.

```mermaid
flowchart TD
    S0[Sprint 0 exit gate]\n
    S0 --> S11[S1-1 contract and metrics]
    S11 --> S12[S1-2 degree computation]
    S12 --> S13[S1-3 R4 fusion integration]
    S11 --> S14[S1-4 A7 tuning]
    S11 --> S15[S1-5 density instrumentation]
    S11 --> S16[S1-6 consumption instrumentation]
    S11 --> S18[S1-8 adjunct work]
    S13 --> S17[S1-7 Sprint 1 dark-run]
    S14 --> S17
    S15 --> S17

    S0 --> S21[S2-1 normalization strategy]
    S0 --> S22[S2-2 cache schema]
    S0 --> S24[S2-4 G2 investigation]
    S22 --> S23[S2-3 cache implementation]
    S21 --> S25[S2-5 normalization and weight calibration]
    S24 --> S25
    S21 --> S26[S2-6 cold-start boost]
    S21 --> S27[S2-7 interference and decay updates]
    S23 --> S28[S2-8 Sprint 2 validation]
    S25 --> S28
    S26 --> S28

    S17 --> S3[Sprint 3 can start]
    S28 --> S3
```

## Dependency list
- **Global blocker:** `Sprint 0 exit gate -> {all Sprint 1 tasks, all Sprint 2 tasks}`
- **Sprint 1 gate path:** `S1-1 -> S1-2 -> S1-3 -> S1-7`, with `S1-4` and `S1-5` also feeding `S1-7`
- **Sprint 2 gate path:** `S2-1 -> S2-4 -> S2-5 -> S2-8`, with `S2-3` and `S2-6` also feeding `S2-8`
- **Sprint 3 blocker:** `Sprint 3 start <- Sprint 1 exit AND Sprint 2 exit`

## Highest-risk dependencies to watch
1. **Sparse graph risk (Sprint 1):** if density is `<0.5`, R4 may be technically correct but low-impact; the gate shifts to correctness plus escalation evidence.
2. **Intent-weight ambiguity (Sprint 2):** if G2 is intentional rather than a bug, weight calibration must absorb that decision before normalization is finalized.
3. **Shared evaluation dependency:** both sprints rely on Sprint 0's R13 data and dark-run framework, so instrumentation drift or poor baseline quality blocks both tracks simultaneously.

## Recommended staffing split
- **Engineer A / graph lane:** `S1-2`, `S1-3`, `S1-7`
- **Engineer B / graph observability lane:** `S1-5`, `S1-6`, `S1-8`
- **Engineer C / scoring lane:** `S2-1`, `S2-4`, `S2-5`, `S2-8`
- **Engineer D / indexing lane:** `S2-2`, `S2-3`, `S2-6`, `S2-7`

This preserves the spec-defined parallelism while keeping Sprint 3 blocked only on the minimum evidence-producing chains.
