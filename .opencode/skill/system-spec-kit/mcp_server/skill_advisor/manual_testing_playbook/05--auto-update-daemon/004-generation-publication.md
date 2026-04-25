---
title: "AU-004 Generation-Tagged Snapshot Publication"
description: "Manual validation that generation counters bump atomically after reindex and that post-commit publication makes fresh snapshots visible to readers."
trigger_phrases:
  - "au-004"
  - "generation counter"
  - "snapshot publication"
  - "reindex commit"
---

# AU-004 Generation-Tagged Snapshot Publication

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that generation counter increments are atomic, persisted through temp-file rename, and that post-commit snapshot publication exposes the new generation to `advisor_status` readers without partial-write leakage.

---

## 2. SETUP

- Repo root as working directory.
- MCP server built.
- Daemon reachable via `advisor_status`.
- Disposable workspace copy if destructive simulation is needed; step 3 touches a live skill file.

---

## 3. STEPS

1. Capture baseline generation:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

2. Touch the `SKILL.md` of an active skill in the workspace:

```bash
touch .opencode/skill/sk-git/SKILL.md
```

3. Wait for the watcher debounce plus reindex to complete.
4. Re-read status:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

5. Call `advisor_recommend` with a prompt that maps to the touched skill and inspect `cache.generation` if present.

---

## 4. EXPECTED

- Generation increments by exactly 1 between step 1 and step 4.
- `lastScanAt` advances.
- `trustState.state` returns to `live`.
- `advisor_recommend` response reflects the new generation where generation is surfaced.
- No intermediate state exposes a generation without a matching snapshot (no partial-write leakage).

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Generation advances without snapshot | Reader sees new generation but stale recommendations | Inspect `lib/freshness/generation.ts` publication atomicity. |
| Reader observes partial write | Recommendation missing newly-indexed skill | Check temp-file rename ordering. |
| Generation never advances | Status unchanged after touch | Combine with AU-001 to isolate watcher vs. publication fault. |

---

## 6. RELATED

- Scenario [AU-001](./001-watcher-narrow-scope.md) — watcher scope.
- Scenario [AU-005](./005-rebuild-from-source.md) — recovery when snapshot unreadable.
- Feature [`01--daemon-and-freshness/04-generation.md`](../../feature_catalog/01--daemon-and-freshness/04-generation.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts`.
