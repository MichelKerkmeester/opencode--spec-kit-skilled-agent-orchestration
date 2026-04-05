---
title: "Rewrite Repo README [system-spec-kit/022-hybrid-rag-fusion/019-rewrite-repo-readme/spec]"
description: "Complete rewrite of the repository root README to provide a top-level overview of the OpenCode system: 12 agents, 18 skills, 40 MCP tools, gate system, and code mode."
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
| **Status** | Complete (2026-03-25) |
| **Created** | 2026-03-15 |
| **Branch** | `main` |
| **Parent** | `022-hybrid-rag-fusion` (Phase 019) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../018-rewrite-system-speckit-readme/spec.md |
| **Successor** | ../020-post-release-fixes/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The root README (`README.md`, ~822 lines) was previously rewritten but uses flat technical prose without the two-tier voice (narrative analogies + reference tables) established in the MCP server README (016) and Spec Kit README (018). It undercounts MCP tools (40 vs actual 42), lacks power-feature highlights from the 222-entry feature catalog, and does not match the formatting patterns (numbered subsections, dividers, comparison tables) of its sibling READMEs.

### Purpose

Produce a complete rewrite that serves as the top-level entry point to the OpenCode system with two-tier voice (narrative analogies for newcomers, reference tables for power users), accurate component counts (12 agents, 18 skills, 22 commands, 42 MCP tools), and links to component READMEs for depth. Style-aligned with sibling READMEs from 016 and 018.
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
| REQ-001 | All 18 skills are listed (legacy `RR-001`) | Every skill in `.opencode/skill/` appears with name and brief description |
| REQ-002 | All 12 agents are documented (legacy `RR-002`) | Every agent definition appears with name, role, and capabilities summary |
| REQ-003 | All 42 MCP tools are counted (legacy `RR-003`) | 33 memory + 7 code mode + 1 CocoIndex + 1 sequential thinking |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The README contains no banned HVR words (legacy `RR-004`) | Zero matches for the sk-doc banned word list |
| REQ-005 | The quick start works for new users (legacy `RR-005`) | A new user can understand the system and start from the Overview plus Quick Start alone |
| REQ-006 | Role-based navigation is present (legacy `RR-006`) | Separate paths exist for newcomers, developers, and administrators |
| REQ-007 | Links to component READMEs stay accurate (legacy `RR-007`) | Detailed content links to the MCP README, Spec Kit README, and skill READMEs without duplication |
| REQ-008 | The gate system is documented (legacy `RR-008`) | The gate system from `CLAUDE.md` is accurately summarized |
| REQ-009 | Cross-references stay consistent (legacy `RR-009`) | Links between sibling README packets remain valid and non-circular |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 18 skills and 12 agents listed with descriptions
- **SC-002**: DQI >= 75 with zero banned HVR words
- **SC-003**: Three navigation paths work: newcomer, developer, administrator
- **SC-004**: No content duplicated from component READMEs

### Acceptance Scenarios

**Given** the rewritten root README, **when** a newcomer reads the Overview and Quick Start sections, **then** they can understand the system and choose an appropriate next path.

**Given** a reviewer audits the root README against the live directories, **when** they count agents and skills, **then** the listed inventories match the repo and the README links outward for deeper detail instead of duplicating it.
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
Level 1 — Complete (2026-03-25)
Target: Complete rewrite of root README as system overview
-->

---

### Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../018-rewrite-system-speckit-readme/spec.md |
