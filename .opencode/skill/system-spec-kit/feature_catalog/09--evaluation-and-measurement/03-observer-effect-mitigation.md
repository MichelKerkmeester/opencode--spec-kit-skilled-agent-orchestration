---
title: "Observer effect mitigation"
description: "Describes how the evaluation infrastructure avoids perturbing production query performance through fail-safe degradation and non-fatal handling in evaluation and observability paths."
---

# Observer effect mitigation

## 1. OVERVIEW

Describes how the evaluation infrastructure avoids perturbing production query performance through fail-safe degradation and non-fatal handling in evaluation and observability paths.

Measuring performance can sometimes slow down the thing you are measuring, like how stepping on a scale while running would trip you up. This feature makes sure that all the quality-checking work happens quietly in the background. If the measurement process breaks, your searches keep running at full speed without noticing.

---

## 2. CURRENT REALITY

Measurement infrastructure is implemented as fail-safe and best-effort rather than SLO-enforced runtime monitoring. The eval database and shadow-scoring helpers are designed so evaluation paths do not block production query flow, and shadow scoring write paths are disabled (`runShadowScoring` returns `null`, `logShadowComparison` returns `false`).

A formal p95 latency comparison (eval logging enabled vs disabled) and an automated ">10% overhead" alert are not implemented in the current code. Observer-effect control currently relies on fail-safe degradation and non-fatal handling in evaluation and observability paths.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |
| `mcp_server/lib/eval/shadow-scoring.ts` | Lib | Shadow scoring system |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/eval-db.vitest.ts` | Eval database operations |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |
| `mcp_server/tests/shadow-scoring.vitest.ts` | Shadow scoring tests |

---

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Observer effect mitigation
- Current reality source: feature_catalog.md

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario NEW-007
