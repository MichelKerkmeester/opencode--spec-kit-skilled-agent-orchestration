---
title: "Feature Specification: 040 Auto Deep Research / Review Improvement [template:level_1/spec.md]"
description: "Improve sk-deep-research and sk-deep-review contracts: lineage, lifecycle, reducer, naming, runtime parity — driven by a 90-iteration autonomous research packet."
trigger_phrases:
  - "deep research improvement"
  - "deep review improvement"
  - "040 spec"
  - "lineage reducer parity"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: 040 Auto Deep Research / Review Improvement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-03 |
| **Branch** | `040-sk-auto-deep-research-review-improvement` |

### PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | [`001-sk-deep-research-improvements/`](./001-sk-deep-research-improvements/) | Complete | Canonical deep-research contract: lineage, naming, lifecycle, reducer, runtime parity, executable helpers. [Implementation summary](./001-sk-deep-research-improvements/implementation-summary.md). |
| 2 | [`002-sk-deep-review-improvements/`](./002-sk-deep-review-improvements/) | Complete | Canonical deep-review contract: naming, lifecycle, reducer, release-readiness, runtime parity. [Implementation summary](./002-sk-deep-review-improvements/implementation-summary.md). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-deep-research` and `sk-deep-review` had sound packet-first loop architectures but implicit contracts: lineage and lifecycle branches were undocumented, reducer ownership was ambiguous, artifact naming drifted between research and review modes, and runtime mirrors across Codex/OpenCode/Claude/Gemini could diverge without detection.

### Purpose
Make both skills operate under explicit, testable packet contracts — canonical naming, lifecycle branches, reducer semantics, release-readiness states, and runtime parity — all backed by executable Vitest guards.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Canonical lineage schema and lifecycle branch execution (resume, restart, fork, completed-continue)
- Naming contracts and dual-read/single-write migration via scratch paths
- Deterministic reducer and findings registry for both research and review modes
- Runtime capability matrix and parity gates across Codex/OpenCode/Claude/Gemini
- Mutable surface audit, ownership boundaries, provenance hardening
- Release-readiness criteria (review mode)
- Executable Vitest contract guards for both skills

### Out of Scope
- Core loop redesign — the packet-first model is kept
- External framework imports — borrow patterns only, not frameworks
- New CLI runtimes beyond Codex/OpenCode/Claude/Gemini
- Changes to the spec_kit command infrastructure itself

### Files to Change
See phase-level specs for complete file lists:
- [Phase 1 scope](./001-sk-deep-research-improvements/spec.md)
- [Phase 2 scope](./002-sk-deep-review-improvements/spec.md)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Freeze canonical artifact naming for both skills | All docs, assets, workflow YAML, and runtime mirrors use `deep-research-*` or `deep-review-*` names; legacy names remain only in scratch migration paths |
| REQ-002 | Define lineage schema and lifecycle branches | `sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun` documented and enforced across all active surfaces |
| REQ-003 | Establish deterministic reducer contracts | Reducer inputs, outputs, metrics, and idempotency guarantees are explicit in config assets and backed by Vitest coverage |
| REQ-004 | Synchronize all four runtime mirrors | OpenCode, Claude, Gemini, and Codex agent definitions agree on packet paths, lifecycle vocabulary, and reducer boundaries |
| REQ-005 | Add executable verification coverage | Vitest parity, reducer, and schema tests pass for both skills |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Document release-readiness states for review mode | `in-progress`, `converged`, `release-blocking` defined in `review_mode_contract.yaml` and propagated to workflow/mirror surfaces |
| REQ-007 | Close both phase packets with strict validation | Phase folders pass `validate.sh --strict` with all tasks marked complete |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four Vitest contract test files pass (`deep-research-contract-parity`, `deep-research-reducer`, `deep-review-contract-parity`, `deep-review-reducer-schema`).
- **SC-002**: Both phase folders pass `validate.sh --strict`.
- **SC-003**: Stale-name sweep confirms legacy names only in scratch migration paths.
- **SC-004**: All tasks marked complete in both phase `tasks.md` files.

### Acceptance Scenarios
1. **Given** a maintainer opens the deep-research skill package, **when** they trace packet state from the config asset through the workflow YAML and runtime mirrors, **then** they see one canonical `deep-research-*` contract with explicit lifecycle and reducer semantics.
2. **Given** a maintainer opens the deep-review skill package, **when** they trace packet state from the config asset through the workflow YAML and runtime mirrors, **then** they see one canonical `deep-review-*` contract with explicit lifecycle, reducer, and release-readiness semantics.
3. **Given** a developer runs the four Vitest contract test files, **when** any doc, asset, or runtime mirror drifts from the canonical contract, **then** the tests fail with a specific assertion identifying the drifted surface.
4. **Given** an operator resumes a legacy review packet with `deep-research-*` artifact names, **when** the workflow YAML processes the packet, **then** it reads legacy names from scratch paths and writes only canonical `deep-review-*` names.

### Source Research
- [`research/research.md`](./research/research.md) — 90-iteration unified research report (0.92 confidence)
- [`research/recommendations-sk-deep-research.md`](./research/recommendations-sk-deep-research.md) — Phase 1 skill-specific recommendations
- [`research/recommendations-sk-deep-review.md`](./research/recommendations-sk-deep-review.md) — Phase 2 skill-specific recommendations
- [`external/`](./external/) — Source repos analyzed: `Auto-Deep-Research-main`, `AutoAgent-main`, `autoresearch-master`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 90-iteration research packet | Phase design depends on research findings and recommendations | Research completed before implementation began (0.92 confidence) |
| Dependency | Runtime mirrors across 4 runtimes | Parity cannot be proven if a mirror is skipped | Validate all four mirrors and keep parity under Vitest coverage |
| Risk | Declarative contracts instead of single executable module | Some guarantees are cross-surface rather than single-file | Back contracts with focused parity and reducer/schema tests |
| Risk | Phase 2 depends on Phase 1 outputs | Lineage schema and reducer interface must land before review adoption | Sequential execution: Phase 1 completes first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — all questions resolved during the research phase and implementation.
<!-- /ANCHOR:questions -->

---
