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

Three call sites of `enforceEntryLimit()` in `session-manager.ts` now run inside transactional boundaries (lines 496, 557, and 593). `markMemorySent()` (line 557) and `markMemoriesSentBatch()` (line 593) use `db.transaction()` wrappers, while the `shouldSendMemoriesBatch()` `markAsSent` path (line 496) uses explicit `BEGIN IMMEDIATE` / `COMMIT` / `ROLLBACK` control. Concurrent MCP requests could otherwise both pass the limit check then both insert, exceeding the entry limit when check and insert were not atomic.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/lib/session/session-manager.ts` | Session lifecycle management: 3 `enforceEntryLimit()` call sites wrapped in transactions |
| `mcp_server/lib/storage/transaction-manager.ts` | Transaction management utilities |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/session-manager-extended.vitest.ts` | Session manager extended tests including `enforceEntryLimit` |
| `mcp_server/tests/session-manager.vitest.ts` | Session manager core tests |
| `mcp_server/tests/transaction-manager-extended.vitest.ts` | Transaction extended tests |
| `mcp_server/tests/transaction-manager.vitest.ts` | Transaction manager tests |

---

## 4. SOURCE METADATA

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Session-manager transaction gap fixes
- Current reality source: FEATURE_CATALOG.md
