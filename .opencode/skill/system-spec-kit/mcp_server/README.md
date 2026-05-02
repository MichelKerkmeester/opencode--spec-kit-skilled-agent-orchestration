---
title: "MCP Server: Spec Kit Memory Runtime"
description: "Model Context Protocol server package for memory retrieval, code graph context, skill routing, hooks, persistence, and diagnostics."
trigger_phrases:
  - "MCP server"
  - "spec kit memory"
  - "memory_context"
  - "code_graph_query"
  - "advisor_recommend"
importance_tier: "important"
---

# MCP Server: Spec Kit Memory Runtime

> Local MCP runtime for memory retrieval, code graph context, skill routing, hooks, persistence, and diagnostics.

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

`mcp_server/` owns the Spec Kit Memory MCP runtime. It exposes tools for memory search, context recovery, code graph analysis, CocoIndex status, skill advisor routing, checkpoints, evaluation, and maintenance.

Current state:

- `context-server.ts` is the server entrypoint for MCP transport and tool dispatch.
- `tool-schemas.ts`, `schemas/`, and `tools/` define the public tool surface and input contracts.
- `handlers/`, `code_graph/`, `lib/`, and `skill_advisor/` own the runtime behavior behind those tools.
- `database/` stores local SQLite state for indexed memory and code graph data.
- Runtime hooks under `hooks/` prepare startup, prompt, and compact-context payloads for supported clients.

This package is local-first. It reads and writes repository-local databases, generated build output, and hook payloads, while keeping authored spec docs outside the server package.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    MCP SERVER PACKAGE                            │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ MCP clients  │ ───▶ │ context-server.ts│ ───▶ │ tool dispatcher │
│ hooks / CLI  │      │ transport layer  │      │ schemas + tools │
└──────┬───────┘      └────────┬─────────┘      └────────┬────────┘
       │                       │                         │
       │                       ▼                         ▼
       │              ┌──────────────────┐      ┌─────────────────┐
       └───────────▶  │ hooks + startup  │      │ handlers/       │
                      │ brief builders   │      │ tool execution  │
                      └────────┬─────────┘      └────────┬────────┘
                               │                         │
                               ▼                         ▼
                      ┌──────────────────┐      ┌─────────────────┐
                      │ lib/             │ ───▶ │ database/       │
                      │ search + memory  │      │ SQLite stores   │
                      └────────┬─────────┘      └─────────────────┘
                               │
                               ▼
                      ┌──────────────────┐
                      │ code_graph/      │
                      │ structural index │
                      └──────────────────┘

Dependency direction:
transport ───▶ schemas/tools ───▶ handlers ───▶ lib/code_graph/shared
handlers ───▶ database and filesystem adapters
hooks ───▶ shared payload builders and read-only status helpers
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
mcp_server/
+-- context-server.ts        # MCP transport entrypoint
+-- tool-schemas.ts          # Public tool schema registry
+-- handlers/                # Top-level MCP tool handlers
+-- tools/                   # Tool definition groups and dispatcher helpers
+-- schemas/                 # Zod input schemas
+-- lib/                     # Memory, search, scoring, context, and utility code
+-- code_graph/              # Structural code graph scanner, query handlers, and tools
+-- skill_advisor/           # Native prompt-to-skill routing package
+-- hooks/                   # Runtime hook payload builders
+-- formatters/              # Response shaping for MCP payloads
+-- shared/                  # Shared algorithms and cross-package helpers
+-- configs/                 # Runtime tuning data
+-- scripts/                 # Maintenance and evaluation scripts
+-- database/                # Local SQLite databases
+-- tests/                   # Vitest and integration coverage
`-- README.md
```

Allowed dependency direction:

```text
context-server.ts → tool-schemas.ts / tools/ → handlers/
handlers/ → lib/ / code_graph/ / skill_advisor/ / formatters/
lib/ → shared/ / configs/ / database adapters
hooks/ → lib/ / code_graph/ / skill_advisor/ read surfaces
tests/ → public handlers, public helpers, and package-local fixtures
```

Disallowed dependency direction:

```text
lib/ → handlers/
shared/ → handlers/ or context-server.ts
database/ → runtime modules
dist/ → source imports
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
mcp_server/
+-- api/                     # API-oriented helpers and route surfaces
+-- code_graph/              # Structural graph indexing and MCP handlers
+-- configs/                 # Search and cognitive configuration files
+-- core/                    # Core package support modules
+-- database/                # SQLite database files and local state
+-- formatters/              # Tool response formatters
+-- handlers/                # MCP handler modules
+-- hooks/                   # Runtime hook integration code
+-- lib/                     # Search, memory, context, scoring, and utility modules
+-- plugin_bridges/          # Runtime bridge packages
+-- schemas/                 # Runtime input validation schemas
+-- scripts/                 # Package maintenance scripts
+-- shared/                  # Shared code used across server zones
+-- skill_advisor/           # Native Skill Advisor package
+-- stress_test/             # Stress test support
+-- tests/                   # Package tests
+-- tools/                   # Tool definition and dispatcher modules
+-- utils/                   # General server utilities
+-- context-server.ts        # MCP server entrypoint
+-- startup-checks.ts        # Startup diagnostics
+-- tool-schemas.ts          # MCP tool schema definitions
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `context-server.ts` | Starts the MCP server and wires transport to the dispatcher. |
| `tool-schemas.ts` | Defines the public MCP tool registry and schema metadata. |
| `schemas/tool-input-schemas.ts` | Validates incoming tool arguments with strict schemas. |
| `handlers/index.ts` | Collects handler modules for dispatcher use. |
| `tools/` | Groups tool definitions by domain. |
| `lib/search/` | Owns memory retrieval, vector index access, lexical search, fusion, and reranking. |
| `code_graph/` | Owns structural scan, query, context, status, and diff attribution tools. |
| `skill_advisor/` | Owns native skill recommendation scoring, freshness, and MCP handlers. |
| `hooks/` | Builds runtime startup and prompt payloads. |
| `formatters/` | Shapes search and response-profile output for clients. |
| `ENV_REFERENCE.md` | Documents runtime environment variables. |
| `INSTALL_GUIDE.md` | Documents package setup and MCP client registration. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public API | MCP tools are exposed through `tool-schemas.ts`, `tools/`, and `context-server.ts`. |
| Handler logic | Handler modules may call `lib/`, `code_graph/`, `skill_advisor/`, `formatters/`, and database adapters. |
| Domain logic | `lib/` and `code_graph/` should not import top-level handlers. |
| Storage | SQLite access stays behind package modules that own schema and migration rules. |
| Build output | `dist/` is generated output and should not be a source dependency. |
| Docs | This README documents current code layout only, not release packet history. |

Main tool flow:

```text
╭──────────────────────────────────────────╮
│ MCP client or runtime hook               │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ context-server.ts                         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ schema validation                         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ domain handler                            │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ lib, code_graph, skill_advisor, database  │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ typed MCP response                        │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `context-server.ts` | Module | Starts the MCP server from source or compiled output. |
| `dist/context-server.js` | Runtime artifact | Compiled MCP server used by client configuration. |
| `tool-schemas.ts` | Module | Source of MCP tool schema definitions. |
| `handlers/*` | Modules | Execute memory, graph, advisor, evaluation, and maintenance tools. |
| `code_graph/handlers/*` | Modules | Execute structural graph scan, status, query, context, and diff tools. |
| `skill_advisor/handlers/*` | Modules | Execute advisor recommend, rebuild, status, and validate tools. |
| `hooks/*` | Modules | Produce startup, prompt, and compact-context payloads for runtime integrations. |
| `npm run build` | Command | Builds TypeScript into `dist/`. |
| `npm test` | Command | Runs package tests through the configured test runner. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from `mcp_server/` unless noted.

```bash
npm run build
npm test
```

Focused documentation checks from the repository root:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/README.md
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/mcp_server/README.md
```

Expected result: build and tests exit 0, README validation reports no blocking issues, and structure extraction returns a README document profile.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md)
- [`ENV_REFERENCE.md`](./ENV_REFERENCE.md)
- [`configs/README.md`](./configs/README.md)
- [`hooks/README.md`](./hooks/README.md)
- [`lib/search/README.md`](./lib/search/README.md)
- [`skill_advisor/README.md`](./skill_advisor/README.md)

<!-- /ANCHOR:related -->
