---
title: "Plan: Tree-Sitter & Classifier Fixes [024/017]"
description: "Implementation order for 15 bug fixes across tree-sitter parser and query-intent classifier."
---
# Plan: Phase 017 — Tree-Sitter & Classifier Fixes

## Implementation Order

1. **F030: Abstract method support** (5-10 LOC)
   - Add `abstract_method_signature` to `JS_TS_KIND_MAP` in tree-sitter-parser.ts
   - Map to `method` kind for structural indexing

2. **F031: Class expression detection** (15-20 LOC)
   - Add `variable_declarator` branch in `resolveKind()` to check RHS type
   - Handle `const X = class {}` and `lexical_declaration` with class/generator_function

3. **F032: Multi-import/export capture** (40-60 LOC)
   - Create `emitImportCaptures()` and `emitExportCaptures()` helper functions
   - Emit one capture per specifier instead of only the first

4. **F033: Decorated definition handling** (25-35 LOC)
   - Remove `decorated_definition` from kind map
   - Update `walkAST()` to delegate from decorator wrapper to inner definition node
   - Prevent double-emission and class-as-function mistyping

5. **F034: Init poisoning recovery** (10-15 LOC)
   - Reset `initPromise` on rejection in `ensureInit()`
   - Validate grammars before caching in structural-indexer.ts

6. **F041: Nested class fqName threading** (10-15 LOC)
   - Thread full qualified class name through `walkAST()` recursion
   - Ensure `Outer.Inner.method` preserves full path

7. **F035: Semantic pattern narrowing** (15-20 LOC)
   - Narrow semantic patterns to require semantic noun alongside opener
   - Prevent structural lookups from being overridden by semantic patterns

8. **F036: Multi-word matching boundaries** (10-15 LOC)
   - Replace substring matching with exact token n-gram matching
   - Fix false positive on `call chaining` matching `call chain`

9. **F037: Confidence scaling** (10-15 LOC)
   - Scale confidence by absolute evidence count instead of saturating at 0.95
   - Single keyword match no longer produces 95% confidence

10. **F038: Keyword expansion** (10-15 LOC)
    - Add missing structural keyword inflections: `import/imports`, `export/exports`, `caller/callers`

11. **F043: Shared type contracts** (10-15 LOC)
    - Move `RawCapture` to single source of truth in structural-indexer.ts
    - Import from shared location in tree-sitter-parser.ts

## Deferred Items

- F039: Dedicated tree-sitter test file — deferred to future testing phase
- F042: Bash regex `function foo { }` form — needs investigation
- F044: `SPECKIT_PARSER` env var documentation — internal-only for now

## Dependencies
- None — all fixes are localized to two modules

## Estimated Total LOC: 200-350
