---
title: "Tasks: OpenCode Agent Path Only [018-opencode-agent-path-only/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "opencode"
  - "agent"
  - "path"
  - "only"
  - "018"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: OpenCode Agent Path Only

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
## Phase 1: Discovery

- [ ] T001 Run comprehensive grep to find all `.claude/agents` references
- [ ] T002 Run comprehensive grep to find all `.codex/agents` references
- [ ] T003 [P] Categorize findings by file type (runtime vs config vs informational)
- [ ] T004 Create list of files requiring changes
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Update AGENTS.md Section 7 (Agent Routing table) to use `.opencode/agent` paths only
- [ ] T006 Update `.opencode/skill/system-spec-kit/SKILL.md` agent exclusivity references
- [ ] T007 Review and update `.opencode/command/**/*.md` files for agent path references
- [ ] T008 [P] Add cross-platform convention notes to individual agent files (if missing)
- [ ] T009 Update any shell scripts that reference agent paths
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run validation grep: `grep -r "\.claude/agents\|\.codex/agents" AGENTS.md .opencode/`
- [ ] T011 Verify zero matches in active runtime documentation
- [ ] T012 Manual review of all changed files
- [ ] T013 Document cross-platform convention in implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Grep validation returns zero matches for alternate agent paths in runtime docs
- [ ] Cross-platform convention documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Validation Command**: `grep -r "\.claude/agents\|\.codex/agents" AGENTS.md .opencode/` (should return 0 runtime matches)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
