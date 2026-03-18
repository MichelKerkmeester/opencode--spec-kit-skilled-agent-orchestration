---
title: "Feature Specification: Perfect Session Capturing [template:level_3/spec.md]"
description: "Roadmap follow-up for phases 018-020, capturing the shipped runtime-contract work and the still-open live-proof hardening gap without overstating closure."
trigger_phrases:
  - "perfect session capturing"
  - "phase 018"
  - "phase 019"
  - "phase 020"
  - "runtime contract"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The parent `010-perfect-session-capturing` pack already completed its audit-first reconciliation. This follow-up extends that truthful story into three sequential child phases: `018-runtime-contract-and-indexability`, `019-source-capabilities-and-structured-preference`, and `020-live-proof-and-parity-hardening`.

Two things are now true at the same time:

1. The runtime contract behind phases `018` and `019` is implemented and backed by focused automated verification.
2. The stronger “flawless across every CLI” claim still depends on fresh retained live proof, which remains the open focus of phase `020`.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-03-08 |
| **Branch** | `022-hybrid-rag-fusion/010-perfect-session-capturing` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The audit pass identified a clear next step: the repo needed follow-up documentation for the remaining roadmap work instead of leaving those recommendations implicit inside `research.md`. Without child phase folders for the runtime-contract changes and the still-open live-proof work, maintainers would have code moving ahead of the phase tree again.

### Purpose

Document phases `018` through `020` as the canonical follow-up path so the parent pack explains what has already shipped in runtime, what is only proven by automated parity, and what still requires retained live CLI artifacts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create child phase folders `018-runtime-contract-and-indexability`, `019-source-capabilities-and-structured-preference`, and `020-live-proof-and-parity-hardening`.
- Update the parent Level 3 docs so phases `018` through `020` are part of the official phase tree.
- Record the truthful current state:
  - runtime/indexability policy work is implemented
  - typed source-capability work is implemented
  - retained live proof remains follow-up work

### Out of Scope
- Editing runtime code in this spec-doc pass.
- Refreshing retained same-day live CLI artifacts in this spec-doc pass.
- Rewriting older child phases beyond referencing them correctly in the parent handoff chain.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/spec.md` | Modify | Extend the parent pack to phases `018`-`020` and correct the roadmap truth |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/plan.md` | Modify | Describe the follow-up roadmap and verification path |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/tasks.md` | Modify | Track the parent and child documentation work |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/checklist.md` | Modify | Verify the new roadmap docs and conservative proof boundary |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/decision-record.md` | Modify | Record the decision to split follow-up work into phases `018`-`020` |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/implementation-summary.md` | Modify | Summarize the roadmap documentation pass |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/018-runtime-contract-and-indexability/*.md` | Create | Phase 018 documentation |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/019-source-capabilities-and-structured-preference/*.md` | Create | Phase 019 documentation |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/020-live-proof-and-parity-hardening/*.md` | Create | Phase 020 documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## 4. PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.
>
| Phase | Folder | Theme | Current Status | Recommendation |
|-------|--------|-------|----------------|----------------|
| 001 | `001-quality-scorer-unification/` | Quality score normalization and scorer ownership | Shipped and stable | `keep` |
| 002 | `002-contamination-detection/` | Contamination detection and scoring penalties | Shipped and stable | `keep` |
| 003 | `003-data-fidelity/` | Normalization and data-loss visibility | Shipped and stable | `keep` |
| 004 | `004-type-consolidation/` | Canonical shared types | Shipped and stable | `keep` |
| 005 | `005-confidence-calibration/` | Confidence extraction and calibration | Shipped and stable | `keep` |
| 006 | `006-description-enrichment/` | Description quality and enrichment | Shipped, heuristic quality still monitored | `keep` |
| 007 | `007-phase-classification/` | Phase classification and routing | Shipped and stable | `keep` |
| 008 | `008-signal-extraction/` | Signal extraction and evidence quality | Shipped and stable | `keep` |
| 009 | `009-embedding-optimization/` | Embedding prep and retrieval weighting | Shipped and stable | `keep` |
| 010 | `010-integration-testing/` | End-to-end workflow integration | Shipped and stable | `keep` |
| 011 | `011-session-source-validation/` | Native session-source capture across CLIs | Shipped, retained live proof still thin | `add verification` |
| 012 | `012-template-compliance/` | Template and validator compliance | Shipped, regression-sensitive | `add verification` |
| 013 | `013-auto-detection-fixes/` | Auto-detection corrections | Shipped and stable | `keep` |
| 014 | `014-spec-descriptions/` | Description infrastructure and filename/indexability | Shipped, parity proof still valuable | `add verification` |
| 015 | `015-outsourced-agent-handback/` | Delegated-agent handback contract | Shipped, parity proof still valuable | `add verification` |
| 016 | `016-multi-cli-parity/` | Multi-CLI parity proof | Runtime shipped; docs reconciled | `keep` |
| 017 | `017-stateless-quality-gates/` | Stateless quality gates and structured-input parity | Runtime shipped; docs reconciled | `keep` |
| 018 | `018-runtime-contract-and-indexability/` | Validation rule metadata, write/index dispositions, and indexability policy | Runtime implemented and now documented | `keep` |
| 019 | `019-source-capabilities-and-structured-preference/` | Typed source capabilities and structured-input preference | Runtime implemented and now documented | `keep` |
| 020 | `020-live-proof-and-parity-hardening/` | Retained live proof refresh and parity hardening | Open follow-up; automated parity strengthened but live artifacts still pending | `add verification` |

### Phase Transition Rules

- Parent claims must separate shipped runtime behavior from retained live-proof obligations.
- Phases `018` and `019` may be described as implemented only when their docs match the current runtime contract and focused automated verification.
- Phase `020` stays open until retained artifacts exist for each supported CLI and save mode covered by the current contract.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| 017 | 018 | Runtime rule metadata and explicit write/index dispositions are landed | Focused automated tests plus runtime-contract docs |
| 018 | 019 | Typed source capabilities replace raw source-name branching and structured input is the preferred documented path | Focused contamination/parity tests plus doc sync |
| 019 | 020 | Automated parity covers the shared contract, including same-minute save stability | Focused automated tests and updated feature-catalog/playbook references |
| 020 | Parent closeout | Retained live artifacts are refreshed and the parent can honestly claim current end-to-end CLI proof | Manual/live proof artifacts plus recursive validation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create child phase docs for `018`, `019`, and `020` | Each phase folder contains template-compliant markdown describing scope, plan, tasks, and current status |
| REQ-002 | Parent docs must include phases `018`-`020` without placeholder drift | The parent phase map and handoff chain reference only the intended phase numbers and names |
| REQ-003 | Parent docs must distinguish implemented runtime work from open live-proof work | Phases `018` and `019` are documented as implemented, while phase `020` remains follow-up |
| REQ-004 | Parent docs must not claim flawless current CLI proof without retained artifacts | The parent pack explicitly keeps the live-proof boundary conservative |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Phase `018` must document the write/index disposition model | Phase `018` names `abort_write`, `write_skip_index`, and `write_and_index` and the V10/V2 policy outcomes |
| REQ-006 | Phase `019` must document typed source capabilities and structured preference | Phase `019` names the capability registry and the preferred `--stdin` / `--json` path |
| REQ-007 | Phase `020` must document the still-open live-proof work honestly | Phase `020` records the retained-artifact requirement and does not overstate current closure |
| REQ-008 | The updated pack must validate cleanly | Recursive validation passes after the new markdown settles |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: A maintainer can open the parent pack and see phases `018` through `020` in the official roadmap.
- **SC-002**: The parent pack states that runtime follow-up is implemented for phases `018` and `019`.
- **SC-003**: The parent pack states that retained live proof is still the open requirement for phase `020`.
- **SC-004**: Recursive validation passes after the new child docs are added.
- **SC-005**: No placeholder phase rows, duplicate numbering, or incorrect successor chains remain in the parent pack.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing runtime implementation for phases `018` and `019` | High | Keep those phases descriptive of shipped behavior, not speculative work |
| Dependency | Focused automated verification already rerun in the scripts workspace | High | Cite only rerun-backed evidence for implemented claims |
| Risk | Live proof may be mistaken as closed because automated parity is strong | High | Keep phase `020` explicitly open until retained artifacts are refreshed |
| Risk | Phase numbering drifts again after append tooling | Medium | Use the requested `018`-`020` numbering as the canonical tree and validate recursively |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The parent pack must not invent benchmark or throughput claims for phases `018`-`020`.

### Security
- **NFR-S01**: The follow-up docs must preserve the existing contamination, alignment, and save-path safety posture.

### Reliability
- **NFR-R01**: All implemented-status claims for phases `018` and `019` must map to current runtime behavior and rerun-backed automated verification.

---

## 9. EDGE CASES

### Data Boundaries
- A successful write can still intentionally skip semantic indexing under the `write_skip_index` policy.
- Structured `--stdin` / `--json` and stateless direct mode remain different evidence surfaces even when they share downstream workflow logic.

### Error Scenarios
- Retained live proof can go stale while automated parity remains green.
- Source-capability policy can regress into source-name branching if the registry is not treated as canonical.

---

## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Parent Level 3 sync plus three new child phases |
| Risk | 21/25 | Truth boundary matters more than volume of edits |
| Research | 12/20 | Roadmap is grounded in the completed audit and current runtime truth |
| Multi-Agent | 8/15 | Parent/child sync and runtime/doc truth must stay aligned |
| Coordination | 12/15 | New phases must describe shipped work without over-claiming live proof |
| **Total** | **69/100** | **Level 3** |

---

## 11. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Parent docs overstate current CLI closure | H | M | Keep phase `020` open until retained artifacts are refreshed |
| R-002 | Phase numbering drifts from the requested roadmap | M | M | Treat `018`-`020` as canonical and remove append-script pollution |
| R-003 | Runtime truth and phase docs drift again | H | M | Keep recursive validation and focused proof lanes tied to the parent pack |

---

## 12. USER STORIES

### US-001: Follow The Next Runtime Work (Priority: P0)

**As a** maintainer, **I want** phases `018` through `020` documented explicitly, **so that** the post-audit roadmap is part of the official spec tree.

**Acceptance Criteria**:
1. Given the parent pack, when I open the phase map, then phases `018`-`020` are present with truthful status.

### US-002: Distinguish Runtime Truth From Live-Proof Closure (Priority: P0)

**As a** reviewer, **I want** the pack to show what is implemented versus what still needs retained artifacts, **so that** automated parity is not mistaken for full CLI closure.

**Acceptance Criteria**:
1. Given the phase docs, when I compare `018`/`019` to `020`, then the implemented versus follow-up boundary is explicit.

### US-003: Resume The Remaining Proof Work (Priority: P1)

**As a** future operator, **I want** phase `020` to describe the missing live-proof work, **so that** the remaining parity hardening can continue without rediscovering the goal.

**Acceptance Criteria**:
1. Given phase `020`, when I review it, then I know which artifacts and scenario families still need to be refreshed.

---

## 13. OPEN QUESTIONS

- None identified for this documentation pass. The only open work is operational: refresh retained live CLI artifacts for phase `020`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Synthesis**: See `research.md`
