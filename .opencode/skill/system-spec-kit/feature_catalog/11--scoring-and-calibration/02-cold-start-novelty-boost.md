---
title: "Cold-start novelty boost"
description: "Describes the exponential decay novelty boost for memories under 48 hours old that counteracts FSRS temporal bias against recently indexed items."
---

# Cold-start novelty boost

## 1. OVERVIEW

Describes the exponential decay novelty boost for memories under 48 hours old that counteracts FSRS temporal bias against recently indexed items.

Brand-new memories start with a disadvantage because the scoring system has not had time to learn how useful they are. This feature gives freshly saved memories a temporary boost that fades over two days, like a "new arrival" spotlight at a bookstore. It has since been turned off because testing showed it was not making a practical difference, but the logic is kept around in case it is needed later.

---

## 2. CURRENT REALITY

**STATUS: EFFECTIVELY DISABLED.** The hot-path call has been removed and telemetry is hardcoded to `noveltyBoostApplied: false`. This feature has no runtime effect.

FSRS temporal decay biases against recent items. A memory indexed 2 hours ago has barely any retrievability score, even when it is exactly what you need.

The novelty boost was designed to apply an exponential decay (`0.15 * exp(-elapsed_hours / 12)`) to memories under 48 hours old, counteracting that bias. At indexing time, the boost would be 0.15. After 12 hours, it drops to about 0.055. By 48 hours, it is effectively zero.

The boost applied before FSRS decay and capped the composite score at 0.95 to prevent runaway inflation. One side effect: memories with high base scores (above 0.80) saw diminished effective boost because the cap clipped them. That was intentional. High-scoring memories do not need extra help.

**Sprint 8 update:** The `calculateNoveltyBoost()` call was removed from the hot scoring path in `composite-scoring.ts` because evaluation showed it always returned 0. The function definition remains but is no longer invoked during search. Telemetry fields are hardcoded to `noveltyBoostApplied: false, noveltyBoostValue: 0` for log schema compatibility. The corresponding feature flag `SPECKIT_NOVELTY_BOOST` is marked as inert.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Composite score computation |
| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
| `mcp_server/lib/storage/access-tracker.ts` | Lib | Access pattern tracking |
| `mcp_server/lib/telemetry/scoring-observability.ts` | Lib | Scoring observability |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/scoring/folder-scoring.ts` | Shared | Shared folder scoring |
| `shared/types.ts` | Shared | Type definitions |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/access-tracker-extended.vitest.ts` | Access tracker extended |
| `mcp_server/tests/access-tracker.vitest.ts` | Access tracker tests |
| `mcp_server/tests/composite-scoring.vitest.ts` | Composite scoring tests |
| `mcp_server/tests/folder-scoring.vitest.ts` | Folder scoring tests |
| `mcp_server/tests/importance-tiers.vitest.ts` | Importance tier tests |
| `mcp_server/tests/interference.vitest.ts` | Interference scoring tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/scoring-observability.vitest.ts` | Scoring observability tests |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Cold-start novelty boost
- Current reality source: FEATURE_CATALOG.md
