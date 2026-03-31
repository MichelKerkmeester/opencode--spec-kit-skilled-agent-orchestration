---
title: "Tasks [02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/018-memory-save-quality-fixes/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "memory save quality tasks"
  - "018 memory save quality fixes"
  - "root cause remediation tasks"
importance_tier: "important"
contextType: "implementation"
key_topics:
  - "eight fixes"
  - "review tasks"
  - "test tasks"
level: 2
---
# Tasks: Memory Save Quality Root Cause Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/tasks.md | v2.2 -->

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

- [x] T001 Confirm the eight root causes from the flawed `/memory:save` output (manual review notes)
- [x] T002 Freeze the in-scope remediation boundary with no template, pipeline-stage, or MCP-server changes (`spec.md`, `plan.md`)
- [x] T003 Identify the target files, regression suites, and review gates for the fix pass (`plan.md`, Vitest suites)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Differentiate decision CONTEXT, RATIONALE, and CHOSEN for string-form decisions (`scripts/extractors/decision-extractor.ts`)
- [x] T005 Add observation-based completion fallback for normalized Next Steps (`scripts/extractors/collect-session-data.ts`)
- [x] T006 Replace broad blocker keywords with structural blocker patterns (`scripts/extractors/session-extractor.ts`)
- [x] T007 Remove generic code-pattern matchers and require word-boundary evidence (`scripts/extractors/implementation-guide-extractor.ts`)
- [x] T008 Expand `TECHNICAL_SHORT_WORDS`, filter short generic bigrams, and keep relaxed mode quality-aware (`shared/trigger-extractor.ts`)
- [x] T009 Support em dash, en dash, colon, and hyphen file separators with path guards (`scripts/utils/input-normalizer.ts`)
- [x] T010 Lower `memoryThinThreshold` and cap merge groups at three children (`scripts/core/tree-thinning.ts`)
- [x] T011 Synthesize assistant messages from structured JSON summary data (`scripts/extractors/conversation-extractor.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rebuild `shared/dist` after the trigger-extractor source changes (`shared/dist/trigger-extractor.js`)
- [x] T013 Update the intentional golden expectation from `the error` to `fixed null pointer memory` (`scripts/tests/semantic-signal-golden.vitest.ts`)
- [x] T014 Run the targeted regression suites and confirm 106/106 passing (Vitest)
- [x] T015 Run the `generate-context.js --help` smoke check (`scripts/memory/generate-context.js`)
- [x] T016 Complete ultra-think review 1 and capture the Fix 4 and Fix 5 follow-up findings (review notes)
- [x] T017 Apply the review-driven Fix 4 and Fix 5 corrections, including added programming keywords (`implementation-guide-extractor.ts`, `shared/trigger-extractor.ts`)
- [x] T018 Complete ultra-think review 2 and rerun the final regression pass (review notes, Vitest)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
