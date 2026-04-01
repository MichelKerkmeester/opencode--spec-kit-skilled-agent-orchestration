---
title: "259 -- Tree-sitter WASM parser extracts symbols from TS file"
description: "This scenario validates Tree-Sitter WASM parser for 259. It focuses on parsing a TypeScript file with classes/functions and verifying symbol extraction accuracy."
---

# 259 -- Tree-sitter WASM parser extracts symbols from TS file

## 1. OVERVIEW

This scenario validates Tree-Sitter WASM parser.

---

## 2. CURRENT REALITY

- **Objective**: Verify that the tree-sitter WASM parser (`tree-sitter-parser.ts`) correctly parses TypeScript files and extracts function declarations, class definitions, method definitions, interfaces, type aliases, imports, and exports as RawCapture arrays. The parser must lazily initialize WASM grammars, cache them per language, produce results compatible with capturesToNodes() and extractEdges() from structural-indexer.ts, and generate correct content hashes for incremental re-indexing.
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - tree-sitter-wasms package installed with WASM grammar files
- **Prompt**: `Validate 259 Tree-sitter WASM parser. Parse a TypeScript file containing classes, functions, interfaces, and imports. Confirm: (1) parser initializes WASM grammar lazily on first call, (2) cursor-based AST walk produces RawCapture[] for each symbol, (3) classes and their methods are extracted as separate nodes, (4) import statements are captured with source module, (5) content hash is generated for the file, (6) results are compatible with capturesToNodes() and extractEdges().`
- **Expected signals**:
  - WASM grammar loaded from tree-sitter-wasms for TypeScript
  - ParseResult contains nodes for functions, classes, methods, interfaces, type aliases
  - Import nodes include source module path
  - Content hash matches SHA-256 of file content
  - RawCapture array is accepted by capturesToNodes() without errors
- **Pass/fail criteria**:
  - PASS: All symbol types extracted from fixture TS file, content hash valid, captures compatible with indexer pipeline
  - FAIL: Missing symbol types, WASM init failure, or incompatible capture format

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 259a | Tree-Sitter WASM parser | Parse TS file with classes and extract class/method/function nodes | `Validate 259a TS class/method extraction` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | Nodes extracted for class declarations, method definitions, standalone functions with correct fqName and line numbers | Test output showing node types and counts | PASS if classes, methods, and functions all extracted with correct metadata | Check tree-sitter query patterns in queries/ directory for TypeScript |
| 259b | Tree-Sitter WASM parser | Parse TS file and extract import/interface/type nodes | `Validate 259b import/interface/type extraction` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | Nodes for import statements (with source module), interfaces, type aliases | Test output showing import/interface/type nodes | PASS if imports include source path, interfaces and types captured | Check if tree-sitter grammar covers TypeScript-specific constructs |
| 259c | Tree-Sitter WASM parser | Content hash and edge extraction compatibility | `Validate 259c hash and edge compat` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | Content hash is valid SHA-256, extractEdges() produces call/import edges from captures | Test output showing hash and edge creation | PASS if hash matches and edges correctly link caller to callee | Verify generateContentHash() and extractEdges() integration |
| 259d | Tree-Sitter WASM parser | Partial grammar load recovery | `Validate 259d partial grammar load recovery` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/tree-sitter-parser.vitest.ts tests/code-graph-indexer.vitest.ts` | A single grammar load failure does not crash the parser process, unaffected languages still parse correctly, and `TreeSitterParser.isReady(language)` reflects per-language readiness while global `TreeSitterParser.isReady()` remains false until all grammars load | Vitest output showing failed grammar path plus successful parsing for another language | PASS if one broken grammar does not prevent working grammars from parsing and readiness stays accurate per language | Check `lib/code-graph/tree-sitter-parser.ts` grammar cache behavior; note current implementation exposes boolean readiness, not a separate partial-status object |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/13-tree-sitter-wasm-parser.md](../../feature_catalog/22--context-preservation-and-code-graph/13-tree-sitter-wasm-parser.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 259
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/259-tree-sitter-parser.md`
