---
title: "Post-Merger System Refinement [036-post-merge-refinement-1/spec]"
description: "id: 036-post-merge-refinement"
trigger_phrases:
  - "post"
  - "merger"
  - "system"
  - "refinement"
  - "spec"
  - "036"
importance_tier: "important"
contextType: "decision"
created: 2025-12-25
id: 036-post-merge-refinement
priority: High
status: Active
---
# Post-Merger System Refinement

## Overview

| Field | Value |
|-------|-------|
| **Spec ID** | 036-post-merge-refinement |
| **Parent** | 003-memory-and-spec-kit |
| **Status** | Active |
| **Priority** | High |
| **Created** | 2025-12-25 |

## Problem Statement

Following the successful merger of system-memory and system-spec-kit (035-memory-speckit-merger), a comprehensive analysis revealed **29 issues** requiring attention:

- **3 Critical (P0)**: Blocking issues that break core workflows
- **8 High (P1)**: Significant bugs affecting functionality
- **10 Medium (P2)**: Quality and consistency issues
- **8 Low (P3)**: Documentation and minor improvements

## Critical Issues (P0)

### 1. Missing validate-spec.sh Script [BLOCKER]
- **Location**: Referenced in SKILL.md:537-636 (100+ lines of documentation)
- **Impact**: Gate 6 completion verification cannot run
- **Details**: Extensive documentation exists for a script that doesn't exist in scripts/

### 2. MCP Tool Naming Mismatch
- **Location**: SKILL.md:107-112, 389-397
- **Impact**: Users copying tool names from docs get errors
- **Issue**: Documentation shows `memory_save()` but actual tool is `semantic_memory_memory_save`

### 3. Missing recommend-level.sh Script
- **Location**: Referenced in SKILL.md:172
- **Impact**: Automated level recommendation unavailable

## High-Priority Issues (P1)

### 4. Placeholder Validation Gap
- Template uses Mustache `{{PLACEHOLDER}}` but validation checks for `[YOUR_VALUE_HERE:]`

### 5. Code Duplication Between Lib Directories
- `scripts/lib/*.js` and `mcp_server/lib/*.js` contain overlapping modules

### 6. Missing YAML Assets for /spec_kit:plan
- `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml` referenced but may not exist

### 7. Constitutional Tier Missing from Context Template
- `context_template.md` lists only 5 tiers, missing `constitutional`

### 8. memory_load Tool Reference (Phantom Tool)
- `resume.md:407-409` references non-existent `memory_load` tool

## Scope

### In Scope
- Fix all P0 critical issues
- Fix all P1 high-priority issues
- Document P2/P3 issues for future work

### Out of Scope
- Major architectural changes
- New feature development
- Performance optimization

## Success Criteria

1. All P0 issues resolved and verified
2. All P1 issues resolved and verified
3. Gate 6 validation workflow functional
4. MCP tool documentation accurate
5. No phantom script/tool references

## Dependencies

- 035-memory-speckit-merger (completed)
- system-spec-kit skill
- spec_kit and memory commands

## References

- Analysis performed: 2025-12-25
- Agents used: 5 parallel general agents
- Components analyzed: merger spec, spec_kit commands (8), memory commands (3), skill implementation, cross-system alignment
