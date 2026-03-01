---
title: "Tasks: Sprint 4 — Feedback and Quality"
description: "Task breakdown for MPAB chunk aggregation, learned relevance feedback, and shadow scoring."
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "sprint 4 tasks"
  - "feedback and quality tasks"
  - "MPAB tasks"
  - "R11 tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Sprint 4 — Feedback and Quality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] — requirement`

**Dependency Format**: `{T###}` = depends on task T###
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:checkpoint -->
## Safety Gate

- [ ] T-S4-PRE [GATE-PRE] Create checkpoint: `memory_checkpoint_create("pre-r11-feedback")` [0h] {} — Safety gate for R11 mutations and feedback data

> **CALENDAR DEPENDENCY — R11 (F10)**: R11 prerequisite requires R13 to complete ≥2 full eval cycles (each = 100+ queries AND 14+ calendar days; both conditions must be met). Minimum **28 calendar days** must elapse between Sprint 3 completion and R11 enablement. This is wall-clock time, NOT effort hours. If splitting into S4a/S4b (recommended), T002 (R11) cannot begin until S4a metrics confirm 2 full eval cycles are complete.
>
> **RECOMMENDED SPLIT — S4a / S4b (F3)**:
> - **S4a tasks**: T001 + T001a (R1 MPAB) + T003 + T003a (R13-S2 eval) + T007 (TM-04 quality gate) — estimated 33-49h. No schema change. Delivers A/B infra + save quality gating.
> - **S4b tasks**: T002 + T002a + T002b (R11 learned feedback) + T008 (TM-06 reconsolidation) — estimated 31-48h. Requires S4a verification + 28-day calendar window.
<!-- /ANCHOR:checkpoint -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: R1 MPAB Chunk Aggregation

- [x] T001 [P] Implement MPAB chunk-to-memory aggregation — `computeMPAB(scores)` with N=0/N=1 guards, index-based max removal, `_chunkHits` metadata, behind `SPECKIT_DOCSCORE_AGGREGATION` flag [8-12h] — R1
  - [x] T001a Preserve chunk ordering within documents — sort collapsed chunks by original document position before reassembly in `collapseAndReassembleChunkResults()` [2-4h] — B2
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: R11 Learned Relevance Feedback

- [x] T002 Implement learned relevance feedback — schema migration (`learned_triggers` column) + separate column isolation + 10 safeguards (denylist 100+, rate cap 3/8h, TTL 30d decay, FTS5 isolation, noise floor top-3, rollback mechanism, provenance/audit log, shadow period 1 week, eligibility 72h, sprint gate review) + 0.7x query weight, behind `SPECKIT_LEARN_FROM_SELECTION` flag [16-24h] — R11
  - [x] T002a Implement memory importance auto-promotion — threshold-based tier promotion when validation count exceeds configurable threshold (default: 5 validations → promote normal→important, 10 → important→critical) [5-8h] — R11 extension
  - [x] T002b Activate negative feedback confidence signal — wire `memory_validate(wasUseful: false)` confidence score into composite scoring as demotion multiplier (floor=0.3, gradual decay); feature-flaggable [4-6h] — A4 (R11 extension, prerequisite for DEF-003)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: R13-S2 Shadow Scoring

- [x] T003 Implement R13-S2 — shadow scoring + channel attribution + ground truth Phase B [15-20h] — R13-S2
  - [x] T003a Implement Exclusive Contribution Rate metric — measure how often each channel is the SOLE source for a result in top-K [2-3h] — R13-S2 extension
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4-tm04 -->
## Phase 4: TM-04 Pre-Storage Quality Gate

- [x] T007 [P] Implement multi-layer pre-storage quality gate in `memory_save` handler behind `SPECKIT_SAVE_QUALITY_GATE` flag [6-10h] — TM-04 (REQ-S4-004)
  - [x] T007a Layer 1: structural validation (existing checks, formalised)
  - [x] T007b Layer 2: content quality scoring — title, triggers, length, anchors, metadata, signal density; threshold >= 0.4
  - [x] T007c Layer 3: semantic dedup — cosine similarity > 0.92 against existing memories = reject
  - [x] T007d Warn-only mode (MR12): for first 2 weeks, log quality scores and would-reject decisions but do NOT block saves; tune thresholds based on false-rejection rate before enforcement
<!-- /ANCHOR:phase-4-tm04 -->

---

<!-- ANCHOR:phase-5-tm06 -->
## Phase 5: TM-06 Reconsolidation-on-Save

- [x] T008 [P] Implement reconsolidation-on-save in `memory_save` handler behind `SPECKIT_RECONSOLIDATION` flag; create checkpoint before enabling [6-10h] — TM-06 (REQ-S4-005)
  - [x] T008a Checkpoint: `memory_checkpoint_create("pre-reconsolidation")` before first enable
  - [x] T008b After embedding generation, query top-3 most similar memories in `spec_folder`
  - [x] T008c Merge path (similarity >=0.88): merge content, increment frequency counter
  - [x] T008d Conflict path (0.75–0.88): replace memory, add causal `supersedes` edge
  - [x] T008e Complement path (<0.75): store new memory unchanged
<!-- /ANCHOR:phase-5-tm06 -->

---

<!-- ANCHOR:gnew3 -->
## G-NEW-3: Ground Truth Diversification

- [x] T027a [W-C] Implement G-NEW-3 Phase B: implicit feedback collection from user selections for ground truth [4-6h] {T-S4-PRE, R13 2-cycle prerequisite} — G-NEW-3
  - Acceptance: user selection events tracked and stored; selection data available for ground truth expansion
- [ ] T027b [W-C] Implement G-NEW-3 Phase C: LLM-judge ground truth generation — minimum 200 query-selection pairs before R11 activation [4-6h] {T027a} — G-NEW-3
  - Acceptance: LLM-judge generates relevance labels for query-selection pairs; ground truth corpus expanded to ≥200 pairs
  - Prerequisite: minimum 200 query-selection pairs accumulated before R11 mutations enabled (REQ-017)
<!-- /ANCHOR:gnew3 -->

---

<!-- ANCHOR:pageindex -->
## PageIndex Tasks

> **T009 (PI-A4) deferred to Sprint 5** — Constitutional memory as expert knowledge injection (8-12h) has no Sprint 4 dependency. Moved to Sprint 5 per ultra-think review REC-07.
<!-- /ANCHOR:pageindex -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Verification

- [ ] T004 Verify R1 dark-run: MRR@5 within 2%, N=1 no regression [included] {T001}
- [ ] T005 Analyze R11 shadow log: noise rate <5% [included] {T002}
- [ ] T-IP-S4 [P0] **Interaction pair test: R1+N4** — verify N4 cold-start boost applied BEFORE MPAB aggregation; combined boost capped at 0.95 [1-2h] {T001, T004} — CHK-035
- [ ] T-FS4 Feature flag sunset review at Sprint 4 exit — review all active feature flags; permanently enable flags with positive metrics, remove flags with negative metrics, extend measurement window (max 14 days) for inconclusive flags; ensure ≤6 simultaneous active flags [0.5-1h] {T005} — NFR-O01/O02/O03
- [ ] T006 [GATE] Sprint 4 exit gate verification [0h] {T001, T002, T003, T004, T005, T007, T008, T-FS4}
  - [x] R11 auto-promotion thresholds verified (5→important, 10→critical) [evidence: auto-promotion.ts `PROMOTE_TO_IMPORTANT_THRESHOLD = 5`, `PROMOTE_TO_CRITICAL_THRESHOLD = 10`; executeAutoPromotion() implements upward-only promotion with throttle safeguard]
  - [x] R13-S2 Exclusive Contribution Rate metric operational [evidence: channel-attribution.ts `computeExclusiveContributionRate()` with `attributeChannels()` tagging per result; ECR = exclusiveCount/totalInTopK per channel]
  - [x] A4 negative feedback: confidence demotion floor verified at 0.3; no over-suppression [evidence: negative-feedback.ts `CONFIDENCE_MULTIPLIER_FLOOR = 0.3`, `computeConfidenceMultiplier()` uses `Math.max(CONFIDENCE_MULTIPLIER_FLOOR, ...)` with 30-day recovery half-life]
  - [x] B2 chunk ordering: multi-chunk memories reassembled in document order, not score order [evidence: mpab-aggregation.ts line 163 sorts by chunkIndex ascending; test "T001a: chunks maintain document position order" passes]
  - [x] TM-04 quality gate: low-quality saves blocked (signal density <0.4); semantic near-duplicates (>0.92) rejected [evidence: save-quality-gate.ts `SIGNAL_DENSITY_THRESHOLD = 0.4`, `SEMANTIC_DEDUP_THRESHOLD = 0.92`; ~90 tests in save-quality-gate.vitest.ts]
  - [x] TM-06 reconsolidation: merge/replace/store paths verified; checkpoint created before enable [evidence: reconsolidation.ts `MERGE_THRESHOLD = 0.88`, `CONFLICT_THRESHOLD = 0.75`; memory-save.ts `hasReconsolidationCheckpoint()` safety gate; sprint4-integration tests cover all 3 paths]
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] R1 MRR@5 within 2% of baseline verified
- [ ] R11 noise rate <5% verified
- [ ] R11 FTS5 contamination test passing
- [ ] R13-S2 A/B infrastructure operational
- [ ] Schema migration completed successfully
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:task-id-mapping -->
## Task ID Mapping (Child → Parent)

Child tasks use local IDs; parent `../tasks.md` uses global IDs. Cross-reference table:

| Child Task ID | Parent Task ID | Description |
|---------------|----------------|-------------|
| T-S4-PRE | T025c | Checkpoint creation (pre-R11-feedback) |
| T001 | T026 | MPAB chunk-to-memory aggregation (R1) |
| T001a | T026a | Preserve chunk ordering (B2) |
| T002 | T027 | Learned relevance feedback (R11) |
| T002a | T027c | Memory importance auto-promotion |
| T002b | T027d | Negative feedback confidence signal (A4) |
| T003 | T028 | R13-S2 shadow scoring + channel attribution |
| T003a | T028a | Exclusive Contribution Rate metric |
| T007 | T058 | Pre-storage quality gate (TM-04) |
| T008 | T059 | Reconsolidation-on-save (TM-06) |
| T027a | T027a | G-NEW-3 Phase B: implicit feedback collection |
| T027b | T027b | G-NEW-3 Phase C: LLM-judge ground truth |
| T004 | T029 | Verify R1 dark-run |
| T005 | T030 | Analyze R11 shadow log |
| T-IP-S4 | *(not in parent)* | Interaction pair test R1+N4 (CHK-035) |
| T-FS4 | T-FS4 | Feature flag sunset review (Sprint 4 exit) |
| T006 | T031 | Sprint 4 exit gate verification |
<!-- /ANCHOR:task-id-mapping -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Parent Plan**: See `../plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 5 of 8
- Sprint 4: Feedback and Quality
- 9 tasks across 6 phases
-->
