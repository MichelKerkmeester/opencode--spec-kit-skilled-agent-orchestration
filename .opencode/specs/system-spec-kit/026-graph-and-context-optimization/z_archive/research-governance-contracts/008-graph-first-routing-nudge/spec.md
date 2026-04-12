---
title: "Feature Specification: Graph-First Routing Nudge [template:level_3/spec.md]"
description: "Implement the narrow graph-first nudge the research retained after rejecting larger graph-router ambitions by tightening structural hints on existing bootstrap and request-shaped response surfaces only."
trigger_phrases:
  - "008-graph-first-routing-nudge"
  - "graph-first routing nudge"
  - "026-graph-and-context-optimization"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Graph-First Routing Nudge

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Implement the narrow graph-first nudge the research retained after rejecting larger graph-router ambitions by tightening structural hints on existing bootstrap and request-shaped response surfaces only.

**Key Decisions**: Use existing surfaces only; keep `session_bootstrap()` authoritative.

**Critical Dependencies**: Research recommendation R4 (recommendations.md:35-43); requires 006-structural-trust-axis-contract (R10) and 011-graph-payload-validator-and-trust-preservation (R5) before implementation can start. Task-shaped nudges stay on existing bootstrap and request-shaped response surfaces only; do NOT introduce a new graph-router subsystem.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-04-08 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `007-detector-provenance-and-regression-floor` |
| **Successor** | `009-auditable-savings-publication-contract` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo already exposes structural query routing guidance, but the research says the remaining value is a narrow nudge for structural-task misfires, not a new graph subsystem. The safe opportunity is to make the existing guidance more specific and readiness-aware.

### Purpose
Define the additive routing-hint packet that nudges structural tasks toward the right tools without replacing current owners.
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in `decision-record.md` and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add readiness-gated structural hints to existing bootstrap or request-shaped response-hint surfaces.
- Scope the nudge to structural-first task shapes after likely `Glob|Grep` misfires.
- Define a frozen task slice for first-query routing evaluation.
- Keep all behavior advisory and additive.

### Out of Scope
- New graph routers or replacement retrieval owners.
- Cached query side effects or root-file mutation.
- Graph packaging or structural artifact publication.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Modify | Refine structural routing hints for likely misfires. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Modify | Add bounded structural-routing guidance while preserving bootstrap authority. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modify | Thread advisory-only structural guidance into relevant responses. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The nudge is advisory-only and uses existing surfaces. | No new routing subsystem or competing graph owner is introduced. |
| REQ-002 | The nudge is readiness-gated. | Structural hints appear only when graph readiness and activation scaffolding justify them. |
| REQ-003 | Evaluation uses a frozen structural-task slice. | The packet defines before-or-after first-query routing checks on a fixed corpus. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Non-structural tasks do not regress. | Evaluation explicitly checks that generic or semantic tasks do not get worse guidance. |
| REQ-005 | Bootstrap and resume remain authoritative. | Hints do not outrank or replace `session_bootstrap()` or deeper resume flows. |




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

- **SC-001**: Structural-task guidance becomes more specific without becoming a new router.
- **SC-002**: Graph readiness and task-shaped response context control when hints appear.
- **SC-003**: A frozen corpus exists to judge whether the nudge improves first-query routing.
<!-- /ANCHOR:success-criteria -->

---


### Acceptance Scenarios

**Given** this packet is reviewed after shipment, **when** a maintainer reads the spec, **then** the docs distinguish the shipped bootstrap and request-shaped response nudges from the unshipped startup or resume hook hint.

**Given** a dependency named in this packet is still incomplete, **when** implementation planning resumes, **then** the docs direct the maintainer to stop and re-verify the predecessor instead of assuming readiness.

**Given** someone proposes a broader subsystem rewrite while working this packet, **when** they compare the request to the spec, **then** the packet boundary rejects that scope expansion.

**Given** a future implementation changes the named owner surfaces, **when** packet docs are updated, **then** the successor and parent handoff notes are updated at the same time.

**Given** verification discovers stale, weak, or contradictory evidence, **when** the packet is evaluated for activation, **then** the packet remains draft until focused checks pass cleanly.

**Given** a later session needs to understand why this packet exists, **when** the spec is read in isolation, **then** the research-backed seam, dependency order, and out-of-scope boundaries are all still obvious.

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The packet grows into a graph-router subsystem | High | Keep it strictly advisory and surface-bounded. |
| Risk | Hints show up when graph readiness is weak | Medium | Gate on readiness and scaffold state. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Keep the packet focused on bootstrap and request-shaped response hint surfaces with readiness gates rather than broad subsystem work.

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

### US-001: Nudge structural misfires (Priority: P1)

As a user, I want bootstrap and response hints to steer structural questions toward graph tools so I choose the right first tool more often.

**Acceptance Criteria**:
1. Given a structural-task prompt and a ready graph, when routing guidance is emitted, then it recommends the structural path explicitly.

---

### US-002: Avoid overreach (Priority: P1)

As a maintainer, I want the nudge to stay advisory so bootstrap and resume remain the authority surfaces.

**Acceptance Criteria**:
1. Given a bootstrap flow or request-shaped response, when the nudge appears, then it adds guidance without replacing the owner surface.

---

## 12. OPEN QUESTIONS

- Should this packet depend fully on 006 and 007, or can it ship a first hint pass using only existing readiness metadata?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
