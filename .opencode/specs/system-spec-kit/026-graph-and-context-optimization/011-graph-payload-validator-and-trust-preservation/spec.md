---
title: "Feature Specification: Graph Payload Validator and Trust Preservation [template:level_3/spec.md]"
description: "Implement the bounded R5 packet that validates graph and bridge payload trust metadata at emission time while preserving separate provenance, evidence, and freshness fields end to end on existing owner surfaces."
trigger_phrases:
  - "011-graph-payload-validator-and-trust-preservation"
  - "graph payload validator and trust preservation"
  - "026-graph-and-context-optimization"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Graph Payload Validator and Trust Preservation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Implement the bounded R5 packet that validates graph and bridge payload trust metadata at emission time while preserving separate provenance, evidence, and freshness fields end to end on existing owner surfaces.

**Key Decisions**: Fail closed on malformed trust metadata; preserve the three trust axes additively on current payload owners only.

**Critical Dependencies**: Research recommendation R5, its R10 prerequisite, and the 006 structural trust-axis contract that defines the vocabulary this packet enforces.

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
| **Predecessor** | `006-structural-trust-axis-contract` |
| **Successor** | `008-graph-first-routing-nudge` |
| **Research Citation** | `R5 in recommendations.md:45-53; R10 context in recommendations.md:95-103` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 006 defines the structural trust axes, but there is not yet an enforcement packet that makes malformed graph or bridge trust metadata fail closed at the payload boundary. Without that validator and preservation work, downstream consumers can still drop, merge, or relabel provenance, evidence, and freshness fields in ways that recreate the collapsed-confidence mistake the research rejected.

### Purpose
Enforce the 006 trust-axis contract on graph and bridge payload emission plus the downstream consumer paths that must preserve those fields end to end.
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in `decision-record.md` and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Payload validator at the code-graph and bridge emission boundary.
- Fail-closed validation on missing or malformed parser provenance, evidence status, or freshness or authority fields.
- End-to-end preservation of the three trust axes across shared-payload, bootstrap, resume, graph-context, and bridge consumer paths.
- Contract tests that reject attempts to collapse three axes into one scalar.
- Additive enrichment on existing result-confidence, result-provenance, bridge-context, and code-graph-context payloads.

### Out of Scope
- Defining the trust-axis vocabulary; that is 006's job.
- Creating a new graph-only authority surface parallel to existing owners.
- Clustering, multimodal, or graph-first enrichment work.
- Any rewrite of the existing shared-payload substrate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | Modify | Add the fail-closed graph payload validator and shared trust-axis enforcement helpers. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` | Modify | Invoke validation when code-graph and bridge-facing payloads are emitted. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Modify | Preserve provenance, evidence, and freshness fields through bootstrap and resume outputs. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md` | Modify | Document enforcement rules and the prohibition on graph-only parallel contracts. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Code-graph and bridge payloads validate trust metadata at emission time. | Payloads fail closed when parser provenance, evidence status, or freshness or authority fields are missing or malformed. |
| REQ-002 | Consumer outputs preserve the three trust axes end to end. | Shared-payload, bootstrap, resume, graph-context, and bridge consumers keep separate provenance, evidence, and freshness fields instead of dropping or remapping them into one trust scalar. |
| REQ-003 | The packet rejects parallel graph-only trust contracts. | Implementation and docs enrich current owner payloads additively instead of introducing a second graph-shaped authority surface. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Contract tests reject collapsed trust-axis packaging. | Tests fail when callers attempt to merge provenance, evidence, and freshness into one scalar or pseudo-confidence field. |
| REQ-005 | Existing result-confidence, result-provenance, bridge-context, and code-graph-context payloads absorb the new enforcement rules additively. | Runtime mappings preserve current owners and surface names while carrying the separated trust axes through each output. |




### P2 - Nice-to-have (ship if low-risk)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Packet docs stay explicit about draft-versus-shipped boundaries. | Spec, plan, tasks, and implementation summary do not overclaim runtime delivery before focused verification passes. |
| REQ-007 | Predecessor and successor handoff notes remain visible. | Packet docs keep 006 as the hard predecessor and 008 as the next consumer of the preserved contract. |
| REQ-008 | Strict validation remains part of the activation gate. | The packet keeps focused contract tests and strict packet validation mandatory before implementation is claimed complete. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Code-graph and bridge payloads fail validation on malformed trust metadata, and consumer outputs preserve separate provenance, evidence, and freshness fields end to end without introducing a parallel graph-only contract family.
- **SC-002**: The validator enforces the 006 trust-axis contract without redefining the axis vocabulary.
- **SC-003**: Current owner payloads remain authoritative while gaining additive trust-preservation guarantees.
<!-- /ANCHOR:success-criteria -->

---


### Acceptance Scenarios

**Given** a code-graph or bridge payload is emitted with missing or malformed trust metadata, **when** the validator runs, **then** the payload fails closed instead of reaching consumers with weakened guarantees.

**Given** a consumer output passes through shared-payload, bootstrap, resume, graph-context, or bridge paths, **when** trust metadata is surfaced, **then** provenance, evidence, and freshness remain separate fields end to end.

**Given** someone proposes a new graph-only trust surface while implementing this packet, **when** they compare the change to the spec, **then** the packet boundary rejects that scope expansion.

**Given** a caller tries to collapse the three trust axes into one scalar, **when** contract tests execute, **then** the test suite fails and the packet stays blocked.

**Given** a dependency named in this packet is still incomplete, **when** implementation planning resumes, **then** the docs direct the maintainer to stop and re-verify 006 rather than assuming the contract is stable enough to enforce.

**Given** a later session needs to understand why this packet exists, **when** the spec is read in isolation, **then** the R5-on-R10 dependency chain, additive-owner rule, and no-parallel-family boundary are all still obvious.

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 006 trust-axis vocabulary drifts before runtime enforcement starts | High | Re-read the predecessor contract before implementation and keep this packet blocked if the vocabulary changes. |
| Risk | Validator logic accidentally creates a second graph-only authority surface | High | Enforce additive enrichment on current owners only and document the prohibition in code, tests, and contract docs. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Keep validation bounded to payload-emission and consumer-preservation seams rather than broad shared-payload rewrites.

### Security
- **NFR-S01**: Stay inside current runtime and data-exposure boundaries while failing closed on malformed trust metadata.

### Reliability
- **NFR-R01**: The same payload shape should always produce the same validation and trust-preservation outcome.

---

## 8. EDGE CASES

### Data Boundaries
- Missing predecessor contract alignment: keep the packet blocked until 006 remains the canonical vocabulary source.
- Partial trust metadata: fail closed instead of backfilling or silently coercing weak values.

### Error Scenarios
- Scalar collapse attempt: reject the payload or the test fixture instead of inventing a cleaned-up trust score.
- Scope drift: reject changes that create a graph-only authority surface outside the current owners.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | Cross-surface validator and preservation seam |
| Risk | 18/25 | Trust, freshness, and authority boundaries |
| Research | 10/20 | Research is settled but payload mapping still matters |
| Multi-Agent | 4/15 | One primary workstream with supporting verification |
| Coordination | 8/15 | Depends on 006 and informs 008 |
| **Total** | **59/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Scope expands into a competing graph-only contract family | H | M | Keep additive-owner rules explicit in spec, tests, and contract docs. |
| R-002 | Consumers silently collapse the three axes during propagation | H | M | Add end-to-end preservation checks on every named output path. |

---

## 11. USER STORIES

### US-001: Fail malformed trust metadata closed (Priority: P0)

As a maintainer, I want code-graph and bridge payloads to reject malformed trust metadata so downstream consumers cannot treat weak or partial structural trust as valid.

**Acceptance Criteria**:
1. Given a payload missing parser provenance, evidence status, or freshness or authority fields, when it is emitted, then validation fails closed.

---

### US-002: Preserve trust axes end to end (Priority: P0)

As a reviewer, I want consumer outputs to carry provenance, evidence, and freshness separately so no downstream surface reintroduces the collapsed-confidence framing the research rejected.

**Acceptance Criteria**:
1. Given a preserved payload, when bootstrap, resume, graph-context, or bridge outputs surface it, then the three trust axes remain separate and additive on current owners.

---

## 12. OPEN QUESTIONS

- Should the validator live entirely inside `shared-payload.ts`, or should the code-graph handler own a thin emission-specific wrapper over the shared validator?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
