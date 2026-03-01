# Bug Registry - Quick Reference

## CRITICAL (P0)

| ID | File:Line | One-Line Fix |
|----|-----------|--------------|
| BUG-001 | `tier-classifier.js:86-87` | `scheduler.calculate_retrievability(stability, elapsed)` |
| BUG-002 | `prediction-error-gate.js:24-25` | `LOW_MATCH: 0.50` |
| BUG-003 | `tier-classifier.js:29-30` | `DORMANT: 0.02` |

## HIGH (P1)

| ID | File:Line | One-Line Fix |
|----|-----------|--------------|
| BUG-004 | `vector-index.js:2059` | Add `keys()` and `delete()` to LRUCache |
| BUG-005 | `memory-crud.js:32,72` | Add `await check_database_updated();` |
| BUG-006 | `memory-save.js:94` | Wrap in try/catch |
| BUG-007 | `composite-scoring.js:59` | `if (!last_review) return 0.5;` |
| BUG-008 | `checkpoints.js:678` | Use SAVEPOINT instead of manual backup |
| BUG-009 | `memory-parser.js:168` | Line-by-line YAML parsing |
| BUG-010 | `trigger-extractor.js:178-395` | Replace `{2,25}?` with `{1,24}` |
| BUG-011 | `vector-index.js:1089` | Add `console.warn()` |

## MEDIUM (P2)

| ID | File:Line | One-Line Fix |
|----|-----------|--------------|
| BUG-012 | `vector-index.js:263` | Add `isLoading` flag |
| BUG-013 | `composite-scoring.js:84` | Import from `importance-tiers.js` |
| BUG-014 | `working-memory.js:289` | Add `isNaN()` check |
| BUG-015 | `co-activation.js:62` | `Math.max(0, currentScore)` |
| BUG-016 | `vector-index.js:2464` | Rollback on any failure |
| BUG-017 | `search-results.js:171` | Capture tokens before reassign |
| BUG-018 | `history.js:285` | Check `result.changes === 0` |
| BUG-019 | `vector-index.js:323` | Wrap migration in transaction |
| BUG-020 | `memory-parser.js:62` | Remove UTF-16 BE support |

## LOW (P3)

| ID | File:Line | One-Line Fix |
|----|-----------|--------------|
| BUG-021 | `memory-crud.js:33` | `parseInt(id, 10)` |
| BUG-022 | `memory-search.js:204` | Validate concept strings |
| BUG-023 | `search-results.js:185` | Generic error message |
| BUG-024 | `attention-decay.js:147` | Guard `stability <= 0` |
| BUG-025 | `attention-decay.js:241` | Use `Math.abs() > 0.001` |
| BUG-026 | `trigger-matcher.js:81` | Unicode word boundary |
| BUG-027 | `memory-parser.js:409` | Skip symlinks |
| BUG-028 | `entity-scope.js:69` | Guard `total === 0` |
| BUG-029 | `lib/errors.js:74` | Generic fallback |
| BUG-030 | `search-results.js:93` | Add `isError: false` |

---

## File → Bug Mapping

| File | Bugs |
|------|------|
| `lib/cognitive/tier-classifier.js` | BUG-001, BUG-003 |
| `lib/cognitive/prediction-error-gate.js` | BUG-002 |
| `lib/cognitive/working-memory.js` | BUG-014 |
| `lib/cognitive/co-activation.js` | BUG-015 |
| `lib/cognitive/attention-decay.js` | BUG-024, BUG-025 |
| `lib/search/vector-index.js` | BUG-004, BUG-011, BUG-012, BUG-016, BUG-019 |
| `lib/storage/checkpoints.js` | BUG-008 |
| `lib/storage/history.js` | BUG-018 |
| `lib/scoring/composite-scoring.js` | BUG-007, BUG-013 |
| `lib/parsing/memory-parser.js` | BUG-009, BUG-020, BUG-027 |
| `lib/parsing/trigger-matcher.js` | BUG-026 |
| `lib/parsing/entity-scope.js` | BUG-028 |
| `lib/errors.js` | BUG-029 |
| `shared/trigger-extractor.js` | BUG-010 |
| `handlers/memory-crud.js` | BUG-005, BUG-021 |
| `handlers/memory-save.js` | BUG-006 |
| `handlers/memory-search.js` | BUG-022 |
| `formatters/search-results.js` | BUG-017, BUG-023, BUG-030 |

---

## Agent Assignment

| Agent | Files | Bugs |
|-------|-------|------|
| Agent 1 | tier-classifier, prediction-error-gate | 001, 002, 003 |
| Agent 2 | vector-index (cache), memory-crud, memory-save | 004, 005, 006 |
| Agent 3 | composite-scoring, checkpoints | 007, 008 |
| Agent 4 | memory-parser, trigger-extractor, vector-index (logging) | 009, 010, 011 |
| Agent 5 | vector-index (cache flag), composite-scoring, working-memory | 012, 013, 014 |
| Agent 6 | co-activation, vector-index (transaction), search-results | 015, 016, 017 |
| Agent 7 | history, vector-index (migration), memory-parser | 018, 019, 020 |
| Agent 8 | memory-crud, memory-search, attention-decay | 021, 022, 024, 025 |
| Agent 9 | trigger-matcher, entity-scope, errors, search-results | 023, 026, 027, 028, 029, 030 |
