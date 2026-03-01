---
title: "Research Findings: System-Spec-Kit 20-Agent Analysis [049-system-analysis-bugs/research]"
description: "A comprehensive parallel analysis using 20 specialized agents examined the system-spec-kit skill across all dimensions: documentation, scripts, templates, database, and integrat..."
trigger_phrases:
  - "research"
  - "findings"
  - "system"
  - "spec"
  - "kit"
  - "049"
importance_tier: "normal"
contextType: "research"
---
# Research Findings: System-Spec-Kit 20-Agent Analysis

## Metadata
- **Created:** 2024-12-31
- **Analysis Method:** 20 parallel agents with specialized focus areas
- **Scope:** Complete system-spec-kit skill analysis
- **Confidence:** HIGH (comprehensive coverage)

---

## 1. EXECUTIVE SUMMARY

A comprehensive parallel analysis using 20 specialized agents examined the `system-spec-kit` skill across all dimensions: documentation, scripts, templates, database, and integrations.

### Key Statistics
| Category | Issues Found | Critical | High | Medium | Low/Info |
|----------|-------------|----------|------|--------|----------|
| Documentation | 3 | 0 | 0 | 2 | 1 |
| Scripts | 4 | 1 | 2 | 0 | 1 |
| Templates | 4 | 0 | 0 | 2 | 2 |
| Database | 2 | 0 | 0 | 1 | 1 |
| Integration | 2 | 0 | 0 | 1 | 1 |
| **TOTAL** | **15** | **1** | **2** | **6** | **6** |

**Verification Note (2024-12-31):** Issue counts re-verified with 5 focused agents. "Pre-flight dimension check" merged into CRITICAL fix. Broken link count corrected from 4 to 1 (3 were in code block examples).

---

## 2. AGENT ANALYSIS BREAKDOWN

### Agent 1: SKILL.md Structure Analysis
**Severity:** LOW | **Status:** COMPLIANT

**Findings:**
- All required frontmatter fields present (name, description, version, allowed-tools)
- All 8 required sections present with correct formatting
- RULES section has all three required subsections (✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF)
- Keywords comment present for discoverability

**Minor Observations:**
- Resource Router uses table format instead of Python pseudocode (acceptable deviation)
- Word count ~4500 (slightly above 3000 recommended, but acceptable)

---

### Agent 2: SKILL.md Commands Analysis
**Severity:** MEDIUM

**Findings:**
- All documented commands exist in `.opencode/command/` folder
- Commands correctly reference implementations
- Script references accurate

**Issues:**
- Command syntax with `:auto`/`:confirm` modes not prominently documented
- No consolidated "Command Quick Reference" section

---

### Agent 3: SKILL.md Workflows Analysis
**Severity:** LOW

**Findings:**
- Gate 3 workflow matches AGENTS.md exactly
- Memory save workflow documented correctly
- Validation exit codes (0/1/2) consistent
- Debug delegation workflow complete

**Minor Issues:**
- One script not documented: `test-embeddings-factory.js`
- JSON mode for generate-context.js could be more prominent

---

### Agent 4: Cross-References Validation
**Severity:** MEDIUM

**Broken Links Found:**
| File | Line | Broken Link | Status |
|------|------|-------------|--------|
| `references/folder_routing.md` | 614 | `./spec_kit_memory.md` | **CONFIRMED BROKEN** |
| `references/template_guide.md` | 981 | `../spec.md` | FALSE POSITIVE (in code block) |
| `references/template_guide.md` | 983 | `../template-marker-system/` | FALSE POSITIVE (in code block) |
| `references/template_guide.md` | 984 | `../hybrid-validation/` | FALSE POSITIVE (in code block) |

**Verification Note:** Lines 981-984 in template_guide.md are inside a markdown code fence showing example README content, not actual hyperlinks.

**Valid References:** All JavaScript imports, template references, and shell script references resolve correctly.

---

### Agent 5: generate-context.js Core Logic
**Severity:** INFO | **Status:** CORRECT

**Verified Working:**
- ANCHOR format generation correct
- File naming follows `DD-MM-YY_HH-MM__topic.md` pattern
- Memory file placement in `spec-folder/memory/`
- Content extraction and deduplication sound
- Both JSON and direct path input modes functional

**Quality Score:** 9/10

---

### Agent 6: generate-context.js Error Handling
**Severity:** MEDIUM

**Good Coverage:**
- Input validation via `validateInputData()`
- Atomic write pattern with temp file + rename
- Path traversal protection
- Graceful degradation for non-critical failures

**Gaps:**
- No try/catch around `fs.mkdir` at line 3638
- No template file existence check at line 4871
- No content size limit before embedding generation

---

### Agent 7: validate-spec.js Validation Logic
**Severity:** HIGH

**Critical Mismatch:**
- AGENTS.md: Level 1 requires `implementation-summary.md`
- validate-spec.sh: Only WARNS (doesn't ERROR) for Level 1
- Help text outdated: Shows "1=spec+plan+tasks" without implementation-summary

**Working Correctly:**
- Exit codes (0=pass, 1=warnings, 2=errors)
- Level detection (table, YAML, inline formats)
- Level 2/3 file requirements

---

### Agent 8: validate-spec.js Coverage
**Severity:** HIGH

**Missing Validations:**
| Validation | Impact |
|------------|--------|
| Folder naming (`###-short-name`) | Inconsistent names allowed |
| Frontmatter validation | Invalid YAML not detected |
| Checklist format (`CHK###`) | Duplicate IDs not caught |
| Sub-folder structure (`001-topic/`) | Versioning not enforced |
| Cross-reference validation | Broken links not detected |
| Content minimum | Empty files not caught |

---

### Agent 9: Script Dependencies
**Severity:** LOW | **Status:** ALL PASS

**Verified:**
- All Node.js built-in modules used correctly
- npm dependencies declared in `scripts/package.json`
- Workspace configuration working
- ESM/CommonJS handled correctly (dynamic import for @huggingface/transformers)
- No circular dependencies

---

### Agent 10: Script Integration
**Severity:** HIGH

**Critical Issue:**
- Embedding dimension mismatch between provider (1024) and database schema (768)
- `vector-index.js:53` hardcodes `EMBEDDING_DIM = 768`
- Voyage provider returns 1024-dim embeddings
- ALL memory files fail to index

**Other Issues:**
- No `--help` flag support in generate-context.js
- Non-interactive mode defaults silently

---

### Agent 11: Template Completeness
**Severity:** LOW | **Status:** COMPLETE

**All Required Templates Present:**
- Level 1: spec.md, plan.md, tasks.md, implementation-summary.md ✓
- Level 2: + checklist.md ✓
- Level 3: + decision-record.md, research.md ✓
- Utility: handover.md, debug-delegation.md ✓
- Memory: context_template.md ✓

---

### Agent 12: Template Consistency
**Severity:** MEDIUM

**Inconsistencies Found:**
| Issue | Affected Templates |
|-------|-------------------|
| Metadata format (6 lists, 3 tables, 1 inline) | implementation-summary.md, handover.md, context_template.md use tables; debug-delegation.md uses inline |
| Section numbering (Title Case vs UPPERCASE) | handover.md, implementation-summary.md use Title Case |
| Placeholder format | context_template.md uses `{{MUSTACHE}}` for programmatic generation |

**Verification Note:** Original count "6 lists, 4 tables" corrected to "6 lists, 3 tables, 1 inline format".

---

### Agent 13: Template Placeholders
**Severity:** LOW | **Status:** WELL-DESIGNED

**Placeholder System:**
- `[YOUR_VALUE_HERE: description]` - User values
- `[FORMAT: options]` - Constrained values
- `[NEEDS CLARIFICATION: question]` - Multi-choice
- `[OPTIONAL: description]` - Optional fields
- `{{MUSTACHE}}` - Auto-generated (context_template.md only)

All placeholders documented with examples.

---

### Agent 14: Template vs Documentation
**Severity:** MEDIUM

**Issues:**
- `context_template.md` not listed in SKILL.md Resource Inventory
- `implementation-summary.md` has malformed table at line 10

**Aligned:**
- Template count matches (10 user-facing)
- Level requirements match AGENTS.md
- Utility template triggers documented

---

### Agent 15: Database Schema
**Severity:** LOW | **Status:** CORRECT

**Verified:**
- Schema version 3 (current)
- 29 columns in memory_index table
- 15+ indexes for search performance
- FTS5 virtual table with triggers
- Foreign key relationships correct
- WAL mode enabled

---

### Agent 16: Memory File Format (ANCHOR)
**Severity:** LOW | **Status:** WELL-IMPLEMENTED

**Verified:**
- ANCHOR format documented in SKILL.md
- Format: `<!-- ANCHOR:name --> ... <!-- /ANCHOR:name -->`
- Validation functions work correctly
- Edge cases handled (special chars, collisions, long content)
- Example files correctly formatted

---

### Agent 17: Memory Indexing
**Severity:** CRITICAL

**Root Cause Identified:**
- `vector-index.js:53`: `const EMBEDDING_DIM = 768` (hardcoded, comment says "Legacy default")
- `vector-index.js:967`: Validation throws error if `embedding.length !== EMBEDDING_DIM`
- `voyage.js:19`: `const DEFAULT_DIM = 1024` (provider returns 1024-dim)
- Voyage embeddings rejected: "must be 768 dimensions, got 1024"

**Existing Infrastructure (working):**
- `resolveDatabasePath()` (lines 67-85) correctly uses profile for DB path
- `getEmbeddingProfile()` exists and returns provider profile
- `profile.getDatabasePath()` creates per-provider database files

**The Actual Bug:** Validation logic uses hardcoded constant instead of querying profile dimension.

**Result:** 100% indexing failure (146 files failed)

---

### Agent 18: AGENTS.md Alignment
**Severity:** LOW | **Status:** PERFECT ALIGNMENT

**All 14 Key Areas Match:**
1. Memory save workflow ✓
2. Spec folder requirements (levels 1/2/3) ✓
3. Gate 3 workflow ✓
4. Validation exit codes ✓
5. Tool routing ✓
6. File requirements per level ✓
7. Memory file format ✓
8. Command names ✓
9. Priority system (P0/P1/P2) ✓
10. Debug delegation trigger ✓
11. Completion verification skip ✓
12. Two semantic systems distinction ✓
13. Memory tool prefix notation ✓
14. Sub-folder versioning ✓

---

### Agent 19: Skill Integration
**Severity:** LOW | **STATUS:** CORRECT

**Verified Integrations:**
- workflows-code: Downstream, correct references
- sk-git: Downstream, correct references
- sk-doc: Downstream, correct references
- mcp-narsil: Via Code Mode, correct access pattern
- mcp-code-mode: Standalone orchestration

**No circular dependencies detected.**

---

### Agent 20: MCP Integration
**Severity:** MIXED

**Operational:**
- All 14 MCP tools implemented and working
- Configuration correct in opencode.json
- Error handling consistent
- Security protections in place

**Issues:**
- Empty memory database (0 indexed memories)
- Constitutional files not indexed
- Documentation shows legacy database path

---

## 3. ROOT CAUSE ANALYSIS

### Critical Bug: Embedding Dimension Mismatch

**Chain of Events:**
1. System configured with Voyage AI provider (1024-dim)
2. `vector-index.js` has hardcoded `EMBEDDING_DIM = 768`
3. Database schema created with 768-dim vectors
4. Voyage generates 1024-dim embeddings
5. Validation rejects: "must be 768 dimensions, got 1024"
6. ALL memory indexing fails

**Why It Wasn't Caught:**
- Profile system correctly generates provider-specific database paths
- But dimension validation uses hardcoded constant
- No pre-flight check to detect mismatch early

---

## 4. WHAT'S WORKING WELL

1. **SKILL.md structure** - Fully compliant with template
2. **Command system** - All commands exist and documented
3. **AGENTS.md alignment** - Perfect consistency
4. **Skill integration** - Clean dependency graph
5. **MCP tools** - All 14 operational
6. **Security** - Path traversal and deserialization protected
7. **ANCHOR format** - Well-designed, validated
8. **Script dependencies** - All resolve correctly

---

## 5. RECOMMENDATIONS SUMMARY

### Critical (Fix Immediately)
1. Make `EMBEDDING_DIM` dynamic based on profile
2. Add pre-flight dimension check

### High (Fix Soon)
3. Add missing validation rules
4. Align implementation-summary logic with AGENTS.md

### Medium (Plan to Fix)
5. Fix broken cross-references
6. Standardize template formats
7. Document context_template.md
8. Index constitutional memories

### Low (Nice to Have)
9. Add --help to generate-context.js
10. Add error handling for mkdir
11. Create template style guide

---

## 6. METHODOLOGY

### Agent Distribution
| Agent Group | Focus Area | Agent Type |
|-------------|------------|------------|
| 1-4 | Documentation | explore |
| 5-10 | Scripts | general |
| 11-14 | Templates | explore |
| 15-17 | Database/Memory | general |
| 18-20 | Integration | general |

### Analysis Approach
- All 20 agents dispatched in parallel
- Each agent given specific scope and success criteria
- Structured output format for consistency
- Cross-validation between related agents

### Confidence Level
**HIGH** - Comprehensive coverage with multiple verification points
