---
title: "Tasks: Recursiv [skilled-agent-orchestration/041-sk-recursive-agent-loop/007-sk-recursive-agent-wording-alignment/tasks]"
description: "Task tracking for phase 007 under packet 041."
trigger_phrases:
  - "041 phase 007 tasks"
  - "recursive agent wording alignment tasks"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/007-sk-recursive-agent-wording-alignment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Recursive Agent Wording Alignment

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the new `007-sk-improve-agent-wording-alignment/` phase packet
- [x] T002 Read the current agent-improver source, mirror, and packet surfaces before editing
- [x] T003 Confirm the pass stays wording-only and skips historical `research/` and `memory/` artifacts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Clean up wording in `.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/skill/sk-improve-agent/README.md`, and bundled agent-improver references
- [x] T005 Clean up wording in the canonical command and mirrored wrapper prompts
- [x] T006 Clean up wording in runtime-specific agent-improver mirrors and fix runtime-path wording bugs
- [x] T007 Update parent packet `041` docs and registry metadata to record phase `007`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run document validation for the updated skill and command surfaces
- [x] T009 Run TOML and JSON parsing for updated wrappers and registry metadata
- [x] T010 Resweep the current agent-improver surfaces for remaining wording issues
- [x] T011 Run strict validation for phase `007`
- [x] T012 Run strict validation for root `041`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The current agent-improver surfaces read clearly and consistently
- [x] Runtime-specific command and agent wording is accurate
- [x] Historical `research/` and `memory/` artifacts remain untouched
- [x] Root `041` records phase `007` and validates strictly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [spec.md](./spec.md)
- **Plan**: See [plan.md](./plan.md)
- **Checklist**: See [checklist.md](./checklist.md)
- **Implementation Summary**: See [implementation-summary.md](./implementation-summary.md)
- **Parent Packet**: See [../spec.md](../spec.md)
<!-- /ANCHOR:cross-refs -->

---
