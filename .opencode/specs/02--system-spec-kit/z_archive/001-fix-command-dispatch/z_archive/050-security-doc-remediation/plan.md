---
title: "Implementation Plan: Security & Documentation Remediation [050-security-doc-remediation/plan]"
description: "Problem: CONFIG.DATA_FILE from CLI arguments is used in fs.readFileSync() without path validation."
trigger_phrases:
  - "implementation"
  - "plan"
  - "security"
  - "documentation"
  - "remediation"
  - "050"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Security & Documentation Remediation

## Metadata
- **Created:** 2024-12-31
- **Level:** 2

## Phase 1: Security Fixes

### P0: generate-context.js CLI Path Validation

**Problem:** `CONFIG.DATA_FILE` from CLI arguments is used in `fs.readFileSync()` without path validation.

**Attack Vector:** User could potentially read arbitrary JSON files outside the project.

**Fix:**
1. Find existing `sanitizePath()` function
2. Create wrapper that allows `/tmp/` paths (for JSON mode) and project paths (for direct mode)
3. Apply validation before `fs.readFileSync(CONFIG.DATA_FILE)`

**Allowed Paths:**
- `/tmp/*` - for JSON mode (`/tmp/save-context-data.json`)
- `specs/*` - for direct mode
- Project-relative paths

### P1: context-server.js DB File Path Validation

**Problem:** `formatSearchResults()` reads file paths from database without re-validation.

**Attack Vector:** If malicious path inserted into DB, could read arbitrary files.

**Fix:**
1. Find `formatSearchResults()` or equivalent function
2. Add `validateFilePath()` check before reading DB-stored paths
3. Log warning and skip invalid paths gracefully

### P2: Input Length Limits

**Problem:** MCP tool parameters lack maximum length validation.

**Risk:** Resource exhaustion, log injection.

**Fix:** Add length checks at start of handlers:
- `query`: max 10,000 chars
- `title`: max 500 chars
- `content`: max 100,000 chars
- `specFolder`: max 200 chars

## Phase 2: Documentation Updates

### 2.1: Embedding Dimension References

**Files:** All 4 documentation files
**Change:** Update "768 dimensions" to "dynamic based on provider (768 for nomic, 1024 for Voyage AI)"

### 2.2: dryRun Parameter

**Files:** All 4 documentation files
**Change:** Add `dryRun` (boolean, default false) to `memory_delete` tool docs

### 2.3: includeConstitutional Parameter

**Files:** All 4 documentation files
**Change:** Add `includeConstitutional` (boolean, default true) to `memory_index_scan` tool docs

### 2.4: New Validation Rules

**Files:** README.md, SKILL.md
**Change:** Add `check-folder-naming.sh` and `check-frontmatter.sh` to script inventories

## Verification

1. Run `memory_health()` - should work
2. Run `memory_search()` - should work
3. Run `generate-context.js --help` - should work
4. Test generate-context.js with valid/invalid paths
5. Verify documentation renders correctly
