---
title: "Feature Specification: Perfect Session Capturing [template:level_3/spec.md]"
description: "Root documentation remediation for spec 010 to strict Level 3 template compliance with current verification evidence and cross-CLI proof status."
trigger_phrases:
  - "perfect session capturing"
  - "spec 010"
  - "template compliance"
  - "cross cli proof"
  - "remediation evidence"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This pass remediates only the root markdown set for `010-perfect-session-capturing` to strict Level 3 template structure and current evidence truth. The technical behavior contract remains unchanged, while verification claims, command results, dates, and cross-CLI proof language are now aligned with the latest reruns from March 17, 2026.

**Key Decisions**: Keep JSON authority and save integrity gates unchanged, separate fixture-backed parity from live CLI proof in canonical docs.

**Critical Dependencies**: Current script/mcp test lanes and root spec validation/check-completion outputs.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Review |
| **Created** | 2026-03-08 |
| **Branch** | `022-hybrid-rag-fusion/010-perfect-session-capturing` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Root spec markdown drifted from active v2.2 templates: missing required sections/anchors, checklist priority-evidence formatting issues, missing `implementation-summary.md`, and stale or over-claimed verification statements. This caused root validation and completion checks to block even though major code lanes were healthy.

### Purpose

Restore root docs to exact Level 3 template compliance and publish only current, rerunnable evidence with explicit distinction between fixture-backed and live CLI proof.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite root `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` to Level 3 template structure.
- Create root `implementation-summary.md`.
- Correct reference integrity including `research/research-pipeline-improvements.md`.
- Refresh command/status/count/date claims to the March 17, 2026 remediation pass.
- Distinguish fixture-backed CLI parity from live CLI proof in canonical language.

### Out of Scope
- Child phase markdown remediation.
- Runtime contract changes for loader precedence, JSON authority, or `memory_save` `dryRun`/`force`.
- Reverting or editing other agents' non-root work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/spec.md` | Modify | Level 3 template-compliant root specification with current evidence truth |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/plan.md` | Modify | Template-compliant implementation plan with verified gates and dependencies |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/tasks.md` | Modify | Template-compliant task tracking and closure criteria |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/checklist.md` | Modify | Template-compliant verification checklist with valid priority/evidence context |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/decision-record.md` | Modify | Template-compliant ADR with rationale and rollback |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/implementation-summary.md` | Create | Post-implementation closure summary and verified results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Scope | Dependencies | Status |
|-------|--------|-------|--------------|--------|
| 001 | `001-quality-scorer-unification/` | Unify canonical quality scoring and threshold behavior | None | Complete |
| 002 | `002-contamination-detection/` | Strengthen contamination detection and audit trail coverage | 001 | Complete |
| 003 | `003-data-fidelity/` | Preserve normalized data fidelity and visible drop reporting | 002 | Complete |
| 004 | `004-type-consolidation/` | Consolidate canonical shared types across the pipeline | 003 | Draft |
| 005 | `005-confidence-calibration/` | Calibrate confidence signals and gating behavior | 004 | Review |
| 006 | `006-description-enrichment/` | Improve description fidelity and enrichment quality | 005 | Complete |
| 007 | `007-phase-classification/` | Stabilize phase classification and routing semantics | 006 | Complete |
| 008 | `008-signal-extraction/` | Tighten signal extraction behavior and evidence quality | 007 | Complete |
| 009 | `009-embedding-optimization/` | Optimize embedding workload and retrieval prep | 008 | Complete |
| 010 | `010-integration-testing/` | Verify end-to-end integration behavior | 009 | Draft |
| 011 | `011-session-source-validation/` | Validate native session-source capture behavior | 010 | In Progress |
| 012 | `012-template-compliance/` | Bring docs and templates back to validator truth | 011 | Complete |
| 013 | `013-auto-detection-fixes/` | Fix native-source auto-detection behavior | 012 | Complete |
| 014 | `014-spec-descriptions/` | Align phase descriptions and documentation narratives | 013 | Complete |
| 015 | `015-outsourced-agent-handback/` | Normalize handback expectations for delegated work | 014 | Complete |
| 016 | `016-multi-cli-parity/` | Record fixture-backed and live CLI parity evidence | 015 | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Quality scoring unified on 0.0-1.0 scale | validate.sh + test suite |
| 002 | 003 | Contamination detection produces score penalties | validate.sh + test suite |
| 003 | 004 | Data fidelity preserved through normalization | validate.sh + test suite |
| 004 | 005 | Shared types consolidated and exported | validate.sh + typecheck |
| 005 | 006 | Confidence signals calibrated with thresholds | validate.sh + test suite |
| 006 | 007 | Description enrichment pipeline functional | validate.sh + test suite |
| 007 | 008 | Phase classification routing stable | validate.sh + test suite |
| 008 | 009 | Signal extraction evidence quality verified | validate.sh + test suite |
| 009 | 010 | Embedding optimization complete | validate.sh + test suite |
| 010 | 011 | Integration tests passing | validate.sh + test suite |
| 011 | 012 | Session source validation complete | validate.sh + test suite |
| 012 | 013 | Template compliance verified | validate.sh --recursive |
| 013 | 014 | Auto-detection fixes applied | validate.sh + test suite |
| 014 | 015 | Spec descriptions aligned | validate.sh + test suite |
| 015 | 016 | Outsourced agent handback normalized | validate.sh + test suite |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root markdown files match Level 3 template headers/order/anchors | Root validator no longer reports missing required root template headers/anchors |
| REQ-002 | `implementation-summary.md` exists at root | Root validator no longer reports missing required file |
| REQ-003 | Checklist completed items include valid priority and evidence | `check-completion.sh` no longer blocks on untagged completed items |
| REQ-004 | Command counts/dates reflect current pass | Root docs reference March 17, 2026 rerun results and current counts |
| REQ-005 | Cross-CLI parity claims separate fixture proof from live proof | Root docs explicitly label both evidence types and blocked live CLI cases if any |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Broken research link prefix is corrected | Root docs use `research/research-pipeline-improvements.md` |
| REQ-007 | Root status language matches verified state | Root status/completion wording reflects validated root state and test evidence |
| REQ-008 | Root write scope remains isolated | Only the six assigned root markdown files are changed in this remediation task |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the root Level 3 file set is present, **Then** the validator finds no missing root markdown files.
- **SC-002**: **Given** the root spec pack is validated, **Then** anchor and phase-link errors no longer block recursive compliance.
- **SC-003**: **Given** completion checks parse the root checklist, **Then** all completed P0 and P1 items include valid priority and evidence context.
- **SC-004**: **Given** the targeted rerun commands are reviewed, **Then** the published counts match the March 17, 2026 evidence set.
- **SC-005**: **Given** live CLI proof is recorded, **Then** fixture-backed, live-proven, and blocked cases remain explicitly separated.
- **SC-006**: **Given** a reviewer audits the root docs, **Then** stale references like `test-integration.js` are no longer presented as current proof.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Current script/mcp test lanes remain stable during doc rewrite | Medium | Freeze claims to rerun outputs captured on 2026-03-17 |
| Dependency | Root validator/check-completion behavior | Medium | Keep exact Level 3 template structure and required anchor names |
| Risk | Over-claiming CLI parity from fixtures alone | High | Record fixture and live evidence separately with explicit blocked notes |
| Risk | Concurrent edits by other agents in child folders | Medium | Keep strict root-only write scope and avoid unrelated file reverts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Root validation and completion checks should execute without additional remediation loops caused by root format drift.

### Security
- **NFR-S01**: Documentation must not change runtime security behavior or weaken existing save-path integrity gates.

### Reliability
- **NFR-R01**: Root evidence statements must be directly rerunnable from documented commands.

---

## 8. EDGE CASES

### Data Boundaries
- Empty checklist evidence text: completed items must still include explicit `[P0/P1/P2]` and evidence markers.
- Mixed proof sources: fixture-backed and live CLI proofs must remain distinguishable.

### Error Scenarios
- Missing research link prefix: fixed to `research/research-pipeline-improvements.md`.
- Partial lane pass states: docs must report exactly what passed and what remains blocked.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 17/25 | Six root docs, strict template conformance, evidence refresh |
| Risk | 20/25 | High risk of false completion claims if counts/status are stale |
| Research | 12/20 | Cross-checking latest command outputs and claim integrity |
| Multi-Agent | 8/15 | Concurrent edits in sibling phase folders |
| Coordination | 12/15 | Root-only ownership with no cross-scope regression |
| **Total** | **69/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Root checklist formatting drifts again and blocks completion | H | M | Keep exact template headings and valid completed-item evidence tags |
| R-002 | Test count/date claims become stale | H | M | Use only March 17, 2026 rerun outputs in root docs |
| R-003 | Live CLI parity is over-claimed | H | M | Keep explicit fixture-proof vs live-proof sections and blocked rationale |

---

## 11. USER STORIES

### US-001: Root Validation Integrity (Priority: P0)

**As a** maintainer, **I want** root spec docs to match active Level 3 templates exactly, **so that** validation and completion tooling can trust document structure.

**Acceptance Criteria**:
1. Given root docs, When validator runs, Then root template/header/anchor/file checks pass.

---

### US-002: Evidence Truthfulness (Priority: P0)

**As a** maintainer, **I want** canonical root docs to include current rerunnable evidence only, **so that** closure claims are defensible.

**Acceptance Criteria**:
1. Given root verification sections, When commands are rerun, Then counts and statuses match documented outputs.

---

### US-003: Cross-CLI Proof Clarity (Priority: P1)

**As a** reviewer, **I want** fixture-backed and live CLI proof separated, **so that** parity claims are accurate and auditable.

**Acceptance Criteria**:
1. Given cross-CLI text, When reviewed, Then fixture proof and live proof are clearly labeled and blocked live cases are explicit.

---

## 12. OPEN QUESTIONS

- None. Root doc scope is complete for this remediation pass.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research Synthesis**: See `research/research-pipeline-improvements.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
