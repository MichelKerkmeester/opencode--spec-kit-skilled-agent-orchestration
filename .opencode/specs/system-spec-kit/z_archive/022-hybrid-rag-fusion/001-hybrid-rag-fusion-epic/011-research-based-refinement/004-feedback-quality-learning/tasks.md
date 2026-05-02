---
title: "...t/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/004-feedback-quality-learning/tasks]"
description: "Task tracking for D4 feedback event ledger, FSRS hybrid decay, quality gate exceptions, batch learning, reconsolidation, and shadow scoring."
trigger_phrases:
  - "d4 tasks"
  - "feedback learning tasks"
  - "event ledger tasks"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/004-feedback-quality-learning"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Feedback & Quality Learning

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-a -->
## Phase A — Logging & Gates (REQ-D4-001, REQ-D4-002, REQ-D4-003)

### Event Ledger (REQ-D4-001)

- [ ] T001 Design `feedback_events` SQLite table schema (columns: id, type, memoryId, queryId, confidence, timestamp, sessionId)
- [ ] T002 Create `feedback_events` table via migration in database setup
- [ ] T003 Implement `feedback-ledger.ts` — event recording functions (logEvent, queryEvents)
- [ ] T004 Wire Stage 2 hooks to emit `search_shown` and `result_cited` events
- [ ] T005 Wire query pipeline to emit `query_reformulated` and `same_topic_requery` events
- [ ] T006 Wire tool-use detection to emit `follow_on_tool_use` events
- [ ] T007 [P] Write unit tests for `feedback-ledger.ts` (event recording, confidence classification, query interface)

### FSRS Hybrid Decay (REQ-D4-002)

- [ ] T008 Add type-aware decay classification to `fsrs-scheduler.ts` (no-decay for decision/constitutional/critical)
- [ ] T009 Add `SPECKIT_HYBRID_DECAY_POLICY` feature flag and gating logic
- [ ] T010 [P] Write unit tests for hybrid decay (verify decisions never decay, engagement docs use FSRS)

### Quality Gate Exception (REQ-D4-003)

- [ ] T011 Add structural-signal counting logic to `save-quality-gate.ts` (title, specFolder, anchor)
- [ ] T012 Implement length-gate bypass for `context_type === 'decision'` with >=2 structural signals
- [ ] T013 Add `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS` feature flag with warn-only logging
- [ ] T014 [P] Write unit tests for gate exception (short decision passes, non-decision rejected, warn logged)

### Phase A Validation

- [ ] T015 Integration test: event ledger round-trip (log event, query back, verify schema)
- [ ] T016 Integration test: quality gate exception for short decision documents
- [ ] T017 Run existing test suite — verify no regressions
<!-- /ANCHOR:phase-a -->

<!-- ANCHOR:phase-b -->
## Phase B — Learning & Consolidation (REQ-D4-004, REQ-D4-005)

### Batch Feedback Learning (REQ-D4-004)

- [ ] T018 [B:T003] Design batch job architecture — weekly cadence, aggregation query, output format
- [ ] T019 [B:T003] Implement aggregation logic: group events by memoryId, compute confidence-weighted scores
- [ ] T020 Implement min-support filtering (>=3 independent sessions required for promotion)
- [ ] T021 Implement boost cap enforcement (MAX_BOOST_DELTA per cycle)
- [ ] T022 Add `SPECKIT_BATCH_LEARNED_FEEDBACK` feature flag and gating
- [ ] T023 Implement shadow comparison: compute would-have-been rank alongside live rank
- [ ] T024 [P] Write unit tests for aggregation, min-support, boost cap, shadow comparison

### Assistive Reconsolidation (REQ-D4-005)

- [ ] T025 Add similarity threshold configuration to `reconsolidation-bridge.ts` (0.96 auto-merge, 0.88 review, <0.88 keep)
- [ ] T026 Implement auto-merge logic for near-duplicates (>=0.96 similarity)
- [ ] T027 Implement supersede/complement classification for borderline cases (0.88-0.96)
- [ ] T028 Add `SPECKIT_ASSISTIVE_RECONSOLIDATION` feature flag and gating
- [ ] T029 [P] Write unit tests for each threshold tier (auto-merge, review recommendation, keep-separate)

### Phase B Validation

- [ ] T030 Integration test: batch job end-to-end (seed events, run batch, verify aggregation output)
- [ ] T031 Integration test: reconsolidation pipeline (seed near-duplicates, verify merge/recommend/keep)
- [ ] T032 Run existing test suite — verify no regressions
<!-- /ANCHOR:phase-b -->

<!-- ANCHOR:phase-c -->
## Phase C — Shadow Validation (REQ-D4-006)

### Shadow Scoring with Holdout (REQ-D4-006)

- [ ] T033 [B:T019] Design holdout query selection strategy (random sample, representative of intent classes)
- [ ] T034 Implement `shadow-scoring.ts` — rank comparison engine (live vs learned signals)
- [ ] T035 Implement rank delta logging and direction-of-change metrics
- [ ] T036 Implement weekly evaluation comparison (track improvement/regression across cycles)
- [ ] T037 Add `SPECKIT_SHADOW_FEEDBACK` feature flag and gating
- [ ] T038 Implement promotion gate: require 2 consecutive stable weekly evaluations before live
- [ ] T039 [P] Write unit tests for shadow scoring (rank comparison, delta computation, promotion gate)

### Phase C Validation

- [ ] T040 Integration test: shadow evaluation pipeline end-to-end
- [ ] T041 Run existing test suite — verify no regressions
- [ ] T042 Produce shadow scoring report for review (rank deltas, direction metrics, promotion decision)
<!-- /ANCHOR:phase-c -->

<!-- ANCHOR:phase-1 -->
<!-- Phase A content above -->
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
<!-- Phase B content above -->
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
<!-- Phase C content above -->
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

1. All 6 feature flags created (`SPECKIT_IMPLICIT_FEEDBACK_LOG`, `SPECKIT_HYBRID_DECAY_POLICY`, `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS`, `SPECKIT_BATCH_LEARNED_FEEDBACK`, `SPECKIT_ASSISTIVE_RECONSOLIDATION`, `SPECKIT_SHADOW_FEEDBACK`)
2. All 5 event types logging to SQLite
3. FSRS hybrid decay correctly classifying document types
4. Quality gate exception passing short decisions with structural signals
5. Weekly batch job aggregating with min-support and boost caps
6. Reconsolidation thresholds operational at all 3 tiers
7. Shadow scoring comparison active on holdout slice
8. No live ranking changes until shadow validation passes
9. All existing tests pass (4876+)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- [Spec](spec.md) — D4 feature specification
- [Plan](plan.md) — D4 implementation phases
- [Parent Tasks](../tasks.md) — Cross-phase coordination (T004, T012, T019)
- [Parent Spec](../spec.md) — Research-Based Refinement
<!-- /ANCHOR:cross-refs -->
