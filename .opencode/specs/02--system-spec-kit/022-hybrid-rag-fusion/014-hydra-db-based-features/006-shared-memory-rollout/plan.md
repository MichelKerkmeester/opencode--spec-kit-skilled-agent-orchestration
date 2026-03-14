---
title: "Implementation Plan: 006-shared-memory-rollout"
description: "Execution plan for Hydra Phase 6 collaboration and staged rollout."
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "phase 6 plan"
  - "shared memory plan"
importance_tier: "critical"
contextType: "implementation"
---
<!-- ANCHOR:document -->
# Implementation Plan: 006-shared-memory-rollout

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | MCP handlers, planned collaboration modules, existing governance layer |
| **Storage** | Shared-space metadata plus governed memory state from earlier phases |
| **Testing** | Vitest, staging-style rollout checks, conflict drills, manual runbooks |

### Overview
Phase 6 packages the roadmap into a controllable collaboration rollout. The plan adds shared-memory spaces, deny-by-default membership rules, conflict handling, and staged release controls while preserving all prior governance and rollback protections.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Collaboration scope and rollout gates documented
- [x] Dependencies on Phases 3, 4, and 5 documented
- [x] Kill-switch and rollback requirements documented
- [x] Phase 5 governance gate approved

### Definition of Done
- [x] Shared-memory spaces implemented
- [x] Membership and conflict rules validated
- [x] Kill-switch and rollback drills pass
- [x] Staged rollout procedures documented and tested
- [x] Docs and feature catalog reflect shipped behavior

---

## 3. ARCHITECTURE

### Pattern
Opt-in collaboration layer on top of governed memory state. Phase 6 introduces shared spaces cautiously and treats rollout control as part of the feature, not an afterthought.

### Key Components
- **Shared-Space Layer**: Defines spaces, membership, and roles.
- **Conflict Layer**: Handles concurrent collaboration safely.
- **Governance Reuse Layer**: Applies Phase 5 policy checks to collaboration flows.
- **Rollout Control Layer**: Cohort gating, kill switches, and rollback.
- **Operator Layer**: Runbooks and telemetry for rollout decisions.

### Data Flow
1. Operator enables shared memory for a controlled cohort.
2. Member request enters shared-space handler.
3. Governance checks validate membership and scope.
4. Collaboration logic applies read/write or conflict behavior.
5. Telemetry and runbooks support expansion, contraction, or rollback.

---

## 4. IMPLEMENTATION PHASES

### Phase A: Space and Membership Model
- [x] Define shared-space schema and role model
- [x] Integrate governance checks into collaboration flows
- [x] Define cohort rollout controls

### Phase B: Conflict Handling and Telemetry
- [x] Implement conflict strategy
- [x] Add collaboration telemetry and audit traces
- [x] Add shared-memory test coverage

### Phase C: Staged Rollout and Rollback
- [x] Add kill switches and rollback drills
- [x] Add playbook runbooks for rollout and incidents
- [x] Validate cohort expansion and contraction procedures

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Membership rules, conflict handling, rollout flags | Vitest |
| Integration | Shared-space read/write flows under governance checks | Vitest with fixtures |
| Rollout | Cohort enablement, kill switches, rollback drills | Staging-style validation |
| Conflict | Concurrent update scenarios and audit traces | Scenario tests |
| Manual | Operator runbooks for rollout and incident response | Playbook scenarios |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 5 governance controls | Internal | Yellow | Shared rollout remains unsafe |
| Phase 3 stable retrieval | Internal | Yellow | Shared memory could amplify unstable retrieval |
| Phase 4 adaptive safety or explicit deferral | Internal | Yellow | Rollout decisions may be incomplete |
| Existing telemetry/runbook surfaces | Internal | Green | Operators lack safe rollout guidance |

---

## 7. ROLLBACK PLAN

- **Trigger**: Shared-space leak, bad conflict behavior, rollout instability, or operator confusion severe enough to risk safety.
- **Procedure**:
1. Disable shared-memory rollout for all cohorts or the affected cohort.
2. Confirm baseline governed behavior resumes.
3. Run collaboration rollback smoke tests.
4. Record the failure mode before any re-enable decision.

---

## L2: PHASE DEPENDENCIES

```text
Phase 5 governance -> Shared-space model -> Conflict handling -> Staged rollout -> Final roadmap sign-off
```

| Phase Step | Depends On | Blocks |
|------------|------------|--------|
| Space and membership model | Phase 5 | Conflict handling and rollout |
| Conflict handling and telemetry | Shared-space model | Staged rollout |
| Staged rollout and rollback | Conflict handling | Final roadmap sign-off |

---

## L2: EFFORT ESTIMATION

| Workstream | Complexity | Estimated Effort |
|------------|------------|------------------|
| Shared-space and membership model | Medium-High | 2-4 days |
| Conflict handling and telemetry | Medium-High | 2-4 days |
| Staged rollout and rollback | High | 2-4 days |
| **Total** | | **6-12 days** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Governance gate approved
- [x] Rollout cohorts defined
- [x] Kill-switch path verified
- [x] Operator runbooks drafted

### Rollback Procedure
1. Disable shared-memory access.
2. Re-run governance and baseline smoke tests.
3. Confirm shared-space operations are no longer reachable.
4. Log the incident and required fixes.

### Data Reversal
- **Has data migrations?** Possibly additive shared-space metadata.
- **Reversal procedure**: disable collaboration, revert shared-space metadata if necessary, and preserve audit evidence.

---

## L3: DEPENDENCY GRAPH

```text
+----------------------+
| Space + Membership   |
+----------+-----------+
           v
+----------+-----------+
| Conflict Handling    |
+----------+-----------+
           v
+----------+-----------+
| Governance Reuse     |
+----------+-----------+
           v
+----------+-----------+
| Staged Rollout       |
+----------+-----------+
           v
+----------------------+
| Final Sign-off       |
+----------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Space and membership model | Phase 5 | Safe access model | Conflict handling |
| Conflict handling | Space model | Predictable collaboration outcomes | Staged rollout |
| Governance reuse | Phase 5 | Protected collaboration paths | Staged rollout |
| Staged rollout | Prior components | Final release evidence | Roadmap completion |

---

## L3: CRITICAL PATH

1. Lock shared-space and membership model
2. Validate conflict handling under governance
3. Validate kill switches and rollback
4. Pass staged rollout review

**Total Critical Path**: 4 major steps

**Parallel Opportunities**:
- Telemetry and runbook work can proceed during shared-space implementation.
- Feature catalog and docs prep can start before rollout validation finishes.

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Shared-space model locked | Membership and governance rules agreed | Early Phase 6 |
| M2 | Collaboration active in controlled tests | Conflict and telemetry paths working | Mid Phase 6 |
| M3 | Final rollout ready | Kill switches, rollback, and docs are complete | End Phase 6 |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-601: Keep Shared Memory Opt-In and Deny-by-Default

**Status**: Proposed for Phase 6 implementation

**Context**: Collaboration delivers value only if operators can expand or reverse it safely.

**Decision**: Require explicit opt-in cohorts, deny-by-default membership, and kill switches for the first rollout.

**Consequences**:
- Safer release and clearer operator control.
- Slower broad adoption until evidence supports expansion.

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: `spec.md`, `plan.md`, `decision-record.md`
**Duration**: Initial design pass
**Agent**: Primary agent

### Tier 2: Parallel Execution

| Agent | Focus | Files |
|-------|-------|-------|
| Primary | Shared-space and conflict modules | collab modules and handlers |
| Primary | Governance reuse and rollout controls | governance, rollout, tests |
| Primary | Docs and runbooks | playbook, catalog, checklists |

### Tier 3: Integration
**Agent**: Primary
**Task**: Reconcile rollout safety, operator readiness, and final sign-off evidence

---

## L3+: WORKSTREAM COORDINATION

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Shared spaces and membership | Primary | collab modules | Planned |
| W-B | Conflict handling and telemetry | Primary | handlers, tests, telemetry | Planned |
| W-C | Rollout controls and runbooks | Primary | playbook, checklist, feature catalog | Planned |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-601 | Governance gate approved | Primary | Collaboration implementation can begin |
| SYNC-602 | Rollout drills pass | Primary | Final sign-off review |

### File Ownership Rules
- Shared-memory code must reuse governance checks rather than bypass them.
- Runbooks and kill switches are part of the deliverable, not optional extras.
- Docs must describe only the rollout state that is actually shipped.

---

## L3+: COMMUNICATION PLAN

### Checkpoints
- Update `tasks.md` when space model, conflict, or rollout milestones move
- Record rollout decisions in `decision-record.md`
- Update the parent roadmap when final rollout readiness changes

### Escalation Path
1. Leak or governance bypass -> immediate rollback review
2. Conflict instability -> collaboration design review
3. Rollout uncertainty -> final roadmap approval pause

<!-- /ANCHOR:document -->
