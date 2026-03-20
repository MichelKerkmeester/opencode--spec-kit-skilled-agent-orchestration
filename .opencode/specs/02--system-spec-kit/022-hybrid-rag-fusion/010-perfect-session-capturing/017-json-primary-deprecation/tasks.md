---
title: "Tasks: JSON-Primary Deprecation [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "json primary deprecation"
  - "017 json primary deprecation"
importance_tier: "high"
contextType: "implementation"
---
# Tasks: JSON-Primary Deprecation

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

- [x] T001 Confirm the handoff from `016-json-mode-hybrid-enrichment`
- [x] T002 Freeze JSON-primary as the routine-save target posture
- [x] T003 Identify the follow-up phases that need keep, reframe, or archive outcomes
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add deprecation warnings for routine stateless saves (`scripts/memory/generate-context.ts`)
- [x] T005 Surface the same runtime posture in the loader path (`scripts/loaders/data-loader.ts`)
- [x] T006 Add structured JSON enrichment types (`scripts/types/session-types.ts`)
- [x] T007 Extend normalization and weighting for the richer JSON input path (`scripts/utils/input-normalizer.ts`, `scripts/core/memory-indexer.ts`)
- [x] T008 Update operator guidance to JSON-primary wording (`.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/command/memory/save.md`)
- [x] T009 Move obsolete dynamic-capture follow-ups under `../000-dynamic-capture-deprecation/`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rebuild the runtime and rerun targeted tests
- [x] T011 Validate modified JSON artifacts
- [x] T012 Confirm the review outcomes and archive layout in the moved branch parent
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
