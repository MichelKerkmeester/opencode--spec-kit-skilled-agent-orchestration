---
title: "Implementation Plan: Agent System Upgrade [003-agent-system-upgrade/plan]"
description: "This plan consolidates three workstreams that were executed in sequence"
trigger_phrases:
  - "implementation"
  - "plan"
  - "agent"
  - "system"
  - "upgrade"
  - "003"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Agent System Upgrade

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.0 -->

---

<!-- ANCHOR:overview -->
## OVERVIEW

| Attribute | Value |
|-----------|-------|
| **Spec Folder** | `.opencode/specs/05--agent-orchestration/z_archive/003-agent-system-upgrade` |
| **Status** | Complete (Consolidated) |
| **Phases** | 3 (Orchestration + Command Integration + Research/Debug) |
| **Total Deliverables** | 15+ files modified/created |

This plan consolidates three workstreams that were executed in sequence:
1. **Phase 1**: Orchestration Patterns (from 003)
2. **Phase 2**: Command Integration (from 004)
3. **Phase 3**: Research & Debug Improvements (from 006)

---

<!-- /ANCHOR:overview -->


<!-- ANCHOR:phase-1-orchestration-patterns -->
## PHASE 1: ORCHESTRATION PATTERNS

**Source**: `003-orchestration-upgrade`
**Duration**: 2026-01-21 to 2026-01-22
**Status**: Complete

### 1.1 Foundation Patterns

| Deliverable | Description | Status |
|-------------|-------------|--------|
| Circuit Breaker | 3-state pattern (CLOSED/OPEN/HALF-OPEN) | Complete |
| Task Cancellation | SOFT/HARD signals, graceful termination | Complete |
| Quality Gates | Pre/Mid/Post execution, 70 threshold | Complete |

### 1.2 Resilience Patterns

| Deliverable | Description | Status |
|-------------|-------------|--------|
| Saga Compensation | Reverse-order rollback, compensation registry | Complete |
| Conditional Branching | IF/THEN/ELSE, 3 levels max nesting | Complete |
| Resource Budgeting | 50K default, 80% warning, 100% halt | Complete |

### 1.3 Advanced Patterns

| Deliverable | Description | Status |
|-------------|-------------|--------|
| Sub-Orchestrator | For workflows >10 tasks (DEFERRED) | Deferred |
| Event-Driven Triggers | OnError, OnTimeout, OnComplete | Complete |
| Caching Layer | TTL-based (5min code, 10min memory) | Complete |

### 1.4 New Agents

| Agent | Description | Status |
|-------|-------------|--------|
| @review | Code review, quality scoring (renamed from @reviewer) | Complete |
| @research | 9-step technical investigation workflow | Complete |
| @speckit | Spec folder documentation Level 1-3+ | Complete |
| @security | ~~OWASP/CWE scanning~~ (DELETED - use mcp-narsil) | Deleted |
| @tester | ~~Test generation~~ (DELETED - use workflows-code) | Deleted |

---

<!-- /ANCHOR:phase-1-orchestration-patterns -->


<!-- ANCHOR:phase-2-command-integration -->
## PHASE 2: COMMAND INTEGRATION

**Source**: `004-command-integration`
**Duration**: 2026-01-22
**Status**: Complete

### 2.1 Agent Routing Integration

| Command | Agent | Steps Routed | Status |
|---------|-------|--------------|--------|
| `/spec_kit:research` | @research | Steps 3-7 | Complete |
| `/spec_kit:plan` | @speckit | Step 3 | Complete |
| `/spec_kit:implement` | @review | Step 11 | Complete |
| `/spec_kit:complete` | All three | Multi-phase | Complete |

### 2.2 Quality Gates in Commands

| Gate | Location | Checks | Status |
|------|----------|--------|--------|
| Pre-execution | Before Step 1 | Input validation | Complete |
| Mid-execution | Phase transitions | Artifact existence | Complete |
| Post-execution | Before completion | Output quality | Complete |

### 2.3 Circuit Breaker in Commands

| Configuration | Value | Status |
|---------------|-------|--------|
| Failure threshold | 3 | Complete |
| Recovery timeout | 60s | Complete |
| Half-open requests | 1 | Complete |

### 2.4 YAML Configuration Files (13 files)

- `spec_kit_research_auto.yaml` - Complete
- `spec_kit_research_confirm.yaml` - Complete
- `spec_kit_plan_auto.yaml` - Complete
- `spec_kit_plan_confirm.yaml` - Complete
- `spec_kit_implement_auto.yaml` - Complete
- `spec_kit_implement_confirm.yaml` - Complete
- `spec_kit_complete_auto.yaml` - Complete
- `spec_kit_complete_confirm.yaml` - Complete

---

<!-- /ANCHOR:phase-2-command-integration -->


<!-- ANCHOR:phase-3-research-debug-improvements -->
## PHASE 3: RESEARCH & DEBUG IMPROVEMENTS

**Source**: `006-research-debug-improvements`
**Duration**: 2026-01-22 to 2026-01-23
**Status**: Complete

### 3.1 Research Agent Enhancements

| Enhancement | Description | Status |
|-------------|-------------|--------|
| Workflow-to-Template Mapping | Section 3.5 mapping steps to template sections | Complete |
| Evidence Quality Rubric | Grades A-F for source evaluation | Complete |
| Tool Routing Guidance | Narsil vs Grep vs Glob decision tree | Complete |

### 3.2 Research Command Enhancements

| Enhancement | Description | Status |
|-------------|-------------|--------|
| Memory Integration | `memory_match_triggers()` before research | Complete |
| Circuit Breaker Examples | Source unavailable, conflicting evidence | Complete |
| Mode Examples | :auto, :confirm, :with-research | Complete |

### 3.3 Debug Agent Creation

| Component | Description | Status |
|-----------|-------------|--------|
| 4-Phase Methodology | Observe → Analyze → Hypothesize → Fix | Complete |
| Structured Handoff | Error, files, reproduction, prior attempts | Complete |
| Response Formats | Success, Blocked, Escalation | Complete |
| Anti-Patterns | No symptom-fixing, no multiple changes | Complete |

### 3.4 Model Preference Standardization

| Agent | Default Model | Override | Status |
|-------|---------------|----------|--------|
| @orchestrate | Opus 4.5 | Sonnet on request | Complete |
| @review | Opus 4.5 | Sonnet on request | Complete |
| @research | Opus 4.5 | Sonnet on request | Complete |
| @speckit | Opus 4.5 | Sonnet on request | Complete |
| @debug | Opus 4.5 | Sonnet on request | Complete |
| @write | Opus 4.5 | Sonnet on request | Complete |

### 3.5 Cross-Environment Compatibility

| Item | Claude Code | OpenCode | Status |
|------|-------------|----------|--------|
| General agent type | `general-purpose` | `general` | Both documented |
| Agent symlinks | `.claude/agents/` | N/A | Complete |
| Subagent dispatch | Task tool | Task tool | Complete |

---

<!-- /ANCHOR:phase-3-research-debug-improvements -->


<!-- ANCHOR:implementation-approach -->
## IMPLEMENTATION APPROACH

### Parallel Agent Dispatch

All three phases used parallel agent dispatch for implementation:
- Phase 1: 10 Opus agents for pattern implementation
- Phase 2: 5 Opus agents for command updates
- Phase 3: 3 Opus agents for research/debug

### Verification Strategy

Each phase included verification agents:
- Pattern verification (Phase 1)
- Integration verification (Phase 2)
- Functionality verification (Phase 3)

### Consolidation Process (2026-01-23)

1. Deleted `005-agent-testing-suite` (not implemented)
2. Merged 003, 004, 006 into `003-agent-system-upgrade`
3. Created unified Level 3+ documentation
4. Preserved memory context from 006
5. Re-indexed memory database

---

<!-- /ANCHOR:implementation-approach -->


<!-- ANCHOR:technical-approach -->
## TECHNICAL APPROACH

### Agent Architecture

```
Orchestrator (primary)
    ├── @review (secondary) - Code quality
    ├── @research (secondary) - Investigation
    ├── @speckit (secondary) - Documentation
    ├── @debug (secondary) - Debugging
    └── @write (primary) - Generation
```

### Command-Agent Routing

```
/spec_kit:research → @research (Steps 3-7)
/spec_kit:plan → @speckit (Step 3)
/spec_kit:implement → @review (Step 11)
/spec_kit:complete → Multi-agent coordination
/spec_kit:debug → @debug (4-phase methodology)
```

### Fault Tolerance Flow

```
Request → Circuit Breaker Check
           ↓
    [CLOSED] → Execute → Quality Gate
                            ↓
                     [Pass] → Continue
                     [Fail] → Retry/Revise
           ↓
    [OPEN] → Fast-fail → Wait timeout
           ↓
    [HALF-OPEN] → Test request → Success/Fail
```

---

<!-- /ANCHOR:technical-approach -->


<!-- ANCHOR:files-changed-summary -->
## FILES CHANGED SUMMARY

### Agent Files (6)

| File | Action | Lines |
|------|--------|-------|
| `orchestrate.md` | Modified | ~1200 |
| `review.md` | Created | ~600 |
| `research.md` | Created/Enhanced | ~400 |
| `speckit.md` | Created | ~350 |
| `debug.md` | Created | ~300 |
| `write.md` | Modified | ~300 |

### Command Files (4)

| File | Action | Lines Added |
|------|--------|-------------|
| `research.md` | Modified | ~150 |
| `plan.md` | Modified | ~120 |
| `implement.md` | Modified | ~130 |
| `complete.md` | Modified | ~180 |

### YAML Configuration (13)

All files updated with `agent_routing`, `quality_gates`, `circuit_breaker` blocks.

### Symlinks (6)

All agents linked in `.claude/agents/`:
- orchestrate.md, review.md, research.md, speckit.md, debug.md, write.md

---

<!-- /ANCHOR:files-changed-summary -->


<!-- ANCHOR:lessons-learned -->
## LESSONS LEARNED

1. **Parallel dispatch accelerates**: 10+ agents in parallel significantly speeds implementation
2. **Verification timing**: Run verification after implementation completes, not in parallel
3. **Consolidation value**: Merging related specs reduces navigation overhead
4. **Cross-environment testing**: Test in both Claude Code and OpenCode early
5. **Model standardization**: Consistent defaults simplify agent behavior

---

<!-- /ANCHOR:lessons-learned -->


<!-- ANCHOR:next-steps-post-consolidation -->
## NEXT STEPS (Post-Consolidation)

1. **Runtime Testing** - Verify agent routing dispatches correctly
2. **Memory Re-indexing** - Update memory database with consolidated context
3. **User Documentation** - Update user-facing guides
4. **Monitoring** - Track agent selection patterns

---

<!--
LEVEL 3+ CONSOLIDATED PLAN
Merges: 003, 004, 006
Status: Complete
-->

<!-- /ANCHOR:next-steps-post-consolidation -->
