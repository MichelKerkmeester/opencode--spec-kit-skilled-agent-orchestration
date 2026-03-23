---
title: "Feature Specification: Multi-CLI Parity Hardening"
description: "Re-open phase 016 to prove the shipped multi-CLI parity behavior with direct regression coverage and bring the phase docs back into Level 2 compliance."
trigger_phrases:
  - "multi-cli parity"
  - "copilot view alias"
  - "content filter parity"
  - "tool provenance hardening"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Multi-CLI Parity Hardening

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-16 |
| **Completed** | 2026-03-18 |
| **Branch** | `003-multi-cli-parity` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 3 of 5 (000-dynamic-capture-deprecation branch) |
| **Predecessor** | 002-outsourced-agent-handback |
| **Successor** | 004-source-capabilities-and-structured-preference |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-003 |
<!-- /ANCHOR:metadata -->

---

### Phase Context

This is **Phase 003** of the dynamic-capture-deprecation branch.

**Scope Boundary**: Phase 016 had already landed its runtime behavior in the live code, but the phase folder still claimed completion without direct parity-specific proof.
**Dependencies**: 002-outsourced-agent-handback
**Deliverables**: Re-verified existing parity seams in phase-classifier.ts, content-filter.ts, and input-normalizer.ts; added direct regression coverage; retained phase-local parity evidence that Phase 017 extends for stateless quality-gate and structured-input behavior.
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 016 had already landed its runtime behavior in the live code, but the phase folder still claimed completion without direct parity-specific proof. The missing coverage left three real questions open: whether Copilot `view` aliases drive research scoring, whether Codex/Copilot/XML noise markers are filtered through the shared `NOISE_PATTERNS` path, and whether CLI-derived `FILES` keep the `_provenance: 'tool'` metadata that earlier scoring phases now consume.

The phase documentation was also out of template compliance. `tasks.md` used non-standard phase headers, `implementation-summary.md` was missing required anchored sections, and the checklist marked completion without evidence tags, so `validate.sh` failed even though the runtime behavior was already present.

### Purpose

Prove the shipped multi-CLI parity behavior with direct regression tests and reconcile the phase-016 spec folder to a validator-clean Level 2 completion state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Re-verify the existing parity seams in `phase-classifier.ts`, `content-filter.ts`, and `input-normalizer.ts` without widening their runtime contract.
- Add direct regression coverage for Copilot `view` alias scoring, built-in multi-CLI noise filtering, CLI-derived file provenance, and `view` observation titles.
- Rewrite phase-016 `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the active Level 2 structure with evidence-backed completion.

### Out of Scope

- Adding new CLI backends or changing the five-backend capture matrix.
- Refactoring adjacent phases `013` or `015`, which are currently in flight elsewhere.
- Changing the native capture contract beyond the parity proofs already shipped in code.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts` | Modify | Add direct proof that Copilot `view` aliases to canonical `read` scoring. |
| `.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts` | Create | Lock Copilot lifecycle, Codex reasoning, and XML wrapper markers to the shared noise filter. |
| `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` | Modify | Prove CLI-derived `FILES` keep `_provenance: 'tool'` and Copilot `view` titles render as `Read ...`. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/003-multi-cli-parity/*.md` | Modify | Bring the archived branch phase artifacts back into Level 2 template compliance with current evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Copilot `view` aliases must drive canonical research scoring. | `phase-classification.vitest.ts` proves `View` classifies as `Research` through the public classifier APIs. |
| REQ-002 | Built-in multi-CLI noise markers must be filtered through the shared noise path. | `content-filter-parity.vitest.ts` proves `tool.execution_start`, `tool.execution_complete`, `reasoning`, `<reasoning>...</reasoning>`, and empty XML wrapper tags all register as noise through `isNoiseContent()` / `NOISE_PATTERNS`. |
| REQ-003 | CLI-derived file entries must retain tool provenance and `view` titles. | `runtime-memory-inputs.vitest.ts` proves `transformOpencodeCapture()` emits `Read loaders/data-loader.ts` for `view` and applies `_provenance: 'tool'` to CLI-derived `FILES`. |
| REQ-004 | Phase-016 spec artifacts must validate cleanly as Level 2 docs. | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` passes this phase folder with zero errors and zero warnings. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Existing regression safety nets must keep passing after the parity-hardening proof work. | Focused Vitest suite, `description-enrichment.vitest.ts`, extractor-loader baseline, `typecheck`, and `build` all pass. |
| REQ-006 | Completion evidence must be explicit and current. | `checklist.md` records 2026-03-17 evidence tags for each completed item and `implementation-summary.md` reports the same verification results. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** a low-signal exchange that only uses Copilot `View`, **Then** the classifier resolves the phase as `Research` instead of `Discussion`.
- **SC-002**: **Given** Copilot lifecycle markers, Codex reasoning markers, and empty XML wrappers, **Then** the shared content filter treats them as built-in noise without a parallel parity filter.
- **SC-003**: **Given** a CLI capture with `view` and `edit` tool calls, **Then** `transformOpencodeCapture()` renders `Read ...` titles and stores CLI-derived `FILES` with `_provenance: 'tool'`.
- **SC-004**: **Given** the rewritten phase-016 spec folder and updated test evidence, **Then** focused Vitest, `test-extractors-loaders.js`, `npm run typecheck`, `npm run build`, and the retained proof artifact at `../../research/live-cli-proof-2026-03-17.json` all support the published March 17, 2026 parity claim.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 contamination-detection seam | Medium | Reuse `NOISE_PATTERNS` and `isNoiseContent()` directly instead of introducing a parity-only filter path. |
| Dependency | Phase 006 provenance-aware scoring | Medium | Keep `_provenance: 'tool'` behavior aligned with the existing trust-weighting tests in `description-enrichment.vitest.ts`. |
| Dependency | Phase 007 phase-classifier seam | Medium | Lock alias behavior through the public classifier APIs so downstream scoring uses canonical tool names. |
| Risk | Adjacent phase `013` worktree edits | Medium | Keep scope off the active `013` files and avoid any revert or cleanup outside phase-016 targets. |
| Risk | Spec docs drift again after runtime changes | Low | Record evidence in `checklist.md` and keep direct parity tests in the scripts test suite. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

N/A. This phase adds regression tests and documentation only. No new runtime performance, scalability, or availability requirements apply.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. L2: EDGE CASES

N/A. Edge case handling is covered by the test assertions themselves (empty XML wrappers, low-signal exchanges, empty next-steps arrays).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

| Dimension | Rating | Rationale |
|-----------|--------|-----------|
| **Code** | Low | Test-only additions; no runtime code changes |
| **Integration** | Low | Tests exercise existing public APIs |
| **Risk** | Low | Additive-only; no behavior changes |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No open questions remain for phase 016. The reopened scope was limited to proof and documentation hardening, and the focused verification stack closed the remaining uncertainty. The 2026-03-18 continuation resolved three deferred deep research findings (Q1: ALIGNMENT_BLOCK relaxation, Q3: technicalContext rendering, Q5: decision confidence parsing).
<!-- /ANCHOR:questions -->
