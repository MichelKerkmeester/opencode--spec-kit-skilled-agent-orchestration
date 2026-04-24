---
title: "CL-005 OpenCode Plugin Bridge"
description: "Manual validation for the OpenCode spec-kit-skill-advisor plugin and bridge."
trigger_phrases:
  - "cl-005"
  - "opencode plugin bridge"
  - "opencode plugin"
  - "opencode"
---

# CL-005 OpenCode Plugin Bridge

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate the OpenCode plugin path that delegates through the stable native compat entrypoint, then falls back to Python brief production when needed.

---

## 2. SETUP

- MCP server build is current.
- Plugin host file exists at `.opencode/plugins/spec-kit-skill-advisor.js`.
- Bridge helper exists at `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`.

---

## 3. STEPS

1. Build:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

2. Run bridge directly:

```bash
printf '%s' '{"prompt":"save this conversation context to memory","workspaceRoot":"'"$PWD"'","runtime":"opencode","maxTokens":80,"thresholdConfidence":0.8}' | node .opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs
```

3. Inspect plugin status tool in OpenCode, when available:

```text
spec_kit_skill_advisor_status({})
```

---

## 4. EXPECTED

- Bridge returns JSON with `status: "ok"` or prompt-safe fail-open status.
- Native success has `metadata.route: "native"` and an `Advisor:` brief.
- Success metadata reports the 014 threshold pair: `confidenceThreshold: 0.8`, `uncertaintyThreshold: 0.35`, `confidenceOnly: false`.
- Bridge imports `.opencode/skill/system-spec-kit/mcp_server/dist/skill-advisor/compat/index.js`, not private handler paths.
- Disable flag returns a disabled brief or skipped state without invoking the native path.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Private dist pinning | Bridge imports handler internals directly | Update bridge to use `compat/index.ts` after code approval. |
| Plugin disabled unexpectedly | Status tool reports `disabled_reason` | Check env and plugin options. |
| Bridge timeout | `error: "TIMEOUT"` | Inspect build and Node binary path. |

---

## 6. RELATED

- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/compat/index.ts`
