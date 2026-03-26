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

| File | Role | Status |
|------|------|--------|
| `mcp_server/lib/search/causal-boost.ts` | Causal boost scoring | Fixed: spread replaced with reduce |
| `mcp_server/lib/search/evidence-gap-detector.ts` | Evidence gap detection | Fixed: spread replaced with reduce |
| `mcp_server/handlers/pe-gating.ts` | Prediction error gating | Fixed: 2 instances replaced with reduce |
| `mcp_server/lib/telemetry/retrieval-telemetry.ts` | Retrieval telemetry | Fixed: spread replaced with reduce |
| `mcp_server/lib/eval/reporting-dashboard.ts` | Reporting dashboard | Fixed: 2 instances replaced with reduce |
| `mcp_server/lib/eval/k-value-analysis.ts` | RRF K-sensitivity analysis | Residual: still uses `Math.min(...avgScores)` and `Math.max(...avgScores)` |
| `mcp_server/lib/search/graph-lifecycle.ts` | Graph lifecycle management | Residual: still uses `Math.max(...degreeRows.map(...))` |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/reporting-dashboard.vitest.ts` | Dashboard reporting tests (covers fixed Math.max/min sites) |
| `mcp_server/tests/k-value-optimization.vitest.ts` | K-value analysis tests (covers residual site) |
| `mcp_server/tests/causal-boost.vitest.ts` | Causal boost tests (covers fixed site) |
| `mcp_server/tests/prediction-error-gate.vitest.ts` | PE gate tests (covers fixed sites) |

---

## 4. SOURCE METADATA

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Math.max/min stack overflow hardening
- Current reality source: FEATURE_CATALOG.md
