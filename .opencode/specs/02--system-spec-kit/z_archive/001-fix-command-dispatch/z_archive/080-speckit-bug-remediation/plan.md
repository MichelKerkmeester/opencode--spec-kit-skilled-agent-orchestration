---
title: "Plan: Spec Kit Bug Remediation [080-speckit-bug-remediation/plan]"
description: "Given the scope (30 bugs across 13 files), use parallel agent delegation with phased rollout"
trigger_phrases:
  - "plan"
  - "spec"
  - "kit"
  - "bug"
  - "remediation"
  - "080"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Plan: Spec Kit Bug Remediation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.0 -->

---

## 1. Implementation Strategy

### Approach: Phased Parallel Execution

Given the scope (30 bugs across 13 files), use **parallel agent delegation** with **phased rollout**:

- **Phase 1:** Critical/High bugs (11 bugs) - 5 parallel agents
- **Phase 2:** Medium bugs (9 bugs) - 3 parallel agents
- **Phase 3:** Low bugs + tests (10 bugs) - 2 parallel agents

### Execution Model

```
┌─────────────────────────────────────────────────────────────────┐
│                      PHASE 1 (Critical/High)                    │
├─────────────────────────────────────────────────────────────────┤
│  Agent 1          Agent 2          Agent 3          Agent 4    │
│  ─────────        ─────────        ─────────        ─────────  │
│  BUG-001          BUG-004          BUG-007          BUG-009    │
│  BUG-002          BUG-005          BUG-008          BUG-010    │
│  BUG-003          BUG-006                           BUG-011    │
│  (cognitive)      (handlers)       (scoring/        (parsing/  │
│                                    storage)         search)    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [Run full test suite]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      PHASE 2 (Medium)                           │
├─────────────────────────────────────────────────────────────────┤
│  Agent 5              Agent 6              Agent 7              │
│  ─────────            ─────────            ─────────            │
│  BUG-012              BUG-015              BUG-018              │
│  BUG-013              BUG-016              BUG-019              │
│  BUG-014              BUG-017              BUG-020              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [Run full test suite]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      PHASE 3 (Low + Tests)                      │
├─────────────────────────────────────────────────────────────────┤
│  Agent 8                          Agent 9                       │
│  ─────────                        ─────────                     │
│  BUG-021 to BUG-025               BUG-026 to BUG-030            │
│  + regression tests               + regression tests            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase 1 Tasks (Critical/High)

### Agent 1: Cognitive Module Fixes

| Bug | File | Fix |
|-----|------|-----|
| BUG-001 | `tier-classifier.js:86-87` | Update FSRS call: `scheduler.calculate_retrievability(memory.stability, elapsedDays)` |
| BUG-002 | `prediction-error-gate.js:24-25` | Change `LOW_MATCH: 0.50` (differentiate from MEDIUM) |
| BUG-003 | `tier-classifier.js:29-30` | Change `DORMANT: 0.02` (below COLD 0.05) |

**Verification:** Run `node tests/fsrs-scheduler.test.js`, verify FSRS actually executes

### Agent 2: Handler Fixes

| Bug | File | Fix |
|-----|------|-----|
| BUG-004 | `vector-index.js:2059-2124` | Add `keys()` and `delete(key)` methods to LRUCache |
| BUG-005 | `memory-crud.js:32,72` | Add `await check_database_updated();` to delete/update handlers |
| BUG-006 | `memory-save.js:94-141` | Wrap `reinforce_existing_memory` DB ops in try/catch |

**Verification:** Test granular cache invalidation, test concurrent operations

### Agent 3: Scoring/Storage Fixes

| Bug | File | Fix |
|-----|------|-----|
| BUG-007 | `composite-scoring.js:54-76` | Add `if (!last_review) return 0.5;` before calculation |
| BUG-008 | `checkpoints.js:678-743` | Replace manual backup with SAVEPOINT/ROLLBACK |

**Verification:** Test scoring with null timestamps, test checkpoint restore failure recovery

### Agent 4: Parsing/Search Fixes

| Bug | File | Fix |
|-----|------|-----|
| BUG-009 | `memory-parser.js:168` | Refactor YAML regex to line-by-line parsing |
| BUG-010 | `trigger-extractor.js:178-395` | Replace lazy quantifiers with bounded patterns |
| BUG-011 | `vector-index.js:1086-1091` | Add `console.warn()` to catch block |

**Verification:** Test with adversarial inputs, ensure no ReDoS

---

## 3. Phase 2 Tasks (Medium)

### Agent 5: Cache/Weight Consolidation

| Bug | File | Fix |
|-----|------|-----|
| BUG-012 | `vector-index.js:263-306` | Add `isLoading` flag to prevent thundering herd |
| BUG-013 | `composite-scoring.js`, `folder-scoring.js` | Import from `importance-tiers.js` (single source) |
| BUG-014 | `working-memory.js:289-290` | Add `isNaN()` check after parseFloat |

### Agent 6: Transaction/Validation Fixes

| Bug | File | Fix |
|-----|------|-----|
| BUG-015 | `co-activation.js:62-64` | Add `currentScore = Math.max(0, currentScore)` |
| BUG-016 | `vector-index.js:2464-2506` | Track failures, rollback entire transaction if any |
| BUG-017 | `search-results.js:171-177` | Capture `original_tokens` before content reassignment |

### Agent 7: Storage/Schema Fixes

| Bug | File | Fix |
|-----|------|-----|
| BUG-018 | `history.js:285-292` | Add `if (result.changes === 0) throw new Error(...)` |
| BUG-019 | `vector-index.js:323-411` | Wrap migration in `database.transaction()` |
| BUG-020 | `memory-parser.js:62` | Remove UTF-16 BE or use iconv-lite |

---

## 4. Phase 3 Tasks (Low + Tests)

### Agent 8: Low Bugs (BUG-021 to BUG-025)

```javascript
// BUG-021: Type coercion
const numeric_id = typeof id === 'string' ? parseInt(id, 10) : id;

// BUG-022: Validate concepts
for (const c of concepts) {
  if (typeof c !== 'string' || !c.trim()) throw new Error('Invalid concept');
}

// BUG-023: Sanitize errors
result.contentError = 'Failed to read file';  // Generic message

// BUG-024: Handle stability=0
const stability = memory.stability || 1.0;
if (stability <= 0) stability = 1.0;

// BUG-025: Use tolerance
if (Math.abs(new_score - memory.attention_score) > 0.001) { ... }
```

### Agent 9: Low Bugs (BUG-026 to BUG-030) + Test Coverage

```javascript
// BUG-026: Unicode word boundary
const regex = new RegExp(`(?:^|\\s|[^\\p{L}])${escapeRegex(phrase)}(?:\\s|[^\\p{L}]|$)`, 'iu');

// BUG-027: Symlink detection
if (entry.isSymbolicLink()) continue;  // Skip symlinks

// BUG-028: Division guard
if (counts.total === 0) return 'unknown';

// BUG-029: Generic fallback
return 'An unexpected error occurred';

// BUG-030: Add isError flag
return { content: [...], isError: false };
```

---

## 5. Test Requirements

### New Test Cases Required

| Bug | Test |
|-----|------|
| BUG-001 | Verify FSRS formula actually executes (not fallback) |
| BUG-002 | Test similarity=0.70 returns correct action |
| BUG-003 | Test retrievability=0.03 returns DORMANT |
| BUG-004 | Test `clear_search_cache('spec-folder')` doesn't throw |
| BUG-007 | Test scoring with all timestamps null |
| BUG-008 | Test checkpoint restore with simulated restore failure |
| BUG-009 | Test YAML parsing with malformed input (no hang) |
| BUG-010 | Test trigger extraction with adversarial strings |

### Regression Test Suite

```bash
# After each phase:
node tests/fsrs-scheduler.test.js
node tests/modularization.test.js
npm test
```

---

## 6. Rollback Plan

If any fix causes regressions:

1. `git stash` current changes
2. Run tests to confirm baseline
3. Apply fixes incrementally with tests after each
4. Identify problematic fix
5. Revert specific fix, document for investigation

---

## 7. Success Metrics

| Metric | Target |
|--------|--------|
| Critical bugs fixed | 3/3 |
| High bugs fixed | 8/8 |
| Medium bugs fixed | 9/9 |
| Low bugs fixed | 10/10 |
| Test suite passing | 634/634 + new tests |
| New regressions | 0 |

---

## 8. Timeline

| Phase | Bugs | Agents | Status |
|-------|------|--------|--------|
| Phase 1 | 11 Critical/High | 4 parallel | PENDING |
| Phase 2 | 9 Medium | 3 parallel | PENDING |
| Phase 3 | 10 Low + tests | 2 parallel | PENDING |

---

<!--
Plan created: 2026-01-28
Parallel execution: 9 agents across 3 phases
-->
