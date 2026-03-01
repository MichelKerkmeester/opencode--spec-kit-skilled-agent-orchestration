---
title: "Implementation Plan: Make spec_kit Commands Codex-Compatible [010-speckit-codex-compatibility/plan]"
description: "Made 7 spec_kit command .md files and 11 YAML workflow files Codex-compatible using a three-pronged approach: (A) strip agent routing sections from .md, (B) add CONSTRAINTS anti..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "make"
  - "spec"
  - "kit"
  - "010"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Make spec_kit Commands Codex-Compatible

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_DECLARED_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (.md), YAML (.yaml) |
| **Framework** | None (config file refactoring) |
| **Storage** | File-based (no database) |
| **Testing** | Manual verification, grep-based automated checks |

### Overview

Made 7 spec_kit command `.md` files and 11 YAML workflow files Codex-compatible using a three-pronged approach: (A) strip agent routing sections from `.md`, (B) add CONSTRAINTS anti-dispatch guards to `.md`, (C) restructure YAML `agent_routing` to `agent_availability`. Execution proceeded file-by-file across 8 phases, one command at a time.

- **Level**: 3

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (grep-based)
- [x] Root causes identified (5 vectors)
- [x] Three-pronged approach designed

### Definition of Done

- [x] All 7 `.md` files stripped of agent routing sections
- [x] All 7 `.md` files have CONSTRAINTS section
- [x] All 11 YAML files restructured (agent_routing -> agent_availability)
- [x] All grep-based success criteria pass (SC-001 through SC-005)
- [x] Checklist.md fully verified

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

File-based configuration refactoring pattern: strip -> constrain -> restructure.

### Key Components

- **`.md` Command Files (Change A + B)**: Remove `## AGENT ROUTING` sections, dispatch templates, `## SUB-AGENT DELEGATION` sections. Add `## CONSTRAINTS` section with explicit anti-dispatch rules.
- **YAML Workflow Files (Change C)**: Rename `agent_routing` to `agent_availability`. Remove `dispatch:` and `agent: "@xxx"` fields. Add `condition:` and `not_for:` fields. Update YAML comments from "REFERENCE ONLY" to "AGENT AVAILABILITY (conditional)".

### Data Flow

```
Before (vulnerable):
  .md file: ## AGENT ROUTING -> @agent dispatch tables -> Codex reads as action
  YAML file: agent_routing: -> dispatch: "Task tool -> @agent" -> Codex executes

After (safe):
  .md file: ## CONSTRAINTS -> "DO NOT dispatch" rules -> Codex reads as restriction
  YAML file: agent_availability: -> condition: "only when..." -> Codex reads as metadata
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (Completed)

- [x] Create spec folder with Level 2 artifacts (T001)

### Phase 2: complete.md + YAMLs (Completed)

- [x] Modify complete.md: strip AGENT ROUTING, add CONSTRAINTS (T002)
- [x] Modify spec_kit_complete_auto.yaml: agent_routing -> agent_availability (T003)
- [x] Modify spec_kit_complete_confirm.yaml: agent_routing -> agent_availability (T004)

### Phase 3: implement.md + YAMLs (Completed)

- [x] Modify implement.md: strip AGENT ROUTING, add CONSTRAINTS (T005)
- [x] Modify spec_kit_implement_auto.yaml: agent_routing -> agent_availability (T006)
- [x] Modify spec_kit_implement_confirm.yaml: agent_routing -> agent_availability (T007)

### Phase 4: debug.md + YAMLs (Completed)

- [x] Modify debug.md: strip AGENT ROUTING + SUB-AGENT DELEGATION, add CONSTRAINTS (T008)
- [x] Modify spec_kit_debug_auto.yaml: agent_routing -> agent_availability (T009)
- [x] Modify spec_kit_debug_confirm.yaml: agent_routing -> agent_availability (T010)

### Phase 5: handover.md + YAML (Completed)

- [x] Modify handover.md: strip SUB-AGENT DELEGATION, add CONSTRAINTS (T011)
- [x] Modify spec_kit_handover_full.yaml: agent_routing -> agent_availability (T012)

### Phase 6: plan.md + YAMLs (Completed)

- [x] Modify plan.md: strip AGENT ROUTING, add CONSTRAINTS (T013)
- [x] Modify spec_kit_plan_auto.yaml: agent_routing -> agent_availability (T014)
- [x] Modify spec_kit_plan_confirm.yaml: agent_routing -> agent_availability (T015)

### Phase 7: research.md + YAMLs (Completed)

- [x] Modify research.md: strip AGENT ROUTING, add CONSTRAINTS (T016)
- [x] Modify spec_kit_research_auto.yaml: agent_routing -> agent_availability (T017)
- [x] Modify spec_kit_research_confirm.yaml: agent_routing -> agent_availability (T018)

### Phase 8: resume.md + Verify (Completed)

- [x] Modify resume.md: add CONSTRAINTS only (T019)
- [x] Verify symlink covers both locations (T020)

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep Verification | All 18 files for disallowed patterns | `grep -r` against spec_kit directory |
| Grep Verification | All 7 .md files for CONSTRAINTS section | `grep -rl "## CONSTRAINTS"` |
| Grep Verification | All 11 YAMLs for agent_availability | `grep -r "agent_availability"` |
| Manual | Spot-check command execution with Claude | Manual command invocation |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | - | - | No external dependencies |

All changes are self-contained within `.opencode/command/spec_kit/` and its `assets/` subdirectory. The symlink at `.claude/commands/spec_kit/` automatically reflects changes.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Commands fail or agent routing broken for Claude
- **Procedure**: Git revert the commit; all changes are in a single commit on `main`

<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) --> Phase 2 (complete) --> Phase 3 (implement) --> Phase 4 (debug)
                                                                         |
Phase 5 (handover) --> Phase 6 (plan) --> Phase 7 (research) --> Phase 8 (resume + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Setup | None | All subsequent phases |
| Phase 2-7: Per-command changes | Phase 1 | Phase 8 (verification) |
| Phase 8: resume + verify | All prior phases | None |

Note: Phases 2-7 are logically independent (each command is self-contained) but were executed serially for safety.

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Setup | Low | 10 min |
| Phase 2-4: 3 commands + 6 YAMLs | Medium | 30-45 min |
| Phase 5-7: 3 commands + 5 YAMLs | Medium | 30-45 min |
| Phase 8: resume + verify | Low | 15 min |
| **Total** | | **~90 min (single session)** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Changes on main branch (no separate branch needed for config refactoring)
- [x] Pre-refactor state in git history
- [x] Grep-based verification after each phase

### Rollback Procedure

1. Identify failing command via manual testing
2. Git revert to pre-refactor commit
3. Re-test commands

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A (file-based, git-managed)

<!-- /ANCHOR:enhanced-rollback -->

---

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐
│   Phase 1    │
│    Setup     │
│   (10 min)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Phase 2    │  │   Phase 3    │  │   Phase 4    │
│  complete.md │──│ implement.md │──│   debug.md   │
│   + 2 YAML   │  │   + 2 YAML   │  │   + 2 YAML   │
└──────────────┘  └──────────────┘  └──────────────┘
       │
       ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Phase 5    │  │   Phase 6    │  │   Phase 7    │
│ handover.md  │──│   plan.md    │──│ research.md  │
│   + 1 YAML   │  │   + 2 YAML   │  │   + 2 YAML   │
└──────────────┘  └──────────────┘  └──────────────┘
       │
       ▼
┌──────────────┐
│   Phase 8    │
│  resume.md   │
│   + verify   │
└──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1: Setup | None | Spec folder | All phases |
| Phases 2-7: Per-command | Phase 1 | Modified files | Phase 8 |
| Phase 8: Verify | All phases | Final verification | None |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1: Setup** - 10 min - CRITICAL
2. **Phase 2: complete.md** - 15 min - CRITICAL (largest command, sets pattern)
3. **Phases 3-7: Remaining commands** - 60 min - CRITICAL (serial execution)
4. **Phase 8: resume + verify** - 15 min - CRITICAL

**Total Critical Path**: ~90 minutes (all phases serial)

**Parallel Opportunities**: Phases 2-7 are independent per-command and could theoretically run in parallel, but serial execution was chosen for safety on the first pass.

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Status |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | Spec folder created | Done |
| M2 | complete.md done | First command fully Codex-compatible | Done |
| M3 | All 7 .md files done | CONSTRAINTS in all, AGENT ROUTING in none | Done |
| M4 | All 11 YAMLs done | agent_availability everywhere, dispatch nowhere | Done |
| M5 | Final verification | All grep checks pass (SC-001 through SC-005) | Done |

<!-- /ANCHOR:milestones -->

---

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 3 PLAN - Make spec_kit Commands Codex-Compatible
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Status: Complete (2026-02-17)
-->
