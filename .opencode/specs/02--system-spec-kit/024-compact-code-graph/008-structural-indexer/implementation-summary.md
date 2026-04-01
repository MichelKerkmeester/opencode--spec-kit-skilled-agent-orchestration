---
title: "Implementation Summary: Structural Indexer [024/008]"
description: "Built regex-based structural indexer for JS/TS/Python/Shell with normalized node/edge vocabulary, incremental content-hash re-indexing, and parser health tracking. Full repo indexed in 416ms."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-compact-code-graph/008-structural-indexer |
| **Completed** | 2026-03-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A regex-based structural indexer that extracts symbols (functions, classes, methods, modules) and their relationships (CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, TESTED_BY) from JS/TS/Python/Shell source files. Produces a normalized node/edge vocabulary feeding Phase 009 storage and Phase 010 context bridge.

### Core Indexer (`structural-indexer.ts`)

Per-language regex parsers extract structural symbols from source files. JS/TS shares a unified parser (`parseJsTs`) handling functions, classes, methods, interfaces, type aliases, enums, arrow functions, and variable declarators. Python parser handles function_definition, class_definition, and decorated_definition. Shell parser conservatively extracts function_definition only. Each parser returns `CodeNode[]` with deterministic `symbolId` (SHA-256 of filePath + fqName + kind), fully qualified names, line ranges, and language metadata.

### Edge Extraction (`extractEdges`)

Edges are derived from parser captures and source text analysis. `CONTAINS` links classes to their methods. `CALLS` identifies direct function calls within function bodies. `IMPORTS` matches import statements across JS/TS/Python. `EXPORTS` captures exported symbols in JS/TS. `EXTENDS` and `IMPLEMENTS` edges are extracted from TypeScript class/interface declarations. `TESTED_BY` uses a heuristic combining filename patterns and import analysis to link test files to tested modules. All edges carry confidence scores reflecting extraction reliability.

### Type Definitions (`indexer-types.ts`)

`CodeNode`, `CodeEdge`, and `ParseResult` interfaces provide the shared type vocabulary. `ParseResult` includes `parserHealth` (clean/recovered/error) and `parseDurationMs` for performance monitoring.

### Incremental Re-indexing (`incremental-index.ts`)

Content-hash comparison per file skips re-parse when the hash matches the stored value. Tracks `lastIndexedAt` timestamp. Reports stale file count for `code_graph_status`. Files exceeding `maxFileSizeBytes` (102400) are skipped with a warning rather than crashing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/code-graph/structural-indexer.ts` | New | Core extraction pipeline with per-language regex parsers |
| `mcp_server/lib/code-graph/indexer-types.ts` | New | CodeNode, CodeEdge, ParseResult interfaces |
| `mcp_server/lib/code-graph/incremental-index.ts` | New | Content-hash freshness and incremental re-indexing |
| `package.json` | Modified | No tree-sitter dependencies needed (regex approach) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The indexer was implemented incrementally: types first, then JS/TS parser (P0), then edge extraction, then Python/Shell parsers (P1/P2). Each language parser was validated against actual repo files before proceeding. Performance was benchmarked on the full repository (835 files) to confirm sub-second indexing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Regex-based parser instead of tree-sitter WASM | Zero external dependencies, sufficient accuracy for structural extraction. Tree-sitter planned as Phase 015 enhancement. |
| SHA-256 for symbolId | Deterministic, collision-resistant, stable across re-indexing runs. |
| 100KB file size guard | Prevents pathological parse times on generated/vendored files without crashing. |
| Conservative Shell extraction | Bash grammar is noisy; restricting to function_definition avoids false positives. |
| TESTED_BY as heuristic edge | Filename pattern + import analysis provides useful signal despite lower confidence. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| JS/TS parsing (functions, classes, imports) | PASS — no crashes on repo files |
| Python parsing (function/class/method) | PASS |
| Shell parsing (function_definition) | PASS |
| symbolId determinism | PASS — same input produces same ID |
| Content-hash incremental skip | PASS — unchanged files not re-parsed |
| Full repo index | PASS — 835 files in 416ms (<30s target) |
| Incremental re-index (10 files) | PASS — 6ms (<5s target) |
| Phase 008 checklist | All P0/P1/P2 items verified |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Regex parsing is approximate.** Edge cases in string literals, comments, and complex nesting can produce false captures. Tree-sitter (Phase 015) will provide AST-accurate extraction.
2. **CALLS edge detection** relies on text pattern matching within function bodies, which may miss dynamically constructed calls or produce false positives on identically named functions across modules.
3. **CONFIGURES edge type** deferred to v2 due to low confidence in automated detection.
4. **tree-sitter query files** (`.scm`) were not created since the regex approach was used instead; these will be created during Phase 015 migration.
<!-- /ANCHOR:limitations -->
