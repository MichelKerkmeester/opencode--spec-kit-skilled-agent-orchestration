---
title: "MCP Server Tools"
description: "Typed MCP tool dispatch modules, schema validation boundaries and handler routing."
trigger_phrases:
  - "tool dispatch"
  - "memory quick search"
  - "typed tool args"
---

# MCP Server Tools

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`mcp_server/tools/` is the typed dispatch layer for MCP tool calls. It maps public tool names to domain dispatch modules, validates arguments through schemas and forwards accepted requests to handler code.

Current state:

- `index.ts` owns dispatcher order and returns `null` when no dispatcher claims a tool name.
- Domain modules group memory, context, causal graph, checkpoint and lifecycle tools.
- `types.ts` keeps parsed argument shapes and shared MCP response aliases close to dispatch code.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────╮
│                         MCP TOOLS                            │
╰──────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌────────────────┐      ┌────────────────┐
│ MCP client   │ ───▶ │ dispatchTool   │ ───▶ │ domain tool    │
│ tool call    │      │ index.ts       │      │ module         │
└──────────────┘      └───────┬────────┘      └───────┬────────┘
                              │                       │
                              ▼                       ▼
                       ┌──────────────┐       ┌────────────────┐
                       │ schemas      │ ───▶  │ handlers       │
                       │ validation   │       │ domain logic   │
                       └──────┬───────┘       └───────┬────────┘
                              │                       │
                              ▼                       ▼
                       ┌──────────────┐       ┌────────────────┐
                       │ typed args   │       │ MCP response   │
                       │ types.ts     │       │ envelope       │
                       └──────────────┘       └────────────────┘

Dependency direction: tools ───▶ schemas ───▶ handlers
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
mcp_server/tools/
+-- index.ts              # ALL_DISPATCHERS and dispatchTool routing
+-- context-tools.ts      # memory_context orchestration dispatch
+-- memory-tools.ts       # memory search, save, CRUD and stats dispatch
+-- causal-tools.ts       # causal graph dispatch
+-- checkpoint-tools.ts   # checkpoint and learning history dispatch
+-- lifecycle-tools.ts    # async ingest lifecycle dispatch
+-- types.ts              # Shared response aliases and argument shapes
`-- README.md
```

Allowed direction:

- Tool modules may validate with `../schemas/` before calling handlers.
- Tool modules may call `../handlers/` after arguments are typed.
- `index.ts` may import dispatcher functions from sibling tool modules.

Disallowed direction:

- Handlers should not import tool dispatch modules.
- Tool modules should not parse raw MCP payloads outside the schema boundary.
- Dispatch modules should not own storage, retrieval or scoring logic.

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File | Role |
|---|---|
| `index.ts` | Registers dispatchers and exposes `dispatchTool()`. |
| `context-tools.ts` | Routes L1 context orchestration calls. |
| `memory-tools.ts` | Routes memory search, trigger, save, update, delete and stats tools. |
| `causal-tools.ts` | Routes causal link, unlink, stats and lineage calls. |
| `checkpoint-tools.ts` | Routes checkpoint lifecycle and learning history calls. |
| `lifecycle-tools.ts` | Routes async ingest start, status and cancel calls. |
| `types.ts` | Defines shared response and typed argument contracts. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 5. BOUNDARIES AND FLOW

Dispatch flow:

```text
╭──────────────────────────────╮
│ MCP tool request             │
╰──────────────────────────────╯
              │
              ▼
┌──────────────────────────────┐
│ dispatchTool(name, args)     │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ First matching dispatcher    │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ validateToolArgs()           │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Handler call                 │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ MCP response envelope        │
└──────────────────────────────┘
```

This folder owns dispatch and argument boundaries. Handler modules own behavior, schema modules own accepted input shape and lower layers own storage or retrieval details.

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

Public TypeScript entrypoints:

- `dispatchTool()` from `index.ts`
- `ALL_DISPATCHERS` from `index.ts`
- Domain dispatcher functions exported by each `*-tools.ts` file

Runtime tool names are owned by the MCP server registry and routed through this folder before handlers run.

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Use repository-root commands:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
npm --prefix .opencode/skill/system-spec-kit/mcp_server test
```

Run targeted tests for changed dispatch behavior when editing a single tool module.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [`../handlers/README.md`](../handlers/README.md)
- [`../schemas/README.md`](../schemas/README.md)
- [`../core/README.md`](../core/README.md)
- [`../README.md`](../README.md)

<!-- /ANCHOR:related -->
