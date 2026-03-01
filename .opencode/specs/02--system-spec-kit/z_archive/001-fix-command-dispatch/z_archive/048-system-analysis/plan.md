---
title: "Implementation Plan: SpecKit & Memory System Remediation [048-system-analysis/plan]"
description: "This plan addresses 35 verified issues identified in the system analysis, organized into 9 work streams across 4 phases. The approach prioritizes critical bug fixes first, follo..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "speckit"
  - "memory"
  - "system"
  - "048"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: SpecKit & Memory System Remediation

> **Spec**: 048-system-analysis
> **Level**: 3
> **Created**: 2025-12-30

---

## Executive Summary

This plan addresses **35 verified issues** identified in the system analysis, organized into **9 work streams** across **4 phases**. The approach prioritizes critical bug fixes first, followed by alignment and improvements.

> **Note**: 7 false positives were removed after verification (BUG-M2, BUG-M5, BUG-L1, BUG-L4, BUG-L5, BUG-L7, ALIGN-5).

---

## Phase Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Critical Fixes                                     [1 day]    │
│ ├── WS1: MCP Server Core (P0 items only)                               │
│ └── WS2: Scripts (P0 items only)                                       │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: Medium Fixes + Alignment                           [2-3 days] │
│ ├── WS1: MCP Server Core (remaining)                                   │
│ ├── WS2: Scripts (remaining)                                           │
│ ├── WS3: Trigger & Search                                              │
│ ├── WS4: Commands & Assets                                             │
│ └── WS8: Security & Config                                             │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: Low Fixes + UX                                     [2-3 days] │
│ ├── WS5: Documentation Alignment                                       │
│ ├── WS6: Memory Files & Anchors                                        │
│ ├── WS7: MCP Operations                                                │
│ └── WS9: UX Improvements                                               │
├─────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: Technical Debt                                     [Ongoing]  │
│ └── Performance optimizations, prepared statements, etc.               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Critical Fixes (Day 1)

### Objective
Fix all HIGH severity bugs and the critical tier filtering bug to establish a stable baseline.

### Work Stream 1: MCP Server Core (P0)

| Task ID | Bug ID | Description | File | Est. |
|---------|--------|-------------|------|------|
| T-WS1-001 | BUG-H1 | Add null check to `getFailedEmbeddings()` | `retry-manager.js:104-112` | 15m |
| T-WS1-002 | BUG-H2 | Add null check to `getRetryStats()` | `retry-manager.js:121-131` | 15m |

**Implementation Notes:**
```javascript
// T-WS1-001, T-WS1-002: Add at function start
function getFailedEmbeddings() {
  if (!db) {
    console.warn('Database not initialized');
    return [];
  }
  // existing code...
}
```

### Work Stream 2: Scripts (P0)

| Task ID | Bug ID | Description | File | Est. |
|---------|--------|-------------|------|------|
| T-WS2-001 | BUG-H3 | Fix `tempPath` scope in catch block | `generate-context.js:2727` | 30m |
| T-WS2-002 | BUG-H4 | Add `implementation-summary.md` to Level 1 | `validate-spec-folder.js` | 30m |

**Implementation Notes:**
```javascript
// T-WS2-001: Move tempPath declaration outside try block
let tempPath;
try {
  tempPath = filePath + '.tmp';
  // ... write operations
} catch (err) {
  if (tempPath) {
    await fs.unlink(tempPath).catch(() => {});
  }
  throw err;
}
```

### Phase 1 Deliverables
- [ ] All 4 P0 tasks completed
- [ ] Unit tests pass
- [ ] Git commit with "fix: P0 critical bugs"

---

## Phase 2: Medium Fixes + Alignment (Days 2-4)

### Objective
Fix remaining MEDIUM severity bugs, add input validation, and begin documentation alignment.

### Work Stream 1: MCP Server Core (Remaining)

| Task ID | Bug ID | Description | File | Est. |
|---------|--------|-------------|------|------|
| T-WS1-004 | BUG-M3 | Add input validation to `init()` | `hybrid-search.js:20-23` | 30m |
| T-WS1-005 | BUG-L10 | Increase constitutional cache TTL to 5min | `vector-index.js:205` | 15m |
| T-WS1-006 | PERF-1 | Implement prepared statement caching | `vector-index.js` | 2h |

### Work Stream 2: Scripts (Remaining)

| Task ID | Bug ID | Description | File | Est. |
|---------|--------|-------------|------|------|
| T-WS2-003 | BUG-M1 | Fix Date parsing with ISO timestamps | `generate-context.js:4131` | 1h |
| T-WS2-004 | BUG-M6 | Add try/catch to cleanup script | `cleanup-orphaned-vectors.js` | 30m |
| T-WS2-005 | PERF-2 | Extract `formatAgeString()` to utility | `vector-index.js` | 30m |

### Work Stream 3: Trigger & Search

| Task ID | Bug ID | Description | File | Est. |
|---------|--------|-------------|------|------|
| T-WS3-001 | PERF-3 | Use string includes for simple phrases | `trigger-matcher.js` | 30m |

### Work Stream 4: Commands & Assets

| Task ID | Bug ID | Description | File | Est. |
|---------|--------|-------------|------|------|
| T-WS4-001 | BUG-M4 | Create debug command YAML assets | `.opencode/command/spec_kit/assets/` | 1h |

### Work Stream 8: Security & Config

| Task ID | Bug ID | Description | File | Est. |
|---------|--------|-------------|------|------|
| T-WS8-001 | SEC-3 | Create `.env.example` | `.env.example` | 30m |
| T-WS8-002 | SEC-4 | Add checkpoint name validation | `checkpoints.js` | 30m |
| T-WS8-003 | BUG-L11 | Update search-weights.json version | `search-weights.json` | 5m |

### Phase 2 Deliverables
- [ ] All 11 P1 tasks completed
- [ ] Integration tests pass
- [ ] Performance benchmarks recorded
- [ ] Git commit with "fix: P1 medium severity bugs"

---

## Phase 3: Low Fixes + UX (Days 5-7)

### Objective
Address all LOW severity bugs, complete documentation alignment, and implement UX improvements.

### Work Stream 5: Documentation Alignment

| Task ID | Bug ID | Description | File | Est. |
|---------|--------|-------------|------|------|
| T-WS5-001 | BUG-L2 | Document 10 undocumented scripts | `SKILL.md` | 1h |
| T-WS5-002 | BUG-L3 | Remove cross-template dependency | `templates/spec.md` | 15m |
| T-WS5-003 | BUG-L12 | Update .gitignore path | `.gitignore` | 5m |
| T-WS5-004 | ALIGN-1 | Fix quick_reference.md template count | `quick_reference.md` | 15m |
| T-WS5-005 | ALIGN-2 | Sync tier weights in documentation | `memory_system.md` | 30m |
| T-WS5-006 | ALIGN-3 | Document re-embedding behavior | `memory_system.md` | 15m |
| T-WS5-007 | ALIGN-4 | Clarify deprecated tier behavior | `memory_system.md` | 15m |
| T-WS5-008 | ALIGN-6 | Document rate limiting | `memory_system.md` | 15m |
| T-WS5-009 | ALIGN-7 | Clarify spec folder filter behavior | `memory_system.md` | 15m |
| T-WS5-010 | ALIGN-8 | Fix Gate 2/3 terminology | `skill_advisor.py` | 15m |
| T-WS5-011 | ALIGN-9 | Standardize mode terminology | `SKILL.md`, `AGENTS.md` | 30m |

### Work Stream 6: Memory Files & Anchors

| Task ID | Bug ID | Description | File | Est. |
|---------|--------|-------------|------|------|
| T-WS6-001 | BUG-L8 | Fix legacy memory file anchors | Various memory files | 1h |
| T-WS6-002 | BUG-L9 | Fix e2e-test-memory.md anchor | `e2e-test-memory.md` | 15m |

### Work Stream 7: MCP Operations

| Task ID | Bug ID | Description | File | Est. |
|---------|--------|-------------|------|------|
| T-WS7-001 | BUG-L6 | Validate id is positive integer | `context-server.js` | 15m |

### Work Stream 9: UX Improvements

| Task ID | Issue | Description | File | Est. |
|---------|-------|-------------|------|------|
| T-WS9-001 | IMP-1 | Create 5-minute Quick Start guide | `QUICK_START.md` | 2h |
| T-WS9-002 | IMP-2 | Add progress indicators | `generate-context.js` | 1h |
| T-WS9-003 | IMP-3 | Auto-suggest handover detection | `SKILL.md` | 30m |
| T-WS9-004 | PERF-4 | Async file reads in formatSearchResults | `context-server.js` | 1h |

### Phase 3 Deliverables
- [ ] All 20 P2 tasks completed
- [ ] Full regression test pass
- [ ] Documentation review complete
- [ ] Git commit with "fix: P2 low severity bugs and UX improvements"

---

## Phase 4: Technical Debt (Ongoing)

### Objective
Address remaining technical debt items as capacity allows.

| Task ID | Description | Priority |
|---------|-------------|----------|
| T-TD-001 | Create test fixtures for validation | P3 |
| T-TD-002 | Add Unicode normalization to trigger matching | P3 |
| T-TD-003 | Implement constitutional directory scanning | P3 |
| T-TD-004 | Add portable paths to configs | P3 |
| T-TD-005 | Complete or deprecate JS validators | P3 |

---

## Rollback Strategy

### Per-Phase Rollback

| Phase | Rollback Command | Impact |
|-------|------------------|--------|
| Phase 1 | `git revert HEAD~1` | Restores pre-P0 state |
| Phase 2 | `git revert HEAD~2` | Restores post-P0 state |
| Phase 3 | `git revert HEAD~3` | Restores post-P1 state |

### Database Rollback
```bash
# Before any changes, backup database
cp .opencode/skill/system-spec-kit/database/context-index.sqlite \
   .opencode/skill/system-spec-kit/database/context-index.sqlite.backup

# To restore
cp .opencode/skill/system-spec-kit/database/context-index.sqlite.backup \
   .opencode/skill/system-spec-kit/database/context-index.sqlite
```

---

## Parallel Work Opportunities

The following work streams can be executed in parallel:

| Parallel Group | Work Streams | Notes |
|----------------|--------------|-------|
| Group A | WS1, WS2 | Both in Phase 1, different files |
| Group B | WS3, WS4, WS8 | All in Phase 2, no dependencies |
| Group C | WS5, WS6, WS7, WS9 | All in Phase 3, documentation-focused |

---

## Verification Checkpoints

| Checkpoint | After Phase | Verification |
|------------|-------------|--------------|
| CP-1 | Phase 1 | All P0 tests pass, tier filtering works |
| CP-2 | Phase 2 | All P1 tests pass, no regressions |
| CP-3 | Phase 3 | Full test suite, documentation review |
| CP-4 | Phase 4 | Technical debt items as completed |

---

## Success Metrics

| Metric | Before | Target | Measured By |
|--------|--------|--------|-------------|
| HIGH bugs | 4 | 0 | Checklist |
| MEDIUM bugs | 4 | 0 | Checklist |
| LOW bugs | 8 | 0 | Checklist |
| Alignment issues | 10 | 0 | Doc review |
| Crashes on null db | Yes | No | Unit tests |
| Tier filtering | Broken | Working | Integration test |
