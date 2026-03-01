---
title: "Spec: Spec Kit Bug Remediation [080-speckit-bug-remediation/spec]"
description: "Comprehensive audit by 10 parallel Opus agents identified 45+ bugs across the Spec Kit MCP server codebase. Issues range from critical data corruption risks to ReDoS vulnerabili..."
trigger_phrases:
  - "spec"
  - "kit"
  - "bug"
  - "remediation"
  - "080"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Spec: Spec Kit Bug Remediation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.0 -->

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Spec ID** | 080 |
| **Title** | Spec Kit Bug Remediation |
| **Status** | DRAFT |
| **Priority** | P0 - Critical |
| **Complexity** | 85/100 |
| **Estimated LOC** | ~500 |
| **Level** | 3+ (Multi-agent, comprehensive) |

### Problem Statement

Comprehensive audit by 10 parallel Opus agents identified **45+ bugs** across the Spec Kit MCP server codebase. Issues range from critical data corruption risks to ReDoS vulnerabilities and logic errors that affect memory ranking, caching, and cognitive algorithms.

### Success Criteria

- [ ] All HIGH/CRITICAL bugs fixed and verified
- [ ] All MEDIUM bugs fixed or documented for deferral
- [ ] Test coverage added for fixed bugs
- [ ] No regressions in existing 634 tests
- [ ] Security audit confirms no new vulnerabilities

---

## 2. Scope

### In Scope

| Category | Files | Bug Count |
|----------|-------|-----------|
| Search/Caching | `lib/search/vector-index.js` | 4 |
| Handlers | `handlers/memory-*.js` | 8 |
| Cognitive | `lib/cognitive/*.js` | 9 |
| Scoring | `lib/scoring/*.js` | 9 |
| Storage | `lib/storage/*.js` | 6 |
| Parsing | `lib/parsing/*.js`, `shared/*.js` | 10 |
| Formatters | `formatters/*.js` | 6 |

### Out of Scope

- Scripts directory (passed audit - 54/54 OK)
- Security vulnerabilities (audit found codebase well-protected)
- Performance optimizations (unless directly related to bugs)
- New features

---

## 3. Bug Registry

### 3.1 CRITICAL Bugs (P0 - Must Fix)

#### BUG-001: FSRS Function Signature Mismatch
- **File:** `lib/cognitive/tier-classifier.js:86-87`
- **Issue:** Calls `scheduler.calculateRetrievability(memory)` but FSRS exports `calculate_retrievability(stability, elapsed_days)` with different signature
- **Impact:** FSRS never executes, always falls back to legacy exponential decay
- **Fix:** Update call to match actual function signature

#### BUG-002: Duplicate Threshold Values
- **File:** `lib/cognitive/prediction-error-gate.js:24-25`
- **Issue:** `MEDIUM_MATCH: 0.70` and `LOW_MATCH: 0.70` are identical
- **Impact:** Threshold boundary confusion, unreachable code paths
- **Fix:** Differentiate thresholds (e.g., LOW_MATCH: 0.50)

#### BUG-003: Duplicate Tier Thresholds
- **File:** `lib/cognitive/tier-classifier.js:29-30`
- **Issue:** `COLD: 0.05` and `DORMANT: 0.05` are identical
- **Impact:** DORMANT state never assigned for R=0.05
- **Fix:** Set DORMANT < COLD (e.g., DORMANT: 0.02)

---

### 3.2 HIGH Bugs (P1 - Fix This Sprint)

#### BUG-004: LRUCache Missing Methods
- **File:** `lib/search/vector-index.js:2236`
- **Issue:** `query_cache.keys()` called but LRUCache class doesn't implement `keys()` method
- **Impact:** Runtime error - granular cache invalidation completely broken
- **Fix:** Add `keys()` and `delete()` methods to LRUCache class

#### BUG-005: Missing await on check_database_updated
- **File:** `handlers/memory-crud.js:32, 72`
- **Issue:** `handle_memory_delete` and `handle_memory_update` don't await database check
- **Impact:** Race condition - operations on stale database state
- **Fix:** Add `await check_database_updated();` at function start

#### BUG-006: Unhandled Promise Rejection in PE Reinforcement
- **File:** `handlers/memory-save.js:94-141`
- **Issue:** `reinforce_existing_memory` has no try/catch around database operations
- **Impact:** Unhandled errors could crash server or corrupt state
- **Fix:** Wrap database operations in try/catch

#### BUG-007: NaN Propagation in Composite Scoring
- **File:** `lib/scoring/composite-scoring.js:54-76`
- **Issue:** When all timestamps undefined, `calculate_retrievability_score` returns NaN
- **Impact:** NaN propagates to composite score, breaks sorting entirely
- **Fix:** Add fallback: `if (!last_review) return 0.5;`

#### BUG-008: Silent Data Loss in Working Memory Restore
- **File:** `lib/storage/checkpoints.js:678-743`
- **Issue:** If backup restore fails after deletion, data is permanently lost
- **Impact:** Checkpoint restore can silently lose working memory
- **Fix:** Use SAVEPOINT/ROLLBACK instead of manual backup pattern

#### BUG-009: ReDoS in YAML Multi-line Regex
- **File:** `lib/parsing/memory-parser.js:168`
- **Issue:** Nested quantifiers in trigger phrase regex cause exponential backtracking
- **Impact:** Malformed YAML can hang the parser
- **Fix:** Refactor to non-backtracking pattern or use line-by-line parsing

#### BUG-010: ReDoS in Trigger Extractor (4 patterns)
- **Files:** `shared/trigger-extractor.js:178-183, 313-318, 395`
- **Issue:** `[a-z0-9\s]{2,25}?` with lazy quantifier causes catastrophic backtracking
- **Impact:** Adversarial input can cause DoS
- **Fix:** Use possessive quantifiers or atomic groups

#### BUG-011: Error Silently Swallowed in delete_memory
- **File:** `lib/search/vector-index.js:1086-1091`
- **Issue:** Vector deletion errors caught but not logged
- **Impact:** Silent failures make debugging impossible
- **Fix:** Add `console.warn()` matching `delete_memories()` pattern

---

### 3.3 MEDIUM Bugs (P2 - Fix Soon)

#### BUG-012: Cache Race Condition (Thundering Herd)
- **File:** `lib/search/vector-index.js:263-306`
- **Issue:** Multiple concurrent calls can all query DB when cache expires
- **Impact:** Unnecessary database load under concurrent access
- **Fix:** Add mutex or "loading" flag

#### BUG-013: Inconsistent Tier Weights
- **Files:** `composite-scoring.js:84-94`, `folder-scoring.js:29-36`, `importance-tiers.js:12-58`
- **Issue:** Three different weight scales for same concept
- **Impact:** Ranking inconsistencies between modules
- **Fix:** Consolidate to single source of truth

#### BUG-014: NaN from Invalid Environment Variables
- **File:** `lib/cognitive/working-memory.js:289-290`
- **Issue:** `parseFloat(process.env.HOT_THRESHOLD)` can return NaN for non-numeric strings
- **Impact:** All scores classify as COLD
- **Fix:** Validate parsed thresholds with `isNaN()` check

#### BUG-015: Negative Score Not Clamped in boost_score
- **File:** `lib/cognitive/co-activation.js:62-64`
- **Issue:** Negative currentScore not clamped before boost
- **Impact:** Invalid negative attention scores possible
- **Fix:** Add `Math.max(0, currentScore)` before boost

#### BUG-016: Partial Transaction Commits on Failure
- **File:** `lib/search/vector-index.js:2464-2506`
- **Issue:** Transaction continues after individual failures, commits partial state
- **Impact:** Inconsistent database state on partial failures
- **Fix:** Track failures and rollback if any occur

#### BUG-017: Token Metrics Use Warning Content
- **File:** `formatters/search-results.js:171-177`
- **Issue:** `originalTokens` calculated from warning message, not original content
- **Impact:** Misleading token metrics when anchors not found
- **Fix:** Capture original tokens before overwriting content

#### BUG-018: undo_last_change Doesn't Check Result
- **File:** `lib/storage/history.js:221-317`
- **Issue:** UPDATE after DELETE undo doesn't verify `changes > 0`
- **Impact:** Silent failure if memory was hard-deleted
- **Fix:** Check result.changes and throw if 0

#### BUG-019: Schema Migration Not Transactional
- **File:** `lib/search/vector-index.js:323-411, 502-667`
- **Issue:** ALTER TABLE statements not wrapped in transaction
- **Impact:** Partial migration can corrupt schema
- **Fix:** Wrap migration sequences in transactions

#### BUG-020: UTF-16 BE Encoding Not Supported
- **File:** `lib/parsing/memory-parser.js:62`
- **Issue:** Node.js Buffer doesn't support `'utf16be'` encoding
- **Impact:** Runtime error on UTF-16 BE files
- **Fix:** Use `iconv-lite` or remove unsupported encoding

---

### 3.4 LOW Bugs (P3 - Fix When Convenient)

| ID | File | Issue |
|----|------|-------|
| BUG-021 | `memory-crud.js:33` | Type coercion for id parameter |
| BUG-022 | `memory-search.js:204-217` | No validation for concepts array elements |
| BUG-023 | `search-results.js:185-187` | Error messages leak internal details |
| BUG-024 | `attention-decay.js:147` | Default stability=0 not handled |
| BUG-025 | `attention-decay.js:241-243` | Floating point comparison without tolerance |
| BUG-026 | `trigger-matcher.js:81` | `\b` word boundary fails for non-ASCII |
| BUG-027 | `memory-parser.js:409-443` | Symlink loops not detected |
| BUG-028 | `entity-scope.js:69-80` | Division by zero possible |
| BUG-029 | `lib/errors.js:74-89` | Falls through to raw error message |
| BUG-030 | `search-results.js:93-107` | Missing `isError: false` flag |

---

## 4. Technical Approach

### Phase 1: Critical/High Bugs (BUG-001 to BUG-011)
1. Fix FSRS integration (BUG-001)
2. Fix threshold duplicates (BUG-002, BUG-003)
3. Add LRUCache methods (BUG-004)
4. Add missing awaits (BUG-005)
5. Add error handling (BUG-006, BUG-011)
6. Fix NaN propagation (BUG-007)
7. Fix checkpoint restore (BUG-008)
8. Refactor ReDoS patterns (BUG-009, BUG-010)

### Phase 2: Medium Bugs (BUG-012 to BUG-020)
- Consolidate tier weights
- Add cache mutex
- Add input validation
- Fix transaction handling

### Phase 3: Low Bugs + Test Coverage
- Fix remaining LOW bugs
- Add regression tests for each fix
- Run full test suite

---

## 5. Files to Modify

| File | Changes |
|------|---------|
| `lib/cognitive/tier-classifier.js` | Fix FSRS call signature, fix COLD/DORMANT thresholds |
| `lib/cognitive/prediction-error-gate.js` | Fix MEDIUM/LOW thresholds |
| `lib/search/vector-index.js` | Add LRUCache methods, add logging, fix transaction |
| `handlers/memory-crud.js` | Add await, add type validation |
| `handlers/memory-save.js` | Add try/catch to reinforce_existing_memory |
| `lib/scoring/composite-scoring.js` | Fix NaN, consolidate tier weights |
| `lib/storage/checkpoints.js` | Use SAVEPOINT for restore |
| `lib/parsing/memory-parser.js` | Fix ReDoS, fix UTF-16 |
| `shared/trigger-extractor.js` | Fix ReDoS patterns |
| `formatters/search-results.js` | Fix token metrics |
| `lib/storage/history.js` | Check undo result |
| `lib/cognitive/working-memory.js` | Validate env vars |
| `lib/cognitive/co-activation.js` | Clamp negative scores |

---

## 6. Dependencies

- **Upstream:** COGNITIVE-079 (recently completed cognitive upgrade)
- **Downstream:** None
- **External:** None

---

## 7. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Regression in existing tests | High | Run full 634-test suite after each fix |
| Breaking changes to API | Medium | Maintain backward compatibility |
| ReDoS fixes change extraction behavior | Medium | Add test cases for edge cases |

---

## 8. References

- Audit Agent 1: Tests directory (10/12 files with issues)
- Audit Agent 2: Cognitive algorithms (9 bugs found)
- Audit Agent 3: Search module (19 issues)
- Audit Agent 4: Storage module (18 bugs)
- Audit Agent 5: Scoring module (9 bugs)
- Audit Agent 6: Handlers (19 bugs)
- Audit Agent 7: Security audit (PASS - well protected)
- Audit Agent 8: Parsing module (20 bugs)
- Audit Agent 9: Formatters (12 bugs)
- Audit Agent 10: Scripts directory (PASS - 54/54 OK)

---

<!--
Spec created: 2026-01-28
Audit source: 10 parallel Opus agents
Total bugs identified: 45+
-->
