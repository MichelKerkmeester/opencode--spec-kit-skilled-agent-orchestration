# Iteration 007 — Open-Source Alternatives for Code Graph Context

**Focus:** OSS tools that replicate Dual-Graph's code graph approach
**Status:** complete
**newInfoRatio:** 0.55
**Novelty:** Identified tree-sitter + aider's repo-map as the most promising open-source alternatives; both are proven in production AI coding tools.

---

## Findings

### 1. Alternative Comparison Matrix

| Tool | Code Graph? | MCP Native? | Multi-Language | Integration Effort | Our Fit Score |
|------|------------|-------------|----------------|-------------------|---------------|
| **tree-sitter** | AST parsing (build your own graph) | No (library) | 40+ languages | High (2-4 weeks) | 9/10 |
| **aider repo-map** | File + function map | No | Python, JS/TS, Go, etc. | Medium (1-2 weeks) | 8/10 |
| **dependency-cruiser** | Import/dependency graph | No | JS/TS only | Low (2-3 days) | 5/10 |
| **madge** | Module dependency graph | No | JS/TS | Low (1-2 days) | 4/10 |
| **ts-morph** | TS AST manipulation | No | TypeScript only | Low (1 week) | 5/10 |
| **universal-ctags** | Symbol index | No | 100+ languages | Low (days) | 6/10 |
| **ast-grep** | AST-based search | No | Multi-lang | Medium (1 week) | 7/10 |
| **LSP servers** | Full language intelligence | Varies | Per-language | High (complex) | 3/10 |
| **CocoIndex Code** (ours) | Semantic vector search | Yes (MCP) | Any (embeddings) | Already done | 7/10 |

### 2. Top Recommendations

**A. tree-sitter (Best for building our own graph)**
- Industry standard for multi-language AST parsing
- Used by: GitHub, Neovim, Helix, Zed, aider
- Can extract: functions, classes, imports, exports, dependencies
- TypeScript bindings available (`tree-sitter` npm package)
- Would integrate naturally with our TypeScript MCP server
- Effort: 2-4 weeks to build graph construction + ranking

**B. aider's repo-map (Best existing implementation)**
- Part of aider AI coding assistant (open source, Apache 2.0)
- Uses tree-sitter internally for AST parsing
- Generates "repo maps" showing file structure + key symbols
- Proven token reduction in production use
- Python implementation — would need porting to TypeScript or wrapping
- Key insight: aider ALREADY solved the same problem Dual-Graph claims to solve

**C. dependency-cruiser (Best for quick JS/TS win)**
- Generates dependency graphs for JavaScript/TypeScript
- CLI tool, can output JSON graph
- Easy to integrate: `npx depcruise --output-type json src/`
- Limited to JS/TS — won't help with Python/Shell skills

### 3. The aider Connection

aider (https://github.com/paul-gauthier/aider) implements a "repo-map" feature that:
- Uses tree-sitter to build AST-based file maps
- Shows functions, classes, and their relationships
- Automatically selects relevant files for each chat message
- Reduces token usage significantly

This is essentially what Dual-Graph does, but:
- Fully open source (Apache 2.0)
- No proprietary dependencies
- Proven at scale (30K+ GitHub stars)
- Well-documented approach

### 4. Building Our Own: Architecture Sketch

```
New module: .opencode/skill/system-spec-kit/mcp_server/lib/search/code-graph.ts

Components:
1. tree-sitter parser → Extract ASTs for JS/TS/Python/Shell
2. Graph builder → files, functions, classes, imports
3. Graph store → SQLite table alongside embeddings
4. Graph ranker → Rank files by relationship to query
5. Graph channel → Integrate as new channel in hybrid search

Integration point in existing code:
- context-server.ts already imports: createUnifiedGraphSearchFn
- lib/search/graph-search-fn.ts — ALREADY exists as extension point
- lib/search/graph-flags.ts — Feature flags for graph search
```

### 5. Key Finding: We Already Have Graph Search Infrastructure

Our MCP server already imports:
- `createUnifiedGraphSearchFn` from `lib/search/graph-search-fn`
- `isGraphUnifiedEnabled` from `lib/search/graph-flags`

This means the architecture ALREADY has a graph search channel — it just needs a code graph data source to power it!

---

## Dead Ends
- LSP-based approach: too complex, per-language servers, heavy runtime
- madge: too limited (JS/TS modules only, no function-level)

## Sources
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:77-78] — graph search imports
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:88] — graph flags imports
- [SOURCE: https://github.com/paul-gauthier/aider] — aider repo-map approach
- [SOURCE: https://tree-sitter.github.io/tree-sitter/] — tree-sitter AST parsing
