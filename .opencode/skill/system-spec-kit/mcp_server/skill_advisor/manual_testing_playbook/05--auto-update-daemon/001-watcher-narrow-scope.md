---
title: "AU-001 Chokidar Watcher Narrow Scope"
description: "Manual validation that the daemon Chokidar watcher subscribes only to SKILL.md, graph-metadata.json, and derived.key_files paths and does not fire on unrelated file changes."
trigger_phrases:
  - "au-001"
  - "watcher scope"
  - "chokidar narrow scope"
  - "auto update daemon watcher"
---

# AU-001 Chokidar Watcher Narrow Scope

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that the daemon watcher in `lib/daemon/watcher.ts` subscribes only to `SKILL.md`, `graph-metadata.json`, and dynamic `derived.key_files` paths, and that unrelated file writes under `.opencode/` or repo root do not trigger a reindex.

---

## 2. SETUP

- Repo root is the working directory.
- MCP server has been built with `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
- The advisor daemon is running (either via MCP server startup or on-demand through `advisor_status`).
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset.
- Terminal capture is enabled so daemon stderr or structured logs are recorded.

---

## 3. STEPS

1. Capture baseline generation:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

2. Touch an unrelated file under `.opencode/`:

```bash
touch .opencode/plugins/spec-kit-skill-advisor.js
```

3. Wait 3 seconds and recheck status:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

4. Touch a tracked skill file:

```bash
touch .opencode/skill/sk-doc/SKILL.md
```

5. Wait 3 seconds and recheck status again.

---

## 4. EXPECTED

- After step 2 unrelated touch, `generation` in `advisor_status` is unchanged from step 1.
- After step 4 tracked touch, `generation` increments by exactly 1.
- `freshness` returns to `live` after the debounce window.
- Daemon logs (if exposed) show a reindex event only after the SKILL.md touch, not after the plugin touch.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Watcher fires on unrelated paths | Generation increments after plugin touch | Inspect `lib/daemon/watcher.ts` glob patterns for over-subscription. |
| Watcher misses tracked paths | Generation unchanged after SKILL.md touch | Confirm Chokidar is active; inspect lease and lifecycle logs. |
| Stale trust state after touch | `freshness` remains `stale` beyond debounce window | Check `lib/freshness/cache-invalidation.ts` hook-up to generation bumps. |

---

## 6. RELATED

- Scenario [AU-002](./002-lease-single-writer.md) — single-writer lease semantics.
- Scenario [AU-004](./004-generation-publication.md) — generation bump publication.
- Feature [`01--daemon-and-freshness/01-watcher.md`](../../feature_catalog/01--daemon-and-freshness/01-watcher.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts`.
