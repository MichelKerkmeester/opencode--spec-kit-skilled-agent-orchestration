---
title: "Conflict penalty"
description: "Describes the uncertainty penalty that applies when conflicting skills both survive filtering."
---

# Conflict penalty

## 1. OVERVIEW

Describes the uncertainty penalty that applies when conflicting skills both survive filtering.

The graph can also model disagreement. When two skills are declared incompatible, the advisor can keep them visible while still making the uncertainty signal reflect that conflict.

---

## 2. CURRENT REALITY

`_apply_graph_conflict_penalty()` loads the compiled `conflicts` list, finds any pair where both skills currently pass threshold, and adds `0.15` uncertainty to each conflicting recommendation up to a cap of `1.0`. The penalty happens after the main confidence calibration step, so it acts as a final guard against mutually incompatible winners looking safer than they are.

The current shipped graph keeps this feature dormant rather than disabled. `skill-graph.json` currently contains an empty `conflicts` array, so no recommendations are being penalized today. The runtime hook is still live, which means conflict metadata can start influencing routing immediately as soon as future compiler inputs publish conflict pairs.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Detects conflicting passing recommendations and increases their uncertainty. |
| `skill_graph_compiler.py` | Build | Collects and deduplicates conflict pairs into the compiled graph artifact. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill-graph.json` | Compiled artifact | Shows whether any live conflict pairs are currently available to the runtime. |
| `skill_graph_compiler.py` | Validation CLI | Validates edge targets before conflict pairs can be emitted into the graph. |

---

## 4. SOURCE METADATA

- Group: Graph system
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--graph-system/06-conflict-penalty.md`
