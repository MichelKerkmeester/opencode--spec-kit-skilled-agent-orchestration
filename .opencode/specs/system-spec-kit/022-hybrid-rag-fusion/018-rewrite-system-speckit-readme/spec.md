---
title: "Rewrite System Spec Kit README [system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme/spec]"
description: "Complete rewrite of the system-spec-kit README to document the full skill surface: documentation levels 1-3+, memory system, 33 MCP tools, 14 commands, templates, scripts, and validation."
trigger_phrases:
  - "speckit readme rewrite"
  - "018 speckit readme"
  - "system spec kit documentation"
  - "skill readme"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
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
| **Status** | Complete (2026-03-25) |
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
| **Content grounding** | Feature catalog, the skill instructions document, command files, and the template directory |
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
| REQ-001 | All major components are documented (legacy `SR-001`) | Documentation levels, the memory system, MCP tools summary, commands, templates, scripts, and validation are all covered |
| REQ-002 | Documentation-level guidance is accurate (legacy `SR-002`) | Level 1 through 3+ descriptions match the current template architecture |
| REQ-003 | DQI is at least 75 (legacy `SR-003`) | `validate_document.py` scores at 75 or above |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The README contains no banned HVR words (legacy `SR-004`) | Zero matches for the sk-doc banned word list |
| REQ-005 | MCP depth links point to the MCP README (legacy `SR-005`) | MCP tool details link to the MCP README rather than duplicating them |
| REQ-006 | The command inventory is complete (legacy `SR-006`) | All spec-kit and memory commands are listed with brief descriptions |
| REQ-007 | The template architecture is documented (legacy `SR-007`) | The CORE plus ADDENDUM system is explained with relevant examples |
| REQ-008 | Cross-references stay consistent (legacy `SR-008`) | Links to the MCP README, root README, and the skill instructions remain valid |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All components documented without duplicating MCP README content
- **SC-002**: DQI >= 75 with zero banned HVR words
- **SC-003**: A new user understands the Spec Kit skill's purpose and components from Overview + Quick Start
- **SC-004**: Documentation levels section matches current template files

### Acceptance Scenarios

**Given** the rewritten Spec Kit README, **when** a new user reads the Overview and Quick Start sections, **then** they understand the skill’s purpose, major components, and where to go next.

**Given** a reviewer checks the documentation-level guidance, **when** they compare it against the live templates, **then** the README matches the current Level 1 through 3+ structure.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | MCP README rewrite (D1) | Medium | D3 should link to D1, so coordinate cross-references |
| Dependency | Feature catalog | High | Ground content in catalog categories |
| Risk | Overlap with the skill instructions document | Medium | The README covers what and how, while the skill instructions cover when and rules |
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
Level 1 — Complete (2026-03-25)
Target: Complete rewrite of Spec Kit README covering all components
-->

---

### Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../017-update-install-guide/spec.md |
| **Next Phase** | ../019-rewrite-repo-readme/spec.md |
