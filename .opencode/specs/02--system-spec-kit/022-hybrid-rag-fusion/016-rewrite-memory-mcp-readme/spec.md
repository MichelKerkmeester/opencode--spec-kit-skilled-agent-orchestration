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
| **Status** | Complete |
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

The MCP server README (mcp_server/README.md, ~1281 lines) was written incrementally as features were added across 16 phases of the 022-hybrid-rag-fusion epic. It now mixes API reference, architecture, configuration, and troubleshooting concerns with no clear reader path. Some sections reference 28 tools when 32 exist. The hybrid search pipeline, cognitive memory (6-tier, 5-state, FSRS decay), and feature flag system are not cohesively documented.

### Purpose

Produce a complete rewrite grounded in the feature catalog that serves both newcomers (quick start, overview) and power users (full tool reference, architecture depth), with all 32 MCP tools accurately documented and DQI >= 75.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Category | Items |
|----------|-------|
| **Full rewrite** | `.opencode/skill/system-spec-kit/mcp_server/README.md` |
| **Section structure** | Overview, Quick Start, Architecture, MCP Tools (all 32), Search System, Configuration, Usage Examples, Troubleshooting, FAQ, Related Resources |
| **Content grounding** | Feature catalog (feature_catalog.md) as authoritative source |
| **Quality gates** | DQI >= 75, no banned HVR words, template alignment with readme_template.md |

### Out of Scope

- MCP server runtime code changes
- INSTALL_GUIDE.md (owned by sibling spec `017-update-install-guide`)
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
| MR-001 | All 32 MCP tools documented | Every tool in `TOOL_DEFINITIONS` appears with name, description, parameters, and layer annotation |
| MR-002 | Feature catalog grounding | All 22 feature categories from the catalog are represented in relevant sections |
| MR-003 | DQI >= 75 | `validate_document.py` scores the final document at 75 or above |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| MR-004 | No banned HVR words | Zero matches for sk-doc banned word list across the document |
| MR-005 | Template alignment | Section headers match readme_template.md structure |
| MR-006 | Newcomer-friendly intro | Overview and Quick Start sections are self-contained and require no prior knowledge |
| MR-007 | Architecture section covers hybrid search | Describes BM25 + vector fusion, FSRS decay, 6-tier importance, 5-state lifecycle |
| MR-008 | Cross-references to sibling docs | Links to INSTALL_GUIDE.md, Spec Kit README, and command docs without duplicating content |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 33 tools documented with parameters and layer annotations
- **SC-002**: DQI >= 75 with zero banned HVR words
- **SC-003**: A newcomer can set up the MCP server using only Overview + Quick Start
- **SC-004**: A power user can find any tool's full parameter reference within 2 TOC clicks
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Feature catalog accuracy | High | Cross-reference catalog against `tool-schemas.ts` during research |
| Dependency | readme_template.md structure | Medium | Load template before drafting |
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
Level 1 — Complete (2026-03-15)
Target: Complete rewrite of MCP README covering all 33 tools
Source: feature_catalog.md + tool-schemas.ts
-->

---

## Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../015-manual-testing-per-playbook/spec.md |
| **Next Phase** | ../017-update-install-guide/spec.md |
