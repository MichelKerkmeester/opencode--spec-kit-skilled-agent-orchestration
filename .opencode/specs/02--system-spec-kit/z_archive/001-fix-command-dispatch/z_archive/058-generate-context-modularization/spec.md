---
title: "Specification: generate-context.js Modularization [058-generate-context-modularization/spec]"
description: "The generate-context.js script is a 4,837-line monolithic file containing 84 functions across 18 sections. This creates several problems"
trigger_phrases:
  - "specification"
  - "generate"
  - "context"
  - "modularization"
  - "spec"
  - "058"
importance_tier: "important"
contextType: "decision"
---
# Specification: generate-context.js Modularization

## Overview

| Field | Value |
|-------|-------|
| Spec ID | 058 |
| Title | generate-context.js Modularization |
| Category | Architecture / Refactoring |
| Priority | P1 |
| Estimated LOC | 4,837 → ~4,400 (split across ~20 files) |
| Documentation Level | 3 (Complex Architecture Change) |
| Created | 2026-01-01 |

## Problem Statement

The `generate-context.js` script is a **4,837-line monolithic file** containing 84 functions across 18 sections. This creates several problems:

### Current Pain Points

| Issue | Impact | Severity |
|-------|--------|----------|
| **AI Editability** | Claude/AI assistants consume ~46,000 tokens to read the full file, limiting context for actual work | High |
| **Cognitive Load** | Developers must mentally track dependencies across 84 functions in one file | High |
| **Testability** | No unit tests possible - functions are tightly coupled with implicit dependencies | Medium |
| **Maintainability** | Single change requires understanding entire file context | Medium |
| **Merge Conflicts** | High probability when multiple changes touch the same file | Low |

### Root Cause Analysis

The script grew organically as features were added:
- Started as simple context generator
- Added semantic summarization
- Added anchor generation
- Added alignment validation
- Added flowchart generation
- Added decision tree generation
- etc.

Each feature was added inline rather than extracted to modules, resulting in the current monolithic structure.

## Goals

### Primary Goals

1. **Modular Architecture**: Split into ~20 files with clear separation of concerns
2. **AI-Friendly File Sizes**: Each module <300 lines (fits in AI context window)
3. **Testable Units**: Individual modules can be unit tested in isolation
4. **Clean Import Structure**: Use index.js re-export pattern for intuitive imports

### Non-Goals (Explicit Exclusions)

1. **Functional Changes**: No new features, no bug fixes, no behavior changes
2. **Performance Optimization**: Not optimizing algorithms (structural change only)
3. **lib/ Reorganization**: Existing 10 lib/ modules remain unchanged
4. **API Changes**: External interface (CLI arguments, output format) unchanged

## Success Criteria

| Criterion | Measurement | Required |
|-----------|-------------|----------|
| **Output Identical** | Byte-for-byte identical output for same inputs | P0 |
| **No Runtime Errors** | All existing use cases work without errors | P0 |
| **Module Size** | All modules <300 lines | P1 |
| **No Circular Deps** | No circular import dependencies | P1 |
| **Clean Imports** | All modules importable via index.js | P1 |
| **Documentation** | All modules have JSDoc headers | P2 |
| **Performance** | No regression (same or faster execution) | P2 |

## Constraints

### Technical Constraints

1. **Node.js Compatibility**: Must work with Node.js 18+ (current requirement)
2. **No New Dependencies**: Use only existing npm packages
3. **Path Compatibility**: Must handle both JSON input and spec folder paths
4. **MCP Integration**: Database notification must continue working
5. **Template Resolution**: Templates must resolve correctly from new paths

### Process Constraints

1. **No Functional Changes**: Refactoring ONLY - no logic changes
2. **Incremental Approach**: Phase-by-phase extraction with testing between phases
3. **Rollback Ready**: Original script preserved until full validation complete
4. **Git Branch**: Work on feature branch, merge only after validation

## Scope

### In Scope

- Extracting 74 inline functions to appropriate modules
- Creating new folder structure (core/, extractors/, renderers/, spec-folder/, utils/)
- Adding index.js files for clean re-exports
- Updating import statements
- Creating snapshot tests for validation
- Updating documentation

### Out of Scope

- Modifying existing lib/ modules (10 files)
- Changing CLI interface
- Changing output format
- Adding new features
- Performance optimization
- Modifying MCP server code
- Modifying templates

## Current State Analysis

### File Statistics

| Metric | Value |
|--------|-------|
| Total Lines | 4,837 |
| Functions | 84 |
| Named Sections | 18 |
| Existing lib/ Modules | 10 |
| Inline Functions | 74 |

### Section Breakdown

| Section | Lines | % of Total |
|---------|-------|------------|
| MAIN WORKFLOW HELPERS | 2,759 | 57% |
| INPUT NORMALIZATION HELPERS | 432 | 9% |
| IMPLEMENTATION GUIDE EXTRACTION | 396 | 8% |
| HELPER FUNCTIONS | 331 | 7% |
| SESSION METADATA HELPERS | 177 | 4% |
| LIBRARY IMPORTS | 148 | 3% |
| PROJECT STATE SNAPSHOT | 117 | 2% |
| CONFIGURATION | 107 | 2% |
| Other sections | 370 | 8% |

### Dependencies

The script depends on:
- 10 lib/ modules (already extracted)
- Node.js built-ins (fs, path, readline, child_process)
- MCP server's vector-index module
- Template files in ../templates/

## Proposed Architecture

### Directory Structure

```
.opencode/skill/system-spec-kit/scripts/
├── generate-context.js          # CLI entry point (~100 lines)
├── core/
│   ├── index.js                 # Re-exports
│   ├── workflow.js              # Main orchestration (~300 lines)
│   └── config.js                # Configuration + constants (~100 lines)
├── extractors/
│   ├── index.js                 # Re-exports
│   ├── conversation-extractor.js (~200 lines)
│   ├── decision-extractor.js     (~300 lines)
│   ├── diagram-extractor.js      (~100 lines)
│   ├── file-extractor.js         (~150 lines)
│   ├── phase-extractor.js        (~90 lines)
│   └── session-extractor.js      (~150 lines)
├── renderers/
│   ├── index.js                 # Re-exports
│   └── template-renderer.js     (~200 lines)
├── spec-folder/
│   ├── index.js                 # Re-exports
│   ├── folder-detector.js       (~200 lines)
│   ├── alignment-validator.js   (~200 lines)
│   └── directory-setup.js       (~80 lines)
├── utils/
│   ├── index.js                 # Re-exports
│   ├── logger.js                (~30 lines)
│   ├── path-utils.js            (~80 lines)
│   ├── prompt-utils.js          (~80 lines)
│   ├── input-normalizer.js      (~250 lines)
│   └── data-validator.js        (~100 lines)
└── lib/                         # EXISTING (unchanged)
    ├── content-filter.js
    ├── semantic-summarizer.js
    ├── anchor-generator.js
    ├── embeddings.js
    ├── retry-manager.js
    ├── simulation-factory.js
    ├── ascii-boxes.js
    ├── flowchart-generator.js
    ├── opencode-capture.js
    └── trigger-extractor.js
```

### Module Boundaries

| Module Group | Responsibility | Dependencies |
|--------------|----------------|--------------|
| **utils/** | Pure utilities, no business logic | Node.js built-ins only |
| **extractors/** | Data extraction from conversation data | utils/, lib/ |
| **renderers/** | Template rendering and output formatting | utils/, lib/ |
| **spec-folder/** | Spec folder detection and validation | utils/, extractors/ |
| **core/** | Orchestration and configuration | All modules |
| **CLI** | Entry point, argument parsing | core/ |

### Import Flow (Strict Layering)

```
CLI (generate-context.js)
    ↓
core/ (workflow.js, config.js)
    ↓
spec-folder/ + extractors/ + renderers/
    ↓
utils/
    ↓
lib/ (existing)
    ↓
Node.js built-ins
```

**Rule**: Imports flow DOWN only. No upward or circular imports.

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Functional Regression | Medium | High | Snapshot tests before refactoring |
| Circular Dependencies | Medium | Medium | Strict layering enforcement |
| Scope Creep | High | Medium | "No functional changes" rule |
| Path Resolution Bugs | Medium | Medium | Centralized config for paths |
| Integration Breakage | Low | High | Test MCP integration explicitly |

## References

- [Current generate-context.js](.opencode/skill/system-spec-kit/scripts/generate-context.js)
- [Existing lib/ modules](.opencode/skill/system-spec-kit/scripts/lib/)
- [MCP server integration](.opencode/skill/system-spec-kit/mcp_server/)
- [Templates](.opencode/skill/system-spec-kit/templates/)
