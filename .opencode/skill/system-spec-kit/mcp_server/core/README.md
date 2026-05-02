---
title: "Core Modules: Runtime Config and Database State"
description: "Runtime configuration, path guards, database-state coordination, and shared rebind hooks for the MCP server."
trigger_phrases:
  - "core modules"
  - "db state"
  - "resolve database paths"
---

# Core Modules: Runtime Config and Database State

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

`core/` is the shared runtime foundation for MCP server modules. It exposes configuration constants, database path resolution, input limits, scan cooldown settings, and database dependency rebinding.

Current responsibilities:

- Resolve database paths from runtime environment variables with allowed-path checks.
- Export server path constants, batch settings, input limits, and cache timing values.
- Initialize and rebind database-backed consumers when the vector index connection changes.
- Track persistent index-scan timing and constitutional cache state.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         CORE MODULES                             │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────┐      ┌────────────────────┐
│ Environment    │ ───▶ │ config.ts      │ ───▶ │ Public constants   │
└────────────────┘      └───────┬────────┘      └────────────────────┘
                                │
                                ▼
                       ┌────────────────┐      ┌────────────────────┐
                       │ db-state.ts    │ ───▶ │ DB consumers       │
                       └───────┬────────┘      └────────────────────┘
                               │
                               ▼
                       ┌────────────────┐
                       │ index.ts       │
                       └────────────────┘

Dependency direction: callers ───▶ core/index.ts ───▶ config.ts and db-state.ts
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
core/
+-- config.ts    # Runtime paths, input limits, batch settings, and cognitive config bridge
+-- db-state.ts  # Database dependency state, rebind listeners, scan timing, and cache state
+-- index.ts     # Public core exports
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File | Responsibility |
|---|---|
| `config.ts` | Resolves database paths, validates allowed filesystem boundaries, and exports runtime constants. |
| `db-state.ts` | Coordinates vector index initialization, database consumer rebinding, persistent scan timing, and constitutional cache access. |
| `index.ts` | Re-exports the public core surface for server modules. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Paths | Database directories must resolve inside the project, home, or temporary directory boundaries. |
| Environment | `SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR`, and `MEMORY_DB_PATH` are read during path resolution. |
| Rebinding | DB-backed consumers are initialized through `db-state.ts` rather than direct cross-module mutation. |
| Public API | Callers should import from `core/index.ts` unless they need a file-local test seam. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ MCP server startup or DB reconnect       │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ resolveDatabasePaths()                   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ init() stores DB-backed dependencies     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ reinitializeDatabase() or listener event │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Consumers receive current DB handle      │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `resolveDatabasePaths()` | Function | Computes and stores database directory, database file, and update-marker paths. |
| `init()` | Function | Registers DB-backed dependencies for current and future rebinds. |
| `checkDatabaseUpdated()` | Function | Detects external database update markers. |
| `reinitializeDatabase()` | Function | Reopens the vector index and rebinds DB consumers. |
| `registerDatabaseRebindListener()` | Function | Lets modules react after the shared DB handle changes. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from `.opencode/skill/system-spec-kit/mcp_server`.

```bash
npx vitest run tests/unit-path-security.vitest.ts tests/symlink-realpath-hardening.vitest.ts tests/handler-memory-index.vitest.ts
```

Expected result: path security, symlink hardening, and database rebind paths pass.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [`../database/README.md`](../database/README.md)
- [`../handlers/README.md`](../handlers/README.md)
- [`../configs/README.md`](../configs/README.md)
- [`../tests/README.md`](../tests/README.md)

<!-- /ANCHOR:related -->
