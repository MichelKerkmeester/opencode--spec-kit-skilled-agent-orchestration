---
title: "Tasks: Convert OpenCode Agents to Claude Code Subagents [009-claude-code-subagents/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "convert"
  - "opencode"
  - "agents"
  - "claude"
  - "009"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Convert OpenCode Agents to Claude Code Subagents

<!-- SPECKIT_LEVEL: 1 -->
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
## Phase 1: Preparation

- [ ] T001 Read `.claude/agents/explore.md` frontmatter as reference
- [ ] T002 Document frontmatter conversion mapping (OpenCode → Claude Code)
- [ ] T003 Verify all 8 source files exist in `.opencode/agent/`

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Conversion (Parallelizable)

- [ ] T004 [P] Convert context.md (.opencode/agent/context.md → .claude/agents/context.md)
- [ ] T005 [P] Convert orchestrate.md (.opencode/agent/orchestrate.md → .claude/agents/orchestrate.md)
- [ ] T006 [P] Convert speckit.md (.opencode/agent/speckit.md → .claude/agents/speckit.md)
- [ ] T007 [P] Convert research.md (.opencode/agent/research.md → .claude/agents/research.md)
- [ ] T008 [P] Convert write.md (.opencode/agent/write.md → .claude/agents/write.md)
- [ ] T009 [P] Convert debug.md (.opencode/agent/debug.md → .claude/agents/debug.md)
- [ ] T010 [P] Convert review.md (.opencode/agent/review.md → .claude/agents/review.md)
- [ ] T011 [P] Convert handover.md (.opencode/agent/handover.md → .claude/agents/handover.md)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Verify all 8 files exist in `.claude/agents/`
- [ ] T013 Check frontmatter structure matches Claude Code format
- [ ] T014 Confirm body content unchanged (diff source vs target bodies)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 8 agent files in `.claude/agents/` with valid frontmatter and identical body content

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->

---
