---
title: "LC-001 Derived-Lane-Only Age Haircut"
description: "Manual validation that age decay is applied only to the derived lane, not to author, lexical, graph_causal, or semantic_shadow lanes."
trigger_phrases:
  - "lc-001"
  - "age haircut derived"
  - "age decay"
  - "lifecycle age"
---

# LC-001 Derived-Lane-Only Age Haircut

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `lib/lifecycle/age-haircut.ts` applies age-based decay only to the derived lane and leaves author, lexical, graph_causal, and semantic_shadow lanes unchanged.

---

## 2. SETUP

- Repo root with at least one older skill (modification timestamp >30 days) and one recently modified skill.
- MCP server built; daemon reachable.
- Option flags for `advisor_recommend` include `includeAttribution: true`.

---

## 3. STEPS

1. Identify one old skill and one recent skill by `stat` on `SKILL.md`.
2. Call `advisor_recommend` with prompts that match each:

```text
advisor_recommend({"prompt":"<prompt matching old skill>","options":{"includeAttribution":true}})
advisor_recommend({"prompt":"<prompt matching recent skill>","options":{"includeAttribution":true}})
```

3. For each recommendation, inspect `laneBreakdown` and record the contribution of every lane.
4. Compare derived-lane `weightedScore` versus `rawScore` and check for a visible haircut on the older skill.

---

## 4. EXPECTED

- Derived lane `weightedScore` for the older skill is lower than `rawScore * weight` by a documented decay factor.
- Author, lexical, graph_causal, and semantic_shadow lanes show `weightedScore = rawScore * weight` without additional multiplier.
- Recent-skill derived lane shows no significant decay.
- Overall ordering remains stable as long as non-derived lanes dominate.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Haircut affects other lanes | Lexical or author `weightedScore` < `rawScore * weight` | Block release; audit `age-haircut.ts` lane filter. |
| No haircut applied | Old and recent skills show identical decay behavior | Verify mtime probe and decay constants. |
| Recommendation regression | Accuracy regresses on corpus due to over-aggressive haircut | Tune decay parameters and rerun validate. |

---

## 6. RELATED

- Scenario [LC-002](./002-supersession.md) — supersession redirects.
- Scenario [SC-001](../08--scorer-fusion/001-five-lane-fusion.md) — 5-lane fusion basics.
- Feature [`03--lifecycle-routing/01-age-haircut.md`](../../feature_catalog/03--lifecycle-routing/01-age-haircut.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/age-haircut.ts`.
