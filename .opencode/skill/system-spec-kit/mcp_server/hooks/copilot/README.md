---
title: "Copilot Hooks"
description: "GitHub Copilot CLI hook scripts used by the MCP package."
trigger_phrases:
  - "copilot hooks"
  - "copilot session prime"
---

# Copilot Hooks

## 1. OVERVIEW

`hooks/copilot/` currently contains the Copilot CLI SessionStart banner hook.

- `session-prime.ts` drains stdin, loads the shared startup brief when available, and emits the same high-level startup banner shape used by the other CLI hook surfaces.

The hook is intentionally read-only and does not mutate packet continuity state.

## 2. RELATED

- `../README.md`
- `../claude/README.md`
- `../gemini/README.md`
