---
title: "Tasks: Tree-Sitter & Classifier Fixes [024/017]"
description: "Task tracking for 15 bug fixes in tree-sitter parser and query-intent classifier."
---
# Tasks: Phase 017 — Tree-Sitter & Classifier Fixes

## Completed

- [x] F030: Add `abstract_method_signature` to JS_TS_KIND_MAP — tree-sitter-parser.ts:87
- [x] F031: Handle `const X = class {}` in resolveKind() — tree-sitter-parser.ts:295-306; lexical_declaration branch also handles class/generator_function
- [x] F032: Per-specifier import/export captures — emitImportCaptures + emitExportCaptures functions
- [x] F033: Decorated definition delegation to inner node — walkAST:564-581
- [x] F034: Reset initPromise on failure in ensureInit() — tree-sitter-parser.ts:59-62
- [x] F035: Narrow semantic patterns to require semantic noun alongside opener — query-intent-classifier.ts:72-77
- [x] F036: Multi-word matching with word boundaries — query-intent-classifier.ts:94
- [x] F037: Confidence scaling by evidence count — query-intent-classifier.ts:147-148
- [x] F038: Missing structural keyword inflections added — query-intent-classifier.ts:39-41
- [x] F039: Dedicated test file for tree-sitter parser — mcp_server/tests/tree-sitter-parser.vitest.ts covers readiness/init/error behavior; parser-selection coverage still missing
- [x] F040: Query-intent classifier wired into routing path — integrated in Phase 020 (memory-context.ts)
- [x] F041: Nested class fqName threading — walkAST:527-529 threads fqClassName
- [x] F042: Bash regex for `function foo { }` form — structural-indexer.ts:567-569
- [x] F043: RawCapture single source of truth — imported from structural-indexer.ts:18
- [x] F044: SPECKIT_PARSER env var documentation — capability-flags.ts:37-50

## Deferred

- [ ] Tech debt: `ParserAdapter` remains duplicated in tree-sitter-parser.ts:20-23 and structural-indexer.ts:17-19; consolidate when parser contracts are refactored
