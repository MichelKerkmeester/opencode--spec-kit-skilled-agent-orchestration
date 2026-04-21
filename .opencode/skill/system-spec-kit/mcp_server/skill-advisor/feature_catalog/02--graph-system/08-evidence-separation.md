---
title: "Evidence separation"
description: "Describes how the advisor tracks graph evidence separately from direct prompt evidence."
---

# Evidence separation

## 1. OVERVIEW

Describes how the advisor tracks graph evidence separately from direct prompt evidence.

Graph help is useful, but it should not look identical to direct lexical or semantic evidence. The advisor keeps separate bookkeeping for graph-derived support so it can reason about how much of a recommendation came from the prompt versus the graph overlay.

---

## 2. CURRENT REALITY

Graph overlays append explicit `!graph:*` markers into `boost_reasons`, which makes graph evidence visible in the internal match trace. Later in `analyze_request()`, the advisor counts those markers into `_graph_boost_count` separately from the total match count. That means the calibration pipeline can tell whether a recommendation is mostly supported by direct prompt evidence or mostly supported by the graph.

After `apply_confidence_calibration()` runs, the advisor checks the graph-evidence ratio. If more than half of a recommendation's supporting matches came from graph overlays, the confidence score is multiplied by `0.90`. That penalty preserves relationship-aware ranking while making heavily graph-driven recommendations look slightly less certain than candidates grounded more directly in the prompt itself.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Records graph-specific boost reasons and counts graph evidence separately from total matches. |
| `skill_advisor.py` | Runtime | Applies an extra confidence haircut when graph evidence dominates the support set. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_advisor_regression.py` | Regression harness | Surfaces ranking drift when graph-heavy candidates become overconfident. |
| `fixtures/skill_advisor_regression_cases.jsonl` | Regression dataset | Provides graph-sensitive cases that depend on stable evidence separation behavior. |

---

## 4. SOURCE METADATA

- Group: Graph system
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--graph-system/08-evidence-separation.md`
