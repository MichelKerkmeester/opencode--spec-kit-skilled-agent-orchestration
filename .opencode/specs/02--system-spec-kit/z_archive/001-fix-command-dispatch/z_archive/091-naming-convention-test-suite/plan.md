---
title: "Implementation Plan: Naming Convention Test Suite [091-naming-convention-test-suite/plan]"
description: "Build 3 test files that comprehensively verify every script adjusted during the naming convention migration. Tests run without external dependencies (no DB, no API keys) where p..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "naming"
  - "convention"
  - "test"
  - "091"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Naming Convention Test Suite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node.js, CommonJS) |
| **Test Framework** | Custom (no external deps - matches existing test patterns) |
| **Target** | 246 files across system-spec-kit |
| **Estimated LOC** | 300-400 (test code) |

### Overview
Build 3 test files that comprehensively verify every script adjusted during the naming convention migration. Tests run without external dependencies (no DB, no API keys) where possible, with graceful fallback for modules that require runtime state.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Audit reports available with line-by-line violations
- [x] 3 runtime bugs documented with exact locations
- [x] File inventory complete (197 JS + 28 shell + 1 Python)

### Definition of Done
- [ ] All 3 test files created and passing
- [ ] Test runner produces clear pass/fail output
- [ ] Zero false positives (tests that fail for non-migration reasons)
- [ ] Can be re-run anytime via `node scripts/tests/test-naming-migration.js`

---

## 3. TEST ARCHITECTURE

### Test Files

```
scripts/tests/
├── test-naming-migration.js      # Main: T1-T3, T7, T9-T10 (syntax, imports, grep, compliance)
├── test-export-contracts.js       # T3, T6: Export contract + backward-compat aliases
└── test-bug-regressions.js        # T5: 3 specific bug regression tests
```

### Test Categories

```
T1: SYNTAX VALIDATION
    ├── node --check on 197 JS files
    └── bash -n on 28 shell files
    ↓
T2: MCP MODULE IMPORT CHAIN (144 files)
    ├── require() each mcp_server/ file
    ├── Catch import errors (distinguish from DB init errors)
    └── Verify no ReferenceError on load
    ↓
T3: EXPORT CONTRACT VERIFICATION (~40 key modules)
    ├── handlers/ → verify handle* functions exported
    ├── lib/search/ → verify search functions exported
    ├── lib/cognitive/ → verify cognitive functions exported
    ├── lib/storage/ → verify storage functions exported
    └── scripts/ → verify key exports from index.js files
    ↓
T4: MCP SERVER STARTUP
    └── Load context-server.js module (not start server)
    ↓
T5: BUG REGRESSION TESTS (3 bugs)
    ├── Bug 1: memory-context.js → normalizedInput exists at usage site
    ├── Bug 2: memory-parser.js → causalLinks/causalBlockMatch consistent
    └── Bug 3: causal-edges.js → stats.source_count property access
    ↓
T6: BACKWARD-COMPAT ALIASES
    ├── Each handler module.exports has both camelCase and snake_case keys
    └── Alias values point to same function reference
    ↓
T7: CROSS-REFERENCE INTEGRITY
    ├── Grep for snake_case function definitions (should be zero)
    ├── Grep for undefined variable patterns
    └── Grep for mixed naming in same file
    ↓
T8: SHELL SCRIPT VALIDATION
    ├── bash -n on all 28 files
    ├── Verify shebang present
    └── Verify set -euo pipefail (or documented exception)
    ↓
T9: SCRIPTS MODULE IMPORTS (53 files)
    ├── require() each scripts/ JS file
    └── Verify no throw on import
    ↓
T10: NAMING COMPLIANCE SWEEP
    ├── Regex scan: function snake_case_name(
    ├── Regex scan: const snake_case =
    ├── Exceptions: SQL strings, backward-compat exports
    └── Report any remaining violations
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Create test-naming-migration.js (T1, T2, T7, T9, T10)

The main test runner covering:
- **T1**: Walk all JS/shell files, run syntax check
- **T2**: `require()` every MCP server JS file in try-catch
- **T7**: Grep-equivalent regex scan for cross-reference issues
- **T9**: `require()` every scripts/ JS file in try-catch
- **T10**: Regex scan for remaining snake_case function/variable definitions

**Key design decisions:**
- Use `child_process.execSync` for `node --check` and `bash -n`
- Use `require()` in try-catch for import testing
- Distinguish between "import error" (migration bug) and "runtime error" (needs DB)
- Pattern: `function [a-z]+_[a-z]` catches snake_case function defs
- Exclude: strings, comments, SQL template literals, backward-compat alias objects

### Phase 2: Create test-export-contracts.js (T3, T6)

Export contract verification:
- Define expected exports for ~40 key modules
- Verify each export exists and is the expected type (function/object/string)
- For handler files: verify both camelCase primary AND snake_case backward-compat alias
- For index.js barrel files: verify all re-exports resolve

**Module groups to verify:**

| Group | Modules | Key Exports |
|-------|---------|-------------|
| handlers/ (10) | memory-search, memory-save, memory-crud, memory-context, memory-index, memory-triggers, checkpoints, causal-graph, session-learning | `handle*` functions |
| lib/search/ (9) | bm25-index, hybrid-search, vector-index, intent-classifier, fuzzy-match, cross-encoder, reranker, rrf-fusion | Class or function exports |
| lib/cognitive/ (11) | working-memory, attention-decay, consolidation, fsrs-scheduler, prediction-error-gate, tier-classifier, co-activation, archival-manager, summary-generator, temporal-contiguity | Key functions |
| lib/storage/ (8) | access-tracker, causal-edges, checkpoints, history, incremental-index, index-refresh, transaction-manager | CRUD functions |
| lib/scoring/ (6) | composite-scoring, confidence-tracker, folder-scoring, importance-tiers, scoring | Score functions |
| lib/parsing/ (5) | memory-parser, trigger-extractor, trigger-matcher, entity-scope | Parse functions |
| scripts/ (5 index files) | core, extractors, loaders, renderers, spec-folder, utils | Re-exports |

### Phase 3: Create test-bug-regressions.js (T5)

Three targeted regression tests:

**Bug 1: memory-context.js:299**
```js
// Read file source, verify line 299 uses normalizedInput (not normalized_input)
// OR: require the module, verify the auto-mode code path doesn't throw
```

**Bug 2: memory-parser.js:348,351**
```js
// Read file source, verify extractCausalLinks uses causalLinks (not causal_links)
// Verify causalBlockMatch (not causal_block_match)
// OR: call extractCausalLinks() with test content containing causal links
```

**Bug 3: causal-edges.js:561**
```js
// Read file source, verify getGraphStats accesses stats.source_count (not stats.sourceCount)
// OR: verify the SQL alias matches the JS property access
```

### Phase 4: Run & Verify

- Run all 3 test files
- Fix any false positives
- Ensure clear pass/fail output
- Document results in checklist.md

---

## 5. TESTING STRATEGY

| Test Type | Runner | Pass Criteria |
|-----------|--------|---------------|
| Syntax | `node --check` / `bash -n` | Exit 0 for all files |
| Import | `require()` in try-catch | No ReferenceError or SyntaxError |
| Export | Type checking | `typeof export === 'function'` |
| Regression | Source scan + unit test | Specific patterns match/don't match |
| Compliance | Regex sweep | Zero matches for violation patterns |

---

## 6. ROLLBACK PLAN

- **Trigger**: Test suite itself has bugs
- **Procedure**: Delete 3 test files, no impact on production code

---

## 7. FILE OWNERSHIP

| Test File | Tests | Estimated LOC |
|-----------|-------|---------------|
| `test-naming-migration.js` | T1, T2, T7, T9, T10 | ~150 |
| `test-export-contracts.js` | T3, T6 | ~120 |
| `test-bug-regressions.js` | T5 | ~80 |
| **Total** | **10 categories** | **~350** |
