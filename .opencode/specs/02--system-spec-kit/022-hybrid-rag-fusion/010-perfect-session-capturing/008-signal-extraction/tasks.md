---
title: "Tasks: Signal Extraction [template:level_1/tasks.md]"
---
# Tasks: Signal Extraction

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
## Phase 1: Setup — Golden Tests (Test-First)

- [ ] T001 Create golden test file (REQ-004) (`scripts/tests/semantic-signal-golden.vitest.ts`)
- [ ] T002 Define 3+ frozen input texts: technical discussion, debugging session, research/planning (REQ-004)
- [ ] T003 Record expected ranked output from current trigger-extractor as baseline (REQ-004)
- [ ] T004 Verify golden tests pass against current extractor behavior
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation — Unified Engine & Adapter Migration

### Unified Engine Construction
- [ ] T005 Create `SemanticSignalExtractor` class (REQ-001) (`scripts/lib/semantic-signal-extractor.ts`)
- [ ] T006 Implement `extract({ text, mode, stopwordProfile, ngramDepth })` core method (REQ-001) (`scripts/lib/semantic-signal-extractor.ts`)
- [ ] T007 Consolidate stopwords: merge 119 trigger-english + 136 session-extractor lists (REQ-002)
- [ ] T008 Resolve 53 session-only words: include in `balanced` or move to `aggressive` (REQ-002)
- [ ] T009 Resolve 36 trigger-only words: include in `balanced` or move to `aggressive` (REQ-002)
- [ ] T010 Implement n-gram extraction for depths 1-4 with default 2 (REQ-003) (`scripts/lib/semantic-signal-extractor.ts`)
- [ ] T011 Implement TF-IDF weighting consistent with existing trigger-extractor logic (`scripts/lib/semantic-signal-extractor.ts`)
- [ ] T012 Implement mode-specific post-processing: `topics`, `triggers`, `summary`, `all` (REQ-001) (`scripts/lib/semantic-signal-extractor.ts`)

### Adapter Migration
- [ ] T013 Convert `trigger-extractor.ts` to thin adapter: delegate to `SemanticSignalExtractor.extract({ mode: 'triggers' })` (REQ-005) (`scripts/shared/trigger-extractor.ts`)
- [ ] T014 Run golden tests after trigger-extractor migration
- [ ] T015 Convert `topic-extractor.ts` to thin adapter: delegate to `SemanticSignalExtractor.extract({ mode: 'topics' })` (REQ-005) (`scripts/core/topic-extractor.ts`)
- [ ] T016 Run golden tests after topic-extractor migration
- [ ] T017 Remove inline extraction from `session-extractor.ts` (lines 381-437); replace with unified engine call (REQ-005) (`scripts/extractors/session-extractor.ts`)
- [ ] T018 Run golden tests after session-extractor migration
- [ ] T019 Convert `semantic-summarizer.ts` to thin adapter: delegate to `SemanticSignalExtractor.extract({ mode: 'summary' })` (REQ-005) (`scripts/lib/semantic-summarizer.ts`)
- [ ] T020 Run golden tests after semantic-summarizer migration
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification & Cleanup

- [ ] T021 Run all golden tests: unified engine produces deterministic output matching locked expectations (SC-001)
- [ ] T022 Run existing extractor test suites: all pass through adapter layer
- [ ] T023 Verify same input through all 4 call paths produces identical ranked output (SC-001)
- [ ] T024 Verify stopword divergence eliminated: one canonical list with mode-aware additions (SC-002)
- [ ] T025 Remove dead code from migrated extractors (private helpers no longer called)
- [ ] T026 Document stopword reconciliation decisions (which session-only words were kept/dropped)
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
