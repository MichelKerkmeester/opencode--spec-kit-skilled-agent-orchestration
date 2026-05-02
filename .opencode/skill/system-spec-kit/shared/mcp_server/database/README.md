---
title: "Shared MCP Server Database Directory"
description: "Runtime database directory used by shared MCP server path and embedding helpers."
trigger_phrases:
  - "shared database directory"
  - "sqlite database location"
  - "context index database"
---

# Shared MCP Server Database Directory

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

`shared/mcp_server/database/` is a runtime storage directory used by shared MCP server helpers and tests that resolve database paths through the shared package. It is a data directory, not a source module folder.

Current responsibilities:

- Hold runtime SQLite files when shared-package path resolution targets this location.
- Hold test database fixtures when a shared-package test needs a concrete database file.
- Provide `.db-updated` for refresh detection through shared config exports.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
shared/config.ts and shared/paths.ts
        │
        ▼
shared/mcp_server/database/
        │
        +--> .db-updated marker
        +--> test database fixtures when present
        `--> generated SQLite files when this path is active
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
database/
+-- README.md                  # Directory guide
+-- .db-updated                # Runtime update marker
`-- test-context-index.sqlite  # Shared-package test fixture when present
```

Generated SQLite files and sidecars are runtime artifacts. They are not source modules.

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
database/
+-- README.md
+-- .db-updated
+-- test-context-index.sqlite
+-- *.sqlite        # Generated runtime databases or test fixtures
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
| `README.md` | Explains the shared database directory contract. |
| `.db-updated` | Stores the last database update timestamp for refresh checks. |
| `test-context-index.sqlite` | Test fixture for shared-package database path behavior when present. |

Do not treat `*-wal` or `*-shm` files as key files. They are SQLite sidecars created and removed by SQLite.

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 6. BOUNDARIES AND FLOW

This directory does not own schema code, embedding generation or index scan logic. Those responsibilities live in shared helpers, MCP server modules and scripts.

Main flow:

```text
shared config -> resolved database path -> SQLite file read or write -> .db-updated marker -> caller refresh check
```

Keep runtime database files out of source inventories unless they are named test fixtures with a clear purpose.

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/shared/mcp_server/database/README.md
```

For code changes that affect this path, run the shared package tests that cover `shared/config.ts`, `shared/paths.ts` and embedding profile path resolution.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [shared/config.ts](../../config.ts)
- [shared/paths.ts](../../paths.ts)
- [shared/embeddings/profile.ts](../../embeddings/profile.ts)
- [shared/embeddings/README.md](../../embeddings/README.md)

<!-- /ANCHOR:related -->
