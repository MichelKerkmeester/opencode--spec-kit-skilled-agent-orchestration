---
title: "Spec: Tree-Sitter WASM Migration [024/015]"
description: "Replace regex parser with tree-sitter WASM for 99% parse accuracy. Add DECORATES, OVERRIDES, TYPE_OF edge types. Adapter interface for fallback. Clean up dead code (TESTED_BY, excludeGlobs, .zsh)."
---
# Spec: Phase 015 — Tree-Sitter WASM Migration

## Summary

Migrate the structural indexer from regex patterns (~70% accuracy) to tree-sitter WASM (~99% accuracy). This enables 3 new edge types only possible with AST-level parsing. The adapter interface keeps regex as a permanent fallback. Bundle size: ~1.5MB.

## Items

### P2

**Item 17: Parser adapter interface (sub-phase C1)**
- Create `ParserAdapter` interface that both regex and tree-sitter implement
- ParseResult is already parser-agnostic; extractEdges() needs zero changes
- Allow runtime selection: `SPECKIT_PARSER=regex|treesitter` env var
- Files: `mcp_server/lib/code-graph/structural-indexer.ts`
- LOC: 40-60

**Item 18: Tree-sitter WASM implementation (sub-phase C2)**
- Use `web-tree-sitter` package (NOT native node-tree-sitter)
- Load WASM grammars: tree-sitter-javascript (~200KB), tree-sitter-typescript (~500KB), tree-sitter-python (~150KB), tree-sitter-bash (~100KB)
- Parse files to AST, extract symbols with correct startLine/endLine
- S-expression queries for CALLS, IMPORTS, CONTAINS, EXPORTS, EXTENDS, IMPLEMENTS
- Files: new `mcp_server/lib/code-graph/tree-sitter-parser.ts`, `package.json`
- LOC: 200-280

**Item 19: New edge types (sub-phase C3)**
- DECORATES: detect `@decorator` patterns in Python, `@Decorator()` in TypeScript
- OVERRIDES: detect method definitions that shadow parent class methods
- TYPE_OF: detect type annotations and type references
- Files: `indexer-types.ts` (add to EdgeType enum), `structural-indexer.ts` or `tree-sitter-parser.ts`
- LOC: 83-125

### P3

**Item 34: Extract ghost SymbolKinds (includes method)**
- variable, module, parameter defined in SymbolKind but never extracted
- **method** nodes also never emitted for JS/TS class methods (review F008)
- Tree-sitter AST makes extraction straightforward
- Files: `indexer-types.ts`, parser implementation
- LOC: 40-60

**Item 21: Regex removal (sub-phase C4)**
- Only after tree-sitter proven stable in production
- Remove regex parsing functions from structural-indexer.ts
- Keep adapter interface for future parser alternatives
- LOC: -120 to -150 (net reduction)

## Bundle Size

| Grammar | Size |
|---------|------|
| tree-sitter core WASM | ~300KB |
| JavaScript | ~200KB |
| TypeScript | ~500KB |
| Python | ~150KB |
| Bash | ~100KB |
| **Total** | **~1.5MB** |

## Migration Path (DR-014)

```
C1: Adapter interface (40-60 LOC)        ← DONE
  → C2: Tree-sitter WASM impl (200-280 LOC) ← DEFERRED (Item 32)
    → C3: New edge types (83-125 LOC)    ← DONE (via regex)
      → C4: Remove regex (optional)      ← DEFERRED (Item 35)
```

## Completion Status

| Sub-phase | Status | Notes |
|-----------|--------|-------|
| C1: Adapter interface | **DONE** | ParserAdapter + RegexParser + SPECKIT_PARSER env var |
| C2: Tree-sitter WASM | **DEFERRED** | Requires `web-tree-sitter` package + grammar downloads |
| C3: New edge types | **DONE** | DECORATES, OVERRIDES, TYPE_OF via regex detection |
| C3.5: Cleanup | **DONE** | Dead TESTED_BY, excludeGlobs wired, .zsh globs |
| C4: Regex removal | **DEFERRED** | Requires tree-sitter stable first |

## Deferred Items — Future Work

### Item 32: Tree-Sitter WASM Implementation
**Status:** DEFERRED — external dependency required
**Dependency:** `web-tree-sitter` npm package + WASM grammar files (~1.5MB total)
**Pre-requisite:** ParserAdapter interface (Item 31) is ready as the integration point
**Implementation plan:**
1. `npm install web-tree-sitter`
2. Download WASM grammars to `lib/code-graph/grammars/`: tree-sitter-javascript (~200KB), tree-sitter-typescript (~500KB), tree-sitter-python (~150KB), tree-sitter-bash (~100KB)
3. Implement `TreeSitterParser` class implementing `ParserAdapter`
4. Lazy grammar loading (init on first parse, cache for subsequent)
5. S-expression queries for all 10 edge types
6. Set `SPECKIT_PARSER=treesitter` as default after validation
**Estimated LOC:** 200-280
**Risk:** HIGH — WASM loading in MCP server context, grammar compatibility across Node.js versions

### Item 35: Regex Parser Removal
**Status:** DEFERRED — requires tree-sitter stable
**Dependency:** Item 32 must be stable in production for at least 1 week
**Implementation plan:**
1. Set tree-sitter as default (`SPECKIT_PARSER=treesitter`)
2. Run full test suite with tree-sitter
3. Monitor for 1 week in production
4. Remove regex parsing functions (keep adapter interface)
**Estimated LOC:** -120 to -150 (net reduction)

### P2 — Cleanup (new from 30-iteration review)

**Item 36: Remove dead per-file TESTED_BY branch**
- structural-indexer.ts has a per-file TESTED_BY code path that is never triggered
- Dead code, no runtime effect — only cross-file TESTED_BY works
- Fix: remove the dead branch
- Files: `mcp_server/lib/code-graph/structural-indexer.ts`
- Evidence: review F015

**Item 37: Wire or remove excludeGlobs option**
- `excludeGlobs` is exposed as an option but never consulted during file discovery
- Either wire it into the glob pipeline or remove the option
- Files: `mcp_server/lib/code-graph/structural-indexer.ts`
- Evidence: review F016

**Item 38: Fix .zsh language mapping**
- `.zsh` is mapped in the language table but default file discovery globs never match `.zsh` files
- Fix: add `**/*.zsh` to default globs, or remove `.zsh` from language mapping
- Files: `mcp_server/lib/code-graph/indexer-types.ts`
- Evidence: review F017

## Estimated LOC: 220-345 (net, after optional C4)
## Dependencies: Phase 013 (endLine fix enables comparison testing)
## Risk: HIGH — WASM loading in MCP server context, grammar compatibility
