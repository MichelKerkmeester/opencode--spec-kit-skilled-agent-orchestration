---
title: "SC-001 Five-Lane Analytical Fusion"
description: "Manual validation that the 5-lane fusion produces weighted scores using the canonical weights: explicit_author 0.45, lexical 0.30, graph_causal 0.15, derived_generated 0.10, semantic_shadow 0.00."
trigger_phrases:
  - "sc-001"
  - "five lane fusion"
  - "lane weights canonical"
  - "advisor fusion"
---

# SC-001 Five-Lane Analytical Fusion

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/scorer/fusion.ts` combines the five lanes with the canonical weights `explicit_author: 0.45`, `lexical: 0.30`, `graph_causal: 0.15`, `derived_generated: 0.10`, `semantic_shadow: 0.00`, and that the weight configuration is discoverable via `advisor_status.laneWeights`.

---

## 2. SETUP

- Repo root working directory.
- MCP server built; daemon reachable.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` unset.

---

## 3. STEPS

1. Call status and capture `laneWeights`:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

2. Call `advisor_recommend` with a prompt that hits multiple lanes and `includeAttribution: true`:

```text
advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":3,"includeAttribution":true}})
```

3. For the top recommendation, record each lane's `rawScore`, `weight`, and `weightedScore`.
4. Verify `weightedScore == rawScore * weight` within floating-point tolerance for each lane.
5. Sum all `weightedScore` values and compare to the reported aggregate score.

---

## 4. EXPECTED

- `advisor_status.laneWeights` equals the canonical configuration above.
- `semantic_shadow.weight == 0.00` in all envelopes (semantic lock).
- For every lane, `weightedScore` matches `rawScore * weight` within `1e-9` tolerance.
- Aggregate score equals the sum of lane `weightedScore` values (or matches the documented fusion formula).

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Lane weights off-canonical | `laneWeights` does not match the canonical set | Inspect `lib/scorer/weights-config.ts`. |
| Semantic shadow has non-zero weight | Response shows `semantic_shadow.weight > 0` | Block release; semantic lock violated (see PG-005). |
| Fusion arithmetic mismatch | `weightedScore != rawScore * weight` | Audit `lib/scorer/fusion.ts`. |

---

## 6. RELATED

- Scenario [SC-004](./004-lane-attribution.md) — lane attribution metadata.
- Feature [`04--scorer-fusion/01-five-lane-fusion.md`](../../feature_catalog/04--scorer-fusion/01-five-lane-fusion.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` and `lib/scorer/weights-config.ts`.
