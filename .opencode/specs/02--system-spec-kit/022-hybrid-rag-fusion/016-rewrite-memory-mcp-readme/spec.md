---
title: "Rewrite Memory MCP README"
description: "Complete rewrite of the Spec Kit Memory MCP server README to accurately document all 33 tools, hybrid search pipeline, and cognitive memory architecture."
trigger_phrases:
  - "mcp readme rewrite"
  - "016 mcp readme"
  - "memory mcp documentation"
  - "mcp server readme"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 1 -->
# Specification: 016-rewrite-memory-mcp-readme

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
| **Parent** | `022-hybrid-rag-fusion` (Phase 016) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../015-manual-testing-per-playbook/spec.md |
| **Successor** | ../017-update-install-guide/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The MCP server README (mcp_server/README.md, ~1281 lines) was written incrementally as features were added across 16 phases of the 022-hybrid-rag-fusion epic. It now mixes API reference, architecture, configuration, and troubleshooting concerns with no clear reader path. Some sections reference 28 tools when 33 exist. The hybrid search pipeline, cognitive memory (6-tier, 5-state, FSRS decay), and feature flag system are not cohesively documented.

### Purpose

Produce a complete rewrite grounded in the feature catalog that serves both newcomers (quick start, overview) and power users (full tool reference, architecture depth), with all 33 MCP tools accurately documented and DQI >= 75.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Category | Items |
|----------|-------|
| **Full rewrite** | `.opencode/skill/system-spec-kit/mcp_server/README.md` |
| **Section structure** | Overview, Quick Start, Architecture, MCP Tools (all 33), Search System, Configuration, Usage Examples, Troubleshooting, FAQ, Related Resources |
| **Content grounding** | Feature catalog (feature_catalog.md) as authoritative source |
| **Quality gates** | DQI >= 75, no banned HVR words, template alignment with the README template |

### Out of Scope

- MCP server runtime code changes
- The install guide document (owned by sibling spec `017-update-install-guide`)
- Spec Kit README (owned by `018-rewrite-system-speckit-readme`)
- Command documentation (completed by `012-command-alignment`)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Rewrite | Complete rewrite from scratch using research brief and readme template |
| `.opencode/skill/system-spec-kit/mcp_server/README.md.bak` | Create | Backup of current README before rewrite |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 33 MCP tools are documented (legacy `MR-001`) | Every tool in `TOOL_DEFINITIONS` appears with name, description, parameters, and layer annotation |
| REQ-002 | The rewrite is grounded in the feature catalog (legacy `MR-002`) | All 22 feature categories from the catalog are represented in relevant sections |
| REQ-003 | DQI is at least 75 (legacy `MR-003`) | `validate_document.py` scores the final document at 75 or above |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The rewrite contains no banned HVR words (legacy `MR-004`) | Zero matches for sk-doc banned word list across the document |
| REQ-005 | The rewrite follows the README template structure (legacy `MR-005`) | Section headers match the active README template structure |
| REQ-006 | The intro is newcomer-friendly (legacy `MR-006`) | Overview and Quick Start sections are self-contained and require no prior knowledge |
| REQ-007 | The architecture section covers hybrid search (legacy `MR-007`) | The README describes BM25 plus vector fusion, FSRS decay, 6-tier importance, and the 5-state lifecycle |
| REQ-008 | Cross-references to sibling docs stay accurate (legacy `MR-008`) | Links to the install guide, the Spec Kit README, and command docs work without duplicating their content |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 33 tools documented with parameters and layer annotations
- **SC-002**: DQI >= 75 with zero banned HVR words
- **SC-003**: A newcomer can set up the MCP server using only Overview + Quick Start
- **SC-004**: A power user can find any tool's full parameter reference within 2 TOC clicks

### Acceptance Scenarios

**Given** the rewritten MCP README, **when** a reviewer audits it against `TOOL_DEFINITIONS`, **then** all 33 tools appear with the expected reference detail.

**Given** a newcomer opens only the Overview and Quick Start sections, **when** they follow the guidance, **then** they can understand the MCP server and begin setup without outside context.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Feature catalog accuracy | High | Cross-reference catalog against `tool-schemas.ts` during research |
| Dependency | README template structure | Medium | Load the active template before drafting |
| Risk | Document too long for single-page reading | Medium | Use collapsible sections and clear TOC hierarchy |
| Risk | Tool descriptions duplicate command docs | Medium | Link to command docs for workflow details, keep README focused on reference |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None remaining — all architectural decisions locked by parent epic
<!-- /ANCHOR:questions -->

---

<!--
SPEC: 016-rewrite-memory-mcp-readme
Level 1 — In Progress (tasks tracker not yet reconciled, 2026-03-24)
Target: Complete rewrite of MCP README covering all 33 tools
Source: feature_catalog.md + tool-schemas.ts
-->

---

### Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../015-manual-testing-per-playbook/spec.md |
| **Next Phase** | ../017-update-install-guide/spec.md |
