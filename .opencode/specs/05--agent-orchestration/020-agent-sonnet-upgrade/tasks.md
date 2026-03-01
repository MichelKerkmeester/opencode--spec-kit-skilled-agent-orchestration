---
title: "Tasks: Agent Sonnet 4.6 Upgrade [020-agent-sonnet-upgrade/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "agent"
  - "sonnet"
  - "upgrade"
  - "020"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Agent Sonnet 4.6 Upgrade

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
## Phase 1: Inventory

- [x] T001 List all target agent files in `.opencode/agent/copilot/` and `.claude/agents/`
- [x] T002 [P] Read each agent file to identify current model field value
- [x] T003 Confirm correct model ID strings for both agent systems
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Group 1 — Copilot fleet upgrade to `github-copilot/claude-sonnet-4-6`

- [x] T004 [P] Upgrade context.md (`.opencode/agent/copilot/context.md`) — `haiku-4.5` → `sonnet-4-6`
- [x] T005 [P] Upgrade handover.md (`.opencode/agent/copilot/handover.md`) — `haiku-4.5` → `sonnet-4-6`
- [x] T006 [P] Upgrade review.md (`.opencode/agent/copilot/review.md`) — add model field; remove stale comment
- [x] T007 [P] Upgrade speckit.md (`.opencode/agent/copilot/speckit.md`) — `sonnet-4.5` → `sonnet-4-6`
- [x] T008 [P] Upgrade write.md (`.opencode/agent/copilot/write.md`) — `sonnet-4.5` → `sonnet-4-6`

### Group 2 — Copilot agents: remove hard-pinned model (enable parent inheritance)

- [x] T009 [P] Remove model field from research.md (`.opencode/agent/copilot/research.md`) — delete `opus-4.6` line
- [x] T010 [P] Remove model field from debug.md (`.opencode/agent/copilot/debug.md`) — delete `opus-4.6` line

### Group 3 — Claude Code agents upgrade to `sonnet`

- [x] T011 [P] Upgrade context.md (`.claude/agents/context.md`) — `haiku` → `sonnet`
- [x] T012 [P] Upgrade handover.md (`.claude/agents/handover.md`) — `haiku` → `sonnet`
- [x] T013 [P] Upgrade review.md (`.claude/agents/review.md`) — `opus` → `sonnet`

### Changelog

- [x] T014 Write changelog entry at `.opencode/changelog/00--opencode-environment/v2.1.3.0.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 [P] Verify all 10 agent files reflect correct final model assignment
- [x] T016 Confirm research.md and debug.md have no `model:` line remaining
- [x] T017 Confirm no stale model strings (`haiku-4.5`, `sonnet-4.5`, `opus-4.6`) remain in any target file
- [x] T018 Tag release as v2.1.3.0 and commit
- [x] T019 Create spec folder documentation (retroactive — this task set)
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
- **Changelog**: `.opencode/changelog/00--opencode-environment/v2.1.3.0.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
