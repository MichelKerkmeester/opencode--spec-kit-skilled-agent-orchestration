---
title: "Tasks: Skill Advisor Freshness Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task ledger for the 045/003 read-only skill advisor freshness audit."
trigger_phrases:
  - "045-003-skill-advisor-freshness"
  - "advisor freshness audit"
  - "daemon freshness review"
  - "advisor rebuild review"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/003-skill-advisor-freshness"
    last_updated_at: "2026-04-29T22:05:20+02:00"
    last_updated_by: "codex"
    recent_action: "Completed audit task ledger"
    next_safe_action: "Use review-report.md for remediation planning"
    blockers:
      - "P1 advisor_rebuild workspaceRoot contract gap"
    key_files:
      - "tasks.md"
      - "review-report.md"
    session_dedup:
      fingerprint: "sha256:045-003-skill-advisor-freshness-tasks"
      session_id: "045-003-skill-advisor-freshness"
      parent_session_id: "032-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Advisor Freshness Release-Readiness Audit

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

- [x] T001 Confirm user-specified packet folder and read-only constraint.
- [x] T002 Load relevant deep-review and system-spec-kit workflow instructions.
- [x] T003 [P] Read Level 2 templates and sibling packet metadata.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Audit `advisor-status.ts` side effects and status semantics.
- [x] T005 Audit `advisor-rebuild.ts`, tool schema, tests, generation publication, and cache invalidation.
- [x] T006 Audit prompt cache behavior and hit-rate test evidence.
- [x] T007 Audit static scoring boost tables and injection boundaries.
- [x] T008 Audit Codex hook timeout fallback marker evidence.
- [x] T009 Audit Python compatibility shim native delegation and fallback scoring.
- [x] T010 Audit daemon shutdown, restart, and generation demotion behavior.
- [x] T011 Cross-read 026/008, 034, and 045/005 overlap.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Create packet docs.
- [x] T013 Create 9-section `review-report.md`.
- [x] T014 Run strict packet validator.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Strict validator passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Report**: See `review-report.md`
<!-- /ANCHOR:cross-refs -->
