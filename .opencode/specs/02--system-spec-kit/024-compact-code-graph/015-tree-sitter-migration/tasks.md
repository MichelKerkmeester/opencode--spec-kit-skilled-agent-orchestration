---
title: "Tasks: Tree-Sitter Migration Foundation [024/015]"
description: "Task tracking for 13 items across adapter interface, new edge types, ghost SymbolKinds, and cleanup."
---
# Tasks: Phase 015 — Tree-Sitter Migration Foundation

## Completed

- [x] Item 31: ParserAdapter interface created (`parse(content, language): ParseResult`) — Evidence: structural-indexer.ts, RegexParser wraps all existing logic, `getParser()` dispatches via SPECKIT_PARSER env var
- [x] Item 31: SPECKIT_PARSER=treesitter throws clear error until WASM impl lands — Evidence: explicit failure, not silent fallback
- [x] Item 33: DECORATES edge type added (confidence 0.9) — Evidence: indexer-types.ts EdgeType union, extractEdges() in structural-indexer.ts; detects `@decorator` in Python/TS
- [x] Item 33: OVERRIDES edge type added (confidence 0.9) — Evidence: extractEdges() detects class methods shadowing parent via extends chain tracking
- [x] Item 33: TYPE_OF edge type added (confidence 0.85) — Evidence: extractEdges() detects `: TypeName` annotations and type references in function signatures
- [x] Item 34: Ghost SymbolKind `method` now extracted for JS/TS class methods — Evidence: regex parser emits method nodes (previously reported as function) [F008]
- [x] Item 34: Ghost SymbolKind `variable` now extracted — Evidence: regex parser detects `const`/`let`/`var` declarations
- [x] Item 34: Ghost SymbolKind `parameter` now extracted — Evidence: regex parser detects function parameters with type annotations
- [x] Item 34: Ghost SymbolKind `module` now extracted — Evidence: regex parser detects module-level export patterns
- [x] Item 36: Dead per-file TESTED_BY branch removed from structural-indexer.ts — Evidence: cross-file heuristic preserved, per-file dead code path deleted [F015]
- [x] Item 37: excludeGlobs wired into glob pipeline — Evidence: `globToRegExp()` + `shouldExcludePath()` in structural-indexer.ts [F016]
- [x] Item 38: .zsh files discoverable via default globs — Evidence: `**/*.zsh` added to default globs in indexer-types.ts [F017]
- [x] Regex fallback verified working when SPECKIT_PARSER=regex — Evidence: 18/18 indexer tests pass

## Deferred

- [ ] Item 32: web-tree-sitter WASM implementation — DEFERRED: requires `web-tree-sitter` npm package + WASM grammar downloads (~1.5MB). ParserAdapter interface ready as integration point. Sub-phase C2.
- [ ] Item 35: Regex parser removal from structural-indexer.ts — DEFERRED: requires tree-sitter stable in production for 1+ week before removal. Sub-phase C4.
- [ ] Tree-sitter as default parser (`SPECKIT_PARSER=treesitter`) — DEFERRED: awaits Item 32 implementation and validation
- [ ] Additional SymbolKinds (decorator, property, constant) extraction — DEFERRED: requires tree-sitter AST for reliable detection
