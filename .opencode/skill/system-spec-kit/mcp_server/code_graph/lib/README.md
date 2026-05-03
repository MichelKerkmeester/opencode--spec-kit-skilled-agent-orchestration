---
title: "Code Graph Library"
description: "Core implementation modules for structural indexing, SQLite graph storage, readiness checks and compact graph context."
trigger_phrases:
  - "code graph library"
  - "structural indexer"
  - "code graph db"
  - "readiness contract"
---

# Code Graph Library

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/` owns the code graph implementation behind the MCP handlers. It indexes source files, stores graph records in SQLite, resolves seeds, builds compact context payloads and reports readiness metadata for callers that need false-safe graph reads.

Current state:

- The indexer parses TypeScript, JavaScript, Python and shell files through tree-sitter with a regex fallback.
- The database layer stores files, nodes and edges with schema version metadata and startup highlights.
- Context builders merge structural graph, Memory MCP and CocoIndex inputs under token budgets.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭────────────────────────────────────────────────────────────╮
│                      CODE GRAPH LIBRARY                    │
╰────────────────────────────────────────────────────────────╯

┌──────────────────┐      ┌──────────────────┐
│ handlers/*       │ ───▶ │ readiness layer  │
│ MCP entrypoints  │      │ ensure-ready     │
└──────────────────┘      └────────┬─────────┘
                                    │
                                    ▼
┌──────────────────┐      ┌──────────────────┐
│ indexer layer    │ ───▶ │ storage layer    │
│ structural-index │      │ code-graph-db    │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│ parser layer     │      │ context layer    │
│ tree-sitter      │      │ graph context    │
│ regex fallback   │      │ seed resolver    │
└──────────────────┘      └──────────────────┘

Dependency direction:
handlers → readiness → indexer/database/context
context → seed resolver → database
database does not import handlers
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
lib/
├── index.ts                    │ Public library barrel
├── structural-indexer.ts       │ Workspace walk, parse and persist pipeline
├── tree-sitter-parser.ts       │ AST extraction and parser selection
├── code-graph-db.ts            │ SQLite schema and graph queries
├── code-graph-context.ts       │ Compact context assembly
├── seed-resolver.ts            │ File and line seeds to graph nodes
├── compact-merger.ts           │ Memory, code graph and CocoIndex merge
├── ensure-ready.ts             │ Readiness guard and scan trigger logic
├── readiness-contract.ts       │ Readiness and trust vocabulary
├── budget-allocator.ts         │ Token-budget distribution
├── working-set-tracker.ts      │ Recent file and symbol tracking
├── runtime-detection.ts        │ Runtime and hook policy checks
├── indexer-types.ts            │ Graph types and scan defaults
├── index-scope-policy.ts       │ Env and per-call scope policy resolution
├── query-result-adapter.ts     │ Stable handler result shapes
├── ops-hardening.ts            │ Query timeout and retry guards
├── query-intent-classifier.ts  │ Query intent routing
├── startup-brief.ts            │ Startup graph summary payloads
├── utils/                      │ Workspace path helpers
└── README.md
```

Allowed dependency direction:

```text
handlers → lib/index.ts
lib/context modules → lib/database and lib/seed modules
lib/indexer modules → lib/parser modules → lib/types
shared utilities → no handler imports
```

Disallowed dependency direction:

```text
lib → handlers
database layer → MCP transport layer
parser layer → startup or compaction surfaces
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
lib/
├── structural-indexer.ts
├── tree-sitter-parser.ts
├── code-graph-db.ts
├── code-graph-context.ts
├── seed-resolver.ts
├── compact-merger.ts
├── ensure-ready.ts
├── readiness-contract.ts
├── budget-allocator.ts
├── working-set-tracker.ts
├── runtime-detection.ts
├── indexer-types.ts
├── index-scope-policy.ts
├── query-result-adapter.ts
├── ops-hardening.ts
├── query-intent-classifier.ts
├── startup-brief.ts
├── utils/
├── index.ts
└── README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `structural-indexer.ts` | Walks files, applies scan filters, parses symbols and persists graph rows. Short-circuits `language='doc'` files (markdown, JSON, JSONC, YAML, YML, TOML) to register-only rows without tree-sitter parsing. |
| `tree-sitter-parser.ts` | Extracts AST-backed nodes and edges with fallback parser support. Skips the `'doc'` language entirely. |
| `code-graph-db.ts` | Owns SQLite schema, graph CRUD, statistics and startup highlights. |
| `code-graph-context.ts` | Builds token-bounded neighborhoods for `code_graph_context`. |
| `seed-resolver.ts` | Resolves manual, graph and CocoIndex file-line seeds to indexed graph nodes. |
| `compact-merger.ts` | Merges Memory MCP, code graph and CocoIndex context payloads. |
| `ensure-ready.ts` | Determines whether graph reads can proceed or must return a blocked payload. |
| `readiness-contract.ts` | Defines readiness, canonical readiness and trust-state terms. |
| `budget-allocator.ts` | Splits context budgets across graph sections and overflow. |
| `working-set-tracker.ts` | Tracks recently touched files and symbols for context recovery. |
| `indexer-types.ts` | Defines graph node, edge, parse result and scan default types. Owns `SupportedLanguage` (including the `'doc'` lane), `detectLanguage()` extension routing and the default include-glob set. |
| `index-scope-policy.ts` | Resolves end-user-vs-skill-inclusive scope policy from env + per-call args across the 5 default-excluded `.opencode/` folders. Per-call boolean or `sk-*` list overrides env. Emits the v2 scope fingerprint stored on the graph metadata row. |
| `startup-brief.ts` | Builds compact startup graph summaries for runtime surfaces. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Library modules may import local utilities, shared MCP server types and storage adapters. |
| Exports | `index.ts` exposes library modules to handlers and startup surfaces. |
| Ownership | Core graph state, parser behavior, readiness and context assembly live here. MCP argument handling lives in `../handlers/`. |

Indexing flow:

```text
╭──────────────────────────────────────────╮
│ code_graph_scan handler                   │
╰──────────────────────────────────────────╯
                   │
                   ▼
┌──────────────────────────────────────────┐
│ structural-indexer applies scan filters   │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ parser extracts nodes and edges           │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ code-graph-db persists files and graph    │
└──────────────────────────────────────────┘
                   │
                   ▼
╭──────────────────────────────────────────╮
│ status and context reads use fresh graph  │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `index.ts` | Module | Public export surface for handlers and startup code. |
| `indexFiles()` | Function | Scans and indexes workspace files. |
| `CodeGraphDatabase` | Class | Reads and writes SQLite graph state. |
| `buildCodeGraphContext()` | Function | Produces compact graph neighborhoods. |
| `resolveSeeds()` | Function | Maps context seeds to graph nodes. |
| `ensureCodeGraphReady()` | Function | Checks readiness before graph reads. |
| `buildStartupBrief()` | Function | Builds startup graph summary payloads. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root.

```bash
npm test -- --run code-graph
```

Expected result: parser, indexer, context, readiness and database suites pass.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [Code Graph Subsystem](../README.md)
- [Code Graph Handlers](../handlers/README.md)
- [MCP Server](../../README.md)

<!-- /ANCHOR:related -->
