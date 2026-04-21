---
title: "Ghost candidate guard"
description: "Describes the guard that prevents graph relationships from creating unsupported recommendations."
---

# Ghost candidate guard

## 1. OVERVIEW

Describes the guard that prevents graph relationships from creating unsupported recommendations.

Relationship-aware routing is only safe if the graph cannot invent winners from nothing. This feature keeps graph structure in a supporting role by requiring direct prompt evidence before any graph overlay is allowed to matter.

---

## 2. CURRENT REALITY

The main guard lives inside `_apply_graph_boosts()`. Before it starts propagating through adjacency, the function freezes a snapshot of the existing `skill_boosts` map. Each `enhances`, `siblings`, or `depends_on` edge is only allowed to reinforce a target whose snapshot score is already greater than zero. If the target had no direct lexical, phrase, semantic, or explicit-name evidence before the graph pass, the transitive boost is skipped.

This means the graph can reorder or strengthen candidates that are already in play, but it cannot create a first appearance for a skill that the prompt never supported. The guard works alongside the minimum `0.1` transitive threshold, so even evidence-backed candidates only get graph help when that help is large enough to be meaningful.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Freezes the pre-graph score snapshot and skips targets without existing positive evidence. |
| `skill_graph_compiler.py` | Build | Supplies the adjacency map whose edges are subject to the runtime ghost-candidate guard. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_advisor_regression.py` | Regression harness | Detects cases where graph overlays would incorrectly elevate the wrong top recommendation. |
| `fixtures/skill_advisor_regression_cases.jsonl` | Regression dataset | Includes graph-sensitive prompts that would expose ghost-candidate regressions. |

---

## 4. SOURCE METADATA

- Group: Graph system
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--graph-system/07-ghost-candidate-guard.md`
