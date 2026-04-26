---
title: "SC-003 Top-2 Ambiguity Window"
description: "Manual validation that when the top two candidates are within 0.05 confidence, the advisor returns an ambiguous brief rather than a single top-1 recommendation."
trigger_phrases:
  - "sc-003"
  - "ambiguity window"
  - "top-2 within 0.05"
  - "ambiguous brief"
---

# SC-003 Top-2 Ambiguity Window

## TABLE OF CONTENTS

- [1. SCENARIO](#1-scenario)
- [2. SETUP](#2-setup)
- [3. STEPS](#3-steps)
- [4. EXPECTED](#4-expected)
- [5. FAILURE MODES](#5-failure-modes)
- [6. RELATED](#6-related)

---

## 1. SCENARIO

Validate that `lib/scorer/ambiguity.ts` returns an ambiguous brief when the top two candidates are within a 0.05 confidence window and that downstream rendering reflects ambiguity rather than arbitrarily selecting one winner.

---

## 2. SETUP

- Repo root; MCP server built.
- A curated prompt known to produce near-tied candidates (from routing-accuracy corpus ambiguous set).
- `includeAttribution: true` and `topK: 2`.

---

## 3. STEPS

1. Call `advisor_recommend` with the ambiguous prompt:

```text
advisor_recommend({"prompt":"<ambiguous prompt from corpus>","options":{"topK":2,"includeAttribution":true}})
```

2. Inspect the response for an `ambiguous: true` flag or equivalent ambiguity brief field.
3. Record the top-1 and top-2 aggregate scores and confirm delta <= 0.05.
4. Cross-check behavior against scenario NC-004.

---

## 4. EXPECTED

- Response carries an explicit ambiguity signal when the top-2 delta <= 0.05.
- Both candidates are exposed (not hidden behind a single top-1).
- Rendering path (for hook output) presents both candidates with lane attribution.
- When delta > 0.05, ambiguity flag is absent and top-1 is singular.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Ambiguity missed | Delta <= 0.05 but single top-1 returned | Inspect `ambiguity.ts` delta check. |
| Ambiguity over-triggered | Delta > 0.05 flagged as ambiguous | Verify threshold constant. |
| Ambiguity hides top-1 | Both candidates suppressed | Rendering bug; confirm `lib/render.ts`. |

---

## 6. RELATED

- Scenario [NC-004](../01--native-mcp-tools/004-ambiguous-brief-rendering.md) — ambiguous brief rendering.
- Scenario [SC-004](./004-lane-attribution.md) — lane attribution.
- Feature [`04--scorer-fusion/03-ambiguity.md`](../../feature_catalog/04--scorer-fusion/03-ambiguity.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts`.
