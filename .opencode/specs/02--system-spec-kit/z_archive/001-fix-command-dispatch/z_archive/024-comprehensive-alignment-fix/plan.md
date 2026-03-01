---
title: "Implementation Plan [024-comprehensive-alignment-fix/plan]"
description: "Three-phase approach addressing issues by priority. Each phase must complete before the next begins (P0 fixes may unblock P1 work)."
trigger_phrases:
  - "implementation"
  - "plan"
  - "024"
  - "comprehensive"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan

## Overview

Three-phase approach addressing issues by priority. Each phase must complete before the next begins (P0 fixes may unblock P1 work).

---

## Phase 1: P0 Critical Fixes

**Timeline**: First priority - complete before any other work

### 1.1 YAML Syntax Errors
- **Issue**: Command YAML files contain syntax errors preventing parsing
- **Fix**: Validate and correct YAML syntax in all command definitions
- **Verification**: `yamllint` passes on all files

### 1.2 Script Path Corrections
- **Issue**: Commands reference scripts at incorrect/outdated paths
- **Fix**: Update all script paths to match actual locations
- **Verification**: All referenced scripts exist and execute

### 1.3 Missing Command Implementation
- **Issue**: A command is referenced but implementation is missing
- **Fix**: Implement missing command or remove references
- **Verification**: Command executes or references removed

### 1.4 Documentation Contradiction
- **Issue**: Conflicting instructions between AGENTS.md and skill docs
- **Fix**: Resolve contradiction, establish single source of truth
- **Verification**: No conflicting guidance exists

---

## Phase 2: P1 High Priority Fixes

**Timeline**: After P0 completion

### 2.1 Bash Version Compatibility
- **Issue**: Scripts use Bash 4+ features on systems with Bash 3
- **Fix**: Use POSIX-compatible alternatives or add version checks
- **Verification**: Scripts run on both Bash 3.x and 4.x

### 2.2 JSON Escaping Issues
- **Issue**: Command outputs contain unescaped JSON causing parse errors
- **Fix**: Properly escape JSON strings in all outputs
- **Verification**: JSON output parses without errors

### 2.3 AGENTS.md Updates
- **Issue**: AGENTS.md contains outdated tool references and workflows
- **Fix**: Update to reflect current system state
- **Verification**: All references in AGENTS.md are valid

### 2.4 Template Alignment
- **Issue**: Templates don't match actual folder/file structures
- **Fix**: Update templates to match reality
- **Verification**: Templates produce valid structures

### 2.5 Command Parameter Types
- **Issue**: Parameter types don't match expected inputs
- **Fix**: Correct parameter type definitions
- **Verification**: Commands accept valid inputs without type errors

### 2.6 Skill Reference Updates
- **Issue**: Skills reference outdated or renamed dependencies
- **Fix**: Update all skill references
- **Verification**: Skills load and execute correctly

### 2.7 Error Handling Paths
- **Issue**: Error paths reference non-existent handlers
- **Fix**: Correct error handling paths
- **Verification**: Errors route to valid handlers

### 2.8 Validation Script Fixes
- **Issue**: validate-spec.sh has logic errors
- **Fix**: Correct validation logic
- **Verification**: Validation produces accurate results

---

## Phase 3: P2 Medium Priority Fixes

**Timeline**: After P1 completion

### 3.1 Glob Tool Documentation
- **Issue**: Glob tool docs don't match current behavior
- **Fix**: Update documentation to match implementation
- **Verification**: Docs accurately describe tool behavior

### 3.2 Obsolete Template Markers
- **Issue**: Templates contain placeholder markers that should be removed
- **Fix**: Remove or replace obsolete markers
- **Verification**: No placeholder markers remain in production

### 3.3 Documentation Cross-References
- **Issue**: Docs reference files/sections that have moved
- **Fix**: Update all cross-references
- **Verification**: All links and references resolve

### 3.4 Deprecated Instruction Cleanup
- **Issue**: Old instructions for deprecated features remain
- **Fix**: Remove or archive deprecated content
- **Verification**: No references to deprecated features

---

## Dependencies

```
P0.1 (YAML) ──┬──> P1.* (all P1 items depend on valid YAML)
P0.2 (Paths) ─┤
P0.3 (Missing)┤
P0.4 (Contradict)┘

P1.3 (AGENTS.md) ──> P2.3 (Cross-refs depend on stable AGENTS.md)
P1.4 (Templates) ──> P2.2 (Markers depend on template decisions)
```

## Rollback Plan

Each fix is isolated. If a fix causes issues:
1. Revert specific file(s) via git
2. Document issue in `memory/` for next attempt
3. Continue with other fixes
