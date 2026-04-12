---
title: "Feature Specification: Structural Trust Axis Contract [template:level_3/spec.md]"
description: "Define the structural trust contract that the research moved ahead of graph packaging and confidence cleanup by separating provenance, evidence, and freshness or authority into explicit axes."
trigger_phrases:
  - "006-structural-trust-axis-contract"
  - "structural trust axis contract"
  - "026-graph-and-context-optimization"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Structural Trust Axis Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Define the structural trust contract that the research moved ahead of graph packaging and confidence cleanup by separating provenance, evidence, and freshness or authority into explicit axes.

**Key Decisions**: Separate trust axes before enrichment; forbid one collapsed scalar trust score.

**Critical Dependencies**: Research recommendation R10 plus the existing shared payload substrate from 024/030/001.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-04-08 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `005-provisional-measurement-contract` |
| **Successor** | `007-detector-provenance-and-regression-floor` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Current runtime surfaces already expose pieces of provenance, readiness, confidence, and freshness, but they do not yet form one cross-surface contract. The research says treating those ideas as one trust score is what breaks later packaging and graph-facing claims.

### Purpose
Define the trust-axis contract that all later graph payload and routing-hint packets must honor.
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in `decision-record.md` and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define `parserProvenance`, `evidenceStatus`, and `freshnessAuthority` as separate axes.
- Identify the shared payload, bootstrap, resume, graph-context, and bridge surfaces that must adopt the contract.
- Document prohibited collapse patterns such as a single scalar trust field.
- Set the dependency boundary for later payload validation and routing-hint packets.

### Out of Scope
- Adding a new graph router or retrieval owner.
- Artifact-default structural packaging.
- Broad multimodal or clustering work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | Modify | Introduce the trust-axis types and envelope fields. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Modify | Clarify the boundary between ranking confidence and authority. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md` | Modify | Document the cross-surface trust contract. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Modify | Adopt the separated axes in structural-context payloads. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Structural payloads expose separate provenance, evidence, and freshness or authority fields. | Shared contract docs and payload types no longer allow one field to represent all three. |
| REQ-002 | Ranking confidence is not reused as freshness or authority. | Docs and payload consumers clearly separate relevance from structural trust. |
| REQ-003 | Later graph packets cite this contract as a prerequisite. | Packets 007 and 008 depend on this packet instead of redefining trust. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Bootstrap and resume remain authority surfaces while adding trust axes. | The packet enriches current owners instead of creating a competing graph authority surface. |
| REQ-005 | The packet documents disallowed collapse patterns. | Spec and ADR text explicitly reject one-scalar trust packaging. |




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

- **SC-001**: Later graph payload work can validate against one explicit trust contract.
- **SC-002**: Confidence-scoring and structural authority are no longer conflated by design.
- **SC-003**: The packet preserves additive enrichment on current owners.
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
| Dependency | Existing surfaces already use overlapping vocabulary | High | Define explicit mapping rules before successor packets start. |
| Risk | Developers keep using confidence as shorthand for authority | High | Document prohibited collapse patterns and test them later. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Keep the packet focused on shared payload contracts and structural-context payloads rather than broad subsystem work.

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

### US-001: Read structural trust honestly (Priority: P0)

As a maintainer, I want structural payloads to separate provenance, evidence, and freshness so later consumers do not overstate what the graph knows.

**Acceptance Criteria**:
1. Given a structural payload, when it is emitted, then provenance, evidence, and freshness or authority are independently visible.

---

### US-002: Keep confidence in its lane (Priority: P1)

As a reviewer, I want ranking confidence separated from authority so retrieval relevance does not masquerade as graph truth.

**Acceptance Criteria**:
1. Given a ranked result, when its confidence is shown, then structural authority still comes from dedicated trust-axis fields.

---

## 12. OPEN QUESTIONS

- Should the exact field names be `parserProvenance`, `evidenceStatus`, and `freshnessAuthority`, or should they map into existing envelope terms?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
