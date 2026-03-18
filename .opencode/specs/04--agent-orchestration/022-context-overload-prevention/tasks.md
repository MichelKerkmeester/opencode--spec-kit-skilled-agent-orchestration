---
title: "Tasks: Context Overload Prevention [022-context-overload-prevention/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "context"
  - "overload"
  - "prevention"
  - "022"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Context Overload Prevention

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
## Phase 1: Analysis

- [x] T001 Read source prompt 007 and identify all prevention logic sections
- [x] T002 Read Claude orchestrate.md and map existing coverage vs gaps
- [x] T003 [P] Read Copilot and ChatGPT orchestrate.md variants to identify runtime-specific differences
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add Context Pressure Response Protocol to Claude orchestrate.md section 7 (`.claude/agents/orchestrate.md`)
- [x] T005 Add Output Discipline to Claude orchestrate.md section 7 (`.claude/agents/orchestrate.md`)
- [x] T006 Add Compaction Recovery Protocol to Claude orchestrate.md section 6 (`.claude/agents/orchestrate.md`)
- [x] T007 Add Orchestrator Self-Protection Rules to Claude orchestrate.md section 8 (`.claude/agents/orchestrate.md`)
- [x] T008 Add 3 context-related anti-patterns to Claude orchestrate.md section 9 (`.claude/agents/orchestrate.md`)
- [x] T009 [P] Add all 5 sections to Copilot orchestrate.md with runtime adaptations (`.opencode/agent/orchestrate.md`)
- [x] T010 [P] Add all 5 sections to ChatGPT orchestrate.md with higher thresholds (`.opencode/agent/chatgpt/orchestrate.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification & Documentation

- [x] T011 Verify ChatGPT thresholds are proportionally higher (300 line / 4 file / >80 line)
- [x] T012 Verify Copilot/ChatGPT use "save context" instead of `/compact`
- [x] T013 Verify Copilot/ChatGPT reference AGENTS.md instead of CLAUDE.md in recovery
- [x] T014 Create changelog v2.0.8.0.md (`.opencode/changelog/03--agent-orchestration/v2.0.8.0.md`)
- [x] T015 Create retroactive spec folder 022
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
- **Changelog**: `.opencode/changelog/03--agent-orchestration/v2.0.8.0.md`
- **Source**: `Barter/Prompt Improver/export/007 - enhanced-cc-context-overload-prevention.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
