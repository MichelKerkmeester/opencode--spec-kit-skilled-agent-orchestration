---
title: "Tasks: Description Enrichment [template:level_1/tasks.md]"
---
# Tasks: Description Enrichment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup — Unified Validator

- [x] T001 Create shared `validateDescription(description: string): DescriptionTier` function (REQ-001) (`scripts/utils/file-helpers.ts`) — Evidence: tiered validator at lines 112-138 with `DescriptionValidationResult` return type.
- [x] T002 Implement `placeholder` tier: empty, whitespace-only, TBD, todo, pending, n/a, "Recent commit:", bare changed/modified (REQ-004) (`scripts/utils/file-helpers.ts`) — Evidence: `PLACEHOLDER_PATTERNS` array (lines 26-37) covers all listed patterns.
- [x] T003 Implement `activity-only` tier: describes action without semantic content (REQ-001) (`scripts/utils/file-helpers.ts`) — Evidence: `ACTIVITY_ONLY_PATTERNS` array (lines 39-44) matches action-only descriptions.
- [x] T004 Implement `semantic` tier: contains meaningful description of what changed and why (REQ-001) (`scripts/utils/file-helpers.ts`) — Evidence: default tier for descriptions >= 16 chars that pass placeholder and activity-only filters.
- [x] T005 Implement `high-confidence` tier: semantic content with specific technical details (REQ-001) (`scripts/utils/file-helpers.ts`) — Evidence: `HIGH_CONFIDENCE_HINTS` (lines 46-50), requires >= 48 chars and >= 2 signal matches.
- [x] T006 Replace `isDescriptionValid()` calls in file-extractor with unified validator (REQ-001) (`scripts/extractors/file-extractor.ts`) — Evidence: imports `isDescriptionValid` from `utils/file-helpers.ts` (line 15).
- [x] T007 Replace `hasMeaningfulDescription()` calls in quality-scorer with unified validator (REQ-001) (`scripts/core/quality-scorer.ts`) — Evidence: `hasMeaningfulDescription()` fully removed; replaced with `validateDescription()` + `DESCRIPTION_TIER_SCORES` (lines 95-120).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation — Provenance Trust & Modification Magnitude

### Provenance Trust Weighting
- [x] T008 Add trust multiplier lookup: git=1.0, tool/spec-folder=0.8, synthetic=0.5, unknown=0.3 (REQ-002) (`scripts/core/quality-scorer.ts`) — Evidence: `getDescriptionTrustMultiplier()` at lines 102-116.
- [x] T009 Update quality scorer description dimension to apply `tier_score * trust_multiplier` (REQ-002) (`scripts/core/quality-scorer.ts`) — Evidence: `getDescriptionQualityScore()` at lines 118-121 multiplies tier score by trust.
- [x] T010 Ensure provenance is available at scoring time via existing `_provenance` field (REQ-002) — Evidence: `FileWithDescription` interface includes `_provenance` and `_synthetic` fields.

### Modification Magnitude
- [x] T011 Add `MODIFICATION_MAGNITUDE` enum to session types: `'trivial' | 'small' | 'medium' | 'large' | 'unknown'` (REQ-003) (`scripts/types/session-types.ts`) — Evidence: `ModificationMagnitude` type at line 13.
- [x] T012 Add `MODIFICATION_MAGNITUDE` field to `FileChange` type (REQ-003) (`scripts/types/session-types.ts`) — Evidence: optional `MODIFICATION_MAGNITUDE` field on `FileChange` at line 20.
- [x] T013 Add derivation logic in git-context-extractor: trivial (<0.1), small (0.1-0.3), medium (0.3-0.7), large (>0.7), unknown (REQ-003) (`scripts/extractors/git-context-extractor.ts`) — Evidence: `deriveModificationMagnitude()` at lines 179-218 with normalized thresholds.
- [x] T014 Populate `MODIFICATION_MAGNITUDE` during git-context extraction; default to `unknown` for non-git entries (REQ-003) (`scripts/extractors/git-context-extractor.ts`) — Evidence: `addFile()` calls `deriveModificationMagnitude()` with changeScore, action, and commitTouches.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Add unit tests for unified validator with all stub patterns — Evidence: `description-enrichment.vitest.ts` (5 tests, all passing).
- [x] T016 Add unit tests for provenance trust multiplier application in quality scoring — Evidence: `quality-scorer-calibration.vitest.ts` covers trust multiplier paths.
- [x] T017 Add unit tests for magnitude derivation from changeScores ranges — Evidence: `description-enrichment.vitest.ts` covers magnitude derivation.
- [x] T018 Verify no description passes one former gate but fails the other (SC-001) — Evidence: `hasMeaningfulDescription()` fully removed; single code path via `validateDescription()`.
- [x] T019 Verify existing test baselines still pass — Evidence: `tsc --noEmit` clean, `test-extractors-loaders.js` exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — Evidence: `tsc --noEmit` clean, `description-enrichment.vitest.ts` 5/5 passed on 2026-03-16.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
