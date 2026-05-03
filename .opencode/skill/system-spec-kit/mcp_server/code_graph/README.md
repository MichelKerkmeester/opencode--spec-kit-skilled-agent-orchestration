---
title: "Code Graph Subsystem"
description: "Structural code graph package for scan, query, status, context and CocoIndex bridge MCP tools."
trigger_phrases:
  - "code graph subsystem"
  - "code graph indexer"
  - "code graph readme"
  - "structural graph tools"
---

# Code Graph Subsystem

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. SCAN SCOPE](#8--scan-scope)
- [9. VALIDATION](#9--validation)
- [10. RELATED](#10--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`code_graph/` owns the structural graph package inside the Spec Kit Memory MCP server. It scans source files, persists file-symbol-edge records in SQLite, exposes graph MCP tools and bridges selected CocoIndex Code operations through `ccc_*` handlers.

Current state:

- Graph reads expose readiness, trust and graph-quality metadata so callers can detect stale or missing indexes.
- Context reads can return blocked payloads when a full scan is required before graph answers are safe.
- Startup and compaction surfaces reuse the same graph summary payloads produced by the library.
- Default scans target end-user repository code. Files under `.opencode/skill/**` are skipped unless a maintainer opts in.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭────────────────────────────────────────────────────────────╮
│                    CODE GRAPH SUBSYSTEM                    │
╰────────────────────────────────────────────────────────────╯

┌──────────────────┐      ┌──────────────────┐
│ MCP callers      │ ───▶ │ handlers/        │
│ code_graph_*     │      │ request adapters │
│ ccc_*            │      └────────┬─────────┘
└──────────────────┘               │
                                    ▼
┌──────────────────┐      ┌──────────────────┐
│ tools/           │ ◀─── │ lib/             │
│ registry surface │      │ graph engine     │
└──────────────────┘      └────────┬─────────┘
                                    │
                                    ▼
┌──────────────────┐      ┌──────────────────┐
│ database/        │      │ CocoIndex Code   │
│ code-graph.sqlite│      │ bridge commands  │
└──────────────────┘      └──────────────────┘

Dependency direction:
tools registry → handlers → lib → database or external bridge
startup surfaces → lib startup summary helpers
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
code_graph/
├── README.md                  │ Package overview
├── handlers/                  │ MCP tool handlers
├── lib/                       │ Indexer, DB, readiness and context logic
├── tools/                     │ Tool registration and dispatcher wiring
├── tests/                     │ Vitest coverage for graph behavior
├── feature_catalog/           │ Current feature inventory
└── manual_testing_playbook/   │ Manual validation scenarios
```

Allowed dependency direction:

```text
tools/ → handlers/ → lib/
handlers/ → shared MCP schemas and result types
lib/ → database files and external parser or bridge adapters
tests/ → public handlers and library entrypoints
```

Disallowed dependency direction:

```text
lib/ → handlers/
database layer → MCP transport modules
feature catalog or playbook docs → runtime imports
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
code_graph/
├── README.md
├── handlers/
│   ├── README.md
│   ├── scan.ts
│   ├── query.ts
│   ├── status.ts
│   ├── context.ts
│   ├── verify.ts
│   ├── detect-changes.ts
│   ├── ccc-status.ts
│   ├── ccc-reindex.ts
│   └── ccc-feedback.ts
├── lib/
│   ├── README.md
│   ├── structural-indexer.ts
│   ├── tree-sitter-parser.ts
│   ├── code-graph-db.ts
│   ├── code-graph-context.ts
│   ├── seed-resolver.ts
│   ├── index-scope-policy.ts
│   └── readiness-contract.ts
├── tools/
│   ├── code-graph-tools.ts
│   └── index.ts
├── tests/
├── feature_catalog/
└── manual_testing_playbook/
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `handlers/scan.ts` | MCP scan entrypoint for incremental and full graph indexing. |
| `handlers/query.ts` | Structural relationship reads such as outlines, calls, imports and blast radius. |
| `handlers/status.ts` | Freshness, readiness, parse-health and graph-quality reporting. |
| `handlers/context.ts` | Compact graph neighborhoods for LLM context windows. |
| `handlers/detect-changes.ts` | Unified-diff to affected-symbol preflight. |
| `lib/structural-indexer.ts` | Workspace walk, parse and persistence pipeline. |
| `lib/code-graph-db.ts` | SQLite schema, graph storage and startup highlights. |
| `lib/code-graph-context.ts` | Context assembly with budget and partial-output metadata. |
| `lib/index-scope-policy.ts` | Resolves end-user-vs-skill-inclusive scope policy from env + per-call args. Per-call boolean overrides env. |
| `lib/readiness-contract.ts` | Readiness and trust-state vocabulary used by public payloads. |
| `tools/code-graph-tools.ts` | MCP tool registration and dispatch mapping. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Runtime code flows from `tools/` into `handlers/`, then into `lib/`. |
| Exports | Public MCP tool behavior is exposed through the tool registry, not by importing handlers directly from outside the package. |
| Ownership | This package owns graph indexing and graph context. Memory continuity remains owned by the memory and spec-document surfaces. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ MCP client or runtime startup surface     │
╰──────────────────────────────────────────╯
                   │
                   ▼
┌──────────────────────────────────────────┐
│ tools registry dispatches requested tool  │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ handler adapts args and readiness checks  │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ lib reads or updates SQLite graph state   │
└──────────────────────────────────────────┘
                   │
                   ▼
╭──────────────────────────────────────────╮
│ structured payload returns to caller      │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `tools/code-graph-tools.ts` | Module | Registers public MCP tool dispatchers. |
| `handlers/index.ts` | Module | Re-exports handler functions. |
| `lib/index.ts` | Module | Re-exports library functions and types. |
| `code_graph_scan` | MCP tool | Builds or refreshes graph state. |
| `code_graph_query` | MCP tool | Reads structural relationships. |
| `code_graph_status` | MCP tool | Reports graph health. |
| `code_graph_context` | MCP tool | Returns compact graph context. |
| `detect_changes` | MCP tool | Maps a diff to affected graph symbols. |
| `ccc_*` | MCP tools | Bridge CocoIndex Code status, indexing and feedback. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:scan-scope -->
## 8. SCAN SCOPE

`code_graph_scan` excludes generated, vendored and internal-heavy paths by default:

```text
node_modules
dist
.git
vendor
external
z_future
z_archive
mcp-coco-index/mcp_server
.opencode/skill/**
.opencode/agent/**
.opencode/command/**
.opencode/specs/**
.opencode/plugins/**
```

### Broader Default Excludes

The `.opencode/skill`, `.opencode/agent`, `.opencode/command`, `.opencode/specs` and `.opencode/plugins` folders are skipped by default. Maintainers working on Spec Kit internals can opt folders back in with env vars:

```bash
SPECKIT_CODE_GRAPH_INDEX_SKILLS=true
SPECKIT_CODE_GRAPH_INDEX_AGENTS=true
SPECKIT_CODE_GRAPH_INDEX_COMMANDS=true
SPECKIT_CODE_GRAPH_INDEX_SPECS=true
SPECKIT_CODE_GRAPH_INDEX_PLUGINS=true
```

or for one scan with per-folder arguments:

```json
{
  "incremental": false,
  "includeSkills": true,
  "includeAgents": true,
  "includeCommands": true,
  "includeSpecs": true,
  "includePlugins": true
}
```

### Granular Skill Selection

`includeSkills` also accepts a list of `sk-*` skill names. This scans only the selected skill folders while keeping other `.opencode/skill/**` folders out:

```bash
SPECKIT_CODE_GRAPH_INDEX_SKILLS=sk-code-review,sk-doc
```

```json
{
  "incremental": false,
  "includeSkills": ["sk-code-review", "sk-doc"]
}
```

### Doc-Language File Types

When a folder is opted in, the scan persists more than source code. Markdown, JSON, JSONC, YAML, YML and TOML files in that folder become `code_files` rows tagged `language='doc'` with zero nodes and zero edges. This honors the public contract that opted-in folders are actually scanned (without dragging tree-sitter parsers across non-code formats). AST-only consumers that join `code_nodes` or `code_edges` correctly find nothing for these files. The doc lane stays inactive when no `.opencode/` folder is opted in.

### Precedence

When both are present, scan-call arguments take precedence over env vars. Use env vars for process-wide defaults; use per-call args for one-off overrides.

### Symlink Semantics

`rootDir` is canonicalized via realpath before the default exclusion guard runs. Symlinked roots that resolve into excluded `.opencode/**` folders are still excluded from default scans.

`mcp-coco-index/mcp_server` stays excluded even when skill indexing is enabled.

Existing databases record the active scan scope in `code_graph_metadata`. If the stored scope differs from the current scope, read paths return the existing blocked payload with `requiredAction:"code_graph_scan"`. Run an explicit full scan to prune old rows:

```json
{ "incremental": false }
```

Full scans delete out-of-scope graph rows from SQLite. They do not archive derived graph data.

<!-- /ANCHOR:scan-scope -->

---

<!-- ANCHOR:validation -->
## 9. VALIDATION

Run from the repository root.

```bash
npm test -- --run code-graph
```

Expected result: code graph handler, library and integration suites pass.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 10. RELATED

- [Code Graph Library](./lib/README.md)
- [Code Graph Handlers](./handlers/README.md)
- [Feature Catalog](./feature_catalog/feature_catalog.md)
- [Manual Testing Playbook](./manual_testing_playbook/manual_testing_playbook.md)
- [MCP Server](../README.md)

<!-- /ANCHOR:related -->
