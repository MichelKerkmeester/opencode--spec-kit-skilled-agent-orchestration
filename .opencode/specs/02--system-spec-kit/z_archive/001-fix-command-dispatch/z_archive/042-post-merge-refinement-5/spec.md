---
title: "Feature Specificatio [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/042-post-merge-refinement-5/spec]"
description: "Complete feature specification defining requirements, user stories, and success criteria for fixing critical bugs and improving quality following the Spec Kit Memory merger."
trigger_phrases:
  - "feature"
  - "specification"
  - "spec"
  - "kit"
  - "memory"
  - "042"
  - "post"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 3 -->
# Feature Specification: Spec Kit & Memory System Post-Merge Refinement (Phase 5)

Complete feature specification defining requirements, user stories, and success criteria for fixing critical bugs and improving quality following the Spec Kit Memory merger.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. OBJECTIVE

### Metadata
- **Category**: Fix
- **Level**: 3
- **Tags**: spec-kit, memory-system, bug-fix, refinement
- **Priority**: P0
- **Feature Branch**: `042-post-merge-refinement-5`
- **Created**: 2025-12-25
- **Status**: Draft
- **Input**: 10-agent comprehensive analysis revealing 7 critical bugs, 8 significant issues, 10 refinements

### Stakeholders
- Engineering (primary implementer)
- AI Agent Users (end users of Spec Kit Memory system)

### Problem Statement
Following the major Spec Kit Memory merger, a comprehensive 10-agent analysis revealed systemic issues across the codebase:

- **7 critical bugs** causing runtime errors, data loss risk, or broken functionality
- **8 significant issues** causing confusion or degraded user experience  
- **10 refinement opportunities** for improved quality

The most severe issues include:
1. Duplicate function definitions breaking caching (`getConstitutionalMemories` defined twice)
2. Column name mismatches causing silent failures (`access_count` vs `accessCount`)
3. Missing database columns causing SQLite errors (`related_memories` column)
4. Empty trigger phrases breaking proactive memory surfacing
5. Embeddings lost during checkpoint restore operations

Overall system health assessed at **7/10** - functional but with significant reliability gaps.

### Purpose
Stabilize the Spec Kit Memory system by fixing all critical bugs, resolving significant issues, and implementing high-value refinements to achieve production-quality reliability.

### Assumptions

- Node.js runtime environment available (ES6+ support)
- better-sqlite3 library installed and functional
- sqlite-vec optional extension may or may not be present
- Existing memory database contains production data that must be preserved
- OpenCode environment with MCP server integration

**Assumptions Validation Checklist**:
- [x] All assumptions reviewed with stakeholders
- [x] Technical feasibility verified for each assumption
- [x] Risk assessment completed for critical assumptions
- [x] Fallback plans identified for uncertain assumptions

---

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:scope -->
## 2. SCOPE

### In Scope
- `.opencode/skill/system-spec-kit/` - All files including scripts, templates, references
- `.opencode/command/spec_kit/` - All Spec Kit slash commands
- `.opencode/command/memory/` - All Memory slash commands
- `AGENTS.md` - Spec Kit and Memory documentation sections
- Database schema and migration scripts
- Validation scripts in `scripts/` folder
- SKILL.md documentation alignment

### Out of Scope
- LEANN MCP (separate semantic search system) - different codebase
- Narsil MCP (code analysis system) - different codebase
- Other skills (workflows-code, sk-git, sk-doc) - unrelated
- Agent definitions in `.opencode/agent/` - unless directly related to Spec Kit
- New feature development beyond fixing identified issues
- Performance optimization beyond identified issues
- UI/UX redesign of commands

<!-- /ANCHOR:scope -->
---

## 3. USERS & STORIES

### User Story 1 - Fix Critical Runtime Bugs (Priority: P0)

As a developer using the Spec Kit Memory system, I need the system to operate without runtime errors so that my workflow is not interrupted by crashes or silent failures.

**Why This Priority**: P0 because runtime errors and data loss risks make the system unreliable for production use. The duplicate function definitions and column mismatches cause immediate failures.

**Independent Test**: Can be tested by running the MCP server and verifying no startup errors, then executing memory operations (save, search, checkpoint) and verifying no SQLite errors or data corruption.

**Acceptance Scenarios**:
1. **Given** MCP server starts, **When** constitutional cache initializes, **Then** no duplicate function errors occur
2. **Given** memory is accessed, **When** access tracking updates, **Then** correct column (`access_count`) is updated
3. **Given** memory has related memories, **When** saving to database, **Then** `related_memories` column exists and stores data
4. **Given** checkpoint is restored, **When** memories are loaded, **Then** embeddings are preserved (not null/empty)
5. **Given** memory file is generated, **When** trigger phrases are extracted, **Then** non-empty array is produced

---

### User Story 2 - Resolve Documentation Inconsistencies (Priority: P1)

As a developer reading Spec Kit documentation, I need consistent gate numbering and terminology across AGENTS.md, SKILL.md, and commands so that I can follow the correct workflow without confusion.

**Why This Priority**: P1 because inconsistent documentation causes user confusion and incorrect behavior, but doesn't cause runtime failures.

**Independent Test**: Can be tested by auditing all documentation files for gate numbering (1-4 vs 1-5), command references, and terminology consistency.

**Acceptance Scenarios**:
1. **Given** user reads AGENTS.md, **When** they check gate numbering, **Then** it matches SKILL.md exactly
2. **Given** user reads command help, **When** they see referenced tools, **Then** all tools exist and are documented
3. **Given** user follows workflow, **When** they use spec_kit commands, **Then** behavior matches documentation

---

### User Story 3 - Implement Quality Refinements (Priority: P2)

As a developer using the memory system, I need improved search quality and better error handling so that the system is more reliable and helpful.

**Why This Priority**: P2 because these are quality-of-life improvements that enhance experience but system is functional without them.

**Independent Test**: Can be tested by exercising search functionality with `includeContiguity` flag, verifying timeout handling, and checking error messages for clarity.

**Acceptance Scenarios**:
1. **Given** hybrid search with `includeContiguity: true`, **When** search executes, **Then** contiguous memories are included
2. **Given** search operation, **When** timeout occurs, **Then** graceful error message is returned
3. **Given** any operation fails, **When** error is returned, **Then** message clearly indicates cause and resolution

---

<!-- ANCHOR:requirements -->
## 4. FUNCTIONAL REQUIREMENTS

### Critical Bug Fixes (P0)

- **REQ-FUNC-001:** System MUST have single definition of `getConstitutionalMemories` function (remove duplicate)
- **REQ-FUNC-002:** System MUST update `access_count` column (not `accessCount`) when tracking memory access
- **REQ-FUNC-003:** Database schema MUST include `related_memories` column in memories table
- **REQ-FUNC-004:** Checkpoint restore MUST preserve embedding vectors (not set to null)
- **REQ-FUNC-005:** Trigger phrase extraction MUST produce non-empty arrays for generated content
- **REQ-FUNC-006:** `includeContiguity` parameter MUST work correctly with hybrid search
- **REQ-FUNC-007:** Constitutional memory cache MUST initialize without errors

### Significant Issue Fixes (P1)

- **REQ-FUNC-008:** Gate numbering MUST be consistent (1-4) across AGENTS.md, SKILL.md, and commands
- **REQ-FUNC-009:** All referenced MCP tools MUST exist and be documented
- **REQ-FUNC-010:** Command help text MUST accurately describe current behavior
- **REQ-FUNC-011:** Memory file format MUST match documented ANCHOR structure
- **REQ-FUNC-012:** Validation scripts MUST correctly identify all error conditions
- **REQ-FUNC-013:** Error messages MUST provide actionable guidance
- **REQ-FUNC-014:** Database migrations MUST be idempotent (safe to run multiple times)
- **REQ-FUNC-015:** Search results MUST include proper metadata

### Refinements (P2)

- **REQ-FUNC-016:** System SHOULD provide search timeout configuration
- **REQ-FUNC-017:** System SHOULD log debug information when `DEBUG` env var is set
- **REQ-FUNC-018:** System SHOULD validate memory file format before indexing
- **REQ-FUNC-019:** System SHOULD provide memory statistics command
- **REQ-FUNC-020:** System SHOULD handle missing optional dependencies gracefully

### Traceability Mapping

| User Story | Related Requirements | Notes |
|------------|---------------------|-------|
| Story 1 - Critical Bugs | REQ-FUNC-001 through REQ-FUNC-007 | All P0 requirements |
| Story 2 - Documentation | REQ-FUNC-008 through REQ-FUNC-015 | All P1 requirements |
| Story 3 - Refinements | REQ-FUNC-016 through REQ-FUNC-020 | Selected P2 requirements |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:requirements -->
## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Memory search operations MUST complete within 500ms for typical queries
- **NFR-P02**: Database initialization MUST complete within 2 seconds
- **NFR-P03**: Checkpoint operations MUST not block other memory operations

### Security

- **NFR-S01**: Database files MUST have appropriate file permissions (600)
- **NFR-S02**: No sensitive data MUST be logged in debug output
- **NFR-S03**: SQL queries MUST use parameterized statements (prevent injection)

### Reliability

- **NFR-R01**: System MUST gracefully handle missing sqlite-vec extension
- **NFR-R02**: System MUST not lose data on unexpected shutdown
- **NFR-R03**: Failed operations MUST provide clear error messages with recovery steps

### Usability

- **NFR-U01**: All commands MUST provide `--help` output
- **NFR-U02**: Error messages MUST be human-readable (not stack traces)
- **NFR-U03**: Documentation MUST be consistent across all sources

### Operability

- **NFR-O01**: System MUST log operations when DEBUG environment variable is set
- **NFR-O02**: Database migrations MUST be idempotent
- **NFR-O03**: System MUST support backward compatibility with existing memory files

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 6. EDGE CASES

### Data Boundaries
- What happens when memory file has no trigger phrases? System MUST generate defaults from title/content
- What happens when embedding vector is corrupted? System MUST detect and offer re-generation
- How does system handle Unicode in memory content? MUST preserve all Unicode characters

### Error Scenarios
- What happens when database file is locked? MUST retry with exponential backoff, then fail gracefully
- How does system handle sqlite-vec not installed? MUST fall back to keyword search only
- What happens when checkpoint references deleted memories? MUST skip missing and log warning

### State Transitions
- What happens during checkpoint restore if interrupted? MUST be atomic (all or nothing)
- How does system handle concurrent memory saves? MUST use database transactions
- What happens when memory file is modified externally? MUST detect via content hash and offer re-index

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:success-criteria -->
## 7. SUCCESS CRITERIA

### Measurable Outcomes

- **SC-001**: All 7 P0 bugs verified fixed with passing test cases
- **SC-002**: All 8 P1 issues resolved with documentation updates
- **SC-003**: At least 5 of 10 P2 refinements implemented
- **SC-004**: Zero regression in existing functionality (all existing tests pass)
- **SC-005**: All validation scripts pass on spec folder (exit code 0)
- **SC-006**: Documentation alignment verified (AGENTS.md = SKILL.md = Commands)

### KPI Targets

| Category | Metric | Target | Measurement Method |
|----------|--------|--------|-------------------|
| Quality | P0 bugs remaining | 0 | Manual verification + test cases |
| Quality | P1 issues remaining | 0 | Documentation audit |
| Quality | P2 refinements completed | >= 5 | Implementation review |
| Reliability | Runtime errors | 0 | MCP server logs |
| Consistency | Doc alignment score | 100% | Cross-reference audit |

<!-- /ANCHOR:success-criteria -->
---

## 8. DEPENDENCIES & RISKS

### Dependencies

| Dependency | Type | Owner | Status | Impact if Blocked |
|------------|------|-------|--------|-------------------|
| better-sqlite3 | Technical | npm | Green | Cannot run database operations |
| sqlite-vec | Technical | npm (optional) | Yellow | Fall back to keyword search |
| Node.js 18+ | Technical | System | Green | Cannot run MCP server |
| OpenCode runtime | Technical | OpenCode | Green | Cannot test integration |

### Risk Assessment

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | Database migration breaks existing data | High | Medium | Backup before migration, test on copy first | Engineering |
| R-002 | Documentation changes cause confusion | Medium | Low | Announce changes, provide migration notes | Engineering |
| R-003 | Fixes introduce new bugs | Medium | Medium | Comprehensive testing, staged rollout | Engineering |
| R-004 | sqlite-vec dependency issues | Low | Low | Graceful fallback already implemented | Engineering |

### Rollback Plan

- **Rollback Trigger**: Runtime errors increase after deployment OR data corruption detected
- **Rollback Procedure**:
  1. Stop MCP server
  2. Restore database from backup (created before migration)
  3. Revert code changes via git
  4. Restart MCP server
  5. Verify functionality restored
- **Data Migration Reversal**: Database backup created before any schema changes; restore backup if needed

---

<!-- ANCHOR:scope -->
## 9. OUT OF SCOPE

**Explicit Exclusions**:

- **LEANN MCP changes** - Separate semantic search system with independent codebase
- **Narsil MCP changes** - Code analysis system not related to Spec Kit
- **Other skills modifications** - workflows-code, sk-git, sk-doc have separate concerns
- **New feature development** - Focus is on fixing existing issues, not adding capabilities
- **Performance optimization** - Beyond fixing identified performance bugs
- **UI/UX redesign** - Commands will work the same way, just correctly

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Resolved**: Gate numbering will standardize on Gates 1-4 (confirmed from AGENTS.md analysis)
- **Resolved**: Memory file format will follow ANCHOR structure (confirmed from template analysis)
- All major questions resolved during 10-agent analysis phase

<!-- /ANCHOR:questions -->
---

## 11. APPENDIX

### References

- **Related Specs**: 
  - `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/041-post-merge-refinement-4` - Previous refinement phase
  - `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/035-memory-speckit-merger` - Original merger spec
- **Analysis Documents**:
  - `analysis.md` - Comprehensive 10-agent findings
  - `recommendations.md` - Prioritized action items
- **Source Code**:
  - `.opencode/skill/system-spec-kit/scripts/generate-context.js`
  - `.opencode/skill/system-spec-kit/mcp-server/`

### Component Impact Map

```
Components Affected:
├── generate-context.js     - Trigger phrase extraction fix
├── MCP server              - Duplicate function, cache initialization
├── Database                - Schema (related_memories), migrations
├── SKILL.md                - Gate numbering, tool references
├── Commands                - Help text, behavior alignment
├── Validation              - Script accuracy
├── Memory format           - ANCHOR structure compliance
├── Checkpoints             - Embedding preservation
├── Search                  - includeContiguity, hybrid search
└── Integration             - Cross-component consistency
```

### Notes

This specification covers Phase 5 of post-merge refinement. Previous phases addressed:
- Phase 1-3: Initial merger stabilization
- Phase 4: First comprehensive bug fix pass

Phase 5 is based on the most thorough analysis to date, using 10 specialized agents to examine every component of the system.

---

## 12. WORKING FILES

### File Organization During Development

**Temporary/exploratory files MUST be placed in:**
- `scratch/` - For drafts, prototypes, debug logs, test queries (git-ignored)

**Permanent documentation belongs in:**
- Root of spec folder - spec.md, plan.md, tasks.md, checklist.md, decision-record.md
- `memory/` - Session context and conversation history

**Anti-pattern - DO NOT:**
- Place temporary files (debug-*.md, test-*.js, scratch-*.json) in project root
- Place disposable content in spec folder root (use scratch/ instead)

### Decision Flow
```
Is this content disposable after the task?
  YES -> scratch/
  NO  -> Will future sessions need this context?
          YES -> memory/
          NO  -> spec folder (permanent docs)
```

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md` for technical approach and architecture
- **Task Breakdown**: See `tasks.md` for implementation task list organized by user story
- **Validation Checklist**: See `checklist.md` for QA and validation procedures
- **Decision Record**: See `decision-record.md` for architectural decisions

---

## 13. CHANGELOG

### Version History

#### v1.0 (2025-12-25)
**Initial specification**

Based on comprehensive 10-agent analysis revealing:
- 7 critical bugs (P0)
- 8 significant issues (P1)
- 10 refinement opportunities (P2)

System health baseline: 7/10

---

<!--
  SPEC TEMPLATE - REQUIREMENTS & USER STORIES
  - Defines WHAT needs to be built and WHY
  - User stories prioritized and independently testable
  - Requirements traceable to stories
  - Uses REQ-XXX identifiers for change tracking
-->
