---
title: "Feature Specif [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/066-context-server-modularization/spec]"
description: "Decompose the monolithic context-server.js (2,703 LOC) into focused modules following the Spec 058 pattern."
trigger_phrases:
  - "feature"
  - "specification"
  - "context"
  - "server"
  - "modularization"
  - "spec"
  - "066"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 3 -->
# Feature Specification: Context-Server Modularization - Requirements & User Stories

Decompose the monolithic context-server.js (2,703 LOC) into focused modules following the Spec 058 pattern.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Level**: 3
- **Tags**: mcp-server, modularization, architecture
- **Priority**: P1
- **Feature Branch**: `066-context-server-modularization`
- **Created**: 2026-01-15
- **Status**: Draft
- **Input**: Analysis of context-server.js showing 2,703 lines with extractable orchestration code

### Stakeholders
- Engineering (code maintainability)
- AI Assistants (cognitive load reduction)

### Problem Statement
The context-server.js file is 2,703 lines - too large for efficient AI-assisted development and human review. While the lib/ folder (28 modules) is well-organized, the orchestration layer remains monolithic, mixing:
- MCP server setup
- Tool handler implementations (12 tools)
- Response formatting & token metrics
- Database state management
- Memory surfacing hooks (SK-004)

### Purpose
Reduce context-server.js to ~150-200 lines by extracting orchestration code into focused modules (handlers/, core/, formatters/, utils/, hooks/), following the proven Spec 058 pattern.

### Assumptions
- Spec 058 pattern (generate-context.js modularization) is the proven approach
- lib/ folder (28 modules) remains unchanged - already well-organized
- No behavior changes - pure refactoring
- All existing MCP tools continue to work identically

---

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:scope -->
## 2. SCOPE

### In Scope
- Extract tool handlers to `handlers/` directory (6 modules)
- Extract server setup/config to `core/` directory (4 modules)
- Extract response formatting to `formatters/` directory (3 modules)
- Extract utilities to `utils/` directory (4 modules)
- Extract memory surfacing to `hooks/` directory (2 modules)
- Slim context-server.js to entry point (~150-200 lines)
- Create index.js re-export files for each directory

### Out of Scope
- Changes to lib/ modules (already modularized)
- New features or behavior changes
- Performance optimizations beyond modularization
- Breaking changes to MCP tool interface

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/context-server.js` | Modify | Slim to ~150-200 lines, import from new modules |
| `mcp_server/core/index.js` | Create | Re-export core modules |
| `mcp_server/core/config.js` | Create | Server configuration, constants |
| `mcp_server/core/server-setup.js` | Create | MCP server initialization |
| `mcp_server/core/db-state.js` | Create | Database update detection, rate limiting |
| `mcp_server/handlers/index.js` | Create | Re-export all handlers |
| `mcp_server/handlers/memory-search.js` | Create | handleMemorySearch |
| `mcp_server/handlers/memory-triggers.js` | Create | handleMemoryMatchTriggers (cognitive pipeline) |
| `mcp_server/handlers/memory-crud.js` | Create | delete, update, list, stats, health |
| `mcp_server/handlers/memory-save.js` | Create | handleMemorySave, indexMemoryFile |
| `mcp_server/handlers/memory-index.js` | Create | handleMemoryIndexScan, batch processing |
| `mcp_server/handlers/checkpoints.js` | Create | checkpoint operations |
| `mcp_server/formatters/index.js` | Create | Re-export formatters |
| `mcp_server/formatters/search-results.js` | Create | formatSearchResults with anchor extraction |
| `mcp_server/formatters/token-metrics.js` | Create | estimateTokens, calculateTokenMetrics |
| `mcp_server/utils/index.js` | Create | Re-export utilities |
| `mcp_server/utils/validators.js` | Create | validateQuery, validateInputLengths |
| `mcp_server/utils/json-helpers.js` | Create | safeJsonParse |
| `mcp_server/utils/batch-processor.js` | Create | processWithRetry, processBatches |
| `mcp_server/hooks/index.js` | Create | Re-export hooks |
| `mcp_server/hooks/memory-surface.js` | Create | SK-004 auto_surface_memories |

<!-- /ANCHOR:scope -->
---

## 3. USERS & STORIES

### User Story 1 - AI Assistant Cognitive Load (Priority: P0)

As an AI assistant, I need smaller, focused files so that I can efficiently understand, modify, and debug code without exceeding context limits.

**Why This Priority**: P0 because the primary driver is improving AI-assisted development - 2,703 lines is too large for effective AI code understanding.

**Independent Test**: AI assistants can read and understand each module independently. Each module fits comfortably in context window.

**Acceptance Scenarios**:
1. **Given** any new module, **When** AI reads it, **Then** the module is <300 lines and self-contained
2. **Given** context-server.js, **When** AI reads it, **Then** it's a clear orchestration layer <200 lines

---

### User Story 2 - Developer Maintainability (Priority: P1)

As a developer, I need clear separation of concerns so that I can find and modify specific functionality without understanding the entire file.

**Why This Priority**: P1 because maintainability is essential but secondary to AI tooling.

**Independent Test**: Developer can find any handler/formatter/utility by navigating predictable directory structure.

**Acceptance Scenarios**:
1. **Given** a bug in memory search, **When** developer looks for code, **Then** it's in `handlers/memory-search.js`
2. **Given** a new MCP tool, **When** developer adds it, **Then** they create a focused handler file

---

### User Story 3 - Testability Improvement (Priority: P2)

As a developer, I need isolated modules so that I can unit test handlers and formatters independently.

**Why This Priority**: P2 because testing improvements are valuable but not blocking.

**Independent Test**: Each module can be imported and tested without full server initialization.

**Acceptance Scenarios**:
1. **Given** formatters/token-metrics.js, **When** imported in test, **Then** functions work without database
2. **Given** handlers/memory-search.js, **When** mocked dependencies provided, **Then** handler logic testable

---

<!-- ANCHOR:requirements -->
## 4. FUNCTIONAL REQUIREMENTS

- **REQ-FUNC-001:** System MUST maintain identical MCP tool interface (no breaking changes)
- **REQ-FUNC-002:** System MUST pass all existing tests after modularization
- **REQ-FUNC-003:** All modules MUST be <300 lines each
- **REQ-FUNC-004:** context-server.js MUST be <200 lines after refactoring
- **REQ-FUNC-005:** Each directory MUST have index.js for clean imports
- **REQ-FUNC-006:** Import layering MUST follow: context-server → core → handlers → formatters → utils → lib

### Traceability Mapping

| User Story | Related Requirements | Notes |
|------------|---------------------|-------|
| Story 1 - AI Cognitive Load | REQ-FUNC-003, REQ-FUNC-004 | Module size limits |
| Story 2 - Developer Maintainability | REQ-FUNC-005, REQ-FUNC-006 | Clean structure |
| Story 3 - Testability | REQ-FUNC-001, REQ-FUNC-002 | No breaking changes |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:requirements -->
## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No performance regression - startup time within 10% of current
- **NFR-P02**: No additional memory overhead from module loading

### Reliability
- **NFR-R01**: All 12 MCP tools work identically after modularization
- **NFR-R02**: Startup scan completes successfully
- **NFR-R03**: SK-004 memory surfacing continues to work

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 6. EDGE CASES

### Module Dependencies
- What happens when circular dependency introduced? → Lint/test should catch
- What happens when module imported before init? → Follow existing init(db) pattern

### Error Handling
- What happens when handler throws? → Error propagates to MCP layer as before
- What happens when formatter receives null? → Existing null checks preserved

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:success-criteria -->
## 7. SUCCESS CRITERIA

### Measurable Outcomes
- **SC-001**: context-server.js reduced from 2,703 to <200 lines
- **SC-002**: All new modules <300 lines each
- **SC-003**: All 12 MCP tools pass functional tests
- **SC-004**: Zero behavior changes (same responses for same inputs)

<!-- /ANCHOR:success-criteria -->
---

## 8. DEPENDENCIES & RISKS

### Dependencies

| Dependency | Type | Owner | Status | Impact if Blocked |
|------------|------|-------|--------|-------------------|
| lib/ modules | Internal | System | Green | None - unchanged |
| Spec 058 patterns | Internal | System | Green | Reference only |

### Risk Assessment

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy |
|---------|-------------|--------|------------|---------------------|
| R-001 | Circular dependency introduced | Med | Low | Strict import layering |
| R-002 | Handler behavior changes | High | Low | Snapshot testing |
| R-003 | Performance regression | Med | Low | Benchmark before/after |

### Rollback Plan
- **Rollback Trigger**: Any MCP tool fails or behavior changes
- **Rollback Procedure**: Revert commit, restore original context-server.js

---

<!-- ANCHOR:scope -->
## 9. OUT OF SCOPE

- lib/ module changes - already well-organized (28 modules)
- New MCP tools or features
- Performance optimizations beyond modularization
- Database schema changes

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

All questions resolved through prior work analysis:
- Pattern to follow: Spec 058 (generate-context.js modularization)
- lib/ status: Already modularized, leave unchanged
- Module size target: <300 lines (proven in Spec 058)

<!-- /ANCHOR:questions -->
---

## 11. APPENDIX

### References
- **Prior Work**: .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/058-generate-context-modularization
- **Related Fixes**: .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix
- **Anchor System**: .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/065-anchor-system-implementation

---

## 12. WORKING FILES

### File Organization During Development
- `scratch/` - Test scripts, debug output
- `memory/` - Session context
- Root - Permanent documentation

---

## 13. CHANGELOG

### Version History

#### v1.0 (2026-01-15)
**Initial specification**
- Defined 8-phase modularization approach
- Identified 17 new modules across 5 directories
- Target: 2,703 → ~150-200 lines for entry point

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md` for technical approach and architecture
- **Task Breakdown**: See `tasks.md` for implementation task list
- **Validation Checklist**: See `checklist.md` for QA and validation procedures
- **Decision Record**: See `decision-record.md` for architectural decisions
