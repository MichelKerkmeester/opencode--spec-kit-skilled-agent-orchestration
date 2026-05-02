---
title: "Tools: Dispatch Layer"
description: "Typed MCP tool dispatch modules, schema validation, and quick-search delegation."
trigger_phrases:
  - "tool dispatch"
  - "memory quick search"
  - "typed tool args"
---

# Tools: Dispatch Layer

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. IMPLEMENTED STATE](#2-implemented-state)
- [3. RELATED](#3-related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`tools/` is the MCP dispatch layer. It maps runtime tool names to validated handler calls and keeps the handler modules grouped by domain.
For continuity recovery, `/spec_kit:resume` remains the canonical operator surface; these dispatchers enrich the packet-first chain `handover.md -> _memory.continuity -> spec docs` rather than replacing it.

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                    TOOL DISPATCH ARCHITECTURE                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐    ┌──────────────────┐    ┌────────────────┐ │
│  │   MCP Client     │───▶│  dispatchTool()   │───▶│  handlers/    │ │
│  │   (tool call)    │    │  (index.ts)       │    │  (lazy load)  │ │
│  └──────────────────┘    └─────────┬──────────┘    └────────────────┘ │
│                                    │                                  │
│  ┌─────────────────────────────────▼───────────────────────────────┐│
│  │                      DISPATCHER MODULES                         ││
│  │  ┌────────────────┐ ┌──────────────────┐ ┌─────────────────┐   ││
│  │  │context-tools.ts│ │ memory-tools.ts  │ │ causal-tools.ts │   ││
│  │  │memory_context  │ │ memory_search    │ │ memory_causal_  │   ││
│  │  │(L1 orchestrat.)│ │ memory_quick_srch│ │ link/unlink/    │   ││
│  │  │                │ │ memory_save      │ │ stats/drift_why│   ││
│  │  │                │ │ memory_*_crud    │ │                 │   ││
│  │  │                │ │ memory_*_stats   │ │                 │   ││
│  │  │                │ │ memory_validate  │ │                 │   ││
│  │  │                │ │ memory_bulk_del  │ │                 │   ││
│  │  │                │ │ memory_retention │ │                 │   ││
│  │  └────────────────┘ └──────────────────┘ └─────────────────┘   ││
│  │  ┌──────────────────┐ ┌──────────────────┐                     ││
│  │  │checkpoint-tools.ts│ │lifecycle-tools.ts│                     ││
│  │  │memory_checkpoint*│ │memory_ingest*    │                     ││
│  │  │memory_*_history  │ │(async lifecycle) │                     ││
│  │  └──────────────────┘ └──────────────────┘                     ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                   INFRASTRUCTURE                                 ││
│  │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ││
│  │  │ types.ts         │ │ validateToolArgs │ │ ALL_DISPATCHERS  │ ││
│  │  │ response aliases │ │ schemas/         │ │ (fixed order     │ ││
│  │  │ typed arg shapes │ │ schema-validation│ │  resolution)     │ ││
│  │  └──────────────────┘ └──────────────────┘ └──────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Directory Tree

```
mcp_server/tools/
├── context-tools.ts               # Dispatch: memory_context (L1 orchestration)
├── memory-tools.ts                # Dispatch: search, triggers, save, CRUD, stats, validate
├── causal-tools.ts                # Dispatch: causal link, unlink, stats, drift_why
├── checkpoint-tools.ts            # Dispatch: checkpoint lifecycle + learning history
├── lifecycle-tools.ts             # Dispatch: async ingest start/status/cancel
├── types.ts                       # Shared MCP response type aliases + arg shapes
├── index.ts                       # ALL_DISPATCHERS, dispatchTool() → handler resolution
└── README.md
```

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE

- Tool calls are schema-validated before handler dispatch via `validateToolArgs()` from `schemas/tool-input-schemas.ts`.
- `memory-tools.ts` implements the `memory_quick_search` delegation path by building a richer `memory_search` request and relabeling the returned envelope metadata back to `memory_quick_search`.
- `types.ts` remains the typed boundary for parsed handler arguments and MCP response aliases.
- `dispatchTool()` in `index.ts` routes in fixed dispatcher order and returns `null` only when no tool module claims the name.

<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:related -->
## 3. RELATED

- `../handlers/README.md`
- `../schemas/README.md`
- `../core/README.md`

<!-- /ANCHOR:related -->
