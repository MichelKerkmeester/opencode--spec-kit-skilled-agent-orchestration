---
title: "Tasks: MCP Tool Schema Governance Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Completed task ledger for packet 045/006 MCP tool schema governance audit."
trigger_phrases:
  - "045-006-mcp-tool-schema-governance"
  - "schema audit"
  - "governance enforcement review"
  - "tool count canonical"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/006-mcp-tool-schema-governance"
    last_updated_at: "2026-04-29T23:20:00+02:00"
    last_updated_by: "codex"
    recent_action: "Completed audit task ledger"
    next_safe_action: "Use review-report.md for remediation planning"
    blockers:
      - "P0-001 session_health skips schema validation"
    key_files:
      - "tasks.md"
      - "review-report.md"
    session_dedup:
      fingerprint: "sha256:045-006-mcp-tool-schema-governance"
      session_id: "045-006-mcp-tool-schema-governance"
      parent_session_id: "032-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: MCP Tool Schema Governance Release-Readiness Audit

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

- [x] T001 Confirm exact packet path from user prompt.
- [x] T002 Read Level 2 template and sibling 045 packet structure.
- [x] T003 [P] Read descriptor, schema, dispatch, and governance target files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Count local `TOOL_DEFINITIONS` entries and imported advisor descriptors.
- [x] T005 Compare public tool names against `TOOL_SCHEMAS` and `ALLOWED_PARAMETERS`.
- [x] T006 Trace `SPECKIT_STRICT_SCHEMAS` default and passthrough failure mode.
- [x] T007 Trace dispatch paths for tools that skip validation.
- [x] T008 Trace governed-ingest enforcement and optionality.
- [x] T009 Check governance SQL paths for bound parameters and field validation.
- [x] T010 Cross-check root README, MCP README, schema README, and `opencode.json`.
- [x] T011 Check 033 `memory_retention_sweep`, 034 `advisor_rebuild`, and 042 README refresh evidence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Write `review-report.md` in the requested 9-section format.
- [x] T013 Create Level 2 packet docs and metadata.
- [x] T014 Run strict validator and address packet doc issues.
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

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Review Report**: See `review-report.md`.
<!-- /ANCHOR:cross-refs -->
