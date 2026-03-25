---
title: "Feature Specification: 008-hydra-db-based-features"
description: "Parent Level 3 coordination spec for the delivered Hydra memory roadmap in system-spec-kit."
trigger_phrases:
  - "hydra"
  - "memory roadmap"
  - "lineage"
  - "governance"
  - "shared memory"
importance_tier: "critical"
contextType: "decision"
---
# Feature Specification: 008-hydra-db-based-features

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This parent spec-pack now acts as the Level 3 coordination record for the delivered Hydra roadmap. It summarizes the six-phase packet, points readers to the authoritative child phase folders for detailed implementation history, and records the March 20 2026 follow-up hardening pass on top of the March 17 2026 broad verification baseline without implying broader activation than the live evidence supports.

**Key Decisions**: keep the root pack as a coordination layer instead of a second implementation log; document lineage and `asOf` as internal storage and integration surfaces rather than a standalone public MCP query tool; describe shared memory as opt-in live access rather than universally enabled rollout.

**Critical Dependencies**: the six child phase folders in this spec-pack, `decision-record.md`, the Hydra runtime modules in `mcp_server/`, the recorded 2026-03-17 verification totals, and the 2026-03-20 targeted regression rerun for governed retrieval, shared-space admin auth, and graph ranking.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete - pending external sign-off |
| **Created** | 2026-03-13 |
| **Updated** | 2026-03-20 |
| **Branch** | `022-hybrid-rag-fusion` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../007-code-audit-per-feature-catalog/spec.md |
| **Successor** | ../009-perfect-session-capturing/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root Hydra spec-pack had drifted away from the active `system-spec-kit` v2.2 Level 3 templates and had started duplicating absorbed `017-markovian-architectures` content. That made the parent pack harder to validate, introduced dead references, and blurred the line between the coordination record at the root and the detailed phase history in child folders.

### Purpose
Keep the root Hydra pack truthful, template-aligned, and easy to audit while preserving the shipped six-phase Hydra substance and pointing detailed readers to the phase folders and runtime surfaces that now serve as the authoritative implementation record.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parent-pack documentation for the delivered Hydra roadmap across six child phases.
- Phase-pack normalization for `001-` through `006-` so child folders match the active Level 3+ templates.
- Targeted runtime truth-sync fixes discovered during closure review.
- Live five-CLI proof capture plus CLI-proof wording alignment for operator docs and regression tests.
- Root-level alignment to the active `system-spec-kit` v2.2 Level 3 templates.
- Recorded March 17 2026 verification totals and root-pack evidence wording.
- Precise wording for internal lineage and `asOf` behavior plus shared-memory rollout defaults.

### Out of Scope
- Recreating or preserving absorbed `017-markovian-architectures` merged sections at the root.
- Adding new Hydra runtime capabilities beyond the closure hardening and verification pass.
- Claiming a standalone public lineage or `asOf` MCP query tool.
- Re-stating every low-level implementation detail already documented in the child phase folders.

### Phase Documentation Map

<!-- ANCHOR:phase-map -->
| Phase | Folder | Scope | Status |
|-------|--------|-------|--------|
| 1 | `001-baseline-and-safety-rails/` | Baseline correctness, rollout defaults, checkpoints, and runtime safety rails | Complete - pending sign-off |
| 2 | `002-versioned-memory-state/` | Append-first lineage, active projection, and temporal resolution | In Progress |
| 3 | `003-unified-graph-retrieval/` | Deterministic graph-aware retrieval fusion and regression coverage | In Progress |
| 4 | `004-adaptive-retrieval-loops/` | Bounded adaptive ranking and shadow-mode learning | Complete |
| 5 | `005-hierarchical-scope-governance/` | Scope isolation, governed ingest, retention, deletion, and auditability | In Progress |
| 6 | `006-shared-memory-rollout/` | Shared spaces, deny-by-default membership, conflict handling, and staged rollout | In Progress |
<!-- /ANCHOR:phase-map -->

> **Note:** "Complete" above means *code and documentation delivered*, not necessarily *active in production*. "Complete - pending sign-off" and "In Progress" reflect the live child checklist state, including pending maintainer or external release steps. Shadow scoring (Phase 4) is disabled, `asOf` queries (Phase 2) are internal-only, and the phased rollout was a development methodology. See **§12 Current Status — Reality Check** for details.

### Representative Runtime Surfaces

| File Path | Layer | Description |
|-----------|-------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Rollout control | Default roadmap phase and capability resolution |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts` | Storage | Internal lineage state, active projection, and `asOf` resolution |
| `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | Governance | Scope predicates, governed ingest, and retention policy helpers |
| `.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts` | Collaboration | Shared-space policy and conflict handling |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts` | Handler | Shared-memory status, enablement, and CRUD surfaces |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts` | Verification | Regression guard for Hydra root-pack documentation expectations |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root pack follows the active Level 3 section structure | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` match current root template sections and anchors |
| REQ-002 | Root pack stops duplicating absorbed `017` content | No merged `017-markovian-architectures` sections remain in the edited root files |
| REQ-003 | Root claims match runtime-supported behavior | Root docs describe lineage and `asOf` as internal storage or integration behavior and describe shared memory as opt-in live access |
| REQ-004 | Root references resolve cleanly | No dead references to removed `017` files or stray mentions of a missing standalone root research document remain in the edited root files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | March 17 2026 recorded evidence totals are consistent | Root docs use `283` files, `7790` tests, `11` skipped, and `28` todo when citing the latest recorded totals |
| REQ-006 | Six Hydra phases stay visible at the root | Parent docs preserve phase-level traceability without copying full phase-pack content into the root files |
| REQ-007 | Root validation is rerun after normalization | Root pack validation is executed and its outcome is reported with any remaining out-of-scope issues |
| REQ-008 | Closure docs and tests guard against drift returning | The truth-sync regression test and operator docs reflect the same dated evidence boundary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The root pack reads as one coherent Level 3 coordination record instead of a merged archive.
- **SC-002**: The edited root files contain no dead `017-*` references or stray mentions of a missing standalone root research document.
- **SC-003**: The root pack keeps the six Hydra phases easy to trace through child-folder links and parent summaries.
- **SC-004**: Root wording around roadmap defaults, lineage, `asOf`, and shared-memory exposure is narrower and runtime-supported.
- **SC-005**: The most recent recorded verification totals are consistent across the edited root files.
- **SC-006**: Parent docs, phase docs, runtime tests, and operator docs tell one consistent closure story.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `decision-record.md` | Root validation may still report template drift outside the authorized edit set | Keep parent docs compatible with it and report remaining validation issues explicitly |
| Dependency | Child phase folders `001-` through `006-` | Root summaries lose credibility if phase folders diverge later | Treat child folders as the detailed source of truth and keep the root pack summary-oriented |
| Dependency | Recorded 2026-03-17 evidence totals | Evidence wording becomes stale if later totals change | Date-stamp totals clearly and avoid implying a fresh full rerun in this doc-only normalization pass |
| Risk | Over-documenting the root pack again | Parent docs become hard to validate and drift from templates | Keep implementation detail in child folders and runtime file references |
| Risk | Overstating public runtime exposure | Auditors may infer unsupported public APIs | Document lineage and `asOf` as internal storage or integration behavior only |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The root pack should be fast to scan, with only one summary layer before child-phase detail.

### Security
- **NFR-S01**: Root documentation must not imply broader public access than the runtime exposes.

### Reliability
- **NFR-R01**: Phase links and runtime file references in the edited root files must resolve cleanly.

### Maintainability
- **NFR-M01**: The root pack should remain aligned with active Level 3 template sections so future validation stays predictable.

---

## 8. EDGE CASES

### Data Boundaries
- A reader wants a full implementation history for one Hydra phase and should land in the matching child folder instead of the root pack.
- A reader sees recorded March 17 2026 totals and mistakes them for a rerun from this doc-only pass.

### Error Scenarios
- A future merge reintroduces absorbed `017` content or dead references into the root pack.
- A later runtime change alters rollout defaults and the root pack is not refreshed.

### Behavioral Cases
- Shared-memory rollout is shipped, but a workspace still reports shared memory disabled until explicitly enabled.
- Lineage and `asOf` exist in storage and integration paths, but there is still no standalone public lineage query tool.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Parent coordination across six child phases and multiple root artifacts |
| Risk | 20/25 | Public-vs-internal API wording and rollout-default accuracy matter |
| Research | 14/20 | Root pack depends on prior Hydra research and recorded evidence |
| Multi-Agent | 10/15 | Shared-memory and governance concepts affect multiple readers and operators |
| Coordination | 14/15 | Root docs must stay in sync with child folders, runtime surfaces, and validation |
| **Total** | **79/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Root docs drift from active templates again | Medium | Medium | Keep root sections template-aligned and summary-oriented |
| R-002 | A future edit reintroduces dead absorbed references | Medium | Medium | Validate root references after documentation changes |
| R-003 | Runtime defaults change without a parent-pack sync | High | Medium | Treat capability flags and the Hydra consistency test as truth anchors |
| R-004 | Readers mistake root summaries for full phase detail | Medium | Low | Keep child-folder references prominent in the root pack |

---

## 11. USER STORIES

### US-001: Parent Pack Auditability (Priority: P0)

**As an** auditor, **I want** the root Hydra pack to follow the active Level 3 structure, **so that** I can validate it quickly without parsing merged historical fragments.

**Acceptance Criteria**:
1. Given the root pack, when I review the edited root files, then I see the expected Level 3 sections and no absorbed `017` blocks.
2. Given a validation run, when it reports remaining issues, then those issues are limited to out-of-scope files or known external constraints.

---

### US-002: Accurate Runtime Claims (Priority: P0)

**As a** maintainer, **I want** root docs to describe only the Hydra behavior the runtime actually supports, **so that** public and internal surfaces are not confused.

**Acceptance Criteria**:
1. Given lineage and `asOf` documentation, when I read the root pack, then those capabilities are described as internal storage or integration behavior rather than a standalone public MCP tool.
2. Given shared-memory rollout documentation, when I read the root pack, then I see that live access remains opt-in.

---

### US-003: Phase Traceability (Priority: P1)

**As a** contributor, **I want** the root pack to point me to the right child phase folder, **so that** I can find detailed implementation history without digging through merged content.

**Acceptance Criteria**:
1. Given a question about one Hydra phase, when I read the root pack, then I can identify the matching child folder immediately.
2. Given the six-phase roadmap, when I inspect root scope and plan content, then each phase remains represented at summary level.

---

### US-004: Evidence Currency (Priority: P1)

**As an** operator, **I want** the root pack to use the latest recorded verification totals, **so that** audit notes and handoff summaries do not lag behind known evidence.

**Acceptance Criteria**:
1. Given the root pack, when I review verification references, then March 17 2026 totals appear consistently as `283` files, `7790` tests, `11` skipped, and `28` todo.
2. Given this closure pass, when I read the evidence wording, then the documented claims match the rerun command outputs and live CLI matrix results.

---

### Acceptance Scenario 1: Parent Pack Validation

**Given** the Hydra root pack, **when** `validate.sh` runs, **then** required sections, anchors, and references resolve cleanly.

### Acceptance Scenario 2: Phase Pack Validation

**Given** any Hydra phase folder, **when** `validate.sh` runs with links enabled, **then** required Level 3+ structure is restored.

### Acceptance Scenario 3: Runtime Correction Coverage

**Given** governed retrieval, owner-only shared-space admin flows, graph ranking, and retention sweep flows, **when** targeted regressions run, **then** the reviewed defects stay fixed.

### Acceptance Scenario 4: Evidence Consistency

**Given** the closure docs, **when** March 17 2026 totals are cited, **then** the same counts appear in the authoritative Hydra closure surfaces.

### Acceptance Scenario 5: Traceability

**Given** a question about one Hydra phase, **when** a reader starts at the root pack, **then** the relevant child phase folder is easy to find.

### Acceptance Scenario 6: CLI-Proof Validation

**Given** operator documentation and closure evidence, **when** a reader looks for multi-CLI support language, **then** automated coverage and live five-CLI prompt proof are both explicitly documented.

---

**Current status reality check (2026-03-21):** Prevent readers from mistaking documented *design intent* for *production reality*. The Hydra roadmap phases are complete as documentation and code artifacts, but several advertised capabilities are dormant or internal-only.

| Capability | Documented Claim | Actual Status |
|------------|-----------------|---------------|
| **Shadow scoring (Phase 4)** | Adaptive ranking captures signals and runs in shadow mode before promotion | **Disabled.** Shadow scoring code exists but is not active in production. The capability-flag default keeps it off. No promotion to live scoring has occurred. |
| **`asOf` temporal queries (Phase 2)** | Append-first lineage with `asOf` resolution for point-in-time state | **Internal-only.** `asOf` resolution is used within `lineage-state.ts` for internal storage operations. It is **not** exposed through the MCP API as a user-facing query tool. |
| **Phased rollout (Phases 1-6)** | Six-phase rollout from baseline through shared-memory | **Development methodology, not deployment strategy.** The phases describe the order in which code was designed, written, and documented. They do not represent a staged production deployment with progressive feature activation. |
| **Shared-memory rollout (Phase 6)** | Deny-by-default membership, conflict handling, staged rollout | **Opt-in and inert by default.** Shared spaces must be explicitly enabled per workspace. No workspace has shared memory active unless a human administrator turns it on. |

These caveats do not invalidate the design work; they clarify the gap between *shipped code* and *active production behavior*.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None blocking for this root-pack normalization pass.
- Human Product Owner and Security or Compliance sign-off remain external governance steps, not technical blockers in the edited root files.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Decision Records**: See `decision-record.md`
- **Phase 1**: `001-baseline-and-safety-rails/spec.md`
- **Phase 2**: `002-versioned-memory-state/spec.md`
- **Phase 3**: `003-unified-graph-retrieval/spec.md`
- **Phase 4**: `004-adaptive-retrieval-loops/spec.md`
- **Phase 5**: `005-hierarchical-scope-governance/spec.md`
- **Phase 6**: `006-shared-memory-rollout/spec.md`

---

## Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../007-code-audit-per-feature-catalog/spec.md |
| **Next Phase** | ../009-perfect-session-capturing/spec.md |
