---
title: "Database and schema safety"
description: "Tracks five database-layer bug fixes covering column references, DDL placement, edge deletion filters, update validation and per-path connection isolation."
---

# Database and schema safety

## 1. OVERVIEW

Tracks five database-layer bug fixes covering column references, DDL placement, edge deletion filters, update validation and per-path connection isolation.

Five separate bugs in the database layer were fixed to prevent data corruption. These ranged from referencing a column that did not exist to running operations in the wrong order. Each fix makes sure that database writes happen safely and predictably so your stored data stays accurate and complete.

---

## 2. CURRENT REALITY

Five database-layer bugs were fixed:

**B1: Reconsolidation column reference:** `reconsolidation.ts` referenced a non-existent `frequency_counter` column that would crash at runtime during merge operations. Replaced with `importance_weight` using `Math.min(1.0, currentWeight + 0.1)` merge logic.

**B2: DDL inside transaction:** `checkpoints.ts` placed DDL statements (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ADD COLUMN`) inside a `database.transaction()` block. SQLite silently auto-commits on DDL, which corrupted the transaction boundary during checkpoint restore. DDL now runs before `BEGIN`. Only DML is wrapped in the transaction.

**B3: Edge-deletion filter correctness:** `causal-edges.ts` delete path must match edges where either endpoint equals the target memory ID (`source_id = ? OR target_id = ?`). Regression coverage validates deletion remains scoped to intended source/target rows.

**B4: Missing changes guard:** Save-path UPDATE statements in `handlers/pe-gating.ts` now validate SQLite update results (`result.changes`). Zero-row updates are treated as no-ops/errors instead of false success.

**B5: Connection-map isolation and constitutional cache scoping:** `vector-index-store.ts` no longer lets `initialize_db(custom_path)` overwrite the module-global default connection. Connections are tracked in `db_connections = new Map<string, Database.Database>()` keyed by resolved path, globals are updated only for the validated default store and `close_db()` closes every tracked handle. The constitutional-memory cache key now also includes the `includeArchived` flag, preventing archived-inclusive results from leaking into archived-exclusive reads.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Handler | **B1**: reconsolidation bridge reads/passes `importance_weight` for similar-memory records. |
| `mcp_server/lib/storage/reconsolidation.ts` | Lib | **B1**: merge path boosts `importance_weight` via `Math.min(1.0, currentWeight + 0.1)`. |
| `mcp_server/lib/storage/checkpoints.ts` | Lib | **B2**: runs `CREATE TABLE` / `ALTER TABLE` working-memory DDL before restore transaction execution. |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | **B3**: edge deletion filters by source OR target endpoint to remove only rows linked to the target memory. |
| `mcp_server/handlers/pe-gating.ts` | Handler | **B4**: update/reinforcement paths check `result.changes` to reject zero-row updates. |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/reconsolidation.vitest.ts` | **B1**: MP1 verifies merged content and `importance_weight` boost (`0.5 -> 0.6`). |
| `mcp_server/tests/checkpoint-working-memory.vitest.ts` | **B2**: T213 validates checkpoint restore behavior around working-memory schema/restore flow. |
| `mcp_server/tests/causal-edges-unit.vitest.ts` | **B3**: DM1/DM2 verify deletion filters only intended source/target edge rows. |
| `mcp_server/tests/memory-save-extended.vitest.ts` | **B4**: save update paths treat zero-row UPDATEs (`changes === 0`) as failure/no-op. |

---

## 4. SOURCE METADATA

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Database and schema safety
- Current reality source: FEATURE_CATALOG.md
