---
title: "Tasks: System-Spec-Kit Bug Remediation [049-system-analysis-bugs/tasks]"
description: "Existing Infrastructure"
trigger_phrases:
  - "tasks"
  - "system"
  - "spec"
  - "kit"
  - "bug"
  - "049"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: System-Spec-Kit Bug Remediation

## Metadata
- **Created:** 2024-12-31
- **Level:** 3
- **Total Tasks:** 17
- **Estimated Hours:** 19-25
- **Last Verified:** 2024-12-31 (5-agent re-analysis)

---

## Phase 1: Critical - Embedding Dimension Fix

### T001: Make EMBEDDING_DIM Dynamic
- **Priority:** P0 (CRITICAL)
- **Estimate:** 2 hours
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js`
- **Status:** [x] Complete

**Existing Infrastructure:**
- `resolveDatabasePath()` (lines 67-85) already uses profile for DB path
- `getEmbeddingsModule()` (lines 42-47) provides lazy-loaded embeddings access
- `embeddings.getEmbeddingProfile()` exists and returns provider profile

**Acceptance Criteria:**
- [x] Create `getEmbeddingDim()` function that queries `getEmbeddingsModule().getEmbeddingProfile().dim`
- [x] Fallback to 768 if profile unavailable
- [x] Update validation at line 967 (`indexMemory`) to use `getEmbeddingDim()`
- [x] Update validation at line 1083 (`updateMemory`) to use `getEmbeddingDim()`

---

### T002: Update Schema Creation for Dynamic Dimension
- **Priority:** P0 (CRITICAL)
- **Estimate:** 1 hour
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js`
- **Depends On:** T001
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] `createSchema()` uses `getEmbeddingDim()` for vec_memories table
- [x] Schema version incremented if dimension changes
- [x] Migration path for existing databases documented

---

### T003: Update Validation in indexMemory/updateMemory
- **Priority:** P0 (CRITICAL)
- **Estimate:** 1 hour
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js`
- **Depends On:** T001
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] `indexMemory()` validates against dynamic dimension
- [x] `updateMemory()` validates against dynamic dimension
- [x] Clear error message if dimension mismatch

---

### T004: Add Pre-flight Dimension Check
- **Priority:** P0 (CRITICAL)
- **Estimate:** 2 hours
- **File:** `.opencode/skill/system-spec-kit/mcp_server/context-server.js`
- **Depends On:** T001
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] `memory_index_scan` checks provider dimension vs database schema
- [x] Fails fast with clear error if mismatch
- [x] Suggests resolution (re-index or change provider)

---

## Phase 2: High - Validation Alignment

### T005: Add Folder Naming Validation Rule
- **Priority:** P1 (HIGH)
- **Estimate:** 2 hours
- **File:** `.opencode/skill/system-spec-kit/scripts/rules/check-folder-naming.sh` (new)
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] Validates pattern `[0-9]{3}-[a-z0-9-]+`
- [x] Returns ERROR for non-compliant names
- [x] Integrated into validate-spec.sh

---

### T006: Fix Implementation-Summary Logic
- **Priority:** P1 (HIGH)
- **Estimate:** 2 hours
- **File:** `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] Level 1 requires implementation-summary.md when tasks completed
- [x] Detection via `[x]` or `[X]` in tasks.md
- [x] ERROR (not WARNING) for missing file

---

### T007: Update Help Text
- **Priority:** P1 (HIGH)
- **Estimate:** 0.5 hours
- **File:** `.opencode/skill/system-spec-kit/scripts/validate-spec.sh`
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] Line 73 updated to include implementation-summary
- [x] Help text matches AGENTS.md requirements

---

### T008: Add Frontmatter Validation Rule
- **Priority:** P1 (HIGH)
- **Estimate:** 2 hours
- **File:** `.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh` (new)
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] Validates YAML frontmatter structure
- [x] Checks for required fields per file type
- [x] WARNING severity (not blocking)

---

## Phase 3: Medium - Documentation Fixes

### T009: Fix Broken Link in folder_routing.md
- **Priority:** P2 (MEDIUM)
- **Estimate:** 0.25 hours
- **File:** `.opencode/skill/system-spec-kit/references/folder_routing.md`
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] Line 614 link updated from `./spec_kit_memory.md` to `./memory_system.md`
- [x] Link resolves correctly

**Note:** T010 removed - links at template_guide.md:981-984 are inside a code block (example content), not actual broken links.

---

### T010: Standardize Template Metadata Format
- **Priority:** P2 (MEDIUM)
- **Estimate:** 1.5 hours
- **Files:** Multiple templates
- **Status:** [x] Complete

**Current State:** 6 bulleted lists, 3 tables, 1 inline format

**Acceptance Criteria:**
- [x] `handover.md` converted from table to bulleted list
- [x] `implementation-summary.md` converted from table to bulleted list
- [x] `context_template.md` metadata section converted (Mustache placeholders preserved)
- [x] `debug-delegation.md` kept as-is (inline format acceptable for auto-generated content)

---

### T011: Document context_template.md
- **Priority:** P2 (MEDIUM)
- **Estimate:** 0.5 hours
- **File:** `.opencode/skill/system-spec-kit/SKILL.md`
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] Entry added to Resource Inventory
- [x] Description: "Internal template for memory file generation"
- [x] Template count updated if needed

---

### T012: Fix Table Formatting in implementation-summary.md
- **Priority:** P2 (MEDIUM)
- **Estimate:** 0.25 hours
- **File:** `.opencode/skill/system-spec-kit/templates/implementation-summary.md`
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] Line 10 pipe characters escaped
- [x] Table renders correctly in markdown

---

## Phase 4: Low - Enhancements

### T013: Index Constitutional Memories
- **Priority:** P2 (LOW)
- **Estimate:** 0.5 hours
- **Action:** Run MCP tool
- **Depends On:** T001-T004 (dimension fix)
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] `memory_index_scan({ includeConstitutional: true })` succeeds
- [x] Constitutional files appear in `memory_search` results

---

### T014: Add --help Flag to generate-context.js
- **Priority:** P2 (LOW)
- **Estimate:** 1 hour
- **File:** `.opencode/skill/system-spec-kit/scripts/generate-context.js`
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] `--help` and `-h` flags recognized
- [x] Usage information printed
- [x] Script exits cleanly

---

### T015: Add Error Handling for mkdir
- **Priority:** P2 (LOW)
- **Estimate:** 0.5 hours
- **File:** `.opencode/skill/system-spec-kit/scripts/generate-context.js`
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] try/catch around `fs.mkdir` at line 3638
- [x] Meaningful error message on failure

---

### T016: Document test-embeddings-factory.js
- **Priority:** P2 (LOW)
- **Estimate:** 0.25 hours
- **File:** `.opencode/skill/system-spec-kit/SKILL.md`
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] Script added to inventory table
- [x] Description provided

---

### T017: Create Template Style Guide
- **Priority:** P3 (OPTIONAL)
- **Estimate:** 2 hours
- **File:** `.opencode/skill/system-spec-kit/references/template_style_guide.md` (new)
- **Status:** [x] Complete

**Acceptance Criteria:**
- [x] Documents placeholder syntax
- [x] Documents metadata format
- [x] Documents section numbering conventions

---

## Summary

| Phase | Tasks | Priority | Est. Hours |
|-------|-------|----------|------------|
| 1 - Critical | T001-T004 | P0 | 6 |
| 2 - High | T005-T008 | P1 | 6.5 |
| 3 - Medium | T009-T012 | P2 | 2.5 |
| 4 - Low | T013-T017 | P2-P3 | 4.25 |
| **Total** | **17** | - | **19.25** |

**Note:** T010 (stale Parent Spec section) removed after verification showed links were in code block examples, not actual broken links.
