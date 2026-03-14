# Cross-Spec Inventory — Hybrid RAG Fusion Epic

Generated: Sun Mar  8 15:30:08 CET 2026

## Summary
| Folder | Total | Checked | Unchecked | P0 Open | P1 Open | P2 Open |
|---|---:|---:|---:|---:|---:|---:|
| 001-hybrid-rag-fusion-epic | 308 | 243 | 65 | 7 | 54 | 4 |
| 002-indexing-normalization | 83 | 54 | 29 | 0 | 12 | 17 |
| 005-core-rag-sprints-0-to-8 | 398 | 327 | 71 | 20 | 34 | 17 |
| 006-extra-features | 112 | 65 | 47 | 20 | 25 | 2 |
| 006-ux-hooks-automation | 21 | 11 | 10 | 4 | 5 | 1 |
| 008-architecture-audit | 136 | 136 | 0 | 0 | 0 | 0 |
| 009-spec-descriptions | 32 | 20 | 12 | 2 | 7 | 3 |
| 012-command-alignment | 32 | 29 | 3 | 1 | 1 | 1 |

## Detailed Items

### 001-hybrid-rag-fusion-epic
| ID | Priority | Description | Effort | Notes |
|---|---|---|---|---|
| CHK-027 | P1 | N=0 MPAB: `computeMPAB([]) = 0` — no division by zero | S | Testing \| checklist.md:L93 |
| CHK-028 | P1 | N=1 MPAB: `computeMPAB([score]) = score` — no penalty, no bonus | S | Testing \| checklist.md:L94 |
| CHK-029e | P1 | Flag disabled mid-search: in-progress search completes with flag state at query start | S | Testing \| checklist.md:L99 |
| CHK-035 | P0 | R1+N4 double-boost guard — N4 applied BEFORE MPAB; combined boost capped at 0.95 | S | Security \| checklist.md:L114 |
| CHK-036 | P0 | R4+N3 feedback loop guard — edge caps (MAX_TOTAL_DEGREE=50), strength caps (MAX_STRENGTH_INCREASE=0.05/cycle), provenance tracking active | S | Security \| checklist.md:L115 |
| CHK-039b | P1 | TM-01+R17 combined penalty — capped at 0.15 (no double fan-effect suppression) | S | Security \| checklist.md:L117 |
| CHK-039c | P1 | R13+R15 metrics skew — R13 records query_complexity; metrics computed per tier | S | Security \| checklist.md:L118 |
| CHK-DIP-008 | P1 | [CHK-DIP-008] TM-04 + PI-A5 pipeline ordering verified: PI-A5 auto-fix runs after TM-04 threshold check | S | Security \| checklist.md:L119 |
| CHK-DIP-009 | P1 | [CHK-DIP-009] N4 + TM-01 opposing forces documented: cold-start boost applied before interference penalty | S | Security \| checklist.md:L120 |
| CHK-DIP-001 | P1 | [CHK-DIP-001] Verify DIP-001 (session boost × causal boost) has interference guard: multiplicative over-scoring capped or converted to additive combination | S | Security \| checklist.md:L121 |
| CHK-DIP-003 | P1 | [CHK-DIP-003] Verify DIP-003 (recency decay × TTL decay) has interference guard: compounding temporal penalty capped at maximum total decay threshold | S | Security \| checklist.md:L122 |
| CHK-DIP-004 | P1 | [CHK-DIP-004] Verify DIP-004 (RRF position × BM25 boost) has interference guard: position bias amplification bounded by independent normalization of each signal | S | Security \| checklist.md:L123 |
| CHK-DIP-005 | P1 | [CHK-DIP-005] Verify DIP-005 (quality score × validation confidence) has interference guard: circular quality loop broken by using independent input sources for each score | S | Security \| checklist.md:L124 |
| CHK-DIP-006 | P1 | [CHK-DIP-006] Verify DIP-006 (doc-type multiplier × importance tier) has interference guard: static bias stacking capped or one signal subsumed by the other | S | Security \| checklist.md:L125 |
| CHK-DIP-007 | P1 | [CHK-DIP-007] Verify DIP-007 (cross-encoder rerank × MMR diversity) has interference guard: relevance-diversity tension balanced by configurable lambda parameter with documented default | S | Security \| checklist.md:L126 |
| CHK-051 | P1 | No scratch files left in child folders after completion | S | File Organization \| checklist.md:L144 |
| CHK-S10 | P0 | R4 dark-run: no single memory in >60% of results — DEFERRED: requires live measurement | L | Sprint Exit Gates \| checklist.md:L176 |
| CHK-S11 | P0 | R4 MRR@5 delta > +2% absolute (or +5% relative) vs Sprint 0 baseline — DEFERRED: requires live measurement | L | Sprint Exit Gates \| checklist.md:L177 |
| CHK-S40 | P1 | R13 has completed at least 2 full eval cycles (prerequisite for R11) | L | Sprint Exit Gates \| checklist.md:L209 |
| CHK-S41 | P1 | R1 dark-run: MRR@5 within 2%; no regression for N=1 memories | L | Sprint Exit Gates \| checklist.md:L210 |
| CHK-S42 | P1 | R11 shadow log: noise rate < 5% in learned triggers | S | Sprint Exit Gates \| checklist.md:L211 |
| CHK-S43 | P1 | R13-S2 operational: full A/B comparison infrastructure running | S | Sprint Exit Gates \| checklist.md:L212 |
| CHK-S45 | P1 | Memory auto-promotion triggers at correct validation thresholds (5→important, 10→critical) | S | Sprint Exit Gates \| checklist.md:L214 |
| CHK-S46 | P1 | Exclusive Contribution Rate metric computed per channel in R13-S2 | S | Sprint Exit Gates \| checklist.md:L215 |
| CHK-S48 | P1 | Chunk ordering preservation (B2) — multi-chunk memories in document order after collapse | S | Sprint Exit Gates \| checklist.md:L217 |
| CHK-S49 | P1 | R11 activation gate: minimum 200 query-selection pairs accumulated before R11 mutations enabled | S | Sprint Exit Gates \| checklist.md:L218 |
| CHK-S4A | P1 | TM-04 quality gate operational — quality score computed for every memory_save; saves below 0.4 rejected; near-duplicates (>0.92 similarity) flagged with quality_flags | S | Sprint Exit Gates \| checklist.md:L219 |
| CHK-S4C | P1 | TM-06 checkpoint safety — memory_checkpoint_create() required before enabling SPECKIT_RECONSOLIDATION flag | S | Sprint Exit Gates \| checklist.md:L221 |
| CHK-S4D | P1 | TM-04/TM-06 reconsolidation decisions logged for R13 review — all merge/replace/complement actions recorded | S | Sprint Exit Gates \| checklist.md:L222 |
| CHK-TM06-SOFT | P0 | [CHK-TM06-SOFT] TM-06 reconsolidation "replace" action uses soft-delete: superseded memories excluded from search but retained in database | S | Sprint Exit Gates \| checklist.md:L223 |
| CHK-S4E | P1 | Sprint 4a (R1+R13-S2+TM-04) completed and verified BEFORE Sprint 4b (R11+TM-06) begins — evidence: Sprint 4a gate items (CHK-S41, CHK-S43, CHK-S46, CHK-S4A) all marked [x] before T027/T059 start | S | Sprint Exit Gates \| checklist.md:L224 |
| CHK-S4F | P1 | R11 activation deferred until ≥2 full R13 eval cycles completed (minimum 28 calendar days of data) — evidence: R13 eval_metric_snapshots table shows ≥2 distinct eval cycle timestamps spanning ≥28 days | L | Sprint Exit Gates \| checklist.md:L225 |
| CHK-S4G | P1 | Feature flag count ≤6 at Sprint 4 exit (≤8 absolute ceiling per NFR-O01) + sunset decisions documented (see CHK-S0F) | S | Sprint Exit Gates \| checklist.md:L226 |
| CHK-S6B-PRE | P0 | Sprint 6b entry gate — feasibility spike completed, OQ-S6-001/002 resolved, REQ-S6-004 density-conditioned | S | Sprint Exit Gates \| checklist.md:L255 |
| CHK-S61 | P1 | R10 false positive rate < 20% on manual review | S | Sprint Exit Gates \| checklist.md:L256 |
| CHK-S62 | P1 | N2 graph channel attribution > 10% of final top-K | L | Sprint Exit Gates \| checklist.md:L257 |
| CHK-S64 | P1 | Active feature flag count <= 6 (≤8 absolute ceiling per NFR-O01) | S | Sprint Exit Gates \| checklist.md:L258 |
| CHK-S65 | P1 | All health dashboard targets met (MRR@5 +10-15%, graph hit >20%, channel diversity >3.0) | L | Sprint Exit Gates \| checklist.md:L259 |
| CHK-S69b | P1 | Feature flag count ≤6 at Sprint 6b exit (≤8 absolute ceiling per NFR-O01) + sunset decisions documented (see CHK-S0F) | S | Sprint Exit Gates \| checklist.md:L260 |
| CHK-SC06 | P1 | Evaluation ground truth exceeds 500 query-relevance pairs (SC-006) | L | L3+: ARCHITECTURE VERIFICATION \| checklist.md:L305 |
| CHK-SC07 | P1 | Graph edge density exceeds 1.0 edges/node (SC-007) | S | L3+: ARCHITECTURE VERIFICATION \| checklist.md:L306 |
| CHK-105 | P1 | TM-01 + R17 combined penalty capped at 0.15 (no double fan-effect suppression) | S | L3+: ARCHITECTURE VERIFICATION \| checklist.md:L307 |
| CHK-106 | P1 | TM-06 reconsolidation respects constitutional tier — constitutional memories NEVER auto-replaced regardless of similarity | S | L3+: ARCHITECTURE VERIFICATION \| checklist.md:L308 |
| CHK-113 | P2 | Per-complexity-tier latency targets met (simple <30ms, moderate <100ms, complex <300ms) | L | L3+: PERFORMANCE VERIFICATION \| checklist.md:L319 |
| CHK-114 | P1 | NFR-P04 save-time performance budget verified — `memory_save` p95 ≤200ms without embedding, ≤2000ms with embedding; TM-02/TM-04/TM-06 stages within budget | L | L3+: PERFORMANCE VERIFICATION \| checklist.md:L320 |
| CHK-115 | P1 | Cumulative latency budget tracked at each sprint exit gate — running total of dark-run overhead ≤300ms (plan.md §7 tracker) | M | L3+: PERFORMANCE VERIFICATION \| checklist.md:L321 |
| CHK-116 | P1 | Signal application order verified against §6b consolidated invariants — intent weights applied exactly once, N4 before MPAB, R17 before R4, TM-02 before TM-04 | S | L3+: PERFORMANCE VERIFICATION \| checklist.md:L322 |
| CHK-CONC-002 | P1 | [CHK-CONC-002] TM-06 reconsolidation uses per-spec-folder advisory lock to prevent concurrent merge race conditions | S | L3+: PERFORMANCE VERIFICATION \| checklist.md:L327 |
| CHK-CONC-003 | P1 | [CHK-CONC-003] Multi-step write operations re-validate state after async boundaries (embedding generation await) | S | L3+: PERFORMANCE VERIFICATION \| checklist.md:L328 |
| CHK-B8-S4 | P1 | Signal count at Sprint 4 exit ≤12 — include R11 learned triggers, TM-04, TM-06 | S | L3+: PERFORMANCE VERIFICATION \| checklist.md:L336 |
| CHK-B8-S5 | P1 | Signal count at Sprint 5 exit ≤12 — verify pipeline refactor does not duplicate signals | S | L3+: PERFORMANCE VERIFICATION \| checklist.md:L337 |
| CHK-B8-S6 | P1 | Signal count at Sprint 6 exit ≤12 — include N2 centrality, N3-lite Hebbian | S | L3+: PERFORMANCE VERIFICATION \| checklist.md:L338 |
| CHK-122 | P1 | Checkpoint created before Sprint 4 (R11 mutations), Sprint 5 (pipeline), Sprint 6 (graph) | S | L3+: DEPLOYMENT READINESS \| checklist.md:L348 |
| CHK-129b | P1 | S4 rollback: checkpoint created (`pre-r11-feedback`), `learned_triggers` clearable, TM-04/TM-06 flags disableable. **Note: cumulative rollback to pre-S4 state is practically impossible after S4b mutations** | S | L3+: DEPLOYMENT READINESS \| checklist.md:L359 |
| CHK-129c | P1 | S5 rollback: checkpoint created (`pre-pipeline-refactor`), dual rollback tested (data checkpoint + git revert for code) | L | L3+: DEPLOYMENT READINESS \| checklist.md:L360 |
| CHK-129d | P1 | S6 rollback: checkpoint created (`pre-graph-mutations`), MR10 weight_history enables weight restoration, N3-lite edge deletions use `created_by` provenance | S | L3+: DEPLOYMENT READINESS \| checklist.md:L361 |
| CHK-133 | P2 | Version tracking implemented (schema_version table or pragma) | S | L3+: COMPLIANCE VERIFICATION \| checklist.md:L372 |
| CHK-FTS5-SYNC | P1 | [CHK-FTS5-SYNC] `memory_health` includes FTS5 row count comparison (`memory_fts` vs `memory_index`) with divergence warning and rebuild hint | S | L3+: COMPLIANCE VERIFICATION \| checklist.md:L376 |
| CHK-143 | P2 | Phase-child-header links resolve correctly in all child spec.md files | M | L3+: DOCUMENTATION VERIFICATION \| checklist.md:L387 |
| L438 | P0 | No additional phase-specific blockers recorded for this checklist normalization pass. | S | P0 \| checklist.md:L438 |
| L441 | P1 | No additional required checks beyond documented checklist items for this phase. | S | P1 \| checklist.md:L441 |
| CHK-062 | P2 | Context snapshot saved to `memory/` when implementation closes [DEFERRED: memory snapshot generation is outside this markdown-only closure scope; aligns with T024 deferral] | M | File Organization \| checklist.md:L660 |
| CHK-110 | P1 | Retrieval response targets met (p95 `auto <= 120ms`, p95 `deep <= 180ms`) [DEFERRED: scratch/w6-baseline-metrics-sweep.md documents benchmark FAIL — performance benchmark script has unresolved cross-project import issue; live telemetry observed 201ms total (167% of budget). Target unvalidated empirically] | L | L3+: PERFORMANCE VERIFICATION \| checklist.md:L695 |
| CHK-111 | P1 | Session and learning targets met (session p95 <= 250ms, learning batch p95 <= 400ms) [DEFERRED: scratch/w6-baseline-metrics-sweep.md does not contain passing evidence for this gate; benchmark script needs fix before validation] | L | L3+: PERFORMANCE VERIFICATION \| checklist.md:L696 |
| CHK-112 | P1 | Hardening overhead target met (`<= 12%` vs baseline corpus) [PARTIAL: scratch/w6-baseline-metrics-sweep.md reports `mrr_ratio=0.9811x` (1.89% regression within 12% budget), but MRR sample size (N=50) is insufficient for statistical confidence; 95% CI spans ~0.45-0.59] | M | L3+: PERFORMANCE VERIFICATION \| checklist.md:L697 |

### 002-indexing-normalization
| ID | Priority | Description | Effort | Notes |
|---|---|---|---|---|
| CHK-042 | P2 | Parent spec references updated if needed | M | Documentation \| checklist.md:L107 |
| CHK-052 | P2 | Context saved to `memory/` | M | File Organization \| checklist.md:L117 |
| CHK-103 | P2 | Migration path documented if historical cleanup is included | S | L3+: ARCHITECTURE VERIFICATION \| checklist.md:L143 |
| CHK-110 | P1 | Scan overhead remains within target | M | L3+: PERFORMANCE VERIFICATION \| AUDIT-2026-03-08: unchecked — evidence says "Deferred with scope approval" \| checklist.md:L151 |
| CHK-111 | P1 | Throughput unaffected in incremental mode | M | L3+: PERFORMANCE VERIFICATION \| AUDIT-2026-03-08: unchecked — evidence says "Deferred with scope approval" \| checklist.md:L152 |
| CHK-112 | P2 | Load testing completed | L | L3+: PERFORMANCE VERIFICATION \| checklist.md:L153 |
| CHK-113 | P2 | Benchmarks documented | L | L3+: PERFORMANCE VERIFICATION \| checklist.md:L154 |
| CHK-122 | P1 | Monitoring/alerting expectations documented | M | L3+: DEPLOYMENT READINESS \| AUDIT-2026-03-08: unchecked — evidence says "Deferred with scope approval" \| checklist.md:L164 |
| CHK-123 | P1 | Runbook created | M | L3+: DEPLOYMENT READINESS \| AUDIT-2026-03-08: unchecked — evidence says "Deferred with scope approval" \| checklist.md:L165 |
| CHK-124 | P2 | Deployment runbook reviewed | M | L3+: DEPLOYMENT READINESS \| checklist.md:L166 |
| CHK-130 | P1 | Security review completed | M | L3+: COMPLIANCE VERIFICATION \| AUDIT-2026-03-08: unchecked — evidence says "Deferred with scope approval" \| checklist.md:L174 |
| CHK-131 | P1 | Dependency licenses compatible | M | L3+: COMPLIANCE VERIFICATION \| AUDIT-2026-03-08: unchecked — evidence says "Deferred with scope approval" \| checklist.md:L175 |
| CHK-132 | P2 | OWASP checklist reviewed where relevant | M | L3+: COMPLIANCE VERIFICATION \| checklist.md:L176 |
| CHK-133 | P2 | Data handling review completed | M | L3+: COMPLIANCE VERIFICATION \| checklist.md:L177 |
| CHK-142 | P2 | User-facing notes updated if behavior changes externally | M | L3+: DOCUMENTATION VERIFICATION \| checklist.md:L187 |
| CHK-143 | P2 | Knowledge transfer documented | M | L3+: DOCUMENTATION VERIFICATION \| checklist.md:L188 |
| CHK-052 | P2 | Findings saved to memory/ \| Deferred: No `memory/` context-save artifact was recorded in provided evidence. | M | File Organization \| checklist.md:L294 |
| CHK-110 | P1 | Reindex performance remains within expected runtime budget | S | L3+: PERFORMANCE VERIFICATION \| AUDIT-2026-03-08: unchecked — evidence says "Deferred with scope approval" \| checklist.md:L339 |
| CHK-111 | P1 | Retrieval latency remains within acceptable bounds post-migration | S | L3+: PERFORMANCE VERIFICATION \| AUDIT-2026-03-08: unchecked — evidence says "Deferred with scope approval" \| checklist.md:L340 |
| CHK-112 | P2 | Load-style replay completed for representative corpus \| Deferred: No load replay artifact was provided. | M | L3+: PERFORMANCE VERIFICATION \| checklist.md:L341 |
| CHK-113 | P2 | Performance deltas documented \| Deferred: No before/after performance delta report was provided. | M | L3+: PERFORMANCE VERIFICATION \| checklist.md:L342 |
| CHK-122 | P1 | Monitoring/alerting captures migration and reindex failures | M | L3+: DEPLOYMENT READINESS \| AUDIT-2026-03-08: unchecked — evidence says "Deferred with scope approval" \| checklist.md:L352 |
| CHK-123 | P1 | Runbook created for normalization + rebuild workflow | M | L3+: DEPLOYMENT READINESS \| AUDIT-2026-03-08: unchecked — evidence says "Deferred with scope approval" \| checklist.md:L353 |
| CHK-124 | P2 | Deployment runbook reviewed \| Deferred: No deployment runbook review evidence was provided. | M | L3+: DEPLOYMENT READINESS \| checklist.md:L354 |
| CHK-130 | P1 | Security review completed for file rewrite path | M | L3+: COMPLIANCE VERIFICATION \| AUDIT-2026-03-08: unchecked — evidence says "Deferred with scope approval" \| checklist.md:L362 |
| CHK-131 | P1 | Dependency license posture unchanged | M | L3+: COMPLIANCE VERIFICATION \| AUDIT-2026-03-08: unchecked — evidence says "Deferred with scope approval" \| checklist.md:L363 |
| CHK-132 | P2 | OWASP style checklist completed where applicable \| Deferred: OWASP checklist completion evidence was not provided. | M | L3+: COMPLIANCE VERIFICATION \| checklist.md:L364 |
| CHK-133 | P2 | Data handling remains within project requirements \| Deferred: No dedicated data-handling compliance record was provided. | M | L3+: COMPLIANCE VERIFICATION \| checklist.md:L365 |
| CHK-142 | P2 | User-facing docs updated if commands change \| Deferred: No user-facing doc update evidence was provided. | M | L3+: DOCUMENTATION VERIFICATION \| checklist.md:L375 |

### 005-core-rag-sprints-0-to-8
| ID | Priority | Description | Effort | Notes |
|---|---|---|---|---|
| L186 | P0 | No additional phase-specific blockers recorded for this checklist normalization pass. | S | P0 \| checklist.md:L186 |
| L189 | P1 | No additional required checks beyond documented checklist items for this phase. | S | P1 \| checklist.md:L189 |
| CHK-S1-010 | P0 | R4 dark-run: no single memory appears in >60% of results — HOW: Run R4 dark-run over 50+ eval queries; compute per-memory presence frequency; verify max < 60%. Evidence required: frequency distribution table. Cross-ref T005. (deferred: requires live measurement) | L | Code Quality \| checklist.md:L240 |
| CHK-S1-011 | P0 | R4 MRR@5 delta >+2% absolute over Sprint 0 baseline — HOW: Three-measurement sequence: (a) Sprint 0 baseline MRR@5, (b) R4-only dark-run with A7 at original 0.1x, (c) R4+A7 dark-run with A7 at 0.25-0.3x. Evidence required: three-point metric comparison table with isolated R4 and A7 contributions. Cross-ref T005. (deferred: requires live measurement) | L | Code Quality \| checklist.md:L241 |
| CHK-S1-060 | P0 | R4 MRR@5 delta >+2% absolute — verified via R13 eval metrics. **Density-conditional**: If T003 edge density < 0.5, gate evaluates R4 implementation correctness (unit tests pass, zero-return for unconnected memories) and records "R4 signal limited by graph sparsity — R10 escalation triggered" with density-adjusted threshold. Gate distinguishes implementation failure from data insufficiency. If density >= 0.5 and MRR@5 delta < +2%, gate fails as implementation issue. (deferred: requires live measurement) | L | Sprint 1 Exit Gate \| checklist.md:L302 |
| CHK-S1-061 | P0 | No single memory >60% presence in dark-run results (deferred: requires live measurement) | L | Sprint 1 Exit Gate \| checklist.md:L303 |
| L334 | P0 | No additional phase-specific blockers recorded for this checklist normalization pass. | S | P0 \| checklist.md:L334 |
| L337 | P1 | No additional required checks beyond documented checklist items for this phase. | S | P1 \| checklist.md:L337 |
| L486 | P0 | No additional phase-specific blockers recorded for this checklist normalization pass. | S | P0 \| checklist.md:L486 |
| L489 | P1 | No additional required checks beyond documented checklist items for this phase. | S | P1 \| checklist.md:L489 |
| CHK-PI-B3-001 | P2 | descriptions.json generated with one sentence per spec folder derived from spec.md | S | PageIndex Verification \| checklist.md:L608 |
| CHK-PI-B3-002 | P2 | memory_context orchestration layer performs folder lookup via descriptions.json before issuing vector queries | S | PageIndex Verification \| checklist.md:L609 |
| CHK-PI-B3-003 | P2 | Cache invalidation triggers when spec.md changes for a given folder | S | PageIndex Verification \| checklist.md:L610 |
| CHK-PI-B3-004 | P2 | descriptions.json absent = graceful degradation to full-corpus search (no error) | S | PageIndex Verification \| checklist.md:L611 |
| CHK-S3-075 | P2 | **R12 mutual exclusion**: R12 (query expansion) flag is inactive at Sprint 3 exit gate. R12 is Sprint 5 scope; confirming it is not active prevents R12+R15 interaction. | S | Feature Flag Audit \| checklist.md:L639 |
| L676 | P0 | No additional phase-specific blockers recorded for this checklist normalization pass. | S | P0 \| checklist.md:L676 |
| L679 | P1 | No additional required checks beyond documented checklist items for this phase. | S | P1 \| checklist.md:L679 |
| CHK-S4-001 | P0 | Sprint 3 exit gate verified (predecessor complete) | S | Pre-Implementation \| checklist.md:L720 |
| CHK-S4-002 | P0 | R13 completed 2+ eval cycles (prerequisite for R11) | S | Pre-Implementation \| checklist.md:L721 |
| CHK-S4-003 | P0 | Checkpoint created before sprint start | S | Pre-Implementation \| checklist.md:L722 |
| CHK-S4-004 | P0 | Requirements documented in spec.md | S | Pre-Implementation \| checklist.md:L723 |
| CHK-S4-005 | P0 | Technical approach defined in plan.md | S | Pre-Implementation \| checklist.md:L724 |
| CHK-S4-006 | P1 | Dependencies identified and available | S | Pre-Implementation \| checklist.md:L725 |
| CHK-S4-020 | P1 | R1 dark-run: MRR@5 within 2% of baseline | L | Sprint 4 Specific Verification \| checklist.md:L745 |
| CHK-S4-030 | P1 | R11 shadow log: noise rate <5% | S | Sprint 4 Specific Verification \| checklist.md:L751 |
| CHK-S4-038 | P1 | R13 eval cycle defined: minimum 100 query evaluations AND 14+ calendar days constitutes one eval cycle for the R11 prerequisite (both conditions must be met) | L | Sprint 4 Specific Verification \| checklist.md:L759 |
| CHK-S4-GNEW3 | P1 | G-NEW-3 Phase C: LLM-judge ground truth generation operational with >=80% agreement with manual labels | S | Sprint 4 Specific Verification \| checklist.md:L779 |
| CHK-S4-048 | P0 | TM-06 checkpoint created before first enable (`pre-reconsolidation`) | S | Sprint 4 Specific Verification \| checklist.md:L782 |
| CHK-S4-054 | P0 | All acceptance criteria met (REQ-S4-001 through REQ-S4-005) | L | Testing \| checklist.md:L803 |
| CHK-S4-063 | P1 | Checkpoint restored successfully in test (rollback validation) | L | Schema Migration \| checklist.md:L817 |
| CHK-S4-070 | P1 | Spec/plan/tasks synchronized | M | Documentation \| checklist.md:L825 |
| CHK-S4-071 | P1 | Code comments adequate | M | Documentation \| checklist.md:L826 |
| CHK-S4-072 | P1 | Feature flags documented | M | Documentation \| checklist.md:L827 |
| CHK-S4-073 | P1 | Schema change documented | M | Documentation \| checklist.md:L828 |
| CHK-S4-076 | P0 | **R11 calendar prerequisite met**: Confirm ≥28 calendar days have elapsed since Sprint 3 completion AND R13 completed ≥2 full eval cycles (each cycle = 100+ queries AND 14+ calendar days; both conditions must be met). Evidence: date stamps from eval cycle logs. | L | Calendar Dependency Verification \| checklist.md:L839 |
| CHK-S4-076a | P1 | **14-day mid-window checkpoint**: After 14 calendar days (1 complete eval cycle), verify R13 eval infrastructure is collecting valid data and shadow scoring produces usable A/B comparisons. An early failure at day 14 is recoverable; a failure discovered at day 28 wastes the full idle window. | S | Calendar Dependency Verification \| checklist.md:L840 |
| CHK-S4-080 | P1 | Temp files in scratch/ only | M | File Organization \| checklist.md:L848 |
| CHK-S4-081 | P1 | scratch/ cleaned before completion | M | File Organization \| checklist.md:L849 |
| CHK-S4-082 | P2 | Findings saved to memory/ | M | File Organization \| checklist.md:L850 |
| L877 | P0 | No additional phase-specific blockers recorded for this checklist normalization pass. | S | P0 \| checklist.md:L877 |
| L880 | P1 | No additional required checks beyond documented checklist items for this phase. | S | P1 \| checklist.md:L880 |
| CHK-S6-003 | P1 | Edge density measured — R10 gating decision documented | S | Pre-Implementation — Sprint 6b (gates Sprint 6b only) \| checklist.md:L1123 |
| CHK-S6-004a | P0 | Algorithm feasibility spike completed — N2c and R10 approaches validated on actual data; quality tier (heuristic vs production) confirmed. Does NOT gate Sprint 6a items (R7, R16, S4, N3-lite, T001d). | S | Pre-Implementation — Sprint 6b (gates Sprint 6b only) \| checklist.md:L1124 |
| CHK-S6-012 | P2 | R10 density gating condition correctly evaluated — **DEFERRED**: R10 is Sprint 6b scope (gated on feasibility spike) | S | Code Quality \| checklist.md:L1134 |
| CHK-S6-013 | P2 | N2 centrality + community detection algorithms correct — **DEFERRED**: N2 is Sprint 6b scope | S | Code Quality \| checklist.md:L1135 |
| CHK-S6-013a | P2 | N2c algorithm choice documented — **DEFERRED**: N2c is Sprint 6b scope | S | Code Quality \| checklist.md:L1136 |
| CHK-S6-021 | P2 | R10 false positive rate <20% on manual review of >=50 entities — **DEFERRED**: R10 is Sprint 6b scope | L | Testing \| checklist.md:L1147 |
| CHK-S6-022 | P2 | R10 gating verified — **DEFERRED**: R10 is Sprint 6b scope | S | Testing \| checklist.md:L1148 |
| CHK-S6-023 | P2 | N2 graph channel attribution >10% of final top-K — **DEFERRED**: N2 is Sprint 6b scope | L | Testing \| checklist.md:L1149 |
| CHK-S6-023a | P2 | N2c community detection produces stable clusters on test data — **DEFERRED**: N2c is Sprint 6b scope | M | Testing \| checklist.md:L1150 |
| CHK-S6-031 | P2 | R10 auto-extracted entities tagged with `created_by='auto'` — **DEFERRED**: R10 is Sprint 6b scope. Infrastructure ready: `insertEdge()` supports `createdBy` parameter. | S | Security & Provenance \| checklist.md:L1161 |
| CHK-S6-041 | P2 | R10 gating decision documented with density measurement — **DEFERRED**: R10 is Sprint 6b scope | M | Documentation \| checklist.md:L1171 |
| CHK-S6-070 | P1 | Sprint 6b entry gates satisfied — feasibility spike completed, OQ-S6-001 resolved, OQ-S6-002 resolved, REQ-S6-004 revisited | L | Sprint 6b Exit Gate (conditional on Sprint 6b execution) \| checklist.md:L1203 |
| CHK-S6-061 | P1 | R10 false positive rate <20% — verified via manual review of >=50 entity sample (if implemented) | L | Sprint 6b Exit Gate (conditional on Sprint 6b execution) \| checklist.md:L1204 |
| CHK-S6-062 | P1 | N2 graph channel attribution >10% of final top-K OR graph density <1.0 documented with deferral decision — evidence: attribution percentage in eval output or density measurement | L | Sprint 6b Exit Gate (conditional on Sprint 6b execution) \| checklist.md:L1205 |
| CHK-S6-062a | P1 | N2c community assignments stable across 2 runs on test graph with ≥50 nodes — evidence: <5% membership divergence | M | Sprint 6b Exit Gate (conditional on Sprint 6b execution) \| checklist.md:L1206 |
| CHK-S6-071 | P1 | Active feature flag count <=6 post-Sprint-6b — evidence: final flag list with count | S | Sprint 6b Exit Gate (conditional on Sprint 6b execution) \| checklist.md:L1207 |
| CHK-S6-072 | P1 | All health dashboard targets checked — evidence: dashboard screenshot or metric summary | L | Sprint 6b Exit Gate (conditional on Sprint 6b execution) \| checklist.md:L1208 |
| CHK-PI-S6-001 | P2 | PageIndex cross-references from Sprints 2, 3 reviewed and integrated | S | PageIndex Cross-References \| checklist.md:L1215 |
| L1249 | P0 | No additional phase-specific blockers recorded for this checklist normalization pass. | S | P0 \| checklist.md:L1249 |
| L1252 | P1 | No additional required checks beyond documented checklist items for this phase. | S | P1 \| checklist.md:L1252 |
| L1413 | P0 | No additional phase-specific blockers recorded for this checklist normalization pass. | S | P0 \| checklist.md:L1413 |
| L1416 | P1 | No additional required checks beyond documented checklist items for this phase. | S | P1 \| checklist.md:L1416 |
| CHK-S8-011 | P1 | Dependencies explicitly documented before execution — evidence: plan.md lists dependency order and gating checkpoints | S | Code Quality \| checklist.md:L1468 |
| CHK-S8-012 | P1 | Deferred execution remains rollback-safe — evidence: rollback triggers and procedure documented in plan.md | S | Code Quality \| checklist.md:L1469 |
| CHK-S8-020 | P1 | Recursive spec validation exits with code 0 or 1 for this phase folder | L | Testing \| checklist.md:L1477 |
| CHK-S8-021 | P1 | Phase-link metadata remains consistent with parent and successor phases | L | Testing \| checklist.md:L1478 |
| CHK-S8-042 | P2 | Handoff to 010-comprehensive-remediation documented | L | Documentation \| checklist.md:L1496 |
| CHK-S8-060 | P1 | All mandatory deferred tasks complete or explicitly deferred with rationale | S | Sprint 8 Exit Gate \| checklist.md:L1513 |
| CHK-S8-061 | P1 | No unresolved validator hard errors in this phase folder | S | Sprint 8 Exit Gate \| checklist.md:L1514 |
| CHK-S8-062 | P1 | Handoff to 010-comprehensive-remediation documented | L | Sprint 8 Exit Gate \| checklist.md:L1515 |

### 006-extra-features
| ID | Priority | Description | Effort | Notes |
|---|---|---|---|---|
| CHK-020 | P0 | All 24 tools accept VALID parameters without regression (test each tool individually) | L | Testing — Per Feature \| checklist.md:L66 |
| CHK-021 | P0 | All 24 tools reject UNKNOWN parameters with actionable Zod error message (strict mode) | L | Testing — Per Feature \| checklist.md:L67 |
| CHK-022 | P0 | Error messages include expected parameter names: "Unknown parameter 'foo'. Expected: query, specFolder, limit, ..." | M | Testing — Per Feature \| checklist.md:L68 |
| CHK-024 | P1 | Schema validation overhead <5ms per tool call (benchmark all 24 tools) | L | Testing — Per Feature \| checklist.md:L70 |
| CHK-030 | P0 | `memory_search` with `includeTrace: true` returns `scores` object with 7 score fields | S | Testing — Per Feature \| checklist.md:L78 |
| CHK-031 | P0 | `memory_search` with `includeTrace: true` returns `source` object with file, anchorIds, anchorTypes, lastModified, memoryState | S | Testing — Per Feature \| checklist.md:L79 |
| CHK-032 | P0 | `memory_search` with `includeTrace: true` returns `trace` object with channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution | S | Testing — Per Feature \| checklist.md:L80 |
| CHK-033 | P0 | `memory_search` WITHOUT `includeTrace` returns BYTE-IDENTICAL response shape as current production (backward compatibility) | L | Testing — Per Feature \| checklist.md:L81 |
| CHK-034 | P0 | Default `includeTrace: false` — no trace in response unless explicitly requested | S | Testing — Per Feature \| checklist.md:L82 |
| CHK-035 | P1 | `scores.fusion` matches internal `PipelineRow.rrfScore` for same result (no precision loss) | S | Testing — Per Feature \| checklist.md:L83 |
| CHK-039 | P1 | Envelope serialization overhead <10ms (benchmark) | L | Testing — Per Feature \| checklist.md:L87 |
| CHK-041 | P0 | `memory_ingest_start` returns job ID in <100ms (no blocking file I/O in response path) | M | Testing — Per Feature \| checklist.md:L91 |
| CHK-042 | P0 | `memory_ingest_status` returns accurate state matching actual processing state within 1s | M | Testing — Per Feature \| checklist.md:L92 |
| CHK-043 | P0 | Job state machine transitions correctly: queued→parsing→embedding→indexing→complete | M | Testing — Per Feature \| checklist.md:L93 |
| CHK-045 | P0 | `memory_ingest_cancel` transitions running job to `cancelled` state | S | Testing — Per Feature \| checklist.md:L95 |
| CHK-046 | P0 | Cancelled job stops processing after current file completes (no mid-file abort) | S | Testing — Per Feature \| checklist.md:L96 |
| CHK-049 | P1 | Job state persists in SQLite `ingest_jobs` table — survives server restart | M | Testing — Per Feature \| checklist.md:L99 |
| CHK-050 | P1 | Crash recovery: incomplete jobs reset to `queued` on restart | M | Testing — Per Feature \| checklist.md:L100 |
| CHK-051 | P1 | 100+ file batch completes without MCP timeout (async processing) | L | Testing — Per Feature \| checklist.md:L101 |
| CHK-054 | P1 | Context headers prepended to returned chunks in format `[parent > child — desc]` | M | Testing — Per Feature \| checklist.md:L106 |
| CHK-056 | P1 | `SPECKIT_CONTEXT_HEADERS=false` disables injection completely | S | Testing — Per Feature \| checklist.md:L108 |
| CHK-058 | P1 | `includeContent: false` results get NO header (no content to prepend to) | S | Testing — Per Feature \| checklist.md:L110 |
| CHK-061 | P1 | Reranking works end-to-end: GGUF model loaded, candidates scored, results re-ordered | S | Testing — Per Feature \| checklist.md:L115 |
| CHK-062 | P1 | Graceful fallback to RRF when model file missing (no error to caller, warn log) | M | Testing — Per Feature \| checklist.md:L116 |
| CHK-063 | P1 | Graceful fallback to RRF when total memory < 8GB (no error to caller, warn log) | M | Testing — Per Feature \| checklist.md:L117 |
| CHK-064 | P1 | Reranking latency <500ms for top-20 candidates (benchmark) | L | Testing — Per Feature \| checklist.md:L118 |
| CHK-065 | P1 | Model cached after first load — no re-allocation per query | S | Testing — Per Feature \| checklist.md:L119 |
| CHK-069 | P2 | Eval comparison documented: local GGUF MRR@5 vs remote Cohere/Voyage MRR@5 | L | Testing — Per Feature \| checklist.md:L123 |
| CHK-070 | P1 | Server startup instruction string includes: total memory count | S | Testing — Per Feature \| checklist.md:L126 |
| CHK-071 | P1 | Instruction string includes: spec folder count | S | Testing — Per Feature \| checklist.md:L127 |
| CHK-072 | P1 | Instruction string includes: available search channels (vector, FTS5, BM25, graph, degree) | S | Testing — Per Feature \| checklist.md:L128 |
| CHK-073 | P1 | Instruction string includes: key tool names (memory_context, memory_search, memory_save) | S | Testing — Per Feature \| checklist.md:L129 |
| CHK-074 | P1 | Stale memory warning included when staleCount > 10 | M | Testing — Per Feature \| checklist.md:L130 |
| CHK-075 | P1 | `SPECKIT_DYNAMIC_INIT=false` disables instruction injection completely | S | Testing — Per Feature \| checklist.md:L131 |
| CHK-077 | P1 | Changed `.md` file re-indexed within 5 seconds of save (end-to-end) | M | Testing — Per Feature \| checklist.md:L135 |
| CHK-078 | P1 | Rapid consecutive saves (5x within 1s) debounced to exactly 1 re-index | M | Testing — Per Feature \| checklist.md:L136 |
| CHK-079 | P1 | Content-hash dedup: saving file with IDENTICAL content triggers NO re-index | M | Testing — Per Feature \| checklist.md:L137 |
| CHK-083 | P1 | `SPECKIT_FILE_WATCHER=false` (default) means no watcher starts | S | Testing — Per Feature \| checklist.md:L141 |
| CHK-084 | P1 | Only `.md` files trigger re-index (`.txt`, `.json`, etc. ignored) | M | Testing — Per Feature \| checklist.md:L142 |
| CHK-088 | P0 | Record baseline `eval_run_ablation` results for all 9 metrics: MRR@5, precision@5, recall@5, NDCG@5, MAP, hit_rate, latency_p50, latency_p95, token_usage | L | Regression Testing \| checklist.md:L154 |
| CHK-089 | P0 | `eval_run_ablation` after Phase 1: all 9 metrics within 5% of baseline | L | Regression Testing \| checklist.md:L157 |
| CHK-090 | P0 | `eval_run_ablation` after Phase 2: all 9 metrics within 5% of baseline | L | Regression Testing \| checklist.md:L158 |
| CHK-091 | P0 | `eval_run_ablation` after Phase 3: all 9 metrics stable or improved (reranker may lift quality) | L | Regression Testing \| checklist.md:L159 |
| CHK-092 | P0 | Existing `memory_search` call (no new params) returns byte-identical results | L | Regression Testing \| checklist.md:L162 |
| CHK-093 | P0 | Existing `memory_context` call returns identical results | L | Regression Testing \| checklist.md:L163 |
| CHK-094 | P0 | Existing `memory_match_triggers` call returns identical results | L | Regression Testing \| checklist.md:L164 |
| CHK-141 | P2 | Findings saved to memory/ via generate-context.js | M | File Organization \| checklist.md:L199 |

### 006-ux-hooks-automation
| ID | Priority | Description | Effort | Notes |
|---|---|---|---|---|
| CHK-001 | P0 | Requirements documented in spec.md | M | Pre-Implementation \| AUDIT-2026-03-08: unchecked — evidence was generic boilerplate, needs specific file/test references \| checklist.md:L45 |
| CHK-002 | P0 | Technical approach defined in plan.md | M | Pre-Implementation \| AUDIT-2026-03-08: unchecked — evidence was generic boilerplate, needs specific file/test references \| checklist.md:L46 |
| CHK-003 | P1 | Dependencies identified and available | M | Pre-Implementation \| AUDIT-2026-03-08: unchecked — evidence was generic boilerplate, needs specific file/test references \| checklist.md:L47 |
| CHK-011 | P0 | No console errors or warnings | M | Code Quality \| AUDIT-2026-03-08: unchecked — evidence contradicts claim by admitting active stderr warnings \| checklist.md:L56 |
| CHK-031 | P0 | Input validation implemented | M | Security \| AUDIT-2026-03-08: unchecked — evidence was generic boilerplate, needs specific file/test references \| checklist.md:L78 |
| CHK-032 | P1 | Auth/authz working correctly | M | Security \| AUDIT-2026-03-08: unchecked — evidence was generic boilerplate, needs specific file/test references \| checklist.md:L79 |
| CHK-041 | P1 | Code comments adequate | M | Documentation \| AUDIT-2026-03-08: unchecked — evidence was generic boilerplate, needs specific file/test references \| checklist.md:L88 |
| CHK-042 | P2 | README updated (if applicable) | M | Documentation \| AUDIT-2026-03-08: unchecked — evidence was generic boilerplate, needs specific file/test references \| checklist.md:L89 |
| CHK-050 | P1 | Temp files in scratch/ only | M | File Organization \| AUDIT-2026-03-08: unchecked — evidence contradicted by actual scratch/ contents (codex-review-report.md, review-report.md present) \| checklist.md:L98 |
| CHK-051 | P1 | scratch/ cleaned before completion | M | File Organization \| AUDIT-2026-03-08: unchecked — evidence contradicted by actual scratch/ contents (codex-review-report.md, review-report.md present) \| checklist.md:L99 |

### 008-architecture-audit
No unchecked items.

### 009-spec-descriptions
| ID | Priority | Description | Effort | Notes |
|---|---|---|---|---|
| CHK-011 | P0 | Memory filename uniqueness guaranteed — 10 rapid saves = 10 distinct files | M | CODE QUALITY \| checklist.md:L48 |
| CHK-013 | P1 | Backward compatibility — `ensureDescriptionCache()` returns same results for existing folders | M | CODE QUALITY \| checklist.md:L50 |
| CHK-015 | P1 | `memorySequence` counter increments correctly on each save | M | CODE QUALITY \| checklist.md:L52 |
| CHK-022 | P0 | Uniqueness test: 10 saves to same folder → 10 unique filenames | M | TESTING \| checklist.md:L65 |
| CHK-024 | P1 | Stale detection test: edit spec.md → description.json regenerated | M | TESTING \| checklist.md:L67 |
| CHK-025 | P1 | Mixed mode: folders with/without description.json → aggregation works | M | TESTING \| checklist.md:L68 |
| CHK-026 | P1 | Collision test: same slug + same timestamp → sequential suffix `-1`, `-2` | M | TESTING \| checklist.md:L69 |
| CHK-027 | P2 | Concurrent write test: two parallel saves → no corruption | M | TESTING \| checklist.md:L70 |
| CHK-028 | P1 | Per-folder description.json read completes in <5ms (NFR-P01) | M | TESTING \| checklist.md:L71 |
| CHK-029 | P1 | Full 500-folder aggregation scan completes in <500ms (NFR-P02) | L | TESTING \| checklist.md:L72 |
| CHK-043 | P2 | Implementation-summary.md created after implementation | M | DOCUMENTATION \| checklist.md:L93 |
| CHK-052 | P2 | Findings saved to memory/ | M | FILE ORGANIZATION \| checklist.md:L103 |

### 012-command-alignment
| ID | Priority | Description | Effort | Notes |
|---|---|---|---|---|
| CHK-052 | P2 | Findings saved to memory/ | M | File Organization \| checklist.md:L92 |
| L131 | P0 | No additional phase-specific blockers recorded for this checklist normalization pass. | S | P0 \| checklist.md:L131 |
| L134 | P1 | No additional required checks beyond documented checklist items for this phase. | S | P1 \| checklist.md:L134 |

