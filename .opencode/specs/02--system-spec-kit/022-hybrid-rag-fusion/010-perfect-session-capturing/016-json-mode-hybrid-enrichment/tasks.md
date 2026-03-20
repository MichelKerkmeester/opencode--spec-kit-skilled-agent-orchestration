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

- [x] T001 Define shipped structured-summary fields such as `toolCalls` and `exchanges` in `scripts/types/session-types.ts`
- [x] T002 Confirm file-backed JSON remains authoritative in `scripts/core/workflow.ts`
- [x] T003 Confirm the new structured fields remain optional for backward compatibility
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Carry structured summary support through the shared JSON contract and help text
- [x] T005 Preserve file-backed JSON authority instead of introducing a dedicated hybrid branch
- [x] T006 Record Wave 2 fixes for decision confidence, outcomes truncation, changed-file counts, and template-level count overrides
- [x] T007 Correct the phase docs so they no longer claim `enrichFileSourceData()` shipped in phase 016
- [x] T008 Reframe the research artifact as archival analysis of the non-shipped design
- [x] T009 Synchronize checklist evidence with the corrected plan, spec, ADR, and implementation summary
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run `npx tsc --noEmit`
- [x] T015 Run `npx tsc -b`
- [x] T016 Verify file-backed JSON remains on the authoritative structured path
- [x] T017 Verify structured summary fields and Wave 2 fixes remain documented and tested accurately
- [x] T018 Update phase documentation, implementation summary, and research framing
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
