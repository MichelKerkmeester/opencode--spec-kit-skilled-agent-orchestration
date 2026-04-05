---
title: "Feature Specification [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/spec]"
description: "Complete feature specification for addressing ~231 identified issues across the system-spec-kit skill and spec_kit commands."
trigger_phrases:
  - "feature"
  - "specification"
  - "system"
  - "spec"
  - "kit"
  - "064"
  - "bug"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 3 -->
# Feature Specification: System-Spec-Kit Bug Analysis and Fix - Requirements & User Stories

Complete feature specification for addressing ~231 identified issues across the system-spec-kit skill and spec_kit commands.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. OBJECTIVE

### Metadata
- **Category**: Fix
- **Level**: 3
- **Tags**: system-spec-kit, bug-fix, memory-system, mcp-server
- **Priority**: P0
- **Feature Branch**: `064-bug-analysis-and-fix`
- **Created**: 2026-01-15
- **Status**: In Progress
- **Input**: Comprehensive bug analysis audit + re-analysis (see research/research.md)

### Stakeholders
- Engineering (primary)
- All AI assistant users relying on SpecKit for documentation workflow

### Problem Statement
A comprehensive audit and re-analysis of the system-spec-kit skill and spec_kit commands revealed ~231 issues ranging from critical architectural problems to minor inconsistencies. Key critical problems include:

1. **Missing await in memory_search** - `formatSearchResults()` is async but called without await, returning Promises instead of results
2. **Config system is almost entirely unused** - 8 of 10 config sections are never loaded, `config-loader.js` is never imported
3. **ANCHOR system is non-functional** - Despite documented "93% token savings," anchor IDs are never extracted or stored
4. **Missing commands** - `/memory:save` referenced extensively but command file doesn't exist
5. **Undefined error code** - `E429` is thrown but not defined in ErrorCodes or documented
6. **Missing ON DELETE CASCADE** - orphaned `vec_memories` rows possible
7. **No batch API rate limiting** - embedding batch calls can overwhelm providers
8. **CHANGELOG version mismatch** - `[1.7.1]` vs `17.1.0` inconsistency

These issues undermine system reliability, cause inconsistent behavior, and erode trust in the documentation. The full inventory lives in `research/research.md` and must be treated as the source of truth.

### Purpose
Systematically fix all identified issues (including re-analysis findings) to ensure the system-spec-kit and spec_kit commands function as documented, with consistent behavior and reliable operation.

### Assumptions

- Fixes will be made incrementally, prioritized by severity
- All changes will be backward compatible with existing spec folders
- Memory database schema changes (if any) will include migration path
- Testing will verify fixes don't introduce regressions

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
- Fix all 9 CRITICAL issues (see research/research.md inventory)
- Fix all 47 HIGH priority issues (see research/research.md inventory)
- Fix all 86 MEDIUM priority issues (see research/research.md inventory)
- Address LOW priority issues as time permits (template consistency, naming conventions)
- Create missing `/memory:save` command or remove references
- Either implement ANCHOR functionality fully or remove false claims from documentation
- Decide config system fate: implement proper loading or remove unused code
- Align CHANGELOG version format with canonical versioning scheme
- Define and document all error codes used by MCP server (including E429)
- Add rate limiting for embedding batch calls
- Ensure vec_memories cleanup via ON DELETE CASCADE or equivalent safeguard

### Out of Scope
- Major architectural redesign of the memory system
- New feature development beyond fixing documented issues
- Performance optimization beyond fixing identified bugs
- Changes to external MCP servers (Narsil, Figma, etc.)

<!-- /ANCHOR:scope -->
---

## 3. USERS & STORIES

### User Story 1 - Config System Works as Documented (Priority: P0)

As a developer extending system-spec-kit, I need the config system to actually load and use configuration values so that behavior can be customized without code changes.

**Why This Priority**: P0 because the config system's non-functionality represents dead code and false documentation. Either the system should work or the code should be removed.

**Independent Test**: Can be tested by modifying config values and verifying behavior changes. Currently this test would fail for 8 of 10 config sections.

**Acceptance Scenarios**:
1. **Given** `search-weights.json` has modified values, **When** modules load, **Then** they use those values instead of hardcoded defaults
2. **Given** `config-loader.js` exists, **When** any module needs config, **Then** it imports and uses `config-loader.js`

---

### User Story 2 - ANCHOR System Functions as Documented (Priority: P0)

As an AI assistant, I need the ANCHOR system to enable section-level retrieval so that I can load specific memory sections without full file content, achieving the documented "93% token savings."

**Why This Priority**: P0 because the ANCHOR system is documented as a key feature but is completely non-functional. This is either feature fraud or a critical implementation gap.

**Independent Test**: Can be tested by checking if `anchor_id` column in database is ever populated and if anchor-based retrieval returns section content.

**Acceptance Scenarios**:
1. **Given** a memory file with ANCHOR tags, **When** indexed, **Then** `anchor_id` column is populated for each section
2. **Given** anchored sections exist, **When** `memory_load({ anchorId: "ABC123" })` is called, **Then** only that section's content is returned

---

### User Story 3 - Debug Threshold is Consistent (Priority: P0)

As an AI assistant following documentation, I need consistent guidance on when to trigger debug delegation so that I don't get conflicting instructions from different documents.

**Why This Priority**: P0 because conflicting documentation causes unpredictable behavior and erodes trust.

**Independent Test**: Search all documentation for debug threshold references and verify all state the same value.

**Acceptance Scenarios**:
1. **Given** SKILL.md says "3+ failed attempts", **When** debug.md is checked, **Then** it also says "3+ failed attempts"
2. **Given** any documentation file, **When** searched for debug threshold, **Then** only one consistent value is found

---

### User Story 4 - Memory Save Command Exists (Priority: P0)

As an AI assistant, I need the `/memory:save` command to exist so that documentation references to it actually work.

**Why This Priority**: P0 because SKILL.md extensively references this command (lines 109, 421-426, 787-788) but the command file doesn't exist.

**Independent Test**: Check for `.opencode/command/spec_kit/memory_save.md` existence.

**Acceptance Scenarios**:
1. **Given** user invokes `/memory:save`, **When** command is parsed, **Then** the command file is found and executed
2. **Given** SKILL.md references `/memory:save`, **When** command path is resolved, **Then** corresponding file exists

---

### User Story 5 - Documentation Matches Implementation (Priority: P1)

As a developer or AI assistant, I need documentation to accurately reflect implementation so that I can trust what I read.

**Why This Priority**: P1 because while not blocking functionality, mismatched docs cause confusion and wasted debugging time.

**Independent Test**: Each doc mismatch can be verified by comparing documented behavior to actual code.

**Acceptance Scenarios**:
1. **Given** SKILL.md references file paths, **When** those paths are checked, **Then** they exist
2. **Given** troubleshooting.md documents a formula, **When** code is checked, **Then** it uses that formula
3. **Given** templates show placeholders, **When** template is used, **Then** behavior matches description
4. **Given** CHANGELOG entries, **When** version formats are checked, **Then** a single canonical format is used

---

### User Story 6 - MCP Server Has No Silent Failures (Priority: P1)

As a system operator, I need MCP server code to handle errors consistently so that problems are visible and debuggable.

**Why This Priority**: P1 because silent failures make debugging extremely difficult and can cause data loss.

**Independent Test**: Each MCP bug can be tested by triggering the edge case and verifying proper error handling.

**Acceptance Scenarios**:
1. **Given** embedding warmup race condition, **When** multiple requests arrive, **Then** no stale model state is used
2. **Given** `mark_as_failed` is called with null DB, **When** executed, **Then** proper error is thrown (not crash)
3. **Given** trigger cache is used repeatedly, **When** memory is checked, **Then** no regex object accumulation

---

### User Story 7 - memory_search Returns Resolved Results (Priority: P0)

As an AI assistant, I need `memory_search` to return actual results (not Promises) so that search results are usable when `includeContent=true`.

**Why This Priority**: P0 because the missing await is a production-breaking bug.

**Independent Test**: Call `memory_search` with `includeContent=true` and verify results are objects, not Promises.

**Acceptance Scenarios**:
1. **Given** `includeContent=true`, **When** `memory_search` executes, **Then** the result payload is fully resolved (no Promise objects)

---

### User Story 8 - Error Codes Are Defined and Documented (Priority: P0)

As a system operator, I need every error code thrown by the MCP server to be defined and documented so that error handling is predictable.

**Why This Priority**: P0 because undefined error codes break tooling and documentation.

**Independent Test**: Ensure every error code used in code exists in `ErrorCodes` and is documented in references.

**Acceptance Scenarios**:
1. **Given** `E429` is thrown, **When** it is validated, **Then** it is defined in the ErrorCodes enum and documented

---

### User Story 9 - Embedding Batch Calls Are Rate Limited (Priority: P0)

As a system operator, I need embedding batch calls to be rate-limited so external providers are not overwhelmed.

**Why This Priority**: P0 because provider throttling can break indexing and degrade reliability.

**Independent Test**: Trigger batch embedding calls and verify rate limiting is applied.

**Acceptance Scenarios**:
1. **Given** repeated batch embedding calls, **When** the system runs, **Then** rate limits prevent provider overload

---

### User Story 10 - vec_memories Are Cleaned Up Reliably (Priority: P0)

As a developer, I need vec_memories rows to be cleaned up when memories are deleted so the database remains consistent.

**Why This Priority**: P0 because orphaned vector rows corrupt search integrity.

**Independent Test**: Delete a memory and verify corresponding vec_memories rows are removed.

**Acceptance Scenarios**:
1. **Given** a memory deletion, **When** cleanup occurs, **Then** vec_memories rows are removed via ON DELETE CASCADE or equivalent

---

<!-- ANCHOR:requirements -->
## 4. FUNCTIONAL REQUIREMENTS

### Critical Requirements

- **REQ-FUNC-001:** System MUST either load all config sections from `search-weights.json` via `config-loader.js` OR remove unused config code
- **REQ-FUNC-002:** System MUST either populate `anchor_id` column and support anchor-based retrieval OR remove ANCHOR documentation claims
- **REQ-FUNC-003:** System MUST have consistent debug delegation threshold across all documentation (choose 2+ or 3+)
- **REQ-FUNC-004:** System MUST have `/memory:save` command file at `.opencode/command/spec_kit/memory_save.md` OR remove SKILL.md references
- **REQ-FUNC-031:** System MUST await `formatSearchResults()` in `memory_search` so results are fully resolved
- **REQ-FUNC-032:** System MUST define and document all error codes used (including `E429`)
- **REQ-FUNC-033:** System MUST rate-limit embedding batch API calls
- **REQ-FUNC-034:** System MUST prevent orphaned `vec_memories` rows (ON DELETE CASCADE or equivalent)
- **REQ-FUNC-035:** System MUST use a single canonical CHANGELOG version format across docs and files

### High Priority Requirements

- **REQ-FUNC-005:** SKILL.md MUST NOT reference non-existent "AGENTS.md" - update to correct filename
- **REQ-FUNC-006:** `troubleshooting.md` MUST document the actual decay formula used in `attention-decay.js` (turn-based, not time-based)
- **REQ-FUNC-007:** `vector-index.js` MUST record the actual embedding model used, not hardcoded `nomic-ai/nomic-embed-text-v1.5`
- **REQ-FUNC-008:** `attention-decay.js` MUST return consistent type matching `context-server.js` expectations
- **REQ-FUNC-009:** `implement.md` MUST NOT reference Failure Pattern #19 (only patterns 1-18 exist)
- **REQ-FUNC-010:** `memory_system.md` MUST accurately document re-embedding triggers (full content, not just title change)
- **REQ-FUNC-011:** Documentation MUST include `searchBoost` multipliers (3.0, 2.0, 1.5, 1.0, 0.5) for importance tiers
- **REQ-FUNC-012:** `context-server.js` MUST handle embedding warmup race condition at lines 2514-2522
- **REQ-FUNC-013:** MCP tools MUST expose `includeWorkingMemory` and `sessionId` parameters
- **REQ-FUNC-014:** `retry-manager.js` MUST have null check before `mark_as_failed` at lines 227-238
- **REQ-FUNC-015:** `trigger-matcher.js` MUST properly manage regex object lifecycle to prevent memory leak
- **REQ-FUNC-016:** `co-activation.init()` MUST have consistent error handling (throw or return null, not both)
- **REQ-FUNC-017:** `plan.md` and `tasks.md` templates MUST NOT contradict themselves about required levels
- **REQ-FUNC-018:** `spec.md` template MUST include "Files to Change" section per `level_specifications.md`

### Medium Priority Requirements

- **REQ-FUNC-019:** `complete.md` line 100 MUST use correct format notation
- **REQ-FUNC-020:** `plan.md` MUST have consistent step numbering (resolve 5 vs 6 discrepancy)
- **REQ-FUNC-021:** `resume.md` tool table MUST include `checkpoint_restore`
- **REQ-FUNC-022:** `research/research.md` Phase 3 MUST be documented in SKILL.md
- **REQ-FUNC-023:** `handover.md` MUST include YAML asset file references like other commands
- **REQ-FUNC-024:** `generate-context.js` MUST have stricter spec folder path validation
- **REQ-FUNC-025:** `semantic-summarizer.js` MUST NOT have hardcoded macOS path
- **REQ-FUNC-026:** `checkpoints.js` TTL cleanup MUST consider last-used date
- **REQ-FUNC-027:** `hybrid-search.js` README MUST document actual parameter names
- **REQ-FUNC-028:** `template-renderer.js` MUST have try-catch for template not found
- **REQ-FUNC-029:** SKILL.md MUST document `shared/` directory
- **REQ-FUNC-030:** SKILL.md MUST document root `config/` directory

### Traceability Mapping

| User Story | Related Requirements | Notes |
|------------|---------------------|-------|
| Story 1 - Config System | REQ-FUNC-001 | Decision required: implement or remove |
| Story 2 - ANCHOR System | REQ-FUNC-002 | Decision required: implement or remove |
| Story 3 - Debug Threshold | REQ-FUNC-003 | Simple documentation fix |
| Story 4 - Memory Save Command | REQ-FUNC-004 | Create command or update SKILL.md |
| Story 5 - Documentation Accuracy | REQ-FUNC-005 through REQ-FUNC-011, REQ-FUNC-017-030, REQ-FUNC-035 | Multiple doc updates |
| Story 6 - MCP Reliability | REQ-FUNC-012 through REQ-FUNC-016 | Code fixes required |
| Story 7 - memory_search Results | REQ-FUNC-031 | Critical production bug |
| Story 8 - Error Code Registry | REQ-FUNC-032 | Define and document E429 |
| Story 9 - Batch Rate Limiting | REQ-FUNC-033 | Provider protection |
| Story 10 - vec_memories Cleanup | REQ-FUNC-034 | Database integrity |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:requirements -->
## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Memory indexing must complete within 5 seconds for typical memory files (<10KB)
- **NFR-P02**: Config loading must add <10ms to module initialization
- **NFR-P03**: Trigger matching must not accumulate memory beyond 50MB for regex cache

### Security

- **NFR-S01**: No sensitive data in error messages or logs
- **NFR-S02**: File path validation must prevent directory traversal

### Reliability

- **NFR-R01**: All MCP tools must handle null/undefined inputs gracefully
- **NFR-R02**: Database operations must have proper error handling
- **NFR-R03**: No silent failures - all errors must be logged or thrown

### Maintainability

- **NFR-M01**: All fixes must include inline comments explaining the fix
- **NFR-M02**: Documentation changes must update CHANGELOG sections
- **NFR-M03**: Code changes must follow existing style conventions

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 6. EDGE CASES

### Data Boundaries
- What happens when config file is missing or malformed? System should use defaults gracefully
- What happens when ANCHOR tags are malformed? Should log warning and skip, not crash
- What happens when memory file exceeds size limits? Should truncate with warning

### Error Scenarios
- What happens when database is locked during indexing? Should retry with backoff
- What happens when embedding service is unavailable? Should queue for retry
- What happens when checkpoint restore fails? Should report error and suggest recovery

### State Transitions
- What happens during migration from old schema to new? Should preserve existing data
- What happens if fix is partially applied (crash mid-update)? Should be idempotent on retry

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:success-criteria -->
## 7. SUCCESS CRITERIA

### Measurable Outcomes

- **SC-001**: All 9 CRITICAL issues resolved and verified
- **SC-002**: All 47 HIGH priority issues resolved and verified
- **SC-003**: All 86 MEDIUM priority issues resolved and verified
- **SC-004**: Zero documentation-code mismatches remaining
- **SC-005**: All MCP tools handle edge cases without crashes

### KPI Targets

| Category | Metric | Target | Measurement Method |
|----------|--------|--------|-------------------|
| Quality | Critical bugs remaining | 0 | Manual verification |
| Quality | High priority bugs remaining | 0 | Manual verification |
| Quality | Documentation accuracy | 100% | Cross-reference audit |
| Reliability | MCP crash rate | 0 | Error log monitoring |

<!-- /ANCHOR:success-criteria -->
---

## 8. DEPENDENCIES & RISKS

### Dependencies

| Dependency | Type | Owner | Status | Impact if Blocked |
|------------|------|-------|--------|-------------------|
| Database schema (for ANCHOR) | Internal | SpecKit | Green | Cannot implement anchor storage |
| MCP server restart capability | Internal | OpenCode | Green | Cannot test MCP fixes |
| Template files access | Internal | SpecKit | Green | Cannot update templates |

### Risk Assessment

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | ANCHOR implementation too complex | High | Medium | Can choose removal option instead | Engineering |
| R-002 | Config changes break existing behavior | Medium | Low | Thorough testing, feature flags | Engineering |
| R-003 | Database migration corrupts data | High | Low | Backup before migration, test on copy | Engineering |
| R-004 | Fixes introduce new bugs | Medium | Medium | Comprehensive testing, incremental rollout | Engineering |

### Rollback Plan

- **Rollback Trigger**: Any fix causes regression or new critical bug
- **Rollback Procedure**:
  1. Git revert the specific commit
  2. Restart MCP server
  3. Verify rollback successful
  4. Document issue for revised fix attempt
- **Data Migration Reversal**: Keep backup of `context-index.sqlite` before any schema changes

---

<!-- ANCHOR:scope -->
## 9. OUT OF SCOPE

**Explicit Exclusions**:

- New feature development (only fixing existing documented features)
- Performance optimization beyond fixing identified bugs
- UI/UX improvements to memory system
- Changes to external MCP integrations (Narsil, Figma, etc.)
- Refactoring code that isn't part of a bug fix

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should config system be fully implemented or should unused code be removed?
- Should ANCHOR system be fully implemented or should documentation claims be removed?
- What is the canonical debug threshold: 2+ or 3+ failed attempts?
- Should `/memory:save` be a new command or should references be updated to existing workflow?

<!-- /ANCHOR:questions -->
---

## 11. APPENDIX

### References

- **Related Specs**: `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive` (parent folder)
- **Affected Files**: See plan.md for complete file list
- **Bug Analysis Source**: Comprehensive audit + re-analysis conducted 2026-01-15

### Issue Categories Summary

| Category | Count | Priority |
|----------|-------|----------|
| CRITICAL | 9 | P0 - Must fix immediately |
| HIGH | 47 | P1 - Must fix before release |
| MEDIUM | 86 | P1 - Should fix |
| LOW | 89+ | P2 - Nice to have |
| **TOTAL** | **~231** | |

---

## 12. WORKING FILES

### File Organization During Development

**Temporary/exploratory files MUST be placed in:**
- `scratch/` - For drafts, prototypes, debug logs, test queries (git-ignored)

**Permanent documentation belongs in:**
- Root of spec folder - spec.md, plan.md, decision-record.md, etc.
- `memory/` - Session context and conversation history

---

## 13. CHANGELOG

### Version History

#### v1.0 (2026-01-15)
**Initial specification**

Documented all 41+ issues identified in comprehensive bug analysis audit:
- 4 CRITICAL issues (config system, ANCHOR, debug threshold, memory:save)
- 15 HIGH priority issues (doc mismatches, MCP bugs, template contradictions)
- 12 MEDIUM priority issues (cross-references, scripts, doc gaps)
- 10+ LOW priority issues (consistency, naming conventions)

#### v1.1 (2026-01-15)
**Expanded scope from re-analysis**

Updated to reflect ~231 total issues identified by re-analysis:
- 9 CRITICAL issues (added missing await, E429, batch rate limiting, vec_memories cascade, changelog format)
- 47 HIGH priority issues
- 86 MEDIUM priority issues
- 89+ LOW priority issues

---

<!--
  SPEC TEMPLATE - REQUIREMENTS & USER STORIES
  - Defines WHAT needs to be built and WHY
  - User stories prioritized and independently testable
  - Requirements traceable to stories
  - Uses REQ-XXX identifiers for change tracking
-->
