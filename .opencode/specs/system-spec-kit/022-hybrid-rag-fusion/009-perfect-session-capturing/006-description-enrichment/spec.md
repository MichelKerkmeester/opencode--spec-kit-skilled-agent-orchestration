---
title: "Feature Specif [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/006-description-enrichment/spec]"
description: "Improve description fidelity and enrichment quality for spec folder descriptions."
trigger_phrases:
  - "feature"
  - "specif"
  - "spec"
  - "006"
  - "description"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Description Enrichment

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


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
| **Created** | 2026-03-16 |
| **Completed** | 2026-03-16 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 6 |
| **Predecessor** | [005-confidence-calibration](../005-confidence-calibration/spec.md) |
| **Successor** | [007-phase-classification](../007-phase-classification/spec.md) |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-06 |
| **Sequence** | A1 |
<!-- /ANCHOR:metadata -->

---

### Phase Context

This is **Phase 6** of the Perfect Session Capturing specification.

**Scope Boundary**: Two different quality gates validate file descriptions at different pipeline stages with partial overlap and divergent coverage.
**Dependencies**: 005-confidence-calibration
**Deliverables**: Established `validateDescription()` as the canonical shared validator, removed `hasMeaningfulDescription()`, and retained `isDescriptionValid()` as a compatibility/local helper path; implemented tiered validation outcomes
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two different quality gates validate file descriptions at different pipeline stages with partial overlap and divergent coverage. Extraction-time `isDescriptionValid()` (in `file-extractor.ts`) checks basic non-empty criteria. Scoring-time `hasMeaningfulDescription()` (in `quality-scorer.ts`) applies a separate regex-based check for placeholder patterns. Neither catches several real-world stub patterns: "Recent commit: modify in repository history", TBD/todo/pending/n/a, or bare "changed"/"modified" without context. The `_provenance` field is attached to file entries but never used for quality ranking -- git-derived descriptions are treated identically to synthetic ones. Additionally, `git-context-extractor.ts` already computes `changeScores` and action types but these signals are not surfaced as a structured `MODIFICATION_MAGNITUDE` field.

### Purpose

Unify the two description validators into a single shared gate with tiered outcomes, use `_provenance` for description trust weighting, and derive a `MODIFICATION_MAGNITUDE` field from existing `changeScores` data so downstream consumers can distinguish trivial changes from substantial modifications.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Make `validateDescription()` the canonical shared validator for extraction/scoring while keeping `isDescriptionValid()` as a compatibility/local helper where needed
- Implement tiered validation outcomes: placeholder / activity-only / semantic / high-confidence
- Use `_provenance` for description trust weighting (git > tool > synthetic)
- Add `MODIFICATION_MAGNITUDE` field to `FileChange` type: trivial / small / medium / large / unknown
- Derive magnitude from `changeScores`, action type, and commit-touch counts
- Catch additional stub patterns: TBD, todo, pending, n/a, bare changed/modified, "Recent commit:"

### Out of Scope

- Changing how `_provenance` is assigned during extraction -- only consumption changes
- Modifying git-context-extractor's core diffstat logic -- only surfacing existing data
- Adding new git analysis commands or external tool calls

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/extractors/file-extractor.ts` | Modify | Route extraction validation through shared `file-helpers` validator path (`validateDescription()` canonical with `isDescriptionValid()` compatibility wrapper); add stub pattern matching for TBD/todo/pending/n/a/bare-changed/"Recent commit:" |
| `scripts/core/quality-scorer.ts` | Modify | Replace `hasMeaningfulDescription()` calls with unified validator; add provenance-based trust weighting to description quality dimension |
| `scripts/extractors/git-context-extractor.ts` | Modify | Expose `MODIFICATION_MAGNITUDE` derived from existing `changeScores`, action type, and commit-touch counts |
| `scripts/utils/file-helpers.ts` | Modify | Home of unified `validateDescription()` with tiered outcomes, `isDescriptionValid()` wrapper, and stub pattern detection |
| `scripts/types/session-types.ts` | Modify | Add `MODIFICATION_MAGNITUDE` enum and field to `FileChange` type |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Single shared description validator with tiered outcomes: placeholder / activity-only / semantic / high-confidence | Both extraction-time and scoring-time call paths use the same validator; no description passes one gate but fails the other |
| REQ-002 | `_provenance` used for description trust weighting: git > tool > synthetic | Quality scorer applies a trust multiplier based on provenance source when scoring description quality |
| REQ-004 | Additional stub patterns caught: TBD, todo, pending, n/a, bare changed/modified, "Recent commit:" | Validator rejects all listed patterns as placeholder tier |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `MODIFICATION_MAGNITUDE` field derived from `changeScores` + action + commit-touch counts: trivial / small / medium / large / unknown | Field is populated for all git-derived file entries; non-git entries default to `unknown` |
| REQ-005 | Checklist evidence formatting remains parser-compatible for completed verification items | Completed checklist entries include explicit parsable evidence markers recognized by validation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No description passes quality check in one gate but fails in the other for the canonical extraction/scoring path -- `validateDescription()` is authoritative and compatibility/local helper usage stays behaviorally aligned
- **SC-002**: `MODIFICATION_MAGNITUDE` is populated for git-derived file entries with values derived from existing `changeScores` data

### Acceptance Scenarios

1. **Given** the same description string at extraction and scoring stages, **when** validation runs, **then** both stages resolve the same tier from one shared validator.
2. **Given** placeholder or stub description text (for example TODO/TBD/Recent commit), **when** validation runs, **then** it is classified as placeholder-tier and handled consistently.
3. **Given** git-derived file metadata with change scores, **when** magnitude is derived, **then** `MODIFICATION_MAGNITUDE` is set using the configured thresholds.
4. **Given** completed checklist entries in this phase, **when** validation scans evidence formatting, **then** entries provide parser-compatible evidence markers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | R-04 type consolidation (004-type-consolidation) | High -- `FileChange` type must be canonical before adding `MODIFICATION_MAGNITUDE` | Sequence as A1, coordinate with type consolidation |
| Risk | Unified validator may reject descriptions that previously passed one of the two gates | Medium | Tiered outcome model allows soft classification without hard rejection for edge cases |
| Risk | Provenance trust weighting could inflate scores for git-derived but low-quality descriptions | Low | Trust multiplier adjusts weight, not overrides; underlying description content still determines the tier |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at this time -- requirements are fully specified from research R-06
<!-- /ANCHOR:questions -->
