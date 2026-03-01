---
title: "Spec: Fix generate-context.js Template Warnings and API Mismatch [084-generate-context-template-warnings/spec]"
description: "When running generate-context.js, two issues occur"
trigger_phrases:
  - "spec"
  - "fix"
  - "generate"
  - "context"
  - "template"
  - "084"
importance_tier: "important"
contextType: "decision"
---
# Spec: Fix generate-context.js Template Warnings and API Mismatch

## Problem Statement

When running `generate-context.js`, two issues occur:

1. **Critical Error**: `vector_index.get_db is not a function` - Prevents retry processing
2. **Warnings**: 17 template placeholders not populated (cosmetic but noisy)

## Root Cause Analysis

### Issue 1: API Naming Mismatch

`retry-manager.js` uses snake_case method calls but `vector-index.js` exports camelCase:

| Called | Exported |
|--------|----------|
| `vector_index.initialize_db()` | `initializeDb` |
| `vector_index.get_db()` | `getDb` |
| `vector_index.get_memory()` | `getMemory` |

**Location:** `.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.js`

### Issue 2: Unimplemented Template Variables

`context_template.md` v2.2 added verification/decay variables that the renderer doesn't populate:

- Memory verification: `MEMORY_FILE_EXISTS`, `CHECKSUMS_MATCH`, `NO_DEDUP_CONFLICTS`
- Decay parameters: `MEMORY_TYPE`, `HALF_LIFE_DAYS`, `BASE_DECAY_RATE`, etc.

**Location:** `.opencode/skill/system-spec-kit/templates/context_template.md`

## Goals

1. Fix the `get_db is not a function` error (P0)
2. Suppress or implement template placeholder warnings (P1)

## Scope

### In Scope
- Fix retry-manager.js API calls to use correct export names
- Add snake_case aliases to vector-index.js exports for backward compatibility

### Out of Scope
- Implementing the full V2.2 memory verification feature (template placeholders)
- Refactoring all snake_case to camelCase across the codebase

## Success Criteria

- [ ] `generate-context.js` runs without `get_db is not a function` error
- [ ] Retry processing completes successfully
- [ ] Template warnings reduced or eliminated
