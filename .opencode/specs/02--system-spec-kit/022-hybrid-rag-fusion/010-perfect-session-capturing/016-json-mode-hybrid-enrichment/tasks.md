---
title: "Tasks: JSON Mode Hybrid Enrichment (Phase 1B)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "json mode"
  - "hybrid enrichment"
importance_tier: "normal"
contextType: "general"
---
# Tasks: JSON Mode Hybrid Enrichment (Phase 1B)

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Define `SessionMetadata` and `GitMetadata` in `scripts/types/session-types.ts`
- [x] T002 Extend `CollectedDataBase` with optional `session`, `git`, `sessionSummary`, `keyDecisions`, and `nextSteps`
- [x] T003 Confirm all new fields are optional for backward compatibility
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `enrichFileSourceData()` in `scripts/core/workflow.ts`
- [x] T005 Replace the file-source early return with the safe enrichment path
- [x] T006 Merge git provenance and spec-folder context without injecting observations or `FILES`
- [x] T007 Apply explicit `session.*` and `git.*` overrides in `scripts/extractors/collect-session-data.ts`
- [x] T008 Update `generate-context.ts` help text for the new JSON contract
- [x] T009 Validate `session` and `git` block shapes in `scripts/utils/input-normalizer.ts`
- [x] T010 Add explicit decision confidence normalization support
- [x] T011 Fix truncated outcomes to prefer narrative text when titles are shortened
- [x] T012 Add `git.changedFileCount` and `_gitChangedFileCount` priority handling
- [x] T013 Preserve explicit message and tool counts during template assembly
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run `npx tsc --noEmit`
- [x] T015 Run `npx tsc -b`
- [x] T016 Verify V8 safety by confirming observations and `FILES` stay excluded from the file-source path
- [x] T017 Verify JSON-mode outputs honor explicit status, percent, counts, and git metadata
- [x] T018 Update phase documentation and implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks are marked `[x]`
- [x] No blocked tasks remain for this phase
- [x] Validation evidence exists for the new JSON metadata path and Wave 2 hardening fixes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
