---
title: "Checklist: Tree-Sitter & Classifier Fixes [024/017]"
description: "15 items across P1/P2 for phase 017."
---
# Checklist: Phase 017 — Tree-Sitter & Classifier Fixes

## P1 — Must Pass

- [x] F030: Abstract methods indexed via `abstract_method_signature` in JS_TS_KIND_MAP — tree-sitter-parser.ts:87
- [x] F031: `const X = class {}` correctly classified as class, not variable — tree-sitter-parser.ts:295-306, lexical_declaration branch
- [x] F032: Multi-import `import { a, b, c }` emits all specifiers — emitImportCaptures/emitExportCaptures functions
- [x] F033: Python decorated definitions emit once from inner node, classes not mistyped as functions — walkAST:564-581
- [x] F034: Failed tree-sitter init resets initPromise, no permanent poisoning — tree-sitter-parser.ts:59-62
- [x] F035: Structural queries ("Where is defined?") no longer routed to semantic search — query-intent-classifier.ts:72-77
- [x] F041: Nested Python classes preserve full qualified path (Outer.Inner.method) — walkAST:527-529

## P2 — Should Pass

- [x] F036: Multi-word matching uses exact token boundaries, no false positives — query-intent-classifier.ts:94
- [x] F037: Single keyword match no longer saturates confidence at 0.95 — query-intent-classifier.ts:147-148
- [x] F038: Structural keyword dictionary expanded with inflections (import/imports, export/exports, caller/callers) — query-intent-classifier.ts:39-41
- [x] F039: Dedicated tree-sitter test file exists and covers readiness/init/error paths, but not parser-selection behavior — [Test: mcp_server/tests/tree-sitter-parser.vitest.ts:7-79]
- [x] F040: Query-intent classifier integrated into routing path — wired in Phase 020 memory-context.ts
- [x] F042: Bash regex handles `function foo { }` form — [Code: structural-indexer.ts:567-569]
- [x] F043: RawCapture is unified to a single source of truth, but `ParserAdapter` remains duplicated between parser modules as tech debt — [Code: structural-indexer.ts:17-19; tree-sitter-parser.ts:20-23]
- [x] F044: SPECKIT_PARSER env var documented in capability-flags.ts — [Code: capability-flags.ts:37-50]
