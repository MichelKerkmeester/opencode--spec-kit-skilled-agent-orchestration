---
title: "Negative feedback confidence signal"
description: "Describes the negative validation demotion multiplier that decreases by 0.1 per negative feedback event (floor 0.3) with a 30-day half-life recovery, applied during Stage 2 feedback signals."
---

# Negative feedback confidence signal

## 1. OVERVIEW

Describes the negative validation demotion multiplier that decreases by 0.1 per negative feedback event (floor 0.3) with a 30-day half-life recovery, applied during Stage 2 feedback signals.

When you tell the system a result was not helpful, it remembers that feedback and pushes that memory lower in future searches. The more times you say "not useful," the further it drops, but it can never be completely hidden. Over time the penalty fades, giving the memory a chance to recover. This way the system learns from your feedback without permanently burying anything.

---

## 2. CURRENT REALITY

When you mark a memory as not useful via `memory_validate(wasUseful: false)`, the signal now flows into composite scoring as a demotion multiplier. The multiplier starts at 1.0, decreases by 0.1 per negative validation and floors at 0.3 so a memory is never suppressed below 30% of its natural score. Time-based recovery with a 30-day half-life (`RECOVERY_HALF_LIFE_MS`) gradually restores the multiplier: the penalty halves every 30 days since the last negative validation.

Negative feedback events are persisted to a `negative_feedback_events` table. The search handler reads these events and applies the multiplier during the feedback signals step in Stage 2 of the pipeline. Runs behind the `SPECKIT_NEGATIVE_FEEDBACK` flag (default ON).

**Sprint 8 update:** The unused `RECOVERY_HALF_LIFE_DAYS` constant was removed (the millisecond-based `RECOVERY_HALF_LIFE_MS` is the actual constant used in computation).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/confidence-tracker.ts` | Lib | Confidence tracking |
| `mcp_server/lib/scoring/negative-feedback.ts` | Lib | Negative feedback demotion |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/confidence-tracker.vitest.ts` | Confidence tracking tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Negative feedback confidence signal
- Current reality source: FEATURE_CATALOG.md
