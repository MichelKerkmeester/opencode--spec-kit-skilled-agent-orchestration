---
title: "Dec [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/066-context-server-modularization/decision-record]"
description: "Architecture Decision Record documenting the modularization approach for context-server.js."
trigger_phrases:
  - "decision"
  - "context"
  - "server"
  - "modularization"
  - "architecture"
  - "decision record"
  - "066"
importance_tier: "important"
contextType: "planning"
---
# Decision: Context-Server Modularization Architecture - ADR

Architecture Decision Record documenting the modularization approach for context-server.js.

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Decision ID**: ADR-066
- **Status**: Accepted
- **Date**: 2026-01-15
- **Deciders**: Engineering team
- **Related Feature**: [spec.md](./spec.md)
- **Supersedes**: N/A
- **Superseded By**: N/A

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:context -->
## 2. CONTEXT

### Problem Statement
The context-server.js file is 2,703 lines - too large for effective AI-assisted development and human code review. The file mixes multiple concerns: MCP server setup, tool handlers, response formatting, database state management, and memory surfacing hooks.

### Current Situation
- context-server.js: 2,703 lines (monolithic)
- lib/ folder: 28 well-organized modules (already modularized)
- Spec 058 successfully modularized generate-context.js: 4,837 → 145 lines

### Constraints
- Must maintain identical MCP tool interface (no breaking changes)
- All 12 MCP tools must work identically after refactoring
- lib/ modules must remain unchanged (already stable)
- Each new module must be <300 lines (AI-editable)

### Assumptions
- Spec 058 pattern is proven and should be followed
- Index.js re-export pattern provides clean imports
- Layered imports prevent circular dependencies
- No behavior changes are acceptable

<!-- /ANCHOR:context -->
---

<!-- ANCHOR:decision -->
## 3. DECISION

### Summary
Follow the Spec 058 pattern: decompose context-server.js into 5 directories (core/, handlers/, formatters/, utils/, hooks/) with 17 focused modules, reducing the entry point to ~150-200 lines.

### Detailed Description
Create a layered module structure where:
- **core/** handles server configuration, setup, and state management
- **handlers/** contains all MCP tool handler implementations
- **formatters/** handles response formatting and token metrics
- **utils/** provides standalone utility functions
- **hooks/** implements SK-004 memory surfacing

Each directory has an index.js for clean re-exports. The entry point (context-server.js) becomes a thin orchestration layer that imports from these directories.

### Technical Approach
```
mcp_server/
├── context-server.js          (~150-200 lines - entry point only)
├── core/
│   ├── index.js               (re-exports)
│   ├── config.js              (constants, paths)
│   ├── server-setup.js        (MCP initialization)
│   └── db-state.js            (database state management)
├── handlers/
│   ├── index.js               (re-exports)
│   ├── memory-search.js
│   ├── memory-triggers.js
│   ├── memory-crud.js
│   ├── memory-save.js
│   ├── memory-index.js
│   └── checkpoints.js
├── formatters/
│   ├── index.js               (re-exports)
│   ├── search-results.js
│   └── token-metrics.js
├── utils/
│   ├── index.js               (re-exports)
│   ├── validators.js
│   ├── json-helpers.js
│   └── batch-processor.js
├── hooks/
│   ├── index.js               (re-exports)
│   └── memory-surface.js
└── lib/                       (UNCHANGED - 28 modules)
```

<!-- /ANCHOR:decision -->
---

## 4. ALTERNATIVES CONSIDERED

### Option 1: [CHOSEN] Spec 058 Pattern (Directory-Based)

**Description**: Create sibling directories (core/, handlers/, etc.) following the proven Spec 058 pattern.

**Pros**:
- Proven pattern (Spec 058 achieved 97% reduction)
- Clear separation of concerns
- Familiar structure for team
- Index.js re-exports for clean imports

**Cons**:
- 17 new files to create
- Need to maintain import layering

**Score**: 9/10

**Why Chosen**: Proven pattern with documented success, matches existing codebase conventions.

---

### Option 2: Add to lib/ Folder

**Description**: Add new modules directly to existing lib/ folder.

**Pros**:
- Simpler structure
- Fewer directories
- Existing pattern

**Cons**:
- Mixes orchestration with utility modules
- lib/ already has 28 modules (would become cluttered)
- Different concern levels mixed together
- Handlers don't belong in "lib"

**Score**: 4/10

**Why Rejected**: lib/ contains low-level utilities, not orchestration code. Mixing concerns would reduce clarity.

---

### Option 3: Single handlers.js File

**Description**: Extract all handlers to one large handlers.js file.

**Pros**:
- Single file to manage
- Fewer modules

**Cons**:
- Would still be ~1,200 lines
- Doesn't solve AI cognitive load problem
- Violates <300 line target

**Score**: 3/10

**Why Rejected**: Doesn't achieve the goal of AI-editable module sizes.

---

### Comparison Matrix

| Criterion | Weight | Spec 058 Pattern | Add to lib/ | Single handlers.js |
|-----------|--------|------------------|-------------|-------------------|
| Proven pattern | 10 | 10 | 6 | 3 |
| Module size <300 | 10 | 10 | 8 | 2 |
| Clear separation | 8 | 9 | 4 | 5 |
| Implementation effort | 6 | 6 | 8 | 9 |
| Maintainability | 9 | 9 | 5 | 4 |
| **Weighted Score** | - | **9.0** | 5.8 | 4.0 |

---

<!-- ANCHOR:consequences -->
## 5. CONSEQUENCES

### Positive Consequences
- Entry point reduced from 2,703 to ~150-200 lines (93% reduction)
- All modules <300 lines (AI-editable)
- Clear separation of concerns (handlers vs formatters vs utils)
- Follows proven Spec 058 pattern
- Each module independently testable

### Negative Consequences
- 17 new files to create and maintain
  - *Mitigation*: Index.js re-exports simplify imports
- Import layering must be maintained
  - *Mitigation*: Lint rules can enforce layering

### Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Circular dependency | Med | Low | Strict import layering |
| Missing export | Med | Med | Index.js pattern, testing |
| Behavior change | High | Low | Snapshot testing |

### Technical Debt Introduced
- None - this is a debt reduction effort

<!-- /ANCHOR:consequences -->
---

## 6. IMPLEMENTATION NOTES

**Phased Approach** (8 phases):
1. Preparation - baseline, directory structure
2. Utils extraction - lowest risk, no dependencies
3. Formatters extraction - response formatting
4. Core extraction - config, state, setup
5. Handlers extraction - all 12 tool handlers
6. Hooks extraction - SK-004 memory surfacing
7. Entry point refactor - slim context-server.js
8. Cleanup & validation - verify no behavior changes

**Parallel Work:**
- [P] Utils modules can be extracted in parallel
- [P] Handler modules can be extracted in parallel (after utils)
- Sequential: Entry point refactor must be last

---

## 7. IMPACT ASSESSMENT

### Systems Affected
- context-server.js - Major refactoring
- MCP tool interface - No changes (same API)
- lib/ modules - No changes (unchanged)

### Teams Impacted
- Engineering - New module structure to learn
- AI Assistants - Improved cognitive load

### Migration Path
No migration needed - internal refactoring only, no external API changes.

### Rollback Strategy
Git revert to pre-modularization commit. No database or configuration changes.

---

## 8. TIMELINE

- **Decision Made**: 2026-01-15
- **Implementation Start**: 2026-01-15
- **Target Completion**: TBD (8 sessions estimated)
- **Review Date**: After Phase 8 completion

---

## 9. REFERENCES

### Related Documents
- **Feature Specification**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)

### Prior Work
- **Spec 058**: .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/058-generate-context-modularization
  - Successfully modularized 4,837 → 145 lines
  - Established patterns now being followed

---

## 10. APPROVAL & SIGN-OFF

### Approvers

| Name | Role | Approved | Date | Comments |
|------|------|----------|------|----------|
| Engineering | Technical Lead | Yes | 2026-01-15 | Follows proven Spec 058 pattern |

### Status Changes

| Date | Previous Status | New Status | Reason |
|------|----------------|------------|--------|
| 2026-01-15 | - | Proposed | Initial proposal |
| 2026-01-15 | Proposed | Accepted | Aligned with prior work |

---

## 11. UPDATES & AMENDMENTS

### Amendment History

| Date | Change | Reason | Updated By |
|------|--------|--------|------------|
| 2026-01-15 | Initial ADR created | Document architectural decision | Engineering |

---

**Review Schedule**: This decision should be reviewed after Phase 8 completion to assess effectiveness.
