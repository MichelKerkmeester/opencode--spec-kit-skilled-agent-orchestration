---
title: "085: Alignment Validator File Path Analysis [085-alignment-file-paths/spec]"
description: "Memory files are being saved to incorrect spec folders because the alignment scoring ignores file paths. When work is done on shared infrastructure (.opencode/skill/system-spec-..."
trigger_phrases:
  - "085"
  - "alignment"
  - "validator"
  - "file"
  - "path"
  - "spec"
importance_tier: "important"
contextType: "decision"
---
# 085: Alignment Validator File Path Analysis

## Problem Statement

Memory files are being saved to incorrect spec folders because the alignment scoring ignores file paths. When work is done on shared infrastructure (`.opencode/skill/system-spec-kit/`), the memory is saved to a project-specific folder (e.g., `005-anobel.com`) based on text matching alone.

## Root Cause

### Chain of Failure

1. **Save Time**: Spec-kit work done (files in `.opencode/skill/system-spec-kit/`)
2. **Alignment Check**: `alignment-validator.js` extracts keywords from conversation text
3. **Missing Signal**: File paths (`key_files`) are NOT analyzed for work domain
4. **Non-Interactive**: Proceeds with folder despite mismatch
5. **Recovery Time**: `/memory:continue` trusts `spec_folder` metadata without validation

### Evidence

Memory file `03-02-26_17-28__anobel.com.md` contains:
```yaml
spec_folder: "005-anobel.com"
key_files:
  - ".opencode/.../tests/test-bug-fixes.js"
  - ".opencode/.../tests/test-template-system.js"
  - ".opencode/skill/system-spec-kit/CHANGELOG.md"
```

**100% of files are in `.opencode/skill/system-spec-kit/`** but filed under `005-anobel.com`.

## Solution

### Fix 1: alignment-validator.js - Add File Path Analysis

Add `detect_work_domain()` function that:
- Analyzes file paths from `observations.files`
- Detects when >50% of files are in `.opencode/` (shared infrastructure)
- Returns domain info to influence alignment scoring

### Fix 2: alignment-validator.js - Boost Infrastructure Folder Scores

When infrastructure work detected:
- Boost scores for folders matching infrastructure (e.g., `*-memory*`, `*-spec-kit*`, `*-opencode*`)
- Penalize project-specific folders for infrastructure work

### Fix 3: continue.md - Add Content Validation

Add validation step in recovery that:
- Reads `key_files` from memory metadata
- Compares against `spec_folder`
- Flags mismatch: "Memory contains infrastructure work but filed under project spec"
- Presents options to user

## Files to Modify

1. `.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.js`
2. `.opencode/command/memory/continue.md`

## Success Criteria

- [ ] Infrastructure work (files in `.opencode/`) is detected
- [ ] Alignment scoring prefers infrastructure-related spec folders
- [ ] Recovery command validates key_files vs spec_folder
- [ ] Mismatch triggers user prompt with correction options
