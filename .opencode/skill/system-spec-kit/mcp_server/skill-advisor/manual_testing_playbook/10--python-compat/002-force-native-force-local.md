---
title: "PC-002 --force-native and --force-local Toggles"
description: "Manual validation that --force-native requires the native advisor and fails when unavailable, and that --force-local bypasses delegation and uses Python scoring."
trigger_phrases:
  - "pc-002"
  - "force-native flag"
  - "force-local flag"
  - "compat force toggles"
---

# PC-002 --force-native and --force-local Toggles

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate `--force-native` (requires native; fails if unavailable) and `--force-local` (bypasses native; uses Python scorer in `skill_advisor_runtime.py`).

---

## 2. SETUP

- Repo root; Python 3 available.
- MCP server built (native available).
- Ability to disable native via `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to simulate unavailability for the `--force-native` failure branch.

---

## 3. STEPS

1. Run native-required:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --force-native "save this conversation context to memory" --threshold 0.8
```

2. Run local-forced:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --force-local "save this conversation context to memory" --threshold 0.8
```

3. Disable native and re-run `--force-native`:

```bash
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --force-native "save this conversation context to memory"
```

---

## 4. EXPECTED

- Step 1 output: entries tagged `source: "native"`.
- Step 2 output: entries tagged `source: "local"` (Python scorer).
- Step 3: exits non-zero or emits explicit "native unavailable" error (not a silent fallback).
- No prompt text in unexpected metadata fields.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| --force-native silently falls back | Entries show `source: "local"` when native was required | Block release; force toggle contract broken. |
| --force-local uses native | Entries show `source: "native"` | Inspect shim delegation guard. |
| Source tag missing | Neither `"native"` nor `"local"` in response | Audit legacy-shape adapter. |

---

## 6. RELATED

- Scenario [CP-002](../03--compat-and-disable/002-force-local-force-native.md) — original toggles scenario.
- Scenario [PC-003](./003-threshold-flag.md) — threshold flag.
- Feature [`08--python-compat/01-cli-shim.md`](../../feature_catalog/08--python-compat/01-cli-shim.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py` and `scripts/skill_advisor_runtime.py`.
