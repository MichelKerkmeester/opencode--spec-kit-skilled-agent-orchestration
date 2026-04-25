---
title: "CP-003 Global Disable Flag"
description: "Manual validation that SPECKIT_SKILL_ADVISOR_HOOK_DISABLED disables all advisor prompt surfaces."
trigger_phrases:
  - "cp-003"
  - "global disable flag"
  - "global disable"
  - "global"
---

# CP-003 Global Disable Flag

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate the common disable flag across native MCP, Python shim, runtime hooks, and plugin bridge.

---

## 2. SETUP

- Repo root is the working directory.
- MCP server build is current.
- Capture env and command output.

---

## 3. STEPS

1. Native MCP:

```text
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 advisor_recommend({"prompt":"help me commit my changes","options":{"topK":1,"includeAbstainReasons":true}})
```

2. Python shim:

```bash
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "help me commit my changes"
```

3. Plugin bridge:

```bash
printf '%s' '{"prompt":"help me commit my changes","workspaceRoot":"'"$PWD"'"}' | SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node .opencode/plugins/spec-kit-skill-advisor-bridge.mjs
```

4. One hook adapter:

```bash
printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'"}' | SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js
```

---

## 4. EXPECTED

- Native `advisor_recommend` returns `recommendations: []`, `freshness: "unavailable"`, and `ADVISOR_DISABLED`.
- Python shim returns `[]` or prompt-safe disabled output without native scoring.
- Plugin bridge returns disabled/skipped output.
- Hook adapter returns `{}` with skipped diagnostic.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Any surface still recommends a skill | Non-empty recommendation under disabled env | Block release. |
| Disabled response includes prompt text | Search captured output for prompt literal | Block release. |
| Plugin only honors legacy env | New flag has no effect | Update bridge/plugin after code approval. |

---

## 6. RELATED

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
