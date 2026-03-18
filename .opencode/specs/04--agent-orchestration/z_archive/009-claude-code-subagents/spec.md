---
title: "Feature Specification: Convert OpenCode Agents to Claude Code Subagents [009-claude-code-subagents/spec]"
description: "OpenCode has 8 specialized agent files in .opencode/agent/ using OpenCode-specific YAML frontmatter. Claude Code IDE supports subagents but requires a different frontmatter form..."
trigger_phrases:
  - "feature"
  - "specification"
  - "convert"
  - "opencode"
  - "agents"
  - "spec"
  - "009"
  - "claude"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Convert OpenCode Agents to Claude Code Subagents

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-11 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode has 8 specialized agent files in `.opencode/agent/` using OpenCode-specific YAML frontmatter. Claude Code IDE supports subagents but requires a different frontmatter format in `.claude/agents/`. We need to convert these agents to work in Claude Code while preserving their functionality.

### Purpose
Enable the same agent routing and specialization system to work in both OpenCode and Claude Code environments by converting agent file frontmatter to Claude Code format.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Convert 8 agent files from OpenCode to Claude Code format
- Preserve all markdown body content (instructions, workflows, rules)
- Convert YAML frontmatter only (name, description, routing metadata)
- Files: context.md, orchestrate.md, speckit.md, research.md, write.md, debug.md, review.md, handover.md

### Out of Scope
- Modifying agent behavior or instructions - body content stays identical
- Creating new agents or removing existing ones - exact 1:1 conversion
- Testing in Claude Code IDE - verification is manual post-implementation

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/agents/context.md` | Create | Convert from `.opencode/agent/context.md` |
| `.claude/agents/orchestrate.md` | Create | Convert from `.opencode/agent/orchestrate.md` |
| `.claude/agents/speckit.md` | Create | Convert from `.opencode/agent/speckit.md` |
| `.claude/agents/research.md` | Create | Convert from `.opencode/agent/research.md` |
| `.claude/agents/write.md` | Create | Convert from `.opencode/agent/write.md` |
| `.claude/agents/debug.md` | Create | Convert from `.opencode/agent/debug.md` |
| `.claude/agents/review.md` | Create | Convert from `.opencode/agent/review.md` |
| `.claude/agents/handover.md` | Create | Convert from `.opencode/agent/handover.md` |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 8 agent files converted | 8 files exist in `.claude/agents/` with Claude Code frontmatter |
| REQ-002 | Frontmatter follows Claude Code format | YAML block contains `name`, `description` in correct structure |
| REQ-003 | Body content preserved exactly | Markdown body identical to source files (no modifications) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Source files remain unchanged | Original `.opencode/agent/*.md` files untouched |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 8 agent files exist in `.claude/agents/` with valid Claude Code frontmatter
- **SC-002**: Body content diff shows zero changes (only frontmatter modified)

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude Code frontmatter spec | Medium - wrong format = broken routing | Use existing `.claude/agents/explore.md` as reference |
| Risk | Body content accidentally modified | Low - breaks agent behavior | Verify diff shows frontmatter-only changes |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None - straightforward format conversion with clear reference example

<!-- /ANCHOR:questions -->

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [`plan.md`](./plan.md) | Implementation approach and phases |
| [`tasks.md`](./tasks.md) | Detailed task breakdown |
| [`implementation-summary.md`](./implementation-summary.md) | Post-implementation record |

---
