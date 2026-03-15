---
title: "Implementation Plan: Memory Plugin Dashboard Optimization - Technical Approach & Architecture [002-memory-plugin/plan]"
description: "Implementation plan for optimizing the semantic memory plugin to inject a compact dashboard instead of full memory content."
trigger_phrases:
  - "implementation"
  - "plan"
  - "memory"
  - "plugin"
  - "dashboard"
  - "002"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Memory Plugin Dashboard Optimization - Technical Approach & Architecture

Implementation plan for optimizing the semantic memory plugin to inject a compact dashboard instead of full memory content.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:summary -->
## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: memory-plugin, optimization, dashboard
- **Priority**: P1
- **Branch**: `015-memory-plugin-and-refinement`
- **Date**: 2025-12-17
- **Spec**: `002-memory-plugin/spec.md`

### Input
Feature specification from `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/027-memory-plugin-and-refinement/002-memory-plugin/spec.md`

### Summary
Refactor the semantic memory plugin to replace full content injection with a compact ASCII dashboard. The dashboard surfaces memory IDs for on-demand loading, reducing token consumption from ~2,000-5,000 to ~500-1,000 tokens while maintaining context visibility.

### Technical Context

- **Language/Version**: JavaScript (ES6+, Node.js compatible)
- **Primary Dependencies**: better-sqlite3 (existing)
- **Storage**: SQLite (`.opencode/skills/system-memory/database/memory-index.sqlite`)
- **Testing**: Manual verification + token counting
- **Target Platform**: OpenCode plugin system
- **Project Type**: Single file plugin enhancement
- **Performance Goals**: < 100ms dashboard generation, < 1,000 tokens output
- **Constraints**: Must work with existing database schema, no breaking changes

---

<!-- /ANCHOR:summary -->
## 2. QUALITY GATES

**GATE: Must pass before implementation.**

### Definition of Ready (DoR)
- [x] Problem statement clear; scope documented
- [x] Stakeholders identified; decisions path agreed
- [x] Constraints known; risks captured
- [x] Success criteria measurable

### Definition of Done (DoD)
- [x] All acceptance criteria met; tests passing
- [x] Docs updated (spec/plan/tasks)
- [x] Performance/error budgets respected
- [x] Rollback verified or not needed

### Rollback Guardrails
- **Stop Signals**: Session start failures, token budget exceeded by >50%
- **Recovery Procedure**: Comment out transform hook, restart OpenCode

---

## 3. PROJECT STRUCTURE

### Documentation (This Feature)

```
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/027-memory-plugin-and-refinement/002-memory-plugin
  spec.md              # Feature specification (this file's companion)
  plan.md              # This file
  scratch/             # Test queries, debug output (if needed)
  memory/              # Session context preservation
```

### Source Code (Files to Modify)

```
.opencode/plugin/semantic_memory_plugin/
  index.js             # Main plugin file - PRIMARY MODIFICATION TARGET
```

### File Change Summary

| File | Action | Description |
|------|--------|-------------|
| `index.js` | Modify | Add dashboard functions, update transform hook |

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Helper Functions (30 min)

- **Goal**: Create utility functions for time formatting and text truncation
- **Deliverables**:
  - `formatTimeAgo(timestamp)` - Returns "1h ago", "2d ago", "3w ago" format
  - `truncateTriggers(triggers, max)` - Limits array to first N items
- **Owner**: Developer
- **Duration**: 30 minutes

**Implementation Details:**

```javascript
// formatTimeAgo(timestamp) - Convert ISO timestamp to relative time
// Input: "2025-12-17T14:30:00Z"
// Output: "1h ago", "2d ago", "3w ago", "2mo ago"

// truncateTriggers(triggers, max = 4) - Limit trigger phrases
// Input: ["memory", "testing", "continuation", "setup", "config"]
// Output: "memory, testing, continuation, setup"
```

---

### Phase 2: Memory Query Function (45 min)

- **Goal**: Create `getMemoryIndex()` to query memories by tier
- **Deliverables**:
  - Function queries constitutional, critical, important, and recent memories
  - Returns structured object with memories by tier + total count
- **Owner**: Developer
- **Duration**: 45 minutes

**Implementation Details:**

```javascript
// getMemoryIndex(db) - Query memories for dashboard
// Returns: {
//   constitutional: [...],  // up to 3, all
//   critical: [...],        // up to 3, most recent
//   important: [...],       // up to 3, most recent
//   recent: [...],          // up to 5, most recent not in above
//   totalCount: number
// }

// SQL Strategy: Single query with UNION ALL for efficiency
// ORDER BY: importance_tier priority, then created_at DESC
// LIMIT: Apply per-tier limits in query
```

**Query Structure:**

```sql
-- Constitutional (all, up to 3)
SELECT id, title, trigger_phrases, spec_folder, created_at, 
       'constitutional' as tier
FROM memories 
WHERE importance_tier = 'constitutional'
ORDER BY created_at DESC
LIMIT 3

UNION ALL

-- Critical (most recent 3)
SELECT id, title, trigger_phrases, spec_folder, created_at,
       'critical' as tier
FROM memories
WHERE importance_tier = 'critical'
ORDER BY created_at DESC
LIMIT 3

-- ... similar for important and recent
```

---

### Phase 3: Dashboard Formatter (45 min)

- **Goal**: Create `formatMemoryDashboard()` to generate ASCII output
- **Deliverables**:
  - Function takes memory index object
  - Returns formatted ASCII string matching approved design
  - Handles empty sections (hides them)
- **Owner**: Developer
- **Duration**: 45 minutes

**Implementation Details:**

```javascript
// formatMemoryDashboard(memoryIndex) - Generate ASCII dashboard
// Input: { constitutional: [...], critical: [...], ... }
// Output: ASCII string matching approved format

// Format per memory entry:
//   #39 | System Memory Testing                           1h ago
//        Core memory system configuration...
//        005-memory  memory, testing, continuation

// Section headers:
// CONSTITUTIONAL (Always Loaded)
// CRITICAL
// IMPORTANT
// RECENT

// Footer:
// Showing X of Y memories
// LOAD: memory_load({ memoryId: # })  SEARCH: memory_search("...")
```

**Formatting Rules:**
- ID column: Right-aligned, 4 chars (`#39 `)
- Title: Left-aligned, max 50 chars, truncate with `...`
- Timestamp: Right-aligned, only for non-constitutional
- Trigger phrases: Comma-separated, max 4 items
- Empty sections: Omit entirely (no header, no content)

---

### Phase 4: Transform Hook Integration (30 min)

- **Goal**: Update `experimental.chat.system.transform` to use new dashboard
- **Deliverables**:
  - Replace current full-content injection with dashboard
  - Add configuration constants for limits
  - Handle errors gracefully
- **Owner**: Developer
- **Duration**: 30 minutes

**Implementation Details:**

```javascript
// Configuration constants (top of file)
const MEMORY_LIMITS = {
  constitutional: 3,
  critical: 3,
  important: 3,
  recent: 5
};

// Transform hook update
experimental: {
  chat: {
    system: {
      transform: (systemPrompt) => {
        try {
          const memoryIndex = getMemoryIndex(db);
          const dashboard = formatMemoryDashboard(memoryIndex);
          return systemPrompt + '\n\n' + dashboard;
        } catch (error) {
          console.warn('Memory dashboard generation failed:', error);
          return systemPrompt; // Graceful degradation
        }
      }
    }
  }
}
```

---

### Phase 5: Testing & Verification (30 min)

- **Goal**: Verify dashboard meets all acceptance criteria
- **Deliverables**:
  - Token count verification (< 1,000 with max memories)
  - Visual verification of output format
  - Error handling verification
- **Owner**: Developer
- **Duration**: 30 minutes

**Test Cases:**

| Test | Expected Result |
|------|-----------------|
| Full database (14+ memories) | Dashboard shows max 14, correct tiers |
| Empty database | "No memories found" message |
| Constitutional only | Only constitutional section shown |
| Mixed tiers with gaps | Empty tiers hidden |
| Database connection failure | Empty dashboard, no crash |
| Token count (max load) | < 1,000 tokens |

---

## 5. TESTING STRATEGY

### Manual Testing

1. **Format Verification**
   - Start new OpenCode session
   - Verify dashboard appears in system prompt
   - Verify format matches approved design

2. **Functional Verification**
   - Copy memory ID from dashboard
   - Run `memory_load({ memoryId: # })`
   - Verify correct memory loads

3. **Edge Case Verification**
   - Test with empty database
   - Test with only constitutional memories
   - Test with 50+ memories (verify limits work)

4. **Token Counting**
   - Copy dashboard output
   - Use token counter to verify < 1,000 tokens
   - Document actual token count

### Error Scenario Testing

- Rename database file, verify graceful failure
- Corrupt database, verify no crash
- Kill database connection mid-query

---

## 6. SUCCESS METRICS

### Functional Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Dashboard displays correctly | 100% | Visual verification |
| Memory load works with displayed IDs | 100% | Manual test |
| Empty sections hidden | 100% | Test with partial data |

### Performance Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Token count (max load) | < 1,000 | Token counter |
| Generation time | < 100ms | Console timing |
| Token reduction | 75-90% | Before/after comparison |

### Quality Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| P0/P1 bugs | 0 | 7-day monitoring |
| Session start failures | 0 | Error logs |

---

## 7. RISKS & MITIGATIONS

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | SQL query inefficient | Med | Low | Test with 100+ memories | Dev |
| R-002 | Token count exceeds budget | Med | Low | Add title truncation | Dev |
| R-003 | Database locked by MCP server | High | Low | Add query timeout | Dev |

### Rollback Plan

- **Rollback Trigger**: Session start failures, error rate > 1%
- **Rollback Procedure**:
  1. Open `.opencode/plugin/semantic_memory_plugin/index.js`
  2. Comment out `getMemoryIndex`, `formatMemoryDashboard` calls
  3. Restore previous transform hook logic (or return systemPrompt unchanged)
  4. Restart OpenCode
- **Verification**: Start new session, verify no dashboard (and no errors)

---

## 8. DEPENDENCIES

### Internal Dependencies

| Dependency | Type | Owner | Status | Impact if Blocked |
|------------|------|-------|--------|-------------------|
| SQLite database | Internal | Memory System | Green | Cannot query memories |
| OpenCode plugin API | Internal | OpenCode | Green | Cannot inject dashboard |
| better-sqlite3 | Internal | Existing | Green | Database access |

### External Dependencies

None - all dependencies are internal.

---

## 9. IMPLEMENTATION CHECKLIST

### Pre-Implementation
- [x] Read current `index.js` to understand existing structure
- [x] Verify database schema matches assumptions
- [x] Create backup of current plugin file

### Implementation
- [x] Add `formatTimeAgo()` helper function
- [x] Add `truncateTriggers()` helper function
- [x] Add `getMemoryIndex()` function with SQL query
- [x] Add `formatMemoryDashboard()` formatter
- [x] Update configuration constants
- [x] Update transform hook to use new functions

### Post-Implementation
- [x] Test with full database
- [x] Test with empty database
- [x] Test with partial tiers
- [x] Verify token count < 1,000
- [x] Verify memory load works with displayed IDs
- [x] Document actual token count in spec

---

## 10. REFERENCES

### Related Documents

- **Feature Specification**: See `spec.md` for requirements and user stories
- **Previous Analysis**: See `001-memory-repo-analysis/` for context

### Code References

- **Plugin Location**: `.opencode/plugin/semantic_memory_plugin/index.js`
- **Database Location**: `.opencode/skills/system-memory/database/memory-index.sqlite`
- **MCP Server**: `.opencode/skills/system-memory/src/server.js` (for schema reference)

---

## ESTIMATED TIMELINE

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 1: Helper Functions | 30 min | 30 min |
| Phase 2: Memory Query | 45 min | 1h 15min |
| Phase 3: Dashboard Formatter | 45 min | 2h |
| Phase 4: Transform Integration | 30 min | 2h 30min |
| Phase 5: Testing | 30 min | 3h |

**Total Estimated Time**: 3 hours

---

<!--
  PLAN TEMPLATE - TECHNICAL APPROACH
  - Defines HOW to build the feature
  - Phases with clear deliverables
  - Testing strategy aligned with acceptance criteria
-->
