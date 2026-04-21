---
title: "SC-002 Projection of Skill Nodes and Edges"
description: "Manual validation that lib/scorer/projection.ts projects skill_nodes and skill_edges into scoring shape without leaking raw graph text or prompt content."
trigger_phrases:
  - "sc-002"
  - "scorer projection"
  - "skill_nodes skill_edges"
  - "graph projection"
---

# SC-002 Projection of Skill Nodes and Edges

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/scorer/projection.ts` projects `skill_nodes` and `skill_edges` into the scoring shape required by lanes such as `graph_causal` and that the projection path never leaks prompt text into node or edge metadata.

---

## 2. SETUP

- Read-only inspection against the live repo or disposable copy.
- MCP server built; daemon reachable.
- Access to runtime diagnostics where projection output can be observed (for example via `advisor_validate` slices or internal test harness).

---

## 3. STEPS

1. Trigger a recommend call that exercises the graph_causal lane:

```text
advisor_recommend({"prompt":"help me commit my changes","options":{"includeAttribution":true}})
```

2. In the response, inspect the `graph_causal` lane attribution for a projected node list.
3. Search the projected output for any fragment of the input prompt.
4. Run `advisor_validate` and inspect the parity slice against Python fallback to confirm projection consistency.

---

## 4. EXPECTED

- Projection exposes only documented fields (node ids, edge types, weights).
- No substring of the input prompt appears in projection metadata.
- The number of projected nodes is bounded and consistent across equivalent calls.
- Parity slice in `advisor_validate` shows zero regressions on Python-correct prompts.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Prompt fragment in projection | Grep for prompt substring hits | Block release as privacy failure. |
| Unbounded projection | Graph_causal attribution grows with prompt length | Inspect projection caps in `projection.ts`. |
| Parity regression | Python-correct cases now fail | Audit projection logic for divergence from Python expectation. |

---

## 6. RELATED

- Scenario [SC-001](./001-five-lane-fusion.md) — fusion weights.
- Scenario [NC-003](../01--native-mcp-tools/003-native-validate-slices.md) — validate slices.
- Feature [`04--scorer-fusion/02-projection.md`](../../feature_catalog/04--scorer-fusion/02-projection.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts`.
