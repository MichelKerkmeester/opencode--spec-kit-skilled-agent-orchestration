---
title: "Math.max/min stack overflow hardening"
description: "Tracks targeted replacement of `Math.max(...array)` spread patterns with stack-safe extrema logic, while noting residual production sites that still remain."
---

# Math.max/min stack overflow hardening

## 1. OVERVIEW

Tracks targeted replacement of `Math.max(...array)` spread patterns with stack-safe extrema logic to reduce stack-overflow risk on large arrays.

A common way of finding the largest or smallest number in a list was crashing the system when the list got too big. A prior remediation pass replaced several of the riskiest spread-based extrema sites with safer logic, but the cleanup is not complete. Residual production spread sites still remain and are called out below.

---

## 2. CURRENT REALITY

`Math.max(...array)` and `Math.min(...array)` push all elements onto the call stack, causing `RangeError` on arrays exceeding ~100K elements. Several production sites were converted from spread patterns to `reduce()` or equivalent stack-safe extrema logic:

- `rsf-fusion.ts` (deleted): 6 instances were fixed before module removal
- `causal-boost.ts`: 1 instance
- `evidence-gap-detector.ts`: 1 instance
- `prediction-error-gate.ts`: 2 instances
- `retrieval-telemetry.ts`: 1 instance
- `reporting-dashboard.ts`: 2 instances

Each replacement uses `scores.reduce((a, b) => Math.max(a, b), -Infinity)` with an `AI-WHY` comment explaining the safety rationale.

Two residual production spread sites still remain outside that converted set: `mcp_server/lib/eval/k-value-analysis.ts` still uses `Math.min(...avgScores)` and `Math.max(...avgScores)`, and `mcp_server/lib/search/graph-lifecycle.ts` still uses `Math.max(...degreeRows.map((r) => r.in_degree))`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Composite score computation |
| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk aggregation |
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
| `mcp_server/tests/mpab-aggregation.vitest.ts` | MPAB aggregation tests |
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

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Math.max/min stack overflow hardening
- Current reality source: FEATURE_CATALOG.md
