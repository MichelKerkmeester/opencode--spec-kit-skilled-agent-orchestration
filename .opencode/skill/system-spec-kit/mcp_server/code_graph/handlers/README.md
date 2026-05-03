---
title: "Code Graph Handlers"
description: "MCP handler entrypoints for structural code graph tools and CocoIndex bridge tools."
trigger_phrases:
  - "code graph handlers"
  - "code_graph handlers"
  - "ccc handlers"
  - "detect_changes handler"
---

# Code Graph Handlers

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

`handlers/` owns the MCP tool handlers for the structural code graph package. Each file adapts one public MCP operation to the lower-level library in `../lib/`, then returns a typed payload with readiness, trust and recovery metadata when relevant.

Current state:

- Structural graph handlers cover scan, query, status, context, verify and diff preflight reads.
- CocoIndex bridge handlers cover status, reindex and feedback calls for the `ccc_*` tools.
- Read handlers use shared readiness contracts instead of returning silent empty graph answers when the index is stale or missing.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭────────────────────────────────────────────────────────────╮
│                    CODE GRAPH HANDLERS                     │
╰────────────────────────────────────────────────────────────╯

┌──────────────────┐      ┌──────────────────┐
│ MCP tool schemas │ ───▶ │ tools registry   │
│ tool-schemas.ts  │      │ code-graph-tools │
└──────────────────┘      └────────┬─────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────┐
│ Handler files                                              │
│ scan  query  status  context  verify  detect  ccc bridges  │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│ ../lib                                                     │
│ indexer  database  readiness  context  seed resolution     │
└────────────────────────────────────────────────────────────┘

Dependency direction:
tool registry → handlers → ../lib
handlers do not import sibling handler internals
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
handlers/
├── index.ts             │ Barrel exports for the tool registry
├── scan.ts              │ Workspace indexing entrypoint
├── query.ts             │ Structural relationship reads
├── status.ts            │ Graph health and readiness probe
├── context.ts           │ Token-bounded graph neighborhoods
├── verify.ts            │ Verification battery runner
├── detect-changes.ts    │ Unified-diff affected-symbol preflight
├── ccc-status.ts        │ CocoIndex bridge status
├── ccc-reindex.ts       │ CocoIndex bridge reindex trigger
├── ccc-feedback.ts      │ CocoIndex bridge feedback sink
└── README.md
```

Allowed dependency direction:

```text
tools/code-graph-tools.ts → handlers/index.ts → handler files → ../lib
handler files → ../lib/readiness-contract.ts
handler files → ../lib/query-result-adapter.ts
```

Disallowed dependency direction:

```text
../lib → handlers
handler file → another handler file for shared logic
ccc bridge handler → structural index internals without a library adapter
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
handlers/
├── index.ts
├── scan.ts
├── query.ts
├── status.ts
├── context.ts
├── verify.ts
├── detect-changes.ts
├── ccc-status.ts
├── ccc-reindex.ts
├── ccc-feedback.ts
└── README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `scan.ts` | Handles `code_graph_scan`, walks the workspace and updates the SQLite graph through the library indexer. Accepts `includeSkills` (boolean or `sk-*` list), `includeAgents`, `includeCommands`, `includeSpecs`, `includePlugins` per-call args; resolves the active scope policy via `../lib/index-scope-policy.ts`. Per-call args override the matching `SPECKIT_CODE_GRAPH_INDEX_*` env vars. |
| `query.ts` | Handles `code_graph_query` structural reads such as outline, calls, imports and blast radius. |
| `status.ts` | Handles `code_graph_status` health probes with freshness, readiness, parse health and graph-quality fields. |
| `context.ts` | Handles `code_graph_context` neighborhoods from manual, graph or CocoIndex seeds. |
| `verify.ts` | Handles `code_graph_verify` checks against the current index. |
| `detect-changes.ts` | Handles `detect_changes` by mapping unified diffs to indexed symbols only when graph readiness is fresh. |
| `ccc-status.ts` | Handles `ccc_status` availability and index-state checks for CocoIndex Code. |
| `ccc-reindex.ts` | Handles `ccc_reindex` incremental or full CocoIndex reindex requests. |
| `ccc-feedback.ts` | Handles `ccc_feedback` quality feedback for CocoIndex search results. |
| `index.ts` | Re-exports handler modules for the tool registry. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Handler files import shared behavior from `../lib/` and schema types from the MCP server. |
| Exports | `index.ts` is the folder entrypoint consumed by the code graph tool registry. |
| Ownership | Handler files own request adaptation, response shaping and recovery metadata. Core graph behavior belongs in `../lib/`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ MCP client calls code_graph_* or ccc_*    │
╰──────────────────────────────────────────╯
                   │
                   ▼
┌──────────────────────────────────────────┐
│ tools/code-graph-tools.ts dispatcher      │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ handler validates arguments and readiness │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ ../lib executes graph, bridge or DB work  │
└──────────────────────────────────────────┘
                   │
                   ▼
╭──────────────────────────────────────────╮
│ handler returns typed MCP payload         │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `index.ts` | Module | Re-exports all handler functions for registration. |
| `code_graph_scan` | MCP tool | Builds or refreshes the structural graph. |
| `code_graph_query` | MCP tool | Reads graph relationships and symbol outlines. |
| `code_graph_status` | MCP tool | Reports graph health and trust metadata. |
| `code_graph_context` | MCP tool | Builds compact graph context from seeds. |
| `code_graph_verify` | MCP tool | Runs graph verification checks. |
| `detect_changes` | MCP tool | Maps a unified diff to affected graph symbols. |
| `ccc_status`, `ccc_reindex`, `ccc_feedback` | MCP tools | Bridge to CocoIndex Code status, indexing and feedback. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root.

```bash
npm test -- --run code-graph
```

Expected result: code graph handler and library suites pass.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [Code Graph Subsystem](../README.md)
- [Code Graph Library](../lib/README.md)
- [MCP Server](../../README.md)

<!-- /ANCHOR:related -->
