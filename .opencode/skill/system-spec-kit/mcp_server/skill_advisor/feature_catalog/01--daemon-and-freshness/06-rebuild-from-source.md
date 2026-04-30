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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Ensure the advisor never gets stuck in an unrecoverable state when SQLite storage is corrupted. The rebuild-from-source path reconstructs routable state from the authoritative source files without user intervention.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/freshness/rebuild-from-source.ts` detects a corrupt or unreadable SQLite store via the daemon lifecycle, then walks `.opencode/skill/*/SKILL.md` plus each `graph-metadata.json`, applies the auto-indexing derivation pipeline, and republishes a fresh snapshot. Throughout the rebuild, readers see `unavailable` trust state and fail-open responses rather than exceptions. Rebuild is also the canonical recovery path for the H5 operator playbook.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts` | Daemon | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts` | Automated test | rebuild trigger paths |
| `Playbook scenario [AU-005](../../manual_testing_playbook/05--auto-update-daemon/005-rebuild-from-source.md) and [OP-003](../../manual_testing_playbook/04--operator-h5/003-unavailable-daemon.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Daemon and freshness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--daemon-and-freshness/06-rebuild-from-source.md`

Related references:

- [05-trust-state.md](./05-trust-state.md).
- [07-cache-invalidation.md](./07-cache-invalidation.md).
- [`02--auto-indexing/01-derived-extraction.md`](../02--auto-indexing/01-derived-extraction.md) — source extraction pipeline consumed during rebuild.
<!-- /ANCHOR:source-metadata -->
