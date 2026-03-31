---
title: "Implementation [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/066-context-server-modularization/plan]"
description: "Implementation plan for decomposing context-server.js (2,703 LOC) into focused modules."
trigger_phrases:
  - "implementation"
  - "plan"
  - "context"
  - "server"
  - "modularization"
  - "066"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Context-Server Modularization - Technical Approach & Architecture

Implementation plan for decomposing context-server.js (2,703 LOC) into focused modules.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:summary -->
## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: mcp-server, modularization, architecture
- **Priority**: P1
- **Branch**: `066-context-server-modularization`
- **Date**: 2026-01-15
- **Spec**: [spec.md](./spec.md)

### Input
Feature specification from `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/066-context-server-modularization/spec.md`

### Summary
Decompose the monolithic context-server.js (2,703 lines) into 17 focused modules across 5 directories (handlers/, core/, formatters/, utils/, hooks/), following the proven Spec 058 pattern that successfully modularized generate-context.js from 4,837 to 145 lines.

### Technical Context

- **Language/Version**: Node.js 18+ (CommonJS)
- **Primary Dependencies**: @modelcontextprotocol/sdk, better-sqlite3, sqlite-vec
- **Storage**: SQLite with vector extensions
- **Testing**: Manual MCP tool testing, snapshot comparison
- **Target Platform**: macOS/Linux server
- **Project Type**: Single-project MCP server
- **Constraints**: No behavior changes, identical MCP interface

---

<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready (DoR)
- [x] Problem statement clear; scope documented
- [x] Prior work analyzed (Spec 058 pattern)
- [x] Constraints known (lib/ unchanged, <300 LOC per module)
- [x] Success criteria measurable (<200 LOC entry point)

### Definition of Done (DoD)
- [ ] All modules <300 lines
- [ ] context-server.js <200 lines
- [ ] All 12 MCP tools work identically
- [ ] Startup scan completes
- [ ] SK-004 memory surfacing works

### Rollback Guardrails
- **Stop Signals**: Any MCP tool fails, behavior change detected
- **Recovery Procedure**: Git revert to pre-modularization commit

<!-- /ANCHOR:quality-gates -->
---

## 3. PROJECT STRUCTURE

### Architecture Overview

Follow the **Spec 058 pattern**: Entry point imports from organized directories, each directory has index.js re-exports.

**Key Architectural Decisions:**
- **Pattern**: Layered modules with strict import direction
- **Data Flow**: Request → Handler → Formatter → Response
- **State Management**: Database passed via init() or function params

### Target Structure

```
mcp_server/
├── context-server.js          (Entry point, ~150-200 lines)
├── core/
│   ├── index.js               (Re-exports)
│   ├── config.js              (Server configuration, constants)
│   ├── server-setup.js        (MCP server initialization)
│   └── db-state.js            (Database update detection, rate limiting)
├── handlers/
│   ├── index.js               (Re-exports all handlers)
│   ├── memory-search.js       (handleMemorySearch)
│   ├── memory-triggers.js     (handleMemoryMatchTriggers)
│   ├── memory-crud.js         (delete, update, list, stats, health)
│   ├── memory-save.js         (handleMemorySave, indexMemoryFile)
│   ├── memory-index.js        (handleMemoryIndexScan, batch processing)
│   └── checkpoints.js         (checkpoint operations)
├── formatters/
│   ├── index.js               (Re-exports)
│   ├── search-results.js      (formatSearchResults with anchor extraction)
│   └── token-metrics.js       (estimateTokens, calculateTokenMetrics)
├── utils/
│   ├── index.js               (Re-exports)
│   ├── validators.js          (validateQuery, validateInputLengths)
│   ├── json-helpers.js        (safeJsonParse)
│   └── batch-processor.js     (processWithRetry, processBatches)
├── hooks/
│   ├── index.js               (Re-exports)
│   └── memory-surface.js      (SK-004: auto_surface_memories)
└── lib/                       (UNCHANGED - 28 existing modules)
```

### Import Layering (Strict Direction)

```
context-server.js
       ↓
     core/
       ↓
   handlers/
       ↓
  formatters/
       ↓
    utils/
       ↓
     lib/
       ↓
   shared/
       ↓
   Node.js
```

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation
- **Goal**: Create baseline for comparison, set up directory structure
- **Deliverables**:
  - Snapshot of current MCP tool outputs
  - Directory structure created
  - Dependency map documented
- **Duration**: 1 session

### Phase 2: Utils Extraction (Lowest Risk)
- **Goal**: Extract standalone utilities with no dependencies
- **Deliverables**:
  - `utils/validators.js` (validateQuery, validateInputLengths, INPUT_LIMITS)
  - `utils/json-helpers.js` (safeJsonParse)
  - `utils/batch-processor.js` (processWithRetry, processBatches)
  - `utils/index.js` (re-exports)
- **Duration**: 1 session

### Phase 3: Formatters Extraction
- **Goal**: Extract response formatting logic
- **Deliverables**:
  - `formatters/token-metrics.js` (estimateTokens, calculateTokenMetrics)
  - `formatters/search-results.js` (formatSearchResults with anchor extraction)
  - `formatters/index.js` (re-exports)
- **Duration**: 1 session

### Phase 4: Core Extraction
- **Goal**: Extract server configuration and state management
- **Deliverables**:
  - `core/config.js` (constants, paths, limits)
  - `core/db-state.js` (checkDatabaseUpdated, getLastScanTime, setLastScanTime)
  - `core/server-setup.js` (tool definitions, server creation)
  - `core/index.js` (re-exports)
- **Duration**: 1 session

### Phase 5: Handlers Extraction
- **Goal**: Extract all MCP tool handlers
- **Deliverables**:
  - `handlers/memory-search.js` (handleMemorySearch)
  - `handlers/memory-triggers.js` (handleMemoryMatchTriggers)
  - `handlers/memory-crud.js` (delete, update, list, stats, health)
  - `handlers/memory-save.js` (handleMemorySave, indexMemoryFile)
  - `handlers/memory-index.js` (handleMemoryIndexScan)
  - `handlers/checkpoints.js` (checkpoint operations)
  - `handlers/index.js` (re-exports)
- **Duration**: 2 sessions

### Phase 6: Hooks Extraction
- **Goal**: Extract SK-004 memory surfacing
- **Deliverables**:
  - `hooks/memory-surface.js` (auto_surface_memories, constitutional caching)
  - `hooks/index.js` (re-exports)
- **Duration**: 1 session

### Phase 7: Entry Point Refactor
- **Goal**: Slim context-server.js to orchestration only
- **Deliverables**:
  - context-server.js reduced to ~150-200 lines
  - Clean imports from all new directories
  - Only main(), startup scan, signal handlers remain
- **Duration**: 1 session

### Phase 8: Cleanup & Validation
- **Goal**: Verify no behavior changes
- **Deliverables**:
  - All MCP tools tested
  - Snapshot comparison passes
  - Documentation updated
- **Duration**: 1 session

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Snapshot Testing
- Capture current MCP tool outputs before modularization
- Compare outputs after each phase
- Any difference indicates behavior change (failure)

### Manual Tool Testing
After each phase, verify:
- `memory_search` returns expected results
- `memory_match_triggers` cognitive pipeline works
- `memory_save` indexes correctly
- All checkpoint operations work
- Startup scan completes

### Integration Testing
- Start MCP server
- Execute all 12 tools via Claude Code
- Verify no errors in console

<!-- /ANCHOR:testing -->
---

## 6. SUCCESS METRICS

### Functional Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| MCP tools working | 12/12 | Manual testing |
| Behavior changes | 0 | Snapshot comparison |

### Code Quality Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| context-server.js lines | <200 | wc -l |
| Max module size | <300 lines | wc -l per file |
| New modules created | 17 | ls count |

---

## 7. RISKS & MITIGATIONS

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy |
|---------|-------------|--------|------------|---------------------|
| R-001 | Circular dependency | Med | Low | Strict import layering, lint checks |
| R-002 | Handler behavior change | High | Low | Snapshot testing after each extraction |
| R-003 | Missing export | Med | Med | Index.js re-export pattern |
| R-004 | Performance regression | Low | Low | Benchmark startup time |

### Rollback Plan
- **Rollback Trigger**: Any tool fails or behavior changes
- **Rollback Procedure**: `git revert HEAD` to restore original
- **Verification**: Run all 12 tools to confirm working

---

<!-- ANCHOR:dependencies -->
## 8. DEPENDENCIES

### Internal Dependencies

| Dependency | Type | Owner | Status | Impact if Blocked |
|------------|------|-------|--------|-------------------|
| lib/ modules (28) | Internal | System | Green | None - unchanged |
| Spec 058 patterns | Reference | System | Green | Reference only |

### External Dependencies

| Dependency | Type | Vendor | Status | Impact if Blocked |
|------------|------|--------|--------|-------------------|
| @modelcontextprotocol/sdk | External | Anthropic | Green | MCP interface |
| better-sqlite3 | External | npm | Green | Database operations |

<!-- /ANCHOR:dependencies -->
---

## 9. COMMUNICATION & REVIEW

### Checkpoints
- After each phase: Verify MCP tools work
- After Phase 8: Full validation before merge

### Approvals
- Self-review after each phase
- Final review after Phase 8 completion

---

## 10. REFERENCES

### Related Documents
- **Feature Specification**: See `spec.md` for requirements
- **Task Breakdown**: See `tasks.md` for implementation tasks
- **Checklist**: See `checklist.md` for validation

### Prior Work
- **Spec 058**: .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/058-generate-context-modularization
  - Successfully modularized 4,837 → 145 lines
  - Established patterns: core/, extractors/, utils/, index.js re-exports
- **Spec 064**: .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix
  - Recent fixes to context-server.js (await, rate limiting)
