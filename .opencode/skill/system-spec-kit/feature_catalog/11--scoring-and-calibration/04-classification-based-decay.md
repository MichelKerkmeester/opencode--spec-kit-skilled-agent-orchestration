---
title: "Classification-based decay"
description: "Describes how FSRS decay rates vary by a two-dimensional multiplier matrix across context type and importance tier, so decisions never decay while scratch notes decay at 0.5x rate."
---

# Classification-based decay

## 1. OVERVIEW

Describes how FSRS decay rates vary by a two-dimensional multiplier matrix across context type and importance tier, so decisions never decay while scratch notes decay at 0.5x rate.

Not all memories should fade at the same speed. A key decision made months ago is still important, but a quick scratch note from last week probably is not. This feature adjusts how fast memories lose relevance based on what kind of memory they are and how important they were marked. Critical decisions never fade. Temporary notes fade quickly. Everything else falls somewhere in between.

---

## 2. CURRENT REALITY

Not all memories should decay at the same rate. A decision record from six months ago is still relevant. A scratch note from last Tuesday probably is not.

FSRS decay rates now vary by a two-dimensional multiplier matrix. On the context axis: decisions never decay (stability set to Infinity), research memories get 2x stability and implementation/discovery/general memories follow the standard rate. On the tier axis: constitutional and critical memories never decay, important memories get 1.5x stability, normal memories follow the standard, temporary memories decay at 0.5x and deprecated at 0.25x.

The combined multiplier uses `Infinity` for never-decay cases, which produces `R(t) = 1.0` for all t without special-case logic. The shared memory-type config validator now rejects `halfLifeDays: 0` in addition to negative values, matching the `positive number or null` contract and blocking undefined zero-half-life schedules from entering classification-backed decay configuration. Runs behind the `SPECKIT_CLASSIFICATION_DECAY` flag.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/attention-decay.ts` | Lib | FSRS attention decay |
| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Lib | FSRS scheduling algorithm |
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
| `mcp_server/tests/attention-decay.vitest.ts` | Attention decay tests |
| `mcp_server/tests/composite-scoring.vitest.ts` | Composite scoring tests |
| `mcp_server/tests/decay.vitest.ts` | Decay behavior tests |
| `mcp_server/tests/folder-scoring.vitest.ts` | Folder scoring tests |
| `mcp_server/tests/fsrs-scheduler.vitest.ts` | FSRS scheduler tests |
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
- Source feature title: Classification-based decay
- Current reality source: FEATURE_CATALOG.md
