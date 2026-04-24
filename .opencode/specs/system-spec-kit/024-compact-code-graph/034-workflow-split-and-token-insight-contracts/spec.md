---
title: "Feature Specification [system-spec-kit/024-compact-code-graph/034-workflow-split-and-token-insight-contracts/spec]"
description: "Hold the optional tail packet that the refined plan keeps after cached-summary and publication work. This packet would define the verifier/discoverer workflow split and later token-insight contracts only after earlier governance and continuity contracts stabilize."
trigger_phrases:
  - "034-workflow-split-and-token-insight-contracts"
  - "workflow split and token insight contracts"
  - "024-compact-code-graph"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/034-workflow-split-and-token-insight-contracts"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: Workflow Split and Token Insight Contracts

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 34 (`034-workflow-split-and-token-insight-contracts`) |
| **Predecessor** | `033-fts-forced-degrade-hardening` |
| **Successor** | None |

---

## EXECUTIVE SUMMARY

Hold the optional tail packet that the refined plan keeps after cached-summary and publication work. This packet would define the verifier/discoverer workflow split and later token-insight contracts only after earlier governance and continuity contracts stabilize.

**Key Decisions**: Open only after 032 and publication contracts are proven stable.

**Critical Dependencies**: Packets 032, 005, and 009, plus optionally 033 if the FTS truth lane remains active.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-04-08 |
| **Branch** | `main` |
| **Parent Packet** | `024-compact-code-graph` |

---

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research left the workflow split and token-insight surfaces as later work because they depend on already-stable measurement, continuity, and publication contracts. Opening them too early would force the packet to choose semantics that earlier packets are supposed to settle first.

### Purpose
Reserve the optional orchestration and insight packet in the continuity train without letting it outrun its predecessors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the verifier/discoverer split as a workflow or orchestration contract, not a new subsystem.
- Define later token-insight contract surfaces that consume stabilized analytics and measurement metadata.
- Document the predecessor gates that must pass before this packet becomes active.
- Keep the packet optional and late in the train.

### Out of Scope
- Opening the packet before cached-summary and publication contracts stabilize.
- New startup authority surfaces.
- Dashboard UI or unrelated graph work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers` | Modify later if activated | Expose token-insight contract surfaces after predecessor contracts stabilize. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md` | Modify later if activated | Document workflow-role boundaries and token-insight contracts. |
| Packet-local docs only for now | Create | Reserve the dependency and scope contract until activation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet remains gated behind predecessor completion. | Docs make clear that this packet is not active work until earlier governance and continuity packets are stable. |
| REQ-002 | The workflow split is defined as orchestration, not a new subsystem. | The packet rejects any redesign that replaces current owners. |
| REQ-003 | Token-insight contracts consume stabilized metadata. | The packet cannot define token-insight semantics independently of earlier contracts. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The packet stays optional in the train. | The refined phase order can stop before this packet if earlier contracts satisfy current needs. |
| REQ-005 | Activation criteria are explicit. | The packet names the predecessor packets and proof points required before activation. |




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

- **SC-001**: The continuity train has a clearly bounded optional tail packet instead of an implied future bucket.
- **SC-002**: Workflow split and token-insight work cannot outrun the contracts they depend on.
- **SC-003**: The packet preserves additive orchestration rather than subsystem replacement.
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
| Risk | The packet is opened before its predecessors are stable | Medium | Keep activation criteria explicit in spec, plan, and checklist. |
| Risk | Workflow split drifts into architecture replacement | Medium | Document orchestration-only boundaries in the ADR. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Keep the packet focused on orchestration-role boundaries and later token-insight surfaces rather than broad subsystem work.

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

### US-001: Hold the optional tail cleanly (Priority: P2)

As a maintainer, I want a defined optional tail packet so future workflow or token-insight work has a clear home without blocking current implementation.

**Acceptance Criteria**:
1. Given the current train, when this packet is reviewed, then its activation criteria and optional status are explicit.

---

### US-002: Reuse stabilized contracts (Priority: P1)

As a reviewer, I want later workflow and token-insight work to consume existing contracts so no second truth system appears.

**Acceptance Criteria**:
1. Given a token-insight or workflow surface, when it is defined later, then it reuses earlier measurement and continuity contracts.

---

## 12. OPEN QUESTIONS

- What proof points should count as stable enough to activate this packet: passing corpora, publication-ready rows, or both?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
