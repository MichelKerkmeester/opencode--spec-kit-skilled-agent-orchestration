---
title: "Decision Record: Spec Kit Bug Remediation [080-speckit-bug-remediation/decision-record]"
description: "10 parallel Opus agents identified 45+ bugs across the Spec Kit MCP server. The bugs range from critical (data corruption risk) to low (code style). Fixing all bugs sequentially..."
trigger_phrases:
  - "decision"
  - "record"
  - "spec"
  - "kit"
  - "bug"
  - "decision record"
  - "080"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Spec Kit Bug Remediation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

## ADR-001: Phased Parallel Execution Strategy

### Context
10 parallel Opus agents identified 45+ bugs across the Spec Kit MCP server. The bugs range from critical (data corruption risk) to low (code style). Fixing all bugs sequentially would take excessive time and increase risk of merge conflicts.

### Decision
Use **phased parallel execution** with bug severity grouping:
- Phase 1: Critical/High (11 bugs) - 4 parallel agents
- Phase 2: Medium (9 bugs) - 3 parallel agents
- Phase 3: Low (10 bugs) - 2 parallel agents

### Rationale
1. **Risk isolation** - Critical bugs fixed first, verified before moving on
2. **Parallel efficiency** - Multiple agents work simultaneously on independent files
3. **Regression detection** - Full test suite run between phases catches issues early
4. **Rollback granularity** - Each phase can be reverted independently

### Consequences
- (+) Faster completion through parallelization
- (+) Early verification of critical fixes
- (-) Requires careful file assignment to avoid conflicts
- (-) More complex orchestration

---

## ADR-002: ReDoS Fix Strategy

### Context
Multiple regex patterns in parsing modules exhibit catastrophic backtracking:
- `memory-parser.js:168` - YAML multi-line trigger phrase extraction
- `trigger-extractor.js:178-395` - 4 patterns with lazy quantifiers

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| A. Refactor to line-by-line parsing | Eliminates ReDoS entirely | More code, different behavior |
| B. Use possessive quantifiers | Minimal code change | Not all JS engines support |
| C. Add timeout wrapper | Simple | Doesn't fix root cause |
| D. Replace with bounded greedy | Balanced approach | Requires careful testing |

### Decision
**Option A for YAML parsing, Option D for trigger extraction**

- YAML parsing: Line-by-line is more robust and readable
- Trigger extraction: Replace `{2,25}?` with `[a-z0-9][a-z0-9\s]{1,24}` (greedy, bounded)

### Rationale
YAML structure is line-oriented by design, so line-by-line parsing is natural. Trigger patterns need to stay as regex for performance, but bounded greedy eliminates backtracking.

---

## ADR-003: Tier Weight Consolidation

### Context
Three different files define tier weights with different values:
- `composite-scoring.js:84-94` - `[1.0, 1.0, 0.8, 0.5, 0.3, 0.0]`
- `folder-scoring.js:29-36` - `[1.0, 0.8, 0.6, 0.4, 0.2, 0.0]`
- `importance-tiers.js:12-58` - `[1.0, 1.0, 0.8, 0.5, 0.3, 0.1]`

### Decision
**Consolidate to `importance-tiers.js` as single source of truth**

All other modules should import `get_tier_value()` from importance-tiers.js.

### Rationale
1. Single source of truth prevents drift
2. `importance-tiers.js` already has the most complete implementation
3. Existing `get_tier_value()` function is well-documented

### Consequences
- (+) Consistent tier weights across all scoring
- (+) Easier maintenance
- (-) Slight behavior change for folder-scoring (needs verification)

---

## ADR-004: Checkpoint Restore Safety

### Context
`checkpoints.js:678-743` uses a manual backup pattern:
1. Copy existing data to backup
2. Delete existing data
3. Insert restored data
4. If error, restore from backup

If step 4 fails, data is permanently lost.

### Decision
**Replace with SQLite SAVEPOINT**

```javascript
database.exec('SAVEPOINT restore_working_memory');
try {
  // restore logic
  database.exec('RELEASE restore_working_memory');
} catch (err) {
  database.exec('ROLLBACK TO restore_working_memory');
  throw err;
}
```

### Rationale
1. SAVEPOINT is atomic at database level
2. Cannot have partial state
3. Simpler code, less error-prone
4. Standard SQLite pattern

---

## ADR-005: LRUCache Method Addition

### Context
`clear_search_cache(spec_folder)` calls `query_cache.keys()` and `query_cache.delete(key)`, but the custom LRUCache class doesn't implement these methods.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| A. Add methods to LRUCache | Direct fix | Custom implementation to maintain |
| B. Replace with npm lru-cache | Well-tested | Adds dependency |
| C. Change clear_search_cache logic | No class changes | More complex calling code |

### Decision
**Option A: Add `keys()` and `delete()` methods**

### Rationale
1. Minimal change surface
2. No new dependencies
3. Custom LRUCache is already working well
4. Methods are simple to implement

---

## ADR-006: FSRS Integration Fix

### Context
`tier-classifier.js:86-87` calls `scheduler.calculateRetrievability(memory)` but FSRS scheduler exports `calculate_retrievability(stability, elapsed_days)` - different function name and different signature.

### Decision
**Update call to match actual export**

```javascript
const elapsedDays = calculateElapsedDays(memory);
const retrievability = scheduler.calculate_retrievability(
  memory.stability || 1.0,
  elapsedDays
);
```

### Rationale
1. FSRS scheduler was recently implemented correctly
2. tier-classifier has outdated call
3. This enables the cognitive upgrade to actually work

---

## ADR-007: Threshold Differentiation

### Context
Two threshold bugs create confusing behavior:
- `prediction-error-gate.js`: MEDIUM_MATCH = LOW_MATCH = 0.70
- `tier-classifier.js`: COLD = DORMANT = 0.05

### Decision
**Differentiate thresholds with meaningful gaps**

| Constant | Old Value | New Value |
|----------|-----------|-----------|
| LOW_MATCH | 0.70 | 0.50 |
| DORMANT | 0.05 | 0.02 |

### Rationale
1. Creates distinct behavior zones
2. LOW_MATCH at 0.50 gives more room for MEDIUM_MATCH (0.70-0.90)
3. DORMANT at 0.02 means "nearly forgotten" vs COLD "fading"

---

## Summary

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Phased parallel execution | APPROVED |
| ADR-002 | Line-by-line YAML + bounded greedy | APPROVED |
| ADR-003 | Consolidate tier weights | APPROVED |
| ADR-004 | SAVEPOINT for checkpoint restore | APPROVED |
| ADR-005 | Add LRUCache methods | APPROVED |
| ADR-006 | Fix FSRS call signature | APPROVED |
| ADR-007 | Differentiate thresholds | APPROVED |

---

<!--
Decision record created: 2026-01-28
Total ADRs: 7
-->
