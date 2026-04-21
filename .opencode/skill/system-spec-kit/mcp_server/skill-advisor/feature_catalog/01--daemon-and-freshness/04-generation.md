---
title: "Generation-Tagged Snapshot Publication"
description: "Generation counter plus post-commit publication that make reindex transitions atomic and visible to readers without partial-write leakage."
trigger_phrases:
  - "generation counter"
  - "snapshot publication"
  - "post commit publication"
  - "atomic reindex"
---

# Generation-Tagged Snapshot Publication

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Make reindex transitions observable and atomic. Every snapshot is tagged with a monotonically increasing generation so readers can tell when routing state has advanced and cache layers can invalidate in lockstep.

---

## 2. CURRENT REALITY

`lib/freshness/generation.ts` writes the generation counter through a temp-file plus atomic rename. Post-commit publication makes the new snapshot visible to readers only after the counter has advanced. Corrupted counters are recovered when recoverable and reported as `unavailable` freshness when not. Generation bumps feed both `advisor_status.generation` and cache invalidation (see `lib/freshness/cache-invalidation.ts`).

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/generation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/generation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/cache-invalidation.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts` — generation bump atomicity.
- Playbook scenario [AU-004](../../manual_testing_playbook/05--auto-update-daemon/004-generation-publication.md).

---

## 5. RELATED

- [01-watcher.md](./01-watcher.md).
- [05-trust-state.md](./05-trust-state.md).
- [07-cache-invalidation.md](./07-cache-invalidation.md).
