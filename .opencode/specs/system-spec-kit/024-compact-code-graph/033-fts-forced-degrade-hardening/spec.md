---
title: "Feature Specification: FTS Forced-Degrade Hardening [template:level_3/spec.md]"
description: "Create the conditional follow-on packet the refined plan left behind a runtime audit. This packet exists only if the current lexical-path truth surface still lacks a canonical forced-degrade matrix or clear chosen-path telemetry."
trigger_phrases:
  - "033-fts-forced-degrade-hardening"
  - "fts forced-degrade hardening"
  - "024-compact-code-graph"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: FTS Forced-Degrade Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 33 (`033-fts-forced-degrade-hardening`) |
| **Predecessor** | `032-cached-summary-fidelity-gates` |
| **Successor** | `034-workflow-split-and-token-insight-contracts` |

---

## EXECUTIVE SUMMARY

Create the conditional follow-on packet the refined plan left behind a runtime audit. This packet exists only if the current lexical-path truth surface still lacks a canonical forced-degrade matrix or clear chosen-path telemetry.

**Key Decisions**: Open only if a quick runtime audit still finds truth gaps; otherwise fold remaining work into packet 032.

**Critical Dependencies**: Research recommendation R7 plus the runtime audit outcome performed before implementation begins.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-08 |
| **Branch** | `main` |
| **Parent Packet** | `024-compact-code-graph` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research said FTS hardening is now a low-priority but still useful truth lane. The only reason to open a dedicated packet is if the runtime still cannot report compile-probe miss, missing table, `no such module: fts5`, BM25 failure, and chosen fallback path as one honest contract.

### Purpose
Hold the conditional hardening packet so the train has a place for remaining lexical-path truth work if the audit still finds it necessary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit the current lexical fallback and forced-degrade truth surface.
- If needed, define the canonical matrix for compile miss, missing table, module miss, BM25 failure, and chosen fallback path.
- Add focused telemetry and test coverage for the chosen-path contract.
- Document when the packet should be skipped in favor of folding work into 032.

### Out of Scope
- Reopening broad search redesign or FTS4 revival work.
- Unrelated analytics or publication features.
- Graph payload or routing work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts*` | Modify if audit requires | Harden lexical capability detection and forced-degrade reporting. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts` | Modify if audit requires | Cover the forced-degrade matrix and chosen-path telemetry. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md` | Modify if audit requires | Document the truthful forced-degrade matrix. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet begins with a quick runtime audit. | The packet explicitly records whether a dedicated hardening packet is still necessary. |
| REQ-002 | If opened, the matrix covers the canonical failure modes. | Compile miss, missing table, module miss, BM25 failure, and chosen fallback path are represented clearly. |
| REQ-003 | The packet does not overstate nonexistent lexical lanes. | Docs and telemetry stay aligned to what the runtime truly supports. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | If the audit finds no meaningful truth gap, the packet is documented as skipped or folded into 032. | The train does not keep redundant work alive. |
| REQ-005 | Continuity consumers can cite the chosen lexical path when needed. | Later packets can explain why a recovery path saw reduced lexical capability. |




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

- **SC-001**: The train has a truthful answer about whether a separate FTS hardening packet is still needed.
- **SC-002**: If needed, the forced-degrade matrix is explicit and tested.
- **SC-003**: If not needed, the packet remains a documented non-open or folded branch instead of redundant work.
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
| Risk | The packet is opened even though the truth gap is already closed | Medium | Start with the runtime audit and allow the packet to close as skipped. |
| Risk | Hardening language overstates lexical capabilities | Medium | Tie the contract strictly to implemented behavior. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Keep the packet focused on runtime audit plus lexical chosen-path reporting rather than broad subsystem work.

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

### US-001: Know whether to open the packet (Priority: P1)

As a maintainer, I want a quick runtime audit so we only open this packet if real truth gaps remain.

**Acceptance Criteria**:
1. Given the current runtime, when the audit runs, then it records whether a dedicated hardening packet is still necessary.

---

### US-002: Explain degrade paths honestly (Priority: P1)

As a reviewer, I want chosen lexical paths and forced-degrade reasons to be explicit so continuity consumers can explain degraded behavior truthfully.

**Acceptance Criteria**:
1. Given a lexical failure mode, when the contract is surfaced, then it reports the chosen path and why it was used.

---

## 12. OPEN QUESTIONS

- Is the current runtime already truthful enough to fold this packet into 032, or does one canonical matrix still need its own child packet?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
