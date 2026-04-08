---
title: "Feature Specification: Provisional Measurement Contract [template:level_3/spec.md]"
description: "Define the first follow-on governance packet from the graph-and-context research by locking one honest certainty vocabulary for all later token, cache, and savings claims."
trigger_phrases:
  - "005-provisional-measurement-contract"
  - "provisional measurement contract"
  - "026-graph-and-context-optimization"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Provisional Measurement Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Define the first follow-on governance packet from the graph-and-context research by locking one honest certainty vocabulary for all later token, cache, and savings claims.

**Key Decisions**: One shared certainty vocabulary; no headline multipliers without provider-counted authority.

**Critical Dependencies**: Research packet 001 plus all later reporting or analytics packets that emit user-facing metrics.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-04-08 |
| **Branch** | `main` |
| **Parent Packet** | `026-graph-and-context-optimization` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research found that Public can already surface polished-looking metrics, but it still lacks one repository-wide rule that distinguishes exact values from estimates, defaults, and unknowns. Without that rule, later reporting packets can overstate certainty even when the underlying counts are provisional.

### Purpose
Create the first governance packet in the train so later analytics and publication work inherits one honest measurement contract.
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in `decision-record.md` and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refuse headline savings multipliers unless provider-counted prompt, completion, and cache token fields exist (mirrors R1 acceptance criterion, recommendations.md:13).
- Define the shared status vocabulary `exact | estimated | defaulted | unknown`.
- Document methodology metadata required for publication-grade outputs.
- Identify bootstrap, resume, and reporting surfaces that must adopt the contract.
- Block headline savings or multiplier claims without provider-counted authority.

### Out of Scope
- Building new dashboard UI.
- Changing graph payload trust semantics.
- Adding new provider integrations just to improve authority.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | Modify | Add shared certainty helpers or enums. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Modify | Adopt the certainty contract in visible runtime summaries. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | Modify | Keep detailed resume outputs aligned with the same contract. |
| `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Document contract expectations and related reporting toggles. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every publishable metric field declares `exact`, `estimated`, `defaulted`, or `unknown`. | Shared helpers and docs define one vocabulary and downstream packets reference it. |
| REQ-002 | Headline savings ratios are blocked without provider-counted authority. | No later packet can publish a multiplier claim without required authority fields. |
| REQ-003 | Methodology metadata is mandatory for publication-grade rows. | Rows include schema version, methodology status, and provenance before publication. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Bootstrap and resume metric language uses the same contract. | Session-facing summaries do not bypass the shared vocabulary. |
| REQ-005 | Successor packets cite this packet as a dependency. | Reporting and continuity follow-ons name this packet directly. |




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

- **SC-001**: Later metric packets reuse one certainty vocabulary.
- **SC-002**: No publication-facing output can overclaim unsupported savings ratios.
- **SC-003**: Measurement honesty is separated cleanly from later reporting UX.
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
| Dependency | Later packets skip the contract | High | Make this packet the first dependency for reporting work. |
| Risk | Provisional is misread as optional | Medium | State clearly that provisional refers to authority, not honesty. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Keep the packet focused on shared certainty helpers and reporting-facing payloads rather than broad subsystem work.

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

### US-001: Publish honest savings claims (Priority: P0)

As a maintainer, I want one certainty vocabulary so dashboards and reports cannot overstate uncertain values.

**Acceptance Criteria**:
1. Given a publishable metric field, when it is emitted, then it carries one allowed certainty status and supporting methodology metadata.

---

### US-002: Block unsupported multipliers (Priority: P1)

As a reviewer, I want headline ratios blocked without authority so we do not publish crisp-looking estimates as exact wins.

**Acceptance Criteria**:
1. Given a report that lacks provider-counted authority, when it tries to emit a multiplier claim, then the claim is rejected or downgraded.

---

## 12. OPEN QUESTIONS

- Which current metric surfaces should adopt the contract first: bootstrap, analytics exports, or both together?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
