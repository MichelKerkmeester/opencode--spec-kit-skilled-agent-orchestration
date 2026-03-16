---
title: "Implementation Plan: Description Enrichment"
---
# Implementation Plan: Description Enrichment

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

This plan implements a validator unification pattern: merge `isDescriptionValid()` from `file-extractor.ts` and `hasMeaningfulDescription()` from `quality-scorer.ts` into a single shared validator with tiered outcomes (placeholder / activity-only / semantic / high-confidence), add provenance-based trust weighting to description quality scoring, and derive `MODIFICATION_MAGNITUDE` from existing `changeScores` and action type data already computed by `git-context-extractor.ts`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (R-04 type consolidation)

### Definition of Done

- [ ] All acceptance criteria met (REQ-001 through REQ-004)
- [ ] Tests passing -- unified validator catches all stub patterns; magnitude populated for git entries
- [ ] Docs updated (spec/plan in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Validator unification -- merge two overlapping validation functions into one shared gate, add provenance as a quality signal, and surface existing computed data as a structured field.

### Key Components

- **Unified description validator**: Single function replacing both `isDescriptionValid()` and `hasMeaningfulDescription()`, returning a tiered outcome enum
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

- [ ] Create shared `validateDescription(description: string): DescriptionTier` function
- [ ] Implement tier classification:
  - `placeholder`: empty, whitespace-only, TBD, todo, pending, n/a, "Recent commit:", bare changed/modified
  - `activity-only`: describes action without semantic content (e.g., "modified file", "updated code")
  - `semantic`: contains meaningful description of what changed and why
  - `high-confidence`: semantic content with specific technical details
- [ ] Replace `isDescriptionValid()` calls in `file-extractor.ts` with unified validator
- [ ] Replace `hasMeaningfulDescription()` calls in `quality-scorer.ts` with unified validator

### Phase 2: Provenance Trust Weighting

- [ ] Add trust multiplier lookup: `{ git: 1.0, tool: 0.8, synthetic: 0.5, unknown: 0.3 }`
- [ ] Update quality scorer description dimension to apply `tier_score * trust_multiplier`
- [ ] Ensure provenance is available at scoring time (already attached as `_provenance`)

### Phase 3: Modification Magnitude

- [ ] Add `MODIFICATION_MAGNITUDE` enum to `session-types.ts`: `'trivial' | 'small' | 'medium' | 'large' | 'unknown'`
- [ ] Add derivation logic in `git-context-extractor.ts`:
  - `trivial`: changeScore < 0.1 or only whitespace/formatting changes
  - `small`: changeScore 0.1-0.3, single-file touch
  - `medium`: changeScore 0.3-0.7, multiple file sections or moderate diff
  - `large`: changeScore > 0.7, structural changes or many commit touches
  - `unknown`: non-git entries or missing changeScore data
- [ ] Add `MODIFICATION_MAGNITUDE` field to `FileChange` type
- [ ] Populate field during git-context extraction

### Phase 4: Verification

- [ ] Add unit tests for unified validator with all stub patterns
- [ ] Add unit tests for provenance trust multiplier application
- [ ] Add unit tests for magnitude derivation from changeScores ranges
- [ ] Verify no description passes one former gate but fails the other
- [ ] Verify existing test baselines still pass
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
| R-04 type consolidation (004-type-consolidation) | Internal | Yellow | `FileChange` type must be canonical before adding `MODIFICATION_MAGNITUDE`; blocked until A1 completes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Unified validator rejects descriptions that were previously accepted, causing quality score regressions
- **Procedure**: Restore the two separate validators and remove `MODIFICATION_MAGNITUDE` field; provenance trust weighting can be reverted by setting all multipliers to 1.0
<!-- /ANCHOR:rollback -->
