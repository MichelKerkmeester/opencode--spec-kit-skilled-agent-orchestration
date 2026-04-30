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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Make reindex transitions observable and atomic. Every snapshot is tagged with a monotonically increasing generation so readers can tell when routing state has advanced and cache layers can invalidate in lockstep.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/freshness/generation.ts` writes the generation counter through a temp-file plus atomic rename. Post-commit publication makes the new snapshot visible to readers only after the counter has advanced. Corrupted counters are recovered when recoverable and reported as `unavailable` freshness when not. Generation bumps feed both `advisor_status.generation` and cache invalidation (see `lib/freshness/cache-invalidation.ts`).

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/generation.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/cache-invalidation.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts` | Automated test | generation bump atomicity |
| `Playbook scenario [AU-004](../../manual_testing_playbook/05--auto-update-daemon/004-generation-publication.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Daemon and freshness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--daemon-and-freshness/04-generation.md`

Related references:

- [01-watcher.md](./01-watcher.md).
- [05-trust-state.md](./05-trust-state.md).
- [07-cache-invalidation.md](./07-cache-invalidation.md).
<!-- /ANCHOR:source-metadata -->
