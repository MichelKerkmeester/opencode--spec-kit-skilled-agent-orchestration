---
title: "Implementation Plan: Sprint 4 — Feedback and Quality"
description: "MPAB chunk aggregation, learned relevance feedback, and shadow scoring infrastructure implementation plan."
# SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2
trigger_phrases:
  - "sprint 4 plan"
  - "feedback and quality plan"
  - "MPAB plan"
  - "R11 plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Sprint 4 — Feedback and Quality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Storage** | SQLite / FTS5 / sqlite-vec |
| **Testing** | Vitest |
| **Feature Flags** | `SPECKIT_DOCSCORE_AGGREGATION`, `SPECKIT_LEARN_FROM_SELECTION` |

### Overview

Implement MPAB chunk-to-memory aggregation operating after RRF fusion and before state filtering. Implement learned relevance feedback writing to a separate `learned_triggers` column at lower weight (0.7x) with 7 strict safeguards. Extend eval infrastructure with shadow scoring, channel attribution, and ground truth Phase B for full A/B evaluation.

### Architecture

R1 MPAB operates after RRF fusion, before state filtering. R11 writes to separate column, queried at lower weight (0.7x). R13-S2 extends eval with shadow scoring.

**R1 MPAB corrected**: `computeMPAB(scores)` -- sorted descending, sMax=sorted[0], remaining=sorted.slice(1), bonus=0.3*sum(remaining)/sqrt(N). Pipeline position: after RRF, before state filter. Metadata: preserve `_chunkHits: scores.length`.

**R11 safeguards**: (1) Separate column, (2) 30-day TTL, (3) 100+ stop words denylist, (4) Max 3 terms/selection + 8 per memory, (5) Only when NOT in top 3, (6) 1-week shadow, (7) Exclude <72h memories.

**Checkpoint recommended before this sprint.**

---

> **RECOMMENDED: Sub-Sprint Split (F3)**
>
> Sprint 4 should be split into S4a and S4b to isolate R11's CRITICAL FTS5 contamination risk:
>
> - **S4a** (33-49h): R1 MPAB + R13-S2 enhanced evaluation + TM-04 pre-storage quality gate. No schema changes. Delivers A/B infrastructure and save quality gating before feedback mutations.
> - **S4b** (31-48h): R11 learned feedback + TM-06 reconsolidation. Begins only after S4a metrics confirm no regressions and R13 has completed 2+ full eval cycles.
>
> Rationale: R11 FTS5 contamination is irreversible without full re-index. Isolating it prevents risk concentration and ensures the detection infrastructure (R13-S2 A/B) is operational before mutations begin.

> **F10 — CALENDAR DEPENDENCY (R11 prerequisite)**
>
> R11 prerequisite: R13 must have completed ≥2 full eval cycles. Each cycle = minimum 100 queries evaluated AND 14+ calendar days (both conditions must be met). Two cycles = **minimum 28 calendar days** of wall-clock time. This forced idle time between Sprint 3 completion and R11 enablement is NOT reflected in effort hours. Plan the project timeline explicitly to include this idle window between S4a completion and S4b start.

> **F10 Idle Window Activities (28-day S4a→S4b transition)**
>
> The 28-day mandatory window between S4a completion and S4b start is structured work, not idle time:
>
> 1. **Monitor R13-S2 A/B dashboards** — verify shadow scoring infrastructure is collecting valid comparison data
> 2. **Collect and review R1 shadow log data** — confirm MPAB aggregation impact on MRR@5, identify any edge cases
> 3. **Validate MPAB coefficient** — compare the 0.3 bonus coefficient against observed MRR@5 measurements; revise if delta >5%
> 4. **Derive R11 query weight** — use channel attribution data from R13-S2 to determine if 0.7x is appropriate for learned_triggers; adjust based on empirical signal-to-noise ratio
> 5. **14-day mid-window checkpoint** (see CHK-076a) — verify eval infrastructure is collecting valid data after one complete cycle
> 6. **Produce S4b readiness report** — document coefficient validation results, parameter decisions, and any scope adjustments before S4b begins
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Sprint 3 exit gate, R13 2+ eval cycles)
- [ ] Checkpoint created before sprint start

### Definition of Done
- [ ] All acceptance criteria met (REQ-S4-001 through REQ-S4-005)
- [ ] Tests passing (22-32 new tests)
- [ ] Docs updated (spec/plan/tasks)
- [ ] FTS5 contamination test passing
- [ ] Schema migration verified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline extension + schema migration — R1 appends aggregation stage, R11 adds learned feedback column, R13-S2 extends eval infrastructure.

### Key Components
- **MPAB Aggregator**: Computes chunk-to-memory score using `sMax + 0.3 * sum(remaining) / sqrt(N)` with N=0 and N=1 guards
- **Learned Feedback Engine**: Writes to `learned_triggers` column with 7-layer safeguard stack
- **Shadow Scoring Engine**: Runs parallel scoring paths for A/B comparison without affecting production results
- **Channel Attribution**: Tags each result with source channel for eval analysis

### Data Flow
1. Chunks scored individually by pipeline
2. R1 MPAB aggregates chunk scores per memory (after RRF, before state filter)
3. R11 observes user selections, writes learned triggers (after 1-week shadow)
4. R13-S2 logs shadow scores + channel attribution for A/B analysis
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: R1 MPAB Chunk Aggregation (8-12h)
- [ ] Implement `computeMPAB(scores)` function with sorted descending logic
- [ ] Add N=0 guard (return 0) and N=1 guard (return score, no bonus)
- [ ] Implement index-based max removal (not value-based, handles ties)
- [ ] Preserve `_chunkHits: scores.length` metadata
- [ ] Add feature flag `SPECKIT_DOCSCORE_AGGREGATION`
- [ ] Position in pipeline: after RRF fusion, before state filtering
- [ ] Verify MRR@5 within 2% and N=1 no regression

### Phase 2: R11 Learned Relevance Feedback (16-24h)
- [ ] Schema migration: `ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'`
- [ ] Implement safeguard 1: Separate column (NOT in FTS5 index)
- [ ] Implement safeguard 2: 30-day TTL on learned terms
- [ ] Implement safeguard 3: 100+ stop words denylist
- [ ] Implement safeguard 4: Max 3 terms/selection + 8 per memory cap
- [ ] Implement safeguard 5: Only when memory NOT in top 3 results
- [ ] Implement safeguard 6: 1-week shadow period (log but don't apply)
- [ ] Implement safeguard 7: Exclude memories <72h old
- [ ] Add feature flag `SPECKIT_LEARN_FROM_SELECTION`
- [ ] Query learned_triggers at 0.7x weight

### Phase 3: R13-S2 Shadow Scoring + Ground Truth Phase B (15-20h)
- [ ] Implement shadow scoring infrastructure
- [ ] Add channel attribution to results
- [ ] Implement ground truth Phase B (expanded annotations)
- [ ] Full A/B comparison infrastructure

### Phase 4: TM-04 Pre-Storage Quality Gate (6-10h)
- [ ] Implement Layer 1 structural validation (existing checks, formalised)
- [ ] Implement Layer 2 content quality scoring — evaluate title, triggers, length, anchors, metadata, signal density; reject if signal density < 0.4
- [ ] Implement Layer 3 semantic dedup — compute cosine similarity against existing memories; reject if >0.92 similarity found
- [ ] Wire all 3 layers behind `SPECKIT_SAVE_QUALITY_GATE` feature flag
- [ ] Implement warn-only mode (MR12 mitigation): for the first 2 weeks after activation, log quality scores and would-reject decisions but do NOT block saves; tune thresholds based on observed false-rejection rate before enabling enforcement

### Phase 5: TM-06 Reconsolidation-on-Save (6-10h)
- [ ] Create checkpoint: `memory_checkpoint_create("pre-reconsolidation")` before enabling
- [ ] After embedding generation, query top-3 most similar memories in `spec_folder`
- [ ] Implement merge path (similarity >=0.88): merge content, increment frequency counter
- [ ] Implement conflict path (0.75–0.88): replace memory, add causal supersedes edge
- [ ] Implement complement path (<0.75): store new memory unchanged
- [ ] Wire behind `SPECKIT_RECONSOLIDATION` feature flag

### Phase 6: Verification
- [ ] Verify R1 dark-run (MRR@5 within 2%, N=1 no regression)
- [ ] Analyze R11 shadow log (noise rate <5%)
- [ ] Verify FTS5 contamination test
- [ ] Verify TM-04 quality gate rejects low-quality saves and near-duplicates (>0.92)
- [ ] Verify TM-06 reconsolidation — merge/replace/store paths behave correctly
- [ ] Sprint 4 exit gate verification
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | R1 MPAB: N=0, N=1, N=2, N=10, metadata preservation | Vitest | 4-5 tests |
| Unit | R11: column isolation, TTL, denylist, cap, eligibility, shadow | Vitest | 5-7 tests |
| Unit | R11 auto-promotion: 5 validations → normal→important, 10 → important→critical, below-threshold no-op | Vitest | 2-3 tests |
| Unit | A4 negative feedback: wasUseful=false reduces score via confidence multiplier, floor at 0.3, gradual decay | Vitest | 2-3 tests |
| Unit | B2 chunk ordering: collapsed multi-chunk results maintain document position order, not score order | Vitest | 1-2 tests |
| Unit | TM-04 quality gate: L1 structural pass/fail, L2 signal density <0.4 reject, L3 cosine >0.92 reject, flag-off no-op | Vitest | 4-6 tests |
| Unit | TM-06 reconsolidation: merge (>=0.88), conflict (0.75-0.88), complement (<0.75), checkpoint created, flag-off no-op | Vitest | 4-5 tests |
| Integration | R11 FTS5 contamination test | Vitest | 1 test |
| Integration | R13-S2 shadow scoring + attribution + exclusive contribution rate | Vitest | 2-3 tests |
| Integration | TM-04/TM-06 threshold interaction: [0.88, 0.92] passes TM-04 then triggers TM-06 merge (save-then-merge) | Vitest | 1-2 tests |

**Total**: 22-32 new tests (800-1100 LOC)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 3 exit gate | Internal | Yellow | Cannot begin — query intelligence must be verified |
| R13 2+ eval cycles | Internal | Yellow | Blocks R11 mutations (P0 prerequisite) |
| SQLite 3.35.0+ | External | Green | Required for `DROP COLUMN` rollback |
| Checkpoint infrastructure | Internal | Green | Recommended before sprint start |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: R1 MRR@5 regression >2%; R11 noise >5%; FTS5 contamination detected; schema migration failure
- **Procedure**: Disable flags, clear `learned_triggers` column, restore from checkpoint if needed
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (R1 MPAB) ──────────────────┐
                                      │
Phase 2 (R11 Learned Feedback) ──────┤
                                      │
Phase 3 (R13-S2 Shadow Scoring) ─────┼──► Phase 6 (Verify)
                                      │
Phase 4 (TM-04 Quality Gate) ────────┤
                                      │
Phase 5 (TM-06 Reconsolidation) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (R1) | Sprint 3 exit gate | Phase 6 |
| Phase 2 (R11) | Sprint 3 exit gate, R13 2+ eval cycles | Phase 6 |
| Phase 3 (R13-S2) | Sprint 3 exit gate | Phase 6 |
| Phase 4 (TM-04 Quality Gate) | Sprint 3 exit gate | Phase 6 |
| Phase 5 (TM-06 Reconsolidation) | Sprint 3 exit gate, Checkpoint | Phase 6 |
| Phase 6 (Verify) | Phase 1, Phase 2, Phase 3, Phase 4, Phase 5 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: R1 MPAB (incl. T001a chunk ordering) | Medium | 10-16h |
| Phase 2: R11 Learned Feedback (incl. T002a auto-promotion, T002b negative feedback) | High | 25-38h |
| Phase 3: R13-S2 Shadow Scoring (incl. T003a exclusive contribution rate) | Medium-High | 17-23h |
| Phase 4: TM-04 Pre-Storage Quality Gate | Medium | 6-10h |
| Phase 5: TM-06 Reconsolidation-on-Save | Medium | 6-10h |
| Phase 6: Verification | Low | included |
| **Total** | | **64-97h** |

> PI-A4 (Constitutional Memory as Expert Knowledge Injection, 8-12h) deferred to Sprint 5 — see REC-07 in ultra-think review.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:pageindex-phases -->
## PageIndex Tasks

> **PI-A4 deferred to Sprint 5** — Constitutional Memory as Expert Knowledge Injection (8-12h) has no Sprint 4 dependency and is retrieval-pipeline work that fits Sprint 5's theme (pipeline refactor + query expansion). See Sprint 5 spec `../006-sprint-5-pipeline-refactor/spec.md` for updated placement. Rationale: ultra-think review REC-07.
<!-- /ANCHOR:pageindex-phases -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Checkpoint created before sprint start
- [ ] R13 2+ eval cycles verified (P0 gate)
- [ ] Feature flags configured and defaulting to OFF
- [ ] Schema backup taken

### Rollback Procedure
1. Disable flags: `SPECKIT_DOCSCORE_AGGREGATION`, `SPECKIT_LEARN_FROM_SELECTION`
2. Clear `learned_triggers` column: `UPDATE memory_index SET learned_triggers = '[]'`
3. R1 is independently rollbackable — flag controls aggregation
4. Verify metrics return to pre-sprint values
5. If schema rollback needed: `ALTER TABLE memory_index DROP COLUMN learned_triggers` (SQLite 3.35.0+)

### Rollback Risk: MEDIUM-HIGH
- R11 schema change requires SQLite 3.35.0+ for `DROP COLUMN`
- R1 independent rollback (flag only) estimated at 1-2h
- Full rollback including schema revert estimated at 4-6h

### Data Reversal
- **Has data migrations?** Yes — `ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'`
- **Reversal procedure**: `ALTER TABLE memory_index DROP COLUMN learned_triggers` (SQLite 3.35.0+) or restore from checkpoint

### Combined S4b Failure Recovery (R11 + TM-06)

If both R11 and TM-06 have been active and a regression is detected:

1. **Disable both flags immediately**: `SPECKIT_LEARN_FROM_SELECTION=false`, `SPECKIT_RECONSOLIDATION=false`
2. **Identify R11-touched memories**: Query `SELECT id FROM memory_index WHERE learned_triggers != '[]'` — these memories have R11 mutations
3. **Identify TM-06-touched memories**: Query causal edges with `relation='supersedes'` created after TM-06 enable date; check frequency counter deltas against checkpoint baseline
4. **Assess overlap**: If overlap exists (memory both R11-written and TM-06-merged), restore from `pre-sprint-4b` checkpoint — partial rollback is unsafe
5. **If no overlap**: Roll back independently per existing single-system procedures
6. **Verify**: Run full test suite + R13 eval metrics against pre-S4b baseline

**Combined rollback time estimate**: 6-8h (vs 4-6h for single-system rollback). The additional time accounts for overlap assessment and potential checkpoint restore.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN — Phase 5 of 8
- Core + L2 addendums (Phase deps, Effort, Enhanced rollback)
- Sprint 4: Feedback and Quality
-->
