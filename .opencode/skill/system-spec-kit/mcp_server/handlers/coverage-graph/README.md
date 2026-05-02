---
title: "Coverage Graph Handlers: MCP Tool Layer"
description: "MCP-facing handlers that validate coverage graph requests and delegate to the library layer."
trigger_phrases:
  - "coverage graph handlers"
  - "deep loop graph"
---

# Coverage Graph Handlers: MCP Tool Layer

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

---

## 1. OVERVIEW

`handlers/coverage-graph/` exposes the MCP-facing handler layer for deep-loop coverage graph tools. Handlers validate request shape, enforce session-scoped reads and delegate storage, query and signal work to `lib/coverage-graph/`.

Current state:

- All handlers require `specFolder`, `loopType` and `sessionId`.
- `upsert.ts` rejects self-loops and clamps edge weights through the library.
- `query.ts`, `status.ts` and `convergence.ts` return JSON text payloads for MCP tool responses.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                 handlers/coverage-graph/                         │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────────────────┐
│ MCP tool registry          │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ index.ts exports handlers  │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐      ┌────────────────────────────┐
│ upsert/query/status/       │ ───▶ │ lib/coverage-graph/*       │
│ convergence handlers       │      │ DB, query and signals      │
└──────────────┬─────────────┘      └──────────────┬─────────────┘
               ▼                                   ▼
╭────────────────────────────╮      ┌────────────────────────────┐
│ MCP JSON text response     │      │ deep-loop-graph.sqlite     │
╰────────────────────────────╯      └────────────────────────────┘

Dependency direction: MCP registry ───▶ handlers ───▶ lib/coverage-graph
```

---

## 3. PACKAGE TOPOLOGY

```text
handlers/coverage-graph/
+-- index.ts         # Public handler exports
+-- upsert.ts        # deep_loop_graph_upsert handler
+-- query.ts         # deep_loop_graph_query handler
+-- status.ts        # deep_loop_graph_status handler
`-- convergence.ts   # deep_loop_graph_convergence handler and scoped helpers
```

Allowed direction:

- Handlers may import types, constants and helpers from `lib/coverage-graph/`.
- Handlers may share local helper behavior when it is handler-specific.
- The library layer must not import this folder.

---

## 4. DIRECTORY TREE

```text
coverage-graph/
+-- README.md
+-- convergence.ts
+-- index.ts
+-- query.ts
+-- status.ts
`-- upsert.ts
```

---

## 5. KEY FILES

| File | Role |
|---|---|
| `index.ts` | Exports the handler functions consumed by the MCP registration layer. |
| `upsert.ts` | Validates upsert input, node kinds and relation names before calling `batchUpsert`. |
| `query.ts` | Routes query types to coverage gap, claim, contradiction, provenance and hot-node helpers. |
| `status.ts` | Reports session-scoped graph counts, relation breakdowns, signal summaries and momentum. |
| `convergence.ts` | Computes convergence decisions, blockers, traces, scoped stats and optional snapshots. |

---

## 6. BOUNDARIES AND FLOW

Handler boundary:

- Owns MCP argument validation and response formatting.
- Keeps reads scoped to `sessionId` for non-admin coverage graph queries.
- Delegates persistence and graph analysis to `lib/coverage-graph/`.
- Does not manage deep-loop iteration files or command workflows.

Handler-to-library flow:

```text
╭────────────────────────────╮
│ MCP tool call              │
╰──────────────┬─────────────╯
               ▼
┌────────────────────────────┐
│ Validate required fields   │
│ and loop-specific values   │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ Build namespace            │
│ specFolder, loopType, sid  │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ Call lib/coverage-graph    │
└──────────────┬─────────────┘
               ▼
╭────────────────────────────╮
│ JSON text MCP response     │
╰────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Handler | Tool Surface | Purpose |
|---|---|---|
| `handleCoverageGraphUpsert` | `deep_loop_graph_upsert` | Writes nodes and edges after validation. |
| `handleCoverageGraphQuery` | `deep_loop_graph_query` | Reads analysis views such as gaps, claims, contradictions, chains and hot nodes. |
| `handleCoverageGraphStatus` | `deep_loop_graph_status` | Returns health, counts and current signal summaries. |
| `handleCoverageGraphConvergence` | `deep_loop_graph_convergence` | Returns stop or continue guidance with blockers and trace data. |

---

## 8. VALIDATION

Run from the repository root after README edits:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/README.md
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/README.md
```

Expected result: `validate_document.py` exits `0` and `extract_structure.py` reports README structure without critical issues.

---

## 9. RELATED

- `../../lib/coverage-graph/README.md`
- `../README.md`
