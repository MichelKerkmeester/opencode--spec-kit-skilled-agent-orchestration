---
title: "Codex hook freshness smoke check"
description: "Small Codex hook probe that checks whether cold-start context came from a ready code graph and reports freshness without blocking startup."
trigger_phrases:
  - "freshness-smoke-check"
  - "Codex freshness smoke check"
  - "cold-start context"
  - "codex hook freshness"
---

# Codex hook freshness smoke check

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

The Codex freshness smoke check is a small diagnostic helper for hook startup surfaces. It checks whether the generated Codex startup context is populated and backed by a ready code graph.

It is intentionally fail-closed: errors report stale/freshness failure without throwing through the hook path.

---

## 2. CURRENT REALITY

`smokeCheckCodexColdStartContext()` calls `buildStartupBrief()`, verifies that `startupSurface` is non-empty and `graphState` is `ready`, and returns `fresh`, `lastUpdateAt`, and measured `latencyMs`. It accepts dependency injection for deterministic tests.

If startup brief construction throws, the helper returns `fresh: false`, `lastUpdateAt: null`, and the measured latency. That keeps Codex startup diagnostics observable while preserving hook startup resilience.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/hooks/codex/lib/freshness-smoke-check.ts:10-21` | Hook lib | Defines result and dependency-injection contracts |
| `mcp_server/hooks/codex/lib/freshness-smoke-check.ts:23-25` | Hook lib | Defines the ready-context predicate |
| `mcp_server/hooks/codex/lib/freshness-smoke-check.ts:27-48` | Hook lib | Runs the smoke check, reports freshness metadata, and fails closed on startup-brief errors |
| `mcp_server/code_graph/lib/startup-brief.ts` | Code graph lib | Builds the startup payload consumed by the smoke check |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/hooks-codex-freshness.vitest.ts` | Vitest | Covers fresh, stale, and failure-return behavior for the Codex smoke check |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/38-codex-hook-freshness-smoke-check.md`
- Packet source: `034-half-auto-upgrades`
