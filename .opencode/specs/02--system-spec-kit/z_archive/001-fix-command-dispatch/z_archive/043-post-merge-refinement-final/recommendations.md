# Recommendations: Post-Merge Refinement Final

## Executive Summary

After analyzing 42 specs and verifying against current code:
- **39 unique issues** remain open
- **28+ issues** were already fixed (removed from list)
- **50+ issues** were duplicates (consolidated)

This document provides prioritized recommendations for resolving the remaining issues.

---

## Priority Definitions

| Priority | Definition | SLA |
|----------|------------|-----|
| **P0** | System broken, crashes, data loss risk | Fix immediately |
| **P1** | Degraded UX, confusion, features broken | Fix this sprint |
| **P2** | Quality issues, code smells, improvements | Fix when possible |
| **P3** | Polish, nice-to-have | Future backlog |

---

## P0 - Critical (8 issues) - MUST FIX

### P0-001: Duplicate getConstitutionalMemories Function
- **Impact:** Cache bypass, repeated DB queries
- **Fix:** Remove duplicate at vector-index.js:1111, keep cached version at :209
- **Effort:** 1 hour
- **Risk:** Low

### P0-002: Missing verifyIntegrityWithPaths Function
- **Impact:** Server startup crash
- **Fix:** Implement function or change call to verifyIntegrity()
- **Effort:** 1 hour
- **Risk:** Low

### P0-003: Missing cleanupOrphans Function
- **Impact:** Confusing error message, no cleanup capability
- **Fix:** Implement function or remove reference
- **Effort:** 1 hour
- **Risk:** Low

### P0-004: Column Mismatch (last_accessed)
- **Impact:** Access tracking silently fails
- **Fix:** Replace all last_accessed_at with last_accessed
- **Effort:** 1 hour
- **Risk:** Low

### P0-005: Missing related_memories Column
- **Impact:** Related memory feature completely broken
- **Fix:** Add migration for column
- **Effort:** 1 hour
- **Risk:** Medium (migration needed)

### P0-006: Missing validate-spec.sh
- **Impact:** Gate 6 cannot run, documentation references broken script
- **Fix:** Create script based on documented behavior
- **Effort:** 2 hours
- **Risk:** Medium (must match docs)

### P0-007: Missing recommend-level.sh
- **Impact:** Level recommendation feature broken
- **Fix:** Create script based on documented behavior
- **Effort:** 1 hour
- **Risk:** Low

### P0-008: MCP Tool Naming Mismatch
- **Impact:** Users get errors when following docs
- **Fix:** Update all documentation to use actual tool names
- **Effort:** 2 hours
- **Risk:** Low

---

## P1 - High (14 issues) - SHOULD FIX

### Documentation Alignment (8 items)

| ID | Issue | Fix | Effort |
|----|-------|-----|--------|
| P1-001 | Gate numbering (Gate 3 vs Gate 4) | Update SKILL.md to Gate 4 | 2h |
| P1-002 | Step count (13 vs 14) | Update complete.md to 14 | 0.5h |
| P1-003 | Level 1 requirements differ | Align AGENTS.md and SKILL.md | 1h |
| P1-008 | ALWAYS list numbering gap | Add missing item 15 | 0.5h |
| P1-009 | Scripts not documented | Add to SKILL.md Scripts section | 1h |
| P1-010 | Template missing from table | Add context_template.md | 0.5h |
| P1-011 | Terminology drift | Standardize to "Last/Next Action" | 1.5h |
| P1-013 | No /help command | Create command | 1h |

### Feature Fixes (6 items)

| ID | Issue | Fix | Effort |
|----|-------|-----|--------|
| P1-004 | includeContiguity broken | Wire parameter through | 1.5h |
| P1-005 | Trigger cache stale | Add clearCache() calls | 1h |
| P1-006 | LRU cache is FIFO | Track access time, fix eviction | 1.5h |
| P1-007 | impl-summary.md timing | Make conditional in validation | 1h |
| P1-012 | Embeddings lost on restore | Include in checkpoint | 2h |
| P1-014 | Namespace help missing | Create or document | 0.5h |

---

## P2 - Medium (12 issues) - CAN DEFER

### Recommended to Fix

| ID | Issue | Fix | Effort |
|----|-------|-----|--------|
| P2-001 | Missing indexes | Add 3 indexes | 1h |
| P2-004 | process.exit in lib | Throw errors instead | 1h |
| P2-007 | Document parity gap | Add to decision-record | 1h |

### Can Defer

| ID | Issue | Rationale for Deferral |
|----|-------|----------------------|
| P2-002 | Timestamp formats | Works, just inconsistent |
| P2-003 | JSONC edge case | Rare scenario |
| P2-005 | Regex strictness | Has fallback |
| P2-006 | Unicode checkmarks | Most common covered |
| P2-008 | Maintenance tax | Structural, needs design |
| P2-009 | Level 0 protocol | Feature request, not bug |

### Requires Separate Spec

| ID | Issue | Why Separate |
|----|-------|--------------|
| P2-010 | Unit tests | Needs test framework |
| P2-011 | Integration tests | Needs test framework |
| P2-012 | CI/CD pipeline | Needs infrastructure |

---

## Implementation Order

### Week 1: Critical + Docs
```
P0-001 → P0-002 → P0-003 → P0-004 → P0-005
    ↓
P0-006 → P0-007 → P0-008
    ↓
P1-001 → P1-002 → P1-003 (parallel)
```

### Week 2: Features
```
P1-004 → P1-005 → P1-006
    ↓
P1-007 (depends on P0-006)
    ↓
P1-012
```

### Week 3: Quality
```
P2-001 → P2-004 → P2-007
    ↓
Document deferred items
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| P0 resolved | 8/8 (100%) |
| P1 resolved | 14/14 (100%) |
| P2 resolved | ≥3/12 (≥25%) |
| Regressions | 0 |
| Documentation aligned | Yes |

---

## Deferred Items (for future specs)

1. **CI/CD Pipeline** - Requires infrastructure work
2. **Test Framework** - Unit + integration tests
3. **Level 0 Protocol** - Design needed for trivial changes
4. **Maintenance Tax** - Architecture redesign needed
