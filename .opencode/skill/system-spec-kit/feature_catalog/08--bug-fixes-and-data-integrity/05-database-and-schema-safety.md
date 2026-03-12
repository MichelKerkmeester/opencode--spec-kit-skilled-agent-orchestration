# Database and schema safety

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Database and schema safety.

## 2. CURRENT REALITY

Four database-layer bugs were fixed:

**B1 — Reconsolidation column reference:** `reconsolidation.ts` referenced a non-existent `frequency_counter` column that would crash at runtime during merge operations. Replaced with `importance_weight` using `Math.min(1.0, currentWeight + 0.1)` merge logic.

**B2 — DDL inside transaction:** `checkpoints.ts` placed DDL statements (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ADD COLUMN`) inside a `database.transaction()` block. SQLite silently auto-commits on DDL, which corrupted the transaction boundary during checkpoint restore. DDL now runs before `BEGIN`; only DML is wrapped in the transaction.

**B3 — SQL operator precedence:** `causal-edges.ts` had `WHERE a AND b OR c` without parentheses, matching wrong rows on edge deletion. Fixed to `WHERE a AND (b OR c)`.

**B4 — Missing changes guard:** Save-path UPDATE statements in `handlers/pe-gating.ts` now validate SQLite update results (`result.changes`). Zero-row updates are treated as no-ops/errors instead of false success.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Handler | **B1**: reconsolidation bridge reads/passes `importance_weight` for similar-memory records. |
| `mcp_server/lib/storage/reconsolidation.ts` | Lib | **B1**: merge path boosts `importance_weight` via `Math.min(1.0, currentWeight + 0.1)`. |
| `mcp_server/lib/storage/checkpoints.ts` | Lib | **B2**: runs `CREATE TABLE` / `ALTER TABLE` working-memory DDL before restore transaction execution. |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | **B3**: SQL condition groups are explicitly parenthesized where AND/OR precedence matters. |
| `mcp_server/handlers/pe-gating.ts` | Handler | **B4**: update/reinforcement paths check `result.changes` to reject zero-row updates. |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/reconsolidation.vitest.ts` | **B1**: MP1 verifies merged content and `importance_weight` boost (`0.5 -> 0.6`). |
| `mcp_server/tests/checkpoint-working-memory.vitest.ts` | **B2**: T213 validates checkpoint restore behavior around working-memory schema/restore flow. |
| `mcp_server/tests/causal-edges-unit.vitest.ts` | **B3**: DM1/DM2 verify deletion filters only intended source/target edge rows. |
| `mcp_server/tests/memory-save-extended.vitest.ts` | **B4**: save update paths treat zero-row UPDATEs (`changes === 0`) as failure/no-op. |

## 4. SOURCE METADATA

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Database and schema safety
- Current reality source: feature_catalog.md
