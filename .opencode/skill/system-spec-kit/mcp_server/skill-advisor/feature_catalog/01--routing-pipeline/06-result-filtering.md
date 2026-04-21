---
title: "Result filtering"
description: "Describes how the advisor filters, ranks, and emits the final recommendation set."
---

# Result filtering

## 1. OVERVIEW

Describes how the advisor filters, ranks, and emits the final recommendation set.

Scoring creates possibilities. Filtering decides what callers are actually allowed to see. This stage is where the advisor enforces default readiness, optional confidence-only behavior, and the final rank order between skills and command bridges.

---

## 2. CURRENT REALITY

`filter_recommendations()` applies two modes. In default mode it keeps only recommendations that pass the configured confidence and uncertainty thresholds unless `--show-rejections` is explicitly requested. In confidence-only mode it drops the uncertainty check and keeps any recommendation that reaches the confidence bar. That makes the filter layer the place where callers opt into stricter or looser routing behavior without changing the underlying scorer.

The ranking behavior is set earlier in `analyze_request()` and then preserved by the filter. Command bridges take a small score penalty unless the prompt contains an explicit slash marker, named skills get a strong explicit-match preference, and the final sort order favors kind priority, explicit mentions, pass status, confidence, and score in that order. The response that leaves the advisor has all internal sort metadata stripped out, leaving only the public routing fields.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Applies default dual-threshold filtering, confidence-only mode, and optional rejection visibility. |
| `skill_advisor.py` | Runtime | Penalizes command bridges outside explicit slash intent and sorts final results before output. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_advisor_regression.py` | Regression harness | Measures top-1 accuracy and command-bridge false positives against the filtered output. |
| `fixtures/skill_advisor_regression_cases.jsonl` | Regression dataset | Includes non-slash prompts specifically to catch over-eager command-bridge results. |

---

## 4. SOURCE METADATA

- Group: Routing pipeline
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `01--routing-pipeline/06-result-filtering.md`
