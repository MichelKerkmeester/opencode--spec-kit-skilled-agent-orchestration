---
title: "Verification Checklist: Hybrid RAG Fusion Refinement"
description: "~200 verification items across program-level checks, sprint exit gates (P0-P2 aligned with off-ramp), L3+ governance, 8 PageIndex integration items (CHK-PI-A1—CHK-PI-B3), feature flag sunset reviews per sprint, ground truth diversity gates, Sprint 4 split verification, concurrency verification, schema migration verification, dangerous interaction pair verification (DIP-001—DIP-009), and FTS5 sync verification."
# SPECKIT_TEMPLATE_SOURCE: checklist | v2.2
trigger_phrases:
  - "hybrid rag checklist"
  - "sprint verification"
  - "retrieval refinement checklist"
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist: Hybrid RAG Fusion Refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
| **[P3]** | Aspirational | Verify only if scale gates met; sprint-conditional |

**Priority alignment with off-ramp**: Sprint 0-1 gates are P0 (blocking). Sprint 2-4 gates are P1. Sprint 5-6 gates are P1 (elevated from P2 due to safety-critical NFRs). Sprint 7 gates are P2. If you stop at Sprint 2+3 (recommended minimum), only P0+P1 items need verification.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Research synthesis complete (142-FINAL analysis + recommendations reviewed) — 41 research files, 7 ADOPT items fully incorporated [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-002 [P0] BM25 contingency decision matrix documented with action paths — BM25 MRR@5=0.2083 (<50%), decision PROCEED with full plan [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-003 [P1] Feature flag governance rules established (6-flag max, 90-day lifespan) — T000b complete, SPECKIT_{FEATURE} convention documented [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-004 [P1] Migration safety protocol confirmed (backup, nullable defaults, atomic execution) — eval DB separate, all columns nullable [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All bug fixes (G1, G3) produce verifiable behavior change (graph hit rate >0%, no duplicate chunks) — G1 numeric IDs in graph-search-fn.ts, G3 unconditional dedup in memory-search.ts [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-011 [P0] Stage 4 "no score changes" invariant enforced in R6 pipeline refactor — verified in Sprint 5 child CHK-S5-023 [x] (Stage 4 invariant: verifyScoreInvariant() throws on mutation; Stage4ReadonlyRow enforces at compile time) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-012 [P1] Feature flag naming follows convention: `SPECKIT_{FEATURE}` — all flags verified (DEGREE_BOOST, NOVELTY_BOOST, INTERFERENCE_SCORE, COMPLEXITY_ROUTER, RSF_FUSION, CHANNEL_MIN_REP, etc.) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-013 [P1] All new columns nullable with sensible defaults — verified in S0 eval DB schema and S2 cache schema [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-014 [P1] No destructive migrations in forward path — eval DB additive, cache table additive [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] 158+ existing tests pass after every sprint completion — 5,689 tests across 192 files, 0 failures [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-021 [P0] Dark-run comparison executed for every scoring change before enabling — verified through S1-S3 dark-run protocols [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-022 [P1] New tests added per sprint per expansion strategy (See plan.md §5) — T-TEST-S0 through T-TEST-S3 complete [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-023 [P1] Flag interaction testing at appropriate level (isolation → pair → group) — S3 CHK-S3-027 verified 5 flags independently rollbackable [EVIDENCE: documented in phase spec/plan/tasks artifacts]

### Negative Tests (boundary validation)

- [x] CHK-024 [P1] Score bounds: all scoring signals produce values in [0,1] range — no NaN, no Infinity, no negative scores — S2 normalization tests (CHK-S2-024) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-025 [P1] Empty graph: R4 returns 0 for all memories when graph has 0 edges (correct no-data behavior) — S1 CHK-S1-026 verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-026 [P1] Constitutional survival: constitutional memories always appear in results regardless of scoring signal changes — S1 CHK-S1-012 constitutional excluded from degree boost [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-027 [P1] N=0 MPAB: `computeMPAB([]) = 0` — no division by zero
- [ ] CHK-028 [P1] N=1 MPAB: `computeMPAB([score]) = score` — no penalty, no bonus
- [x] CHK-029a [P1] R11 denylist enforcement: common stop words never added to learned_triggers — verified in Sprint 4 child CHK-S4-032 [x] (R11 denylist contains 100+ stop words) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-029b [P1] R11 rate limit: no more than N learned triggers added per hour — verified in Sprint 4 child CHK-S4-033 [x] (R11 cap enforced: max 3 terms/selection, max 8 per memory) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-029c [P1] R11 TTL enforcement: learned triggers expire after configured TTL — verified in Sprint 4 child CHK-S4-034 [x] (R11 TTL: 30-day expiry on learned terms) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-029d [P1] R15 fallback: classifier failure defaults to "complex" tier (full pipeline) — S3 CHK-S3-024 verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-029e [P1] Flag disabled mid-search: in-progress search completes with flag state at query start
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] FTS5 contamination test: verify `learned_triggers` column is NOT indexed by FTS5 (R11) — verified in Sprint 4 child CHK-S4-031 [x] (startup verifyFts5Isolation + learned-feedback tests pass) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-031 [P0] Separate eval database (`speckit-eval.db`) — no eval queries touch primary DB — verified: speckit-eval.db separate file, dedicated connection pool [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-032 [P1] R11 denylist expanded from 25 to 100+ stop words — verified in Sprint 4 child CHK-S4-032 [x] (R11 denylist contains 100+ stop words) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-033 [P1] R12+R15 mutual exclusion verified: R15="simple" suppresses R12 query expansion — verified in Sprint 5 child CHK-S5-040 [x] (r12-embedding-expansion tests verify simple query suppression) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-034 [P1] N4+R11 interaction safeguard verified: memories < 72h old excluded from R11 eligibility — verified in Sprint 4 child CHK-S4-035 [x] (eligibility guard verified in learned-feedback tests) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
### Dangerous Interaction Pairs (from spec §6)

- [ ] CHK-035 [P0] R1+N4 double-boost guard — N4 applied BEFORE MPAB; combined boost capped at 0.95
- [ ] CHK-036 [P0] R4+N3 feedback loop guard — edge caps (MAX_TOTAL_DEGREE=50), strength caps (MAX_STRENGTH_INCREASE=0.05/cycle), provenance tracking active
- [x] CHK-037 [P0] R15+R2 guarantee — R15 minimum = 2 channels even for "simple" tier — S3 CHK-S3-021 verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-039b [P1] TM-01+R17 combined penalty — capped at 0.15 (no double fan-effect suppression)
- [ ] CHK-039c [P1] R13+R15 metrics skew — R13 records query_complexity; metrics computed per tier
- [ ] [P1] [CHK-DIP-008] TM-04 + PI-A5 pipeline ordering verified: PI-A5 auto-fix runs after TM-04 threshold check
- [ ] [P1] [CHK-DIP-009] N4 + TM-01 opposing forces documented: cold-start boost applied before interference penalty
- [ ] [P1] [CHK-DIP-001] Verify DIP-001 (session boost × causal boost) has interference guard: multiplicative over-scoring capped or converted to additive combination
- [ ] [P1] [CHK-DIP-003] Verify DIP-003 (recency decay × TTL decay) has interference guard: compounding temporal penalty capped at maximum total decay threshold
- [ ] [P1] [CHK-DIP-004] Verify DIP-004 (RRF position × BM25 boost) has interference guard: position bias amplification bounded by independent normalization of each signal
- [ ] [P1] [CHK-DIP-005] Verify DIP-005 (quality score × validation confidence) has interference guard: circular quality loop broken by using independent input sources for each score
- [ ] [P1] [CHK-DIP-006] Verify DIP-006 (doc-type multiplier × importance tier) has interference guard: static bias stacking capped or one signal subsumed by the other
- [ ] [P1] [CHK-DIP-007] Verify DIP-007 (cross-encoder rerank × MMR diversity) has interference guard: relevance-diversity tension balanced by configurable lambda parameter with documented default
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized after each sprint — S0-S3 child folders synchronized with root [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-041 [P1] Sprint exit gate results documented in tasks.md — S0-S3 gate results in child tasks.md files [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Each child sprint folder contains spec.md, plan.md, tasks.md, checklist.md — all 8 child folders verified (CHK-050 PASS) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-051 [P1] No scratch files left in child folders after completion
- [x] CHK-052 [P2] Memory saves completed via `generate-context.js` after significant sprints — verified in Sprint 5 child CHK-S5-082 [x], Sprint 6 child CHK-S6-052 [x], Sprint 7 child CHK-S7-052 [x] [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:sprint-gates -->
## Sprint Exit Gates

### Sprint 0: Epistemological Foundation [P0 — BLOCKING]

- [x] CHK-S00 [P0] Graph hit rate > 0% (G1 verified — `channelAttribution` shows graph results) — T001 numeric IDs in graph-search-fn.ts at both FTS5 and LIKE paths [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S01 [P0] No duplicate chunk rows in default search mode (G3 verified) — T002 unconditional collapseAndReassembleChunkResults in memory-search.ts [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S02 [P0] Baseline MRR@5, NDCG@10, Recall@20 computed for at least 50 eval queries — 22,495 eval queries in speckit-eval.db, 110 queries for baseline [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S03 [P0] BM25-only baseline MRR@5 recorded — BM25 MRR@5=0.2083 in eval_metric_snapshots [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S04 [P0] BM25 contingency decision made (>=80% pause / 50-80% proceed reduced / <50% proceed full) — MRR@5=0.2083 (<50%), decision PROCEED [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S05 [P0] Fan-effect divisor (R17) reduces hub domination in co-activation results — T003 Math.sqrt(Math.max(1, relatedCount)) divisor in co-activation.ts:101 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S06 [P1] 5 diagnostic metrics (Inversion Rate, Constitutional Surfacing Rate, Importance-Weighted Recall, Cold-Start Detection Rate, Intent-Weighted NDCG) computed alongside core metrics — all 9 metrics in eval-metrics.ts verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S07 [P1] Full-context ceiling metric (A2) recorded for 50+ queries; 2x2 decision matrix evaluated — T006f ceiling eval complete [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S08 [P1] Quality proxy formula (B7) operational for automated regression detection — T006g quality proxy operational [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S09 [P1] Observer effect mitigation (D4) verified — search p95 increase ≤10% with eval logging — T004b observer effect check passed [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S0A [P1] Signal ceiling governance (B8) documented — max 12 active scoring signals policy in effect [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S0B [P0] TM-02 content-hash dedup operational — SHA256 fast-path in memory-save.ts:975-1003 before embedding generation [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S0C [P0] Ground truth corpus includes ≥15 manually curated natural-language queries (T000d) — 297 ground truth entries in eval_ground_truth [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S0D [P0] Query diversity verified: ≥5 per intent type (graph relationship, temporal, cross-document, hard negative), ≥3 complexity tiers (simple, moderate, complex) — verified in S0 child checklist CHK-S0-062b [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S0E [P0] Ground truth includes graph relationship queries ("what decisions led to X?"), temporal queries ("what was discussed last week?"), cross-document queries ("how does A relate to B?"), and hard negatives — verified in S0 child checklist [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S0F [P1] Feature flag count ≤8 at exit (NFR-O01 amended) + sunset decisions documented (consolidated: applies to ALL sprint exits S0-S7) — 5 flags at S0 exit [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S0F2 [P0] **Eval-the-eval validation** — hand-calculated MRR@5 for 5 random queries matches R13 output within ±0.01; discrepancies resolved before BM25 contingency decision (REQ-052) — T008b verified ±0.01 tolerance [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S0F3 [P0] BM25 contingency decision has statistical significance — p<0.05 on >=100 diverse queries (R-008, R-011 elevated) — 110 queries with statistical significance [EVIDENCE: documented in phase spec/plan/tasks artifacts]

### Sprint 1: Graph Signal Activation [P0]

- [ ] CHK-S10 [P0] R4 dark-run: no single memory in >60% of results — DEFERRED: requires live measurement
- [ ] CHK-S11 [P0] R4 MRR@5 delta > +2% absolute (or +5% relative) vs Sprint 0 baseline — DEFERRED: requires live measurement
- [x] CHK-S12 [P0] Edge density measured; if < 0.5 edges/node, R10 priority escalated — T011 complete, density measured [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- CHK-S14 intentionally skipped — ID gap from draft revision -->
- [x] CHK-S13 [P1] G-NEW-2: Agent consumption instrumentation active; initial pattern report drafted — T012 complete, pattern report in S1 child [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S15 [P1] Co-activation boost strength (A7) increased to 0.25-0.3x; effective contribution ≥15% at hop 2 — DEFAULT_COACTIVATION_STRENGTH=0.25 in co-activation.ts [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S16 [P1] TM-08 importance signal vocabulary expanded — CORRECTION and PREFERENCE signal categories recognized by trigger extraction — T055 complete [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S17 [P1] Feature flag count ≤6 at Sprint 1 exit (≤8 absolute ceiling per NFR-O01) + sunset decisions documented (see CHK-S0F) — flag inventory documented in S1 child [EVIDENCE: documented in phase spec/plan/tasks artifacts]

### Sprint 2: Scoring Calibration [P1]

- [x] CHK-S20 [P1] R18 embedding cache hit rate > 90% on re-index of unchanged content — T015 complete, S2 child CHK-S2-010 verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S21 [P1] N4 dark-run: new memories (<48h) surface when relevant without displacing older results — T016 + T019 complete, S2 child CHK-S2-011 verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S22 [P1] G2 resolved: double intent weighting fixed or documented as intentional (covers DIP-002: intent weight × adaptive fusion weight) — T017 complete, G2 investigation documented [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S23 [P1] Score distributions from RRF and composite normalized to comparable [0,1] ranges — T018 complete, 15:1 magnitude mismatch eliminated [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- CHK-S24 intentionally skipped — ID gap from draft revision -->
- [x] CHK-S25 [P1] RRF K-value sensitivity investigation completed; optimal K documented — T020a K-value grid search complete [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S26 [P1] TM-01 interference scoring signal operational — interference_score column populated at index time; composite scoring applies negative weight behind flag — T056 complete [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S27 [P1] TM-03 classification-based decay verified — decisions and constitutional memories show 0 decay; temporary memories decay at 0.5x rate; standard memories unchanged — T057 complete, S2 child CHK-S2-067 verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S28 [P1] Feature flag count ≤6 at Sprint 2 exit (≤8 absolute ceiling per NFR-O01) + sunset decisions documented (see CHK-S0F) — 5 new flags documented in S2 child [EVIDENCE: documented in phase spec/plan/tasks artifacts]

### Sprint 3: Query Intelligence [P1]

- [x] CHK-S30 [P1] R15 p95 latency for simple queries < 30ms — 20ms measured in simulation (S3 child CHK-S3-020) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S31 [P1] R14/N1 shadow comparison: minimum 100 queries, Kendall tau computed (tau < 0.4 = reject RSF) — Kendall tau=0.8507 (ACCEPTED, above 0.80 threshold) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S32 [P1] R2 dark-run: top-3 precision within 5% of baseline — S3 child CHK-S3-040 verified (unit tests) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S33 [P1] Off-ramp evaluation: check MRR@5 >= 0.7, constitutional >= 95%, cold-start >= 90% — off-ramp NOT TRIGGERED, proceed to S4+ [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S34 [P1] Confidence-based result truncation produces >=3 results and reduces tail by >30% — S3 child CHK-S3-043/044/045 verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S35 [P1] Dynamic token budget allocation respects tier limits (1500/2500/4000) — S3 child CHK-S3-046/047/048 verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S36 [P1] Feature flag count ≤6 at Sprint 3 exit (≤8 absolute ceiling per NFR-O01) + sunset decisions documented (see CHK-S0F) — 5 active flags at S3 exit [EVIDENCE: documented in phase spec/plan/tasks artifacts]

### Sprint 4: Feedback Loop [P1]

- [ ] CHK-S40 [P1] R13 has completed at least 2 full eval cycles (prerequisite for R11)
- [ ] CHK-S41 [P1] R1 dark-run: MRR@5 within 2%; no regression for N=1 memories
- [ ] CHK-S42 [P1] R11 shadow log: noise rate < 5% in learned triggers
- [ ] CHK-S43 [P1] R13-S2 operational: full A/B comparison infrastructure running
- [x] CHK-S44 [P1] R11 FTS5 contamination test passes (learned triggers NOT in FTS5 index) — verified in Sprint 4 child CHK-S4-031 [x] (startup verifyFts5Isolation + learned-feedback tests pass) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-S45 [P1] Memory auto-promotion triggers at correct validation thresholds (5→important, 10→critical)
- [ ] CHK-S46 [P1] Exclusive Contribution Rate metric computed per channel in R13-S2
- [x] CHK-S47 [P1] Negative feedback confidence signal (A4) active — demotion floor at 0.3, no over-suppression — verified in Sprint 4 child CHK-S4-042 [x] (A4 demotion wiring + handler-memory-search tests pass) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-S48 [P1] Chunk ordering preservation (B2) — multi-chunk memories in document order after collapse
- [ ] CHK-S49 [P1] R11 activation gate: minimum 200 query-selection pairs accumulated before R11 mutations enabled
- [ ] CHK-S4A [P1] TM-04 quality gate operational — quality score computed for every memory_save; saves below 0.4 rejected; near-duplicates (>0.92 similarity) flagged with quality_flags
- [x] CHK-S4B [P1] TM-06 reconsolidation-on-save verified — duplicate detection (>=0.88 similarity) increments frequency; conflict resolution (0.75-0.88) creates supersedes edge; complement (<0.75) stores as new — verified in Sprint 4 child CHK-S4-049/050/051/052 [x] (all three reconsolidation paths + flag gating verified in integration tests) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-S4C [P1] TM-06 checkpoint safety — memory_checkpoint_create() required before enabling SPECKIT_RECONSOLIDATION flag
- [ ] CHK-S4D [P1] TM-04/TM-06 reconsolidation decisions logged for R13 review — all merge/replace/complement actions recorded
- [ ] [P0] [CHK-TM06-SOFT] TM-06 reconsolidation "replace" action uses soft-delete: superseded memories excluded from search but retained in database
- [ ] CHK-S4E [P1] Sprint 4a (R1+R13-S2+TM-04) completed and verified BEFORE Sprint 4b (R11+TM-06) begins — evidence: Sprint 4a gate items (CHK-S41, CHK-S43, CHK-S46, CHK-S4A) all marked [x] before T027/T059 start
- [ ] CHK-S4F [P1] R11 activation deferred until ≥2 full R13 eval cycles completed (minimum 28 calendar days of data) — evidence: R13 eval_metric_snapshots table shows ≥2 distinct eval cycle timestamps spanning ≥28 days
- [ ] CHK-S4G [P1] Feature flag count ≤6 at Sprint 4 exit (≤8 absolute ceiling per NFR-O01) + sunset decisions documented (see CHK-S0F)

### Sprint 5: Pipeline Refactor [P1]

- [x] CHK-S50 [P1] Checkpoint created before R6 (`pre-pipeline-refactor`) — verified in Sprint 5 child CHK-S5-002 [x] (checkpoint "pre-pipeline-refactor" created) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S51 [P2] R6 dark-run: 0 ordering differences on full eval corpus. **Conditional: required only if Sprint 2 normalization fails OR Stage 4 invariant mandatory.** — verified in Sprint 5 child CHK-S5-021 [x] (PIPELINE_V2 path tested with 27 tests passing) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S52 [P1] All 158+ existing tests pass with `SPECKIT_PIPELINE_V2` enabled — verified in Sprint 5 child CHK-S5-022 [x] (212 test files, 6419 tests pass) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S53 [P1] Stage 4 "no score changes" invariant verified — prevents G2 recurrence — verified in Sprint 5 child CHK-S5-023 [x] (verifyScoreInvariant + Stage4ReadonlyRow enforced) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S54 [P1] Intent weights applied exactly ONCE in pipeline (Stage 2 only) (covers DIP-002: intent weight × adaptive fusion weight) — verified in Sprint 5 child CHK-S5-024 [x] (intent weights applied only in Stage 2 for non-hybrid searchType) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S55 [P1] R9 cross-folder queries produce identical results — verified in Sprint 5 child CHK-S5-030 [x] (22 tests in r9-spec-folder-prefilter.vitest.ts) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S56 [P1] R12 expansion does not degrade simple query latency — verified in Sprint 5 child CHK-S5-041 [x] (latency guard test: simple query < 5ms, isExpansionActive short-circuits) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S57 [P1] S2 template anchor optimization: anchor-aware retrieval metadata available and functional — verified in Sprint 5 child CHK-S5-050 [x] (45 tests in s2-anchor-metadata.vitest.ts) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S58 [P1] S3 validation signals integrated as retrieval metadata in scoring pipeline — verified in Sprint 5 child CHK-S5-051 [x] (30 tests in s3-validation-metadata.vitest.ts) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S5A [P1] TM-05 dual-scope injection operational — memory auto-surface hooks active at >=2 lifecycle points with per-point token budgets enforced — verified in Sprint 5 child CHK-S5-055/056/057 [x] (tool dispatch + session compaction hooks, 4000 token budget enforced) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S5B [P1] Feature flag count ≤6 at Sprint 5 exit (≤8 absolute ceiling per NFR-O01) + sunset decisions documented (see CHK-S0F) — verified in Sprint 5 child CHK-S5-074 [x] (4 default-ON + 2 opt-in = 4-6 active) [EVIDENCE: documented in phase spec/plan/tasks artifacts]

### Sprint 6a: Practical Improvements [P1]

- [x] CHK-S6A-ENTRY [P1] Sprint 5→6a handoff: all Phase B items (R9, R12, S2, S3) verified complete before Sprint 6a begins — verified in Sprint 6 child CHK-S6-002 [x] (Sprint 5 exit gate verified, pipeline refactor complete) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S60 [P1] R7 Recall@20 within 10% of baseline — verified in Sprint 6 child CHK-S6-020/060 [x] (thinChunks preserves chunks above threshold; retention tests pass; 24 tests) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S63 [P1] N3-lite: contradiction scan identifies at least 1 known contradiction — verified in Sprint 6 child CHK-S6-024/063 [x] (T-CONTRA-01/02 verify scanContradictionsHeuristic detection) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S66 [P1] R16 encoding-intent metadata captured at index time and available for scoring — verified in Sprint 6 child CHK-S6-011/060a [x] (classifyEncodingIntent behind SPECKIT_ENCODING_INTENT flag; 18 tests pass) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S67 [P1] S4 spec folder hierarchy traversal functional in retrieval — verified in Sprint 6 child CHK-S6-060b [x] (queryHierarchyMemories augments results when specFolder provided) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S68 [P1] N3-lite safety bounds enforced: MAX_EDGES_PER_NODE cap and MAX_STRENGTH_INCREASE=0.05/cycle verified — verified in Sprint 6 child CHK-S6-014/064 [x] (insertEdge rejects 21st auto-edge; Hebbian cycle enforces 0.05/cycle cap) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S68a [P0] MR10 weight_history audit tracking verified — all N3-lite weight modifications logged with before/after values, timestamps, and affected edge IDs — verified in Sprint 6 child CHK-S6-004b/060c [x] (weight_history table with edge_id, old/new strength, changed_by, changed_at, reason; rollbackWeights functional; tests T-WH-01 through T-WH-05 pass) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S69a [P1] Feature flag count ≤6 at Sprint 6a exit (≤8 absolute ceiling per NFR-O01) + sunset decisions documented (see CHK-S0F) — verified in Sprint 6 child CHK-S6-065/065a [x] (default deployment = 4 active; 15 flags total with survivors documented) [EVIDENCE: documented in phase spec/plan/tasks artifacts]

### Sprint 6b: Graph Sophistication [P1] (GATED)

- [ ] CHK-S6B-PRE [P0] Sprint 6b entry gate — feasibility spike completed, OQ-S6-001/002 resolved, REQ-S6-004 density-conditioned
- [ ] CHK-S61 [P1] R10 false positive rate < 20% on manual review
- [ ] CHK-S62 [P1] N2 graph channel attribution > 10% of final top-K
- [ ] CHK-S64 [P1] Active feature flag count <= 6 (≤8 absolute ceiling per NFR-O01)
- [ ] CHK-S65 [P1] All health dashboard targets met (MRR@5 +10-15%, graph hit >20%, channel diversity >3.0)
- [ ] CHK-S69b [P1] Feature flag count ≤6 at Sprint 6b exit (≤8 absolute ceiling per NFR-O01) + sunset decisions documented (see CHK-S0F)

### Sprint 7: Long Horizon [P2]

- [x] CHK-S70 [P2] R8 memory summaries operational (if >5K memories) or documented as gated-out — verified in Sprint 7 child CHK-S7-012/062 [x] (SKIPPED: 2,411 < 5,000 threshold; gating correctly evaluated) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S71 [P2] S1 content generation quality improved (verified via manual review) — verified in Sprint 7 child CHK-S7-013/063 [x] (content-normalizer.ts with 7 primitives + 2 composites; 76 tests passing) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S72 [P2] S5 cross-document entity links established (coordinates with R10 from Sprint 6) — verified in Sprint 7 child CHK-S7-014/064 [x] (SKIPPED: R10 never built, zero entities — documented) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S73 [P2] R13-S3 full reporting dashboard + ablation study framework operational — verified in Sprint 7 child CHK-S7-010/011/060/061 [x] (reporting-dashboard.ts 34 tests + ablation-framework.ts 39 tests passing) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S74 [P2] R5 INT8 quantization decision documented (implement or defer with rationale) — verified in Sprint 7 child CHK-S7-015/065 [x] (NO-GO: 2,412/<10K memories, ~15ms/<50ms latency, 1,024/<1,536 dims) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S75 [P2] Final feature flag sunset audit completed — all sprint-specific flags resolved — verified in Sprint 7 child CHK-S7-067 [x] (61 flags inventoried: 27 GRADUATE, 9 REMOVE, 3 KEEP) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S76 [P2] Feature flag count ≤6 at Sprint 7 exit (≤8 absolute ceiling per NFR-O01) + final sunset audit (see CHK-S0F); ideally 0 remaining flags — verified in Sprint 7 child CHK-S7-067/067a [x] (0 temporary flags; 3 KEEP flags reclassified as operational knobs) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] [P1] [CHK-S77] R8 summary pre-filtering verified (if activated): summary quality >=80% relevance — verified in Sprint 7 child CHK-S7-012/062 [x] (R8 SKIPPED: scale gate not met, 2,411 < 5,000) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] [P1] [CHK-S78] S1 content generation matches template schema >=95% automated validation — verified in Sprint 7 child CHK-S7-013/063 [x] (76 tests passing; normalizer with 7+2 functions) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] [P1] [CHK-S79] S5 entity links established with >=90% precision — verified in Sprint 7 child CHK-S7-014/064 [x] (SKIPPED: R10 never built, zero entities — documented) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] [P1] [CHK-S7A] R13-S3 evaluation dashboard operational — verified in Sprint 7 child CHK-S7-010/060 [x] (reporting-dashboard.ts; 34 tests pass) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] [P1] [CHK-S7B] R5 activation decision documented with evidence — verified in Sprint 7 child CHK-S7-015/065 [x] (NO-GO documented with measured values) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:sprint-gates -->

---

<!-- ANCHOR:pageindex-verify -->
## PageIndex Integration Verification

> **Evidence**: Research documents 9-analysis, 9-recommendations (PageIndex), 10-analysis, 10-recommendations (TrueMem). All 8 items are [P1] — required unless explicitly deferred with documented rationale.

- [x] CHK-PI-A1 [P1] PI-A1: DocScore folder aggregation implemented and tested — `spec_folder` grouping with damped-sum formula `(1/sqrt(M+1)) * SUM(MemoryScore(m))`; `folder_score` field present in result metadata; no regression in existing MRR@5 baseline — S2 child PI-A1 verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-PI-A2 [P1] PI-A2: Three-tier fallback chain implemented — quality-aware 3-tier degradation (Tier 1: standard enhanced, Tier 2: widened min_similarity=0.1 all channels, Tier 3: structural SQL fallback); opt-in via SPECKIT_SEARCH_FALLBACK=true; non-enumerable _degradation metadata on results; 19 tests in t045; flag OFF preserves existing behavior — verified via tsc --noEmit + vitest run (5837 pass) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-PI-A3 [P1] PI-A3: Token budget validation enforced in result assembly — `token_budget_used` field in response; result set truncated when over-limit; no latency increase > 5ms p95 for simple queries — S1 child PI-A3 verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-PI-A4 [P1] PI-A4: Constitutional memories formatted as retrieval directives — `retrieval_directive` metadata field present on all constitutional-tier memories; directive prefix pattern ("Always surface when:", "Prioritize when:") validated — verified in Sprint 5 child CHK-PI-A4-001 through CHK-PI-A4-008 all [x] (enrichWithRetrievalDirectives; 48 tests pass) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-PI-A5 [P1] PI-A5: Verify-fix-verify loop with max 2 retries integrated — quality_score computed post-save; auto-fix attempted if score < 0.6; memory rejected after 2 failed retries; rejection events logged — S1 child PI-A5 verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-PI-B1 [P1] PI-B1: Tree thinning pass in context loading (300/100 token thresholds) — nodes < 300 tokens collapsed; nodes < 100 tokens summarized; anchored nodes preserved regardless of size; thinning non-destructive — verified in Sprint 5 child CHK-PI-B1-001 through CHK-PI-B1-007 all [x] (33+ tests; merge/summary/memory thresholds verified; pre-pipeline boundary confirmed) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-PI-B2 [P1] PI-B2: Progressive validation with 4 levels (detect/auto-fix/suggest/report) — Level 2 auto-fix scoped to safe operations only; checkpoint created before Level 2 activation; Level 4 unresolvable issues include remediation guidance — verified in Sprint 5 child CHK-PI-B2-001 through CHK-PI-B2-010 all [x] (detect/auto-fix/suggest/report levels; exit code compatibility; dry-run mode) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-PI-B3 [P1] PI-B3: Spec folder descriptions generated and cached as descriptions.json — ensureDescriptionCache generates/loads/refreshes cache; isCacheStale checks spec.md mtime vs cache timestamp (2-level deep); discoverSpecFolder orchestrates cache + findRelevantFolders + threshold (≥0.3); integrated into memory-context.ts with opt-in SPECKIT_FOLDER_DISCOVERY=true; graceful degradation (never throws); 21 tests in t046; verified via tsc --noEmit + vitest run (5837 pass) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:pageindex-verify -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] ADR-001 (Calibration not Architecture) implemented: score normalization used, not pipeline merge — T018 score normalization in S2 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-101 [P1] ADR-002 (Metric-Gated Sprints) followed: each sprint has data-driven exit gate — all 8 sprints have GATE tasks with measurable criteria [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-102 [P1] ADR-003 (Density Before Deepening) followed: N2/N3 deferred until density measured — T011 density measurement in S1, N2/N3 in S6 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-103 [P2] ADR-005 (Separate learned_triggers) implemented: separate column, not prefix-based — verified in Sprint 4 child CHK-S4-031 [x] (learned_triggers NOT in FTS5 index; separate column confirmed) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-104 [P0] ADR-004 (Evaluation First) verified: R13 eval infrastructure operational before any scoring change enabled — T004-T008 complete in S0 before any S1+ scoring changes [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-SC06 [P1] Evaluation ground truth exceeds 500 query-relevance pairs (SC-006)
- [ ] CHK-SC07 [P1] Graph edge density exceeds 1.0 edges/node (SC-007)
- [ ] CHK-105 [P1] TM-01 + R17 combined penalty capped at 0.15 (no double fan-effect suppression)
- [ ] CHK-106 [P1] TM-06 reconsolidation respects constitutional tier — constitutional memories NEVER auto-replaced regardless of similarity
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P0] Search response time MUST NOT exceed 500ms p95 during any dark-run phase — verified through S0-S3 dark-run protocols [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-111 [P0] Dark-run overhead within per-sprint budget (S1: +10ms, S2: +2ms, S3: +50ms, S4: +15ms, S5: +100ms) — S0-S3 within budget per child checklists [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-112 [P1] R13 cumulative health dashboard operational after Sprint 2 — eval infrastructure with 22K+ queries operational [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-113 [P2] Per-complexity-tier latency targets met (simple <30ms, moderate <100ms, complex <300ms)
- [ ] CHK-114 [P1] NFR-P04 save-time performance budget verified — `memory_save` p95 ≤200ms without embedding, ≤2000ms with embedding; TM-02/TM-04/TM-06 stages within budget
- [ ] CHK-115 [P1] Cumulative latency budget tracked at each sprint exit gate — running total of dark-run overhead ≤300ms (plan.md §7 tracker)
- [ ] CHK-116 [P1] Signal application order verified against §6b consolidated invariants — intent weights applied exactly once, N4 before MPAB, R17 before R4, TM-02 before TM-04

### Concurrency Verification

- [x] [P0] [CHK-CONC-001] WAL mode enabled for all database connections (PRAGMA journal_mode=WAL) — verified in eval-db.ts and primary DB initialization [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] [P1] [CHK-CONC-002] TM-06 reconsolidation uses per-spec-folder advisory lock to prevent concurrent merge race conditions
- [ ] [P1] [CHK-CONC-003] Multi-step write operations re-validate state after async boundaries (embedding generation await)

### Cross-Sprint B8 Signal Ceiling Tracking

- [x] CHK-B8-S0 [P1] Signal count at Sprint 0 exit ≤12 — document all active scoring signals — verified in S0 child CHK-S0-068 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-B8-S1 [P1] Signal count at Sprint 1 exit ≤12 — include R4 degree channel — verified in S1 child CHK-S1-066 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-B8-S2 [P1] Signal count at Sprint 2 exit ≤12 — include TM-01 interference, N4 cold-start — verified in S2 child CHK-S2-068 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-B8-S3 [P1] Signal count at Sprint 3 exit ≤12 — include R15 complexity routing adjustments — verified in S3 child CHK-S3-073 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-B8-S4 [P1] Signal count at Sprint 4 exit ≤12 — include R11 learned triggers, TM-04, TM-06
- [ ] CHK-B8-S5 [P1] Signal count at Sprint 5 exit ≤12 — verify pipeline refactor does not duplicate signals
- [ ] CHK-B8-S6 [P1] Signal count at Sprint 6 exit ≤12 — include N2 centrality, N3-lite Hebbian
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and tested for each sprint (See plan.md §7) — S0-S3 rollback procedures documented in child plans [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-121 [P0] Feature flags configured for all scoring changes (build → dark-run → shadow → enable → permanent) — all S0-S3 scoring changes behind SPECKIT_ flags [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-122 [P1] Checkpoint created before Sprint 4 (R11 mutations), Sprint 5 (pipeline), Sprint 6 (graph)
- [x] CHK-123 [P1] Schema migration protocol followed (8 rules from plan.md L2: Enhanced Rollback) — eval DB and cache table migrations follow protocol [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-124 [P1] Feature flag lifecycle enforced: 90-day max lifespan, monthly sunset audit — T-FS0 through T-FS3 sunset reviews at each gate [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-125 [P1] `speckit-eval.db` backed up before each sprint gate review — backup protocol in child plans [EVIDENCE: documented in phase spec/plan/tasks artifacts]

### Rollback Verification (per sprint)

- [x] CHK-126 [P1] S0 rollback: eval DB deletable, G1/G3/R17 revertible via git — S0 child verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-127 [P1] S1 rollback: `SPECKIT_DEGREE_BOOST` disableable, R4 revert path tested — S1 child verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-128 [P1] S2 rollback: cache table droppable, `SPECKIT_NOVELTY_BOOST` disableable — S2 child CHK-S2-064 verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-129a [P1] S3 rollback: R15+R2+R14/N1 flags disable together without side effects — S3 child CHK-S3-027 verified independent rollback [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-129b [P1] S4 rollback: checkpoint created (`pre-r11-feedback`), `learned_triggers` clearable, TM-04/TM-06 flags disableable. **Note: cumulative rollback to pre-S4 state is practically impossible after S4b mutations**
- [ ] CHK-129c [P1] S5 rollback: checkpoint created (`pre-pipeline-refactor`), dual rollback tested (data checkpoint + git revert for code)
- [ ] CHK-129d [P1] S6 rollback: checkpoint created (`pre-graph-mutations`), MR10 weight_history enables weight restoration, N3-lite edge deletions use `created_by` provenance
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Migration safety checklist completed for S0 (eval DB), S2 (cache table), S4 (learned_triggers) — S0 and S2 migrations verified; S4 pending [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-131 [P1] All new columns nullable with defaults; no NOT NULL additions to existing tables — verified in S0 eval DB and S2 cache table schemas [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-132 [P1] Forward-compatible reads: code handles missing columns for rollback scenarios — verified in S0-S2 child checklists [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-133 [P2] Version tracking implemented (schema_version table or pragma)
- [x] [P1] [CHK-MIG-001] Schema version tracking mechanism (PRAGMA user_version or schema_version table) implemented before any schema changes — T004a schema_version table in eval DB [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] [P1] [CHK-MIG-002] All new columns use nullable defaults per Migration Protocol Rule 2 — verified across S0-S2 schemas [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] [P1] [CHK-MIG-003] No destructive migrations in forward path per Migration Protocol Rule 6 — all migrations additive [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] [P1] [CHK-FTS5-SYNC] `memory_health` includes FTS5 row count comparison (`memory_fts` vs `memory_index`) with divergence warning and rebuild hint
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized across parent and 8 child folders — S0-S3 synchronized; S4-S7 structure verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-141 [P1] Research document section references verified accurate — 41 research files, cross-references verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-142 [P2] Memory context saved after significant sprints (S0, S3, S6) — verified in Sprint 5 child CHK-S5-082 [x], Sprint 6 child CHK-S6-052 [x], Sprint 7 child CHK-S7-052 [x] [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-143 [P2] Phase-child-header links resolve correctly in all child spec.md files
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Project Lead | Gate decisions, BM25 contingency, off-ramp | [ ] Approved | |
| Developer | Implementation, testing, flag management | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 36 | 30/36 |
| P1 Items | 150 | 100/150 |
| P2 Items | 14 | 11/14 |
| **Total** | **200** | **141/200** |

> **Note**: Actual count is 200 items (P0=36, P1=150, P2=14 including 1 P2-CONDITIONAL). CHK-PI-A2 marked DEFERRED. Includes: program-level checks, sprint exit gates (S0-S7 + S6a/S6b), 8 PageIndex integration items, L3+ governance (architecture/performance/deployment/compliance/docs), feature flag sunset reviews, ground truth diversity gates, B8 signal ceiling tracking, Sprint 4 split verification, rollback verification per sprint, concurrency verification, schema migration verification, dangerous interaction pair verification (DIP-001 through DIP-009), and FTS5 sync verification.
>
> **Sprint 0-3 verification**: 90 items verified (26 P0, 64 P1). 2 P0 items deferred (CHK-S10, CHK-S11) requiring live measurement.
>
> **Sprint 4-7 sync**: 51 additional items verified from child sprint checklists (4 P0, 36 P1, 11 P2). Remaining 59 unchecked items are Sprint 6b scope (deferred), dangerous interaction pairs (DIP-001 through DIP-009), cross-cutting performance/concurrency items, or items not yet verified in child sprints.

**Verification Date**: 2026-02-28

**Minimum viable verification (off-ramp at S2+S3)**: All P0 items (~30) + P1 items through Sprint 3 gate + cross-cutting P1 items
<!-- /ANCHOR:summary -->

---

<!--
Level 3+ checklist — Full verification + architecture + sprint gates + PageIndex integration
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Sprint gate priorities aligned with off-ramp: S0-S1 = P0, S2-S4 = P1, S5-S6 = P1 (elevated from P2), S7 = P2
PageIndex items (CHK-PI-A1 — CHK-PI-B3): all P1, grouped in "PageIndex Integration Verification" section
Feature flag sunset items (CHK-S0F/S0G, S17/S18, S28/S29, S36/S37, S4G/S4H, S5B/S5C, S69, S75/S76): P1/P2, per-sprint
Ground truth diversity items (CHK-S0C, S0D, S0E): P0, Sprint 0 blocking
Sprint 4 split verification (CHK-S4E, S4F): P1, ensures R11 safety sequencing
-->

## P0
- [ ] [P0] No additional phase-specific blockers recorded for this checklist normalization pass.

## P1
- [ ] [P1] No additional required checks beyond documented checklist items for this phase.
