---
title: "Rewrite System Spec Kit README"
description: "Complete rewrite of the system-spec-kit README to document the full skill surface: documentation levels 1-3+, memory system, 33 MCP tools, 14 commands, templates, scripts, and validation."
trigger_phrases:
  - "speckit readme rewrite"
  - "018 speckit readme"
  - "system spec kit documentation"
  - "skill readme"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 1 -->
# Specification: 018-rewrite-system-speckit-readme

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress (tasks tracker pending completion evidence) |
| **Created** | 2026-03-15 |
| **Branch** | `main` |
| **Parent** | `022-hybrid-rag-fusion` (Phase 018) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../017-update-install-guide/spec.md |
| **Successor** | ../019-rewrite-repo-readme/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The system-spec-kit README (`README.md`, ~872 lines) was written before the 22-category feature catalog, 14-command suite (8 spec_kit + 6 memory), and phase decomposition system existed. It describes an earlier, smaller version of the skill that does not reflect the current capability surface: 33 MCP tools, 4 documentation levels, CORE+ADDENDUM template architecture, validation scripts, and the full memory system.

### Purpose

Produce a complete rewrite that documents the Spec Kit skill holistically — covering all components without duplicating the MCP server README — with accurate documentation levels, command inventories, and DQI >= 75.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Category | Items |
|----------|-------|
| **Full rewrite** | `.opencode/skill/system-spec-kit/README.md` |
| **Section structure** | Overview, Quick Start, Components, Documentation Levels, Memory System, MCP Tools, Commands, Templates, Scripts, Troubleshooting, FAQ, Related Resources |
| **Content grounding** | Feature catalog, SKILL.md, command files, template directory |
| **Quality gates** | DQI >= 75, no banned HVR words, template alignment |

### Out of Scope

- MCP server runtime code changes
- MCP server README (owned by `016-rewrite-memory-mcp-readme`)
- Root README (owned by `019-rewrite-repo-readme`)
- Command documentation content (completed by `012-command-alignment`)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/README.md` | Rewrite | Complete rewrite covering the full skill surface |
| `.opencode/skill/system-spec-kit/README.md.bak` | Create | Backup before rewrite |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SR-001 | All major components documented | Documentation levels (1-3+), memory system, MCP tools (summary), commands (all 14), templates, scripts, validation |
| SR-002 | Documentation levels accurate | Level 1-3+ descriptions match current template architecture |
| SR-003 | DQI >= 75 | `validate_document.py` scores at 75 or above |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SR-004 | No banned HVR words | Zero matches for sk-doc banned word list |
| SR-005 | Links to MCP README for depth | MCP tool details link to mcp_server/README.md rather than duplicating them |
| SR-006 | Command inventory complete | All 8 spec_kit commands and 6 memory commands listed with brief descriptions |
| SR-007 | Template architecture documented | CORE + ADDENDUM system (v2.2) explained with examples |
| SR-008 | Cross-references consistent | Links to MCP README, root README, and SKILL.md are valid |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All components documented without duplicating MCP README content
- **SC-002**: DQI >= 75 with zero banned HVR words
- **SC-003**: A new user understands the Spec Kit skill's purpose and components from Overview + Quick Start
- **SC-004**: Documentation levels section matches current template files
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | MCP README rewrite (D1) | Medium | D3 should link to D1, so coordinate cross-references |
| Dependency | Feature catalog | High | Ground content in catalog categories |
| Risk | Overlap with SKILL.md content | Medium | README covers what/how, SKILL.md covers when/rules |
| Risk | Document too long | Medium | Summarize MCP tools; link to MCP README for details |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None remaining — component inventory is stable
<!-- /ANCHOR:questions -->

---

<!--
SPEC: 018-rewrite-system-speckit-readme
Level 1 — In Progress (tasks tracker not yet reconciled, 2026-03-24)
Target: Complete rewrite of Spec Kit README covering all components
-->

---

## Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../017-update-install-guide/spec.md |
| **Next Phase** | ../019-rewrite-repo-readme/spec.md |
