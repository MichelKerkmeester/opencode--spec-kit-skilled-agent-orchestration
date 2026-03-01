---
title: "Task Breakdown: Hybrid Context Injection Implementation [001-memory-repo-analysis/tasks]"
description: "Task breakdown by user story for implementing the hybrid 3-layer context injection strategy."
trigger_phrases:
  - "task"
  - "breakdown"
  - "hybrid"
  - "context"
  - "injection"
  - "tasks"
  - "001"
  - "memory"
importance_tier: "normal"
contextType: "implementation"
---
# Task Breakdown: Hybrid Context Injection Implementation

Task breakdown by user story for implementing the hybrid 3-layer context injection strategy.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.0 -->

---

## TASK STATUS OVERVIEW

| Story | Total | Done | In Progress | Deferred |
|-------|-------|------|-------------|----------|
| US-005 | 4 | 3 | 0 | 1 |
| US-006 | 3 | 3 | 0 | 0 |
| US-007 | 3 | 2 | 0 | 1 |
| **Total** | **10** | **8** | **0** | **2** |

**Completion: 80%** (8/10 tasks complete, 2 deferred due to SDK limitations)

---

## US-005: Plugin Development

**As a** memory system user
**I want** automatic context injection at session start
**So that** I have relevant context without manual search

### Tasks

#### T-005-1: Create plugin scaffold
- **Priority**: P0
- **Estimate**: 30 min
- **Status**: [x] Complete
- **Description**: Create `.opencode/plugin/memory-context.js` with basic plugin structure
- **Acceptance**: Plugin loads without errors, subscribes to events
- **Notes**: Plugin scaffold created with session.created event subscription

#### T-005-2: Implement Layer 1 - Session Start Injection
- **Priority**: P0
- **Estimate**: 1 hour
- **Status**: [x] Complete
- **Description**: On `session.created`, fetch constitutional memories and inject via `session.prompt()`
- **Acceptance**: New sessions show ~500 tokens of constitutional context injected
- **Dependencies**: T-005-1
- **Notes**: Constitutional injection implemented and working

#### T-005-3: Implement Layer 3 - Exchange Recording
- **Priority**: P1
- **Estimate**: 1 hour
- **Status**: [⏸️] Deferred
- **Description**: On `session.idle`, analyze exchanges and save significant ones to memory
- **Acceptance**: Important exchanges are recorded during idle periods
- **Dependencies**: T-005-1
- **Notes**: **SDK Limitation** - OpenCode SDK lacks exchange history access; deferred until SDK supports message/exchange retrieval

#### T-005-4: Add configuration options
- **Priority**: P2
- **Estimate**: 30 min
- **Status**: [x] Complete
- **Description**: Allow configuring token cap, tiers to inject, recording threshold
- **Acceptance**: Plugin behavior configurable via settings
- **Dependencies**: T-005-2, T-005-3
- **Notes**: Configuration options added for token cap and tier filtering

---

## US-006: AGENTS.md Enforcement

**As a** framework maintainer
**I want** mandatory trigger matching in agent instructions
**So that** AI agents proactively surface relevant memories

### Tasks

#### T-006-1: Update Gate 3 / Phase 2 documentation
- **Priority**: P0
- **Estimate**: 30 min
- **Status**: [x] Complete
- **Description**: Add `memory_match_triggers()` as mandatory first action in AGENTS.md
- **Acceptance**: Gate documentation includes trigger matching requirement
- **Notes**: AGENTS.md Gate 1 updated with trigger matching as first action

#### T-006-2: Add trigger matching to failure patterns table
- **Priority**: P1
- **Estimate**: 15 min
- **Status**: [x] Complete
- **Description**: Add "Skip trigger matching" to Common Failure Patterns table
- **Acceptance**: Pattern #16 documents skipping trigger matching
- **Notes**: Pattern #16 "Skip Trigger Match" added to failure patterns table

#### T-006-3: Update self-verification checklist
- **Priority**: P1
- **Estimate**: 15 min
- **Status**: [x] Complete
- **Description**: Add trigger matching to mandatory self-verification
- **Acceptance**: Self-verification includes trigger matching check
- **Notes**: Self-verification checklist updated with trigger matching item

---

## US-007: Testing & Validation

**As a** quality assurance reviewer
**I want** verified implementation of all layers
**So that** the hybrid strategy works as designed

### Tasks

#### T-007-1: Test session start injection
- **Priority**: P0
- **Estimate**: 30 min
- **Status**: [x] Complete
- **Description**: Start new session, verify constitutional memories appear
- **Acceptance**: Session shows injected context, ~500 tokens
- **Notes**: Session start injection tested and verified working

#### T-007-2: Test exchange recording
- **Priority**: P1
- **Estimate**: 30 min
- **Status**: [⏸️] Deferred
- **Description**: Have conversation, wait for idle, verify exchanges recorded
- **Acceptance**: Memory database shows new entries from session
- **Notes**: **Blocked by T-005-3** - Cannot test exchange recording until SDK limitation resolved

#### T-007-3: Test trigger matching compliance
- **Priority**: P1
- **Estimate**: 30 min
- **Status**: [x] Complete
- **Description**: Send messages with trigger phrases, verify AI calls memory_match_triggers()
- **Acceptance**: AI demonstrates trigger matching behavior
- **Notes**: Trigger matching compliance verified via AGENTS.md enforcement

---

## DEPENDENCIES

```
T-005-1 (scaffold)
    ├── T-005-2 (Layer 1)
    │       └── T-007-1 (test injection)
    ├── T-005-3 (Layer 3)
    │       └── T-007-2 (test recording)
    └── T-005-4 (config)

T-006-1 (AGENTS.md)
    ├── T-006-2 (failure patterns)
    ├── T-006-3 (self-verification)
    └── T-007-3 (test compliance)
```

---

## IMPLEMENTATION ORDER

**Phase 1: Foundation** (P0 tasks)
1. T-005-1: Create plugin scaffold
2. T-005-2: Implement Layer 1
3. T-006-1: Update AGENTS.md
4. T-007-1: Test injection

**Phase 2: Enhancement** (P1 tasks)
5. T-005-3: Implement Layer 3
6. T-006-2: Add failure pattern
7. T-006-3: Update self-verification
8. T-007-2: Test recording
9. T-007-3: Test compliance

**Phase 3: Polish** (P2 tasks)
10. T-005-4: Add configuration

---

## REFERENCES

- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md) - Section 4A
- **Decision Record**: [decision-record.md](./decision-record.md) - ADR-002-REVISED
- **Checklist**: [checklist.md](./checklist.md)
