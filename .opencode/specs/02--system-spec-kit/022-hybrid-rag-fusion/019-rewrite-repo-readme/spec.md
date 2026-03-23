---
title: "Rewrite Repo README"
description: "Complete rewrite of the repository root README to provide a top-level overview of the OpenCode system: 11 agents, 18 skills, 33 MCP tools, gate system, and code mode."
trigger_phrases:
  - "repo readme rewrite"
  - "019 repo readme"
  - "root readme"
  - "repository documentation"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 1 -->
# Specification: 019-rewrite-repo-readme

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
| **Parent** | `022-hybrid-rag-fusion` (Phase 019) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../018-rewrite-system-speckit-readme/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The root README (`README.md`, ~1040 lines) tries to cover every aspect of the OpenCode system in a single document with no clear navigation path for different user types. At ~35K words, it overwhelms newcomers and frustrates power users looking for specific component references. It predates the current 18-skill, 11-agent, 33-MCP-tool system and does not reflect the gate system, code mode, or phase decomposition capabilities.

### Purpose

Produce a complete rewrite that serves as the top-level entry point to the OpenCode system with role-based navigation, accurate component counts, and links to component READMEs for depth. DQI >= 75.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Category | Items |
|----------|-------|
| **Full rewrite** | `README.md` (repo root) |
| **Section structure** | Overview, Quick Start, Spec Kit Documentation, Memory Engine, Agent Network, Command Architecture, Skills Library, Gate System, Code Mode MCP, Configuration, Usage Examples, Troubleshooting, FAQ, Related Documents |
| **Content grounding** | Agent definitions, skill directory, command directory, CLAUDE.md gate system |
| **Quality gates** | DQI >= 75, no banned HVR words, role-based navigation |

### Out of Scope

- MCP server runtime code changes
- MCP README (owned by `016-rewrite-memory-mcp-readme`)
- Spec Kit README (owned by `018-rewrite-system-speckit-readme`)
- Individual skill or agent documentation updates

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Rewrite | Complete rewrite as top-level system overview |
| `README.md.bak` | Create | Backup before rewrite |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| RR-001 | All 18 skills listed | Every skill in `.opencode/skill/` appears with name and brief description |
| RR-002 | All 11 agents documented | Every agent definition appears with name, role, and capabilities summary |
| RR-003 | DQI >= 75 | `validate_document.py` scores at 75 or above |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| RR-004 | No banned HVR words | Zero matches for sk-doc banned word list |
| RR-005 | Quick start works | A new user can understand the system and start using it from Overview + Quick Start alone |
| RR-006 | Role-based navigation | Separate paths for newcomers, developers, and administrators |
| RR-007 | Links to component READMEs | Detailed content links to MCP README, Spec Kit README, and skill READMEs without duplication |
| RR-008 | Gate system documented | The 3-gate system from CLAUDE.md is accurately summarized |
| RR-009 | Cross-references consistent | Links between D4, D3, and D1 are valid and non-circular |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 18 skills and 11 agents listed with descriptions
- **SC-002**: DQI >= 75 with zero banned HVR words
- **SC-003**: Three navigation paths work: newcomer, developer, administrator
- **SC-004**: No content duplicated from component READMEs
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | MCP README (D1) and Spec Kit README (D3) | Medium | D4 links to both; coordinate references |
| Dependency | Agent definitions directory | High | Count and list from live directory |
| Dependency | Skill directory | High | Count and list from live directory |
| Risk | Document still too long | Medium | Strict summary-only policy; link to component docs for depth |
| Risk | Component counts change after writing | Low | Use live-directory verification before finalizing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None remaining — component inventories are stable
<!-- /ANCHOR:questions -->

---

<!--
SPEC: 019-rewrite-repo-readme
Level 1 — Complete (2026-03-15)
Target: Complete rewrite of root README as system overview
-->

---

## Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../018-rewrite-system-speckit-readme/spec.md |
