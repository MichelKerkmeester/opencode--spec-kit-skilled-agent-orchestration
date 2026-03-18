---
title: "Tasks: Sub-Agent Nesting Depth Control [019-incorrect-sub-agent-nesting/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "sub"
  - "agent"
  - "nesting"
  - "depth"
  - "019"
  - "incorrect"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Sub-Agent Nesting Depth Control

<!-- SPECKIT_LEVEL: 3 -->
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
## Phase 1: NDP Design

- [x] T001 Define 3-tier agent classification (ORCHESTRATOR, DISPATCHER, LEAF) (spec.md)
- [x] T002 Define absolute depth limit of 3 with counting rules (spec.md)
- [x] T003 Map all agents to their tiers (spec.md)
- [x] T004 Design depth field for Task Decomposition Format (spec.md)
- [x] T005 Write legal vs illegal nesting chain examples (plan.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation — Update orchestrate.md Files

### Base orchestrate.md (`.opencode/agent/orchestrate.md`)

- [x] T006 Add NDP section — now §2 in restructured 10-section layout
- [x] T007 Update Agent Routing table — Tier column added in §2
- [x] T008 Update Sub-Orchestrator Pattern — depth inheritance rule in §3, NDP reference
- [x] T009 Update Task Decomposition Format — `Depth` field in §3
- [x] T010 Update PDR template — `Depth` line in §3
- [x] T011 Add anti-patterns — 2 NDP anti-patterns in §9
- [x] T012 Add LEAF enforcement instruction — §2:168-172

### ChatGPT orchestrate.md (`.opencode/agent/chatgpt/orchestrate.md`)

- [x] T013 [P] Apply T006-T012 changes (byte-identical to base)

### Copilot orchestrate.md (`.opencode/agent/copilot/orchestrate.md`)

- [x] T014 [P] Apply T006-T012 changes (identical except frontmatter)
- [x] T015 Fix Section 11 conflict — conditional branching now in §3 subsection, no separate section
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Diff NDP sections across all 3 files — identical (chatgpt byte-identical, copilot 2-line frontmatter diff only)
- [x] T017 Verify every agent in routing table has Tier classification — 11 agents, all classified
- [x] T018 Trace workflow: Orch > @context > @explore — depth 0>1>2, legal
- [x] T019 Trace workflow: Orch > Sub-Orch > @general — depth 0>1>2, legal
- [x] T020 Trace workflow: Orch > @speckit — depth 0>1, LEAF confirmed
- [x] T021 Update checklist.md — all 20 items verified with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Cross-Cutting Improvements

- [x] T022 Full restructure 27→10 sections across all 3 orchestrate.md variants
- [x] T023 Add 7 semantic emojis aligned with context.md conventions
- [x] T024 Replace `workflows-code--web-dev`/`--full-stack` with `workflows-code--*` wildcard in all agent files (6 files: 3 orchestrate + 3 review)
- [x] T025 Sync all 8 copilot agents to `.claude/agents/` with CC frontmatter
- [x] T026 Create `02--agents` changelog folder and v1.0.0.0 entry
- [x] T027 Save context via generate-context.js
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (T016-T020)
- [x] All 3 orchestrate.md files synchronized
- [x] All .claude/agents files synced with copilot body + CC frontmatter
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS
- 4 phases: Design, Implementation, Verification, Cross-Cutting
- 27 tasks total
-->
