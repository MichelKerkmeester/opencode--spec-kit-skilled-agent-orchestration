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

The corrections module (`lib/learning/corrections.ts`) tracks inter-memory relationship signals during the learning pipeline. When a memory supersedes, deprecates, refines, or merges with another, the correction is recorded with before/after stability scores and applied penalty/boost values. Four correction types are supported: `superseded`, `deprecated`, `refined`, and `merged`.

Each correction adjusts the stability scores of both the original and correcting memories: the original receives a penalty while the correction receives a boost. Stability changes are tracked in a `StabilityChanges` structure for audit purposes. The feature is gated by `SPECKIT_RELATIONS` (default `true`). When disabled, relational learning corrections are skipped and no stability adjustments are applied.

Undo is part of the live behavior, not just the schema. `undo_correction()` runs inside a transaction, restores the pre-correction stability values for the original memory and any correction memory, marks the correction row as undone (`is_undone = 1`, `undone_at = datetime('now')`), and deletes only the correction-owned causal edge for the matching relation. If the edge still uses the older legacy evidence format, the code falls back to a scoped legacy delete rather than removing every same-relation edge between the pair.

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
