---
title: "Structural code indexer"
description: "Structural code indexer orchestrates tree-sitter WASM symbol extraction by default, with regex fallback support for JS/TS/Python/Bash."
---

# Structural code indexer

## 1. OVERVIEW

Structural code indexer orchestrates tree-sitter WASM parsing by default, with regex fallback support for JS/TS/Python/Bash when the parser runtime is unavailable or explicitly forced.

The structural indexer extracts functions, classes, methods, interfaces, type aliases, enums, imports, and exports, then generates deterministic symbolIds via SHA-256 hash. Tree-sitter WASM is the default parser path (see 13-tree-sitter-wasm-parser.md), while the regex extractor remains as the compatibility fallback. Content hashes are still persisted for symbol identity and debugging, but the current incremental skip path is mtime-based: unchanged files are skipped via stored file mtimes, and deleted files are purged during incremental scans.

---

## 2. CURRENT REALITY

`mcp_server/lib/code-graph/structural-indexer.ts` plus `mcp_server/lib/code-graph/tree-sitter-parser.ts`

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/code-graph/structural-indexer.ts` | Lib | Indexer orchestration plus regex fallback parser logic |
| `mcp_server/lib/code-graph/tree-sitter-parser.ts` | Lib | Default tree-sitter WASM parser adapter |
| `mcp_server/lib/code-graph/indexer-types.ts` | Lib | Type definitions, language detection, symbol/content hashing |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/code-graph-indexer.vitest.ts` | Parser accuracy across languages, edge extraction, fallback behavior |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Structural code indexer
- Current reality source: spec 024-compact-code-graph phases 008, 015, and 017
