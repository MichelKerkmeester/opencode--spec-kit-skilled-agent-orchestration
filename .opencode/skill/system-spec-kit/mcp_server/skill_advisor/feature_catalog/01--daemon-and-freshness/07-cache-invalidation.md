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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Prevent stale cache reads after a graph reindex. Every cache entry is tagged with the generation under which it was computed; a generation bump atomically invalidates affected entries without blowing away the whole cache.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/freshness/cache-invalidation.ts` bumps an internal invalidation epoch whenever the generation advances. Prompt cache entries (`lib/prompt-cache.ts`) carry the generation as part of their key so post-bump hits miss cleanly. The 5-minute TTL still applies, but generation-based invalidation fires earlier when source truly changed. Lane-attribution scoring caches rebuild alongside the next recommendation call.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/cache-invalidation.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/prompt-cache.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-prompt-cache.vitest.ts` | Automated test | prompt cache TTL and invalidation |
| `Playbook scenario [AU-004](../../manual_testing_playbook/05--auto-update-daemon/004-generation-publication.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Daemon and freshness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--daemon-and-freshness/07-cache-invalidation.md`

Related references:

- [04-generation.md](./04-generation.md).
- [05-trust-state.md](./05-trust-state.md).
- [`06--mcp-surface/01-advisor-recommend.md`](../06--mcp-surface/01-advisor-recommend.md).
<!-- /ANCHOR:source-metadata -->
