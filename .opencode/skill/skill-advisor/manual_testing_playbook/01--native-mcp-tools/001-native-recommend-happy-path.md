---
title: "NC-001 Native advisor_recommend Happy Path"
description: "Manual validation that advisor_recommend returns prompt-safe native recommendations for an existing skill."
---

# NC-001 Native advisor_recommend Happy Path

## 1. OVERVIEW

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
3. Inspect `data.recommendations[0]`.

---

## 4. EXPECTED

- Response envelope has `status: "ok"`.
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

## 6. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
