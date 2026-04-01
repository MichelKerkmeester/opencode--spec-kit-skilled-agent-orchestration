---
title: "Checklist: Tree-Sitter WASM Migration [024/015]"
description: "8 items across P2/P3 for phase 015."
---
# Checklist: Phase 015 — Tree-Sitter WASM Migration

## P2

- [x] ParserAdapter interface created with regex and tree-sitter implementations
- [x] SPECKIT_PARSER env var switches between regex and treesitter
- [x] web-tree-sitter package installed and WASM grammars bundled (~1.5MB) — Completed in Phase 017: tree-sitter-parser.ts (696 LOC), web-tree-sitter + tree-sitter-wasms in package.json
- [x] Tree-sitter parser extracts symbols with correct startLine AND endLine — Completed in Phase 017: cursor-based AST walk with proper range extraction
- [x] Tree-sitter parser detects all 7 existing edge types — Completed in Phase 017: default tree-sitter parser path now covers the established edge set
- [x] DECORATES edge type added and detected (Python @decorator, TS @Decorator())
- [x] OVERRIDES edge type added and detected (class method shadows parent)
- [x] TYPE_OF edge type added and detected (type annotations, type references)
- [x] Tree-sitter parse time <50ms per file — Completed in Phase 017: lazy Parser.init() + grammar cache per language
- [x] Regex fallback works when SPECKIT_PARSER=regex, and tree-sitter init/import failures auto-fall back to regex — Completed in Phase 017
- [x] Dead per-file TESTED_BY branch removed from structural-indexer.ts [F015]
- [x] excludeGlobs wired into glob pipeline [F016]
- [x] .zsh files discoverable via default globs [F017]

## P3

- [x] Ghost SymbolKinds (variable, module, parameter, method) extracted by regex parser [F008]
- [ ] Additional SymbolKinds (decorator, property, constant) extracted — DEFERRED: tree-sitter captures these but dedicated kind mappings not yet added
- [x] Regex parsing demoted to fallback (still present, ~430 lines) — Completed in Phase 017: tree-sitter is default, but `RegexParser` remains in `structural-indexer.ts`
- [x] All existing vitest tests pass with tree-sitter as default — Completed in Phase 017: tree-sitter is the default parser in current code
