---
title: "NC-004 Ambiguous Brief Rendering"
description: "Manual validation of top-two ambiguity rendering when recommendations are within 0.05 confidence."
trigger_phrases:
  - "nc-004"
  - "ambiguous brief rendering"
  - "ambiguous brief"
  - "ambiguous"
---

# NC-004 Ambiguous Brief Rendering

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that ambiguous advisor results surface as ambiguity rather than a false single-skill certainty.

---

## 2. SETUP

- Repo root is the working directory.
- MCP server build is current.
- Hook renderer is available from the native package.

---

## 3. STEPS

1. Run the ambiguity-focused unit test:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests/handlers/advisor-recommend.vitest.ts skill-advisor/tests/legacy/advisor-renderer.vitest.ts --reporter=default
```

2. Call a broad prompt likely to place two skills close together:

```text
advisor_recommend({"prompt":"review opencode docs and improve the prompt package","options":{"topK":2,"includeAttribution":true}})
```

3. Inspect `data.ambiguous`.

---

## 4. EXPECTED

- Tests pass.
- MCP output includes `ambiguous: true` when the top two passing candidates are within 0.05 confidence.
- Rendered brief does not overstate certainty.
- Lane breakdown remains prompt-safe.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| `ambiguous` missing for close top two | Top two scores differ by <= 0.05 but flag is false | Inspect scorer ambiguity threshold. |
| Brief names only one route without ambiguity | Renderer output omits ambiguity context | Re-run renderer tests and block release. |
| Attribution leaks prompt text | Prompt literal appears in lane fields | Treat as privacy failure. |

---

## 6. RELATED

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts`
