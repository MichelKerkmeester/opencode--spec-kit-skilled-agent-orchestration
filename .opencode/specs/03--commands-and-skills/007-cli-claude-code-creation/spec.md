---
title: "Feature Specification: cli-claude-code Skill [03--commands-and-skills/007-cli-claude-code-creation/spec]"
description: "No skill exists for external AI assistants to delegate tasks to Claude Code CLI, leaving deep reasoning, structured output, and agent delegation capabilities inaccessible to Gemini, Codex, and Copilot."
trigger_phrases:
  - "cli-claude-code spec"
  - "claude code skill spec"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: cli-claude-code Skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-02 |
| **Branch** | `main` |

---
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

No skill exists for external AI assistants (Gemini CLI, Codex CLI, Copilot, etc.) to delegate tasks to Claude Code CLI. The existing `cli-gemini` and `cli-codex` skills enable Claude Code to invoke *other* AIs, but the reverse direction — other AIs invoking Claude Code — has no structured skill. This leaves Claude Code's unique capabilities (extended thinking, `--json-schema`, `--permission-mode plan`, `--max-budget-usd`) inaccessible to external orchestrators.

### Purpose

External AI assistants can invoke Claude Code CLI for deep reasoning, surgical code editing, structured output, and agent delegation through a documented skill with smart routing, reference materials, and prompt templates.

---
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New cli-claude-code skill with full file structure (SKILL.md, README.md, 4 references, 1 asset)
- Reversed orchestration model: external AI = conductor, Claude Code = executor
- Ecosystem registration: skill_advisor.py entries, `.claude/skills` symlink, README updates (3 files)

### Out of Scope

- Changes to Claude Code CLI itself — not modifying the tool
- Changes to `.claude/agents/` agent definitions — documenting only
- Install guides for Claude Code CLI — existing docs suffice
- Changes to existing cli-gemini or cli-codex skills — separate scope
- Changelog entries — tracked separately

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/cli-claude-code/SKILL.md` | Create | Main orchestrator (8 sections) |
| `.opencode/skill/cli-claude-code/README.md` | Create | Companion guide |
| `.opencode/skill/cli-claude-code/references/cli_reference.md` | Create | CLI flags, commands, models |
| `.opencode/skill/cli-claude-code/references/agent_delegation.md` | Create | 9 agents, routing table |
| `.opencode/skill/cli-claude-code/references/claude_tools.md` | Create | Unique capabilities, 3-way comparison |
| `.opencode/skill/cli-claude-code/references/integration_patterns.md` | Create | Reversed orchestration patterns |
| `.opencode/skill/cli-claude-code/assets/prompt_templates.md` | Create | Copy-paste templates |
| `.opencode/skill/scripts/skill_advisor.py` | Modify | Add 3 booster sections |
| `.claude/skills/cli-claude-code` | Create | Symlink to skill |
| `.opencode/skill/README.md` | Modify | Add skill entry |
| `.opencode/README.md` | Modify | Add skill entry |
| `README.md` | Modify | Add skill entry |

---
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SKILL.md with 8 standard sections | All 8 anchored sections present, smart routing pseudocode functional |
| REQ-002 | All 4 reference files exist | cli_reference.md, agent_delegation.md, claude_tools.md, integration_patterns.md created |
| REQ-003 | prompt_templates.md exists | 10 template categories with copy-paste commands |
| REQ-004 | README.md companion guide | 8-section README with quick start and examples |
| REQ-005 | Symlink resolves | `.claude/skills/cli-claude-code` points to skill directory |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | skill_advisor.py registration | Entries in INTENT_BOOSTERS, MULTI_SKILL_BOOSTERS, PHRASE_INTENT_BOOSTERS |
| REQ-007 | README updates | cli-claude-code listed in 3 READMEs |
| REQ-008 | Model consistency | claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5-20251001 across all files |
| REQ-009 | Core invocation pattern | `claude -p "prompt" --output-format text 2>&1` used consistently |
| REQ-010 | Reversed orchestration documented | External AI = conductor, Claude Code = executor model |

---
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 skill_advisor.py "use claude code cli"` returns cli-claude-code with confidence >= 0.8
- **SC-002**: `readlink .claude/skills/cli-claude-code` resolves to `../../.opencode/skill/cli-claude-code`
- **SC-003**: All 9 agents from `.opencode/agent/` documented in agent_delegation.md
- **SC-004**: 3-way comparison table (Claude Code vs Gemini CLI vs Codex CLI) in claude_tools.md

---

### Acceptance Scenarios

- **Given** an external AI assistant needs deeper reasoning or code editing support, **when** it follows the `cli-claude-code` skill, **then** the skill shows how to delegate work to Claude Code CLI safely.
- **Given** a user checks the companion references, **when** they review flags, agents, and integration patterns, **then** the skill package covers the expected Claude Code surfaces consistently.
- **Given** runtime setup is inspected, **when** the `.claude/skills/cli-claude-code` symlink is verified, **then** it resolves to the canonical skill directory.
- **Given** the skill is used inside a nested Claude Code environment, **when** the self-protection guidance is read, **then** the docs explain the nesting guard instead of encouraging recursive invocation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude Code CLI installed | Skill is documentation-only; no runtime dependency | Installation instructions included |
| Dependency | `.opencode/agent/*.md` definitions | Agent roster accuracy | Read actual agent files during implementation |
| Risk | Claude Code CLI flags change | Low — documentation-only | Version-pin references, update as needed |
| Risk | Model IDs change | Medium — affects all model references | Centralize model references for easy updates |

---

---
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None identified — all technical details sourced from existing CLI help and agent definitions.
<!-- /ANCHOR:questions -->

---
