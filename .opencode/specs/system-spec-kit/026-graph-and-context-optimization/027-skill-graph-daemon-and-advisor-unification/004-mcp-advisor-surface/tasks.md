---
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
title: "027/004 — Tasks"
description: "Task breakdown for MCP advisor surface."
trigger_phrases:
  - "027/004 tasks"
  - "advisor mcp tasks"
  - "mcp advisor surface"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface"
    last_updated_at: "2026-04-20T18:50:00Z"
    last_updated_by: "codex"
    recent_action: "Completed P0/P1 implementation tasks"
    next_safe_action: "Commit in-scope files without pushing"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/"
    session_dedup:
      fingerprint: "sha256:027004taskcompletion0000000000000000000000000000000000000000"
      session_id: "027-004-implementation-r01"
      parent_session_id: "027-004-scaffold-r01"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: 027/004

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/tasks.md | v2.2 -->

<!-- ANCHOR:task-notation -->
## Task Notation

- `[x]` complete with evidence in checklist or implementation summary.
- `[ ]` deferred or pending.
<!-- /ANCHOR:task-notation -->

<!-- ANCHOR:phase-1-setup -->
## Phase 1: Setup

- [x] T001 — Packet files written.
- [x] T002 — Read research.md §7 D3/D5/D6.
- [x] T003 — Read 027/003 scorer implementation and parity outputs.
- [x] T004 — Read existing `mcp_server/tools/` dispatcher and schemas.
<!-- /ANCHOR:phase-1-setup -->

<!-- ANCHOR:phase-2-implementation -->
## Phase 2: Implementation

- [x] T005 — Add `schemas/advisor-tool-schemas.ts`.
- [x] T006 — Add `handlers/advisor-recommend.ts`.
- [x] T007 — Add `handlers/advisor-status.ts`.
- [x] T008 — Add `handlers/advisor-validate.ts`.
- [x] T009 — Add `tools/advisor-recommend.ts`.
- [x] T010 — Add `tools/advisor-status.ts`.
- [x] T011 — Add `tools/advisor-validate.ts`.
- [x] T012 — Register tools in existing MCP dispatcher and public schema registry.
- [x] T013 — Reuse HMAC prompt cache and source-signature invalidation.
- [x] T014 — Preserve privacy contracts.
<!-- /ANCHOR:phase-2-implementation -->

<!-- ANCHOR:phase-3-verification -->
## Phase 3: Verification

- [x] T015 — Handler tests cover happy, fail-open, stale, cache, abstain, redirect, ambiguous, disabled, strict input, and privacy paths.
- [x] T016 — Focused advisor/freshness regression suite passed.
- [x] T017 — Typecheck passed.
- [x] T018 — Build passed.
- [x] T019 — Checklist and implementation summary populated.
- [ ] T020 — Commit local changes only; do not push.
<!-- /ANCHOR:phase-3-verification -->

<!-- ANCHOR:completion-criteria -->
## Completion Criteria

P0/P1 implementation is complete when schemas, handlers, descriptors, dispatcher registration, tests, typecheck, build, and spec docs are updated. P2 trace and partial validation limit remain deferred.
<!-- /ANCHOR:completion-criteria -->

<!-- ANCHOR:cross-references -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Summary: `implementation-summary.md`
<!-- /ANCHOR:cross-references -->
