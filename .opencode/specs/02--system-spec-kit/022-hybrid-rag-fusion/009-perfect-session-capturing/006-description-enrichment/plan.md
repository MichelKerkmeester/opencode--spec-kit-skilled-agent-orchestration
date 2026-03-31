---
title: "Implementation [02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/006-description-enrichment/plan]"
description: "title: \"Implementation Plan: Description Enrichment\""
trigger_phrases:
  - "implementation"
  - "plan"
  - "006"
  - "description"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Description Enrichment

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | generate-context.js pipeline |
| **Storage** | None (in-memory file records) |
| **Testing** | Vitest |

### Overview

This plan implements a validator unification pattern: make `validateDescription()` the canonical shared validator for extraction/scoring with tiered outcomes (placeholder / activity-only / semantic / high-confidence), remove `hasMeaningfulDescription()` from scoring, retain `isDescriptionValid()` as a compatibility/local helper where needed, add provenance-based trust weighting to description quality scoring, and derive `MODIFICATION_MAGNITUDE` from existing `changeScores` and action type data already computed by `git-context-extractor.ts`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (R-04 type consolidation)

### Definition of Done

- [x] All acceptance criteria met (REQ-001 through REQ-004)
- [x] Tests passing -- unified validator catches all stub patterns; magnitude populated for git entries
- [x] Docs updated (spec/plan in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Validator unification -- merge two overlapping validation functions into one shared gate, add provenance as a quality signal, and surface existing computed data as a structured field.

### Key Components

- **Unified description validator**: `validateDescription()` is the canonical shared validator for extraction/scoring; `hasMeaningfulDescription()` is removed and `isDescriptionValid()` remains as a compatibility/local helper wrapper where needed
- **Provenance trust weighting**: Quality scorer multiplier based on `_provenance` source (git=1.0, tool=0.8, synthetic=0.5)
- **`MODIFICATION_MAGNITUDE` derivation**: Maps `changeScores` ranges + action type + commit-touch counts to an enum: trivial / small / medium / large / unknown
- **Expanded stub pattern set**: Regex additions for TBD, todo, pending, n/a, bare changed/modified, "Recent commit:"

### Data Flow

1. File extractor produces file entries with descriptions and `_provenance`
2. Git-context-extractor computes `changeScores` and action types (already exists)
3. New derivation maps `changeScores` to `MODIFICATION_MAGNITUDE` on each `FileChange`
4. Unified validator classifies each description into a tier
5. Quality scorer uses tier + provenance trust multiplier for description quality dimension
6. Downstream renderers and templates receive enriched file data
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Unified Validator

- [x] Create shared `validateDescription(description: string): DescriptionTier` function in `utils/file-helpers.ts`
- [x] Implement tier classification:
  - `placeholder`: empty, whitespace-only, TBD, todo, pending, n/a, "Recent commit:", bare changed/modified
  - `activity-only`: describes action without semantic content (e.g., "modified file", "updated code")
  - `semantic`: contains meaningful description of what changed and why
  - `high-confidence`: semantic content with specific technical details
- [x] Align `file-extractor.ts` to the shared `file-helpers.ts` validator path, where `validateDescription()` is canonical and `isDescriptionValid()` is a compatibility wrapper
- [x] Replace `hasMeaningfulDescription()` calls in `quality-scorer.ts` with unified validator

### Phase 2: Provenance Trust Weighting

- [x] Add trust multiplier lookup: `{ git: 1.0, tool/spec-folder: 0.8, synthetic: 0.5, unknown: 0.3 }`
- [x] Update quality scorer description dimension to apply `tier_score * trust_multiplier`
- [x] Ensure provenance is available at scoring time (already attached as `_provenance`)

### Phase 3: Modification Magnitude

- [x] Add `MODIFICATION_MAGNITUDE` enum to `session-types.ts`: `'trivial' | 'small' | 'medium' | 'large' | 'unknown'`
- [x] Add derivation logic in `git-context-extractor.ts`:
  - `trivial`: normalizedScore < 0.1
  - `small`: normalizedScore 0.1-0.3
  - `medium`: normalizedScore 0.3-0.7
  - `large`: normalizedScore > 0.7
  - `unknown`: non-git entries or missing changeScore data
- [x] Add `MODIFICATION_MAGNITUDE` field to `FileChange` type
- [x] Populate field during git-context extraction via `addFile()` → `deriveModificationMagnitude()`

### Phase 4: Verification

- [x] Add unit tests for unified validator with all stub patterns (`description-enrichment.vitest.ts`, 5 tests)
- [x] Add unit tests for provenance trust multiplier application
- [x] Add unit tests for magnitude derivation from changeScores ranges
- [x] Verify no description passes one former gate but fails the other
- [x] Verify existing test baselines still pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Unified validator tier classification for all stub patterns and edge cases | Vitest |
| Unit | Provenance trust multiplier application in quality scoring | Vitest |
| Unit | `MODIFICATION_MAGNITUDE` derivation from `changeScores` ranges | Vitest |
| Integration | End-to-end file extraction through quality scoring with enriched data | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| R-04 type consolidation (004-type-consolidation) | Internal | Green | `FileChange` type was extended directly in canonical `session-types.ts`; 004 not yet complete but `MODIFICATION_MAGNITUDE` was added without conflict |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Unified validator rejects descriptions that were previously accepted, causing quality score regressions
- **Procedure**: Restore the two separate validators and remove `MODIFICATION_MAGNITUDE` field; provenance trust weighting can be reverted by setting all multipliers to 1.0
<!-- /ANCHOR:rollback -->
