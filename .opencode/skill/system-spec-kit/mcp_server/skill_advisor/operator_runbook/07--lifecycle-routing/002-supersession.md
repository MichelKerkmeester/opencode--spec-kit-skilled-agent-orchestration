---
title: "LC-002 Asymmetric Supersession Redirects"
description: "Manual validation that supersession metadata in lib/lifecycle/supersession.ts applies asymmetric routing with redirect_from and redirect_to, and that superseded skills forward correctly."
trigger_phrases:
  - "lc-002"
  - "supersession"
  - "redirect_from redirect_to"
  - "asymmetric routing"
---

# LC-002 Asymmetric Supersession Redirects

## TABLE OF CONTENTS

- [1. SCENARIO](#1-scenario)
- [2. SETUP](#2-setup)
- [3. STEPS](#3-steps)
- [4. EXPECTED](#4-expected)
- [5. FAILURE MODES](#5-failure-modes)
- [6. RELATED](#6-related)

---

## 1. SCENARIO

Validate that `lib/lifecycle/supersession.ts` implements asymmetric routing: a superseded skill redirects queries forward via `redirect_to` and the successor exposes `redirect_from` metadata without overriding the successor's own recommendations.

---

## 2. SETUP

- A workspace containing a known superseded-successor pair in skill metadata (or a disposable copy with a synthetic pair).
- MCP server built; daemon reachable.
- `includeAttribution: true` and `topK >= 2` on recommendation calls.

---

## 3. STEPS

1. Identify the superseded-successor pair from `graph-metadata.json` supersession fields.
2. Call `advisor_recommend` with a prompt that historically mapped to the superseded skill:

```text
advisor_recommend({"prompt":"<prompt mapping to superseded skill>","options":{"topK":2,"includeAttribution":true}})
```

3. Inspect the response for redirect metadata.
4. Call `advisor_recommend` with a prompt matching the successor and inspect metadata.

---

## 4. EXPECTED

- Superseded skill is no longer the top recommendation; successor wins routing.
- Response contains `lifecycle.redirect_to` pointing at the successor for the first call.
- Successor's response carries `lifecycle.redirect_from` (or equivalent) referencing the superseded skill.
- Redirect is asymmetric: the successor does not redirect back to the superseded skill.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Superseded skill still wins | Top-1 matches superseded slug | Inspect `supersession.ts` demotion logic. |
| Missing redirect_to | Response omits redirect metadata | Audit `lib/compat/redirect-metadata.ts`. |
| Bidirectional redirect | Successor redirects back | Block release; asymmetry is contract. |

---

## 6. RELATED

- Scenario [NC-005](../01--native-mcp-tools/005-lifecycle-redirect-metadata.md) — native MCP redirect metadata.
- Scenario [LC-005](./005-rollback-lifecycle.md) — lifecycle-level rollback.
- Feature [`03--lifecycle-routing/02-supersession.md`](../../feature_catalog/03--lifecycle-routing/02-supersession.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/supersession.ts`.
