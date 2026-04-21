---
title: "SC-004 Lane Contribution Attribution"
description: "Manual validation that includeAttribution: true returns per-lane contribution metadata (lane, rawScore, weight, weightedScore, shadowOnly) without leaking prompt content."
trigger_phrases:
  - "sc-004"
  - "lane attribution"
  - "includeAttribution"
  - "laneBreakdown"
---

# SC-004 Lane Contribution Attribution

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `includeAttribution: true` returns per-lane `lane`, `rawScore`, `weight`, `weightedScore`, and `shadowOnly` metadata via `lib/scorer/attribution.ts` and that no prompt text or prompt-derived evidence snippets appear in the attribution output.

---

## 2. SETUP

- Repo root; MCP server built.
- Any prompt that routes to a known skill.

---

## 3. STEPS

1. Call with attribution enabled:

```text
advisor_recommend({"prompt":"review this pull request","options":{"topK":1,"includeAttribution":true}})
```

2. Inspect `laneBreakdown[]` for the top recommendation.
3. Call again with `includeAttribution: false` and confirm attribution is absent.
4. Scan attribution JSON for any substring of the input prompt.

---

## 4. EXPECTED

- With `includeAttribution: true`, each lane entry carries exactly the documented fields: `lane`, `rawScore`, `weight`, `weightedScore`, `shadowOnly`.
- `semantic_shadow` always reports `shadowOnly: true`.
- With `includeAttribution: false`, `laneBreakdown` is absent or empty.
- No raw prompt substring appears in attribution.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Extra fields in attribution | Evidence snippets or triggers present | Block release; attribution is contribution-only. |
| Prompt substring in attribution | Grep hits | Block release as privacy failure. |
| shadowOnly missing from semantic | `semantic_shadow` lacks flag | Audit `attribution.ts` lane tagging. |

---

## 6. RELATED

- Scenario [SC-001](./001-five-lane-fusion.md) — fusion weights sanity.
- Scenario [SC-005](./005-ablation.md) — ablation protocol.
- Feature [`04--scorer-fusion/04-attribution.md`](../../feature_catalog/04--scorer-fusion/04-attribution.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/attribution.ts`.
