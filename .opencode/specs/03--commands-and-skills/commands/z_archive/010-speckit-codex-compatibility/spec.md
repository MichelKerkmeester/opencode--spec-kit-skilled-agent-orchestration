---
title: "Feature Specification: Make spec_kit Commands Codex-Compatible [010-speckit-codex-compatibility/spec]"
description: "Made 7 spec_kit command .md files and 11 YAML workflow files Codex-compatible using a three-pronged approach: strip agent routing sections from .md files, add explicit CONSTRAIN..."
trigger_phrases:
  - "feature"
  - "specification"
  - "make"
  - "spec"
  - "kit"
  - "010"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Make spec_kit Commands Codex-Compatible

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Made 7 spec_kit command `.md` files and 11 YAML workflow files Codex-compatible using a three-pronged approach: strip agent routing sections from `.md` files, add explicit CONSTRAINTS anti-dispatch guards, and restructure YAML `agent_routing` to `agent_availability` with non-imperative language.

**Key Decisions**: Three-pronged approach (strip + constrain + restructure) chosen over simpler alternatives that were either too weak (commenting) or too aggressive (full removal of agent metadata).

**Critical Dependencies**: None external. All changes are internal configuration refactoring across `.opencode/command/spec_kit/` files.

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-17 |
| **Completed** | 2026-02-17 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Codex (OpenAI's coding agent) misinterprets agent routing metadata in `.opencode/command/spec_kit/` command files as dispatch instructions, causing three failure modes:

1. **Premature review dispatch**: Codex dispatches `@review` to "review" the workflow prompt itself instead of only at the designated step
2. **Premature handover dispatch**: Codex dispatches `@handover` prematurely instead of waiting for user opt-in at the final step
3. **Unnecessary debug dispatch**: Codex dispatches `@debug` unnecessarily instead of only when `failure_count >= 3`

### Root Causes

1. `## AGENT ROUTING` sections in `.md` files with `@agent` names in tables are read as action items by Codex
2. `dispatch:` fields in YAML files with imperative `"Task tool -> @agent..."` strings look like executable prompts
3. Weak `<!-- REFERENCE ONLY -->` HTML comment guards that Codex ignores
4. Two-layer architecture (`.md` + YAML) creates double-exposure of agent references
5. YAML `agent_routing` uses dispatch-like language

### Purpose

Prevent Codex from prematurely dispatching agents when reading spec_kit command files, while preserving agent availability metadata for correct agent routing at the appropriate workflow steps.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 7 `.md` command files: strip agent routing sections, add CONSTRAINTS anti-dispatch guards
- 11 YAML workflow files: rename `agent_routing` to `agent_availability`, remove `dispatch:` fields, add `condition:` and `not_for:` fields
- Three-pronged approach: Change A (strip `.md`), Change B (add CONSTRAINTS), Change C (restructure YAML)

### Out of Scope

- Create commands (`.opencode/command/create/`) - handled by spec 011/012
- Resume YAML files (`spec_kit_resume_auto.yaml`, `spec_kit_resume_confirm.yaml`) - have no `agent_routing` section
- `.claude/commands/spec_kit/` is a symlink to `.opencode/command/spec_kit/`, so changes only needed once

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/complete.md` | Modify | Strip AGENT ROUTING + add CONSTRAINTS |
| `.opencode/command/spec_kit/implement.md` | Modify | Strip AGENT ROUTING + add CONSTRAINTS |
| `.opencode/command/spec_kit/debug.md` | Modify | Strip AGENT ROUTING + SUB-AGENT DELEGATION + add CONSTRAINTS |
| `.opencode/command/spec_kit/handover.md` | Modify | Strip SUB-AGENT DELEGATION + add CONSTRAINTS |
| `.opencode/command/spec_kit/plan.md` | Modify | Strip AGENT ROUTING + add CONSTRAINTS |
| `.opencode/command/spec_kit/research.md` | Modify | Strip AGENT ROUTING + add CONSTRAINTS |
| `.opencode/command/spec_kit/resume.md` | Modify | Add CONSTRAINTS only (no agent routing to strip) |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | Modify | agent_routing -> agent_availability, remove dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modify | agent_routing -> agent_availability, remove dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | Modify | agent_routing -> agent_availability, remove dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml` | Modify | agent_routing -> agent_availability, remove dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml` | Modify | agent_routing -> agent_availability, remove dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_debug_confirm.yaml` | Modify | agent_routing -> agent_availability, remove dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_handover_full.yaml` | Modify | agent_routing -> agent_availability, remove dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` | Modify | agent_routing -> agent_availability, remove dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` | Modify | agent_routing -> agent_availability, remove dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_research_auto.yaml` | Modify | agent_routing -> agent_availability, remove dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_research_confirm.yaml` | Modify | agent_routing -> agent_availability, remove dispatch |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All `## AGENT ROUTING` sections removed from `.md` files | `grep -r "## AGENT ROUTING" .opencode/command/spec_kit/*.md` returns 0 results |
| REQ-002 | All `## SUB-AGENT DELEGATION` sections removed from `.md` files | `grep -r "## SUB-AGENT DELEGATION" .opencode/command/spec_kit/*.md` returns 0 results |
| REQ-003 | All dispatch templates removed from `.md` files | No `dispatch:.*@` patterns in `.md` files |
| REQ-004 | `## CONSTRAINTS` section added to all 7 `.md` files | `grep -rl "## CONSTRAINTS" .opencode/command/spec_kit/*.md` returns 7 files |
| REQ-005 | All YAML `agent_routing:` renamed to `agent_availability:` | `grep -r "agent_routing" .opencode/command/spec_kit/assets/` returns 0 results |
| REQ-006 | All YAML `dispatch:` fields removed | `grep -r "dispatch:.*@" .opencode/command/spec_kit/assets/` returns 0 results |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | All YAML entries have `condition:` field | `agent_availability` entries use `condition:` instead of `dispatch:` |
| REQ-008 | All YAML entries have `not_for:` field | Each agent entry specifies what it should NOT be used for |
| REQ-009 | Commands still work correctly with Claude models | Manual verification of command execution |
| REQ-010 | `agent_availability` count matches expected per YAML | Correct number of agent entries preserved |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -r "agent_routing" .opencode/command/spec_kit/` returns 0 results
- **SC-002**: `grep -r "dispatch:.*@" .opencode/command/spec_kit/assets/` returns 0 results
- **SC-003**: `grep -r "## AGENT ROUTING" .opencode/command/spec_kit/*.md` returns 0 results
- **SC-004**: `grep -rl "## CONSTRAINTS" .opencode/command/spec_kit/*.md` returns 7 files
- **SC-005**: `grep -r "agent_availability" .opencode/command/spec_kit/assets/` returns correct count (11 files)

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Agent metadata loss breaks routing | Medium | Preserved as `agent_availability` with `condition:` fields |
| Risk | Codex still misinterprets after changes | Low | Three-pronged approach addresses all known vectors |
| Risk | Claude models confused by restructured YAML | Low | `agent_availability` is semantically equivalent to `agent_routing` |
| Dependency | Symlink `.claude/commands/spec_kit/` | None | Symlink means single edit location covers both paths |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

Not applicable. This spec covers configuration file refactoring with no runtime components, no performance implications, and no user-facing interfaces. The changes are purely structural edits to Markdown and YAML files.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- **resume.md**: Has no YAML `agent_routing` to restructure. Only receives CONSTRAINTS section in `.md` (Change B only).
- **handover.md**: Has only 1 YAML file (`spec_kit_handover_full.yaml`) instead of the typical 2 (auto + confirm). Only 1 routing block to restructure.

### Error Scenarios

- **Resume YAMLs skipped**: `spec_kit_resume_auto.yaml` and `spec_kit_resume_confirm.yaml` have no `agent_routing` section, so Change C does not apply. Verified by grep before and after.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 18, LOC: ~200, Systems: command config only |
| Risk | 10/25 | Auth: N, API: N, Breaking: N (config refactoring) |
| Research | 5/20 | Root cause known, solution pattern established |
| Multi-Agent | 5/15 | Workstreams: 1 (serial file-by-file) |
| Coordination | 5/15 | Dependencies: none external, symlink simplifies |
| **Total** | **40/100** | **Level 3** (elevated due to 18-file scope) |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Agent metadata loss breaks Claude routing | M | L | Preserved as agent_availability with condition fields |
| R-002 | Codex finds new dispatch vectors | L | L | Three-pronged approach covers all known vectors |
| R-003 | CONSTRAINTS section wording too weak | L | L | Uses explicit "DO NOT dispatch" language |
| R-004 | Missed file in 18-file scope | M | L | Grep-based verification catches omissions |
| R-005 | Symlink breaks during editing | L | VL | Verified symlink before and after changes |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Codex-Safe Command Files (Priority: P0)

**As a** Codex user, **I want** spec_kit command files to not contain agent dispatch triggers, **so that** Codex does not prematurely dispatch agents when reading the command files.

**Acceptance Criteria**:
1. **Given** a spec_kit `.md` file, **When** Codex reads it, **Then** no `## AGENT ROUTING` or dispatch tables trigger agent dispatch
2. **Given** a spec_kit YAML file, **When** Codex reads it, **Then** no `dispatch:` fields with imperative `@agent` strings trigger agent dispatch
3. **Given** all spec_kit command files, **When** grep-verified, **Then** zero `agent_routing`, zero `dispatch:.*@`, zero `## AGENT ROUTING` matches

---

### US-002: Preserved Agent Availability for Claude (Priority: P1)

**As a** Claude user, **I want** agent availability metadata preserved in restructured form, **so that** correct agent routing still works at the appropriate workflow step.

**Acceptance Criteria**:
1. **Given** a spec_kit YAML file, **When** read by Claude, **Then** `agent_availability` entries with `condition:` fields provide routing guidance
2. **Given** the restructured YAML, **When** Claude reaches the appropriate workflow step, **Then** it can determine which agent to use based on `condition:` and `not_for:` fields
3. **Given** a spec_kit `.md` file, **When** read by Claude, **Then** the CONSTRAINTS section does not prevent correct agent usage at the right time

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None. This spec is complete. All questions were resolved during implementation.

<!-- /ANCHOR:questions -->

---

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 3 SPEC - Make spec_kit Commands Codex-Compatible
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
- Status: Complete (2026-02-17)
-->
