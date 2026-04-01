# Changelog: 024/008-structural-indexer

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 008-structural-indexer — 2026-03-31

The memory system could save and search text, but it had no understanding of code structure. It couldn't tell you which functions call which, what a class contains, or how files import each other. Without this structural map, the upcoming code graph (Phase 009 storage, Phase 010 context bridge) would have nothing to store. This phase builds a structural indexer that reads JS/TS/Python/Shell source files and extracts a normalized vocabulary of symbols (functions, classes, methods, modules) and their relationships (calls, imports, containment, inheritance). It uses regex-based parsing -- zero external dependencies, no WASM runtimes to load -- and indexes the entire 835-file repository in 416ms. The result is a clean, typed data pipeline that later phases plug into for storage and AI-assisted code navigation.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/008-structural-indexer/`

---

## What Changed

### New Features (6)

---

### Structural indexer for JavaScript and TypeScript

**Problem:** The system had no way to extract structural symbols -- functions, classes, methods, interfaces, type aliases, enums, arrow functions, or variable declarators -- from JavaScript and TypeScript files. These are the two most-used languages in the project, so any code graph built without them would be missing most of the codebase. Without extraction, the AI assistant could not answer questions like "what methods does this class have?" or "which functions are defined in this file?"

**Fix:** Built a unified regex parser (`parseJsTs`) that handles both JavaScript and TypeScript in a single pass. It identifies all major symbol types (functions, classes, methods, interfaces, type aliases, enums, arrow functions, and variable declarators) and produces normalized `CodeNode[]` arrays. Each node gets a deterministic ID, a fully qualified name (so you can distinguish two methods named `handle` in different classes), and a line range pinpointing where the symbol lives in the file. This gives the code graph its primary source of structural data for the project's most prevalent languages.

---

### Structural indexer for Python

**Problem:** Python files were completely invisible to the code graph. Any Python scripts, validators, or utilities in the repository could not be mapped, meaning the structural index would have a blind spot covering an entire language.

**Fix:** Added a regex parser that extracts `function_definition`, `class_definition`, and `decorated_definition` symbols from Python source files. Decorated definitions are included because Python heavily uses decorators (annotations placed above functions or classes that modify their behavior), and ignoring them would miss important structural markers. With Python support, the indexer covers the full codebase rather than just the TypeScript portions.

---

### Structural indexer for Shell scripts

**Problem:** Shell scripts (Bash automation, deployment scripts, CI helpers) had no structural extraction at all. They would be excluded from the code graph entirely, leaving gaps in the project's structural map.

**Fix:** Added a conservative parser that extracts only `function_definition` patterns from shell scripts. The parser deliberately avoids capturing `command` invocations (individual lines that run programs), because shell scripts call dozens of commands per file and capturing all of them would flood the graph with noisy, low-value data. By restricting extraction to function definitions, shell scripts become part of the code graph without polluting it with unreliable entries.

---

### Edge extraction across seven relationship types

**Problem:** Knowing that symbols exist is only half the picture. To answer questions like "what does this function call?" or "which files import this module?", the system needs to understand how symbols connect to each other. Without relationship data, the code graph would be a collection of isolated dots with no lines between them.

**Fix:** Built an `extractEdges` function that identifies seven types of relationships between symbols:

- **CONTAINS** -- a class owns a method (parent-child nesting)
- **CALLS** -- one function invokes another function
- **IMPORTS** -- a file imports another file or a specific symbol from it
- **EXPORTS** -- a file makes a symbol available to other files
- **EXTENDS** -- a subclass inherits from a superclass (building on its behavior)
- **IMPLEMENTS** -- a class fulfills an interface contract (TypeScript only, meaning the class promises to provide certain methods/properties)
- **TESTED_BY** -- a test file covers a particular module (detected by filename patterns and import analysis)

Each edge carries a confidence score between 0 and 1, reflecting how reliable the extraction is. For example, a `CONTAINS` edge (class owns method) is highly reliable, while a `TESTED_BY` edge (inferred from filename heuristics) is lower confidence. Downstream consumers can filter by confidence to control quality.

---

### Deterministic symbol IDs

**Problem:** If the same file is indexed twice -- say, after a restart or a scheduled re-index -- the symbols need to produce the exact same identifiers each time. Without this guarantee, the graph would accumulate duplicate entries for the same function or class, inflating storage and corrupting relationship data.

**Fix:** Each `symbolId` is computed as a SHA-256 hash (a one-way fingerprint algorithm) of three inputs: the file path, the fully qualified name, and the symbol kind. Because the same inputs always produce the same hash, re-indexing the same file yields identical IDs. SHA-256 is also collision-resistant, meaning the chance of two different symbols accidentally sharing the same ID is astronomically small across the entire codebase.

---

### Incremental re-indexing

**Problem:** Re-parsing the entire 835-file repository every time a single file changes would be wasteful. A full index takes 416ms, which is fast, but unnecessary work adds up during development when files change frequently.

**Fix:** Built a content-hash comparison system that stores a fingerprint of each file's contents after parsing it. On subsequent indexing runs, the system checks each file's current hash against the stored value and skips re-parsing any file that hasn't changed. A 10-file incremental update completes in just 6ms (compared to 416ms for the full repository). The system also tracks and reports how many files are "stale" (changed but not yet re-indexed), feeding this count to the `code_graph_status` tool so users can see indexing health at a glance.

---

### Architecture (4)

---

### Shared type vocabulary for the data pipeline

**Problem:** The structural indexer, the storage layer (Phase 009), and the context bridge (Phase 010) all need to agree on what a "node" and an "edge" look like. Without a shared contract, each component could define its own incompatible data shapes, leading to translation bugs and maintenance headaches when the format changes.

**Fix:** Created `indexer-types.ts` defining three TypeScript interfaces -- `CodeNode`, `CodeEdge`, and `ParseResult` -- as the shared contract used by all components. `ParseResult` bundles the extracted nodes and edges together with parser health status (indicating whether the parse was clean, partially recovered from errors, or failed) and parse duration in milliseconds. This metadata lets downstream consumers assess both the data and the quality of the extraction that produced it.

---

### Regex-based parsing instead of tree-sitter

**Problem:** The original spec called for tree-sitter, a popular code parsing library that uses WebAssembly (WASM) grammar files to build precise syntax trees. However, tree-sitter would add external package dependencies and WASM loading complexity to the project, increasing install size and startup time for a system that needs to remain lightweight.

**Fix:** Replaced tree-sitter with regex-based parsing (pattern matching against source text). Regex parsing achieves sufficient accuracy for structural extraction -- identifying function definitions, class declarations, import statements, and similar patterns -- without any external dependencies. The tradeoff is that regex parsing is approximate: edge cases involving deeply nested code, string literals that look like function definitions, or complex comment blocks can produce false captures. Tree-sitter is planned as a Phase 015 enhancement for when AST-accurate parsing (building a complete syntax tree) justifies the additional dependency cost.

---

### 100KB file size guard

**Problem:** Repositories often contain generated files, vendored third-party libraries, and build artifacts that can be hundreds of kilobytes or even megabytes. Running regex parsers on these oversized files would cause extremely long parse times or even crashes, without yielding useful structural data (since generated code is not authored code worth mapping).

**Fix:** Files exceeding 100KB are automatically skipped with a warning log entry rather than being parsed. This protects against pathological parse times without requiring anyone to maintain manual exclusion lists. The threshold is configurable (`maxFileSizeBytes: 102400`) so it can be adjusted if the project's needs change.

---

### Parser health tracking

**Problem:** Not every file parses perfectly. Some files may have syntax errors, unusual formatting, or patterns that confuse the regex parser. Without visibility into parse quality, consumers of the extracted data would have no way to know whether the symbols from a given file are trustworthy or potentially incomplete.

**Fix:** The system records a health status for each file's parse result: `clean` (all patterns matched without issues), `recovered` (the parser encountered problems but still extracted partial results), or `error` (the parse failed entirely). This metadata flows through the `ParseResult` interface to all downstream consumers, so they can decide how much to trust the extracted symbols -- for example, a code navigation tool might show results from `recovered` parses with a warning indicator, while filtering out `error` results entirely.

---

<details>
<summary>Files Changed (4)</summary>

| File | What changed |
|------|-------------|
| `mcp_server/lib/code-graph/structural-indexer.ts` | New core extraction pipeline with per-language regex parsers (JS/TS unified, Python, Shell), edge extraction for 7 relationship types, parser health tracking |
| `mcp_server/lib/code-graph/indexer-types.ts` | New shared type definitions: `CodeNode`, `CodeEdge`, `ParseResult` interfaces with deterministic symbolId and parser health metadata |
| `mcp_server/lib/code-graph/incremental-index.ts` | New content-hash freshness system with per-file skip logic, stale file reporting, and 100KB file size guard |
| `package.json` | No tree-sitter dependencies added (regex approach eliminated the need) |

</details>

## Deep Review Fixes (2026-04-01)

### Code Fix
- **Incremental scan skips unchanged files** -- added `isFileStale()` mtime check before `readFileSync` + `parseFile`, making incremental mode proportional to changed files only

### Doc Fixes
- Resolved three-way inconsistency: spec, docs, and code now all reflect tree-sitter as default parser with regex fallback
- Removed `incremental-index.ts` reference (logic lives in structural-indexer.ts)
- Clarified .scm query files not needed (tree-sitter uses programmatic AST traversal)
- Updated deferred tasks that were completed by Phase 017

---

## Upgrade

No migration required.
