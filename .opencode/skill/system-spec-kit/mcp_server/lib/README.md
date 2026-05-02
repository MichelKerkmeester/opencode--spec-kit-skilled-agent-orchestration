---
title: "MCP Server Library"
description: "Core TypeScript library modules for memory search, continuity, scoring, governance, storage and response shaping."
trigger_phrases:
  - "mcp library"
  - "lib modules"
  - "memory search library"
  - "cognitive memory"
---

# MCP Server Library

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

`mcp_server/lib/` contains the shared TypeScript implementation used by MCP handlers and scripts. It owns retrieval pipelines, cognitive state, continuity parsing, scoring, persistence helpers, governance checks, response envelopes and evaluation support.

Current state:

- Handlers call focused modules instead of a single public barrel.
- Storage and search logic stay behind typed helper modules.
- Cross-cutting folders provide telemetry, validation, policy and response contracts.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭────────────────────────────────────────────────────────────────╮
│ MCP Server Library                                             │
╰────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌────────────────┐      ┌────────────────┐
│ handlers/    │ ───▶ │ search/        │ ───▶ │ storage/       │
│ tools/       │      │ cognitive/     │      │ providers/     │
└──────┬───────┘      └───────┬────────┘      └────────┬───────┘
       │                      │                        │
       ▼                      ▼                        ▼
┌──────────────┐      ┌────────────────┐      ┌────────────────┐
│ continuity/  │      │ scoring/       │      │ response/      │
│ parsing/     │      │ graph/ eval/   │      │ telemetry/     │
└──────┬───────┘      └───────┬────────┘      └────────┬───────┘
       │                      │                        │
       └──────────────────────▼────────────────────────┘
                     ┌────────────────┐
                     │ validation/    │
                     │ governance/    │
                     └────────────────┘

Dependency direction:
handlers → lib modules → storage and providers
lib modules → shared contracts and validation
storage and providers do not import handlers
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

| Zone | Folders | Import role |
|---|---|---|
| Retrieval | `search/`, `rag/`, `query/` | Build ranked result sets and route query strategies. |
| Memory state | `cognitive/`, `continuity/`, `session/`, `learning/` | Track recall state, continuity and session behavior. |
| Persistence | `storage/`, `providers/`, `cache/` | Touch SQLite, embeddings and cached values. |
| Policy | `validation/`, `governance/`, `contracts/` | Enforce limits, scope and IO contracts. |
| Observability | `telemetry/`, `eval/`, `feedback/` | Record quality signals and evaluation data. |
| Formatting | `response/`, `errors/`, `utils/` | Shape tool output and shared helpers. |

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
lib/
├── search/          # Hybrid, vector, FTS, BM25 and routing pipelines
├── cognitive/       # Attention, FSRS, working memory and tier state
├── continuity/      # Resume ladder and continuity parsing support
├── storage/         # SQLite helpers, checkpoints and causal edges
├── scoring/         # Importance, folder and interference scoring
├── parsing/         # Markdown and trigger parsing
├── providers/       # Embedding provider and retry helpers
├── response/        # Response envelopes and trace shaping
├── telemetry/       # Retrieval and consumption telemetry
├── validation/      # Preflight and save quality gates
├── governance/      # Scope and retention policy checks
├── eval/            # Metrics, baselines and dashboard support
├── cache/           # Tool and embedding cache helpers
├── graph/           # Causal and community graph signals
├── session/         # Session deduplication and working state
├── utils/           # Shared path, logger and formatting helpers
└── errors.ts        # Legacy error surface
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Role |
|---|---|
| `search/hybrid-search.ts` | Combines retrieval channels and budget rules. |
| `search/vector-index.ts` | Vector search facade for memory records. |
| `search/query-router.ts` | Routes query complexity to retrieval strategy. |
| `cognitive/attention-decay.ts` | Calculates recall decay and memory strength. |
| `storage/causal-edges.ts` | Persists causal relationships between records. |
| `session/session-manager.ts` | Tracks session deduplication and scoped state. |
| `validation/preflight.ts` | Guards inputs before storage or retrieval work. |
| `response/envelope.ts` | Shapes consistent MCP response payloads. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 6. BOUNDARIES AND FLOW

Boundaries:

- This folder provides implementation modules for MCP server code.
- It should not own MCP tool registration, runtime hooks or plugin bridges.
- New modules should import concrete dependencies, not parent handlers.
- Database and provider side effects belong in `storage/`, `providers/` or cache modules.

Retrieval flow:

```text
╭────────────────────╮
│ MCP handler        │
╰─────────┬──────────╯
          ▼
┌────────────────────┐
│ validation/preflight│
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ search routing     │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ storage providers  │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ scoring + response │
└────────────────────┘
```

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

There is no single stable `lib/` barrel for external callers. Use concrete module imports from source or compiled output.

Examples:

```ts
import { SQLiteVectorStore } from './search/vector-index';
import { calculateRetrievabilityDecay } from './cognitive/attention-decay';
import { getCanonicalPathKey } from './utils/canonical-path';
```

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run typecheck
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
(cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run --reporter=default)
```

Use targeted vitest paths when changing one subsystem under `lib/`.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

| Document | Role |
|---|---|
| [MCP Server README](../README.md) | Parent server overview. |
| [Handlers README](../handlers/README.md) | Tool handler layer that calls `lib/`. |
| [Search README](./search/README.md) | Retrieval subsystem details. |
| [Storage README](./storage/README.md) | Persistence subsystem details. |

<!-- /ANCHOR:related -->
