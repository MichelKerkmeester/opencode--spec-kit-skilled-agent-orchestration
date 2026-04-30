---
title: "Tasks: Cross-Runtime Hook Parity Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Completed task ledger for the Level 2 read-only deep-review packet."
trigger_phrases:
  - "045-005-cross-runtime-hook-parity"
  - "hook parity audit"
  - "5-runtime hook review"
  - "cross-runtime feature parity"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/005-cross-runtime-hook-parity"
    last_updated_at: "2026-04-29T22:30:00+02:00"
    last_updated_by: "codex"
    recent_action: "Completed audit tasks"
    next_safe_action: "Use active findings for remediation planning"
    blockers:
      - "Active P0 remains in review-report.md"
    key_files:
      - "tasks.md"
      - "review-report.md"
    session_dedup:
      fingerprint: "sha256:045-005-cross-runtime-hook-parity-tasks"
      session_id: "045-005-cross-runtime-hook-parity"
      parent_session_id: "032-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Cross-Runtime Hook Parity Release-Readiness Audit

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

- [x] T001 Confirm user-provided packet path and read-only target scope.
- [x] T002 Load `sk-deep-review` and `system-spec-kit` workflow instructions.
- [x] T003 [P] Read Level 2 templates and existing 045 parent context.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Read hook contract docs and per-runtime README files.
- [x] T005 Read runtime hook source for Claude, Codex, Copilot, Gemini, and OpenCode.
- [x] T006 Read per-runtime configs and checked-in Copilot wrapper evidence.
- [x] T007 Read 035 findings, 043 findings/run-output, and 044 methodology correction.
- [x] T008 Classify P0/P1/P2 findings with file:line evidence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Write `review-report.md` in the required 9-section format.
- [x] T010 Create Level 2 packet docs and metadata.
- [x] T011 Run strict validator and record the result.
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
- **Review**: See `review-report.md`
<!-- /ANCHOR:cross-refs -->
