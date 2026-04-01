---
title: "Phase 008: Structural Indexer (tree-sitter) [02--system-spec-kit/024-compact-code-graph/008-structural-indexer/spec]"
description: "Extract structural symbols (functions, classes, methods, modules) and their relationships (calls, imports, containment) from JS/TS/Python/Shell source files using tree-sitter. P..."
trigger_phrases:
  - "phase"
  - "008"
  - "structural"
  - "indexer"
  - "tree"
  - "spec"
importance_tier: "important"
contextType: "implementation"
---
# Phase 008: Structural Indexer (tree-sitter)

## Summary

Extract structural symbols (functions, classes, methods, modules) and their relationships (calls, imports, containment) from JS/TS/Python/Shell source files using tree-sitter WASM as the default parser, with regex fallback when tree-sitter is unavailable or `SPECKIT_PARSER=regex`. Produce a normalized node/edge vocabulary that feeds Phase 009 storage and Phase 010 context bridge.

## What Exists

- CocoIndex Code MCP handles all semantic code search (embeddings, vector similarity, 28+ languages)
- A structural indexer now exists with dual-backend support split across `structural-indexer.ts` and `tree-sitter-parser.ts`
- `mcp_server/package.json` includes `web-tree-sitter` and `tree-sitter-wasms` for the default parser backend
- `code-graph.sqlite` schema designed in iteration 042 and refined in iteration 055

## Design Decisions

- **tree-sitter default over LSP or regex-only**: tree-sitter gives AST-accurate multi-language structural extraction in a single pass without per-language server overhead, while regex remains available as a fallback backend (DR-010)
- **Structural only**: No embeddings, no chunking, no vector search — CocoIndex handles all semantic retrieval
- **Programmatic AST traversal over `.scm` queries**: tree-sitter capture extraction happens in code via AST walking, so separate query files are unnecessary for this phase
- **Content-hash freshness in the indexer**: Index files by content hash, with parsing and file discovery handled directly in `structural-indexer.ts`
- **Parser health tracking**: Record whether parse produced a clean tree or error-recovered tree; flag files with parser errors

## Languages

| Language | Grammar | Priority | Node Types |
|----------|---------|----------|------------|
| JavaScript | tree-sitter-javascript | P0 | function, class, method, arrow_function, variable_declarator |
| TypeScript | tree-sitter-typescript | P0 | function, class, method, interface, type_alias, enum |
| Python | tree-sitter-python | P1 | function_definition, class_definition, decorated_definition |
| Shell | tree-sitter-bash | P2 | function_definition, command (conservative) |

## Node Vocabulary

Standardized capture names across all grammars:

| Capture | Maps To | Example |
|---------|---------|---------|
| `@definition.function` | function node | `function foo()`, `def bar():` |
| `@definition.class` | class node | `class Foo`, `class Bar:` |
| `@definition.method` | method node | `handle()` inside class |
| `@definition.module` | file/module node | `src/auth/middleware.ts` |
| `@reference.call` | CALLS edge | `foo()`, `bar.baz()` |
| `@reference.import` | IMPORTS edge | `import { x } from 'y'`, `from y import x` |
| `@definition.export` | EXPORTS edge | `export function`, `module.exports` |

## Edge Vocabulary

| Edge Type | Direction | Source | Target |
|-----------|-----------|--------|--------|
| `CONTAINS` | parent → child | file/class | function/method |
| `CALLS` | caller → callee | function | function |
| `IMPORTS` | importer → imported | file | file/symbol |
| `EXPORTS` | file → symbol | file | function/class |
| `EXTENDS` | subclass → superclass | class | class |
| `IMPLEMENTS` | class → interface | class | interface (TS only) |

Optional edges (extract only when reliable):
- `TESTED_BY`: test file → tested module (heuristic: filename pattern + import)
- `CONFIGURES`: config file → configured module (low confidence, defer to v2)

## Architecture

```
Source files (JS/TS/Python/Shell)
         |
         v
  getParser()
    ├─ tree-sitter WASM (default)
    └─ regex fallback (env override or init failure)
         |
         v
  Programmatic AST traversal / regex capture extraction
         |
         v
  Node normalization (symbolId, fqName, file, line range, kind)
         |
         v
  Edge extraction (CONTAINS, CALLS, IMPORTS from captures)
         |
         v
  File discovery + content-hash freshness in structural-indexer.ts
         |
         v
  Write to code-graph.sqlite (Phase 009)
```

## What to Build

### 1. `structural-indexer.ts`

Core extraction pipeline:
- Accept file path + language → select parser backend via `getParser()`
- Default to tree-sitter WASM, with regex fallback via `SPECKIT_PARSER=regex` or automatic fallback on init failure
- Handle file discovery, parse orchestration, normalized `CodeNode[]` / `CodeEdge[]` generation, and content-hash freshness
- Return structured extraction result with parser health metadata

### 2. `tree-sitter-parser.ts`

Tree-sitter backend:
- Load WASM grammars programmatically for JavaScript, TypeScript, Python, and Bash
- Walk ASTs directly to extract `RawCapture[]` compatible with `structural-indexer.ts`
- Avoid `.scm` query files by encoding traversal rules in code

### 3. `indexer-types.ts`

Shared type definitions:
```typescript
interface CodeNode {
  symbolId: string;        // deterministic hash: file + kind + name + line
  fqName: string;          // fully qualified: package#Module.method
  filePath: string;
  startLine: number;
  endLine: number;
  kind: 'function' | 'class' | 'method' | 'module' | 'interface' | 'type' | 'enum';
  language: string;
  contentHash: string;     // for incremental re-indexing
}

interface CodeEdge {
  sourceId: string;
  targetId: string;
  edgeType: 'CONTAINS' | 'CALLS' | 'IMPORTS' | 'EXPORTS' | 'EXTENDS' | 'IMPLEMENTS';
  confidence: number;      // 0.0-1.0, lower for heuristic edges
}

interface ParseResult {
  nodes: CodeNode[];
  edges: CodeEdge[];
  parserHealth: 'clean' | 'recovered' | 'error';
  parseTimeMs: number;
}
```

## Acceptance Criteria

- [ ] tree-sitter parses JS/TS/Python/Shell by default without crashing on any repo file
- [ ] Regex fallback activates when `SPECKIT_PARSER=regex` is set or tree-sitter initialization fails
- [ ] Standardized captures produce correct nodes for all 4 languages
- [ ] Programmatic AST traversal produces standardized captures without requiring `.scm` query files
- [ ] Edge extraction identifies CONTAINS, CALLS, IMPORTS relationships
- [ ] Content-hash freshness and file discovery work from `structural-indexer.ts`
- [ ] Parser health metadata correctly distinguishes clean/recovered/error
- [ ] Incremental re-index completes in <5s for a 10-file change set
- [ ] Full index of repo completes in <30s
- [ ] Node symbolId is deterministic (same input → same ID)

## Files Modified

- NEW: `mcp_server/lib/code-graph/structural-indexer.ts`
- NEW: `mcp_server/lib/code-graph/tree-sitter-parser.ts`
- NEW: `mcp_server/lib/code-graph/indexer-types.ts`
- MODIFIED: `mcp_server/package.json` additions: `web-tree-sitter`, `tree-sitter-wasms`

## LOC Estimate

850-1100 lines (core indexer + tree-sitter adapter + shared types, with no separate `.scm` query pack or `incremental-index.ts` module)
