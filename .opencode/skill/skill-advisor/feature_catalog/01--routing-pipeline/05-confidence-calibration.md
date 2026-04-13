---
title: "Confidence calibration"
description: "Describes how the advisor turns raw scores into calibrated confidence, uncertainty, and pass or fail readiness."
---

# Confidence calibration

## 1. OVERVIEW

Describes how the advisor turns raw scores into calibrated confidence, uncertainty, and pass or fail readiness.

Raw score alone is not enough to decide whether a skill should fire. The advisor keeps confidence and uncertainty separate so strong-looking but ambiguous matches do not accidentally trip Gate 2.

---

## 2. CURRENT REALITY

`calculate_confidence()` uses a two-curve model. Candidates with any direct intent boost start from a higher base and only need a total score of `2.0` to reach the default `0.8` confidence threshold, while corpus-only matches stay on a more conservative curve and need a score of `4.0` to cross the same bar. `calculate_uncertainty()` then measures the opposite side of the decision using match count, missing intent evidence, and ambiguous multi-skill matches, with the default readiness cutoff fixed at `0.35`.

The advisor recalibrates those first-pass values before ranking. `apply_confidence_calibration()` subtracts a margin penalty when the next-best score is close, subtracts an ambiguity penalty when a candidate depends on many multi-skill matches, and adds a small evidence bonus for broader support. After that pass, graph-heavy recommendations can take an extra ten percent confidence haircut, and `passes_dual_threshold()` determines whether the calibrated result is ready for default-mode routing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Defines the confidence curve, uncertainty model, and dual-threshold gate used by the router. |
| `skill_advisor.py` | Runtime | Applies margin, ambiguity, evidence, and graph-heavy calibration before final pass or fail marking. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_advisor_regression.py` | Regression harness | Runs the advisor with explicit confidence and uncertainty thresholds and fails the suite when gates drift. |
| `fixtures/skill_advisor_regression_cases.jsonl` | Regression dataset | Contains both standard and confidence-only cases for validating calibration behavior. |

---

## 4. SOURCE METADATA

- Group: Routing pipeline
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `01--routing-pipeline/05-confidence-calibration.md`
