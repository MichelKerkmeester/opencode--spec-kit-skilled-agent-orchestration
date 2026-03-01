---
title: "Feature Specification: Post-Merge Refinement 4 - Comprehensive System Alignment [041-post-merge-refinement-4/spec]"
description: "Complete specification for addressing 75+ issues identified by 10-agent analysis across documentation, code, UX, and integration."
trigger_phrases:
  - "feature"
  - "specification"
  - "post"
  - "merge"
  - "refinement"
  - "spec"
  - "041"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Post-Merge Refinement 4 - Comprehensive System Alignment

Complete specification for addressing 75+ issues identified by 10-agent analysis across documentation, code, UX, and integration.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Fix
- **Level**: 3
- **Tags**: system-maintenance, spec-kit, memory, documentation, bugfix
- **Priority**: P0
- **Feature Branch**: `041-post-merge-refinement-4`
- **Created**: 2025-12-25
- **Status**: Draft
- **Input**: 10-Agent Analysis Report (comprehensive system review)

### Stakeholders
- AI Agents (primary users of spec-kit and memory systems)
- Developers (maintaining and extending the system)
- End Users (benefiting from improved UX and reliability)

### Problem Statement
Following the system-memory to system-spec-kit merger (specs 035-040), a comprehensive 10-agent analysis revealed 75+ issues across documentation, code, UX, and integration. These issues cause:
- Confusing error messages and silent failures
- Documentation that contradicts implementation
- Missing scripts that block core workflows
- 8-gate system creating cognitive overload
- Simple tasks requiring excessive interactions

### Purpose
Resolve all identified issues to achieve full alignment between documentation and implementation, eliminate critical bugs, and improve system usability.

### Assumptions

- OpenCode version compatibility maintained (no breaking changes to MCP tool signatures)
- Existing memory database backward compatibility required
- Users have access to Node.js for script execution
- Current spec folder structure (035-040) is stable and complete

**Assumptions Validation Checklist**:
- [x] All assumptions reviewed with stakeholders
- [x] Technical feasibility verified for each assumption
- [x] Risk assessment completed for critical assumptions
- [ ] Fallback plans identified for uncertain assumptions

---

## 2. SCOPE

### In Scope
- All 11 P0 Critical issues (must fix)
- All 25+ P1 High priority issues (should fix)
- All 15+ P2 Medium priority issues (could fix)
- Documentation alignment across all affected files
- Script creation for missing validation tools
- UX quick wins (reduced friction without major redesign)

### Out of Scope
- Major architectural changes (e.g., replacing SQLite with different database)
- New feature development beyond fixing existing gaps
- Performance optimization (unless directly tied to a P0 bug)
- UI/visual redesign of documentation
- Breaking changes to MCP tool signatures

---

## 3. USERS & STORIES

### User Story 1 - Agent File Discovery (Priority: P0)

As an AI agent, I need AGENTS.md to accurately reflect available agent files so that I can correctly route tasks to specialized agents.

**Why This Priority**: P0 because agent routing is a core system capability. Missing or misnamed agent files cause complete workflow failures.

**Independent Test**: Verify every agent listed in AGENTS.md has a corresponding .opencode/agents/{name}/AGENT.md file, and vice versa.

**Acceptance Scenarios**:
1. **Given** AGENTS.md lists "research" agent, **When** I check .opencode/agents/, **Then** research/AGENT.md exists
2. **Given** a new agent file exists in .opencode/agents/, **When** I read AGENTS.md, **Then** the agent is listed with correct description

---

### User Story 2 - Memory Search Reliability (Priority: P0)

As an AI agent, I need memory_search to reject invalid queries gracefully so that I receive actionable error messages instead of silent failures or crashes.

**Why This Priority**: P0 because memory search is used at the start of most workflows. Silent failures corrupt downstream decisions.

**Independent Test**: Call memory_search with empty string, whitespace-only, and null query. Each should return a clear error message.

**Acceptance Scenarios**:
1. **Given** memory_search receives empty query "", **When** executed, **Then** returns error "Query cannot be empty"
2. **Given** memory_search receives whitespace query "   ", **When** executed, **Then** returns error "Query cannot be empty or whitespace-only"

---

### User Story 3 - Spec Validation Scripts (Priority: P0)

As a developer, I need validate-spec.sh and recommend-level.sh scripts to exist and function so that I can validate spec folder structure and get level recommendations.

**Why This Priority**: P0 because these scripts are referenced in documentation but don't exist, causing workflow failures.

**Independent Test**: Run each script and verify it executes without error and produces expected output format.

**Acceptance Scenarios**:
1. **Given** validate-spec.sh exists, **When** run on a valid spec folder, **Then** returns success with validation report
2. **Given** recommend-level.sh exists, **When** run with LOC count, **Then** returns recommended level (1, 2, or 3)

---

### User Story 4 - Template Consolidation (Priority: P0)

As an AI agent, I need a single source of truth for context templates so that I don't encounter conflicting template formats.

**Why This Priority**: P0 because duplicate templates cause inconsistent memory file generation.

**Independent Test**: Search for context template definitions and verify only one canonical location exists.

**Acceptance Scenarios**:
1. **Given** I search for context template, **When** I find template definitions, **Then** only one authoritative source exists
2. **Given** memory/context.md exists, **When** I compare to canonical template, **Then** they are identical or memory/context.md is removed

---

### User Story 5 - Documentation Version Alignment (Priority: P1)

As a developer, I need all version numbers to be consistent across files so that I can trust the system state.

**Why This Priority**: P1 because version mismatches create confusion but don't block core functionality.

**Independent Test**: Grep for version patterns across all spec-kit files and verify consistency.

**Acceptance Scenarios**:
1. **Given** SKILL.md shows version v16.0.0, **When** I check all related files, **Then** all show v16.0.0
2. **Given** template count documented as 11, **When** I count actual templates, **Then** count matches documentation

---

### User Story 6 - Quick Memory Save (Priority: P1)

As an AI agent, I need a quick memory save option so that simple context preservation doesn't require full form completion.

**Why This Priority**: P1 because current save friction discourages context preservation, reducing system value.

**Independent Test**: Invoke /memory:save:quick and verify it saves with minimal required fields.

**Acceptance Scenarios**:
1. **Given** active spec folder context, **When** I invoke /memory:save:quick, **Then** memory is saved with auto-generated title and minimal fields
2. **Given** no spec folder context, **When** I invoke /memory:save:quick, **Then** I'm prompted for spec folder only

---

### User Story 7 - Simplified Gate Documentation (Priority: P2)

As an AI agent, I need gate system documentation to be more accessible so that I can follow the correct workflow without cognitive overload.

**Why This Priority**: P2 because this is a usability improvement that doesn't block core functionality.

**Independent Test**: Review gate documentation and verify beginner mode or simplified view is available.

**Acceptance Scenarios**:
1. **Given** AGENTS.md gate section, **When** I read for first time, **Then** quick reference summary is visible before detailed gates
2. **Given** beginner mode requested, **When** gates are explained, **Then** only essential gates (5, 7, 8) are emphasized

---

## 4. FUNCTIONAL REQUIREMENTS

### Agent System Requirements

- **REQ-FUNC-001:** AGENTS.md agent list MUST match actual .opencode/agents/ directory contents
- **REQ-FUNC-002:** Each agent listed in AGENTS.md MUST have corresponding AGENT.md file
- **REQ-FUNC-003:** Agent naming MUST be consistent (no Librarian vs research mismatch)

### Memory System Requirements

- **REQ-FUNC-004:** memory_search MUST validate query parameter is non-empty and non-whitespace
- **REQ-FUNC-005:** memory_search MUST return actionable error message for invalid queries
- **REQ-FUNC-006:** Simulation mode MUST NOT create placeholder memories in production database
- **REQ-FUNC-007:** Non-TTY mode MUST NOT crash the MCP server

### Template Requirements

- **REQ-FUNC-008:** System MUST have single authoritative context template location
- **REQ-FUNC-009:** Duplicate context templates MUST be consolidated or removed
- **REQ-FUNC-010:** Template count in documentation MUST match actual template count

### Script Requirements

- **REQ-FUNC-011:** validate-spec.sh MUST exist and validate spec folder structure
- **REQ-FUNC-012:** recommend-level.sh MUST exist and return level recommendation based on LOC
- **REQ-FUNC-013:** Both scripts MUST be executable and documented

### Documentation Requirements

- **REQ-FUNC-014:** All version numbers MUST be consistent across spec-kit files
- **REQ-FUNC-015:** All step counts in commands MUST match actual implementation steps
- **REQ-FUNC-016:** Tool naming MUST be consistent (memory_search vs memorySearch)
- **REQ-FUNC-017:** Constitutional tier MUST be documented in memory/context.md

### UX Requirements

- **REQ-FUNC-018:** /memory:save:quick command MUST be available for rapid context save
- **REQ-FUNC-019:** Anchor failures MUST produce visible error messages (not silent)
- **REQ-FUNC-020:** Cleanup deletion MUST have undo or confirmation mechanism

### Traceability Mapping

| User Story | Related Requirements | Notes |
|------------|---------------------|-------|
| Story 1 - Agent File Discovery | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003 | P0 Critical |
| Story 2 - Memory Search Reliability | REQ-FUNC-004, REQ-FUNC-005 | P0 Critical |
| Story 3 - Spec Validation Scripts | REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013 | P0 Critical |
| Story 4 - Template Consolidation | REQ-FUNC-008, REQ-FUNC-009, REQ-FUNC-010 | P0 Critical |
| Story 5 - Documentation Version Alignment | REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017 | P1 High |
| Story 6 - Quick Memory Save | REQ-FUNC-018 | P1 High |
| Story 7 - Simplified Gate Documentation | N/A (documentation improvement) | P2 Medium |

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Memory search MUST respond within 500ms for typical queries
- **NFR-P02**: Script execution MUST complete within 5 seconds for standard spec folders
- **NFR-P03**: MCP server MUST handle concurrent requests without deadlock

### Security

- **NFR-S01**: Scripts MUST not execute arbitrary user input (input sanitization required)
- **NFR-S02**: Database operations MUST use parameterized queries (prevent SQL injection)

### Reliability

- **NFR-R01**: MCP server MUST not crash on invalid input (graceful error handling)
- **NFR-R02**: Memory operations MUST be atomic (no partial saves)
- **NFR-R03**: All error states MUST be logged with actionable context

### Usability

- **NFR-U01**: Error messages MUST be actionable (include fix suggestion)
- **NFR-U02**: Documentation MUST be scannable (headers, tables, quick references)
- **NFR-U03**: Commands MUST have inline help summaries

### Operability

- **NFR-O01**: All scripts MUST include --help flag with usage information
- **NFR-O02**: Database migrations MUST be backward compatible
- **NFR-O03**: Changes MUST be validated before deployment (checklist verification)

---

## 6. EDGE CASES

### Data Boundaries
- What happens when memory database is empty? System should return empty results, not error
- What happens when spec folder has no memory/ directory? Scripts should handle gracefully
- How does system handle Unicode in memory content? Must preserve encoding correctly

### Error Scenarios
- What happens when MCP server can't connect to database? Return clear connection error
- How does system handle corrupted memory files? Skip with warning, continue processing
- What happens when two agents try to save memory simultaneously? Implement locking or queue

### State Transitions
- What happens when memory save is interrupted? Rollback to previous state
- How does system handle upgrade from v15 to v16 memory format? Automatic migration
- What happens when user deletes memory mid-search? Return partial results with warning

---

## 7. SUCCESS CRITERIA

### Measurable Outcomes

- **SC-001**: All 11 P0 issues resolved with verification evidence
- **SC-002**: Zero documentation vs implementation mismatches for critical paths
- **SC-003**: All referenced scripts exist and execute successfully
- **SC-004**: Memory search handles all invalid input gracefully (no crashes)
- **SC-005**: Template count matches documentation (single source of truth)

### KPI Targets

| Category | Metric | Target | Measurement Method |
|----------|--------|--------|-------------------|
| Quality | P0 issues resolved | 100% (11/11) | Checklist verification |
| Quality | P1 issues resolved | 80%+ (20+/25) | Checklist verification |
| Reliability | MCP crash rate | 0 for invalid input | Manual testing |
| Consistency | Version number mismatches | 0 | Grep audit |
| Usability | Average interactions for simple task | ≤3 | User testing |

---

## 8. DEPENDENCIES & RISKS

### Dependencies

| Dependency | Type | Owner | Status | Impact if Blocked |
|------------|------|-------|--------|-------------------|
| system-spec-kit skill | Internal | Spec Kit Team | Green | Cannot modify core functionality |
| context-server.js | Internal | MCP Team | Green | Cannot fix memory bugs |
| AGENTS.md | Internal | Agent Team | Green | Cannot fix agent routing |
| Node.js runtime | External | System | Green | Scripts won't execute |

### Risk Assessment

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | Breaking existing memories during fix | High | Low | Test with backup database first | Dev Team |
| R-002 | Documentation drift recurs after fix | Medium | High | Add automated doc-code alignment checks | Dev Team |
| R-003 | UX changes confuse existing users | Medium | Medium | Gradual rollout, maintain backward compat | Dev Team |
| R-004 | Missing edge cases in query validation | Low | Medium | Comprehensive test suite for memory_search | Dev Team |
| R-005 | Script permissions issues across platforms | Low | Medium | Test on macOS, Linux; document Windows limitations | Dev Team |

### Rollback Plan

- **Rollback Trigger**: Critical regression in memory functionality or MCP server stability
- **Rollback Procedure**:
  1. Restore previous context-server.js from git
  2. Restore previous AGENTS.md and agent files
  3. Restore previous template files
  4. Clear corrupted memory entries if any
- **Data Migration Reversal**: Memory format is backward compatible; no reversal needed

---

## 9. OUT OF SCOPE

**Explicit Exclusions**:

- **Major architectural redesign** - This is a refinement pass, not a rewrite. Changes to fundamental architecture (e.g., replacing SQLite, changing MCP protocol) require separate spec.
- **New feature development** - No new capabilities beyond fixing existing gaps. New features go to separate specs.
- **Performance optimization** - Unless directly tied to a P0 bug, performance work is deferred.
- **UI/visual redesign** - Documentation structure improvements only, not visual refresh.
- **Breaking changes to MCP signatures** - Tool signatures must remain backward compatible.
- **Gate system architectural simplification** - Documentation can be improved, but gate logic itself is not restructured in this pass.

---

## 10. OPEN QUESTIONS

- **Q1**: Should we merge agent naming (Librarian vs research) by renaming the directory or updating AGENTS.md? Recommendation: Rename directory to match role name.
- **Q2**: What is the retention policy for deprecated memories? Current: indefinite. Recommendation: Add configurable retention.
- **Q3**: Should validate-spec.sh be a bash script or Node.js for cross-platform compatibility? Recommendation: Node.js with npm script wrapper.
- **Q4**: How should /memory:save:quick determine spec folder when multiple are active? Recommendation: Use most recent spec folder from session context.

---

## 11. APPENDIX

### References

- **Analysis Source**: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/041-post-merge-refinement-4/analysis-report.md`
- **Related Specs**:
  - `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/035-memory-speckit-merger`
  - `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/037-post-merge-refinement-2`
  - `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/038-post-merge-refinement-3`
  - `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/039-node-modules-consolidation`
  - `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/040-mcp-server-rename`

### Key Files

| File | Purpose | Issues Found |
|------|---------|--------------|
| `.opencode/skill/system-spec-kit/SKILL.md` | Main skill documentation | Version, template count |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.js` | MCP server implementation | Empty query bug, non-TTY crash |
| `AGENTS.md` | Agent routing configuration | Missing agents, naming mismatch |
| `.opencode/command/memory/*.md` | Memory command documentation | Step counts, tool naming |
| `.opencode/command/spec_kit/*.md` | Spec kit command documentation | Step counts, missing scripts |
| `.opencode/agents/` | Agent definitions | Missing files |

### P0 Issues Detail

| # | Issue | Location | Fix Approach |
|---|-------|----------|--------------|
| 1 | Missing librarian/AGENT.md | .opencode/agents/ | Create file OR update AGENTS.md |
| 2 | Missing documentation-writer/AGENT.md | .opencode/agents/ | Create file OR update AGENTS.md |
| 3 | Agent naming mismatch | AGENTS.md vs directory | Align names consistently |
| 4 | Template count: 11 vs 10 | SKILL.md | Audit and correct count |
| 5 | Missing validate-spec.sh | scripts/ | Create script |
| 6 | Missing recommend-level.sh | scripts/ | Create script |
| 7 | Empty query bug | context-server.js | Add input validation |
| 8 | Simulation mode placeholder | context-server.js | Add mode check |
| 9 | Non-TTY crash | context-server.js | Add TTY detection |
| 10 | Duplicate context template | memory/context.md | Consolidate |
| 11 | Silent anchor failure | generate-context.js | Add error logging |

---

## 12. WORKING FILES

### File Organization During Development

**Temporary/exploratory files MUST be placed in:**
- `scratch/` - For drafts, prototypes, debug logs, test queries (git-ignored)

**Permanent documentation belongs in:**
- Root of spec folder - spec.md, plan.md, tasks.md, checklist.md
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

## 13. CHANGELOG

### Version History

#### v1.0 (2025-12-25)
**Initial specification**

Based on 10-agent comprehensive analysis identifying 75+ issues across:
- 11 P0 Critical items
- 25+ P1 High priority items
- 15+ P2 Medium priority items

---

<!--
  SPEC TEMPLATE - REQUIREMENTS & USER STORIES
  - Defines WHAT needs to be built and WHY
  - User stories prioritized and independently testable
  - Requirements traceable to stories
  - Uses REQ-XXX identifiers for change tracking
-->
