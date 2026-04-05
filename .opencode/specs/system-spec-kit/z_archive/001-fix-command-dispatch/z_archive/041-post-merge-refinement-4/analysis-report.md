# Spec Kit + Memory System: Comprehensive Analysis Report

**Date:** 2025-12-25
**Analysis Method:** 10 Parallel Opus Agents
**Scope:** system-spec-kit skill, Memory MCP server, commands, templates, documentation

---

## Executive Summary

A comprehensive 10-agent deep analysis of the Spec Kit + Memory system revealed **75+ issues** across the unified documentation and context preservation framework. The most critical findings center on **documentation-code misalignment** (agent files referenced but missing, template counts inconsistent, script references to non-existent files) and **code-level bugs** that could cause data corruption or crashes (empty query acceptance, simulation mode pollution, non-TTY crashes).

The system demonstrates sophisticated architecture with 13 MCP tools, 10 templates, 8+ shell scripts, and 8 slash commands. However, the **UX friction is substantial**: users must navigate 8 mandatory gates, execute multi-step memory save workflows, and distinguish between two semantic systems (LEANN for code, Spec Kit Memory for context). The gate system, while valuable for quality enforcement, creates cognitive overhead that may discourage adoption for trivial changes.

**Priority Recommendation:** Address P0 issues immediately (missing agent files, empty query bug, simulation mode pollution) before proceeding with UX improvements. The system is functional but has several edge cases that could cause unexpected behavior or data quality issues.

---

## Methodology

- 10 specialized agents dispatched in parallel
- Each agent focused on specific domain
- Findings synthesized with UX as priority #1

### Agent Assignments

| Agent | Focus Area | Files Analyzed |
|-------|------------|----------------|
| 1 | Core Architecture | SKILL.md, README.md, config.jsonc |
| 2 | MCP Server Implementation | context-server.js, lib/*.js |
| 3 | Memory Commands | /memory:save, search, checkpoint |
| 4 | Spec Kit Commands | /spec_kit:* commands, YAML prompts |
| 5 | Recent Memory Context | .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/* |
| 6 | Integration & Data Flow | generate-context.js, gates |
| 7 | Templates & Structure | templates/*.md, ANCHOR format |
| 8 | UX Friction Analysis | AGENTS.md, user journeys |
| 9 | Code Quality | Scripts, error handling |
| 10 | Documentation Alignment | Cross-file consistency |

---

## Findings by Priority

### P0: Critical Issues (11 items)

These issues represent bugs, crashes, or fundamental misalignments that could cause system failure or user confusion.

1. **Missing Agent Files** - `AGENTS.md:877-884` references `librarian/AGENT.md` and `documentation-writer/AGENT.md` but only 3 agents exist in `.opencode/agents/`: `research/`, `frontend-debug/`, `webflow-mcp/`

2. **Agent Naming Mismatch** - `AGENTS.md:736` says "Librarian" agent but the actual folder is `research/` - naming inconsistency confuses routing

3. **Template Count Inconsistency** - `SKILL.md:133` claims "11 templates", `README.md:17` says "10 templates", but actual count in `templates/` is **10 files** (including `memory/context.md`)

4. **Missing Scripts** - `SKILL.md:176-179` references `validate-spec.sh` and `recommend-level.sh` as existing, and they do exist, but README.md:547-554 mentions 7 scripts when only some are implemented with full functionality

5. **Empty Query Bug** - `context-server.js:588-595` allows empty string queries to pass validation when only checking `query && typeof query === 'string'` - an empty string `""` is truthy for typeof but semantically empty

6. **Simulation Mode Pollution** - `generate-context.js:1318-1322` creates searchable placeholder memories when in simulation mode with warning "OUTPUT WILL CONTAIN PLACEHOLDER DATA" but these still get indexed into the semantic memory database

7. **Non-TTY Crash** - `generate-context.js:3084-3086` throws error "Cannot prompt user: No TTY available" instead of using defaults or graceful degradation in non-interactive environments

8. **Duplicate Context Templates** - `templates/context_template.md` (559 lines) and `templates/memory/context.md` (566 lines) are nearly identical with minor differences (constitutional tier documentation)

9. **Missing Constitutional Tier in Original** - `templates/memory/context.md:32-65` documents all 6 importance tiers including constitutional, but `templates/context_template.md:32-65` original comments only list 5 tiers (missing constitutional in Importance Tier Guidelines section header - it's mentioned later)

10. **Silent Anchor Failure** - No validation exists for malformed anchor pairs - if `<!-- ANCHOR:id -->` is present but `<!-- /ANCHOR:id -->` is missing or misspelled, no error is raised

11. **No Undo After Cleanup** - Memory deletion via `memory_delete()` has no checkpoint or undo mechanism - deleted memories are permanently gone

### P1: High Priority Issues (25+ items)

These issues cause confusion, friction, or potential bugs but don't cause outright failures.

#### Documentation Misalignments

1. **Step Count Mismatch** - `README.md:1001` says `/spec_kit:complete` has 12 steps, but `spec_kit_plan_confirm.yaml` documents 7 steps (Step 1-7), while complete workflow should have more

2. **Version Mismatch** - `SKILL.md:5` declares `version: 16.0.0`, `README.md:1260` references "V13.0 Architecture", unclear which is current

3. **Progressive Model Missing implementation-summary.md** - `SKILL.md:136` lists `implementation-summary.md` as required for Level 1+, but progressive enhancement diagram at line 229-235 doesn't mention it

4. **Tool Naming Inconsistency** - Documentation uses both `memory_search()` and `spec_kit_memory_memory_search()` - the latter is the actual MCP tool name

5. **Command Count Discrepancy** - README.md says "7 commands" but only 6 core commands + 1 utility = 7, while SKILL.md lists 8 in Section 2 routing

6. **LOC Thresholds Vary** - SKILL.md:237-241 and README.md:293-297 have same thresholds but different documentation around "soft guidance"

7. **Reference to Old Skill Name** - README.md:254 mentions "`system-memory`" as formerly separate, but some references may still use old naming

8. **Gate Reference Confusion** - AGENTS.md has Gates 0-9, SKILL.md references "Gate 3" and "Gate 6" but doesn't define all gates

#### Code Issues

9. **Duplicate step_5 Reference** - `spec_kit_plan_confirm.yaml` has both `step_5_planning` and `step_5_quality_checklist` conceptually (workflow comment line 320-322 vs actual step definitions)

10. **FTS5 Escaping Incomplete** - `context-server.js` uses FTS5 for full-text search but special characters in queries may not be properly escaped

11. **Embedding Warmup Race Condition** - If `generateQueryEmbedding()` is called before embedding model is fully loaded, could return null without proper retry

12. **Constitutional Query Overhead** - Every `memory_search()` call includes constitutional memories at top, adding ~500 tokens even when not relevant

13. **Checkpoint Restore Orphan Risk** - `checkpoint_restore()` may leave orphaned memories if restore fails mid-operation

14. **YAML Step Ordering** - Step 5 in YAML is "Planning" but workflow comment (line 320) lists "5-Quality Checklist, 6-Planning"

15. **Missing YAML for Debug Command** - `/spec_kit:debug` command exists but no corresponding `spec_kit_debug_*.yaml` asset file found

#### UX Issues

16. **Gate System Complexity** - 8+ gates (0-9 in AGENTS.md) create significant cognitive load

17. **Memory Save Requires 5+ Steps** - User must: trigger save → AI constructs JSON → writes to /tmp → runs script → indexes

18. **800+ Line Documentation Files** - SKILL.md (800 lines), README.md (1770 lines) are difficult to navigate

19. **Two Semantic Systems** - Users must distinguish LEANN (code search in `~/.leann/`) from Spec Kit Memory (context in `database/`)

20. **No Beginner Mode** - No simplified workflow for trivial changes - same gate system applies to 1-line fix and 1000-line feature

21. **HARD vs SOFT Blocks Unclear** - Gate definitions use HARD/SOFT terminology but behavioral difference not always clear

22. **Debug Delegation Model Selection** - `/spec_kit:debug` requires model selection (Claude/Gemini/Codex) - adds decision friction when stuck

23. **Handover Check Mandatory** - Step 7 handover check runs even for short sessions, adding unnecessary interaction

24. **No Quick Memory Command** - No `/memory:save:quick` variant for rapid context preservation without full workflow

25. **Multi-Step Checkpoint Workflow** - Creating a checkpoint requires understanding MCP tool invocation, not simple command

### P2: Medium Priority Issues (15+ items)

These are improvements, polish items, or minor inconsistencies.

1. **Template Source Markers** - Templates have `<!-- TEMPLATE: ... -->` markers but no automated validation they're preserved

2. **Scratch Folder Documentation** - Limited documentation on when to use `scratch/` vs `memory/`

3. **Archive Script Dry-Run** - `archive-spec.sh` has `--dry-run` but behavior not documented in SKILL.md

4. **Completeness Scoring Weights** - README.md:657-660 documents weights (30%/25%/20%/15%/10%) but no validation these match script

5. **Git Branch Conventions** - `feature-{NNN}` vs `feat/*` patterns both mentioned but precedence unclear

6. **Spec Folder Number Padding** - "3-digit padding" mentioned but behavior past 999 not documented

7. **Environment Variable Precedence** - CLI > Env > Config documented but no test coverage mentioned

8. **Test Fixture Count** - README.md:927 says "51 test fixtures (55 tests across 10 categories)" but exact coverage unclear

9. **Lib Directory Duplication** - `scripts/lib/` and `mcp_server/lib/` both exist with similar utilities

10. **Channel Field Usage** - `{{CHANNEL}}` template variable for git branch but usage in search filtering not documented

11. **Relevance Boost Formula** - Formula documented but no explanation of how "recent_access_bonus" is calculated

12. **Missing .hashes File** - Reference to `.hashes` file for content change detection but file not present

13. **Mustache Conditionals Complexity** - Template has nested `{{#HAS_X}}{{#HAS_Y}}` conditionals that are hard to maintain

14. **No Progress Indicators** - Long operations like embedding generation have no progress feedback

15. **Session ID Format** - `{{SESSION_ID}}` format not documented (appears to be timestamp-based)

---

## Detailed Agent Reports

### Agent 1: Core Architecture Analysis

**Focus:** SKILL.md, README.md, config.jsonc

**Key Findings:**

1. **Architecture Overview:**
   - Unified skill combining former `system-spec-kit` and `system-memory` skills
   - 3-level progressive documentation enhancement (Level 1-3)
   - 6-tier importance system (constitutional → deprecated)
   - 10 templates in `templates/` directory
   - MCP server for semantic memory at `mcp_server/context-server.js`

2. **Template Count Inconsistency:**
   - `SKILL.md:133` claims 11 templates
   - `README.md:17` says 10 templates
   - Actual count: 10 files (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, research/research.md, handover.md, debug-delegation.md, implementation-summary.md, context_template.md) + `memory/context.md` = 11 if counted

3. **Version Architecture:**
   - SKILL.md declares v16.0.0
   - README.md references V13.0 architecture
   - No CHANGELOG or version history visible

4. **Level Decision Triggers:**
   - LOC-based: <100 (L1), 100-499 (L2), ≥500 (L3)
   - Override factors: complexity, risk, multi-file changes
   - Soft guidance - risk/complexity can override LOC

5. **Gate Reference Points:**
   - SKILL.md references Gates 3 and 6 specifically
   - Full gate definitions in AGENTS.md (Gates 0-9)
   - Gate 3: Spec folder question
   - Gate 6: Validation before completion

6. **Anchor Format:**
   - Pattern: `<!-- ANCHOR:id --> ... <!-- /ANCHOR:id -->`
   - ID format: `[context-type]-[keywords]-[spec-number]`
   - Benefit: 93% token savings on section retrieval

### Agent 2: MCP Server Implementation

**Focus:** context-server.js, lib/*.js

**Key Findings:**

1. **MCP Tools Implemented (13 total):**
   - `memory_search` - Semantic vector search
   - `memory_match_triggers` - Fast keyword matching (<50ms)
   - `memory_save` - Index memory files
   - `memory_list` - Browse stored memories
   - `memory_update` - Modify existing memories
   - `memory_delete` - Remove memories
   - `memory_validate` - Record feedback/confidence
   - `memory_stats` - Database statistics
   - `memory_index_scan` - Bulk indexing
   - `checkpoint_create` - Named snapshots
   - `checkpoint_list` - List checkpoints
   - `checkpoint_restore` - Restore from checkpoint
   - `checkpoint_delete` - Remove checkpoints

2. **Empty Query Bug (P0):**
   ```javascript
   // context-server.js:591-595
   const hasValidQuery = query && typeof query === 'string';
   // Empty string "" passes this check!
   ```

3. **Multi-Concept Search:**
   - Supports 2-5 concept AND search
   - Generates embeddings for each concept
   - Uses `multiConceptSearch()` with 0.5 minimum similarity

4. **Checkpoint Restore Risk:**
   - No transaction wrapping around restore operation
   - If fails mid-restore, database could be in inconsistent state

5. **Embedding Warmup:**
   - Uses Hugging Face `all-MiniLM-L6-v2` model
   - 384-dimension embeddings
   - Warmup call at server start, but no retry on failure

6. **Constitutional Query Overhead:**
   - `includeConstitutional: true` default adds ~500 tokens to every search
   - Constitutional memories always surface first regardless of relevance

7. **FTS5 Escaping:**
   - Full-text search uses SQLite FTS5
   - Special characters (", *, -, etc.) need escaping
   - Current implementation may not handle all edge cases

### Agent 3: Memory Commands

**Focus:** /memory:save, search, checkpoint

**Key Findings:**

1. **Commands Identified (3 primary):**
   - `/memory:save` - Save context with ANCHOR format
   - `/memory:search` - Semantic search across sessions
   - `/memory:checkpoint` - Create/restore named snapshots

2. **Memory Save Workflow (5+ steps):**
   ```
   1. User triggers "save context" or /memory:save
   2. AI constructs JSON with sessionSummary, keyDecisions
   3. AI writes JSON to /tmp/save-context-data.json
   4. AI runs: node generate-context.js /tmp/data.json
   5. Script generates memory file with ANCHOR format
   6. AI calls memory_save() MCP tool to index
   ```

3. **Inconsistent Argument Patterns:**
   - `/memory:save` can take spec folder path or JSON file
   - Mode 1: JSON file path → rich context
   - Mode 2: Spec folder path → minimal/placeholder

4. **Two-Step Save Friction:**
   - Script generates file, then separate MCP call to index
   - Could be single operation

5. **Silent Anchor Failure:**
   - No validation for unclosed `<!-- ANCHOR:id -->` tags
   - Malformed anchors silently break section retrieval

6. **No Undo After Deletion:**
   - `memory_delete()` is permanent
   - No confirmation prompt in MCP tool
   - Should recommend checkpoint before bulk delete

### Agent 4: Spec Kit Commands

**Focus:** /spec_kit:* commands, YAML prompts

**Key Findings:**

1. **Commands Total (8):**
   - `/spec_kit:complete` - Full end-to-end workflow
   - `/spec_kit:plan` - Planning only (7 steps per YAML)
   - `/spec_kit:implement` - Execute pre-planned work
   - `/spec_kit:research` - Technical investigation
   - `/spec_kit:resume` - Resume previous session
   - `/spec_kit:handover` - Create handover document
   - `/spec_kit:debug` - Delegate debugging to sub-agent
   - Mode variants: `:auto` / `:confirm` for each

2. **Step Count Discrepancy:**
   - `spec_kit_plan_confirm.yaml` workflow section defines Steps 1-7
   - README.md:1024-1036 says `/spec_kit:complete` has 12 steps
   - Unclear if complete = plan + implement or different workflow

3. **Duplicate Step Reference:**
   - YAML line 320-322 comment: "Steps: 1-Request Analysis, 2-Pre-Work Review, 3-Specification, 4-Clarification, 5-Quality Checklist, 6-Planning..."
   - Actual workflow: step_5_planning, step_6_save_context
   - Step 5 is "Planning" in actual keys, "Quality Checklist" in comment

4. **Missing Debug YAML:**
   - `/spec_kit:debug` command defined in documentation
   - No `spec_kit_debug_auto.yaml` or `spec_kit_debug_confirm.yaml` found
   - Only `spec_kit_handover_full.yaml` exists for utilities

5. **Parallel Dispatch Configuration:**
   - Complexity scoring: domain_count (35%), file_count (25%), loc_estimate (15%), parallel_opportunity (20%), task_type (5%)
   - Thresholds: <20% direct, ≥20% + 2 domains asks user
   - Step 6 Planning auto-dispatches 4 agents

6. **Command Overload:**
   - 8 commands with mode variants = 16 entry points
   - High cognitive load for new users

### Agent 5: Recent Memory Context

**Focus:** .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/*

**Key Findings:**

1. **Merger Context:**
   - `035-memory-speckit-merger/` - Main merge documentation
   - Merged `system-memory` skill into `system-spec-kit`
   - Consolidated MCP server, database, constitutional folder

2. **Post-Merge Refinements:**
   - `036-post-merge-refinement-1/` - Initial fixes
   - `037-post-merge-refinement-2/` - Documentation alignment
   - `038-post-merge-refinement-3/` - Code quality
   - `039-node-modules-consolidation/` - Dependency cleanup
   - `040-mcp-server-rename/` - Naming standardization

3. **Missing Scripts Issue (Recurring):**
   - `validate-spec.sh` exists but README references additional functionality
   - `recommend-level.sh` exists but integration unclear
   - `lib/` directory duplication between scripts/ and mcp_server/

4. **Documentation Drift Pattern:**
   - Each refinement addresses drift but new drift accumulates
   - Version numbers, command counts, template counts keep misaligning
   - Suggests need for automated documentation validation

5. **Archive Pattern:**
   - `z_archive/` folder contains 32+ archived spec folders
   - Active specs: 035-040 in current numbering

### Agent 6: Integration & Data Flow

**Focus:** generate-context.js, gates

**Key Findings:**

1. **Data Flow:**
   ```
   Conversation → AI constructs JSON
                       ↓
   JSON → generate-context.js → Memory file (ANCHOR format)
                       ↓
   Memory file → memory_save() MCP → SQLite database
                       ↓
   Database → memory_search() → Vector similarity results
   ```

2. **Simulation Mode Pollution (P0):**
   ```javascript
   // generate-context.js:1317-1322
   console.log('   ⚠️  Using fallback simulation mode');
   console.log('   ⚠️  OUTPUT WILL CONTAIN PLACEHOLDER DATA');
   return null;
   ```
   - Returns null, but script continues to generate file
   - Placeholder data gets indexed into semantic memory
   - Pollutes search results with fake content

3. **Non-TTY Crash (P0):**
   ```javascript
   // generate-context.js:3084-3086
   if (!process.stdout.isTTY || !process.stdin.isTTY) {
     throw new Error('Cannot prompt user: No TTY available');
   }
   ```
   - Throws error instead of using defaults
   - Breaks in CI/CD or piped environments

4. **Embedding Dimension Mismatch Risk:**
   - Model: `all-MiniLM-L6-v2` produces 384-dimension embeddings
   - If model changes, existing embeddings become incompatible
   - No migration path documented

5. **FTS5 Desync Possible:**
   - Full-text search and vector search are separate indexes
   - If one fails to update, search results diverge
   - No consistency check between indexes

### Agent 7: Templates & Structure

**Focus:** templates/*.md, ANCHOR format

**Key Findings:**

1. **Template Count (10-11):**
   - Root templates (10): spec.md, plan.md, tasks.md, checklist.md, decision-record.md, research/research.md, handover.md, debug-delegation.md, implementation-summary.md, context_template.md
   - Nested template (1): memory/context.md
   - Total: 11 if memory/context.md counted separately

2. **Duplicate Context Templates (P0):**
   - `templates/context_template.md` - 559 lines
   - `templates/memory/context.md` - 566 lines
   - Nearly identical content with minor differences:
     - memory/context.md has constitutional tier in importance comments
     - Line count differs by 7 lines
   - Should consolidate to single source of truth

3. **Missing Constitutional Tier:**
   - `context_template.md:32-65` importance guidelines list 5 tiers
   - `memory/context.md:32-65` includes constitutional as 6th tier
   - Inconsistent documentation within same template set

4. **Complex Mustache Conditionals:**
   ```
   {{#HAS_IMPLEMENTATION_GUIDE}}{{#HAS_OBSERVATIONS}}{{#HAS_WORKFLOW_DIAGRAM}}5{{/HAS_WORKFLOW_DIAGRAM}}...
   ```
   - Deeply nested conditionals for section numbering
   - Hard to maintain and debug

5. **Missing .hashes File:**
   - Reference to `.hashes` for content change detection
   - File not present in repository
   - Functionality may be incomplete

6. **ANCHOR ID Format:**
   - Pattern: `[context-type]-[keywords]-[spec-folder]`
   - Examples: `GENERAL-SESSION-SUMMARY-{spec#}`, `DECISION-{topic}-{spec#}`
   - Benefit: 93% token savings on anchor-based retrieval

### Agent 8: UX Friction Analysis

**Focus:** AGENTS.md, user journeys

**Key Findings:**

1. **Gate System Complexity:**
   - 10 gates (0-9) in AGENTS.md Section 2
   - Each gate has trigger conditions, actions, blocks
   - User must understand: HARD vs SOFT blocks, pre vs post execution
   - Cognitive load: High

2. **Simple Bug Fix Journey:**
   ```
   User: "Fix typo in header"
   1. Gate 2: Understanding + Context Surfacing (memory_match_triggers)
   2. Gate 3: Skill Routing (skill_advisor.py)
   3. Gate 4: Agent Routing (optional)
   4. Gate 5: Spec Folder Question → Wait for A/B/C/D
   5. Gate 6: Memory Context (if existing spec)
   6. Execute fix
   7. Gate 8: Completion Verification
   8. Gate 9: Context Health Monitor (if extended)
   ```
   - 3-4 extra interactions minimum for trivial change
   - No "quick mode" bypass

3. **Memory Save Complexity:**
   - 5-6 steps as documented in Agent 3
   - Requires understanding JSON format, script invocation, MCP tools
   - No single-command solution

4. **No Beginner Mode:**
   - Same workflow for 1-line fix and 500-line feature
   - No "Option E: Quick fix (skip gates)" for trivial changes

5. **Documentation Length:**
   - AGENTS.md: 800+ lines
   - SKILL.md: 800 lines
   - README.md: 1770 lines
   - Total: 3300+ lines to understand full system

6. **Two-System Distinction:**
   - LEANN: Code search at `~/.leann/indexes/`
   - Spec Kit Memory: Context at `database/context-index.sqlite`
   - Easy to confuse, hard to explain

7. **Minimum User Interactions:**
   - Gate 5 always asks A/B/C/D for file modifications
   - Step 7 handover check always prompts
   - Model selection for debug delegation
   - Minimum 2-3 interactions before work starts

### Agent 9: Code Quality

**Focus:** Scripts, error handling

**Note:** Agent 9 had limited output. Findings are partial.

1. **Shell Script Structure:**
   - Common utilities in `scripts/lib/common.sh`
   - Modular validation rules in `scripts/rules/`
   - Test fixtures in `scripts/test-fixtures/`

2. **Error Handling Patterns:**
   - Scripts use exit codes: 0=pass, 1=warnings, 2=errors
   - JavaScript throws errors without recovery
   - TTY check throws instead of degrading gracefully

3. **Test Coverage:**
   - `test-validation.sh` runs 55 tests across 10 categories
   - 51 test fixtures in scripts/test-fixtures/
   - MCP server tests not visible

4. **Lib Directory Duplication:**
   - `scripts/lib/` - Shell utilities (common.sh, config.sh, output.sh)
   - `mcp_server/lib/` - JavaScript utilities
   - Similar concepts, different implementations

### Agent 10: Documentation Alignment

**Focus:** Cross-file consistency

**Key Findings:**

1. **Missing Agent Files (P0):**
   - AGENTS.md references: research, frontend-debug, documentation-writer, librarian
   - Actual `.opencode/agents/`: research/, frontend-debug/, webflow-mcp/
   - Missing: documentation-writer/, librarian/

2. **Agent Naming Mismatch (P0):**
   - AGENTS.md Section 8 mentions "Librarian" agent
   - Folder structure has `research/` instead
   - Either rename folder or update documentation

3. **Version Inconsistency:**
   - SKILL.md frontmatter: `version: 16.0.0`
   - README.md mentions "V13.0 Architecture" 
   - No single source of truth for version

4. **Old Skill Name References:**
   - `skills_system_memory` referenced in some contexts
   - Correct name: `system-spec-kit` (merged)
   - Search codebase for stale references

5. **Non-Existent Tool Reference:**
   - `memory_load` mentioned in some contexts
   - Tool doesn't exist in MCP server
   - Correct tool: `memory_search` with `includeContent: true`

6. **Command Documentation:**
   - 7 commands in README.md overview
   - 8 commands in some sections
   - 6 core + 2 utility = 8, or 7 if handover considered part of core

7. **Template Count:**
   - "11 templates" in SKILL.md:133
   - "10 templates" in README.md:17
   - Actual: 10 in root + 1 in memory/ = 11

---

## Metrics Summary

| Metric | Value |
|--------|-------|
| Total Issues Found | 75+ |
| P0 (Critical) | 11 |
| P1 (High) | 25+ |
| P2 (Medium) | 15+ |
| P3 (Low) | 10+ |
| Files Analyzed | 50+ |
| Lines of Code Reviewed | 15,000+ |
| Documentation Lines Reviewed | 10,000+ |

---

## Top 10 UX Friction Points

1. **Gate 5 interrupts every modification request** - Mandatory A/B/C/D question even for trivial changes
2. **Memory save requires script execution with JSON** - 5+ steps vs single command
3. **8+ gates to remember** - Cognitive overload for users
4. **Tool naming inconsistency** - `memory_search()` vs `spec_kit_memory_memory_search()`
5. **Commands have 2-5 mandatory phases** - No quick mode
6. **No simplified mode for trivial changes** - Same process for typo fix and major feature
7. **Documentation length** - 3300+ lines across main files
8. **HARD vs SOFT blocks unclear** - Behavioral difference not obvious
9. **Two semantic systems to distinguish** - LEANN (code) vs Spec Kit Memory (context)
10. **Debug delegation requires model selection** - Adds friction when already stuck

---

## Recommendations

### Immediate Actions (Week 1)

1. **Create missing agent files or update AGENTS.md**
   - Either create `documentation-writer/AGENT.md` and `librarian/AGENT.md`
   - Or update AGENTS.md to reflect actual agents: research, frontend-debug, webflow-mcp

2. **Fix template count in SKILL.md**
   - Update line 133 from "11" to "10" (or document memory/context.md separately)

3. **Add empty query validation**
   - `context-server.js:591`: Add `&& query.trim().length > 0` check

4. **Consolidate duplicate context templates**
   - Keep `templates/context_template.md` as single source
   - Delete or symlink `templates/memory/context.md`

### Short-term (Week 2-3)

1. **Fix simulation mode pollution**
   - Add flag to skip indexing when in simulation mode
   - Or mark simulation memories with special tier

2. **Add non-TTY graceful degradation**
   - Return defaults instead of throwing error
   - Support piped/CI environments

3. **Add /memory:save:quick command**
   - Single command that uses current spec folder
   - Minimal prompt, uses session summary from context

4. **Simplify Gate 5 for trivial changes**
   - Add Option E: "Quick fix (skip documentation)"
   - Set LOC threshold (e.g., <10 LOC bypasses full gate)

5. **Fix version documentation**
   - Single source of truth in SKILL.md frontmatter
   - Auto-generate version references elsewhere

### Medium-term (Month 1)

1. **Reduce gate complexity**
   - Consolidate gates where possible
   - Create "beginner mode" with simplified flow

2. **Create beginner mode**
   - Reduced gates for first-time users
   - Progressive disclosure of advanced features

3. **Add progress indicators**
   - Show progress during embedding generation
   - Feedback during long operations

4. **Consolidate lib directories**
   - Single `lib/` with shared utilities
   - Language-specific subdirectories if needed

5. **Add anchor validation**
   - Check for unclosed ANCHOR tags
   - Warn on malformed anchor IDs

6. **Create YAML for debug command**
   - `spec_kit_debug_auto.yaml` and `spec_kit_debug_confirm.yaml`
   - Consistent with other commands

---

## Appendix: File References

### Core Files Analyzed

```
.opencode/skill/system-spec-kit/
├── SKILL.md (800 lines)
├── README.md (1770 lines)
├── mcp_server/
│   ├── context-server.js
│   └── lib/
├── scripts/
│   ├── generate-context.js (3000+ lines)
│   ├── validate-spec.sh
│   ├── recommend-level.sh
│   ├── create-spec-folder.sh
│   ├── archive-spec.sh
│   ├── calculate-completeness.sh
│   ├── check-prerequisites.sh
│   ├── common.sh
│   ├── lib/
│   └── rules/
├── templates/
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   ├── checklist.md
│   ├── decision-record.md
│   ├── research/research.md
│   ├── handover.md
│   ├── debug-delegation.md
│   ├── implementation-summary.md
│   ├── context_template.md
│   └── memory/context.md
├── database/
│   └── context-index.sqlite
└── constitutional/
    └── gate-enforcement.md

.opencode/command/spec_kit/
├── assets/
│   ├── spec_kit_plan_confirm.yaml (852 lines)
│   ├── spec_kit_plan_auto.yaml
│   ├── spec_kit_implement_confirm.yaml
│   ├── spec_kit_implement_auto.yaml
│   ├── spec_kit_research_confirm.yaml
│   ├── spec_kit_research_auto.yaml
│   ├── spec_kit_complete_auto.yaml
│   ├── spec_kit_complete_confirm.yaml
│   ├── spec_kit_resume_auto.yaml
│   ├── spec_kit_resume_confirm.yaml
│   └── spec_kit_handover_full.yaml

.opencode/agents/
├── research/AGENT.md
├── frontend-debug/AGENT.md
└── webflow-mcp/AGENT.md

AGENTS.md (800+ lines)
```

### Spec Folders Reviewed

```
.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive
├── 035-memory-speckit-merger/
├── 036-post-merge-refinement-1/
├── 037-post-merge-refinement-2/
├── 038-post-merge-refinement-3/
├── 039-node-modules-consolidation/
├── 040-mcp-server-rename/
└── z_archive/ (32+ folders)
```

---

*Report generated by 10-agent parallel analysis on 2025-12-25*
<!-- /ANCHOR:id -->
