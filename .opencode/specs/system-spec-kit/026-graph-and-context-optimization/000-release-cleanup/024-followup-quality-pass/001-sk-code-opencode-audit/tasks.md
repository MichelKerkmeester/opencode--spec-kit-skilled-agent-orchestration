---
title: "Tasks: 037/001 sk-code-opencode Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "037-001-sk-code-opencode-audit"
  - "sk-code-opencode audit"
  - "audit 033 034 036"
  - "standards alignment audit"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/001-sk-code-opencode-audit"
    last_updated_at: "2026-04-29T17:28:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Audit fixes and report written"
    next_safe_action: "Run validator build tests"
    blockers: []
    key_files:
      - "audit-findings.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "037-001-sk-code-opencode-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 037/001 sk-code-opencode Audit

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

- [x] T001 Read sk-code-opencode SKILL.md
- [x] T002 [P] Read TypeScript standards and checklists
- [x] T003 [P] Discover 036 files via git diff
- [x] T004 Confirm TypeScript strict mode baseline
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Read 033 retention-sweep files
- [x] T006 Read 034 advisor/hook files
- [x] T007 Read 036 matrix runner files
- [x] T008 Apply import type, TSDoc, header, and catch-rationale fixes
- [x] T009 Write audit-findings.md
- [x] T010 Create Level 2 packet docs and metadata
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run strict validator
- [x] T012 Run MCP server build
- [x] T013 Run targeted Vitest command
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit Report**: See `audit-findings.md`
<!-- /ANCHOR:cross-refs -->
