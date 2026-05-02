---
title: "Tasks: Code Graph Readiness Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task ledger for the read-only code graph readiness release-readiness audit."
trigger_phrases:
  - "045-004-code-graph-readiness"
  - "code graph readiness audit"
  - "read-path contract review"
  - "ensure-ready behavior"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/004-code-graph-readiness"
    last_updated_at: "2026-04-29T22:00:00+02:00"
    last_updated_by: "codex"
    recent_action: "Completed release-readiness code graph readiness audit tasks"
    next_safe_action: "Use review-report.md for remediation planning"
    blockers:
      - "P0-001 readiness debounce can mask stale edits after a recent fresh check"
    key_files:
      - "tasks.md"
      - "review-report.md"
    session_dedup:
      fingerprint: "sha256:045-004-code-graph-readiness"
      session_id: "045-004-code-graph-readiness"
      parent_session_id: "032-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Code Graph Readiness Release-Readiness Audit

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

- [x] T001 Confirm user-provided packet folder and read-only target scope.
- [x] T002 Load `sk-deep-review` quick reference and review contract.
- [x] T003 [P] Load system-spec-kit template expectations.
- [x] T004 [P] Inspect sibling 045 packet report format.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Read `lib/ensure-ready.ts` readiness and selective self-heal logic.
- [x] T006 Read `handlers/query.ts`, `context.ts`, `status.ts`, `verify.ts`, `detect-changes.ts`, and `scan.ts`.
- [x] T007 Read code graph database and indexer stale-file logic.
- [x] T008 Run watcher/real-time regex over current code_graph docs.
- [x] T009 Review feature catalog and manual testing playbook.
- [x] T010 Review post-038 degraded stress tests.
- [x] T011 Cross-check 013, 032, and 035 evidence where relevant.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Create packet `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json`.
- [x] T013 Create final 9-section `review-report.md`.
- [x] T014 Run strict validator and record PASS evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Strict validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Report**: See `review-report.md`
<!-- /ANCHOR:cross-refs -->
