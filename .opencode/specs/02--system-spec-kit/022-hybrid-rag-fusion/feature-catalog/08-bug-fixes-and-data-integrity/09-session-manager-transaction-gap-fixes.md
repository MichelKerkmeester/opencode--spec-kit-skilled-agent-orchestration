# Session-manager transaction gap fixes

## Current Reality

Two instances of `enforceEntryLimit()` called outside `db.transaction()` blocks in `session-manager.ts` were moved inside. Concurrent MCP requests could both pass the limit check then both insert, exceeding the entry limit when check and insert were not atomic. Both paths now run check-and-insert atomically inside the transaction.

## Source Files

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

## Source Metadata

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Session-manager transaction gap fixes
- Current reality source: feature_catalog.md
