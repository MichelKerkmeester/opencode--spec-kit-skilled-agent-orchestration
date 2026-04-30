---
title: "Tasks: 050 Feature Catalog Shape Realignment"
description: "Task list for catalog linting, section realignment, report creation, and strict validation."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "037-feature-catalog-shape-realignment"
  - "feature catalog shape audit"
  - "sk-doc snippet template alignment"
  - "catalog OVERVIEW canonical"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/037-feature-catalog-shape-realignment"
    last_updated_at: "2026-04-30T08:40:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Tasks complete"
    next_safe_action: "Orchestrator commit"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:050-feature-catalog-shape-realignment-tasks"
      session_id: "037-feature-catalog-shape-realignment"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 050 Feature Catalog Shape Realignment

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

- [x] T001 Read sk-doc and system-spec-kit skill guidance.
- [x] T002 Read canonical feature catalog templates.
- [x] T003 [P] Read evergreen, core standards, and HVR references.
- [x] T004 [P] Discover six feature catalog roots and target files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Remove redundant `sk-deep-review` TOC sections.
- [x] T006 Realign `skill_advisor` per-feature files.
- [x] T007 Realign `code_graph` per-feature files.
- [x] T008 Fix lint-discovered `system-spec-kit` per-feature drift.
- [x] T009 Remove unexempted packet-history wording from touched catalog files.
- [x] T010 Write packet docs and reports.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run six-root shape audit.
- [x] T012 Run structural frontmatter, H1, anchor, and TOC audit.
- [x] T013 Run evergreen-doc grep on touched feature catalog files.
- [x] T014 Run strict packet validator.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit**: See `audit-findings.md`
- **Remediation**: See `remediation-log.md`
- **Lint**: See `lint-results.md`
<!-- /ANCHOR:cross-refs -->
