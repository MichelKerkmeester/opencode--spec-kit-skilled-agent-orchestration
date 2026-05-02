---
title: "Handlers"
description: "MCP tool handlers and save/index orchestration helpers."
trigger_phrases:
  - "MCP handlers"
  - "memory handlers"
---

# Handlers

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. DIRECTORY TREE](#3--directory-tree)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`handlers/` is the MCP-facing handler layer. `handlers/index.ts` lazily imports handler modules and re-exports public functions used by the tool dispatch layer.

Current state:

- Memory context, search, trigger, save, CRUD, lifecycle, checkpoint, causal graph, session learning, and evaluation handlers live here.
- `memory-save.ts` is the public save entrypoint and delegates to the decomposed `save/` pipeline.
- `mutation-hooks.ts` coordinates post-mutation cache invalidation for index and update flows.
- Packet continuity remains owned by resume tools and spec docs rather than handler-local state.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                            HANDLERS                              │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────────┐      ┌────────────────────┐
│ MCP tool       │ ───▶ │ handlers/index.ts  │ ───▶ │ handler modules    │
│ dispatch       │      │ lazy registry      │      │ memory, session,   │
└───────┬────────┘      └─────────┬──────────┘      │ causal, eval       │
        │                         │                 └─────────┬──────────┘
        │                         ▼                           ▼
        │              ┌────────────────────┐       ┌────────────────────┐
        └──────────▶   │ handler-utils.ts   │ ───▶  │ storage, graph,    │
                       │ shared responses   │       │ search, scripts    │
                       └─────────┬──────────┘       └─────────┬──────────┘
                                 │                            │
                                 ▼                            ▼
                       ┌────────────────────┐       ┌────────────────────┐
                       │ mutation-hooks.ts  │       │ typed MCP result   │
                       │ cache invalidation │       │ and metadata       │
                       └────────────────────┘       └────────────────────┘

Dependency direction: tool dispatch ───▶ handler registry ───▶ focused handlers ───▶ lib and storage.
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
mcp_server/handlers/
├── memory-context.ts              # L1 intent-aware context assembly
├── memory-search.ts               # L2 hybrid search with telemetry and profiles
├── memory-triggers.ts             # L2 trigger matching and tiered content injection
├── memory-save.ts                 # Public save entrypoint into save/
├── memory-crud.ts                 # Stable CRUD facade into focused submodules
├── memory-bulk-delete.ts          # Bulk delete by importance tier
├── memory-retention-sweep.ts      # Expired record retention enforcement
├── memory-index.ts                # Scan, re-index, and alias discovery
├── memory-ingest.ts               # Async ingestion lifecycle
├── checkpoints.ts                 # Checkpoint create, list, restore, delete, validate
├── session-learning.ts            # Preflight, postflight, and learning history
├── causal-graph.ts                # Causal link, unlink, stats, and drift why
├── eval-reporting.ts              # Ablation analysis and dashboard reports
├── index.ts                       # Lazy-loading handler registry
├── types.ts                       # Shared handler types
├── handler-utils.ts               # Shared response helpers
├── mutation-hooks.ts              # Post-mutation cache invalidation
├── pe-gating.ts                   # Prediction-error save arbitration
├── quality-loop.ts                # Verify-fix-verify scoring loop
├── v-rule-bridge.ts               # Validation script bridge
├── causal-links-processor.ts      # Save-time causal edge processing
├── chunking-orchestrator.ts       # Save and index chunking orchestration
├── save/                          # Decomposed save pipeline modules
└── README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File or directory | Responsibility |
|---|---|
| `index.ts` | Lazy-loads and re-exports public handler functions. |
| `memory-context.ts` | Builds intent-aware context for auto, deep, focused, and resume modes. |
| `memory-search.ts` | Runs hybrid memory retrieval with profiles and telemetry. |
| `memory-triggers.ts` | Matches trigger phrases and injects tiered content. |
| `memory-save.ts` | Owns save entry validation and routes work into `save/`. |
| `memory-crud.ts` | Provides the stable CRUD facade for list, delete, update, stats, and health. |
| `mutation-hooks.ts` | Clears trigger, constitutional, graph, co-activation, tool, and degree caches after mutations. |
| `save/` | Contains the decomposed save pipeline modules. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public surface | Export callable handler functions through `index.ts`. |
| Module loading | Keep handler modules lazy so startup stays light. |
| Save pipeline | Keep orchestration in `memory-save.ts` and detailed stages in `save/`. |
| Cache invalidation | Route mutation cleanup through `mutation-hooks.ts`. |
| Continuity | Do not treat handler-local output as canonical packet continuity. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ MCP tool dispatch receives tool request  │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ handlers/index.ts resolves handler       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Focused handler validates and runs work  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Shared libs, storage, graph, or scripts  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Mutation hook clears affected caches     │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Handler returns typed MCP response       │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `index.ts` | Module | Public handler registry for tool dispatch. |
| `handleMemoryContext` | Function | Builds unified memory context responses. |
| `handleMemorySearch` | Function | Runs indexed continuity search. |
| `handleMemoryMatchTriggers` | Function | Runs fast trigger phrase matching. |
| `handleMemorySave` | Function | Saves and indexes spec or constitutional documents. |
| `runPostMutationHooks` | Function | Clears affected caches after mutation handlers. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from `.opencode/skill/system-spec-kit/mcp_server` unless noted.

```bash
npx vitest run handlers
```

Expected result: handler suites exit with Vitest success.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [`../tools/README.md`](../tools/README.md)
- [`../core/README.md`](../core/README.md)
- [`../hooks/README.md`](../hooks/README.md)

<!-- /ANCHOR:related -->
