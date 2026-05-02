---
title: "Skill Advisor Handlers: MCP Tool Entrypoints"
description: "MCP handler modules for advisor recommendation, status, rebuild and validation tools."
trigger_phrases:
  - "skill advisor handlers"
  - "advisor recommend handler"
  - "advisor status handler"
---

# Skill Advisor Handlers: MCP Tool Entrypoints

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

---

## 1. OVERVIEW

`skill_advisor/handlers/` contains MCP tool handlers for advisor operations. The handlers are thin entrypoints that delegate recommendation, status, rebuild and validation behavior to library modules.

Current state:

- Exposes recommendation, status, rebuild and validation handlers.
- Uses `index.ts` as the local handler export surface.
- Keeps request orchestration separate from scorer and freshness internals.

---

## 2. DIRECTORY TREE

```text
handlers/
+-- advisor-rebuild.ts     # Rebuild handler
+-- advisor-recommend.ts   # Recommendation handler
+-- advisor-status.ts      # Status handler
+-- advisor-validate.ts    # Validation handler
+-- index.ts               # Handler exports
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `advisor-recommend.ts` | Handles advisor recommendation tool calls. |
| `advisor-status.ts` | Handles advisor status tool calls. |
| `advisor-rebuild.ts` | Handles advisor rebuild tool calls. |
| `advisor-validate.ts` | Handles advisor validation tool calls. |
| `index.ts` | Re-exports handler modules for registration. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Import advisor library modules, schemas and shared response helpers as needed. |
| Exports | Export MCP handler functions only. |
| Ownership | Keep tool request orchestration here. Put scoring in `../lib/scorer/` and schemas in `../schemas/`. |

Main flow:

```text
MCP tool request
  -> handler validation and orchestration
  -> advisor library helper
  -> prompt-safe response payload
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `advisor-recommend.ts` | Handler | Recommendation endpoint. |
| `advisor-status.ts` | Handler | Status endpoint. |
| `advisor-rebuild.ts` | Handler | Rebuild endpoint. |
| `advisor-validate.ts` | Handler | Validation endpoint. |
| `index.ts` | Barrel module | Local handler exports. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../lib/README.md`](../lib/README.md)
- [`../schemas/README.md`](../schemas/README.md)
