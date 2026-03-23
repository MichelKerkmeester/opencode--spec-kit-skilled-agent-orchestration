---
title: "Session-manager transaction gap fixes"
description: "Tracks the fix that moved `enforceEntryLimit()` calls inside database transactions to prevent concurrent limit violations."
---

# Session-manager transaction gap fixes

## 1. OVERVIEW

Tracks the fix that moved `enforceEntryLimit()` calls inside database transactions to prevent concurrent limit violations.

When two requests arrived at the same time, they could both slip past a size limit check and add more data than allowed. This fix bundles the check and the write into a single step so they cannot be split apart, preventing the system from exceeding its own limits.

---

## 2. CURRENT REALITY

Three call sites of `enforceEntryLimit()` in `session-manager.ts` now run inside transactional boundaries. `markMemorySent()` and `markMemoriesSentBatch()` use `db.transaction()` wrappers, while the `shouldSendMemoriesBatch()` `markAsSent` path uses explicit `BEGIN IMMEDIATE` / `COMMIT` / `ROLLBACK` control. Concurrent MCP requests could otherwise both pass the limit check then both insert, exceeding the entry limit when check and insert were not atomic.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working memory integration |
| `mcp_server/lib/session/session-manager.ts` | Lib | Session lifecycle management |
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Transaction management |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/checkpoint-working-memory.vitest.ts` | Checkpoint working memory |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/session-manager-extended.vitest.ts` | Session manager extended |
| `mcp_server/tests/session-manager.vitest.ts` | Session manager tests |
| `mcp_server/tests/transaction-manager-extended.vitest.ts` | Transaction extended tests |
| `mcp_server/tests/transaction-manager.vitest.ts` | Transaction manager tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |
| `mcp_server/tests/working-memory-event-decay.vitest.ts` | Working memory decay |
| `mcp_server/tests/working-memory.vitest.ts` | Working memory tests |

---

## 4. SOURCE METADATA

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Session-manager transaction gap fixes
- Current reality source: feature_catalog.md
