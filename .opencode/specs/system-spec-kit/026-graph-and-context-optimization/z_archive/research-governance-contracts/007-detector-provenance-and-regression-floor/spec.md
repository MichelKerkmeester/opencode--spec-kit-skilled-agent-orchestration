---
title: "Feature Specification: Detector Provenance and Regression Floor [template:level_3/spec.md]"
description: "Create the bounded detector packet the research described: AST-versus-regex honesty plus a frozen regression floor, without pretending fixtures alone prove user-visible structural quality."
trigger_phrases:
  - "007-detector-provenance-and-regression-floor"
  - "detector provenance and regression floor"
  - "026-graph-and-context-optimization"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Detector Provenance and Regression Floor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Create the bounded detector packet the research described: AST-versus-regex honesty plus a frozen regression floor, without pretending fixtures alone prove user-visible structural quality.

**Key Decisions**: Detector integrity is a floor, not outcome proof.

**Critical Dependencies**: Research recommendation R6 plus the CodeSight closeout on detector honesty.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-08 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `006-structural-trust-axis-contract` |
| **Successor** | `008-graph-first-routing-nudge` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research found that some detector paths can overclaim AST-backed precision or hide heuristics behind stronger-sounding labels. It also warned that fixture coverage is useful only as a regression floor, not as a proxy for user-visible success.

### Purpose
Open the safest bounded detector-hardening packet in the train: provenance honesty plus a frozen regression floor.
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in `decision-record.md` and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit detector outputs for AST-versus-regex honesty.
- Define or extend frozen detector fixtures that fail on structural regressions.
- Document the boundary between detector-floor success and later outcome evaluation.
- Keep the packet focused on detector truthfulness, not graph routing or packaging.

### Out of Scope
- Claiming end-user quality improvements from fixtures alone.
- Rewriting the whole graph pipeline.
- Opening new report or dashboard surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search` | Read-first targeted modify | Align provenance labels where they overstate extraction strength. |
| `.opencode/skill/system-spec-kit/scripts/tests` | Modify | Add or extend frozen detector fixtures and regression assertions. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md` | Modify | Document the floor-versus-outcome boundary. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Detector outputs label heuristic or regex-backed paths honestly. | No detector output claims AST certainty where the implementation is heuristic or regex-backed. |
| REQ-002 | Frozen fixtures catch detector regressions. | The packet defines or extends a fixture floor that fails on structural regressions. |
| REQ-003 | The packet does not treat fixture success as end-user quality proof. | Docs define fixtures as a regression floor with separate later outcome evaluation. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Successor packets reuse the fixture floor without conflating it with routing quality. | Later packets reference this packet for detector integrity only. |
| REQ-005 | Remaining breadcrumb-grade detector limits stay visible. | Scope notes keep weak detector lanes explicit instead of hiding them behind the fixture pass. |




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

- **SC-001**: Detector provenance language no longer overclaims extraction strength.
- **SC-002**: A frozen fixture floor exists for structural detector regressions.
- **SC-003**: The packet preserves the distinction between regression integrity and user-visible quality.
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
| Risk | Fixture passes are misread as quality proof | High | Document the boundary in the ADR and checklist. |
| Risk | Detector scope balloons into parser redesign | Medium | Keep the packet focused on provenance honesty and frozen fixtures only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Keep the packet focused on detector provenance labels and frozen regression fixtures rather than broad subsystem work.

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

### US-001: Trust detector labels (Priority: P1)

As a maintainer, I want detector provenance labels to be honest so later packets do not build on overstated extraction certainty.

**Acceptance Criteria**:
1. Given a detector result, when its provenance is surfaced, then it matches the real extraction method.

---

### US-002: Catch regressions early (Priority: P1)

As a reviewer, I want frozen detector fixtures so structural regressions fail before they reach later packets.

**Acceptance Criteria**:
1. Given a detector regression, when the fixture suite runs, then the regression fails deterministically.

---

## 12. OPEN QUESTIONS

- Which current detector outputs most urgently need provenance hardening before the fixture floor is declared stable?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
