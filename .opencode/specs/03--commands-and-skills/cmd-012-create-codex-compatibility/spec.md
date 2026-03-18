---
title: "Feature Specification: Create Commands Codex Compatibility [012-create-codex-compatibility/spec]"
description: "level: 3"
trigger_phrases:
  - "feature"
  - "specification"
  - "create"
  - "commands"
  - "codex"
  - "spec"
  - "012"
importance_tier: "important"
contextType: "decision"
completed: 2026-02-17
created: 2026-02-17
level: 3
status: done
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Feature Specification: Create Commands Codex Compatibility

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Codex (OpenAI's coding agent) misinterprets agent routing metadata in `/create` command `.md` and `.yaml` files as dispatch instructions, causing unintended agent invocations. This spec applied the same three-pronged compatibility strategy from spec 010 (spec_kit commands) to all 20 create command files, and additionally cleaned up stale emoji optionality language aligned with spec 011.

**Key Decisions**: Reuse spec 010 three-pronged approach for consistency; bundle emoji cleanup to avoid revisiting 14 YAML files in a separate pass.

**Critical Dependencies**: Write access to `.opencode/command/create/` and `.opencode/command/create/assets/` directories. Symlink `.claude/commands/create` covers both locations.
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
Codex misinterprets agent routing metadata in create command files in three ways:
1. `## Agent Routing` sections in `.md` files with `@agent` names in tables are read as action items
2. `dispatch:` fields in YAML files with imperative `"Task tool -> @agent..."` strings look like executable prompts
3. Weak `<!-- REFERENCE ONLY -->` HTML comment guards are ignored by Codex

This is the same root problem as spec 010 (spec_kit commands) but manifests in a lighter form across the create command infrastructure.

### Purpose
Prevent Codex from prematurely dispatching agents when reading create command files, while preserving all agent availability metadata for Claude-based workflows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 6 `.md` command files in `.opencode/command/create/`
- 14 `.yaml` workflow files in `.opencode/command/create/assets/`
- Three-pronged Codex compatibility approach (strip, constrain, restructure)
- Emoji optionality language cleanup (Change D, aligned with spec 011)

### Out of Scope
- spec_kit commands (handled by spec 010)
- Other command families beyond `/create`
- Runtime behavior changes (config refactoring only)
- Removing existing cosmetic emojis from templates

### Files to Change

| # | File Path | Change Type | Description |
|---|-----------|-------------|-------------|
| 1 | `.opencode/command/create/skill.md` | Modify | Strip 3-agent routing, remove guards, add CONSTRAINTS |
| 2 | `.opencode/command/create/agent.md` | Modify | Strip 3-agent routing, remove guards, add CONSTRAINTS |
| 3 | `.opencode/command/create/folder_readme.md` | Modify | Strip 1-agent routing, remove guards, add CONSTRAINTS, emoji cleanup |
| 4 | `.opencode/command/create/install_guide.md` | Modify | Strip 1-agent routing, remove guards, add CONSTRAINTS |
| 5 | `.opencode/command/create/skill_asset.md` | Modify | Strip 1-agent routing, remove guards, add CONSTRAINTS |
| 6 | `.opencode/command/create/skill_reference.md` | Modify | Strip 1-agent routing, remove guards, add CONSTRAINTS |
| 7 | `.opencode/command/create/assets/create_skill_auto.yaml` | Modify | 3 agent_routing blocks restructured |
| 8 | `.opencode/command/create/assets/create_skill_confirm.yaml` | Modify | 3 agent_routing blocks restructured |
| 9 | `.opencode/command/create/assets/create_agent_auto.yaml` | Modify | 3 agent_routing blocks restructured |
| 10 | `.opencode/command/create/assets/create_agent_confirm.yaml` | Modify | 3 agent_routing blocks restructured |
| 11 | `.opencode/command/create/assets/create_folder_readme_auto.yaml` | Modify | 1 block restructured + emoji cleanup + emoji_conventions rename |
| 12 | `.opencode/command/create/assets/create_folder_readme_confirm.yaml` | Modify | 1 block restructured + emoji cleanup + emoji_conventions rename |
| 13 | `.opencode/command/create/assets/create_install_guide_auto.yaml` | Modify | 1 block restructured + emoji cleanup |
| 14 | `.opencode/command/create/assets/create_install_guide_confirm.yaml` | Modify | 1 block restructured + emoji cleanup |
| 15 | `.opencode/command/create/assets/create_skill_asset_auto.yaml` | Modify | 1 block restructured + emoji cleanup |
| 16 | `.opencode/command/create/assets/create_skill_asset_confirm.yaml` | Modify | 1 block restructured + emoji cleanup |
| 17 | `.opencode/command/create/assets/create_skill_reference_auto.yaml` | Modify | 1 block restructured + emoji cleanup |
| 18 | `.opencode/command/create/assets/create_skill_reference_confirm.yaml` | Modify | 1 block restructured + emoji cleanup |
| 19 | `.opencode/command/create/assets/create_skill_auto.yaml` | Modify | (included in #7) |
| 20 | `.opencode/command/create/assets/create_skill_confirm.yaml` | Modify | (included in #8) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove `## Agent Routing` sections from all 6 .md files | `grep -r "## Agent Routing" *.md` returns 0 matches |
| REQ-002 | Add `## CONSTRAINTS` section to all 6 .md files | `grep -r "## CONSTRAINTS" *.md` returns 6 matches |
| REQ-003 | Remove `<!-- REFERENCE ONLY -->` guards from all 6 .md files | `grep -r "REFERENCE ONLY" *.md` returns 0 matches |
| REQ-004 | Rename `agent_routing:` to `agent_availability:` in all YAML files | `grep -r "agent_routing:" assets/` returns 0; `grep -r "agent_availability:" assets/` returns 20 |
| REQ-005 | Remove `dispatch:` fields with `@agent` references from YAML | `grep -r "dispatch:.*@" assets/` returns 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve command functionality | All create commands execute correctly with Claude |
| REQ-007 | Remove emoji optionality language | `grep -ri "[Ee]moji" create/` returns 0 matches |
| REQ-008 | Rename `emoji_conventions:` to `section_icons:` in folder_readme YAMLs | Field name updated in both auto and confirm variants |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

All 7 verification checks must pass:

| # | Check | Expected | Actual |
|---|-------|----------|--------|
| SC-001 | `agent_routing:` in create/ | 0 | 0 |
| SC-002 | `agent_availability:` in assets/ | 20 | 20 |
| SC-003 | `dispatch:.*@` in assets/ | 0 | 0 |
| SC-004 | `## Agent Routing` in *.md | 0 | 0 |
| SC-005 | `## CONSTRAINTS` in *.md | 6 | 6 |
| SC-006 | `REFERENCE ONLY` in *.md | 0 | 0 |
| SC-007 | `[Ee]moji` in create/ | 0 | 0 |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missed agent_routing in nested YAML | Low | Comprehensive grep across all asset files |
| Risk | Breaking command functionality | Low | Changes are metadata-only, no logic changes |
| Dependency | Spec 010 approach proven | Green | Spec 010 already completed and verified |
| Dependency | Symlink covers both locations | Green | `.claude/commands/create` symlinks to `.opencode/command/create` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

N/A -- This is a configuration refactoring spec with no runtime components. All changes are to static `.md` and `.yaml` files that are read at command invocation time. No performance, security, or reliability implications.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Two Complexity Levels of .md Files
- **skill.md** and **agent.md** have 3 agents each (@context, @speckit, @review) -- larger Agent Routing tables to strip, 3 YAML blocks per workflow file
- The other 4 .md files (folder_readme, install_guide, skill_asset, skill_reference) have 1 agent each (@review) -- simpler tables, 1 YAML block per workflow file

### YAML Structural Differences
- In create commands, `agent_routing:` is embedded inside individual workflow steps (better architecture than spec_kit where it was at the top level)
- `emoji_conventions:` rename to `section_icons:` only applies to folder_readme YAML files (2 of 14), not all YAML files

### Emoji Cleanup Scope
- Emoji optionality language exists in both .md and .yaml files
- Existing cosmetic emojis in template content are preserved (only enforcement/optionality language is removed)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 20, LOC: ~300, Systems: 1 (command infrastructure) |
| Risk | 8/25 | Auth: N, API: N, Breaking: None (metadata-only changes) |
| Research | 5/20 | Approach proven by spec 010; minimal new research |
| Multi-Agent | 5/15 | Single workstream, but affects multi-agent metadata |
| Coordination | 5/15 | Dependencies: Low (isolated to /create, follows spec 010 pattern) |
| **Total** | **38/100** | **Level 3** (architecture decisions documented) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Missed agent_routing occurrence | L | L | Grep verification counts all 20 expected occurrences |
| R-002 | Command breaks after metadata changes | L | L | Changes are metadata-only; no logic affected |
| R-003 | Emoji cleanup removes content emojis | L | L | Only optionality language removed, not cosmetic emojis |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Create Commands Without Premature Agent Dispatch (Priority: P0)

**As a** Codex user running create commands, **I want** the command files to not contain dispatch-like agent routing metadata, **so that** Codex does not prematurely invoke agents when reading command definitions.

**Acceptance Criteria**:
1. Given a create command .md file, When Codex reads it, Then no `## Agent Routing` section with `@agent` names exists
2. Given a create command .md file, When Codex reads it, Then a `## CONSTRAINTS` section explicitly forbids dispatch
3. Given a create YAML workflow, When Codex reads it, Then no `dispatch:` fields with `@agent` references exist

---

### US-002: Agent Availability Metadata Preserved (Priority: P1)

**As a** command user working with Claude, **I want** agent availability information preserved in YAML workflows, **so that** the system knows which agents are available at each workflow step.

**Acceptance Criteria**:
1. Given a YAML workflow file, When I inspect it, Then `agent_availability:` blocks describe available agents with conditions
2. Given the restructured metadata, When commands execute, Then agent availability is correctly referenced
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None. All questions resolved during implementation:
- Approach validated by spec 010 precedent
- Emoji cleanup scope confirmed aligned with spec 011
- All 7 verification checks passed
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Related Spec (spec_kit)**: See `../010-speckit-codex-compatibility/`
- **Related Spec (emoji)**: See `../011-create-command-emoji-enforcement/`

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
- Status: COMPLETE (2026-02-17)
-->
