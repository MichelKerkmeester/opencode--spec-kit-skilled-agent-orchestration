---
title: "Rebuild From Source on Corrupt SQLite"
description: "Recovery path that reconstructs the advisor graph from SKILL.md and graph-metadata.json sources when the SQLite database is corrupt or unreadable."
trigger_phrases:
  - "rebuild from source"
  - "corrupt sqlite recovery"
  - "source driven rebuild"
  - "advisor recovery"
---

# Rebuild From Source on Corrupt SQLite

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Ensure the advisor never gets stuck in an unrecoverable state when SQLite storage is corrupted. The rebuild-from-source path reconstructs routable state from the authoritative source files without user intervention.

---

## 2. CURRENT REALITY

`lib/freshness/rebuild-from-source.ts` detects a corrupt or unreadable SQLite store via the daemon lifecycle, then walks `.opencode/skill/*/SKILL.md` plus each `graph-metadata.json`, applies the auto-indexing derivation pipeline, and republishes a fresh snapshot. Throughout the rebuild, readers see `unavailable` trust state and fail-open responses rather than exceptions. Rebuild is also the canonical recovery path for the H5 operator playbook.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/rebuild-from-source.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/lifecycle.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts` — rebuild trigger paths.
- Playbook scenario [AU-005](../../manual_testing_playbook/05--auto-update-daemon/005-rebuild-from-source.md) and [OP-003](../../manual_testing_playbook/04--operator-h5/003-unavailable-daemon.md).

---

## 5. RELATED

- [05-trust-state.md](./05-trust-state.md).
- [07-cache-invalidation.md](./07-cache-invalidation.md).
- [`02--auto-indexing/01-derived-extraction.md`](../02--auto-indexing/01-derived-extraction.md) — source extraction pipeline consumed during rebuild.
