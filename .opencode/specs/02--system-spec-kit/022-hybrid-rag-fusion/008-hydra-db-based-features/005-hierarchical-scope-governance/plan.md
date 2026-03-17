---
title: "Implementation Plan: 005-hierarchical-scope-governance"
description: "Execution plan for Hydra Phase 5 governance and scope enforcement."
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "phase 5 plan"
  - "governance plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: 005-hierarchical-scope-governance

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | MCP handlers, retrieval pipeline, queue jobs, planned governance modules |
| **Storage** | Existing memory schema plus planned scope, provenance, retention, and audit metadata |
| **Testing** | Vitest, isolation matrices, deletion drills, manual audit walkthroughs |

### Overview
Phase 5 makes the roadmap safe enough for wider rollout by enforcing boundaries and lifecycle controls across the system. The plan captures the shipped policy checks, governed ingest, retention and deletion flows, and audit evidence that now gate shared-memory collaboration.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Governance scope and safety goals documented
- [x] Dependencies on Phase 2 and parent ADRs documented
- [x] Isolation, deletion, and audit requirements documented
- [x] Phase 2 lineage contract approved for governance use

### Definition of Done
- [x] Scope predicates applied consistently across read/write/index paths
- [x] Governed ingest rejects malformed provenance
- [x] Retention and cascade deletion workflows validated
- [x] Audit evidence is inspectable
- [x] Docs and playbook reflect shipped behavior
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Central governance layer with shared policy checks, lifecycle jobs, and audit outputs. Phase 5 protects the system before collaboration features broaden access patterns.

### Key Components
- **Policy Middleware**: Shared scope and provenance enforcement.
- **Governed Ingest Layer**: Save-path validation and rejection reasons.
- **Lifecycle Layer**: Retention, deletion, and cleanup jobs.
- **Audit Layer**: Policy decision and lifecycle evidence.
- **Isolation Verification Layer**: Leak tests and rollback drills.

### Data Flow
1. Request enters read or write path with scope identity.
2. Policy middleware validates scope and governance rules.
3. Governed ingest checks provenance and temporal markers.
4. Lifecycle jobs apply retention or deletion when required.
5. Audit records capture what was allowed, denied, retained, or deleted.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Policy Model and Shared Middleware
- [x] Finalize hierarchical scope model
- [x] Build shared policy middleware
- [x] Define audit event contract

### Phase B: Governed Ingest and Retrieval
- [x] Apply scope predicates to retrieval
- [x] Apply provenance gates to ingest
- [x] Add denial and audit outputs

### Phase C: Lifecycle Enforcement and Validation
- [x] Implement retention and cascade deletion jobs
- [x] Add leak-test and deletion-drill coverage
- [x] Add operator playbook for governance procedures
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Policy decisions, provenance validation, deletion graph rules | Vitest |
| Integration | Read/write/index flows under scope constraints | Vitest with fixtures |
| Isolation | Tenant/user/agent/session leak matrix | Scenario tests |
| Lifecycle | Retention and deletion drills with audit output | Job harness and manual validation |
| Manual | Audit walkthroughs and rollback procedures | Playbook scenarios |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 lineage identifiers | Internal | Yellow | Lifecycle and temporal policy become ambiguous |
| Phase 1 rollback/checkpoints | Internal | Green | Recovery procedures weaken |
| Existing handlers and retrieval pipeline | Internal | Green | Policy coverage cannot be consistent |
| Parent ADR-003 | Architecture | Green | Shared-memory sequencing becomes unsafe |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Scope leak, failed deletion audit, policy latency regression, or incorrect ingest denial/allow behavior.
- **Procedure**:
1. Disable new governance enforcement paths or route to the last stable policy path.
2. Restore any affected data from checkpoint if deletion or migration changes caused damage.
3. Re-run isolation and lifecycle smoke tests.
4. Record the policy or lifecycle defect before retrying.

<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

```text
Phase 2 lineage -> Policy model -> Governed ingest/retrieval -> Lifecycle jobs -> Phase 6 rollout
```

| Phase Step | Depends On | Blocks |
|------------|------------|--------|
| Policy model | Phase 2 | All later governance work |
| Governed ingest/retrieval | Policy model | Lifecycle validation |
| Lifecycle jobs and validation | Policy model, governed ingest | Phase 6 rollout |

---

## L2: EFFORT ESTIMATION

| Workstream | Complexity | Estimated Effort |
|------------|------------|------------------|
| Policy model and middleware | High | 3-5 days |
| Governed ingest and retrieval | High | 3-5 days |
| Lifecycle enforcement and validation | High | 3-5 days |
| **Total** | | **9-15 days** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Scope matrix defined
- [x] Audit event contract defined
- [x] Deletion graph documented
- [x] Checkpoint restore path identified

### Rollback Procedure
1. Disable governance rollout.
2. Restore affected data if needed.
3. Re-run isolation and audit smoke tests.
4. Revert the failing policy or lifecycle changes.

### Data Reversal
- **Has data migrations?** Likely yes for scope/provenance metadata.
- **Reversal procedure**: checkpoint restore plus rollback of governance-related schema or lifecycle state.

---

## L3: DEPENDENCY GRAPH

```text
+----------------------+
| Policy Model         |
+----------+-----------+
           v
+----------+-----------+
| Governed Ingest      |
+----------+-----------+
           v
+----------+-----------+
| Scoped Retrieval     |
+----------+-----------+
           v
+----------+-----------+
| Lifecycle + Audit    |
+----------+-----------+
           v
+----------------------+
| Phase 6 Handoff      |
+----------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Policy model | Phase 2 | Shared enforcement rules | All later governance work |
| Governed ingest | Policy model | Safe save path | Lifecycle and rollout |
| Scoped retrieval | Policy model | Leak-resistant reads | Phase 6 |
| Lifecycle and audit | Policy model, governed ingest | Retention/deletion evidence | Phase 6 |

---

## L3: CRITICAL PATH

1. Lock the policy model
2. Apply governance to ingest and retrieval
3. Validate lifecycle jobs and audit evidence
4. Pass isolation and rollback drills

**Total Critical Path**: 4 major steps

**Parallel Opportunities**:
- Audit and playbook work can proceed during middleware implementation.
- Deletion-drill authoring can overlap with retrieval policy integration.

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Policy model locked | Scope and provenance rules agreed | Early Phase 5 |
| M2 | Governed paths active in tests | Ingest and retrieval enforce policy | Mid Phase 5 |
| M3 | Phase 6 handoff ready | Isolation, deletion, and audit checks pass | End Phase 5 |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-501: Centralize Governance Before Shared Rollout

**Status**: Proposed for Phase 5 implementation

**Context**: Shared-memory rollout is unsafe if policy checks remain scattered and partial.

**Decision**: Build shared governance middleware and pass rollout only after isolation and lifecycle evidence exists.

**Consequences**:
- Stronger safety posture and cleaner rollout gates.
- Requires more upfront engineering before collaboration features.

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: `spec.md`, `plan.md`, `decision-record.md`
**Duration**: Initial design pass
**Agent**: Primary agent

### Tier 2: Parallel Execution

| Agent | Focus | Files |
|-------|-------|-------|
| Primary | Policy middleware | governance and handler modules |
| Primary | Lifecycle and audit | queue jobs, audit surfaces, tests |
| Primary | Playbook and rollout docs | docs and checklists |

### Tier 3: Integration
**Agent**: Primary
**Task**: Reconcile isolation, lifecycle, and audit evidence for Phase 6 handoff

---

## L3+: WORKSTREAM COORDINATION

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Policy model and middleware | Primary | governance modules and handlers | Planned |
| W-B | Lifecycle and audit | Primary | queue jobs, schema, tests | Planned |
| W-C | Isolation verification and docs | Primary | test matrix, playbook, checklist | Planned |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-501 | Policy model approved | Primary | Ingest and retrieval integration can begin |
| SYNC-502 | Isolation and lifecycle checks pass | Primary | Phase 6 rollout review |

### File Ownership Rules
- Governance checks must stay centralized.
- Audit output must be documented before rollout.
- Shared-memory behavior remains out of scope until this phase passes.

---

## L3+: COMMUNICATION PLAN

### Checkpoints
- Update `tasks.md` when policy, lifecycle, or audit milestones move
- Record policy decisions in `decision-record.md`
- Update the parent phase map when governance gates change

### Escalation Path
1. Scope leak or audit gap -> immediate governance review
2. Lifecycle uncertainty -> deletion design review
3. Conflict with shared-memory plan -> parent roadmap decision
