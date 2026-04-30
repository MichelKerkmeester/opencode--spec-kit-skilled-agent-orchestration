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

`mcp_server/code_graph/lib/structural-indexer.ts` plus `mcp_server/code_graph/lib/tree-sitter-parser.ts`

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/code_graph/lib/structural-indexer.ts` | Lib | Indexer orchestration plus regex fallback parser logic |
| `mcp_server/code_graph/lib/tree-sitter-parser.ts` | Lib | Default tree-sitter WASM parser adapter |
| `mcp_server/code_graph/lib/indexer-types.ts` | Lib | Type definitions, language detection, symbol/content hashing |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/code-graph-indexer.vitest.ts` | Parser accuracy across languages, edge extraction, fallback behavior |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation-and-code-graph/07-structural-code-indexer.md`
