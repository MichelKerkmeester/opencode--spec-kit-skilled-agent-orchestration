---
title: "Feature Specification: 005-hierarchical-scope-governance"
description: "Level 3+ phase spec for scope isolation, governed ingest, retention, deletion, and auditability."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "phase 5"
  - "scope governance"
  - "retention"
  - "deletion"
importance_tier: "critical"
contextType: "decision"
---
# Feature Specification: 005-hierarchical-scope-governance

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 5 makes the Hydra roadmap safe enough for collaboration. It enforces tenant, user, agent, and session boundaries; requires provenance and temporal markers on governed ingest; and introduces retention, deletion, and audit flows that later shared-memory features depend on.

**Key Decisions**: centralize scope enforcement instead of scattering checks; sequence governance before shared-memory rollout.

**Critical Dependencies**: Phase 2 lineage contracts, Phase 1 rollback controls, and parent ADR-003.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-13 |
| **Updated** | 2026-03-13 |
| **Branch** | `022-hybrid-rag-fusion` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | `../plan.md` |
| **Phase** | 5 of 6 |
| **Predecessor** | ../004-adaptive-retrieval-loops/spec.md |
| **Successor** | ../006-shared-memory-rollout/spec.md |
| **Handoff Criteria** | Scope enforcement, provenance gates, retention/deletion lifecycle, and audit evidence verified |

### Phase Context

This phase establishes the policy and lifecycle controls that keep memory state safe and auditable. Shared-memory collaboration is intentionally blocked until these controls exist and pass isolation and rollback verification.

**Scope Boundary**: scope predicates, governed ingest, retention/deletion, and auditability. No shared-space UX or conflict strategy ships here.

**Dependencies**:
- Phase 2 lineage identifiers and temporal state
- Phase 1 checkpoint and rollback safety
- Parent ADR-003 governance-first sequencing

**Deliverables**:
- Central scope-enforcement model
- Provenance and temporal markers for governed ingest
- Retention and cascade deletion workflows
- Audit evidence for policy and lifecycle actions

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Without explicit hierarchical boundaries and lifecycle controls, the roadmap cannot safely support broader collaboration or enterprise-style governance requirements. Current partial scope awareness is not enough to guarantee isolation, provenance, or deletion completeness.

### Purpose
Make memory operations policy-aware, auditable, and safe across all relevant scope boundaries before collaboration features are introduced.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Tenant, user, agent, and session scope predicates across read/write/index paths.
- Provenance and temporal markers for governed ingestion.
- Retention policies, cascade deletion, and audit trails.
- Isolation and rollback verification for governance behavior.

### Out of Scope
- Shared-memory spaces, membership, and conflict resolution.
- Broad collaboration rollout.
- Unbounded product-policy expansion unrelated to memory operations.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Enforce provenance and policy checks on ingest |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modify | Apply hierarchical scope predicates to retrieval |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Extend schema for scope, provenance, and lifecycle metadata |
| `.opencode/skill/system-spec-kit/mcp_server/lib/governance/` | Create | Central policy, retention, audit, and deletion modules |
| `.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts` | Modify | Execute retention and deletion jobs safely |
| `.opencode/skill/system-spec-kit/mcp_server/tests/` | Create/Modify | Add isolation, deletion, and audit verification coverage |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Add governance and deletion validation procedures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-501 | Enforce hierarchical scope predicates | Read, write, and index paths apply tenant, user, agent, and session boundaries consistently |
| REQ-502 | Require provenance and temporal markers | Governed ingest rejects inputs missing required metadata |
| REQ-503 | Support retention and cascade deletion | Deletion covers base and derived artifacts with auditable completion |
| REQ-504 | Provide audit evidence | Policy decisions and lifecycle actions generate inspectable audit artifacts |
| REQ-505 | Validate isolation and rollback | Leak tests and rollback drills prove policy behavior can fail safely |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-506 | Keep policy checks centralized | New governance behavior routes through shared policy modules |
| REQ-507 | Document operator procedures | Playbook covers ingest rejection, retention, deletion, and audit review |
| REQ-508 | Keep docs synchronized | Spec, plan, tasks, and user-facing docs reflect actual governance behavior |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-501**: No cross-scope retrieval leakage occurs in the verification matrix.
- **SC-502**: Governed ingest rejects malformed provenance cleanly.
- **SC-503**: Retention and deletion workflows are auditable and repeatable.
- **SC-504**: Shared-memory rollout remains blocked until governance gates pass.
- **SC-505**: Operators can inspect why a policy action was allowed or denied.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 lineage state | Needed for temporal and deletion semantics | Keep lineage identifiers stable before Phase 5 begins |
| Dependency | Existing retrieval and ingest paths | Every path must adopt the same policy rules | Centralize checks rather than patching ad hoc |
| Risk | Cross-scope leak persists in one path | High | Leak matrix tests and shared policy middleware |
| Risk | Cascade deletion misses derived artifacts | High | Explicit deletion graph and auditable completion checks |
| Risk | Policy checks add too much latency | Medium | Cache safe predicates and benchmark critical paths |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P51**: Scope enforcement adds bounded overhead to retrieval and ingest.
- **NFR-P52**: Retention/deletion jobs remain resumable and operationally manageable.

### Security
- **NFR-S51**: Cross-scope data leakage is prevented by default.
- **NFR-S52**: Shared-memory rollout cannot bypass governance checks.

### Reliability
- **NFR-R51**: Policy and lifecycle actions produce consistent audit evidence.
- **NFR-R52**: Deletion jobs are resumable and idempotent.

### Operability
- **NFR-O51**: Operators can explain allow/deny decisions.
- **NFR-O52**: Rollback procedures are defined before broad rollout.

---

## 8. EDGE CASES

### Data Boundaries
- Shared or linked memory points across scopes.
- Retention policy changes after data has already been stored.
- Imported memory lacks clean provenance history.

### Error Scenarios
- Policy service or policy lookup is unavailable during retrieval.
- Deletion succeeds for base records but fails for derived artifacts.
- Ingest receives conflicting scope identifiers.

### Behavioral Cases
- A user requests current state from one scope and historical state from another.
- Retention policy requires keeping lineage but deleting derived search artifacts.
- Audit logs must explain why a write was rejected without revealing protected content.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | Read, write, index, lifecycle, and audit surfaces all change |
| Risk | 25/25 | Isolation and compliance failures are high severity |
| Research | 15/20 | Policy and lifecycle design need careful local adaptation |
| Multi-Agent | 12/15 | Collaboration rollout depends on this phase |
| Coordination | 14/15 | Depends on earlier phases and blocks Phase 6 |
| **Total** | **89/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-501 | Cross-scope leak remains in one path | High | Medium | Central policy middleware and leak tests |
| R-502 | Cascade deletion is incomplete | High | Medium | Explicit deletion graph and audit proofs |
| R-503 | Policy latency harms retrieval | Medium | Medium | Caching and benchmarks |
| R-504 | Shared rollout pressure bypasses governance readiness | High | Medium | Hard gate on Phase 6 entry |

---

## 11. USER STORIES

### US-501: Scoped Safety (Priority: P0)

**As a** platform operator, **I want** every memory operation to respect tenant, user, agent, and session boundaries, **so that** data cannot leak across scopes.

**Acceptance Criteria**:
1. ****Given**** mismatched scopes, when a retrieval or write is attempted, then the operation is denied or filtered correctly.
2. ****Given**** an isolation test matrix, when verification runs, then no cross-scope leak is observed.

### US-502: Auditable Lifecycle Control (Priority: P0)

**As a** governance owner, **I want** retention and deletion to be provable and auditable, **so that** collaboration can roll out safely later.

**Acceptance Criteria**:
1. ****Given**** a deletion request, when the lifecycle job completes, then base and derived artifacts are removed or documented explicitly.
2. ****Given**** an ingest request without provenance, when the policy gate runs, then the request is rejected with an auditable reason.

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | System-spec-kit maintainer | Approved | 2026-03-14 |
| Governance Design Review | Policy or platform reviewer | Approved | 2026-03-14 |
| Implementation Review | Runtime and QA reviewers | Approved | 2026-03-14 |
| Launch Approval | Roadmap owner | Approved | 2026-03-14 |

---

## 13. COMPLIANCE CHECKPOINTS

### Isolation and Governance
- [x] Leak-test matrix reviewed
- [x] Provenance and temporal-ingest rules reviewed
- [x] Retention and deletion procedure documented

### Code and Process
- [x] `sk-code--opencode` alignment verified during implementation
- [x] Audit logging strategy approved
- [x] Manual governance-validation steps added to the playbook

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| System-spec-kit maintainer | Phase owner | High | Spec and rollout review |
| Governance or policy reviewer | Technical reviewer | High | Policy and deletion review |
| QA/release reviewer | Validation reviewer | Medium | Isolation and audit evidence review |

---

## 15. CHANGE LOG

### v0.1 (2026-03-13)
- Created the Phase 5 Level 3+ execution package.
- Defined governance-first scope, retention, deletion, and audit boundaries without claiming implementation.

---

### Acceptance Scenarios

1. **Scope rejection**
   **Given** a request from the wrong tenant or agent scope, when retrieval or write is attempted, then access is denied or filtered correctly.
2. **Governed ingest rejection**
   **Given** missing provenance fields, when ingest is attempted, then the save path rejects the write and records an audit reason.
3. **Cascade deletion**
   **Given** a retention or deletion event, when lifecycle processing runs, then base and derived memory artifacts are removed or explicitly accounted for in audit output.

---

## 16. OPEN QUESTIONS

- Which policy decisions should be cached locally versus resolved dynamically?
- How much of the audit surface should be exposed directly to operators versus internal logs only?

---

## RELATED DOCUMENTS

- **Parent Roadmap**: `../spec.md`
- **Phase 2 Dependency**: `../002-versioned-memory-state/spec.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
