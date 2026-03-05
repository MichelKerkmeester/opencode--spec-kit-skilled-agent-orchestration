---
title: "Implementation Plan: Sprint 5 — Pipeline Refactor"
description: "4-stage pipeline refactor, spec folder pre-filter, query expansion, and spec-kit retrieval metadata implementation plan."
trigger_phrases:
  - "sprint 5 plan"
  - "pipeline refactor plan"
  - "R6 plan"
  - "4-stage pipeline plan"
importance_tier: "normal"
contextType: "implementation" # SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2
---
# Implementation Plan: Sprint 5 — Pipeline Refactor

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
| **Feature Flags** | `SPECKIT_PIPELINE_V2`, `SPECKIT_EMBEDDING_EXPANSION` |

### Overview

Refactor the retrieval pipeline into a clean 4-stage architecture: Stage 1 (Candidate Generation), Stage 2 (Fusion + Signal Integration), Stage 3 (Rerank + Aggregate), Stage 4 (Filter + Annotate — NO SCORE CHANGES). After the pipeline refactor passes its 0-ordering-difference gate, implement spec folder pre-filter (R9), query expansion with R15 mutual exclusion (R12), template anchor optimization (S2), and validation signals as retrieval metadata (S3).

### R6 Stage Architecture

| Stage | Name | Operations |
|-------|------|------------|
| 1 | Candidate Gen | 5 channels execute (FTS5, semantic, trigger, graph, co-activation) |
| 2 | Fusion + Signal Integration | RRF/RSF, causal boost, co-activation, composite, intent weights (ONCE) |
| 3 | Rerank + Aggregate | Cross-encoder rerank, MMR diversity, MPAB chunk aggregation |
| 4 | Filter + Annotate | State filter, evidence-gap + feature/state metadata attribution; session dedup and constitutional injection run post-cache in handler — **NO SCORE CHANGES** |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Sprint 4 exit gate)
- [ ] Checkpoint created before R6 work

### Definition of Done
- [ ] All acceptance criteria met (REQ-S5-001 through REQ-S5-006)
- [ ] Tests passing (30-40 new tests + all 158+ existing)
- [ ] Docs updated (spec/plan/tasks)
- [ ] Stage 4 invariant verified
- [ ] 0 ordering differences on full eval corpus
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline architecture — replace ad-hoc scoring/filtering with explicit 4-stage pipeline with stage interfaces and invariants.

### Key Components
- **Stage 1: Candidate Generator**: Executes 5 channels in parallel, collects raw results
- **Stage 2: Fusion Engine**: Single point for all scoring signals — RRF/RSF, causal boost, co-activation, composite, intent weights (applied ONCE here only)
- **Stage 3: Reranker + Aggregator**: Cross-encoder rerank, MMR diversity enforcement, MPAB chunk-to-memory aggregation
- **Stage 4: Filter + Annotator**: State filtering, evidence-gap detection, feature/state metadata attribution — NO score modifications (invariant). Session dedup and constitutional injection remain post-cache in handler runtime boundary.

### Data Flow
1. Query enters Stage 1 --> 5 channels generate candidates
2. Stage 2 fuses results with all scoring signals (single application point)
3. Stage 3 reranks and aggregates (cross-encoder, MMR, MPAB)
4. Stage 4 filters and annotates (no score changes) --> final results
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: R6 Pipeline Refactor (40-55h)

> **F9 — REQUIRED DECOMPOSITION**: R6 (40-55h) is the single largest work item in the entire 8-sprint plan. Treat it as 5-8 sequential subtasks rather than one monolithic task to enable incremental dark-run verification and reduce integration risk. See tasks.md T002a-T002h for subtask breakdown.
>
> **Flag interaction risk**: By Sprint 5, 10+ feature flags have accumulated across Sprints 0-4. T002g (feature flag interaction testing) must verify all flags remain functional under PIPELINE_V2 before Phase B begins.

- [ ] Create checkpoint: `memory_checkpoint_create("pre-pipeline-refactor")`
- [ ] (a) Design stage interfaces (input/output types for each stage) — WHY: Enforces Stage 4 immutability at the type level before any code migration begins
- [ ] (b) Implement Stage 1: Candidate Generation (5-channel parallel execution) — WHY: Establishes the clean entry boundary; channels must not communicate until Stage 2
- [ ] (c) Implement Stage 2: Fusion + Signal Integration (single scoring point) — WHY: Consolidating all scoring here prevents G2 recurrence; intent weights applied exactly once
- [ ] (d) Implement Stage 3: Rerank + Aggregate (cross-encoder, MMR, MPAB) — WHY: MPAB must remain post-RRF (Sprint 4 pipeline position constraint)
- [ ] (e) Implement Stage 4: Filter + Annotate (NO score changes — invariant) — WHY: Invariant guard catches any future Stage 4 score-modification attempts as build/runtime errors
- [ ] (f) Add feature flag `SPECKIT_PIPELINE_V2` (old pipeline active when OFF — backward compatible)
- [ ] (g) Verify feature flag interactions: all 10+ accumulated flags work under PIPELINE_V2
- [ ] (h) Verify 0 ordering differences on full eval corpus (GATE — Phase B blocked until this passes)
- [ ] Verify all 158+ existing tests pass
- [ ] Verify intent weights applied ONCE in Stage 2

- [ ] Record p95 simple query latency baseline on eval corpus (R12 prerequisite — UT-7 R3) [1-2h]

### Phase B: Search + Spec-Kit (28-41h) — after Phase A passes
- [ ] R9: Implement spec folder pre-filter [5-8h]
- [ ] R12: Implement query expansion with R15 mutual exclusion, behind `SPECKIT_EMBEDDING_EXPANSION` flag [10-15h]
- [ ] S2: Implement template anchor optimization [5-8h]
- [ ] S3: Implement validation signals as retrieval metadata [4-6h]
- [ ] TM-05: Add memory auto-surface hooks at tool dispatch and session compaction lifecycle points in `hooks/memory-surface.ts` — per-point token budget of 4000 max; config/logic change in Spec-Kit integration layer [4-6h]

### Phase C: Verification
- [ ] Verify R9 cross-folder identical results
- [ ] Verify R12+R15 mutual exclusion (R12 suppressed when R15="simple")
- [ ] Verify R12 no simple query latency degradation
- [ ] Sprint 5 exit gate verification
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Regression | R6 full corpus ordering comparison | Vitest + eval infra | 1-2 tests |
| Unit | R6 stage boundaries and interfaces | Vitest | 4-6 tests |
| Unit | R6 Stage 4 invariant (score immutability) | Vitest | 2-3 tests |
| Unit | R9 pre-filter behavior | Vitest | 2-3 tests |
| Unit | R12 expansion + R15 suppression | Vitest | 2-3 tests |
| Unit | S2 anchor metadata, S3 validation metadata | Vitest | 2-3 tests |
| Unit | TM-05 dual-scope injection (tool dispatch hook, compaction hook, token budget enforcement, no regression) | Vitest | 2-4 tests |
| Unit | PI-B1 tree thinning (merge thresholds, memory thresholds, content preservation, pre-pipeline boundary, R9 interaction) | Vitest | 3-5 tests |
| Unit | PI-B2 progressive validation (detect level, auto-fix with diff logging, suggest level, report level, dry-run mode, exit code compat, no caller regression) | Vitest | 5-8 tests |

**Total**: 30-40 new tests (1000-1500 LOC)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 4 exit gate | Internal | Yellow | Cannot begin — feedback loop must be verified |
| Checkpoint infrastructure | Internal | Green | Required before R6 work begins |
| R15 (Sprint 3) | Internal | Green | R12 depends on R15 classification for mutual exclusion |
| Eval infrastructure (R13) | Internal | Green | Required for ordering comparison |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Ordering regressions in R6 dark-run; Stage 4 invariant violations; test failures
- **Procedure**: Restore from checkpoint; revert R6; re-run tests. Phase B items are incremental and independently revertible.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase A (R6 Pipeline) ──[0 ordering diff GATE]──► Phase B (R9, R12, S2, S3) ──► Phase C (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase A (R6) | Sprint 4 exit gate, checkpoint | Phase B, Phase C |
| Phase B (R9, R12, S2, S3) | Phase A passes 0-diff gate | Phase C |
| Phase C (Verify) | Phase A, Phase B | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase A: R6 Pipeline Refactor | High | 40-55h |
| Phase B: R9 Pre-filter | Low-Medium | 5-8h |
| Phase B: R12 Query Expansion | Medium | 10-15h |
| Phase B: S2 Template Anchors | Low-Medium | 5-8h |
| Phase B: S3 Validation Metadata | Low | 4-6h |
| Phase B: TM-05 Auto-Surface Hooks | Low-Medium | 4-6h |
| Phase C: Verification | Low | included |
| **Subtotal (Core)** | | **68-98h** |
| PI-B1: Tree Thinning | Low | 10-14h |
| PI-B2: Progressive Validation | Medium | 16-24h |
| **Grand Total (incl. PageIndex)** | | **94-136h** |

> **Phase B parallelism note**: Phase B tasks (R9, R12, S2, S3, TM-05) are marked `[P]` (parallelizable) in tasks.md. The 28-43h effort estimate is sequential; wall-clock time may be significantly less if tasks are executed in parallel.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:pageindex-phases -->
## PageIndex Tasks

### PI-B1: Tree Thinning for Spec Folder Consolidation (10-14h)
- [ ] Implement bottom-up merge logic in `generate-context.js` for files under 200 tokens (merge summary into parent)
- [ ] Implement summary-as-content path for files under 500 tokens (no separate summary pass)
- [ ] Apply memory-specific thresholds: 300 tokens for thinning trigger, 100 tokens where text is the summary
- [ ] Wire thinning into spec folder context loading step (before Stage 1 candidate generation)
- [ ] Verify token reduction for spec folders with many small files — no content loss
- [ ] Verify Stage 4 invariant unaffected (thinning is pre-pipeline)
- [ ] Verify R9 spec folder pre-filter interaction — thinning does not alter folder identity
- **Effort**: 10-14h | **Risk**: Low

### PI-B2: Progressive Validation for Spec Documents (16-24h)
- [ ] Implement Detect level: identify all violations (preserves existing validate.sh behavior)
- [ ] Implement Auto-fix level: missing dates, heading level normalization, whitespace normalization — each fix logged with before/after diff
- [ ] Implement Suggest level: non-automatable issues presented with guided fix options
- [ ] Implement Report level: structured output with before/after diffs; exit 0/1/2 compatible with existing usage
- [ ] Add dry-run mode: show what would be auto-fixed without applying changes
- [ ] Verify auto-fix log captures all before/after diffs (primary mitigation for silent corruption)
- [ ] Verify exit code compatibility: exit 0 = pass, exit 1 = warnings, exit 2 = errors
- **Effort**: 16-24h | **Risk**: Medium | **Mitigation**: Mandatory before/after diff logging for all auto-fixes
<!-- /ANCHOR:pageindex-phases -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Checkpoint created: `pre-pipeline-refactor`
- [ ] Feature flags configured and defaulting to OFF
- [ ] Full eval corpus available for regression comparison
- [ ] All 158+ existing tests green before starting

### Rollback Procedure
1. Disable `SPECKIT_PIPELINE_V2` and `SPECKIT_EMBEDDING_EXPANSION` flags
2. Restore from `pre-pipeline-refactor` checkpoint if needed
3. Re-run full test suite to verify restoration
4. Phase B items (R9, R12, S2, S3) revert independently — no checkpoint needed

### Rollback Risk: HIGH
- R6 is a major refactor — full checkpoint restore may be needed (8-12h)
- Phase B items are incremental and independently revertible (1-2h each)

### R6 Off-Ramp
If ordering regressions cannot be resolved, retain current pipeline and implement R9, R12, S2, S3 as incremental patches to the existing code. This avoids the architectural invariant but preserves the retrieval improvements.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no schema changes in Sprint 5
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN — Phase 6 of 8
- Core + L2 addendums (Phase deps, Effort, Enhanced rollback)
- Sprint 5: Pipeline Refactor
-->
