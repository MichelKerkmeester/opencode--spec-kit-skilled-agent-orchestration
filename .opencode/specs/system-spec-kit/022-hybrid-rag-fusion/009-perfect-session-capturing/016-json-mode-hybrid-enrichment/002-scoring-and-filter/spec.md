---
title: "...-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/002-scoring-and-filter/spec]"
description: "Quality score has zero discriminative power due to bonus overcompensation, and the contamination filter covers only 2 of 8+ text fields. This phase fixes both: recalibrates the bonus/penalty system so quality_score reflects real session quality, and expands filterContamination to all uncleaned text fields."
trigger_phrases:
  - "quality scorer recalibration"
  - "contamination filter expansion"
  - "scoring and filter"
  - "bonus system overcompensation"
  - "hallucination prevention"
  - "domain c domain e"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Scoring and Filter — Quality Scorer Recalibration and Contamination Filter Expansion

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Two interrelated defects undermine memory quality in the generate-context.js pipeline. First, the extractors quality scorer applies up to +0.20 in bonuses for normal session activity, ensuring that five simultaneous soft failures still produce a score above 0.95 — making quality_score effectively binary and useless for discriminating good saves from bad ones. Second, the contamination filter is applied only to `observations` and `SUMMARY`, leaving `_JSON_SESSION_SUMMARY`, `_manualDecisions`, `recentContext`, and `technicalContext` completely uncleaned. This phase recalibrates the scorer and extends the filter to close both gaps.

**Key Decisions**: Remove bonuses entirely from the scorer (replace with normalized base scoring); extend `filterContamination` calls at workflow.ts:548-602 to cover all uncleaned text fields.

**Critical Dependencies**: extractors/quality-scorer.ts is the live scorer (imported at workflow.ts:39); core/quality-scorer.ts is dead code and must not be touched. The calibration test file currently imports the wrong scorer and produces false confidence.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-21 |
| **Branch** | `016-json-mode-hybrid-enrichment` |
| **Spec Folder** | `009-perfect-session-capturing/016-json-mode-hybrid-enrichment/002-scoring-and-filter` |
| **Parent Spec** | `../spec.md` |
| **Sibling (complete)** | `../001-initial-enrichment/spec.md` |
| **Research Source** | `../research/research.md` (Round 2, Domains C + E) |

---

<!-- ANCHOR:problem -->
<!-- /ANCHOR:metadata -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The extractors quality scorer (extractors/quality-scorer.ts:113-205) assigns bonuses of +0.05 for message count, +0.05 for tool usage, and +0.10 for decisions present — a maximum of +0.20. HIGH-severity findings never reach the scorer because they block writes upstream. The maximum reachable penalty is MEDIUM severity at -0.15. Five simultaneous soft failures combined with all three bonuses produce a final score of 0.95, indistinguishable from a perfect save. The quality_score field conveys no useful signal.

Separately, `filterContamination` in workflow.ts is called at lines 548-602 but applied only to observation strings and the SUMMARY block. Four additional text fields bypass cleaning entirely: `_JSON_SESSION_SUMMARY` (the raw sessionSummary string, used as a title candidate), `_manualDecisions` (preserves uncleaned AI-generated originals), `recentContext` (entirely uncleaned), and `technicalContext` KEY and VALUE strings (uncleaned). The filter itself also covers only 29 actual patterns despite documentation claiming 74, and is missing 7 complete contamination categories.

### Purpose

Restore discriminative power to quality_score by removing the bonus system and recalibrating penalties. Extend filterContamination to all text fields that currently bypass cleaning, and add the 7 missing contamination categories.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Remove or neutralize the +0.05/+0.05/+0.10 bonus system in extractors/quality-scorer.ts; replace with a calibrated base scoring approach where the score reflects actual penalty weight
- Fix quality-scorer-calibration.vitest.ts to import extractors/quality-scorer.ts instead of the dead-code core/quality-scorer.ts (1 LOC change)
- Extend `filterContamination` calls in workflow.ts to cover `_JSON_SESSION_SUMMARY`, `_manualDecisions`, `recentContext` entries, and `technicalContext` KEY/VALUE pairs (20-30 LOC)
- Add 7 missing contamination categories to contamination-filter.ts: hedging phrases, conversational acknowledgment, meta-commentary, instruction echoing, markdown artifacts, safety disclaimers, redundant certainty markers
- Add `resolveProjectPhase()` function to session-extractor.ts following the contextType/importanceTier explicit-override pattern (~30 LOC)
- Propagate `projectPhase` through input-normalizer.ts so JSON-supplied values survive normalization
- Feed post-save review severity findings back into the numeric quality_score in post-save-review.ts + extractors/quality-scorer.ts
- Consider making `nextAction` fallback value configurable via JSON input (P1 review item)

### Out of Scope

- Replacing the contamination filter architecture wholesale — targeted pattern additions only
- Quality scoring redesign beyond recalibration — same scoring model, corrected weights
- Addressing trigger phrase noise (Domain D) — that is covered in 004-indexing-and-coherence
- Fast-path `filesModified` drop (Domain A) — covered in 003-field-integrity-and-schema
- Any changes to the MCP server layer or memory retrieval scoring

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/extractors/quality-scorer.ts` | Modify | Remove bonus system; recalibrate penalty weights for discriminative scoring |
| `scripts/core/workflow.ts` | Modify | Extend filterContamination calls to cover 4 additional text field locations |
| `scripts/extractors/contamination-filter.ts` | Modify | Add 7 missing contamination categories (29 → 36+ patterns) |
| `scripts/extractors/session-extractor.ts` | Modify | Add resolveProjectPhase() with explicit override support |
| `scripts/utils/input-normalizer.ts` | Modify | Propagate projectPhase from JSON input through normalization |
| `scripts/core/post-save-review.ts` | Modify | Feed HIGH/MEDIUM finding severity back to quality_score |
| `scripts/tests/quality-scorer-calibration.vitest.ts` | Modify | Fix import: extractors/quality-scorer.ts, not core/quality-scorer.ts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove bonus system from extractors/quality-scorer.ts | Five simultaneous soft failures produce a score < 0.80; a perfect session scores >= 0.95 |
| REQ-002 | Fix calibration test import | quality-scorer-calibration.vitest.ts imports `extractors/quality-scorer.ts`; `npx vitest run` passes |
| REQ-003 | Extend filterContamination to `_JSON_SESSION_SUMMARY` | Title candidates generated from sessionSummary pass through the filter before use |
| REQ-004 | Extend filterContamination to `_manualDecisions` | All entries in the manualDecisions array are cleaned before template assembly |
| REQ-005 | Extend filterContamination to `recentContext` entries | All recentContext strings are cleaned before template assembly |
| REQ-006 | Extend filterContamination to `technicalContext` KEY and VALUE | Both key and value strings in technicalContext entries are cleaned |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Add 7 missing contamination categories | contamination-filter.ts covers hedging, conversational acknowledgment, meta-commentary, instruction echoing, markdown artifacts, safety disclaimers, redundant certainty markers |
| REQ-008 | Add resolveProjectPhase() explicit override | JSON input with `projectPhase: "IMPLEMENTATION"` results in PROJECT_PHASE frontmatter of IMPLEMENTATION, not RESEARCH |
| REQ-009 | Propagate projectPhase through input-normalizer.ts | projectPhase value in JSON input survives fast-path and slow-path normalization |
| REQ-010 | Feed post-save review findings into quality_score | A save with a HIGH post-save finding receives a lower quality_score than the pre-review value; score delta documented |
| REQ-011 | Review nextAction fallback configurability | Decision documented in decision-record.md: implement configurable fallback OR document rationale for hardcoded default |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: quality_score has discriminative power — a session with 5 medium-severity issues scores at least 0.15 lower than a clean session
- **SC-002**: quality-scorer-calibration.vitest.ts passes and tests the live scorer (extractors/quality-scorer.ts)
- **SC-003**: A JSON save with AI-hedging text ("I think", "it seems") in sessionSummary, recentContext, or technicalContext does not produce those phrases in the saved memory
- **SC-004**: A JSON save with `projectPhase: "IMPLEMENTATION"` writes `PROJECT_PHASE: IMPLEMENTATION` in the memory frontmatter
- **SC-005**: Post-save review HIGH findings reduce quality_score by a documented, consistent amount

### Acceptance Scenarios

**Given** a session with five simultaneous medium-severity issues, **when** the recalibrated live scorer runs, **then** the resulting `quality_score` is materially lower than a clean-session score.

**Given** the calibration Vitest file, **when** a maintainer inspects its import path, **then** it targets `extractors/quality-scorer.ts` instead of the dead `core/quality-scorer.ts`.

**Given** a JSON save with hedging text in `sessionSummary`, **when** the save pipeline completes, **then** the saved memory does not retain the hedging phrase.

**Given** a JSON save with contaminated text inside `recentContext` or `technicalContext`, **when** the workflow filters those fields, **then** the rendered memory contains the cleaned versions only.

**Given** a JSON payload with `"projectPhase": "IMPLEMENTATION"`, **when** normalization and extraction complete, **then** the saved frontmatter records `PROJECT_PHASE: IMPLEMENTATION`.

**Given** a save that produces a HIGH post-save review finding, **when** review feedback is applied to the stored result, **then** the resulting `quality_score` is lower than it would be without that finding.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | extractors/quality-scorer.ts is the live scorer | Editing wrong file has no effect | Confirm import path at workflow.ts:39 before editing |
| Dependency | contamination-filter.ts pattern list | Overly aggressive patterns cause data loss | Test against representative session data before merging |
| Risk | Recalibrated scorer changes score distribution for existing saves | Future saves scored differently than historical ones | Acceptable — discrimination is the goal; document the change |
| Risk | filterContamination is applied 4 additional times per save | Minor performance overhead | Each call is a string-scan loop; negligible at typical session sizes |
| Risk | resolveProjectPhase() fallback logic introduces incorrect overrides | Incorrect PROJECT_PHASE in frontmatter | Match the exact pattern used by resolveContextType() and resolveImportanceTier() |
| Dependency | Sibling phase 001-initial-enrichment | Must be complete (it is) before modifying workflow.ts to avoid merge conflicts | Confirmed complete |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: filterContamination additions must not increase per-save latency by more than 10ms at typical session sizes (<5000 chars per field)

### Reliability
- **NFR-R01**: All existing passing tests must continue to pass after scorer recalibration

### Maintainability
- **NFR-M01**: Contamination pattern additions must follow the existing array-of-strings structure in contamination-filter.ts; no new abstraction layers

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Scoring Edge Cases
- Session with zero observations, zero tools, zero decisions: must score above 0.0 (not crash); expected ~0.60 with recalibrated base
- Session with all bonuses removed but clean content: should score >= 0.90

### Contamination Edge Cases
- `_JSON_SESSION_SUMMARY` is undefined (sessionSummary not supplied in JSON): filterContamination call must short-circuit safely
- `recentContext` is an empty array: no-op, no error
- `technicalContext` has numeric values (not strings): filter must handle type coercion or skip gracefully

### projectPhase Override Edge Cases
- `projectPhase` supplied as empty string: treat as absent, use inferred value
- `projectPhase` supplied with invalid enum value: log warning, fall back to inferred value

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 7, LOC: ~110-150 total, Systems: 1 (pipeline) |
| Risk | 12/25 | No auth/API, no breaking public contract, internal scorer change |
| Research | 14/20 | Deep research Round 2 already completed (74 findings, citations in research/research.md) |
| Multi-Agent | 6/15 | Single workstream, sequential changes |
| Coordination | 9/15 | 7-file spread requires careful order; sibling phases must not conflict |
| **Total** | **55/100** | **Level 3** |

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Contamination pattern too broad, strips valid content | High | Low | Unit-test filter against representative saves before merge |
| R-002 | Scorer recalibration breaks existing passing calibration tests | Medium | Medium | Fix the test import first; run tests before and after recalibration |
| R-003 | post-save-review score adjustment interacts with scorer in unexpected ways | Medium | Low | Apply adjustment as a simple additive penalty on the final score, not inside the scorer itself |
| R-004 | projectPhase normalization breaks legacy saves that don't supply the field | Low | Low | Default to inferred RESEARCH when field absent — matching current behavior |

---

## 11. USER STORIES

### US-001: Quality Score Reflects Real Session Quality (Priority: P0)

**As a** developer reviewing a memory save, **I want** the quality_score in the frontmatter to reflect whether the session content is actually high quality, **so that** I can trust it as a signal when auditing memory health.

**Acceptance Criteria**:
1. Given a session with 5 simultaneous medium-severity issues (e.g., short summary, few observations, vague decisions), When the scorer runs, Then quality_score is below 0.80
2. Given a clean, complete session with rich observations and clear decisions, When the scorer runs, Then quality_score is >= 0.90

---

### US-002: Contamination Filter Covers All Text Fields (Priority: P0)

**As a** system relying on clean memory content, **I want** AI hedging and boilerplate phrases removed from every text field before saving, **so that** memory content does not degrade retrieval quality.

**Acceptance Criteria**:
1. Given a JSON save where sessionSummary contains "I think this might be", When the memory is saved, Then the saved summary does not contain "I think this might be"
2. Given a save where recentContext contains "As an AI assistant I should note", When the memory is saved, Then that phrase is absent from the saved memory

---

### US-003: Calibration Tests Test the Live Scorer (Priority: P0)

**As a** developer, **I want** the calibration Vitest file to actually test the scorer that runs in production, **so that** calibration test results are meaningful.

**Acceptance Criteria**:
1. Given quality-scorer-calibration.vitest.ts, When I inspect its imports, Then it imports from `extractors/quality-scorer.ts` not `core/quality-scorer.ts`
2. Given `npx vitest run quality-scorer-calibration`, When tests run, Then they exercise real scoring behavior

---

### US-004: projectPhase Explicit Override (Priority: P1)

**As a** developer saving a JSON memory, **I want** to supply `projectPhase` in the JSON input and have it respected, **so that** IMPLEMENTATION-phase saves are not incorrectly tagged as RESEARCH in the frontmatter.

**Acceptance Criteria**:
1. Given a JSON save with `"projectPhase": "IMPLEMENTATION"`, When the pipeline runs, Then `PROJECT_PHASE: IMPLEMENTATION` appears in the memory frontmatter
2. Given a JSON save without `projectPhase`, When the pipeline runs, Then the inferred value (RESEARCH for JSON mode) is used as before

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should post-save review findings apply a fixed penalty (e.g., -0.10 per HIGH finding) or a scaled one? Document final decision in decision-record.md ADR-003.
- Is `nextAction` fallback "continue" the right default? If not, what should it be? Decision required before REQ-011 can be closed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Source**: `../research/research.md` (Round 2, Domains C + E)
- **Sibling Phase**: `../001-initial-enrichment/spec.md` (Complete)
<!-- /ANCHOR:questions -->
