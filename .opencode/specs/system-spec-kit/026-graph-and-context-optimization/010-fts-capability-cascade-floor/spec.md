---
title: "Feature Specification: FTS Capability Cascade Floor [template:level_3/spec.md]"
description: "Create the bounded FTS hardening packet the research described: runtime lexical-path truth, explicit fallback status, and a truthful forced-degrade matrix that preserves current semantics when FTS5 is unavailable."
trigger_phrases:
  - "010-fts-capability-cascade-floor"
  - "fts capability cascade floor"
  - "026-graph-and-context-optimization"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: FTS Capability Cascade Floor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Create the bounded FTS hardening packet the research described: runtime lexical-path truth, explicit fallback status, and a truthful forced-degrade matrix that preserves current semantics when FTS5 is unavailable.

**Key Decisions**: Record the real lexical lane taken at runtime and reject any overstated legacy fallback claim.

**Critical Dependencies**: Research recommendation R7; this packet is the hard predecessor for `002-implement-cache-warning-hooks`.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Implemented |
| **Created** | 2026-04-08 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `009-auditable-savings-publication-contract` |
| **Successor** | `011-graph-payload-validator-and-trust-preservation` |
| **Research Citation** | `R7` in `001-research-graph-context-systems/research/recommendations.md:65-73` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research found that Public already ships most of the FTS substrate, but the runtime still needs hardening around lexical-path truth, explicit fallback status, and forced-degrade coverage. Without that floor, later analytics and cache-warning work could build on optimistic capability assumptions or incomplete failure handling.

### Purpose
Open the bounded FTS hardening packet that stabilizes runtime truth before phase `002-implement-cache-warning-hooks` begins.
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in `decision-record.md` and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- FTS5 compile-probe at runtime.
- Forced-degrade matrix for compile-probe miss, missing table, `no such module: fts5`, and BM25 runtime failure.
- Runtime logging of which lexical path was chosen (`FTS5` vs `LIKE` vs BM25 fallback).
- Explicit fallback status surface on `memory_search` responses.
- Preservation of current retrieval semantics when FTS5 is unavailable.

### Out of Scope
- Any unsupported legacy fallback lane claim.
- Broader search feature work.
- New search UI or user-facing changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Read-first targeted modify | Surface lexical-path and fallback metadata on `memory_search` responses and packet-local logging. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` | Modify | Harden FTS5 capability probing and classify the forced-degrade cases truthfully. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts` | Modify | Add forced-degrade coverage for compile-probe miss, missing table, `no such module: fts5`, and BM25 runtime failure. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts` | Modify | Assert the response surface exposes explicit fallback status and lexical-path provenance. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md` | Modify | Keep lexical-lane and fallback documentation aligned with runtime truth. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Runtime capability detection distinguishes the real FTS5 availability state. | The runtime can distinguish compile-probe miss, missing `memory_fts`, `no such module: fts5`, and BM25 runtime failure without collapsing them into a vague generic status. |
| REQ-002 | `memory_search` records the lexical path chosen at runtime. | Search responses and logs identify whether the lexical lane used `FTS5`, `LIKE`, or BM25 fallback. |
| REQ-003 | Fallback state is explicit and truthful. | `memory_search` responses surface fallback status directly instead of forcing callers to infer it from missing fields or warnings. |
| REQ-004 | Current retrieval semantics remain intact when FTS5 is unavailable. | The degraded path preserves the existing behavior contract instead of failing closed or changing result-shape semantics. |
| REQ-005 | The packet does not overstate an unavailable legacy lexical lane. | No packet doc, test, or runtime surface claims an unsupported fallback lane as supported. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The forced-degrade matrix is frozen in tests and docs. | Tests and packet docs cover all four named failure cases with the same truthful labels. |
| REQ-007 | Phase `002-implement-cache-warning-hooks` has a clear predecessor contract. | The successor packet can depend on this packet for lexical-path truth and fallback-state semantics without re-litigating the lane definitions. |
| REQ-008 | Packet docs stay honest about shipped versus planned behavior. | Spec, plan, tasks, checklist, ADR, and implementation summary avoid overstating runtime delivery before implementation lands. |




### P2 - Nice-to-have (ship if low-risk)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Trace output remains implementation-friendly. | Include-trace or debug surfaces can reuse the lexical-path and fallback metadata without inventing a second vocabulary. |
| REQ-010 | Packet docs make the degrade matrix easy to audit later. | The forced-degrade cases remain easy to map from research to tests to runtime output. |
| REQ-011 | Strict validation remains part of the activation gate. | The packet keeps focused verification and strict validation as mandatory before implementation is claimed complete. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Memory search records which lexical path was chosen at runtime, exposes fallback status explicitly, preserves current semantics when FTS5 is unavailable, and ships a truthful forced-degrade matrix that covers compile-probe miss, missing table, `no such module: fts5`, and BM25 runtime failure without overstating an unsupported fallback lane.
- **SC-002**: Phase `002-implement-cache-warning-hooks` has a stable predecessor contract for lexical-path truth and fallback-state semantics.
- **SC-003**: Packet docs, tests, and runtime surfaces use the same truthful lane vocabulary.
<!-- /ANCHOR:success-criteria -->

---


### Acceptance Scenarios

**Given** SQLite is available but the runtime compile probe says FTS5 support is absent, **when** `memory_search` executes, **then** the response records the degraded lexical path and explicit fallback status while preserving current retrieval semantics.

**Given** the SQLite build supports FTS5 but the `memory_fts` table is missing, **when** lexical search runs, **then** the runtime records that missing-table degrade case without pretending the lexical lane failed for the same reason as a compile-probe miss.

**Given** the runtime hits `no such module: fts5`, **when** the lexical helper probes or executes, **then** the forced-degrade matrix records that engine-level failure explicitly and does not claim a hidden unsupported fallback lane.

**Given** the BM25 ranking call fails at runtime, **when** lexical search is recovered, **then** the response and tests record BM25 runtime failure as its own degrade case rather than silently collapsing it into success.

**Given** phase `002-implement-cache-warning-hooks` is evaluated for readiness, **when** maintainers read this packet, **then** the dependency on truthful lexical-path and fallback-state semantics is obvious and still marked as a hard predecessor.

**Given** someone proposes broad search-surface or UI work while touching this packet, **when** they compare the request to the spec, **then** the packet boundary rejects that scope expansion.

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fallback labels drift away from real runtime behavior | High | Keep runtime logging, response metadata, docs, and tests on the same forced-degrade vocabulary. |
| Risk | The packet overstates a lexical fallback lane that does not really exist | High | Reject any unsupported fallback claim in docs, code, and test fixtures. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Runtime capability detection and fallback labeling should add only bounded overhead to lexical search setup.

### Security
- **NFR-S01**: The new metadata must not expose secrets or broaden the user-visible payload beyond packet-approved response fields.

### Reliability
- **NFR-R01**: The same failure mode should map to the same fallback status and lexical-path label every time.

---

## 8. EDGE CASES

### Data Boundaries
- Missing `memory_fts` table after successful compile probe: degrade truthfully without changing current retrieval semantics.
- Partial lexical availability where FTS5 exists but BM25 ranking fails: record BM25 runtime failure distinctly.

### Error Scenarios
- `no such module: fts5`: surface the engine-level degrade case explicitly and continue on the preserved fallback path.
- Scope drift toward broader search product work: reject it and keep the packet focused on capability-cascade hardening only.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | Cross-packet runtime contract for lexical-path truth |
| Risk | 18/25 | Capability drift can mislead successor packets |
| Research | 9/20 | Research is settled; runtime mapping still needs careful truthfulness |
| Multi-Agent | 4/15 | One primary workstream with supporting verification |
| Coordination | 8/15 | Hard predecessor for phase `002` plus docs/tests/runtime alignment |
| **Total** | **58/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Degrade cases collapse into one generic fallback state | H | M | Freeze the four-case matrix in tests and response metadata. |
| R-002 | Packet docs drift from runtime lexical-path truth | M | M | Update README and packet docs alongside the handler and helper changes. |

---

## 11. USER STORIES

### US-001: Trust the lexical lane (Priority: P0)

As a maintainer, I want `memory_search` to tell me which lexical path ran so later packets do not depend on guessed capability behavior.

**Acceptance Criteria**:
1. Given a `memory_search` response, when lexical search participated, then the chosen lexical path is explicit and truthful.

---

### US-002: Keep degraded search honest (Priority: P0)

As a reviewer, I want forced-degrade cases frozen in tests so runtime fallback behavior stays truthful when FTS5 or BM25 is unavailable.

**Acceptance Criteria**:
1. Given one of the four named failure modes, when the lexical helper degrades, then the response and tests agree on the exact fallback status.

---

## 12. OPEN QUESTIONS

- Which existing response field or trace envelope should own the new lexical-path and fallback-status metadata without duplicating adjacent provenance fields?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
