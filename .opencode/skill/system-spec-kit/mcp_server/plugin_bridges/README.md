---
title: "Plugin Bridges: OpenCode Helper Scripts"
description: "Executable helper scripts used by OpenCode plugins to call Spec Kit runtime surfaces."
trigger_phrases:
  - "plugin bridge"
  - "opencode helper script"
---

# Plugin Bridges: OpenCode Helper Scripts

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

---

## 1. OVERVIEW

`plugin_bridges/` contains Node `.mjs` helper scripts that sit outside `.opencode/plugins/`. The scripts let plugin entrypoints call built MCP server and advisor surfaces while keeping OpenCode plugin discovery limited to real plugin files.

Current state:

- Provides a session resume bridge for compact code graph injection.
- Provides message-shape helpers for safe synthetic text-part insertion.
- Provides a skill advisor subprocess bridge with native and local fallback paths.

---

## 2. DIRECTORY TREE

```text
plugin_bridges/
+-- spec-kit-compact-code-graph-bridge.mjs  # Calls session resume and emits transport JSON
+-- spec-kit-opencode-message-schema.mjs    # Validates OpenCode message parts and markers
+-- spec-kit-skill-advisor-bridge.mjs       # Calls advisor compat handlers over stdin and stdout
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `spec-kit-compact-code-graph-bridge.mjs` | Initializes runtime state, calls `handleSessionResume` and writes transport text to stdout. |
| `spec-kit-opencode-message-schema.mjs` | Defines message-anchor checks, synthetic text-part creation and unsafe part detection. |
| `spec-kit-skill-advisor-bridge.mjs` | Reads bridge input from stdin, calls advisor compat modules and emits one JSON response. |

---

## 4. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | May import built runtime files from `mcp_server/dist/` and local schema files needed by plugin bridges. |
| Exports | Message schema helpers export functions for plugin code. Executable bridges communicate through stdin, stdout and stderr. |
| Ownership | Owns subprocess and plugin-adapter glue. Core MCP behavior stays in handlers, session libraries and advisor compat modules. |

---

## 5. VALIDATION

Run from the repository root.

```bash
npm test -- --runInBand
```

Expected result: Plugin bridge smoke tests and related advisor or message-schema tests pass.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../skill_advisor/README.md`](../skill_advisor/README.md)
