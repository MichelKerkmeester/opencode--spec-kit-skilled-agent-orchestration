---
title: "NC-001 Native advisor_recommend Happy Path"
description: "Manual validation that advisor_recommend returns prompt-safe native recommendations for an existing skill."
trigger_phrases:
  - "nc-001"
  - "native advisor_recommend happy path"
  - "native advisor_recommend"
  - "native"
---

# NC-001 Native advisor_recommend Happy Path

## TABLE OF CONTENTS

- [1. SCENARIO](#1-scenario)
- [2. SETUP](#2-setup)
- [3. STEPS](#3-steps)
- [4. EXPECTED](#4-expected)
- [5. FAILURE MODES](#5-failure-modes)
- [6. RELATED](#6-related)

---

## 1. SCENARIO

Validate the native MCP `advisor_recommend` tool with a prompt that should map to `system-spec-kit`.

---

## 2. SETUP

- Repo root is the working directory.
- MCP server has been built with `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset.

---

## 3. STEPS

1. Call the MCP tool:

```text
advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":1,"includeAttribution":true,"includeAbstainReasons":true}})
```

2. Save the JSON response.
3. Inspect `data.workspaceRoot`, `data.effectiveThresholds`, and `data.recommendations[0]`.

---

## 4. EXPECTED

- Response envelope has `status: "ok"`.
- `data.workspaceRoot` is the absolute repository root for the current checkout.
- `data.effectiveThresholds` is present and, for this exact call with no overrides, equals:

```json
{
  "confidenceThreshold": 0.8,
  "uncertaintyThreshold": 0.35,
  "confidenceOnly": false
}
```

- `data.freshness` is `live` or `stale`.
- First recommendation has `skillId: "system-spec-kit"`.
- `laneBreakdown[]` contains lane contribution metadata only: `lane`, `rawScore`, `weightedScore`, `weight`, `shadowOnly`.
- Raw prompt text is not present in `laneBreakdown`, `trustState`, `cache`, `warnings`, or `abstainReasons`.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Empty recommendations with `freshness: "absent"` | Response has `recommendations: []` and `trustState.state: "absent"` | Run `advisor_status`, rebuild the skill graph, and repeat. |
| Disabled response | `warnings` contains `ADVISOR_DISABLED` | Unset `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`. |
| Prompt text appears in attribution | Search captured JSON for the prompt literal | Treat as privacy failure and block release. |

---

## 6. RELATED

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts`
