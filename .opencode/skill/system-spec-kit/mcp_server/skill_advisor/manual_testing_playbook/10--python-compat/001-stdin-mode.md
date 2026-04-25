---
title: "PC-001 Python Shim --stdin Round-Trip"
description: "Manual validation that skill_advisor.py reads exactly one prompt from stdin, routes through native-first compatibility, and returns the legacy JSON-array shape."
trigger_phrases:
  - "pc-001"
  - "python shim stdin"
  - "skill_advisor.py stdin"
  - "compat shim stdin"
---

# PC-001 Python Shim --stdin Round-Trip

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `scripts/skill_advisor.py --stdin` reads exactly one prompt from stdin, delegates to the native advisor when available, and emits the legacy JSON-array shape that pre-027 consumers expect.

---

## 2. SETUP

- Repo root; Python 3 available.
- MCP server built so the native daemon can be probed.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` unset.

---

## 3. STEPS

1. Run the shim with a prompt piped into stdin:

```bash
printf '%s' "save this conversation context to memory" | python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --stdin --threshold 0.8
```

2. Inspect the JSON-array output.
3. Repeat with an empty stdin (just `printf ''`) and record the error or empty-array behavior.

---

## 4. EXPECTED

- Output is a JSON array (not a wrapped envelope).
- First element has `source: "native"` when native is available.
- Top entry corresponds to the expected skill slug for the prompt.
- Empty stdin is handled deterministically (either empty array or an explicit error, not a crash).

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Shim reads argv instead of stdin | Output mirrors argv prompt | Inspect `--stdin` parser. |
| JSON shape mismatch | Output is envelope, not array | Audit shim's legacy-shape adapter. |
| Prompt echoed in metadata | Prompt substring appears in fields outside expected output | Block release as privacy failure. |

---

## 6. RELATED

- Scenario [CP-001](../03--compat-and-disable/001-python-shim-stdin.md) — original shim stdin scenario.
- Scenario [PC-002](./002-force-native-force-local.md) — force toggles.
- Feature [`08--python-compat/01-cli-shim.md`](../../feature_catalog/08--python-compat/01-cli-shim.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`.
