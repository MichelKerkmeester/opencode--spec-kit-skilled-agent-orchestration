---
title: "259 -- Tree-sitter WASM parser extracts symbols from TS file"
description: "This scenario validates Tree-Sitter WASM parser for 259. It focuses on parsing a TypeScript file with classes/functions and verifying symbol extraction accuracy."
audited_post_018: true
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
- **Prompt**: `As a context-and-code-graph validation operator, validate Tree-sitter WASM parser extracts symbols from TS file against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts. Verify the tree-sitter WASM parser (tree-sitter-parser.ts) correctly parses TypeScript files and extracts function declarations, class definitions, method definitions, interfaces, type aliases, imports, and exports as RawCapture arrays. The parser must lazily initialize WASM grammars, cache them per language, produce results compatible with capturesToNodes() and extractEdges() from structural-indexer.ts, and generate correct content hashes for incremental re-indexing. Return a concise pass/fail verdict with the main reason and cited evidence.`
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

### Prompt

```
As a context-and-code-graph validation operator, validate Parse TS file with classes and extract class/method/function nodes against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts. Verify nodes extracted for class declarations, method definitions, standalone functions with correct fqName and line numbers. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts

### Expected

Nodes extracted for class declarations, method definitions, standalone functions with correct fqName and line numbers

### Evidence

Test output showing node types and counts

### Pass / Fail

- **Pass**: classes, methods, and functions all extracted with correct metadata
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check tree-sitter query patterns in queries/ directory for TypeScript

---

### Prompt

```
As a context-and-code-graph validation operator, validate Parse TS file and extract import/interface/type nodes against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts. Verify nodes for import statements (with source module), interfaces, type aliases. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts

### Expected

Nodes for import statements (with source module), interfaces, type aliases

### Evidence

Test output showing import/interface/type nodes

### Pass / Fail

- **Pass**: imports include source path, interfaces and types captured
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check if tree-sitter grammar covers TypeScript-specific constructs

---

### Prompt

```
As a context-and-code-graph validation operator, validate Content hash and edge extraction compatibility against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts. Verify content hash is valid SHA-256, extractEdges() produces call/import edges from captures. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts

### Expected

Content hash is valid SHA-256, extractEdges() produces call/import edges from captures

### Evidence

Test output showing hash and edge creation

### Pass / Fail

- **Pass**: hash matches and edges correctly link caller to callee
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify generateContentHash() and extractEdges() integration

---

### Prompt

```
As a context-and-code-graph validation operator, validate Partial grammar load recovery against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/tree-sitter-parser.vitest.ts tests/code-graph-indexer.vitest.ts. Verify a single grammar load failure does not crash the parser process, unaffected languages still parse correctly, and TreeSitterParser.isReady(language) reflects per-language readiness while global TreeSitterParser.isReady() remains false until all grammars load. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/tree-sitter-parser.vitest.ts tests/code-graph-indexer.vitest.ts

### Expected

A single grammar load failure does not crash the parser process, unaffected languages still parse correctly, and `TreeSitterParser.isReady(language)` reflects per-language readiness while global `TreeSitterParser.isReady()` remains false until all grammars load

### Evidence

Vitest output showing failed grammar path plus successful parsing for another language

### Pass / Fail

- **Pass**: one broken grammar does not prevent working grammars from parsing and readiness stays accurate per language
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `lib/code-graph/tree-sitter-parser.ts` grammar cache behavior; note current implementation exposes boolean readiness, not a separate partial-status object

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/13-tree-sitter-wasm-parser.md](../../feature_catalog/22--context-preservation-and-code-graph/13-tree-sitter-wasm-parser.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 259
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/259-tree-sitter-parser.md`
