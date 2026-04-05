---
title: "Tasks: Signal [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/tasks]"
description: "title: \"Tasks: Signal Extraction [template:level_2/tasks.md]\""
trigger_phrases:
  - "tasks"
  - "signal"
  - "008"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Signal Extraction

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

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
## 2. PHASE 1: SETUP

- [x] T001 Create golden test file (REQ-004) (`scripts/tests/semantic-signal-golden.vitest.ts`)
- [x] T002 Define 3 frozen input texts: technical implementation, debugging session, research/planning (REQ-004)
- [x] T003 Record expected ranked output from the shared trigger-extractor baseline (REQ-004)
- [x] T004 Verify golden tests pass against the shipped extractor behavior
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### Unified Engine Construction
- [x] T005 Keep `SemanticSignalExtractor` as the script-side semantic owner (REQ-001) (`scripts/lib/semantic-signal-extractor.ts`)
- [x] T006 Implement `extract({ text, mode, stopwordProfile, ngramDepth })` core method (REQ-001) (`scripts/lib/semantic-signal-extractor.ts`)
- [x] T007 Consolidate script-side stopwords into one `balanced` / `aggressive` contract (REQ-002)
- [x] T008 Route topic/session noise terms into `aggressive` while keeping trigger baseline filtering in `balanced` (REQ-002)
- [x] T009 Preserve shared trigger-only behavior as the parity baseline instead of re-encoding it in each script caller (REQ-002)
- [x] T010 Implement n-gram extraction for depths 1-4 with default 2 for topic/session callers (REQ-003) (`scripts/lib/semantic-signal-extractor.ts`)
- [x] T011 Keep trigger scoring consistent with existing trigger-extractor logic by reusing shared primitives (`scripts/lib/semantic-signal-extractor.ts`)
- [x] T012 Implement mode-specific post-processing: `topics`, `triggers`, `summary`, `all` (REQ-001) (`scripts/lib/semantic-signal-extractor.ts`)

### Adapter Migration
- [x] T013 Convert the script-side trigger entrypoint to a thin adapter over `SemanticSignalExtractor.extract({ mode: 'triggers' })` (REQ-005) (`scripts/lib/trigger-extractor.ts`)
- [x] T014 Run golden tests after trigger-adapter migration
- [x] T015 Convert `topic-extractor.ts` to a thin adapter over `SemanticSignalExtractor.extract({ mode: 'topics' })` (REQ-005) (`scripts/core/topic-extractor.ts`)
- [x] T016 Run golden tests after topic-adapter migration
- [x] T017 Remove the inline topic extraction from `session-extractor.ts` and replace it with unified engine calls (REQ-005) (`scripts/extractors/session-extractor.ts`)
- [x] T018 Run golden tests after session-adapter migration
- [x] T019 Convert `semantic-summarizer.ts` to a thin adapter: delegate semantic trigger generation to `SemanticSignalExtractor.extract({ mode: 'summary' })` (REQ-005) (`scripts/lib/semantic-summarizer.ts`)
- [x] T020 Run golden tests after semantic-summarizer migration
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T021 Run all golden tests: unified engine produces deterministic trigger output matching locked expectations (SC-001)
- [x] T022 Run targeted extractor test suites through the adapter layer
- [x] T023 Verify trigger parity and topic/session/summary dominant-concept alignment across call paths (SC-001)
- [x] T024 Verify stopword divergence eliminated for script-side consumers through canonical profiles (SC-002)
- [x] T025 Remove script-side duplicate stopword/topic owners from migrated callers
- [x] T026 Document the shipped stopword-profile reconciliation decisions
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
