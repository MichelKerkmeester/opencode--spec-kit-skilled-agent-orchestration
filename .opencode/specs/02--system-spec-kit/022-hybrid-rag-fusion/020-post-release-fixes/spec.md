---
title: "Feature Specification: 020 Pre-Release Remediation [template:level_3/spec.md]"
description: "Live remediation contract for closing the canonical 60-iteration review findings for 020-post-release-fixes."
trigger_phrases:
  - "020 pre-release remediation"
  - "post-review remediation"
  - "canonical review remediation"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: 020 Pre-Release Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet is now the live remediation contract for the canonical review recorded under [`review/review-report.md`](./review/review-report.md).

The current authoritative review baseline is **March 27, 2026**. That baseline says the release is still `FAIL`, with:

- `14` active `P1` findings
- `16` active `P2` findings
- `255` live feature-catalog entries across `21` categories
- a feature-state distribution of `191 sound_and_supported / 48 sound_but_under-tested / 7 catalog_mismatch / 9 code_unsound`

This documentation pass does not fix those findings yet. Its job is narrower and explicit: rewrite the packet's operational docs so every active finding from the canonical review has a concrete remediation home, a workstream owner, and a verification path ready for implementation once approval is given.

**Key Decisions**: use `review/review-report.md` as the only authoritative review source inside this packet; treat the top-level `review-report.md` in this folder as historical evidence only; keep the written verdict `FAIL` until fresh reruns justify any change; group remediation into four workstreams: runtime/code integrity, packet/spec truth-sync, public docs and wrapper alignment, and feature verification/tooling contract repair.

**Critical Dependencies**: [`review/review-report.md`](./review/review-report.md), [`tasks.md`](./tasks.md), [`checklist.md`](./checklist.md), the live feature catalog under `.opencode/skill/system-spec-kit/feature_catalog/`, and the runtime plus test surfaces cited by the canonical review.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-03-26 |
| **Updated For Review Baseline** | 2026-03-27 |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Predecessor** | `../019-rewrite-repo-readme/spec.md` |
| **Historical Predecessors** | `012-pre-release-fixes-alignment-preparation`, `013-v7-remediation`, `014-v8-p1-p2-remediation` |
| **Canonical Review Source** | `./review/review-report.md` |
| **Historical Report** | `./review-report.md` (historical evidence only) |
| **Packet Role** | Post-review remediation program and execution contract for the 012 packet |
| **Source-of-Truth Date** | 2026-03-27 |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The canonical review now says the packet is blocked by four distinct remediation lanes:

- packet/spec truth drift inside the `012` packet and its parent lineage
- live runtime/code defects across memory save, scope handling, cache behavior, session trust, and error signaling
- stale public docs and wrapper packets that no longer match the live filesystem
- feature-catalog verification debt, including one tooling `P1`, seven mismatched feature entries, and forty-eight under-tested feature entries

The current `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` still describe an earlier historical-consolidation job. They do not yet function as an implementation-ready response to the canonical review findings.

### Purpose

Turn this packet into an implementation-ready remediation program that:

- maps every active review finding to a concrete backlog item
- organizes work into the four review-driven remediation workstreams
- preserves the canonical review boundary inside `review/`
- keeps the release verdict `FAIL` until fresh verification replaces it
- leaves all implementation items pending until explicit go-ahead is given
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite this packet's [`spec.md`](./spec.md), [`plan.md`](./plan.md), [`tasks.md`](./tasks.md), and [`checklist.md`](./checklist.md) so they align to the canonical review.
- Use the active finding registry in [`review/review-report.md`](./review/review-report.md) as the authoritative remediation source.
- Group remediation into the four workstreams defined by the review:
  - runtime/code integrity
  - packet/spec docs truth-sync
  - public docs and wrapper alignment
  - feature verification and tooling contract repair
- Preserve the normalized feature-state denominator of `255` live features across `21` categories.
- Keep all implementation tasks explicitly pending until approval is given.

### Out of Scope

- Fixing runtime code, wrapper docs, feature-catalog entries, or validator failures in this documentation pass
- Rewriting the canonical review findings themselves
- Changing the release verdict from `FAIL`
- Treating the historical top-level `review-report.md` as the authoritative review surface
- Expanding scope beyond the findings and verification needs already captured by the canonical review

### Files to Change In This Step

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Rewrite | Redefine the packet as a post-review remediation contract |
| `plan.md` | Rewrite | Define the workstream order, phases, and verification strategy |
| `tasks.md` | Rewrite | Provide a concrete backlog that covers every active finding |
| `checklist.md` | Rewrite | Provide implementation-time verification gates tied to the review findings |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet uses the canonical `review/` report as its sole authoritative review source | `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all point to `./review/review-report.md` for active finding truth |
| REQ-002 | Every active finding from `HRF-DR-001` through `HRF-DR-030` is mapped to a remediation path | Each finding appears in `tasks.md`, `checklist.md`, or an explicit grouped verification lane with finding references |
| REQ-003 | The packet is organized around the four review workstreams | The spec and plan explicitly separate WS-1 through WS-4 instead of mixing all findings into one backlog bucket |
| REQ-004 | The packet preserves the current verdict honestly | No rewritten doc claims release readiness or post-review closure before fresh reruns |
| REQ-005 | The feature-state denominator is preserved accurately | The docs use `255` live features, `21` categories, and the normalized `191/48/7/9` feature-state split |
| REQ-006 | The remediation backlog stays implementation-ready but not prematurely completed | All remediation tasks and checklist items remain unchecked after this doc pass |
| REQ-007 | Verification is planned from fresh evidence, not historical prose | The plan and checklist include baseline replay, targeted reruns, and final gate reruns before any verdict change |
| REQ-008 | The packet-local review boundary is explicit | The top-level `review-report.md` is marked historical and `review/` remains canonical everywhere inside the packet |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Runtime/code findings are grouped by subsystem ownership | Scope/save, cache/index, session/governance, error-contract, and logging/coverage issues are grouped into implementation lanes |
| REQ-010 | Documentation and wrapper drift findings are grouped by release surface | Packet truth-sync, public docs, wrapper docs, and playbook/catalog verification debt are not conflated |
| REQ-011 | Feature-verification debt is treated as a first-class remediation lane | `HRF-DR-027` through `HRF-DR-030` are represented as concrete backlog and checklist work rather than vague follow-up notes |
| REQ-012 | The packet docs are synchronized enough to start implementation immediately after approval | A maintainer can read only these four docs and know what to implement first, what to verify, and what must stay pending until evidence exists |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** a maintainer opens only this packet, **Then** they can see all active findings, the owning workstream, and the expected verification path without re-planning the review.
- **SC-002**: **Given** the canonical review remains `FAIL`, **When** the maintainer reads this packet, **Then** the packet does not imply that remediation already happened.
- **SC-003**: **Given** a reviewer checks a specific finding ID, **When** they open [`tasks.md`](./tasks.md) or [`checklist.md`](./checklist.md), **Then** that finding has a concrete execution or verification home.
- **SC-004**: **Given** the live feature catalog is part of the release surface, **When** the maintainer reads this packet, **Then** the `191/48/7/9` feature-state denominator is visible and treated as actionable planning context.
- **SC-005**: **Given** implementation has not started yet, **When** the maintainer reads this packet, **Then** all remediation tasks remain pending and gated behind explicit go-ahead.
- **SC-006**: **Given** fresh reruns are required to change the verdict, **When** the maintainer reads the plan and checklist, **Then** the verification order and release-control sync steps are explicit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `review/review-report.md` stays canonical | The remediation backlog could drift from the actual review findings | Anchor every workstream, task, and checklist row to the canonical findings registry; keep the other packet-local review artifacts as supporting context only |
| Dependency | Runtime and test surfaces remain the truth for code findings | Implementation plans could become doc-only guesses | Keep runtime findings tied to concrete source files and rerun targets |
| Dependency | Feature-catalog and wrapper trees remain live release surfaces | Counts and verification debt could drift again | Carry the `255 / 21 / 191 / 48 / 7 / 9` baseline directly in this packet |
| Risk | The packet could still be mistaken for the earlier consolidation pass | Owners might follow stale historical tasks instead of the canonical review | Rewrite the packet around post-review workstreams and historical-vs-canonical boundaries |
| Risk | Grouping findings too broadly could hide verification needs | Important P2 coverage or traceability work may be skipped | Keep finding references on grouped tasks and grouped checklist rows |
| Risk | Premature completion language could leak back into the packet | The release-control surface would overstate progress | Keep all remediation items unchecked until explicit implementation work and reruns occur |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The packet must remain readable as an execution contract, not a raw paste of the full review report.

### Security

- **NFR-S01**: The packet must not introduce false closure claims or synthetic evidence.
- **NFR-S02**: Security-relevant runtime findings must remain visible as release-significant work until explicitly closed by evidence.

### Reliability

- **NFR-R01**: All packet-local references must resolve from `020-post-release-fixes/`.
- **NFR-R02**: The canonical review boundary must remain stable: `review/review-report.md` is authoritative and the top-level `review-report.md` is historical only.
- **NFR-R03**: If report subsections drift, the packet must follow the normalized review state already reflected in the canonical `review/` artifacts.

## 8. EDGE CASES

### Data Boundaries

- A finding may require both a code fix and a verification fix; the packet should map both without inventing duplicate finding IDs.
- A feature can be `sound_but_under-tested` without being `code_unsound`; implementation planning must not collapse those buckets.
- Wrapper or public-doc findings can stay open even when runtime code is green; the packet must not treat those lanes as automatically coupled.

### Error Scenarios

- If a remediation attempt does not produce fresh rerun evidence, the packet must keep the current `FAIL` verdict.
- If a feature-catalog entry cannot be proven by code or tests yet, the packet must route it to explicit test work, explicit static proof, or explicit approved deferral.
- If new implementation work discovers a contradiction with the canonical review, the packet must be updated from fresh evidence instead of silently overriding the review.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Four remediation workstreams, 30 active findings, and cross-surface verification planning |
| Risk | 21/25 | Release-control, security, and correctness findings are still open |
| Research | 14/20 | The canonical review already exists, but it must be translated carefully into execution-ready docs |
| Multi-Agent | 6/15 | The packet supports parallel implementation later, but this step is still a single coordinated doc rewrite |
| Coordination | 14/15 | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `review/` must stay aligned |
| **Total** | **77/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The packet stays tied to the historical consolidation story instead of the canonical review | H | M | Rewrite the packet around workstreams and the active finding registry |
| R-002 | A grouped remediation task hides one or more findings | H | M | Keep explicit finding references in the backlog and checklist |
| R-003 | Implementation starts without a clean verification plan | H | M | Keep baselines, targeted reruns, and release-sync tasks explicit before execution |

## 11. USER STORIES

### US-001: Remediation Owner (Priority: P0)

**As a** remediation owner, **I want** one packet that translates the canonical review into an execution-ready backlog, **so that** I can start implementation without re-planning the findings.

**Acceptance Criteria**:
1. **Given** I open this packet after approval, **When** I scan the docs, **Then** I can identify the next workstream and the owning tasks immediately.

### US-002: Reviewer (Priority: P0)

**As a** reviewer, **I want** every active finding mapped to a task and verification item, **so that** nothing from the canonical report is silently dropped.

**Acceptance Criteria**:
1. **Given** I trace a finding ID from the review report, **When** I search this packet, **Then** I find the task and checklist coverage for it.

### US-003: Release-Control Maintainer (Priority: P1)

**As a** release-control maintainer, **I want** the packet to stay honest about the current `FAIL` verdict, **so that** implementation planning does not look like closure.

**Acceptance Criteria**:
1. **Given** I read this spec and plan, **When** I reach the verification sections, **Then** the packet makes it clear that only fresh reruns can change the verdict.

## 12. OPEN QUESTIONS

- Whether implementation should begin with WS-2 packet/spec truth-sync or with the highest-risk runtime/code fixes first will be confirmed at execution start, but both paths are already represented in the backlog.
- `implementation-summary.md` is still outside this documentation-only pass and should be updated during or after the actual remediation wave.
- If any under-tested feature entries are intentionally deferred, the approval criteria for those deferrals should be captured when implementation begins.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- [`review/review-report.md`](./review/review-report.md): canonical finding registry and verification baseline
- [`tasks.md`](./tasks.md): implementation backlog generated from the canonical findings
- [`checklist.md`](./checklist.md): verification gates for the remediation wave
