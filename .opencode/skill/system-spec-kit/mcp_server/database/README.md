---
title: "MCP Server Database Storage"
description: "Runtime database directory for memory, code graph, evaluation and state marker files."
trigger_phrases:
  - "database"
  - "sqlite storage"
  - "database directory"
---

# MCP Server Database Storage

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`mcp_server/database/` is the default runtime storage directory for MCP server SQLite files. It is a data directory, not a TypeScript source module folder.

Current responsibilities:

- Store local memory index, vector, FTS and checkpoint data at runtime.
- Store structural code graph and evaluation databases when the default path is active.
- Provide marker files used by runtime state checks.

The default path is resolved through shared path and config helpers. Runtime variables such as `MEMORY_DB_PATH`, `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` can point storage elsewhere.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
MCP server runtime
        │
        ▼
shared path and config helpers
        │
        ▼
mcp_server/database/
        │
        +--> state marker files
        +--> generated SQLite databases
        `--> generated SQLite sidecar files
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
database/
+-- README.md       # Directory guide
+-- .gitkeep        # Keeps the runtime directory present in clean checkouts
`-- .db-updated     # Runtime update marker
```

Generated database files are runtime artifacts. They are not source modules and should not be listed as key source files.

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
database/
+-- README.md
+-- .gitkeep
+-- .db-updated
+-- *.sqlite        # Generated runtime databases
+-- *.db            # Generated runtime databases
+-- *-wal           # Generated SQLite write-ahead logs
`-- *-shm           # Generated SQLite shared-memory files
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `README.md` | Explains the database directory contract. |
| `.gitkeep` | Keeps the directory available before runtime files exist. |
| `.db-updated` | Stores the last database update timestamp for runtime refresh checks. |

Runtime artifacts include `context-index*.sqlite`, `code-graph.sqlite`, `speckit-eval.db`, `*-wal` and `*-shm` files. Treat them as generated data, not source files.

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 6. BOUNDARIES AND FLOW

This directory owns storage location only. Schema creation, migrations, indexing, code graph scans and health checks live in MCP server code and scripts outside this folder.

Main flow:

```text
runtime config -> database path resolution -> SQLite read or write -> .db-updated marker refresh -> health or search tools observe state
```

Do not commit generated SQLite databases or sidecar files unless a test fixture path explicitly requires one outside this runtime directory.

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/database/README.md
```

Use MCP memory and code graph health tools to validate live database state.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- `../core/README.md`
- `../handlers/README.md`
- `../../references/memory/memory_system.md`
- `../../scripts/memory/README.md`

<!-- /ANCHOR:related -->
