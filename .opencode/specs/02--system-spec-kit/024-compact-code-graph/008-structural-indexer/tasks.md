---
title: "Tasks: Structural Indexer [024/008]"
description: "Task tracking for regex-based structural indexer with tree-sitter-queries, node/edge extraction, and incremental re-indexing."
---
# Tasks: Phase 008 — Structural Indexer

## Completed

- [x] Regex-based parser implemented for JS/TS — Evidence: `structural-indexer.ts` parses functions, classes, methods, imports without crash
- [x] Regex-based parser implemented for Python — Evidence: function_definition, class_definition, decorated_definition extraction
- [x] Regex-based parser implemented for Shell — Evidence: conservative function_definition extraction
- [x] `indexer-types.ts` — `CodeNode`, `CodeEdge`, `ParseResult` interfaces defined
- [x] `symbolId` generation — deterministic SHA-256 hash of filePath + fqName + kind
- [x] `fqName` construction — consistent rules across all 4 languages
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

- [ ] tree-sitter WASM runtime integration — planned as enhancement in Phase 015
- [ ] tree-sitter query files (`javascript.scm`, `typescript.scm`, `python.scm`, `bash.scm`) — deferred with tree-sitter migration
- [ ] `CONFIGURES` edge type — low confidence, deferred to v2
