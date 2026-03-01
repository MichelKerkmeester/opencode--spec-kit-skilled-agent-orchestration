---
title: "Implementation Plan: Cognitive Memory Upgrade [079-speckit-cognitive-memory/plan]"
description: "This implementation adds FSRS-based memory decay, prediction error gating for conflict detection, and dual-strength tracking to the Spec Kit Memory MCP server. The approach prio..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "cognitive"
  - "memory"
  - "upgrade"
  - "079"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Cognitive Memory Upgrade

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node.js), better-sqlite3 |
| **Framework** | MCP Server (Model Context Protocol) |
| **Storage** | SQLite with sqlite-vec extension |
| **Testing** | Manual verification, existing test suite |

### Overview

This implementation adds FSRS-based memory decay, prediction error gating for conflict detection, and dual-strength tracking to the Spec Kit Memory MCP server. The approach prioritizes backward compatibility through additive schema changes with sensible defaults, allowing existing memories to work without migration issues.

---

## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (sqlite-vec, better-sqlite3)
- [x] Research completed (FSRS, Vestige, cognitive science)

### Definition of Done

- [ ] All acceptance criteria met (REQ-001 through REQ-008)
- [ ] Existing tests still pass
- [ ] Code follows workflows-code standards
- [ ] Documentation updated (spec/plan/tasks synchronized)

---

## 3. ARCHITECTURE

### Pattern

**Layered Architecture** with cognitive modules as enhancement layer:

```
┌─────────────────────────────────────────────────────────────┐
│                     MCP HANDLERS                             │
│  (memory-save, memory-search, memory-triggers)              │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                  COGNITIVE LAYER (NEW)                       │
│  ┌─────────────┐ ┌─────────────────┐ ┌─────────────────────┐│
│  │ FSRS        │ │ Prediction      │ │ Testing Effect      ││
│  │ Scheduler   │ │ Error Gate      │ │ Strengthening       ││
│  └─────────────┘ └─────────────────┘ └─────────────────────┘│
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    SCORING LAYER                             │
│  (composite-scoring with retrievability factor)              │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    STORAGE LAYER                             │
│  (SQLite with new columns: stability, difficulty, etc.)     │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

- **FSRS Scheduler**: Core algorithm for retrievability, stability updates, interval calculation
- **Prediction Error Gate**: Conflict detection with CREATE/UPDATE/SUPERSEDE/REINFORCE decisions
- **Testing Effect**: Auto-strengthening on memory access
- **5-State Classifier**: HOT/WARM/COLD/DORMANT/ARCHIVED state machine

### Data Flow

1. **Save**: Content → Embedding → PE Gate → Decision → Storage (with FSRS init)
2. **Search**: Query → Hybrid Search → Score (with retrievability) → Tier Filter → Testing Effect → Results
3. **Decay**: Periodic batch → Calculate R for all → Update states → Prune ARCHIVED

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Schema & Core FSRS (Days 1-2)

- [ ] Add schema migration for stability, difficulty, last_review columns
- [ ] Create `fsrs-scheduler.js` with core formulas
- [ ] Create unit tests for FSRS calculations
- [ ] Verify backward compatibility with existing memories

### Phase 2: Prediction Error Gating (Days 3-4)

- [ ] Create `prediction-error-gate.js` with similarity thresholds
- [ ] Create `memory_conflicts` table for audit logging
- [ ] Integrate into `memory-save.js` handler
- [ ] Add contradiction detection patterns

### Phase 3: Scoring & Testing Effect (Day 5)

- [ ] Update `composite-scoring.js` with retrievability weight
- [ ] Add testing effect to `memory-search.js`
- [ ] Implement desirable difficulty bonus formula

### Phase 4: State Model & Verification (Days 6-7)

- [ ] Update `tier-classifier.js` with 5-state model
- [ ] Update `attention-decay.js` to use FSRS
- [ ] Full system integration testing
- [ ] Documentation sync

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | FSRS formulas, PE thresholds | Node.js assert |
| Integration | Handler flows, schema migration | test-mcp-tools.js |
| Manual | Full save/search/decay cycle | Memory MCP tools |

### Test Cases

**FSRS Unit Tests:**
```javascript
// Test retrievability calculation
assert(calculate_retrievability(1.0, 0) === 1.0);  // Just reviewed
assert(calculate_retrievability(1.0, 1) < 1.0);   // 1 day elapsed
assert(calculate_retrievability(10.0, 10) > calculate_retrievability(1.0, 10));  // Higher stability = slower decay

// Test stability update
assert(update_stability(1.0, 5.0, 0.9, 3) > 1.0);  // Success increases stability
assert(update_stability(1.0, 5.0, 0.5, 1) < 1.0);  // Failure decreases stability
```

**PE Gate Tests:**
```javascript
// Test duplicate detection
assert(evaluate({sim: 0.96}).action === 'REINFORCE');
assert(evaluate({sim: 0.85}).action === 'UPDATE' || 'CREATE_LINKED');
assert(evaluate({sim: 0.60}).action === 'CREATE');
```

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sqlite-vec | Internal | Green | Cannot run vector search |
| better-sqlite3 | Internal | Green | No transaction support |
| attention-decay.js | Internal | Green | Must modify for FSRS |
| composite-scoring.js | Internal | Green | Must add retrievability |

---

## 7. ROLLBACK PLAN

- **Trigger**: Data corruption, significant performance regression, breaking existing workflows
- **Procedure**:
  1. Restore database from backup (created before migration)
  2. Revert code changes via git
  3. Restart MCP server
  4. Verify existing functionality

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Schema + FSRS) ──────────────────────────────────────┐
                                                               │
Phase 2 (PE Gate) ─────────────────────────────────────────────┤
         │                                                     │
         ├─ Needs: Schema (Phase 1)                            │
         │                                                     ▼
Phase 3 (Scoring + Testing Effect) ──────────────────────► Phase 4 (State Model + Verify)
         │
         ├─ Needs: FSRS calculations (Phase 1)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Schema & FSRS | None | Phase 2, 3, 4 |
| Phase 2: PE Gate | Phase 1 | Phase 4 |
| Phase 3: Scoring | Phase 1 | Phase 4 |
| Phase 4: State Model | Phase 1, 2, 3 | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Schema & FSRS | Medium | 4-6 hours |
| Phase 2: PE Gate | Medium | 4-6 hours |
| Phase 3: Scoring | Low | 2-3 hours |
| Phase 4: State Model | Medium | 3-4 hours |
| **Total** | | **13-19 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Database backup created
- [ ] Current code committed and tagged
- [ ] Rollback procedure documented

### Rollback Procedure

1. Stop MCP server
2. Restore database: `cp context-index.sqlite.bak context-index.sqlite`
3. Git revert: `git checkout HEAD~N -- mcp_server/`
4. Restart MCP server
5. Verify with `memory_search` test query

### Data Reversal

- **Has data migrations?** Yes (new columns)
- **Reversal procedure**: Columns are additive with defaults; no removal needed. Rollback code simply ignores new columns.

---

## L3: DEPENDENCY GRAPH

```
┌─────────────────┐
│  Phase 1        │
│  Schema + FSRS  │
└───────┬─────────┘
        │
   ┌────┴────┬────────────┐
   ▼         ▼            ▼
┌──────┐  ┌──────┐  ┌──────────┐
│ P2   │  │ P3   │  │ Parallel │
│ PE   │  │ Score│  │ Possible │
│ Gate │  │      │  │          │
└──┬───┘  └──┬───┘  └──────────┘
   │         │
   └────┬────┘
        ▼
┌─────────────────┐
│  Phase 4        │
│  State + Verify │
└─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| fsrs-scheduler.js | None | FSRS calculations | All other phases |
| prediction-error-gate.js | fsrs-scheduler | PE decisions | memory-save handler |
| composite-scoring.js | fsrs-scheduler | Retrievability scoring | Search results |
| tier-classifier.js | fsrs-scheduler | 5-state model | Working memory |

---

## L3: CRITICAL PATH

1. **Phase 1: Schema migration** - 2 hours - CRITICAL
2. **Phase 1: fsrs-scheduler.js** - 3 hours - CRITICAL
3. **Phase 2: prediction-error-gate.js** - 4 hours - CRITICAL
4. **Phase 4: Integration testing** - 2 hours - CRITICAL

**Total Critical Path**: ~11 hours

**Parallel Opportunities**:
- Phase 2 (PE Gate) and Phase 3 (Scoring) can run simultaneously after Phase 1
- Unit tests can be written in parallel with implementation

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Schema Ready | Migration runs, defaults applied | End Phase 1 |
| M2 | FSRS Working | Retrievability calculates correctly | End Phase 1 |
| M3 | PE Gate Active | Duplicates detected on save | End Phase 2 |
| M4 | Search Enhanced | Retrievability in scoring, testing effect | End Phase 3 |
| M5 | Full System | All states work, no regressions | End Phase 4 |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: FSRS Power-Law Over Exponential Decay

**Status**: Accepted

**Context**: Current system uses arbitrary exponential decay. Need research-backed formula.

**Decision**: Adopt FSRS v4 power-law formula: `R = (1 + 0.235 * t/S)^(-0.5)`

**Consequences**:
- Proven on 100M+ Anki users
- Better fit to actual forgetting curves
- Requires stability tracking per memory

**Alternatives Rejected**:
- Exponential decay: Less accurate, arbitrary parameters
- SM-2: Older algorithm, less efficient

### ADR-002: Prediction Error Gating Thresholds

**Status**: Accepted

**Context**: Need to decide similarity thresholds for conflict detection.

**Decision**: Use three-tier model from Vestige research:
- ≥0.95: DUPLICATE → REINFORCE
- 0.90-0.94: HIGH_MATCH → Check contradiction
- 0.70-0.89: MEDIUM_MATCH → Context-dependent
- <0.70: LOW_MATCH → CREATE

**Consequences**:
- Prevents most duplicates (95%+ similar)
- Allows related but different memories
- Threshold tunable via config

### ADR-003: Additive Schema Migration

**Status**: Accepted

**Context**: Need to add new columns without breaking existing data.

**Decision**: Add columns with DEFAULT values only. No data transformation.

**Consequences**:
- Existing memories work immediately
- Gradual population as accessed
- No migration downtime

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation

**Files**: spec.md (sections 1-3), schema migration
**Duration**: ~60s
**Agent**: Primary

### Tier 2: Parallel Execution

| Agent | Focus | Files |
|-------|-------|-------|
| FSRS Agent | fsrs-scheduler.js | Core algorithm |
| PE Agent | prediction-error-gate.js | Conflict detection |
| Scoring Agent | composite-scoring.js | Retrievability weight |

**Duration**: ~90s (parallel)

### Tier 3: Integration

**Agent**: Primary
**Task**: Handler integration, testing
**Duration**: ~60s

---

## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | FSRS Core | Primary | fsrs-scheduler.js, attention-decay.js | Active |
| W-B | Conflict Detection | Primary | prediction-error-gate.js, memory-save.js | Blocked on W-A |
| W-C | Scoring | Primary | composite-scoring.js, memory-search.js | Blocked on W-A |
| W-D | State Model | Primary | tier-classifier.js, working-memory.js | Blocked on W-A |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A complete | All | FSRS module available |
| SYNC-002 | W-B, W-C complete | All | Handler integration |
| SYNC-003 | All complete | All | Full verification |

### File Ownership Rules

- Each file owned by ONE workstream
- Cross-workstream changes require SYNC
- Conflicts resolved at sync points

---

## L3+: COMMUNICATION PLAN

### Checkpoints

- **Per Phase**: Status update in tasks.md
- **Per File**: Code review against workflows-code standards
- **Blockers**: Immediate escalation to user

### Escalation Path

1. Technical blockers → Document in decision-record.md
2. Scope changes → Update spec.md, get user approval
3. Research needed → Save to memory/ folder

---

## CODE STANDARDS ALIGNMENT

All code MUST follow workflows-code standards:

### File Header Format (MANDATORY)

```javascript
/* ─────────────────────────────────────────────────────────────
   [COMPONENT NAME]
   [Brief description]
──────────────────────────────────────────────────────────────── */
```

### Naming Conventions

- Functions: `snake_case` (e.g., `calculate_retrievability`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `FSRS_FACTOR`)
- Files: `kebab-case.js` (e.g., `fsrs-scheduler.js`)

### Initialization Pattern

```javascript
const INIT_FLAG = '__fsrsSchedulerInit';
const INIT_DELAY_MS = 0;  // No DOM dependency

function init_fsrs() {
  // Initialization code
}

const start = () => {
  if (window[INIT_FLAG]) return;
  window[INIT_FLAG] = true;
  init_fsrs();
};

// Module exports for Node.js
module.exports = { calculate_retrievability, update_stability, ... };
```

### Error Handling

```javascript
// Silent catch for non-critical operations
try { optional_operation(); } catch (_) { }

// Explicit error for critical operations
function critical_operation(param) {
  if (!param) throw new Error('Parameter required');
}
```

### Validation Pattern

```javascript
function calculate_retrievability(stability, elapsed_days) {
  // Guard: validate inputs
  if (typeof stability !== 'number' || stability <= 0) {
    stability = 1.0;  // Default
  }
  if (typeof elapsed_days !== 'number' || elapsed_days < 0) {
    elapsed_days = 0;  // Clamp
  }

  // Core calculation
  const FACTOR = 19 / 81;
  const DECAY = -0.5;
  return Math.pow(1 + FACTOR * (elapsed_days / stability), DECAY);
}
```
