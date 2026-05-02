---
title: "Tasks: Post-Merge [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/041-post-merge-refinement-4/tasks]"
description: "Task list for resolving 75+ issues identified by 10-agent analysis across documentation, code, UX, and integration."
trigger_phrases:
  - "tasks"
  - "post"
  - "merge"
  - "refinement"
  - "implementation"
  - "041"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Post-Merge Refinement 4 - Implementation Breakdown

Task list for resolving 75+ issues identified by 10-agent analysis across documentation, code, UX, and integration.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending task |
| `[x]` | Completed task |
| `[P]` | Can be done in parallel with other [P] tasks |
| `[B]` | Blocked - waiting on dependency |

---

<!-- /ANCHOR:notation -->
## Task Summary

| Priority | Count | Status |
|----------|-------|--------|
| P0 (Critical) | 11 | ⬜ Pending |
| P1 (High) | 25 | ⬜ Pending |
| P2 (Medium) | 15 | ⬜ Pending |
| **Total** | **51** | **⬜ Pending** |

---

## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: system-maintenance, spec-kit, memory, documentation, bugfix
- **Priority**: P0

### Input
- `spec.md` (feature specification)
- 10-Agent Analysis Report

### Prerequisites
- **Required**: `spec.md`
- **Optional**: Analysis report from 10-agent review

### Organization
Tasks organized by priority tier (P0 → P1 → P2) then by category (Documentation, Code, UX).

---

## 2. CONVENTIONS

### Task Format

**Enhanced Format** (with requirement linking):
```markdown
- [ ] TASK-NNN: Task description
  - **Requirement:** REQ-XXX (spec.md#section-anchor)
  - **Acceptance:** Specific acceptance criteria
  - **Verification:** How to verify completion
```

### Path Conventions
- **Skill files**: `.opencode/skill/system-spec-kit/`
- **Scripts**: `.opencode/skill/system-spec-kit/scripts/`
- **Templates**: `.opencode/skill/system-spec-kit/templates/`
- **MCP Server**: `.opencode/skill/system-spec-kit/mcp_server/`
- **Commands**: `.opencode/command/`
- **Agents**: `.opencode/agents/`

### Task Completion Criteria
**Mark a task complete when:**
- [ ] Implementation finished
- [ ] Verification steps pass
- [ ] No regressions introduced
- [ ] Documentation updated (if applicable)

---

## WORKING FILES LOCATION

| Directory | Purpose | Persistence |
|-----------|---------|-------------|
| `scratch/` | Debug logs, test data, draft code | Temporary (git-ignored) |
| `memory/` | Context to preserve across sessions | Permanent (git-tracked) |
| Root | Final documentation only | Permanent (git-tracked) |

**MUST:** Place ALL temporary/debug files in `scratch/`
**NEVER:** Create temp files in spec folder root or project root

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Critical Fixes (P0)

**Purpose**: Resolve blockers that prevent core system functionality

**CRITICAL**: These issues cause workflow failures and must be fixed first

---

### P0-001: Resolve Agent File Mismatch
- **Priority:** P0
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `AGENTS.md:877-884`, `.opencode/agents/`
- **Requirement:** REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003 (spec.md#agent-system-requirements)
- **Description:** AGENTS.md references librarian/AGENT.md and documentation-writer/AGENT.md but only 3 agents exist (frontend-debug, research, webflow-mcp)
- **Acceptance Criteria:**
  - [ ] AGENTS.md agent list matches .opencode/agents/ contents
  - [ ] No references to non-existent agent files
  - [ ] Agent naming consistent throughout
- **Approach:** Update AGENTS.md to reflect actual agents (Option B from spec)
- **Verification:** `ls .opencode/agents/` matches agent list in AGENTS.md

---

### P0-002: Fix Template Count in SKILL.md
- **Priority:** P0
- **Effort:** 15 minutes
- **Status:** ⬜ Pending
- **File(s):** `.opencode/skill/system-spec-kit/SKILL.md:133`
- **Requirement:** REQ-FUNC-010 (spec.md#template-requirements)
- **Description:** SKILL.md claims "Templates (11)" but only 10 exist
- **Acceptance Criteria:**
  - [ ] Template count matches actual templates in `templates/` directory
  - [ ] README.md count also verified and aligned
- **Approach:** Audit templates directory, update count to accurate number
- **Verification:** `ls templates/*.md | wc -l` matches documented count

---

### P0-003: Create validate-spec.sh Script
- **Priority:** P0
- **Effort:** 2 hours
- **Status:** ⬜ Pending
- **File(s):** `.opencode/skill/system-spec-kit/scripts/validate-spec.sh`
- **Requirement:** REQ-FUNC-011, REQ-FUNC-013 (spec.md#script-requirements)
- **Description:** Script referenced in SKILL.md:537-636 but doesn't exist
- **Acceptance Criteria:**
  - [ ] Script exists and is executable (`chmod +x`)
  - [ ] Validates spec folder structure per documentation level
  - [ ] Returns exit codes: 0=pass, 1=warn, 2=fail
  - [ ] Checks required files exist (spec.md, plan.md, tasks.md)
  - [ ] Validates anchor format in memory files
  - [ ] Includes `--help` flag with usage information
- **Approach:** Create Node.js script with bash wrapper for cross-platform compatibility
- **Verification:** Run `./validate-spec.sh .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/041-post-merge-refinement-4` returns exit 0

---

### P0-004: Create recommend-level.sh Script
- **Priority:** P0
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** `.opencode/skill/system-spec-kit/scripts/recommend-level.sh`
- **Requirement:** REQ-FUNC-012, REQ-FUNC-013 (spec.md#script-requirements)
- **Description:** Script referenced in SKILL.md:172 but doesn't exist
- **Acceptance Criteria:**
  - [ ] Script exists and is executable
  - [ ] Counts LOC in spec folder implementation files
  - [ ] Suggests Level 1/2/3 based on complexity thresholds (<100, 100-499, ≥500)
  - [ ] Outputs recommendation with reasoning
  - [ ] Includes `--help` flag
- **Approach:** Create Node.js script with bash wrapper
- **Verification:** Run on known spec folder, verify correct level recommendation

---

### P0-005: Fix Empty Query Bug
- **Priority:** P0
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `.opencode/skill/system-spec-kit/mcp_server/context-server.js:588-595`
- **Requirement:** REQ-FUNC-004, REQ-FUNC-005 (spec.md#memory-system-requirements)
- **Description:** memory_search allows empty string queries which produce invalid embeddings
- **Acceptance Criteria:**
  - [ ] Empty string queries rejected with error message
  - [ ] Whitespace-only queries rejected with error message
  - [ ] Error message is actionable: "Query cannot be empty or whitespace-only"
- **Approach:** Add input validation at start of memory_search handler
- **Verification:** Test `memory_search({ query: "" })` and `memory_search({ query: "   " })` return errors

---

### P0-006: Add Simulation Mode Warning
- **Priority:** P0
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `.opencode/skill/system-spec-kit/scripts/generate-context.js:1318-1322`
- **Requirement:** REQ-FUNC-006 (spec.md#memory-system-requirements)
- **Description:** Simulation fallback creates searchable placeholder memories without clear warning
- **Acceptance Criteria:**
  - [ ] Simulation mode adds `isSimulated: true` flag to generated content
  - [ ] Warning prefix "[SIMULATED]" in generated memory title
  - [ ] Consider filtering simulated memories from production search results
- **Approach:** Add simulation detection and flagging in generate-context.js
- **Verification:** Run in simulation mode, verify flag and warning present in output

---

### P0-007: Fix Non-TTY Crash
- **Priority:** P0
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `.opencode/skill/system-spec-kit/scripts/generate-context.js:3086`
- **Requirement:** REQ-FUNC-007, NFR-R01 (spec.md#reliability)
- **Description:** Non-interactive mode throws error instead of using defaults
- **Acceptance Criteria:**
  - [ ] Non-TTY mode uses sensible defaults (spec folder from argument)
  - [ ] No crash when stdin is not a TTY
  - [ ] Logs decision made: "Running in non-interactive mode, using defaults"
- **Approach:** Add `process.stdin.isTTY` check before readline prompts
- **Verification:** Run `echo "" | node generate-context.js specs/...` completes without crash

---

### P0-008: Consolidate Context Templates
- **Priority:** P0
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** `templates/context_template.md`, `templates/memory/context.md`
- **Requirement:** REQ-FUNC-008, REQ-FUNC-009 (spec.md#template-requirements)
- **Description:** Two nearly identical templates with subtle differences (7-line discrepancy)
- **Acceptance Criteria:**
  - [ ] Single source of truth for context template identified
  - [ ] All differences merged into canonical version
  - [ ] Duplicate removed or symlinked
  - [ ] All references updated to point to canonical location
- **Approach:** Diff templates, merge best of both, remove duplicate
- **Verification:** Only one context template exists, all imports/references work

---

### P0-009: Add Constitutional Tier to memory/context.md
- **Priority:** P0
- **Effort:** 15 minutes
- **Status:** ⬜ Pending
- **File(s):** `templates/memory/context.md:32-65`
- **Requirement:** REQ-FUNC-017 (spec.md#documentation-requirements)
- **Description:** Missing constitutional tier in importance tier documentation (only 5 tiers listed)
- **Acceptance Criteria:**
  - [ ] Constitutional tier documented with description and use case
  - [ ] All 6 tiers listed consistently: constitutional, critical, important, normal, temporary, deprecated
  - [ ] Tier hierarchy explained (constitutional > critical > important > normal > temporary > deprecated)
- **Approach:** Add constitutional tier section to importance tier documentation
- **Verification:** Documentation shows 6 tiers with constitutional at top

---

### P0-010: Add Anchor Validation
- **Priority:** P0
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** `.opencode/skill/system-spec-kit/scripts/generate-context.js`
- **Requirement:** REQ-FUNC-019 (spec.md#ux-requirements)
- **Description:** Malformed anchor pairs fail silently, creating unindexable memories
- **Acceptance Criteria:**
  - [ ] Anchor pairs validated before save (ANCHOR_START has matching ANCHOR_END)
  - [ ] Warning for missing closing tags: "Warning: Unclosed anchor at line N"
  - [ ] Error message includes fix guidance: "Add <!-- ANCHOR_END --> before line N"
  - [ ] Validation can be bypassed with `--skip-anchor-validation` flag for edge cases
- **Approach:** Add anchor pair validation function, call before write
- **Verification:** Test with malformed anchor file, verify warning message

---

### P0-011: Auto-Checkpoint Before Cleanup
- **Priority:** P0
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `.opencode/command/memory/search.md`, `context-server.js`
- **Requirement:** REQ-FUNC-020 (spec.md#ux-requirements)
- **Description:** Cleanup deletes memories without undo capability
- **Acceptance Criteria:**
  - [ ] Checkpoint created automatically before bulk delete operations
  - [ ] User informed of checkpoint name: "Checkpoint 'pre-cleanup-{timestamp}' created"
  - [ ] Restore instructions provided: "To undo: checkpoint_restore({ name: 'pre-cleanup-...' })"
- **Approach:** Add checkpoint creation before memory_delete when bulk flag is true
- **Verification:** Run cleanup, verify checkpoint exists, restore works

---

**Checkpoint P0**: All critical blockers resolved. System core functionality verified.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: High Priority Documentation Fixes (P1-DOC)

**Purpose**: Align documentation with implementation to prevent confusion

---

### P1-DOC-001: Fix Step Count Mismatch
- **Priority:** P1
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `complete.md:2`, `spec_kit_complete_auto.yaml:389`
- **Requirement:** REQ-FUNC-015 (spec.md#documentation-requirements)
- **Description:** Says "14 steps" in MD but "13-step" in YAML
- **Acceptance Criteria:**
  - [ ] Consistent step count across all files
  - [ ] Workflow table matches actual step count
  - [ ] Each step verified to exist in implementation
- **Verification:** Count steps in both files, verify match

---

### P1-DOC-002: Fix Version Numbers
- **Priority:** P1
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `troubleshooting.md:11`, `SKILL.md:5`
- **Requirement:** REQ-FUNC-014 (spec.md#documentation-requirements)
- **Description:** Version mismatch (v12.5.0 vs v16.0.0) across files
- **Acceptance Criteria:**
  - [ ] All version numbers updated to v16.0.0
  - [ ] No outdated version references remain
  - [ ] Version number grep returns consistent results
- **Approach:** `grep -r "v[0-9]" .opencode/skill/system-spec-kit/` and update all
- **Verification:** All version strings show v16.0.0

---

### P1-DOC-003: Fix Progressive Model Inconsistency
- **Priority:** P1
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `template_guide.md`, `quick_reference.md`, `README.md`
- **Requirement:** REQ-FUNC-014 (spec.md#documentation-requirements)
- **Description:** Missing implementation-summary.md in Level 1 baseline documentation
- **Acceptance Criteria:**
  - [ ] Progressive model consistent across all documentation
  - [ ] Level 1 requirements match SKILL.md authoritative source
  - [ ] Each level's required files clearly listed
- **Verification:** Compare level requirements across all 3 files, verify match

---

### P1-DOC-004: Update Tool Naming Documentation
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** Multiple command files in `.opencode/command/`
- **Requirement:** REQ-FUNC-016 (spec.md#documentation-requirements)
- **Description:** Inconsistent tool naming (spec_kit_memory_memory_* vs memory_*)
- **Acceptance Criteria:**
  - [ ] Clear documentation of full MCP tool names
  - [ ] Shorthand aliases documented where available
  - [ ] Naming convention explained in one place
- **Approach:** Add "Tool Naming" section to SKILL.md quick reference
- **Verification:** New users can find correct tool names

---

### P1-DOC-005: Fix AGENTS.md Skill References
- **Priority:** P1
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `AGENTS.md:690,717`
- **Requirement:** REQ-FUNC-016 (spec.md#documentation-requirements)
- **Description:** References skills_system_memory (old name after rename)
- **Acceptance Criteria:**
  - [ ] All references use `skills_system_spec_kit` (new name)
  - [ ] No references to deprecated skill names
- **Approach:** Find/replace skills_system_memory → skills_system_spec_kit
- **Verification:** `grep "skills_system_memory" AGENTS.md` returns nothing

---

### P1-DOC-006: Remove memory_load References
- **Priority:** P1
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `resume.md:412`
- **Requirement:** REQ-FUNC-016 (spec.md#documentation-requirements)
- **Description:** References non-existent memory_load tool
- **Acceptance Criteria:**
  - [ ] All memory_load references removed from documentation
  - [ ] Replaced with `memory_search({ includeContent: true })`
  - [ ] Migration note added if needed
- **Verification:** `grep -r "memory_load"` returns nothing

---

### P1-DOC-007: Fix Command Step Counts
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** `.opencode/command/spec_kit/*.md`
- **Requirement:** REQ-FUNC-015 (spec.md#documentation-requirements)
- **Description:** Multiple command files have step count mismatches
- **Acceptance Criteria:**
  - [ ] Each command file step count matches actual steps
  - [ ] Table of contents matches content sections
- **Verification:** Manual audit of each command file

---

### P1-DOC-008: Update Quick Reference Card
- **Priority:** P1
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `.opencode/skill/system-spec-kit/references/quick_reference.md`
- **Description:** Quick reference missing recent commands and tools
- **Acceptance Criteria:**
  - [ ] All 8 spec_kit commands listed
  - [ ] All 3 memory commands listed
  - [ ] All 13 MCP tools listed
- **Verification:** Compare quick reference to actual available commands/tools

---

### P1-DOC-009: Fix Troubleshooting Guide
- **Priority:** P1
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `.opencode/skill/system-spec-kit/references/troubleshooting.md`
- **Description:** Troubleshooting guide references deprecated error codes
- **Acceptance Criteria:**
  - [ ] All error codes current and accurate
  - [ ] Solutions verified to work
  - [ ] No references to removed features
- **Verification:** Test each troubleshooting solution

---

### P1-DOC-010: Update README.md Counts
- **Priority:** P1
- **Effort:** 15 minutes
- **Status:** ⬜ Pending
- **File(s):** `.opencode/skill/system-spec-kit/README.md`
- **Description:** README counts don't match actual file counts
- **Acceptance Criteria:**
  - [ ] Template count accurate
  - [ ] Command count accurate
  - [ ] Tool count accurate
- **Verification:** `ls` commands match documented counts

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: High Priority Code Fixes (P1-CODE)

**Purpose**: Fix code bugs that impact reliability

---

### P1-CODE-001: Fix Duplicate step_5 in YAML
- **Priority:** P1
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `spec_kit_plan_confirm.yaml:503,521`
- **Description:** Two different steps named "step_5_*" causing YAML parse issues
- **Acceptance Criteria:**
  - [ ] Unique step names throughout YAML
  - [ ] Correct step numbering (no duplicates)
  - [ ] YAML validates without warnings
- **Verification:** YAML lint passes, no duplicate keys

---

### P1-CODE-002: Fix FTS5 Escaping
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** `mcp_server/lib/hybrid-search.js:51-53`
- **Description:** Missing escape for FTS5 operators (+, -, AND, OR, NOT)
- **Acceptance Criteria:**
  - [ ] All FTS5 operators properly escaped in search queries
  - [ ] Search works with special characters in query
  - [ ] No SQL syntax errors from user input
- **Approach:** Add escape function for FTS5 special characters
- **Verification:** Search for "C++ programming" works without error

---

### P1-CODE-003: Fix Embedding Warmup Race
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** `context-server.js:1643-1650`
- **Description:** Tool calls during embedding model warmup may fail
- **Acceptance Criteria:**
  - [ ] `waitForEmbeddingModel()` check added to all handlers using embeddings
  - [ ] Graceful queuing or retry during warmup
  - [ ] Clear error message if warmup fails: "Embedding model initializing, please retry"
- **Verification:** Rapid tool calls on cold start don't crash

---

### P1-CODE-004: Add Constitutional Caching
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** `mcp_server/lib/vector-index.js:957-985`
- **Description:** Constitutional memories fetched from DB on every single search
- **Acceptance Criteria:**
  - [ ] Constitutional results cached with configurable TTL (default 5 min)
  - [ ] Cache cleared when tier changes occur
  - [ ] Cache hit/miss logged for debugging
- **Approach:** Add in-memory cache with TTL for constitutional tier
- **Verification:** Second search in same minute doesn't hit DB for constitutional

---

### P1-CODE-005: Add Query Length Limit
- **Priority:** P1
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `context-server.js`
- **Description:** Extremely long queries can cause performance issues
- **Acceptance Criteria:**
  - [ ] Query length limited to 1000 characters
  - [ ] Clear error message for over-length queries
  - [ ] Limit documented in tool description
- **Verification:** Query >1000 chars returns error

---

### P1-CODE-006: Fix Memory Stats Performance
- **Priority:** P1
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `context-server.js`
- **Description:** memory_stats scans entire database each call
- **Acceptance Criteria:**
  - [ ] Stats cached with short TTL (30 sec)
  - [ ] Cache invalidated on write operations
- **Verification:** Rapid stats calls don't cause performance degradation

---

### P1-CODE-007: Add Graceful Shutdown
- **Priority:** P1
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `context-server.js`
- **Description:** MCP server doesn't clean up on SIGTERM
- **Acceptance Criteria:**
  - [ ] SIGTERM handler closes database connections
  - [ ] Pending operations complete before exit
  - [ ] Clean exit message logged
- **Verification:** `kill -TERM <pid>` exits cleanly without error

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: High Priority UX Fixes (P1-UX)

**Purpose**: Reduce friction in common workflows

---

### P1-UX-001: Add /memory:save:quick
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** `.opencode/command/memory/save.md`
- **Requirement:** REQ-FUNC-018 (spec.md#ux-requirements)
- **Description:** Current save requires 5+ steps for simple context preservation
- **Acceptance Criteria:**
  - [ ] Quick mode uses current spec folder from session context
  - [ ] Minimal context extraction (title, summary only)
  - [ ] Single command execution: `/memory:save:quick`
  - [ ] Falls back to full save if no spec folder context
- **Verification:** `/memory:save:quick` completes in ≤2 interactions

---

### P1-UX-002: Add Inline Command Help
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** All command files in `.opencode/command/`
- **Requirement:** NFR-U03 (spec.md#usability)
- **Description:** Commands require reading full docs for basic usage
- **Acceptance Criteria:**
  - [ ] 3-line summary available at top of each command
  - [ ] `/command --help` shows summary only
  - [ ] Summary includes: purpose, basic usage, common options
- **Verification:** `/spec_kit:new --help` shows 3-line summary

---

### P1-UX-003: Improve Error Messages
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** `context-server.js`
- **Requirement:** NFR-U01 (spec.md#usability)
- **Description:** Error messages lack actionable fix suggestions
- **Acceptance Criteria:**
  - [ ] All error messages include "Fix:" suggestion
  - [ ] Error messages reference relevant documentation
  - [ ] Format: "Error: {what happened}. Fix: {how to resolve}"
- **Verification:** Trigger common errors, verify actionable messages

---

### P1-UX-004: Add Confirmation for Destructive Operations
- **Priority:** P1
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `context-server.js`
- **Description:** memory_delete with bulk=true has no confirmation
- **Acceptance Criteria:**
  - [ ] Bulk delete requires explicit confirmation parameter
  - [ ] Non-confirmed bulk delete returns list of items to delete
  - [ ] Confirmation includes count: "Confirm deletion of N memories?"
- **Verification:** Bulk delete without confirm=true returns preview

---

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Medium Priority Fixes (P2)

**Purpose**: Improvements that enhance usability but don't block core functionality

---

### P2-001: Create quick-fix.md Template
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **Description:** No lightweight template for <100 LOC changes
- **Acceptance Criteria:**
  - [ ] Template exists in `templates/quick-fix.md`
  - [ ] Minimal required fields (problem, solution, verification)
  - [ ] Documented in template guide
  - [ ] Less than 50 lines
- **Verification:** Template passes validation, documented in guide

---

### P2-002: Add Template Decision Tree
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **Description:** 11 templates with no clear selection guidance
- **Acceptance Criteria:**
  - [ ] ASCII flowchart in SKILL.md
  - [ ] Clear decision criteria for each template
  - [ ] Quick reference table: scenario → template
- **Verification:** New user can select correct template in <1 minute

---

### P2-003: Make Batch Size Configurable
- **Priority:** P2
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `context-server.js:61`
- **Description:** BATCH_SIZE hardcoded to 5
- **Acceptance Criteria:**
  - [ ] Environment variable override: `SPECKIT_BATCH_SIZE`
  - [ ] Documented in configuration section
  - [ ] Default remains 5 for backward compatibility
- **Verification:** Setting env var changes batch behavior

---

### P2-004: Add Progress Indicators
- **Priority:** P2
- **Effort:** 2 hours
- **Status:** ⬜ Pending
- **Description:** Long operations (scan, bulk delete) have no progress feedback
- **Acceptance Criteria:**
  - [ ] Step-by-step progress for saves: "Step 1/3: Generating embedding..."
  - [ ] Batch progress for scans: "Processing 5/20 files..."
  - [ ] Progress updates via MCP notifications
- **Verification:** Long operation shows progress updates

---

### P2-005: Simplify Mustache Conditionals
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** `context_template.md:270,319,401`
- **Description:** Complex nested conditionals for section numbers
- **Acceptance Criteria:**
  - [ ] Conditionals simplified or extracted to helpers
  - [ ] Logic documented with comments
  - [ ] Maintainable structure for future edits
- **Verification:** Template renders correctly, code is readable

---

### P2-006: Add .hashes File for Templates
- **Priority:** P2
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `templates/.hashes`
- **Description:** Template versioning not tracked for change detection
- **Acceptance Criteria:**
  - [ ] `.hashes` file exists with SHA256 for each template
  - [ ] Script to regenerate hashes
  - [ ] Used by validation to detect drift
- **Verification:** Modifying template changes hash file on regeneration

---

### P2-007: Consolidate Lib Directories
- **Priority:** P2
- **Effort:** 2 hours
- **Status:** ⬜ Pending
- **File(s):** `scripts/lib/`, `mcp_server/lib/`
- **Description:** Duplicate helper modules exist in both locations
- **Acceptance Criteria:**
  - [ ] Single source for shared modules (prefer mcp_server/lib/)
  - [ ] No duplicate implementations
  - [ ] Clear separation: scripts use lib, mcp_server uses lib
- **Verification:** No duplicate function definitions across lib folders

---

### P2-008: Add Command Aliases
- **Priority:** P2
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **Description:** Long command names require full typing
- **Acceptance Criteria:**
  - [ ] Short aliases documented: `/m:s` for `/memory:save`
  - [ ] Aliases work in OpenCode
- **Verification:** `/m:s` invokes `/memory:save`

---

### P2-009: Improve Search Result Formatting
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** `context-server.js`
- **Description:** Search results are verbose, hard to scan
- **Acceptance Criteria:**
  - [ ] Compact format option: `format: "compact"`
  - [ ] Compact shows: title, score, spec folder only
  - [ ] Full format remains default
- **Verification:** Compact format is scannable at glance

---

### P2-010: Add Memory Export
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **Description:** No way to export memories for backup or analysis
- **Acceptance Criteria:**
  - [ ] Export command: `/memory:export [spec-folder]`
  - [ ] JSON format with all metadata
  - [ ] Can filter by spec folder, tier, date range
- **Verification:** Export produces valid JSON, can be re-imported

---

### P2-011: Add Dry Run Mode
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **Description:** No way to preview changes before save/delete
- **Acceptance Criteria:**
  - [ ] `--dry-run` flag for save and delete commands
  - [ ] Shows what would happen without making changes
  - [ ] Clear output: "Would save/delete: ..."
- **Verification:** Dry run produces preview, no actual changes

---

### P2-012: Improve Gate Documentation
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **File(s):** `AGENTS.md`
- **Description:** 8-gate system creates cognitive overload
- **Acceptance Criteria:**
  - [ ] Quick reference summary before detailed gates
  - [ ] Essential gates (5, 7, 8) highlighted
  - [ ] "Beginner mode" option documented
- **Verification:** New user can understand essential gates in <5 min

---

### P2-013: Add Example Memories
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **Description:** No example memories to learn from
- **Acceptance Criteria:**
  - [ ] 3 example memories in `examples/` directory
  - [ ] Cover: decision, implementation, research types
  - [ ] Annotated with comments explaining structure
- **Verification:** Examples pass validation, are instructive

---

### P2-014: Add Changelog Template
- **Priority:** P2
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **Description:** No template for tracking spec changes over time
- **Acceptance Criteria:**
  - [ ] `changelog.md` template in templates/
  - [ ] Format: date, author, change description
  - [ ] Linked from spec.md template
- **Verification:** Template validates, example entry provided

---

### P2-015: Improve Index Scan Output
- **Priority:** P2
- **Effort:** 30 minutes
- **Status:** ⬜ Pending
- **File(s):** `context-server.js`
- **Description:** memory_index_scan output hard to parse
- **Acceptance Criteria:**
  - [ ] Summary at end: "Scanned: N, Indexed: M, Skipped: K"
  - [ ] Errors grouped at end
  - [ ] Success message clear
- **Verification:** Scan output is scannable at glance

<!-- /ANCHOR:phase-3 -->
---

## Phase 4: Validation

**Purpose**: Verify all fixes work correctly end-to-end

---

### VAL-001: Test All MCP Tools
- **Priority:** P0
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **Acceptance Criteria:**
  - [ ] All 13 MCP tools respond correctly to valid input
  - [ ] All tools return appropriate errors for invalid input
  - [ ] No crashes or hangs
- **Tools to test:**
  - [ ] memory_search
  - [ ] memory_save
  - [ ] memory_delete
  - [ ] memory_update
  - [ ] memory_validate
  - [ ] memory_list
  - [ ] memory_stats
  - [ ] memory_match_triggers
  - [ ] memory_index_scan
  - [ ] checkpoint_create
  - [ ] checkpoint_list
  - [ ] checkpoint_restore
  - [ ] checkpoint_delete
- **Verification:** Test script passes for all tools

---

### VAL-002: Test All Commands
- **Priority:** P0
- **Effort:** 2 hours
- **Status:** ⬜ Pending
- **Acceptance Criteria:**
  - [ ] All 8 spec_kit commands execute correctly
  - [ ] All 3 memory commands execute correctly
  - [ ] Commands documented correctly
- **Commands to test:**
  - [ ] /spec_kit:new
  - [ ] /spec_kit:resume
  - [ ] /spec_kit:handover
  - [ ] /spec_kit:complete
  - [ ] /spec_kit:debug
  - [ ] /spec_kit:status
  - [ ] /spec_kit:tasks
  - [ ] /spec_kit:validate
  - [ ] /memory:save
  - [ ] /memory:search
  - [ ] /memory:cleanup
- **Verification:** Manual walkthrough of each command

---

### VAL-003: Verify Documentation Accuracy
- **Priority:** P1
- **Effort:** 2 hours
- **Status:** ⬜ Pending
- **Acceptance Criteria:**
  - [ ] All counts accurate (templates, commands, tools)
  - [ ] All file paths correct and files exist
  - [ ] All versions consistent (v16.0.0)
  - [ ] All cross-references valid
- **Verification:** Automated grep + manual spot checks

---

### VAL-004: Update Analysis Report
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **Acceptance Criteria:**
  - [ ] Each resolved issue marked with fix reference
  - [ ] Remaining issues documented with deferral reason
  - [ ] Summary stats updated
- **Verification:** Report accurately reflects post-fix state

---

### VAL-005: Create Completion Summary
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** ⬜ Pending
- **Acceptance Criteria:**
  - [ ] Summary of all changes made
  - [ ] Metrics: issues fixed by priority
  - [ ] Known limitations documented
  - [ ] Recommendations for future work
- **Verification:** Summary is comprehensive and accurate

---

## 3. VALIDATION CHECKLIST

### Code Quality
- [ ] All scripts have `--help` flag
- [ ] All scripts handle errors gracefully
- [ ] No console warnings or errors in MCP server
- [ ] All new code follows existing patterns

### Documentation
- [ ] All counts verified accurate
- [ ] All versions consistent
- [ ] Cross-references valid
- [ ] Examples work as documented

### Review & Sign-off
- [ ] All P0 items verified complete
- [ ] P1 items reviewed (80% target)
- [ ] P2 items documented if deferred
- [ ] Checklist updated with evidence

### Cross-References
- **Specification**: See `spec.md` for requirements
- **Checklist**: Create `checklist.md` for validation

---

## 4. OPTIONAL TESTS GUIDANCE

### Manual Testing
- **What**: All MCP tools, commands, scripts
- **Where**: Local development environment
- **Coverage Target**: 100% of P0 items, 80% of P1 items

### Integration Tests
- **What**: End-to-end command workflows
- **Where**: OpenCode session
- **Coverage Target**: All documented workflows

### Execution
- **Local**: Run individual scripts with test inputs
- **CI**: N/A (manual verification for this spec)

---

<!--
  TASKS TEMPLATE - Implementation Breakdown
  - Organized by priority tier and category
  - Each task has clear acceptance criteria
  - Verification steps included
  - Links to requirements in spec.md
-->
