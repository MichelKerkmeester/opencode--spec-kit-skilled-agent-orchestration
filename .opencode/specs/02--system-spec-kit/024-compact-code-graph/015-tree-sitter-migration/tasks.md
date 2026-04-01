---
title: "Tasks: Tree-Sitter Migration Foundation [024/015]"
description: "Task tracking for 13 items across adapter interface, new edge types, ghost SymbolKinds, and cleanup."
---
# Tasks: Phase 015 — Tree-Sitter Migration Foundation

## Completed

- [x] Item 31: ParserAdapter interface created (`parse(content, language): ParseResult`) — Evidence: structural-indexer.ts, RegexParser wraps all existing logic, `getParser()` dispatches via SPECKIT_PARSER env var
- [x] Item 31 / follow-through: `SPECKIT_PARSER=treesitter` now auto-falls back to regex on init/import failure — Completed in Phase 017. Evidence: `getParser()` catches tree-sitter init/import errors, logs a warning, and returns `new RegexParser()`
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

## Completed in Phase 017

- [x] Item 32: web-tree-sitter WASM implementation — Completed in Phase 017. Evidence: tree-sitter parser landed and `SPECKIT_PARSER` now defaults to `treesitter`
- [x] Tree-sitter as default parser (`SPECKIT_PARSER=treesitter`) — Completed in Phase 017. Evidence: default parser selection now prefers tree-sitter, with automatic regex fallback on init/import failure
- [x] Item 35 follow-through: regex parsing demoted to fallback instead of removed — Completed in Phase 017. Evidence: `RegexParser` still exists in `structural-indexer.ts` (~430 LOC) and is returned on init/import failure or explicit `SPECKIT_PARSER=regex`

## Deferred

- [ ] Additional SymbolKinds (decorator, property, constant) extraction — DEFERRED: requires tree-sitter AST for reliable detection
