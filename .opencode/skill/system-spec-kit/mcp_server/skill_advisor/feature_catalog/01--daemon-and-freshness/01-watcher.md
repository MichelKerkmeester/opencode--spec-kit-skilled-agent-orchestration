---
title: "Chokidar Narrow-Scope Watcher"
description: "Narrow-scope Chokidar watcher that subscribes only to SKILL.md, graph-metadata.json, and dynamic derived.key_files paths."
trigger_phrases:
  - "daemon watcher"
  - "chokidar narrow scope"
  - "skill.md watcher"
  - "key_files watcher"
---

# Chokidar Narrow-Scope Watcher

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Keep the advisor graph fresh without incurring the cost of watching the whole workspace. The narrow-scope watcher subscribes only to files that can affect routing: each skill's `SKILL.md`, its `graph-metadata.json`, and any path declared under `derived.key_files`.

---

## 2. CURRENT REALITY

`lib/daemon/watcher.ts` boots a Chokidar watcher at daemon startup (through `lib/daemon/lifecycle.ts`) scoped to per-skill `SKILL.md` and `graph-metadata.json` paths. When a skill declares additional tracked files via `derived.key_files` in its graph metadata, those paths are added dynamically. Unrelated writes under `.opencode/plugins/`, repo source code, or other skill subfolders do not trigger a reindex. Track H hardening (post-Phase-027) added reindex-storm back-pressure so rapid bursts of writes debounce into a single reindex event.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts` — watcher bring-up, scope assertions, debounce checks.
- Playbook scenario [AU-001](../../manual_testing_playbook/05--auto-update-daemon/001-watcher-narrow-scope.md) — manual scope validation.

---

## 5. RELATED

- [02-lease.md](./02-lease.md) — single-writer lease.
- [03-lifecycle.md](./03-lifecycle.md) — daemon lifecycle.
- [04-generation.md](./04-generation.md) — generation bump publication.
