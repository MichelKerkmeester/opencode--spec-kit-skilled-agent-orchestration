---
title: "Implementation Summary: Tree-Sitter Migration Foundation [024/015]"
description: "Parser adapter interface, 3 new edge types, 4 ghost SymbolKinds, indexer cleanup. Tree-sitter WASM subsequently completed in Phase 017. 12/13 checklist items completed."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-compact-code-graph/015-tree-sitter-migration |
| **Completed** | 2026-03-31 (foundation); tree-sitter WASM completed in Phase 017 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The structural indexer now has a clean adapter interface ready for tree-sitter, three new relationship types that capture decorators, overrides, and type references, and four previously ghost SymbolKinds are now actively extracted. Dead code paths and broken config options are cleaned up.

### Parser Adapter Interface (Item 31)

A `ParserAdapter` interface (`parse(content, language): ParseResult`) abstracts the parsing backend. `RegexParser` wraps all existing regex logic. `getParser()` returns the active adapter based on `SPECKIT_PARSER` env var. Setting `SPECKIT_PARSER=treesitter` throws a clear error until the WASM implementation lands. This is the integration point for Phase 015-B.

### New Edge Types (Item 33)

Three edge types added to the `EdgeType` union in `indexer-types.ts`:
- **DECORATES** (confidence 0.9): Detects `@decorator` patterns above functions/classes in Python and TypeScript.
- **OVERRIDES** (confidence 0.9): Detects class methods that shadow parent methods via extends chain tracking.
- **TYPE_OF** (confidence 0.85): Detects type annotations (`: TypeName`) and type references in function signatures.

All three use regex-based detection in `extractEdges()` and will gain AST precision when tree-sitter lands.

### Ghost SymbolKinds (Item 34)

Four SymbolKinds previously defined but never extracted are now emitted by the regex parser:
- **method**: Class methods in JS/TS (previously reported as `function`)
- **variable**: `const`/`let`/`var` declarations
- **parameter**: Function parameters with type annotations
- **module**: Module-level export patterns

### Indexer Cleanup (Items 36-38)

Dead per-file TESTED_BY branch removed (cross-file heuristic preserved). `excludeGlobs` was an exposed option that did nothing; now wired into recursive file discovery via `globToRegExp()` + `shouldExcludePath()`. `.zsh` was mapped to `bash` in the language table but never discovered; `**/*.zsh` added to default globs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/code-graph/structural-indexer.ts` | Modified | ParserAdapter, RegexParser, new edges, dead code removal, excludeGlobs wiring |
| `lib/code-graph/indexer-types.ts` | Modified | DECORATES/OVERRIDES/TYPE_OF, .zsh in default globs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two Codex CLI agents (GPT-5.4, high reasoning) working in parallel. Agent 015-A handled the adapter interface and cleanup. Agent 015-C handled new edge types and SymbolKinds. Both ran concurrently with Phase 014 Wave 3 agents. Verified with 18/18 indexer tests and clean ESLint.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Regex detection for new edge types (not waiting for tree-sitter) | DECORATES and TYPE_OF are reliably detected via regex. Ships value now; tree-sitter improves accuracy later. |
| `SPECKIT_PARSER=treesitter` throws rather than silently falling back | Explicit failure is safer than silent degradation. Developers who set the flag expect tree-sitter and should know it's not ready. |
| Wire excludeGlobs rather than remove | The option has legitimate use cases (excluding vendor directories, generated code). Removal would be a breaking API change. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tests/code-graph-indexer.vitest.ts` | PASS (18/18) |
| ESLint on structural-indexer.ts, indexer-types.ts | PASS (0 errors) |
| Phase 015 checklist | 12/13 items (tree-sitter WASM completed in Phase 017; 1 deferred: additional SymbolKinds) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Tree-sitter WASM implemented in Phase 017.** `tree-sitter-parser.ts` (696 LOC) with `web-tree-sitter` + `tree-sitter-wasms` deps. Now the default parser; regex remains as fallback via `SPECKIT_PARSER=regex`.
2. **OVERRIDES detection requires extends chain.** Only works when the parent class is defined in the same file or the extends relationship is captured. Cross-file inheritance detection is approximate.
3. **TYPE_OF captures type names, not resolved types.** Type aliases and re-exports may create edges to the alias rather than the underlying type.
4. **Additional SymbolKinds (decorator, property, constant) still deferred.** Tree-sitter can capture these but dedicated kind mappings not yet added.
<!-- /ANCHOR:limitations -->
