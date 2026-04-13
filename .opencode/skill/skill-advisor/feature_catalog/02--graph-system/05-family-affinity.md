---
title: "Family affinity"
description: "Describes the within-family boost that lightly lifts related skills when one family member matches strongly."
---

# Family affinity

## 1. OVERVIEW

Describes the within-family boost that lightly lifts related skills when one family member matches strongly.

Some routing surfaces come in families, such as CLI orchestrators or code-review skills. The advisor uses that structure to provide a softer reinforcement pass after the direct graph edges have already run.

---

## 2. CURRENT REALITY

`_apply_family_affinity()` reads the `families` map from the compiled graph and looks for family members whose direct or transitive score already exceeds `1.0`. If the strongest family member rises above `1.5`, the function lightly boosts other members in the same family that already have a small positive score but are still below `1.0`. The affinity amount is `max_boost * 0.08`, and it must also reach at least `0.1` before it is applied.

This makes family affinity a gentle ranking nudge, not a replacement for prompt evidence. It helps nearby related skills stay visible in close calls, but it never overrides the stronger rule that a candidate must already have some independent evidence before graph structure can help it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Applies family-level affinity boosts to already-evidenced candidates in the same compiled family. |
| `skill_graph_compiler.py` | Build | Produces the sorted family membership map consumed by the runtime affinity pass. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill-graph.json` | Compiled artifact | Stores the family groups the runtime uses for affinity decisions. |
| `skill_advisor_regression.py` | Regression harness | Exposes ranking changes when family-level reinforcement changes adjacent results. |

---

## 4. SOURCE METADATA

- Group: Graph system
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--graph-system/05-family-affinity.md`
