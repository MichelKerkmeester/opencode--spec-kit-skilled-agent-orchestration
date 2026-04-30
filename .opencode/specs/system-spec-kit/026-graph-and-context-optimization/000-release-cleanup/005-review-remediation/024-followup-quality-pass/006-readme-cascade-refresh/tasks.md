---
title: "Tasks: 037/006 README Cascade Refresh"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task tracking for the doc-only README cascade refresh."
trigger_phrases:
  - "037-006-readme-cascade-refresh"
  - "README cascade tasks"
importance_tier: "important"
contextType: "documentation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/006-readme-cascade-refresh"
    last_updated_at: "2026-04-29T18:19:08+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Completed README cascade tasks"
    next_safe_action: "Strict validator"
    blockers: []
    key_files:
      - "target-list.md"
    session_dedup:
      fingerprint: "sha256:037006readmecascaderefreshtasks0000000000000000000000"
      session_id: "037-006-readme-cascade-refresh"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 037/006 README Cascade Refresh

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

- [x] T001 Read root AGENTS.md and required skill docs
- [x] T002 [P] Read parent docs and MCP README
- [x] T003 [P] List first-party README files under `mcp_server/`
- [x] T004 [P] Read 037/001-005 implementation summaries
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Confirm MCP tool count from `TOOL_DEFINITIONS`
- [x] T006 Search scoped docs for stale tool counts and moved paths
- [x] T007 Write `target-list.md`
- [x] T008 Identify README/doc files needing updates
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Update parent README/SKILL/ARCHITECTURE docs
- [x] T010 Update MCP server README and install/version references
- [x] T011 Update subfolder READMEs for handlers, code graph, schemas, tools, governance, Codex hooks, and Skill Advisor
- [x] T012 Create Level 2 packet docs and metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Link/path verification passed
- [x] Strict validator passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit Ledger**: See `target-list.md`
<!-- /ANCHOR:cross-refs -->
