---
title: "Feature Specific [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/090-opencode-naming-conventions/spec]"
description: "Align JavaScript naming conventions in the OpenCode framework with ecosystem standards (camelCase) instead of the current non-standard snake_case enforcement. Migrate all ~206 J..."
trigger_phrases:
  - "feature"
  - "specification"
  - "opencode"
  - "naming"
  - "convention"
  - "spec"
  - "090"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: OpenCode Naming Convention Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

Align JavaScript naming conventions in the OpenCode framework with ecosystem standards (camelCase) instead of the current non-standard snake_case enforcement. Migrate all ~206 JS files in `.opencode/skill/system-spec-kit/` and update the `sk-code-opencode` skill documentation.

**Key Decisions**: Use camelCase for JS functions/params/exports (industry standard), maintain backward-compatible aliases for MCP handlers

**Critical Dependencies**: All MCP handler exports must remain backward-compatible during migration

---

<!-- /ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-02-06 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-code-opencode` skill enforces `snake_case` for JavaScript functions, parameters, and exports. This contradicts JS ecosystem standards (MDN, Airbnb, Node.js all use camelCase). All ~206 JS files in `.opencode/skill/system-spec-kit/` follow snake_case, creating friction and inconsistency.

### Purpose
Each language in the OpenCode framework uses its ecosystem's most common convention: JS uses camelCase, Python uses snake_case (PEP 8), Shell uses snake_case (Google style).

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Part A: Update 9 skill documentation files in `sk-code-opencode/`
- Part B: Migrate ~206 JS files in `.opencode/skill/system-spec-kit/` from snake_case to camelCase
- Backward-compatible export aliases for MCP handlers

### Out of Scope
- Python files (.py) - already PEP 8 compliant
- Shell files (.sh) - already Google style compliant
- JSON/JSONC files - no naming convention change needed
- `workflows-code--web-dev` skill - separate scope
- `node_modules/` - third-party code
- File names - remain kebab-case

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-code-opencode/` (9 files) | Modify | Update naming convention docs |
| `.opencode/skill/system-spec-kit/**/*.js` (~206 files) | Modify | Rename snake_case to camelCase |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All JS function definitions use camelCase | Zero snake_case function defs (except backward-compat aliases) |
| REQ-002 | All JS function calls match their definitions | Zero orphaned snake_case calls |
| REQ-003 | MCP server starts without errors | `context-server.js` loads successfully |
| REQ-004 | Backward-compatible aliases in MCP handler exports | `module.exports` includes both camelCase and snake_case keys |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Skill documentation updated | All 9 files reflect camelCase standard |
| REQ-006 | Parameters renamed to camelCase | Zero snake_case parameter names |
| REQ-007 | Module-level variables renamed | Zero snake_case module variables (except SQL/API keys) |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: MCP server starts and responds to tool calls after migration
- **SC-002**: Zero snake_case function definitions in JS files (except backward-compat)
- **SC-003**: All 9 skill documentation files consistently describe camelCase for JS

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cross-file import mismatch after rename | High | Final sweep agent checks all cross-directory references |
| Risk | MCP handlers break if export names change | High | Backward-compatible aliases in module.exports |
| Risk | SQL column names accidentally renamed | Medium | Explicit exclusion rule: keep SQL/API key names as-is |
| Dependency | All agents must see same file state | Medium | Sequential directory groups, no overlapping files |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: MCP server startup time unchanged (no runtime impact from rename)

### Reliability
- **NFR-R01**: All existing MCP tool calls continue to work via backward-compat aliases

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Naming Boundaries
- SQL column names in template literals: Keep as-is (e.g., `session_id` in SQL)
- External API property names: Keep as-is
- Constants: Keep UPPER_SNAKE_CASE
- Destructured properties from external sources: Keep as-is

### Error Scenarios
- If a renamed function is called by its old name somewhere: Caught by verification sweep

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 25/25 | Files: ~215, LOC: >500, Systems: MCP + scripts |
| Risk | 20/25 | API: Y, Breaking: possible, Auth: N |
| Research | 10/20 | Convention standards well-documented |
| Multi-Agent | 15/15 | 10+ parallel workstreams |
| Coordination | 12/15 | Cross-directory dependencies |
| **Total** | **82/100** | **Level 3+** |

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Broken cross-file imports | H | M | Post-migration sweep agent |
| R-002 | MCP handler export mismatch | H | L | Backward-compat aliases |
| R-003 | SQL/API key accidental rename | M | L | Explicit exclusion rules |
| R-004 | Missed snake_case remnant | M | M | Grep verification pass |

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
