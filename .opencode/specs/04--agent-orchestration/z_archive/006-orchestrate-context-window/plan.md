---
title: "Implementation Plan: Orchestrate Agent Context Window Protection [006-orchestrate-context-window/plan]"
description: "This plan adds a Context Window Budget (CWB) system to orchestrate.md through 6 targeted modifications: a new CWB section, updated dispatch format, file-based collection pattern..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "orchestrate"
  - "agent"
  - "context"
  - "006"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Orchestrate Agent Context Window Protection

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (agent definition) |
| **Framework** | OpenCode Agent System |
| **Storage** | None |
| **Testing** | Manual verification via orchestration dispatch |

### Overview

This plan adds a Context Window Budget (CWB) system to `orchestrate.md` through 6 targeted modifications: a new CWB section, updated dispatch format, file-based collection pattern, batched wave protocol, updated scaling heuristics, and anti-pattern documentation. All changes are to a single file.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (none external)

### Definition of Done
- [x] All 6 modifications applied to orchestrate.md — Plus 4 additional sections (29, 30) for template compliance
- [x] No internal contradictions between new and existing sections — Verified: parallel-first preserved within wave limits
- [x] Document passes structural review (section numbering, cross-references) — DQI 95/100, validate_document.py PASSED

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file modification with cross-section references

### Key Components
- **CWB System** (new Section 27): Core budget math and enforcement rules
- **Dispatch Format** (modified Section 11): Output size constraint field
- **Collection Patterns** (new Section 28): File-based + wave-based protocols
- **Scaling Heuristics** (modified Section 25): Result size estimates per agent type

### Data Flow
```
User Request
    ↓
Orchestrator: Decompose tasks (existing)
    ↓
NEW: CWB Check → Calculate max_parallel from budget
    ↓
NEW: Wave Planning → Assign tasks to waves of 4-6
    ↓
Dispatch Wave 1 (existing parallel dispatch)
    ↓
NEW: Agents write to files, return summary only
    ↓
Collect Wave 1 summaries → Synthesize
    ↓
Dispatch Wave 2... (repeat)
    ↓
Final Synthesis (existing)
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Core CWB System ✅
- [x] Add new Section 27: Context Window Budget
- [x] Add CWB formula and budget allocation table
- [x] Add scale thresholds (1-4, 5-9, 10-15, 16-20 agents)

### Phase 2: Dispatch and Collection Patterns ✅
- [x] Modify Section 11: Add `Output Size` and `Write To` fields to dispatch format
- [x] Add new Section 28: Result Collection Patterns (file-based + wave-based)
- [x] Add concrete examples for each pattern (Patterns A, B, C + Background variant)

### Phase 3: Cross-Section Updates ✅
- [x] Modify Section 9: Add orchestrator self-budget row
- [x] Modify Section 13: Add CWB-aware ceiling to parallel-first principle
- [x] Modify Section 25: Add result size estimates per agent type and count
- [x] Modify Section 5: Sub-orchestrators must compress before returning to parent

### Phase 4: Safety Rails ✅
- [x] Add anti-pattern warning block (§28 "The Context Bomb" + §29 six anti-patterns)
- [x] Add "Context Window Overflow" to the Circuit Breaker pattern (Section 17)
- [x] Cross-reference CWB from Section 21 (Context Preservation)

### Phase 5: Verification ✅
- [x] Read final orchestrate.md end-to-end
- [x] Verify no internal contradictions
- [x] Verify section numbering is correct (1-30, sequential)
- [x] Verify all cross-references resolve
- [x] validate_document.py: PASSED (0 issues)
- [x] extract_structure.py: DQI 95/100 (EXCELLENT)
- [x] 20-agent mental simulation: PASSES (~3K vs ~160K old approach)

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Section numbering, cross-references | Manual read-through |
| Contradiction check | New vs existing rules | Grep for conflicting statements |
| Mental simulation | Walk through 20-agent scenario with new rules | Manual trace |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current orchestrate.md | Internal | Green | None - already read |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New sections introduce contradictions or break existing orchestration
- **Procedure**: `git checkout -- .opencode/agent/orchestrate.md`

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (CWB Core) ──────┐
                          ├──► Phase 3 (Cross-Section) ──► Phase 4 (Safety)
Phase 2 (Patterns) ───────┘                                      │
                                                                  ▼
                                                          Phase 5 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 3 |
| Phase 2 | None | Phase 3 |
| Phase 3 | Phase 1, 2 | Phase 4 |
| Phase 4 | Phase 3 | Phase 5 |
| Phase 5 | Phase 4 | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (CWB Core) | Medium | ~40 lines |
| Phase 2 (Patterns) | Medium | ~60 lines |
| Phase 3 (Cross-Section) | Low | ~30 lines of modifications |
| Phase 4 (Safety Rails) | Low | ~20 lines |
| Phase 5 (Verification) | Low | Read-through |
| **Total** | | **~150 lines of additions/modifications** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 3   │────►│   Phase 4   │────►│   Phase 5   │
│  CWB Core   │     │ Cross-Sect  │     │   Safety    │     │   Verify    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
┌─────────────┐          ▲
│   Phase 2   │──────────┘
│  Patterns   │
└─────────────┘
```

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1** - CWB Core - CRITICAL (everything depends on the budget math)
2. **Phase 3** - Cross-Section Updates - CRITICAL (existing sections must align)
3. **Phase 5** - Verification - CRITICAL (contradiction check)

**Parallel Opportunities**:
- Phase 1 and Phase 2 can run simultaneously (independent content)

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | CWB + Patterns written | Sections 27-28 complete | Phase 1-2 |
| M2 | All cross-references updated | Sections 5, 9, 13, 21, 25 updated | Phase 3 |
| M3 | Final verification | No contradictions, correct numbering | Phase 5 |

<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: See `decision-record.md` - File-Based Result Collection
### ADR-002: See `decision-record.md` - Batched Wave Collection

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: orchestrate.md (read current state)
**Duration**: ~30s
**Agent**: Primary (orchestrator context, the user's conversation)

### Tier 2: Implementation
| Agent | Focus | Files |
|-------|-------|-------|
| Primary | Write new sections + modify existing | orchestrate.md |

**Duration**: ~5-10 minutes
**Note**: Single file, single agent - no parallel agents needed for implementation

### Tier 3: Verification
**Agent**: Primary
**Task**: End-to-end read, contradiction check, section numbering
**Duration**: ~2 minutes

<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | CWB Implementation | Primary | orchestrate.md | Active |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | All phases complete | Primary | Verified orchestrate.md |

**Note**: Single-workstream task - no cross-workstream sync needed.

<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Phase**: Update tasks.md status
- **Blockers**: Immediate escalation to user

### Escalation Path
1. Internal contradictions → Resolve in decision-record.md
2. Scope questions → Ask user

<!-- /ANCHOR:communication -->
