---
title: "Implementation Plan: Command Agent Utilization Audit [014-command-agent-utilization/plan]"
description: "Audit all 18 create command files (12 YAML workflows + 6 MD references) to ensure compliance with AGENTS.md routing rules. Route spec folder creation through @speckit (Rule 5), ..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "command"
  - "agent"
  - "utilization"
  - "014"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Command Agent Utilization Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML (workflow definitions) + Markdown (reference files) |
| **Framework** | OpenCode command system (.opencode/command/create/) |
| **Storage** | N/A |
| **Testing** | Grep verification + review agent validation |

### Overview

Audit all 18 create command files (12 YAML workflows + 6 MD references) to ensure compliance with AGENTS.md routing rules. Route spec folder creation through @speckit (Rule 5), codebase discovery through @context (Rule 4), and add @review quality gates (§3) to all create workflows.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear — three AGENTS.md violations identified
- [x] Success criteria measurable — grep-based verification for all changes
- [x] Dependencies identified — AGENTS.md rules stable, agent files exist

### Definition of Done
- [x] All acceptance criteria met (REQ-001 through REQ-006)
- [x] Verification passed (204/204 checks across Phase 1+2+3)
- [x] All 18 files modified with correct agent routing

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
YAML workflow definitions consumed by AI agents at command invocation time.

### Key Components
- **12 YAML workflow files**: Define step-by-step activities for create commands (6 command types x 2 modes each)
- **6 MD reference files**: Entry points that load YAML workflows, contain Agent Routing documentation
- **AGENTS.md (orchestrate.md)**: Defines routing rules that YAML workflows must comply with

### Data Flow
```
User invokes /create:* command
  -> MD file loads (entry point)
  -> YAML workflow executes step-by-step
    -> Step 1b: @context dispatched for discovery (skill/agent only)
    -> Step 2/1c: @speckit dispatched for spec folder (skill/agent only)
    -> Steps 3-8: Core creation workflow
    -> Step 5b/8b: @review dispatched for quality scoring (all commands)
    -> Step 6/9: Save context
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Route spec folder creation through @speckit (4 YAML)

Scope narrowed from plan's 12 files to 4 — only `create_skill` and `create_agent` have `spec_folder_setup` steps.

- [x] T001 Update `create_skill_auto.yaml` step_2_spec_folder_setup with @speckit routing
- [x] T002 Update `create_skill_confirm.yaml` step_2_spec_folder_setup with @speckit routing
- [x] T003 Update `create_agent_auto.yaml` step_1c_spec_folder_setup with @speckit routing
- [x] T004 Update `create_agent_confirm.yaml` step_1c_spec_folder_setup with @speckit routing

### Phase 2: Route discovery through @context (4 YAML)

- [x] T005 Update `create_skill_auto.yaml` step_1b_skill_discovery with @context routing
- [x] T006 Update `create_skill_confirm.yaml` step_1b_skill_discovery with @context routing
- [x] T007 Update `create_agent_auto.yaml` step_1b_agent_discovery with @context routing
- [x] T008 Update `create_agent_confirm.yaml` step_1b_agent_discovery with @context routing

### Phase 3: Add @review quality gate (12 YAML + 6 MD)

- [x] T009 Add quality_review step to all 6 auto YAML files
- [x] T010 Add quality_review step with checkpoint to all 6 confirm YAML files
- [x] T011 Add Agent Routing section to `skill.md` (3 agents: @context, @speckit, @review)
- [x] T012 Add Agent Routing section to `agent.md` (3 agents: @context, @speckit, @review)
- [x] T013 Add Agent Routing section to 4 remaining MD files (1 agent: @review each)

### Phase 4: Verification

- [x] T014 Grep verification: no inline patterns remain
- [x] T015 Review agent verification: Phase 1+2 (72/72 checks)
- [x] T016 Review agent verification: Phase 3 (132/132 checks)

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep | No inline Write/Glob/Grep in modified steps | `grep -r` across all YAML files |
| Review agent | Phase 1+2: 72 structural checks | @review agent with line-level evidence |
| Review agent | Phase 3: 132 structural checks | @review agent with line-level evidence |
| Manual | MD file Agent Routing sections | Visual verification of all 6 files |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| AGENTS.md routing rules | Internal | Green | Defines required routing patterns |
| Agent definition files | Internal | Green | @speckit, @context, @review must exist |
| Symlink mirroring | Internal | Green | .claude/commands/ auto-propagates |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Agent routing causes workflow failures or incorrect dispatch
- **Procedure**: `git checkout -- .opencode/command/create/` restores all files

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (@speckit) ──┐
                     ├──► Phase 3 (@review + MD) ──► Phase 4 (Verify)
Phase 2 (@context) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 4 |
| Phase 2 | None | Phase 4 |
| Phase 3 | None | Phase 4 |
| Phase 4 | Phase 1, 2, 3 | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: @speckit routing | Medium | 4 files, ~20 lines each |
| Phase 2: @context routing | Medium | 4 files, ~15 lines each |
| Phase 3: @review quality gate | Medium | 12 YAML + 6 MD files |
| Phase 4: Verification | Low | Grep + review agents |
| **Total** | **Medium** | **18 file modifications** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Current YAML files reviewed for existing structure
- [x] Plan scope verified against actual file contents

### Rollback Procedure
1. `git checkout -- .opencode/command/create/assets/` (all 12 YAML files)
2. `git checkout -- .opencode/command/create/*.md` (all 6 MD files)
3. Verify with grep that inline patterns are restored

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A

<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────────┐     ┌───────────────┐
│   Phase 1     │     │   Phase 2     │
│   @speckit    │     │   @context    │
│   (4 YAML)    │     │   (4 YAML)    │
└───────┬───────┘     └───────┬───────┘
        │                     │
        │  ┌───────────────┐  │
        └──│   Phase 3     │──┘
           │   @review     │
           │ (12 YAML+6 MD)│
           └───────┬───────┘
                   │
           ┌───────▼───────┐
           │   Phase 4     │
           │  Verification │
           │  (204 checks) │
           └───────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (@speckit) | None | 4 YAML with agent_routing | Phase 4 |
| Phase 2 (@context) | None | 4 YAML with agent_routing | Phase 4 |
| Phase 3 (@review) | None | 12 YAML + 6 MD with routing | Phase 4 |
| Phase 4 (Verify) | Phase 1, 2, 3 | Verification report | None |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1+2** (parallel) - 8 YAML files modified - CRITICAL
2. **Phase 3** (parallel with 1+2) - 18 files modified - CRITICAL
3. **Phase 4** - Verification via review agents - CRITICAL

**Total Critical Path**: Phases 1-3 parallel, then Phase 4 sequential

**Parallel Opportunities**:
- Phase 1, 2, and 3 are fully independent
- Within Phase 3: auto and confirm files can be edited in parallel

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Status |
|-----------|-------------|------------------|--------|
| M1 | Spec folder routing complete | 4 YAML files have @speckit in spec_folder_setup | Complete |
| M2 | Discovery routing complete | 4 YAML files have @context in discovery steps | Complete |
| M3 | Quality gates complete | 12 YAML + 6 MD files have @review routing | Complete |
| M4 | Verification passed | 204/204 checks pass | Complete |

<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Scope Reduction from 12 to 4 Files for Phase 1

**Status**: Accepted

**Context**: The original plan stated "All 12 create YAML files have a spec_folder_setup step." Grep analysis proved only 4 files have this step.

**Decision**: Apply Phase 1 changes to only the 4 applicable files (create_skill and create_agent, auto and confirm variants).

**Consequences**:
- Prevented incorrect modifications to 8 files that don't create spec folders
- Aligned changes with actual workflow structure

### ADR-002: Non-Blocking @review Gate

**Status**: Accepted

**Context**: @review quality scoring could block or advise. Blocking would prevent workflow completion on low scores.

**Decision**: Set `blocking: false` with `on_low_score` advisory at threshold 70.

**Consequences**:
- Workflows always complete regardless of score
- Low-quality artifacts still get flagged with improvement suggestions

See `decision-record.md` for full ADR details.

---

<!--
LEVEL 3 PLAN — Retroactive documentation for completed implementation
-->
