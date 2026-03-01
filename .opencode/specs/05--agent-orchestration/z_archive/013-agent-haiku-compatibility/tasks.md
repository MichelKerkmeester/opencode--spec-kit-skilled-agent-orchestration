---
title: "Tasks: Agent Haiku Compatibility [013-agent-haiku-compatibility/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "agent"
  - "haiku"
  - "compatibility"
  - "013"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Agent Haiku Compatibility

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
## Phase 1: Update orchestrate.md

- [x] T001 Replace 3-mode dispatch limits with thorough-only (`.opencode/agent/orchestrate.md:192`)
- [x] T002 Add "Context Agent Quality Notes (Haiku)" subsection to §5 (`.opencode/agent/orchestrate.md`)
- [x] T003 Add Context Package section count to §6 Review Checklist (`.opencode/agent/orchestrate.md`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Mirror to Claude Code

- [x] T004 Copy updated body to `.claude/agents/orchestrate.md` (preserve frontmatter)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 [P] Grep: no stale `quick=0` references in agent files
- [x] T006 [P] Diff: body identity between platforms
- [x] T007 [P] Verify non-context agents have no stale mode references

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

<!-- /ANCHOR:cross-refs -->

---
