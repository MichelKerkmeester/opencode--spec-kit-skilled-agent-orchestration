---
title: "Task Breakdown: Agent System Upgrade [003-agent-system-upgrade/tasks]"
description: "Phase 1 (Orchestration)"
trigger_phrases:
  - "task"
  - "breakdown"
  - "agent"
  - "system"
  - "upgrade"
  - "tasks"
  - "003"
importance_tier: "normal"
contextType: "implementation"
---
# Task Breakdown: Agent System Upgrade

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.0 -->

---

<!-- ANCHOR:task-summary -->
## TASK SUMMARY

| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| Phase 1: Orchestration | 25 | 25 | Complete |
| Phase 2: Command Integration | 22 | 22 | Complete |
| Phase 3: Research & Debug | 15 | 15 | Complete |
| **Total** | **62** | **62** | **Complete** |

---

<!-- /ANCHOR:task-summary -->


<!-- ANCHOR:phase-1-orchestration-patterns -->
## PHASE 1: ORCHESTRATION PATTERNS

### Foundation Tasks (T001-T008)

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T001 | Implement Circuit Breaker pattern in orchestrate.md | P0 | Complete |
| T002 | Add CLOSED/OPEN/HALF-OPEN state machine | P0 | Complete |
| T003 | Configure 3-failure threshold and 60s timeout | P0 | Complete |
| T004 | Implement Task Cancellation Protocol (SOFT/HARD) | P1 | Complete |
| T005 | Create Multi-Stage Quality Gates section | P0 | Complete |
| T006 | Define pre-execution gate (scope completeness) | P0 | Complete |
| T007 | Define mid-execution gate (artifact validation) | P0 | Complete |
| T008 | Define post-execution gate (output quality, threshold 70) | P0 | Complete |

### Resilience Tasks (T009-T014)

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T009 | Implement Saga Compensation Pattern | P0 | Complete |
| T010 | Create compensation registry with reverse-order execution | P0 | Complete |
| T011 | Add Conditional Branching Syntax (IF/THEN/ELSE) | P0 | Complete |
| T012 | Support 3 levels of nesting for conditionals | P1 | Complete |
| T013 | Implement Resource Budgeting (50K default) | P0 | Complete |
| T014 | Add 80% warning and 100% halt thresholds | P0 | Complete |

### Advanced Tasks (T015-T019)

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T015 | Add Event-Driven Triggers (OnError, OnTimeout, etc.) | P1 | Complete |
| T016 | Implement Caching Layer with TTL | P2 | Complete |
| T017 | Add Incremental Checkpointing (5 tasks or 10 tool calls) | P0 | Complete |
| T018 | Create Mermaid Workflow Visualization section | P2 | Complete |
| T019 | Document Sub-Orchestrator Pattern (DEFERRED) | P2 | Deferred |

### Agent Tasks (T020-T025)

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T020 | Create @review agent (code quality specialist) | P0 | Complete |
| T021 | Create @research agent (9-step workflow) | P0 | Complete |
| T022 | Create @speckit agent (spec folder documentation) | P0 | Complete |
| T023 | ~~Create @security agent~~ (DELETED - use mcp-narsil) | P1 | Deleted |
| T024 | ~~Create @tester agent~~ (DELETED - use workflows-code) | P1 | Deleted |
| T025 | Create symlinks in .claude/agents/ | P1 | Complete |

---

<!-- /ANCHOR:phase-1-orchestration-patterns -->


<!-- ANCHOR:phase-2-command-integration -->
## PHASE 2: COMMAND INTEGRATION

### Research Command (T101-T105)

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T101 | Add @research agent routing to research.md | P0 | Complete |
| T102 | Configure Steps 3-7 dispatch to @research | P0 | Complete |
| T103 | Add fallback to "general" agent | P0 | Complete |
| T104 | Add Quality Gates section to research.md | P1 | Complete |
| T105 | Add Circuit Breaker section to research.md | P1 | Complete |

### Plan Command (T106-T110)

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T106 | Add @speckit agent routing to plan.md | P0 | Complete |
| T107 | Configure Step 3 dispatch to @speckit | P0 | Complete |
| T108 | Add fallback to "general" agent | P0 | Complete |
| T109 | Add Quality Gates section to plan.md | P1 | Complete |
| T110 | Add Circuit Breaker section to plan.md | P1 | Complete |

### Implement Command (T111-T115)

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T111 | Add @review agent routing to implement.md | P0 | Complete |
| T112 | Configure Step 11 dispatch to @review (blocking) | P0 | Complete |
| T113 | Add fallback to "general" agent | P0 | Complete |
| T114 | Add Quality Gates section to implement.md | P1 | Complete |
| T115 | Add Circuit Breaker section to implement.md | P1 | Complete |

### Complete Command (T116-T118)

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T116 | Add multi-agent routing to complete.md | P0 | Complete |
| T117 | Add Quality Gates section to complete.md | P1 | Complete |
| T118 | Add Circuit Breaker section to complete.md | P1 | Complete |

### YAML Configuration (T119-T122)

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T119 | Update all *_auto.yaml files with agent_routing | P0 | Complete |
| T120 | Update all *_confirm.yaml files with agent_routing | P0 | Complete |
| T121 | Add quality_gates blocks to all YAML files | P1 | Complete |
| T122 | Add circuit_breaker blocks to all YAML files | P1 | Complete |

---

<!-- /ANCHOR:phase-2-command-integration -->


<!-- ANCHOR:phase-3-research-debug-improvements -->
## PHASE 3: RESEARCH & DEBUG IMPROVEMENTS

### Research Agent Enhancements (T201-T205)

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T201 | Add Workflow-to-Template Mapping (Section 3.5) | P0 | Complete |
| T202 | Add Evidence Quality Rubric (grades A-F) | P1 | Complete |
| T203 | Add Tool Routing Guidance (Narsil vs Grep vs Glob) | P1 | Complete |
| T204 | Update parallel dispatch thresholds | P2 | Complete |
| T205 | Verify section numbering consistency | P1 | Complete |

### Research Command Enhancements (T206-T208)

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T206 | Add Memory Integration examples | P1 | Complete |
| T207 | Add Circuit Breaker scenario examples | P2 | Complete |
| T208 | Add Mode examples (:auto, :confirm, :with-research) | P1 | Complete |

### Debug Agent Creation (T209-T212)

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T209 | Create @debug agent file | P0 | Complete |
| T210 | Implement 4-phase methodology (OAHF) | P0 | Complete |
| T211 | Define structured response formats | P0 | Complete |
| T212 | Add anti-patterns and escalation logic | P1 | Complete |

### Model & Compatibility (T213-T215)

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T213 | Standardize all agents to Opus 4.5 default | P0 | Complete |
| T214 | Update 10 files with dual subagent_type references | P0 | Complete |
| T215 | Create @debug symlink in .claude/agents/ | P1 | Complete |

---

<!-- /ANCHOR:phase-3-research-debug-improvements -->


<!-- ANCHOR:consolidation-tasks -->
## CONSOLIDATION TASKS

| ID | Task | Priority | Status |
|----|------|----------|--------|
| T301 | Delete 005-agent-testing-suite folder | P0 | Complete |
| T302 | Create 003-agent-system-upgrade folder | P0 | Complete |
| T303 | Merge spec.md from 003, 004, 006 | P0 | Complete |
| T304 | Merge plan.md | P0 | Complete |
| T305 | Merge tasks.md | P0 | Complete |
| T306 | Merge checklist.md | P0 | Complete |
| T307 | Merge decision-record.md | P0 | Complete |
| T308 | Merge research.md | P1 | Complete |
| T309 | Preserve ai-protocols.md from 006 | P1 | Complete |
| T310 | Create implementation-summary.md | P0 | Complete |
| T311 | Migrate memory files from 006 | P0 | Complete |
| T312 | Delete old spec folders (003, 004, 006) | P0 | Complete |
| T313 | Re-index memory database | P0 | Complete |

---

<!-- /ANCHOR:consolidation-tasks -->


<!-- ANCHOR:task-dependencies -->
## TASK DEPENDENCIES

```
Phase 1 (Orchestration)
    └── Phase 2 (Command Integration) [depends on agents existing]
            └── Phase 3 (Research/Debug) [depends on routing existing]
                    └── Consolidation [depends on all phases complete]
```

---

<!-- /ANCHOR:task-dependencies -->


<!-- ANCHOR:deleted-tasks -->
## DELETED TASKS

| ID | Task | Reason |
|----|------|--------|
| T023 | Create @security agent | Consolidated - use mcp-narsil |
| T024 | Create @tester agent | Consolidated - use workflows-code |
| T019 | Sub-Orchestrator Pattern | Deferred - YAGNI |

---

<!--
LEVEL 3+ CONSOLIDATED TASKS
Total: 62 tasks + 13 consolidation tasks
Status: Complete
-->

<!-- /ANCHOR:deleted-tasks -->
