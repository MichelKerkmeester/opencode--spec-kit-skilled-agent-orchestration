---
title: "Tasks: Structural Indexer [024/008]"
description: "Task tracking for the structural indexer with tree-sitter default parsing, regex fallback, node/edge extraction, and content-hash-aware indexing."
---
# Tasks: Phase 008 — Structural Indexer

## Completed

- [x] Tree-sitter WASM runtime integrated as the default parser backend — Evidence: `structural-indexer.ts#getParser()` defaults to `treesitter`; `tree-sitter-parser.ts` loads grammars via `web-tree-sitter`
- [x] Regex fallback backend retained for JS/TS/Python/Shell — Evidence: `structural-indexer.ts#getParser()` falls back on init failure and supports `SPECKIT_PARSER=regex`
- [x] `indexer-types.ts` — `CodeNode`, `CodeEdge`, `ParseResult` interfaces defined
- [x] `symbolId` generation — deterministic SHA-256 hash of filePath + fqName + kind
- [x] `fqName` construction — consistent rules across all 4 languages
- [x] Programmatic AST traversal replaces `.scm` query files — Evidence: `tree-sitter-parser.ts` walks ASTs directly and no `*.scm` files exist in the code-graph area
- [x] `CONTAINS` edges — classes to methods correctly linked
- [x] `CALLS` edges — direct function calls identified via `extractEdges`
- [x] `IMPORTS` edges — import statements correctly identified across JS/TS/Python
- [x] `EXPORTS` edges — exported symbols identified in JS/TS
- [x] `EXTENDS` and `IMPLEMENTS` edges — TS classes/interfaces extracted via `parseJsTs` + `extractEdges`
- [x] `TESTED_BY` heuristic edges — test files linked to tested modules via filename pattern + import
- [x] Content-hash incremental skip — unchanged files not re-parsed
- [x] Parser health metadata — clean/recovered/error correctly distinguished
- [x] Files >100KB skipped with warning — `maxFileSizeBytes=102400` in `getDefaultConfig`
- [x] Parse time tracked per file — `parseDurationMs` in `ParseResult`
- [x] Edge confidence scores — `metadata.confidence` reflects extraction reliability
- [x] Full repo index benchmarked — 835 files in 416ms (<30s target)
- [x] Incremental re-index benchmarked — 10 files in 6ms (<5s target)

## Deferred

- [ ] `CONFIGURES` edge type — low confidence, deferred to v2
