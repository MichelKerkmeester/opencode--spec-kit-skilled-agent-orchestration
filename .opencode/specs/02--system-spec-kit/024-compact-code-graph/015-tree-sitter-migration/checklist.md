---
title: "Checklist: Tree-Sitter WASM Migration [024/015]"
description: "8 items across P2/P3 for phase 015."
---
# Checklist: Phase 015 — Tree-Sitter WASM Migration

## P2

- [x] ParserAdapter interface created with regex and tree-sitter implementations
- [x] SPECKIT_PARSER env var switches between regex and treesitter
- [ ] web-tree-sitter package installed and WASM grammars bundled (~1.5MB) — DEFERRED: tree-sitter WASM impl is Phase 015-B (Item 32)
- [ ] Tree-sitter parser extracts symbols with correct startLine AND endLine — DEFERRED: awaits tree-sitter impl
- [ ] Tree-sitter parser detects all 7 existing edge types — DEFERRED: awaits tree-sitter impl
- [x] DECORATES edge type added and detected (Python @decorator, TS @Decorator())
- [x] OVERRIDES edge type added and detected (class method shadows parent)
- [x] TYPE_OF edge type added and detected (type annotations, type references)
- [ ] Tree-sitter parse time <50ms per file — DEFERRED: awaits tree-sitter impl
- [x] Regex fallback works when SPECKIT_PARSER=regex
- [x] Dead per-file TESTED_BY branch removed from structural-indexer.ts [F015]
- [x] excludeGlobs wired into glob pipeline [F016]
- [x] .zsh files discoverable via default globs [F017]

## P3

- [x] Ghost SymbolKinds (variable, module, parameter, method) extracted by regex parser [F008]
- [ ] Additional SymbolKinds (decorator, property, constant) extracted — DEFERRED: awaits tree-sitter
- [ ] Regex parsing functions removed from structural-indexer.ts (after stable period) — DEFERRED
- [ ] All existing vitest tests pass with tree-sitter as default — DEFERRED: awaits tree-sitter impl
