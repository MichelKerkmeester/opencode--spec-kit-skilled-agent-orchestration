---
title: "Regression harness"
description: "Describes the JSONL-driven regression suite that protects routing quality and safety metrics."
---

# Regression harness

## 1. OVERVIEW

Describes the JSONL-driven regression suite that protects routing quality and safety metrics.

Routing quality is only useful if it stays measurable over time. The regression harness is the advisor's permanent safety net for prompt-to-skill accuracy, command-bridge behavior, and priority-case coverage.

---

## 2. CURRENT REALITY

`skill_advisor_regression.py` loads the advisor module dynamically, reads a JSONL fixture file, and evaluates each case through the public `analyze_prompt()` entry point using configurable confidence and uncertainty thresholds. Each result is checked for result presence, expected top skill membership, and optional expected kind, which means the harness validates both routing accuracy and the separation between skills and command bridges.

The harness also computes release-style gates. It reports total pass rate, P0 pass rate, top-1 accuracy, command-bridge false positive rate on non-slash prompts, and an overall pass flag that requires every gate to succeed. The default thresholds are opinionated: top-1 accuracy must stay at or above `0.92`, command-bridge false positives must stay at or below `0.05`, and P0 pass rate must remain perfect.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor_regression.py` | Validation | Loads the advisor, replays fixture prompts, computes metrics, and emits pass or fail reports. |
| `fixtures/skill_advisor_regression_cases.jsonl` | Validation data | Stores the versioned routing cases the regression harness evaluates. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_advisor.py` | Runtime under test | Supplies the public `analyze_prompt()` entry point exercised by the harness. |
| `skill_advisor_regression.py` | Gate runner | Enforces top-1, P0, and command-bridge quality thresholds before the run can pass. |

---

## 4. SOURCE METADATA

- Group: Testing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `04--testing/01-regression-harness.md`
