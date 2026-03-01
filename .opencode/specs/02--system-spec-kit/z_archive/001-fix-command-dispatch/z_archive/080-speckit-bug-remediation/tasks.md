---
title: "Tasks: Spec Kit Bug Remediation [080-speckit-bug-remediation/tasks]"
description: "Assigned Bugs: BUG-001, BUG-002, BUG-003"
trigger_phrases:
  - "tasks"
  - "spec"
  - "kit"
  - "bug"
  - "remediation"
  - "080"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Spec Kit Bug Remediation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.0 -->

---

## Task Overview

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1 | 4 parallel agents | PENDING |
| Phase 2 | 3 parallel agents | PENDING |
| Phase 3 | 2 parallel agents | PENDING |
| Verification | Test suite | PENDING |

---

## Phase 1 Tasks

### TASK-001: Cognitive Module Fixes (Agent 1)

**Assigned Bugs:** BUG-001, BUG-002, BUG-003

**Instructions:**
```
Fix cognitive algorithm bugs in lib/cognitive/:

1. tier-classifier.js:86-87
   - Change: scheduler.calculateRetrievability(memory)
   - To: scheduler.calculate_retrievability(memory.stability || 1.0, elapsedDays)
   - Add: const elapsedDays = calculateElapsedDays(memory);

2. prediction-error-gate.js:24-25
   - Change: LOW_MATCH: 0.70
   - To: LOW_MATCH: 0.50

3. tier-classifier.js:29-30
   - Change: DORMANT: 0.05
   - To: DORMANT: 0.02

Verify: node tests/fsrs-scheduler.test.js passes
```

**Status:** [ ] PENDING

---

### TASK-002: Handler/Cache Fixes (Agent 2)

**Assigned Bugs:** BUG-004, BUG-005, BUG-006

**Instructions:**
```
Fix handler and cache bugs:

1. vector-index.js - Add to LRUCache class (around line 2059):
   keys() {
     return this.cache.keys();
   }

   delete(key) {
     const node = this.cache.get(key);
     if (node) {
       this._remove(node);
       this.cache.delete(key);
       return true;
     }
     return false;
   }

2. memory-crud.js:32 - Add at start of handle_memory_delete:
   await check_database_updated();

3. memory-crud.js:72 - Add at start of handle_memory_update:
   await check_database_updated();

4. memory-save.js:94-141 - Wrap reinforce_existing_memory DB ops:
   try {
     database.prepare(...).run(...);
   } catch (err) {
     console.error('[memory-save] PE reinforcement failed:', err.message);
     return { success: false, error: err.message };
   }

Verify: Test cache operations and concurrent saves
```

**Status:** [ ] PENDING

---

### TASK-003: Scoring/Storage Fixes (Agent 3)

**Assigned Bugs:** BUG-007, BUG-008

**Instructions:**
```
Fix scoring and storage bugs:

1. composite-scoring.js:54-76 - Add at line 59:
   const last_review = row.last_review || row.updated_at || row.created_at;
   if (!last_review) {
     return 0.5; // Neutral score when no timestamp
   }

2. checkpoints.js:678-743 - Replace backup pattern with SAVEPOINT:
   database.exec('SAVEPOINT restore_working_memory');
   try {
     // existing restore logic
     database.exec('RELEASE restore_working_memory');
   } catch (err) {
     database.exec('ROLLBACK TO restore_working_memory');
     throw err;
   }

Verify: Test scoring with null timestamps, test restore failure
```

**Status:** [ ] PENDING

---

### TASK-004: Parsing/Search Fixes (Agent 4)

**Assigned Bugs:** BUG-009, BUG-010, BUG-011

**Instructions:**
```
Fix parsing and search bugs:

1. memory-parser.js:168 - Replace ReDoS regex with line-by-line:
   // Instead of single complex regex, parse YAML line by line
   const lines = content.split('\n');
   let in_trigger_block = false;
   const phrases = [];
   for (const line of lines) {
     if (/^\s*(?:trigger_phrases|triggerPhrases):\s*$/i.test(line)) {
       in_trigger_block = true;
       continue;
     }
     if (in_trigger_block) {
       if (/^\s*-\s*["']?(.+?)["']?\s*$/.test(line)) {
         phrases.push(RegExp.$1);
       } else if (!/^\s*$/.test(line) && !/^\s*#/.test(line)) {
         break; // End of block
       }
     }
   }

2. trigger-extractor.js - Replace lazy quantifiers:
   - Change: [a-z0-9\s]{2,25}?
   - To: [a-z0-9][a-z0-9\s]{1,24}  (greedy, bounded)

3. vector-index.js:1089 - Add logging:
   } catch (e) {
     console.warn(`[vector-index] Vector deletion failed for id ${id}: ${e.message}`);
   }

Verify: Test with adversarial inputs, check no hangs
```

**Status:** [ ] PENDING

---

## Phase 2 Tasks

### TASK-005: Cache/Weight Consolidation (Agent 5)

**Assigned Bugs:** BUG-012, BUG-013, BUG-014

**Instructions:**
```
1. vector-index.js:263-306 - Add loading flag:
   let constitutional_cache_loading = false;

   function get_constitutional_memories(...) {
     if (constitutional_cache_loading) {
       // Wait or return stale cache
       return cached?.data || [];
     }
     if (cache miss) {
       constitutional_cache_loading = true;
       try {
         // query DB
       } finally {
         constitutional_cache_loading = false;
       }
     }
   }

2. composite-scoring.js:84-94 - Replace with import:
   const { get_tier_value } = require('./importance-tiers');
   function get_tier_boost(tier) {
     return get_tier_value(tier);
   }

3. working-memory.js:289-290 - Add validation:
   const hot = parseFloat(process.env.HOT_THRESHOLD || '0.8');
   const HOT_THRESHOLD = isNaN(hot) ? 0.8 : hot;
```

**Status:** [ ] PENDING

---

### TASK-006: Transaction/Validation Fixes (Agent 6)

**Assigned Bugs:** BUG-015, BUG-016, BUG-017

**Instructions:**
```
1. co-activation.js:62-64 - Clamp negative:
   function boost_score(currentScore, boostAmount) {
     const safe_score = Math.max(0, currentScore);
     return Math.min(safe_score + boostAmount, 1.0);
   }

2. vector-index.js:2464-2506 - Track and rollback:
   const delete_transaction = database.transaction(() => {
     let failed_ids = [];
     for (const id of memory_ids) {
       try { ... }
       catch (e) { failed_ids.push(id); }
     }
     if (failed_ids.length > 0) {
       throw new Error(`Failed to delete: ${failed_ids.join(', ')}`);
     }
   });

3. search-results.js:131 - Capture early:
   const original_tokens = estimate_tokens(content);
   // Then later use original_tokens in metrics
```

**Status:** [ ] PENDING

---

### TASK-007: Storage/Schema Fixes (Agent 7)

**Assigned Bugs:** BUG-018, BUG-019, BUG-020

**Instructions:**
```
1. history.js:285-292 - Check result:
   const result = database.prepare('UPDATE...').run(...);
   if (result.changes === 0) {
     throw new Error(`Memory ${id} no longer exists - cannot undo`);
   }

2. vector-index.js:323-411 - Wrap in transaction:
   const migrate = database.transaction(() => {
     // All ALTER TABLE statements
   });
   migrate();

3. memory-parser.js:62 - Remove UTF-16 BE:
   // Remove the utf16be case entirely, log warning instead
   console.warn('[memory-parser] UTF-16 BE encoding not supported');
   return buffer.toString('utf-8');
```

**Status:** [ ] PENDING

---

## Phase 3 Tasks

### TASK-008: Low Bugs Group A (Agent 8)

**Assigned Bugs:** BUG-021 to BUG-025

**Status:** [ ] PENDING

---

### TASK-009: Low Bugs Group B + Tests (Agent 9)

**Assigned Bugs:** BUG-026 to BUG-030 + regression tests

**Status:** [ ] PENDING

---

## Verification Task

### TASK-010: Full Test Suite

```bash
# Run all verification:
cd .opencode/skill/system-spec-kit/mcp_server
node tests/fsrs-scheduler.test.js
node tests/modularization.test.js
npm test

# Expected: All tests pass, no new warnings
```

**Status:** [ ] PENDING

---

## Task Dependencies

```
TASK-001 ──┐
TASK-002 ──┼──> Phase 1 Complete ──┐
TASK-003 ──┤                       │
TASK-004 ──┘                       │
                                   ├──> TASK-010 (Final Verify)
TASK-005 ──┐                       │
TASK-006 ──┼──> Phase 2 Complete ──┤
TASK-007 ──┘                       │
                                   │
TASK-008 ──┬──> Phase 3 Complete ──┘
TASK-009 ──┘
```

---

<!--
Tasks created: 2026-01-28
Total tasks: 10 (9 implementation + 1 verification)
-->
