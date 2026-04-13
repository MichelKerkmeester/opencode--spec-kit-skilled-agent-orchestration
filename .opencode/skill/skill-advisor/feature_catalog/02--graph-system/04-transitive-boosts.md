---
title: "Transitive boosts"
description: "Describes how graph edges reinforce already-evidenced candidates during routing."
---

# Transitive boosts

## 1. OVERVIEW

Describes how graph edges reinforce already-evidenced candidates during routing.

The graph is not just documentation. At runtime it can push extra score into related skills, but only when the prompt already produced direct evidence for those skills.

---

## 2. CURRENT REALITY

`_apply_graph_boosts()` reads the compiled `adjacency` map and walks outward from the current boost snapshot. It uses different multipliers for each supported relationship: `enhances` edges contribute `30%` of the source boost, `depends_on` contributes `20%`, and `siblings` contributes `15%`. Each resulting transitive boost must reach at least `0.1` before it is applied, and every accepted overlay is tagged in `boost_reasons` as a `!graph:*` match.

The guardrails are as important as the multipliers. The function takes a snapshot of the pre-graph boosts and only reinforces targets that already have a positive score in that snapshot. That means graph edges can promote connected candidates that already have direct evidence, but they cannot create a brand-new recommendation from graph structure alone.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Applies edge-type-specific transitive boosts from the compiled adjacency map. |
| `skill_graph_compiler.py` | Build | Produces the sparse adjacency structure that the runtime transitive pass consumes. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill-graph.json` | Compiled artifact | Stores the edge weights and adjacency groups used by the transitive boost pass. |
| `skill_advisor_regression.py` | Regression harness | Catches ranking drift when graph overlays change the expected top recommendation. |

---

## 4. SOURCE METADATA

- Group: Graph system
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--graph-system/04-transitive-boosts.md`
