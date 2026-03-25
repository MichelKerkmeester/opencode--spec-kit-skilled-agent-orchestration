---
title: "Correction tracking with undo"
description: "Covers the corrections module that records inter-memory relationship signals and adjusts stability scores during learning."
---

# Correction tracking with undo

## 1. OVERVIEW

Covers the corrections module that records inter-memory relationship signals and adjusts stability scores during learning.

When a newer memory replaces or refines an older one, the system records what changed and why. The old memory gets a lower confidence score while the new one gets a boost. This creates a paper trail of corrections so you can see how your knowledge evolved over time and understand why older information was updated.

---

## 2. CURRENT REALITY

The corrections module (`lib/learning/corrections.ts`) implements inter-memory relationship recording and stability-adjustment logic as a library module. When a caller invokes it, a correction can record before/after stability scores plus applied penalty/boost values for four correction types: `superseded`, `deprecated`, `refined`, and `merged`.

Each correction adjusts the stability scores of both the original and correcting memories: the original receives a penalty while the correction receives a boost. Stability changes are tracked in a `StabilityChanges` structure for audit purposes. The feature is gated by `SPECKIT_RELATIONS` (default `true`). When disabled, relational learning corrections are skipped and no stability adjustments are applied.

This module is implemented and tested, but it is **not** currently wired to any MCP tool endpoint or mutation-handler hot path. `record_correction()`, `undo_correction()`, and the correction history/stat helpers are exported through `lib/learning/index.ts`, yet no handler or tool dispatcher calls them today. Treat the behavior below as library capability rather than live end-user MCP behavior.

Undo logic exists in the module. `undo_correction()` runs inside a transaction with three steps:

1. **Stability rollback** -- restores the pre-correction stability values for both the original memory and the correcting memory using the `before_stability` and `after_stability` values stored on the correction row at record time.
2. **`is_undone` marking** -- sets `is_undone = 1` and records `undone_at = datetime('now')` on the correction row so the correction is permanently flagged as reversed without deleting the audit trail.
3. **Scoped causal edge deletion** -- removes only the causal edge that belongs to this specific correction. The primary path matches on the `Correction#{id}:` evidence prefix (where `{id}` is the correction row ID), so only the correction-owned edge is removed rather than every edge between the pair. If the edge still uses the older legacy evidence format without this prefix, the code falls back to a scoped legacy delete rather than removing every same-relation edge between the pair.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/learning/corrections.ts` | Lib | Correction tracking and stability adjustment |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/corrections.vitest.ts` | Correction tracking tests |

---

## 4. SOURCE METADATA

- Group: Mutation
- Source feature title: Correction tracking with undo
- Current reality source: audit-D04 gap backfill
