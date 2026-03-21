---
title: "Feature Specification: Memory Pipeline Fixes [template:level_2/spec.md]"
description: "Seven targeted TypeScript bug fixes restore correct title building, status inference, phase classification, confidence scoring, summarization, trigger quality, and embedding metadata propagation in system-spec-kit."
trigger_phrases:
  - "memory pipeline"
  - "bug fix"
  - "typescript"
  - "level 2 spec"
  - "system-spec-kit"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: Memory Pipeline Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-21 |
| **Branch** | `001-memory-pipeline-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit memory pipeline currently has seven targeted correctness issues spread across the `scripts` and `shared` TypeScript packages. These defects can truncate generated titles and key outcomes, misclassify session status and phase, understate decision confidence, emit low-value trigger phrases, and lose the configured embedding model name, which reduces the quality and traceability of downstream memory artifacts.

### Purpose
Deliver a tightly scoped repair pass that fixes the seven named regressions, rebuilds the affected packages, and verifies the existing test and validation paths without expanding into unrelated refactors or feature work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix title truncation in `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts`.
- Fix session status inference in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`.
- Fix phase classifier override behavior in `.opencode/skill/system-spec-kit/scripts/lib/phase-classifier.ts`.
- Fix decision confidence baseline in `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts`.
- Fix key outcomes truncation in `.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts`.
- Fix generic single-word trigger phrases in `.opencode/skill/system-spec-kit/shared/trigger-extractor.ts`.
- Fix embedding model name propagation in `.opencode/skill/system-spec-kit/shared/embeddings.ts`.
- Rebuild the affected packages and run existing verification commands for the workspace, `scripts`, and `shared` paths as applicable.

### Out of Scope
- New memory-pipeline features, algorithm redesigns, or broad cleanup outside the seven requested fixes.
- Changes to unrelated files outside the affected source paths and generated build outputs required by the normal build process.
- Creation of a new testing framework or speculative refactors that are not necessary to verify the requested bug fixes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts` | Modify | Correct title truncation so generated titles preserve the intended text boundary. |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | Modify | Correct inferred session status when source signals are partial or conflicting. |
| `.opencode/skill/system-spec-kit/scripts/lib/phase-classifier.ts` | Modify | Ensure explicit overrides win over fallback phase classification. |
| `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts` | Modify | Raise the decision-confidence baseline to the intended default when evidence is sparse. |
| `.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts` | Modify | Preserve full key outcomes instead of truncating useful summary content. |
| `.opencode/skill/system-spec-kit/shared/trigger-extractor.ts` | Modify | Filter low-value single-word trigger phrases while keeping meaningful triggers. |
| `.opencode/skill/system-spec-kit/shared/embeddings.ts` | Modify | Propagate the configured embedding model name through shared embedding utilities. |
| `.opencode/skill/system-spec-kit/scripts/dist/**` | Modify (generated) | Rebuilt script artifacts if the package build writes tracked output. |
| `.opencode/skill/system-spec-kit/shared/dist/**` | Modify (generated) | Rebuilt shared artifacts if the package build writes tracked output. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix all seven requested source-level regressions in the specified `scripts` and `shared` TypeScript files. | Each of the seven target files has an implementation change that directly addresses the requested bug, and no requested fix is left unhandled. |
| REQ-002 | Rebuild affected packages after source changes. | Build commands complete successfully for the relevant workspace paths, and generated outputs are updated if the repository tracks them. |
| REQ-003 | Run existing test or verification commands that cover the affected packages. | Existing tests, type checks, or smoke checks used by the repository for these packages complete successfully, or any failing pre-existing issue is explicitly documented with evidence and user sign-off. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Keep scope limited to the seven named fixes plus rebuild and verification work. | The change set excludes unrelated refactors, feature additions, and opportunistic cleanup not required for the requested fixes. |
| REQ-005 | Preserve existing public package and workflow expectations. | No new configuration, package structure, or command changes are introduced unless strictly needed to keep existing build and test flows working. |
| REQ-006 | Capture verification evidence in the spec folder checklist and implementation summary. | `checklist.md` and `implementation-summary.md` include concrete command results or documented deferrals before the task is marked complete. |

### Acceptance Scenarios

- **Given** a long candidate title in `title-builder.ts`, **when** the title builder finalizes output, **then** it preserves the intended visible text instead of truncating useful content prematurely.
- **Given** partial or mixed session lifecycle signals in `collect-session-data.ts`, **when** status inference runs, **then** it resolves to the documented session status rather than an incorrect fallback.
- **Given** an explicit phase override in `phase-classifier.ts`, **when** phase classification executes, **then** the override wins over inferred phase heuristics.
- **Given** sparse decision evidence, generic trigger candidates, or embedding configuration input, **when** the decision extractor, trigger extractor, and embeddings utilities run, **then** they apply the correct baseline confidence, reject low-value one-word triggers, and preserve the configured model name end to end.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All seven requested bugs are fixed in the named source files, with no requested item omitted.
- **SC-002**: Rebuild and existing verification commands complete successfully for the affected workspace paths, or any exception is documented and approved.
- **SC-003**: The final change set stays inside the declared scope and records verification evidence in the spec folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | TypeScript workspace build chain in `.opencode/skill/system-spec-kit` | If the workspace build is broken, the fixes cannot be verified cleanly. | Use the existing workspace and package build commands in the documented order and capture exact failures if any pre-existing breakage appears. |
| Dependency | Existing test coverage for memory-pipeline logic | Some regressions may not have dedicated automated tests. | Run the existing tests first, then add targeted manual verification evidence for the seven behaviors if coverage is incomplete. |
| Risk | Dist output drift after rebuilding `scripts` or `shared` | Generated files may change unexpectedly and create review noise. | Limit rebuilds to the affected packages, inspect diffs carefully, and keep notes in the implementation summary. |
| Risk | Behavior baselines may be implicit rather than explicitly tested | A fix could accidentally shift adjacent summarization or extraction behavior. | Compare outputs against the requested behavior for each fix and verify adjacent edge cases listed below. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The fixes must not introduce material runtime regressions in title building, summarization, trigger extraction, or embedding setup for the existing CLI and memory workflows.
- **NFR-P02**: Rebuild and verification steps must use the repository's existing commands and complete within the normal local development workflow for the workspace.

### Security
- **NFR-S01**: The change set must not introduce new secrets, network requirements, or authentication behaviors.
- **NFR-S02**: Input handling must remain defensive so malformed session data, summaries, or trigger candidates do not crash the extraction pipeline.

### Reliability
- **NFR-R01**: The seven corrected behaviors must produce deterministic results for the same inputs across repeated local runs.
- **NFR-R02**: Failures during build or verification must be surfaced explicitly in checklist evidence instead of being silently ignored.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or very short titles and summaries should not produce malformed truncation output or empty placeholders when meaningful text exists.
- Maximum-length outcomes should preserve the intended key information without clipping the most important concluding phrases.
- Invalid or incomplete session metadata should fall back predictably instead of assigning an incorrect status or phase.

### Error Scenarios
- Missing override inputs must not incorrectly override the normal phase-classification path.
- Sparse decision evidence must still produce the documented baseline confidence instead of collapsing to an unhelpful default.
- Missing or default embedding configuration must still propagate the selected model name through the shared embedding layer.

### State Transitions
- Sessions that move from active to completed states should infer the final status consistently when mixed signals are present.
- Partial extraction runs should leave enough context for summarization and trigger extraction without degrading into generic one-word outputs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Seven targeted source fixes across two workspace packages plus rebuild and verification. |
| Risk | 12/25 | User-facing memory quality can regress if extraction and summarization behavior shifts unexpectedly. |
| Research | 8/20 | Moderate investigation needed to confirm intended baselines and override behavior, but no major architecture change is expected. |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should generated `dist/` artifacts for `scripts` and `shared` be committed if the rebuild changes tracked output, or is source-only verification acceptable for this task?
- Which existing tests are considered the minimum acceptance set if automated coverage does not directly exercise every requested regression?
<!-- /ANCHOR:questions -->

---
