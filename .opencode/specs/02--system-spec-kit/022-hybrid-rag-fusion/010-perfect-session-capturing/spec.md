---
title: "Feature Specification: Perfect Session Capturing [template:level_3/spec.md]"
description: "Phase roadmap and implementation truth for phases 001-020, with phases 018 and 019 shipped and phase 020 still open for retained live proof."
trigger_phrases:
  - "perfect session capturing"
  - "spec 010"
  - "truth reconciliation"
  - "roadmap phases 018 019 020"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This parent pack now carries one stable audit baseline and one partially completed recommendation roadmap.

1. Phases `001` through `017` remain the reconciled audit story captured in the existing parent pack and `research.md`.
2. Phases `018` and `019` are now shipped in runtime, tests, and operator docs, while phase `020` remains open until retained live artifacts catch up with the hardened contract.

**Key Decisions**: Treat runtime truth as canonical, keep the parent pack audit-first, and keep live-proof closure gated on retained evidence.

**Critical Dependencies**: Focused session-capturing test coverage, `npm run build`, and recursive spec-pack validation.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-03-08 |
| **Updated** | 2026-03-18 |
| **Branch** | `022-hybrid-rag-fusion/010-perfect-session-capturing` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The parent `010-perfect-session-capturing` pack had already been reconciled through phase `017`, but the recommendation follow-through after that audit needed both implementation work and spec-pack follow-through. The runtime now includes explicit write/index dispositions and typed source capabilities, yet the parent pack still needs to distinguish those shipped changes from the still-open retained live-proof work.

### Purpose

Extend the pack truthfully through phases `018`, `019`, and `020`. The parent pack should tell readers what is already reconciled, what is now shipped in runtime, and why universal "flawless across every CLI" language is still blocked on retained live proof.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep the existing audit baseline for phases `001` through `017` intact.
- Extend the parent phase map and roadmap narrative from `017` to `020`.
- Create and populate the child phase folders:
  - `018-runtime-contract-and-indexability/`
  - `019-source-capabilities-and-structured-preference/`
  - `020-live-proof-and-parity-hardening/`
- Ship the phase-018 runtime contract and phase-019 source-capability work in the session-capturing scripts.
- Update focused Vitest coverage, the feature catalog, and the manual testing playbook for the shipped contract.
- Update the six parent Level 3 markdown files so they reference the new phases consistently and truthfully.
- Revalidate the parent pack recursively after the implementation and documentation settle.

### Out of Scope
- Claiming retained live CLI proof is already refreshed for phase `020`.
- Reclassifying phase `020` as complete before retained live artifacts are refreshed.
- Rewriting older child phases beyond the parent references needed to explain the shipped/open roadmap truth.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts` | Modify | Add validation-rule metadata and explicit disposition helpers |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Resolve write/index dispositions from the new validation contract |
| `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` | Modify | Persist policy-aware indexing status |
| `.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts` | Create | Define typed source capabilities for structured/stateless policy |
| `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts` | Modify | Replace source-name branching with capability-driven policy |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Prefer structured `--stdin` and `--json` in the operator contract |
| `.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts` | Modify | Prevent false-positive template-data warnings in successful flows |
| `.opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts` | Modify/Create | Prove the new runtime contract and parity behavior |
| `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md` | Modify | Publish the authoritative session-capturing contract |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Publish the refreshed proof boundary and parity scenarios |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/spec.md` | Modify | Extend the parent roadmap from `017` to `020` with truthful runtime/proof boundaries |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/plan.md` | Modify | Align the parent plan to the shipped runtime follow-up and open proof work |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/tasks.md` | Modify | Track shipped `018`/`019` work and open `020` proof follow-up |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/checklist.md` | Modify | Record runtime, doc, and validation evidence for the roadmap extension |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/decision-record.md` | Modify | Record the shipped/open roadmap decision |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/implementation-summary.md` | Modify | Summarize the shipped follow-up truthfully |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/018-runtime-contract-and-indexability/*.md` | Create/Modify | Document the phase-018 shipped runtime contract work |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/019-source-capabilities-and-structured-preference/*.md` | Create/Modify | Document the phase-019 shipped source-capability work |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/020-live-proof-and-parity-hardening/*.md` | Create/Modify | Track the still-open retained-proof work |
<!-- /ANCHOR:scope -->

---

## 4. PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Theme | Current State | Recommendation |
|-------|--------|-------|---------------|----------------|
| 001 | `001-quality-scorer-unification/` | Quality score normalization and scorer ownership | Shipped and retained in audit history | `keep` |
| 002 | `002-contamination-detection/` | Contamination detection and scoring penalties | Shipped and retained in audit history | `keep` |
| 003 | `003-data-fidelity/` | Normalization and data-loss visibility | Shipped and retained in audit history | `keep` |
| 004 | `004-type-consolidation/` | Canonical shared types | Shipped and retained in audit history | `keep` |
| 005 | `005-confidence-calibration/` | Confidence extraction and calibration | Shipped and retained in audit history | `keep` |
| 006 | `006-description-enrichment/` | Description quality and enrichment | Shipped, with heuristic quality limits still noted in the audit | `keep` |
| 007 | `007-phase-classification/` | Phase classification and routing | Shipped and retained in audit history | `keep` |
| 008 | `008-signal-extraction/` | Signal extraction and evidence quality | Shipped and retained in audit history | `keep` |
| 009 | `009-embedding-optimization/` | Embedding prep and retrieval weighting | Shipped and retained in audit history | `keep` |
| 010 | `010-integration-testing/` | End-to-end workflow integration | Shipped and retained in audit history | `keep` |
| 011 | `011-session-source-validation/` | Native session-source capture across CLIs | Shipped, but live-proof refresh remains desirable | `add verification` |
| 012 | `012-template-compliance/` | Template and validator compliance | Shipped, but compliance can regress when docs drift | `add verification` |
| 013 | `013-auto-detection-fixes/` | Auto-detection corrections | Shipped and retained in audit history | `keep` |
| 014 | `014-spec-descriptions/` | Description infrastructure and filename/indexability | Shipped, with parity and collision proof still worth refreshing | `add verification` |
| 015 | `015-outsourced-agent-handback/` | Delegated-agent handback contract | Shipped, with live proof still thinner than desired | `add verification` |
| 016 | `016-multi-cli-parity/` | Multi-CLI parity proof | Runtime shipped; docs previously reconciled | `keep` |
| 017 | `017-stateless-quality-gates/` | Stateless quality gates and structured-input parity | Runtime shipped; docs previously reconciled | `keep` |
| 018 | `018-runtime-contract-and-indexability/` | Validation rule metadata and write/index disposition policy | Runtime shipped and phase docs reconciled | `keep` |
| 019 | `019-source-capabilities-and-structured-preference/` | Typed source capabilities and structured-input preference | Runtime shipped and phase docs reconciled | `keep` |
| 020 | `020-live-proof-and-parity-hardening/` | Retained live proof refresh and parity hardening | Open follow-up phase tracking live-proof closure | `add verification` |

### Phase Transition Rules

- The parent pack remains the integrated roadmap and audit entry point.
- Shipped runtime claims belong only to phases with direct code, test, and documentation evidence.
- Phases `018` and `019` are implemented follow-up work, while phase `020` remains an open roadmap phase.
- Recursive validation proves structural integrity of the spec tree, not universal live parity across all CLIs.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| 017 | 018 | The shipped runtime needs first-class write/index policy and indexability rules | Runtime tests and phase docs agree on the phase-018 implementation boundary |
| 018 | 019 | Source-policy refinement should build on the shipped runtime-contract phase | Runtime tests and phase docs agree on the phase-019 implementation boundary |
| 019 | 020 | Live retained proof remains a separate acceptance bar after design and policy work | Parent and child docs agree on the phase-020 proof boundary |

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The parent phase map must extend cleanly from `017` to `020` | `spec.md` names phases `018`, `019`, and `020` with truthful shipped/open status |
| REQ-002 | The three new child folders must exist with template-compliant markdown | Each child phase contains populated `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` |
| REQ-003 | Runtime follow-up for phases `018` and `019` must ship | Code, tests, and operator docs prove the new contract and structured-preference behavior |
| REQ-004 | Parent roadmap language must stay conservative about live proof | No parent document claims phase `020` or universal CLI parity is complete |
| REQ-005 | Recursive strict validation must pass for the full parent pack | `validate.sh --strict --recursive` passes after the implementation and doc updates |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The six parent Level 3 docs must reference the roadmap phases consistently | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` tell the same shipped/open story |
| REQ-007 | Live-proof claims must remain intentionally conservative | The docs state that retained artifacts are still required before "flawless across every CLI" can be claimed |
| REQ-008 | Existing audit truth must remain intact | Phases `001` through `017` still read as the reconciled baseline rather than being overwritten by the new roadmap language |
| REQ-009 | The parent pack must point future implementation toward the correct child phases | The roadmap language maps runtime-contract work to `018`, source-capability work to `019`, and live-proof hardening to `020` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: Given a maintainer opens the parent pack, they can see phases `001` through `020` in one continuous phase map.
- **SC-002**: Given a maintainer opens phases `018` and `019`, they see implemented runtime follow-up with verification evidence.
- **SC-003**: Given a maintainer opens phase `020`, they see that retained live proof is still pending.
- **SC-004**: Given a reviewer asks whether multi-CLI proof is fully closed, the docs still answer "not yet" unless retained live proof exists.
- **SC-005**: Given focused runtime tests and the scripts build are rerun, the new contract still passes.
- **SC-006**: Given recursive strict validation is rerun, the parent pack validates cleanly.
- **SC-007**: Given future implementation or proof work resumes, maintainers can tell which child phase owns runtime contract, source capabilities, and live-proof follow-up.

### Acceptance Scenarios

1. **Given** the parent pack after this pass, **when** a maintainer reads the phase map, **then** phases `018`, `019`, and `020` appear in sequence with truthful status language.
2. **Given** the root docs after this pass, **when** a reviewer compares their claims, **then** they all describe phases `018` and `019` as implemented runtime follow-up.
3. **Given** phase `020`, **when** a reviewer checks proof posture, **then** retained live CLI artifacts are still described as required before universal parity claims can strengthen.
4. **Given** the new child phase folders, **when** they are opened, **then** each contains populated template-compliant markdown rather than placeholder scaffolding.
5. **Given** the updated parent pack, **when** focused runtime checks rerun, **then** the session-capturing contract still passes.
6. **Given** the updated parent pack, **when** recursive strict validation runs, **then** the tree passes without numbering drift or missing required sections.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing audit narrative and `research.md` | High | Treat them as the preserved truth baseline while extending the phase map |
| Dependency | Focused session-capturing tests and build | High | Use them as the evidence base for phases `018` and `019` |
| Risk | Parent docs flatten implemented and open work into one status | High | Keep `018` and `019` implemented while leaving phase `020` explicitly open |
| Risk | Child folders exist but parent docs stay inconsistent | High | Reconcile all six root markdown files in the same pass |
| Risk | Validation passes while wording still implies universal parity closure | Medium | Keep live-proof caveats explicit in parent and phase-020 docs |
<!-- /ANCHOR:risks -->

---

## 8. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: This pass must not introduce unsupported runtime performance claims.

### Security
- **NFR-S01**: The shipped runtime and doc changes must not weaken published contamination, save-path, or foreign-spec safety language.

### Reliability
- **NFR-R01**: Every implementation-status statement for phases `018` through `020` must be traceable to shipped code, tests, or retained-proof evidence and must remain conservative about live proof.

---

## 9. EDGE CASES

### Data Boundaries
- A child phase can document shipped runtime work without implying retained live proof is closed.
- Recursive validation is necessary for structural truth but does not replace retained live proof.
- The parent pack must preserve prior audit truth while still adding new forward-looking proof work.

### Error Scenarios
- The parent phase map could extend to `020` while one or more child docs still contain contradictory shipped/open status language.
- The roadmap could quietly slip back into all-planned or all-complete language if the parent docs are only partially reconciled.
- Live proof could still be missing even if all documentation validates cleanly.

---

## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Technical complexity | 4/5 | Runtime, tests, operator docs, and parent-pack reconciliation |
| Verification complexity | 4/5 | Requires focused Vitest proof, build, and recursive validation |
| Coordination complexity | 4/5 | Runtime, operator docs, and three child phases must stay aligned |
| Operational risk | 4/5 | Overclaiming live-proof closure would mislead future implementation work |

---

## 11. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Parent docs blur the difference between shipped runtime work and open proof work | H | M | Keep `018` and `019` implemented, and keep `020` explicitly open |
| R-002 | Child docs are created but parent roadmap still ends at `017` in some files | H | M | Update all six root markdown files together |
| R-003 | Validator passes while live-proof wording becomes too strong | M | M | Keep proof closure limited to retained artifacts |
| R-004 | New roadmap phases obscure the previous audit baseline | M | L | Preserve `001` through `017` as the reconciled history in the phase map |

---

## 12. USER STORIES

### US-001: See The Full Roadmap (Priority: P0)

**As a** maintainer, **I want** one parent pack that runs from phase `001` through `020`, **so that** I can see both the audited history and the current shipped/open follow-up work in one place.

**Acceptance Criteria**:
1. Given the parent pack, when reviewed, then phases `018`, `019`, and `020` appear in the phase map with truthful shipped/open status.

### US-002: Trust The Phase Status (Priority: P0)

**As a** maintainer, **I want** runtime and proof work to be labeled accurately, **so that** I do not mistake shipped automation work for retained live-proof closure.

**Acceptance Criteria**:
1. Given phases `018` and `019`, when opened, then they are clearly documented as implemented runtime follow-up.
2. Given phase `020`, when opened, then it is clearly documented as still in progress for retained live proof.

### US-003: Keep Proof Claims Honest (Priority: P1)

**As a** reviewer, **I want** live-proof language to remain conservative, **so that** validation-clean docs do not overstate multi-CLI parity.

**Acceptance Criteria**:
1. Given the parent pack, when reviewed, then live retained proof is still described as an open requirement for universal CLI claims.

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

- Should future parent-pack updates require a retained-artifact refresh before any phase that touches CLI parity can be marked complete?
- Should phase `020` eventually split retained live artifacts into one artifact per CLI and mode instead of one shared proof bundle?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research Synthesis**: `research.md`
- **Phase 016**: `016-multi-cli-parity/spec.md`
- **Phase 017**: `017-stateless-quality-gates/spec.md`
- **Phase 018**: `018-runtime-contract-and-indexability/spec.md`
- **Phase 019**: `019-source-capabilities-and-structured-preference/spec.md`
- **Phase 020**: `020-live-proof-and-parity-hardening/spec.md`
