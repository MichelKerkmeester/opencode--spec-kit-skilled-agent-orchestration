---
title: "Tasks: 037/002 feature-catalog-trio"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task list for the doc-only feature catalog trio refresh."
trigger_phrases:
  - "037-002-feature-catalog-trio"
  - "feature catalog updates"
  - "catalog refresh 031-036"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/002-feature-catalog-trio"
    last_updated_at: "2026-04-29T17:38:44+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Catalog tasks verified"
    next_safe_action: "Run final strict validator"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:037002featurecatalogtrio000000000000000000000000000000000000"
      session_id: "037-002-feature-catalog-trio"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: 037/002 feature-catalog-trio

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

- [x] T001 Run requested catalog discovery commands.
- [x] T002 Read sk-doc feature-catalog creation guidance and templates.
- [x] T003 [P] Read existing system-spec-kit and skill_advisor catalogs.
- [x] T004 [P] Gather source file:line evidence for packet 033/034/036 surfaces.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Create Level 2 packet docs and metadata.
- [x] T006 Add system-spec-kit catalog entries for `memory_retention_sweep`, CLI matrix adapters, and Codex freshness smoke check.
- [x] T007 Update system-spec-kit tool count from 51 to 54.
- [x] T008 Add skill_advisor `advisor_rebuild` catalog entry.
- [x] T009 Update skill_advisor `advisor_status` entry as diagnostic-only.
- [x] T010 Record missing standalone code_graph catalog in discovery notes and update existing code-graph readiness entry without fabricating a new catalog.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run sk-doc validation for modified catalog root files.
- [x] T012 Run strict spec validator for this packet.
- [x] T013 Confirm git diff is doc-only.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Strict validator passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Discovery**: See `discovery-notes.md`
<!-- /ANCHOR:cross-refs -->
