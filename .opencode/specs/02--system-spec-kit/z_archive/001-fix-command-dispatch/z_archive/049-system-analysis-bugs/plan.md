---
title: "Implementation Plan: System-Spec-Kit Bug Remediation [049-system-analysis-bugs/plan]"
description: "This plan addresses bugs and misalignments discovered during a comprehensive 20-agent analysis of the system-spec-kit skill. The work is organized into 4 phases, prioritized by ..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "system"
  - "spec"
  - "kit"
  - "049"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: System-Spec-Kit Bug Remediation

## Metadata
- **Created:** 2024-12-31
- **Level:** 3
- **Estimated Effort:** 3-5 days
- **Priority:** Critical (memory system non-functional)

## 1. OVERVIEW

This plan addresses bugs and misalignments discovered during a comprehensive 20-agent analysis of the system-spec-kit skill. The work is organized into 4 phases, prioritized by severity.

## 2. PHASES

### Phase 1: Critical - Embedding Dimension Fix (Day 1)
**Goal:** Restore memory indexing functionality

**Existing Infrastructure (already implemented):**
- `resolveDatabasePath()` (lines 67-85) - Uses profile to determine DB path
- `getEmbeddingProfile()` (embeddings.js) - Returns provider's profile
- `profile.getDatabasePath()` (profile.js) - Returns profile-specific SQLite path

**What's Broken:** Validation at lines 967 and 1083 uses hardcoded `EMBEDDING_DIM = 768` instead of profile dimension.

#### 1.1 Make EMBEDDING_DIM Dynamic
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js`
- **Change:** Replace hardcoded constant with function that queries profile
- **Implementation:**
  ```javascript
  // Before (line 53)
  const EMBEDDING_DIM = 768; // Legacy default
  
  // After
  function getEmbeddingDim() {
    const embeddings = getEmbeddingsModule();
    const profile = embeddings.getEmbeddingProfile();
    return profile?.dim || 768; // fallback for safety
  }
  ```

#### 1.2 Update Schema Creation
- **File:** Same as above
- **Change:** `createSchema()` must use `getEmbeddingDim()` for vec_memories table
- **Line:** ~829 - Update `FLOAT[${EMBEDDING_DIM}]` to use dynamic dimension
- **Note:** Per-provider databases already work via `resolveDatabasePath()`

#### 1.3 Update Validation Logic
- **Files:** `indexMemory()` (line 967), `updateMemory()` (line 1083)
- **Change:** Replace `EMBEDDING_DIM` with `getEmbeddingDim()` in validation
- **Current error:** "Embedding must be 768 dimensions, got 1024"

#### 1.4 Add Pre-flight Dimension Check (Optional Enhancement)
- **File:** `context-server.js` - `memory_index_scan` tool
- **Change:** Check provider dimension vs existing database schema before indexing
- **Fail fast:** Surface clear error if attempting to mix dimensions in same DB

### Phase 2: High - Validation Alignment (Day 2)
**Goal:** Ensure validate-spec.sh matches AGENTS.md requirements

#### 2.1 Add Folder Naming Validation
- **File:** `.opencode/skill/system-spec-kit/scripts/rules/check-folder-naming.sh` (new)
- **Pattern:** `[0-9]{3}-[a-z0-9-]+`
- **Severity:** ERROR
- **Note:** Currently no validation exists for folder naming convention

#### 2.2 Fix Implementation-Summary Logic
- **File:** `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`
- **Current behavior:** Line 50 adds to `RULE_DETAILS` (warning), not `missing[]` (error)
- **Change:** For Level 1 with completed tasks, add to `missing[]` instead of `RULE_DETAILS`
- **Detection:** Check tasks.md for completed items `[x]` or `[X]`

#### 2.3 Update Help Text
- **File:** `validate-spec.sh` line 73
- **Current:** "LEVELS: 1=spec+plan+tasks, 2=+checklist, 3=+decision-record"
- **Change:** Update to include implementation-summary for Level 1 (after completion)

#### 2.4 Add Frontmatter Validation (Optional)
- **File:** New rule `check-frontmatter.sh`
- **Check:** YAML frontmatter structure, required fields
- **Severity:** WARNING (not blocking)

### Phase 3: Medium - Documentation Fixes (Day 3)
**Goal:** Fix broken references and consistency issues

#### 3.1 Fix Broken Cross-References
| File | Line | Fix |
|------|------|-----|
| `references/folder_routing.md` | 614 | Update link `./spec_kit_memory.md` to `./memory_system.md` |

**Note:** Links at `template_guide.md` lines 981-984 are inside a markdown code block (example documentation), not actual broken links.

#### 3.2 Standardize Template Formats
- **Current state:** 6 bulleted lists, 3 tables, 1 inline format (debug-delegation.md)
- **Decision:** Use bulleted list for metadata (majority format)
- **Update:** `handover.md`, `implementation-summary.md`, `context_template.md` (metadata section)

#### 3.3 Document context_template.md
- **File:** `SKILL.md` Resource Inventory section
- **Add:** Entry for context_template.md with description "Internal template for memory file generation"

#### 3.4 Fix Table Formatting
- **File:** `templates/implementation-summary.md` line 10
- **Fix:** Escape pipe characters in Level field

### Phase 4: Low - Enhancements (Day 4-5)
**Goal:** Quality improvements and polish

#### 4.1 Index Constitutional Memories
- **Action:** Run `memory_index_scan({ includeConstitutional: true, force: true })`
- **Verify:** Constitutional files appear in search results

#### 4.2 Add --help Flag
- **File:** `generate-context.js`
- **Add:** Check for `--help` or `-h` before `parseArguments()`
- **Output:** Usage information and exit

#### 4.3 Add Error Handling
- **File:** `generate-context.js` line 3638
- **Add:** try/catch around `fs.mkdir`

#### 4.4 Add Missing Script Documentation
- **File:** `SKILL.md` scripts inventory
- **Add:** `test-embeddings-factory.js` entry

## 3. TESTING STRATEGY

### Unit Tests
- Test dynamic dimension lookup with mock profiles
- Test validation rules with sample spec folders
- Test cross-reference link resolution

### Integration Tests
- End-to-end memory indexing with different providers
- Validation of real spec folders in project
- MCP tool operation verification

### Regression Tests
- Existing memory files remain accessible
- Existing spec folders pass validation
- No breaking changes to workflows

## 4. ROLLBACK PLAN

1. **Database:** Create backup before schema changes
2. **Scripts:** Git commit before each phase
3. **Revert:** `git revert` if issues discovered
4. **Fallback:** Keep hardcoded 768 as default if profile lookup fails

## 5. VERIFICATION

After each phase:
1. Run `memory_health()` - should return "healthy"
2. Run `memory_index_scan()` - should index files successfully
3. Run `validate-spec.sh` on sample folders - should pass/fail correctly
4. Manual review of documentation changes
