<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "Tasks: Doc Surface Alignment for Research Content Routing Accuracy"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "018 phase 004 tasks"
  - "doc surface alignment tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded the execution tasks for the routing doc-alignment pass"
    next_safe_action: "Use implementation-summary.md if a follow-on routing-doc phase is opened later"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:018-phase-004-doc-surface-alignment-tasks"
      session_id: "018-phase-004-doc-surface-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which packet-local deliverables are required for this phase"
---
# Tasks: Doc Surface Alignment for Research Content Routing Accuracy

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

- [x] T001 Read the phase `spec.md` and confirm the requested routing deltas. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment/spec.md`
- [x] T002 Read the shipped routing source-of-truth in `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` and `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`. Evidence: direct file review before doc edits
- [x] T003 Identify which named surfaces actually describe changed routing behavior and should be updated. Evidence: scan of the user-listed files plus selective no-change decisions for `AGENTS.md`, `CLAUDE.md`, and `.opencode/agent/speckit.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update the primary routing docs in `.opencode/command/memory/save.md`, `.opencode/command/memory/manage.md`, `.opencode/skill/system-spec-kit/ARCHITECTURE.md`, `.opencode/skill/system-spec-kit/SKILL.md`, and `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`. Evidence: file patches completed in this turn
- [x] T005 Update routing-aware feature-catalog and playbook surfaces under `.opencode/skill/system-spec-kit/feature_catalog/` and `.opencode/skill/system-spec-kit/manual_testing_playbook/`. Evidence: file patches completed in this turn
- [x] T006 Verify `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, and `opencode.json` do not reintroduce `SPECKIT_TIER3_ROUTING`, and confirm the feature-flag reference marks it removed. Evidence: targeted `rg -n "SPECKIT_TIER3_ROUTING" ...` returned only the removed-flag reference entry.
- [x] T007 Create and normalize packet-local `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` for Level 2 strict validation. Evidence: phase folder now contains those files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `jq empty .mcp.json .claude/mcp.json .vscode/mcp.json .gemini/settings.json opencode.json`. Evidence: command exited `0` on 2026-04-13.
- [x] T009 Run the targeted routing sweep across the edited command, skill, feature-catalog, and playbook surfaces, including the removed-flag check. Evidence: `rg -n "SPECKIT_TIER3_ROUTING|always on by default|routeAs|8-category|8 categories|handover versus drop|delivery versus progress|metadata-first|packet_kind" ...` returned only the removed-flag reference plus the aligned always-on save, skill, feature-catalog, and playbook hits.
- [x] T010 Run strict packet validation for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment`. Evidence: `validate.sh --strict` exited `0` with `RESULT: PASSED`.
- [x] T011 Update `checklist.md` and `implementation-summary.md` with the final command evidence and completion state. Evidence: this closeout patch records the final verification results and completion status.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
