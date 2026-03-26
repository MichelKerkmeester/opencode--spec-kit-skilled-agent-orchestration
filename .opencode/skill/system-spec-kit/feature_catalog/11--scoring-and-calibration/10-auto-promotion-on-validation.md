---
title: "Auto-promotion on validation"
description: "Describes automatic tier promotion triggered by positive validations (normal at 5, important at 10) with a throttle safeguard limiting promotions to 3 per 8-hour rolling window."
---

# Auto-promotion on validation

## 1. OVERVIEW

Describes automatic tier promotion triggered by positive validations (normal at 5, important at 10) with a throttle safeguard limiting promotions to 3 per 8-hour rolling window.

When a memory keeps proving useful over and over, it earns a promotion. After five thumbs-up reviews, a regular memory becomes "important." After ten, it becomes "critical." This happens automatically so you do not have to manually tag your most valuable knowledge. A speed limit prevents too many promotions from happening at once during a busy session.

---

## 2. CURRENT REALITY

Positive validations now trigger automatic tier promotion. When a normal-tier memory accumulates 5 positive validations, it is promoted to important. When an important-tier memory reaches 10, it is promoted to critical. A throttle safeguard limits promotions to 3 per 8-hour rolling window to prevent runaway promotion during bulk validation sessions.

Constitutional, critical, temporary and deprecated tiers are non-promotable. Each promotion is logged to a `memory_promotion_audit` table for traceability. The `memory_validate` response includes `autoPromotion` metadata showing whether promotion was attempted, the previous and new tier, validation count and the reason.

---

## 3. HANDLER-PATH COVERAGE

`memory_validate` enters `handleMemoryValidate(...)` in `mcp_server/handlers/checkpoints.ts`, records validation via `confidenceTracker.recordValidation(...)` and on positive feedback (`wasUseful === true`) calls `executeAutoPromotion(database, memoryId)`. The returned result is surfaced in `data.autoPromotion`.

---

## 4. BEHAVIOR COVERAGE MATRIX

| Behavior | Implementation path | Test coverage |
|------|----------------------|---------------|
| normal -> important at 5 validations | `PROMOTION_PATHS.normal.threshold = 5`, checked by `checkAutoPromotion(...)`, executed by `executeAutoPromotion(...)` | `mcp_server/tests/learned-feedback.vitest.ts` (`R11-AP01`), `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` (`auto-promotion checks use positive-validation counts`) |
| important -> critical at 10 validations | `PROMOTION_PATHS.important.threshold = 10`, checked by `checkAutoPromotion(...)` | `mcp_server/tests/learned-feedback.vitest.ts` (`R11-AP02`) |
| Throttle behavior (3 per 8h rolling window) | `MAX_PROMOTIONS_PER_WINDOW = 3`, `PROMOTION_WINDOW_HOURS = 8`, enforced in `executeAutoPromotion(...)` transaction | `mcp_server/tests/learned-feedback.vitest.ts` (`R11-AP12`, `R11-AP13`) |
| Non-promotable tier rejection | `NON_PROMOTABLE_TIERS` guard in `checkAutoPromotion(...)`, returns `tier_not_promotable:*` reason | `mcp_server/tests/learned-feedback.vitest.ts` (`R11-AP05`, `R11-AP06`) |

---

## 5. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/auto-promotion.ts` | Lib | Auto-promotion on validation |
| `mcp_server/handlers/checkpoints.ts` | Handler | `memory_validate` entrypoint wiring to auto-promotion |
| `mcp_server/lib/scoring/confidence-tracker.ts` | Lib | Validation count updates used by promotion checks |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/learned-feedback.vitest.ts` | Promotion thresholds, non-promotable guards, and throttle window enforcement |
| `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` | Positive-validation counting semantics for promotion eligibility |
| `mcp_server/tests/checkpoints-extended.vitest.ts` | `handleMemoryValidate` handler happy-path coverage |

---

## 6. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Auto-promotion on validation
- Current reality source: FEATURE_CATALOG.md
