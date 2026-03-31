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
contextType: "decision"
---
# Phase 008: Structural Indexer (tree-sitter)

## Summary

Extract structural symbols (functions, classes, methods, modules) and their relationships (calls, imports, containment) from JS/TS/Python/Shell source files using tree-sitter. Produce a normalized node/edge vocabulary that feeds Phase 009 storage and Phase 010 context bridge.

## What Exists

- CocoIndex Code MCP handles all semantic code search (embeddings, vector similarity, 28+ languages)
- No structural indexer exists in the repo today (confirmed iteration 055)
- tree-sitter has mature WASM grammars for all 4 target languages
- `code-graph.sqlite` schema designed in iteration 042 and refined in iteration 055

## Design Decisions

- **tree-sitter over LSP**: tree-sitter gives multi-language structural extraction in a single pass without per-language server overhead (DR-010)
- **Structural only**: No embeddings, no chunking, no vector search — CocoIndex handles all semantic retrieval
- **Content-hash freshness**: Index files by content hash; skip re-parse when hash matches
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
  tree-sitter parse (per-file, WASM grammars)
         |
         v
  Capture extraction (standardized @definition/@reference patterns)
         |
         v
  Node normalization (symbolId, fqName, file, line range, kind)
         |
         v
  Edge extraction (CONTAINS, CALLS, IMPORTS from captures)
         |
         v
  Content-hash check (skip if file unchanged)
         |
         v
  Write to code-graph.sqlite (Phase 009)
```

## What to Build

### 1. `structural-indexer.ts`

Core extraction pipeline:
- Accept file path + language → parse with tree-sitter
- Run standardized queries against parse tree
- Collect captures into normalized `CodeNode[]` and `CodeEdge[]`
- Return structured extraction result with parser health metadata

### 2. `tree-sitter-queries/`

Per-language query files:
- `javascript.scm` — function, class, method, import, export, call captures
- `typescript.scm` — extends JS with interface, type_alias, enum, implements
- `python.scm` — function_definition, class_definition, import_statement, decorator
- `bash.scm` — function_definition, command (conservative subset)

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

### 4. `incremental-index.ts`

Freshness and incremental re-indexing:
- Content-hash comparison per file
- Skip re-parse when hash matches stored hash
- Track `lastIndexedAt` timestamp
- Report stale files count for `code_graph_status`

## Acceptance Criteria

- [ ] tree-sitter parses JS/TS/Python/Shell without crashing on any repo file
- [ ] Standardized captures produce correct nodes for all 4 languages
- [ ] Edge extraction identifies CONTAINS, CALLS, IMPORTS relationships
- [ ] Content-hash skip works (unchanged files not re-parsed)
- [ ] Parser health metadata correctly distinguishes clean/recovered/error
- [ ] Incremental re-index completes in <5s for a 10-file change set
- [ ] Full index of repo completes in <30s
- [ ] Node symbolId is deterministic (same input → same ID)

## Files Modified

- NEW: `mcp_server/lib/code-graph/structural-indexer.ts`
- NEW: `mcp_server/lib/code-graph/indexer-types.ts`
- NEW: `mcp_server/lib/code-graph/incremental-index.ts`
- NEW: `mcp_server/lib/code-graph/tree-sitter-queries/javascript.scm`
- NEW: `mcp_server/lib/code-graph/tree-sitter-queries/typescript.scm`
- NEW: `mcp_server/lib/code-graph/tree-sitter-queries/python.scm`
- NEW: `mcp_server/lib/code-graph/tree-sitter-queries/bash.scm`
- NEW: `package.json` additions: `web-tree-sitter`, language grammars

## LOC Estimate

300-420 lines (core indexer + queries + types + incremental logic)
