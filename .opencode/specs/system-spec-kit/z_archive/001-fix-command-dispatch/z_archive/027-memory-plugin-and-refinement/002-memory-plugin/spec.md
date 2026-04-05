---
title: "...system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/027-memory-plugin-and-refinement/002-memory-plugin/spec]"
description: "Optimize the semantic memory plugin to inject a compact \"memory dashboard\" instead of full content, reducing token consumption while maintaining context visibility."
trigger_phrases:
  - "feature"
  - "specification"
  - "memory"
  - "plugin"
  - "dashboard"
  - "spec"
  - "002"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 1 -->
# Feature Specification: Memory Plugin Dashboard Optimization - Requirements & User Stories

Optimize the semantic memory plugin to inject a compact "memory dashboard" instead of full content, reducing token consumption while maintaining context visibility.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Tags**: memory, plugin, optimization, dashboard
- **Priority**: P1
- **Feature Branch**: `015-memory-plugin-and-refinement`
- **Created**: 2025-12-17
- **Status**: Approved
- **Input**: User-approved dashboard design for compact memory context injection

### Stakeholders
- AI Agent (primary consumer of injected context)
- Developer (maintains plugin code)

### Purpose
Reduce token consumption from ~2,000-5,000 tokens to ~500-1,000 tokens per session by replacing full memory content injection with a compact ASCII dashboard that surfaces memory IDs for on-demand loading.

### Assumptions

- Plugin architecture supports custom transform hooks via `experimental.chat.system.transform`
- SQLite database with semantic memory tables exists at `.opencode/skills/system-memory/database/memory-index.sqlite`
- Memory records have `importance_tier`, `title`, `trigger_phrases`, `created_at`, and `spec_folder` fields
- Dashboard format approved by user (see Section 4 for exact format)

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
- New `getMemoryIndex()` function to query constitutional + critical + recent memories
- New `formatMemoryDashboard()` function to create ASCII dashboard output
- Helper `formatTimeAgo()` for human-readable timestamps ("1h ago", "2d ago")
- Helper `truncateTriggers()` to limit trigger phrases to 3-4 items
- Update configuration constants for memory limits
- Update `experimental.chat.system.transform` hook integration

### Out of Scope
- Changes to semantic memory MCP server - uses existing query capabilities
- New database schema or indexes - works with existing structure
- Memory search improvements - separate enhancement
- Dashboard interactivity - static ASCII output only

<!-- /ANCHOR:scope -->
---

## 3. USERS & STORIES

### User Story 1 - Compact Context Injection (Priority: P0)

As an AI agent, I need a compact memory dashboard injected at session start so that I can see available context without consuming excessive tokens.

**Why This Priority**: P0 because this is the core purpose of the optimization - without it, the plugin continues consuming 2,000-5,000 tokens.

**Independent Test**: Can be fully tested by verifying the transform hook produces the expected ASCII dashboard format with correct memory counts and IDs.

**Acceptance Scenarios**:
1. **Given** session starts with memories in database, **When** transform hook executes, **Then** dashboard shows constitutional/critical/recent memories in approved format
2. **Given** session starts with empty database, **When** transform hook executes, **Then** dashboard shows "No memories found" message
3. **Given** memories exist but some tiers are empty, **When** transform hook executes, **Then** empty sections are hidden (not shown as "None")

---

### User Story 2 - Memory ID Discovery (Priority: P0)

As an AI agent, I need to see memory IDs in the dashboard so that I can load specific memories on-demand using `memory_load({ memoryId: # })`.

**Why This Priority**: P0 because the dashboard is useless without actionable memory IDs for loading full content.

**Independent Test**: Verify each memory entry in dashboard includes its numeric ID in the format `#39 │ Title`.

**Acceptance Scenarios**:
1. **Given** dashboard displays memories, **When** agent sees memory `#39`, **Then** agent can call `memory_load({ memoryId: 39 })` to retrieve full content
2. **Given** dashboard footer is displayed, **When** agent reads instructions, **Then** footer shows correct command syntax for LOAD and SEARCH

---

### User Story 3 - Token Budget Compliance (Priority: P1)

As a system administrator, I need the dashboard to stay within 500-1,000 tokens so that context injection doesn't impact agent performance.

**Why This Priority**: P1 because staying under budget is the key optimization goal.

**Independent Test**: Measure token count of generated dashboard with maximum memories (14 entries) and verify < 1,000 tokens.

**Acceptance Scenarios**:
1. **Given** maximum memories displayed (3 constitutional + 3 critical + 3 important + 5 recent), **When** dashboard is generated, **Then** total output is < 1,000 tokens
2. **Given** only title is used for summaries, **When** dashboard is generated, **Then** no separate summary field is queried or displayed

---

<!-- ANCHOR:requirements -->
## 4. FUNCTIONAL REQUIREMENTS

### Dashboard Format (Approved)

```
                       MEMORY CONTEXT

 CONSTITUTIONAL (Always Loaded)

  #39 | System Memory Testing
       Core memory system configuration and testing setup
       005-memory  memory, testing, continuation

 CRITICAL 

  #58 | Plugin Finalization                               1h ago
       Fixed SQL query bug and registered plugin in opencode.json
       005-memory  plugin, sql, registration

 RECENT

  #55 | SpecKit Testing                                   3h ago
       Validated spec folder creation and template workflow
       004-speckit  speckit, templates


Showing 5 of 47 memories
LOAD: memory_load({ memoryId: # })  SEARCH: memory_search("...")

```

### Requirements

- **REQ-FUNC-001:** System MUST query memories by importance tier (constitutional, critical, important, recent)
- **REQ-FUNC-002:** System MUST display memory ID, title, spec folder, and trigger phrases for each entry
- **REQ-FUNC-003:** System MUST show relative timestamps ("1h ago", "2d ago") for non-constitutional memories
- **REQ-FUNC-004:** System MUST hide empty sections (no "None" placeholders)
- **REQ-FUNC-005:** System MUST truncate trigger phrases to first 3-4 items
- **REQ-FUNC-006:** System MUST show stats line: "Showing X of Y memories"
- **REQ-FUNC-007:** System MUST show footer with LOAD and SEARCH command syntax
- **REQ-DATA-001:** System MUST use title field only for summary (no separate summary field)

### Memory Limits

| Tier | Max Displayed | Selection Criteria |
|------|---------------|-------------------|
| Constitutional | 3 | All (always shown) |
| Critical | 3 | Most recent |
| Important | 3 | Most recent |
| Recent | 5 | Most recent not already shown |
| **Total** | **14** | Maximum entries |

### Traceability Mapping

| User Story | Related Requirements | Notes |
|------------|---------------------|-------|
| Story 1 - Compact Context | REQ-FUNC-001, REQ-FUNC-004, REQ-DATA-001 | Core dashboard generation |
| Story 2 - Memory ID Discovery | REQ-FUNC-002, REQ-FUNC-007 | ID display and command syntax |
| Story 3 - Token Budget | REQ-FUNC-005, REQ-DATA-001 | Content truncation |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:requirements -->
## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Dashboard generation MUST complete in < 100ms
- **NFR-P02**: Database queries MUST use single efficient query (avoid N+1)
- **NFR-P03**: Total output MUST be < 1,000 tokens (target: 500-800)

### Reliability

- **NFR-R01**: Plugin MUST gracefully handle database connection failures
- **NFR-R02**: Plugin MUST return empty dashboard (not error) if no memories exist
- **NFR-R03**: Plugin MUST not block session start on query failures

### Maintainability

- **NFR-M01**: Memory limits MUST be configurable via constants
- **NFR-M02**: Dashboard format MUST be modular (separate format function)
- **NFR-M03**: Time formatting MUST be in dedicated helper function

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 6. EDGE CASES

### Data Boundaries
- What happens when no memories exist? → Show "No memories found" message
- What happens when only constitutional memories exist? → Show constitutional section only
- What happens when trigger phrases are empty? → Hide trigger line for that entry

### Error Scenarios
- What happens when database is locked? → Return empty dashboard, log warning
- What happens when database file doesn't exist? → Return empty dashboard, log info
- What happens when query times out? → Return empty dashboard after 5s timeout

### State Transitions
- What happens when memories are added mid-session? → Dashboard is generated once at session start (static)
- What happens when memory is deleted after dashboard shown? → Agent may get "not found" on load (acceptable)

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:success-criteria -->
## 7. SUCCESS CRITERIA

### Measurable Outcomes

- **SC-001**: Dashboard token count < 1,000 tokens with 14 memories
- **SC-002**: Dashboard generation time < 100ms
- **SC-003**: Zero errors in production for first 100 sessions
- **SC-004**: Agent can successfully load memories using displayed IDs

### KPI Targets

| Category | Metric | Target | Measurement Method |
|----------|--------|--------|-------------------|
| Performance | Token reduction | 75-90% | Compare before/after injection size |
| Quality | P0/P1 defects | 0 within 7 days | Manual testing |
| Usability | Memory load success rate | 100% | Test with displayed IDs |

<!-- /ANCHOR:success-criteria -->
---

## 8. DEPENDENCIES & RISKS

### Dependencies

| Dependency | Type | Owner | Status | Impact if Blocked |
|------------|------|-------|--------|-------------------|
| Semantic Memory SQLite DB | Internal | Memory System | Green | Cannot query memories |
| OpenCode Plugin System | Internal | OpenCode | Green | Cannot inject dashboard |

### Risk Assessment

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | Database schema changes break queries | High | Low | Pin to known schema version | Developer |
| R-002 | Token count exceeds budget | Med | Low | Test with max memories, add truncation | Developer |

### Rollback Plan

- **Rollback Trigger**: Dashboard causes session start failures or token budget exceeded by >50%
- **Rollback Procedure**:
  1. Comment out transform hook in plugin
  2. Restart OpenCode
  3. Verify sessions start normally
- **Verification**: Session starts without injected context

---

<!-- ANCHOR:scope -->
## 9. OUT OF SCOPE

**Explicit Exclusions**:

- MCP server modifications - uses existing query capabilities
- Database schema changes - works with current structure
- Real-time dashboard updates - static at session start
- Dashboard styling/colors - ASCII only
- Memory priority scoring changes - uses existing tier system

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None - all design decisions approved by user.

<!-- /ANCHOR:questions -->
---

## 11. APPENDIX

### Design Decisions (User Approved)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Summary source | Title only | Simpler, no separate summary field needed |
| Emojis | Keep emojis | Visual hierarchy aids scanning |
| Stats line | Include | Provides context on total available |
| Empty sections | Hide | Cleaner output, no "None" clutter |
| Token budget | 500-1000 | Balance between context and efficiency |

### References

- **Plugin Location**: `.opencode/plugin/semantic_memory_plugin/index.js`
- **Database Location**: `.opencode/skills/system-memory/database/memory-index.sqlite`
- **Related Spec**: `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/027-memory-plugin-and-refinement/001-memory-repo-analysis`

---

## 12. CHANGELOG

### Version History

#### v1.0 (2025-12-17)
**Initial specification** - Dashboard optimization with user-approved design

---

<!--
  SPEC TEMPLATE - REQUIREMENTS & USER STORIES
  - Defines WHAT needs to be built and WHY
  - User stories prioritized and independently testable
  - Requirements traceable to stories
  - Uses REQ-XXX identifiers for change tracking
-->
