---
title: "Tasks: automated-greeting [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "automated greeting"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
# Tasks: automated-greeting

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
## Phase 1: Setup

- [ ] T001 Confirm first-connect greeting requirements (`spec.md`)
- [ ] T002 Define greeting text and insertion point (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts`)
- [ ] T003 [P] Prepare greeting test scaffold (`.opencode/skill/system-spec-kit/mcp_server/tests/context-server.greeting.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add first-connect greeting trigger (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts`)
- [ ] T005 Add greeted-session state handling (`.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`)
- [ ] T006 Emit greeting only on first successful connect (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts`)
- [ ] T007 Add duplicate-prevention handling for retries/reconnects (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Test happy path manually (new session greeting shown once)
- [ ] T009 Test edge cases (reconnect, parallel sessions, failed-first-attempt)
- [ ] T010 Confirm `spec.md`, `plan.md`, and `tasks.md` remain consistent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
