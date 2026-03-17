---
title: "Tasks: Contamination Detection [template:level_1/tasks.md]"
---
# Tasks: Contamination Detection

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
## Phase 1: Setup

- [x] T001 Add frontmatter parsing to V8 to extract `trigger_phrases` and `key_topics` arrays (`scripts/memory/validate-memory-quality.ts`) (REQ-001)
- [x] T002 Check extracted frontmatter values against the foreign-spec identifier set (`scripts/memory/validate-memory-quality.ts`) (REQ-001)
- [x] T003 Add non-dominant signal detection: flag when 1-2 foreign-spec mentions appear across 2+ different specs (`scripts/memory/validate-memory-quality.ts`) (REQ-002)
- [x] T004 Preserve existing V8 body-content detection alongside new frontmatter checks (`scripts/memory/validate-memory-quality.ts`) (REQ-001)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Broaden V9 Patterns

- [x] T005 Audit current 3-pattern V9 denylist and document what it catches (`scripts/memory/validate-memory-quality.ts`) (REQ-003)
- [x] T006 Add patterns for template residue (`[NAME]`, `[placeholder]`), generic stubs (`Untitled`, `Draft`, `TODO`), and spec-number-only titles (`scripts/memory/validate-memory-quality.ts`) (REQ-003)
- [x] T007 Test new patterns against existing golden memories to verify zero false positives (`scripts/tests/task-enrichment.vitest.ts`) (REQ-003)

### Wire noise.patterns Config

- [x] T008 Read `noise.patterns` from `content-filter` config at initialization (`scripts/lib/content-filter.ts`) (REQ-005)
- [x] T009 Apply config-driven patterns during content filtering alongside hardcoded rules (`scripts/lib/content-filter.ts`) (REQ-005)
- [x] T010 Ensure config-driven patterns do not override safety-critical hardcoded rules (`scripts/lib/content-filter.ts`) (REQ-005)

### Add 3-Stage Audit Logging

- [x] T011 Define `ContaminationAuditRecord` interface: `{ stage, timestamp, patternsChecked, matchesFound, actionsTaken, passedThrough }` (REQ-004)
- [x] T012 Emit audit record at extractor scrub point (`scripts/core/workflow.ts` using `scripts/extractors/contamination-filter.ts`) (REQ-004)
- [x] T013 Emit audit record at content-filter point (`scripts/lib/content-filter.ts`) (REQ-004)
- [x] T014 Emit audit record at post-render point (`scripts/memory/validate-memory-quality.ts`) (REQ-004)
- [x] T015 Aggregate audit records for downstream quality reporting (`scripts/core/workflow.ts` -> `metadata.json`) (REQ-004)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Unit test: V8 frontmatter foreign-spec detection (`scripts/tests/task-enrichment.vitest.ts`) (REQ-001)
- [x] T017 [P] Unit test: V8 non-dominant signal detection (1-2 mentions across 2+ specs) (`scripts/tests/task-enrichment.vitest.ts`) (REQ-002)
- [x] T018 [P] Unit test: V9 expanded pattern set with no false positives on golden memories (`scripts/tests/task-enrichment.vitest.ts`) (REQ-003)
- [x] T019 [P] Unit test: `noise.patterns` config wiring in content-filter (`scripts/tests/task-enrichment.vitest.ts`) (REQ-005)
- [x] T020 Integration test: end-to-end contamination detection with audit trail across 3 stages (`scripts/tests/task-enrichment.vitest.ts`) (REQ-004)
- [x] T021 Run focused verification and confirm all tests pass (`npm run test:task-enrichment`, `node scripts/tests/test-memory-quality-lane.js`, `npm run typecheck`, `npm run build`) (SC-001, SC-002)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Cross-spec contamination with <3 foreign mentions detected and flagged (SC-001)
- [x] Audit trail shows detection coverage at each pipeline stage (SC-002)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dependency**: 001-quality-scorer-unification (R-01) must provide contamination penalty support before detection feeds into scoring
<!-- /ANCHOR:cross-refs -->
