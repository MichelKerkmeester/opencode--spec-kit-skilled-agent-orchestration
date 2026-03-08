# Database and schema safety

## Current Reality

Four database-layer bugs were fixed:

**B1 — Reconsolidation column reference:** `reconsolidation.ts` referenced a non-existent `frequency_counter` column that would crash at runtime during merge operations. Replaced with `importance_weight` using `Math.min(1.0, currentWeight + 0.1)` merge logic.

**B2 — DDL inside transaction:** `checkpoints.ts` placed DDL statements (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ADD COLUMN`) inside a `database.transaction()` block. SQLite silently auto-commits on DDL, which corrupted the transaction boundary during checkpoint restore. DDL now runs before `BEGIN`; only DML is wrapped in the transaction.

**B3 — SQL operator precedence:** `causal-edges.ts` had `WHERE a AND b OR c` without parentheses, matching wrong rows on edge deletion. Fixed to `WHERE a AND (b OR c)`.

**B4 — Missing changes guard:** `memory-save.ts` UPDATE statements reported success even when zero rows were updated. Added `.changes > 0` guards so callers can distinguish actual updates from no-ops.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Vector index schema |
| `mcp_server/lib/search/vector-index-types.ts` | Lib | Vector index type definitions |
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Transaction management |
| `mcp_server/lib/utils/canonical-path.ts` | Lib | Canonical path resolution |
| `mcp_server/lib/utils/logger.ts` | Lib | Logger utility |
| `shared/config.ts` | Shared | Shared configuration |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/cognitive-gaps.vitest.ts` | Cognitive gap analysis |
| `mcp_server/tests/config-cognitive.vitest.ts` | Cognitive config tests |
| `mcp_server/tests/consumption-logger.vitest.ts` | Consumption logger tests |
| `mcp_server/tests/db-state-graph-reinit.vitest.ts` | DB state graph reinit |
| `mcp_server/tests/embedding-cache.vitest.ts` | Embedding cache tests |
| `mcp_server/tests/eval-logger.vitest.ts` | Eval logger tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/transaction-manager-extended.vitest.ts` | Transaction extended tests |
| `mcp_server/tests/transaction-manager.vitest.ts` | Transaction manager tests |
| `mcp_server/tests/trigger-config-extended.vitest.ts` | Trigger config extended |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |

## Source Metadata

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Database and schema safety
- Current reality source: feature_catalog.md
