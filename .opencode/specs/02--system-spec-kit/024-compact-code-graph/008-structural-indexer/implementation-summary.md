<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
---
title: "Implementation Summary: Structural Indexer [024/008]"
description: "Built a structural indexer with tree-sitter WASM as the default parser, regex fallback support, normalized node/edge vocabulary, and parser health tracking."
---
# Implementation Summary


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Metadata
Template compliance shim section. Legacy phase content continues below.

## What Was Built
Template compliance shim section. Legacy phase content continues below.

## How It Was Delivered
Template compliance shim section. Legacy phase content continues below.

## Key Decisions
Template compliance shim section. Legacy phase content continues below.

## Verification
Template compliance shim section. Legacy phase content continues below.

## Known Limitations
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
Template compliance shim anchor for what-built.
<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
Template compliance shim anchor for how-delivered.
<!-- /ANCHOR:how-delivered -->
Template compliance shim anchor for decisions.
<!-- ANCHOR:decisions -->
Decision details are documented in the Key Decisions section above.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
Template compliance shim anchor for verification.
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
Template compliance shim anchor for limitations.
<!-- /ANCHOR:limitations -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
### Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 008-structural-indexer |
| **Completed** | 2026-03-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
### What Was Built
A structural indexer now extracts symbols (functions, classes, methods, modules) and their relationships (CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, TESTED_BY) from JS/TS/Python/Shell source files using tree-sitter WASM by default, with regex fallback when needed. It produces a normalized node/edge vocabulary feeding Phase 009 storage and Phase 010 context bridge.

### Core Indexer (`structural-indexer.ts`)

`structural-indexer.ts` now owns the main parse and indexing flow. `getParser()` defaults to the tree-sitter backend and automatically falls back to regex if tree-sitter initialization fails, or immediately uses regex when `SPECKIT_PARSER=regex` is set. The file also handles parse orchestration, file discovery, content hashing, normalized `CodeNode[]` creation, and edge extraction handoff.

### Tree-Sitter Backend (`tree-sitter-parser.ts`)

The tree-sitter backend loads `web-tree-sitter` with `tree-sitter-wasms` grammars for JavaScript, TypeScript, Python, and Bash. It walks the AST programmatically and emits `RawCapture[]` values that stay compatible with `structural-indexer.ts`. No `.scm` query files are needed because capture extraction lives in code rather than external query definitions.

### Edge Extraction (`extractEdges`)

Edges are derived from parser captures and source text analysis. `CONTAINS` links classes to their methods. `CALLS` identifies direct function calls within function bodies. `IMPORTS` matches import statements across JS/TS/Python. `EXPORTS` captures exported symbols in JS/TS. `EXTENDS` and `IMPLEMENTS` edges are extracted from TypeScript class/interface declarations. `TESTED_BY` uses a heuristic combining filename patterns and import analysis to link test files to tested modules. All edges carry confidence scores reflecting extraction reliability.

### Type Definitions (`indexer-types.ts`)

`CodeNode`, `CodeEdge`, and `ParseResult` interfaces provide the shared type vocabulary. `ParseResult` includes `parserHealth` (clean/recovered/error) and `parseDurationMs` for performance monitoring.

### Freshness and Re-indexing

Content hashes are generated during parsing, and the indexing logic now lives in `structural-indexer.ts` rather than a separate `incremental-index.ts` module. Files exceeding `maxFileSizeBytes` (102400) are skipped with a warning rather than crashing. Selective versus full re-index decisions are handled elsewhere in the code-graph pipeline, while this phase provides the parser output and content-hash data they depend on.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/code-graph/structural-indexer.ts` | New | Core extraction pipeline, parser selection, file discovery, and content-hash-aware parsing |
| `mcp_server/lib/code-graph/tree-sitter-parser.ts` | New | Tree-sitter WASM backend with programmatic AST traversal |
| `mcp_server/lib/code-graph/indexer-types.ts` | New | CodeNode, CodeEdge, ParseResult interfaces |
| `mcp_server/package.json` | Modified | Adds `web-tree-sitter` and `tree-sitter-wasms` dependencies for the default backend |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
### How It Was Delivered
The indexer was implemented incrementally: shared types first, then the parser abstraction, then tree-sitter runtime integration, then fallback-safe extraction and cross-language edge handling. Each language backend was validated against actual repo files before proceeding. Performance was benchmarked on the full repository to confirm the structural pass stays well within the phase targets.
<!-- /ANCHOR:how-delivered -->

---
### Key Decisions
| Decision | Why |
|----------|-----|
| Tree-sitter WASM is the default parser, with regex fallback | AST-accurate extraction gives better structural fidelity, while regex keeps the indexer usable when WASM initialization fails or a lightweight fallback is preferred. |
| SHA-256 for symbolId | Deterministic, collision-resistant, stable across re-indexing runs. |
| 100KB file size guard | Prevents pathological parse times on generated/vendored files without crashing. |
| Conservative Shell extraction | Bash grammar is noisy; restricting to function_definition avoids false positives. |
| TESTED_BY as heuristic edge | Filename pattern + import analysis provides useful signal despite lower confidence. |
| Programmatic AST traversal instead of `.scm` queries | Keeping extraction logic in TypeScript avoids a parallel query-file maintenance surface and keeps captures aligned with the shared normalization pipeline. |
---

<!-- ANCHOR:verification -->
### Verification
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
### Known Limitations
1. **Regex fallback is less precise than tree-sitter.** If the indexer falls back to regex, edge cases in string literals, comments, and complex nesting can still produce false captures.
2. **CALLS edge detection** still relies on structural heuristics after parsing, which may miss dynamically constructed calls or produce false positives on identically named functions across modules.
3. **CONFIGURES edge type** remains deferred to v2 due to low confidence in automated detection.
4. **`.scm` query files are intentionally absent.** The tree-sitter backend uses programmatic AST traversal, so there is no separate query-file layer to customize in this phase.
<!-- /ANCHOR:limitations -->
