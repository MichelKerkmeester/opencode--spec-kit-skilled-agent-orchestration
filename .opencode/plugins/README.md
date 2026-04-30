---
title: "OpenCode Plugin Entrypoints"
description: "Two plugin entrypoint files OpenCode auto-loads at startup. Helper bridge modules live with their owning skills, not in this folder."
---

# OpenCode Plugin Entrypoints

OpenCode 1.3.17+ auto-loads JavaScript files in `.opencode/plugins/` at session start. This folder is intentionally limited to those entrypoint files so helper modules cannot be mistaken for plugins. Helpers and bridges live alongside their owning skills under `.opencode/skill/.../mcp_server/`.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. CURRENT ENTRYPOINTS](#3--current-entrypoints)
- [4. BRIDGE MODULES](#4--bridge-modules)
- [5. UPGRADE NOTES](#5--upgrade-notes)
- [6. RELATED](#6--related)

---

## 1. OVERVIEW

This folder is OpenCode's local-plugin mounting point. Every `.js` file here is auto-loaded once per session and must export a default plugin factory. Helper code, transports, schemas, and bridges deliberately live elsewhere so the auto-loader cannot pick up non-plugin modules.

---

## 2. QUICK START

When OpenCode boots, every `.js` file in this folder is invoked once. To add a new plugin:

1. Create the entrypoint here (`my-plugin.js`) with a default export.
2. Co-locate any bridge / transport / schema modules under the owning skill, not here.
3. Smoke-test from both the project root and any symlinked workspace before shipping.

---

## 3. CURRENT ENTRYPOINTS

| File | Role |
|---|---|
| `spec-kit-skill-advisor.js` | Prompt-time Spec Kit skill advisor plugin. Surfaces a compact skill recommendation when a user prompt arrives. |
| `spec-kit-compact-code-graph.js` | Transport-backed context and compact-code-graph plugin. Routes context requests to the colocated bridge. |

---

## 4. BRIDGE MODULES

Helper bridge modules are co-located with their owning skill at `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/`, not in this folder:

- `spec-kit-skill-advisor-bridge.mjs`
- `spec-kit-compact-code-graph-bridge.mjs`
- `spec-kit-opencode-message-schema.mjs`

This keeps plugin entrypoints minimal and lets the spec-kit skill own its bridge contracts.

---

## 5. UPGRADE NOTES

When upgrading OpenCode beyond 1.3.17, rerun the 026/007/009 discovery probe:

1. Inspect the local plugin glob OpenCode uses.
2. Add a temporary no-default-export file in this folder.
3. Confirm the regression guard fails as expected.
4. Remove the temporary file.
5. Smoke `opencode` from both the Public root and the Barter symlinked workspace.

---

## 6. RELATED

- `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/` — bridge module home
- `.opencode/skill/system-spec-kit/mcp_server/hooks/` — sibling hook entrypoints (different runtime contract)
