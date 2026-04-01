---
title: "Plan: Tree-Sitter WASM Migration [024/015]"
description: "Phase 015 plan for adapter-first migration to tree-sitter. Current-state notes reflect that Phase 017 made tree-sitter default and kept regex as fallback."
---
# Plan: Phase 015 — Tree-Sitter WASM Migration

## Implementation Order

### Sub-phase C1: Adapter Interface (item 17)
1. Define `ParserAdapter` interface: `parse(content: string, language: string): ParseResult`
2. Wrap existing regex parsers behind adapter
3. Add `SPECKIT_PARSER` env var for runtime selection
4. Verify: all existing tests pass with adapter wrapping regex

### Sub-phase C2: Tree-Sitter Implementation (item 18)
1. `npm install web-tree-sitter`
2. Download WASM grammars to `mcp_server/lib/code-graph/grammars/`
3. Implement `TreeSitterParser` class implementing `ParserAdapter`
4. Grammar init: lazy load on first parse (cache for subsequent)
5. S-expression queries for existing 7 edge types
6. Verify: compare tree-sitter output vs regex for same input files
7. Current state note: completed later in Phase 017; tree-sitter is now the default parser and init/import failures auto-fall back to `RegexParser`

### Sub-phase C3: New Edge Types (item 19, 20)
1. Add DECORATES, OVERRIDES, TYPE_OF to EdgeType enum
2. Add variable, module, parameter to SymbolKind in this phase; decorator/property/constant remain deferred
3. Implement S-expression queries for new types
4. Verify: new edges appear in graph for test fixtures

### Sub-phase C3.5: Dead Code Cleanup (items 36-38)
1. Remove dead per-file TESTED_BY branch from structural-indexer.ts [F015]
2. Wire `excludeGlobs` into glob pipeline or remove from options [F016]
3. Add `**/*.zsh` to default globs or remove `.zsh` from language mapping [F017]

### Sub-phase C4: Regex Removal (item 35)
1. Set tree-sitter as default parser (`SPECKIT_PARSER=treesitter`)
2. Run full test suite
3. Monitor for 1 week in production
4. Original plan: remove regex functions (keep adapter interface)
5. Current state note: Phase 017 did not remove regex; it demoted regex to fallback and left ~430 lines of parser logic in `structural-indexer.ts`

## Rollback Plan
- Regex stays as permanent fallback via adapter
- `SPECKIT_PARSER=regex` reverts to prior behavior
- If tree-sitter init/import fails while selected or defaulted, `getParser()` logs a warning and automatically returns `new RegexParser()`
- No schema changes needed (same ParseResult output)

## Testing
- Compare regex vs tree-sitter output for identical input
- Verify endLine correctness for multi-line functions
- Verify new edge types detected correctly
- Performance: tree-sitter parse time <50ms per file
- Verify .zsh files discoverable after glob fix (or mapping removed)
- Verify excludeGlobs either works or is gone from API surface
- Verify automatic fallback path when tree-sitter init/import fails
