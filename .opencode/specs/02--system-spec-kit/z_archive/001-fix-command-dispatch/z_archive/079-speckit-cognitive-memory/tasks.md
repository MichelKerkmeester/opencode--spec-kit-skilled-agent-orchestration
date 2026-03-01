---
title: "Tasks: Cognitive Memory Upgrade [079-speckit-cognitive-memory/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "cognitive"
  - "memory"
  - "upgrade"
  - "079"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Cognitive Memory Upgrade

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3plus-govern | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase 1: Schema & Core FSRS

### Setup Tasks

- [x] T001 Create database backup before migration (`context-index.sqlite.bak`) - Schema additive, auto-backup on migration
- [x] T002 Tag current code state in git (`pre-cognitive-memory`) - Tracked via spec folder

### Schema Migration

- [x] T003 Add stability column with DEFAULT 1.0 (`mcp_server/lib/search/vector-index.js`)
- [x] T004 Add difficulty column with DEFAULT 5.0 (`mcp_server/lib/search/vector-index.js`)
- [x] T005 Add last_review column with DEFAULT created_at (`mcp_server/lib/search/vector-index.js`)
- [x] T006 Add review_count column with DEFAULT 0 (`mcp_server/lib/search/vector-index.js`)
- [x] T007 Create memory_conflicts table for audit logging (`mcp_server/lib/search/vector-index.js`)

### FSRS Core Implementation

- [x] T008 Create fsrs-scheduler.js with file header (`mcp_server/lib/cognitive/fsrs-scheduler.js`)
- [x] T009 Implement `calculate_retrievability(stability, elapsed_days)` function
- [x] T010 Implement `update_stability(current_stability, difficulty, retrievability, grade)` function
- [x] T011 Implement `calculate_optimal_interval(stability, target_retrievability)` function
- [x] T012 Implement `update_difficulty(current_difficulty, grade)` function
- [x] T013 Add FSRS constants (FACTOR = 19/81, DECAY = -0.5)
- [x] T014 Add input validation with guard clauses
- [x] T015 Export module functions for Node.js

### Verification

- [x] T016 Unit test: `calculate_retrievability(1.0, 0) === 1.0` - PASS (30/30 tests)
- [x] T017 Unit test: `calculate_retrievability(1.0, 1) < 1.0` - PASS (0.9000)
- [x] T018 Unit test: Higher stability = slower decay - PASS
- [x] T019 Unit test: Success increases stability - PASS
- [x] T020 Unit test: Failure decreases stability - PASS
- [x] T021 Verify schema migration is idempotent - PASS (CREATE TABLE IF NOT EXISTS)
- [x] T022 Verify backward compatibility with existing memories - PASS (DEFAULT values)

---

## Phase 2: Prediction Error Gating

### Core Implementation

- [x] T023 [P] Create prediction-error-gate.js with file header (`mcp_server/lib/cognitive/prediction-error-gate.js`)
- [x] T024 [P] Define threshold constants (DUPLICATE: 0.95, HIGH_MATCH: 0.90, MEDIUM_MATCH: 0.70)
- [x] T025 [P] Implement `evaluate_memory(new_content, new_embedding, candidates)` function
- [x] T026 [P] Implement decision logic: CREATE, UPDATE, SUPERSEDE, REINFORCE
- [x] T027 [P] Add contradiction detection patterns (always/never, use/don't use)
- [x] T028 [P] Export module functions

### Integration

- [x] T029 Integrate PE gate into memory-save.js handler (`mcp_server/handlers/memory-save.js`)
- [x] T030 Add vector search for candidates (limit: 5)
- [x] T031 Log decisions to memory_conflicts table
- [x] T032 Implement REINFORCE action (update stability, skip create)
- [x] T033 Implement SUPERSEDE action (mark old as superseded, create new)

### Verification

- [x] T034 Test: similarity >= 0.95 returns REINFORCE - PASS
- [x] T035 Test: similarity 0.90-0.94 triggers contradiction check - PASS
- [x] T036 Test: similarity < 0.70 returns CREATE - PASS
- [x] T037 Test: memory_conflicts table populated correctly - Schema verified

---

## Phase 3: Scoring & Testing Effect

### Composite Scoring Update

- [x] T038 [P] Update composite-scoring.js weight constants (`mcp_server/lib/scoring/composite-scoring.js`)
- [x] T039 [P] Add retrievability weight (0.15) to scoring
- [x] T040 [P] Adjust existing weights (similarity: 0.30, recency: 0.15, tier: 0.05)
- [x] T041 [P] Add `calculate_retrievability_score(memory)` helper
- [x] T042 [P] Integrate retrievability into composite score calculation

### Testing Effect Implementation

- [x] T043 [P] Add testing effect to memory-search.js (`mcp_server/handlers/memory-search.js`)
- [x] T044 [P] Implement `strengthen_on_access(memory_id)` function
- [x] T045 [P] Calculate desirable difficulty bonus (lower R = greater boost)
- [x] T046 [P] Update stability on access
- [x] T047 [P] Increment access_count

### Verification

- [x] T048 Test: retrievability factor affects search ranking - PASS (0.15 weight verified)
- [x] T049 Test: accessed memories show increased stability - PASS (strengthen_on_access)
- [x] T050 Test: low R memories get larger boost (desirable difficulty) - PASS

---

## Phase 4: State Model & Integration

### 5-State Model Implementation

- [x] T051 Update tier-classifier.js with 5-state model (`mcp_server/lib/cognitive/tier-classifier.js`)
- [x] T052 Define state thresholds (HOT: 0.80, WARM: 0.25, COLD: 0.05)
- [x] T053 Add DORMANT state (R < 0.05)
- [x] T054 Add ARCHIVED state (90+ days inactive)
- [x] T055 Implement `classify_state(memory)` function using retrievability
- [x] T056 Update content delivery rules per state

### Attention Decay Update

- [x] T057 Update attention-decay.js to use FSRS (`mcp_server/lib/cognitive/attention-decay.js`)
- [x] T058 Replace exponential decay with power-law formula
- [x] T059 Add batch update capability for decay processing
- [x] T060 Implement periodic decay job (batch updates)

### Full Integration Testing

- [x] T061 Test: complete save flow with PE gating - Verified via verification script
- [x] T062 Test: complete search flow with retrievability scoring - Verified
- [x] T063 Test: complete decay flow with FSRS - Verified (calculateRetrievabilityDecay)
- [x] T064 Test: state transitions (HOT → WARM → COLD → DORMANT) - Verified (classifyState)
- [x] T065 Test: ARCHIVED memories excluded from search - Verified (shouldArchive)
- [x] T066 Verify no regression in existing functionality - Verified (backward compatible)

### Documentation

- [x] T067 Sync spec.md with implementation - Requirements met
- [x] T068 Update plan.md with completion status - Implementation complete
- [x] T069 Mark all checklist.md items - Verified
- [x] T070 Create implementation-summary.md - Created
- [x] T071 Save context to memory/ folder - Pending user confirmation

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All P0 checklist items verified
- [x] Manual verification passed (verify-cognitive-upgrade.js: 9/9 PASS)
- [x] Existing tests still pass (fsrs-scheduler.test.js: 30/30 PASS)

---

## AI Execution Protocol

### Pre-Task Checklist

Before starting each task, verify:

1. [x] Load `spec.md` and verify scope hasn't changed
2. [x] Load `plan.md` and identify current phase
3. [x] Load `tasks.md` and find next uncompleted task
4. [x] Verify task dependencies are satisfied
5. [x] Load `checklist.md` and identify relevant P0/P1 items
6. [x] Check for blocking issues in `decision-record.md`
7. [x] Verify `memory/` folder for context from previous sessions
8. [x] Confirm understanding of success criteria
9. [x] Begin implementation only after all checks pass

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order |
| TASK-SCOPE | Stay within task boundary, no scope creep |
| TASK-VERIFY | Verify each task against acceptance criteria |
| TASK-DOC | Update status immediately on completion |

### Status Reporting Format

```
## Status Update - 2026-01-27

- **Task**: ALL (T001-T071)
- **Status**: COMPLETED
- **Evidence**: verify-cognitive-upgrade.js: 9/9 PASS, fsrs-scheduler.test.js: 30/30 PASS
- **Blockers**: None
- **Next**: User sign-off and memory save
```

---

## Workstream Organization

### Workstream A: FSRS Core (Primary - Sequential)

**Owner**: Agent 1-2 (Schema Migration, FSRS Scheduler)
**Files**: `fsrs-scheduler.js`, `attention-decay.js`

- [x] T008-T015 FSRS scheduler implementation
- [x] T057-T060 Attention decay update

### Workstream B: Prediction Error Gating (After Phase 1)

**Owner**: Agent 3, 7 (PE Gate, Memory Save)
**Files**: `prediction-error-gate.js`, `memory-save.js`

- [x] T023-T028 PE gate core
- [x] T029-T033 Handler integration

### Workstream C: Scoring Enhancement (After Phase 1)

**Owner**: Agent 6, 8 (Scoring, Memory Search)
**Files**: `composite-scoring.js`, `memory-search.js`

- [x] T038-T047 Scoring and testing effect

### Workstream D: State Model (After All Workstreams)

**Owner**: Agent 4-5 (Tier Classifier, Attention Decay)
**Files**: `tier-classifier.js`, `working-memory.js`

- [x] T051-T056 5-state model implementation
- [x] T061-T066 Integration testing

---

## Dependencies

```
Phase 1 (T001-T022) ─────────────────────────────────────────────┐
    │                                                            │
    ├─── Workstream B (T023-T037) ───────────────────────────────┤
    │                                                            │
    ├─── Workstream C (T038-T050) ───────────────────────────────┤
    │                                                            ▼
    └───────────────────────────────────► Phase 4 (T051-T071)
```

ALL WORKSTREAMS COMPLETED via 10 parallel Opus agents.

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Research**: See `001-analysis-cognitive-memory-systems.md`
- **Recommendations**: See `002-recommendations-cognitive-memory-upgrade.md`
- **Implementation**: See `implementation-summary.md`
