# Auto-promotion on validation

## Current Reality

Positive validations now trigger automatic tier promotion. When a normal-tier memory accumulates 5 positive validations, it is promoted to important. When an important-tier memory reaches 10, it is promoted to critical. A throttle safeguard limits promotions to 3 per 8-hour rolling window to prevent runaway promotion during bulk validation sessions.

Constitutional, critical, temporary and deprecated tiers are non-promotable. Each promotion is logged to a `memory_promotion_audit` table for traceability. The `memory_validate` response includes `autoPromotion` metadata showing whether promotion was attempted, the previous and new tier, validation count and the reason.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/auto-promotion.ts` | Lib | Auto-promotion on validation |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |

## Source Metadata

- Group: Scoring and calibration
- Source feature title: Auto-promotion on validation
- Current reality source: feature_catalog.md
