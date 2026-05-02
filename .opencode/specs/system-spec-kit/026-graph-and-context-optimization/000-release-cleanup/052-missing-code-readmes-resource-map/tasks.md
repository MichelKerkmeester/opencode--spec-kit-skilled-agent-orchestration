---
title: "Tasks: Missing Code READMEs Resource Map [template:level_2/tasks.md]"
description: "Task list for correcting and implementing Phase 052 exact 65-folder README manifest."
trigger_phrases:
  - "readme resource map tasks"
  - "missing code readmes"
  - "phase 052 tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map"
    last_updated_at: "2026-05-02T16:15:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created all 65 target README files from the exact manifest"
    next_safe_action: "Review git diff and summarize completed README implementation"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map/resource-map.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Missing Code READMEs Resource Map

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Create phase child under release-cleanup parent (`052-missing-code-readmes-resource-map/`)
- [x] T002 [P] Add Level 2 checklist from manifest-backed template (`checklist.md`)
- [x] T003 [P] Add resource-map from manifest-backed template (`resource-map.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace prior incorrect one-README finding with exact 65-folder manifest (`resource-map.md`)
- [x] T005 Record manifest counts: 65 unique folders, 0 existing READMEs, 0 missing paths (`resource-map.md`)
- [x] T006 Record 3 file-path mappings to `mcp_server/lib/description` (`resource-map.md`)
- [x] T007 Record B01-B17 batches from Task #36 (`resource-map.md`)
- [x] T010 Record concise README rule for SMALL folders (`spec.md`, `resource-map.md`)
- [x] T011 Create target READMEs for B01-B05 (20 README files)
- [x] T012 Create target READMEs for B06-B10 (20 README files)
- [x] T013 Create target READMEs for B11-B15 (20 README files)
- [x] T014 Create target READMEs for B16-B17 (5 README files)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run per-file README validation on all 65 target READMEs
- [x] T009 Run strict validation on the phase folder
- [x] T015 Report validation exit summary and warnings
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0/P1 checklist items verified.
- [x] No `[B]` blocked tasks remaining. [Evidence: no blocked task entries present]
- [x] All 65 target README files exist.
- [x] README validation exits 0 for target README files.
- [x] Strict validation exits 0 or 1.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Resource Map**: See `resource-map.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
