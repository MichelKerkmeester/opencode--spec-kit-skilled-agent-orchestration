---
title: "Generation-Tied Cache Invalidation"
description: "Targeted cache invalidation that ties prompt-cache and attribution-cache entries to generation so stale reads are impossible after a reindex."
trigger_phrases:
  - "cache invalidation"
  - "generation tied cache"
  - "prompt cache invalidation"
  - "targeted invalidation"
---

# Generation-Tied Cache Invalidation

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Prevent stale cache reads after a graph reindex. Every cache entry is tagged with the generation under which it was computed; a generation bump atomically invalidates affected entries without blowing away the whole cache.

---

## 2. CURRENT REALITY

`lib/freshness/cache-invalidation.ts` bumps an internal invalidation epoch whenever the generation advances. Prompt cache entries (`lib/prompt-cache.ts`) carry the generation as part of their key so post-bump hits miss cleanly. The 5-minute TTL still applies, but generation-based invalidation fires earlier when source truly changed. Lane-attribution scoring caches rebuild alongside the next recommendation call.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/cache-invalidation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/prompt-cache.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-prompt-cache.vitest.ts` — prompt cache TTL and invalidation.
- Playbook scenario [AU-004](../../manual_testing_playbook/05--auto-update-daemon/004-generation-publication.md).

---

## 5. RELATED

- [04-generation.md](./04-generation.md).
- [05-trust-state.md](./05-trust-state.md).
- [`06--mcp-surface/01-advisor-recommend.md`](../06--mcp-surface/01-advisor-recommend.md).
