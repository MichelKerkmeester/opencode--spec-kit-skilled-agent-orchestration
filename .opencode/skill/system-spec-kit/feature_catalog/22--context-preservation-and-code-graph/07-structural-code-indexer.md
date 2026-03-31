---
title: "Structural code indexer"
description: "Structural code indexer extracts symbols from JS/TS/Python/Bash via regex-based parsing with deterministic symbolIds."
---

# Structural code indexer

## 1. OVERVIEW

Structural code indexer extracts symbols from JS/TS/Python/Bash via regex-based parsing with deterministic symbolIds.

Regex-based parser extracts functions, classes, methods, interfaces, type aliases, enums, imports, and exports. Generates deterministic symbolIds via SHA-256 hash. Content hashes enable incremental re-indexing. Tree-sitter WASM planned as future enhancement.

---

## 2. CURRENT REALITY

mcp_server/lib/code-graph/structural-indexer.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Lib` | Regex parser for 4 languages | mcp_server/lib/code-graph/indexer-types.ts |
| `Lib` | Type definitions and hash helpers | mcp_server/tests/code-graph-indexer.vitest.ts |

### Tests

| File | Focus |
|------|-------|
| `Parser accuracy across languages, edge extraction` | phase 008 |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Structural code indexer
- Current reality source: spec 024-compact-code-graph 
