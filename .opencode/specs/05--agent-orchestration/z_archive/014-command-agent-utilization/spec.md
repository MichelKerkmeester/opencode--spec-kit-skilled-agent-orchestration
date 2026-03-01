---
title: "Feature Specification: Command Agent Utilization Audit [014-command-agent-utilization/spec]"
description: "Create commands bypassed three AGENTS.md routing rules: spec folder docs were created inline (violating Rule 5: @speckit exclusive), codebase discovery used inline Glob/Grep (vi..."
trigger_phrases:
  - "feature"
  - "specification"
  - "command"
  - "agent"
  - "utilization"
  - "spec"
  - "014"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Command Agent Utilization Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Create commands bypassed three AGENTS.md routing rules: spec folder docs were created inline (violating Rule 5: @speckit exclusive), codebase discovery used inline Glob/Grep (violating Rule 4: @context exclusive), and no quality gate scored created artifacts. This spec audited all 18 create command files and added proper agent routing for @speckit, @context, and @review.

**Key Decisions**: Only 4 of 12 YAML files needed Phase 1+2 changes (scoped by actual step existence, not plan assumption); @review gate is non-blocking (advisory quality scoring).

**Critical Dependencies**: AGENTS.md routing rules (orchestrate.md §3-§5) define the enforcement requirements.

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-14 |
| **Completed** | 2026-02-14 |
| **Parent** | 05--agent-orchestration |
| **Related** | 012-context-model-comparison, 013-agent-haiku-compatibility |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Create commands violated three AGENTS.md agent routing rules:

1. **Rule 5 violation**: `create_skill` and `create_agent` workflows created `spec.md` and `plan.md` inline using Write/Edit, bypassing @speckit's template enforcement, Level validation, and quality standards.
2. **Rule 4 violation**: `create_skill` and `create_agent` workflows performed codebase discovery using inline Glob/Grep tool calls, bypassing @context's memory-first retrieval and prior work detection.
3. **Missing quality gate**: No create command invoked @review to quality-score created artifacts against the 100-point rubric (Accuracy 40%, Completeness 35%, Consistency 25%).

### Purpose

Bring all create commands into compliance with AGENTS.md routing rules by routing spec folder creation through @speckit, discovery through @context, and adding @review quality gates to all 12 create YAML workflows.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Route spec folder setup through @speckit in applicable create YAML workflows
- Route discovery steps through @context in applicable create YAML workflows
- Add @review quality gate step to all 12 create YAML workflows
- Update all 6 create MD reference files with Agent Routing sections

### Out of Scope

- spec_kit commands (already correctly use agents)
- memory commands (use MCP tools directly, no agent dispatch needed)
- agent_router (identity adoption paradigm, different from dispatch)
- Changing agent definitions themselves
- Modifying the AGENTS.md rules

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/create/assets/create_skill_auto.yaml` | Modify | Phase 1+2+3: @speckit, @context, @review |
| `.opencode/command/create/assets/create_skill_confirm.yaml` | Modify | Phase 1+2+3: @speckit, @context, @review |
| `.opencode/command/create/assets/create_agent_auto.yaml` | Modify | Phase 1+2+3: @speckit, @context, @review |
| `.opencode/command/create/assets/create_agent_confirm.yaml` | Modify | Phase 1+2+3: @speckit, @context, @review |
| `.opencode/command/create/assets/create_folder_readme_auto.yaml` | Modify | Phase 3 only: @review |
| `.opencode/command/create/assets/create_folder_readme_confirm.yaml` | Modify | Phase 3 only: @review |
| `.opencode/command/create/assets/create_install_guide_auto.yaml` | Modify | Phase 3 only: @review |
| `.opencode/command/create/assets/create_install_guide_confirm.yaml` | Modify | Phase 3 only: @review |
| `.opencode/command/create/assets/create_skill_asset_auto.yaml` | Modify | Phase 3 only: @review |
| `.opencode/command/create/assets/create_skill_asset_confirm.yaml` | Modify | Phase 3 only: @review |
| `.opencode/command/create/assets/create_skill_reference_auto.yaml` | Modify | Phase 3 only: @review |
| `.opencode/command/create/assets/create_skill_reference_confirm.yaml` | Modify | Phase 3 only: @review |
| `.opencode/command/create/skill.md` | Modify | Agent Routing section (3 agents) |
| `.opencode/command/create/agent.md` | Modify | Agent Routing section (3 agents) |
| `.opencode/command/create/folder_readme.md` | Modify | Agent Routing section (1 agent) |
| `.opencode/command/create/install_guide.md` | Modify | Agent Routing section (1 agent) |
| `.opencode/command/create/skill_asset.md` | Modify | Agent Routing section (1 agent) |
| `.opencode/command/create/skill_reference.md` | Modify | Agent Routing section (1 agent) |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Route spec folder creation through @speckit | `step_2_spec_folder_setup` (skill) and `step_1c_spec_folder_setup` (agent) contain `agent_routing` with `agent: "@speckit"` and outputs say `created_via_speckit` |
| REQ-002 | Route discovery through @context | `step_1b_skill_discovery` and `step_1b_agent_discovery` contain `agent_routing` with `agent: "@context"` and no inline Glob/Grep tool calls |
| REQ-003 | Add @review quality gate to all 12 YAML files | Each file contains a `quality_review` step with `agent: "@review"`, 100-point rubric, threshold 70, `blocking: false` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Update all 6 MD reference files with Agent Routing section | Each MD file has an "Agent Routing" section with correct step-agent mapping table |
| REQ-005 | Confirm YAML files have no remaining inline spec folder Write calls | grep for `Initialize spec.md` and `created_with_context` returns zero results |
| REQ-006 | Confirm YAML files have no remaining inline discovery tool calls | grep for `tool: Glob` and `tool: Grep` in discovery steps returns zero results |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 applicable YAML files route spec folder setup through @speckit with `agent_routing` block
- **SC-002**: All 4 applicable YAML files route discovery through @context with `agent_routing` block
- **SC-003**: All 12 YAML files contain @review quality gate step with consistent structure
- **SC-004**: All 6 MD files contain Agent Routing section with correct agent table
- **SC-005**: Zero grep matches for inline patterns (`Initialize spec.md`, `tool: Glob`, `tool: Grep` in discovery steps)

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | AGENTS.md routing rules | Defines enforcement requirements | Rules already stable and documented |
| Risk | Plan overstated scope (12 files vs 4) | Med | Verified via grep before editing — only 4 files have spec_folder_setup |
| Risk | Auto/confirm mode divergence | Low | Confirm files mirror auto files with added checkpoint blocks |
| Dependency | Symlink mirroring (.claude/commands/) | Auto-propagates changes | No separate mirroring work needed |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Consistency

- **NFR-C01**: All `agent_routing` blocks follow the same 5-field structure: `agent`, `agent_file`, `rule_reference`, `dispatch`, `fallback`/`blocking`
- **NFR-C02**: Auto YAML files have no checkpoint blocks; confirm YAML files have checkpoint blocks with 3 options

### Pattern Compliance

- **NFR-P01**: All agent routing references cite the specific AGENTS.md rule (Rule 4, Rule 5, or §3)
- **NFR-P02**: All @review steps use identical rubric weighting (Accuracy 40%, Completeness 35%, Consistency 25%)

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Scope Discovery

- **8 of 12 YAML files lack spec_folder_setup**: folder_readme, install_guide, skill_asset, skill_reference create files at predefined locations — they are exempt from spec folder creation per their own Gate 3 EXEMPT status
- **8 of 12 YAML files lack discovery steps**: Only skill and agent commands have similarity search before creation

### Mode Differentiation

- Auto files: quality_review step has no checkpoint (runs without approval)
- Confirm files: quality_review step has checkpoint with A) Accept, B) View findings, C) Address issues

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 18 files modified, 2 systems (YAML workflows + MD references) |
| Risk | 8/25 | No auth, no API, no breaking changes — documentation-level edits |
| Research | 12/20 | Needed to audit all 12 YAML files to determine actual scope |
| Multi-Agent | 10/15 | 3 agent types (@speckit, @context, @review) routed |
| Coordination | 8/15 | Auto/confirm pairs must stay synchronized |
| **Total** | **58/100** | **Level 3** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Plan assumed 12 files for Phase 1, actual was 4 | M | Occurred | Verified via grep before editing |
| R-002 | Confirm YAML checkpoints out of sync with auto | L | L | Applied identical patterns with added checkpoint block |
| R-003 | @review blocking could slow workflows | M | L | Set `blocking: false` — advisory only |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Spec Folder Quality (Priority: P0)

**As a** create workflow, **I want** spec folder docs created via @speckit, **so that** spec.md and plan.md follow template standards and pass Level validation.

**Acceptance Criteria**:
1. Given a `/create:skill` invocation, When the spec folder setup step runs, Then @speckit is dispatched to create spec.md and plan.md

### US-002: Memory-First Discovery (Priority: P0)

**As a** create workflow, **I want** discovery routed through @context, **so that** prior work and memory are checked before creating potentially duplicate skills/agents.

**Acceptance Criteria**:
1. Given a `/create:skill` invocation, When the discovery step runs, Then @context performs memory-first retrieval before codebase search

### US-003: Quality Scoring (Priority: P1)

**As a** user, **I want** created artifacts quality-scored by @review, **so that** I receive feedback on the quality of generated skills, agents, READMEs, and guides.

**Acceptance Criteria**:
1. Given any create workflow completes artifact generation, When the quality review step runs, Then @review scores against 100-point rubric with threshold 70

### US-004: Consistent MD Documentation (Priority: P1)

**As a** developer reading command reference files, **I want** Agent Routing sections in all create MD files, **so that** I know which agents are dispatched at which steps.

**Acceptance Criteria**:
1. Given any create command MD file, When I look for Agent Routing, Then a table shows step-agent-rule-purpose mapping

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None remaining — all resolved during implementation.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 3 SPEC — Retroactive documentation for completed implementation
Created post-implementation to document spec 014
-->
