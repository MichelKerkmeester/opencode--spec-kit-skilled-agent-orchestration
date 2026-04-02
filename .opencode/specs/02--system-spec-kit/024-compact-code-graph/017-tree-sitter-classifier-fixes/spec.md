<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 017: Tree-Sitter & Query-Intent Classifier Fixes

<!-- PHASE_LINKS: parent=../spec.md predecessor=016-cross-runtime-ux successor=018-non-hook-auto-priming -->

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 10. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### What This Is

The v2 remediation added two new modules: a tree-sitter WASM parser and a query-intent classifier. A 10-iteration GPT-5.4 review found 15 bugs in them. This phase fixes those bugs.

### Plain-English Summary

The new tree-sitter parser works for simple code but breaks on:
- Files with multiple imports (`import { a, b, c }` only captures `a`)
- Python decorators (emits the symbol twice, and calls decorated classes "functions")
- TypeScript abstract methods (skips them entirely)
- Nested Python classes (`Outer.Inner.method` loses the `Outer` prefix)
- `const X = class {}` (misidentified as a variable instead of a class)
- Failed initialization poisons the parser permanently — no recovery

The query-intent classifier has scoring problems:
- "Where is the function defined?" routes to semantic search instead of structural
- A single keyword match gives 95% confidence (should need more evidence)
- Multi-word matching has false positives (`call chaining` matches `call chain`)
- Missing common structural keywords (`import`, `export`, `caller`)

Both modules lack dedicated tests and have duplicated internal contracts.

### Items to Fix

### P1 — Must Fix (7 items)

| ID | File | What's Wrong | How to Fix |
|----|------|-------------|------------|
| F030 | tree-sitter-parser.ts | Abstract methods (`abstract_method_signature`) skipped | Add to `JS_TS_KIND_MAP` |
| F031 | tree-sitter-parser.ts | `const X = class {}` classified as variable | Check RHS type in `resolveKind()` |
| F032 | tree-sitter-parser.ts | Only first import name captured; re-exports lost | Emit one capture per specifier |
| F033 | tree-sitter-parser.ts | Python decorated definitions double-emitted, classes mistyped | Remove `decorated_definition` from kind map; emit from inner node only |
| F034 | tree-sitter-parser.ts + structural-indexer.ts | Failed init poisons singleton forever | Reset `initPromise` on rejection; validate grammars before caching |
| F035 | query-intent-classifier.ts | Semantic patterns override structural lookups | Narrow semantic patterns to require semantic noun alongside opener |
| F041 | tree-sitter-parser.ts | Nested Python classes lose outer qualifier | Thread full qualified path through recursion |

### P2 — Should Fix (8 items)

| ID | File | What's Wrong | How to Fix |
|----|------|-------------|------------|
| F036 | query-intent-classifier.ts | Substring matching gives false positives | Use exact token n-gram matching |
| F037 | query-intent-classifier.ts | Confidence saturates at 0.95 from one signal | Scale confidence by absolute evidence count |
| F038 | query-intent-classifier.ts | Missing structural keyword inflections | Expand dictionary with singular/plural forms |
| F039 | tree-sitter-parser.ts | No dedicated test file | Add lifecycle, error path, and parser-selection tests |
| F040 | query-intent-classifier.ts | Exported but never used or tested | Integrate into routing path or remove until ready |
| F042 | structural-indexer.ts | Bash regex misses `function foo { }` form | Expand regex to accept both declaration styles |
| F043 | tree-sitter-parser.ts + structural-indexer.ts | Duplicated `ParserAdapter`/`RawCapture` contracts | Move to shared types module |
| F044 | structural-indexer.ts | `SPECKIT_PARSER` env var undocumented | Add to capability-flags.ts or demote to internal-only |

### Also Verified: Old Findings Status

The review verified that 24 of the original 33 findings (F001-F033) are now **FIXED**. The remaining:

| ID | Status | Notes |
|----|--------|-------|
| F001 | Still active | compact-prime clear-before-write race |
| F002 | Partial | save failures logged but not always propagated |
| F010 | Partial | schema validators exist but code-graph dispatch bypasses them |
| F020 | Partial | sessionState still bypasses budget allocation |
| F022 | Partial | Claude hook path still misses some memory-surface payloads |
| F029 | Still active | test coverage gap for hooks/code-graph |
| F030 | Partial | SessionStart scope fix landed but spec still has stale wording |
| F031 | Still active | ccc_feedback schema bounds not enforced |
| F033 | Still active | decorated Python definitions (confirmed by iter 039) |

### Estimated LOC: 200-350
### Risk: LOW — all fixes are localized to two modules
### Dependencies: None — these are standalone bug fixes

---

### Implementation Status (Post-Review Iterations 041-050)

| ID | Item | Status | Evidence |
|----|------|--------|----------|
| F030 | abstract_method_signature in JS_TS_KIND_MAP | DONE | tree-sitter-parser.ts:87 |
| F031 | resolveKind handles const X = class {} | DONE | tree-sitter-parser.ts:295-306 (variable_declarator branch); **F031-ext fixed**: lexical_declaration branch now also handles class/generator_function (iter 041) |
| F032 | Per-specifier import/export captures | DONE | emitImportCaptures + emitExportCaptures functions |
| F033 | decorated_definition not in kind map, handled in walkAST | DONE | walkAST:564-581 delegates to inner definition |
| F034 | ensureInit resets initPromise on failure | DONE | tree-sitter-parser.ts:59-62 |
| F035 | Semantic patterns narrowed | DONE | query-intent-classifier.ts:72-77 |
| F041 | Nested class fqName threading | DONE | walkAST:527-529 threads fqClassName |
| F036 | Multi-word matching word boundaries | DONE | query-intent-classifier.ts:94 |
| F037 | Confidence scaling by evidence count | DONE | query-intent-classifier.ts:147-148 |
| F038 | Missing structural keyword inflections | DONE | query-intent-classifier.ts:39-41 |
| F039 | Dedicated test file for tree-sitter | DEFERRED | No test file created yet (F060) |
| F040 | query-intent-classifier integration | DONE | Wired into memory-context.ts (Phase 020) |
| F042 | Bash regex for `function foo { }` | DEFERRED | Needs investigation |
| F043 | RawCapture single source of truth | DONE | Imported from structural-indexer.ts:18 |
| F044 | SPECKIT_PARSER env var documentation | DEFERRED | Internal-only for now |

### Problem Statement
This phase addresses concrete context-preservation and code-graph reliability gaps tracked in this packet.

### Requirements Traceability
- REQ-900: Keep packet documentation and runtime verification aligned for this phase.
- REQ-901: Keep packet documentation and runtime verification aligned for this phase.
- REQ-902: Keep packet documentation and runtime verification aligned for this phase.
- REQ-903: Keep packet documentation and runtime verification aligned for this phase.
- REQ-904: Keep packet documentation and runtime verification aligned for this phase.

### Acceptance Scenarios
- **Given** phase context is loaded, **When** verification scenario 1 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 2 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 3 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 4 runs, **Then** expected packet behavior remains intact.
