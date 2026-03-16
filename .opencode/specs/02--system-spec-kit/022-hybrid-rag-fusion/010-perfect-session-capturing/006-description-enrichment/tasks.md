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

- [ ] T001 Create shared `validateDescription(description: string): DescriptionTier` function (REQ-001) (`scripts/extractors/file-extractor.ts` or new shared module)
- [ ] T002 Implement `placeholder` tier: empty, whitespace-only, TBD, todo, pending, n/a, "Recent commit:", bare changed/modified (REQ-004)
- [ ] T003 Implement `activity-only` tier: describes action without semantic content (e.g., "modified file", "updated code") (REQ-001)
- [ ] T004 Implement `semantic` tier: contains meaningful description of what changed and why (REQ-001)
- [ ] T005 Implement `high-confidence` tier: semantic content with specific technical details (REQ-001)
- [ ] T006 Replace `isDescriptionValid()` calls in file-extractor with unified validator (REQ-001) (`scripts/extractors/file-extractor.ts`)
- [ ] T007 Replace `hasMeaningfulDescription()` calls in quality-scorer with unified validator (REQ-001) (`scripts/core/quality-scorer.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation — Provenance Trust & Modification Magnitude

### Provenance Trust Weighting
- [ ] T008 Add trust multiplier lookup: `{ git: 1.0, tool: 0.8, synthetic: 0.5, unknown: 0.3 }` (REQ-002) (`scripts/core/quality-scorer.ts`)
- [ ] T009 Update quality scorer description dimension to apply `tier_score * trust_multiplier` (REQ-002) (`scripts/core/quality-scorer.ts`)
- [ ] T010 Ensure provenance is available at scoring time via existing `_provenance` field (REQ-002)

### Modification Magnitude
- [ ] T011 Add `MODIFICATION_MAGNITUDE` enum to session types: `'trivial' | 'small' | 'medium' | 'large' | 'unknown'` (REQ-003) (`scripts/types/session-types.ts`)
- [ ] T012 Add `MODIFICATION_MAGNITUDE` field to `FileChange` type (REQ-003) (`scripts/types/session-types.ts`)
- [ ] T013 Add derivation logic in git-context-extractor: trivial (<0.1), small (0.1-0.3), medium (0.3-0.7), large (>0.7), unknown (REQ-003) (`scripts/extractors/git-context-extractor.ts`)
- [ ] T014 Populate `MODIFICATION_MAGNITUDE` during git-context extraction; default to `unknown` for non-git entries (REQ-003) (`scripts/extractors/git-context-extractor.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Add unit tests for unified validator with all stub patterns (TBD, todo, pending, n/a, bare changed/modified, "Recent commit:")
- [ ] T016 Add unit tests for provenance trust multiplier application in quality scoring
- [ ] T017 Add unit tests for magnitude derivation from changeScores ranges
- [ ] T018 Verify no description passes one former gate but fails the other (SC-001)
- [ ] T019 Verify existing test baselines still pass
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
