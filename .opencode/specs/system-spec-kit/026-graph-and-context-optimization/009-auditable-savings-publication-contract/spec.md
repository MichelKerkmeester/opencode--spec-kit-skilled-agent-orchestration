---
title: "Feature Specification: Auditable Savings Publication Contract [template:level_3/spec.md]"
description: "Turn the reporting half of the research into a dedicated publication packet that sits on top of the measurement contract and reader substrate."
trigger_phrases:
  - "009-auditable-savings-publication-contract"
  - "auditable savings publication contract"
  - "026-graph-and-context-optimization"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Auditable Savings Publication Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Turn the reporting half of the research into a dedicated publication packet that sits on top of the measurement contract and reader substrate.

**Key Decisions**: Publication gates come after the measurement contract and reader substrate, not before.

**Critical Dependencies**: Research recommendation R9, predecessor packet 005, and normalized analytics reader under 024/031.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-08 |
| **Branch** | `main` |
| **Parent Packet** | `026-graph-and-context-optimization` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research says the missing problem is not the lack of dashboards. It is the lack of auditable publication gates that prevent aggregate views from outrunning the quality of the underlying methodology and telemetry.

### Purpose
Open the publication-governance packet that determines which rows and aggregates are eligible for export or dashboard-level use.
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in `decision-record.md` and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define publication eligibility rules for rows and aggregates that consume the measurement contract.
- Require methodology status, schema version, and provenance on publishable rows.
- Define exclusion reasons for rows that fail the contract.
- Keep the packet endpoint and contract focused, not UI focused.

### Out of Scope
- Building or redesigning dashboard UI.
- Opening new analytics readers or producers.
- Changing structural payload trust semantics.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers` | Modify | Apply publication gates to reporting or export surfaces. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md` | Modify | Document row eligibility and exclusion semantics. |
| `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Document packet-relevant reporting assumptions. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Publishable rows include methodology status, schema version, and provenance. | Rows missing required metadata are excluded from publication outputs. |
| REQ-002 | Rows that fail the contract surface an exclusion reason. | Consumers can explain why a row was excluded instead of silently omitting it. |
| REQ-003 | The packet consumes the measurement contract instead of redefining certainty vocabulary. | All certainty terms come from packet 005. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The packet stays endpoint and contract focused. | No dashboard shell or presentational layer enters scope. |
| REQ-005 | The packet cites its analytics reader dependency. | The normalized reader remains the substrate instead of duplicated logic. |




### P2 - Nice-to-have (ship if low-risk)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Packet docs stay explicit about draft-versus-shipped boundaries. | Spec, plan, tasks, and implementation summary do not overclaim runtime delivery. |
| REQ-007 | Parent or successor handoff notes remain visible. | Dependencies and follow-on activation notes stay explicit in packet-local docs and parent trackers. |
| REQ-008 | Strict validation remains part of the activation gate. | The packet keeps strict validation and focused verification as mandatory before implementation is claimed complete. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Publishable rows are auditable and explainable by contract.
- **SC-002**: Later dashboard or export work has a hard eligibility gate instead of ad hoc filtering.
- **SC-003**: The packet keeps reporting governance separate from UI work.
<!-- /ANCHOR:success-criteria -->

---


### Acceptance Scenarios

**Given** this packet is reviewed before runtime work starts, **when** a maintainer reads the spec, **then** the packet stays clearly marked as draft planning work rather than shipped behavior.

**Given** a dependency named in this packet is still incomplete, **when** implementation planning resumes, **then** the docs direct the maintainer to stop and re-verify the predecessor instead of assuming readiness.

**Given** someone proposes a broader subsystem rewrite while working this packet, **when** they compare the request to the spec, **then** the packet boundary rejects that scope expansion.

**Given** a future implementation changes the named owner surfaces, **when** packet docs are updated, **then** the successor and parent handoff notes are updated at the same time.

**Given** verification discovers stale, weak, or contradictory evidence, **when** the packet is evaluated for activation, **then** the packet remains draft until focused checks pass cleanly.

**Given** a later session needs to understand why this packet exists, **when** the spec is read in isolation, **then** the research-backed seam, dependency order, and out-of-scope boundaries are all still obvious.

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rows are silently dropped without explanation | Medium | Require exclusion reasons in the contract. |
| Risk | The packet drifts into dashboard design | Medium | Keep UI explicitly out of scope. |
| External dependency | Normalized analytics reader is not scheduled in 026 and its location in 024/031 is unverified | High | Flag as hard block; cite the specific 024 or 031 packet providing the reader, or promote the reader to a new 026 child phase before 009 can progress past Draft. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Keep the packet focused on reporting handlers and publication gating logic rather than broad subsystem work.

### Security
- **NFR-S01**: Stay inside current runtime and data-exposure boundaries.

### Reliability
- **NFR-R01**: The same input state should produce the same contract or gating outcome.

---

## 8. EDGE CASES

### Data Boundaries
- Missing predecessor contract: keep the packet blocked until the dependency is satisfied.
- Mixed-authority or partial signals: fail closed instead of inventing stronger certainty than the data supports.

### Error Scenarios
- Scope drift: reject changes that invent a new owner surface outside this packet.
- Verification failure: keep the packet in draft until focused tests or corpus checks pass.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Cross-packet contract or runtime seam |
| Risk | 16/25 | Authority, freshness, or publication boundaries |
| Research | 10/20 | Research is settled but implementation mapping still matters |
| Multi-Agent | 4/15 | One primary workstream with supporting verification |
| Coordination | 7/15 | Depends on predecessor and successor packet handoff |
| **Total** | **55/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Scope expands beyond the approved seam | H | M | Keep packet ownership and out-of-scope rules explicit. |
| R-002 | Predecessor assumptions drift | M | M | Re-verify dependencies before implementation starts. |

---

## 11. USER STORIES

### US-001: Audit publication eligibility (Priority: P1)

As a maintainer, I want publishable rows to carry methodology and provenance so exports can be defended later.

**Acceptance Criteria**:
1. Given a reporting row, when it is considered for publication, then it either passes with required metadata or fails with an exclusion reason.

---

### US-002: Reuse the shared certainty contract (Priority: P1)

As a reviewer, I want reporting gates to reuse the shared certainty vocabulary so publication surfaces do not invent a second truth system.

**Acceptance Criteria**:
1. Given a publishable row, when certainty is shown, then it uses the contract from packet 005.

---

## 12. OPEN QUESTIONS

- Which handlers should be the first publication-gated consumers: export-style tools, dashboard data handlers, or both?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
