---
title: "Tree-Sitter WASM parser"
description: "Structural code parser using web-tree-sitter with prebuilt WASM grammars for JS/TS/Python/Bash, replacing regex-based extraction with cursor-based AST walks."
---

# Tree-Sitter WASM parser

## 1. OVERVIEW

Structural code parser using web-tree-sitter with prebuilt WASM grammars for JS/TS/Python/Bash, replacing regex-based extraction with cursor-based AST walks.

The tree-sitter parser implements the ParserAdapter interface, lazily initializing WASM grammars on first use. It performs cursor-based AST traversal to extract RawCapture arrays compatible with capturesToNodes() and extractEdges() from the structural indexer. Grammar WASM files are loaded from tree-sitter-wasms and cached per language. Content hashing enables incremental re-indexing. This replaces the regex-based parser for higher accuracy on nested constructs and edge cases. The isReady() check now verifies ALL registered grammars are loaded rather than just the first one, preventing false-ready states when only a subset of grammars initialized.

---

## 2. CURRENT REALITY

mcp_server/lib/code-graph/tree-sitter-parser.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/code-graph/tree-sitter-parser.ts` | Lib | WASM-based AST parser with lazy init and grammar caching |
| `mcp_server/lib/code-graph/grammars/` | Assets | Tree-sitter query files per language |
| `mcp_server/lib/code-graph/queries/` | Assets | S-expression query patterns for symbol extraction |
| `mcp_server/lib/code-graph/indexer-types.ts` | Lib | Shared types (ParseResult, SupportedLanguage, SymbolKind) |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Tree-Sitter WASM parser
- Current reality source: spec 024-compact-code-graph phase 015/017
