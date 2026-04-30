---
title: "CP-001 Python Shim --stdin Mode"
description: "Manual validation for the pre-027 Python shim stdin regression path."
trigger_phrases:
  - "cp-001"
  - "python shim --stdin mode"
  - "python shim"
  - "python"
---

# CP-001 Python Shim --stdin Mode

## TABLE OF CONTENTS

- [1. SCENARIO](#1-scenario)
- [2. SETUP](#2-setup)
- [3. STEPS](#3-steps)
- [4. EXPECTED](#4-expected)
- [5. FAILURE MODES](#5-failure-modes)
- [6. RELATED](#6-related)

---

## 1. SCENARIO

Validate that `skill_advisor.py --stdin` reads exactly one prompt from stdin and still routes through native-first compatibility.

---

## 2. SETUP

- Repo root is the working directory.
- Python 3 is available.
- Native build exists; fallback is acceptable only when native status is unavailable.

---

## 3. STEPS

1. Run:

```bash
printf '%s' "save this conversation context to memory" | python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --stdin --threshold 0.8
```

2. Repeat with native required:

```bash
printf '%s' "save this conversation context to memory" | python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --stdin --force-native --threshold 0.8
```

---

## 4. EXPECTED

- Output is a JSON array.
- Native path entries include `source: "native"` when native is available.
- Top skill for the prompt is `system-spec-kit`.
- Prompt text is not echoed into metadata fields.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Empty stdin ignored | Result routes argv or errors unexpectedly | Check stdin mode parser. |
| Native required fails | JSON error says native unavailable | Run `advisor_status`; if unavailable, record environment blocker. |
| Prompt leak | Prompt literal appears outside expected command transcript | Block release. |

---

## 6. RELATED

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat/shim.vitest.ts`
